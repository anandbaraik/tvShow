<script setup lang="ts">
import ShowGrid from '../../shows/components/ShowGrid.vue'
import { useBookmarksPage } from '../pages/useBookmarksPage'

const { bookmarks } = useBookmarksPage()
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-4 p-4">
    <h1 class="text-2xl font-bold">Bookmarks</h1>
    <p v-if="bookmarks.length === 0" class="text-gray-500">No bookmarked shows yet.</p>
    <ShowGrid v-else :shows="bookmarks" />
  </div>
</template>
