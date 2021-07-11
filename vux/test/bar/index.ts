
import { createStore } from '../../index';
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


// store into memery
let store!: ReturnType<typeof genStore>

// export
export const useFooStore = () => {
  return store ??= genStore();
}