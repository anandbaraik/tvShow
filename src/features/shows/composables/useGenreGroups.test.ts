import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useGenreGroups } from './useGenreGroups'
import { buildShow } from '../test/showFixture'
import type { TvShow } from '../types/show.types'

describe('useGenreGroups', () => {
  it('groups shows by genre and sorts each group by rating descending', () => {
    const shows = ref<TvShow[]>([
      buildShow({ id: '1', genres: ['Drama'], averageRating: 5 }),
      buildShow({ id: '2', genres: ['Drama'], averageRating: 9 }),
      buildShow({ id: '3', genres: ['Comedy'], averageRating: 7 }),
    ])

    const { genreGroups } = useGenreGroups(shows)

    expect(genreGroups.value.Drama.map((show) => show.id)).toEqual(['2', '1'])
    expect(genreGroups.value.Comedy.map((show) => show.id)).toEqual(['3'])
  })

  it('lists a show under every genre it belongs to', () => {
    const shows = ref<TvShow[]>([buildShow({ id: '1', genres: ['Drama', 'Crime'] })])

    const { genreGroups } = useGenreGroups(shows)

    expect(Object.keys(genreGroups.value)).toEqual(['Drama', 'Crime'])
  })
})
