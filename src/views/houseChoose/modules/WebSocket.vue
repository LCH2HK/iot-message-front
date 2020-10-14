<template>
  <div class="ws-body title-box">
    <a-row>
      <a-col :span="12">
        <div class="font-box-back ws-title">
          工作人员：
        </div>
      </a-col>
      <a-col :span="12">
        <div class="ws-title font-box-text">
          {{ this.$store.getters.userInfo.realname }}
          <a-button @click="pauseOrStart(btnStatus)" :type="btnType"> {{ btnStatus }} </a-button>
        </div>
      </a-col>
    </a-row>
    <!--选房剩余时间-->
    <a-spin :spinning="confirmLoadingTypeList">
    <a-row style="margin-top: 20px">
      <a-col :span="12">
        <div class="font-box-back ws-title">
          选房剩余时间：
        </div>
      </a-col>
      <a-col :span="12" v-if="chooseSort.nowChooser">
        <div align="center">
          <count-down
            v-if="this.btnStatus === '暂停'"
            class="font-box-text"
            style="font-size: 25px"
            :target="countTime"
            :on-end="onEndHandle"
            @callBack="callBack">
          </count-down>
          <span class = "font-box-text" style="font-size: 25px;" v-else>
            {{ pauseTime }}
          </span>
        </div>
      </a-col>
    </a-row>
    <!--当前选房人-->
    <a-row style="margin-top: 20px">
      <a-col :span="12">
        <div class="font-box-back ws-title">
          当前选房人：
        </div>
      </a-col>
      <a-col :span="12" v-if="chooseSort.nowChooser">
        <div class="ws-title font-box-text">
          {{ chooseSort.nowChooser.chooserName }}
        </div>
      </a-col>
    </a-row>
    <!--户型剩余-->
    <a-row style="margin-top: 20px">
        <a-col :span="12">
          <div class="font-box-back ws-title">
            户型剩余：
          </div>
        </a-col>
        <a-col :span="24">
          <a-row>
            <a-col :span="12" v-for="(item,index) in lastBuilding" :key="index">
              <div class="font-box-text" style="margin-top: 3px">
                {{ item.type }} : {{ item.lastCount }} / {{ item.allCount }}
              </div>
            </a-col>
          </a-row>
        </a-col>
    </a-row>
    <!--选房人队列-->
    <a-row style="margin-top: 20px">
      <a-col :span="12">
        <div class="font-box-back ws-title">
          选房人队列：
        </div>
      </a-col>
      <a-col :span="24" v-if="chooseSort.nowChooser">
        <a-row>
          <a-col :span="12" v-for="(item, index) in chooseSort.list" :key="index">
            <div class="font-box-text" style="margin-top: 3px">
             {{ index+1 }} : {{ item.chooserName }}
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    </a-spin>
    <!--历史信息-->
    <web-socket-model></web-socket-model>
  </div>
</template>

<script>
  import WebSocketModel from './WebSocketModel'
  import CountDown from '../../../components/CountDown/CountDown'
  import ACol from 'ant-design-vue/es/grid/Col'

  export default {
    name: 'WebSocket',
    components: { ACol, CountDown, WebSocketModel },
    data() {
      return {
        lastBuilding: [],
        chooseSort: '',
        confirmLoadingTypeList: false,
        lastTime: 1800000, //剩余时间,默认半小时
        lastTimeCallBack: '',
        countTime: '',
        btnStatus: '暂停',
        btnType: 'danger',
        pauseTime: '',
        nowChooserId: '',
        nowChooserName: '',
      }
    },
    created() {
      this.getTypeList();
      this.getSort();
      this.countTime = new Date().getTime() + this.lastTime;
    },
    computed: {

    },
    beforeDestroy() {
      this.uploadLastTime()
    },
    methods: {
      getTypeList() {
        this.confirmLoadingTypeList = true;
        this.axios.get("/online/choose/typeList?buildingId=c75fdc1d55f15e88a3830c71660aa313")
          .then( (res) => {
            this.lastBuilding = res.result;
            this.confirmLoadingTypeList = false;
          } )
      },
      onEndHandle () {
        this.$message.success('CountDown callback!!!')
      },
      getSort() {
        this.axios.get('/houseChooseSort/houseChooseSort/nowSort?buildingId=c75fdc1d55f15e88a3830c71660aa313')
          .then( (res) => {
            console.log(res,'这是打印的res')
            if (res.success) {
              this.chooseSort = res.result;
              this.lastTime = this.chooseSort.nowChooser.chooseTime
              this.countTime = new Date().getTime() + this.lastTime
              this.nowChooserId = this.chooseSort.nowChooser.chooserId
              this.nowChooserName = this.chooseSort.nowChooser.chooserName
            }
          })
      },
      // 获取剩余时间
      callBack (val) {
        this.lastTimeCallBack = val;
      },
      // 上传时间断点
      uploadLastTime() {
        this.chooseSort.nowChooser.chooseTime = this.lastTimeCallBack
        if (this.lastTimeCallBack === 0){
          this.chooseSort.nowChooser.status = "1"
        }else if (this.lastTimeCallBack > 0) {
          this.chooseSort.nowChooser.status = "0"
        }
        this.axios.post('/houseChooseSort/houseChooseSort/pauseCount',this.chooseSort.nowChooser)
          .then( (res) => {
            console.log(res)
          } )
      },
      pauseOrStart(val) {
        if (val === "暂停"){
          this.btnType = 'default';
          this.btnStatus = "启动";
          //记录断点
          this.uploadLastTime();
          //获取当前时间
          this.pauseTime = this.formatDuring(this.lastTimeCallBack)
        } else if (val === "启动"){
          this.btnType = 'danger';
          this.btnStatus = "暂停";
          //加载断点时长
          this.getSort();
        }
      },
      // 切换至下一选房人
      nextChooser() {
        console.log('切换至下一选房人')
        this.chooseSort.nowChooser.chooseTime = this.lastTimeCallBack
        this.chooseSort.nowChooser.status = "1"
        this.axios.post('/houseChooseSort/houseChooseSort/pauseCount',this.chooseSort.nowChooser)
          .then( (res) => {
            console.log(res)
            this.getSort()
          })
      },
      formatDuring(mss) {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = ((mss % (1000 * 60)) / 1000).toFixed(0);
        hours = hours < 10 ? ('0' + hours) : hours;
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        seconds = seconds < 10 && seconds >= 1 ? ('0' + seconds) : seconds;
        return  hours + ":" + minutes + ":" + seconds;
      }
    },
    watch: {
      nowChooserId: function() {
        this.$emit('getThisChooser',this.nowChooserId,1)
      },
      nowChooserName: function() {
        this.$emit('getThisChooser',this.nowChooserName,2)
      }
    }
  }
</script>

<style scoped lang="less">
  @title-height: 30px;
  .ws-body {
    width: 100%;
    height: 100%;
  }

  .ws-title {
    margin-top: 3px;
    margin-left: 3px;
    width: 100%;
    height: @title-height;
    line-height: @title-height;
  }
</style>