<template>
  <div class="setting">
    <div class="setting-header">
      <h1>网络拦截</h1>
      <p>可从下面相应入口去设置或开/关功能</p>
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
import { useResponseMockProject } from "../response-mock/modules/composables";
import { useHeaderIntercept } from "../header-intercept/modules/config/composables";

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

const setting = ref<{ headerEdit: boolean; mock: boolean }>({
  headerEdit: true,
  mock: true,
});

onMounted(async () => {
  initHeaderInterceptConfig();

  getProjectList();
});
</script>

<style lang="postcss" scoped>
.setting {
  @apply bg-[#FAFAFA];
}

.setting-header {
  @apply bg-[#041527] text-white rounded-b-xl box-border;

  h1 {
    @apply text-lg pt-6 pb-1.5 pl-4;
  }
  p {
    @apply text-gray-400 pb-10 pl-4;
  }
}

.setting-body {
  @apply px-4 pb-4 -mt-4;

  .setting-item {
    @apply bg-white p-4 flex items-center justify-between mb-3 rounded-xl;

    &:last-child {
      @apply mb-0;
    }

    .label {
      @apply text-base cursor-pointer flex items-center gap-1;
    }
  }
}
</style>
