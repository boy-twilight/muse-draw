<template>
  <a-form
    :model="property"
    :rules="rules"
    layout="vertical"
    label-align="left"
    auto-label-width
    ref="formIns">
    <a-form-item
      label="节点高度"
      field="height"
      validate-trigger="blur">
      <a-input-number
        v-model="node.height"
        placeholder="请输入节点高度"
        @change="emits('change', 'height', node.height)"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="节点宽度"
      field="width"
      validate-trigger="blur">
      <a-input-number
        v-model="node.width"
        placeholder="请输入节点宽度"
        @change="emits('change', 'width', node.width)"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="节点背景色"
      field="background"
      validate-trigger="blur">
      <a-input
        v-model="node.background"
        @change="emits('change', 'background', node.background)"
        placeholder="请输入节点背景色" />
    </a-form-item>
    <a-form-item
      label="字体大小"
      field="fontSize"
      validate-trigger="blur">
      <a-input-number
        v-model="node.fontSize"
        @change="emits('change', 'fontSize', node.fontSize)"
        placeholder="请输入节点字体大小"
        :min="10" />
    </a-form-item>
    <a-form-item
      label="字体颜色"
      field="fontColor"
      validate-trigger="blur">
      <a-input
        v-model="node.fontColor"
        @change="emits('change', 'fontColor', node.fontColor)"
        placeholder="请输入节点字体颜色" />
    </a-form-item>
    <a-form-item
      label="边框大小"
      field="borderSize"
      validate-trigger="blur">
      <a-input-number
        v-model="node.borderSize"
        @change="emits('change', 'borderSize', node.borderSize)"
        placeholder="请输入节点字体大小"
        :min="1" />
    </a-form-item>
    <a-form-item
      label="边框颜色"
      field="borderColor"
      validate-trigger="blur">
      <a-input
        v-model="node.borderColor"
        @change="emits('change', 'borderColor', node.borderColor)"
        placeholder="请输入节点边框色彩" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { GraphNode } from '@/types/node';
import { FieldRule } from '@arco-design/web-vue';
import {} from 'fs';
import { ref, toRefs, watch } from 'vue';

const props = defineProps<{
  property: GraphNode;
}>();

const emits = defineEmits<{
  (e: 'change', key: string, value: any): void;
}>();

const { property } = toRefs(props);
const node = ref<GraphNode>({
  width: 0,
  height: 0,
  fontColor: '',
  fontSize: 0,
  background: '',
  borderColor: '',
  borderSize: 0,
});
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
  background: {
    type: 'string',
    required: true,
    min: 1,
    message: '节点背景色不应该为空',
  },
  fontSize: {
    type: 'number',
    required: true,
    min: 10,
    message: '字体大小应该大于10',
  },
  fontColor: {
    type: 'string',
    required: true,
    message: '字体颜色不应该为空',
  },
  borderSize: {
    type: 'number',
    required: true,
    min: 1,
    message: '边框大小应该大于1',
  },
  borderColor: {
    type: 'number',
    required: true,
    min: 1,
    message: '边框色彩不应该为空',
  },
};

watch(property, (val) => {
  node.value = val;
});
</script>

<style lang="less" scoped></style>
