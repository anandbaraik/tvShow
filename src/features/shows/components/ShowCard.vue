<script setup lang="ts">
import type { TvShow } from '../types/show.types'

defineProps<{ show: TvShow }>()
</script>

<template>
  <div class="w-32 shrink-0 sm:w-40">
    <img
      :src="show.image ?? undefined"
      :alt="show.title"
      class="h-48 w-32 rounded object-cover bg-gray-200 sm:h-56 sm:w-40"
      loading="lazy"
    />
    <p class="mt-1 truncate text-sm font-medium">{{ show.title }}</p>
    <p v-if="show.averageRating" class="text-xs text-gray-500">★ {{ show.averageRating.toFixed(1) }}</p>
  </div>
</template>
