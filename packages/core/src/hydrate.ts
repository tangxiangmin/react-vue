import {NODE_YPE, VNode} from './h'
import {createAttrs, mount} from "./mount";
import {getHost} from "./host";

let isHydrate = false

export function startHydrate() {
  isHydrate = true
}

export function stopHydrate() {
  isHydrate = false
}

export function isHydrateProcessing() {
  return isHydrate
}

// 遍历虚拟DOM和真实DOM
function walk(node: VNode, dom: any): Boolean {
  if (!node && !dom) return true
  if (!node && dom) return false

  // 处理组件
  while (node.nodeType === NODE_YPE.COMPONENT) {
    node = node.children[0]
  }
  if (!node) return false

  // 处理文本节点
  if (dom.nodeType === 3) {
    if (node.nodeType === NODE_YPE.TEXT) {
      node.$el = dom
      return true
    } else {
      return false
    }
  }

  // 处理元素节点
  if (node.type !== dom.tagName.toLowerCase()) return false

  node.$el = dom // 复用已经渲染的DOM节点
  createAttrs(dom, node.props)

  if (node.props.dangerouslySetInnerHTML) return true // 如果子节点是通过dangerouslyInnerHTML设置的，则直接跳过后续工作

  let children = node.children
  let domList: Element[] = Array.from(dom.childNodes)

  let i = 0
  let j = 0
  while (i < domList.length) {
    const child = children[j]
    const domNode = domList[i]
    j++

    // 需要处理文本节点合并导致长度不一致的问题
    if (child && child.nodeType === NODE_YPE.TEXT && domNode.nodeType !== 3) {
      child.$el = getHost().createText('')
      getHost().insert(child.$el, dom, domNode)
      continue
    }
    i++
    if (!walk(child, domNode)) {
      return false
    }
  }
  while (j < children.length) {
    const child = children[j]
    if (child && child.nodeType === NODE_YPE.TEXT) {
      child.$el = getHost().createText('')
      getHost().insert(child.$el, dom, null)

    } else {
      return false
    }
    j++
  }

  return true
}

export function hydrate(root: VNode, dom: HTMLElement) {
  startHydrate()
  mount(root, {} as Element) // 获取完整的虚拟DOM树
  stopHydrate()
  return walk(root, dom.children[0])
}

