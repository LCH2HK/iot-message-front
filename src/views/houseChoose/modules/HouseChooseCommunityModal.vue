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

          <a-col :md="12" :sm="8" style="display: none">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="选房区域 外键ID">
              <a-input placeholder="请输入选房区域 外键ID"
                       v-decorator="['chooseAreaId', {initialValue: this.$route.query.areaId}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="楼盘名称">
              <a-input placeholder="请输入楼盘名称" v-decorator="['communityName', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="楼幢数量">
              <a-input placeholder="请输入楼幢数量" v-decorator="['buildingAmount', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="总期数">
              <a-input-number v-decorator="[ 'stage', validatorRules.stage ]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">{{ model.status == undefined ?
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
    name: 'HouseChooseCommunityModal',
    //组件应用定义
    components: {
      JDictSelectTag,
      JSelectUserNew
    },
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins: [CmpListMixin],
    // 数据定义
    data() {
      return {
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          stage: { rules: [{ required: true, message: '请输入总期数!' }] }
        },
        url: {
          add: '/houseChoose/houseChooseCommunity/add',
          edit: '/houseChoose/houseChooseCommunity/edit',
          //上传组件地址
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById'
        },
        //选人组件初始化
        auditUsername1: '',
        auditFullname1: '',
        auditUsername2: '',
        auditFullname2: '',
        selectUser: ['auditUsers1', 'auditUsers2'],
        auditUsers1: {
          colum: 'auditUsers1',
          value: [],
          target: [
            { to: 'auditUsername1', from: 'username' },
            { to: 'auditFullname1', from: 'realname' }
          ]
        },
        auditUsers2: {
          colum: 'auditUsers2',
          value: [],
          target: [
            { to: 'auditUsername2', from: 'username' },
            { to: 'auditFullname2', from: 'realname' }
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
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'chooseAreaId', 'communityName', 'buildingAmount', 'stage'))

          // 初始化选人组件字段
          this.auditUsers1.value = []
          this.auditUsers2.value = []
          // 初始化选人控件
          this.initSelectMan(this, record)

          //时间格式化

          // 初始化新任务通知
          if (this.model.notifyMethod != undefined) {
            this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
          }
        })

      },
      close() {
        this.$emit('close')
        this.visible = false
        this.fileList = []
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let actionUrl = ''
            let method = 'post'
            //判断操作类型，新增或者编辑
            if (!this.model.id) {
              actionUrl += this.url.add
            } else {
              actionUrl += this.url.edit
            }
            // 表单数据赋值给formData
            let formData = Object.assign(this.model, values)

            // 选人控件字段赋值给formData
            this.uploadMan(formData, this)

            //对formData中的时间字段进行 时间格式化

            //发起提交或保存请求
            httpAction(actionUrl, qs.stringify(formData), method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning('操作失败')
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })


          }
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