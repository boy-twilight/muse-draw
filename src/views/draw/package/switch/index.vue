<template>
  <div>
    <a-switch
      :model-value="modelValue"
      :checked-value="true"
      :unchecked-value="false"
      checked-text="开启"
      unchecked-text="关闭"
      @change="updateValue">
      <template #checked-icon> <IconCheck /> </template>>
      <template #unchecked-icon> <IconClose /> </template>>
    </a-switch>
  </div>
</template>

<script lang="ts" setup>
import { IconCheck, IconClose } from '@arco-design/web-vue/es/icon';
defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void;
}>();

const updateValue = (value: any) => {
  emits('update:modelValue', value);
};
</script>

<style lang="less" scoped></style>
