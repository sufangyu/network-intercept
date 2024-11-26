<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { useResponseMockProject } from "./modules/composables/index";

const { getProjectList } = useResponseMockProject();

onMounted(async () => {
  await getProjectList();
});
</script>

<style lang="postcss" scoped></style>
