<template>
  <section class="app-header">
    <div
      class="flex items-center gap-2 cursor-pointer"
      @click="() => windowHelper.close()"
    >
      <img class="block w-5" :src="IconMock" alt="Mock" />
      <span>项目列表</span>
    </div>

    <div class="app-header__right">
      <div class="mr-4">
        <GlobalSearch />
      </div>

      <el-switch
        v-model="responseProject.toggle"
        size="default"
        inline-prompt
        active-text="启用"
        inactive-text="停用"
        @change="toggleProjectMockOrToast('mock')"
      />

      <el-button
        type="primary"
        @click="handleOperate(PROJECT_APP_HEADER_OPERATE_ENUM.添加项目)"
      >
        添加项目
      </el-button>

      <el-dropdown>
        <el-button link :icon="MoreFilled"></el-button>
        <template #dropdown>
          <el-dropdown-menu class="w-28">
            <!-- <el-dropdown-item :icon="Download" @click="handleExportConfig">
              导出项目配置
            </el-dropdown-item>
            -->
            <el-dropdown-item :icon="Upload" @click="() => fileInputRef?.click()">
              <input
                type="file"
                ref="fileInputRef"
                class="hidden"
                accept=".json"
                @change="(ev) => handleImportProjectConfig(ev)"
              />
              导入项目
            </el-dropdown-item>
            <el-dropdown-item :icon="MagicStick" divided>
              <el-tooltip
                effect="dark"
                content="Mock成功后, 是否在底部显示提醒？"
                placement="top"
              >
                <span class="flex items-center">
                  <el-switch
                    v-model="responseProject.toast"
                    inline-prompt
                    active-text="提醒"
                    inactive-text="不提醒"
                    @change="toggleProjectMockOrToast('toast')"
                  />
                </span>
              </el-tooltip>
            </el-dropdown-item>
            <el-dropdown-item disabled :icon="QuestionFilled" divided>
              帮助中心
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </section>

  <!-- 导入项目 -->
  <ImportProjectDialog ref="importProjectDialogRef" />
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { MoreFilled, Upload, MagicStick, QuestionFilled } from "@element-plus/icons-vue";
import IconMock from "~/assets/mock.svg";
import { PROJECT_APP_HEADER_OPERATE_ENUM } from "../../../types";
import { useResponseMockImport, useResponseMockProject } from "../../../composables";
import ImportProjectDialog from "../../../components/import-project-dialog/index.vue";
import GlobalSearch from "../../../components/global-search/index.vue";

const emit = defineEmits<{
  operate: [type: PROJECT_APP_HEADER_OPERATE_ENUM];
}>();

const { responseProject, toggleProjectMockOrToast } = useResponseMockProject();
const {
  fileInputRef,
  importProjectDialogRef,
  handleImportProjectConfig,
} = useResponseMockImport();

const handleOperate = (type: PROJECT_APP_HEADER_OPERATE_ENUM) => {
  emit("operate", type);
};

// 导出配置 -------------------------------------------------------------------
const handleExportConfig = () => {
  exportFile(responseProject.value, "response-mock-config.json");
  ElMessage.success({ message: "导出成功", grouping: true });
};

// 导入配置 -------------------------------------------------------------------
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
