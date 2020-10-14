<template>
  <a-modal
    :footer="null"
    :title="null"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :closable="false"
    cancelText="关闭"
    v-dialogDrag
    :maskClosable="false"
    style="top:5%;">
    <div class="title">
      <div>
        会议室管理
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="margin-top: 25px">
      <a-row :gutter="24">
        <a-col :md="24" :sm="8">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="会议室名称">
            <a-input placeholder="请输入会议室名称" v-decorator="['roomName', validatorRules.roomName]" />
          </a-form-item>
        </a-col>
        <a-col :md="24" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="容纳人数">
          <a-input-number
            placeholder="请输入容纳人数"
            v-decorator="[ 'containNum', validatorRules.containNum]" size="large" style="width: 100%" />
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

  export default {
    name: "MeetingRoomListModal",
    components: {
       JDictSelectTag
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          roomName:{rules: [{ required: true, message: '请输入会议室名称!' }]},
          containNum:{rules: [{ required: true, message: '请输入最大容纳人数!' },{validator: this.containNumCheck}]},
        },
        url: {
          add: "/meetingRoom/meetingRoomList/add",
          edit: "/meetingRoom/meetingRoomList/edit",
        },
      }
    },
    created () {
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
          this.form.setFieldsValue(pick(this.model,'containNum','roomName'))
		  //时间格式化
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
              httpurl+=this.url.add;
            }else{
              httpurl+=this.url.edit;
            }
            let formData = Object.assign(this.model, values);
            //时间格式化

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
          }
        })
      },
      handleCancel () {
        this.close()
      },
      containNumCheck (rule, value, callback) {
        const r = /^\+?[1-9][0-9]*$/;
        if (r.test(value)){
          callback();
        }else if (! r.test(value)) {
          callback("请输入数字!");
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    @import '~@assets/less/modal.less';
</style>