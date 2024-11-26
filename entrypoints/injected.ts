import { interceptorRequest } from '@/modules/response-mock/request';

export default defineUnlistedScript(async () => {
  interceptorRequest();
});
