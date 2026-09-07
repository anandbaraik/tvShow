export interface RawTvShow {
  id: string
  url: string
  primaryTitle: string
  type: string
  parentImdbId: string | null
  description: string | null
  primaryImage: string | null
  trailer: string | null
  startYear: number | null
  endYear: number | null
  releaseDate: string | null
  interests: string[]
  filmingLocations: string[]
  genres: string[]
  runtimeMinutes: number | null
  averageRating: number | null
  numVotes: number | null
}
