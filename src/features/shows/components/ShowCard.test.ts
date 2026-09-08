import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ShowCard from './ShowCard.vue'
import { buildShow } from '../test/showFixture'
import type { TvShow } from '../types/show.types'

const show = buildShow()

function mountShowCard(props: { show: TvShow }) {
  return mount(ShowCard, {
    props,
    global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
  })
}

describe('ShowCard', () => {
  it('renders the title, poster, and rating', () => {
    const wrapper = mountShowCard({ show })

    expect(wrapper.text()).toContain('Breaking Bad')
    expect(wrapper.text()).toContain('9.5')
    expect(wrapper.find('img').attributes('src')).toBe(show.image)
  })

  it('omits the rating badge when averageRating is missing', () => {
    const wrapper = mountShowCard({ show: { ...show, averageRating: null } })

    expect(wrapper.text()).not.toContain('★')
  })

  it('matches its rendered markup snapshot', () => {
    const wrapper = mountShowCard({ show })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
