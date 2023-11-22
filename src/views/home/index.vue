<template>
  <div class="home">
    <a-card>
      <div class="header">
        <div class="left">
          <a-button
            type="primary"
            status="danger"
            @click="deleteSelect">
            <template #icon>
              <IconDelete />
            </template>
            批量删除
          </a-button>
        </div>
        <div class="right">
          <a-input-search
            v-model="keyWords"
            placeholder="请输入名字进行搜索" />
        </div>
      </div>
      <a-table
        :data="curShow"
        :pagination="false"
        row-key="id"
        v-model:selected-keys="curKeys"
        :row-selection="{
          showCheckedAll: true,
          fixed: true,
        }"
        :scroll="{
          maxHeight: '79vh',
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
            title="保存时间"
            :width="250"
            data-index="createTime" />
          <a-table-column
            title="修改时间"
            :width="250"
            data-index="updateTime" />
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-link @click="goEdit(record)">
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
          :total="userData.length"
          v-model:current="curPage"
          v-model:page-size="pageSize"
          :page-size-options="[20, 30, 40, 50, 60]"
          show-total
          show-jumper
          show-page-size />
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { ls, ss, warning } from '@/utils';
import { useRouter } from 'vue-router';
import { PAGE_DRAW } from '@/constants/page';
import useDataStore from '@/store/data';
import { storeToRefs } from 'pinia';
import { UserData } from '@/types/node';

const router = useRouter();
const { userData, curMenu } = storeToRefs(useDataStore());
//当前的选择的列的key
const curKeys = ref<string[]>([]);
//搜索关键字
const keyWords = ref<string>('');
//当前页码
const curPage = ref<number>(1);
//分页大小
const pageSize = ref<number>(20);
//当前显示的表格
const curShow = computed(() =>
  userData.value
    .filter((item) => item.name.includes(keyWords.value))
    .slice((curPage.value - 1) * pageSize.value, curPage.value * pageSize.value)
);

//删除历史记录
const deleteHistory = (id: string) => {
  const index = userData.value.findIndex((item) => item.id == id);
  userData.value.splice(index, 1);
};

//批量删除历史记录
const deleteSelect = () => {
  if (curKeys.value.length == 0)
    return Message.error('请先选中需要删除的绘图记录！');
  warning({
    title: '批量删除选择',
    content: '确认批量删除选中的绘图记录吗，此操作不可撤销',
    onOk: () => {
      userData.value = userData.value.filter(
        (item) => !curKeys.value.includes(item.id)
      );
      curKeys.value = [];
    },
  });
};

//前往编辑页面
const goEdit = (record: UserData) => {
  curMenu.value = [PAGE_DRAW];
  ss.set('curMenu', curMenu.value);
  router.push({
    path: PAGE_DRAW,
    query: {
      id: record.id,
    },
  });
};

//刷新或者退出浏览器时，保存记录
onMounted(() => {
  window.addEventListener('beforeunload', () => {
    ls.set('user_data', userData.value);
  });
});
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
  .arco-card {
    height: 100%;
    border-radius: 10px;
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
}
</style>
