<script setup lang="ts">
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/bookmarks', label: 'Bookmarks' },
  { to: '/about', label: 'About' },
]
</script>

<template>
  <header class="sticky top-0 z-10 border-b bg-white">
    <nav class="mx-auto flex max-w-5xl items-center justify-between p-4">
      <RouterLink to="/" class="text-xl font-bold hover:text-gray-700">TV Shows</RouterLink>
      <ul class="flex gap-4 text-sm">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            active-class="font-semibold text-gray-900"
            exact-active-class="font-semibold text-gray-900"
            class="text-gray-500 hover:text-gray-900"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
