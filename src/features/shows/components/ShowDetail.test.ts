import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ShowDetail from './ShowDetail.vue'
import { buildShow } from '../test/showFixture'

describe('ShowDetail', () => {
  it('matches its rendered markup snapshot', () => {
    const wrapper = mount(ShowDetail, { props: { show: buildShow() } })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
