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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="文件名">
              <a-input
                placeholder="请输入文件名称前缀"
                v-decorator="[
                  'fileName', 
                  {rules: [{ required: true, message: '' },{ validator: fileNameVerify }]}
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
                <a-tooltip title="此处权限指本部门其他人员对此文件的权限">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <a-checkbox-group
                v-decorator="[
                    'permission', 
                    {rules: [{ required: true, message: '请选择本部门其他人员对此文件夹权限' }]}]"
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
  name: 'CreateFileModal',
  data() {
    return {
      title: '操作',
      currentType:'', //记录当前文件的类型
      option: '', // 记录当前操作类型；
      visible: false,
      model: {},
      shown: false, // 控制‘权限checkbox-group’的显隐；
      nameShown: false, //控制‘文件名input’的显隐；
      option:'',
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
        addEmptyOnlineFile: '/online/onlineFile/addEmptyOnlineFile', //新建文件`
        checkNameAndType: '/online/onlineFile/checkNameAndType',
        renameOnlineFile: '/online/onlineFile/renameOnlineFile', //文件重命名
        permissionManage: '/fileFolderFile/filePermission/add',
        getDepFilePermission:'/fileFolderFile/getDepartmentFilePermission' // 获取当前文件对部门的权限
      }
    }
  },
  methods: {
    loadData() {},
    add(currentFolder,arg) {
      this.nameShown = true
      this.parentId = currentFolder.id
      this.option = arg
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
      this.parentId = record.fileParentId
      }
      console.log('record',record)
      this.form.resetFields()
      this.form.setFieldsValue({permission:[]});
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ fileName: this.model.fileNamePrefix })
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
          console.log('values',values)
          // debugger
          that.confirmLoading = true
          let httpurl = ''
          if (!this.model.id) {
            httpurl += this.url.addEmptyOnlineFile
            if(this.option == 'docx'){
              values.fileName += '.docx'
            }else{
              values.fileName += '.xlsx'
            }
            values.fileParentId = this.parentId
            values.fileParentDepartmentId = this.parentDepartmentId
            values.permission = '' //后端控制权限初始赋值；
            values.directoryType = this.currentType
          } else if(this.option == 'reAccredit'){
            httpurl += this.url.permissionManage
            values.type = 'department'
            values.fileIds = this.model.id.split(',')
            values.departmentIds = this.parentDepartmentId.split(',')
            values.permission = values.permission.join(',') // 数组转字符串；
          }else {
            if(this.shown == true){
              values.filePermission = values.permission.join(',')
            }else{
              let suffixName = this.model.fileName.split('.')
              let last = suffixName[suffixName.length - 1]
              if(last == 'docx'){
                values.fileName += '.docx'
              }else{
                values.fileName += '.xlsx'
              }
              values.fileParentId = this.parentId
              httpurl += this.url.renameOnlineFile
              this.model = { id: this.model.id }
            }
            
          }
          let formData = Object.assign(this.model, values)

          // console.log('当前formdata为：', formData)
          // debugger
          postAction(httpurl, qs.stringify(formData))
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
    fileNameVerify(rule, val, callback) {
      let value = val ? val : ''
      let reg = /^[^\/\\\:\*\?\"\<\>\|\\]{1,255}$/
      let formData = {
        fileName: value,
        fileParentId: this.parentId
      }
      if (reg.test(value)) {
        getAction(this.url.checkNameAndType, formData).then(res => {
          if (!res.success) {
            callback(res.message)
          } else {
            callback()
          }
        })
        callback()
      } else if (value.length == 0) {
        callback('请输入文件名！')
      } else {
        callback('文件名不能包括下列任何字符：  / : * ? " < > |')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>