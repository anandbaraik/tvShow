<script setup lang="ts">
import ShowCard from './ShowCard.vue'
import type { TvShow } from '../types/show.types'

defineProps<{ shows: TvShow[] }>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <ShowCard v-for="show in shows" :key="show.id" :show="show" />
  </div>
</template>
