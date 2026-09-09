<script setup lang="ts">
import type { TvShow } from '../types/show.types'

defineProps<{ show: TvShow; bookmarked: boolean }>()
defineEmits<{ 'toggle-bookmark': [] }>()
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row">
    <img
      :src="show.image ?? undefined"
      :alt="show.title"
      class="h-72 w-48 shrink-0 rounded object-cover bg-gray-200 self-center sm:self-start"
    />

    <div class="space-y-2">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold">{{ show.title }}</h1>
        <button
          type="button"
          class="rounded border px-2 py-1 text-sm"
          @click="$emit('toggle-bookmark')"
        >
          {{ bookmarked ? '★ Bookmarked' : '☆ Bookmark' }}
        </button>
      </div>

      <p class="text-sm text-gray-500">
        <span v-if="show.averageRating">★ {{ show.averageRating.toFixed(1) }}</span>
        <span v-if="show.numVotes"> ({{ show.numVotes.toLocaleString() }} votes)</span>
        <span v-if="show.startYear"> · {{ show.startYear }}{{ show.endYear ? `–${show.endYear}` : '' }}</span>
        <span v-if="show.runtimeMinutes"> · {{ show.runtimeMinutes }} min</span>
      </p>

      <div v-if="show.genres.length" class="flex flex-wrap gap-2">
        <span v-for="genre in show.genres" :key="genre" class="rounded bg-gray-100 px-2 py-1 text-xs">
          {{ genre }}
        </span>
      </div>

      <p v-if="show.description" class="text-gray-700">{{ show.description }}</p>

      <p v-if="show.interests.length" class="text-sm text-gray-500">
        Interests: {{ show.interests.join(', ') }}
      </p>

      <p v-if="show.filmingLocations.length" class="text-sm text-gray-500">
        Filming locations: {{ show.filmingLocations.join(', ') }}
      </p>

      <div class="flex gap-4 pt-2 text-sm">
        <a v-if="show.trailer" :href="show.trailer" target="_blank" rel="noopener" class="text-blue-600 hover:underline">
          Watch trailer
        </a>
        <a :href="show.imdbUrl" target="_blank" rel="noopener" class="text-blue-600 hover:underline">
          View on IMDb
        </a>
      </div>
    </div>
  </div>
</template>
