import { FieldRule } from '@arco-design/web-vue';

export const loginRule: Record<string, FieldRule> = {
  account: {
    required: true,
    type: 'string',
    message: '账号不能为空！',
  },
  password: {
    required: true,
    type: 'string',
    message: '密码不能为空！',
  },
};
