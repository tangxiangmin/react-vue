import {pathToRegexp} from "path-to-regexp";
import {h, reactive, VNode, watch} from "@shymean/react-vue";
import {createLocation} from "./location";

type Route = {
  path?: string,
  component: Function
}

type RouterViewProps = {
  routes: Route[],
  initUrl?: string,
  onChange?: (from: Route | null, to: Route | null) => void,
  onBeforeEach?: (from: Route | null, to: Route | null) => void,
}

interface Router {
  push: (url: string) => void
}

const IS_BROWSER = typeof window !== 'undefined'
const ROUTERS: Router[] = []

// 获取当前的url
export function getCurrentUrl() {
  if (!IS_BROWSER) return ''
  return location.pathname + location.search
}

function match(path: string, url: string): boolean {
  const regexp = pathToRegexp(path, [], {endsWith: "?"})
  return regexp.test(url)
}

// 找到第一个符合条件的route
export function getMatchRouteConfig(url: string, routes: Array<Route>): Route | null {
  for (let route of routes) {
    // 不配置任何path，作为通用匹配
    if (!route.path || route.path === url || match(route.path, url)) return route
  }
  return null
}

export function routeTo(url: string) {
  ROUTERS.forEach(router => {
    router.push(url)
  })
}

export function getCurrentLocation() {
  const url = getCurrentUrl()
  return createLocation(url)
}

export const RouterView = ({routes, initUrl, onChange, onBeforeEach}: RouterViewProps) => {
  const router = reactive({
    url: initUrl || getCurrentUrl()
  })

  function onPopstate() {
    router.url = getCurrentUrl()
  }

  if (IS_BROWSER) {
    ROUTERS.push({
      push(url) {
        router.url = url
      }
    })
    watch(
      () => {
        return router.url
      },
      (newVal: string, oldVal: string) => {
        if (typeof onChange === 'function') {
          const from = getMatchRouteConfig(oldVal, routes)
          const to = getMatchRouteConfig(newVal, routes)
          onChange(to, from)
        }
      })

    watch(
      () => {
        return router.url
      },
      (newVal: string, oldVal: string) => {

        if (typeof onBeforeEach === 'function') {
          const from = getMatchRouteConfig(oldVal, routes)
          const to = getMatchRouteConfig(newVal, routes)
          onBeforeEach(to, from)
        }
      }, {immediate: true})

    // 浏览器环境下注册popstate事件
    window.removeEventListener('popstate', onPopstate)
    window.addEventListener('popstate', onPopstate)
  }

  return () => {
    const route = getMatchRouteConfig(router.url, routes)
    if (!route) return null

    const {component} = route
    return h(component, {}, []) as VNode
  }
}
