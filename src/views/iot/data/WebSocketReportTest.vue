<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
          <a-button @click="wsOnOpen" type="primary" icon="plus">建立连接</a-button>
            <a-button @click="closeWebSocket" type="primary" icon="plus">关闭连接</a-button>
            <a-button @click="sendMessage" type="primary" icon="plus">发送消息</a-button>
        </div>
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'WebSocketReportTest',
  mixins: [],
  components: {
  },
  data () {
    return {
      websocket: '',
      description: '设备数据管理页面'
    }
  },
  computed: {
  },
  beforeCreate () {
  },
  created () {
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
      this.closeWebSocket()
    }
  },
  methods: {
    wsOnOpen () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
      console.log('菜单项PROJECT_MESSAGE', this.projectMsg)
      // this.headers = { 'X-Access-Token': token };
      // 判断当前浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        var url = 'ws://localhost:8080/ecidi-cmp/dataWebSocket/cmm001' +
            '?_t=' + new Date().getTime() + '&token=' + token
        // 建立连接，这里的/websocket ，是ManagerServlet中开头注解中的那个值
        this.websocket = new WebSocket(url)
      } else {
        alert('当前浏览器 Not support websocket')
      }
      // 连接发生错误的回调方法
      this.websocket.onerror = function () {
        console.log('WebSocket连接发生错误')
      }
      // 连接成功建立的回调方法
      this.websocket.onopen = function () {
      // websocket.send(token)
        console.log('WebSocket连接成功')
      }
      // 接收到消息的回调方法
      this.websocket.onmessage = function (event) {
        console.log('onmessage =>', event)
      }
      // 连接关闭的回调方法
      this.websocket.onclose = function () {
        console.log('WebSocket连接关闭')
      }
    },
    handleAdd () {
      console.log('handleAdd')
    },
    closeWebSocket () {
      this.websocket.close()
    },
    sendMessage () {
      let params = {
        ID: 'YSCP20200723000001',
        CmdType: '01',
        DT: '20200723095301001',
        CN: '2011'
      }
      this.websocket.send(JSON.stringify(params))
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>
