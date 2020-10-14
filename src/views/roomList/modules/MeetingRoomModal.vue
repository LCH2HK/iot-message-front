<template>
  <a-modal
    :footer="null"
    :title="null"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :closable="false"
    cancelText="关闭"
    v-dialogDrag
    :maskClosable="false"
    style="top:5%;">
    <div class="title">
      <div>
        {{title}}
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="margin-top: 25px">
        <a-row>
          <!--会议主题-->
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="会议主题">
              <a-input
                :disabled="disabedVal"
                placeholder="请输入会议主题" v-decorator="['subject', validatorRules.subject]" />
            </a-form-item>
          </a-col>
          <!--参与人数-->
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="参与人数">
              <a-input
                :disabled="disabedVal"
                style="width: 50%"
                placeholder="请输入参与人数"
                v-decorator="[ 'memberNumber', validatorRules.memberNumber]"
              />
              最大容纳人数：{{this.containNum}}
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="联系人/主持人">
              <j-select-user-new
                v-decorator="['reserveUserName', validatorRules.reserveUserName]"
                :selectedDetails="auditUsers1"
                @callback="setAuditUser"
                class="userSelect"
              v-if="this.action !== 2"></j-select-user-new>
              <a-input
                v-if="this.action === 2 "
                :disabled="disabledValue"
                v-model="this.reserveFullName"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="联系电话">
              <a-input
                v-decorator="['contactPhone', validatorRules.contactPhone]"
                :disabled="disabedVal"/>
              <!--<a-input-->
                <!--v-decorator="['contactPhone', validatorRules.contactPhone]"-->
                <!--:disabled="disabedVal"-->
                <!--v-model="contactPhone"/>-->
            </a-form-item>
          </a-col>
          <!--会议室名称-->
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="会议室名称">
              <a-select
                :disabled="disabedVal"
                v-decorator="['meetingRoom', {}]">
                <a-select-option v-for="(item,index) in meetingRoomList" :key="item.roomName" @click="selectMeetingRoomName(item,index)" >{{item.roomName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--会议级别-->
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="会议类型">
              <j-dict-select-tag
                :disabled="disabedVal"
                v-decorator="['meetingLevel', {}]"
                :triggerChange="true"
                placeholder="请选择会议类型"
                dictCode="meeting_level"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="会议日期">
              <j-date
                v-if="this.action !== 2"
                placeholder="请选择会议日期" :triggerChange="true" v-decorator="['meetingDate', validatorRules.meetingDate]" dateFormat="YYYY-MM-DD"/>
              <a-input
                v-if="this.action === 2"
                :disabled="disabledValue"
                v-model="this.meetingDate"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="会议时间">
              <a-select style="width: 120px"
                        v-decorator="['meetingStartTime', {}]"
                        :disabled="disabedVal">
                <a-select-option v-for="(time1,index) in timeNode" :key="time1" @click="selectChat1(time1,index)" >{{time1}}</a-select-option>
              </a-select>
              <span style="width: 20px;"> ~ </span>
              <a-select style="width: 120px"
                        :disabled="disabedVal"
                        v-decorator="['meetingEndTime',{}]" >
                <a-select-option v-for="(time2,index) in timeNode_copy" :key="time2" @click="selectChat2(time2,index)">{{time2}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!--院内主要参与者-->
        <a-row>
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
              label="参会人员">
              <j-select-user-new
                multiple
                v-if="this.action !== 2"
                v-decorator="['joinMemberUserName', validatorRules.joinMemberUserName]"
                :selectedDetails="auditUsers2"
                @callback="setAuditUser"
                class="userSelect"></j-select-user-new>
              <a-input
                v-if="this.action === 2"
                :disabled="disabledValue"
                v-model="this.joinMemberFullName"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="预订人">
              <a-input
                :disabled="disabledValue"
                v-decorator="['contact',{}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="预定时间">
              <a-input
                :disabled="disabledValue"
                v-decorator="['reserveDate',{}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item class="btnClass">
              <a-button
                @click="handleOk"
                icon="check"
                type="primary"
                style="margin-right:10px"
                class="confirm"
                v-if="this.action !== 2"
              >提交</a-button>
              <a-button
                @click="handleCancel"
                icon="close"
                style="margin-right:10px"
                class="cancel"
                v-if="this.action !== 2"
              >关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JDate from '@/components/cmp/JDate'
  import qs from 'qs'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import { CmpListMixin } from '@/mixins/CmpListMixin'

  const timeList = [
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];
  export default {
    name: "MeetingRoomModal",
    components: {
      JSelectUserNew,
      JDictSelectTag,
      JDate,
    },
    mixins: [CmpListMixin],
    created() {
      const that = this
      that.timeNode = timeList.slice(0,27)
      that.timeNode_copy = timeList.slice(1,28)
      that.axios.get('/meetingRoom/meetingRoomList/allList')
        .then(function(response) {
          that.meetingRoomList = response
          console.log(that.meetingRoomList)
        })
    },
    data () {
      return {
        title:'',
        //action决定表单类型，可读与可操作
        action:'',
        disabedVal:'',
        meetingDate:'',
        contactPhone:'',
        disabledValue:true,
        meetingRoomList:'',
        meetingRoomId:'',
        startTime:'',
        endTime:'',
        startCol:'',
        endCol:'',
        visible: false,
        model: {},
        repeat: 0,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        timeList,
        timeNode:[],
        timeNode_copy:[],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          subject:{rules: [{ required: true, message: '请输入会议主题!' }]},
          contactPhone:{rules: [{validator: this.validatePhone},{ required: true, message: '请输入手机号码' }]},
          // contactPhone:{rules: [{validator: this.validatePhone},{ required: true, message: '请输入手机号码' }],initialValue:this.contactPhone},
          meetingDate:{rules: [{ required: true, message: '请输入会议日期!' }]},
          memberNumber:{ rules: [{validator: this.memberNumbercheck}]},
          reserveUserName: {rules: [{ required: true, message: '请选择联系人!' }]},
          joinMemberUserName: {rules: [{ required: true, message: '请选择参会人!' }]},
          meetingStartTime: {rules: [{ validator: this.startTimecheck}]},
        },
        url: {
          list: "/meetingRoom/meetingRoomList/allList",
          edit: "/meetingRoom/edit",
        },
        columns: [],
        // 最大容纳数
        containNum:'',
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
          target: [
            { to: 'joinMemberUserName', from: 'username' },
            { to: 'joinMemberFullName', from: 'realname' }
          ]
        },
      }
    },
    methods: {
      moment,
      edit (record) {
        console.log(record,'record打印出来了好好检查下吧')
        this.action = record.action
        if (record.action === 1){
          this.disabedVal = false
          this.title = '会议室预约'
        } else if (record.action === 2){
          this.disabedVal = true
          this.title = '查看预约'
        } else if (record.action == null || record.action === undefined || record.action === 3) {
          this.disabedVal = false
          this.title = '修改预约'
        }
        const that = this
        that.axios.get('/meetingRoom/meetingRoomList/findById?roomId=' + record.meetingRoomId)
          .then(function (response){
            that.containNum = response.containNum
          })
        // 初始化选人组件字段
        that.form.resetFields();
        that.model = Object.assign({}, record);
        that.visible = true;
        that.meetingRoomId = record.meetingRoomId;
        that.startCol = record.startCol;
        that.endCol = record.endCol;
        that.contactPhone = record.contactPhone;
        that.meetingDate = record.meetingDate
        that.reserveFullName = record.reserveFullName
        that.joinMemberFullName = record.joinMemberFullName

        that.$nextTick(() => {
          setTimeout(()=>{
            that.form.setFieldsValue(
              pick(that.model,
                'contact',
                'contactPhone',
                // 'joinMemberFullName',
                'joinMemberUserName',
                'meetingDate',
                'meetingLevel',
                'meetingRoom',
                'meetingStartTime',
                'meetingEndTime',
                'memberNumber',
                // 'reserveFullName',
                'reserveUserName',
                'subject',
                'reserveDate',
                // 'action',
                // 'contactId',
                // 'startCol',
                // 'endCol',
                // 'meetingRoomId',
              )
            )
          },0)
          // 初始化选人组件字段
          that.auditUsers1.value = []
          that.auditUsers2.value = []
          // 初始化选人控件
          that.initSelectMan(that,record);
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
          // 触发表单验证
          this.form.validateFields((err, values) => {
            if (!err) {
              // 判断开始时间是否小于结束时间，如果不是，提示用户重新输入
              if (this.startCol > this.endCol) {
                that.$message.warning("开始时间不能大于结束时间，请重新选择");
                e.preventDefault();
              }
              that.confirmLoading = true;
              let httpurl = '';
              let method = 'post';
              if (!this.model.id) {
                httpurl += this.url.edit;
              } else {
                httpurl += this.url.edit;
              }
              values.startCol = this.startCol;
              values.endCol = this.endCol;
              values.meetingRoomId = this.meetingRoomId;
              let formData = Object.assign(this.model, values);
              formData.contactPhone = that.contactPhone;
              // 选人控件传值
              that.uploadMan(formData, that);
              console.log(formData,'表单值')
              //新增操作
              if (that.action === 1){
                that.axios.post('/meetingRoom/meetingRoomTimeStatus/add', {
                  roomId: formData.meetingRoomId,
                  meetingDate: formData.meetingDate,
                  startSort: formData.startCol,
                  endSort: formData.endCol,
                })
                  .then(function(response) {
                    if (response.code === 200) {
                      that.$notification.success({
                        message: '您好',
                        description: response.message,
                      })
                      //  新增记录
                      that.axios.post('/meetingRoom/add', formData)
                        .then(function(response){
                          console.log(response);
                          if (response.code === 200) {
                            //刷新父页面
                            that.$emit('searchQuery')
                          }
                        })
                        .catch(function(error) {
                          console.log(error);
                        });
                    } else if (response.code === 10002) {
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
                  .catch(function(error) {
                    that.$notification.error({
                      message: '错误',
                      description: '请求出现错误',
                    })
                  })
                that.confirmLoading = false
                that.close();
              }else if (that.action ===3 || that.action === undefined) {
                //修改功能
                that.axios.post('/meetingRoom/meetingRoomTimeStatus/edit', formData)
                  .then(function(response) {
                    if (response.code === 200) {
                      console.log(response)
                      httpAction(httpurl, qs.stringify(formData), method).then((res) => {
                        if (res.success) {
                          that.$message.success(res.message);
                          //刷新父页面
                          that.$emit('ok');
                          that.$emit('searchQuery')
                        } else {
                          that.$message.warning(res.message);
                        }
                      })
                    } else {
                      that.$message.warning(response.message);
                      that.confirmLoading = false
                    }
                  })
                  .finally(() => {
                    that.confirmLoading = false;
                    that.close();
                  })
              }else {
                that.$message.error("服务出错")
              }
            }
          })
      },
      handleCancel () {
        this.close()
      },
      selectChat1(time1,index){
        this.startTime = time1;
        this.startCol = index;
        //如果第一次点击起始时间选择框，切割结束时间，使其永远在开始时间点的后面
        if (this.repeat === 0) {
          this.timeNode_copy.splice(0, index);
          this.repeat = 1;
        } else {
          //重复点击起始时间选择框，还原timeNode_copy数组，重新截取
          this.timeNode_copy = [];
          this.timeNode_copy = this.timeNode_copy.concat(this.timeList);
          this.timeNode_copy.splice(0, index);
        }

        console.log(this.startCol,"开始的序号")
      },
      selectChat2(time2,index){
        this.endTime = time2
        //如果没有点击起始时间，直接选择结束时间
        if (this.repeat === 0 ){
          this.endCol = index
          this.timeNode_copy = timeList.slice(1,28);
        } else {
          this.endCol = index + this.startCol
          this.timeNode_copy = timeList.slice(1,28)
        }
        this.repeat = 0;
        console.log(this.endCol,"结束的序号");
        // if (this.startCol <= this.endCol){
        //   this.startTimecheck(callback)
        // }
      },
      selectMeetingRoomName(item){
        this.meetingRoom = item.roomName
        this.meetingRoomId = item.id
      },
      memberNumbercheck(rule, value, callback){
        const r = /^\+?[1-9][0-9]*$/;
        if (r.test(value) && value <= this.containNum){
          callback();
        } else if (r.test(value) && value > this.containNum){
          callback("人数超过了会议室最大容纳人数");
        } else if (value === undefined || value === '' || value == null) {
          callback();
        } else {
          callback("请输入数字!");
        }
      },
      validatePhone(rule, value, callback){
        if(!value || new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
          callback();
        }else{
          callback("请输入正确格式的手机号码!");
        }
      },
      // startTimecheck(rule, value, callback){
      //   console.log('起止时间的校验')
      //   if (this.startCol > this.endCol){
      //     callback("开始时间不能大于结束时间");
      //   } else {
      //     callback();
      //   }
      // },
    },
    watch :{
      //监听联系人字段
      reserveUserName: function () {
        const that = this
        //删除了联系人 同时删除联系手机
        if (that.reserveUserName === undefined || that.reserveUserName === '') {
          that.contactPhone = undefined;
          //异步动态清楚手机号
          that.$nextTick(() => {
            setTimeout(()=>{
              that.form.setFieldsValue(
                {contactPhone: that.contactPhone}
              )
            },0)
          });
        }else {
          that.axios.get('/meetingRoom/getInfo?userName=' + that.reserveUserName)
            .then(function(response) {
              console.log(response)
              that.contactPhone = response.result.phone
              //异步动态替换手机号
              that.$nextTick(() => {
                setTimeout(()=>{
                  that.form.setFieldsValue(
                    {contactPhone: that.contactPhone}
                  )
                },0)
              });
            })
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>