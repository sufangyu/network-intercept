<template>
  <section>
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
      size="small"
    >
      {{ title }}
    </el-checkbox>
    <div class="pl-5">
      <el-checkbox-group
        v-model="checkboxGroup"
        size="small"
        @change="handleCheckboxGroupChange"
      >
        <div v-for="(item, idx) in options">
          <el-checkbox :label="item.label" :value="item.value" />
        </div>
      </el-checkbox-group>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string;
    options: { label: string; value: string }[];
    modelValue: string[];
  }>(),
  {
    title: "",
    options: () => [],
    modelValue: () => [],
  }
);
const emit = defineEmits(["update:modelValue"]);

const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkboxGroup = ref<string[]>([]);

watch(
  () => props.modelValue,
  () => {
    checkboxGroup.value = props.modelValue;
    checkAll.value = checkboxGroup.value.length === props.options.length;
  }
);

const handleCheckAllChange = (val: boolean) => {
  checkboxGroup.value = val ? props.options.map((it) => it.value) : [];
  isIndeterminate.value = false;

  emit("update:modelValue", checkboxGroup.value);
};

const handleCheckboxGroupChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === props.options.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.length;

  emit("update:modelValue", checkboxGroup.value);
};
</script>

<style lang="scss" scoped></style>
