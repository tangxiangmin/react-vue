import {IComponentContext, NODE_YPE, VNode} from "./h";
import {getHost} from './host'

import {createComponentInstance, setupRenderEffect, unmountComponent} from "./component";

export function createAttrs(dom: HTMLElement, props: any) {
  if (!props) return
  Object.keys(props).forEach(key => {
    getHost().setAttribute(dom, key, null, props[key])
  })
}

// 将vNode挂载到页面上
export function mount(newVNode: VNode, parentDOM: Element) {
  if (!newVNode) return
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
  if (!lastVNode) return
  const {nodeType, $instance} = lastVNode
  if (nodeType === NODE_YPE.COMPONENT) {
    if ($instance) {
      unmountComponent($instance)
      $instance.vNode.children.forEach(node => {
        unmount(node as VNode)
      })
    }
    return
  } else if (lastVNode?.$el) {
    getHost().remove(lastVNode.$el as Element)
  }
}

function mountText(nextVNode: VNode, parentDOM: Element) {
  const text = getHost().createText(nextVNode.text as string)
  nextVNode.$el = text

  const anchor = nextVNode.$sibling?.$el as Element
  getHost().insert(text, parentDOM, anchor)
}

function mountElement(nextVNode: VNode, parentDOM: Element) {
  const {type, props, children} = nextVNode
  const dom = getHost().createElement(type as string)
  createAttrs(dom, props)

  children.forEach(child => {
    mount(child, dom)
  })
  nextVNode.$el = dom

  const anchor = nextVNode.$sibling?.$el as Element
  getHost().insert(dom, parentDOM, anchor)
}

function mountComponent(nextVNode: VNode, parentDOM: Element) {

  // 创建组件
  nextVNode.$instance = createComponentInstance(nextVNode)
  const context: IComponentContext = {instance: nextVNode.$instance}

  nextVNode.$instance.render = (nextVNode.type as Function)(nextVNode.$instance.props, context)

  setupRenderEffect(nextVNode, parentDOM)
}

export function moveVNode(vNode: VNode, parentDOM: Element) {
  const anchor = vNode.$sibling?.$el as Element
  getHost().insert(vNode.$el as Element, parentDOM, anchor)
}
