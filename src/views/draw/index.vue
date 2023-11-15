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
            @click="saveGraph">
            <template #icon>
              <IconSave />
            </template>
            保存
          </a-button>
          <a-dropdown @select="exportGraph">
            <a-button>
              <template #icon>
                <icon-export />
              </template>
              导出
            </a-button>
            <template #content>
              <a-doption value="png">PNG格式</a-doption>
              <a-doption value="jpeg">JPEG格式</a-doption>
              <a-doption value="svg">SVG格式</a-doption>
            </template>
          </a-dropdown>
        </div>
        <a-card class="property">
          <a-tabs v-model:active-key="curTab">
            <a-tab-pane
              key="draw"
              title="绘图信息">
              <DrawForm
                v-model:model="curDraw"
                @change="getDrawForm"
                ref="drawForm" />
            </a-tab-pane>
            <a-tab-pane
              key="node"
              title="节点属性">
              <a-scrollbar
                v-show="curId"
                style="height: 78vh; overflow: auto">
                <GraphNodeForm
                  :property="curNode"
                  @change="onNodePropertyChange"
                  v-show="curType == 'node'" />
                <GraphLineForm
                  :property="curLine"
                  @change="onLinePropertyChange"
                  v-show="curType == 'line'" />
              </a-scrollbar>
              <div v-show="!curId">
                <a-empty description="暂无节点信息" />
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { Graph, Shape, Node, Cell } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';
import {
  showPorts,
  createBasicNodes,
  registerKeyEvents,
  registerNode,
  registerPlugin,
  initNodeProperty,
  initLineProperty,
} from './index';
import { v4 } from 'uuid';
import { IconSave, IconExport } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { useRoute } from 'vue-router';
import { DrawHistory, GraphNode, GraphLine } from '@/types/node';
import { ls, format } from '@/utils';
import { DrawForm, GraphLineForm, GraphNodeForm } from './package';
import useDataStore from '@/store/data';
import { storeToRefs } from 'pinia';

//拿到用户数据
const { userData } = storeToRefs(useDataStore());
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
//当前操作的id
const curId = ref<string>('');
//当前节点的类型
const curType = ref<'node' | 'line'>('node');
//当前操作的节点
const curNode = ref<GraphNode>(initNodeProperty());
//当前操作的连线
const curLine = ref<GraphLine>(initLineProperty());
//当前操作的属性tab
const curTab = ref<'draw' | 'node'>('draw');
//全局属性表单的实例
const drawForm = ref<InstanceType<typeof DrawForm>>();

//获取节点信息
const getNodeProperty = (cell: Cell<Node.Properties>) => {
  //切换表单
  curId.value = cell.id;
  curType.value = 'node';
  //读取节点属性
  const attrs = cell.getAttrs();
  const { width, height } = cell.getProp('size')!;
  const {
    body: { fill, stroke, strokeWidth },
    text: { fill: fontColor, fontSize, textAnchor, textVerticalAnchor },
  } = attrs;
  curNode.value = {
    width,
    height,
    fontSize: Number(fontSize),
    fontColor: String(fontColor),
    borderColor: String(stroke),
    borderSize: Number(strokeWidth),
    background: String(fill),
    textAnchor: String(textAnchor),
    textVerticalAnchor: String(textVerticalAnchor),
  };
};

//获取线条信息
const getLineProperty = (cell: Cell<Node.Properties>) => {
  curId.value = cell.id;
  curType.value = 'line';
  const attrs = cell.getAttrs();
  const {
    line: { stroke, strokeWidth, sourceMarker, targetMarker },
  } = attrs;
  const source = Object(sourceMarker);
  const target = Object(targetMarker);
  const { name: sourceName } = source;
  const { name: targetName, height, width } = target;
  curLine.value = {
    strokeWidth: Number(strokeWidth),
    strokeColor: String(stroke),
    sourceMarker: sourceName ? sourceName : 'none',
    targetMarker: targetName ? targetName : 'none',
    markerHeight: height ? height : 0,
    markerWidth: width ? width : 0,
    fontColor: '',
    fontSize: 0,
  };
};

