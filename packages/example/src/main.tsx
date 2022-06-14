import {h, reactive, createApp} from "@shymean/react-vue";
import {RouterView, useHistory} from "@shymean/react-vue-router";

import style from './index.css'

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
      <h1 className="title">hello</h1>
      <div>
        <button onClick={toHome}>to home</button>
        <button onclick={toAbout}>to about</button>
      </div>
      <RouterView routes={routes}/>
    </div>)
  }
}


// @ts-ignore
createApp(<App/>).mount(document.querySelector('#root')!)

// List()
