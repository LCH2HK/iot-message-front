<template>
  <div class="form-wrapper">
    <a-form :form="form" @submit="handleSubmit" layout="horizontal">
      <a-form-item label="选择部门">
        <j-select-depart
          placeholder="请选择要授权的具体部门"
          v-decorator="[
                    'departmentIds',
                    validatorRules.departmentIds
                ]"
          :trigger-change="true"
        ></j-select-depart>
      </a-form-item>
      <a-form-item label="授权对象类型">
        <a-select
          @select="onSelect"
          v-decorator="[
                'type',
                {rules:[{required:true,message:'请选择要授权对象的类型！'}]}
            ]"
          placeholder="请选择要授权对象的类型"
        >
          <a-select-option key="0" value="user">用户</a-select-option>
          <a-select-option key="1" value="role">角色</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="授权对象" v-if="userShown">
        <!-- 选择具体用户: -->
        <j-select-user-new
          placeholder="请选择要授权的具体用户"
          multiple
          v-decorator="[
            'userNames', 
            {rules:[{required:true,message:'请选择要授权的具体用户！'}]}
        ]"
          :selectedDetails="auditUsers1"
          @callback="setAuditUser"
          class="userSelect"
        />
      </a-form-item>
      <!-- 选择具体角色： -->
      <a-form-item v-if="roleShown" label="授权对象">
        <a-input
          @click="SelectRoleModal"
          placeholder="请选择要授权的具体角色"
          v-decorator="['roleIds', {rules:[{required:true,message:'请选择要授权的具体角色！'}]}]"
        ></a-input>
      </a-form-item>

      <a-form-item label="授予权限">
        <a-checkbox-group
          v-decorator="[
                'permission', 
                {rules: [{ required: true, message: '请选择授予的权限' }]}
            ]"
          style="width: 100%;"
        >
          <a-row>
            <a-col :span="6">
              <a-checkbox value="read">查看</a-checkbox>
            </a-col>
            <a-col :span="6">
              <a-checkbox value="edit">编辑</a-checkbox>
            </a-col>
            <a-col :span="6">
              <a-checkbox value="delete">删除</a-checkbox>
            </a-col>
            <a-col :span="6">
              <a-checkbox value="share">分享</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃当前操作？" @confirm="reset" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">重置</a-button>
      </a-popconfirm>
      <a-popconfirm title="确定执行取消授权操作？" @confirm="handleSubmit(1)" okText="确定" cancelText="取消">
        <a-button type="primary" :loading="loading" style="margin-right: .8rem">取消授权</a-button>
      </a-popconfirm>
      <!-- <a-button @click="handleSubmit(1)" type="primary" :loading="loading" style="margin-right: .8rem">取消授权</a-button> -->
      <a-button @click="handleSubmit(0)" type="primary" :loading="loading">授权</a-button>
    </div>
    <!-- 选角色弹窗 -->
    <selectRole-modal :visible="roleVisible" @cancel="SelectRoleHandlCancel" @select="SelectRole"></selectRole-modal>
  </div>
</template>
<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import qs from 'qs'
import Vue from 'vue'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
import SelectRoleModal from './SelectRoleModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'

export default {
  name: 'DepartPermissionManage',
  mixins: [CmpListMixin],
  components: {
    JSelectUserNew,
    JSelectDepart,
    SelectRoleModal
  },
  data() {
    return {
      roleVisible: false,
      form: this.$form.createForm(this),
      userShown: false,
      roleShown: false,
      loading: false,
      selectUser: ['auditUsers1'],
      auditUsers1: {
        colum: 'auditUsers1',
        value: [],
        target: [{ to: 'userNames', from: 'username' }]
      },
      validatorRules: {
        userNames: { rules: [{ required: true, message: '授权具体用户不能为空！' }] },
        departmentIds: { rules: [{ required: true, message: '要授予的部门不能为空！' }] }
      },
      url: {
        departPermission: '/fileFolderFile/departmentPermission/add'
      }
    }
  },
  methods: {
    SelectRoleModal() {
      this.roleVisible = true
    },
    SelectRoleHandlCancel() {
      this.roleVisible = false // 组件点击关闭按钮，触发本回调方法，将组件的显隐状态置为false，隐藏本组件
    },
    SelectRole(record) {
      // 组件点击选择按钮，触发本回调方法，完成以下字段的回填
      this.roleVisible = false
      const that = this
      // console.log(record, '选择的角色的全部信息')

      that.$nextTick(() => {
        //异步
        that.model = { id: record.id }
        that.form.setFieldsValue({ roleIds: record.roleName })
      })
    },
    loadData() {
      this.form.resetFields()
      this.form.setFieldsValue({ permission: [] })
      this.form.setFieldsValue({ userNames: '' })
      this.form.setFieldsValue({ departmentIds: '' })
      this.form.setFieldsValue({ roleIds: '' })
    },
    onSelect(value) {
      if (value == 'user') {
        this.userShown = true
        this.roleShown = false
      } else {
        this.userShown = false
        this.roleShown = true
      }
    },
    reset() {
      this.form.resetFields()
      this.form.setFieldsValue({ permission: [] })
      this.form.setFieldsValue({ userNames: '' })
      this.form.setFieldsValue({ departmentIds: '' })
      this.form.setFieldsValue({ roleIds: '' })
      this.loading = false
    },
    handleSubmit(num) {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.departmentIds = values.departmentIds.split(',')
          // console.log('values.departmentIds', values.departmentIds)
          // debugger
          if (this.userShown == true) {
            values.userNames = values.userNames.split(',')
          } else {
            values.roleIds = this.model.id.split(',')
          }
          // debugger
          if(num ==0){
              values.delFlag = 0
          }else{
              values.delFlag = 1
          }
          values.permission = values.permission.join(',')
          // console.log('values', values)
          let params = {
            jsonStr: JSON.stringify(values)
          }
          postAction(this.url.departPermission, qs.stringify(params))
            .then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('ok')
              } else {
                this.$message.warning(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/index.less';
.form-wrapper {
  padding: 4vw 10vh;
}
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  right: 7vw;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>