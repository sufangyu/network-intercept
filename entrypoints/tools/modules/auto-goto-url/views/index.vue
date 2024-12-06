<template>
  <section class="page-auto-goto-url">
    <div class="flex items-center justify-between mb-1">
      <h2 class="text-base">规则配置</h2>
      <div class="flex items-center gap-2">
        <el-switch
          v-model="autoGotoUrl.toggle"
          size="default"
          inline-prompt
          active-text="启用"
          inactive-text="停用"
          @change="toggleAutoGotoUrl"
        />
        <el-button :icon="Plus" type="primary" @click="editDialogRef?.open()">
          添加
        </el-button>
      </div>
    </div>

    <el-alert
      title="已内置掘金、简书、知乎、CSDN、开源中国第三方网站的跳转规则, 无需额外配置。"
      type="success"
      :closable="false"
    />

    <el-table
      :data="ruleConfigList"
      border
      class="mt-4"
      style="width: 100%; height: calc(100vh - 56px - 40px - 40px - 24px)"
    >
      <el-table-column label="启用/停用" min-width="70">
        <template #default="{ row }: { row: AutoGotoUrlConfigItem }">
          <el-switch
            v-model="row.status"
            :inactive-value="STATUS_GLOBAL_ENUM.停用"
            :active-value="STATUS_GLOBAL_ENUM.启用"
            @change="updateConfig(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="60">
        <template #default="{ row }: { row: AutoGotoUrlConfigItem }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="匹配规则" min-width="280" show-overflow-tooltip>
        <template #default="{ row }: { row: AutoGotoUrlConfigItem }">
          {{ row.match }}
        </template>
      </el-table-column>
      <el-table-column label="是否正则" min-width="70">
        <template #default="{ row }: { row: AutoGotoUrlConfigItem }">
          <el-tag v-if="row.enableRegex" type="primary">是</el-tag>
          <el-tag v-else type="warning">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="80">
        <template #default="{ row }: { row: AutoGotoUrlConfigItem }">
          {{ getEnumKeyByValue(AUTO_GOTO_URL_REDIRECT_TYPE_ENUM, row.redirectType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="目标Key/执行程序"
        min-width="125"
        :show-overflow-tooltip="false"
      >
        <template #default="{ row }: { row: AutoGotoUrlConfigItem }">
          <span v-if="row.redirectType === AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key">
            {{ row.redirect }}
          </span>

          <el-tooltip placement="top" v-else>
            <template #content>
              <div v-html="row.redirect.replace(/\n/g, '<br />')"></div>
            </template>
            <el-button link :icon="View">查看</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="90">
        <template #default="{ row }: { row: AutoGotoUrlConfigItem }">
          <el-button link type="primary" @click="editDialogRef?.open(row)">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>

  <!-- 添加、编辑弹窗 -->
  <EditDialog ref="editDialogRef" />
</template>

<script lang="ts" setup>
import { Plus, View } from "@element-plus/icons-vue";
import EditDialog from "../components/edit-dialog.vue";
import { autoGotoUrl } from "@/modules/auto-goto-url/data";
import { useAutoGotoUrlConfig } from "@/modules/auto-goto-url/composables";
import {
  AUTO_GOTO_URL_REDIRECT_TYPE_ENUM,
  AutoGotoUrlConfigItem,
} from "@/modules/auto-goto-url/types";
import { STATUS_GLOBAL_ENUM } from "@/types";
import { ElMessageBox } from "element-plus";

const {
  getAutoGotoUrl,
  toggleAutoGotoUrl,
  deleteConfig,
  updateConfig,
} = useAutoGotoUrlConfig();

const editDialogRef = ref<InstanceType<typeof EditDialog>>();
const ruleConfigList = computed(() => {
  return autoGotoUrl.value.configList ?? [];
});

const handleDelete = async (item: AutoGotoUrlConfigItem) => {
  await ElMessageBox.confirm("确认删除该规则吗？", "提示", { type: "warning" });

  deleteConfig(item);
};

onMounted(() => {
  getAutoGotoUrl();
});
</script>

<style lang="scss" scoped>
.page-auto-goto-url {
  @apply max-w-[900px] mx-auto;
}
</style>
