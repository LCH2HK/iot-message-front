<template>
  <a-modal
    :title="title"
    :footer="null"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="出行人员">
              <j-select-user-new v-decorator="['btUsername', validatorRules.btUsername]"
                                 :selectedDetails="user" @callback="setAuditUser"
                                 class="userSelect"
                                 :multiple="true"
                                 :disabled="alwaysDisabled"></j-select-user-new>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="出行地点">
              <a-input placeholder="请输入出行地点"
                       :disabled="starDisabled"
                       v-decorator="['destination',validatorRules.destination ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="项目名称">
              <a-input placeholder="请输入项目名称"
                       :disabled="endDisabled"
                       v-decorator="['prjName', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="通知人员">
              <j-select-user-new v-decorator="['informUsername',validatorRules.informUsername]"
                                 :selectedDetails="informUsers" @callback="setAuditUser"
                                 class="userSelect"
                                 :multiple="true"
                                 :disabled="endDisabled"></j-select-user-new>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="16" :sm="16">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="开始日期">
              <a-date-picker
                :disabled="starDisabled"
                :disabledDate="disabledDate"
                format='YYYY-MM-DD'
                v-decorator="[ 'startTime', validatorRules.startTime]"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item
              :labelCol="labelCol3"
              :wrapperCol="wrapperCol3"
            >
              <a-select
                placeholder=""
                :disabled="starDisabled"
                v-decorator="['startFlag',{}]"
              >
                <a-select-option value="0">上午</a-select-option>
                <a-select-option value="1">下午</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="16" :sm="8">
            <a-form-item
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol2"
              label="结束日期">
              <a-date-picker
                format='YYYY-MM-DD'
                :disabled="endDisabled"
                :disabledDate="disabledDate"
                v-decorator="[ 'endTime', validatorRules.endTime ]"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item
              :labelCol="labelCol3"
              :wrapperCol="wrapperCol3"

            >
              <a-select
                placeholder=""
                v-decorator="['endFlag',{}]"
                :disabled="endDisabled "
              >
                <a-select-option value="0">上午</a-select-option>
                <a-select-option value="1">下午</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :md="24" :sm="12">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              label="出行事由">
              <a-textarea placeholder="请输入出行事由"
                          :disabled="endDisabled"
                          v-decorator="['content',  validatorRules.content]"
                          :autosize="{minRows: 3, maxRows: 6}"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="填写人">
              <a-input
                disabled
                v-decorator="['inputRealname', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="填写时间">
              <a-input placeholder=""
                       disabled
                       v-decorator="['inputTime', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm" v-if="buttonDisplay">{{ model.status == undefined ?
                '提交' : '保存' }}
              </a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
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
  import moment from 'moment'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import qs from 'qs'

  export default {
    name: 'BusinessTripModal',
    //组件应用定义
    components: {
      JDictSelectTag,
      JSelectUserNew
    },
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins: [CmpListMixin],
    // 数据定义
    // props: {
      // starDisabled: false,
      // endDisabled: false,
      // buttonDisplay: true,
    // },
    data() {
      return {
        editType: 0, // 0为编辑，1为新增
        oldStartValue: '',//数据库里面的开始时间
        oldEndValue: '',
        alwaysDisabled:false,
        starDisabled: false,//判断修改的时候开始时间和上下午是否为不可输入状态
        endDisabled:false,
        buttonDisplay: true,
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 2 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 22 }
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        labelCol3: {
          xs: { span: 24 },
          sm: { span: 0 }
        },
        wrapperCol3: {
          xs: { span: 24 },
          sm: { span: 24 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        //校验
        validatorRules: {
          //手机号校验
          // phoneNum: { rules: [{ validator: this.validatePhone }, { required: true, message: '请输入手机号码' }] }
          btUsername: { rules: [{ required: true, message: '出行人员不能为空，请选择出行人' }] },
          destination: { rules: [{ required: true, message: '出行地点不能为空，请填写出行地点' }] },
          informUsername:{rules:[{required:true,message:'通知人员不能为空，请选择通知人员'}]},
          startTime: { rules: [{ required: true, message: '开始日期不能为空，请填写开始日期' }] },
          endTime: { rules: [{ required: true, message: '结束日期不能为空，请填写结束日期' }] },
          content: { rules: [{ required: true, message: '出行事由不能为空，请填写出行事由' }] }
        },
        url: {
          add: '/businessTrip/businessTrip/add',
          edit: '/businessTrip/businessTrip/edit',
          checkDate: '/businessTrip/businessTrip/checkDate',
          //上传组件地址
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById'
        },
        //选人组件初始化
        //用户名和姓名，默认为当前登录人
        btUsername: '',
        btRealname: '',
        //通知人员用户名和姓名
        informUsername: '',
        informRealname: '',
        selectUser: ['informUsers', 'user'],

        user: {
          colum: 'user',
          value: [],
          target: [
            { to: 'btUsername', from: 'username' },
            { to: 'btRealname', from: 'realname' }
          ]
        },
        informUsers: {
          colum: 'informUsers',
          value: [],
          target: [
            { to: 'informUsername', from: 'username' },
            { to: 'informRealname', from: 'realname' }
          ]
        },
        // 上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
        // attachment: [],
        attachment: [
          {
            groupId: '',
            fileTokens: '',
            fieldName: 'attachment',
            tableName: 'oa_leave_application'
          }
        ]

      }
    },
    // 钩子函数
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      this.attachment[0].fileTokens = ''
    },
    // 计算属性
    computed: {
      uploadAction: function() {
        return this.url.fileUpload
      }
    },
    //方法
    methods: {
      loadData() {
      },
      //手机号格式校验
      // validatePhone(rule, value, callback) {
      //   if (!value || new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
      //     callback()
      //   } else {
      //     callback('请输入正确格式的手机号码!')
      //   }
      // },
      add() {
        this.editType = 1
        this.buttonDisplay=true
        this.alwaysDisabled = false
        this.edit({})
      },
      //限制日历选择框不可选择过去的时间
      disabledDate(current) {
        return current && current < moment().startOf('day')
      },

      edit(record,aciton) {
        if (!aciton) {
          //开始时间，上午为上午8:30，下午为下午13:30
          var startTime = (new Date(record.startTime)).getTime()
          //结束时间，上午为12点，下午为17点
          var endTime = (new Date(record.endTime)).getTime()
          //当前时间时间戳
          var nowTime = new Date().getTime()
          if (record.startTime != undefined) {
            this.alwaysDisabled = true
          }
          //判断编辑状态当前时间大于开始时间，开始时间和目的地为disabled状态
          if (record.startTime != undefined && nowTime > startTime) {
            this.starDisabled = true
          } else {
            this.starDisabled = false
          }
          if (record.endTime != undefined && nowTime > endTime) {
            this.endDisabled = true
          } else {
            this.endDisabled = false
          }
          this.buttonDisplay=true

        }else{
          this.alwaysDisabled = true
          this.starDisabled = true
          this.endDisabled = true
          this.buttonDisplay=false
        }

        //添加时回填当前登录人为出行人姓名,填写人为当前登录人，创建时间为当前时间,通知人默认为涛哥
        if (record.btUsername == undefined) {
          this.$nextTick(() => {
            record.btUsername = this.$store.getters.userInfo.username
            record.btRealname = this.$store.getters.userInfo.realname
            record.inputRealname = this.$store.getters.userInfo.realname
            record.informUsername="zhang_ct"
            record.informRealname="张成涛"
            record.inputTime = moment().format('YYYY-MM-DD')
            this.model = Object.assign({}, record)
            this.initSelectMan(this, this.model)
          })
        }
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,
            'btUsername',
            'destination',
            'prjName',
            'content',
            'startFlag',
            'endFlag',
            'startTime',
            'endTime',
            'inputTime',
            'inputRealname',
            'informUsername'
          ))

          // 初始化选人组件字段
          this.informUsers.value = []
          this.user.value = []
          // 初始化选人控件
          this.initSelectMan(this, record)

          //时间格式化
          this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
          this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
          //初始化,把数据库里面的开始时间和结束时间赋值给oldStartValue和oldEndValue
          this.oldStartValue = new Date(this.model.startTime).getTime()
          this.oldEndValue = new Date(this.model.endTime).getTime()
          //初始化开始时间的上下午，如果为新增的开始时间，默认上午，结束时间默认为下午
          if (this.editType == 1) {
            this.form.setFieldsValue({ startFlag: '0' })
            this.form.setFieldsValue({ endFlag: '1' })
          }
        })


      },
      close() {
        this.$emit('close')
        this.visible = false
        this.fileList = []
        this.editType = 0 // 初始化editType
      },
      handleOk() {
        const that = this
        // 触发表单验证
        that.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true

            // 表单数据赋值给formData
            let formData = Object.assign(that.model, values)

            // 选人控件字段赋值给formData
            that.uploadMan(formData, that)

            //对formData中的时间字段进行 时间格式化
            //拿到表单里面开始时间，拿到的monent对象，先转换为字符串格式，然后上午拼接12:00:00，下午拼接17:00:00，再转换为时间戳
            formData.startTime = formData.startTime ? that.form.getFieldValue('startTime').format('YYYY-MM-DD') + ' ' + (that.form.getFieldValue('startFlag') == '0' ? '12:00:00' : '17:00:00') : null
            //拿到表单里面结束时间，拿到的monent对象，先转换为字符串格式，然后上午拼接12:00:00，下午拼接17:00:00，再转换为时间戳
            formData.endTime = formData.endTime ? that.form.getFieldValue('endTime').format('YYYY-MM-DD') + ' ' + (that.form.getFieldValue('endFlag') == '0' ? '12:00:00' : '17:00:00') : null
            //前端校验可以加在上面
            that.handleActive(formData)
          }
        })

      },
      handleActive(formData) {
        const that = this
        let actionUrl = ''
        let method = 'post'
        //判断操作类型，新增或者编辑
        if (!this.model.id) {
          actionUrl += this.url.add
        } else {

          actionUrl += this.url.edit
        }
        //发起提交或保存请求
        httpAction(actionUrl, qs.stringify(formData), method).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.$emit('ok')
            that.close()
          } else {
            that.$message.warning(res.message)
          }
        }).finally(() => {
          that.confirmLoading = false
          this.$emit('reset')


        })
      },
      handleChange(info) {
        //调用改变方法
        this.handleChange1(info, this, 0)
      },
      handlePicCancel() {
        this.previewVisible = false
      },
      handleCancel() {
        this.close()
      }


    }
  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
</style>
