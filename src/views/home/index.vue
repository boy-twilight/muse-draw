<template>
  <div class="home">
    <a-card>
      <div class="header">
        <div class="left">
          <a-button>批量操作</a-button>
        </div>
        <div class="right">
          <a-input-search
            v-model="keyWords"
            placeholder="请输入名字进行搜索" />
        </div>
      </div>
      <a-table
        :data="curShow"
        row-key="id"
        :pagination="false"
        v-model:selected-keys="curKeys"
        :row-selection="{
          showCheckedAll: true,
          fixed: true,
        }">
        <template #columns>
          <a-table-column
            title="名字"
            :width="200"
            data-index="name" />
          <a-table-column
            title="描述"
            :width="500"
            ellipsis
            tooltip
            data-index="name" />
          <a-table-column
            title="最后一次修改时间"
            :width="250"
            data-index="lastUpdate" />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-link
                @click="
                  router.push({
                    path: PAGE_DRAW,
                    query: {
                      id: record.id,
                    },
                  })
                ">
                <template #icon>
                  <IconEdit />
                </template>
                编辑
              </a-link>
              <a-popconfirm
                :content="`确认删除${record.name}吗?`"
                @ok="deleteHistory(record.id)">
                <a-link status="danger">
                  <template #icon>
                    <IconDelete />
                  </template>
                  删除
                </a-link>
              </a-popconfirm>
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
import { ls, format } from '@/utils';
import { useRouter } from 'vue-router';
import { PAGE_DRAW } from '@/constants/page';
import { onMounted } from 'vue';

const router = useRouter();
//用户的操作历史
const history = reactive<DrawHistory[]>(
  ls.get('user_data') || [
    {
      name: '测试',
      desc: '测试',
      data: 's',
      lastUpdate: format(new Date()),
      id: 'randow',
    },
  ]
);
//当前的选择的列的key
const curKeys = ref<string[]>([]);
//搜索关键字
const keyWords = ref<string>('');
//当前页码
const curPage = ref<number>(1);
//分页大小
const pageSize = ref<number>(10);
//当前显示的表格
const curShow = computed(() =>
  history
    .filter((item) => item.name.includes(keyWords.value))
    .slice((curPage.value - 1) * pageSize.value, curPage.value * pageSize.value)
);

const deleteHistory = (id: string) => {
  const index = history.findIndex((item) => item.id == id);
  history.splice(index, 1);
};

onMounted(() => {
  window.addEventListener('beforeunload', () => {
    ls.set('user_data', history);
  });
});
</script>

<style lang="less" scoped>
.home {
  .header {
    margin: 10px 0;
    display: flex;
    .left {
      flex-grow: 1;
      flex-basis: 1;
      flex-shrink: 0;
    }
    .right {
      width: 350px;
    }
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
