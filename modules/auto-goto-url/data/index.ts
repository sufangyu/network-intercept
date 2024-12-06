import { ref } from 'vue';
import { AutoGotoUrl } from '../types';

export const autoGotoUrl = ref<AutoGotoUrl>({
  toggle: true,
  configList: []
});
