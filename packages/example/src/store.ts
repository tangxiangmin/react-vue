import {defineStore} from '@shymean/react-vue-store'

export const useStore = defineStore({
  id: 'test',
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


