import {flattenArray, isNullOrUndef} from './util'
import {EffectScope} from "@vue/reactivity";

export interface IComponent {
  id: number,
  props: any,
  render: Function,
  child?: VNode,
  scope: EffectScope

  update: Function,

  // 生命周期函数
  m: Function[] | null
  um: Function[] | null,
  u: Function[] | null
}


export interface VNode {
  type: string | Function,
  props: { [prop: string]: any },
  children: any[],
  nodeType?: NODE_YPE,
  key: undefined | number | string;
  text?: any;

  $el?: Element | HTMLElement | Text | null,
  $instance?: IComponent | undefined,
  $sibling?: VNode //下一个节点
}


const textType = Symbol("__text")

export enum NODE_YPE {
  TEXT,
  HTML_TAG,
  COMPONENT
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
    children,
    key: isNullOrUndef(props) ? undefined : props.key,
  }

  node.nodeType = getNodeType(node)
  node.props.children = children

  const list = flattenArray(children)
  let prev: VNode
  node.children = list.map(child => {
    const nodeType = getNodeType(child)
    let node
    if (nodeType === NODE_YPE.TEXT) {
      node = {
        type: textType,
        nodeType,
        text: child,
      }
    } else {
      child.nodeType = nodeType
      node = child
    }
    if (prev) {
      prev.$sibling = node
    }

    prev = node

    return node
  })

  return node
}
