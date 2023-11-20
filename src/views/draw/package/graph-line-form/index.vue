<template>
  <a-form
    :model="property"
    label-align="left"
    auto-label-width>
    <a-form-item
      label="线条宽度"
      field="strokeWidth">
      <div class="slider-container">
        <a-slider
          v-model.lazy="line.strokeWidth"
          :min="1"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="线条颜色"
      field="strokeColor">
      <ColorPicker
        v-model:pureColor="line.strokeColor"
        format="hex6" />
    </a-form-item>
    <a-form-item
      label="起点箭头"
      field="sourceMarker">
      <a-select
        v-model="line.sourceMarker"
        placeholder="请选择起点箭头类型"
        :options="options" />
    </a-form-item>
    <a-form-item
      label="终点箭头"
      field="targetMarker">
      <a-select
        v-model="line.targetMarker"
        placeholder="请选择终点箭头类型"
        :options="options" />
    </a-form-item>
    <a-form-item
      label="箭头宽度"
      field="markerWidth"
      v-show="line.targetMarker != 'none' || line.sourceMarker != 'none'">
      <div class="slider-container">
        <a-slider
          v-model.lazy="line.markerWidth"
          :min="5"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <a-form-item
      label="箭头高度"
      field="markerHeight"
      v-show="line.targetMarker != 'none' || line.sourceMarker != 'none'">
      <div class="slider-container">
        <a-slider
          v-model.lazy="line.markerHeight"
          :min="5"
          :max="100"
          show-input />
      </div>
    </a-form-item>
    <!-- <a-form-item
      label="字体大小"
      field="fontSize"
      >
      <div class="slider-container">
        <a-slider
          v-model.lazy="line.fontSize"
          :min="10"
          :max="100"
          show-input />
      </div>
    </a-form-item> -->
    <!-- <a-form-item
      label="字体颜色"
      field="fontColor"
      >
      <ColorPicker
        v-model:pureColor="line.fontColor"
        format="hex6"
        shape="circle" 
        useType="both" />
    </a-form-item> -->
  </a-form>
</template>

<script lang="ts" setup>
import { GraphLine } from '@/types/node';
import { SelectOption } from '@arco-design/web-vue';
import { ref, toRefs, watch } from 'vue';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import { isEqual, cloneDeep } from 'lodash-es';

const props = defineProps<{
  property: GraphLine;
}>();

const emits = defineEmits<{
  (e: 'change', value: GraphLine): void;
}>();

const { property } = toRefs(props);
//当前线条
const line = ref<GraphLine>(property.value);
//下拉框选项
const options: SelectOption[] = [
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

//检测节点的改变重新赋值
watch(
  property,
  (val) => {
    line.value = cloneDeep(val);
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

<style lang="less" scoped>
.arco-form {
  &:deep(.arco-form-item-content) {
    .slider-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding-left: 10px;
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
