import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import HeroesView from '@/views/HeroesView.vue'
import HeroView from '@/views/HeroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesView
    },
    {
      path: '/hero/:heroId',
      name: 'hero',
      component: HeroView
    }
  ],
})

export default router
