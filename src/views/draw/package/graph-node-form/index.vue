<template>
  <a-form
    :model="property"
    :rules="rules"
    layout="vertical"
    label-align="left"
    auto-label-width>
    <a-form-item
      label="高度"
      field="height"
      validate-trigger="blur">
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
      field="width"
      validate-trigger="blur">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.width"
          :min="10"
          :max="1000"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="字体大小"
      field="fontSize"
      validate-trigger="blur">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.fontSize"
          :min="10"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="线条宽度"
      field="borderSize"
      validate-trigger="blur">
      <div class="slider-container">
        <a-slider
          v-model.lazy="node.borderSize"
          :min="1"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="填充颜色"
      field="background"
      validate-trigger="blur">
      <ColorPicker
        v-model:pureColor="node.background"
        format="hex6"
        shape="circle"
        useType="both" />
    </a-form-item>
    <a-form-item
      label="线条颜色"
      field="borderColor"
      validate-trigger="blur">
      <ColorPicker
        v-model:pureColor="node.borderColor"
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
      label="水平对齐"
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
      label="垂直对齐"
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
  </a-form>
</template>

<script lang="ts" setup>
import { GraphNode } from '@/types/node';
import { FieldRule } from '@arco-design/web-vue';
import { ref, toRefs, watch } from 'vue';
import { cloneDeep, isEqual } from 'lodash-es';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { initNodeProperty } from '@/views/draw';

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
    message: '节点宽度应该大于10',
  },
  height: {
    type: 'number',
    required: true,
    message: '节点高度应该大于10',
  },
  borderSize: {
    type: 'number',
    required: true,
    message: '边框大小应该大于1',
  },
  fontSize: {
    type: 'number',
    required: true,
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

<style lang="less" scoped>
.arco-form {
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
