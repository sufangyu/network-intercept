<template>
  <el-dialog v-model="visible" center title="移动至" width="450">
    <el-form ref="formRef" :model="form">
      <el-form-item
        label="分组"
        prop="groupId"
        :rules="[{ required: true, message: '分组不能为空', trigger: 'blur' }]"
      >
        <el-select v-model="form.groupId" placeholder="请选择分组" style="width: 100%">
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { FormInstance } from "element-plus";
import { HeaderRuleItem } from "@/modules/header-intercept/types";
import { headerInterceptConfig } from "@/modules/header-intercept/data";
import {
  useHeaderInterceptGroup,
  useHeaderInterceptRule,
} from "@/modules/header-intercept/composables";

const { activeGroupId } = useHeaderInterceptGroup();
const { moveRule } = useHeaderInterceptRule();

// 获取分组列表
const groupOptions = computed(() => {
  return headerInterceptConfig.value.data.map((item) => ({
    label: item.groupName,
    value: item.id,
  }));
});

const visible = ref(false);
const curItem = ref<HeaderRuleItem | null>(null);

const formRef = ref<FormInstance>();
const form = ref<{ groupId: string }>({
  groupId: "",
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }

  await formEl.validate();

  // 不同分组才处理移动
  if (form.value.groupId !== activeGroupId.value) {
    moveRule(activeGroupId.value, form.value.groupId, curItem.value!);
  }

  visible.value = false;
};

const open = async (item: HeaderRuleItem) => {
  visible.value = true;
  await nextTick();
  formRef.value?.resetFields();

  form.value.groupId = activeGroupId.value ?? "";
  curItem.value = item;
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
