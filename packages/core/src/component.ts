import {IComponent, NODE_YPE, VNode} from "./h";
import {EffectScope, ReactiveEffect, shallowReactive} from "./reactive";
import {queueJob, queuePostJob} from "./scheduler";
import {patch} from "./patch";

export let currentInstance: IComponent | null = null

let uid = 1
const noopRender = () => {
}

export function createComponentInstance(vNode: VNode): IComponent {
  const props = vNode.props
  // 监听props的变化
  const reactiveProps = shallowReactive(props)
  const scope = new EffectScope(true)
  const render = noopRender

  const instance = {
    id: uid++,
    props: reactiveProps,
    render,
    scope,
    vNode,

    update: () => {
    },

    m: null,
    um: null,
    u: null,
  }

  currentInstance = instance

  return instance
}


function queueHooks(hooks: Function[] | null) {
  if (Array.isArray(hooks)) {
    hooks.forEach(job => {
      queuePostJob(job)
    })
  }
}

function findParentDom(node: VNode) {
  while (node && node.nodeType !== NODE_YPE.HTML_TAG) {
    node = node.$parent as VNode
  }
  return node && node.$el
}

export function setupRenderEffect(nextVNode: VNode, parentDOM: Element) {
  const instance = nextVNode.$instance as IComponent
  const {render} = instance
  let last: VNode
  const componentUpdateFn = () => {
    if (!last) {
      queueHooks(instance.m)
    } else {

      queueHooks(instance.u)
    }

    const child = render()
    patch(last, child, parentDOM || findParentDom(nextVNode))
    last = child

    if (instance) {
      instance.vNode.children = [child]
    }
  }

  const effect = new ReactiveEffect(
    componentUpdateFn,
    () => queueJob(instance.update as Function),
    // @ts-ignore
    nextVNode.$instance.scope
  )

  instance.update = () => effect.run()
  instance.update()
}


export function unmountComponent(instance: IComponent) {
  queueHooks(instance.um)
}
