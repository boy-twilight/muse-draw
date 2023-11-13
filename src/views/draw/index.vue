<template>
  <div class="draw">
    <a-card>
      <div
        class="stencil"
        ref="stencil"></div>
      <div
        class="container"
        ref="container"></div>
      <div class="operation">
        <div class="header">
          <a-button
            type="primary"
            @click="save">
            <template #icon>
              <IconSave />
            </template>
            保存
          </a-button>
          <a-dropdown>
            <a-button>
              <template #icon>
                <icon-export />
              </template>
              导出
            </a-button>
          </a-dropdown>
        </div>
        <a-card class="property">
          <a-tabs v-model:active-key="curTab">
            <a-tab-pane
              key="draw"
              title="绘图信息">
              <DrawForm
                v-model:model="curDraw"
                @change="getFormValue"
                ref="drawForm" />
            </a-tab-pane>
            <a-tab-pane
              key="node"
              title="节点属性">
              Content of Tab Panel 2
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Graph, Shape } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';
import {
  showPorts,
  createAllNodes,
  registerKeyEvents,
  registerNode,
  registerPlugin,
} from './index';
import { v4 } from 'uuid';
import { IconSave, IconExport } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { useRoute } from 'vue-router';
import { DrawHistory } from '@/types/Node';
import { ls, format } from '@/utils';
import DrawForm from './package/DrawForm.vue';
import { onBeforeRouteLeave } from 'vue-router';

//拿到用户数据
const userData = ls.get('user_data') as DrawHistory[];
//拿到路由参数
const route = useRoute();
const id = route.query.id + '';
//绘图实例
const graph = ref<Graph>();
//绘图容器
const container = ref<HTMLDivElement>();
//侧边栏辅助容器
const stencil = ref<HTMLDivElement>();
//当前画图
const curDraw = ref<DrawHistory>({
  name: '',
  desc: '',
  data: '',
  lastUpdate: '',
  id: '',
});
//当前操作的属性tab
const curTab = ref<'draw' | 'node'>('draw');
//全局属性表单的实例
const drawForm = ref<InstanceType<typeof DrawForm>>();

//初始化画布
const initGraph = (container: HTMLDivElement) => {
  return new Graph({
    container: container,
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3,
    },
    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20,
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#000000',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8,
              },
            },
          },
          zIndex: 0,
        });
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet;
      },
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF',
          },
        },
      },
    },
  });
};

//初始化侧边栏
const initStencil = (graph: Graph) => {
  const stencilIns = new Stencil({
    title: '流程图',
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 250,
    collapsable: true,
    groups: [
      {
        title: '图形',
        name: 'node',
      },
    ],
    layoutOptions: {
      columns: 3,
      columnWidth: 53,
      rowHeight: 45,
    },
  });
  stencilIns.load(createAllNodes(graph), 'node');
  stencil.value?.appendChild(stencilIns.container);
};

const registerGraphEvents = (graph: Graph) => {
  graph.on('node:mouseenter', () => {
    const ports = container.value!.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>;
    showPorts(ports, true);
  });
  graph.on('node:mouseleave', () => {
    const ports = container.value!.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>;
    showPorts(ports, false);
  });
  graph.on('node:click', ({ cell, node }) => {
    const size = cell.getProp('size');
    const data = cell.getAttrs();
    console.log(node);
    console.log(data);
  });
};

//获取表单值
const getFormValue = (key: string, value: string) => {
  curDraw.value[key as keyof DrawHistory] = value;
};

//获取页面初始值
const getPageVal = () => {
  if (id.length < 16) return;
  curDraw.value = userData.find((item) => item.id == id) as DrawHistory;
};

//保存作图
const save = async () => {
  const res = await drawForm.value?.validate();
  if (res) {
    curTab.value = 'draw';
    return Message.error('请填写完整绘图名称和绘图备注后，在进行保存！');
  }
  curDraw.value.data = JSON.stringify(graph.value!.toJSON());
  curDraw.value.lastUpdate = format(new Date());
  const index = userData.findIndex((item) => item.id == id);
  if (index != -1) {
    userData[index] = curDraw.value;
    Message.success('修改保存成功！');
  } else {
    curDraw.value.id = v4();
    userData.push(curDraw.value);
    Message.success('新增保存成功！');
  }
};

onBeforeRouteLeave(() => {
  ls.set('user_data', userData);
});

onMounted(() => {
  getPageVal();
  registerNode();
  graph.value = initGraph(container.value as HTMLDivElement);
  registerPlugin(graph.value as Graph);
  initStencil(graph.value as Graph);
  registerKeyEvents(graph.value as Graph);
  registerGraphEvents(graph.value as Graph);
});
</script>

<style lang="less">
@import './index.less';
</style>
