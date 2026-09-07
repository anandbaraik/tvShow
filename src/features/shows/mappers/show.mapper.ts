import type { RawTvShow } from '../types/showApi.types'
import type { TvShow } from '../types/show.types'

export function mapToTvShow(raw: RawTvShow): TvShow {
  return {
    id: raw.id,
    title: raw.primaryTitle,
    type: raw.type,
    parentImdbId: raw.parentImdbId,
    description: raw.description,
    image: raw.primaryImage,
    trailer: raw.trailer,
    startYear: raw.startYear,
    endYear: raw.endYear,
    releaseDate: raw.releaseDate,
    interests: raw.interests,
    filmingLocations: raw.filmingLocations,
    genres: raw.genres,
    runtimeMinutes: raw.runtimeMinutes,
    averageRating: raw.averageRating,
    numVotes: raw.numVotes,
    imdbUrl: raw.url,
  }
}

export function mapToTvShows(raw: RawTvShow[]): TvShow[] {
  return raw.map(mapToTvShow)
}
