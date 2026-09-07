import { storeToRefs } from 'pinia'

import { useShowsStore } from '../store/shows.store'

export function useShowsData() {
  const store = useShowsStore()
  const { shows, status, error } = storeToRefs(store)

  return { shows, status, error, fetchShows: store.fetchShows }
}
