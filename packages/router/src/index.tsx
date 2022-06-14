import {h} from "@shymean/react-vue";

type Route = {
  path: string,
  component: Function
}
type RouterViewProps = {
  routes: Route[]
}
export const RouterView = ({routes}: RouterViewProps) => {
  const findCurrentRoute = () => {
    const route = routes.find(() => {
      return true
    })
    if (!route) return null
    const {component: Component} = route
    // @ts-ignore
    return (<Component/>)
  }

  return () => {
    return findCurrentRoute()

  }
}


