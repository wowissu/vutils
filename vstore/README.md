# @wowissu/vstore

Like Vuex, but base on Vue3 composition API.

## How to use

```typescript
import { reactive } from 'vue';

export function createStore(
  stateCaller: () => reactive({ [key: string]: any }),
  mutateCaller: (state) => { [key: string]: () => void },
  actionCaller: (state, mutate) => { [key: string]: () => any }
)
```

* `StateCaller()` must return **`reactive({ ... })`**
* `MutateCaller()` state is only writable in mutate methods.
* `ActionCaller()` the state or mutate both readonly in action methods, call mutate method for change the state.

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
import { useStore } from 'foo.store.ts';

export default defineComponent({
  // ...
  setup () {
    const { state, action } = useStore();
    const foo = computed(() => state.foo)

    return { foo }
  }
})
```

## :warning: Async Store

> :warning: **Async stateCaller is unrecommended**. should consider to use async Action method for fetch data and **change state via mutate**

Fetch the data before init state.

```typescript
createStore(
  async () => {
    const data = await fetchSomeData();

    return reactive({
      data
    })
  }
)
```

### Use in async vue

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
