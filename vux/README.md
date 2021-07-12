# @wowissu/vux

![vue](https://img.shields.io/github/package-json/dependency-version/wowissu/vutils/vue?filename=vux%2Fpackage.json)
![typescript](https://img.shields.io/github/package-json/dependency-version/wowissu/vutils/typescript?filename=vux%2Fpackage.json)

Like Vuex, but base on Vue3 composition API.

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

## How to use

```typescript
// foo.store.ts
import { reactive, computed } from 'vue';
import { createStore } from '@wowissu/vux';

export const store = createStore(
  // state caller
  () => reactive({
    foo: false
  }),

  // getter caller
  ({ state }) => ({
    foo: computed(() => !state.foo)
  }),

  // mutate caller
  ({ state, getter }) => {
    return {
      setFoo(bar: boolean) {
        state.foo = bar;
      }
    }
  },

  // action caller
  ({ state, mutate, getter }) => {
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
import { createStore } from '@wowissu/vux';

const makeStore = () => createStore(
  // state caller
  () => reactive({
    foo: false
  }),
  // ... as above ...
)

let store!: ReturnType<typeof makeStore>

export const useStore() {
  return store ??= makeStore()
}
```

## In Vue

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

## Separate

If like all separate. try below.

```dir
📦bar
 ┣ 📜action.ts
 ┣ 📜getter.ts
 ┣ 📜index.ts
 ┣ 📜mutate.ts
 ┗ 📜state.ts
```

```typescript
// bar/index.ts

import { createStore } from '@wowissu/vux';
import { stateCaller } from './state';
import { getterCaller } from './getter';
import { mutateCaller } from './mutate';
import { actionCaller } from './action';

const genStore = () => createStore(
  stateCaller,
  getterCaller,
  mutateCaller,
  actionCaller
);


// store into memory
let store!: ReturnType<typeof genStore>

// export
export const useBarStore = () => {
  return store ??= genStore();
}
```

```typescript
// bar/state.ts
import { reactive } from 'vue'

export type State = ReturnType<typeof stateCaller>;

export const stateCaller = () => reactive({
  foo: false
});
```

```typescript
// bar/getter.ts
import { computed } from 'vue';
import { GetterContext } from '@wowissu/vux';
import { State } from './state';

export type Getter = ReturnType<typeof getterCaller>;

export const getterCaller = ({ state }: GetterContext<State>) => {
  return {
    reverseFoo: computed(() => !state.foo)
  }
};
```

```typescript
// bar/mutate.ts
import { MutateContext } from '@wowissu/vux';
import { Getter } from './getter';
import { State } from './state';

export type Mutate = ReturnType<typeof mutateCaller>;

export const mutateCaller = ({ state }: MutateContext<State, Getter>) => ({
  setFoo(val: boolean) {
    state.foo = val;
  }
});
```

```typescript
// bar/action.ts
import { ActionContext } from '@wowissu/vux';
import { Getter } from './getter';
import { Mutate } from './mutate';
import { State } from './state';

export const actionCaller = ({ state, mutate }: ActionContext<State, Getter, Mutate>) => ({
  toggleFoo () {
    mutate.setFoo(!state.foo)
  }
});
```

## :warning: Async Store

> :warning: **Async stateCaller is unrecommended**. should consider to use async Action method for fetch data and **change state via mutate**

Fetch the data before init state.

```typescript
createStore(
  // async state caller
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
