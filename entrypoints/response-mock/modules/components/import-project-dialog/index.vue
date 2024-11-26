<template>
  <section>
    <!-- 选择导入的数据 -->
    <el-dialog
      v-model="dialogVisible"
      title="导入预览"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose"
    >
      <div class="flex gap-2 min-h-64">
        <div class="flex-1">
          <el-tree
            ref="treeRef"
            :data="importProjectGroupList"
            default-expand-all
            show-checkbox
            node-key="id"
            :props="{
              children: 'mockRules',
              label: 'name',
            }"
          >
            <template #default="{ _node, data }">
              <el-tag :type="tagType(data.methodType)" plain v-if="data.apiUrl">
                {{ data.methodType }}
              </el-tag>
              <span class="mx-2">{{ data.apiName || data.name }}</span>
              <span>{{ data.id }}</span>
              <span class="text-gray-400" v-if="data.apiUrl">{{ data.apiUrl }}</span>
            </template>
          </el-tree>
        </div>

        <div class="w-[280px]" v-if="curImportType === IMPORT_TYPE_ENUM.已有项目">
          <p class="mb-2 text-sm">
            匹配到相同接口时（根据<span class="text-blue-500">Method & Path</span>）
          </p>

          <div class="flex gap-2">
            <el-select v-model="sameRuleHandle" placeholder="">
              <el-option
                v-for="(v, k) in SAME_RULE_HANDLE_ENUM"
                :key="k"
                :label="k"
                :value="v"
              >
                <span style="float: left">{{ k }}</span>
                <el-tooltip
                  v-if="
                    [
                      SAME_RULE_HANDLE_ENUM.智能合并,
                      SAME_RULE_HANDLE_ENUM.覆盖指定字段,
                    ].includes(v)
                  "
                  :content="
                    v === SAME_RULE_HANDLE_ENUM.覆盖指定字段
                      ? '选择要覆盖的字段'
                      : '保留已存在分组和规则的名称、说明等'
                  "
                >
                  <el-icon class="relative ml-0.5 top-[2px]"><QuestionFilled /></el-icon>
                </el-tooltip>
              </el-option>
            </el-select>
            <el-button
              v-if="sameRuleHandle === SAME_RULE_HANDLE_ENUM.覆盖指定字段"
              :icon="Setting"
              plain
              @click="coverFieldsDialogVisible = true"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog()">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定导入</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 选择导入的类型 -->
    <SelectImportTypeDialog ref="selectImportTypeDialogRef" @importType="handleImport" />

    <!-- 选择覆盖字段 -->
    <CoverFieldDialog
      v-model:visible="coverFieldsDialogVisible"
      v-model:coverFields="coverFields"
    />
  </section>
</template>

<script lang="ts" setup>
import { ElMessage, ElTree } from "element-plus";
import { QuestionFilled, Setting } from "@element-plus/icons-vue";
import {
  ConvertFileds,
  IMPORT_TYPE_ENUM,
  METHOD_TYPE_ENUM,
  SAME_RULE_HANDLE_ENUM,
  type ResponseGroupItem,
  type ResponseProjectItem,
} from "../../types";
import SelectImportTypeDialog from "./select-import-type-dialog.vue";
import CoverFieldDialog from "./cover-field-dialog.vue";
import {
  filterTreeData,
  getAllNodeKeys,
  handleImportByExitProject,
  handleImportByNewProject,
} from "./utils";


const dialogVisible = ref(false);
const selectImportTypeDialogRef = ref<InstanceType<typeof SelectImportTypeDialog>>();

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


const treeRef = ref<InstanceType<typeof ElTree>>();
const sameRuleHandle = ref(SAME_RULE_HANDLE_ENUM.保留两者);
const importProjectGroupList = ref<ResponseGroupItem[]>([]);

const curImportType = ref<IMPORT_TYPE_ENUM>(IMPORT_TYPE_ENUM.新建项目);
const curTargetProject = ref<{ id: string; name: string } | null>(null);
const coverFields = ref<ConvertFileds>({ group: [], rule: [] });
const coverFieldsDialogVisible = ref(false);

const handleClose = () => {
  sameRuleHandle.value = SAME_RULE_HANDLE_ENUM.保留两者;
  importProjectGroupList.value = [];
};

const handleConfirm = async () => {
  const checkedKeys = (treeRef.value?.getCheckedNodes(false, true) ?? []).map(
    (it) => it.id
  );

  // 最终选中要导入的数据
  const filteredData = filterTreeData(
    importProjectGroupList.value,
    checkedKeys,
    true
  ) as ResponseGroupItem[];

  // console.log(
  //   "处理导入数据",
  //   curImportType.value,
  //   curTargetProject.value,
  //   checkedKeys,
  //   filteredData
  // );

  switch (curImportType.value) {
    case IMPORT_TYPE_ENUM.新建项目:
      await handleImportByNewProject(curTargetProject.value!, filteredData);
      break;
    case IMPORT_TYPE_ENUM.已有项目:
      handleImportByExitProject(
        curTargetProject.value! as ResponseProjectItem,
        filteredData,
        sameRuleHandle.value,
        coverFields.value
      );
      break;
  }

  ElMessage.success("导入成功");
  closeDialog();
};

/**
 * 处理导入数据的显示
 * @param type 导入类型
 * @param targetProject 目标项目
 */
const handleImport = async (
  type: IMPORT_TYPE_ENUM,
  targetProject: { id: string; name: string }
) => {
  dialogVisible.value = true;
  curImportType.value = type;
  curTargetProject.value = targetProject;
  await nextTick();

  // 获取所有节点的 ID 并选中所有节点
  const allNodeKeys = getAllNodeKeys(importProjectGroupList.value);
  treeRef.value?.setCheckedKeys(allNodeKeys);
};

/**
 * 打开弹窗
 * @param importProject 导入的项目
 * @param targetProject 目标项目（无: 可选择新建 or 导入指定项目）
 */
const open = (
  importProject: ResponseProjectItem,
  targetProject?: ResponseProjectItem | null
) => {
  if (!targetProject) {
    // 显示 新建或导入指定项目 弹窗
    selectImportTypeDialogRef.value?.open();
  } else {
    // 显示 选择导入数据 弹窗
    handleImport(IMPORT_TYPE_ENUM.已有项目, targetProject);
  }

  importProjectGroupList.value = importProject.groupList ?? [];
};

const closeDialog = () => {
  dialogVisible.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
