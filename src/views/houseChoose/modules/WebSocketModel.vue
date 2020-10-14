<template>
  <div style="width: 100%;">
    <a-row style="margin-top: 20px">
      <a-col :span="12">
        <div class="font-box-back ws-title">
          历史信息：
        </div>
      </a-col>
      <a-col :span="24" style="height: 400px;overflow-y: auto">
        <a-row>
          <a-col :span="24" v-for="(item, index) in chooseHistory" :key="index">
            <div class="font-box-text" style="margin-top: 10px; text-align: left">
              【 {{ item.createTime }} 】：{{ item.chooserName }} 选择了 {{ item.buildingNumber }} 幢
              {{ item.unitNumber }} 单元 {{ item.doorNumber }} 房。
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import store from '@/store/'
  export default {
    name: 'WebSocketModel',
    data() {
      return {
        chooseHistory:[],
      }
    },
    created() {
      this.axios.get('/online/choose/chooseHistory?buildingId=c75fdc1d55f15e88a3830c71660aa313')
        .then( (res) => {
          this.chooseHistory = res.result
        } )
    },
    mounted() {
      //初始化websocket
      this.initWebSocket()
    },
    destroyed: function () { // 离开页面生命周期函数
      this.websocketclose();
    },
    beforeDestroy() {
      this.websocketclose();
    },
    methods: {
      sendMessage() {
        this.websock.send(this.demo);
      },
      initWebSocket: function () {
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        var userId = store.getters.userInfo.id;
        var url = window._CONFIG['domianURL'].replace("https://","ws://").replace("http://","ws://")+"/houseChoose/websocket/"+userId;
        this.websock = new WebSocket("ws://localhost:8080" + url);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen: function () {
        console.log("WebSocket连接成功");
      },
      websocketonerror: function (e) {
        console.log("WebSocket连接发生错误",e);
      },
      websocketonmessage: function (e) {
        console.log('系统消息=>',e)
        var data = eval("(" + e.data + ")"); //解析json对象
        if(data.cmd == "topic"){
          //TODO 系统通知
          this.chooseHistory.reverse()
          this.chooseHistory.push(JSON.parse(e.data))
          this.chooseHistory.reverse()
        }else if(data.cmd == "user"){
          //TODO 用户消息

        }

      },
      websocketclose: function (e) {
        console.log("connection closed (" + e + ")");
      }
    }
  }
</script>

<style scoped lang="less">
  @title-height: 30px;
  input {
    margin-right: 20px;
    width: 200px;
  }
  span {
    margin-left: 20px;
    border: 1px solid blue;
  }
  .ws-title {
    margin-top: 3px;
    margin-left: 3px;
    width: 100%;
    height: @title-height;
    line-height: @title-height;
  }
</style>