import {IComponent, VNode} from "./h";
import {EffectScope, ReactiveEffect, shallowReactive} from "./reactive";
import {queueJob, SchedulerJob, queuePostJob} from "./scheduler";
import {patch} from "./patch";

export let currentInstance: IComponent | null = null

let uid = 1
const noopRender = () => {
}

export function createComponentInstance(props: any): IComponent {
  // 监听props的变化
  const reactiveProps = shallowReactive(props)
  const scope = new EffectScope(true)
  const render = noopRender

  const instance = {
    id: uid++,
    props: reactiveProps,
    render,
    scope,

    update: ()=>{},

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
    patch(last, child, parentDOM)
    last = child

    if (instance) {
      instance.child = child
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
