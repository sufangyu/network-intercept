import { defineConfig } from 'wxt';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import nodePolyfills from 'rollup-plugin-polyfill-node';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [
      // See https://vue-i18n.intlify.dev/guide/advanced/optimization.html
      vueI18n({
        include: 'assets/locales/*.json'
      })
    ],
    optimizeDeps: {
      include: [],
      exclude: []
    },
    define: {},
    external: [],
    resolve: {
      alias: {}
    },
    build: {
      rollupOptions: {
        plugins: [nodePolyfills()],
        external: []
      }
    }
  }),
  manifest: {
    name: '__MSG_extName__',
    default_locale: 'zh', // 不能配置 zh_CN, 否则会报错
    web_accessible_resources: [
      {
        resources: ['injected.js'],
        matches: ['*://*/*']
      }
    ],
    permissions: [
      // 'webRequest',
      'storage',
      'tabs',
      'declarativeNetRequest',
      'declarativeNetRequestWithHostAccess',
      'declarativeNetRequestFeedback',
      'webNavigation',
      'activeTab' // 确保可以访问当前激活的标签页
    ],
    host_permissions: ['<all_urls>']
  }
});
