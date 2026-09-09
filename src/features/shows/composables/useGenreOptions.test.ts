import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useGenreOptions } from './useGenreOptions'
import { buildShow } from '../test/showFixture'
import type { TvShow } from '../types/show.types'

describe('useGenreOptions', () => {
  it('returns a sorted, deduped list of genres across all shows', () => {
    const shows = ref<TvShow[]>([
      buildShow({ genres: ['Drama', 'Crime'] }),
      buildShow({ genres: ['Comedy', 'Drama'] }),
    ])

    const { genreOptions } = useGenreOptions(shows)

    expect(genreOptions.value).toEqual(['Comedy', 'Crime', 'Drama'])
  })

  it('returns an empty list when there are no shows', () => {
    const shows = ref<TvShow[]>([])

    const { genreOptions } = useGenreOptions(shows)

    expect(genreOptions.value).toEqual([])
  })
})
