## react-vue-router

react-vue 路由组件

```tsx
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

const routes = [
  {
    path: '/',
    component: Home
  }, {
    path: '/about',
    component: About
  }
]

function App() {
  const history = useHistory()
  
  const toHome = () => {
    history.push('/')
  }
  const toAbout = () => {
    history.push('/about')
  }

  return () => {
    return (<div>
      <div>
        <button onClick={toHome}>to home</button>
        <button onclick={toAbout}>to about</button>
      </div>
      <RouterView routes={routes}/>
    </div>)
  }
}
```
