import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ShowDetail from './ShowDetail.vue'
import { buildShow } from '../test/showFixture'

describe('ShowDetail', () => {
  it('matches its rendered markup snapshot', () => {
    const wrapper = mount(ShowDetail, { props: { show: buildShow(), bookmarked: false } })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('shows the bookmarked state and emits toggle-bookmark on click', async () => {
    const wrapper = mount(ShowDetail, { props: { show: buildShow(), bookmarked: true } })

    expect(wrapper.text()).toContain('★ Bookmarked')

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('toggle-bookmark')).toHaveLength(1)
  })
})
