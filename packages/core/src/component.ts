import {bindVNode, IComponent, NODE_YPE, VNode} from "./h";
import {EffectScope, ReactiveEffect, shallowReactive, getGlobalShouldTrack} from "./reactive";
import {queueJob, queuePostJob} from "./scheduler";
import {patch} from "./patch";

let currentInstance: IComponent | null = null
let uid = 1

export function setCurrentInstance(instance: IComponent | null) {
  currentInstance = instance
}

export function getCurrentInstance() {
  return currentInstance
}

export function createComponentInstance(vNode: VNode): IComponent {
  const props = vNode.props
  // 监听props的变化
  const reactiveProps = shallowReactive(props)
  const scope = new EffectScope(true)
  const render = () => {
  }

  const parent = findParentComponent(vNode)

  const instance = {
    id: uid++,
    props: reactiveProps,
    render,
    scope,
    vNode,
    parent,
    slots: vNode.children,
    provides: parent ? parent.provides : Object.create({}),
    update: () => {
    },

    m: null,
    um: null,
    u: null,
  }


  setCurrentInstance(instance)

  return instance
}

function queueHooks(hooks: Function[] | null) {
  if (Array.isArray(hooks)) {
    hooks.forEach(job => {
      queuePostJob(job)
    })
  }
}

function findParentDom(node: VNode): Element {
  while (node && node.nodeType !== NODE_YPE.HTML_TAG) {
    node = node.$parent as VNode
  }
  return node && node.$el as Element
}

function findParentComponent(node: VNode) {
  while (node && node.$parent && node.$parent.nodeType !== NODE_YPE.COMPONENT) {
    node = node.$parent as VNode
  }
  return node && node.$parent && node.$parent.$instance || null
}

export function setupRenderEffect(nextVNode: VNode, parentDOM: Element) {
  const instance = nextVNode.$instance as IComponent
  const {render} = instance
  let last: VNode
  const componentUpdateFn = () => {
    const vNode = instance.vNode
    if (!last) {
      queueHooks(instance.m)
    } else {
      queueHooks(instance.u)
    }

    let lastInstance = getCurrentInstance()
    setCurrentInstance(instance)

    const child = render()
    vNode.children = [child]
    bindVNode(vNode)

    patch(last, child, parentDOM || findParentDom(nextVNode))

    last = child

    setCurrentInstance(lastInstance)
  }


  const effect = new ReactiveEffect(
    componentUpdateFn,
    () => queueJob(instance.update as Function),
    // @ts-ignore
    nextVNode.$instance.scope
  )
  // 处理在部分场景下无需追踪的情况
  effect.active = getGlobalShouldTrack()

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
