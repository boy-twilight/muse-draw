<template>
  <a-layout class="container">
    <a-layout-sider class="side">
      <a-menu
        :default-selected-keys="curKey"
        @menu-item-click="handleClick"
        class="menu">
        <div class="title"><img :src="logo" /><span>muse draw</span></div>
        <a-menu-item :key="PAGE_DRAW">
          <template #icon>
            <IconPen />
          </template>
          绘画
        </a-menu-item>
        <a-menu-item :key="PAGE_HOME">
          <template #icon>
            <IconHistory />
          </template>
          记录
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout class="main">
      <a-layout-content class="content">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in">
            <component
              :is="Component"
              :key="$route.fullPath" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { IconPen, IconHistory } from '@arco-design/web-vue/es/icon';
import { PAGE_DRAW, PAGE_HOME } from '@/constants/page';
import { useRouter } from 'vue-router';
import { ss } from '@/utils';
import logo from '@/assets/icon/logo.svg';

const router = useRouter();
const curKey = ref<string[]>(ss.get('curKey') || [PAGE_DRAW]);
const handleClick = (key: string) => {
  if (curKey.value[0] == key) return;
  curKey.value = [key];
  ss.set('curKey', [key]);
  router.push(key);
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  .side {
    width: 220px;
    .menu {
      height: 100%;

      .title {
        display: flex;
        align-items: center;
        height: 48px;

        img {
          width: 30px;
          margin: 0 5px 0 10px;
        }
        span {
          font-size: 14px;
          color: #000;
          font-weight: 550;
        }
      }
    }
  }
  .main {
    width: calc(100% - 200px);
    height: 100%;
    .content {
      padding: 12px;
      background-color: #f5f5f5;
    }
  }
}
</style>
