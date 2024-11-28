<template>
  <section class="app-header">
    <el-page-header @back="$router.back()">
      <template #content>
        <span class="text-white mr-3">{{ project?.name ?? "-" }}</span>
      </template>
    </el-page-header>

    <div class="app-header__right" v-if="project">
      <el-switch
        v-model="project!.status"
        size="default"
        inline-prompt
        :active-value="STATUS_GLOBAL_ENUM.启用"
        :inactive-value="STATUS_GLOBAL_ENUM.停用"
        active-text="启用"
        inactive-text="停用"
        @change="() => toggleProjectStatus(project!, false)"
      />

      <el-button
        type="primary"
        @click="handleOperate(GROUP_APP_HEADER_OPERATE_ENUM.添加分组)"
      >
        添加分组
      </el-button>

      <el-dropdown>
        <el-button link :icon="MoreFilled"></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="Download" @click="() => fileInputRef?.click()">
              <input
                type="file"
                ref="fileInputRef"
                class="hidden"
                accept=".json"
                @change="(ev) => handleImportProjectConfig(ev, project!)"
              />
              导入数据
            </el-dropdown-item>

            <el-dropdown-item :icon="Upload" @click="handleExportConfig">
              导出数据
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
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { MoreFilled, Download, Upload } from "@element-plus/icons-vue";
import { STATUS_GLOBAL_ENUM } from "@/types";
import { GROUP_APP_HEADER_OPERATE_ENUM, ResponseProjectItem } from "../../../types";
import { useResponseMockProject, useResponseMockImport } from "../../../composables";
import ImportProjectDialog from "../../../components/import-project-dialog/index.vue";

const props = withDefaults(defineProps<{ project?: ResponseProjectItem | null }>(), {
  project: null,
});
const emit = defineEmits<{
  operate: [type: GROUP_APP_HEADER_OPERATE_ENUM];
}>();

const $router = useRouter();
const { toggleProjectStatus } = useResponseMockProject();
const {
  fileInputRef,
  importProjectDialogRef,
  handleImportProjectConfig,
} = useResponseMockImport();

const handleOperate = (type: GROUP_APP_HEADER_OPERATE_ENUM) => {
  emit("operate", type);
};

// 导入、导出项目 ---------------------------------------
const handleExportConfig = () => {
  const filename = `${props.project?.name}.api.json`;
  exportFile(props.project!, filename);
  ElMessage.success({ message: "导出成功", grouping: true });
};
</script>

<style lang="scss" scoped>
.app-header {
  @apply flex items-center justify-between p-[16px]
    h-[64px] text-white bg-[#001529] text-sm
    dark:bg-[#010101];

  &__right {
    @apply flex items-center gap-4;
  }
}

.project-option {
  height: auto;
  line-height: 1.5;
  border-bottom: 1px solid #f0f0f0;
  padding-top: 8px;
  padding-bottom: 8px;

  p {
    padding: 3px 0;
  }
}
</style>
