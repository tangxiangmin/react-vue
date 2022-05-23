import {NODE_YPE, VNode} from "./h";
import {effect} from "./reactive";
import {patch} from './patch'


function isEventProp(prop: string): boolean {
  return prop.indexOf('on') === 0
}

function createAttrs(dom: HTMLElement, props: any) {
  if (!props) return
  Object.keys(props).forEach(prop => {
    if (isEventProp(prop)) {
      let eventName = prop.slice(2).toLowerCase()
      dom.addEventListener(eventName, props[prop])
    }
  })
}

// 将vNode挂载到页面上
export function mount(newVNode: VNode, parentDOM: Element) {
  switch (newVNode.nodeType) {
    case NODE_YPE.TEXT:
      mountText(newVNode, parentDOM)
      break
    case NODE_YPE.HTML_TAG:
      mountElement(newVNode, parentDOM)
      break
    case NODE_YPE.COMPONENT:
      mountComponent(newVNode, parentDOM)
      break
  }
}

// 将vNode对应的dom从页面移除
export function unmount(lastVNode: VNode, parentDOM: Element) {
  if (lastVNode) {
    parentDOM.removeChild(lastVNode.$el as Element)
  }
}


function mountText(nextVNode: VNode, parentDOM: Element) {
  const text = document.createTextNode(nextVNode.type as string)
  nextVNode.$el = text
  parentDOM.appendChild(text)
}

function mountElement(nextVNode: VNode, parentDOM: Element) {
  const {type, props, children} = nextVNode
  const dom = document.createElement(type as string)
  createAttrs(dom, props)

  children.forEach(child => {
    mount(child, dom)
  })
  nextVNode.$el = dom
  parentDOM.appendChild(dom)
}

function mountComponent(nextVNode: VNode, parentDOM: Element) {
  const {type, props} = nextVNode
  // todo 处理props变化的情况
  const render = (type as Function)(props)

  let last: VNode
  // 收集render方法中的依赖，注册回调
  effect(() => {
    const child = render()
    patch(last, child, parentDOM)
    last = child
  }, {lazy: false})
}