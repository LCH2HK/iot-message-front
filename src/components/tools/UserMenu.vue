<template>
  <div class="user-wrapper" :class="theme">
    <span class="action" @click="removeBindingWechat" v-if="checkWechat" title="解除微信绑定">
      <a-icon type="wechat"/>
    </span>

    <span class="action" @click="removeBindingQQ" v-if="checkQQ" title="解除QQ绑定">
      <a-icon type="qq"/>
    </span>

    <span class="action">
      <a class="project-portal" v-if="!isInProject">
        <router-link :to="{ name: 'project-projectPortal' }">
<!--          <a-icon type="home" />-->
          <span>企业级</span>
        </router-link>
      </a>
      <a class="project-portal" v-else @click="backToCompany">
        <a-icon type="rollback"/>
        <span>返回企业</span>
      </a>
    </span>

    <span class="action" title="设置">
      <a class="setting" href="javascript:;" @click.stop.prevent="showdrawer">
        <a-icon type="setting"></a-icon>
        <!-- <img src="@/assets/img/setting/theme.png"> -->
      </a>
    </span>
    <setting-drawer :visible="visible" @closeDrawer="closedrawer" @opendrawer="showdrawer"></setting-drawer>
    <!-- 设置图标 -->
    <!-- <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout"/>
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>-->
    <!--<user-password ref="userPassword"></user-password>-->
    <change-password-inline ref="changePasswordInline"></change-password-inline>
    <header-notice class="action" title="消息"/>
    <!-- 铃铛图标 -->
    <span class="action" @click="showLoginModel">
      <a-badge>
        <a-icon style="font-size: 16px;" type="fire"/>
      </a-badge>
    </span>

    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
                <a-avatar shape="square" class="avatar" :src="getAvatar()" icon="user"/>
        <span
          v-if="isDesktop()"
          style="margin-left: 10px"
          class="nickname"
        >{{ nickname() }}</span>
<!--         >{{ nickname() }}({{userInfo().departName}})</span>-->
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!--<a-menu-item key="0">
         <router-link :to="{ name: 'account-center' }">
           <a-icon type="user"/>
           <span>个人中心</span>
         </router-link>
        </a-menu-item>-->
        <!--<a-menu-item key="1">
          <router-link :to="{ name: 'account-settings-base' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>-->

        <a-menu-item key="2" @click="updatePassword">
          <a-icon type="setting"/>
          <span>密码修改</span>
        </a-menu-item>
        <a-menu-item key="6" @click="removeBindingWechat" v-if="checkWechat">
          <a-icon type="wechat"/>
          <span>解绑微信</span>
        </a-menu-item>
        <a-menu-item key="7" @click="removeBindingQQ" v-if="checkQQ">
          <a-icon type="wechat"/>
          <span>解绑QQ</span>
        </a-menu-item>
        <a-menu-item key="3" @click="handleLogout">
          <a-icon type="logout"/>
          <span>退出登录</span>
        </a-menu-item>
        <!-- <a-menu-item key="2" disabled>
          <a-icon type="setting"/>
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLougout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>-->
      </a-menu>
    </a-dropdown>
    <show-login-modal ref="ShowLoginModal" @cancel="hideLoginModal" :visible="showLoginVisible"></show-login-modal>
    <!-- 登录统计列表 -->
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import UserPassword from './UserPassword'
import SettingDrawer from '../setting/SettingDrawer'
import { mapActions, mapGetters } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'
import { USER_INFO } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import Vue from 'vue'
import ShowLoginModal from './ShowLoginModal'
import ChangePasswordInline from '@/views/user/ChangePasswordInline'

export default {
  name: 'UserMenu',
  mixins: [mixinDevice],
  components: {
    ChangePasswordInline,
    HeaderNotice,
    UserPassword,
    SettingDrawer,
    ShowLoginModal
  },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },

  created () {
    this.wechatCheck()
    this.QQCheck()
  },

  data () {
    return {
      checkWechat: false,
      checkQQ: false,
      visible: false,
      isInProject: '',
      url: '/project/sysProject/exitProject',
      showLoginVisible: false // 登录统计框显隐
    }
  },
  mounted () {
    // this.isInProject = Vue.ls.get('PROJECT_MESSAGE')
    this.isInProject = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
  },
  methods: {
    gotinewPage () {
      window.open('about:blank', 'ni', 'width=700,height=400,menubar=no,scrollbars=no')
    },

    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    getAvatar () {
      if (this.avatar() == null) {
        return null
      }
      let reg = new RegExp('\\\\', 'g')
      let newMsg = this.avatar().replace(reg, '/')
      return window._CONFIG.imgDomainURL + '/' + newMsg
    },
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that
            .Logout({})
            .then(() => {
              window.location.href = '/'
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel () {
        }
      })
    },
    updatePassword () {
      // let username = this.userInfo().username
      // this.$refs.userPassword.show(username)
      this.$refs.changePasswordInline.open()
    },
    // 解除微信绑定
    removeBindingWechat () {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要解除微信绑定吗 ?',
        onOk () {
          return that.axios.get('/sys/removeWechat?username=' + that.userInfo().username, {}).then(res => {
            console.log('res', res)
            if (res.success) {
              that.$message.success('已解除绑定')
              that.wechatCheck()
            } else {
              that.$message.error('解除绑定失败')
            }
          })
        },
        onCancel () {
        }
      })
    },

    // 解除QQ绑定
    removeBindingQQ () {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要解除QQ绑定吗 ?',
        onOk () {
          return that.axios.get('/sys/removeQQ?username=' + that.userInfo().username, {}).then(res => {
            console.log('res', res)
            if (res.success) {
              that.$message.success('已解除绑定')
              that.QQCheck()
            } else {
              that.$message.error('解除绑定失败')
            }
          })
        },
        onCancel () {
        }
      })
    },

    // 检查是否绑定微信
    wechatCheck () {
      const that = this
      that.axios.get('/sys/checkWechat?username=' + that.userInfo().username, {}).then(res => {
        that.checkWechat = res.success
      })
    },

    // 检查是否绑定QQ
    QQCheck () {
      const that = this
      that.axios.get('/sys/checkQQ?username=' + that.userInfo().username, {}).then(res => {
        that.checkQQ = res.success
      })
    },

    showdrawer () {
      this.visible = true
    },
    closedrawer () {
      this.visible = false
    },
    // 返回企业
    backToCompany () {
      let url = this.url
      let params = {}
      getAction(url, params).then(res => {
        console.log(res)
        if (res.success) {
          // Vue.ls.remove('PROJECT_MESSAGE')
          sessionStorage.removeItem('PROJECT_MESSAGE')
          let routeUrl = this.$router.resolve({
            path: '/'
          })
          window.open(routeUrl.href, '_self')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    showLoginModel () {
      this.showLoginVisible = true
    },
    hideLoginModal () {
      this.showLoginVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .project-portal {
    text-decoration: none;
    color: white;

    a {
      color: white;
    }

    a:hover {
      color: @primary-color;
    }
  }

  .project-portal:hover {
    color: @primary-color;
  }

  span.action {
    color: white;
    padding: 0;
  }

  .setting {
    color: white;
    text-decoration: none;

    svg {
      padding: 0;
    }
  }

  .layout .header .user-wrapper .action,
  .layout .top-nav-header-index .user-wrapper .action {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  .action.action-full.ant-dropdown-link.user-dropdown-menu {
    /* padding: 0 80px 0 20px; */
    display: flex;
    align-items: center;

    .avatar {
      margin: 0;
    }
  }
</style>
