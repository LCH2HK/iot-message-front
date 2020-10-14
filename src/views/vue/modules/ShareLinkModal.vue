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
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="链接类型">
              <a-radio-group
                v-decorator="['permission',{rules:[{required:true,message:'请选择要获取的链接类型！'}]}]"
              >
                <a-radio value="read">预览</a-radio>
                <a-radio value="edit,read" :disabled="ePermission">编辑</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="shown">
          <a-col :md="24" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="链接有效期限">
              <a-date-picker
                v-decorator="['expireTime', config]"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="链接">
                <a-input
                  :disabled='disabled'
                  v-decorator="[
                  'link',
                  {rules: [{ required: false, message: '' }]}
                  ]"
                />
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
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">生成</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <!-- 链接展示弹窗 -->
    <!-- <linkShow-modal ref="modalForm"></linkShow-modal> -->
  </a-modal>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
// import LinkShowModal from './LinkShowModal'
import pick from 'lodash.pick'
import moment from 'moment'
import qs from 'qs'
import Vue from 'vue'

export default {
  name: 'ShareLinkModal',
  // components: {
  //     LinkShowModal
  // },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      shown: true,
      // shownLink:'',
      disabled:true,
      fileId: '',
      officeKey:'',
      newLink:'http://'+window.location.host,
      parentDepartmentId: '',
      ePermission:'',
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
        generateKeyForShare: '/fileFolderFile/generateKeyForShare' // 获取链接key的接口；
      },
      config: {
        rules: [{ type: 'object', required: true, message: '请选择链接有效期限!' }]
      }
    }
  },
  methods: {
    loadData() {},
    create(record) {
      this.newLink = ''
      this.shown = true
      this.form.resetFields()
      this.visible = true
      this.fileId = record.id
      // debugger
      if(record.permission.indexOf('edit') == -1){
        this.ePermission = true
      }else{
        this.ePermission = false
      }
      console.log('record', record)
      console.log('fileId', this.fileId)
    },
    close() {
      this.$emit('close')
      this.form.resetFields()
      this.visible = false
    },
    handleOk() {
        this.form.validateFields((err,values)=>{
            if(!err){
                // console.log('values',values)
                values.fileId = this.fileId
                values.expireTime = values.expireTime ? values.expireTime.format('YYYY-MM-DD HH:mm:ss') : null
                console.log('values',values)
                let params = {
                    jsonStr: JSON.stringify(values)
                }
                postAction(this.url.generateKeyForShare, qs.stringify(params))
                .then(res => {
                if (res.success) {
                    this.officeKey = res.result
                    // debugger
                    console.log('values.permission',values.permission)
                    if(values.permission.indexOf('edit')>=0){

                        this.newLink = 'http://'+window.location.host+'/online_edit?id='+ this.fileId +'&linkKey='+this.officeKey
                    }else{
                        this.newLink = 'http://'+window.location.host+'/online_preview?id='+ this.fileId +'&linkKey='+this.officeKey
                    }
                    console.log('officeKey',this.officeKey)
                    console.log('this.newLink',this.newLink)
                    // this.handleLinkShow()
                    this.disabled = false
                    this.form.setFieldsValue({link:this.newLink});
                    // this.shownLink = this.newLink
                    this.$message.success(res.message)
                    this.$emit('ok')
                } else {
                    this.$message.warning(res.message)
                }
                })
                .finally(() => {
                this.confirmLoading = false
                // this.close()
                })
            }
        })
    },
    handleCancel() {
      this.close()
    },
    // handleLinkShow(){
    //     this.$refs.modalForm.show(this.newLink)
    //     this.$refs.modalForm.title = '链接展示'
    // }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>