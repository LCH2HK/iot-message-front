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
        <a-tooltip placement="rightTop" :title="hint">
          <a-icon type="question-circle" />
        </a-tooltip>
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
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="动作编码">
              <a-input
                placeholder="请输入命令编码"
                v-decorator="['cmdType', this.validatorRules.cmdType]"
                @change="createCmdTemplate"
                :disabled="false"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="动作名称">
              <a-input
                placeholder="请输入命令名称"
                v-decorator="['cmdName', this.validatorRules.cmdName]"
                :disabled="false"/>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row>
          <a-form-item
            :labelCol="labelCol1"
            :wrapperCol="wrapperCol1"
            label="命令参数">
            <j-editable-table
              :ref="refKeys[0]"
              :loading="paramTable.loading"
              :columns="paramTable.columns"
              :dataSource="paramTable.dataSource"
              :maxHeight="300"
              :rowNumber="true"
              :readOnly="isReadOnly"
              :rowSelection="!isReadOnly"
              :actionButton="!isReadOnly"
              @valueChange="createCmdTemplate"
            ></j-editable-table>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item
            :labelCol="labelCol1"
            :wrapperCol="wrapperCol1"
            label="命令模板">
            <pre>{{ cmdTemplate }}</pre>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm" v-if="!isReadOnly">确定</a-button>
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
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { codeValidate, normalValidate } from '@/views/iot/js/iot_validate'
import JEditableTable from '@/components/cmp/JEditableTable'
import qs from 'qs'
import {
  FormTypes,
  getRefPromise,
  validateFormAndTables
} from '@/utils/JEditableTableUtil'

