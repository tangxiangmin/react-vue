import {getCurrentInstance} from './component'
import {pauseTracking, resetTracking} from "./reactive";

export const enum LifecycleHooks {
  MOUNTED = 'm',
  UPDATED = 'u',
  UN_MOUNTED = 'um'
}

function injectHook(type: LifecycleHooks, hook: Function) {
  const target = getCurrentInstance()
  if (!target) return
  const hooks = target[type] || (target[type] = [])
  const wrapHook = () => {
    pauseTracking()
    try {
      hook()
    } finally {
      resetTracking()
    }
  }
  hooks.push(wrapHook)
}

const createHook =
  <T extends Function = () => any>(lifecycle: LifecycleHooks) =>
    (hook: T) => injectHook(lifecycle, hook)

export const onMounted = createHook(LifecycleHooks.MOUNTED)
export const onUpdated = createHook(LifecycleHooks.UPDATED)
export const onUnMounted = createHook(LifecycleHooks.UN_MOUNTED)
