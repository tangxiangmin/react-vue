## react-vue-store

定义store

```ts
import {createStoreInstance, defineStore} from '@shymean/react-vue-store'

const instance = createStoreInstance() // 不同store可以复用同一个instance

export const useMainStore = defineStore({
  id: 'test',
  instance,
  state(): { x: number } {
    return {
      x: 1,
    }
  },
  getters: {
    doubleX(): number {
      return 2 * this.x
    }
  },
  actions: {
    addX() {
      this.x += 1
    }
  },
})
```

消费、使用state

```tsx
const SubApp = () => {
  const store = useMainStore()

  return () => {
    return (<div>
      store x is: {store.x}
    </div>)
  }
}

function App() {
  const store = useMainStore()
  const count = ref(0)

  const add = () => {
    store.addX()
  }

  return () => {
    return (<div>
      <button onClick={add}>click {count.value}</button>
      <SubApp/>
    </div>)
  }
}
```
