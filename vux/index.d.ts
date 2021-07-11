/* eslint @typescript-eslint/ban-types: "off"  */
import { UnwrapNestedRefs, DeepReadonly } from '@vue/reactivity'

export type StoreReadonly<T> = DeepReadonly<UnwrapNestedRefs<T>>;
export type Store<S, G, M, A> = { state: StoreReadonly<S>, getter: StoreReadonly<G>, mutate: StoreReadonly<M>, action: StoreReadonly<A> };

export type GetterContext<S> = CallerContext<StoreReadonly<S>>;
export type MutateContext<S, G> = CallerContext<S, G>;
export type ActionContext<S, G, M> = { state: StoreReadonly<S>, getter: StoreReadonly<G>, mutate: StoreReadonly<M> };

export type CallerContext<S, G = undefined, M = undefined> = { state: S, getter: StoreReadonly<G>, mutate: StoreReadonly<M> };

export type StateCaller<S> = () => PromiseLike<S> | S;
export type GetterCaller<S, G> = (ctx: GetterContext<S>) => G;
export type MutateCaller<S, G, M> = (ctx: MutateContext<S, G>) => M;
export type ActionCaller<S, G, M, A> = (ctx: ActionContext<S, G, M>) => A;

type StoreParams<S extends object, G extends object, M extends object, A extends object> = [
  stateCaller: StateCaller<S>,
  getterCaller: GetterCaller<S, G>,
  mutateCaller: MutateCaller<S, G, M>,
  actionCaller: ActionCaller<S, G, M, A>
];

export function createStore<S extends object, G extends object, M extends object, A extends object>(...params: StoreParams<PromiseLike<S>, G, M, A>): Promise<Store<S, G, M, A>>;
export function createStore<S extends object, G extends object, M extends object, A extends object>(...params: StoreParams<S, G, M, A>): Store<S, G, M, A>;


export function getter<S> (caller: (ctx: GetterContext<S>) => object) {
  return caller
}