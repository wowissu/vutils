# @wowissu/vstore

Like Vuex, but base on Vue3 composition API.

## How to use

```typescript
export function createStore(
  stateCaller: () => State,
  mutateCaller: (state) => { [key: string]: () => void },
  actionCaller: (state, mutate) => { [key: string]: () => any }
)
```

## Sample

```typescript
// foo.store.ts

import { reactive } from 'vue';
import { createStore } from '@wowissu/vstore';

export const store = createStore(
  // state caller
  () => reactive({
    foo: false
  }),

  // mutate caller
  (state) => {
    return {
      setFoo(bar: boolean) {
        state.foo = bar;
      }
    }
  },

  // action caller
  (state, mutate) => {
    return {
      doAction() {
        mutate.setFoo(!state.foo)
      }
    }
  }
)
```

## Dynamic make store

Initialize the store only the first time when `useStore()` is called, and return the same one at other times

```typescript
// foo.store.ts

import { reactive } from 'vue';
import { createStore } from '@wowissu/vstore';

const makeStore = () => createStore(
  // state caller
  () => reactive({
    foo: false
  }),

  // mutate caller
  (state) => {
    return {
      setFoo(bar: boolean) {
        state.foo = bar;
      }
    }
  },

  // action caller
  (state, mutate) => {
    return {
      fetchFooData() {
        mutate.setFoo(!state.foo)
      }
    }
  }
)

let store!: ReturnType<typeof makeStore>

export const useStore() {
  return store ??= makeStore()
}
```

### Use in vue

```typescript
import { computed } from 'vue';
import { useStore } from 'store.ts';

export default defineComponent({
  // ...
  setup () {
    const { state, action } = useStore();
    const foo = computed(() => state.foo)

    return { foo }
  }
})
```

## Async mode

Add async before **`state caller`** function

```typescript
import { reactive } from 'vue';
import { createStore } from '@wowissu/vstore';

createStore(
  // state caller
  async () => reactive({
    foo: false
  }),

  // mutate caller
  (state) => {
    return {
      setFoo(bar: boolean) {
        state.foo = bar;
      }
    }
  },

  // action caller
  (state, mutate) => {
    return {
      // async action
      async doAction() {
        mutate.setFoo(!state.foo)
      }
    }
  }
)
```

### use in vue on async mode

If you want use Async Component, please use [\<Suspebnse \/\>](https://v3.vuejs.org/guide/migration/suspense.html) component.

```typescript
import { computed } from 'vue';
import { useStore } from 'store.ts';

export default defineComponent({
  // ...
  async setup () {
    const { state, action } = await useStore();
    const foo = computed(() => state.foo)

    return { foo }
  }
})
```