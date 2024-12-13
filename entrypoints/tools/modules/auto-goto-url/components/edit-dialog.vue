<template>
  <el-dialog v-model="visible" :title="form.id ? '编辑规则' : '添加规则'" width="640">
    <el-form :model="form" ref="formRef" label-width="100">
      <el-form-item
        label="名称"
        prop="name"
        :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
      >
        <el-input v-model="form.name" placeholder="请输入名称" clearable />
      </el-form-item>

      <el-form-item
        label="匹配规则"
        prop="match"
        :rules="[{ required: true, message: '请输入匹配规则', trigger: 'blur' }]"
      >
        <template #label="{ label }">
          <span class="flex items-center gap-1">
            {{ label }}
            <el-popover :width="600">
              <template #reference>
                <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
              </template>
              <template #default>
                <p class="text-xs mb-3 leading-loose">
                  网址是否需要执行自动跳转程序。在处理匹配规则时会忽略协议（http、https）部分。
                </p>
                <p class="text-xs mb-3 leading-loose">
                  如:
                  <code class="inline-code"
                    >https://link.juejin.cn/?target=https%3A%2F%2Fnuxt.com%2Fmodules%2Fshadcn</code
                  >, 通常配置 <code class="inline-code">https://link.juejin.cn/?</code>
                </p>
              </template>
            </el-popover>
          </span>
        </template>
        <el-input v-model="form.match" placeholder="请输入匹配规则" clearable />
      </el-form-item>

      <el-form-item label="是否正则" prop="enableRegex">
        <el-switch
          v-model="form.enableRegex"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item label="处理类型" prop="redirectType">
        <el-radio-group v-model="form.redirectType">
          <el-radio-button v-for="(v, k) in AUTO_GOTO_URL_REDIRECT_TYPE_ENUM" :value="v">
            {{ k }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="
          form.redirectType === AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key
            ? '目标Key'
            : '执行程序'
        "
        prop="redirect"
        :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]"
      >
        <template #label="{ label }">
          <span class="flex items-center gap-1">
            {{ label }}
            <el-popover :width="600">
              <template #reference>
                <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
              </template>
              <template #default>
                <p class="text-xs mb-3 leading-loose">
                  目标Key: 填<code class="inline-code">URL</code>中目标页面参数的
                  <code class="inline-code">key</code>。 如:
                  <code class="inline-code">
                    https://link.juejin.cn/?target=https%3A%2F%2Fnuxt.com%2Fmodules%2Fshadcn
                  </code>
                  中, 配置 <code class="inline-code">target</code>
                </p>

                <div class="text-xs mb-3 leading-loose">
                  执行程序: 填可执行的代码片段,
                  主要实现获取目标页面连接地址后替换页面地址。如:
                  <div class="bg-gray-700 p-2 rounded-lg mt-1 leading-normal">
                    <code>
                      const link = document.querySelector('.mod-external-link-btn
                      >a').href;
                      <br />
                      if (!link) {
                      <br />
                      &nbsp;&nbsp;return;
                      <br />
                      }
                      <br />
                      link && window.location.replace(link);
                    </code>
                  </div>
                </div>
              </template>
            </el-popover>
          </span>
        </template>

        <!-- <el-input
          v-model="form.redirect"
          type="textarea"
          :rows="5"
          placeholder="请输入"
        /> -->

        <div class="w-full">
          <CodeMirror
            ref="cmRef"
            class="codemirror-editor"
            placeholder="请输入"
            v-model.trim="form.redirect"
            basic
            :phrases="phrasesConfig"
            :lang="javascript()"
          />
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio-button v-for="(v, k) in STATUS_GLOBAL_ENUM" :value="v">
            {{ k }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElForm, FormInstance } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import CodeMirror from "vue-codemirror6";
import { javascript } from "@codemirror/lang-javascript";
import { useCodeMirror } from "@/composables";

import {
  AUTO_GOTO_URL_REDIRECT_TYPE_ENUM,
  AutoGotoUrlConfigItem,
} from "@/modules/auto-goto-url/types";
import { useAutoGotoUrlConfig } from "@/modules/auto-goto-url/composables";
import { STATUS_GLOBAL_ENUM } from "@/types";

const { phrasesConfig } = useCodeMirror();
const { createConfig, editConfig } = useAutoGotoUrlConfig();

const visible = ref(false);
const formRef = ref<InstanceType<typeof ElForm>>();
const form = ref<AutoGotoUrlConfigItem>({
  id: "",
  name: "",
  match: "",
  enableRegex: false,
  redirectType: AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key,
  redirect: "",
  status: STATUS_GLOBAL_ENUM.启用,
});

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }

  await formEl.validate();

  form.value.id ? await editConfig(form.value) : await createConfig(form.value);
  visible.value = false;
};

const open = async (ruleItem?: AutoGotoUrlConfigItem) => {
  console.log(ruleItem);

  await nextTick();
  formRef.value?.resetFields();
  visible.value = true;
  form.value.id = "";

  if (ruleItem) {
    form.value = { ...ruleItem };
  }
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
.inline-code {
  @apply py-0.5 px-2 rounded text-xs
    bg-gray-700;
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

  :deep(.cm-panel) {
    line-height: 1.8;

    @apply dark:bg-[#333338] dark:text-white;

    .cm-textfield {
      @apply dark:border-[#555] dark:bg-inherit;
    }

    .cm-button {
      @apply dark:bg-gradient-to-b dark:from-[#393939] dark:to-[#111];
    }
  }

  :deep(.cm-gutters) {
    @apply dark:bg-[#262727] dark:border-[#4C4D4F];
  }

  :deep(.cm-activeLineGutter) {
    @apply dark:bg-[#225887] dark:text-white;
  }
}
</style>
