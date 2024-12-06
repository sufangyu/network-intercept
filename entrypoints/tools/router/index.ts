import { createRouter, createWebHashHistory } from 'vue-router';
import AutoGotoUrl from '../modules/auto-goto-url/views/index.vue';

const routes = [
  {
    path: '/',
    redirect: { name: 'AutoGotoUrl' }
  },
  { path: '/auto-goto-url', component: AutoGotoUrl, name: 'AutoGotoUrl' },
  { path: '/auto-goto-xxx', component: AutoGotoUrl, name: 'AutoGotoUrl2' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
