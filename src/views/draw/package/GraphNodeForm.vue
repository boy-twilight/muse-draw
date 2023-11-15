<template>
  <a-form
    :model="property"
    :rules="rules"
    layout="vertical"
    label-align="left"
    auto-label-width>
    <a-form-item
      label="节点高度"
      field="height"
      validate-trigger="blur">
      <a-input-number
        v-model.lazy="node.height"
        placeholder="请输入节点高度"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="节点宽度"
      field="width"
      validate-trigger="blur">
      <a-input-number
        v-model.lazy="node.width"
        placeholder="请输入节点宽度"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="字体大小"
      field="fontSize"
      validate-trigger="blur">
      <a-input-number
        v-model.lazy="node.fontSize"
        placeholder="请输入节点字体大小"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="边框大小"
      field="borderSize"
      validate-trigger="blur">
      <a-input-number
        v-model.lazy="node.borderSize"
        placeholder="请输入节点字体大小"
        :min="1" />
    </a-form-item>
    <a-form-item
      label="文字水平对齐方式"
      field="textAnchor"
      validate-trigger="blur">
      <a-radio-group
        v-model="node.textAnchor"
        type="button">
        <a-radio value="end">向左对齐</a-radio>
        <a-radio value="middle">两端对齐</a-radio>
        <a-radio value="start">向右对齐</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="文字垂直对齐方式"
      field="textVerticalAnchor"
      validate-trigger="blur">
      <a-radio-group
        v-model="node.textVerticalAnchor"
        type="button">
        <a-radio value="bottom">顶部对齐</a-radio>
        <a-radio value="middle">居中对齐</a-radio>
        <a-radio value="top">底部对齐</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="节点背景色"
      field="background"
      validate-trigger="blur">
      <ColorPicker
        v-model:pureColor="node.background"
        format="hex6"
        shape="circle"
        useType="both" />
    </a-form-item>
    <a-form-item
      label="字体颜色"
      field="fontColor"
      validate-trigger="blur">
      <ColorPicker
        v-model:pureColor="node.fontColor"
        format="hex6"
        shape="circle"
        useType="both" />
    </a-form-item>
    <a-form-item
      label="边框颜色"
      field="borderColor"
      validate-trigger="blur">
      <ColorPicker
        v-model:pureColor="node.borderColor"
        format="hex6"
        shape="circle"
        useType="both" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { GraphNode } from '@/types/node';
import { FieldRule } from '@arco-design/web-vue';
import { ref, toRefs, watch } from 'vue';
import { cloneDeep, isEqual } from 'lodash-es';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { initNodeProperty } from '..';

const props = defineProps<{
  property: GraphNode;
}>();

const emits = defineEmits<{
  (e: 'change', value: GraphNode): void;
}>();

const { property } = toRefs(props);
//当前节点
const node = ref<GraphNode>(initNodeProperty());
//验证规则
const rules: Record<string, FieldRule> = {
  width: {
    type: 'number',
    required: true,
    min: 10,
    message: '节点宽度应该大于10',
  },
  height: {
    type: 'number',
    required: true,
    min: 10,
    message: '节点高度应该大于10',
  },
  borderSize: {
    type: 'number',
    required: true,
    min: 1,
    message: '边框大小应该大于1',
  },
  fontSize: {
    type: 'number',
    required: true,
    min: 10,
    message: '字体大小应该大于10',
  },
  background: {
    type: 'string',
    required: true,
    message: '节点背景色不应该为空',
  },
  fontColor: {
    type: 'string',
    required: true,
    message: '字体颜色不应该为空',
  },
  borderColor: {
    type: 'string',
    required: true,
    message: '边框色彩不应该为空',
  },
  textAnchor: {
    type: 'array',
    required: true,
    message: '必须选中一种文字水平对齐方式',
  },
  textVerticalAnchor: {
    type: 'array',
    required: true,
    message: '必须选中一种文字锤子对齐方式',
  },
};

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
