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
          label="选房区域 外键ID">
          <a-input placeholder="请输入选房区域 外键ID" v-decorator="['chooseAreaId', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选房人姓名">
          <a-input placeholder="请输入选房人姓名" v-decorator="['chooserName', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选房人身份证号码">
          <a-input placeholder="请输入选房人身份证号码" v-decorator="['chooserId', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选房人性别">
          <a-input placeholder="请输入选房人性别" v-decorator="['chooserSex', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="安置去向">
          <a-input placeholder="请输入安置去向" v-decorator="['destination', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="省">
          <a-input placeholder="请输入省" v-decorator="['chooserProvince', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="市">
          <a-input placeholder="请输入市" v-decorator="['chooserCity', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="县">
          <a-input placeholder="请输入县" v-decorator="['chooserCounty', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="乡">
          <a-input placeholder="请输入乡" v-decorator="['chooserTownship', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="村">
          <a-input placeholder="请输入村" v-decorator="['chooserVillage', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="组">
          <a-input placeholder="请输入组" v-decorator="['chooserGroup', {}]" />
        </a-form-item>
        </a-col>
     </a-row>
     <a-row :gutter="24">
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选人组件样例1">
          <j-select-user-new v-decorator="['auditUsername1',{}]"
          :selectedDetails="auditUsers1" @callback="setAuditUser" class="userSelect"></j-select-user-new>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选人组件样例2">
          <j-select-user-new v-decorator="['auditUsername2',{}]"
          :selectedDetails="auditUsers2" @callback="setAuditUser" class="userSelect"></j-select-user-new>
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
    name: "HouseChooseChooserModal",
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
          add: "/houseChoose/houseChooseChooser/add",
          edit: "/houseChoose/houseChooseChooser/edit",
          //上传组件地址
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById',
        },
        //选人组件初始化
        auditUsername1: '',
        auditFullname1: '',
        auditUsername2: '',
        auditFullname2: '',
        selectUser: ['auditUsers1','auditUsers2'],
        auditUsers1: {
          colum: 'auditUsers1',
          value: [],
          target: [
             { to: 'auditUsername1', from: 'username' },
             { to: 'auditFullname1', from: 'realname' }
           ]
        },
        auditUsers2: {
          colum: 'auditUsers2',
          value: [],
          target: [
            { to: 'auditUsername2', from: 'username' },
            { to: 'auditFullname2', from: 'realname' }
          ]
        },
        // 上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
        // attachment: [],
        attachment: [
          {
            groupId: '',
            fileTokens: '',
            fieldName: 'attachment',
            tableName: 'oa_leave_application'
          }
        ],
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
    },
    //方法
    methods: {
      loadData(){},
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'chooseAreaId','chooserName','chooserId','chooserSex','destination','chooserProvince','chooserCity','chooserCounty','chooserTownship','chooserVillage','chooserGroup'))

		  // 初始化选人组件字段
          this.auditUsers1.value = []
          this.auditUsers2.value = []
          // 初始化选人控件
          this.initSelectMan(this,record);

		  //时间格式化

          // 初始化新任务通知
          if (this.model.notifyMethod != undefined) {
             this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
           }
        });

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

            // 选人控件字段赋值给formData
            this.uploadMan(formData,this);

            //对formData中的时间字段进行 时间格式化

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