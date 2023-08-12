export type VDOMAttributes = {
  [_: string]: string | number | boolean | Function;
};

export interface VDOMElement {
  kind: "element";
  tagname: string;
  childeren?: VDomNode[];
  props?: VDOMAttributes;
  key: string | number;
}

export interface VDOMText {
  kind: "text";
  value: string;
  key: string | number;
}

export type VDomNode = VDOMText | VDOMElement;

export type SetState<T> = (newValue: T) => void;
