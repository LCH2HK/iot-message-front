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
      <a-popover title="命名规则" trigger="click" placement="bottomLeft">
        <template slot="content">
          <p>·在线文档支持的文件类型及后缀名包括：</p>
          <p>(1)text：.doc .docm .docx .dot .dotm .dotx .epub .fodt .htm .html .mht .odt .ott .pdf .rtf .txt .djvu .xps</p>
          <p>(2)spreadsheet: .csv .fods .ods .ots .xls .xlsm .xlsx .xlt .xltm .xltx</p>
          <p>(3)presentation: .fodp .odp .otp .pot .potm .potx .pps .ppsm .ppsx .ppt .pptm .pptx</p>
        </template>
        <a>请点击此处查看在线文档支持的文件类型及后缀名</a>
      </a-popover>
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="授予权限">
              <a-checkbox-group
                v-decorator="[
                    'permission', 
                    {rules: [{ required: true, message: '请选择文件夹权限' }]}]"
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
        <!-- 文件上传 -->
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item class="upload" label="上传文档">
              <a-upload
                :action="uploadAction"
                listType="picture"
                :headers="headers"
                :fileList="fileList"
                :beforeUpload="beforeUpload"
                @change="handleChange"
                :remove="handleRemove"
                @preview="handlePreview"
                :disabled="disabled"
                class="upload-list-inline"
                v-decorator="[
                    'attachment', 
                    {rules: [{ required: true, message: '请上传文件！' }]}]"
              >
                <a-button>
                  <a-icon type="upload" />上传文档
                </a-button>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
              <br />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
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
              >{{ model.status == undefined ? '提交' : '确定' }}</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import qs from 'qs'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { format } from 'path'

export default {
  name: 'UploadFileModal',
  components: {
    JDictSelectTag
  },
  mixins: [CmpListMixin],
  data() {
    return {
      title: '操作',
      visible: false,
      parentId: '',
      parentDepartmentId: '',
      model: {},
      disabled: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        addOnlineFile: '/online/onlineFile/addOnlineFile', //上传
        submit: '/online/onlineFile/submitOnlineFile', //提交
        fileUpload: window._CONFIG['domianURL'] + '/online/onlineFile/addOnlineFile?isSave=0'
      },
      headers: null,
      previewImage: '',
      previewVisible: false,
      fileList: [],
      attachment: [
        {
          groupId: '',
          fileTokens: '',
          fieldName: 'attachment',
          tableName: 'doc_main'
        }
      ]
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.attachment[0].fileTokens = ''
  },
  computed: {
    uploadAction() {
      return this.url.fileUpload
    }
  },
  methods: {
    loadData() {},
    add(currentFolder) {
      // debugger
      this.parentId = currentFolder.id
      this.parentDepartmentId = currentFolder.departmentId || currentFolder.fileParentDepartmentId
      console.log('currentFolder', currentFolder)
      this.edit({})
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'fileName',
          )
        )
      })
    },
    beforeUpload(file) {
      //上传文件类型判断；
      let suffixName = file.name.split('.')
      let last = suffixName[suffixName.length - 1]
      console.log('hzm', last)
      let tp =
        'doc,docm,docx,dot,dotm,dotx,epub,fodt,htm,html,mht,odt,ott,pdf,rtf,txt,djvu,xps,csv,fods,ods,ots,xls,xlsm,xlsx,xlt,xltm,xltx,fodp,odp,otp,pot,potm,potx,pps,ppsm,ppsx,ppt,pptm,pptx'
      let ap = tp.split(',')
      if (ap.indexOf(last) < 0) {
        this.$message.warning('请上传受支持类型的文件！')
        return false
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      this.disabled = false
    },
    close() {
      this.$emit('close')
      this.form.setFieldsValue({permission:[]});
      this.fileList = []; //重置上传项；
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        console.log('value', values)
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = 'post'
          httpurl += this.url.submit

          let formData = {}
          for (let i = 0; i < that.attachment.length; i++) {
            formData = that.attachment[i]
          }
          formData.fileParentId = this.parentId
          formData.fileParentDepartmentId = this.parentDepartmentId;
          console.log(values.permission,'多选框数值')
          formData.filePermission = values.permission.join(',')
          console.log('values',values)
          delete formData.uploadTime
          delete formData.updateTime
          delete formData.createTime
          console.log(httpurl, formData, '就')
          httpAction(httpurl, qs.stringify(formData), method)
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
    handleChange(info) {
      //调用改变方法
      this.handleChange1(info, this, 0)
      this.disabled = true
    },

    handleChange1(info, that, k) {
      if (info.file.status === 'removed') {
        that.attachment[k].fileTokens = that.attachment[k].fileTokens.replace(
          info.file.response.result.fileTokens + ',',
          ''
        )
      }
      that.fileList = info.fileList
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        if (response.success) {
          // if (that.attachment[k].fileTokens == '') {
          //   that.attachment[k].fileTokens += response.result.fileTokens;
          // } else {
          //   that.attachment[k].fileTokens += "," + response.result.fileTokens;
          // }
          that.attachment[k] = response.result
        } else {
          that.$message.warning(response.message)
          return false
        }
      }
    },

    handlePicCancel() {
      this.previewVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>