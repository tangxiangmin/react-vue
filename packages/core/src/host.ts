const dom = {
  insert(child: Text | Element, parent: Element, anchor: Element | null) {
    if (anchor) {
      parent.insertBefore(child, anchor)
    } else {
      parent.appendChild(child)
    }
  },
  remove(child: Element) {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },
  createText(content: string) {
    return document.createTextNode(content)
  },
  createElement(type: string) {
    return document.createElement(type)
  },
  setStaticContent(parent: Element, content: string) {
    parent.innerHTML = content
  }
}
// const flutter = {}

// 预留其他平台的钩子

export default dom
