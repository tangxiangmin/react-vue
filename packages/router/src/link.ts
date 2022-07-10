import {h, reactive, VNode} from "@shymean/react-vue";

import {push} from "./history";

let timer
const linkHandler = (e, url) => {
  e.preventDefault()
  clearTimeout(timer)
  timer = setTimeout(() => {
    push(url)
  })
}

export const Link = (props: any) => {
  return () => {
    let {href, children = []} = props
    return h('a', {
      ...props,
      onClick: (e) => linkHandler(e, href)
    }, children)
  }
}
