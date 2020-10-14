<!--历史数据存储任务管理窗口 -->
<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;"
  >
    <div class="title">
      <div>
        <img :src="title | IconUrl" />
        {{ title }}
        <span>{{ nodeName ? '(' + nodeName + ')': '' }}</span>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <!-- 无流程样式div-->
    <div style="height:16px;"></div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="产品">
              <a-input
                placeholder="请输入产品名称"
                v-decorator="['productName', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看' || this.title == '编辑'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分组">
              <a-input
                placeholder="请输入分组名称"
                v-decorator="['groupName', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实时数据源">
              <a-input
                placeholder="请输入实时数据源名称"
                v-decorator="['realTimeDb', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实时数据表">
              <a-input
                placeholder="请输入实时数据表名"
                v-decorator="['realTimeTable', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="历史数据源">
              <a-input
                placeholder="请输入历史数据源名称"
                v-decorator="['historyDb', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="历史数据表">
              <a-input
                placeholder="请输入历史数据表名"
                v-decorator="['historyTable1', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="更新频率">
              <j-cron
                ref="innerVueCron"
                v-decorator="['updateFrequency', {'initialValue':'0/1 * * * * ?',rules: [{ required: true, message: '请输入cron表达式!' }]}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'|| this.title == '查看' "
                @change="setCorn"
              ></j-cron>
              <a target="_blank" href="http://cron.qqe2.com/">
                <a-icon type="share-alt" />在线cron表达式生成
              </a>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据保留时长">
              <a-input-number
                :min="6"
                :max="120"
                v-decorator="['longestSaveMonth', { initialValue: 6, rules: [{ required: true, message: '请输入保留月数' }]}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />月
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">
                {{ model.status == undefined ?
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
import JCron from '@/components/cmp/JCron.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import qs from 'qs'

export default {
  name: 'ProductHistoryModal',
  // 组件应用定义
  components: {
    JCron
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data () {
    return {
      title: '操作',
      nodeName: '',
      visible: false,
      nodeId: '',
      model: {},
      dataServiceUrl: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        productName: { rules: [{ required: true, message: '产品名称不能为空' }] },
        realTimeDb: { rules: [{ required: true, message: '实时数据源名称不能为空' }] },
        realTimeTable: { rules: [{ required: true, message: '实时数据表名不能为空' }] },
        historyDb: { rules: [{ required: true, message: '历史数据源名称不能为空' }] },
        historyTable1: { rules: [{ required: true, message: '历史数据表名不能为空' }] }
      },
      url: {
        add: this.dataServiceUrl + '/product/productHistory/add',
        edit: this.dataServiceUrl + '/product/productHistory/edit',
        // 上传组件地址
        fileUpload: window._CONFIG.domianURL + '/file/uploadFile/add',
        imgerver: window._CONFIG.domianURL + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById'
      },
      // 上传附件定义
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false,
      attachment: []
    }
  },
  filters: {
    IconUrl (val) {
      switch (val) {
        case '新增':
          return require('@/assets/img/login/add.png')
        case '编辑':
          return require('@assets/img/login/edit.png')
        case '查看':
          return require('@assets/img/login/view.png')
        case '审核':
          return require('@assets/img/login/audit.png')
        default:
          break
      }
    }
  },
  beforeCreate () {
    // 初始化数据服务URL
    // this.dataServiceUrl = Vue.ls.get('PROJECT_MESSAGE').dataServiceUrl
    this.dataServiceUrl = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE')).dataServiceUrl
  },
  // 钩子函数
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    // 初始化tokens
    this.initTokens()
  },
  // 计算属性
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
    disabledBtn () {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    }
  },
  // 方法
  methods: {
    loadData () {},
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields()
      if (record.nodeId != undefined) {
        this.nodeId = record.nodeId
      }
      if (record.nodeName != undefined) {
        this.nodeName = record.nodeName
      }
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'id',
            'deviceCount',
            'longestSaveMonth',
            'productId',
            'productName',
            'groupId',
            'groupName',
            'realTimeDb',
            'realTimeTable',
            'historyDb',
            'historyTable1',
            'updateFrequency',
            'status',
            'prjCode'
          )
        )
        // 时间格式化

        // 初始化新任务通知
        if (this.model.notifyMethod != undefined) {
          this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
        }
      })
      // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
      let that = this
      if (that.attachment.length != 0) {
        if (JSON.stringify(that.model) == '{}') {
          this.initUpload(that, 0)
        } else {
          for (let j in that.model) {
            if (j) {
              if (typeof j != Object) {
                if (j.indexOf('Attachment') != -1) {
                  for (let i = 0; i < that.attachment.length; i++) {
                    this.initUpload(that, i, that.model[j])
                  }
                }
              }
            }
          }
        }
      }
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.fileList = []
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let actionUrl = ''
          let method = 'post'
          // 判断操作类型，新增或者编辑
          if (!this.model.id) {
            actionUrl += this.url.add
          } else {
            actionUrl += this.url.edit
          }
          // 表单数据赋值给formData
          let formData = Object.assign(this.model, values)

          // 对formData中的时间字段进行 时间格式化

          if (that.attachment.length == 1) {
            formData[that.attachment[0].fieldName] = that.attachment[0].groupId
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              formData[that.attachment[i].fieldName] = that.attachment[i].groupId
            }
          }
          // 发起提交或保存请求
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.error('操作失败')
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleChange (info) {
      // 调用改变方法
      this.handleChange1(info, this, 0)
    },
    handlePicCancel () {
      this.previewVisible = false
    },
    handleCancel () {
      this.close()
    },
    initTokens () {
      if (this.attachment.length >= 1) {
        for (let i = 0; i < this.attachment.length; i++) {
          this.attachment[i].fileTokens = ''
        }
      }
    },
    setCorn (data) {
      this.$nextTick(() => {
        this.model.cronExpression = data
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>
