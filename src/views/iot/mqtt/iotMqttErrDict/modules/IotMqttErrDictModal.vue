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
            <a-form-item
              class="form-item"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="异常代码"
            >
              <a-input
                placeholder="请输入异常代码"
                v-decorator="['errNo', validatorRules.errNo]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              class="form-item"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="异常信息"
            >
              <a-input
                placeholder="请输入异常信息"
                v-decorator="['errMsg', validatorRules.errMsg]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="录入人"
            >
              <a-input
                placeholder
                v-decorator="['inputerFullname', validatorRules.inputerFullname ]"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="录入时间"
            >
              <a-input
                placeholder
                v-decorator="['inputTime', {initialValue: moment().format('YYYY-MM-DD HH:mm:ss')}]"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm" v-if="is_editing" >确定</a-button>
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
import qs from 'qs'
import { normalValidate } from '../../../js/iot_validate'

export default {
  name: 'IotMqttErrDictModal',
  // 数据定义
  data() {
    return {
      title: '操作',
      nodeName: '',
      visible: false,
      nodeId: '',
      model: {},
      is_editing: true,
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
        errNo: {
          rules: [{ required: true, validator: this.validatorErrNo }]
        },
        errMsg: {
          rules: [{ required: true, validator: this.validatorErrMsg }]
        },
        inputerFullname: {
          initialValue: this.$store.getters.nickname
        }
      },
      url: {
        add: '/iotMqttErrDict/iotMqttErrDict/add',
        edit: '/iotMqttErrDict/iotMqttErrDict/edit',
        duplicateCheck: '/iotMqttErrDict/iotMqttErrDict/duplicateCheck'
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
    add() {
      this.edit({})
    },
    edit(record, forSee) {
      console.log('IotMQttErrDictModal:edit() is called!')
      console.log('IotMQttErrDictModal:forSee=>', forSee)
      this.form.resetFields()
      if (record.nodeId != undefined) {
        this.nodeId = record.nodeId
      }
      if (record.nodeName != undefined) {
        this.nodeName = record.nodeName
      }
      if (forSee != undefined) {
        this.is_editing = false
      } else {
        this.is_editing = true
      }
      this.model = Object.assign({}, record)
      this.model.inputTime = moment(this.model.inputTime).format('YYYY-MM-DD HH:mm:ss')
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'errNo', 'errMsg', 'inputTime', 'inputerFullname'))
        console.log('this.model:', this.model)
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
        console.log('err=>', err)
        console.log('values=>', values)
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
          formData.inputTime = formData.inputTime ? formData.inputTime : null

          if (that.attachment.length == 1) {
            formData[that.attachment[0].fieldName] = that.attachment[0].groupId
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              formData[that.attachment[i].fieldName] = that.attachment[i].groupId
            }
          }
          console.log('IotMqttErrDictModal:actionUrl=>', actionUrl)
          console.log('IotMqttErrDictModal:formData=>', formData)
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
    },

    //异常代码校验
    validatorErrNo(rule, val, callback) {
      let label = '异常代码'
      let length = [1, 32]
      let value = val ? val : ''
      if (value.length === 0) {
        callback('请输入' + label + '！')
      } else if (/[\s*]/g.test(value)) {
        callback('不可添加空格!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不可输入汉字!')
      } else if (
        /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g.test(value)
      ) {
        callback('不可输入特殊字符!')
      } else if (val.length < length[0]) {
        callback('最少输入' + length[0] + '个字')
      } else if (val.length > length[1]) {
        callback('最多输入' + length[1] + '个字')
      } else {
        let params = {
          id: this.model.id,
          errNo: val.trim()
        }
        console.log('id:', this.model.id)
        let method = 'post'
        console.log(params)
        httpAction(this.url.duplicateCheck, params, method).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      }
    },
    validatorErrMsg(rule, value, callback) {
      let label = '异常信息'
      let length = [1, 32]
      normalValidate(label, length, rule, value, callback)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
.form-item {
  height: 45px;
}
</style>