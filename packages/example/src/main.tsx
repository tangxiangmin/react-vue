import {h, reactive, createApp} from "@shymean/react-vue";
import {ReactElement,} from "react";


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

  return render as unknown as ReactElement
}

function List() {
  const data = reactive({
    list: [1, 2, 3, 4, 5]
  })

  const add = () => {
    data.list.push(Math.floor(Math.random() * 100))
  }
  const remove = () => {
    data.list.pop()
  }

  const shuffleList = (arr: number[]) => {
    let result = [], random;
    while (arr.length > 0) {
      random = Math.floor(Math.random() * arr.length);
      result.push(arr[random])
      arr.splice(random, 1)
    }
    return result;
  }

  const shuffle = () => {
    data.list = shuffleList(data.list)
  }

  const render = () => {
    return (<div>
      <button onClick={add}>add</button>
      <button onClick={remove}>remove</button>
      <button onClick={shuffle}>shuffle me</button>
      <ul>
        {
          data.list.map((row: number) => {
            return (<li>
              {row}
            </li>)
          })
        }
      </ul>
    </div>)
  }
  return render as unknown as ReactElement
}

function App() {

  const render = () => {
    return (<div>
      <h1>hello</h1>
      <div>
        <p>counter</p>
        <Count value={10}/>
      </div>
      <List/>
    </div>)
  }

  return render as unknown as ReactElement
}


// @ts-ignore
createApp(<App/>).mount(document.querySelector('#root')!)

// List()
