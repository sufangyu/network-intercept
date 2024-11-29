<template>
  <el-dialog
    v-model="dialogVisible"
    center
    :title="!form.id ? '添加项目' : '编辑项目'"
    width="640"
  >
    <el-form ref="formRef" :model="form" label-position="top">
      <el-form-item
        label="项目名称"
        prop="name"
        :rules="[{ required: true, message: '项目名称不能为空', trigger: 'blur' }]"
      >
        <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入" />
      </el-form-item>

      <el-form-item label="项目描述" prop="description">
        <el-input
          v-model.trim="form.description"
          type="textarea"
          autocomplete="off"
          placeholder="请输入"
        />
      </el-form-item>

      <el-form-item
        label="API基础数据结构包裹"
        prop="responseDataBase"
        :rules="[{ validator: validateResponseBase, trigger: 'blur' }]"
      >
        <template #label="{ label }">
          <span class="flex items-center">
            {{ label }}
            <el-tooltip effect="dark" placement="right">
              <template #content>
                <p class="w-[360px]">
                  统一添加一层数据结构包裹，例如：<br />
                  {<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"code": 200, <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"message": "Operation successful",<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"success": true,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;"data": null <br />
                  }
                  <br />
                  会将 data 字段下的 null 替换为自动生成的
                  Mock数据。如果接口定义中有定义同类型字段，该配置会覆盖自动生成的对应字段。
                </p>
              </template>
              <el-icon class="ml-1 cursor-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>

        <div class="w-full">
          <CodeMirror
            ref="cmRef"
            class="codemirror-editor"
            placeholder="请输入"
            v-model.trim="form.responseDataBase"
            basic
            :lang="json()"
            :linter="form.responseDataBase ? jsonParseLinter() : null"
          />
        </div>
        <p class="text-gray-400">请将需要替换的字段设置为 null</p>
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
import { QuestionFilled } from "@element-plus/icons-vue";
import CodeMirror from "vue-codemirror6";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { ResponseProjectItem } from "../../../types";
import { useResponseMockProject } from "../../../composables/use-project";

const { projectForm: form, createProject, editProject } = useResponseMockProject();

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();

const cmRef: Ref<InstanceType<typeof CodeMirror> | undefined> = ref();
const validateResponseBase = (_rule: any, value: string, callback: Function) => {
  if (value === "") {
    callback();
  }

  let error = null;
  try {
    const formatVal = JSON.parse(value);
    const isObj = Object.prototype.toString.call(formatVal) === "[object Object]";
    !isObj && (error = "请输入正确的JSON格式");
  } catch (err) {
    error = (err as Error).message ?? err;
  }

  error ? callback(new Error(error)) : callback();
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate();

  // 格式化 JSON 数据缩紧2个空格
  form.value.responseDataBase = formatObjectTabIndent(form.value.responseDataBase);

  if (form.value.id) {
    editProject(form.value);
  } else {
    createProject(form.value);
  }
  dialogVisible.value = false;
};

const open = async (item?: ResponseProjectItem) => {
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
  margin-bottom: 0 !important;
}

.codemirror-editor {
  border: 1px solid #d9d9d9;
  @apply outline-0 rounded-md dark:border-[#4C4D4F];

  :deep(.cm-focused) {
    outline: none;
  }

  :deep(.cm-editor) {
    height: 250px;
  }

  :deep(.cm-gutters) {
    @apply dark:bg-[#262727] dark:border-[#4C4D4F];
  }

  :deep(.cm-activeLineGutter) {
    @apply dark:bg-[#225887] dark:text-white;
  }
}
</style>
