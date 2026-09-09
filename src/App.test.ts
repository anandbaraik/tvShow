import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from './App.vue'

describe('App', () => {
  it('renders the navbar and a router outlet', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          RouterView: { template: '<div data-testid="router-view" />' },
        },
      },
    })

    expect(wrapper.text()).toContain('TV Shows')
    expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true)
  })
})
