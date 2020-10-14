<template>
  <a-modal :visible="isvisible" v-if="isvisible" @cancel="handleCancel" @ok="handleSubmit" :width="800" title="新增部门">
    <a-form :form="form">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门名称">
        <a-input
          placeholder="请输入部门名称"
          v-decorator="['departName', {rules:[{required: true, message: '请输入部门名称'}]}]"
        />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门" v-if="!isedit">
        <a-input v-decorator="['parentName', {}]" disabled></a-input>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="电话">
        <a-input placeholder="请输入电话" v-decorator="['mobile', {}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="传真">
        <a-input placeholder="请输入传真" v-decorator="['fax', {}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="地址">
        <a-textarea placeholder="请输入地址" v-decorator="['address', {}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
        <a-input-number v-decorator="[ 'departOrder',{'initialValue':0}]" :min="0"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-textarea placeholder="请输入备注" v-decorator="['memo', {}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { postAction } from '@/api/manage'
import qs from 'qs'
export default {
  name: 'departmentTemplateModal',
  data() {
    return {
      isvisible: false,
      template: true,
      selectKey: '',
      departTree: [],
      isedit: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      departRecord: {},
      url: {
        add: '/prj/sysProjectDepart/add',
        edit: '/prj/sysProjectDepart/edit'
      }
    }
  },
  methods: {
    handleCancel() {
      this.isvisible = false
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((errors, values) => {
        if (!errors) {
          let url = that.isedit ? that.url.edit : that.url.add,
            params = Object.assign(values, {
              isTemplate: that.template ? 1 : 0,
              prjCode: that.departRecord.prjCode
            })
          if (that.isedit) {
            params.id = that.departRecord.key
          } else {
            params.parentId = that.departRecord.key
          }
          postAction(url, qs.stringify(params)).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              that.handleCancel()
              this.$emit('reload')
            } else {
              this.$message.warn(res.message)
            }
          })
        }
      })
    },

    add(values) {
      this.isedit = false
      this.$nextTick(() => {
        this.departRecord = values
        this.form.setFieldsValue({ parentName: values.title })
      })
    },
    edit(values) {
      this.isedit = true
      this.$nextTick(() => {
        this.departRecord = values
        this.form.setFieldsValue({
          departName: values.departName,
          mobile: values.mobile,
          fax: values.fax,
          address: values.address,
          departOrder: values.departOrder,
          memo: values.memo
        })
      })
    }
  }
}
</script>
