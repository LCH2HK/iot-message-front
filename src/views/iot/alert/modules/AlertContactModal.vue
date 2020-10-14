<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="保存"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人组名" hasFeedback>
          <a-input
            placeholder="请输入联系人组名"
            v-decorator="['groupName', {rules: [{ required: true, message: '请输入联系人组名!' }]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import qs from 'qs'

export default {
  name: 'AlertContactModal',
  components: {
  },
  data () {
    return {
      title: '操作',
      visible: false,
      productInfos: [],
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: '/alert/contactGroup/add',
        edit: '/alert/contactGroup/edit'
      },
      queryParam: {}
    }
  },
  created () {},
  methods: {
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields() // 弹窗初始化
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'groupName'))
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          // if (typeof values.monitorFrequency == "undefined" || Object.keys(values.monitorFrequency).length==0 ) {
          //   this.$message.warning('请输入cron表达式!');
          //   return false;
          // }
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'post' // put修改
          }
          let formData = Object.assign(this.model, values)
          // 时间格式化
          httpAction(httpurl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>

<style scoped>
</style>
