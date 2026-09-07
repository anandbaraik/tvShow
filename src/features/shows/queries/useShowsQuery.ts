import { httpClient } from '../../../shared/api/httpClient'
import { mapToTvShows } from '../mappers/show.mapper'
import type { TvShow } from '../types/show.types'
import type { RawTvShow } from '../types/showApi.types'

const TOP_250_TV_ENDPOINT = '/top250-tv'

export function useShowsQuery() {
  async function fetchTopShows(): Promise<TvShow[]> {
    const { data } = await httpClient.get<RawTvShow[]>(TOP_250_TV_ENDPOINT)
    return mapToTvShows(data)
  }

  return { fetchTopShows }
}
