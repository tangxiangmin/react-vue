type Key = string | number;

interface ReactElement<P = any, T = any> {
  type: T;
  props: P;
  key?: Key | null | undefined;
}

interface CustomFunctionComponent {
  (): JSX.Element | null
}

declare global {
  namespace JSX {
    type Element = ReactElement | CustomFunctionComponent | null

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
