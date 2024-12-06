import { interceptorRequest } from '@/modules/response-mock/request';
import { initAutoGotoUrl } from '@/modules/auto-goto-url';

export default defineUnlistedScript(async () => {
  initAutoGotoUrl();

  interceptorRequest();
});
