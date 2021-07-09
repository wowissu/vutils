const { readonly } = require('vue')

export function createStore(stateCaller, mutateCaller, actionCaller) {
  const stateThenable = stateCaller();

  if (stateThenable instanceof Promise) {
    return stateThenable.then(state => {
      return cStore(state);
    })
  } else {
    return cStore(stateThenable)
  }

  function cStore(state) {
    const stateReadonly = readonly(state);
    const mutate = readonly(mutateCaller(state));
    const action = readonly(actionCaller(stateReadonly, mutate));

    return ({
      state: stateReadonly,
      mutate,
      action
    })
  }
}