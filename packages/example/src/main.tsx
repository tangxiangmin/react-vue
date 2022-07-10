import {h, reactive, createApp, renderHTML, onMounted, onUpdated, onUnMounted} from "@shymean/react-vue";
import {RouterView, useHistory} from "@shymean/react-vue-router";

// @ts-ignore
import style from './index.module.css'
import {useStore} from "./store";

type CountProps = {
  value: number
}


function Count({value = 0}: CountProps) {
  const data = reactive({
    count: value
  })
  const onClick = () => {
    data.count++
  }

  return () => {
    return (<button onClick={onClick}>click {data.count} </button>)
  }
}

function List() {
  const data = reactive({
    list: [10, 20, 30, 40, 50]
  })

  const add = () => {
    data.list.push(Math.floor(Math.random() * 100))
  }
  const remove = () => {
    data.list.pop()
  }

  const shuffle = () => {
    data.list.sort(() => Math.random() - 0.5)
  }

  return () => {
    return (<div>
      <button onClick={add}>add</button>
      <button onClick={remove}>remove</button>
      <button onClick={shuffle}>shuffle me</button>
      <ul>
        {
          data.list.map((row: number) => {
            return (<li key={row}>
              {row}
            </li>)
          })
        }
      </ul>
    </div>)
  }
}

function TextPanel() {
  const data = reactive({
    html: '<h1>hello world</h1>'
  })

  const onInput = (e: any) => {
    data.html = e.target?.value
  }

  return () => {
    return (<div>
      <textarea onInput={onInput}/>
      <div dangerouslySetInnerHTML={{__html: data.html}}/>

    </div>)
  }

}

// 这里不能用解构赋值，不然会失去响应式
function DisplayText(props: { text: string }) {
  return () => {
    return (<div>
      text is {props.text}
    </div>)
  }
}

function DisplayPanel() {
  const data = reactive({
    text: 'hello'
  })
  const onClick = () => {
    data.text = Math.random().toString()
  }
  return () => {
    return (<div>
      <button onClick={onClick}>random</button>
      <DisplayText text={data.text}/>
    </div>)
  }
}

const Demo = () => {
  return () => {
    return (<div> this is demo</div>)
  }
}

const Home = () => {
  const data = reactive({
    flag: true
  })

  const onToggleFlag = () => {
    data.flag = !data.flag
  }

  return () => {

    return (<div>
      <button onClick={onToggleFlag}>toggle {data.flag}</button>
      {
        data.flag ? (<Demo/>) : (<DisplayPanel/>)
      }

    </div>)
  }
}
const About = () => {
  onMounted(() => {
    console.log('mounted about')
  })

  onUpdated(() => {
    console.log('update about')
  })
  onUnMounted(() => {
    console.log('unmounted about')
  })

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


const SubApp = () => {
  const store = useStore()
  console.log('on create')

  onMounted(() => {
    console.log('on mounted')
  })

  return () => {
    return (<div>
      pure render {store.x}
    </div>)
  }
}

function App() {

  const history = useHistory()
  const toHome = () => {
    history.push('/')
  }
  const toAbout = () => {
    history.push('/about')
  }

  const store = useStore()

  const add = () => {
    store.addX()
  }

  // onMounted(() => {
  //   console.log('mounted app')
  // })
  //
  // onUpdated(() => {
  //   console.log('update app')
  // })
  // onUnMounted(() => {
  //   console.log('unmounted')
  // })

  return () => {
    return (<div>
      <h1 className={style.title}>hello</h1>
      <div>
        <button onClick={toHome}>to home</button>
        <button onclick={toAbout}>to about</button>
      </div>
      <div>
        <button onClick={add}>click {store.x}</button>
        {/*<SubApp/>*/}
      </div>
      <RouterView routes={routes}/>
    </div>)
  }
}


// web应用

// @ts-ignore
createApp(<App/>).mount(document.querySelector('#root')!)


// ssr
// @ts-ignore
// const html = renderHTML(<App/>)
// console.log(html)
