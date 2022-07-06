import {h, VNode} from "./h";
import {mount} from "./mount";
import {patch} from "./patch";
import {hydrate} from './hydrate'

function render(oldVNode: VNode | undefined, newVNode: VNode, parent: Element) {
  if (!oldVNode) {
    mount(newVNode, parent)
  } else {
    patch(oldVNode, newVNode, parent)
  }
}

function clearContainer(dom: Element) {
  Array.from(dom.children).forEach(child => {
    dom.removeChild(child)
  })
}

export function createApp(node:VNode) {
  return {
    mount(container: HTMLElement) {
      clearContainer(container)
      render(undefined, node, container)
    },
    // ssr
    hydrate(container: HTMLElement) {
      let success = hydrate(node, container)
      if (!success) {
        this.mount(container)
      }
    }
  }
}
