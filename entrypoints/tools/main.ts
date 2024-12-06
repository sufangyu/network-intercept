import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import '~/assets/css/tailwind.css';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const app = createApp(App);

app.use(router).use(ElementPlus, { locale: zhCn, size: 'small' }).mount('#app');
