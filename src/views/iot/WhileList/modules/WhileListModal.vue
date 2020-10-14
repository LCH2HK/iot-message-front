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
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="IP地址">
              <a-input placeholder="请输入IP地址" v-decorator="['ip', validatorRules.ip]"
                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="备注">
              <a-input placeholder="请输入备注" v-decorator="['comment', {}]"
                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="录入人" >
              <a-input
                placeholder
                v-decorator="['inputerFullname', {initialValue: this.$store.getters.nickname} ]"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="录入时间" >
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
    name: 'WhileListModal',
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
        validatorRules: {},
        url: {
          add: '/whitelist/whiteList/add',
          edit: '/whitelist/whiteList/edit',
          duplicateCheck: '/whitelist/whiteList/duplicateCheck',
        },
        validatorRules: {
          ip: {rules: [{required: true, message: ''},{validator: this.validatorIp}]},
        },
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
            hintMsg = '将一个IP加入到白名单中，最好添加备注'
            break
          case '编辑':
            hintMsg = '编辑IP或者备注'
            break
          case '查看':
            hintMsg = '查看该IP的基本信息'
            break
          default:
            hintMsg = '该IP的基本信息'
        }
        return hintMsg
      }
    },
    //方法
    methods: {
      moment,
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
          this.form.setFieldsValue(pick(this.model, 'comment', 'inputerFullname', 'inputerName', 'ip'))
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
      validatorIp(rule, value, callback) {
        let label = 'IP'
        let expr = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        let val = value ? value : ''
        if (val.length === 0) {
          callback('请填写' + label + '！')
        } else if (!expr.test(value)) {
          callback('不符合IP的格式!')
        } else {
          let params = {
            id: this.model.id,
            ip: val.trim()
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

      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
</style>