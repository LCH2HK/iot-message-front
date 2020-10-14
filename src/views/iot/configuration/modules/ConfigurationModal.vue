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
    style="top:5%;">
    <div class="title">
      <div>
        <img :src="title | IconUrl"/>
        {{title}}
        <span>{{ nodeName ? '(' + nodeName + ')': ''}}</span>
        <a-tooltip placement="rightTop" :title="hint">
          <a-icon type="question-circle"/>
        </a-tooltip>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel"/>
    </div>
    <!-- 无流程样式div-->
    <div style="height:16px;"></div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="参数名称">
              <a-input placeholder="请输入参数名称" v-decorator="['name', validatorRules.name]"
                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="参数编码">
              <a-input placeholder="请输入参数编码" v-decorator="['code', validatorRules.code]"
                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="参数值">
              <a-input placeholder="请输入参数值" v-decorator="['value', validatorRules.value]"
                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="说明">
              <a-input placeholder="请输入说明" v-decorator="['description', validatorRules.description]"
                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
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
  import { normalValidate } from '../../js/iot_validate'

  export default {
    name: 'ConfigurationModal',
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
        validatorRules: {
          name:{ rules: [{ required: true, message: ' ' }, { validator: this.validateName }] },
          code:{ rules: [{ required: true, message: ' ' }, { validator: this.validateCode }] },
          value:{ rules: [{ required: true, message: '请填写参数值' }, ] },
          description:{ rules: [{ required: false, message: ' ' }, ] },
        },
        url: {
          add: '/configuration/configuration/add',
          edit: '/configuration/configuration/edit',
          duplicateCheck: '/configuration/configuration/duplicateCheck',
        }
      }
    },
    filters: {
      IconUrl(val) {
        switch (val) {
          case '新增':
            return require(`@/assets/img/login/add.png`)
            break
          case '编辑':
            return require(`@assets/img/login/edit.png`)
            break
          case '查看':
            return require(`@assets/img/login/view.png`)
            break
          case '审核':
            return require(`@assets/img/login/audit.png`)
            break
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
        return this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看' ? this.blank : this.handleChange
      },
      hint() {
        let hintMsg = ''
        switch (this.title) {
          case '新增':
            hintMsg = '新增一个系统选项，最好添加说明'
            break
          case '编辑':
            hintMsg = '编辑系统选项的基本属性'
            break
          case '查看':
            hintMsg = '查看系统选项的基本属性'
            break
          default:
            hintMsg = '系统选项的基本属性'
        }
        return hintMsg
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
        if (record.nodeId != undefined) {
          this.nodeId = record.nodeId
        }
        if (record.nodeName != undefined) {
          this.nodeName = record.nodeName
        }
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'code', 'description', 'inputerFullname', 'inputerName', 'name', 'value'))

          //时间格式化
          this.form.setFieldsValue({ inputTime: this.model.inputTime ? moment(this.model.inputTime) : null })
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
      },
      initTokens() {
        if (this.attachment.length >= 1) {
          for (let i = 0; i < this.attachment.length; i++) {
            this.attachment[i].fileTokens = ''
          }
        }
      },
      //数据源标识符校验
      validateCode(rule, value, callback) {
        let label = '参数编码'
        let length = [1, 32]
        let val = value ? value : ''
        if (val.length === 0) {
          callback('请填写' + label + '！')
        } else if (/[\s+]/g.test(value)) {
          callback('不可添加空格!')
        } else if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback('不可输入汉字!')
        } else if (val.length < length[0]) {
          callback('最少输入' + length[0] + '个字')
        } else if (val.length > length[1]) {
          callback('最多输入' + length[1] + '个字')
        } else {
          let params = {
            id: this.model.id,
            code: val.trim()
          }
          let method = 'post'
          httpAction(this.url.duplicateCheck, params, method).then(res => {
            if (res.success) {
              callback()
            } else {
              callback(res.message)
            }
          })
        }
      },
      //数据源名称校验
      validateName(rule, value, callback) {
        let label = '参数名称'
        let length = [1, 32]
        normalValidate(label, length, rule, value, callback)
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
</style>