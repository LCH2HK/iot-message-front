<template>
  <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
  <a-layout-header
    v-if="!headerBarFixed"
    :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
    :style="{ padding: '0' }"
  >
    <div v-if="mode === 'sidemenu'" class="header" :class="theme">
      <div class="welcome">
        <a-icon
          v-if="device==='mobile'"
          class="trigger"
          :type="collapsed ? 'menu-fold' : 'menu-unfold'"
          @click.native="toggle"
        ></a-icon>
        <a-icon
          v-else
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click.native="toggle"
        />
<!--        <span v-if="device === 'desktop'">{{userInfo().corporationName}}</span>-->
        <span v-if="device === 'desktop' && projectMsg === null">企业级</span>
        <span v-else-if="device === 'desktop' && projectMsg !== null">{{projectMsg.prjName}}</span>
        <span v-else>ECIDI-CMP</span>
      </div>
      <div style="width:100px; margin-left:1000px" v-show="this.$store.state.app.enableI18n">
        <!-- <a-select @change="handleSetLanguage" :defaultValue="language"> -->
        <!-- <a-select @change="handleSetLanguage" style="width:100%" defaultValue="zh-CN"> -->
        <a-select @change="handleSetLanguage" defaultValue="Language">
          <a-select-option value="zh-CN">中文</a-select-option>
          <a-select-option value="en-US">English</a-select-option>
        </a-select>
      </div>

      <user-menu class="setting" :theme="theme"/>
    </div>

    <!-- 顶部导航栏模式 -->
    <div v-else :class="['top-nav-header-index', theme]">
      <div class="header-index-wide">
        <!-- <div class="header-index-left" :style="topMenuStyle.headerIndexLeft"> -->
        <div class="header-index-left">
          <logo
            class="top-nav-header"
            :show-title="device !== 'mobile'"
            :style="topMenuStyle.topNavHeader"
          />
          <!-- 分为：顶部+侧边通栏布局'topsidemenu'、顶部布局'topmenu' -->
          <!-- <div v-if="device !== 'mobile'" :style="topMenuStyle.topSmenuStyle"> -->
          <div v-if="device !== 'mobile'" class="menu-wrapper">
            <!-- <s-menu mode="horizontal" :menu="menus" :theme="theme"></s-menu> -->
            <su-menu mode="horizontal" :menu="menus" :theme="theme" :layoutMode="mode" @menuItemChange="handleMenuItemChange"></su-menu>
          </div>
          <!--  -->
          <!-- <a-icon
            v-else
            class="trigger"
            :type="collapsed ? 'menu-fold' : 'menu-unfold'"
            @click.native="toggle"
          ></a-icon> -->
        </div>
        <user-menu
          class="header-index-right"
          :theme="theme"
          :style="topMenuStyle.headerIndexRight"
        />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import UserMenu from '../tools/UserMenu'
