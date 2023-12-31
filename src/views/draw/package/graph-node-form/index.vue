<template>
  <a-form
    :model="property"
    label-align="left"
    auto-label-width>
    <a-form-item
      label="高度"
      field="height">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.height"
          :min="10"
          :max="1000"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="宽度"
      field="width">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.width"
          :min="10"
          :max="1000"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="填充颜色"
      field="background">
      <div class="color">
        <ColorPicker
          v-model:pureColor="node.background"
          format="hex6" />
        <a-tag>
          <template #icon>
            <IconBgColors :size="16" />
          </template>
          {{ node.background }}
        </a-tag>
      </div>
    </a-form-item>
    <a-form-item
      label="字体大小"
      field="fontSize">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.fontSize"
          :min="10"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="字体颜色"
      field="fontColor">
      <div class="color">
        <ColorPicker
          v-model:pureColor="node.fontColor"
          format="hex6" />
        <a-tag>
          <template #icon>
            <IconFontColors :size="15" />
          </template>
          {{ node.fontColor }}
        </a-tag>
      </div>
    </a-form-item>
    <a-form-item
      label="水平对齐"
      field="textAnchor">
      <a-radio-group
        v-model="node.textAnchor"
        type="button"
        size="small">
        <a-radio value="end">向左</a-radio>
        <a-radio value="middle">两端</a-radio>
        <a-radio value="start">向右</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="垂直对齐"
      field="textVerticalAnchor">
      <a-radio-group
        v-model="node.textVerticalAnchor"
        type="button"
        size="small">
        <a-radio value="bottom">顶部</a-radio>
        <a-radio value="middle">居中</a-radio>
        <a-radio value="top">底部</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="行高"
      field="lineHeight">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.lineHeight"
          :min="10"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="线条宽度"
      field="borderSize">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.borderSize"
          :min="1"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="线条颜色"
      field="borderColor">
      <div class="color">
        <ColorPicker
          v-model:pureColor="node.borderColor"
          format="hex6" />
        <a-tag>
          <template #icon>
            <span class="iconfont line-color">&#xe624;</span>
          </template>
          {{ node.borderColor }}
        </a-tag>
      </div>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { GraphNode } from '@/types/node';
import { ref, toRefs, watch } from 'vue';
import { cloneDeep, isEqual } from 'lodash-es';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { IconBgColors, IconFontColors } from '@arco-design/web-vue/es/icon';

const props = defineProps<{
  property: GraphNode;
}>();

const emits = defineEmits<{
  (e: 'change', value: GraphNode): void;
}>();

const { property } = toRefs(props);
//当前节点
const node = ref<GraphNode>(property.value);

//检测节点的改变重新赋值
watch(
  property,
  (val) => {
    node.value = cloneDeep(val);
  },
  {
    deep: true,
  }
);

//回传表单属性
watch(
  node,
  (val) => {
    if (!isEqual(property.value, val)) {
      emits('change', val);
    }
  },
  {
    deep: true,
  }
);
</script>
