import {NODE_YPE, VNode} from './h'
import {createAttrs, mount} from "./mount";

let isHydrate = false

function startHydrate() {
  isHydrate = true
}

function stopHydrate() {
  isHydrate = false
}

export function isHydrateProcessing() {
  return isHydrate
}

// 遍历虚拟DOM和真实DOM
function walk(node: VNode, dom: any): Boolean {
  if (!node && !dom) return true
  if (!node || !dom) return false

  // 处理组件
  while (node.nodeType === NODE_YPE.COMPONENT) {
    // @ts-ignore
    node = node.$instance?.child
  }

  // 处理文本节点
  if (node.nodeType === NODE_YPE.TEXT && dom.nodeType === 3) {
    node.$el = dom
    return true
  }

  // 处理元素节点
  if (node.type !== dom.tagName.toLowerCase()) return false

  node.$el = dom // 复用已经渲染的DOM节点
  createAttrs(dom, node.props)

  if (node.props.dangerouslySetInnerHTML) return true // 如果子节点是通过dangerouslyInnerHTML设置的，则直接跳过后续工作

  let children = node.children
  let domList = dom.childNodes
  // FIXME 需要处理文本节点合并导致长度不一致的问题
  if (children.length !== domList.length) {
    return false
  }

  for (let i = 0; i < children.length; ++i) {
    if (!walk(children[i], domList[i])) {
      return false
    }
  }
  return true
}

export function hydrate(root: VNode, dom: HTMLElement) {
  startHydrate()
  mount(root, {} as Element) // 获取完整的虚拟DOM树
  stopHydrate()
  return walk(root, dom.children[0])
}

