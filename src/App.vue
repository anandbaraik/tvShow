<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const increment = () => {
  count.value++
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Hello Vite + Vue!</h1>
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="increment"
    >
      Count is: {{ count }}
    </button>
  </div>
</template>
