<template>
  <a-form
    :model="property"
    :rules="rules"
    layout="vertical"
    label-align="left"
    auto-label-width>
    <a-form-item
      label="线条宽度"
      field="strokeWidth"
      validate-trigger="blur">
      <a-input-number
        v-model.lazy="line.strokeWidth"
        placeholder="请输入线条宽度"
        :min="1" />
    </a-form-item>
    <a-form-item
      label="起、终点图标宽度"
      field="markerWidth"
      validate-trigger="blur">
      <a-input-number
        v-model.lazy="line.markerWidth"
        placeholder="请输入起、终点图标宽度"
        :min="1" />
    </a-form-item>
    <a-form-item
      label="起、终点图标高度"
      field="markerHeight"
      validate-trigger="blur">
      <a-input-number
        v-model.lazy="line.markerHeight"
        placeholder="请输入起、终点图标高度"
        :min="1" />
    </a-form-item>
    <a-form-item
      label="起点图标类型"
      field="sourceMarker"
      validate-trigger="blur">
      <a-select
        v-model="line.sourceMarker"
        placeholder="请选择起点图标类型"
        :options="options" />
    </a-form-item>
    <a-form-item
      label="终点图标类型"
      field="targetMarker"
      validate-trigger="blur">
      <a-select
        v-model="line.targetMarker"
        placeholder="请选择起点图标类型"
        :options="options" />
    </a-form-item>
    <a-form-item
      label="线条颜色"
      field="strokeColor"
      validate-trigger="blur">
      <ColorPicker
        v-model:pureColor="line.strokeColor"
        format="hex6"
        shape="circle"
        useType="both" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { GraphLine } from '@/types/node';
import { FieldRule, SelectOption } from '@arco-design/web-vue';
import { ref, toRefs, watch } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { isEqual } from 'lodash-es';

const props = defineProps<{
  property: GraphLine;
}>();

const emits = defineEmits<{
  (e: 'change', value: GraphLine): void;
}>();

const options: SelectOption[] = [
  {
    label: '没有图标',
    value: 'none',
  },
  {
    label: 'block',
    value: 'blcok',
  },
  {
    label: 'classic',
    value: 'classic',
  },
  {
    label: 'diamond',
    value: 'diamond',
  },
  {
    label: 'circle',
    value: 'circle',
  },
  {
    label: 'circle plus',
    value: 'circlePlus',
  },
  {
    label: 'ellipse',
    value: 'ellipse',
  },
  {
    label: 'cross',
    value: 'cross',
  },
  {
    label: 'async',
    value: 'async',
  },
];

const { property } = toRefs(props);
//当前节点
const line = ref<GraphLine>({
  strokeColor: '',
  strokeWidth: 0,
  markerHeight: 0,
  markerWidth: 0,
  sourceMarker: '',
  targetMarker: '',
});
//验证规则
const rules: Record<string, FieldRule> = {
  strokeWidth: {
    type: 'number',
    required: true,
    min: 1,
    message: '线条宽度应该大于1',
  },
  markerHeight: {
    type: 'number',
    required: true,
    min: 1,
    message: '连接点图标高度应该大于1',
  },
  markerWidth: {
    type: 'number',
    required: true,
    min: 1,
    message: '连接点图标宽度应该大于1',
  },
  sourceMarker: {
    type: 'string',
    required: true,
    message: '起点图标类型不能为空',
  },
  targetMarker: {
    type: 'string',
    required: true,
    message: '终点图标类型不能为空',
  },
  strokeColor: {
    type: 'string',
    required: true,
    message: '线条颜色不应该为空',
  },
};

//检测节点的改变重新赋值
watch(
  property,
  (val) => {
    line.value = { ...val };
  },
  {
    deep: true,
  }
);

//回传表单属性
watch(
  line,
  (val) => {
    if (!isEqual(val, property.value)) {
      emits('change', val);
    }
  },
  {
    deep: true,
  }
);
</script>
