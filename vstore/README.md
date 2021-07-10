# @wowissu/vstore

Like Vuex, but base on Vue3 composition API.

## How to use

```typescript
import { reactive } from 'vue';

export function createStore(
  stateCaller: () => reactive({ [key: string]: any }),
  getterCaller: ({state}) => { [key: string]: any },
  mutateCaller: ({state, getter}) => { [key: string]: () => void },
  actionCaller: ({state, getter, mutate}) => { [key: string]: () => any }
)
```

* `StateCaller()` must return **`reactive({ ... })`**
* `GetterCaller()` recommand return the **`computed(() => 'your getter')`**.
* `MutateCaller()` state is only writable in mutate methods.
* `ActionCaller()` the state or mutate both readonly in action methods, call mutate method for change the state.

## Sample

```typescript
// foo.store.ts
import { reactive, computed } from 'vue';
import { createStore } from '@wowissu/vstore';

export const store = createStore(
  // state caller
  () => reactive({
    foo: false
  }),

  // getter caller
  (state) => ({
    foo: computed(() => !state.foo)
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
import { reactive, computed } from 'vue';
import { createStore } from '@wowissu/vstore';

const makeStore = () => createStore(
  // ... as above ...
)

let store!: ReturnType<typeof makeStore>

export const useStore() {
  return store ??= makeStore()
}
```

### How to use in vue

```typescript
import { useStore } from 'foo.store.ts';

export default defineComponent({
  // ...
  setup () {
    const { state, getter, action } = useStore();

    // use computed to watch data
    const foo = computed(() => state.foo)

    // or getter
    const reverseFoo = getter.reverseFoo

    return { foo, reverseFoo }
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
