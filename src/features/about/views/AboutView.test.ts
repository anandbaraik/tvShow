import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AboutView from './AboutView.vue'

describe('AboutView', () => {
  it('renders the static heading and description', () => {
    const wrapper = mount(AboutView)

    expect(wrapper.find('h1').text()).toBe('About')
    expect(wrapper.text()).toContain('TV Show Dashboard')
  })
})
