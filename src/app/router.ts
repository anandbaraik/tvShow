import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../features/shows/views/HomeView.vue'),
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
