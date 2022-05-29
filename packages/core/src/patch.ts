// 参考inferno patch
import {IComponent, NODE_YPE, VNode} from "./h";
import {mount, unmount, normalizeEventName, isEventProp} from "./mount";
import {isNullOrUndef} from "./util";


function isSameNode(lastVNode: VNode, nextVNode: VNode) {
  return lastVNode.type === nextVNode.type
}

function patchProp(prop: string, lastValue: any, nextValue: any, dom: Element) {
  if (prop === 'dangerouslySetInnerHTML') {
    if (lastValue !== nextValue) {
      dom.innerHTML = nextValue.__html;
    }
  } else if (isEventProp(prop)) {
    const eventName = normalizeEventName(prop)
    if (lastValue) {
      dom.removeEventListener(eventName, lastValue)
    }
    dom.addEventListener(eventName, nextValue)
  } else {
    if (prop === 'className') prop = 'class'
    dom.setAttribute(prop, nextValue)
  }
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

  // update props
  for (const prop in nextProps) {
    const lastValue = lastProps[prop]
    const nextValue = nextProps[prop]
    if (lastValue !== nextValue) {
      patchProp(prop, lastValue, nextValue, dom)
    }
  }

  for (const prop in lastProps) {
    const lastValue = lastProps[prop]
    if (isNullOrUndef(nextProps[prop]) && !isNullOrUndef(lastValue)) {
      patchProp(prop, lastValue, null, dom)
    }
  }


  patchChildren(lastVNode.children, nextVNode.children, dom)
}

function patchComponent(lastVNode: VNode, nextVNode: VNode) {
  const $instance = lastVNode.$instance as IComponent
  nextVNode.$instance = $instance

  const lastProps = $instance.props
  const nextProps = nextVNode.props

  // $instance props是响应的，变化后会触发render
  for (const prop in nextProps) {
    const lastValue = lastProps[prop]
    const nextValue = nextProps[prop]
    if (lastValue !== nextValue) {
      lastProps[prop] = nextProps[prop]
    }
  }

  for (const prop in lastProps) {
    const lastValue = lastProps[prop]
    if (isNullOrUndef(nextProps[prop]) && !isNullOrUndef(lastValue)) {
      delete lastProps[prop]
    }
  }
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

