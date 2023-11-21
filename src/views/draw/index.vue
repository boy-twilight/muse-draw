<template>
  <div class="draw">
    <a-card>
      <div
        class="stencil"
        ref="stencil"></div>
      <a-split
        class="split"
        v-model:size="size"
        :max="0.73"
        :min="0.6">
        <template #first>
          <div
            class="container"
            ref="container"></div>
        </template>
        <template #second>
          <div class="operation">
            <a-card class="property">
              <a-tabs v-model:active-key="curTab">
                <a-tab-pane
                  key="global"
                  title="全局属性">
                  <a-scrollbar style="height: 83vh; overflow: auto">
                    <GraphPropertyForm
                      :property="curProperty"
                      ref="propertyForm" />
                    <div class="footer">
                      <a-button
                        type="primary"
                        @click="saveSetting">
                        <template #icon>
                          <IconSave />
                        </template>
                        保存设置
                      </a-button>
                    </div>
                  </a-scrollbar>
                </a-tab-pane>
                <a-tab-pane
                  key="node"
                  title="节点属性">
                  <a-scrollbar
                    v-show="curId"
                    style="height: 82vh; overflow: auto">
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
                <a-tab-pane
                  key="draw"
                  title="绘图信息">
                  <DrawForm
                    v-model:model="curDraw"
                    @change="getDrawForm"
                    ref="drawForm" />
                  <div class="footer">
                    <a-button
                      type="primary"
                      @click="saveGraph">
                      <template #icon>
                        <IconSave />
                      </template>
                      保存作图
                    </a-button>
                    <a-button @click="exportGraph">
                      <template #icon>
                        <icon-export />
                      </template>
                      导出图片
                    </a-button>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </div>
        </template>
      </a-split>
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
  initGraphProperty,
  getMarker,
  getConnector,
  getLineToos,
} from './index';
import { v4 } from 'uuid';
import { IconSave, IconExport } from '@arco-design/web-vue/es/icon';
import { Message } from '@arco-design/web-vue';
import { useRoute } from 'vue-router';
import { UserData, GraphNode, GraphLine, GraphProperty } from '@/types/node';
import { format, ls } from '@/utils';
import {
  DrawForm,
  GraphLineForm,
  GraphNodeForm,
  GraphPropertyForm,
} from './package';
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
const curDraw = ref<UserData>({
  id: '',
  name: '',
  desc: '',
  data: '',
  exportType: 'png',
  createTime: '',
  updateTime: '',
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
const curTab = ref<'draw' | 'node' | 'global'>('global');
//画布属性
const curProperty = ref<GraphProperty>(
  ls.get('setting') || initGraphProperty()
);
//绘画记录表单的实例
const drawForm = ref<InstanceType<typeof DrawForm>>();
//全局属性表单实例
const propertyForm = ref<InstanceType<typeof GraphPropertyForm>>();
//面板分隔
const size = ref<number>(0.73);

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
    line: { stroke, strokeWidth, targetMarker },
  } = attrs;
  const { height, width } = Object(targetMarker);
  curLine.value = {
    strokeWidth: Number(strokeWidth),
    strokeColor: String(stroke),
    markerHeight: height ? height : 0,
    markerWidth: width ? width : 0,
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
  const { markerWidth, markerHeight, strokeWidth, strokeColor } = val;
  cell.setAttrs({
    line: {
      stroke: strokeColor,
      strokeWidth,
      sourceMarker: {
        height: markerHeight,
        width: markerWidth,
      },
      targetMarker: {
        height: markerHeight,
        width: markerWidth,
      },
    },
  });
  curLine.value = val;
};

//获取表单值
const getDrawForm = (key: string, value: string) => {
  curDraw.value[key as keyof UserData] = value;
};

//导出图
const exportGraph = () => {
  const { exportType } = curDraw.value;
  if (exportType == 'png') {
    graph.value!.exportPNG();
  } else if (exportType == 'jpeg') {
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
  const index = userData.value.findIndex((item) => item.id == id);
  if (index != -1) {
    curDraw.value.updateTime = format(new Date());
    userData.value[index] = curDraw.value;
    Message.success('修改保存成功！');
  } else {
    curDraw.value.id = v4();
    const curTime = new Date();
    curDraw.value.createTime = format(curTime);
    curDraw.value.updateTime = format(curTime);
    userData.value.push(curDraw.value);
    Message.success('新增保存成功！');
  }
};

//初始化画布设置
const initSetting = () => {
  const { panning } = curProperty.value;
  if (!panning) {
    graph.value?.disablePanning();
  }
};

//保存设置
const saveSetting = () => {
  ls.set('setting', propertyForm.value!.getFormValue());
  location.reload();
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
  return new Graph({
    container: container,
    background: {
      color: curProperty.value.background,
    },
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
    embedding: curProperty.value.embedding,
    // 缩放
    mousewheel: {
      enabled: curProperty.value.mousewheel,
      zoomAtMousePosition: true,
      modifiers: ['ctrl', 'meta'],
      minScale: curProperty.value.scale[0],
      maxScale: curProperty.value.scale[1],
    },
    // 交互
    interacting: {
      edgeLabelMovable: curProperty.value.edgeLabelMovable,
      edgeMovable: curProperty.value.edgeMovable,
      arrowheadMovable: curProperty.value.arrowheadMovable,
      nodeMovable: curProperty.value.nodeMovable,
    },
    // 连接
    connecting: {
      //这三个属性决定线条类型和连接位置
      router: curProperty.value.router,
      anchor: 'center',
      connectionPoint: 'anchor',
      //连接器
      connector: {
        name: curProperty.value.connector,
        args: getConnector(curProperty.value.connector),
      },
      //自动吸附，指定吸附距离
      snap: {
        radius: curProperty.value.snap,
      },
      allowBlank: curProperty.value.allowBlank,
      allowEdge: curProperty.value.allowEdge,
      allowPort: curProperty.value.allowPort,
      allowLoop: curProperty.value.allowLoop,
      allowMulti: curProperty.value.allowMulti,
      allowNode: curProperty.value.allowNode,
      highlight: curProperty.value.highlight,
      //连接时，创建边
      createEdge() {
        const edge = new Shape.Edge({
          attrs: {
            line: {
              stroke: '#000000',
              strokeWidth: 2,
              sourceMarker: getMarker(curProperty.value.sourceMarker),
              targetMarker: getMarker(curProperty.value.targetMarker),
              'stroke-dasharray': curProperty.value.lineType,
            },
          },
          tools: getLineToos(curProperty.value.lineTools),
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
    title: '流程图基础图形',
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 250,
    collapsable: false,
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
      clone.addTools([
        {
          name: 'node-editor',
          args: {
            attrs: {
              text: {
                fontSize: 15,
              },
            },
          },
        },
      ]);
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
};

//初始化页面
const initPage = async () => {
  registerNode();
  graph.value = initGraph(container.value as HTMLDivElement);
  registerPlugin(graph.value as Graph);
  initStencil(graph.value as Graph);
  registerKeyEvents(graph.value as Graph);
  registerGraphEvents(graph.value as Graph);
  initSetting();
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
