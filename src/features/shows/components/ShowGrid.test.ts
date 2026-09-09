import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ShowGrid from './ShowGrid.vue'
import { buildShow } from '../test/showFixture'

describe('ShowGrid', () => {
  it('matches its rendered markup snapshot', () => {
    const wrapper = mount(ShowGrid, {
      props: { shows: [buildShow(), buildShow({ id: 'tt0000002', title: 'The Wire' })] },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders one card per show', () => {
    const wrapper = mount(ShowGrid, {
      props: { shows: [buildShow(), buildShow({ id: 'tt0000002', title: 'The Wire' })] },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.findAll('img')).toHaveLength(2)
  })
})
