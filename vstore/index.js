const { readonly } = require('vue')

export function createStore({
  state: stateCaller,
  getter: getterCaller,
  mutate: mutateCaller,
  action: actionCaller
}) {
  const stateThenable = stateCaller();

  if (stateThenable instanceof Promise) {
    return stateThenable.then(state => {
      return makeStore(state);
    })
  } else {
    return makeStore(stateThenable)
  }

  function makeStore(state) {
    const stateReadonly = readonly(state);
    const getter = readonly(getterCaller(stateReadonly));
    const mutate = readonly(mutateCaller(state, getter));
    const action = readonly(actionCaller(stateReadonly, getter, mutate));

    return ({
      state: stateReadonly,
      getter,
      mutate,
      action
    })
  }
}