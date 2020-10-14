<template>
  <a-modal
    :title="title"
    :footer="false"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务名称">
          <a-input placeholder="任务名称" v-decorator="['taskSubject', {}]" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="环节名称">
          <a-input placeholder="环节名称" v-decorator="['nodeName', {}]" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="原执行人">
          <a-input placeholder="原执行人" v-decorator="['assigneeFullname', {}]" disabled/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新执行人">
          <j-select-user-new :selectedDetails="auditUsers1" @callback="setAuditUser" class="userSelect"></j-select-user-new>
        </a-form-item>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              class="btnClass"
            >
              <a-button @click="handleCancel" icon="close" style="margin-right:10px" class="cancel">取消</a-button>
              <a-button @click="handleOk" icon="check" type="primary" class="confirm">提交</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import { httpAction, getAction } from '@/api/manage'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { format } from 'path';
  import qs from 'qs'

  export default {
    name: "TaskModal",
    components: {
      JSelectUserNew
    },
    mixins: [CmpListMixin],
    data () {
      return {
        value: '',
        taskId: '',
        radioStyle: '',
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },  
        url: {
          add: '/flowable/task/delegate'
        },
        assigneeName: '',
        assignee: '',
        selectUser: ['auditUsers1'],
        auditUsers1: {
          colum: 'auditUsers1',
          value: [],
          target: [
            { to: 'auditUsername1', from: 'username' },
            { to: 'auditFullname1', from: 'realname' }
          ]
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
        if(record.formData !== undefined) {
          this.model = Object.assign({},record.flowData.processVar, record.flowData, record.formData, {taskId: record.taskId});
        } else {
          this.model = Object.assign({}, record);
        }
        this.visible = true;
        this.taskId = record.taskId;
        this.auditUsers1.value = [];
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,
          'assigneeFullname',
          'taskSubject',
          'nodeName',
          ))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.assignee = '';
      },
      onChange(){
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            // 选人控件传值
            let data = {};
            this.uploadMan(data,that);
            if (data.auditUsername1 == undefined) {
              that.confirmLoading = false;
              that.$message.warning('请选择委托人员！');
              return;
            }
            that.confirmLoading = true;
            let httpurl = ''
            let method = ''
            httpurl += this.url.add
            method = 'get'
            let formData = Object.assign(this.model, values, {api: this.value});

            formData = {
              assignee: data.auditUsername1,
              taskId: this.taskId
            }
            // formData = qs.stringify(formData)
            getAction(httpurl, formData).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.confirmLoading = false;
                that.close();
              }else{
                that.confirmLoading = false;
                that.$message.warning(res.message);
              }
            }).finally(() => {
              // that.confirmLoading = false;
              // that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },
      loadData() {}
    }
  }
</script>

<style lang="less" scoped>
  .radio-group{
    margin-left: 160px;
  }
   // 按钮及边框样式
  .ant-form-item-label {
    line-height: 40px;
  }
  .table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item > :global(.ant-form-item-label) {
        line-height: 40px;
      }
    }
  }
  .ant-input {
    height: 40px;
  }
  textarea.ant-input {
    height: auto;
  }
  /* 下拉选框 */
  .ant-select {
    /* height: 40px; */
    :global(.ant-select-selection--single) {
      height: 40px;
      :global(.ant-select-selection__rendered) {
        line-height: 40px;
      }
    }
  }
  .ant-btn-primary {
    height:40px;
  }
  .ant-dropdown-trigger {
    height: 40px;
  }
  .ant-card-body .table-operator {
    display: flex;
    margin-bottom: 20px;
    vertical-align: top;
    height: 40px;
  }

  .ant-card-body .table-operator>div {
    flex: 1;
    margin-left: 14px;
  }

  .ant-card-body .table-operator .ant-alert-info {
    border: unset;
    border-radius:4px;
    background: rgba(109,98,255,0.1);
  }

  //按钮样式
  .btnClass {
    margin-top: 20px;
    :global(.ant-form-item-control-wrapper) {
      width: 100%;
      text-align: center;
      button {
        margin: 0;
        padding: 0;
        border: 1px solid transparent;  //自定义边框
        outline: none;  //消除默认点击蓝色边框效果
      }
      .cancel {
        min-width:96px;
        height:40px;
        background:rgba(238,238,238,1);
        border-radius:4px;
        color:rgba(51,51,51,1);
        padding: 5px;
      }
      .confirm {
        min-width:96px;
        height:40px;
        // background:rgba(109,98,255,1);
        border-radius:4px;
        // color: rgba(255,255,255,1);
        padding: 5px;
      }
    }
  }
</style>