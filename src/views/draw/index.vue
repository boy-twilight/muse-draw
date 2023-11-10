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
          <a-button type="primary">
            <template #icon>
              <IconSave />
            </template>
            保存
          </a-button>
          <a-button>
            <template #icon>
              <icon-export />
            </template>
            导出
          </a-button>
        </div>
        <a-card class="property">
          <a-tabs default-active-key="global">
            <a-tab-pane
              key="global"
              title="全局属性">
              Content of Tab Panel 1
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
import { ref, Ref, onMounted } from 'vue';
import { Graph, Shape } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';
import {
  showPorts,
  createCircle,
  createRect,
  createPolygon,
  registerKeyEvents,
  registerNode,
  registerPlugin,
} from './index';
import { IconSave, IconExport } from '@arco-design/web-vue/es/icon';
import { DrawHistory } from '@/types/Node';

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

//初始化侧边栏
const initStencil = (graph: Graph) => {
  const stencilIns = new Stencil({
    title: '流程图',
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 180,
    collapsable: true,
    groups: [
      {
        title: '图形',
        name: 'node',
      },
    ],
    layoutOptions: {
      columns: 2,
      columnWidth: 80,
      rowHeight: 55,
    },
  });
  const r1 = createRect(graph, { rx: 0, ry: 0 });
  const r2 = createRect(graph, { rx: 6, ry: 6 });
  const r3 = createRect(graph, { rx: 20, ry: 26 });
  const r4 = createPolygon(graph, {
    refPoints: '10,0 40,0 30,20 0,20',
  });
  const r5 = createPolygon(graph, {
    refPoints: '0,10 10,0 20,10 10,20',
  });
  const r6 = createCircle(graph);
  stencilIns.load([r1, r2, r3, r4, r5, r6], 'node');
  stencil.value?.appendChild(stencilIns.container);
};

//初始化图
const initGraph = (container: Ref<HTMLDivElement>): Graph => {
  return new Graph({
    container: container.value,
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
              stroke: '#A2B1C3',
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

const registerGraphEvents = (graph: Graph) => {
  graph.on('node:mouseenter', () => {
    const container = document.getElementById('graph-container')!;
    const ports = container.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>;
    showPorts(ports, true);
  });
  graph.on('node:mouseleave', () => {
    const container = document.getElementById('graph-container')!;
    const ports = container.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>;
    showPorts(ports, false);
  });
};

onMounted(() => {
  registerNode();
  graph.value = initGraph(container as Ref<HTMLDivElement>);
  initStencil(graph.value);
  registerGraphEvents(graph.value as Graph);
  registerKeyEvents(graph.value as Graph);
  registerPlugin(graph.value as Graph);
});
</script>

<style lang="less">
@import './index.less';
</style>
