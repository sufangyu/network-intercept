<template>
  <AppHeader :project="curProject" @operate="handleOperate" />

  <el-scrollbar class="main-content">
    <!-- <p>{{ activeGroupId ?? "-" }}</p> -->
    <!-- <p>{{ curProject?.groupList }}</p> -->
    <!-- <p>{{ curGroup }}</p> -->

    <el-tabs
      v-if="(curProject?.groupList ?? []).length > 0"
      v-model="activeGroupId"
      type="card"
      closable
      @tab-remove="handleDeleteGroup"
    >
      <el-tab-pane
        v-for="item in curProject?.groupList ?? []"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      />
    </el-tabs>

    <section class="current-group" v-if="curGroup">
      <div class="flex justify-between">
        <div>
          <el-button
            type="primary"
            :icon="Plus"
            @click="() => handleMockRuleEdit('create')"
          >
            添加
          </el-button>
        </div>

        <div>
          <el-button :icon="EditPen" plain @click="handleGroupEdit(curGroup)">
            编辑分组
          </el-button>
          <!-- <el-button disabled :icon="Connection">从Yapi导入</el-button>
          <el-button disabled :icon="Connection">从Swagger导入</el-button> -->
          <el-button
            type="danger"
            plain
            :icon="Delete"
            @click="handleGroupReset(curGroup)"
          >
            全部重置
          </el-button>
        </div>
      </div>

      <!-- {{ curGroup.mockRules }} -->

      <el-table
        class="mt-4"
        border
        :data="curGroup.mockRules ?? []"
        style="width: 100%; height: calc(100vh - 192px)"
      >
        <!-- <el-table-column type="selection" width="45" align="center" /> -->

        <!-- <el-table-column label="ID" min-width="125">
          <template #default="{ row }: { row: MockRuleItem }">
            {{ row.id }}
          </template>
        </el-table-column> -->

        <el-table-column label="启用" min-width="50" fixed>
          <template #default="{ row }: { row: MockRuleItem }">
            <el-switch
              v-model="row.state"
              :active-value="STATUS_GLOBAL_ENUM.启用"
              :inactive-value="STATUS_GLOBAL_ENUM.停用"
              @change="toggleMockRuleStatus(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="请求方式" min-width="80">
          <template #default="{ row }: { row: MockRuleItem }">
            <el-tag :type="tagType(row.methodType)" plain>
              {{
                row.methodType ? getEnumKeyByValue(METHOD_TYPE_ENUM, row.methodType) : "-"
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="接口名称" min-width="160">
          <template #default="{ row }: { row: MockRuleItem }">
            {{ row.apiName || "-" }}
          </template>
        </el-table-column>

        <el-table-column label="接口地址" min-width="520">
          <template #default="{ row }: { row: MockRuleItem }">
            <template v-if="row.mockType === MOCK_TYPE_ENUM.重定向">
              <div class="flex items-center">
                <span>{{ row.apiUrl }}</span>
                <el-icon class="text-green-600 mx-1.5"><DArrowRight /></el-icon>
                <span class="text-red-500">{{ row.redirectUrl }}</span>
              </div>
            </template>

            <template v-else>{{ row.apiUrl || "-" }}</template>
          </template>
        </el-table-column>

        <el-table-column label="匹配方式" min-width="90">
          <template #default="{ row }: { row: MockRuleItem }">
            {{ getEnumKeyByValue(MATCH_TYPE_ENUM, row.matchType) || "-" }}
          </template>
        </el-table-column>

        <el-table-column label="延迟时间" min-width="100">
          <template #default="{ row }: { row: MockRuleItem }">
            {{ getEnumKeyByValue(DELAY_TIME_ENUM, row.delayTime) || "-" }}
          </template>
        </el-table-column>

        <el-table-column label="返回状态" min-width="80">
          <template #default="{ row }: { row: MockRuleItem }">
            <el-tag plain v-if="row.mockType === MOCK_TYPE_ENUM.常规">
              {{ row.responseState || "-" }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }: { row: MockRuleItem }">
            <el-button
              type="primary"
              :icon="EditPen"
              link
              @click="handleMockRuleEdit('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              type="success"
              :icon="CopyDocument"
              link
              @click="() => handleMockRuleEdit('clone', row)"
            >
              克隆
            </el-button>
            <el-button
              type="danger"
              :icon="Delete"
              link
              @click="handleDeleteMockRule(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <el-empty
      class="mt-20"
      v-if="(curProject?.groupList ?? []).length === 0"
      :image-size="200"
      description="暂无分组数据"
    />
  </el-scrollbar>

  <!-- 添加、编辑分组 -->
  <EditorDialog :project="curProject" ref="editorDialogRef" />

  <!-- 添加/编辑规则  -->
  <MockEditorDrawer :project="curProject" :group="curGroup" ref="mockEditorDrawerRef" />
</template>

<script lang="ts" setup>
import {
  Plus,
  EditPen,
  Delete,
  DArrowRight,
  CopyDocument,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { STATUS_GLOBAL_ENUM } from "@/types";
import {
  useResponseMockGroup,
  useResponseMock,
  useResponseMockProject,
} from "@/modules/response-mock/composables";
import {
  GROUP_APP_HEADER_OPERATE_ENUM,
  DELAY_TIME_ENUM,
  MATCH_TYPE_ENUM,
  METHOD_TYPE_ENUM,
  MOCK_TYPE_ENUM,
  ResponseGroupItem,
  MockRuleItem,
} from "@/modules/response-mock/types";
import AppHeader from "./components/app-header.vue";
import EditorDialog from "./components/editor-dialog.vue";
import MockEditorDrawer from "./components/mock-editor-drawer.vue";

const $route = useRoute();
const { responseProject, getProjectList } = useResponseMockProject();
const { activeGroupId, setActiveGroupId, deleteGroup } = useResponseMockGroup();
const { deleteMockRule, deleteAllMockRule, toggleMockRuleStatus } = useResponseMock();

const curProject = computed(() => {
  return getCurProject();
});

const curGroup = computed(() => {
  return (
    curProject.value?.groupList.find((it) => it.id === activeGroupId.value) ??
    curProject.value?.groupList?.[0]
  );
});

/** 请求方法类型 */
const tagType = computed(() => {
  return (method: METHOD_TYPE_ENUM | "") => {
    const typeMap: Record<METHOD_TYPE_ENUM, string> = {
      [METHOD_TYPE_ENUM.GET]: "primary",
      [METHOD_TYPE_ENUM.POST]: "success",
      [METHOD_TYPE_ENUM.PUT]: "warning",
      [METHOD_TYPE_ENUM.DELETE]: "danger",
      [METHOD_TYPE_ENUM.PATCH]: "info",
      [METHOD_TYPE_ENUM.OPTIONS]: "info",
      [METHOD_TYPE_ENUM.HEAD]: "info",
      [METHOD_TYPE_ENUM.TRACE]: "info",
      [METHOD_TYPE_ENUM.CONNECT]: "info",
    };

    return !method ? "info" : typeMap[method] ?? "";
  };
});

const getCurProject = () => {
  const projectId = $route.params.id as string;
  const curProject = responseProject.value.list?.find((item) => item.id === projectId);
  return curProject;
};

/** 处理头部操作事件回调 */
const handleOperate = (type: GROUP_APP_HEADER_OPERATE_ENUM) => {
  const operateFuncMap: Record<GROUP_APP_HEADER_OPERATE_ENUM, () => any> = {
    [GROUP_APP_HEADER_OPERATE_ENUM.添加分组]: () => handleGroupEdit(),
  };

  operateFuncMap[type]?.();
};

// 编辑、添加、删除分组 ------------------------------------------------------
const editorDialogRef = ref<InstanceType<typeof EditorDialog>>();
const handleGroupEdit = (groupItem?: ResponseGroupItem) => {
  editorDialogRef.value?.open(groupItem);
};

const handleDeleteGroup = async (tagName: string) => {
  await ElMessageBox.confirm("确定删除分组吗？", "提示", {
    type: "warning",
  });

  const willDeleteGroup = curProject.value?.groupList.find((it) => it.id === tagName);

  if (!willDeleteGroup || !curProject.value) {
    ElMessage({ type: "warning", message: "删除失败！项目或分组不存在" });
    return;
  }

  deleteGroup(willDeleteGroup!, curProject.value!);
};

const handleGroupReset = async (groupItem: ResponseGroupItem) => {
  await ElMessageBox.confirm("将删除该分组的全部 mock 配置, 确定继续吗？", "提示", {
    type: "warning",
  });

  deleteAllMockRule(groupItem);
};

// 添加、编辑、删除规则相关 -----------------------------------------------------------------------
const mockEditorDrawerRef = ref<InstanceType<typeof MockEditorDrawer>>();
const handleMockRuleEdit = (
  actionType: "create" | "edit" | "clone" | "detail",
  item?: MockRuleItem
) => {
  mockEditorDrawerRef.value?.open(actionType, item);
};
const handleDeleteMockRule = async (item: MockRuleItem) => {
  await ElMessageBox.confirm("确定删除该规则吗？", "提示", {
    type: "warning",
  });

  deleteMockRule(item, curGroup.value!);
};

onMounted(async () => {
  await getProjectList();

  // 打开分组:
  // 1. 指定分组id，则打开该分组
  // 2. 无指定分组id，则打开项目下的第一个分组
  const groupId = ($route.query.groupId as string) ?? "";
  if (groupId) {
    setActiveGroupId(groupId);
  } else {
    const projectItem = getCurProject();
    const firstGroupId = projectItem?.groupList?.[0]?.id;
    firstGroupId && setActiveGroupId(firstGroupId);
  }
});
</script>

<style lang="scss" scoped>
.main-content {
  height: calc(100vh - 64px);
  @apply bg-white p-4 dark:bg-[#141414];
}
</style>
