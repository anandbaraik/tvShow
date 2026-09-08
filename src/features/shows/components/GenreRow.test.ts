import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import GenreRow from './GenreRow.vue'
import { buildShow } from '../test/showFixture'

describe('GenreRow', () => {
  it('matches its rendered markup snapshot', () => {
    const wrapper = mount(GenreRow, {
      props: {
        genre: 'Drama',
        shows: [buildShow(), buildShow({ id: 'tt0000002', title: 'The Wire', averageRating: 9.3 })],
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
