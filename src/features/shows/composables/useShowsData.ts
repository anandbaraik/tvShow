import { storeToRefs } from 'pinia'

import { useShowsStore } from '../store/shows.store'

export function useShowsData() {
  const store = useShowsStore()
  const {
    shows,
    status,
    error,
    showDetails,
    detailStatus,
    detailError,
    searchResults,
    searchStatus,
    searchError,
  } = storeToRefs(store)

  return {
    shows,
    status,
    error,
    fetchShows: store.fetchShows,
    showDetails,
    detailStatus,
    detailError,
    fetchShowById: store.fetchShowById,
    searchResults,
    searchStatus,
    searchError,
    searchShows: store.searchShows,
  }
}
