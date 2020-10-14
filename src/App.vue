<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enquireScreen from '@/utils/device'
import { getAction } from './api/manage'

export default {
  data () {
    return {
      locale: zhCN
    }
  },
  created () {
    let that = this
    enquireScreen(deviceType => {
      // tablet
      if (deviceType === 0) {
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', false)
      } else if (deviceType === 1) {
      // mobile
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', false)
      } else {
        that.$store.commit('TOGGLE_DEVICE', 'desktop')
        that.$store.dispatch('setSidebar', true)
      }
    })
  },
  mounted () {
    // window.onbeforeunload = function (e) {
    //   this.setRedisPrjCodeNull()
    //   let url = '/project/sysProject/notifyPrjCode'
    //   let params = { prjCode: '' }
    //   let result = navigator.sendBeacon(url, params)
    //   if (result) {
    //   }
    // e = e || window.removeEventListener
    // // 兼容IE8和Firefox 4之前的版本
    // if (e) {
    //   e.returnValue = '关闭提示'
    // }
    // // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    // return '关闭提示'
    // }
    window.onunload = function (e) {
      this.setRedisPrjCodeNull()
    }
    this.$nextTick(() => {
      let that = this
      document.addEventListener('visibilitychange', function () { // 页面可见性改变事件
        console.log('监听到浏览器切换！！')
        if (document.visibilityState == 'hidden') {
        } else {
          let url = '/project/sysProject/notifyPrjCode'
          let params = { prjCode: '' }
          console.log('监听到浏览器切换，项目信息=>', that.$store.getters.prjInfo)
          if (that.$store.getters.prjInfo) {
            params = { prjCode: that.$store.getters.prjInfo.prjCode }
          }
          getAction(url, params).then(res => {
            // console.log('监听到浏览器切换，getAction', res)
            if (res.success) {
              // that.$message.success('加载项目信息成功')
              console.log('监听到浏览器切换,加载项目信息成功')
            } else {
              that.$message.warning(res.$message)
            }
          })
        }
      })
      // window.addEventListener('unload', that.setRedisPrjCodeNull(), false)
    })
  },
  methods: {
    setRedisPrjCodeNull () {
      let token = JSON.parse(localStorage.getItem('pro__Access-Token')).value
      // let headers = {
      //   type: 'application/json; charset=utf-8',
      //   authorization: `bearer ${token}`
      // }
      // let blob = new Blob([{}], headers)
      const url = '/ecidi-cmp/project/sysProject/exitProject'
      // navigator.sendBeacon(url, {})

      let setRedisPrjCode = new XMLHttpRequest()
      setRedisPrjCode.open('GET', url, false)
      setRedisPrjCode.setRequestHeader('Content-type', 'application/json')
      setRedisPrjCode.setRequestHeader('X-Access-Token', token)
      setRedisPrjCode.onreadystatechange = function () {
        if (setRedisPrjCode.readyState === 4) {
          console.log('finished')
        }
      }
      setRedisPrjCode.send()
      // await getAction(url, {}).then(res => {
      //   console.log(res)
      //   if (res.success) {
      //   } else {
      //     this.$message.warning(res.message)
      //   }
      // })
    }
  },
  beforeDestroy () {
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>
