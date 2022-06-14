
type Key = string | number;

interface ReactElement<P = any, T = any> {
  type: T;
  props: P;
  key: Key | null;
}

interface CustomFunctionComponent {
  (): JSX.Element | null
}

declare global {
  namespace JSX {
    type Element = ReactElement | CustomFunctionComponent

    interface ElementClass {
      (prop: any): any
    }

    interface IntrinsicElements {
      [prop: string]: any
    }
  }
}


// @ts-ignore
export default {}
