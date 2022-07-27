import {flattenArray, isNullOrUndef} from './util'
import {EffectScope} from "@vue/reactivity";

export interface IComponent {
  id: number,
  props: any,
  render: Function,
  vNode: VNode,
  scope: EffectScope

  update: Function,
  provides: Record<string, unknown>,
  parent: IComponent | null,
  slots: VNode[]

  // 生命周期函数
  m: Function[] | null
  um: Function[] | null,
  u: Function[] | null
}

export interface IComponentContext {
  instance: IComponent
}


export interface VNode {
  type: string | Function,
  nodeType: NODE_YPE,
  props: { [prop: string]: any },
  key: undefined | number | string;

  children: VNode[],
  text?: any;

  $el?: Element | HTMLElement | Text | null,

  $instance?: IComponent | undefined,
  $sibling?: VNode, // 下一个节点
  $parent?: VNode  // 父节点
}


const textType = Symbol("__text")

export enum NODE_YPE {
  DEFAULT,
  TEXT = 'text',
  HTML_TAG = 'html',
  COMPONENT = 'component'
}

function getNodeType(node: VNode): NODE_YPE {
  if (typeof node !== 'object') return NODE_YPE.TEXT

  const {type} = node
  return typeof type === 'function' ? NODE_YPE.COMPONENT : NODE_YPE.HTML_TAG
}

export function h(type: any, props: any, ...children: any[]): VNode {
  const node: VNode = {
    type,
    props: isNullOrUndef(props) ? {} : props,
    children: [],
    nodeType: NODE_YPE.DEFAULT,
    key: isNullOrUndef(props) ? undefined : props.key,
  }

  node.nodeType = getNodeType(node)

  const list = flattenArray(children)


  node.children = list.map(child => {
    if (child.nodeType) return child
    const nodeType = getNodeType(child)
    let result
    if (nodeType === NODE_YPE.TEXT) {
      result = {
        type: textType,
        nodeType,
        text: child,
      }
    } else {
      child.nodeType = nodeType
      result = child
    }

    return result
  })

  bindVNode(node)

  return node
}

export function bindVNode(parent: VNode) {
  let prev: VNode
  const {children} = parent
  children.forEach(child => {
    child.$parent = parent
    if (prev) {
      prev.$sibling = child
    }
    prev = child
  })
}
