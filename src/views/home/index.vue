<template>
  <div class="home">
    <a-card>
      <a-table :data="history">
        <template #columns>
          <a-table-column
            title="名字"
            :width="200"
            data-index="name" />
          <a-table-column
            title="描述"
            :width="500"
            data-index="name" />
          <a-table-column
            title="最后一次修改时间"
            :width="250"
            data-index="lastUpdate" />
          <a-table-column title="操作">
            <template #cell="{ Record }">
              <a-link>
                <template #icon>
                  <IconEdit />
                </template>
                编辑
              </a-link>
              <a-link status="danger">
                <template #icon>
                  <IconDelete />
                </template>
                删除
              </a-link>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { DrawHistory } from '@/types/Node';
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';

const history = reactive<DrawHistory[]>([
  {
    name: '测试',
    desc: '测试',
    data: 's',
    lastUpdate: new Date().toString(),
    id: '',
  },
]);
</script>

<style lang="less" scoped>
.home {
  .arco-table {
  }
}
</style>
