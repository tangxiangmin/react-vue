// 参考 Pinia 实现的极简状态管理器
import {reactive, UnwrapRef} from "@shymean/react-vue";

interface DefineStoreOptionsBase<S extends StateTree, Store> {
}

interface DefineStoreOptions<Id extends string,
  S extends StateTree,
  G,
  A> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
  id: Id,
  state?: () => S,
  getters?: G &
    ThisType<UnwrapRef<S> & _StoreWithGetters<G>> &
    _GettersTree<S>,
  actions?: A &
    ThisType<A &
      UnwrapRef<S> &
      _StoreWithState<Id, S, G, A> &
      _StoreWithGetters<G>>
}

type _Method = (...args: any[]) => any
type _ActionsTree = Record<string, _Method>
type _GettersTree<S extends StateTree> = Record<string,
  | ((state: UnwrapRef<S>) => any)
  | (() => any)>

type StateTree = Record<string | number | symbol, any>

interface StoreProperties<Id extends string> {

}

interface _StoreWithState<Id extends string,
  S extends StateTree,
  G,
  A> extends StoreProperties<Id> {

}

type _StoreWithGetters<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R
    ? R
    : UnwrapRef<G[k]>
}

type Store<Id extends string = string,
  S extends StateTree = {},
  G = {},
  A = {}> = UnwrapRef<S> & _StoreWithGetters<G> & (_ActionsTree extends A ? {} : A)


export function defineStore<Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree>(option: DefineStoreOptions<Id, S, G, A>) {
  const {state, actions} = option
  const data = reactive(state ? state() : {})
  const store = Object.assign(data, actions)

  return () => {
    return store as Store<Id, S, G, A>
  }
}
