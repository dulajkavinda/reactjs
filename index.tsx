import {
  PromiseFunction,
  SetState,
  VDOMAttributes,
  VDOMElement,
  VDomNode,
} from "./types";

let React = {
  createElement: (
    tag: string | Function,
    props: VDOMAttributes & { key: string },
    ...childeren: VDomNode[]
  ): VDOMElement => {
    if (typeof tag === "function") {
      try {
        return tag();
      } catch ({ promise, key }) {
        promise.then((data) => {
          promiseCache.set(key, data);
          rerender();
        });
        return {
          kind: "element",
          tagname: "div",
          props: {
            children: "Loading...",
          },
          childeren: [],
          key: props.key,
        };
      }
    }
    const element: VDOMElement = {
      kind: "element",
      tagname: tag,
      props,
      childeren,
      key: props.key,
    };

    return element;
  },
};

const states: any[] = [];
let cursor = 0;

function render(reactElement: VDOMElement, container: HTMLElement): void {
  if (["string", "number"].includes(typeof reactElement)) {
    container.appendChild(document.createTextNode(String(reactElement)));
    return;
  }

  const actualDomElement = document.createElement(reactElement.tagname);

  if (reactElement.props) {
    Object.keys(reactElement.props)
      .filter((key) => key !== "children")
      .forEach((key) => (actualDomElement[key] = reactElement.props[key]));
  }

  if (reactElement.childeren) {
    reactElement.childeren.forEach((child: VDOMElement) =>
      render(child, actualDomElement)
    );
  }

  container.appendChild(actualDomElement);
}

function rerender(): void {
  cursor = 0;
  document.querySelector("#app").firstChild.remove();
  render(<App />, document.querySelector("#app"));
}

function useState<T>(initialValue: T): [T, SetState<T>] {
  const FROZEN_CURSOR = cursor;
  if (states[FROZEN_CURSOR] === undefined) {
    states[FROZEN_CURSOR] = initialValue;
  }

  const setState: SetState<T> = (newValue: T) => {
    states[FROZEN_CURSOR] = newValue;
    rerender();
  };

  return [states[FROZEN_CURSOR] as T, setState];
}

const promiseCache = new Map<string, Promise<unknown>>();

function createDataSources<T>(
  promise: PromiseFunction<T>,
  key: string
): Promise<T> | void {
  if (promiseCache.has(key)) {
    return promiseCache.get(key) as Promise<T>;
  }

  throw { promise: promise(), key };
}

function App() {
  const [name, setName] = useState<string>("person");

  const dogPhotosUrl = createDataSources(
    () =>
      fetch("https://dog.ceo/api/breeds/image/random")
        .then((res) => res.json())
        .then((data) => data.message),
    "dogPhotos"
  );

  return (
    <div className="hello-classname">
      <h1>Hello, {name}</h1>
      <input
        value={name}
        onchange={(e) => {
          setName(e.target.value);
        }}
        placeholder="name"
      />
      <img alt="Doggos" src={dogPhotosUrl} />
      <p>Hello, from P!</p>
    </div>
  );
}

render(<App />, document.querySelector("#app"));
