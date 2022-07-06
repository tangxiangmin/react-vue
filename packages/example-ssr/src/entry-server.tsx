import {h, reactive, createApp, renderHTML} from "@shymean/react-vue"

import {App} from "./main";

export function render(url: string) {
  // @ts-ignore
  return renderHTML(<App url={url}/>)
}
