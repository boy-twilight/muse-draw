<template>
  <a-form
    :model="property"
    label-align="left"
    auto-label-width>
    <a-form-item
      label="背景色"
      field="background">
      <ColorPicker
        v-model:pureColor="graph.background"
        format="hex6" />
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
    <a-form-item
      label="节点嵌套"
      field="embedding">
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
  </a-form>
</template>

<script lang="ts" setup>
import { GraphProperty } from '@/types/node';
import { ref, toRefs } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import Switch from '../switch/index.vue';
import { IconInfoCircle } from '@arco-design/web-vue/es/icon';

const props = defineProps<{
  property: GraphProperty;
}>();
const { property } = toRefs(props);
//画布属性
const graph = ref<GraphProperty>(property.value);

defineExpose({
  getFormValue(): GraphProperty {
    return graph.value;
  },
});
</script>

<style lang="less" scoped>
.arco-form {
  &:deep(.arco-form-item-label) {
    .label {
      span {
        margin-right: 5px;
      }
    }
  }
  &:deep(.arco-form-item-content) {
    .slider-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding-left: 5px;
      .arco-slider {
        display: flex;
        .arco-input-wrapper {
          width: 50px;
          .arco-input {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
