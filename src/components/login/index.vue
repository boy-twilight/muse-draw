<!-- <template>
  <div class="login">
    <a-card>
      <p class="title">欢迎使用管理系统 !</p>
      <a-form
        :model="loginForm"
        layout="vertical"
        label-align="left"
        auto-label-width
        :rules="loginRule"
        ref="form">
        <a-form-item
          label="账号"
          field="account"
          validate-trigger="blur"
          show-colon
          hide-asterisk>
          <a-input
            v-model="loginForm.account"
            placeholder="请输入账号">
            <template #prefix>
              <IconUser />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          label="密码"
          field="password"
          validate-trigger="blur"
          show-colon
          hide-asterisk>
          <a-input-password
            v-model="loginForm.password"
            placeholder="请输入密码">
            <template #prefix>
              <IconLock />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
      <div class="function">
        <div class="remember"><a-checkbox>记住我</a-checkbox></div>
        <div class="forget"><a-link>忘记密码？</a-link></div>
      </div>
      <div class="btn">
        <a-button
          type="primary"
          @click="gologin"
          :loading="loading.login"
          >登陆</a-button
        >
      </div>
      <div class="third-party">
        <a-divider orientation="center">其它登陆方式</a-divider>
        <div class="way">
          <IconQq
            size="19"
            style="color: #328bff"
            @click="loginThirdParty('qq登陆')" />
          <IconWechat
            size="20"
            style="color: #14d36a"
            @click="loginThirdParty('微信登陆')" />
          <IconGithub
            size="20"
            style="color: #1d2129"
            @click="loginThirdParty('github登陆')" />
          <IconWeibo
            size="23"
            style="color: #e32a2e"
            @click="loginThirdParty('微博登陆')" />
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Form, Message } from '@arco-design/web-vue';
import {
  IconUser,
  IconLock,
  IconQq,
  IconWechat,
  IconWeibo,
  IconGithub,
} from '@arco-design/web-vue/es/icon';
import { loginRule } from './index';
import { LoginForm } from '@/views/login/login';
import { login } from '@/apis/login';
import { useRouter } from 'vue-router';
import { ls } from '@/utils';
import { PAGE_HOME } from '@/constants/page';

const router = useRouter();
//登录表单
const loginForm = ref<LoginForm>({
  account: '',
  password: '',
});
//登陆加载动画
const loading = reactive<Record<string, boolean>>({
  login: false,
  refreshCode: false,
});
//表单容器
const form = ref<InstanceType<typeof Form>>();

//第三方登陆
const loginThirdParty = (type: string) => {
  Message.info(`${type}暂未支持！`);
};

//登录
const gologin = async () => {
  const res = await form.value?.validate();
  if (res) return Message.error('请将表单填写完整过后再登陆！');
  loading.login = true;
  try {
    const { data }: any = await login(loginForm.value);
    ls.set('user_key', data, 1000 * 60 * 60 * 24);
    router.replace(PAGE_HOME);
    Message.success('登陆成功！');
  } catch (err: any) {
    Message.error(err.message);
  } finally {
    loading.login = false;
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('@/assets/image/background.png') no-repeat center/cover;
  .title {
    font-size: 25px;
    margin: 30px 0 20px 0;
    color: #000000;
    text-align: center;
  }
  .arco-card {
    width: 405px;
    height: 430px;
    border-radius: 8px;

    .function {
      display: flex;
      align-items: center;
      .remember {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 1;
      }
    }
    .btn {
      margin-top: 20px;
      .arco-btn {
        width: 100%;
      }
    }
    .third-party {
      margin-top: 25px;
      .arco-divider {
        &:deep(.arco-divider-text) {
          color: #bfbfbf;
        }
      }
      .way {
        .arco-icon {
          margin: 0 10px;
          cursor: pointer;
          transition: 0.3s;
          &:hover {
            opacity: 0.7;
          }
        }
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style> -->