//当设置节点属性时
const onNodePropertyChange = (val: GraphNode) => {
  const cell = graph.value!.getCellById(curId.value);
  const {
    background,
    borderColor,
    borderSize,
    fontColor,
    fontSize,
    textAnchor,
    textVerticalAnchor,
    height,
    width,
  } = val;
  cell.setAttrs({
    body: { fill: background, stroke: borderColor, strokeWidth: borderSize },
    text: {
      fill: fontColor,
      fontSize,
      textAnchor: textAnchor,
      textVerticalAnchor: textVerticalAnchor,
    },
  });
  cell.setProp('size', {
    width,
    height,
  });
  curNode.value = val;
};

//设置线条属性的时候
const onLinePropertyChange = (val: GraphLine) => {
  const cell = graph.value!.getCellById(curId.value);
  const {
    markerWidth,
    markerHeight,
    strokeWidth,
    strokeColor,
    targetMarker,
    sourceMarker,
  } = val;
  const targetMarkerData =
    targetMarker == 'none'
      ? {}
      : {
          name: targetMarker,
          height: markerHeight,
          width: markerWidth,
          stroke: strokeColor,
          fill: strokeColor,
        };
  const sourceMarkerData =
    sourceMarker == 'none'
      ? {}
      : {
          name: sourceMarker,
          height: markerHeight,
          width: markerWidth,
          stroke: strokeColor,
          fill: strokeColor,
        };
  cell.replaceAttrs({
    line: {
      stroke: strokeColor,
      strokeWidth,
      sourceMarker: sourceMarkerData,
      targetMarker: targetMarkerData,
    },
  });
  curLine.value = val;
};

//获取表单值
const getDrawForm = (key: string, value: string) => {
  curDraw.value[key as keyof DrawHistory] = value;
};

//导出图
const exportGraph = (value: any) => {
  if (value == 'png') {
    graph.value!.exportPNG();
  } else if (value == 'jpeg') {
    graph.value!.exportJPEG();
  } else {
    graph.value!.exportSVG();
  }
};

//保存作图
const saveGraph = async () => {
  const res = await drawForm.value?.validate();
  if (res) {
    curTab.value = 'draw';
    return Message.error('请填写完整绘图名称和绘图备注后，在进行保存！');
  }
  curDraw.value.data = JSON.stringify(graph.value!.toJSON().cells);
  curDraw.value.lastUpdate = format(new Date());
  const index = userData.value.findIndex((item) => item.id == id);
  if (index != -1) {
    userData.value[index] = curDraw.value;
    Message.success('修改保存成功！');
  } else {
    curDraw.value.id = v4();
    userData.value.push(curDraw.value);
    Message.success('新增保存成功！');
  }
};

//获取页面初始值
const getPageVal = () => {
  const target = userData.value.find((item) => item.id == id);
  if (!target) return;
  curDraw.value = target;
  const nodes = JSON.parse(curDraw.value.data) as any[];
  nodes.forEach((item) => {
    const { shape } = item;
    if (shape == 'edge') {
      graph.value?.addEdge(item);
    } else {
      graph.value?.addNode(item);
    }
  });
};

