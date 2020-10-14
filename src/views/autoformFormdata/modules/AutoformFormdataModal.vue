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
      <a-form :form="form">
      <a-row :gutter="24">

        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="表单名称">
          <a-input placeholder="请输入表单名称" v-decorator="['formName', {}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="表单类型">
          <a-input placeholder="请输入表单类型" v-decorator="['formType', {}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="表单数据">
          <a-input placeholder="请输入表单数据" v-decorator="['formData', {}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模板id">
          <a-input placeholder="请输入模板id" v-decorator="['htmlId', {}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模板名称">
          <a-input placeholder="请输入模板名称" v-decorator="['htmlName', {}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
        </a-form-item>
        </a-col>
     </a-row>
	    <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">{{ model.status == undefined ? '提交' : '保存' }}</a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
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
  import moment from "moment"
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import qs from 'qs'

  export default {
    name: "AutoformFormdataModal",
    //组件应用定义
    components: {
       JDictSelectTag,
       JSelectUserNew
    },
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins:[CmpListMixin],
    // 数据定义
    data () {
      return {
        title:"操作",
        visible: false,
        nodeId: '',
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 2 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 22 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/autoformFormdata/autoformFormdata/add",
          edit: "/autoformFormdata/autoformFormdata/edit",
          //上传组件地址
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById',
        },
        // 上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
        attachment: [
        ]
      }
    },
    // 钩子函数
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      this.attachment[0].fileTokens = ''
    },
    // 计算属性
    computed: {
      uploadAction: function() {
        return this.url.fileUpload
      },
      disabledBtn() {
        return this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看' ? this.blank : this.handleChange
      }
    },
    //方法
    methods: {
      loadData(){},
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        if (record.nodeId != undefined) {
          this.nodeId = record.nodeId;
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'formName','formType','formData','htmlId','htmlName'))

		  //时间格式化

          // 初始化新任务通知
          if (this.model.notifyMethod != undefined) {
             this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
           }
        });
        // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
        let that = this;
        if (that.attachment.length != 0) {
        let arr = [];
        if (JSON.stringify(that.model) == "{}") {
           this.initUpload(that,0)
        } else {
          for (let j in that.model){
          if (j) {
            if (typeof(j) != Object) {
               if (j.indexOf('Attachment') != -1) {
                  for (let i = 0;i < that.attachment.length;i++){
                     this.initUpload(that,i,that.model[j])
                  }
               }
             }
           }
         }
         }
         }

      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.fileList = []
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let actionUrl = '';
            let method = 'post';
            //判断操作类型，新增或者编辑
            if(!this.model.id){
              actionUrl+=this.url.add;
            }else{
              actionUrl+=this.url.edit;
            }
            // 表单数据赋值给formData
            let formData = Object.assign(this.model, values);

            //对formData中的时间字段进行 时间格式化

            if (that.attachment.length == 1) {
               strFormData[that.attachment[0].fieldName] = that.attachment[0].groupId;
            } else {
               for (let i = 0; i < that.attachment.length; i++) {
                 strFormData[that.attachment[i].fieldName] = that.attachment[i].groupId
               }
            }
            //发起提交或保存请求
            httpAction(actionUrl,qs.stringify(formData),method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning('操作失败');
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleChange(info) {
        //调用改变方法
        this.handleChange1(info, this, 0)
      },
      handlePicCancel() {
        this.previewVisible = false
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>
    @import '~@assets/less/modal.less';
</style>