<template>
  <div>
    <a-modal
      :title="null"
      @cancel="handleCancel"
      :maskClosable="false"
      :visible="visible"
      :footer="null"
    >
      <a-tabs defaultActiveKey="1" @change="callback" v-model="step">
        <a-tab-pane tab="手机号验证" key="1">
          <a-spin :spinning="stepLoading">
            <a-form :form="form">
              <a-row>
                <a-col :span="24">手机号:</a-col>
                <a-col :span="24">
                  <a-form-item>
                    <a-input
                      class="ant-input"
                      size="large"
                      v-decorator="['phone',validatorRules.phone]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">验证码:</a-col>
                <a-col :span="24">
                  <a-row :gutter="16">
                    <a-col class="gutter-row" :span="16">
                      <a-form-item>
                        <a-input
                          class="ant-input"
                          size="large"
                          v-decorator="['identifyCode',validatorRules.identifyCode]"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col class="gutter-row" :span="8">
                      <a-button
                        :class="state.smsSendBtn? 'getCaptchaDis' :'getCaptcha'"
                        tabindex="-1"
                        :disabled="state.smsSendBtn"
                        @click.stop.prevent="getCaptcha"
                        v-text="!state.smsSendBtn && getCaptchaText || (state.time+' s')"
                      ></a-button>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-form>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane tab="原密码验证" key="2">
          <user-password ref="userPassword" @changePasswordSuccess="handleCancel"></user-password>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="24">
        <a-col :md="24" :sm="8">
          <a-form-item class="btnClass">
            <a-button @click="handleStepOk" icon="check" class="confirm" type="primary" :loading="stepLoading">继续
            </a-button>
            <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-modal>
    <change-password-step-two ref="changePassword" @close="changePasswordSuccess"></change-password-step-two>
  </div>
</template>

<script>
  import ChangePasswordStepTwo from '@/views/user/ChangePasswordStepTwo'
  import qs from 'qs'
  import { putAction, postAction, getAction } from '@/api/manage'
  import UserPassword from '@/components/tools/UserPassword' // axios方法

  export default {
    name: 'ChangePasswordInline',
    components: { UserPassword, ChangePasswordStepTwo },
    data() {
      return {
        stepLoading: false,
        form: this.$form.createForm(this),
        visible: false,
        state: {
          time: 60,
          smsSendBtn: false
        },
        getCaptchaText: '获取验证码',
        validatorRules: {
          phone: { rules: [{ validator: this.validateMobile }, { required: true, message: '请输入手机号码!' }] },
          identifyCode: { rules: [{ required: true, message: '请输入验证码!' }] }
        },
        model: {
          phone: ''
        },
        step: '1',
      }
    },
    methods: {
      handleStepOk() {
        if (this.step == 1) {
          this.stepLoading = true
          this.form.validateFields((err, values) => {
            if (!err) {
              console.log('values', values)
              setTimeout(() => {
                //校验code
                this.axios.post('/sys/user/checkMessageCode', {
                  phone: values.phone,
                  identifyCode: values.identifyCode
                })
                  .then((res) => {
                    console.log(res, '验证码校验结果')
                    if (res.result) {
                      this.stepLoading = false
                      this.$refs.changePassword.open(values.phone, values.identifyCode)
                      this.handleCancel()
                    } else {
                      this.$notification['error']({
                        message: '提示',
                        description: res.message,
                        duration: 4
                      })
                      this.stepLoading = false
                    }
                  })
              }, 500)
              return
            }
            this.stepLoading = false
            this.$emit('error', { err })
          })
        } else {
          this.$refs.userPassword.handleOk()
        }
      },
      handleCancel() {
        this.visible = false
        this.state.time = 60
        this.state.smsSendBtn = false
        this.$emit('cancel')
      },
      onForgeStepCode() {

      },
      open() {
        this.form.resetFields()
        this.visible = true
      },
      changePasswordSuccess() {
        // alert('修改密码成功！')
      },
      validateMobile(rule, value, callback) {
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
          callback()
        } else {
          callback('您的手机号码格式不正确!')
        }
      },
      //获取手机验证码
      getCaptcha(e) {
        e.preventDefault()
        let that = this

        this.form.validateFields(['phone'], { force: true }, (err, val) => {
          if (!err) {
            this.state.smsSendBtn = true
            that.model.phone = val.phone
            let interval = window.setInterval(() => {
              if (that.state.time-- <= 0) {
                that.state.time = 10
                that.state.smsSendBtn = false
                window.clearInterval(interval)
                this.getCaptchaText = '重新获取'
              }
            }, 1000)

            let params = qs.stringify({ phone: that.model.phone })

            const hide = this.$message.loading('验证码发送中..', 0)
            postAction('/sys/sendMessage/updatePassword', params)
              .then(res => {
                setTimeout(hide, 2500)
                if (res.success) {
                  this.$notification['success']({
                    message: '提示',
                    description: res.message + '请注意查收手机短信！',
                    duration: 4
                  })
                } else {
                  this.$notification['error']({
                    message: '获取失败',
                    description: res.message,
                    duration: 4
                  })
                }
              })
              .catch(err => {
                setTimeout(hide, 1)
                clearInterval(interval)
                that.state.time = 60
                that.state.smsSendBtn = false
                this.requestFailed(err)
              })
          }
        })
      },
      callback (key) {
        console.log('选中 => ',key)
        console.log('step => ',this.step)
      },
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/modal.less';


  // 获取验证码
  .getCaptcha {
    float: right;
    height: 44px;
    width: 100%;
    background-color: #0493F3;
    color: #fff;
    border-color: #0493F3;
  }

  .getCaptchaDis {
    float: right;
    height: 44px;
    width: 100%;
    background-color: #fff;
    color: #0493F3;
    border-color: #0493F3;
  }

  .ant-input {
    border-color: #ddd;
    height: 44px;
  }

  .ant-input:focus {
    box-shadow: none;
    border-color: #0493f3;
  }
</style>
