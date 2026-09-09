import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import type { TvShow } from '../../shows/types/show.types'

const STORAGE_KEY = 'tvshow.bookmarks'

function loadBookmarks(): TvShow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarks = ref<TvShow[]>(loadBookmarks())

  watch(
    bookmarks,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  function isBookmarked(id: string) {
    return bookmarks.value.some((show) => show.id === id)
  }

  function toggleBookmark(show: TvShow) {
    const index = bookmarks.value.findIndex((item) => item.id === show.id)

    if (index === -1) {
      bookmarks.value.push(show)
    } else {
      bookmarks.value.splice(index, 1)
    }
  }

  return { bookmarks, isBookmarked, toggleBookmark }
})
