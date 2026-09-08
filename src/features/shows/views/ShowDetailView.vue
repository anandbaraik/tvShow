<script setup lang="ts">
import ShowDetail from '../components/ShowDetail.vue'
import { useShowDetailPage } from '../pages/useShowDetailPage'

const { show, status, error } = useShowDetailPage()
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-4 p-4">
    <RouterLink to="/" class="text-sm text-gray-500 hover:text-gray-900">&larr; Back</RouterLink>

    <p v-if="status === 'loading'">Loading show…</p>
    <p v-else-if="status === 'error'" class="text-red-600">{{ error }}</p>
    <p v-else-if="!show">Show not found.</p>

    <ShowDetail v-else :show="show" />
  </div>
</template>
