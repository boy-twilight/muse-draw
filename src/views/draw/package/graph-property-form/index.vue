<template>
  <a-form
    :model="property"
    label-align="left"
    auto-label-width>
    <span class="title">画布属性：</span>
    <a-form-item
      label="背景模式"
      field="bgMode">
      <a-radio-group v-model="graph.bgMode">
        <a-radio value="color">纯色背景</a-radio>
        <a-radio value="image">图像背景</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="背景图像"
      field="bgImage"
      v-show="graph.bgMode == 'image'">
      <div class="upload">
        <a-image
          width="150"
          height="150"
          :src="graph.bgImage"
          style="cursor: pointer" />
        <a-button @click="uploadImage">
          <template #icon>
            <IconUpload />
          </template>
          上传
        </a-button>
      </div>
    </a-form-item>
    <a-form-item
      label="背景透明度"
      field="opacity"
      v-show="graph.bgMode == 'image'">
      <div class="slider-container">
        <a-slider
          v-model.lazy="graph.opacity"
          :min="0.1"
          :max="1"
          :step="0.1"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="背景色"
      field="background">
      <div class="color">
        <ColorPicker
          v-model:pureColor="graph.background"
          format="hex6" />
        <a-tag>
          <template #icon>
            <IconBgColors :size="16" />
          </template>
          {{ graph.background }}
        </a-tag>
      </div>
    </a-form-item>
    <a-form-item
      label="画布缩放"
      field="mousewheel">
      <Switch v-model="graph.mousewheel" />
    </a-form-item>
    <a-form-item
      v-show="graph.mousewheel"
      label="缩放倍率"
      field="scale">
      <div class="slider-container">
        <a-slider
          v-model="graph.scale"
          :min="0.1"
          :max="5"
          :step="0.1"
          range
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="画布平移"
      field="panning">
      <Switch v-model="graph.panning" />
    </a-form-item>
    <a-form-item field="embedding">
      <template #label>
        <div class="label">
          <span>节点嵌套</span>
          <a-tooltip
            content="是否允许一个节点在另外一个节点内部成为子节点，默认为true。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.embedding" />
    </a-form-item>
    <a-form-item field="allowBlank">
      <template #label>
        <div class="label">
          <span>空白连接</span>
          <a-tooltip content="是否允许连接到画布空白位置的点，默认为true。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.allowBlank" />
    </a-form-item>
    <a-form-item field="allowBlank">
      <template #label>
        <div class="label">
          <span>空白连接</span>
          <a-tooltip content="是否允许连接到画布空白位置的点，默认为true。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.allowBlank" />
    </a-form-item>
    <a-form-item field="allowLoop">
      <template #label>
        <div class="label">
          <span>循环连接</span>
          <a-tooltip
            content="是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为true。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.allowLoop" />
    </a-form-item>
    <a-form-item field="allowMulti">
      <template #label>
        <div class="label">
          <span>多边连接</span>
          <a-tooltip
            content="是否允许在相同的起始节点和终止之间创建多条边，默认为true。
            当设置为 false 时，在起始和终止节点之间只允许创建一条边。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.allowMulti" />
    </a-form-item>
    <a-form-item field="highlight">
      <template #label>
        <div class="label">
          <span>连接高光</span>
          <a-tooltip
            content="拖动边时，是否高亮显示所有可用的连接桩或节点，默认值为false。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.highlight" />
    </a-form-item>
    <a-form-item field="nodeMovable">
      <template #label>
        <div class="label">
          <span>节点拖拽</span>
          <a-tooltip content="节点是否可以被移动，默认值为true">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.nodeMovable" />
    </a-form-item>
    <a-form-item field="edgeMovable">
      <template #label>
        <div class="label">
          <span>边拖拽</span>
          <a-tooltip content="边是否可以被移动，默认值为true。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.edgeMovable" />
    </a-form-item>
    <a-form-item field="edgeMovable">
      <template #label>
        <div class="label">
          <span>边标签拖拽</span>
          <a-tooltip content="边的标签是否可以被移动，默认值为true。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.edgeLabelMovable" />
    </a-form-item>
    <a-form-item field="arrowheadMovable">
      <template #label>
        <div class="label">
          <span>箭头拖拽</span>
          <a-tooltip content="边的起始/终止箭头是否可以被移动，默认值为true。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <Switch v-model="graph.arrowheadMovable" />
    </a-form-item>
    <span class="title">线条属性：</span>
    <a-form-item
      label="线条类型"
      field="lineType">
      <a-radio-group v-model="graph.lineType">
        <a-radio value="">实线</a-radio>
        <a-radio value="7,7">虚线</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="起点箭头"
      field="sourceMarker">
      <a-select
        v-model="graph.sourceMarker"
        placeholder="请选择起点箭头类型"
        :options="markerOptions" />
    </a-form-item>
    <a-form-item
      label="终点箭头"
      field="targetMarker">
      <a-select
        v-model="graph.targetMarker"
        placeholder="请选择终点箭头类型"
        :options="markerOptions" />
    </a-form-item>
    <a-form-item field="router">
      <template #label>
        <div class="label">
          <span>路由模式</span>
          <a-tooltip
            content="路由将边的路径点 vertices 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点（不包含边的起点和终点）。例如，经过 orth 路由处理后，边的每一条线段都是水平或垂直的正交线段，默认为	智能正交路由。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <a-select
        v-model="graph.router"
        placeholder="请选择路由模式"
        :options="routerOptions" />
    </a-form-item>
    <a-form-item field="connector">
      <template #label>
        <div class="label">
          <span>连接器</span>
          <a-tooltip
            content="连接起点、终点、路有点的连线类型，默认值为圆角连接器">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <a-select
        v-model="graph.connector"
        placeholder="请选择连接器"
        :options="connectorOptions" />
    </a-form-item>
    <a-form-item field="snap">
      <template #label>
        <div class="label">
          <span>自动吸附</span>
          <a-tooltip
            content="开启和关闭连线过程中自动吸附，数值大小代表吸附距离，默认值是20px。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <div class="slider-container">
        <a-slider
          v-model.lazy="graph.snap"
          :min="1"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item field="lineTools">
      <template #label>
        <div class="label">
          <span>边上工具</span>
          <a-tooltip content="开启边的一些小工具便于操作，默认有边上编辑工具。">
            <IconInfoCircle />
          </a-tooltip>
        </div>
      </template>
      <a-checkbox-group
        v-model="graph.lineTools"
        :options="lineToolOptions" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { GraphProperty } from '@/types/node';