export default {
  name: 'MqttActionModal',
  // 组件应用定义
  components: {
    JEditableTable
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  props: {
    productId: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  // 数据定义
  data () {
    return {
      title: '操作',
      nodeName: '',
      visible: false,
      isReadOnly: false,
      nodeId: '',
      model: {},
      refresh: true,
      cmdTemplate: '',
      disabled: (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看',
      refKeys: ['setCmdParam'],
      activeKey: 'setCmdParam',
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
        cmdType: {
          rules: [{ validator: this.validateCmdType }]
        },
        cmdName: {
          rules: [{ validator: this.validateCmdName }]
        }
      },
      paramTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '参数标识',
            key: 'alias',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true,
            placeholder: '请选择对应${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^.{2,32}$/, // 正则
                message: '${title}不可少于2或多于32字'
              }
            ]
          },
          {
            title: '参数名称',
            key: 'name',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
            disabled: true,
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              },
              // {
              //   pattern: /^.{2,32}$/, // 正则
              //   message: '${title}不可少于2或多于32字'
              // },
              {
                handler (type, value, row, column, callback, target) {
                  console.log('this.row:', target)
                  let label = '命令别名'
                  let length = [2, 32]

                  let val = value || ''
                  if (val.length === 0) {
                    callback(false, '请输入' + label + '！')
                  } else if (/[\s+]/g.test(value)) {
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
                    callback()
                  }
                },
                message: '默认提示'
              }
            ]
          }
        ]
      },
      url: {
        add: '/mqttAction/mqttAction/add',
        edit: '/mqttAction/mqttAction/edit',
        list: '/mqttAction/mqttAction/list',
        duplicateCheck: '/mqttAction/mqttAction/duplicateCheck',
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
  // 钩子函数
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    // 初始化tokens
    this.initTokens()
    console.log('动作指令模块：productID=>', this.productId)
  },
  // 计算属性
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
    disabledBtn () {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    },
    hint () {
      let hintMsg = ''
      switch (this.title) {
        case '新增':
          hintMsg = '新增一个设备命令，并添加其基本参数'; break
        case '编辑':
          hintMsg = '编辑设备命令的基本参数'; break
        case '查看':
          hintMsg = '查看设备命令的基本参数'; break
        default:
          hintMsg = '设备命令的基本参数'
      }
      return hintMsg
    }
  },
  // 方法
  methods: {
    add () {
      this.edit({})
    },
    edit (record, not_editable) {
      if (not_editable) {
        this.isReadOnly = true
      } else {
        this.isReadOnly = false
      }
      console.log('this.record=>', record)
      this.form.resetFields()
      this.paramTable.dataSource = []
      this.cmdTemplate = ''
      if (record.nodeId != undefined) {
        this.nodeId = record.nodeId
      }
      if (record.nodeName != undefined) {
        this.nodeName = record.nodeName
      }
      this.model = Object.assign({}, record)
      console.log('this.model=>', this.model)

      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'productId',
            'cmdType',
            'cmdName',
            'cmdParams',
            'cmdTemplate',
            'inputerName',
            'inputerFullname'
          )
        )

        // 时间格式化
        // this.form.setFieldsValue({ inputTime: this.model.inputTime ? moment(this.model.inputTime) : null })

        // 初始化新任务通知
        if (this.model.notifyMethod != undefined) {
          this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
        }
      })

      // 进行编辑而不是新增
      if (Object.getOwnPropertyNames(record).length != 0) {
        let dataSource_no_id = JSON.parse(this.model.cmdParams)
        let dataSource_with_id = []
        // 因为数据库中cmdParams字段是没有存储id属性的，因此在这里要加上
        dataSource_no_id.forEach((item, index) => {
          item.id = index + 1
          dataSource_with_id.push(item)
        })
        this.paramTable.dataSource = dataSource_with_id
      }
      if (record.cmdType != undefined) {
        this.cmdTemplate = this.makeCmdTemplate(record.cmdType, record.cmdParams)
      }
      this.$emit('ok')
    },
    /** 获取所有的editableTable实例 */
    getAllTable () {
      if (!(this.refKeys instanceof Array)) {
        throw this.throwNotArray('refKeys')
      }
      let values = this.refKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.fileList = []
    },
    makeCmdTemplate (cmdType, tableValues) {
      let cmdTemplate = {}
      cmdTemplate.ID = 'CCCCYYYYMMDDXXXXXX'
      cmdTemplate.CmdType = cmdType
      cmdTemplate.DT = 'yyyyMMddhhmmss'
      // //tableValues是对象属性，是一个字符串，必须转换成数组才能使用foreach
      // tableValues=JSON.parse(tableValues)
      tableValues.forEach((item, index) => {
        cmdTemplate[item.alias] = 'value' + (index + 1)
      })
      return cmdTemplate
    },
    makeCmdParams (tableValues) {
      let params = []
      tableValues.forEach(item => {
        delete item.id
        params.push(item)
      })
      return params
    },
    handleOk () {
      /** 触发表单验证 */
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        return validateFormAndTables(this.form, tables)
      }).then(allValues => {
        let that = this
        let method = 'post'
        let actionUrl = ''
        if (!this.model.id) {
          actionUrl += this.url.add
        } else {
          actionUrl += this.url.edit
        }
        let formData = Object.assign(this.model, allValues.formValue)
        let tableValues = allValues.tablesValue[0].values
        let cmdType = this.form.getFieldsValue(['cmdType']).cmdType
        formData.productId = this.productId
        formData.cmdParams = JSON.stringify(that.makeCmdParams(tableValues))
        formData.cmdTemplate = JSON.stringify(that.cmdTemplate)
        httpAction(actionUrl, qs.stringify(formData), method).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
          } else {
            that.$message.warning('操作失败')
          }
        }).finally(() => {
          that.isReadOnly = true
          that.confirmLoading = false
          this.$emit('ok')
          this.isChange = false
          this.close()
        })
      }).catch(err => {
        console.log('err:', err)
        that.$message.warning('校验失败')
      })
      //   .finally(() => {
      //   this.$emit('ok')
      //   this.isChange = false
      //   this.close()
      // })
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
    createCmdTemplate (event) {
      let cmdType = this.form.getFieldsValue(['cmdType']).cmdType
      let that = this
      this.$refs.setCmdParam.getValues((error, tableValues) => {
        that.cmdTemplate = that.makeCmdTemplate(cmdType, tableValues)
      })
    },
    // 校验命令编码
    validateCmdType (rule, value, callback) {
      let label = '命令编码'
      let length = [2, 32]

      let val = value || ''
      if (val.length === 0) {
        callback('请输入' + label + '！')
      } else if (/[\s+]/g.test(value)) {
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
          cmdType: val.trim()
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
    // 校验命令名称
    validateCmdName (rule, value, callback) {
      let label = '命令名称'
      let length = [2, 32]
      normalValidate(label, length, rule, value, callback)
    }
    // eslint-disable-next-line no-unused-vars
    // validateParamAlias
  }

}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>
