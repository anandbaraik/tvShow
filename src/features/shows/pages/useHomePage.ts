import { onMounted } from 'vue'

import { useGenreGroups } from '../composables/useGenreGroups'
import { useShowsData } from '../composables/useShowsData'

export function useHomePage() {
  const { shows, status, error, fetchShows } = useShowsData()
  const { genreGroups } = useGenreGroups(shows)

  onMounted(fetchShows)

  return { genreGroups, status, error }
}
