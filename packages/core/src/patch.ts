// 参考inferno patch
import {NODE_YPE, VNode} from "./h";
import {mount, unmount} from "./mount";


function isSameNode(lastVNode: VNode, nextVNode: VNode) {
  return lastVNode.type === nextVNode.type
}

function patchText(lastVNode: VNode, nextVNode: VNode) {
  const nextText = nextVNode.type as string;
  const dom = (nextVNode.$el = lastVNode.$el);

  (dom as Element).nodeValue = nextText;
}

function patchElement(lastVNode: VNode, nextVNode: VNode) {
  const dom = (nextVNode.$el = lastVNode.$el as Element);
  const lastProps = lastVNode.props;
  const nextProps = nextVNode.props;

  // todo update props

  patchChildren(lastVNode.children, nextVNode.children, dom)
}

function patchComponent(lastVNode: VNode, nextVNode: VNode) {


  console.log('patchComponent')
}

export function patch(lastVNode: VNode | undefined, nextVNode: VNode, parentDOM: Element,) {
  if (!lastVNode || !isSameNode(lastVNode, nextVNode)) {
    lastVNode && unmount(lastVNode, parentDOM)

    mount(nextVNode, parentDOM)
    return
  }

  switch (nextVNode.nodeType) {
    case NODE_YPE.TEXT:
      patchText(lastVNode, nextVNode)
      break
    case NODE_YPE.HTML_TAG:
      patchElement(lastVNode, nextVNode)
      break
    case NODE_YPE.COMPONENT:
      patchComponent(lastVNode, nextVNode)
      break
  }
}

// 暂时只实现最基础的diff算法
function patchChildren(lastChildren: VNode[], nextChildren: VNode[], parentDOM: Element) {
  let i = 0
  for (; i < lastChildren.length; ++i) {
    let lastVNode = lastChildren[i]
    let nextVNode = nextChildren[i]
    if (nextVNode) {
      patch(lastVNode, nextVNode, parentDOM)
    } else {
      unmount(lastVNode, parentDOM)
    }
  }

  for (; i < nextChildren.length; ++i) {
    let nextVNode = nextChildren[i]
    patch(undefined, nextVNode, parentDOM)
  }
}

