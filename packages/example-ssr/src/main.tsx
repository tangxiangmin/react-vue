import {h, reactive, createApp, renderHTML} from "@shymean/react-vue";
import {RouterView, useHistory} from "@shymean/react-vue-router";

// @ts-ignore
import style from './index.module.css'
import {useMainStore} from "../../example/src/store";


const Home = () => {
  return () => {
    return (<div>this is home</div>)
  }
}
const About = () => {
  return () => {
    return (<div>this is about</div>)
  }
}
const NotFound = () => {
  return () => {
    return <div>404</div>
  }
}

export const routes = [
  {
    path: '/index',
    component: Home
  }, {
    path: '/about',
    component: About
  }, {
    component: NotFound
  }
]

export function App({url}: { url?: string }) {
  const history = useHistory()
  const toHome = () => {
    history.push('/index')
  }
  const toAbout = () => {
    history.push('/about')
  }

  const store = useMainStore()

  const add = () => {
    store.addX()
  }

  return () => {
    return (<div>
      <h1 className={style.title}>hello123213</h1>
      <div>
        <button onClick={toHome}>to home</button>
        <button onclick={toAbout}>to about</button>
      </div>
      <div>
        <button onClick={add}>click {store.x}</button>
      </div>
      <RouterView routes={routes} initUrl={url}/>
    </div>)
  }
}
