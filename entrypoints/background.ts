import { updateDynamicRules } from '@/modules/header-intercept/update-rules';

export default defineBackground(() => {
  updateDynamicRules();
});
