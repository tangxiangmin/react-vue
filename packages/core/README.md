## react-vue

兼备React和Vue的开发体验

```tsx
import {reactive, createApp} from "@shymean/react-vue";

type CountProps = {
  initValue: number
}

function Count({initValue = 0}: CountProps) {
  const data = reactive({
    count: initValue
  })
  
  const onClick = () => {
    data.count++
  }

  return  () => {
    return <button onClick={onClick}>click {data.count} </button>
  }
}

function App() {
  return ()=>{
    return <Count initValue={10}/>
  }
}

createApp(<App/>).mount(document.querySelector('#root')!)
```
