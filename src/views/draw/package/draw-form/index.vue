<template>
  <a-form
    :model="form"
    :rules="rules"
    layout="vertical"
    label-align="left"
    auto-label-width
    ref="formIns">
    <a-form-item
      label="名称"
      field="name"
      validate-trigger="blur">
      <a-input
        v-model="form.name"
        placeholder="请输入绘图名称"
        @change="emits('change', 'name', form.name)" />
    </a-form-item>
    <a-form-item
      label="导出类型"
      field="exportType"
      validate-trigger="blur">
      <a-select
        v-model="form.exportType"
        :options="options"
        @change="emits('change', 'exportType', form.exportType)"
        placeholder="请选择导出图片的类型" />
    </a-form-item>
    <a-form-item
      label="备注"
      field="desc"
      validate-trigger="blur">
      <a-textarea
        v-model="form.desc"
        placeholder="请输入此次绘图的备注"
        :auto-size="{
          minRows: 5,
        }"
        @change="emits('change', 'desc', form.desc)" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { toRefs, ref, watch } from 'vue';
import { UserData } from '@/types/node';
import {
  Form,
  ValidatedError,
  FieldRule,
  SelectOption,
} from '@arco-design/web-vue';

const props = defineProps<{
  model: UserData;
}>();

const emits = defineEmits<{
  (e: 'change', key: string, value: any): void;
}>();

const { model } = toRefs(props);
const form = ref<UserData>({
  id: '',
  name: '',
  desc: '',
  data: '',
  exportType: '',
  updateTime: '',
  createTime: '',
});
const rules: Record<string, FieldRule> = {
  name: {
    message: '绘图名称必须填写',
    required: true,
    type: 'string',
  },
  desc: {
    message: '绘图备注必须填写',
    required: true,
    type: 'string',
  },
  exportType: {
    message: '导出图片的类型必须选择',
    required: true,
    type: 'string',
  },
};
const options: SelectOption[] = [
  { label: 'png格式', value: 'png' },
  { label: 'jpeg格式', value: 'jpeg' },
  { label: 'svg格式', value: 'svg' },
];
const formIns = ref<InstanceType<typeof Form>>();

watch(
  model,
  (val) => {
    form.value = { ...val };
  },
  {
    deep: true,
  }
);

defineExpose({
  validate(): Promise<Record<string, ValidatedError> | undefined> {
    return formIns.value!.validate();
  },
});
</script>
