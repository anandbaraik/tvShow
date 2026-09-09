import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useBookmarksPage } from './useBookmarksPage'
import { useBookmarksStore } from '../store/bookmarks.store'
import { buildShow } from '../../shows/test/showFixture'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('useBookmarksPage', () => {
  it('returns the current bookmarks list', () => {
    const store = useBookmarksStore()
    const show = buildShow()
    store.toggleBookmark(show)

    const { bookmarks } = useBookmarksPage()

    expect(bookmarks.value).toEqual([show])
  })
})
