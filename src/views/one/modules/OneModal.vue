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
          label="数据源"
          >
          <!-- <a-input placeholder="请输入数据源" v-decorator="['dbName', {}]" /> -->
          <a-select v-decorator="['dbName', validatorRules.templatedb]" placeholder="请选择数据源" @change="gettablenames">
            <a-select-option v-for="(item,index) in dbnames" :value="item" :key="index" >{{ item}}</a-select-option>
          </a-select>
        </a-form-item>
        </a-col>

        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数据表">
          <!-- <a-input placeholder="请输入数据表" v-decorator="['tableName', {}]" /> -->
          <a-select v-decorator="['tableName',validatorRules.templatetb]" placeholder="请选择数据表" @change="getdefault">
            <a-select-option v-for="(item,index) in tablenames" :value="item" :key="index" >{{ item}}</a-select-option>
          </a-select>
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="后端包名">
          <a-input placeholder="请输入后端包名" v-decorator="['entityPackage',validatorRules.templatepg]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="实体类名">
          <a-input placeholder="请输入实体类名" v-decorator="['entityName',validatorRules.templateen]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="功能描述">
          <a-input placeholder="请输入功能描述" v-decorator="['ftlDescription',validatorRules.templatedes]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="查询条件数">
          <a-input placeholder="请输入查询条件数" v-decorator="['searchFieldNum',validatorRules.templatese]" />
        </a-form-item>
        </a-col>
      
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="后端生成路径">
          <a-input placeholder="请输入后端生成路径" v-decorator="['bussiPackage',validatorRules.templatebu]" />
        </a-form-item>
        </a-col>

        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="前端包名">
          <a-input placeholder="请输入前端包名" v-decorator="['frontPackage', validatorRules.templatefp]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="前端生成路径">
          <a-input placeholder="请输入前端生成路径" v-decorator="['frontRoute', validatorRules.templatefr]" />
        </a-form-item>
        </a-col>

        <a-col :md="12" :sm="8">
          <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="附件字段">
            <j-select-multiple placeholder="请选择附件字段" v-model="jselectMultiple.value" :options="jselectMultiple.options"/>
          </a-form-item>
        </a-col>

       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主键字段">
          <a-radio-group
            buttonStyle="solid"
            v-decorator="['genername', {initialValue:'pm'}]">
            <a-radio value="pm">guid</a-radio>
            <a-radio value="cmp">id</a-radio>
          </a-radio-group>
        </a-form-item>
       </a-col>
      <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="左侧快速查询">
          <a-radio-group
            @change="onChange1"
            buttonStyle="solid"
            v-decorator="['ifLeftSearch', {initialValue:'false'}]">
            <a-radio value="true">是</a-radio>
            <a-radio value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
       </a-col>

     </a-row>
     <a-row :gutter="24" v-if="leftSearchVisible">
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="搜索名">
          <a-input placeholder="请填写搜索名" v-decorator="['searchName',validatorRules.searchName]"></a-input>
        </a-form-item>
       </a-col>
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典编码">
          <a-input placeholder="请填写字典编号" v-decorator="['dictCode',validatorRules.dictCode]"></a-input>
        </a-form-item>
       </a-col>
     </a-row>
     <a-row>
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选人字段配置">
          <a-radio-group
            @change="onChange($event,'leftSearchVisible1')"
            buttonStyle="solid"
            v-decorator="['selectMan', {initialValue:'0'}]">
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
       </a-col>
     </a-row>
     <a-row :gutter="24" v-if="leftSearchVisible1">
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户名字段">
          <a-input placeholder="例：userName1,userName2" v-decorator="['userNames',validatorRules.userNames]"></a-input>
        </a-form-item>
       </a-col>
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="真实姓名字段">
          <a-input placeholder="例：fullName1,fullName2" v-decorator="['fullNames',validatorRules.fullNames]"></a-input>
        </a-form-item>
       </a-col>
     </a-row>
     <a-row>
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门字段配置">
          <a-radio-group
            @change="onChange($event,'leftSearchVisible2')"
            buttonStyle="solid"
            v-decorator="['selectdepart', {initialValue:'0'}]">
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
       </a-col>
     </a-row>
     <a-row :gutter="24" v-if="leftSearchVisible2">
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门名称字段">
          <a-input placeholder="例：departName1,departName2" v-decorator="['departNames',validatorRules.departNames]"></a-input>
        </a-form-item>
       </a-col>
       <a-col :md="12" :sm="8">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门编码字段">
          <a-input placeholder="例：orgCode1,orgCode2" v-decorator="['orgCodes',validatorRules.orgCodes]"></a-input>
        </a-form-item>
       </a-col>
     </a-row>
    <a-row :gutter="24">
        <a-col :md="24" :sm="8">
          <a-form-item class="btnClass">
            
            <a-button @click="handleGenerate" icon="check" type="primary" class="confirm">生成</a-button>
            <a-button @click="handleOk" type="primary" icon="check" class="confirm">{{ model.status == undefined ? '保存' : '确定' }}</a-button>
            <a-button @click="handleCancel" icon="close" style="margin-right:10px" class="cancel">关闭</a-button>            
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
  import JSelectMultiple from '@/components/cmp/JSelectMultiple'

  export default {
    name: "OneModal",
    components: {
       JDictSelectTag, JSelectMultiple
    },
    data () {
      return {
        jselectMultiple: {
          options: [],
          value:'',
        },
        jselectMultiple2: {
          options: [],
          value:'',
        },
        dbName:'',
        dbnames:[],
        tableName:'',
        tablenames:[],
        param:[],
        entityPackage:'',
        entityName:'',
        title:"操作",
        visible: false,
        leftSearchVisible: false,
        leftSearchVisible1: false,
        leftSearchVisible2: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          templatedb: { rules: [{ required: true, message: '请选择数据源!' }] },
          templatetb: { rules: [{ required: true, message: '请选择数据表!' }] },
          templatepg: { rules: [{ required: true, message: '请输入后端包名!' }] },
          templateen: { rules: [{ required: true, message: '请输入实体类名!' }] },
          templatedes: { rules: [{ required: true, message: '请输入功能描述!' }] },
          templatese: { rules: [{ required: true, message: '请输入查询条目数!' }] ,initialValue:'2'},
          templatebu: { rules: [{ required: true, message: '请输入后端生成路径!' }],initialValue:'com.ecidi.modules.demo' },
          templatefp:{ rules: [{ required: true, message: '请输入前端包名!' }] },
          templatefr:{ rules: [{ required: false }],initialValue:'testdemo/test' },
          dictCode: {rules: [{ required: true, message: '请输入字典编号！'}]},
          searchName: {rules: [{ required: true, message: '请输入搜索名！'}]}
        },
        url: {
          add: "/one/one/add",
          edit: "/one/one/edit",
          getdbname:"/codegenerate/getdbname",
          gettable:"/codegenerate/gettable",
          getparam:"/codegenerate/getparam",
          code:"codegenerate/one",
        },
      }
    },
    created () {
    },

    mounted(){
      this.getdbnames();
    },

    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.jselectMultiple.value=record.attachmentField;
        this.jselectMultiple2.value=record.departmentField;
        this.visible = true;
        if (this.model.selectMan == '1') {
          this.leftSearchVisible1 = true
        } else {
          this.leftSearchVisible1 = false
        }
        if (this.model.selectDepart == '1') {
          this.leftSearchVisible2 = true
        } else {
          this.leftSearchVisible2 = false
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(this.model,
            'dbName',
            'tableName',
            'entityPackage',
            'entityName',
            'ftlDescription',
            'searchFieldNum',
            'bussiPackage',
            'frontPackage',
            'frontRoute',
            'ifLeftSearch',
            'genername',
            'selectMan',
            'userNames',
            'fullNames',
            'selectDepart',
            'departNames',
            'orgCodes'))
          this.model.templatename = "one"
          if (this.form.getFieldValue('genername') == null || this.form.getFieldValue('genername') == '') {
            this.form.setFieldsValue({ genername: 'pm' })
          }
          if (this.form.getFieldValue('ifLeftSearch') == null || this.form.getFieldValue('ifLeftSearch') == '') {
            this.form.setFieldsValue({ ifLeftSearch: 'false' })
          }
          if (this.form.getFieldValue('selectMan') == null || this.form.getFieldValue('selectMan') == '') {
            this.form.setFieldsValue({ selectMan: '0' })
          }
          if (this.form.getFieldValue('selectdepart') == null || this.form.getFieldValue('selectdepart') == '') {
            this.form.setFieldsValue({ selectdepart: '0' })
          }
        });
        if(this.model.dbName!=null){
          this.model.tablenames= this.gettablenames(this.model.dbName);
        }
        if(this.model.tableName!=null&&this.model.dbName!=null){
          this.model.param= this.getparam(this.model.tableName);
        }
        
      
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
            formData.attachmentField = this.jselectMultiple.value;
            formData.departmentField = this.jselectMultiple2.value;
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
      handleGenerate(){
        const that = this;
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let method = 'post';
            let httpurlcode = this.url.code;
            let formData = Object.assign(this.model, values);
            formData.attachmentField = this.jselectMultiple.value;
            formData.departmentField = this.jselectMultiple2.value;
            httpAction(httpurlcode,qs.stringify(formData),method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                this.handleOk();
              }else{
                that.$message.warning(res.message);
              }
              }).finally(() => {
                that.confirmLoading = false;
                })
          }
        })
      },
        
      handleCancel () {
        this.close()
      },
      getdbnames(){
        let data={};
        let httpurl =this.url.getdbname;
        let method = 'get';
        httpAction(httpurl,data,method).then(res=>{
          if(res.success){
            this.dbnames=res.result;
          }else{
          }
        })
      },
      gettablenames(dbName){
        let data={"dbName":dbName};
        let httpurl =this.url.gettable;
        let method = 'post';
        httpAction(httpurl,qs.stringify(data),method).then(res=>{
          if(res.success){
            this.tablenames=res.result;
          }else{
          }
        })
      },
     
      getdefault(tableName){
        let dbname2 = this.form.getFieldValue('dbName');
        let str = this.strchange(tableName);
        this.form.setFieldsValue({ entityPackage: str });
        this.form.setFieldsValue({ entityName: str.replace(str[0],str[0].toUpperCase()) });
        this.form.setFieldsValue({ frontPackage: str });
        let data={"dbName":dbname2,"tableName":tableName};
        let httpurl =this.url.getparam;
        let method = 'post';
        httpAction(httpurl,qs.stringify(data),method).then(res=>{
          if(res.success){
            this.param=res.result;
            let mm = [];
            for (let i = 0; i<= this.param.length;i++) {
              mm[i] = new Object();
              mm[i].value = this.param[i];
              mm[i].text = this.param[i];
            }
            this.jselectMultiple.options=mm;
            this.jselectMultiple2.options=mm;
          }else{
          }
        })
      },

      getparam(tableName){
        let dbname2 = this.model.dbName;

        let data={"dbName":dbname2,"tableName":tableName};
        let httpurl =this.url.getparam;
        let method = 'post';
        httpAction(httpurl,qs.stringify(data),method).then(res=>{
          if(res.success){
            this.param=res.result;
            let mm = [];
            for (let i = 0; i<= this.param.length;i++) {
              mm[i] = new Object();
              mm[i].value = this.param[i];
              mm[i].text = this.param[i];
            }
            this.jselectMultiple.options=mm;
            this.jselectMultiple2.options=mm;
          }else{
          }
        })
      },

      //驼峰命名
      strchange(str){
        var re=/_(\w)/g;
        return str.replace(re,function($0,$1){
          return $1.toUpperCase();
        });
      },
      onChange(val,visible) {
        if (val.target.value == '1') {
          this[visible] = true;
        } else {
          this[visible] = false;
        }
      },
      onChange1(val) {
        if (val.target.value == 'true') {
          this.previewVisible = true;
        } else {
          this.previewVisible = false;
        }
      }
    }
    
  }
</script>

<style lang="less" scoped>
    @import '~@assets/less/modal.less';
</style>