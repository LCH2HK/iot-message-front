<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <!-- header -->
      <div class="header">
        <!-- logo -->
        <div class="logo">
          <router-link to="/">
            <!-- <img src="@/assets/img/login/logo.png" alt="logo"> -->
          </router-link>
        </div>

        <!-- title-list -->
        <ul class="title-list" v-if="device === 'desktop'">
          <router-link to="/user/login">
            <li v-for="(page,index) in pagelists" :key="index" class="title"><img :src="page.path" class="icons">{{page.title}}</li>
          </router-link>
        </ul>
        <!--
        <router-link class="login" to="/user/login" v-if="device === 'desktop'">
          <span>请登录</span>
          <img src="@/assets/img/login/login.png">
        </router-link> -->
      </div>

      <!-- body -->
      <div class="body">
        <route-view></route-view>
      </div>

      <!-- footer -->
      <!-- <div class="footer">
          <div class="links"></div>
          <div class="copyright">Copyright &copy; 2019 建管部研发小组</div>
      </div>-->
    </div>
  </div>
</template>

<script>
import RouteView from '@/components/layouts/RouteView'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {
      pagelists: [
        // {
        //   title: '管理看板',
        //   path:require('@/assets/img/icon/管理看板.png')
        // },
        // {
        //   title: '综合办公',
        //   path:require('@/assets/img/icon/综合办公.png')
        // },
        // {
        //   title: '人力资源',
        //   path:require('@/assets/img/icon/人力资源.png')
        // },
        // {
        //   title: '设计管理',
        //   path:require('@/assets/img/icon/设计管理.png')
        // },
        // {
        //   title: '采购管理',
        //   path:require('@/assets/img/icon/采购管理.png')
        // },
        // {
        //   title: '合同管理',
        //   path:require('@/assets/img/icon/合同管理.png')
        // },
        // {
        //   title: '财务管理',
        //   path:require('@/assets/img/icon/financial-management.png')
        // },
        // {
        //   title: '图档管理',
        //   path:require('@/assets/img/icon/图档管理.png')
        // },
        // {
        //   title: '工程建设管理',
        //   path:require('@/assets/img/icon/工程建设管理.png')
        // },
        // {
        //   title: '移动办公',
        //   path:require('@/assets/img/icon/移动办公.png')
        // }
        /*
        ,{
          title: '大屏展示'
        } */
      ]
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="scss" scoped>
/* 组件最外层容器 */
#userLayout.user-layout-wrapper {
  height: 100%;
  background: #f0f2f5 url(~@/assets/img/login/loginPage.png) no-repeat 50%;
  background-position: center center;
  background-size: cover;

  /* 设备为手机时样式 */
  &.mobile {
    .container {
      overflow: hidden;
      max-width: 368px;
      margin: 0 auto;
      padding-top: 58px;
      text-align: center;
      .desc{
        margin-top: 50px;
      }
      .main {
        width: 98%;
      }
    }
  }

  /* 设备为pc时样式 */
  &.desktop {
    min-width: 1450px;
    .container {
      width: 700px;
      float: right;
      .header {
        display: flex;
        align-items: center;

        .logo {
          padding-right: 60px;
        }

        .title-list {
          width: 1266px;
          margin: 0;
          flex-grow: 1;
          .title {
            float: left;
            margin-right: 33px;
            height: 24px;
            font-size: 18px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: #fff;
            line-height: 24px;
            opacity: 0.66;
            .icons{
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
          }
        }

        .login {
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            font-size: 14px;
            font-family: SourceHanSansCN-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 32px;
            opacity: 0.66;
          }

          img {
            width: 12px;
            height: 13px;
            opacity: 0.66;
            margin-left: 5px;
          }
        }
      }

      .body{
        .desc{
          margin: 218px 0 0 119px;
        }
      }
    }
  }
}
</style>
