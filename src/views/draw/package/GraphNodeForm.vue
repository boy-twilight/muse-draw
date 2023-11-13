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
        v-model="node.height"
        placeholder="请输入节点高度"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="节点宽度"
      field="width"
      validate-trigger="blur">
      <a-input-number
        v-model="node.width"
        placeholder="请输入节点宽度"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="字体大小"
      field="fontSize"
      validate-trigger="blur">
      <a-input-number
        v-model="node.fontSize"
        placeholder="请输入节点字体大小"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="边框大小"
      field="borderSize"
      validate-trigger="blur">
      <a-input-number
        v-model="node.borderSize"
        placeholder="请输入节点字体大小"
        :min="1" />
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
      label="文字水平对齐方式"
      field="textAnchor"
      validate-trigger="blur">
      <a-checkbox-group :default-value="node.textAnchor">
        <a-checkbox value="start">居左</a-checkbox>
        <a-checkbox value="middle">居中</a-checkbox>
        <a-checkbox value="end">居右</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item
      label="文字垂直对齐方式"
      field="textAnchor"
      validate-trigger="blur">
      <a-checkbox-group
        :default-value="node.textVerticalAlign"
        @change="changeSelect">
        <a-checkbox value="start">居上</a-checkbox>
        <a-checkbox value="middle">居中</a-checkbox>
        <a-checkbox value="end">居下</a-checkbox>
      </a-checkbox-group>
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
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

const props = defineProps<{
  property: GraphNode;
}>();

const emits = defineEmits<{
  (e: 'change', value: GraphNode): void;
}>();

const { property } = toRefs(props);
//当前节点
const node = ref<GraphNode>({
  width: 0,
  height: 0,
  fontColor: '',
  fontSize: 0,
  background: '',
  borderColor: '',
  borderSize: 0,
  textAnchor: ['middle'],
  textVerticalAlign: ['middle'],
});
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
    type: 'number',
    required: true,
    message: '边框色彩不应该为空',
  },
  textAnchor: {
    type: 'array',
    required: true,
    message: '必须选中一种文字水平对齐方式',
  },
  textVerticalAlign: {
    type: 'array',
    required: true,
    message: '必须选中一种文字锤子对齐方式',
  },
};

const changeSelect = (val: any) => {
  console.log(val);
};

watch(property, (val) => {
  node.value = { ...val };
});

watch(
  node,
  (val) => {
    emits('change', val);
  },
  {
    deep: true,
  }
);
</script>

<style lang="less" scoped></style>
