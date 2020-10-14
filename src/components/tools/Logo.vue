<template>
  <div class="logo">
    <router-link to="/" class="logoPic">
      <img src="@/assets/img/login/logoNoWord.png" style="margin-bottom: 10px;">
      <span class="projectTitle">{{ this.prjTitle }}</span>
    </router-link>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: 'CMP 建管云',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data () {
    return {
      projectMsg: null,
      prjTitle: '工程物联网标准数据服务平台'
    }
  },
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log('from logo.vue:projectMsg=>', this.projectMsg)
    if (this.projectMsg !== null) {
      let prjName = this.projectMsg.prjName
      this.prjTitle = prjName + '物联网平台'
    }
  }
}
</script>
<style lang="scss" scoped>
  /*缩小首页布 局顶部的高度*/
  $height: 80px;
  .projectTitle {
    font-size: 24px;
    font-family: Microsoft YaHei Bold, Microsoft YaHei Bold-Bold;
    font-weight: 700;
    color: #fefefe;
    margin-left: 10px;
    text-align: center;
  }

  .sider {
    box-shadow: none !important;

    .logo {
      height: $height !important;
      line-height: $height !important;
      box-shadow: none !important;
      transition: background 300ms;
      background-color: rgba(0, 0, 0, 0) !important;

      a {
        color: white;

        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
</style>
