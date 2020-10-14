<template>
  <div class="account-settings-info-view">
    <a-form
      formLayout="horizontal" 
      class="basic-info-form" 
      @submit="handleSubmit"
      :form="form"
    >
      <a-row :gutter="16">
        <a-col :md="24" :lg="16">
          <!-- 用户名username -->
          <a-form-item
            label="用户名"
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="[  'username', {}]" size="large"  disabled/>
          </a-form-item>
          <!-- 真实姓名 realname -->
          <a-form-item
            label="姓名"
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'realname',
                {rules: [{ required: true, message: '' },{ validator: realnameVerify }]}
              ]"
              placeholder="请输入你的姓名"
              size="large"
            />
          </a-form-item>
          <!-- 爱好hobbys -->
          <a-form-item
            label="爱好"
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'hobbies',
                {rules: [{ required: true, message: '请输入你的爱好!' }]}
              ]"
              placeholder="请输入你的爱好"
              size="large"
            />
          </a-form-item>
          <!-- 个性签名 -->
          <a-form-item
            label="个性签名"
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
          >
            <a-textarea 
              v-decorator="[
                'personalSignature',
                {rules: [{ required: true, message: '请输入你的个性签名!' }]}
              ]" 
              rows="4" 
              placeholder="请输入你的个性签名"
            />
          </a-form-item>
          <!-- 所属小组 -->
          <a-form-item
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
            label="所属小组"
            has-feedback
          >
            <a-select
              size="large"
              v-decorator="[
                'groupName',
                {rules: [{ required: true, message: '请选择你的所属小组!' }]}
              ]"
              placeholder="请选择你的所属小组"
            >
              <a-select-option :value="item.value" v-for="(item,index) in groupOptions" :key="index">{{item.title}}</a-select-option>
            </a-select>
          </a-form-item>
          <!-- 手机号码 -->
          <a-form-item
            label="手机号码"
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
          >
            <a-input
              size="large"
              v-decorator="[
                'phone',
                {
                  rules: [{ required: true, message: '' },{validator: phoneVerify }],
                }
              ]"
              :disabled="disabled"
            >
            </a-input>
          </a-form-item>
          <!-- 更换手机号码时需要获取验证码确认： -->
          <a-form-item
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
            label="验证码"
            extra="更换手机号码后，请务必获取验证码确认"
            v-if="phoneChange"
          >
            <a-row :gutter="8">
              <a-col :span="12">
                <a-input
                  v-decorator="[
                    'identifyCode',
                    {rules: [{ required: true, message: '请输入你获取的验证码！' }]}
                  ]"
                />
              </a-col>
              <a-col :span="12">
                <a-button
                  @click="sendIdentifyCode"
                  :disabled="state.smsSendBtn"
                  v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                >
                  获取验证码
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <!-- 电子邮件 -->
          <a-form-item
            label="电子邮件"
            :labelCol="labelCol" 
            :wrapperCol="wrapperCol"
          >
            <a-input 
              v-decorator="[
                'email',
                {
                  rules: [{ required: true, message: '请输入你的邮箱!' }],
                }
              ]" 
              placeholder="exp@admin.com" size="large"
            />
          </a-form-item>

          <!-- 按钮操作区域 -->
          <a-row :gutter="24">
            <a-col :span="24" offset="7">
              <a-form-item class="btnClass">
                <a-button
                  @click="handleSubmit"
                  icon="check"
                  type="primary"
                  class="confirm"
                  style="{margin-left:'2px'}"
                >提交</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
        <!-- 上传头像 -->
        <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
          <!-- <div class="ant-upload-preview"  @click="$refs.modal.edit(userBasicData)" >
            <a-icon type="cloud-upload-o" class="upload-icon"/>
            <div class="mask">
              <a-icon type="plus" />
            </div>
            <img :src="getAvatar"/>
          </div> -->
          <a-form-item>
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <img v-if="pic" :src="getAvatar" alt="头像" style="max-width: 200px; height: 200px">
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传新头像</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 目前只用上传头像，暂时不用vue-cropper图片裁剪功能 -->
    <!-- <avatar-modal ref="modal"></avatar-modal> -->
  </div>
