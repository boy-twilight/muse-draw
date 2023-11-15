import { RouteRecordRaw } from 'vue-router';
import { PAGE_HOME } from '@/constants/page';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: PAGE_HOME,
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'draw',
        component: () => import('@/views/draw/index.vue'),
      },
    ],
  },
];
