import {NODE_YPE, VNode} from './h'
import {isEventProp, isFilterProp} from "./host";
import {mount} from "./mount";

// 在ssr中，我们需要的不是DOM节点，而是HTML字符串，

function VNode2HTML(root: VNode): string {
  if (!root) return ''
  let {type, nodeType, props, children} = root

  let sub = '' // 获取子节点渲染的html片段
  Array.isArray(children) && children.forEach(child => {
    sub += VNode2HTML(child)
  })

  let el = '' // 当前节点渲染的html片段

  switch (nodeType) {
    case NODE_YPE.HTML_TAG:
      let attrs = ''
      for (let key in props) {
        if (key === 'dangerouslySetInnerHTML') {
          sub += props[key].__html
        } else {
          attrs += getAttr(key, props[key])
        }
      }
      el += `<${type}${attrs}>${sub}</${type}>` // 将子节点插入当前节点
      break
    case NODE_YPE.TEXT:
      el += type // 纯文本节点则直接返回
      break;

    case NODE_YPE.COMPONENT:
      if (root.$instance) {
        sub += VNode2HTML(root.$instance.child as VNode)
      }
      el += sub

      break
  }

  return el

  function getAttr(prop: string, val: any) {
    if (isFilterProp(prop)) return ''
    // 渲染HTML，我们不需要 事件 等props，而是在hydrate阶段重新设置属性
    return isEventProp(prop) ? '' : ` ${prop}="${val}"`
  }
}

function renderHTML(root: VNode): string {
  // 首先将调用diff获取初始化组件节点，获取完整的节点树
  mount(root, {} as Element)
  return VNode2HTML(root)
}

export {
  renderHTML
}
