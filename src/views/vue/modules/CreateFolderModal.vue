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
      <a-form :form="form">
        <a-row :gutter="24" v-if="nameShown">
          <a-col :md="24" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="文件夹名">
              <a-input
                placeholder="请输入文件夹名称"
                v-decorator="[
                  'name', 
                  {rules: [{ required: true, message: '' },{ validator: folderNameVerify }]}
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="shown">
          <a-col :md="24" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
              <span slot="label">
                更改权限&nbsp;
                <a-tooltip title="此处权限指本部门其他人员对此文件夹的权限">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <a-checkbox-group
                v-decorator="[
                    'permission', 
                    {rules: [{ required: true, message: '请选择本部门其他人员对此文件夹的权限' }]}
                ]"
                style="width: 100%;"
              >
                <!-- 文件夹的全部权限是read,edit,delete,new -->
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
                    <a-checkbox value="new">新增</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item class="btnClass">
              <a-button
                @click="handleCancel"
                icon="close"
                style="margin-right:10px"
                class="cancel"
              >取消</a-button>
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
              >{{ model.id == undefined ? '创建' : '确定' }}</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import qs from 'qs'
import Vue from 'vue'

export default {
  name: 'CreateFolderModal',
  data() {
    return {
      title: '操作',
      currentType:'', //记录当前文件夹的类型
      option: '', // 记录当前操作类型；
      visible: false,
      model: {},
      shown: false, // 控制‘权限checkbox-group’的显隐；
      nameShown: false, //控制‘文件夹名input’的显隐；
      parentId: '',
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
      form: this.$form.createForm(this),
      url: {
        addEmptyOnlineFolder: '/fileFolderFile/file/add', // 新增文件夹
        renameOnlineFolder: '/fileFolderFile/file/update', // 文件夹重命名
        permissionManage: '/fileFolderFile/filePermission/add',
        getDepFilePermission:'/fileFolderFile/getDepartmentFilePermission' // 获取当前文件对部门的权限
      }
    }
  },
  methods: {
    loadData() {},
    add(currentFolder) {
      this.nameShown = true
      this.parentId = currentFolder.id
      this.currentType = currentFolder.directoryType
      this.parentDepartmentId = currentFolder.departmentId || currentFolder.fileParentDepartmentId
      console.log('currentFolder', currentFolder)
      this.edit({})
      // this.shown = true
    },
    edit(record) {
      if (record.id) {
        this.shown = false
        this.nameShown = true
      }
      console.log('record', record)
      this.form.resetFields()
      this.form.setFieldsValue({ permission: [] })
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ name: this.model.fileName })
      })
    },
    reAccredit(record) {
      // 授权更改的入口；
      this.shown = true
      this.nameShown = false
      this.option = 'reAccredit'
      this.parentDepartmentId = record.fileParentDepartmentId
      let currentDepPermission = ''
      this.form.resetFields()
      this.form.setFieldsValue({ permission: [] })
      let params = {
        fileId: record.id,
        departmentId: record.fileParentDepartmentId
      }
      getAction(this.url.getDepFilePermission,params).then((res)=>{
        if(res.success){
          // console.log('response',res.result)
          currentDepPermission = res.result
          this.$nextTick(() => {
            this.form.setFieldsValue({ permission: currentDepPermission.split(',')})
          })
        }
      })
      this.model = Object.assign({}, record)
      this.visible = true
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
          let httpurl = ''
          if (!this.model.id) {
            httpurl += this.url.addEmptyOnlineFolder
            values.parentDepartmentId = this.parentDepartmentId
            values.permission = ''
            values.directoryType = this.currentType
          } else if(this.option == 'reAccredit'){
            httpurl += this.url.permissionManage
            values.type = 'department'
            values.folderIds = this.model.id.split(',')
            values.departmentIds = this.parentDepartmentId.split(',')
            values.permission = values.permission.join(',') // 数组转字符串；
          }else{
            httpurl += this.url.renameOnlineFolder
            values.id = this.model.id
          }
          values.parentId = this.parentId
          console.log('values', values)
          let params = {
            jsonStr: JSON.stringify(values)
          }
          postAction(httpurl, qs.stringify(params))
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
    folderNameVerify(rule, val, callback) {
      let value = val ? val : ''
      let reg = /^[^\/\\\:\*\?\"\<\>\|\\]{1,255}$/
      let formData = {
        fileName: value
      }
      if (reg.test(value)) {
        callback()
      } else if (value.length == 0) {
        callback('请输入文件夹名称！')
      } else {
        callback('文件夹名不能包括下列任何字符：  / : * ? " < > |')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>