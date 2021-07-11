import { reactive } from 'vue'

export type State = ReturnType<typeof stateCaller>;

export const stateCaller = () => reactive({
  foo: false
});