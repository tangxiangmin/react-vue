import {h, reactive, createApp, ref} from "@shymean/react-vue";
import {RouterView} from "@shymean/react-vue-router";

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

  const render = () => {
    return (<button onClick={onClick}>click {data.count} </button>)
  }

  return render
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

  const render = () => {
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
  // return render
  return render
}

function TextPanel() {
  const data = reactive({
    html: '<h1>hello world</h1>'
  })

  const onInput = (e: any) => {
    data.html = e.target?.value
  }

  const render = () => {
    return (<div>
      <textarea onInput={onInput}/>
      <div dangerouslySetInnerHTML={{__html: data.html}}/>

    </div>)
  }

  return render
}

// 这里不能用解构赋值，不然会失去响应式
function DisplayText(props: { text: string }) {
  const render = () => {
    return (<div>
      text is {props.text}
    </div>)
  }

  return render
}

function DisplayPanel() {
  const data = reactive({
    text: 'hello'
  })
  const onClick = () => {
    data.text = Math.random().toString()
  }
  const render = () => {
    return (<div>
      <button onClick={onClick}>random</button>
      <DisplayText text={data.text}/>
    </div>)
  }

  return render
}

const Demo = () => {
  const render =  () => {
    return (<div> this is demo</div>)
  }
  return render
}


const Home = () => {
  return () => {
    return (<div>
      {/*<DisplayPanel/>*/}
      <Count value={10}/>
      {/*<TextPanel/>*/}
      {/*<List/>*/}
      <Demo/>
    </div>)
  }
}
const About = () => {
  return () => {
    return (<div> this is about</div>)
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

  const render = () => {
    return (<div>
      <h1 className="title">hello</h1>
      <div>
        <button>to home</button>
        <button>to about</button>
      </div>
      <RouterView routes={routes}/>
    </div>)
  }

  return render
}


// @ts-ignore
createApp(<App/>).mount(document.querySelector('#root')!)

// List()
