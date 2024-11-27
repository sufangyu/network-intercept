<template>
  <el-drawer v-model="visible" size="800px" :show-close="false">
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

    <el-form ref="formRef" :model="form" label-width="88px">
      <el-form-item
        label="规则名称"
        prop="name"
        :rules="[{ required: true, message: '规则名称不能为空', trigger: 'blur' }]"
      >
        <el-input
          :disabled="actionType === 'detail'"
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入"
        />
      </el-form-item>

      <el-form-item
        label="请求方法"
        prop="requestMethods"
        :rules="[{ required: true, message: '请求方法不能为空', trigger: 'blur' }]"
      >
        <el-checkbox-group
          :disabled="actionType === 'detail'"
          v-model="form.requestMethods"
          @change="handleFormChange('requestMethods')"
        >
          <el-checkbox-button :value="v" v-for="(v, k) in REQUEST_METHOD_ENUM">
            {{ k }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        label="规则类型"
        prop="ruleType"
        :rules="[{ required: true, message: '规则类型不能为空', trigger: 'blur' }]"
      >
        <el-radio-group
          :disabled="actionType === 'detail'"
          v-model="form.ruleType"
          @change="handleFormChange('ruleType')"
        >
          <el-radio-button :value="v" v-for="(v, k) in RULE_TYPE_ENUM">
            {{ k }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item
        label="执行类型"
        prop="executeType"
        :rules="[{ required: true, message: '执行类型不能为空', trigger: 'blur' }]"
      >
        <el-radio-group
          :disabled="actionType === 'detail'"
          v-model="form.executeType"
          @change="handleFormChange('executeType')"
        >
          <el-radio-button :value="v" v-for="(v, k) in EXECUTE_TYPE_ENUM">
            {{ k }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item> -->

      <!-- 规则类型是 `重定向请求` 时显示 -->
      <template
        v-if="
          form.executeType === EXECUTE_TYPE_ENUM.常规 &&
          form.ruleType === RULE_TYPE_ENUM.重定向请求
        "
      >
        <el-form-item
          label="重定向地址"
          prop="redirectUrl"
          :rules="[{ required: true, message: '重定向地址不能为空', trigger: 'blur' }]"
        >
          <el-input
            :disabled="actionType === 'detail'"
            v-model="form.redirectUrl"
            placeholder="请输入"
          />
        </el-form-item>
      </template>

      <!-- 规则类型是 `修改请求头`, `修改响应头` 时显示 -->
      <template
        v-if="
          form.executeType === EXECUTE_TYPE_ENUM.常规 &&
          (form.ruleType === RULE_TYPE_ENUM.修改请求头 ||
            form.ruleType === RULE_TYPE_ENUM.修改响应头)
        "
      >
        <el-form-item
          :label="
            form.ruleType === RULE_TYPE_ENUM.修改请求头 ? '请求头配置' : '响应头配置'
          "
          required
          prop="headersConfig"
          :rules="[
            // { required: true, message: '头名称不能为空', trigger: 'blur' }
            { validator: validateHeadersConfig, trigger: 'blur' },
          ]"
        >
          <HeadersConfig
            v-model="form.headersConfig"
            :disabled="actionType === 'detail'"
          />
        </el-form-item>
      </template>

      <!-- 自定义执行函数 -->
      <template
        v-if="
          form.executeType === EXECUTE_TYPE_ENUM.函数 &&
          form.ruleType !== RULE_TYPE_ENUM.阻止请求
        "
      >
        <el-form-item
          label="函数代码"
          prop="executeFunction"
          :rules="[
            {
              required: form.executeType === EXECUTE_TYPE_ENUM.函数,
              message: '函数代码不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            :disabled="actionType === 'detail'"
            v-model="form.executeFunction"
            :rows="5"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </template>

      <el-form-item
        label="匹配类型"
        prop="matchType"
        :rules="[{ required: true, message: '匹配类型不能为空', trigger: 'blur' }]"
      >
        <el-radio-group
          :disabled="actionType === 'detail'"
          v-model="form.matchType"
          @change="handleFormChange('matchType')"
        >
          <el-radio-button :value="v" v-for="(v, k) in MATCH_TYPE_ENUM">
            {{ k }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 匹配类型非 `全部` 时显示 -->
      <el-form-item
        label="匹配规则"
        prop="includeConfig"
        v-if="form.matchType !== MATCH_TYPE_ENUM.全部"
        :rules="[
          { required: true, message: '匹配规则不能为空', trigger: 'blur' },
          { validator: validateMatchType, trigger: 'blur' },
        ]"
      >
        <el-input
          :disabled="actionType === 'detail'"
          v-model="form.includeConfig"
          placeholder="请输入"
        />
        <p class="text-gray-400" v-if="form.matchType === MATCH_TYPE_ENUM.网址前缀">
          网址前缀不包含协议部分; 示例:
          <span class="text-orange-500 font-bold">www.example.com,test.example.com</span>
        </p>

        <p class="text-gray-400" v-if="form.matchType === MATCH_TYPE_ENUM.域名">
          支持多个配置, 以英文逗号分隔; 域名不包含协议部分; 示例:
          <span class="text-orange-500 font-bold">www.example.com,test.example.com</span>
        </p>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash-es";
import { FormInstance } from "element-plus";
import { STATUS_GLOBAL_ENUM } from "@/types";
import HeadersConfig from '@/components/headers-config.vue';
import {
  EXECUTE_TYPE_ENUM,
  MATCH_TYPE_ENUM,
  REQUEST_METHOD_ENUM,
  RULE_TYPE_ENUM,
  type HeaderRuleItem,
} from "../types";
import { useHeaderInterceptGroup, useHeaderInterceptRule } from "../composables";

type ActionType = "create" | "edit" | "clone" | "detail";

const { activeGroupId } = useHeaderInterceptGroup();
const { createRule, editRule } = useHeaderInterceptRule();

const visible = ref(false);
const actionType = ref<ActionType>("detail");
const title = computed(() => {
  const titleMap: Record<ActionType, string> = {
    create: "添加规则",
    edit: "编辑规则",
    clone: "克隆规则",
    detail: "规则详情",
  };

  return titleMap[actionType.value];
});

const formRef = ref<FormInstance>();
const form = ref<HeaderRuleItem>({
  id: "",
  name: "",
  ruleType: RULE_TYPE_ENUM.阻止请求,
  requestMethods: [
    REQUEST_METHOD_ENUM.GET,
    REQUEST_METHOD_ENUM.POST,
    REQUEST_METHOD_ENUM.PUT,
    REQUEST_METHOD_ENUM.DELETE,
    REQUEST_METHOD_ENUM.PATCH,
  ],
  state: STATUS_GLOBAL_ENUM.启用,
  matchType: MATCH_TYPE_ENUM.全部,
  executeType: EXECUTE_TYPE_ENUM.常规,
  headersConfig: [],
  executeFunction: "",
});

const handleFormChange = (key: keyof typeof form.value) => {
  switch (key) {
    case "ruleType":
      // 非 `重定向请求` 时, 清空 `重定向地址`
      if (form.value[key] !== RULE_TYPE_ENUM.重定向请求) {
        form.value.redirectUrl = "";
      }

      // 非 `修改响应头`, `修改请求头` 时, 清空 `头配置`
      if (
        ![RULE_TYPE_ENUM.修改请求头, RULE_TYPE_ENUM.修改响应头].includes(form.value[key])
      ) {
        form.value.headersConfig = [];
        headerHandler.add();
      }

      break;
    case "matchType":
      if (form.value[key] === MATCH_TYPE_ENUM.全部) {
        form.value.includeConfig = "";
      }
      break;
    case "executeType":
      if (form.value[key] === EXECUTE_TYPE_ENUM.函数) {
        form.value.redirectUrl = "";
        form.value.headersConfig = [];
        headerHandler.add();
      } else {
        form.value.executeFunction = "";
      }
      break;
    default:
      break;
  }
};

// 校验匹配类型的值
const validateMatchType = (_rule: any, value: string, callback: Function) => {
  const isDomain = [MATCH_TYPE_ENUM.域名, MATCH_TYPE_ENUM.网址前缀].includes(form.value.matchType);

  if (!isDomain) {
    callback();
  }

  if (/^https?:\/\//.test(value)) {
    callback(new Error("不能以 https:// 或 http:// 开头"));
  } else {
    callback();
  }
};

/**
 * 请求头/响应头配置
 */
const headerHandler = {
  add() {
    const headerItem = {
      key: "",
      value: "",
      description: "",
      status: STATUS_GLOBAL_ENUM.启用,
    };
    form.value.headersConfig?.push(headerItem);
  },
  delete(index: number) {
    form.value.headersConfig?.splice(index, 1);
  },
};
const validateHeadersConfig = (_rule: any, _value: any, callback: Function) => {
  const validConfigList = (form.value.headersConfig ?? []).filter((it) => {
    return it.key && it.value;
  });
  const firstUnvalidatedConfig = (form.value.headersConfig ?? []).findIndex((it) => {
    return !it.key || !it.value;
  });

  if (validConfigList.length === 0) {
    callback(new Error("至少有一项目有效配置"));
  } else if (firstUnvalidatedConfig !== -1) {
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


  switch (actionType.value) {
    case "create":
    case "clone":
      const formData = cloneDeep(form.value);
      createRule(activeGroupId.value, formData);
      break;
    case "edit":
      editRule(activeGroupId.value, form.value);
      break;
    case "detail":
      break;
  }

  visible.value = false;
};

const open = async (type: ActionType, item?: HeaderRuleItem) => {
  visible.value = true;
  actionType.value = type;

  await nextTick();
  formRef.value?.resetFields();

  // fix: 部分表单项未重置的问题
  form.value.id = '';
  form.value.state = STATUS_GLOBAL_ENUM.启用;
  form.value.headersConfig = [];
  form.value.includeConfig = "";

  if (item) {
    const formData = cloneDeep(item);
    if (type === "clone") {
      formData.id = "";
      formData.name = `${formData.name}_副本`;
    }

    form.value = { ...formData };
  } else {
    headerHandler.add();
  }
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
:deep(.el-checkbox-button.is-checked.is-disabled .el-checkbox-button__inner),
:deep(.el-radio-button__original-radio:disabled:checked + .el-radio-button__inner) {
  background-color: rgba(0, 127, 255, 0.65);
  color: #fff;
}
</style>
