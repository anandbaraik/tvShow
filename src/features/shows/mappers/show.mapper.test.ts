import { describe, expect, it } from 'vitest'

import { mapToTvShow, mapToTvShows } from './show.mapper'
import type { RawTvShow } from '../types/showApi.types'

function buildRawShow(overrides: Partial<RawTvShow> = {}): RawTvShow {
  return {
    id: 'tt0903747',
    url: 'https://www.imdb.com/title/tt0903747/',
    primaryTitle: 'Breaking Bad',
    type: 'tvSeries',
    parentImdbId: null,
    description: 'A chemistry teacher turns to manufacturing meth.',
    primaryImage: 'https://example.com/image.jpg',
    trailer: null,
    startYear: 2008,
    endYear: 2013,
    releaseDate: '2008-01-20',
    interests: ['Crime'],
    filmingLocations: ['Albuquerque, New Mexico, USA'],
    genres: ['Crime', 'Drama'],
    runtimeMinutes: 47,
    averageRating: 9.5,
    numVotes: 2000000,
    ...overrides,
  }
}

describe('mapToTvShow', () => {
  it('renames and trims raw API fields into the domain shape', () => {
    const show = mapToTvShow(buildRawShow())

    expect(show).toEqual({
      id: 'tt0903747',
      title: 'Breaking Bad',
      type: 'tvSeries',
      parentImdbId: null,
      description: 'A chemistry teacher turns to manufacturing meth.',
      image: 'https://example.com/image.jpg',
      trailer: null,
      startYear: 2008,
      endYear: 2013,
      releaseDate: '2008-01-20',
      interests: ['Crime'],
      filmingLocations: ['Albuquerque, New Mexico, USA'],
      genres: ['Crime', 'Drama'],
      runtimeMinutes: 47,
      averageRating: 9.5,
      numVotes: 2000000,
      imdbUrl: 'https://www.imdb.com/title/tt0903747/',
    })
  })
})

describe('mapToTvShows', () => {
  it('maps every item in a raw show list', () => {
    const shows = mapToTvShows([buildRawShow({ id: 'a' }), buildRawShow({ id: 'b' })])

    expect(shows.map((show) => show.id)).toEqual(['a', 'b'])
  })
})
