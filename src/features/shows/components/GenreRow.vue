<script setup lang="ts">
import ShowCard from './ShowCard.vue'
import type { TvShow } from '../types/show.types'

defineProps<{ genre: string; shows: TvShow[] }>()
</script>

<template>
  <section>
    <h2 class="mb-2 text-lg font-semibold">{{ genre }}</h2>
    <div class="flex gap-3 overflow-x-auto pb-2">
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </div>
  </section>
</template>
