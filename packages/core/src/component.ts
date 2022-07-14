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

  const parent = currentInstance
  const instance = {
    id: uid++,
    props: reactiveProps,
    render,
    scope,
    vNode,
    parent,
    provides: parent ? parent.provides : Object.create({}),
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
  let lastInstance
  const componentUpdateFn = () => {
    if (!last) {
      queueHooks(instance.m)
    } else {

      queueHooks(instance.u)
    }

    lastInstance = currentInstance
    currentInstance = instance

    const child = render()
    patch(last, child, parentDOM || findParentDom(nextVNode))
    child.$parent = instance.vNode

    last = child

    instance.vNode.children = [child]
    currentInstance = instance
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


export function provide(key: string, value: any) {
  if (!currentInstance) return

  let provides = currentInstance.provides

  const parentProvides = currentInstance.parent && currentInstance.parent.provides

  if (parentProvides === provides) {
    provides = currentInstance.provides = Object.create(parentProvides)
  }

  provides[key as string] = value
}

export function inject<T>(key: string): T | undefined {
  let instance = currentInstance
  if (!instance) return
  const provides = instance.provides
  return provides[key] as T
}
