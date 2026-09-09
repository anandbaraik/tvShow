import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ShowDetailView from './ShowDetailView.vue'
import { useShowsQuery } from '../queries/useShowsQuery'
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

describe('ShowDetailView', () => {
  it('shows a loading state, then the show once fetched', async () => {
    mockedUseShowsQuery.mockReturnValue({ fetchShowById: vi.fn().mockResolvedValue(show) } as never)

    const wrapper = mount(ShowDetailView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    await nextTick()
    expect(wrapper.text()).toContain('Loading show')

    await flushPromises()

    expect(wrapper.text()).toContain(show.title)
  })

  it('shows an error message when the fetch fails', async () => {
    mockedUseShowsQuery.mockReturnValue({
      fetchShowById: vi.fn().mockRejectedValue(new Error('boom')),
    } as never)

    const wrapper = mount(ShowDetailView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Failed to load show details')
  })

  it('toggles the bookmark state when the bookmark button is clicked', async () => {
    mockedUseShowsQuery.mockReturnValue({ fetchShowById: vi.fn().mockResolvedValue(show) } as never)

    const wrapper = mount(ShowDetailView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('☆ Bookmark')

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('★ Bookmarked')
  })
})
