import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'

import AppNavbar from './AppNavbar.vue'

const StubPage = { template: '<div />' }

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: StubPage },
      { path: '/bookmarks', component: StubPage },
      { path: '/about', component: StubPage },
    ],
  })
}

describe('AppNavbar', () => {
  it('renders the brand and nav links', async () => {
    const router = createTestRouter()
    router.push('/')
    await router.isReady()

    const wrapper = mount(AppNavbar, { global: { plugins: [router] } })

    const linkTexts = wrapper.findAll('a').map((a) => a.text())
    expect(linkTexts).toEqual(expect.arrayContaining(['TV Shows', 'Home', 'Bookmarks', 'About']))
  })

  it('marks Home active on /, and nothing else', async () => {
    const router = createTestRouter()
    router.push('/')
    await router.isReady()

    const wrapper = mount(AppNavbar, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')

    expect(links.find((a) => a.text() === 'Home')!.classes()).toContain('font-semibold')
    expect(links.find((a) => a.text() === 'Bookmarks')!.classes()).not.toContain('font-semibold')
    expect(links.find((a) => a.text() === 'About')!.classes()).not.toContain('font-semibold')
  })

  it('marks Bookmarks active on /bookmarks', async () => {
    const router = createTestRouter()
    router.push('/bookmarks')
    await router.isReady()

    const wrapper = mount(AppNavbar, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')

    expect(links.find((a) => a.text() === 'Bookmarks')!.classes()).toContain('font-semibold')
    expect(links.find((a) => a.text() === 'Home')!.classes()).not.toContain('font-semibold')
  })

  it('marks About active on /about', async () => {
    const router = createTestRouter()
    router.push('/about')
    await router.isReady()

    const wrapper = mount(AppNavbar, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')

    expect(links.find((a) => a.text() === 'About')!.classes()).toContain('font-semibold')
    expect(links.find((a) => a.text() === 'Home')!.classes()).not.toContain('font-semibold')
  })
})
