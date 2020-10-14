<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
      >
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="日期">
              <a-date-picker
                placeholder="请选择日期"
                @change="onChange"
                v-model="queryParam.meetingDate"/>
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

    <div>
      <a-table :columns="columns"
               :dataSource="data"
               :scroll="{ x:2200 }"
               rowKey="roomId"
               :loading="loading"
               bordered
      >
<!--        <template slot="t0" slot-scope="t0">
            <a @click="check(t0)" type="primary" v-if="t0.status=='1'"><font style="color:red" >{{createby}}</font></a>
            <img src="@/assets/img/meeting/free.png"  draggable="false" style="width: 100%;height: 100%; border:none;" v-else-if="t0.status=='0'"/>
            <img src="@/assets/img/meeting/free.png"  draggable="false" style="width: 100%;height: 100%; border:none;"/>
        </template>-->

<!--        <template slot="action" slot-scope="text, record">
          <a @click="handleBook(record)">查看</a>
        </template>-->
      </a-table>
    </div>
    <div>
      <a-modal
        title="会议室预订"
        v-model="visible"
        :width="1000"
        :maskClosable="false"
        @ok="subbook"
        @cancel="reload"
        @close="reload"
        style="top:5%;"
        >

          <a-form
            :form="form">
            <a-row :gutter="24">
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="会议主题">
                  <a-input placeholder="请输入会议主题"
                           v-decorator="['subject', { rules: [{ required: true, message: '请输入会议主题' }]}]" />
                </a-form-item>
              </a-col>
              <!--参与人数-->
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="参与人数">
                  <a-input
                    style="width: 50%"
                    placeholder="请输入参与人数"
                    v-decorator="[ 'memberNumber', validatorRules.memberNumber]"
                  />
                  最大容纳人数：{{this.containNum}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="联系人/主持人">
                  <j-select-user-new
                    :selectedDetails="auditUsers1"
                    @callback="setAuditUser"
                    class="userSelect" v-decorator = "['reserveFullName',{}]"></j-select-user-new>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="联系电话">
                  <a-input
                    v-decorator="[ 'contactPhone', validatorRules.contactPhone]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <!--会议室名称-->
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="会议室名称">
                  <a-input
                    :disabled="disabledValue" v-decorator="['meetingRoom',{}]"/>
                </a-form-item>
              </a-col>

              <!--会议日期-->
              <!--<a-col :md="12" :sm="8">
                <a-form-item
                  style="display: none"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="会议日期">
                  <a-date-picker
                    :disabledDate="disabledDate"
                    v-decorator="['meetingDate',{initialValue:this.queryParam.searchDate}]"
                    @change="onChange" />
                </a-form-item>
              </a-col>-->
              <!--会议级别-->
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="会议类型">
                  <j-dict-select-tag
                    v-decorator="['meetingLevel', {initialValue:'小组例会'}]"
                    :triggerChange="true"
                    placeholder="请选择会议类型"
                    dictCode="meeting_level"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="会议开始时间">
                  <a-input :disabled="disabledValue" v-decorator="[ 'meetingStartTime', {}]"></a-input>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="会议结束时间">
                  <a-input :disabled="disabledValue" v-decorator="[ 'meetingEndTime', {}]"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
              <a-col :md="12" :sm="8" style="display: none">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="申请部门">
                  <j-select-depart
                    v-decorator="['applyDepart',{ }]"
                    :trigger-change="true" ></j-select-depart>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8" style="display: none">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="部门领导">
                  <j-select-user-by-dep
                    v-decorator="['departLeader',{}]"></j-select-user-by-dep>
                </a-form-item>
              </a-col>

              <a-form-item label="meetingRoomId" style="display: none">
                <input v-decorator="['meetingRoomId',{initialValue:this.orderRoomId}]"/>
              </a-form-item>

              <!--院内主要参与者-->
              <a-row :gutter="24">
                <a-col :md="24" :sm="8">
                  <a-form-item
                    :labelCol="{
                xs: { span: 24},
                sm: { span: 3 },
                }"
                    :wrapperCol="{
                xs: { span: 24},
                sm: { span: 20 },
                }"
                    label="院内参与者">
                    <!--<j-select-user-by-dep-->
                    <!--v-decorator="['joinMember',{rules: [{ required: true, message: '请选择参与人' }],initialValue:this.loginUserName}]"/>-->
                    <j-select-user-new :selectedDetails="auditUsers2" @callback="setAuditUser" class="userSelect"></j-select-user-new>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="8">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="预订人">
                    <a-input
                      :disabled="disabledValue"
                      v-decorator="['contact',{ rules: [{ required: true, message: '预订人' }],initialValue:this.loginUserName}]"/>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="8">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="预定时间">
                    <a-input
                      :disabled="disabledValue" v-decorator="[ 'reserveDate', ,{}]" />
                  </a-form-item>
                </a-col>
              </a-row>

            <!--              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="通知方式">
                  <a-input placeholder="请输入通知方式" v-decorator="['informMethod', {}]" />
                </a-form-item>
              </a-col>-->

            </a-form>
        </a-modal>
    </div>
  </a-card>

