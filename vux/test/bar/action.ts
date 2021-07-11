import { ActionContext } from 'index';
import { Getter } from 'test/bar/getter';
import { Mutate } from 'test/bar/mutate';
import { State } from 'test/bar/state';

export const actionCaller = ({ state, mutate }: ActionContext<State, Getter, Mutate>) => ({
  toggleFoo () {
    mutate.setFoo(!state.foo)
  }
});