
import { UnwrapNestedRefs, DeepReadonly } from '@vue/reactivity'

type StoreReadonly<T> = DeepReadonly<UnwrapNestedRefs<T>>;

export type Store<S, M, A> = { state: StoreReadonly<S>, mutate: StoreReadonly<M>, action: StoreReadonly<A> }
export type StateCaller<S> = () => PromiseLike<S> | S;
export type MutateCaller<S, M> = (state: S) => M;
export type ActionCaller<S, M, A> = (state: StoreReadonly<S>, mutate: StoreReadonly<M>) => A

export function createStore<S extends object, M extends object, A extends object>(stateCaller: StateCaller<PromiseLike<S>>, mutateCaller: MutateCaller<S, M>, actionCaller: ActionCaller<S, M, A>): Promise<Store<S, M, A>>;
export function createStore<S extends object, M extends object, A extends object>(stateCaller: StateCaller<S>, mutateCaller: MutateCaller<S, M>, actionCaller: ActionCaller<S, M, A>): Store<S, M, A>;