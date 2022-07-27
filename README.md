

## react-vue

一个mini的类Vue框架，兼备React和Vue的开发体验
* [x] `JSX`强大的表现力
* [x] `@vue/reactivity`双向绑定
* [x] `SSR`渲染
* [x] `css moudle` vite默认支持
* [x] `router`路由
* [x] `store`状态管理

最后使用该项目通过SSR重构了自己的博客[Shymean ](https://github.com/tangxiangmin/ShyMean)，[在线访问地址](https://www.shymean.com/)

示例：

```tsx
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

  return () => {
    return (<button onClick={onClick}>click {data.count} </button>)
  }

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

  return () => {
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
}

function App() {
  return  () => {
    return (<div>
      <h1>hello</h1>
      <div>
        <p>counter</p>
        <Count value={10}/>
      </div>
      <List/>
    </div>)
  }
}


createApp(<App/>).mount(document.querySelector('#root')!)
```
