function isFilterProp(prop: string): boolean {
  let blackList = ['key', 'children', 'context']
  return blackList.includes(prop)
}

function isEventProp(prop: string): boolean {
  return prop.indexOf('on') === 0
}

function normalizeEventName(name: string) {
  return name.slice(2).toLowerCase();
}

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
  setAttribute(dom: Element, prop: string, lastValue: any, nextValue: any) {
    if (isFilterProp(prop)) return
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
}

// const otherPlatform = {}

// 预留其他平台的钩子

export default dom
