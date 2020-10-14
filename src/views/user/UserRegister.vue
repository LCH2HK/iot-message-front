<template>
  <div>
    <a-modal
      :visible="visibleRegister"
      width="800px"
      :footer="null"
      :class="['registerPage', device]"
      @cancel="close"
      :maskClosable="false"
    >
      <div class="register">
        <!-- 注册用户 -->
        <div class="register-one" v-show="step1">
          <div class="register-one-title" v-if="device === 'desktop'">
            <!-- <img src="~@/assets/img/register/userRegister.png" /> -->
            <span>用户注册</span>
            <span class="have-account">
              已有账号?
              <span class="registered" @click="registered">登录</span>
            </span>
          </div>
          <a-form :form="form">
            <!-- 用户名 -->
            <a-form-item label="用户名称" class="item">
              <a-input
                class="userName"
                placeholder="4-16位，可包含字母、数字和下划线"
                v-decorator="['userName',{ rules:[{required: true, message: ' '},{
                  validator: usernameOnChange }]}]"
              ></a-input>
            </a-form-item>
            <a-form-item label="真实姓名" class="item">
              <a-input
                class="userName"
                placeholder="请输入真实姓名，中文或英文"
                v-decorator="['realName',{ rules:[{required: true, message: ' '},{ validator: realnameVerify }]}]"
              ></a-input>
            </a-form-item>
            <a-form-item label="设置密码" class="item">
              <a-input
                class="password"
                v-decorator="['password',{ rules:[{required: true, message: '请输入密码'},{ validator: handlePasswordLevel }]}]"
                type="password"
                placeholder="6-12位，可包含字母、数字和下划线"
              ></a-input>
            </a-form-item>
            <a-form-item label="确认密码" class="item">
              <a-input
                class="passwordConfirm"
                v-decorator="['confirm',{ rules:[{required: true, message: '请确认密码'}, {
                  validator: compareToFirstPassword}]}]"
                type="password"
                placeholder="请确认密码"
              ></a-input>
            </a-form-item>
            <!-- 手机号 -->
            <a-form-item label="手机号码" class="item">
              <a-input
                class="phoneNumber"
                v-decorator="['phone',{ rules:[{required: true, message: ' '},{
                  validator: phoneVerify }]}]"
                placeholder="请输入手机号码"
              ></a-input>
            </a-form-item>
            <!-- 滑块验证码 -->
            <!--            <a-form-item label="验证" class="item">-->
            <!--              <j-slider-->
            <!--                class="verify"-->
            <!--                @onSuccess="handleJSliderSuccess"-->
            <!--                v-decorator="['verify',{ rules:[{required: true, message: '请滑动滑块验证码'}]}]"-->
            <!--              />-->
            <!--            </a-form-item>-->
            <!-- 手机验证码 -->
            <!--            <a-form-item label="短信验证码" class="item phone" :labelCol="{span: 12}"-->
            <!--                         :wrapperCol="{span: 24}">-->

            <!--              <a-input-->
            <!--                class="phone-code"-->
            <!--                v-decorator="['identifyCode',{ rules:[{required: true, message: '请输入验证码'}]}]"-->
            <!--                placeholder="请输入验证码"-->
            <!--              ></a-input>-->
            <!--              <a-button-->
            <!--                class="get-phone-code"-->
            <!--                type="primary"-->
            <!--                :disabled="state.smsSendBtn"-->
            <!--                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"-->
            <!--                @click="getCode"-->
            <!--              >获取验证码-->
            <!--              </a-button>-->

            <!--            </a-form-item>-->
            <a-form-item label="所属小组" class="item" v-show="false">
              <a-select
                v-decorator="['groupName',{rules: [{ required: true, message: '请选择所属小组！' }]}]"
                placeholder="请选择所属小组"
              >
                <a-select-option value="集团级平台">集团级平台</a-select-option>
                <a-select-option value="电网、水电">电网、水电</a-select-option>
                <a-select-option value="轨道交通">轨道交通</a-select-option>
                <a-select-option value="工程云研发">工程云研发</a-select-option>
                <a-select-option value="建筑">建筑</a-select-option>
                <a-select-option value="京津冀、华北区域">京津冀、华北区域</a-select-option>
                <a-select-option value="深圳、珠三角区域">深圳、珠三角区域</a-select-option>
                <a-select-option value="企业级平台">企业级平台</a-select-option>
                <a-select-option value="海外">海外</a-select-option>
                <a-select-option value="移民">移民</a-select-option>
                <a-select-option value="GIS研发">GIS研发</a-select-option>
                <a-select-option value="经营">经营</a-select-option>
                <a-select-option value="UI设计">UI设计</a-select-option>
                <a-select-option value="测试工作">测试工作</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
            <!-- 提交 下一步 -->
            <div class="next-container">
              <a-button type="primary" @click.stop.prevent="register">注册</a-button>
            </div>
            <!-- 单选框，服务条款 -->
            <a-checkbox @change="getChecked" class="checkbox-text">
              <span :class="{'agree-span':checked}">我同意</span>&nbsp;
              <a href="#">服务条款</a>
            </a-checkbox>
            <div>
              <div class="help">帮助中心</div>
            </div>
          </a-form>
        </div>
        <!-- 注册完成 -->
        <div class="register-done" v-show="step2">
          <div class="result">
            <img src="@/assets/img/register/registerdone.png" />
            <div>恭喜您完成注册</div>
          </div>
          <div class="jump">
            <div class="time2jump">{{ time }}s后，系统将自动跳转</div>
            <div @click="registered" class="jump2login">登录</div>
          </div>
          <div class="desc">如果系统没有自动跳转，请点击跳转进入</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { postAction, getActionUrl, httpActionHeader, getAction } from '@/api/manage.js'
