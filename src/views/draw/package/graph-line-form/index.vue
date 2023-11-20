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
      <div class="color">
        <ColorPicker
          v-model:pureColor="line.strokeColor"
          format="hex6" />
        <a-tag>
          <template #icon>
            <span class="iconfont line-color">&#xe624;</span>
          </template>
          {{ line.strokeColor }}
        </a-tag>
      </div>
    </a-form-item>
    <a-form-item
      label="箭头宽度"
      field="markerWidth">
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
      field="markerHeight">
      <div class="slider-container">
        <a-slider
          v-model.lazy="line.markerHeight"
          :min="5"
          :max="100"
          show-input />
      </div>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { GraphLine } from '@/types/node';
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
