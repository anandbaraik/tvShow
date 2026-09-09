import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../features/shows/views/HomeView.vue'),
  },
  {
    path: '/show/:id',
    name: 'show-detail',
    component: () => import('../features/shows/views/ShowDetailView.vue'),
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: () => import('../features/bookmarks/views/BookmarksView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../features/about/views/AboutView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
