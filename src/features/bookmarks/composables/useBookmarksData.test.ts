import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useBookmarksData } from './useBookmarksData'
import { useBookmarksStore } from '../store/bookmarks.store'
import { buildShow } from '../../shows/test/showFixture'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('useBookmarksData', () => {
  it('mirrors the store bookmarks reactively', () => {
    const store = useBookmarksStore()
    const data = useBookmarksData()

    expect(data.bookmarks.value).toEqual([])

    const show = buildShow()
    store.toggleBookmark(show)

    expect(data.bookmarks.value).toEqual([show])
  })

  it('exposes the store actions', () => {
    const store = useBookmarksStore()
    const data = useBookmarksData()

    expect(data.isBookmarked).toBe(store.isBookmarked)
    expect(data.toggleBookmark).toBe(store.toggleBookmark)
  })
})
