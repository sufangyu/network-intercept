<template>
  <div class="tools-setting">
    <header class="tools-setting__header">
      <h1>
        <el-icon size="24"><ChromeFilled /></el-icon>
        设置
      </h1>
    </header>

    <article class="tools-setting__main">
      <aside class="aside">
        <el-scrollbar class="scrollbar" style="height: 100%">
          <div class="menu">
            <template v-for="(item, idx) in MenuList" :key="item.pageName">
              <span role="separator" v-if="item.divider" class="menu-link__divider" />
              <component
                class="menu-link"
                :class="item.disabled ? 'menu-link--disabled' : ''"
                :to="item.disabled ? undefined : { name: item.pageName }"
                :is="item.disabled ? 'span' : 'router-link'"
              >
                <el-icon size="18"><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </component>
            </template>
          </div>
        </el-scrollbar>
      </aside>
      <section class="content">
        <el-scrollbar class="scrollbar" style="height: 100%">
          <RouterView />
        </el-scrollbar>
      </section>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { ChromeFilled } from "@element-plus/icons-vue";
import { MenuList } from "./const/menu";
</script>

<style lang="postcss" scoped>
.tools-setting__header {
  @apply h-14 flex items-center px-5;

  h1 {
    @apply flex gap-2 items-center text-2xl;
  }
}
.tools-setting__main {
  @apply flex;
}

.aside {
  height: calc(100vh - 56px);
  @apply w-64 py-2;

  .menu-link {
    @apply flex items-center gap-4 h-10 rounded-r-full pl-5 text-[15px] font-normal my-[1px]
    hover:bg-[#E8EAED] hover:text-inherit
    dark:hover:bg-[#3C4043] dark:hover:text-white;

    &.router-link-active {
      @apply bg-[#E7F0FD] text-[#0055CC] 
      dark:bg-[#86B3F5] dark:text-[#000000];
    }
  }

  .menu-link--disabled {
    @apply cursor-not-allowed text-black/60 dark:text-[#505458]
      hover:text-black/60 
      dark:text-white/60;
  }

  .menu-link__divider {
    @apply block w-full h-[1px] my-2 
      bg-gray-200
      dark:bg-gray-700;
  }
}

.content {
  height: calc(100vh - 56px);
  @apply flex-1;
}
</style>
