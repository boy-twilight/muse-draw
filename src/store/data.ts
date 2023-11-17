import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserData } from '@/types/node';
import { ls } from '@/utils';

export default defineStore('data', () => {
  //用户的操作历史
  const userData = ref<UserData[]>(ls.get('user_data') || []);
  return {
    userData,
  };
});
