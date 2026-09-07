<script setup lang="ts">
import GenreRow from '../components/GenreRow.vue'
import { useHomePage } from '../pages/useHomePage'

const { genreGroups, status, error } = useHomePage()
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6 p-4">
    <p v-if="status === 'loading'">Loading shows…</p>
    <p v-else-if="status === 'error'" class="text-red-600">{{ error }}</p>

    <GenreRow
      v-for="(shows, genre) in genreGroups"
      :key="genre"
      :genre="genre"
      :shows="shows"
    />
  </div>
</template>
