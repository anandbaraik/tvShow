import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useHomePage } from './useHomePage'
import { useShowsQuery } from '../queries/useShowsQuery'
import { withSetup } from '../../../shared/test/withSetup'
import { buildShow } from '../test/showFixture'

vi.mock('../queries/useShowsQuery', () => ({
  useShowsQuery: vi.fn(),
}))

const mockedUseShowsQuery = vi.mocked(useShowsQuery)

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useHomePage', () => {
  it('fetches the top shows list on mount', () => {
    const fetchTopShows = vi.fn().mockResolvedValue([buildShow()])
    const searchShows = vi.fn().mockResolvedValue([])
    mockedUseShowsQuery.mockReturnValue({ fetchTopShows, searchShows } as never)

    const [, app] = withSetup(useHomePage)

    expect(fetchTopShows).toHaveBeenCalledTimes(1)

    app.unmount()
  })

  it('isFiltering reflects genre, search, and sort state', async () => {
    const fetchTopShows = vi.fn().mockResolvedValue([buildShow()])
    const searchShows = vi.fn().mockResolvedValue([])
    mockedUseShowsQuery.mockReturnValue({ fetchTopShows, searchShows } as never)

    const [page, app] = withSetup(useHomePage)

    expect(page.isFiltering.value).toBe(false)

    page.selectedGenre.value = 'Drama'
    await nextTick()
    expect(page.isFiltering.value).toBe(true)

    page.selectedGenre.value = ''
    page.sortOrder.value = 'ASC'
    await nextTick()
    expect(page.isFiltering.value).toBe(true)

    app.unmount()
  })

  it('calls searchShows immediately when genre or sort changes', async () => {
    const fetchTopShows = vi.fn().mockResolvedValue([buildShow()])
    const searchShows = vi.fn().mockResolvedValue([])
    mockedUseShowsQuery.mockReturnValue({ fetchTopShows, searchShows } as never)

    const [page, app] = withSetup(useHomePage)

    page.selectedGenre.value = 'Drama'
    await nextTick()

    expect(searchShows).toHaveBeenCalledWith({ genre: 'Drama', title: '', sortOrder: 'DESC' })

    app.unmount()
  })

  it('debounces searchShows when typing a search term', async () => {
    const fetchTopShows = vi.fn().mockResolvedValue([buildShow()])
    const searchShows = vi.fn().mockResolvedValue([])
    mockedUseShowsQuery.mockReturnValue({ fetchTopShows, searchShows } as never)

    vi.useFakeTimers()
    const [page, app] = withSetup(useHomePage)

    page.searchTerm.value = 'veer'
    await nextTick()
    expect(searchShows).not.toHaveBeenCalled()

    vi.advanceTimersByTime(400)
    await nextTick()

    expect(searchShows).toHaveBeenCalledWith({ genre: '', title: 'veer', sortOrder: 'DESC' })

    app.unmount()
  })
})
