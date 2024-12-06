<template>
  <el-dialog
    v-model="dialogVisible"
    title="选择字段"
    width="520px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <p>选择需要覆盖的字段，其他字段会保留的现有数据。</p>

    <div class="flex gap-3">
      <div class="flex-1">
        <CheckOptions
          title="分组信息"
          :options="[
            { label: '名称', value: 'name' },
            { label: '请求请求头', value: 'requestHeaders' },
          ]"
          v-model="coverFields.group"
        />
      </div>

      <div class="flex-1">
        <CheckOptions
          title="Mock 配置"
          :options="[
            { label: 'Mock方式', value: 'mockType' },
            { label: '匹配方式', value: 'matchType' },
            { label: '请求方式', value: 'methodType' },
            { label: '返回状态', value: 'responseState' },
            { label: '延迟时间', value: 'delayTime' },
            { label: '接口地址', value: 'apiUrl' },
            { label: '接口名称', value: 'apiName' },
            { label: '返回请求头', value: 'responseHeaders' },
            { label: '返回数据', value: 'responseDataBase' },
          ]"
          v-model="coverFields.rule"
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ConvertFileds } from "@/modules/response-mock/types";
import CheckOptions from "./check-options.vue";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    coverFields: ConvertFileds;
  }>(),
  {
    visible: false,
    coverFields: () => ({
      group: [],
      rule: [],
    }),
  }
);

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "update:coverFields": [value: ConvertFileds];
}>();

const dialogVisible = ref(false);
watch(
  () => props.visible,
  (newVal, oldVal) => {
    if (newVal === oldVal) {
      return;
    }

    dialogVisible.value = newVal;
  }
);

const coverFields = ref<ConvertFileds>({
  group: [],
  rule: [],
});

const handleClose = () => {
  emit("update:visible", false);

  coverFields.value = {
    group: [],
    rule: [],
  };
};
const handleConfirm = () => {
  emit("update:coverFields", coverFields.value);
  handleClose();
};
</script>
