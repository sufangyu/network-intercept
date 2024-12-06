<template>
  <section>
    <!-- 选择导入的类型 -->
    <el-dialog
      v-model="visible"
      title="导入到项目"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="新建项目" :name="IMPORT_TYPE_ENUM.新建项目">
          <el-input v-model="projectName" placeholder="请输入项目名称" clearable />
        </el-tab-pane>
        <el-tab-pane label="选择已有项目" :name="IMPORT_TYPE_ENUM.已有项目">
          <el-select v-model="selectProject" placeholder="请选择项目" value-key="id">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog()">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 选择导入的数据 -->
  </section>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { responseProject } from "@/modules/response-mock/data";
import { IMPORT_TYPE_ENUM, ResponseProjectItem } from "@/modules/response-mock/types";

const emit = defineEmits<{
  confirmImport: [
    importType: IMPORT_TYPE_ENUM,
    targetProject: { id: string; name: string }
  ];
}>();

const visible = ref(false);
const activeName = ref<IMPORT_TYPE_ENUM>(IMPORT_TYPE_ENUM.新建项目);

const projectList = computed(() => {
  return responseProject.value.list.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
});

const handleTabClick = () => {
  projectName.value = "";
  selectProject.value = null;
};

const projectName = ref("");
const selectProject = ref<ResponseProjectItem | null>(null);

const handleConfirm = () => {
  let errMsg = "";
  let targetProject = { id: "", name: "" };

  switch (activeName.value) {
    case IMPORT_TYPE_ENUM.新建项目:
      if (!projectName.value) {
        errMsg = "请输入项目名称";
      } else if (responseProject.value.list.find((it) => it.name === projectName.value)) {
        errMsg = "已存在同名项目";
      }

      targetProject.name = projectName.value;
      break;
    case IMPORT_TYPE_ENUM.已有项目:
      if (!selectProject.value) {
        errMsg = "请选择已有项目";
      }

      targetProject.id = selectProject.value?.id!;
      targetProject.name = selectProject.value?.name!;
      break;
  }

  if (errMsg) {
    ElMessage.warning({ message: errMsg, grouping: true });
    return;
  }

  emit("confirmImport", activeName.value, targetProject);
  closeDialog();
};

const open = () => {
  projectName.value = "";
  selectProject.value = null;
  activeName.value = IMPORT_TYPE_ENUM.新建项目;

  visible.value = true;
};
const closeDialog = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
