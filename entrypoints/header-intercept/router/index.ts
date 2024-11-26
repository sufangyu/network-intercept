import { createRouter, createWebHashHistory } from 'vue-router';
import HeaderConfig from '../modules/config/views/index.vue';

const routes = [
  {
    path: '/',
    redirect: { name: 'HeaderConfig' }
  },
  { path: '/config', component: HeaderConfig, name: 'HeaderConfig' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
