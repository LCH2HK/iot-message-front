<template>
  <a-modal
    :title="title"
    :footer="null"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;">

    <a-spin :spinning="confirmLoading">
      <a-form 
        :form="form"
        enctype="multipart/form-data"
      >
      <a-row :gutter="24">

        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文件名">
          <a-input placeholder="请输入文件名" v-decorator="['fileName', validatorRules.templateName]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文件类型">
          <a-input placeholder="请输入文件类型" v-decorator="['fileType', {}]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="保存路径">
          <a-input placeholder="请输入保存路径" v-decorator="['savePath', {}]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="MD5值">
          <a-input placeholder="请输入MD5值" v-decorator="['md5', {}]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上传时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'uploadTime', {}]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上传者">
          <a-input placeholder="请输入上传者" v-decorator="['uploadUser', validatorRules.templateUser]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文件大小">
          <a-input-number v-decorator="[ 'fileSize', {}]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="下载次数">
          <a-input-number v-decorator="[ 'downloadTimes', {}]" />
        </a-form-item>
        </a-col> -->
        <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文件用途">
          <a-input placeholder="请输入文件用途(1：在线编辑)" v-decorator="['fileUsage', validatorRules.templateUsage]" />
        </a-form-item>
        </a-col> -->
     </a-row>
     <!-- 文件上传 -->
     <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="upload" label="上传附件">

              <a-upload
                :action="uploadAction"
                listType="picture"
                :headers="headers"
                :fileList="fileList"
                @change="handleChange"
                @preview="handlePreview"
                :multiple="true"
                class="upload-list-inline"
              >
                <a-button>
                  <a-icon type="upload" />上传
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
              <a-button @click="handleCancel" icon="close" style="margin-right:10px" class="cancel">取消</a-button>
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">{{ model.status == undefined ? '提交' : '确定' }}</a-button>
            </a-form-item>
           </a-col>
        </a-row>
     </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import qs from 'qs'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { CmpListMixin } from '@/mixins/CmpListMixin'

  export default {
    name: "UploadFileModal",
    components: {
       JDictSelectTag
    },
    mixins:[CmpListMixin],
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
      //   validatorRules: {
      //   templateName: { rules: [{ required: true, message: '请输入文件名!' }] },
      //   templateUsage: { rules: [{ required: true, message: '请输入文件用途!' }] },
      //   templateFile: { rules: [{ required: true, message: '请添加上传文件!' }] }
      // },
        url: {
          //add: "/file/uploadFile/add",
          addOnlineFile: "/file/uploadFile/addOnlineFile",
          edit: "/file/uploadFile/edit",
          // fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/addOnlineFile'
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
    created () {
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'fileName','fileType','savePath','md5','uploadUser','fileSize','downloadTimes','fileUsage'))
		  //时间格式化
          this.form.setFieldsValue({uploadTime:this.model.uploadTime?moment(this.model.uploadTime):null})
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = 'post';
            if(!this.model.id){
              httpurl+=this.url.addOnlineFile;
            }else{
              httpurl+=this.url.edit;
            }
            let formData = Object.assign(this.model, values);
            // 上传组件
            for (let i = 0; i < that.attachment.length; i++) {
              formData.attachment = that.attachment[i].groupId;
            }
            //时间格式化
            formData.uploadTime = formData.uploadTime?formData.uploadTime.format('YYYY-MM-DD HH:mm:ss'):null;

            console.log(formData,'就')
            httpAction(httpurl,qs.stringify(formData),method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },
      handleChange(info) {
        //调用改变方法
        this.handleChange1(info, this, 0);
      },
      handlePicCancel() {
        this.previewVisible = false;
      },
    }
  }
</script>

<style lang="less" scoped>
    @import '~@assets/less/modal.less';
</style>