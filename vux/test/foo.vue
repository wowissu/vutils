<template>
  <div>
    {{ foo }}

    <button @click="toggleFoo">toggle</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useFooStore } from './foo.store'

export default defineComponent({
  name: 'foo',
  async setup () {
    const { getter, action } = useFooStore();

    return { foo: getter.reverseFoo,  toggleFoo: action.toggleFoo }
  }
})
</script>
