<template>
  <div class="desc">
    <div class="title">CyberEng工程云</div>
    <div class="title title-desc">物联网云平台</div>
    <p>物联网云平台是一款可扩展的开放性物联网中间件软件平台，专注服务于各大数字化系统，向下提供各IOT设备的接入，支撑设备数据采集上云，向上提供云端API。</p>
    <router-link to="/user/login">
      <button :class="loginClass">登录</button>
    </router-link>
    <button @click="register" @mouseover="addClass" @mouseleave="removeClass" :class="registerClass">注册</button>

    <!-- 三步注册组件 -->
    <!-- 加v-if可以在关闭注册表单时清除表单数据 -->
    <user-register
      :visibleRegister="visible"
      @close="closeregister"
      v-if="visible"
    ></user-register>
  </div>
</template>

<script>
import UserRegister from './UserRegister'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  mixins: [mixinDevice],
  name: 'description',
  data() {
    return {
      visible: false,  // 控制注册组件显隐
      registerClass: 'unchosed',
      loginClass: 'chosed'
    }
  },
  components: {
    UserRegister
  },
  methods: {
    // 打开注册对话框
    register() {
      this.visible = true
    },
    // 关闭注册对话框
    closeregister() {
      this.visible = false
    },
    addClass() {
      this.registerClass = 'chosed'
      this.loginClass = 'unchosed'
    },
    removeClass() {
      this.registerClass = 'unchosed'
      this.loginClass = 'chosed'
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/description.less';
</style>


