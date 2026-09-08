import type { TvShow } from '../types/show.types'

export function buildShow(overrides: Partial<TvShow> = {}): TvShow {
  return {
    id: 'tt0903747',
    title: 'Breaking Bad',
    type: 'tvSeries',
    parentImdbId: null,
    description: 'A chemistry teacher turns to manufacturing meth.',
    image: 'https://example.com/image.jpg',
    trailer: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
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
    ...overrides,
  }
}
