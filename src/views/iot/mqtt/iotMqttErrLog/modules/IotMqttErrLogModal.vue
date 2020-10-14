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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备编号">
              <a-input
                placeholder="请输入设备编号"
                v-decorator="['deviceKey', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="异常信息">
              <a-input
                placeholder
                v-decorator="['errMsg', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="录入人">
              <a-input
                placeholder
                v-decorator="['createBy', {initialValue: this.$store.getters.nickname}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="录入时间">
              <a-input
                v-decorator="[ 'createTime', {initialValue: moment().format('YYYY-MM-DD HH:mm:ss')}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <!--              <a-button @click="handleOk" type="primary" icon="check" class="confirm" >{{ model.status == undefined ?-->
              <!--                '提交' : '保存' }}-->
              <!--              </a-button>-->
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
import { filterDictText } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'IotMqttErrLogModal',
  //组件应用定义
  components: {
    JDictSelectTag,
    JSelectUserNew
  },
  props: ['errNoDictOptions'],
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data() {
    return {
      title: '操作',
      nodeName: '',
      visible: false,
      nodeId: '',
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
      url: {
        add: '/iotMqttErrLog/iotMqttErrLog/add',
        edit: '/iotMqttErrLog/iotMqttErrLog/edit'
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
    IconUrl(val) {
      switch (val) {
        case '新增':
          return require(`@/assets/img/login/add.png`)
        case '编辑':
          return require(`@assets/img/login/edit.png`)
        case '查看':
          return require(`@assets/img/login/view.png`)
        case '审核':
          return require(`@assets/img/login/audit.png`)
        default:
          break
      }
    }
  },
  // 钩子函数
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    // 初始化tokens
    this.initTokens()
  },
  // 计算属性
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    },
    disabledBtn() {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    }
  },
  //方法
  methods: {
    moment,
    loadData() {},
    add() {
      this.edit({})
    },
    edit(record) {
      console.log('edit:record=>', record)
      console.log('edit:errNoDictOptions=>', this.errNoDictOptions)
      this.form.resetFields()
      if (record.nodeId != undefined) {
        this.nodeId = record.nodeId
      }
      if (record.nodeName != undefined) {
        this.nodeName = record.nodeName
      }

      let errNo = record.errNo
      let errMsg = filterDictText(this.errNoDictOptions, errNo)
      record['errMsg'] = errMsg

      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'deviceKey', 'errMsg', 'createBy', 'createTime'))

        //时间格式化
        this.form.setFieldsValue({ inputTime: this.model.inputTime ? moment(this.model.inputTime) : null })

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

          //对formData中的时间字段进行 时间格式化
          formData.inputTime = formData.inputTime ? formData.inputTime.format('YYYY-MM-DD HH:mm:ss') : null

          if (that.attachment.length == 1) {
            formData[that.attachment[0].fieldName] = that.attachment[0].groupId
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              formData[that.attachment[i].fieldName] = that.attachment[i].groupId
            }
          }
          //发起提交或保存请求
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning('操作失败')
              }
            })
            .finally(() => {
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
    },
    initTokens() {
      if (this.attachment.length >= 1) {
        for (let i = 0; i < this.attachment.length; i++) {
          this.attachment[i].fileTokens = ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>