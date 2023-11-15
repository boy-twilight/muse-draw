import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './routes';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';

// 进度条全局配置
Nprogress.configure({
  easing: 'ease', // 动画方式
  speed: 1000, // 递增进度条的速度
  showSpinner: false, // 进度环显示隐藏
  trickleSpeed: 400, // 自动递增间隔
  minimum: 0.2, // 更改启动时使用的最小百分比
  parent: 'body', // 指定进度条的父容器
});

declare module 'vue-router' {
  interface RouteMeta {
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

router.afterEach(() => {
  Nprogress.done();
});

export default router;
