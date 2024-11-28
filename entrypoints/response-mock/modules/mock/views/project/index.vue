<template>
  <AppHeader @operate="handleOperate" />

  <el-scrollbar class="main-content">
    <section class="grid grid-cols-4 gap-4 p-4" v-if="projectList.length > 0">
      <div
        class="project-item"
        v-for="projectItem in projectList"
        @click="$router.push({ name: 'Group', params: { id: projectItem.id } })"
      >
        <div class="flex justify-between items-center mb-5">
          <span
            :class="[
              'bg-blue-200',
              'w-10',
              'h-10',
              'rounded-full',
              'flex',
              'justify-center',
              'items-center',
              'text-sm',
              'dark:bg-[#2C9DFB]',
            ]"
          >
            {{ projectItem.name?.[0]?.toUpperCase() || "-" }}
          </span>
          <div class="flex gap-2">
            <el-button
              :icon="projectItem.collected ? StarFilled : Star"
              :type="projectItem.collected ? 'primary' : ''"
              size="large"
              link
              @click.stop="toggleProjectCollected(projectItem)"
            />
            <el-dropdown>
              <el-button @click.stop="() => {}" :icon="MoreFilled" link size="large" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :icon="TurnOff"
                    @click.stop="toggleProjectStatus(projectItem)"
                  >
                    {{
                      projectItem.status === STATUS_GLOBAL_ENUM.停用
                        ? "启用项目"
                        : "停用项目"
                    }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    :icon="EditPen"
                    @click.stop="handleProjectEdit(projectItem)"
                  >
                    编辑项目
                  </el-dropdown-item>
                  <el-dropdown-item
                    :icon="Delete"
                    @click.stop="handleProjectDelete(projectItem)"
                  >
                    删除项目
                  </el-dropdown-item>
                  <el-dropdown-item :icon="Upload" divided>
                    <input
                      type="file"
                      ref="fileInputRef"
                      class="hidden"
                      accept=".json"
                      @change="handleImportProjectConfig"
                    />
                    导入数据
                  </el-dropdown-item>
                  <el-dropdown-item
                    :icon="Download"
                    @click.stop="handleExportProjectConfig(projectItem)"
                  >
                    导出数据
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg">{{ projectItem.name || "-" }}</h3>
          <el-tag
            :type="projectItem.status === STATUS_GLOBAL_ENUM.停用 ? 'danger' : 'primary'"
          >
            {{ getEnumKeyByValue(STATUS_GLOBAL_ENUM, projectItem.status) }}
          </el-tag>
        </div>
        <p class="line-clamp-2 text-gray-500">
          {{ projectItem.description || "-" }}
          <!--  - {{ projectItem.id }} -->
        </p>
      </div>
    </section>

    <el-empty class="mt-20" v-if="projectList.length === 0" description="暂无项目数据" />
  </el-scrollbar>

  <!-- 项目添加、编辑 -->
  <EditorDialog ref="editorDialogRef" />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Star,
  StarFilled,
  MoreFilled,
  TurnOff,
  EditPen,
  Delete,
  Download,
  Upload,
} from "@element-plus/icons-vue";
import { STATUS_GLOBAL_ENUM } from "@/types";
import { responseProject } from "../../data/index";
import { PROJECT_APP_HEADER_OPERATE_ENUM, ResponseProjectItem } from "../../types";
import { useResponseMockImport, useResponseMockProject } from "../../composables";
import AppHeader from "./components/app-header.vue";
import EditorDialog from "./components/editor-dialog.vue";

const $router = useRouter();
const {
  deleteProject,
  toggleProjectStatus,
  toggleProjectCollected,
} = useResponseMockProject();
const { handleImportProjectConfig } = useResponseMockImport();

/** 全部项目 */
const projectList = computed(() => responseProject.value.list ?? []);

/** 处理头部操作事件回调 */
const handleOperate = (type: PROJECT_APP_HEADER_OPERATE_ENUM) => {
  const operateFuncMap: Record<PROJECT_APP_HEADER_OPERATE_ENUM, () => any> = {
    [PROJECT_APP_HEADER_OPERATE_ENUM.添加项目]: () => handleProjectEdit(),
  };

  operateFuncMap[type]?.();
};

const editorDialogRef = ref<InstanceType<typeof EditorDialog>>();
const handleProjectEdit = (projectItem?: ResponseProjectItem) => {
  editorDialogRef.value?.open(projectItem);
};
const handleProjectDelete = async (projectItem: ResponseProjectItem) => {
  await ElMessageBox.confirm("确定删除该项目吗？", "提示", {
    type: "warning",
  });

  deleteProject(projectItem);
};

// 项目导出 ---------------------------------------------------------------------
const handleExportProjectConfig = (projectItem: ResponseProjectItem) => {
  const filename = `${projectItem.name}.api.json`;
  exportFile(projectItem, filename);
  ElMessage.success({ message: "导出成功", grouping: true });
};
</script>

<style lang="scss" scoped>
.main-content {
  height: calc(100vh - 64px);
  @apply bg-[#f5f5f5] dark:bg-[#141414];
}
.project-item {
  @apply bg-white p-4 box-border rounded-[6px] hover:shadow-md cursor-pointer
  dark:bg-[#262727];
}
</style>
