<template>
  <div class="login">
    <div class="login-content">
      <div class="login-title">
        工程物联网
        <div>标准数据服务平台</div>
      </div>
      <div class="main">
        <a-alert
          type="warning"
          message="初次登录，请输入用户名密码完成绑定"
          banner
          style="margin-top:-42px;margin-bottom:5px"
          v-show="blindingMessage"
        />
        <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
          <!-- <a-tabs
          :activeKey="customActiveKey"
          :tabBarStyle="{ textAlign: 'left' }"
          @change="handleTabClick"
          v-if="!displayFlag"
          >-->
          <!-- 账号密码登录 -->
          <!-- <a-tab-pane key="tab1" :tab="!otherLoginBtm?'账号登录':'绑定账号'"> -->
          <div class="login-text">login to continue...</div>
          <a-form-item>
            <a-input
              size="large"
              v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
              type="text"
              placeholder="请输入帐户名"
            >
              <img src="@/assets/img/login/yonghu.png" slot="prefix" alt />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="['password',validatorRules.password]"
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
            >
              <img src="@/assets/img/login/mima.png" slot="prefix" alt />
            </a-input>
          </a-form-item>
          <a-form-item class="form-out">
            <a-checkbox @change="onChange" :defaultChecked="true" class="autologin">记住密码</a-checkbox>
            <span class="change-password" @click="changePassword">忘记密码</span>
          </a-form-item>
          <!-- </a-tab-pane> -->
          <!-- 手机登录 -->
          <!--          <a-tab-pane key="tab2" tab="手机登录" v-if="!otherLoginBtm">-->
          <!--            <a-form-item>-->
          <!--              <a-input-->
          <!--                v-decorator="['phone',validatorRules.phone, {validator: this.validateMobile}]"-->
          <!--                size="large"-->
          <!--                type="text"-->
          <!--                placeholder="手机号"-->
          <!--              ></a-input>-->
          <!--            </a-form-item>-->

          <!--            <a-row :gutter="16">-->
          <!--              <a-col class="gutter-row" :span="16">-->
          <!--                <a-form-item>-->
          <!--                  <a-input-->
          <!--                    v-decorator="['identifyCode',validatorRules.identifyCode]"-->
          <!--                    size="large"-->
          <!--                    type="text"-->
          <!--                    placeholder="请输入验证码"-->
          <!--                  ></a-input>-->
          <!--                </a-form-item>-->
          <!--              </a-col>-->

          <!--              <a-col class="gutter-row" :span="8">-->
          <!--                <a-button-->
          <!--                  class="getCaptcha"-->
          <!--                  tabindex="-1"-->
          <!--                  :disabled="state.smsSendBtn"-->
          <!--                  @click.stop.prevent="getCaptcha"-->
          <!--                  v-text="!state.smsSendBtn && getCaptchaText || (state.time+' s')"-->
          <!--                ></a-button>-->
          <!--              </a-col>-->
          <!--            </a-row>-->
          <!--          </a-tab-pane>-->

          <!-- </a-tabs> -->

          <div class="wechatQRcodeBox" id="login_container" v-show="displayFlag"></div>

          <a-form-item class="login-btn">
            <!-- loginBtn控制按钮的实效状态和载入状态，为true时按钮实效，表现载入 -->
            <a-button
              type="primary"
              htmlType="submit"
              class="login-button"
              :loading="loginBtn"
              @click.stop.prevent="handleSubmitPre"
              :disabled="loginBtn"
              v-if="!this.displayFlag"
            >{{!otherLoginBtm?'登录':'确定'}}</a-button>
          </a-form-item>

          <div class="wechatLogin-btn" v-if="!otherLoginBtm">
            <!-- <span style="color: grey" v-if="!this.displayFlag">其他登录方式：</span> -->
            <!--微信登录图标-->
            <!-- <span
            class="wechatLoginBox"
            @click="wechatLogin"
            @mouseenter="imgChange(1)"
            @mouseleave="imgChange(0)"
            v-if="!this.displayFlag"
          >
            <img
              class="wechatLoginImg"
              style="width: 28px;height: 28px"
              :src="wechatUrl"
              alt="微信登陆"
            />
            </span>-->
            <!--&lt;!&ndash;QQ登录图标&ndash;&gt;-->
            <!--<span-->
            <!--class="qqLoginBox"-->
            <!--@click="qqLogin"-->
            <!--@mouseenter="imgChange(2)"-->
            <!--@mouseleave="imgChange(0)"-->
            <!--v-if="!this.displayFlag"-->
            <!--style="margin-left: 5px"-->
            <!--&gt;-->
            <!--<img-->
            <!--class="qqLoginImg"-->
            <!--style="width: 28px;height: 28px"-->
            <!--:src="qqUrl"-->
            <!--alt="QQ登陆"/>-->
            <!--</span>-->

            <span @click="wechatLoginBack" v-if="this.displayFlag">账号密码登录</span>
          </div>
          <div class="register-btn">
            <span @click="register">立即注册</span>
          </div>
        </a-form>

        <!-- 用户注册组件 -->
        <user-register
          ref="register"
          :visibleRegister="visibleRegister"
          @close="closeregister"
          v-if="visible"
        ></user-register>

        <!-- 短信两步验证 -->
        <two-step-captcha
          v-if="requiredTwoStepCaptcha"
          :visible="stepCaptchaVisible"
          @success="stepCaptchaSuccess"
          @cancel="stepCaptchaCancel"
        ></two-step-captcha>

        <!-- 部门选择 -->
        <a-modal
          :title="null"
          :width="400"
          :visible="departVisible"
          :maskClosable="false"
          :closable="false"
          :footer="null"
          class="departChosen"
          :destroyOnClose="true"
        >
          <!-- <template slot="footer">
          <a-button type="primary" @click="departOk">确认</a-button>
          </template>-->

          <a-form>
            <a-form-item
              :labelCol="{span:4}"
              :wrapperCol="{span:20}"
              style="margin-bottom:10px"
              :validate-status="validate_status"
            >
              <div class="title">
                <img src="@/assets/img/login/depart.png" />
                <span>登录部门选择</span>
              </div>
              <a-select
                @change="departChange"
                :class="{'valid-error':validate_status=='error'}"
                placeholder="请选择登录部门"
                style="margin-left:10px"
              >
                <a-icon slot="suffixIcon" type="caret-down" />
                <a-select-option
                  v-for="d in departList"
                  :key="d.id"
                  :value="`${d.prjCode},${d.orgCode}`"
                  class="departList"
                >
                  <span style="float: left">{{ d.departName }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px"
                  >{{d.prjName}}{{ d.corpName }}</span>
                </a-select-option>
              </a-select>

              <div class="departButton">
                <a-button @click="departCancel">
                  <a-icon type="close"></a-icon>取消
                </a-button>
                <a-button type="primary" @click="departOk">
                  <a-icon type="check"></a-icon>确认
                </a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-modal>

        <a-modal
          title="完成绑定"
          :width="400"
          :visible="bindingVisible"
          :maskClosable="false"
          :closable="false"
          :footer="null"
          class="departChosen"
          :destroyOnClose="true"
        >
          <div class="blindMessage">
            <div>
              <span class="blindSide">
                <img class="blindIcon" src="@/assets/img/login/userImg.png" alt="用户" />
              </span>
              <span class="blindMiddle">
                <img
                  class="blindIcon_m"
                  src="@/assets/img/login/leftImg.png"
                  alt="箭头"
                  style="margin-top: 50px"
                />
              </span>
              <span class="blindSide">
                <img
                  class="blindIcon"
                  style="width: 50px;height: 50px"
                  :src="otherImg"
                  :alt="loginType==3?'wechat':'qq'"
                />
              </span>
            </div>
            <div>
              <span class="blindSide">{{userNickname}}</span>
              <span class="blindMiddle">
                <img
                  class="blindIcon_m"
                  src="@/assets/img/login/rightImg.png"
                  alt="箭头"
                  style="margin-top: 0px"
                />
              </span>
              <span class="blindSide">{{otherLoginNickname}}</span>
            </div>
          </div>
          <div class="blindButton">
            <a-button @click="bindingCancel">
              <a-icon type="close"></a-icon>取消
            </a-button>
            <a-button type="primary" @click="bindingOk">
              <a-icon type="check"></a-icon>确定
            </a-button>
          </div>
        </a-modal>
      </div>
      <change-password-step-one ref="changePassword"></change-password-step-one>
    </div>
  </div>
</template>

<script>
import api from '@/api' // 引入api接口，接口放在了api对象里
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha' // 两步验证（功能待查）
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util' // 根据当前时间，判断问候语
import Vue from 'vue'
import { rsaUtil } from '@/utils/rsa'
import { aesUtil } from '@/utils/aes'
import { ACCESS_TOKEN, USER_INFO, CURRENT_GENKEY } from '@/store/mutation-types' // token, userInfo
import JGraphicCode from '@/components/cmp/JGraphicCode' // 验证码生成器
import { putAction, postAction, getAction, debounce } from '@/api/manage' // axios方法
import UserRegister from './UserRegister'
import qs from 'qs'
import { mixinDevice } from '@/utils/mixin.js'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ChangePasswordStepOne from '@/views/user/ChangePasswordStepOne'

export default {
  mixins: [mixinDevice],
  components: {
    ChangePasswordStepOne,
    AFormItem,
    TwoStepCaptcha,
    JGraphicCode,
    UserRegister
  },
  computed: {
    visibleRegister () {
      return this.visible
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
      },
      wechatUrl: require('@/assets/img/login/weixin.png'),
      qqUrl: require('@/assets/img/login/QQ.png'),
      displayFlag: false, // 微信登录控制登录表单的显隐
      customActiveKey: 'tab1', // 激活的tab的key至，此处默认设置为tab1
      loginBtn: false, // 控制手机登录时“获取验证码”按钮的载入和可操作状态
      visible: false, // 控制注册组件表单的显隐
      otherLoginBtm: false, // 控制微信绑定的显隐
      otherLoginNickname: '', // 微信/QQ绑定用的参数
      userNickname: '', // 用户姓名
      blindingMessage: '', // 绑定消息
      otherLoginCode: '',
      otherImg: require('@/assets/img/login/weixinImg.png'),
      // login type: 0 email, 1 username, 2 telephone,3 wechat,4 qq
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 10,
        smsSendBtn: false
      },
      getCaptchaText: '获取验证码',
      formLogin: {
        username: '',
        password: '',
        phone: '',
        rememberMe: true
      },
      FORM_LOGIN: {},
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!', validator: 'click' }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
        phone: { rules: [{ required: true, message: '请输入手机号码!', validator: 'click' }] },
        identifyCode: { rules: [{ required: true, message: '请输入验证码!', validator: 'click' }] }
      },
      verifiedCode: '',
      inputCodeContent: '',
      inputCodeNull: true,

      departList: [],
      departVisible: false, // 部门选择组件显隐
      bindingVisible: false, // 微信绑定确认组件显隐
      departSelected: 'null.A01',
      currentUsername: '',
      validate_status: '',

      url: '/sys/verifyMessageLogin', // 短信登录接口
      urlRsa: '/sys/getciphertext', // 请求rsa公钥接口
      backPubKey: '', // 服务器公钥字段
      genKey: '', // 前端aesKey
      loginTimer: null
    }
  },
  created () {
    // 判断是否为回调，若是微信回调执行微信登录操作
    if (this.$route.query.wechatLoginCode != undefined) {
      this.loginType = 3
      this.otherLoginCode = this.$route.query.wechatLoginCode
      this.callbackCheck()
    } else if (this.$route.query.qqLoginCode != undefined) {
      this.loginType = 4
      this.changeIcon()
      this.otherLoginCode = this.$route.query.qqLoginCode
      this.callbackCheck()
    }

    // Vue.ls.remove(ACCESS_TOKEN) //移除浏览器storage中的token
  },
  mounted () {
    // 引入js对象WxLogin
    const Wx = window.WxLogin
    this.formLogin = { ...Vue.ls.get('FORM_LOGIN') }
    // 单点登录时给登录框赋值，然后点击登录框
    if (localStorage.fzRedirect && localStorage.fzddname && localStorage.fzddpwd) {
      this.formLogin.username = localStorage.fzddname
      this.formLogin.password = localStorage.fzddpwd
      this.forminit(this.formLogin)
      $('.login-button').click()
      localStorage.removeItem('fzRedirect')
      localStorage.removeItem('fzddname')
      localStorage.removeItem('fzddpwd')
      return
    }
    if (localStorage.fzRedirect) {
    }
    console.log(this.formLogin)
    this.forminit(this.formLogin)
    // 创建一个WxLogin对象实例
    var obj = new Wx({
      self_redirect: false,
      id: 'login_container',
      appid: 'wx289d20e0c4e4d309',
      scope: 'snsapi_login',
      redirect_uri: encodeURIComponent('http://webgl.ecidi.com:8001/ecidi-cmp/sys/wechatCallback'),
      state: 'SXDMSGHGJWMDWZSBSFL',
      style: 'black',
      // 此代码供微信获得二维码样式css文件使用，需为可以访问的路径
      href: 'http://localhost:3000/wechat.css' // 本地环境
      // href: "http://webgl.ecidi.com:8001/wechat.css"//线上环境
    })

    if (this.$store.state.app.openFZFlag) {
      // 方正开关打开时，隐藏微信、qq登录和手机登录
      $('.wechatLogin-btn').hide()
      $($('.ant-tabs-nav-scroll .ant-tabs-tab')[1]).hide()
    }
  },
  watch: {
    customActiveKey () {
      this.forminit(this.formLogin)
    }
  },
  methods: {
    ...mapActions(['Login', 'LoginByPhone', 'Logout', 'LoginByOther']), // 引入vuex store中的Login和logout方法，放在当前的methods中
    // 初始化登录表单
    forminit (val) {
      const loginMessage = {}
      if (this.customActiveKey === 'tab1') {
        loginMessage.username = val.username
        loginMessage.password = val.password
      } else {
        loginMessage.phone = val.phone
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(loginMessage)
      })
    },
    // 判断登录方式是邮件还是username,邮件 0，username 1
    handleUsernameOrEmail (rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    // 切换登录方式tab时，获取当前tab的key值，保存到customActiveKey中
    handleTabClick (key) {
      this.customActiveKey = key
    },
    // 获取是否记住密码
    onChange (e) {
      this.formLogin.rememberMe = e.target.checked
    },
    handleSubmitPre () {
      if (this.loginTimer) {
        clearTimeout(this.loginTimer)
      }
      this.loginTimer = setTimeout(() => {
        this.handleSubmit()
      }, 500)
    },
    // 登录：账号或者手机登录
    handleSubmit () {
      const that = this // 将this指向的vue实例赋值给that

      // localStorage.removeItem("fzRedirect");

      // 1、登录前获取后端公钥
      let loginParams = {
        remember_me: that.formLogin.rememberMe
      }
      getAction(that.urlRsa)
        .then(res => {
          if (res.result != null) {
            that.backPubKey = res.result.data
          }

          // 使用账户密码登陆，tab的key值为tab1时，说明是账号密码登录
          if (that.customActiveKey === 'tab1') {
            // 检测username和passwoord的值； 其中{force: true}表示在change触发时是否再次校检
            that.form.validateFields(['username', 'password'], { force: true }, (err, values) => {
              if (!err) {
                // err为空，则执行，将账号密码防盗loginParams对象中
                loginParams.username = values.username
                // loginParams.password = md5(values.password)
                loginParams.password = values.password
                // 执行登录操作
                // 获取用户信息
                that.formLogin.username = values.username
                that.formLogin.password = values.password
                // 生成客户端aes秘钥
                that.genKey = aesUtil.genKey()
                // key加密 登录信息
                const loginParamsAes = aesUtil.encrypt(loginParams, that.genKey)

                //  公钥加密aes秘钥
                that.genKeyRsa = rsaUtil.encrypt(that.genKey, that.backPubKey)

                // 组合登录信息及两个秘钥
                const loginParams1 = {
                  backPub: that.backPubKey,
                  aesKey: that.genKeyRsa,
                  data: loginParamsAes
                }
                if (res.result != null) {
                  that
                    .Login(qs.stringify(loginParams1))
                    .then(res => {
                      // 根据归属部门，选择处理，0提示，2选择，1则直接登录
                      Vue.ls.set(CURRENT_GENKEY, that.genKey, 7 * 24 * 60 * 60 * 1000)
                      this.departConfirm(res)
                    })
                    .catch(err => {
                      that.requestFailed(err)
                    })
                } else {
                  // 单点登录的用户名密码
                  localStorage.ddUserName = loginParams.username
                  localStorage.ddPassword = loginParams.password
                  that
                    .Login(loginParams)
                    .then(res => {
                      // 登录成功，则存储登录信息到localstorage,有效期7天
                      Vue.ls.set('FORM_LOGIN', that.formLogin, 7 * 24 * 60 * 60 * 1000)
                      // 根据归属部门，选择处理，0提示，2选择，1则直接登录
                      this.departConfirm(res)

                      var that2 = this
                      console.log(that2.$store.state.app.openFZFlag)
                      var openFZFlag = that2.$store.state.app.openFZFlag
                      var fzurl = that2.$store.state.app.FZLoginUrl
                      if (openFZFlag && res.code == 200) {
                        // 调用cloudepc的登录接口(企业级)
                        $.ajax({
                          url: fzurl + '/servlet/LoginServlet.cmd?action=getPubkey',
                          type: 'GET',
                          dataType: 'jsonp',
                          success: function (data) {
                            console.log(data)
                            // 用公钥对用户名进行加密
                            // var pwd = "";
                            // if(localStorage.ddPassword!="" && localStorage.ddPassword!=undefined){
                            //   var encrypt = new JSEncrypt();
                            //   encrypt.setPublicKey(data.pubkey);
                            //   pwd = encrypt.encrypt(localStorage.ddPassword);
                            // }
                            var pwd = localStorage.ddPassword // 单点登录的密码
                            $.ajax({
                              url:
                                fzurl +
                                '/servlet/LoginServlet.cmd?action=tologin&login=true&username=' +
                                localStorage.ddUserName +
                                '&password=' +
                                pwd +
                                '&saveInfo=true&local=undefined&pw=false&pu=chen_m2&pd=9c248bec04d2cea3fe24f37ac887372',
                              type: 'GET',
                              dataType: 'jsonp',
                              success: function (data) {
                                console.log(data)
                                localStorage.removeItem('ddUserName')
                                localStorage.removeItem('ddPassword')
                                if (data.login) {
                                  // window.open('http://cloudepc.simulate.com:8080/cloudpm/framework.html');
                                  // let routeUrl = that2.$router.resolve({
                                  //   path: '/'
                                  // })
                                  // window.open(routeUrl.href, '_self')
                                } else if (data.errmsg == 0) {
                                  alert('登录OA时：暂无该项目！')
                                  // location.reload();
                                } else {
                                  alert('登录OA时：' + data.errmsg)
                                  // location.reload();
                                }
                              },
                              error: function () {
                                localStorage.removeItem('ddUserName')
                                localStorage.removeItem('ddPassword')
                                alert('验证时出现错误，请稍后再试')
                              }
                            })
                          },
                          error: function () {
                            alert('验证时出现错误，请稍后再试')
                          }
                        })
                      }
                    })
                    .catch(err => {
                      that.requestFailed(err)
                      localStorage.removeItem('ddUserName')
                      localStorage.removeItem('ddPassword')
                    })
                }
              }
            })
            // 使用手机号登陆
          } else {
            that.form.validateFields(['phone', 'identifyCode'], { force: true }, (err, values) => {
              if (!err) {
                loginParams = qs.stringify(Object.assign({}, values))
                that.formLogin.phone = values.phone

                // 生成客户端aes秘钥
                that.genKey = aesUtil.genKey()
                // key加密 登录信息
                const loginParamsAes = aesUtil.encrypt(loginParams, that.genKey)

                //  公钥加密aes秘钥
                that.genKeyRsa = rsaUtil.encrypt(that.genKey, that.backPubKey)
                // 组合登录信息及两个秘钥
                const loginParams1 = {
                  backPub: that.backPubKey,
                  aesKey: that.genKeyRsa,
                  data: loginParamsAes
                }

                that.loginBtn = true
                if (res.result != null) {
                  that
                    .LoginByPhone(qs.stringify(loginParams1))
                    .then(res => {
                      if (that.requiredTwoStepCaptcha) {
                        that.stepCaptchaVisible = true
                      } else {
                        Vue.ls.set(CURRENT_GENKEY, that.genKey, 7 * 24 * 60 * 60 * 1000)
                        Vue.ls.set('FORM_LOGIN', that.formLogin, 7 * 24 * 60 * 60 * 1000)
                        this.departConfirm(res)
                      }
                    })
                    .catch(err => {
                      that.requestFailed(err)
                    })
                } else {
                  that
                    .LoginByPhone(loginParams)
                    .then(res => {
                      if (that.requiredTwoStepCaptcha) {
                        that.stepCaptchaVisible = true
                      } else {
                        Vue.ls.set('FORM_LOGIN', that.formLogin, 7 * 24 * 60 * 60 * 1000)
                        this.departConfirm(res)
                      }
                    })
                    .catch(err => {
                      that.requestFailed(err)
                    })
                }
              }
            })
          }
        })
        .catch(err => {})
    },
    // 获取手机验证码
    getCaptcha (e) {
      e.preventDefault()
      const that = this

      this.form.validateFields(['phone'], { force: true }, (err, val) => {
        if (!err) {
          this.state.smsSendBtn = true
          that.formLogin.phone = val.phone
          const interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 10
              that.state.smsSendBtn = false
              window.clearInterval(interval)
              this.getCaptchaText = '重新获取'
            }
          }, 1000)

          const params = qs.stringify({ phone: that.formLogin.phone })

          const hide = this.$message.loading('验证码发送中..', 0)
          postAction(api.SendSms, params)
            .then(res => {
              setTimeout(hide, 2500)
              if (res.success) {
                this.$notification.success({
                  message: '提示',
                  description: res.message + '请注意查收手机短信！',
                  duration: 4
                })
              } else {
                this.$notification.error({
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
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess () {
      const that = this
      const realname = Vue.ls.get(USER_INFO).realname
      console.log(Vue.ls)
      // 判断是否需要绑定微信或者QQ
      if (that.otherLoginNickname != undefined && that.otherLoginNickname != '') {
        that.userNickname = realname
        // 弹出绑定页面
        that.bindingConfirm()
      } else {
        that.loginBtn = false
        that.bindingVisible = false
        // this.$router.push({ name: 'dashboard' })
        // 路由跳转
        if (localStorage.FZLoginUrl) that.$router.push(localStorage.FZLoginUrl)
        else that.$router.push('/')
        that.$notification.success({
          message: `欢迎${realname}`,
          description: `${timeFix()}，欢迎回来`
        })
      }
      localStorage.removeItem('fzRedirect')
    },
    requestFailed (err) {
      this.$notification.error({
        message: '登录失败',
        description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.loginBtn = false
    },
    validateMobile (rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    validateInputCode (rule, value, callback) {
      if (!value || this.verifiedCode == this.inputCodeContent) {
        callback()
      } else {
        callback('您输入的验证码不正确!')
      }
    },
    generateCode (value) {
      this.verifiedCode = value.toLowerCase()
    },
    inputCodeChange (e) {
      this.inputCodeContent = e.target.value
      if (!e.target.value || e.target.value == 0) {
        this.inputCodeNull = true
      } else {
        this.inputCodeContent = this.inputCodeContent.toLowerCase()
        this.inputCodeNull = false
      }
    },
    // 部门选择
    departConfirm (res) {
      if (res.success) {
        const multi_depart = res.result.multi_depart
        // 0:无部门 1:一个部门 2:多个部门
        if (multi_depart == 0) {
          // 0 则提示
          this.loginSuccess()
          // this.$notification.warn({
          //   message: '提示',
          //   description: `您尚未归属部门,请确认账号信息`,
          //   duration: 3
          // })
        } else if (multi_depart == 2) {
          // 2 则选择
          this.departVisible = true // 归属部门组件显示
          this.currentUsername = this.form.getFieldValue('username') // 获取当前username
          this.departList = res.result.departs
        } else {
          this.loginSuccess() // 只有1个部门则直接登录
        }
      } else {
        this.requestFailed(res)
        this.Logout()
      }
    },

    departOk () {
      if (!this.departSelected) {
        this.validate_status = 'error'
        return false
      }
      const obj = {
        prjCode: this.departSelected.split(',')[0] == 'null' ? null : this.departSelected.split(',')[0],
        orgCode: this.departSelected.split(',')[1] == 'null' ? null : this.departSelected.split(',')[1],
        username: this.form.getFieldValue('username')
      }
      postAction('/sys/selectDepart', obj).then(res => {
        if (res.success) {
          const userInfo = res.result
          Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
          this.departClear()
          this.loginSuccess()
        } else {
          this.requestFailed(res)
          this.Logout().then(() => {
            this.departClear()
          })
        }
      })
    },
    departCancel () {
      this.departVisible = false
      this.departClear()
    },
    departClear () {
      this.departList = []
      this.departSelected = ''
      this.currentUsername = ''
      this.departVisible = false
      this.validate_status = ''
    },
    departChange (value) {
      this.validate_status = 'success'
      this.departSelected = value
    },

    // 弹出确认页面
    bindingConfirm () {
      this.bindingVisible = true
    },

    // 点击确认后
    bindingOk () {
      const realname = Vue.ls.get(USER_INFO).realname
      this.bindingVisible = false
      this.loginBtn = false
      this.axios
        .post(this.loginType == 3 ? '/sys/blindWechat' : '/sys/blindQQ', {
          otherLoginCode: this.otherLoginCode,
          username: Vue.ls.get(USER_INFO).username
        })
        .then(res => {
          if (res.success) {
            this.$message.success('绑定成功')
          } else {
            this.$message.error('绑定失败')
          }
        })
      // this.$router.push({ name: 'dashboard' })
      this.$router.push('/roomList/roomListOrder')
      this.$notification.success({
        message: `欢迎${realname}`,
        description: `${timeFix()}，欢迎回来`
      })
    },

    // 点击取消后
    bindingCancel () {
      const realname = Vue.ls.get(USER_INFO).realname
      this.bindingVisible = false
      this.otherLoginNickname = ''
      this.loginBtn = false
      // this.$router.push({ name: 'dashboard' })
      this.$router.push('/roomList/roomListOrder')
      this.$notification.success({
        message: `欢迎${realname}`,
        description: `${timeFix()}，欢迎回来`
      })
    },

    /* 注册 */
    register () {
      this.visible = true
    },
    /* 进入微信登录 */
    wechatLogin () {
      this.displayFlag = true
    },

    /* 进入微信登录 */
    wechatLoginBack () {
      this.displayFlag = false
    },

    /* 进入QQ登陆 */
    qqLogin () {
      console.log('进入QQ登陆')
      // 以下为按钮点击事件的逻辑。注意这里要重新打开窗口
      // 否则后面跳转到QQ登录，授权页面时会直接缩小当前浏览器的窗口，而不是打开新窗口
      window.location.href =
        'https://graph.qq.com/oauth2.0/authorize?' +
        'response_type=code&client_id=101780748&' +
        'redirect_uri=' +
        encodeURIComponent('http://webgl.ecidi.com:8001/ecidi-cmp/sys/qqCallback') +
        '&state=SXDMSGHGJWMDWZSBSFL'
    },

    callbackCheck () {
      const that = this
      that.LoginByOther(that.otherLoginCode).then(res => {
        console.log('other', res)
        if (res.success) {
          // 登陆成功后选择部门
          that.departConfirm(res)
        } else {
          // 失败后提示未绑定微信
          that.otherLoginNickname = res.result.otherLoginNickname
          that.otherLoginBtm = true
          that.blindingMessage = true
        }
      })
    },

    changeIcon () {
      this.otherImg = require('@/assets/img/login/qqImg.png')
    },

    closeregister () {
      this.visible = false
    },

    imgChange (index) {
      const that = this
      if (index == 1) {
        that.wechatUrl = require('@/assets/img/login/weixinblue.png')
      } else if (index == 2) {
        that.qqUrl = require('@/assets/img/login/QQblue.png')
      } else {
        that.wechatUrl = require('@/assets/img/login/weixin.png')
        that.qqUrl = require('@/assets/img/login/QQ.png')
      }
    },
    changePassword () {
      this.$refs.changePassword.open()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/login.less';
</style>
<style lang="less" scoped>
.ant-form-item-with-help {
  margin-bottom: 24px;
}
.departChosen {
  .ant-modal-content {
    .ant-modal-body {
      padding: 40px;
      height: 320px;
      .ant-col-20.ant-form-item-control-wrapper {
        width: 100%;
      }
      .title {
        height: 18px;
        line-height: 18px;
        margin-bottom: 27px;
        font-size: 16px;
        font-weight: bold;
        color: #191919;
        display: flex;
        align-items: center;
        img {
          height: 16px;
          margin-right: 6px;
        }
      }
      .ant-select.ant-select-enabled {
        margin-left: 0 !important;
        .ant-select-selection.ant-select-selection--single {
          width: 320px;
          height: 40px;
          .ant-select-selection__rendered {
            margin: 0 13px;
          }
          div {
            height: 40px;
            line-height: 40px;
          }
        }
        .ant-select-selection__placeholder {
          margin-top: -20px;
        }
      }
      .departButton {
        display: flex;
        justify-content: center;
        margin-top: 110px;
        .ant-btn {
          height: 40px;
          width: 96px;
          margin-right: 10px;
        }
      }
    }
  }
}
.ant-select-dropdown.ant-select-dropdown--single.ant-select-dropdown-placement-bottomLeft {
  .ant-select-dropdown-menu-item.departList {
    line-height: 44px;
    padding: 0 12px;
    margin: 0 20px;
    &:first-child {
      margin-top: 19px;
    }
    &:last-child {
      margin-bottom: 19px;
    }
  }
}

.blindButton {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  .ant-btn {
    height: 40px;
    width: 96px;
    margin-right: 10px;
  }
}

.blindMessage {
  width: 100%;
  height: 80%;
  text-align: center;
  font-size: larger;
  font-family: Arial, 'Hiragino Sans GB', 'Microsoft Yahei', 'Microsoft Sans Serif', sans-serif;
}

.blindIcon {
  width: 50px;
  height: 50px;
}

.blindIcon_m {
  width: 80px;
  height: 15px;
  margin-top: 25px;
}

.blindSide {
  width: 30%;
  float: left;
  text-align: center;
  margin-top: 25px;
}

.blindMiddle {
  width: 40%;
  float: left;
  text-align: center;
}

.change-password {
  float: right;
  cursor: pointer;
  color: #0493f3;
}
</style>
