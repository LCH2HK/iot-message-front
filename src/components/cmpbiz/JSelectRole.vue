<template>
  <div class="components-input-demo-presuffix">
    <a-input
      @click="SelectRoleModal"
      placeholder="请点击选择角色"
      v-decorator="['roleIds', {rules:[{required:true,message:'请选择具体角色！'}]}]"
      readOnly
      :disabled="disabled"
      v-bind="role"
      ref="roleInput"
    >
      <a-icon slot="prefix" type="idcard" />
      <a-icon v-if="role" slot="suffix" type="close-circle" @click="emitEmpty" />
    </a-input>

    <j-select-role-modal
      :visible="roleVisible"
      @cancel="SelectRoleHandlCancel"
      @select="SelectRole"
    ></j-select-role-modal>
  </div>
</template>

<script>
import JSelectRoleModal from './modal/JSelectRoleModal'
export default {
  name: 'JSelectRole',
  components: {
    JSelectRoleModal
  },
  props: {
    // value: {
    //   type: String,
    //   required: false
    // },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      roleVisible: false,
      confirmLoading: false,
      model: {},
      roleIds: '',
      roleName: '',
      role: ''
    }
  },
  mounted() {
    // this.roleIds = this.value
  },
  watch: {
    // value(val){
    //     // this.roleIds = val
    //     console.log('val',val)
    // }
  },
  methods: {
    SelectRoleModal() {
      this.roleVisible = true
      this.role = ''
    },
    SelectRoleHandlCancel() {
      this.roleVisible = false // 组件点击关闭按钮，触发本回调方法，将组件的显隐状态置为false，隐藏本组件
    },
    SelectRole(record) {
      // 组件点击选择按钮，触发本回调方法，完成以下字段的回填
      const that = this
      that.$nextTick(() => {
        record.value = record.roleName
        that.role = record
        console.log('role.value', that.role)
        // that.form.setFieldsValue({ roleIds: record.roleName })
        that.roleName = record.roleName
        that.$emit('select', record) // 传回父组件
        this.roleVisible = false // 隐藏本组件
      })
    },
    emitEmpty() {
      this.$refs.roleInput.focus()
      this.role = ''
      this.$emit('select','')
    }
  }
}
</script>

<style scoped>
@import '~@assets/less/common.less';
</style>