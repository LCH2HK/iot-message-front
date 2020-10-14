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
        <img :src="title | IconUrl"/>
        {{ title }}
        <span>{{ nodeName ? '(' + nodeName + ')': '' }}</span>
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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="编号">
              <a-input
                placeholder="请输入通讯管理机编号"
                v-decorator="['code', validatorRules.code]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
              <a-input
                placeholder="请输入通讯管理机名称"
                v-decorator="['name', validatorRules.name]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="密码">
              <a-input
                placeholder="请输入通讯管理机密码"
                :type="pswType"
                v-decorator="['password', validatorRules.password]"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              >
                <a-icon
                  slot="suffix"
                  @click="changePswType('show')"
                  type="eye-invisible"
                  v-if="pswType == 'password'"
                />
                <a-icon
                  slot="suffix"
                  @click="changePswType('hidden')"
                  type="eye"
                  v-if="pswType == 'text'"
                />
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属项目">
              <a-select
                v-decorator="['prjCode',validatorRules.involvedPrj]"
                placeholder="请选择所属项目"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'">
                <a-select-option
                  v-for="(item,index) in involvedPrjs"
                  :value="item.prjCode"
                  :key="index"
                >
                  {{ item.prjName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm" v-if="title !== '查看'">
                确定
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
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { IotPrjTreeMixin } from '@/views/iot/js/IotPrjTreeMixin'
import qs from 'qs'
import { normalValidate } from '../../js/iot_validate'

export default {
  name: 'CommuncationManagerModal',
  // 组件应用定义
  components: {
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [myCmpListMixin, IotPrjTreeMixin],
  // 数据定义
  data () {
    return {
      title: '操作',
      nodeName: '',
      visible: false,
      nodeId: '',
      model: {},
      pswType: 'password',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
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
      involvedPrj: {},
      involvedPrjs: [],
      url: {
        add: '/communcationManager/communcationManager/add',
        edit: '/communcationManager/communcationManager/edit',
        duplicateCheck: '/communcationManager/communcationManager/duplicateCheck',
        getinvolvedPrj: '/project/sysProject/prjListByUser'
      },
      // 上传附件定义
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false,
      attachment: [],
      validatorRules: {
        code: { rules: [{ required: true, message: '通讯管理机id不能为空！' }, { validator: this.validateKey }] },
        name: { rules: [{ required: true, message: '通讯管理机名不能为空！' }, { validator: this.validateName }] },
        password: { rules: [{ required: false, message: '' }, { validator: this.validatePassword }] },
        involvedPrj: { rules: [{ required: true, message: '涉及项目不能为空！' }] }
      }
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
    },
    hint () {
      let hintMsg = ''
      switch (this.title) {
        case '新增':
          hintMsg = '新增一个通讯管理机，并添加其基本属性'
          break
        case '编辑':
          hintMsg = '编辑通讯管理机的基本属性'
          break
        case '查看':
          hintMsg = '查看通讯管理机的基本属性'
          break
        default:
          hintMsg = '通讯管理机的基本属性'
      }
      return hintMsg
    }
  },
  // 方法
  methods: {
    loadData () {
    },
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
        this.form.setFieldsValue(pick(this.model, 'code', 'name', 'runInfo', 'prjName', 'prjCode'))
      })
      this.model.involvedPrjs = this.getinvolvedPrjs()
    },
    getinvolvedPrjs () {
      let data = null
      let httpurl = this.url.getinvolvedPrj
      let method = 'get'
      const that = this
      httpAction(httpurl, qs.stringify(data), method).then(res => {
        if (res.success) {
          that.involvedPrjs = res.result
        } else {
          that.$message.error('操作失败!')
        }
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.fileList = []
    },
    handleOk () {
      const that = this
      // 触发表单验证
      console.log('handle ok')
      this.form.validateFields((err, values) => {
        console.log('err==>', err)
        if (!err) {
          that.confirmLoading = true
          let actionUrl = ''
          let method = 'post'
          let prjCode = values.prjCode
          let urlPrefix = ''
          that.involvedPrjs.forEach(prj => {
            if (prj.prjCode == prjCode) {
              urlPrefix = prj.dataServiceUrl
            }
          })
          let addUrl = urlPrefix + that.url.add
          let editUrl = urlPrefix + that.url.edit
          let dupCheckUrl = urlPrefix + that.url.duplicateCheck
          // 判断操作类型，新增或者编辑
          if (!this.model.id) {
            actionUrl = addUrl
          } else {
            actionUrl = editUrl
          }
          // 表单数据赋值给formData
          let formData = Object.assign(this.model, values)

          let params = {
            id: this.model.id,
            code: formData.code
          }
          console.log('params:', params)
          console.log('dupcheck url:', dupCheckUrl)
          httpAction(dupCheckUrl, params, method).then(res => {
            if (res.success) {
              // 发起提交或保存请求
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
            } else {
              that.$message.error('编号重复!')
              that.confirmLoading = false
            }
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
    changePswType (toType) {
      if (toType == 'show') {
        this.pswType = 'text'
      }
      if (toType == 'hidden') {
        this.pswType = 'password'
      }
    },
    validateKey (rule, value, callback) {
      let label = '通讯管理机编号'
      let length = [4, 32]
      let val = value || ''
      if (val.length === 0) {
        callback('请填写' + label + '！')
      } else if (/[\s+]/g.test(value)) {
        callback('不可添加空格!')
      } else if (/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g.test(value)) {
        callback('不可输入特殊字符!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不可输入汉字!')
      } else if (val.length < length[0]) {
        callback('最少输入' + length[0] + '个字')
      } else if (val.length > length[1]) {
        callback('最多输入' + length[1] + '个字')
      } else {
        callback()
      }
    },
    // 通讯管理机名称校验
    validateName (rule, value, callback) {
      let label = '通讯管理机名称'
      let length = [2, 32]
      normalValidate(label, length, rule, value, callback)
    },
    validatePassword (rule, value, callback) {
      let label = '通讯管理机密码'
      let length = [6, 32]
      let val = value || ''
      if (val.length === 0) {
        callback('请填写' + label + '！')
      } else if (/[\s+]/g.test(value)) {
        callback('不可添加空格!')
      } else if (/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g.test(value)) {
        callback('不可输入特殊字符!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不可输入汉字!')
      } else if (val.length < length[0]) {
        callback('最少输入' + length[0] + '个字')
      } else if (val.length > length[1]) {
        callback('最多输入' + length[1] + '个字')
      } else {
        callback()
      }
    }

  }
}
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
</style>
