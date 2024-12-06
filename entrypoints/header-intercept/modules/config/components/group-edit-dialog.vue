<template>
  <el-dialog
    v-model="dialogVisible"
    center
    :title="form.id ? '编辑分组' : '添加分组'"
    width="500"
    class=""
  >
    <el-form ref="formRef" :model="form">
      <el-form-item
        label="组名"
        prop="groupName"
        :rules="[{ required: true, message: '组名不能为空', trigger: 'blur' }]"
      >
        <el-input v-model="form.groupName" autocomplete="off" placeholder="请输入" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { FormInstance } from "element-plus";
import { HeaderInterceptGroupItem } from "@/modules/header-intercept/types";
import { useHeaderInterceptGroup } from "@/modules/header-intercept/composables";

const { createGroup, editGroup } = useHeaderInterceptGroup();

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const form = ref<HeaderInterceptGroupItem>({
  id: "",
  groupName: "",
  rules: [],
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate();

  form.value.id ? editGroup(form.value) : createGroup(form.value.groupName);

  dialogVisible.value = false;
};

const open = async (item?: HeaderInterceptGroupItem) => {
  dialogVisible.value = true;

  await nextTick();
  formRef.value?.resetFields();
  form.value.id = "";

  if (item) {
    form.value = { ...item };
  }
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
