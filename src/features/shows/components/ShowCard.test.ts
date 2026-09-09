import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ShowCard from './ShowCard.vue'
import { buildShow } from '../test/showFixture'

const show = buildShow()

describe('ShowCard', () => {
  it('renders the title, poster, and rating', () => {
    const wrapper = mount(ShowCard, {
      props: { show },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).toContain('Breaking Bad')
    expect(wrapper.text()).toContain('9.5')
    expect(wrapper.find('img').attributes('src')).toBe(show.image)
  })

  it('omits the rating badge when averageRating is missing', () => {
    const wrapper = mount(ShowCard, {
      props: { show: { ...show, averageRating: null } },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).not.toContain('★')
  })

  it('matches its rendered markup snapshot', () => {
    const wrapper = mount(ShowCard, {
      props: { show },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
