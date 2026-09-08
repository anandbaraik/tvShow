<script setup lang="ts">
import GenreRow from '../components/GenreRow.vue'
import ShowGrid from '../components/ShowGrid.vue'
import { useHomePage } from '../pages/useHomePage'

const {
  genreGroups,
  status,
  error,
  genreOptions,
  selectedGenre,
  searchTerm,
  sortOrder,
  isFiltering,
  searchResults,
  searchStatus,
  searchError,
} = useHomePage()
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-4">
    <div class="flex flex-wrap gap-3">
      <select v-model="selectedGenre" class="rounded border px-2 py-1 text-sm">
        <option value="">All Genres</option>
        <option v-for="option in genreOptions" :key="option" :value="option">{{ option }}</option>
      </select>

      <select v-model="sortOrder" class="rounded border px-2 py-1 text-sm">
        <option value="DESC">Rating: High to Low</option>
        <option value="ASC">Rating: Low to High</option>
      </select>

      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by title…"
        class="min-w-40 flex-1 rounded border px-2 py-1 text-sm"
      />
    </div>

    <template v-if="isFiltering">
      <p v-if="searchStatus === 'loading'">Searching shows…</p>
      <p v-else-if="searchStatus === 'error'" class="text-red-600">{{ searchError }}</p>
      <p v-else-if="searchResults.length === 0">No shows found.</p>
      <ShowGrid v-else :shows="searchResults" />
    </template>

    <template v-else>
      <p v-if="status === 'loading'">Loading shows…</p>
      <p v-else-if="status === 'error'" class="text-red-600">{{ error }}</p>

      <GenreRow
        v-for="(shows, genre) in genreGroups"
        :key="genre"
        :genre="genre"
        :shows="shows"
      />
    </template>
  </div>
</template>
