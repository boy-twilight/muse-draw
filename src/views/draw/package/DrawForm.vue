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
import { reactive, toRefs, ref, watch } from 'vue';
import { DrawHistory } from '@/types/node';
import { Form, ValidatedError, FieldRule } from '@arco-design/web-vue';

const props = defineProps<{
  model: DrawHistory;
}>();

const emits = defineEmits<{
  (e: 'change', key: string, value: any): void;
}>();

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
};

const { model } = toRefs(props);
const form = ref<DrawHistory>({
  name: '',
  desc: '',
  data: '',
  lastUpdate: '',
  id: '',
});
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
