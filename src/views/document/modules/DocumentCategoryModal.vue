<template>
  <a-modal
    :title="title"
    :footer="null"
    :width="700"
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

        <a-col :md="24" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标准类别名称">
          <a-input placeholder="请输入标准类别名称" v-decorator="['category', {}]" />
        </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :md="24" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上级类别">
          <a-select style="width: 120px" @change="handleChange" v-decorator="['pid', {}]">
            <a-select-option v-for="item in items" :value="item.id" v-bind:key="item.id">{{item.category}}</a-select-option>
          </a-select>
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
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import qs from 'qs'
  import { getAction } from '@/api/manage'

  export default {
    name: "DocumentCategoryModal",
    //组件应用定义

    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins:[CmpListMixin],
    // 数据定义
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        queryParam: {
          category:'',
          pid:'',
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
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
        //下拉框数据来源
        items:[],
        validatorRules:{
        },
        url: {
          add: "/documentCategory/documentCategory/add",
          edit: "/documentCategory/documentCategory/edit",
          all: "/documentCategory/documentCategory/all",
          CategoryOne:"/documentCategory/documentCategory/CategoryOneList",
          CategoryTwoByPid:"/documentCategory/documentCategory/CategoryTwoByPid",
        },
      }
    },
    // 钩子函数
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN)
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
          getAction(this.url.CategoryOne, null).then((res) => {
            if (res.success) {
              this.items = res.result;
              // this.loading = false;
            } else {
              this.$message.warning(res.message);
              // this.loading = false;
            }
          });
        this.edit({});
      },
      edit (record) {

        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'category','pid'))

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

      handleCancel () {
        this.close()
      },

      handleChange(value) {
        console.log(`selected ${value}`);
      },

    }
  }
</script>

<style lang="less" scoped>
    @import '~@assets/less/modal.less';
</style>