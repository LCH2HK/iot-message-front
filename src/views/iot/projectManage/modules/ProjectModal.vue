<template>
  <a-modal
    :title="title"
    :width="800"
    :ok="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="项目名称"
          :hidden="false"
          hasFeedback
        >
          <a-input
            id="projectName"
            placeholder="请输入项目名称"
            v-decorator="['projectName', validatorRules.projectName ]"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :hidden="seen"
          label="上级项目"
          hasFeedback
        >
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="projectTree"
            v-model="model.parentId"
            placeholder="请选择上级项目"
            :disabled="condition"
          ></a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电话">
          <a-input placeholder="请输入电话" v-decorator="['mobile',validatorRules.mobile]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="传真">
          <a-input placeholder="请输入传真" v-decorator="['fax', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
          <a-input placeholder="请输入地址" v-decorator="['address', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number v-decorator="[ 'projectOrder',{'initialValue':0}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea placeholder="请输入备注" v-decorator="['memo', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { queryIdTree } from '@/api/api'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'ProjectModal',
  components: { ATextarea },
  data() {
    return {
      projectTree: [],
      orgTypeData: [],
      phoneWarning: '',
      projectName: '',
      title: '操作',
      seen: false,
      visible: false,
      condition: true,
      disableSubmit: false,
      model: {},
      menuhidden: false,
      menuusing: true,
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
        projectName: { rules: [{ required: true, message: '请输入项目名称!' }] },
        orgCode: { rules: [{ required: true, message: '请输入项目编码!' }] },
        mobile: { rules: [{ validator: this.validateMobile }] }
      },
      url: {
        add: '/sysIotProject/sysIotProject/add'
      }
    }
  },
  created() {},
  methods: {
    loadTreeData() {
      var that = this
      queryIdTree().then(res => {
        if (res.success) {
          that.projectTree = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.projectTree.push(temp)
          }
        }
      })
    },
    add(depart) {
      if (depart) {
        this.seen = false
      } else {
        this.seen = true
      }
      this.edit(depart)
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, {})
      this.visible = true
      this.loadTreeData()
      this.model.parentId = record != null ? record.toString() : null
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'projectName',
            'projectNameEn',
            'projectNameAbbr',
            'projectOrder',
            'description',
            'orgType',
            'orgCode',
            'mobile',
            'fax',
            'address',
            'memo',
            'status',
            'delFlag'
          )
        )
      })
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          //时间格式化
          console.log(formData)
          httpAction(this.url.add, formData, 'post')
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadTreeData()
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
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    }
  }
}
</script>

<style scoped>
</style>