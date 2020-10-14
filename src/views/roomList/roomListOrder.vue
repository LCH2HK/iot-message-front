<template>
  <div>
    <a-card :bordered="false" v-model="hoverRoomName">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="日期">
                <a-date-picker
                  :disabledDate="disabledDate"
                  :defaultValue="moment(moment(),'YYYY-MM-DD')"
                  v-model="queryParam.searchDate"
                  @change="onChange" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="会议室">
                <a-input placeholder="请输入会议室名称"
                v-model="queryParam.searchRoomName"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>

            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!--表头-->
      <div style="width: 100%;overflow-x: auto">
      <a-spin :spinning="confirmLoading2" class="loading" style="width: 1839px">
      <div class="father-box">
        <div
          @click="changeDate(1)"
          class="title-room-name-box-control">
          <div class="title-box left-control" title="前一天">
            <a-icon type="caret-left" />
          </div>
        </div>
        <div class="title-room-name-box-text">
          <div class="title-box center-control">会议室名称</div>
        </div>
        <div
          @click="changeDate(2)"
          class="title-room-name-box-control">
          <div class="title-box right-control" title="后一天">
            <a-icon type="caret-right" />
          </div>
        </div>
        <div class="title-contain-number">
          <div class="title-box">人数</div>
        </div>
        <div class="room-time-father-box">
          <div class="title-room-time-box" v-for="(timeList, index) in timeList">
            <div class="title-box">{{timeList.time}}</div>
          </div>
        </div>
      </div>
      <!-- 对会议室清单进行遍历 -->

      <div v-for="(item, index1) in roomList" class="father-box" >
        <div class="content-room-name-box">
          <div class="content-box" :hoverable="true">{{item.roomName}}</div>
        </div>
        <div class="content-contain-number">
          <div class="content-box" :hoverable="true">{{item.containNum}}</div>
        </div>
        <div class="room-time-father-box">
          <!-- 对会议室的时间点状态进行遍历 -->
          <div
            v-for="(items,index) in item.arrUseInfo "
            class="content-room-time-box"
            @mousedown="myMouseDown(item, items.status,index ,index1)"
            @mouseup="myMouseUp(item, items.status,index, index1)"
            @mouseover="mymouseOver(item, items.status,index, index1)"
            :class="{ mousedown:items.status == 2}"
          >
            <!--被预约,自己预定的-->
            <div
              class="content-box"
              v-bind:class="{ active: true }"
              v-if="items.username != null && items.length != 0 && items.subject != null && items.userId == loginUserId"
              :style="{width: getWidth(items.length)}"
              @mouseenter="enter(item, items.status,index)"
              @mouseleave="leave"
            >
                <div class="info-icon-order">
                  {{items.reserveFullName}}
                </div>
            </div>
            <!--被预约,别人预定的-->
            <div
              class="content-box"
              v-bind:class="{ activeOthers: true }"
              v-if="items.username != null && items.length != 0 && items.subject != null && items.userId != loginUserId"
              :style="{width: getWidth(items.length)}"
              @mouseenter="enter(item, items.status,index)"
              @mouseleave="leave"
            >
              <div class="info-icon-order">
                <!--显示为联系人-->
                {{items.reserveFullName}}
              </div>
            </div>
            <!--隐藏单元格-->
            <div
              v-else-if="items.username != null && items.length == 0"
              :style="{display: true}"
              @mouseenter="enter(item, items.status,index)"
              @mouseleave="leave"
            >
            </div>
            <!--如果没有预约-->
            <div
              class="content-box"
              v-else-if="items.usernameusername == null && items.status == 0"
              @mouseenter="enter(item, items.status,index)"
              @mouseleave="leave"
            >
              <img src="@/assets/img/meeting/free.png" draggable="false"></img>
            </div>
            <div
              class="content-box"
              v-else-if="items.usernameusername == null && items.status == 2"
              @mouseenter="enter(item, items.status,index)"
              @mouseleave="leave"
            >
              <img src="@/assets/img/meeting/reserved.png" draggable="false"></img>
            </div>
          </div>
        </div>
        <!-- </a-row> -->
      </div>
      </a-spin>
      </div>
    </a-card>
    <!--表单区域-->
    <!--<meetingRoom-modal ref="modalForm" @ok="modalFormOk" @searchQuery="searchQuery"></meetingRoom-modal>-->
    <meetingRoom-modal ref="test" @searchQuery="searchQuery"></meetingRoom-modal>
  </div>
