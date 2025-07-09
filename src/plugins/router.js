import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import HeroesListView from '@/views/Heroes/HeroesListView.vue';
import HeroesDetailView from '@/views/Heroes/HeroesDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/heroes',
    name: 'heroes',
    redirect: { name: 'heroes.list' },
    children: [
      {
        path: '',
        name: 'heroes.list',
        component: HeroesListView,
      },
      {
        path: ':id',
        name: 'heroes.detail',
        component: HeroesDetailView,
        props: true,
        meta: { mainClass: 'container-fluid' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
