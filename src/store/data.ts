import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserData } from '@/types/node';
import { ls, ss } from '@/utils';
import { PAGE_HOME } from '@/constants/page';

export default defineStore('data', () => {
  //用户的操作历史
  const userData = ref<UserData[]>(ls.get('user_data') || []);
  //当前活跃的key
  const curMenu = ref<string[]>(ss.get('curMenu') || [PAGE_HOME]);
  return {
    userData,
    curMenu,
  };
});
