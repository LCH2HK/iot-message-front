<template>
  <a-modal
    :title="title"
    :footer="null"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" @submit="handleOk">
        <a-form-item label="分享对象类型">
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
            <a-select-option key="2" value="department">部门</a-select-option>
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
        <!-- 选择具体部门： -->
        <a-form-item label="授权对象" v-if="departShown">
          <j-select-depart
            placeholder="请选择要授权的具体部门"
            v-decorator="[
            'departmentIds',
             validatorRules.departmentIds
          ]"
            :trigger-change="true"
          ></j-select-depart>
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
                <a-checkbox value="share">分享</a-checkbox>
              </a-col>
              <a-col :span="6">
                <a-checkbox value="delete">删除</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item class="btnClass">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-button
                @click="handleCancel"
                icon="close"
                style="margin-right:10px"
                class="cancel"
              >取消</a-button>
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">确定</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-spin>
    
    <!-- 选角色弹窗 -->
    <selectRole-modal :visible="roleVisible" @cancel="SelectRoleHandlCancel" @select="SelectRole"></selectRole-modal>
  
  </a-modal>
</template>
<script>
import { httpAction, postAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
import SelectRoleModal from './SelectRoleModal'
import qs from 'qs'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { CmpListMixin } from '@/mixins/CmpListMixin'

export default {
  name: 'FileShareModal',
  mixins: [CmpListMixin],
  components: {
    JSelectUserNew,
    JSelectDepart,
    SelectRoleModal
  },
  data() {
    return {
      title: '分享',
      
      roleVisible: false,
      visible: false,
      userShown: false,
      roleShown: false,
      departShown: false,
      model: {},
      model1:{},
      disabled: false,
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 }
      },
      url: {
        share: '/fileFolderFile/fileShare/add'
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      // form1: this.$form.createForm(this),
      nodeId: '',
      selectUser: ['auditUsers1'],
      auditUsers1: {
        colum: 'auditUsers1',
        value: [],
        target: [{ to: 'userNames', from: 'username' }]
      },
      validatorRules: {
        userNames: { rules: [{ required: true, message: '授权具体用户不能为空！' }] },
        departmentIds: { rules: [{ required: true, message: '授权具体部门不能为空！' }] }
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
        that.model1 = { id: record.id }
        that.form.setFieldsValue({ roleIds: record.roleName })
      })
    },
    loadData() {},
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.form.setFieldsValue({permission:[]});
      this.form.setFieldsValue({ userNames: '' })
      this.form.setFieldsValue({ departmentIds: '' })
      this.form.setFieldsValue({ roleIds: '' })
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'sharedUsers'))
        //时间格式化
        // this.form.setFieldsValue({ uploadTime: this.model.uploadTime ? moment(this.model.uploadTime) : null })
        this.auditUsers1.value = []
      })
    },
    // 类型选择器相关-开始：
    onSelect(value) {
      if (value == 'user') {
        this.userShown = true
        this.departShown = false
        this.roleShown = false
      } else if (value == 'department') {
        this.userShown = false
        this.departShown = true
        this.roleShown = false
      } else {
        this.userShown = false
        this.departShown = false
        this.roleShown = true
      }
    },
    // 类型选择器相关-结束；
    close() {
      this.$emit('close')
      this.form.resetFields()
      this.form.setFieldsValue({permission:[]});
      this.form.setFieldsValue({ userNames: '' })
      this.form.setFieldsValue({ departmentIds: '' })
      this.form.setFieldsValue({ roleIds: '' })
      this.visible = false
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if(this.userShown){
            values.userNames = values.userNames.split(',')
          }else if(this.departShown){
            values.departmentIds = values.departmentIds.split(',')
          }else{
            values.roleIds = this.model1.id.split(',')
          }
          
          values.permission = values.permission.join(',')
          values.fileId = this.model.id
          // console.log('values', values)
          let params = {
            jsonStr: JSON.stringify(values)
          }
          // console.log('params',params)
          postAction(this.url.share, qs.stringify(params))
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
              this.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@/assets/less/modal.less';
/deep/.userSelect.ant-select {
  min-width: 200px;
}
</style>