</template>

<script>
  import moment from 'moment';
  import { mapGetters } from 'vuex'
  import { getAction } from '@/api/manage'
  import { putAction } from '@/api/manage'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
  import JSelectUserByDep from '@/components/cmpbiz/JSelectUserByDep'
  import ARow from "ant-design-vue/es/grid/Row"


  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }

  function timeBySort(timeNum){
    var time;
    if (timeNum % 1 ===0){
      time = timeNum + ":00"
    }else {
      time = timeNum-0.5 + ":30"
    }
    return time;
  }
  
  Date.prototype.Format = function(fmt)
  {
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  }

  export default {

    mixins:[CmpListMixin],

    mounted() {
      this.selectdate = getNowFormatDate();
      this.loading = true;
      this.fetch({meetingDate:getNowFormatDate(),meetingRoomName:this.queryParam.searchRoomName});
      this.loading = false;
      this.loginUserName = this.$store.getters.nickname;
      this.loginUserId = this.$store.getters.userId;
    },

    components: {
      ARow,
      JSelectUserNew,
      JSelectDepart,
      JSelectUserByDep,
    },

    data() {

      return {
        //记录mousedown时的会议室
        selectroomname:'',
        startValue: '',
        selectflag:"0",
        row:'',
        orderRoomId: '',
        startCol:'',
        endCol:'',
        img: require(`@/assets/img/meeting/free.png`),
        //查询日期
        selectdate:'',

        loading:false,
        data: [],
        disabledValue: true,

        //预订弹窗
        visible: false,
        confirmLoading: false,
        confirmLoading2: false,

        columns : [
          {
            title: '会议室名称',
            align: "center",
            dataIndex: 'roomName',
            width: 160,
            fixed: 'left'
          },
          {
            title: '人数',
            align: "center",
            width: 80,
            dataIndex: 'containNum',
            fixed: 'left'
          },
          {
            title: '8:30',
            align: "center",
            // scopedSlots:{customRender:'t0'},
            dataIndex: 'arrUseInfo[0]',
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[0],rowIndex,record);
            },
          },
          {
            title: '9:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[1]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[1],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '9:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[2]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[2],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '10:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[3]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[3],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '10:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[4]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[4],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '11:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[5]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[5],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '11:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[6]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[6],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '12:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[7]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[7],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '12:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[8]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[8],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '13:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[9]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[9],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '13:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[10]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[10],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '14:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[11]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[11],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '14:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[12]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[12],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '15:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[13]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[13],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '15:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[14]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[14],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '16:00',
            align: "center",
            
            dataIndex: 'arrUseInfo[15]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[15],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '16:30',
            align: "center",
            
            dataIndex: 'arrUseInfo[16]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[16],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '17:00',
            align: "center",
            dataIndex: 'arrUseInfo[17]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[17],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          /*{
            title: '17:00',
            align: "center",
            dataIndex: 'arrUseInfo[18]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[18],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },*/
          {
            title: '17:30',
            align: "center",
            dataIndex: 'arrUseInfo[18]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[18],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '18:00',
            align: "center",
            dataIndex: 'arrUseInfo[19]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[19],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '18:30',
            align: "center",
            dataIndex: 'arrUseInfo[20]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[20],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '19:00',
            align: "center",
            dataIndex: 'arrUseInfo[21]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[21],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '19:30',
            align: "center",
            dataIndex: 'arrUseInfo[22]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[22],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '20:00',
            align: "center",
            dataIndex: 'arrUseInfo[23]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[23],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '20:30',
            align: "center",
            dataIndex: 'arrUseInfo[24]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[24],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '21:00',
            align: "center",
            dataIndex: 'arrUseInfo[25]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[25],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          },
          {
            title: '21:30',
            align: "center",
            dataIndex: 'arrUseInfo[26]',
            customCell:(record, rowIndex) => {
              return this.thiscell(record.arrUseInfo[26],rowIndex,record);
            },
            customRender: (text, row, index) => {
              return this.cellcontent(text, row, index);
            },
          }/*,
          {
            title: '更多',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            
            fixed: 'right'
          }*/],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        // 查询参数
        queryParam:{
          meetingDate:moment(moment(),'YYYY-MM-DD'),
          searchRoomName:'',
        },
        url: {
          list: 'meetingRoom/meetingRoomTimeStatus/list'
        },

        validatorRules: {
          contactPhone:{rules: [{validator: this.validatePhone},{ required: true, message: '请输入手机号码' }],initialValue:this.$store.getters.userInfo.phone},
          memberNumber:{ rules: [{ required: true, message: '参与人数' },{validator: this.memberNumbercheck}]}
        },
        loginUserName : '',
        loginUserId: '',
        model: {},
        reserveUserName:'',
        reserveFullName:'',
        joinMemberUserName:'',
        joinMemberFullName:'',
        selectUser: ['auditUsers1', 'auditUsers2'],
        auditUsers1: {
          colum: 'auditUsers1',
          value: [],
          target: [
            { to: 'reserveUserName', from: 'username' },
            { to: 'reserveFullName', from: 'realname' }
          ]
        },
        auditUsers2: {
          colum: 'auditUsers2',
          value: [],
          target: [{ to: 'joinMemberUserName', from: 'username' }, { to: 'joinMemberFullName', from: 'realname' }]
        },
        // 最大容纳数
        containNum:'',
      }
    },

    methods: {
      ...mapGetters(["nickname", "avatar","userId"]),
      moment,

      cellcontent(text, row, index){
        var createby = text.reserveFullName;
        const obj1 = {
          children: <a click="check(text)" type="primary" ><font style="color:white" >{createby}</font></a>,
          attrs: {colSpan : text.length,style:"background-color:#32CD32;"}
      };
        const obj2 = {
          // children: <img src=`@/src/assets/img/meeting/free.png` draggable="false" style="width: 100%;height: 100%; border:none;"/>,
          children:<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAYAAABQDyyRAAACSklEQVRIib2Wy2sUQRDGf7uJSiS+ERQUsr4iKohi/gKJiKJovAkBD4bcREExggfRmxcPQg5BRTxETxoPKoggHoTkD9BTTFgiRAPB9wOjrlT8Btrp7mF2JPvBMHRVdVd11dddXapWq0SwAzgLrAmrc+M7cB+4GprQ7En+YinwHGgBPgE1zyI/FgO7gWlgMG8A7XJ+GBjytPXDNtAVCqAcWSrZ8RtPUwwzwM/QzFgAv/Vf5GmysRFYGbAo1RtAFkqqaxoXgKcRXRRFAiiLoCcc2UPgJNAJvPJmZCBGwiz8AvpEzgngNLBAJ6fQborgAdAN3AVGgF0F1ymUgQR3VIoJT1MHYhlo0n/a0/yLvM7tWM/3pDmO4XZPUz/sKM+L3aaxAF4Cr4Ebmvg/30etecvzksGBL8B6oAdYJbuWlM2MGk1Nd0PaxuTfgK/AE2DY82ITM7phQxAqge3iXirlVpJtjs3CgM0LYItjc1C9xLXpz5OBM8Bl4Lp4YOw9B4ypLIbzwCVgAJjURdSnQLc6JfgMXBGpO4B9wH7dnLMIcWCT/scd2WrgmDNu17/XkW0AjqTWOgVcc8YW1NpQBvYAF4HNwBLp3qlENeea/ZAavxcB07Imp5MmNiZrlWxMxOxNAhgH2oBHwFu9gtYlQaqWxuaKxlMBm0mdiopSbmsuB5YpQOsh5mwFcEABVppFKHN+GzjqFWRuYFwaBfaW1UINNxvkHLVsy0pPWeSywWPPbG5hr+SdVoJDcmMvmh8NDMBeyrOn4JkuGSNMYwHDfwA/7pZY7fiBvAAAAABJRU5ErkJggg==" draggable="false" style="width: 100%;height: 100%; border:none;"/>,
          attrs: {colSpan : text.length },
      };
        const obj3 = {
          children: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAYAAABQDyyRAAACSklEQVRIib2Wy2sUQRDGf7uJSiS+ERQUsr4iKohi/gKJiKJovAkBD4bcREExggfRmxcPQg5BRTxETxoPKoggHoTkD9BTTFgiRAPB9wOjrlT8Btrp7mF2JPvBMHRVdVd11dddXapWq0SwAzgLrAmrc+M7cB+4GprQ7En+YinwHGgBPgE1zyI/FgO7gWlgMG8A7XJ+GBjytPXDNtAVCqAcWSrZ8RtPUwwzwM/QzFgAv/Vf5GmysRFYGbAo1RtAFkqqaxoXgKcRXRRFAiiLoCcc2UPgJNAJvPJmZCBGwiz8AvpEzgngNLBAJ6fQborgAdAN3AVGgF0F1ymUgQR3VIoJT1MHYhlo0n/a0/yLvM7tWM/3pDmO4XZPUz/sKM+L3aaxAF4Cr4Ebmvg/30etecvzksGBL8B6oAdYJbuWlM2MGk1Nd0PaxuTfgK/AE2DY82ITM7phQxAqge3iXirlVpJtjs3CgM0LYItjc1C9xLXpz5OBM8Bl4Lp4YOw9B4ypLIbzwCVgAJjURdSnQLc6JfgMXBGpO4B9wH7dnLMIcWCT/scd2WrgmDNu17/XkW0AjqTWOgVcc8YW1NpQBvYAF4HNwBLp3qlENeea/ZAavxcB07Imp5MmNiZrlWxMxOxNAhgH2oBHwFu9gtYlQaqWxuaKxlMBm0mdiopSbmsuB5YpQOsh5mwFcEABVppFKHN+GzjqFWRuYFwaBfaW1UINNxvkHLVsy0pPWeSywWPPbG5hr+SdVoJDcmMvmh8NDMBeyrOn4JkuGSNMYwHDfwA/7pZY7fiBvAAAAABJRU5ErkJggg=="  draggable="false" style="width: 100%;height: 100%; border:none;"/>,
          attrs: {colSpan : text.length,style:"background-color:blue;"},
      };
        if (text.status=='1') {
          return obj1;
        }else if (text.status=='0') {
          return obj2;
        }
        return obj3;
      },
      thiscell(roomreverse,id,rowrecord) {
        return {
          props: {
             //属性
          },
          on: { // 事件
            mousedown: () => {
              if (roomreverse.status == '1'){
                this.check(roomreverse);
                return;
              }
              this.startCol = roomreverse.sort;
              this.containNum = rowrecord.containNum;
              this.startValue = this.selectdate + ' ' +timeBySort(roomreverse.sort * 0.5 + 8.5);
              this.selectroomname = rowrecord.roomName;
              this.orderRoomId = rowrecord.roomId;
              this.selectflag = "1";
              this.row = id;

              roomreverse.status = '2';
            },
            mouseenter: () => {
              if (this.selectflag == "1"){
                if (roomreverse.status == '0'&& id == this.row ) {
                  roomreverse.status = '2';
                }else if (roomreverse.status == '1'&& id == this.row) {
                  alert("该时间段已被预订！请重新选择！");
                  this.reload();
                  return;
                }
              }
            },  // 鼠标移入
            mouseup: () => {

              this.model.joinMemberFullName = null
              this.model.joinMemberUserName = null
              this.model.reserveUserName = this.loginUserId;
              this.model.reserveFullName = this.loginUserName;

              this.form.resetFields();
              this.visible = true;
              var realendtime = this.selectdate + ' ' +timeBySort(roomreverse.sort * 0.5 + 9);
              if (this.startValue > realendtime){
                [this.startValue,realendtime] = [realendtime,this.startValue];
              }
              this.endCol = roomreverse.sort;
              this.$nextTick(() => {
                setTimeout(()=>{
                this.form.setFieldsValue({
                  meetingRoom: this.selectroomname,
                  meetingStartTime: this.startValue,
                  meetingEndTime: realendtime,
                  reserveDate: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                })
              },0);

                // 初始化选人组件字段
                this.auditUsers1.value = []
                this.auditUsers2.value = []

                // 初始化选人控件
                this.initSelectMan(this,this.model);
              })
            },
          },
        }
      },

      check(record){
        const h = this.$createElement
        this.$info({
          title: '会议室预约信息',
          content: h('div',{}, [
            h('p', "会议主题： " + record.subject),
            h('p', "备注： " + (record.remarks==null?"无":record.remarks)),
            h('p', "联系人： " + record.contact),
            h('p', "联系电话： " + record.contactPhone),
            h('p', "会议室： " + record.meetingRoom),
            h('p', "申请时间： " + record.reserveDate),
            h('p', "申请人： " + record.reserveFullName),
            h('p', "参与人： " + record.joinMemberFullName),
          ]),
          onOk() {},
        });
      },

      subbook(e) {
        e.preventDefault();
        const that = this;
        // 触发表单验证
        that.form.validateFields((err, values) => {
          let strFormData = Object.assign(this.model, values);
          strFormData.contactId = that.loginUserId;

          // 选人控件传值
          this.uploadMan(strFormData,that);
          if (!err) {
            that.confirmLoading = true;
            that.axios.post('/meetingRoom/meetingRoomTimeStatus/add',{
              roomId:that.orderRoomId,
              meetingDate:that.meetingDate,
              startSort:that.startCol,
              endSort:that.endCol,
            })
              .then(function (response){
                if (response.code === 200){
                  that.$notification.success({
                    message: '您好',
                    description: response.message,
                  })
                  //  新增记录
                  that.axios.post('/meetingRoom/add',formData)
                    .then(function (response) {
                      that.confirmLoading2 = true
                      console.log(response);
                      if (response.code === 200){
                        fetch({meetingDate:param,meetingRoomName:this.queryParam.searchRoomName})
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                } else if (response.code === 10002){
                  that.$notification.warning({
                    message: '抱歉',
                    description: response.message,
                  })
                } else {
                  that.$notification.error({
                    message: '错误',
                    description: '服务器开小差了',
                  })
                }
              })
              .catch(function (error) {
                that.$notification.error({
                  message: '错误',
                  description: '请求出现错误',
                })
              })
            that.confirmLoading = false
            that.visible = false
            that.confirmLoading2 = true
          }
        })
      },

      onChange(date, dateString) {
        this.selectdate = dateString;
        this.queryParam.meetingDate = date;
      },

      searchQuery:function() {
        this.loading = true;
        this.fetch({meetingDate:this.selectdate,meetingRoomName:this.queryParam.searchRoomName});
        this.loading = false;
      },
      searchReset:function() {
        this.queryParam.meetingDate = moment(moment(), 'YYYY-MM-DD');
        this.queryParam.searchRoomName = '';
      },

      reload(){
        this.selectflag = '0';
        let param = getNowFormatDate();
        this.fetch({meetingDate:param,meetingRoomName:this.queryParam.searchRoomName});
      },

      disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().startOf('day');
        // return current && current < moment().endOf('day');
      },

      fetch(param) {
        // this.loading = true

        // var params = {meetingDate:param,meetingRoomName:this.queryParam.searchRoomName};
        // this.selectdate = param;
        // console.log(params,this.selectdate);
        getAction(this.url.list, param).then((res) => {
          if (res.success) {
            this.data = res.result;
            // this.loading = false;
          } else {
            this.$message.warning(res.message);
            // this.loading = false;
          }
        });
      }
    },

  }

</script>