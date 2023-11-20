<template>
  <a-layout class="container">
    <a-layout-sider class="side">
      <a-menu
        v-model:selected-keys="curMenu"
        v-model:collapsed="isCollapse"
        @menu-item-click="handleClick"
        show-collapse-button
        class="menu">
        <div class="title">
          <img :src="logo" /><span>{{ isCollapse ? '' : 'muse draw' }}</span>
        </div>
        <a-menu-item :key="PAGE_HOME">
          <template #icon>
            <IconHistory />
          </template>
          记录
        </a-menu-item>
        <a-menu-item :key="PAGE_DRAW">
          <template #icon>
            <IconPen />
          </template>
          绘画
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
import { ref, computed } from 'vue';
import { IconPen, IconHistory } from '@arco-design/web-vue/es/icon';
import { PAGE_DRAW, PAGE_HOME } from '@/constants/page';
import { useRouter } from 'vue-router';
import { ss } from '@/utils';
import logo from '@/assets/image/logo.svg';
import useDataStore from '@/store/data';
import { storeToRefs } from 'pinia';

const router = useRouter();
const { curMenu } = storeToRefs(useDataStore());
//菜单是否收缩
const isCollapse = ref<boolean>(true);
//logo大小
const logoSize = computed(() => `${isCollapse.value ? 25 : 40}px`);
//菜单的宽度
const menuSize = computed(() => `${isCollapse.value ? 48 : 200}px`);
//内容的宽度
const mainSize = computed(
  () => `calc(100% - ${isCollapse.value ? 48 : 200}px)`
);

//处理菜单点击
const handleClick = (key: string) => {
  ss.set('curMenu', [key]);
  router.push(key);
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  .side {
    width: v-bind(menuSize) !important;
    .menu {
      height: 100%;

      .title {
        display: flex;
        align-items: center;
        height: 55px;

        img {
          width: v-bind(logoSize);
          margin: 0 5px 0 10px;
        }
        span {
          font-size: 14px;
          color: #000;
          font-weight: 550;
          transition: 0.3s;
          overflow: hidden;
        }
      }
    }
  }
  .main {
    width: v-bind(mainSize);
    height: 100%;
    .content {
      height: 100%;
      width: 100%;
      padding: 12px;
      background-color: #f5f5f5;
    }
  }
}
</style>
