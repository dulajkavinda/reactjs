import { SetState, VDOMAttributes, VDOMElement, VDomNode } from "./types";

let React = {
  createElement: (
    tag: string | Function,
    props: VDOMAttributes & { key: string },
    ...childeren: VDomNode[]
  ): VDOMElement => {
    if (typeof tag === "function") {
      return tag();
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

function App() {
  const [name, setName] = useState<string>("person");

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
      <p>Hello, from P!</p>
    </div>
  );
}

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

render(<App />, document.querySelector("#app"));
