<!--设备标签 新增标签窗口 -->
<template>
  <a-modal :width="600" title="新增标签" @ok="handleOk" @cancel="handleCancel" :visible="visible">
    <a-form :form="form">
      <a-form-item
        :labelCol="{xs: { span: 24 }, sm: { span: 4 }}"
        :wrapperCol="{xs: { span: 24 }, sm: { span: 19 }}"
        label="标签名"
      >
        <a-input v-decorator="['tagName', validatorRules.tagNameRule]" placeholder="请输入标签名" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { postAction } from '../../../../api/manage'
import qs from 'qs'
import { unitValidate } from '../../js/iot_validate'

export default {
  name: 'TagsAddModal',
  props: {
    deviceTags: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this),
      model: '',
      url: {
        add: '/tags/tags/add'
      },
      validatorRules: {
        tagNameRule: {
          rules: [{ required: true, message: ' ' }, { validator: this.valiTagName }]
        }
      }
    }
  },
  methods: {
    // 校验标签名称
    valiTagName (rule, value, callback) {
      for (let i = 0; i < this.deviceTags.length; i++) {
        if (this.deviceTags[i].tagName === value) {
          callback('已存在相同标签名！')
          break
        }
      }
      let label = '标签名称'
      let length = [2, 32]
      unitValidate(label, length, rule, value, callback)
    },
    show () {
      this.form.resetFields()
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let that = this
          // 表单数据赋值给formData
          let formData = Object.assign(this.model, values)
          postAction(that.url.add, qs.stringify(formData)).then(res => {
            if (res.success) {
              that.$message.success('新增标签成功！')
              that.$emit('loadNewTag', values.tagName)
            } else {
              that.$message.error('新增标签失败！')
            }
          })
          this.visible = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>
