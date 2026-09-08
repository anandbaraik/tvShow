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
})
