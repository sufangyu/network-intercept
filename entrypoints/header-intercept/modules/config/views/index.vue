<template>
  <AppHeader @operate="handleOperate" />

  <section class="app-body">
    <el-empty class="mt-20" v-if="!curGroup" :image-size="200" description="暂无数据" />

    <template v-else>
      <el-tabs
        v-model="activeGroupId"
        type="card"
        closable
        @tab-remove="handleDeleteGroup"
      >
        <el-tab-pane
          v-for="item in headerInterceptConfig.data"
          :key="item.id"
          :label="item.groupName"
          :name="item.id"
        />
      </el-tabs>

      <div class="flex justify-between">
        <div>
          <el-button type="primary" :icon="Plus" @click="() => handleRuleEdit('create')">
            添加
          </el-button>
        </div>

        <div>
          <el-button
            type="default"
            plain
            :icon="EditPen"
            @click="handleGroupEdit(curGroup)"
          >
            编辑分组
          </el-button>
          <el-button
            type="success"
            plain
            :icon="Upload"
            @click="() => fileInputRef?.click()"
          >
            <input
              type="file"
              ref="fileInputRef"
              class="hidden"
              accept=".json"
              @change="(ev) => handleHeaderInterceptRule(ev, curGroup!)"
            />
            <span>导入配置</span>
          </el-button>
          <el-dropdown class="ml-3" placement="top-start">
            <el-button :icon="SetUp">更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Download" @click="handleExportConfig(curGroup)">
                  导出配置
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="Delete"
                  divided
                  @click="handleGroupReset(curGroup)"
                >
                  全部重置
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <el-table
        class="mt-4"
        ref="multipleTableRef"
        border
        :data="curGroup.rules ?? []"
        style="width: 100%; height: calc(100vh - 192px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center" />

        <el-table-column label="启用" min-width="80" fixed>
          <template #default="{ row }: { row: HeaderRuleItem }">
            <el-switch
              v-model="row.state"
              :active-value="STATUS_GLOBAL_ENUM.启用"
              :inactive-value="STATUS_GLOBAL_ENUM.停用"
              @change="() => editRule(activeGroupId, row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="名称" min-width="250">
          <template #default="{ row }: { row: HeaderRuleItem }">
            {{ row.name }}
          </template>
        </el-table-column>

        <el-table-column label="规则类型" min-width="280">
          <template #default="{ row }: { row: HeaderRuleItem }">
            {{ getEnumKeyByValue(RULE_TYPE_ENUM, row.ruleType) || "-" }}
          </template>
        </el-table-column>

        <el-table-column label="匹配请求方法" min-width="320">
          <template #default="{ row }: { row: HeaderRuleItem }">
            <el-tag
              class="mx-1"
              v-for="method in row.requestMethods"
              :key="method"
              :type="tagType(method)"
            >
              {{ `${method.toUpperCase()}` }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="310" fixed="right">
          <template #default="{ row }: { row: HeaderRuleItem }">
            <el-button
              type="default"
              link
              :icon="View"
              @click="() => handleRuleEdit('detail', row)"
            >
              查看
            </el-button>
            <el-button
              type="primary"
              link
              :icon="EditPen"
              @click="handleRuleEdit('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              type="success"
              link
              :icon="CopyDocument"
              @click="() => handleRuleEdit('clone', row)"
            >
              克隆
            </el-button>
            <el-button
              type="warning"
              link
              :icon="Connection"
              @click="() => moveGroupDialogRef?.open(row)"
            >
              移动
            </el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDeleteRule(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </section>

  <!-- 添加弹窗 -->
  <GroupEditDialog ref="groupEditDialogRef" />

  <!-- 添加/编辑规则  -->
  <RuleEditDrawer ref="ruleEditDrawerRef" />

  <!-- 移动分组 -->
  <MoveGroupDialog ref="moveGroupDialogRef" />
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  EditPen,
  Delete,
  CopyDocument,
  View,
  Connection,
  Upload,
  Download,
  SetUp,
} from "@element-plus/icons-vue";
import { STATUS_GLOBAL_ENUM } from "@/types";
import { useTableSelection } from "@/composables";
import AppHeader from "../components/app-header.vue";
import GroupEditDialog from "../components/group-edit-dialog.vue";
import RuleEditDrawer from "../components/rule-edit-drawer.vue";
import MoveGroupDialog from "../components/move-group-dialog.vue";
import {
  HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM,
  HeaderInterceptGroupItem,
  HeaderRuleItem,
  REQUEST_METHOD_ENUM,
  RULE_TYPE_ENUM,
} from "@/modules/header-intercept/types";
import {
  useHeaderInterceptGroup,
  useHeaderIntercept,
  useHeaderInterceptRule,
  useHeaderInterceptImport,
} from "@/modules/header-intercept/composables";

const { initHeaderInterceptConfig, headerInterceptConfig } = useHeaderIntercept();
const { activeGroupId, deleteGroup } = useHeaderInterceptGroup();
const { editRule, deleteRule, deleteAllHeaderRule } = useHeaderInterceptRule();
const { fileInputRef, handleHeaderInterceptRule } = useHeaderInterceptImport();

// 当前分组
const curGroup = computed(() => {
  return headerInterceptConfig.value.data.find((it) => it.id === activeGroupId.value);
});

// 请求方法类型枚举
const tagType = computed(() => {
  return (method: REQUEST_METHOD_ENUM | "") => {
    const typeMap: Record<REQUEST_METHOD_ENUM, string> = {
      [REQUEST_METHOD_ENUM.GET]: "primary",
      [REQUEST_METHOD_ENUM.POST]: "success",
      [REQUEST_METHOD_ENUM.PUT]: "warning",
      [REQUEST_METHOD_ENUM.DELETE]: "danger",
      [REQUEST_METHOD_ENUM.PATCH]: "info",
    };

    return !method ? "info" : typeMap[method] ?? "";
  };
});

// 添加、删除、移动分组相关 -----------------------------------------------------------------------
const moveGroupDialogRef = ref<InstanceType<typeof MoveGroupDialog>>();
const groupEditDialogRef = ref<InstanceType<typeof GroupEditDialog>>();
const handleGroupEdit = (item?: HeaderInterceptGroupItem) => {
  groupEditDialogRef.value?.open(item);
};
const handleDeleteGroup = async (id: string) => {
  await ElMessageBox.confirm("确定删除分组吗？", "提示", {
    type: "warning",
  });

  const willDeleteGroup = headerInterceptConfig.value.data.find((it) => it.id === id);
  willDeleteGroup && deleteGroup(willDeleteGroup);
};

// 添加、编辑、删除规则相关 -----------------------------------------------------------------------
const ruleEditDrawerRef = ref<InstanceType<typeof RuleEditDrawer>>();
const handleRuleEdit = (
  actionType: "create" | "edit" | "clone" | "detail",
  item?: HeaderRuleItem
) => {
  ruleEditDrawerRef.value?.open(actionType, item);
};

const handleDeleteRule = async (item: HeaderRuleItem) => {
  await ElMessageBox.confirm("确定删除规则吗？", "提示", {
    type: "warning",
  });

  deleteRule(curGroup.value?.id!, item);
};

const handleGroupReset = async (groupItem: HeaderInterceptGroupItem) => {
  await ElMessageBox.confirm("将删除该分组的全部配置, 确定继续吗？", "提示", {
    type: "warning",
  });

  deleteAllHeaderRule(groupItem);
};

// 导入导出 -----------------------------------------------------------------------
const {
  multipleTableRef,
  multipleSelection,
  handleSelectionChange,
} = useTableSelection();

const handleExportConfig = (group: HeaderInterceptGroupItem) => {
  if (multipleSelection.value.length === 0) {
    return ElMessage.warning({ message: "请选择需要导出的规则", grouping: true });
  }

  const exportRule = group.rules?.filter((it) =>
    multipleSelection.value?.find((selectItem) => selectItem.id === it.id)
  );

  const exportData: HeaderInterceptGroupItem = {
    id: group.id,
    groupName: group.groupName,
    rules: exportRule,
  };
  exportFile(exportData, group.groupName + ".headers.json");

  ElMessage.success("导出成功");
};

// 处理头部操作事件回调 -----------------------------------------------------------------------
const handleOperate = (type: HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM) => {
  const operateFuncMap: Record<HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM, () => any> = {
    [HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM.添加分组]: () => handleGroupEdit(),
  };

  operateFuncMap[type]?.();
};

onMounted(async () => {
  await initHeaderInterceptConfig();
});
</script>

<style lang="postcss" scoped>
.setting-header {
  @apply flex justify-center items-center
    py-2 px-4 bg-[#F9FAFB];

  h1 {
    @apply text-base;
  }

  .logo {
    @apply block mr-2 text-[0];

    img {
      @apply h-5;
    }
  }
}

.app-body {
  @apply text-sm p-4;
}

.main-content {
  height: calc(100vh - 64px);
  @apply bg-white;
}
</style>
