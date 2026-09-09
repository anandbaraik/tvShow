import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomeView from './HomeView.vue'
import { useShowsQuery } from '../queries/useShowsQuery'
import { buildShow } from '../test/showFixture'

vi.mock('../queries/useShowsQuery', () => ({
  useShowsQuery: vi.fn(),
}))

const mockedUseShowsQuery = vi.mocked(useShowsQuery)

const dramaShow = buildShow({ id: 'tt1', title: 'Drama Show', genres: ['Drama'] })
const comedyShow = buildShow({ id: 'tt2', title: 'Comedy Show', genres: ['Comedy'] })

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('HomeView', () => {
  it('shows a loading state, then genre rows grouped from the top shows list', async () => {
    mockedUseShowsQuery.mockReturnValue({
      fetchTopShows: vi.fn().mockResolvedValue([dramaShow, comedyShow]),
      searchShows: vi.fn(),
    } as never)

    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    await nextTick()
    expect(wrapper.text()).toContain('Loading shows')

    await flushPromises()

    expect(wrapper.findAll('h2').map((h) => h.text())).toEqual(expect.arrayContaining(['Drama', 'Comedy']))
  })

  it('switches to a flat results grid when a genre is selected', async () => {
    const searchShows = vi.fn().mockResolvedValue([dramaShow])
    mockedUseShowsQuery.mockReturnValue({
      fetchTopShows: vi.fn().mockResolvedValue([dramaShow, comedyShow]),
      searchShows,
    } as never)

    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    await flushPromises()

    await wrapper.find('select').setValue('Drama')
    await flushPromises()

    expect(searchShows).toHaveBeenCalledWith({ genre: 'Drama', title: '', sortOrder: 'DESC' })
    expect(wrapper.findAll('h2')).toHaveLength(0)
    expect(wrapper.text()).toContain('Drama Show')
  })

  it('shows "No shows found." when a search returns nothing', async () => {
    mockedUseShowsQuery.mockReturnValue({
      fetchTopShows: vi.fn().mockResolvedValue([dramaShow]),
      searchShows: vi.fn().mockResolvedValue([]),
    } as never)

    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    await flushPromises()

    await wrapper.find('select').setValue('Drama')
    await flushPromises()

    expect(wrapper.text()).toContain('No shows found.')
  })
})
