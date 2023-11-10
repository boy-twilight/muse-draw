<template>
  <div class="home">
    <a-card>
      <div class="header">
        <a-button>批量操作</a-button>
      </div>
      <a-table
        :data="curShow"
        row-key="id"
        :pagination="false">
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
      <div class="footer">
        <a-pagination
          :total="history.length"
          v-model:current="curPage"
          v-model:page-size="pageSize"
          :page-size-options="[10, 20, 30, 40, 50]"
          show-total
          show-jumper
          show-page-size />
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { DrawHistory } from '@/types/Node';
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';
import { ss, format } from '@/utils';

const history = reactive<DrawHistory[]>(
  ss.get('user_data') || [
    {
      name: '测试',
      desc: '测试',
      data: 's',
      lastUpdate: format(new Date()),
      id: 'randow',
    },
  ]
);
const curPage = ref<number>(1);
const pageSize = ref<number>(10);
const curShow = computed(() =>
  history.slice(
    (curPage.value - 1) * pageSize.value,
    curPage.value * pageSize.value
  )
);
</script>

<style lang="less" scoped>
.home {
  .header {
    margin: 10px 0;
  }
  .arco-table {
    .arco-link {
      margin-right: 10px;
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-right: 40px;
  }
}
</style>
