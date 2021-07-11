import { computed } from 'vue';
import { GetterContext } from 'index';
import { State } from 'test/bar/state';

export type Getter = ReturnType<typeof getterCaller>;

export const getterCaller = ({ state }: GetterContext<State>) => {
  return {
    reverseFoo: computed(() => !state.foo)
  }
};