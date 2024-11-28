<template>
  <div class="setting">
    <div class="setting-header">
      <h1>网络拦截</h1>
      <p>可从下面相应入口去设置规则, 开启/关闭功能</p>

      <div class="theme">
        <el-dropdown placement="bottom">
          <el-button plain :icon="currentTheme?.icon"></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in ThemeList"
                :key="item"
                :icon="item.icon"
                @click="setCurrentTheme(item.value)"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="setting-body">
      <div class="setting-item">
        <p class="label" @click="handleGotoPage('header-intercept')">
          请求头设置
          <el-icon>
            <Link />
          </el-icon>
        </p>
        <div>
          <el-switch
            v-model="headerInterceptConfig.toggle"
            inline-prompt
            active-text="启用"
            inactive-text="停用"
            size="default"
            @change="toggleHeaderIntercept"
          />
        </div>
      </div>

      <div class="setting-item">
        <p class="label" @click="handleGotoPage('response-mock')">
          响应数据 Mock
          <el-icon>
            <Link />
          </el-icon>
        </p>

        <div>
          <el-switch
            v-model="responseProject.toggle"
            inline-prompt
            active-text="启用"
            inactive-text="停用"
            size="default"
            @change="toggleProjectMockOrToast('mock')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Link } from "@element-plus/icons-vue";
import { useTheme } from "@/composables/use-theme";
import { useResponseMockProject } from "../response-mock/modules/mock/composables";
import { useHeaderIntercept } from "../header-intercept/modules/config/composables";

const { ThemeList, currentTheme, setCurrentTheme } = useTheme();

const {
  headerInterceptConfig,
  initHeaderInterceptConfig,
  toggleHeaderIntercept,
} = useHeaderIntercept();
const {
  responseProject,
  getProjectList,
  toggleProjectMockOrToast,
} = useResponseMockProject();

const handleGotoPage = (pageName: "header-intercept" | "response-mock") => {
  const curWindow = browser.extension.getViews({ type: "popup" })[0];
  const curOrigin = curWindow.location.origin;
  const pageUrl = `${curOrigin}/${pageName}.html`;
  windowHelper.open(pageUrl, pageName);
};

onMounted(async () => {
  initHeaderInterceptConfig();

  getProjectList();
});
</script>

<style lang="postcss" scoped>
.setting {
  @apply bg-[#fafafa] dark:bg-[#2d2d2d];
}

.setting-header {
  @apply relative bg-[#041527] text-white rounded-b-xl box-border dark:bg-[#141414];

  h1 {
    @apply text-lg pt-6 pb-1.5 pl-4;
  }
  p {
    @apply text-gray-400 pb-10 pl-4;
  }

  .theme {
    @apply absolute top-[26px] right-4;
  }
}

.setting-body {
  @apply relative z-10 px-4 pb-4 -mt-4;

  .setting-item {
    @apply bg-white p-4 flex items-center justify-between mb-3 rounded-xl dark:bg-[#1D1E1F];

    &:last-child {
      @apply mb-0;
    }

    .label {
      @apply text-base cursor-pointer flex items-center gap-1;
    }
  }
}
</style>
