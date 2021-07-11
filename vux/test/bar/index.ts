
import { createStore } from '../../index';
import { stateCaller } from 'test/bar/state';
import { getterCaller } from 'test/bar/getter';
import { mutateCaller } from 'test/bar/mutate';
import { actionCaller } from 'test/bar/action';

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