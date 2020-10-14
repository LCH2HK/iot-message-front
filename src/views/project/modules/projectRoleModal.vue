<template>
  <a-modal
    :title="title"
    :footer="null"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="role-form">
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
              <a-input placeholder="请输入角色名称" v-decorator="['roleName', validatorRules.roleName]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色编号">
              <a-input placeholder="请输入角色编号" v-decorator="['roleCode', validatorRules.roleCode]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
              <a-textarea placeholder="请输入描述内容" v-decorator="['description', validatorRules.description]" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
              >{{ model.status == undefined ? '提交' : '保存' }}</a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import qs from 'qs'
import { duplicateCheck } from '@/api/api'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'ProjectRoleModal',
  components: { ATextarea },
  //组件应用定义

  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  props: {
    projectId: ''
  },
  // 数据定义
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      queryParam: {
        category: '',
        pid: ''
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
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
      //下拉框数据来源
      items: [],
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
      },
      url: {
        add: '/sys/role/add?projectId=',
        edit: '/sys/role/edit',
        check: '/sys/role/checkUniqueRoleCode'
      }
    }
  },
  // 钩子函数
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
  },
  // 计算属性
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    }
  },
  //方法
  methods: {
    loadData() {},
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'roleName', 'roleCode', 'description'))
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      that.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let actionUrl = ''
          let method = 'post'
          //判断操作类型，新增或者编辑
          if (!this.model.id) {
            actionUrl = this.url.add + this.projectId
          } else {
            actionUrl += this.url.edit
          }
          // 表单数据赋值给formData
          values.roleName = values.roleName.replace(/\s*/g, '')
          values.roleCode = values.roleCode.replace(/\s*/g, '')
          let formData = Object.assign(this.model, values)
          formData.projectId = this.selectedProjectId
          //发起提交或保存请求
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('refresh')
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

    handleCancel() {
      this.close()
    },

    handleChange(value) {
      console.log(`selected ${value}`)
    },
    validateRoleCode(rule, value, callback) {
      let val = value ? value : ''
      if (val.length == 0) {
        callback('请输入角色编号！')
      } else if(val.length > 100){
        callback('角色编码不可超过100个字符')
      } else if (/[\u4E00-\u9FA5]/g.test(val)) {
        callback('角色编码不可输入汉字!')
      } else if (val.replace(/\s*/g, '') == '') {
        callback('角色编码不可为空!')
      } else {
        let params = {
            roleCode: val,
            id: this.model.id
          },
          url = this.url.check
        getAction(url, params).then(res => {
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

<style lang="less" scoped>
@import '~@assets/less/modal.less';

.role-form {
  :global(.ant-form-explain) {
    height: 0;
  }
}
</style>
