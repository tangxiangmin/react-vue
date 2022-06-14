import {IComponent, NODE_YPE, VNode} from "./h";
import {effect, reactive} from "./reactive";
import {patch} from './patch'
import host from './host'

function createAttrs(dom: HTMLElement, props: any) {
  if (!props) return
  Object.keys(props).forEach(key => {
    host.setAttribute(dom, key, null, props[key])
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
export function unmount(lastVNode: VNode) {
  if (lastVNode?.$el) {
    host.remove(lastVNode.$el as Element)
  }
}

function mountText(nextVNode: VNode, parentDOM: Element) {
  const text = host.createText(nextVNode.type as string)
  nextVNode.$el = text

  const anchor = nextVNode.$sibling?.$el as Element
  host.insert(text, parentDOM, anchor)
}

function mountElement(nextVNode: VNode, parentDOM: Element) {
  const {type, props, children} = nextVNode
  const dom = host.createElement(type as string)
  createAttrs(dom, props)

  children.forEach(child => {
    mount(child, dom)
  })
  nextVNode.$el = dom

  const anchor = nextVNode.$sibling?.$el as Element
  host.insert(dom, parentDOM, anchor)
}

function mountComponent(nextVNode: VNode, parentDOM: Element) {
  // 监听props的变化
  const props = reactive(nextVNode.props)

  // 创建组件
  const render = (nextVNode.type as Function)(props)

  nextVNode.$instance = {props, render} as IComponent

  let last: VNode
  // 收集render方法中的依赖，注册回调
  effect(() => {
    const child = render()
    patch(last, child, parentDOM)
    last = child
  }, {lazy: false})
}

export function moveVNode(vNode: VNode, parentDOM: Element) {
  const anchor = vNode.$sibling?.$el as Element
  host.insert(vNode.$el as Element, parentDOM, anchor)
}
