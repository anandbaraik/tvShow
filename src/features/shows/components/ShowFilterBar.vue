<script setup lang="ts">
defineProps<{ genreOptions: string[] }>()

const genre = defineModel<string>('genre', { required: true })
const sortOrder = defineModel<'ASC' | 'DESC'>('sortOrder', { required: true })
const search = defineModel<string>('search', { required: true })
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <select v-model="genre" class="rounded border px-2 py-1 text-sm">
      <option value="">All Genres</option>
      <option v-for="option in genreOptions" :key="option" :value="option">{{ option }}</option>
    </select>

    <select v-model="sortOrder" class="rounded border px-2 py-1 text-sm">
      <option value="DESC">Rating: High to Low</option>
      <option value="ASC">Rating: Low to High</option>
    </select>

    <input
      v-model="search"
      type="text"
      placeholder="Search by title…"
      class="min-w-40 flex-1 rounded border px-2 py-1 text-sm"
    />
  </div>
</template>
