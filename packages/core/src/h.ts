import {flattenArray, isNullOrUndef} from './util'
import {EffectScope} from "@vue/reactivity";

export interface IComponent {
  id: number,
  props: any,
  render: Function,
  vNode: VNode,
  scope: EffectScope

  update: Function,

  // 生命周期函数
  m: Function[] | null
  um: Function[] | null,
  u: Function[] | null
}


export interface VNode {
  type: string | Function,
  nodeType: NODE_YPE,
  props: { [prop: string]: any },
  children: any[],
  key: undefined | number | string;
  text?: any;

  $el?: Element | HTMLElement | Text | null,
  $instance?: IComponent | undefined,
  $sibling?: VNode, // 下一个节点
  $parent?: VNode  // 父节点
}


const textType = Symbol("__text")

export enum NODE_YPE {
  DEFAULT,
  TEXT= 'text',
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
    children,
    nodeType: NODE_YPE.DEFAULT,
    key: isNullOrUndef(props) ? undefined : props.key,
  }

  node.nodeType = getNodeType(node)
  node.props.children = children

  const list = flattenArray(children)
  let prev: VNode
  node.children = list.map(child => {
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
    if (prev) {
      prev.$sibling = result
    }

    prev = result
    result.$parent = node

    return result
  })

  return node
}