//初始化画布
const initGraph = (container: HTMLDivElement) => {
  const { width, height } = getComputedStyle(container);
  return new Graph({
    container: container,
    grid: {
      type: 'doubleMesh',
      size: 12,
      visible: true,
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1, // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4, // 主次网格线间隔
        },
      ],
    },
    //是否允许子节点
    embedding: true,
    width: Number.parseFloat(width),
    height: Number.parseFloat(height),
    // 缩放
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.2,
      maxScale: 3,
    },
    // 交互
    interacting: {
      edgeLabelMovable: true,
      edgeMovable: true,
      arrowheadMovable: true,
    },
    panning: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
    // 连接
    connecting: {
      //这三个属性决定线条类型和连接位置
      router: 'manhattan',
      anchor: 'center',
      connectionPoint: 'anchor',
      //连接器
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
      //自动吸附，指定吸附距离
      snap: {
        radius: 20,
      },
      //允许空白连接
      allowBlank: true,
      //连接时，创建边
      createEdge() {
        const edge = new Shape.Edge({
          attrs: {
            line: {
              stroke: '#000',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8,
              },
            },
          },
          tools: [
            {
              name: 'edge-editor',
              args: {
                attrs: {
                  text: {
                    fontSize: 15,
                  },
                },
              },
            },
          ],
          defaultLabel: {
            attrs: {
              text: {
                fill: '#FF0000', // 设置所有标签的颜色为红色
                fontSize: 18, // 设置所有标签的文字大小
              },
            },
          },
          zIndex: 0,
        });
        //获取线条样式
        curId.value = edge.id;
        curTab.value = 'node';
        curType.value = 'line';
        getLineProperty(edge);
        return edge;
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet;
      },
    },
    // 高亮
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF',
            strokeWidth: 5,
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
        title: '基础图形',
        name: 'node',
      },
    ],
    layoutOptions: {
      columns: 3,
      columnWidth: 53,
      rowHeight: 45,
    },
    //获取拖拽的node
    getDropNode(node) {
      const size = node.size();
      const clone = node.clone().size({
        height: size.height * 2,
        width: size.width * 2,
      });
      curTab.value = 'node';
      //获取node信息
      getNodeProperty(clone);
      return clone;
    },
  });
  stencilIns.load(createBasicNodes(graph), 'node');
  stencil.value?.appendChild(stencilIns.container);
};

//注册画布事件
const registerGraphEvents = (graph: Graph) => {
  //鼠标进入时显示连接桩
  graph.on('node:mouseenter', () => {
    const ports = container.value!.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>;
    showPorts(ports, true);
  });
  //鼠标离开时隐藏连接桩
  graph.on('node:mouseleave', () => {
    const ports = container.value!.querySelectorAll(
      '.x6-port-body'
    ) as NodeListOf<SVGElement>;
    showPorts(ports, false);
  });
  //点击节点时获取节点信息
  graph.on('node:click', ({ cell }) => {
    curTab.value = 'node';
    if (curId.value == cell.id) return;
    getNodeProperty(cell);
  });
  //点击边时获取边的信息
  graph.on('edge:click', ({ cell }) => {
    curTab.value = 'node';
    if (curId.value == cell.id) return;
    getLineProperty(cell);
  });
  //节点删除时，删除属性
  graph.on('node:removed', ({ cell }) => {
    if (cell.id != curId.value) return;
    curId.value = '';
  });
  //边删除时，判断删除属性
  graph.on('edge:removed', ({ cell }) => {
    if (cell.id != curId.value) return;
    curId.value = '';
  });
  //节点大小改变时，同步值
  graph.on('node:change:size', ({ cell }) => {
    if (curId.value != cell.id) return;
    const { height, width } = cell.getProp('size');
    curNode.value.height = height;
    curNode.value.width = width;
  });
  // graph.on('edge:mouseenter', ({ cell }) => {
  //   cell.addTools([
  //     {
  //       name: 'source-arrowhead',
  //       args: {
  //         attrs: {},
  //       },
  //     },
  //     'target-arrowhead',
  //   ]);
  // });
  // graph.on('edge:mouseleave', ({ cell }) => {
  //   cell.removeTools(['source-arrowhead', 'target-arrowhead']);
  // });
};

//初始化页面
const initPage = async () => {
  registerNode();
  graph.value = initGraph(container.value as HTMLDivElement);
  registerPlugin(graph.value as Graph);
  initStencil(graph.value as Graph);
  registerKeyEvents(graph.value as Graph);
  registerGraphEvents(graph.value as Graph);
  await nextTick();
  getPageVal();
};

onMounted(() => {
  initPage();
});
</script>

<style lang="less">
@import './index.less';
</style>
