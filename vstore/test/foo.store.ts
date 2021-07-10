// import { createStore } from '@wowissu/vstore';
import { createStore } from '../index';
import { reactive, computed } from 'vue'

export interface Todo {
  id: number;
  content: string;
}

// define
const genStore = () => createStore(
  () => reactive({
    foo: false
  }),

  // Getter
  ({state}) => ({
    // get latestTodo() { return state.todos[state.todos.length - 1] },
    foo: computed(() => !state.foo)
  }),

  // Mutate
  ({state, getter}) => ({
    setFoo(val: boolean) {
      state.foo = val;
    }
  }),

  // Actions
  ({state, getter, mutate}) => ({
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




