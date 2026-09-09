import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useShowsStore } from './shows.store'
import { useShowsQuery } from '../queries/useShowsQuery'
import { buildShow } from '../test/showFixture'

vi.mock('../queries/useShowsQuery', () => ({
  useShowsQuery: vi.fn(),
}))

const mockedUseShowsQuery = vi.mocked(useShowsQuery)

beforeEach(() => {
  setActivePinia(createPinia())
  mockedUseShowsQuery.mockReset()
})

describe('shows store — fetchShows', () => {
  it('goes idle -> loading -> success and stores the shows', async () => {
    const shows = [buildShow()]
    const fetchTopShows = vi.fn().mockResolvedValue(shows)
    mockedUseShowsQuery.mockReturnValue({ fetchTopShows } as never)

    const store = useShowsStore()
    expect(store.status).toBe('idle')

    const promise = store.fetchShows()
    expect(store.status).toBe('loading')

    await promise

    expect(store.status).toBe('success')
    expect(store.shows).toEqual(shows)
    expect(store.error).toBeNull()
  })

  it('goes to the error state when the query rejects', async () => {
    const fetchTopShows = vi.fn().mockRejectedValue(new Error('network down'))
    mockedUseShowsQuery.mockReturnValue({ fetchTopShows } as never)

    const store = useShowsStore()
    await store.fetchShows()

    expect(store.status).toBe('error')
    expect(store.error).toBe('Failed to load TV shows. Please try again.')
  })

  it('skips fetching again while already loading or after success', async () => {
    const fetchTopShows = vi.fn().mockResolvedValue([buildShow()])
    mockedUseShowsQuery.mockReturnValue({ fetchTopShows } as never)

    const store = useShowsStore()

    const first = store.fetchShows()
    const second = store.fetchShows()
    await Promise.all([first, second])
    await store.fetchShows()

    expect(fetchTopShows).toHaveBeenCalledTimes(1)
  })
})

describe('shows store — fetchShowById', () => {
  it('fetches and caches a show by id', async () => {
    const show = buildShow()
    const fetchShowById = vi.fn().mockResolvedValue(show)
    mockedUseShowsQuery.mockReturnValue({ fetchShowById } as never)

    const store = useShowsStore()
    await store.fetchShowById(show.id)

    expect(store.showDetails[show.id]).toEqual(show)
    expect(store.detailStatus).toBe('success')

    await store.fetchShowById(show.id)
    expect(fetchShowById).toHaveBeenCalledTimes(1)
  })

  it('sets the detail error state when the query rejects', async () => {
    const fetchShowById = vi.fn().mockRejectedValue(new Error('not found'))
    mockedUseShowsQuery.mockReturnValue({ fetchShowById } as never)

    const store = useShowsStore()
    await store.fetchShowById('missing-id')

    expect(store.detailStatus).toBe('error')
    expect(store.detailError).toBe('Failed to load show details. Please try again.')
  })
})

describe('shows store — searchShows', () => {
  it('stores search results on success', async () => {
    const results = [buildShow({ id: 'tt1' }), buildShow({ id: 'tt2' })]
    const searchShows = vi.fn().mockResolvedValue(results)
    mockedUseShowsQuery.mockReturnValue({ searchShows } as never)

    const store = useShowsStore()
    const params = { genre: 'Drama', title: '', sortOrder: 'DESC' as const }
    await store.searchShows(params)

    expect(searchShows).toHaveBeenCalledWith(params)
    expect(store.searchStatus).toBe('success')
    expect(store.searchResults).toEqual(results)
  })

  it('sets the search error state when the query rejects', async () => {
    const searchShows = vi.fn().mockRejectedValue(new Error('boom'))
    mockedUseShowsQuery.mockReturnValue({ searchShows } as never)

    const store = useShowsStore()
    await store.searchShows({ genre: '', title: '', sortOrder: 'ASC' })

    expect(store.searchStatus).toBe('error')
    expect(store.searchError).toBe('Failed to search TV shows. Please try again.')
  })
})
