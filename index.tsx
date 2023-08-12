let React = {
  createElement: (tag: any, props: any, ...children: any) => {
    if (typeof tag === "function") {
      return tag();
    }
    const element = { tag, props: { ...props, children } };
    return element;
  },
};

const states = [];
let cursor = 0;

const useState = (initialValue: any) => {
  const FROZEN_CURSOR = cursor;
  states[FROZEN_CURSOR] = states[FROZEN_CURSOR] || initialValue;
  const setState = (newValue: any) => {
    states[FROZEN_CURSOR] = newValue;
    rerender();
  };
  return [states[FROZEN_CURSOR], setState];
};

const App = () => {
  const [name, setName] = useState("person");

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
};

const render = (reactElement: any, container: any) => {
  if (["string", "number"].includes(typeof reactElement)) {
    container.appendChild(document.createTextNode(String(reactElement)));
    return;
  }

  const actualDomElement = document.createElement(reactElement.tag);

  if (reactElement.props) {
    Object.keys(reactElement.props)
      .filter((key) => key !== "children")
      .forEach((key) => (actualDomElement[key] = reactElement.props[key]));
  }

  if (reactElement.props.children) {
    reactElement.props.children.forEach((child: any) =>
      render(child, actualDomElement)
    );
  }

  container.appendChild(actualDomElement);
};

const rerender = () => {
  cursor = 0;
  document.querySelector("#app").firstChild.remove();
  render(<App />, document.querySelector("#app"));
};

render(<App />, document.querySelector("#app"));
