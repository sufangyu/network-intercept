import { createRouter, createWebHashHistory } from 'vue-router';
import Project from '../modules/views/project/index.vue';
import Group from '../modules/views/group/index.vue';
// import GroupOld from '../views/group/index.vue';

const routes = [
  {
    path: '/',
    redirect: { name: 'Project' }
  },
  { path: '/project', component: Project, name: 'Project' },
  { path: '/group/:id', component: Group, name: 'Group' },
  // { path: '/group-old', component: GroupOld, name: 'GroupOld' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
