import { createStore } from '../index';
import { reactive, computed } from 'vue'

// define
const genStore = () => createStore(
  () => reactive({
    foo: false
  }),

  // Getter
  ({ state }) => ({
    reverseFoo: computed(() => !state.foo)
  }),

  // Mutate
  ({ state, getter }) => ({
    setFoo(val: boolean) {
      state.foo = val;
    }
  }),

  // Actions
  ({ state, getter, mutate }) => ({
    toggleFoo () {
      mutate.setFoo(!state.foo)
    }
  })
);


// store into memery
let store!: ReturnType<typeof genStore>

// export
export const useFooStore = () => {
  return store ??= genStore();
}




