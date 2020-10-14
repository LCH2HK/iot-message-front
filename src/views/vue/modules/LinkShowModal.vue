<template>
  <a-modal
    :title="title"
    :footer="null"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;"
  >
    <a-spin :spinning="confirmLoading">
        <a-row :gutter="24">
          <a-col :span="24">
                <a-input
                    :value='shownLink'
                    v-decorator="[
                    'link',
                    {rules: [{ required: false, message: '' }]}
                    ]"
                />
            </a-col>
        </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import qs from 'qs'
import Vue from 'vue'

export default {
  name: 'LinkShowModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      shown: true,
      shownLink:'',
      parentDepartmentId: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
    }
  },
  methods: {
    loadData() {},
    show(newLink) {
      this.visible = true
      this.shownLink = ''
      // debugger
      this.shownLink = newLink
    },
    handleCancel() {
      this.shownLink =''
      this.$emit('close')
      this.visible = false
    },
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>