import {queuePostJob, SchedulerJob} from "./scheduler";

import {isReactive, isRef, isShallow, ReactiveEffect} from '@vue/reactivity'

export * from "@vue/reactivity";
// import {reactive, effect, ref, toRefs,ReactiveEffect} from "@vue/reactivity";

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

interface WatchOptions {
  immediate: boolean
}

export function watch(source: Function, cb: Function, {immediate = false}: WatchOptions = {} as WatchOptions) {
  let oldValue: any
  let getter: () => any = () => source()

  const job: SchedulerJob = () => {
    const newValue = effect.run()
    if (hasChanged(newValue, oldValue)) {
      cb(newValue, oldValue)
      oldValue = newValue
    }
  }

  const scheduler = () => queuePostJob(job)

  // @ts-ignore
  const effect = new ReactiveEffect(getter, scheduler);
  if (immediate) {
    job()
  } else {
    oldValue = effect.run()
  }
}

// 下面是简单的实现
//
// import {isObject} from "./util";
//
// let activeEffect: any
// let targetMap = new Map()
//
// export function reactive(obj: any): any {
//   const target = new Proxy(obj, {
//     get(target, key: string) {
//       track(target, key)
//       const res = target[key]
//       if (isObject(res)) {
//         return reactive(res)
//       }
//       return res
//     },
//     set(target, key: string, value) {
//       target[key] = value
//       trigger(target, key)
//       return true
//     }
//   })
//
//   return target
// }
//
// function track(target: any, key: string) {
//   let depMap = targetMap.get(target)
//   if (!depMap) {
//     targetMap.set(target, (depMap = new Map()))
//   }
//   let dep = depMap.get(key)
//   if (!dep) {
//     depMap.set(key, (dep = new Set()))
//   }
//   if (activeEffect && !dep.has(activeEffect)) {
//     dep.add(activeEffect)
//   }
// }
//
// export function effect(cb: Function, lazy: boolean = true) {
//   activeEffect = cb
//   if (!lazy) {
//     cb()
//   }
// }
//
// function trigger(target: any, key: string) {
//
//   let depMap = targetMap.get(target)
//   if (!depMap) return
//   let effects = depMap.get(key)
//   if (!effects) return
//
//   effects.forEach((effect: Function) => {
//     effect()
//   })
// }
//
