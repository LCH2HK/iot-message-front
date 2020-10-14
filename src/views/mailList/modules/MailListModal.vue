<template>
  <a-modal
    :title="title"
    :footer="null"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :okButtonProps="model.btns ? { style: 'display:none' } : {}"
    :cancelButtonProps="model.btns ? { style: 'display:none' } : {}"
    v-dialogDrag
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
          label="姓名">
          <a-input placeholder="请输入姓名" v-decorator="['realname', validatorRules.realname]" />
        </a-form-item>
        </a-col>

        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="电子邮件">
          <a-input placeholder="请输入电子邮件" v-decorator="['email', validatorRules.email]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="电话">
          <a-input placeholder="请输入电话" v-decorator="['phone', validatorRules.phone]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门名称">
          <a-input placeholder="请输入部门名称" v-decorator="['departName', validatorRules.departName]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户类型">
          <!--<a-input placeholder="请输入用户类型" v-decorator="['userType', validatorRules.userType]" />-->
          <a-select placeholder="请选择用户类型" v-decorator = "['userType', validatorRules.userType]">
            <a-select-option value="0">外围</a-select-option>
            <a-select-option value="1">企业</a-select-option>
          </a-select>
        </a-form-item>
        </a-col>
        <!--<a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门code">
          <a-input placeholder="请输入部门code" v-decorator="['orgCode', {}]" />
        </a-form-item>
        </a-col>-->
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="办公号码">
          <a-input placeholder="请输入办公号码" v-decorator="['officePhone', validatorRules.officePhone]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="办公地址">
          <a-input placeholder="请输入办公地址" v-decorator="['address', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="小组名">
          <a-input placeholder="请输入小组名" v-decorator="['groupName', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="头像">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{'isup':1}"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <img v-if="picUrl" :src="getAvatarView()" alt="头像" style="max-width: 300px; height: 104px">
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
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
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import qs from 'qs'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "MailListModal",
    components: {
       JDictSelectTag
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        uploadLoading:false,
        confirmLoading: false,
        picUrl: '',
        headers:{},
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
        validatorRules:{
          realname:{rules: [{ required: true, message: '请输入用户名称!' }]},
          phone:{rules: [{validator: this.validatePhone}]},
          email:{rules: [{type: 'email', message: '请输入正确格式的电子邮箱!',}]},
          roles:{}
          //  sex:{initialValue:((!this.model.sex)?"": (this.model.sex+""))}
        },
        url: {
          add: "/mailList/mailList/add",
          edit: "/mailList/mailList/edit",
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload",
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",
        },
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    computed: {
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },

    methods: {
      validatePhone(rule, value, callback){
        if(!value || new RegExp(/^1[3|4|5|6|7|8][0-9]\d{8}$/).test(value)){
          /*var params = {
            id:this.model.id,
            username:value
          };
          checkPhone(params).then((res)=>{
            if(res.success){
              callback();
            }else{
              callback("手机号码与其他用户重复！");
            }
          });*/
          callback();
        }else{
          callback("请输入正确格式的手机号码!");
        }
      },
      add () {
        this.picUrl = '';
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'realname','email','phone','departName','userType','officePhone','address','groupName'))
		  //时间格式化
          this.form.setFieldsValue({birthday:this.model.birthday?moment(this.model.birthday):null})
        });
        if (record.avatar) {
          this.picUrl = true;
          /*this.visible =true;*/
        }

      },
      close () {
        this.$emit('close');
        this.visible =false;
        this.picUrl = '';

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
              httpurl+=this.url.add;
            }else{
              httpurl+=this.url.edit;
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.birthday = formData.birthday?formData.birthday.format('YYYY-MM-DD HH:mm:ss'):null;

            console.log(formData)
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



          }else{
            console.log(err);
          }
        })
      },
      handleCancel () {
        this.close()
      },
      beforeUpload: function(file){
        var fileType = file.type;
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片');
          return false;
        }
        //TODO 验证文件大小
      },
      handleChange (info) {
        this.picUrl = "";
        if (info.file.status === 'uploading') {
          this.uploadLoading = true
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response;
          this.uploadLoading = false;
          console.log(response);
          if(response.success){
            this.model.avatar = response.message;
            this.picUrl = "Has no pic url yet";
          }else{
            this.$message.warning(response.message);
          }
        }
      },
      getAvatarView(record){

        if (record == undefined) {
          return this.url.imgerver +"/"+ this.model.avatar;
        } else {
          return this.url.imgerver +"/"+ this.record.avatar;
        }
        return this.url.imgerver +"/"+ this.record.avatar;

      }
    }
  }
</script>

<style lang="less" scoped>
    @import '~@assets/less/modal.less';
</style>