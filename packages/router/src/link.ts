import {h} from "@shymean/react-vue";

import {push} from "./history";

let timer: number

const linkHandler = (e: Event, url: string) => {
  e.preventDefault()
  clearTimeout(timer)
  timer = setTimeout(() => {
    push(url)
  })
}

type LinkProps = {
  href: string,
  [prop: string]: any,
}

export const Link = (props: LinkProps, {instance}) => {
  const onClick = (e: Event) => linkHandler(e, props.href)

  return () => {
    return h('a', {
      ...props,
      onClick: onClick
    }, instance.slots || [])
  }
}
