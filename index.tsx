let React = {
  createElement: (tag: any, props: any, ...children: any) => {
    if (typeof tag === "function") {
      return tag();
    }
    const element = { tag, props: { ...props, children } };
    return element;
  },
};

const App = () => (
  <div className="hello-classname">
    <h1>Hello, Parent!</h1>
    <p>Hello, from P!</p>
  </div>
);

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

render(<App />, document.querySelector("#app"));
