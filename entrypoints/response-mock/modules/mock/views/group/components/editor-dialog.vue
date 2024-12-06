<template>
  <el-dialog
    v-model="dialogVisible"
    center
    :title="form.id ? '编辑分组' : '添加分组'"
    width="640"
  >
    <el-form ref="formRef" :model="form" label-position="top">
      <el-form-item
        label="分组名称"
        prop="name"
        :rules="[{ required: true, message: '组名不能为空', trigger: 'blur' }]"
      >
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入" />
      </el-form-item>
      <el-form-item
        label="公共请求头"
        prop="requestHeaders"
        :rules="[{ validator: validateHeadersConfig, trigger: 'blur' }]"
      >
        <HeadersConfig v-model="form.requestHeaders!" />
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
import HeadersConfig from "@/components/headers-config.vue";
import { useResponseMockGroup } from "@/modules/response-mock/composables";
import type {
  ResponseGroupItem,
  ResponseProjectItem,
} from "@/modules/response-mock/types";

const props = withDefaults(defineProps<{ project?: ResponseProjectItem | null }>(), {
  project: null,
});

const { groupForm: form, formRef, createGroup, editGroup } = useResponseMockGroup();

const dialogVisible = ref(false);

const validateHeadersConfig = (_rule: any, _value: any, callback: Function) => {
  const firstUnvalidatedConfig = (form.value.requestHeaders ?? []).findIndex((it) => {
    return !it.key || !it.value;
  });

  if (firstUnvalidatedConfig !== -1) {
    callback(new Error(`第${firstUnvalidatedConfig + 1}项配置请补充完整`));
  } else {
    callback();
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }

  await formEl.validate();

  if (form.value.id) {
    editGroup(form.value, props.project!);
  } else {
    createGroup(form.value, props.project!);
  }
  dialogVisible.value = false;
};

const open = async (item?: ResponseGroupItem) => {
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

<style lang="scss" scoped>
:deep(.el-form-item--label-top .el-form-item__label) {
  margin-bottom: 1px !important;
}

.codemirror-editor {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;

  :deep(.cm-focused) {
    outline: none;
  }

  :deep(.cm-editor) {
    height: 150px;
  }
}
</style>
