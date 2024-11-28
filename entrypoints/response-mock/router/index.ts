import { createRouter, createWebHashHistory } from 'vue-router';
import Project from '../modules/mock/views/project/index.vue';
import Group from '../modules/mock/views/group/index.vue';

const routes = [
  {
    path: '/',
    redirect: { name: 'Project' }
  },
  { path: '/project', component: Project, name: 'Project' },
  { path: '/group/:id', component: Group, name: 'Group' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
