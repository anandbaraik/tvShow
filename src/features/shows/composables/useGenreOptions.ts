import { computed, type Ref } from 'vue'

import type { TvShow } from '../types/show.types'

export function useGenreOptions(shows: Ref<TvShow[]>) {
  const genreOptions = computed(() => {
    const genres = new Set<string>()

    for (const show of shows.value) {
      for (const genre of show.genres) {
        genres.add(genre)
      }
    }

    return [...genres].sort()
  })

  return { genreOptions }
}
