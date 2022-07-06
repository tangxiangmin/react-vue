import {pathToRegexp} from "path-to-regexp";
import {h, reactive, VNode} from "@shymean/react-vue";

type Route = {
  path?: string,
  component: Function
}
type RouterViewProps = {
  routes: Route[],
  initUrl?: string
}

interface Router {
  push: (url: string) => void
}

const IS_BROWSER = typeof window !== 'undefined'
const ROUTERS: Router[] = []

// 获取当前的url
function getCurrentUrl() {
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

export const RouterView = ({routes, initUrl}: RouterViewProps) => {
  const router = reactive({
    url: initUrl || getCurrentUrl()
  })

  ROUTERS.push({
    push(url) {
      router.url = url
    }
  })

  function onPopstate() {
    router.url = getCurrentUrl()
  }

  // 浏览器环境下注册popstate事件
  if (IS_BROWSER && window.addEventListener) {
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