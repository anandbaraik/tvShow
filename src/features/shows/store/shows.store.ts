import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useShowsQuery, type SearchShowsParams } from '../queries/useShowsQuery'
import type { TvShow } from '../types/show.types'

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<TvShow[]>([])
  const status = ref<FetchStatus>('idle')
  const error = ref<string | null>(null)

  const showDetails = ref<Record<string, TvShow>>({})
  const detailStatus = ref<FetchStatus>('idle')
  const detailError = ref<string | null>(null)

  const searchResults = ref<TvShow[]>([])
  const searchStatus = ref<FetchStatus>('idle')
  const searchError = ref<string | null>(null)

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

  async function fetchShowById(id: string) {
    if (showDetails.value[id]) return

    detailStatus.value = 'loading'
    detailError.value = null

    try {
      const { fetchShowById: fetchShow } = useShowsQuery()
      showDetails.value[id] = await fetchShow(id)
      detailStatus.value = 'success'
    } catch {
      detailError.value = 'Failed to load show details. Please try again.'
      detailStatus.value = 'error'
    }
  }

  async function searchShows(params: SearchShowsParams) {
    searchStatus.value = 'loading'
    searchError.value = null

    try {
      const { searchShows: search } = useShowsQuery()
      searchResults.value = await search(params)
      searchStatus.value = 'success'
    } catch {
      searchError.value = 'Failed to search TV shows. Please try again.'
      searchStatus.value = 'error'
    }
  }

  return {
    shows,
    status,
    error,
    fetchShows,
    showDetails,
    detailStatus,
    detailError,
    fetchShowById,
    searchResults,
    searchStatus,
    searchError,
    searchShows,
  }
})