import { ref, toRefs } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import Switch from '../switch/index.vue';
import {
  IconInfoCircle,
  IconBgColors,
  IconUpload,
} from '@arco-design/web-vue/es/icon';
import { SelectOption, CheckboxOption, Message } from '@arco-design/web-vue';
import { compressImage } from '@/utils';

const props = defineProps<{
  property: GraphProperty;
}>();
const { property } = toRefs(props);
//画布属性
const graph = ref<GraphProperty>(property.value);
//箭头选项
const markerOptions: SelectOption[] = [
  {
    label: '没有箭头',
    value: 'none',
  },
  {
    label: '实心箭头',
    value: 'block',
  },
  {
    label: '经典箭头',
    value: 'classic',
  },
  {
    label: '菱形箭头',
    value: 'diamond',
  },
  {
    label: '圆形箭头',
    value: 'circle',
  },
  {
    label: '圆形和加号箭头',
    value: 'circlePlus',
  },
  {
    label: '椭圆箭头',
    value: 'ellipse',
  },
  {
    label: '交叉箭头',
    value: 'cross',
  },
  {
    label: 'async',
    value: 'async',
  },
];
//连接器选项
const routerOptions: SelectOption[] = [
  {
    label: '内置路由',
    value: 'normal',
  },
  {
    label: '正交路由',
    value: 'orth',
  },
  {
    label: '受限正交路由',
    value: 'oneSide',
  },
  {
    label: '智能正交路由',
    value: 'manhattan',
  },
  {
    label: '智能地铁线路由',
    value: 'metro',
  },
  {
    label: '实体关系路由',
    value: 'er',
  },
];
//连接器选项
const connectorOptions: SelectOption[] = [
  {
    label: '简单连接器',
    value: 'normal',
  },
  {
    label: '平滑连接器',
    value: 'smooth',
  },
  {
    label: '圆角连接器',
    value: 'rounded',
  },
  {
    label: '跳线连接器',
    value: 'jumpover',
  },
];
//边上工具选项
const lineToolOptions: CheckboxOption[] = [
  {
    label: '文本编辑工具',
    value: 'edge-editor',
  },

  {
    label: '起点修改工具',
    value: 'source-arrowhead',
  },
  {
    label: '终点修改工具',
    value: 'target-arrowhead',
  },
  {
    label: '路径点工具',
    value: 'vertices',
  },
  {
    label: '矩形框工具',
    value: 'boundary',
  },
  {
    label: '删除工具',
    value: 'button-remove',
  },
  {
    label: '线段工具',
    value: 'segments',
  },
];

//上传图像
const uploadImage = () => {
  const upload = document.createElement('input');
  upload.type = 'file';
  upload.accept = '.png,.jpeg,.jpg,.gif,.bmp';
  upload.style.display = 'none';
  upload.onchange = async (e: any) => {
    const files = e.target.files;
    if (files.length <= 0) return;
    const file = files[0];
    if (!/\.(jpg|jpeg|png|gif|bmp)$/i.test(file.name)) {
      return Message.error('请上传图像文件');
    }
    const imageUrl = await compressImage(file, 4320, 7680, 0.6);
    graph.value.bgImage = imageUrl;
  };
  document.body.appendChild(upload);
  upload.click();
  document.body.removeChild(upload);
};

defineExpose({
  getFormValue(): GraphProperty {
    return graph.value;
  },
});
</script>
