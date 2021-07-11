import { MutateContext } from 'index';
import { Getter } from 'test/bar/getter';
import { State } from 'test/bar/state';

export type Mutate = ReturnType<typeof mutateCaller>;

export const mutateCaller = ({ state }: MutateContext<State, Getter>) => ({
  setFoo(val: boolean) {
    state.foo = val;
  }
});