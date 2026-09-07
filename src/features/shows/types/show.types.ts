export interface TvShow {
  id: string
  title: string
  type: string
  parentImdbId: string | null
  description: string | null
  image: string | null
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
  imdbUrl: string
}
