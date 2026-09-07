import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useShowsQuery } from '../queries/useShowsQuery'
import type { TvShow } from '../types/show.types'

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<TvShow[]>([])
  const status = ref<FetchStatus>('idle')
  const error = ref<string | null>(null)

  async function fetchShows() {
    if (status.value === 'loading' || status.value === 'success') return

    status.value = 'loading'
    error.value = null

    try {
      const { fetchTopShows } = useShowsQuery()
      shows.value = await fetchTopShows()
      status.value = 'success'
    } catch {
      error.value = 'Failed to load TV shows. Please try again.'
      status.value = 'error'
    }
  }

  return { shows, status, error, fetchShows }
})
