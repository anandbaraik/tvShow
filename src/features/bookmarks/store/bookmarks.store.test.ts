import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useBookmarksStore } from './bookmarks.store'
import { buildShow } from '../../shows/test/showFixture'

const STORAGE_KEY = 'tvshow.bookmarks'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('bookmarks store', () => {
  it('starts empty when localStorage has nothing saved', () => {
    const store = useBookmarksStore()

    expect(store.bookmarks).toEqual([])
    expect(store.isBookmarked('tt0903747')).toBe(false)
  })

  it('loads existing bookmarks from localStorage on creation', () => {
    const show = buildShow()
    localStorage.setItem(STORAGE_KEY, JSON.stringify([show]))

    const store = useBookmarksStore()

    expect(store.bookmarks).toEqual([show])
    expect(store.isBookmarked(show.id)).toBe(true)
  })

  it('toggleBookmark adds then removes a show', () => {
    const show = buildShow()
    const store = useBookmarksStore()

    store.toggleBookmark(show)
    expect(store.isBookmarked(show.id)).toBe(true)
    expect(store.bookmarks).toHaveLength(1)

    store.toggleBookmark(show)
    expect(store.isBookmarked(show.id)).toBe(false)
    expect(store.bookmarks).toHaveLength(0)
  })

  it('persists bookmarks to localStorage after a toggle', async () => {
    const show = buildShow()
    const store = useBookmarksStore()

    store.toggleBookmark(show)
    await vi.waitFor(() => {
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([show])
    })
  })
})
