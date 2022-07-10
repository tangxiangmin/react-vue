import {IComponent, VNode} from "./h";
import {EffectScope, ReactiveEffect} from "./reactive";
import {queueJob, SchedulerJob, queuePostJob} from "./scheduler";
import {patch} from "./patch";

export let currentInstance: IComponent | null = null

const noopRender = () => {
}

export function createComponentInstance(props: any): IComponent {
  const scope = new EffectScope(true)
  const render = noopRender

  const instance = {
    props, render, scope, m: null, um: null, u: null
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
    () => queueJob(update),
    // @ts-ignore
    nextVNode.$instance.scope
  )

  const update: SchedulerJob = () => effect.run()

  // @ts-ignore
  update()
}


export function unmountComponent(instance: IComponent) {
  queueHooks(instance.um)
}
