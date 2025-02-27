import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import HeroesView from '@/views/HeroesView.vue'
import HeroView from '@/views/HeroView.vue'
import HeroViewBak from '@/views/HeroViewBak.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: HeroesView,
    },
    {
      path: '/hero/:heroId',
      name: 'hero',
      component: HeroView,
    },
    {
      path: '/hero_bak/:heroId',
      name: 'hero_bak',
      component: HeroViewBak,
    },
  ],
})

export default router
