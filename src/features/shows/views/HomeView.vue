<script setup lang="ts">
import GenreRow from '../components/GenreRow.vue'
import ShowFilterBar from '../components/ShowFilterBar.vue'
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
    <ShowFilterBar
      v-model:genre="selectedGenre"
      v-model:sort-order="sortOrder"
      v-model:search="searchTerm"
      :genre-options="genreOptions"
    />

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
