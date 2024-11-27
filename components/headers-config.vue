<template>
  <div class="w-full">
    <div
      class="flex items-center gap-1.5 mb-1"
      v-for="(headerItem, idx) in headersConfig ?? []"
      :key="idx"
    >
      <div class="w-8" v-if="!disabled">
        <el-switch
          v-model="headerItem.status"
          :active-value="STATUS_GLOBAL_ENUM.启用"
          :inactive-value="STATUS_GLOBAL_ENUM.停用"
          :disabled="disabled"
        />
      </div>
      <div class="w-24">
        <el-input
          v-model="headerItem.description"
          :disabled="disabled"
          placeholder="请输入描述"
          clearable
        />
      </div>
      <span>:</span>
      <div class="w-36">
        <el-input
          v-model="headerItem.key"
          :disabled="disabled"
          placeholder="请输入Key"
          clearable
        />
      </div>
      <div class="flex-1">
        <el-input
          v-model="headerItem.value"
          :disabled="disabled"
          placeholder="请输入Value"
          clearable
        />
      </div>
      <el-button
        v-if="!disabled"
        class="flex gap-1 cursor-pointer text-blue-600"
        @click="() => headersConfigHelper.delete(idx)"
        link
        :disabled="disabled"
      >
        <el-icon :size="18"><Remove /></el-icon>
      </el-button>
    </div>
  </div>
  <div
    v-if="!disabled"
    class="w-full"
    :class="{
      'mt-1.5': (props.modelValue ?? []).length > 0,
    }"
  >
    <el-button
      class="w-full"
      :disabled="disabled"
      @click="() => headersConfigHelper.add()"
      :icon="Plus"
    >
      添加配置
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { STATUS_GLOBAL_ENUM } from "@/types";
import { Plus, Remove } from "@element-plus/icons-vue";

interface HeaderItem {
  key: string;
  value: string;
  status: "enabled" | "disabled";
  description?: string;
}
interface Props {
  modelValue: HeaderItem[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  disabled: false,
});
const emits = defineEmits(["update:modelValue"]);

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal === oldVal) {
      return;
    }

    headersConfig.value = newVal ?? [];
  }
);

const headersConfig = ref<HeaderItem[]>(props.modelValue ?? []);
const headersConfigHelper = {
  add: () => {
    headersConfig.value.push({ key: "", value: "", status: "enabled", description: "" });
    emits("update:modelValue", headersConfig.value);
  },
  delete: (index: number) => {
    headersConfig.value.splice(index, 1);

    emits("update:modelValue", headersConfig.value);
  },
};
</script>

<style lang="scss" scoped></style>
