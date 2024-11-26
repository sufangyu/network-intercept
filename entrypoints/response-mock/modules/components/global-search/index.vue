<template>
  <section>
    <el-select
      v-model="result"
      placeholder="全局搜索: 接口名字、接口地址"
      style="width: 460px"
      size="default"
      clearable
      value-key="ruleId"
      filterable
      remote
      :remote-method="handleSearch"
      @change="handleGotoPage"
    >
      <el-option
        class="project-option"
        v-for="item in results"
        :key="item"
        :value="item"
        :label="`接口地址: ${item.apiUrl}`"
      >
        <div class="text-[13px] w-[427px]">
          <p class="truncate">接口地址：{{ item.apiUrl }}</p>
          <p class="flex justify-between text-gray-400 text-xs">
            <span>项目/分组：{{ item.projectName }}/{{ item.groupName }}</span>
            <span>接口名称：{{ item.apiName }}</span>
          </p>
        </div>
      </el-option>
    </el-select>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { throttle } from "lodash-es";
import { responseProject } from "../../data";

const props = withDefaults(
  defineProps<{
    projectId?: string;
  }>(),
  {
    projectId: "", // UhXxSYQW5YoIWMjw_OfQZ
  }
);

const $router = useRouter();

interface SearchResult {
  projectId: string;
  projectName: string;
  groupId: string;
  groupName: string;
  ruleId: string;
  apiName: string;
  apiUrl: string;
}

const result = ref<SearchResult>();
const results = ref<SearchResult[]>([]);
const handleSearch = throttle((query: string) => {
  if (query) {
    const data = searchMockRules(query);
    results.value = data;
  }
});

/**
 * 根据接口名称、接口地址搜索接口
 *
 * @param keyword 关键词
 */
const searchMockRules = (keyword: string): SearchResult[] => {
  const data = responseProject.value.list ?? [];

  // 如果指定了 projectId，则仅匹配对应的项目；否则全量查找
  const filteredProjects = props.projectId
    ? data.filter((project) => project.id === props.projectId)
    : data;

  return filteredProjects.flatMap((project) =>
    project.groupList.flatMap((group) =>
      (group.mockRules ?? [])
        .filter(
          (rule) => rule.apiName?.includes(keyword) || rule.apiUrl?.includes(keyword)
        )
        .map((rule) => ({
          projectId: project.id,
          projectName: project.name,
          groupId: group.id,
          groupName: group.name,
          ruleId: rule.id,
          apiName: rule.apiName || "-",
          apiUrl: rule.apiUrl,
        }))
    )
  );
};

/**
 * 打开页面
 * @param item 搜索结果 item
 */
const handleGotoPage = (item: SearchResult) => {
  $router.push({
    name: "Group",
    params: { id: item.projectId },
    query: { groupId: item.groupId },
  });
};
</script>

<style lang="scss" scoped>
.project-option {
  line-height: 1.5;
  border-bottom: 1px solid #f0f0f0;
  @apply px-4 py-2 box-border h-auto;

  p {
    padding: 3px 0;
  }
}
</style>
