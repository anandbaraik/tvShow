import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useShowsQuery } from './useShowsQuery'
import { httpClient } from '../../../shared/api/httpClient'
import type { RawTvShow } from '../types/showApi.types'

vi.mock('../../../shared/api/httpClient', () => ({
  httpClient: { get: vi.fn() },
}))

const mockedGet = vi.mocked(httpClient.get)

const rawShow: RawTvShow = {
  id: 'tt0903747',
  url: 'https://www.imdb.com/title/tt0903747/',
  primaryTitle: 'Breaking Bad',
  type: 'tvSeries',
  parentImdbId: null,
  description: null,
  primaryImage: null,
  trailer: null,
  startYear: 2008,
  endYear: 2013,
  releaseDate: null,
  interests: [],
  filmingLocations: [],
  genres: ['Drama'],
  runtimeMinutes: 47,
  averageRating: 9.5,
  numVotes: 2000000,
}

beforeEach(() => {
  mockedGet.mockReset()
})

describe('useShowsQuery', () => {
  it('fetchTopShows requests the top250 endpoint and maps the response', async () => {
    mockedGet.mockResolvedValue({ data: [rawShow] } as never)

    const shows = await useShowsQuery().fetchTopShows()

    expect(mockedGet).toHaveBeenCalledWith('/top250-tv')
    expect(shows[0]).toMatchObject({ id: 'tt0903747', title: 'Breaking Bad' })
  })

  it('fetchShowById requests the show by id', async () => {
    mockedGet.mockResolvedValue({ data: rawShow } as never)

    const show = await useShowsQuery().fetchShowById('tt0903747')

    expect(mockedGet).toHaveBeenCalledWith('/tt0903747')
    expect(show.title).toBe('Breaking Bad')
  })

  it('searchShows sends fixed params and omits an empty genre/title', async () => {
    mockedGet.mockResolvedValue({ data: { results: [] } } as never)

    await useShowsQuery().searchShows({ genre: '', title: '', sortOrder: 'DESC' })

    expect(mockedGet).toHaveBeenCalledWith('/search', {
      params: {
        type: 'tvSeries',
        rows: 25,
        sortField: 'averageRating',
        sortOrder: 'DESC',
        genre: undefined,
        primaryTitleAutocomplete: undefined,
      },
    })
  })

  it('searchShows includes genre and title when provided', async () => {
    mockedGet.mockResolvedValue({ data: { results: [rawShow] } } as never)

    const shows = await useShowsQuery().searchShows({ genre: 'Drama', title: 'veer', sortOrder: 'ASC' })

    expect(mockedGet).toHaveBeenCalledWith(
      '/search',
      expect.objectContaining({
        params: expect.objectContaining({ genre: 'Drama', primaryTitleAutocomplete: 'veer', sortOrder: 'ASC' }),
      }),
    )
    expect(shows).toHaveLength(1)
  })
})
