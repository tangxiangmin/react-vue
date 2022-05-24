import {flattenArray} from './util'

export interface VNode {
  type: string | Function,
  props: { [prop: string]: any },
  children: any[],
  nodeType?: NODE_YPE,

  $parent?: VNode | undefined
  $el?: Element | HTMLElement | Text | undefined,
}


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
    props,
    children
  }

  node.nodeType = getNodeType(node)

  node.children = flattenArray(children).map(child => {
    const nodeType = getNodeType(child)
    if (nodeType === NODE_YPE.TEXT) {
      return {
        type: child,
        $parent: node,
        nodeType
      }
    }
    child.nodeType = nodeType
    child.$parent = node
    return child
  })

  return node
}