import qs from 'qs'
import { setInterval, clearInterval } from 'timers'
import { mixinDevice } from '@/utils/mixin.js'
import JSlider from '@/components/cmp/JSlider'

export default {
  mixins: [mixinDevice],
  name: 'UserRegister',
  components: {
    JSlider //滑块验证码
  },
  props: {
    visibleRegister: {
      //控制组件显隐
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      checked: '',
      time: 5, //注册成功后倒计时5秒跳转
      url: {
        registercode: '/sys/sendMessage/register', //获取手机验证码
        register: '/sys/user/register', //用户注册
        verifyUserName: '/sys/user/verifyUniqueUsername' //用户名校检
      },
      jsvalue: false, //滑块验证码的值
      step1: true, //注册页显隐
      step2: false, //注册完成页显隐
      state: {
        //控制获取短信验证码按钮状态
        time: 60,
        smsSendBtn: false
      }
    }
  },
  methods: {
    // username重复校检
    usernameOnChange(rule, val, callback) {
      let value = val ? val : '',
        params = { username: value },
        reg = /^[-_a-zA-Z0-9]{4,16}$/
      if (reg.test(value)) {
        getAction(this.url.verifyUserName, params).then(res => {
          if (!res.success) {
            callback(res.message)
          } else {
            callback()
          }
        })
      } else if (value.length == 0) {
        callback('请输入用户名！')
      } else {
        callback('用户名格式不正确！')
      }
    },
    // 真实姓名校检
    realnameVerify(rule, val, callback) {
      let value = val ? val : ''
      let reg = /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/
      if (reg.test(value)) {
        callback()
      } else if (value.length == 0) {
        callback('请输入姓名！')
      } else {
        callback('请输入正确的姓名！')
      }
    },
    // 密码校检
    handlePasswordLevel(rule, val, callback) {
      if (/^[\w]{6,12}$/.test(val)) {
        callback()
      } else if (val.length == 0) {
        callback()
      } else {
        callback('密码格式不正确')
      }
    },
    //手机号码校检
    phoneVerify(rule, val, callback) {
      let value = val ? val : ''
      let reg = /^1[3456789]\d{9}$/
      if (reg.test(value)) {
        callback()
      } else if (value.length == 0) {
        callback('请输入手机号码')
      } else {
        callback('请输入正确的手机号码！')
      }
    },
    //获取是否同意服务条款的值
    getChecked(e) {
      this.checked = e.target.checked
    },
    //比较密码和确认密码的值
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一致！')
      } else {
        callback()
      }
    },
    //获取滑块的值
    handleJSliderSuccess(val) {
      this.jsvalue = val
    },
    // 获取手机验证码
    getCode() {
      let that = this
      if (that.jsvalue === true) {
        // 验证phone 和mageIdentifyCode 是否填写
        that.form.validateFields(['phone'], { force: true }, (err, val) => {
          if (!err) {
            // 填写完成，将按钮设置成不可点击，倒计时60秒
            that.state.smsSendBtn = true
            let interval = window.setInterval(() => {
              if (that.state.time-- <= 0) {
                that.state.time = 60
                that.state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)

            //获取填写手机号
            let params = Object.assign({}, val),
              url = that.url.registercode //获取短信验证码API
            // 将参数形式转换为 JSON字符串
            params = qs.stringify(params)
            // 提示信息
            const hide = this.$message.loading('验证码发送中..', 0)
            // 发送请求
            postAction(url, params)
              .then(res => {
                // 弹出提示信息 hide
                setTimeout(hide, 2500)
                // 根据返回结果，弹出提示框
                if (res.success) {
                  this.$notification['success']({
                    message: '提示',
                    description: res.message + '请注意查收手机短信！',
                    duration: 8
                  })
                } else {
                  this.$notification['error']({
                    message: '获取失败',
                    description: res.message,
                    duration: 8
                  })
                }
              })
              .catch(err => {
                setTimeout(hide, 1)
                clearInterval(interval)
                that.state.time = 60
                that.state.smsSendBtn = false
                this.$notification['error']({
                  message: '获取失败',
                  description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
                  duration: 4
                })
              })
          }
        })
      } else {
        this.$notification['error']({
          message: '滑块验证失败，请重试',
          duration: 8
        })
      }
    },
    // 注册
    register() {
      /* this.step1 = false
                this.step2 = true */

      if (!this.checked) {
        this.$notification['error']({
          message: '提示',
          description: '请仔细阅读服务条款，同意后方可注册！',
          duration: 8
        })
      } else {
        this.form.validateFields(
          ['userName', 'realName', 'password', 'phone', 'identifyCode', 'imageIdentifyCode'],
          { force: true },
          (err, values) => {
            if (!err) {
              // 将输入内容存入参数对象，并转换为 JSON字符串
              let params = values
              params.orgCode = '.A01.'
              params.corpCode = 'A01'
              // 设置 API url
              let url = this.url.register,
                method = 'post'
              params = JSON.stringify(params)
              // 用户注册提示信息
              const hide = this.$message.loading('用户注册中，请稍后..', 0)
              // 发送用户注册请求
              httpActionHeader(url, params, method)
                .then(res => {
                  setTimeout(hide, 1000)
                  if (res.success) {
                    this.$notification['success']({
                      message: '提示',
                      description: res.message,
                      duration: 5
                    })
                    // 第一步完成，显示第二步
                    this.step1 = false
                    this.step2 = true

                    if (this.time > 1) {
                      this.startInter = setInterval(() => {
                        if (this.time > 1) {
                          this.time--
                        } else {
                          clearInterval(this.startInter)
                          this.registered()
                        }
                      }, 1000)
                    }
                  } else {
                    this.$notification['error']({
                      message: '用户注册失败',
                      description: res.message,
                      duration: 8
                    })
                  }
                })
                .catch(err => {
                  setTimeout(hide, 1)
                  clearInterval(interval)
                  that.state.time = 60
                  that.state.smsSendBtn = false
                  this.$notification['error']({
                    message: '获取失败',
                    description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
                    duration: 4
                  })
                })
            }
          }
        )
      }
    },
    // 注册完成
    registered() {
      this.$router.push('/user/login')
      let path = this.$route.path
      if (path === '/user/login') {
        this.$emit('close')
      }
    },
    // 关闭弹窗
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/userRegister.less';
</style>
