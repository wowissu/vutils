import { ActionContext, createStore, getter, GetterCaller, GetterContext, MutateContext } from '../index';
import { reactive, computed } from 'vue'

type State = ReturnType<typeof stateCaller>;
type Getter = ReturnType<typeof getterCaller>;
type Mutate = ReturnType<typeof mutateCaller>;

const stateCaller = () => reactive({
  foo: false
});

const getterCaller = ({ state }: GetterContext<State>) => {
  return {
    reverseFoo: computed(() => !state.foo)
  }
};

const mutateCaller = ({ state }: MutateContext<State, Getter>) => ({
  setFoo(val: boolean) {
    state.foo = val;
  }
});

const actionCaller = ({ state, mutate }: ActionContext<State, Getter, Mutate>) => ({
  toggleFoo () {
    mutate.setFoo(!state.foo)
  }
})

// define
const genStore = () => createStore(
  stateCaller,
  getterCaller,
  mutateCaller,
  actionCaller
);


// store into memery
let store!: ReturnType<typeof genStore>

// export
export const useFooStore = () => {
  return store ??= genStore();
}




