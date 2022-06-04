// 参考inferno patch
import {IComponent, NODE_YPE, VNode} from "./h";
import {
  mount,
  unmount,
  normalizeEventName,
  isEventProp,
  moveVNode
} from "./mount";
import {isNullOrUndef} from "./util";


function isSameNode(lastVNode: VNode, nextVNode: VNode) {
  return lastVNode?.type === nextVNode?.type
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

// 参考inferno 实现的diff
// https://github.com/NervJS/nerv/issues/3
function patchChildren(lastChildren: VNode[], nextChildren: VNode[], parentDOM: Element) {

  let aNode: VNode = lastChildren[0];
  let bNode: VNode = nextChildren[0];
  if (aNode?.key && bNode?.key) {
    patchKeyedChildren(lastChildren, nextChildren, parentDOM)
  } else {
    patchNonKeyedChildren(lastChildren, nextChildren, parentDOM);
  }
}

function patchNonKeyedChildren(lastChildren: VNode[], nextChildren: VNode[], parentDOM: Element) {
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


function patchKeyedChildren(lastChildren: VNode[], nextChildren: VNode[], parentDOM: Element) {
  const lastLength = lastChildren.length | 0;
  const nextLength = nextChildren.length | 0;
  let aEnd = lastLength - 1;
  let bEnd = nextLength - 1;
  let j: number = 0;
  let aNode: VNode = lastChildren[j];
  let bNode: VNode = nextChildren[j];

  // 首尾对比相同key的节点，缩小改动范围
  outer: {
    // 从头向后
    while (aNode.key === bNode.key) {
      patch(aNode, bNode, parentDOM);
      lastChildren[j] = bNode;
      ++j;
      if (j > aEnd || j > bEnd) {
        break outer;
      }
      aNode = lastChildren[j];
      bNode = nextChildren[j];
    }

    aNode = lastChildren[aEnd];
    bNode = nextChildren[bEnd];

    // 从后向前
    while (aNode.key === bNode.key) {
      patch(aNode, bNode, parentDOM);
      lastChildren[aEnd] = bNode;
      aEnd--;
      bEnd--;
      if (j > aEnd || j > bEnd) {
        break outer;
      }
      aNode = lastChildren[aEnd];
      bNode = nextChildren[bEnd];
    }
  }

  if (j > aEnd) {
    while (j <= bEnd) {
      mount(nextChildren[j++], parentDOM);
    }
  } else if (j > bEnd) {
    while (j <= aEnd) {
      unmount(lastChildren[j++], parentDOM);
    }
  } else {
    // 缩小范围后，再处理那些要移动的节点
    lastChildren = lastChildren.slice(j, aEnd + 1)
    nextChildren = nextChildren.slice(j, bEnd + 1)
    patchKeyedChildrenComplex(lastChildren, nextChildren, parentDOM);
  }
}

function patchKeyedChildrenComplex(lastChildren: VNode[], nextChildren: VNode[], parentDOM: Element) {
  let keyIndex: Record<string, number> = nextChildren.reduce((acc, child, index) => {
    const key = child.key as string
    acc[key] = index
    return acc
  }, {} as { [key: string]: number })

  let sources = new Int32Array(nextChildren.length);
  lastChildren.forEach((child, index) => {
    const key = child.key as string
    if (!(key in keyIndex)) {
      unmount(child, parentDOM)
      return
    }
    // 旧节点在新列表中的位置
    let idx = keyIndex[key]
    sources[idx] = index + 1 // +1用来区分原本的占位0
  })

  // 找到最长升序子序列找到，这样就可以将需要移动的节点数量控制在最少
  const seq = lis_algorithm(sources);
  let j = seq.length - 1;

  // 从后向前遍历source，找到需要新增的节点，0表示新增
  // 从后向前是为了使用insertBefore
  for (let i = sources.length - 1; i >= 0; --i) {
    if (sources[i] === 0) {
      let child = nextChildren[i - 1]
      mount(child, parentDOM)
      continue
    }

    const nextChild = nextChildren[i]
    const oldChild = lastChildren[sources[i] - 1]
    patch(oldChild, nextChild, parentDOM)

    if (j < 0 || i !== seq[j]) {
      // 需要移动
      moveVNode(nextChild, parentDOM)
    } else {
      j--
    }
  }
}

let result: Int32Array;
let p: Int32Array;
let maxLen = 0;

// 最长上升子序列算法
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(arr: Int32Array): Int32Array {
  let arrI = 0;
  let i = 0;
  let j = 0;
  let k = 0;
  let u = 0;
  let v = 0;
  let c = 0;
  const len = arr.length;

  if (len > maxLen) {
    maxLen = len;
    result = new Int32Array(len);
    p = new Int32Array(len);
  }

  for (; i < len; ++i) {
    arrI = arr[i];

    if (arrI !== 0) {
      j = result[k];
      if (arr[j] < arrI) {
        p[i] = j;
        result[++k] = i;
        continue;
      }

      u = 0;
      v = k;

      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }

      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }

  u = k + 1;
  const seq = new Int32Array(u);
  v = result[u - 1];

  while (u-- > 0) {
    seq[u] = v;
    v = p[v];
    result[u] = 0;
  }

  return seq;
}