/* import SMenu from '../menu/' */
import Logo from '../tools/Logo'
import SuMenu from '../menu/menu'
import { mixin } from '@/utils/mixin.js'
import { mapGetters } from 'vuex'
import qs from 'qs'
import { getAction, httpAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import enUS from 'ant-design-vue/lib/locale-provider/en_US'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
// import { queryPermissionsByUser } from '@/api/api'
import {
  generateIndexRouter
} from '@/utils/util'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    /* SMenu, */
    SuMenu,
    Logo
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  // inject:['reload'],
  data () {
    return {
      headerBarFixed: false,
      // update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
      topMenuStyle: {
        headerIndexLeft: {},
        topNavHeader: {},
        headerIndexRight: {},
        topSmenuStyle: {}
      },
      projectMsg: null,
      language: Vue.ls.get('language'),
      smenu: null
    }
  },
  watch: {
    /** 监听设备变化 */
    device () {
      if (this.mode === 'topmenu') {
        this.buildTopMenuStyle()
      }
    },
    /** 监听导航栏模式变化 */
    mode (newVal) {
      if (newVal === 'topmenu') {
        this.buildTopMenuStyle()
      }
    },
    // 监控isActive，在点击tab标签时，依旧可以更新左侧菜单栏的数据  2020.6.11 by jxk
    smenu (newVal) {
      this.$emit('tsSideMenu', newVal)
    }
  },
  // update-end--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    // update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
    if (this.mode === 'topmenu') {
      this.buildTopMenuStyle()
    }
    // update-end--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
    console.log('菜单项menus', this.menus)
  },
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log('菜单项PROJECT_MESSAGE', this.projectMsg)
    var loginRecordId
    // this.headers = { 'X-Access-Token': token };
    var websocket = null
    // 判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
      var urlStr = window.location.origin.replace('https://', 'ws://').replace('http://', 'ws://')
      var index = urlStr.lastIndexOf(':')
      var url = urlStr.substring(0, index) + ':8080/ecidi-cmp/websocket/' +
            JSON.parse(localStorage.pro__Login_Username).value +
            '?_t=' + new Date().getTime() + '&token=' + token
      // 建立连接，这里的/websocket ，是ManagerServlet中开头注解中的那个值
      websocket = new WebSocket(url)
    } else {
      alert('当前浏览器 Not support websocket')
    }
    // 连接发生错误的回调方法
    websocket.onerror = function () {
      console.log('WebSocket连接发生错误')
    }
    // 连接成功建立的回调方法
    websocket.onopen = function () {
      // websocket.send(token)
      console.log('WebSocket连接成功')

      // 插入登录信息
      //  TODO: iot中登录时报错 暂时屏蔽
      // httpAction('/sysLoginUserInfo/logininfo/addLoginInfo', qs.stringify({
      //   userName: JSON.parse(localStorage.pro__Login_Username).value
      // }), 'post').then((res) => {
      //   loginRecordId = res // 返回登录记录的id
      // })

      // });
      getAction('/sysInternationalization/sysInternationalization/getLanguage').then((res) => {
        switch (res) {
          case 'en-US':
            Vue.ls.set('language', res)
            // 设置流程的语言环境参数
            window.sessionStorage.setItem('pro__processLanguage', res)
            break
          case 'zh-CN':
            Vue.ls.set('language', res)
            // 设置流程的语言环境参数
            window.sessionStorage.setItem('pro__processLanguage', res)
            break
        }
      })
    }
    const that = this
    // 接收到消息的回调方法
    websocket.onmessage = function (event) {
      if (event.data.indexOf('强制下线') != -1) {
        // 更新退出时间
        // let params = { id: loginRecordId }
        // httpAction('/sysLoginUserInfo/logininfo/updateLogoutTime', qs.stringify(params), 'post')

        const h = that.$createElement
        that.$info({
          title: '下线通知',
          content: h('div', {}, [
            h('p', event.data)
          ]),
          onOk () {
            Vue.ls.remove(ACCESS_TOKEN)
            // that.$router.push({
            //   path: '/user/login'
            // })
            location.reload()
          }
        })
      } else {
        that.$notification.warn({
          message: <b>消息通知</b>,
          description: event.data,
          duration: 0 // 默认4.5s，取消自动关闭只要将该值设为 0 即可。
        })
        // 更新右上角的铃铛的数字
        getAction('/sys/annountCement/listByUser').then(res => {
          if (res.success) {
            // let topDiv = this.$parent.$parent.$parent.$parent.$children[0]
            const topMsgNumDom = that.$el.getElementsByClassName('current')[0]
            if (topMsgNumDom) {
              topMsgNumDom.innerText = res.result.anntMsgTotal
            } else {
              var html =
                $('.anticon-bell')
                  .parent()
                  .html() == undefined
                  ? ''
                  : $('.anticon-bell')
                    .parent()
                    .html()
              $('.anticon-bell')
                .parent()
                .html(
                  html +
                    '<sup title="' +
                    res.result.anntMsgTotal +
                    '" class="ant-scroll-number ant-badge-count" data-show="true">' +
                    '<span class="ant-scroll-number-only"><p class="current">' +
                    res.result.anntMsgTotal +
                    '</p></span></sup>'
                )
            }
          }
        })
      }
      console.log(event.data)
    }
    // 连接关闭的回调方法
    websocket.onclose = function () {
      console.log('WebSocket连接关闭')

      // 更新退出时间
      const params = { id: loginRecordId }
      const that = this
      // 404 屏蔽
      // httpAction('/sysLoginUserInfo/logininfo/updateLogoutTime', qs.stringify(params), 'post')

      // 页面关闭就将前端的语言环境参数设置为中文
      getAction('/sysInternationalization/sysInternationalization/getLanguage').then((res) => {
        switch (res) {
          case 'en-US':
            Vue.ls.set('language', res)
            // Vue.ls.set('processLanguage', res)
            break
          case 'zh-CN':
            Vue.ls.set('language', res)
            // Vue.ls.set('processLanguage', res)
            break
        }
      })

      this.$store.dispatch('GetPermissionList').then(res => {
        const menuData = res.result.menu
        if (menuData === null || menuData === '' || menuData === undefined) {
          return
        }
        let constRoutes = []
        constRoutes = generateIndexRouter(menuData)

        this.$store.dispatch('UpdateAppRouter', {
          constRoutes
        }).then(() => {
          this.$router.addRoutes(this.$store.getters.addRouters)
        })
        // this.$router.go(0)
      })
    }
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
      closeWebSocket()
    }
    // 将消息显示在网页上
    // eslint-disable-next-line no-unused-vars
    function setMessageInnerHTML (innerHTML) {
      alert(innerHTML)
      // $('#noticeNum').html(innerHTML);
      // document.getElementById('message').innerHTML += innerHTML + '<br/>';
    }
    // 关闭WebSocket连接
    function closeWebSocket () {
      websocket.close()
    }
  },
  methods: {
    handleMenuItemChange (submenu) {
      console.log('globalHeader-顶部+侧栏，选中顶部后其对应的子菜单', submenu)
      this.smenu = submenu
      this.$emit('tsSideMenu', this.smenu)
    },
    ...mapGetters(['userInfo']),
    handleScroll () {
      if (this.autoHideHeader) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 100) {
          this.headerBarFixed = true
        } else {
          this.headerBarFixed = false
        }
      } else {
        this.headerBarFixed = false
      }
    },
    toggle () {
      this.$emit('toggle')
    },
    // update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
    buildTopMenuStyle () {
      if (this.mode === 'topmenu') {
        if (this.device === 'mobile') {
          // 手机端需要清空样式，否则显示会错乱
          this.topMenuStyle.topNavHeader = {}
          this.topMenuStyle.topSmenuStyle = {}
          this.topMenuStyle.headerIndexRight = {}
          this.topMenuStyle.headerIndexLeft = {}
        } else {
          /* let rightWidth = '320px'
          this.topMenuStyle.topNavHeader = { 'min-width': '170px' }
          this.topMenuStyle.topSmenuStyle = { width: 'calc(100% - 165px)' }
          this.topMenuStyle.headerIndexRight = { 'min-width': rightWidth }
          this.topMenuStyle.headerIndexLeft = { width: `calc(100% - ${rightWidth})` } */
        }
      }
    },

    // update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
    handleSetLanguage (lang) {
      this.$i18n.locale = lang
      Vue.ls.set('language', lang)
      // Vue.ls.set("processLanguage", lang);
      // 将流程的语言环境参数存入sessionStorage中
      window.sessionStorage.setItem('pro__processLanguage', lang)

      switch (lang) {
        case 'en-US':
          this.$store.commit('TOGGLE_LOCALE', enUS)
          // Vue.ls.set("languageOptions", 'en-US');
          break
        case 'zh-CN':
          this.$store.commit('TOGGLE_LOCALE', zhCN)
          // Vue.ls.set("languageOptions", 'zh-CN');
          break
      }
      getAction('/sysInternationalization/sysInternationalization/setLanguage', { language: lang }).then((res) => {
        if (res.success) {
          console.log(res.success, 'success')
        }
      })
      this.$router.go(0)

      // window.location.reload()
      // window.reload()
      // this.$router.go(0)
    }
  }
}
</script>

<style lang="scss" scoped>
/* update_begin author:scott date:20190220 for: 缩小首页布局顶部的高度*/

$height: 84px;

.layout {
  .top-nav-header-index {
    .header-index-wide {
      /* margin-left: 10px; */

      .ant-menu.ant-menu-horizontal {
        height: $height;
        line-height: $height;
      }
    }
    .trigger {
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    color: #666;
    height: $height;
    /* background-color: #eff1f2; */
    transition: background 300ms;
    padding-right: 0;

    .welcome{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 25px;
      i{
        padding: 0;
        margin-right: 12px;
      }
    }
    .setting{
      display: flex;
      align-items: center;
    }

    /* dark 样式 */
    &.dark {
      color: #000000;
      /* box-shadow: 0 0 4px rgba(0, 0, 0, 0.2); */
      /* background-color: white !important; */
    }
  }

  .header,
  .top-nav-header-index {
    &.dark .trigger:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

.ant-layout-header {
  background-color: #3565F7;  // 修复刷新后顶部导航栏先变黑色的问题，但是会顶部导航栏主题色设置失效
  height: $height;
  line-height: $height;
}

/* update_end author:scott date:20190220 for: 缩小首页布局顶部的高度*/
</style>
