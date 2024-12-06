<template>
  <el-drawer
    class="drawer-mock-editor"
    v-model="visible"
    size="800px"
    :show-close="false"
  >
    <template #header>
      <h3 class="text-lg">{{ title }}</h3>
      <div>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          v-if="actionType !== 'detail'"
          type="primary"
          @click="submitForm(formRef)"
          >确定</el-button
        >
      </div>
    </template>

    <el-form
      ref="formRef"
      class="-mt-6"
      :model="form"
      label-width="88px"
      label-position="top"
    >
      <el-row :gutter="10">
        <el-col :span="5">
          <el-form-item
            label="Mock 方式"
            prop="mockType"
            :rules="[{ required: true, message: 'Mock 方式不能为空', trigger: 'blur' }]"
          >
            <el-select
              v-model="form.mockType"
              placeholder="请选择"
              @change="handleMockTypeChange"
            >
              <el-option v-for="(v, k) in MOCK_TYPE_ENUM" :label="k" :value="v" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="匹配方式"
            prop="matchType"
            :rules="[{ required: true, message: '匹配方式不能为空', trigger: 'blur' }]"
          >
            <el-select v-model="form.matchType" placeholder="请选择">
              <el-option v-for="(v, k) in MATCH_TYPE_ENUM" :label="k" :value="v" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="请求方式"
            prop="methodType"
            :rules="[{ required: true, message: '请求方式不能为空', trigger: 'blur' }]"
          >
            <el-select v-model="form.methodType" placeholder="请选择">
              <el-option v-for="(v, k) in METHOD_TYPE_ENUM" :label="k" :value="v" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="form.mockType === MOCK_TYPE_ENUM.常规">
          <el-form-item
            label="返回状态"
            prop="responseState"
            :rules="[{ required: true, message: '返回状态不能为空', trigger: 'blur' }]"
          >
            <el-input
              :disabled="actionType === 'detail'"
              v-model="form.responseState"
              autocomplete="off"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="form.mockType === MOCK_TYPE_ENUM.常规">
          <el-form-item
            label="延迟时间"
            prop="delayTime"
            :rules="[{ required: true, message: '延迟时间不能为空', trigger: 'blur' }]"
          >
            <el-select v-model="form.delayTime" placeholder="请选择">
              <el-option v-for="(v, k) in DELAY_TIME_ENUM" :label="k" :value="v" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="15">
          <el-form-item
            label="接口地址"
            prop="apiUrl"
            :rules="[{ required: true, message: '接口地址不能为空', trigger: 'blur' }]"
          >
            <el-input
              :disabled="actionType === 'detail'"
              v-model="form.apiUrl"
              autocomplete="off"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="接口名称" prop="apiName" :rules="[]">
            <el-input
              :disabled="actionType === 'detail'"
              v-model="form.apiName"
              autocomplete="off"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        v-if="form.mockType === MOCK_TYPE_ENUM.常规"
        label="返回请求头"
        prop="responseHeaders"
        :rules="[{ validator: validateHeadersConfig, trigger: 'blur' }]"
      >
        <template #label="{ label }">
          <span class="flex items-center">
            {{ label }}
            <el-tooltip
              effect="dark"
              content="接口响应返回的请求头信息, 同名覆盖不同名累加"
              placement="right"
            >
              <el-icon class="ml-1 cursor-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>
        <HeadersConfig v-model="form.responseHeaders!" />
      </el-form-item>

      <el-form-item
        v-if="form.mockType === MOCK_TYPE_ENUM.常规"
        label="返回数据"
        prop="responseData"
        :rules="[
          { required: true, message: '返回数据不能为空', trigger: 'blur' },
          { validator: validateResponseBase, trigger: 'blur' },
        ]"
        style="margin-bottom: 0"
      >
        <div class="w-full">
          <CodeMirror
            ref="cmRef"
            class="codemirror-editor"
            placeholder="请输入"
            v-model.trim="form.responseData"
            basic
            :lang="json()"
            :linter="form.responseData ? jsonParseLinter() : null"
          />
        </div>
      </el-form-item>

      <el-form-item
        v-if="form.mockType === MOCK_TYPE_ENUM.重定向"
        label="重定向地址"
        prop="redirectUrl"
        :rules="[{ required: true, message: '接口名称不能为空', trigger: 'blur' }]"
      >
        <el-input
          :disabled="actionType === 'detail'"
          v-model="form.redirectUrl"
          autocomplete="off"
          placeholder="请输入重定向地址"
        />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash-es";
