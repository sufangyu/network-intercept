<template>
  <section class="app-header">
    <div
      class="flex items-center gap-2 cursor-pointer"
      @click="() => windowHelper.close()"
    >
      <img class="block w-5" :src="IconHeader" alt="Mock" />
      <span>请求头设置</span>
    </div>

    <div class="app-header__right">
      <el-switch
        v-model="headerInterceptConfig.toggle"
        size="large"
        inline-prompt
        active-text="启用"
        inactive-text="停用"
        @change="toggleHeaderIntercept"
      />

      <el-button
        type="primary"
        @click="handleOperate(HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM.添加分组)"
      >
        添加分组
      </el-button>

      <el-dropdown>
        <el-button link :icon="MoreFilled"></el-button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled :divided="false">
              <el-icon><QuestionFilled /></el-icon>帮助中心
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { MoreFilled, QuestionFilled } from "@element-plus/icons-vue";
import IconHeader from "~/assets/header.svg";
import { HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM } from "../types";
import { useHeaderIntercept } from "../composables";

const emit = defineEmits<{
  operate: [type: HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM];
}>();

const { headerInterceptConfig, toggleHeaderIntercept } = useHeaderIntercept();

const handleOperate = (type: HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM) => {
  emit("operate", type);
};
</script>

<style lang="scss" scoped>
.app-header {
  @apply flex items-center justify-between p-[16px]
    h-[64px] text-white bg-[#001529] text-sm;

  &__right {
    @apply flex items-center gap-4;
  }
}
</style>
