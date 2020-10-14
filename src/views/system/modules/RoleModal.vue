<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
          <a-input 
            placeholder="请输入角色名称" 
            v-decorator="[ 'roleName', validatorRules.roleName]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色编码">
          <a-input
            placeholder="请输入角色编码"
            :disabled="roleDisabled"
            v-decorator="[ 'roleCode', validatorRules.roleCode]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
          <a-textarea :rows="5" 
            placeholder="..." 
            v-decorator="[ 'description',  validatorRules.description ]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { addRole, editRole, duplicateCheck } from '@/api/api'
import qs from 'qs'

export default {
  name: 'RoleModal',
  data() {
    return {
      title: '操作',
      visible: false,
      roleDisabled: false,
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
      validatorRules: {
        roleName: { 
          rules: [{ required: true, message: ' ' }, { validator: this.validateRoleName }] 
        },
        roleCode: {
          rules: [{ required: true, message: ' ' }, { validator: this.validateRoleCode }]
        },
        description: {
          rules: [{ validator: this.validateDescription }]
        }
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true

      //编辑页面禁止修改角色编码
      if (this.model.id) {
        this.roleDisabled = true
      } else {
        this.roleDisabled = false
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'roleName', 'description', 'roleCode'))
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign({id: this.model.id}, values),
            obj
          formData = qs.stringify(formData)
          if (!this.model.id) {
            obj = addRole(formData)
          } else {
            obj = editRole(formData)
          }
          obj
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
    handleCancel() {
      this.close()
    },
    validateRoleCode(rule, val, callback) {
      let value = val ? val : ''
      if(value.length == 0){
        callback('请输入角色编码！')
      } else if(val.length > 100){
        callback('角色编码不可超过100个字符')
      } else if (val.replace(/\s*/g, '') == '') {
        callback('角色编码不可为空!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('角色编码不可输入汉字!')
      } else {
        var params = {
          tableName: 'sys_role',
          fieldName: 'role_code',
          fieldVal: value.trim(),
          dataId: this.model.id
        }
        duplicateCheck(params).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      }
    },
    validateRoleName(rule, value, callback) {
      let val = value ? value : ''
      if (val.length == 0) {
        callback('请输入角色名称！')
      } else if(val.length > 200){
        callback('角色名称不可超过200个字符')
      } else if (val.replace(/\s*/g, '') == '') {
        callback('角色名称不可为空!')
      } else{
        callback()
      }
    },
    validateDescription(rule, value, callback) {
      let val = value ? value : ''
      if(val.length > 255){
        callback('角色名称不可超过255个字符')
      } else{
        callback()
      }
    }
  }
}
</script>

<style scoped>
</style>