import { FormInstance } from "element-plus";
import CodeMirror from "vue-codemirror6";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { QuestionFilled } from "@element-plus/icons-vue";
import HeadersConfig from "@/components/headers-config.vue";
import { useResponseMock } from "@/modules/response-mock/composables";
import {
  DELAY_TIME_ENUM, MATCH_TYPE_ENUM,
  METHOD_TYPE_ENUM,
  MOCK_TYPE_ENUM,
  type MockRuleItem,
  type ResponseGroupItem,
  type ResponseProjectItem
} from "@/modules/response-mock/types";

type ActionType = "create" | "edit" | "clone" | "detail";

const props = withDefaults(defineProps<{ project?: ResponseProjectItem | null, group?: ResponseGroupItem | null }>(), {
  project: null,
  group: null,
});

const { formRef, mockForm: form, createMockRule, editMockRule } = useResponseMock();

const visible = ref(false);
const actionType = ref<ActionType>("detail");

const title = computed(() => {
  const titleMap: Record<ActionType, string> = {
    create: "添加",
    edit: "编辑",
    clone: "克隆",
    detail: "详情",
  };

  return titleMap[actionType.value];
});

const validateHeadersConfig = (_rule: any, _value: any, callback: Function) => {
  const firstUnvalidatedConfig = (form.value.responseHeaders ?? []).findIndex((it) => {
    return !it.key || !it.value;
  });

  if (firstUnvalidatedConfig !== -1) {
    callback(new Error(`第${firstUnvalidatedConfig + 1}项配置请补充完整`));
  } else {
    callback();
  }
};

const handleMockTypeChange = () => {
  switch (form.value.mockType) {
    case MOCK_TYPE_ENUM.常规:
      form.value.responseState = '200';
      form.value.delayTime = DELAY_TIME_ENUM["500ms"];
      form.value.redirectUrl = '';
      break;
    case MOCK_TYPE_ENUM.重定向:
      form.value.responseState = '200';
      form.value.responseData = '';
      form.value.delayTime = DELAY_TIME_ENUM.无延迟;
      break;
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  await formEl.validate();

  // 处理响应数据的 json 缩进
  if (form.value.responseData) {
    form.value.responseData = formatObjectTabIndent(form.value.responseData);
  }

  switch (actionType.value) {
    case "create":
    case "clone":
      const formData = cloneDeep(form.value);
      createMockRule(formData, props.group!, props.project!);
      break;
    case "edit":
      editMockRule(form.value, props.group!, props.project!);
      break;
    case "detail":
      break;
  }

  visible.value = false;
};

const validateResponseBase = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    callback();
  }

  let error = null;
  try {
    JSON.parse(value);
  } catch (err) {
    error = err;
  }
  error ? callback(new Error("请输入正确的JSON格式")) : callback();
};

const open = async (type: ActionType, item?: MockRuleItem) => {
  visible.value = true;
  actionType.value = type;

  await nextTick();
  formRef.value?.resetFields();
  form.value.id = '';

  if (item) {
    const formData = cloneDeep(item);

    if (type === "clone") {
      formData.id = "";
      formData.apiName = `${formData.apiName}_副本`;
    }

    form.value = { ...formData };
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

:deep(.el-form-item--label-top .el-form-item__label) {
  margin-bottom: 1px !important;
}

.codemirror-editor {
  border: 1px solid #d9d9d9;
  @apply outline-0 rounded-md dark:border-[#4C4D4F];

  :deep(.cm-focused) {
    outline: none;
  }

  :deep(.cm-editor) {
    height: calc(100vh - 290px);
  }

  :deep(.cm-gutters) {
    @apply dark:bg-[#262727] dark:border-[#4C4D4F];
  }

  :deep(.cm-activeLineGutter) {
    @apply dark:bg-[#225887] dark:text-white;
  }
}

:deep(.el-checkbox-button.is-checked.is-disabled .el-checkbox-button__inner),
:deep(.el-radio-button__original-radio:disabled:checked + .el-radio-button__inner) {
  background-color: rgba(0, 127, 255, 0.5);
  color: #fff;
}
</style>
