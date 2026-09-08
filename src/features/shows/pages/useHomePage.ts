import { computed, onMounted, ref, watch } from 'vue'

import { useDebounce } from '../../../shared/composables/useDebounce'
import { useGenreGroups } from '../composables/useGenreGroups'
import { useGenreOptions } from '../composables/useGenreOptions'
import { useShowsData } from '../composables/useShowsData'

const SEARCH_DEBOUNCE_MS = 400

export function useHomePage() {
  const { shows, status, error, fetchShows, searchResults, searchStatus, searchError, searchShows } =
    useShowsData()

  const { genreGroups } = useGenreGroups(shows)
  const { genreOptions } = useGenreOptions(shows)

  const selectedGenre = ref('')
  const searchTerm = ref('')
  const sortOrder = ref<'ASC' | 'DESC'>('DESC')
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS)

  const isFiltering = computed(
    () => selectedGenre.value !== '' || searchTerm.value.trim() !== '' || sortOrder.value !== 'DESC',
  )

  watch([selectedGenre, sortOrder, debouncedSearchTerm], () => {
    searchShows({
      genre: selectedGenre.value,
      title: debouncedSearchTerm.value.trim(),
      sortOrder: sortOrder.value,
    })
  })

  onMounted(fetchShows)

  return {
    genreGroups,
    status,
    error,
    genreOptions,
    selectedGenre,
    searchTerm,
    sortOrder,
    isFiltering,
    searchResults,
    searchStatus,
    searchError,
  }
}
