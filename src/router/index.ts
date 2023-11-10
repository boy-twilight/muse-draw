import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';

declare module 'vue-router' {
  interface RouteMeta {
    isAuth?: boolean;
    title?: string;
  }
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition
      ? savedPosition
      : {
          left: 0,
          top: 0,
        };
  },
});

router.beforeEach((_to, _from, next) => {
  Nprogress.start();
  next();
});

router.afterEach((to) => {
  Nprogress.done();
  document.title = to.meta.title as string;
});

export default router;