</template>

<script>
  // import AvatarModal from './AvatarModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import {initDictOptions, filterDictText,JDictSelectTag} from '@/components/dict/JDictSelectUtil'
  import {httpAction, getAction,postAction,getActionUrl} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import qs from 'qs'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  export default {
    name: "BaseSetting",
    mixins:[CmpListMixin],
    // mixins:[CmpListMixin],ipconfig
    // components: {
    //   AvatarModal
    // },
    data () {
      return {
        userBasicData: new Object(), //用户基本信息;
        // vue-cropper
        preview: {},
        model:'',
        pic:'',
        uploadLoading: false,
        uploadTip:'',//控制
        groupOptions:"",
        phoneNumber: '',//用于号码是否改变的判断；
        /*  
        option: {//vue-cropper使用数据；
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },
        */
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: this.$form.createForm(this),
        url:{ //接口；
          info:"/sys/user/queryByUsername",//加载页面数据；
          edit:"/sys/user/edit2",//编辑提交；
          add:"/file/uploadFile/add",//图片上传接口；
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',//文件上传地址；
          imgerver: window._CONFIG['domianURL']+"/sys/common/view",//图片预览地址；
          identifyCode:"/sys/sendMessage/updatePhone",//获取验证码；
          verifyUniPhone:"/sys/user/verifyUniquePhone",//校验号码在数据库中是否唯一；
        },
        headers:{},
        fileList: [],
        attachment: [//附件；
          {
            groupId: '',
            fileTokens: '',
            fieldName: 'attachment',
            tableName: '',
          }
        ],
        disabled:false,
        phoneChange:false,//判断手机号是否已存在，并控制获取验证码项的显示；
        state: {//控制获取短信验证码按钮状态；
          time: 60,
          smsSendBtn: false
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = { 'X-Access-Token': token };
      // this.attachment[0].fileTokens = '';

      //通过用户名从后台获取用户信息:
      var a = localStorage.getItem('pro__Login_Username'); // 获取当前用户的用户名；
      var b =  JSON.parse(a);
      // 从后端拉取数据并回填：
      let httpurl ="";
      httpurl = httpurl + this.url.info +"?username="+ b.value;
      let method = "get";
      let params = {};
      let that = this;//将当前作用域的this赋给that，以供下方的函数在内部使用；
      httpAction(httpurl,params,method).then((res)=>{
        console.log(res,'页面初加载，从后端返回的');
        if(res.success){
          that.userBasicData= res.result;
          that.form.resetFields();
          that.model = Object.assign({}, that.userBasicData);
          console.log("222",that.model)
          // that.visible = true;
          this.$nextTick(() => {
            that.form.setFieldsValue(pick(that.model,'username','realname', 'personalSignature','groupName','email','phone','hobbies'));
          });
            this.phoneNumber = that.model.phone;
            if(that.model.avatar){
              this.pic=true;
            }
        }else{
          that.$message.warning(res.message);
        }
      })        
    },
    mounted(){
      this.initDictData()
    },
    computed:{
      uploadAction() {//上传地址；
        return this.url.fileUpload;
      },
      getAvatar(record) {// 获取头像;
        if(record.avatar){
          return this.url.imgerver +"/"+ record.avatar
        }else{
          return this.url.imgerver +"/"+ this.model.avatar;
        }
          // if(this.model.avatar){
          //   // if(this.model.avatar.indexOf("blob") ==0){
          //   //   return this.model.avatar;
          //   // }else{
          //   //   return this.url.imgerver +"/"+ this.model.avatar;
          //   // }
          // }
      }
    },
    methods: {
      initDictData() { //根据字典Code, 初始化字典数组
        initDictOptions("group_name_list", null).then((res) => {
          if (res.success) {
            console.log("123",res.result);
            this.groupOptions = res.result;
          }
        })
      },
      beforeUpload (file) { //上传图片类型判断；
        var fileType = file.type;
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片');
          return false;
        }
      },
      loadData(){},
      handleChange(info) { //头像上传处理函数；
      
        //上传文件改变时的状态，根据返回值中file的status，作出相应提示
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          console.log("info.file",info.file);
          var response = info.file.response;
          this.uploadLoading = false;
          console.log(response,'返回');
          if(response.success){
            this.model.avatar = response.result.uploadFile.savePath;
            //上一行代码，取到了头像上传成功后返回的JSONObject中的uploadFile对象的savePath属性，即得到了文件的保存路径；
            console.log('头像地址',this.model.avatar);
            // this.userBasicData.avatar = response.result.uploadFile.savePath;
          }else{
            this.$message.warning(response.message);
          }
        }
      },
      realnameVerify(rule, val, callback) { // 真实姓名校验；
        let value = val ? val : ''
        let reg = /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/
        if(reg.test(value)){
          callback()
        }else if(value.length == 0){
          callback('请输入你的姓名！')
        }else{
          callback('请输入正确的姓名！')
        }
      },
      phoneVerify(rule, val, callback) {  // 手机号码校验；
        // 电话号码格式校验：
        let value = val ? val : '';
        let reg = /^1[3456789]\d{9}$/;
        console.log('userdata',this.userBasicData);
        let userId = this.userBasicData.id;
        console.log('userid',userId);
        let params={
          phone:value,
          id:userId,
          };
        //校验号码在后台数据库中是否重复：
        if (reg.test(value)) {
          getAction(this.url.verifyUniPhone,params).then((res)=>{
            if(!res.success){
              this.phoneChange= false;
              callback(res.message);
            }else if(this.phoneNumber==value){
              this.phoneChange= false;
              callback();
            }else{
              this.phoneChange= true;//显示获取验证码项；
              callback();
            }
          });
        } else if (value.length == 0) {
          callback('请输入你的手机号码！');
        } else {
          callback('请输入格式正确的手机号码！');
        }
      },
      handleSubmit () { //提交;
        const that = this;
        // 触发表单验证:
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            httpurl+=this.url.edit;
            method = 'post';
            let formData = Object.assign(this.model, values);//
            console.log(formData);
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
              }else{
                that.$message.warning(res.message);
              }
            })
          }else{
             this.$message.success(err);
          }
        })
      },
      sendIdentifyCode(){ //向手机发送验证码；
        // let params={};
        // httpAction(this.url.identifyCode,params,'post').then((res)=>{
        //   if(res.success){
        //     this.$message.success(res.message);
        //   }else{
        //     this.$message.warning(res.message);
        //   }
        // })
        this.disabled=true;
        this.form.validateFields(['phone'], { force: true }, (err, val) => {
          if (!err) {
            // 填写完成，将按钮设置成不可点击，倒计时60秒；
            this.state.smsSendBtn = true;
            let interval = window.setInterval(() => {
              if (this.state.time-- <= 0) {
                this.state.time = 60;
                this.state.smsSendBtn = false;
                window.clearInterval(interval);
              }
            }, 1000);
            let params = Object.assign({}, val);//获取填写手机号;
            let httpurl = this.url.identifyCode;
            params = qs.stringify(params);//将参数形式转换为JSON字符串;
            const hide = this.$message.loading('验证码发送中..', 0);//提示信息;
            postAction(httpurl, params).then(res => {// 发送请求:
              setTimeout(hide, 2500);// 弹出提示信息;
              // 根据返回结果，弹出提示框:
              if (res.success) {
                this.$notification['success']({
                  message: '提示',
                  description: res.message + '请注意查收手机短信！',
                  duration: 8,
                })
              } else {
                this.$notification['error']({
                  message: '获取失败',
                  description: res.message,
                  duration: 8,
                })
              };
            }).catch(err => {
              setTimeout(hide, 1);
              clearInterval(interval);
              this.state.time = 60;
              this.state.smsSendBtn = false;
              this.$notification['error']({
                message: '获取失败',
                description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
                duration: 4,
              });
            })
          }
        })
      },
    },
     
  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
  /*
  //使用vue-cropper时的头像样式：
  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }
  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;
      &:hover {
        opacity: 1;
      }
      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }
    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  */
</style>