import { computed, type Ref } from 'vue'

import type { TvShow } from '../types/show.types'

export function useGenreGroups(shows: Ref<TvShow[]>) {
  const genreGroups = computed(() => {
    const groups: Record<string, TvShow[]> = {}

    for (const show of shows.value) {
      for (const genre of show.genres) {
        groups[genre] ??= []
        groups[genre].push(show)
      }
    }

    for (const genre in groups) {
      groups[genre].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    }

    return groups
  })

  return { genreGroups }
}
