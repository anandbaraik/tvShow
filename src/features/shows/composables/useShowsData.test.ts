import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useShowsData } from './useShowsData'
import { useShowsStore } from '../store/shows.store'
import { buildShow } from '../test/showFixture'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useShowsData', () => {
  it('mirrors store state reactively', () => {
    const store = useShowsStore()
    const data = useShowsData()

    expect(data.shows.value).toEqual([])

    const show = buildShow()
    store.shows = [show]

    expect(data.shows.value).toEqual([show])
  })

  it('exposes the store actions', () => {
    const store = useShowsStore()
    const data = useShowsData()

    expect(data.fetchShows).toBe(store.fetchShows)
    expect(data.fetchShowById).toBe(store.fetchShowById)
    expect(data.searchShows).toBe(store.searchShows)
  })
})
