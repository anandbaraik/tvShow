<script setup lang="ts">
import type { TvShow } from '../types/show.types'

defineProps<{ show: TvShow }>()
</script>

<template>
  <RouterLink :to="{ name: 'show-detail', params: { id: show.id } }" class="block">
    <img
      :src="show.image ?? undefined"
      :alt="show.title"
      class="aspect-2/3 w-full rounded object-cover bg-gray-200"
      loading="lazy"
    />
    <p class="mt-1 truncate text-sm font-medium">{{ show.title }}</p>
    <p v-if="show.averageRating" class="text-xs text-gray-500">★ {{ show.averageRating.toFixed(1) }}</p>
  </RouterLink>
</template>
