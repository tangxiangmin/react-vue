import {createStoreInstance, defineStore} from '@shymean/react-vue-store'

const instance = createStoreInstance() // 不同store可以复用同一个

export const useMainStore = defineStore({
  id: 'test',
  instance,
  state(): { x: number, y: number } {
    return {
      x: 1,
      y: 2
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