</template>

<script>
  import moment from 'moment';
  import JSelectDepart from '../../components/cmpbiz/JSelectDepart'
  import JSelectUserByDep from '../../components/cmpbiz/JSelectUserByDep'
  // import { CmpListMixin } from '@/mixins/CmpListMixin'
  import { mapGetters } from 'vuex'
  import ARow from 'ant-design-vue/es/grid/Row'
  import ACol from 'ant-design-vue/es/grid/Col'
  import AFormItem from 'ant-design-vue/es/form/FormItem'
  import {findRoomList} from '../../api/api'
  import ARadioGroup from 'ant-design-vue/es/radio/Group'
  import ARadioButton from 'ant-design-vue/es/radio/RadioButton'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JSelectUserNew from '../../components/cmpbiz/JSelectUserNew'
  import MeetingRoomModal from './modules/MeetingRoomModal'

  export default {
    name: 'roomListOrder',
    components: {
      JSelectUserNew, ARadioButton, ARadioGroup, AFormItem, ACol, ARow, JSelectUserByDep, JSelectDepart, JDictSelectTag, MeetingRoomModal},
    // mixins: [CmpListMixin],
    data() {
      return {
        endTimeDisabled:true,
        model: {},
        hoverRoomName:'会议室预定',
        //滑动状态
        isMoving:false,
        //滑动起始行列
        startRow: '',
        startCol: '',
        startTime:'',
        //滑动结束行列
        endRow: '',
        endCol: '',
        endTime:'',
        // 表单参数
        meetingDate:moment().format('YYYY-MM-DD'),
        disabledValue: true,
        loginUserName : '',
        loginUserId: '',
        departId: "",
        nowTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        // 查询参数
        queryParam:{
          searchDate:moment(moment(),'YYYY-MM-DD'),
          searchRoomName:'',
        },
        confirmLoading: false,
        confirmLoading2: false,
        // 对话框参数
        orderRoom: '',
        orderRoomId: '',
        // 会议室信息透出
        roomList:'',
        roomListCopy: '',
        timeList: [
          { time: '08:30' },
          { time: '09:00' },
          { time: '09:30' },
          { time: '10:00' },
          { time: '10:30' },
          { time: '11:00' },
          { time: '11:30' },
          { time: '12:00' },
          { time: '12:30' },
          { time: '13:00' },
          { time: '13:30' },
          { time: '14:00' },
          { time: '14:30' },
          { time: '15:00' },
          { time: '15:30' },
          { time: '16:00' },
          { time: '16:30' },
          { time: '17:00' },
          { time: '17:30' },
          { time: '18:00' },
          { time: '18:30' },
          { time: '19:00' },
          { time: '19:30' },
          { time: '20:00' },
          { time: '20:30' },
          { time: '21:00' },
          { time: '21:30' },
        ],
        validatorRules: {
          // contactPhone:{rules: [{validator: this.validatePhone},{ required: true, message: '请输入手机号码' }],initialValue: this.$store.getters.userInfo.phone},
          contactPhone:{rules: [{validator: this.validatePhone},{ required: true, message: '请输入手机号码' }]},
          memberNumber:{ rules: [{validator: this.memberNumbercheck}]}
        },
        // 联系电话
        contactPhone:'',
        // 最大容纳数
        containNum:'',
      }
    },
    created () {
      this.loginUserName = this.$store.getters.nickname
      this.loginUserId = this.$store.getters.userId
      this.confirmLoading2 = true
      //查询数据
      findRoomList({meetingDate:this.meetingDate,meetingRoomName:this.queryParam.searchRoomName})
        .then((res) => {
          this.roomList = res.result;
          this.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
          if (res.code === 0){
            this.confirmLoading2 = false
          }
        })
    },
    methods: {
      ...mapGetters(["nickname", "avatar", "userId"]),
      moment,
      onChange(date, dateString) {
        this.queryParam.searchDate = date;
        this.meetingDate = dateString;
        this.confirmLoading2 = true
        //切换日历时，请求查询接口
        findRoomList({ meetingDate: dateString, meetingRoomName: this.queryParam.searchRoomName })
          .then((res) => {
            this.roomList = res.result;
            this.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
            if (res.code === 0) {
              this.confirmLoading2 = false
            }
          })
      },
      myMouseDown: function(item, items, index, key) {
        console.log(item.arrUseInfo[index].contactId,'sdadsasda少')
        this.orderRoom = item.roomName
        this.orderRoomId = item.roomId
        this.containNum = item.containNum
        const that = this
        //如果上次滑动已经结束了，此次点击将会重置页面数据
        if (that.endCol != null) {
          that.roomList = that.roomListCopy //将深度克隆的对象 赋给页面数据源
          that.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
        }
        //如果状态为2，再次点击将其置为0
        if (items == 2) {
          that.roomList[key].arrUseInfo[index].status = 0
        } else if (items == 1) { //如果状态为1，表明该时间点会议室已经被预定了，弹出详情页面，不可提交
          //判定预定用户ID，如果ID是当前登录用户的ID，则弹出表单具备可编辑权限
          if (that.loginUserId === item.arrUseInfo[index].contactId) {
            that.model = item.arrUseInfo[index]
            that.model.action = 3;
            that.$refs.test.edit(item.arrUseInfo[index]);
          }else {
            //让弹出表单只有可读权限
            that.model = item.arrUseInfo[index]
            that.model.action = 2;
            // that.$refs.modalForm.edit(item.arrUseInfo[index]);
            that.$refs.test.edit(item.arrUseInfo[index]);
          }
        } else if (items == 0) { //如果状态为0，表明为空闲会议室，触发鼠标移动事件，并计入起始选择坐标
          that.roomList[key].arrUseInfo[index].status = 2
          that.isMoving = true
          that.startRow = key //起始行坐标
          that.startCol = index //起始列坐标
          that.startTime = that.timeList[index].time
        }
      },
      myMouseUp: function(item, items, index, key) {
        const that = this
        that.endCol = index //结束列坐标
        //对 起始 和 终止时间排序 防止异常
        if (that.startTime != null && that.startTime != '') {
          if (that.startCol <= index) { //正常顺序
            if (that.endCol == 26) {
              that.endTime = '22:00'
            } else {
              that.endTime =
                that.timeList[index + 1].time
            }
          } else { //倒序
            if (that.startCol == 26) {
              that.startTime = '22:00'
              that.endTime = that.timeList[index].time
            } else {
              that.startTime = that.timeList[that.startCol].time
              that.endTime = that.timeList[index].time
            }
          }
        }
        // 在移动的过程中弹起鼠标事件，证明前面的校验都通过了，本次弹起可以触发提交表单并计入终止坐标
        if (that.isMoving == true) {
          //判定时间是否可以选择
          if ((new Date(that.meetingDate + ' ' + that.startTime)).getTime() < (new Date()).getTime()
            || (new Date(that.meetingDate + ' ' + that.startTime)).getTime() < (new Date()).getTime()) {
            that.$message.warning("不能选择过去的时间")
            that.isMoving = false // 关闭滑动
            that.roomList = that.roomListCopy //将深度克隆的对象 赋给页面数据源
            that.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
          } else {
            //弹出表单
            //  查询当前登录用户的手机号
            that.axios.get('/meetingRoom/getInfo?userName=' + that.loginUserId)
              .then(function(response) {
                that.contactPhone = response.result.phone
              })
            //新增字段action，让组件知道本次操作为新增操作，开放编辑和提交按钮
            that.model.subject = null
            that.model.memberNumber = null
            that.model.joinMemberFullName = null
            that.model.joinMemberUserName = null
            that.model.meetingLevel = '小组例会'
            that.model.action = 1;
            that.model.startCol = that.startCol;
            that.model.endCol = that.endCol;
            that.model.contactPhone = that.contactPhone;
            that.model.meetingRoomId = that.orderRoomId;
            that.model.reserveUserName = that.loginUserId;
            that.model.reserveFullName = that.loginUserName;
            that.model.contact = that.loginUserName;
            that.model.contactId = that.loginUserId;
            that.model.meetingRoom = that.orderRoom;
            that.model.meetingDate = that.meetingDate;
            that.model.meetingStartTime = that.startTime;
            that.model.meetingEndTime = that.endTime;
            that.model.reserveDate = moment().format('YYYY-MM-DD HH:mm:ss');
            // that.$refs.modalForm.edit(that.model);
            that.$refs.test.edit(that.model);
            that.isMoving = false //关闭滑动
          }
        }
      },
      mymouseOver: function(item, items, index, key) {
        let isMoving = this.isMoving
        const that = this
        // 如果isMoving不为true，证明mouseDown事件校验不通过，直接退出本方法
        if (!isMoving) return false
        //如果划过的地方 状态为0 ，则为可记录的点 ， 将其状态置为2，做变色处理
        if (items == 0) {
          that.roomList[that.startRow].arrUseInfo[index].status = 2
        } else if (items == 1) { //划过的地方状态为1，表明冲突了
          that.$message.warning('时间有冲突，请重新选择')
          that.isMoving = false // 关闭滑动
          that.roomList = that.roomListCopy //将深度克隆的对象 赋给页面数据源
          that.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
        }
      },
      //鼠标移入事件，依靠移入移出事件，触发Vue页面重渲染，即可及时显示状态为2的区域变色
      enter: function(item, items, index) {
        const time1 = this.timeList[index].time
        let time2 = null
        if (index < this.timeList.length - 1) {
          time2 = this.timeList[index + 1].time
        }
        if (index === this.timeList.length - 1) {
          time2 = "22:00"
        }
        this.hoverRoomName = '会议室预定 【时间段：' + time1 + "—" + time2 + '】'
      },
      //鼠标移出事件
      leave: function() {
        // this.hoverRoomName = '会议室预定'
      },
      //限制日历选择框不可选择过去的时间
      disabledDate(current) {
        return current && current < moment().startOf('day');
      },
      //查询
      searchQuery: function() {
        this.confirmLoading2 = true
        findRoomList({ meetingDate: this.meetingDate, meetingRoomName: this.queryParam.searchRoomName })
          .then((res) => {
            this.roomList = res.result;
            this.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
            if (res.code === 0) {
              this.confirmLoading2 = false
            }
          })
      },
      //重置
      searchReset: function() {
        this.confirmLoading2 = true
        this.meetingDate = moment().format('YYYY-MM-DD')
        this.queryParam.searchRoomName = ''
        findRoomList({ meetingDate: moment().format('YYYY-MM-DD'), meetingRoomName: this.queryParam.searchRoomName })
          .then((res) => {
            this.roomList = res.result;
            this.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
            if (res.code === 0) {
              this.confirmLoading2 = false
            }
          })
        this.queryParam.searchDate = moment(moment(), 'YYYY-MM-DD')
      },
      //转换百分数
      toPercent(val) {
        return (Math.round(val * 10000) / 100).toFixed(2) + '%';
      },
      //根据length参数计算DIV的宽度并返回
      getWidth(length) {
        return this.toPercent(length)
      },
      //手机号码校验
      validatePhone(rule, value, callback) {
        if (!value || new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/).test(value)) {
          callback();
        } else {
          callback("请输入正确格式的手机号码!");
        }
      },
      //参与人数校验
      memberNumbercheck(rule, value, callback) {
        const r = /^\+?[1-9][0-9]*$/;
        if (r.test(value) && value <= this.containNum) {
          callback();
        } else if (r.test(value) && value > this.containNum) {
          callback("人数超过了会议室最大容纳人数");
        } else if (value == '' || value == null) {
          callback();
        } else {
          callback("请输入数字!");
        }
      },
      //前、后一天快捷键切换
      changeDate (value) {
        const that = this;
        let time = '';
        if (value === 1){
          time = (new Date(that.meetingDate)).getTime() - 1000*60*60*24
        } else if (value === 2) {
          time = (new Date(that.meetingDate)).getTime() + 1000*60*60*24
        }
        this.meetingDate = moment(time).format("YYYY-MM-DD")
        console.log(this.meetingDate,'切换后的日期')
        this.queryParam.searchDate = moment(time);
        this.confirmLoading2 = true
        //切换日历时，请求查询接口
        findRoomList({ meetingDate: this.meetingDate, meetingRoomName: this.queryParam.searchRoomName })
          .then((res) => {
            this.roomList = res.result;
            this.roomListCopy = JSON.parse(JSON.stringify(this.roomList)); //将当前页面数据源深度克隆
            if (res.code === 0) {
              this.confirmLoading2 = false
            }
          })
      }
    },
    watch : {
      $route(to,from){
        console.log(to.path,'会议室预定跳转');
        this.searchQuery();
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@assets/less/modal.less';
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
  @table-title-heignt: 50px;
  @table-content-heignt: 50px;
  .active {
    width: auto;
    height: auto;
    background: #8ddd87;
  }
  .activeOthers {
    width: auto;
    height: auto;
    background: #5dd1be;
  }
  .mousedown {
    width: auto;
    height: auto;
    background: #d6def5;
    font-weight: bold;
    /*background-image: url("../../assets/img/meeting/reserved.png") ;*/
    /*background-repeat:no-repeat;*/
    /*background-origin: content-box;*/
  }
  .father-box {
    width: 100%;
  }
  .room-time-father-box {
    width: 87%;
    float: left;
  }
  /*.info-icon {*/
    /*color: #bebebe;*/
    /**/
  /*}*/
  .info-icon-order{
    color: white;
  }

  .title-box {
    width: auto;
    height: 100%;
    /*margin: 0 1q 1q 0 ;*/
    border-style:none solid solid none;
    border-width: 1q;
    border-color: white;
    text-align: center;
    /*background-color: #0099ff;*/
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
    color: white;
  }
  .left-control{
    border-style:none none solid none;
  }
  .title-room-name-box-control:hover {
    font-size: 180%;
    cursor:pointer;
    /*transform: scale(1.1,1.1);*/
  }
  .right-control {
    /*border-style:none none solid none;*/
  }
  .center-control {
    border-style:none none solid none;
  }
  .content-box {
    width: auto;
    height: 100%;
    text-align: center;
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    border-style:none solid solid none;
    border-width: 1q;
    border-color: #d5d5d5;
  }

  .title-room-name-box {
    width: 10%;
    height: @table-title-heignt;
    line-height: @table-title-heignt;
    float: left;
  }
  .title-room-name-box-control {
    width: 3%;
    height: @table-title-heignt;
    line-height: @table-title-heignt;
    float: left;
  }
  .title-room-name-box-text {
    width: 4%;
    height: @table-title-heignt;
    line-height: @table-title-heignt;
    float: left;
  }
  .content-room-name-box {
    width: 10%;
    height: @table-content-heignt;
    line-height: @table-content-heignt;
    float: left;
    border-style:none none none solid;
    border-width: 1q;
    border-color: #d5d5d5;
  }
  .title-contain-number{
    width: 3%;
    height: @table-title-heignt;
    line-height: @table-title-heignt;
    float: left;
  }
  .content-contain-number{
    width: 3%;
    height: @table-content-heignt;
    line-height: @table-content-heignt;
    float: left;
  }
  .title-room-time-box {
    width: 3.7%;
    height: @table-title-heignt;
    line-height: @table-title-heignt;
    float: left;
  }
  .content-room-time-box {
    width: 3.7%;
    height: @table-content-heignt;
    line-height: @table-content-heignt;
    float: left;
  }
</style>
