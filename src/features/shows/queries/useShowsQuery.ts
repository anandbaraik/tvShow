import { httpClient } from '../../../shared/api/httpClient'
import { mapToTvShow, mapToTvShows } from '../mappers/show.mapper'
import type { TvShow } from '../types/show.types'
import type { RawTvShow } from '../types/showApi.types'

const TOP_250_TV_ENDPOINT = '/top250-tv'
const SEARCH_ENDPOINT = '/search'
const SEARCH_RESULTS_LIMIT = 25

export interface SearchShowsParams {
  genre?: string
  title?: string
  sortOrder: 'ASC' | 'DESC'
}

interface SearchShowsResponse {
  results: RawTvShow[]
}

export function useShowsQuery() {
  async function fetchTopShows(): Promise<TvShow[]> {
    const { data } = await httpClient.get<RawTvShow[]>(TOP_250_TV_ENDPOINT)
    return mapToTvShows(data)
  }

  async function fetchShowById(id: string): Promise<TvShow> {
    const { data } = await httpClient.get<RawTvShow>(`/${id}`)
    return mapToTvShow(data)
  }

  async function searchShows({ genre, title, sortOrder }: SearchShowsParams): Promise<TvShow[]> {
    const { data } = await httpClient.get<SearchShowsResponse>(SEARCH_ENDPOINT, {
      params: {
        type: 'tvSeries',
        rows: SEARCH_RESULTS_LIMIT,
        sortField: 'averageRating',
        sortOrder,
        genre: genre || undefined,
        primaryTitleAutocomplete: title || undefined,
      },
    })
    return mapToTvShows(data.results)
  }

  return { fetchTopShows, fetchShowById, searchShows }
}
