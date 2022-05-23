import { VNode} from "./h";
import {mount} from "./mount";
import {patch} from "./patch";


function render(oldVNode: VNode | undefined, newVNode: VNode, parent: Element) {
  if (!oldVNode) {
    mount(newVNode, parent)
  } else {
    patch(oldVNode,newVNode,parent)
  }
}

export function createApp(vNode: VNode) {

  return {
    mount(container: Element) {
      render(undefined, vNode, container)
    }
  }
}
