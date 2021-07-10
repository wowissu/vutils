/* eslint @typescript-eslint/ban-types: "off"  */
import { UnwrapNestedRefs, DeepReadonly } from '@vue/reactivity'

export type StoreReadonly<T> = DeepReadonly<UnwrapNestedRefs<T>>;
export type Store<S, G, M, A> = { state: StoreReadonly<S>, getter: StoreReadonly<G>, mutate: StoreReadonly<M>, action: StoreReadonly<A> }

export type StateCaller<S> = () => PromiseLike<S> | S;
export type GetterCaller<S, G> = (ctx: {state: StoreReadonly<S>}) => G;
export type MutateCaller<S, G, M> = (ctx: {state: S, getter: StoreReadonly<G>}) => M;
export type ActionCaller<S, G, M, A> = (ctx: {state: StoreReadonly<S>, getter: StoreReadonly<G>, mutate: StoreReadonly<M>}) => A

type StoreParams<S extends object, G extends object, M extends object, A extends object> = [
  stateCaller: StateCaller<S>,
  getterCaller: GetterCaller<S, G>,
  mutateCaller: MutateCaller<S, G, M>,
  actionCaller: ActionCaller<S, G, M, A>
]

export function createStore<S extends object, G extends object, M extends object, A extends object>(...params: StoreParams<PromiseLike<S>, G, M, A>): Promise<Store<S, G, M, A>>;
export function createStore<S extends object, G extends object, M extends object, A extends object>(...params: StoreParams<S, G, M, A>): Store<S, G, M, A>;