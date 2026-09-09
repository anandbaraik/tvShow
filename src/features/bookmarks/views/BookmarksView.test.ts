import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import BookmarksView from './BookmarksView.vue'
import { useBookmarksStore } from '../store/bookmarks.store'
import { buildShow } from '../../shows/test/showFixture'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('BookmarksView', () => {
  it('shows an empty state when there are no bookmarks', () => {
    const wrapper = mount(BookmarksView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).toContain('No bookmarked shows yet.')
  })

  it('renders a grid of the bookmarked shows', () => {
    const store = useBookmarksStore()
    const show = buildShow()
    store.toggleBookmark(show)

    const wrapper = mount(BookmarksView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).toContain(show.title)
    expect(wrapper.text()).not.toContain('No bookmarked shows yet.')
  })
})
