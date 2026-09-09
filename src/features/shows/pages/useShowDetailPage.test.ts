import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useShowDetailPage } from './useShowDetailPage'
import { useShowsQuery } from '../queries/useShowsQuery'
import { withSetup } from '../../../shared/test/withSetup'
import { buildShow } from '../test/showFixture'

const show = buildShow()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: show.id } }),
}))

vi.mock('../queries/useShowsQuery', () => ({
  useShowsQuery: vi.fn(),
}))

const mockedUseShowsQuery = vi.mocked(useShowsQuery)

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('useShowDetailPage', () => {
  it('fetches the show by the route id on mount', () => {
    const fetchShowById = vi.fn().mockResolvedValue(show)
    mockedUseShowsQuery.mockReturnValue({ fetchShowById } as never)

    const [, app] = withSetup(useShowDetailPage)

    expect(fetchShowById).toHaveBeenCalledWith(show.id)

    app.unmount()
  })

  it('exposes the fetched show once loaded', async () => {
    const fetchShowById = vi.fn().mockResolvedValue(show)
    mockedUseShowsQuery.mockReturnValue({ fetchShowById } as never)

    const [page, app] = withSetup(useShowDetailPage)
    await vi.waitFor(() => expect(page.status.value).toBe('success'))

    expect(page.show.value).toEqual(show)

    app.unmount()
  })

  it('reflects and toggles the bookmarked state', async () => {
    const fetchShowById = vi.fn().mockResolvedValue(show)
    mockedUseShowsQuery.mockReturnValue({ fetchShowById } as never)

    const [page, app] = withSetup(useShowDetailPage)
    await vi.waitFor(() => expect(page.status.value).toBe('success'))

    expect(page.bookmarked.value).toBe(false)

    page.toggleShowBookmark()
    await nextTick()

    expect(page.bookmarked.value).toBe(true)

    app.unmount()
  })
})
