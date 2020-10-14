<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel">


      <!-- 表单标题 -->
      <div class="title">
        <div>
          <img :src="title | IconUrl" />
          {{title}}
          <span>{{ nodeName ? '(' + nodeName + ')': ''}}</span>
        </div>
        <a-icon type="close" class="closeIcon" @click="handleCancel" />
      </div>

      <!-- 主表单区域 -->
      <a-form :form="form">

        <!-- 常用选择/输入控件 -->
        <a-row :gutter="24">
          

            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="数据源">
                  <!-- <a-input placeholder="请选择数据源" v-decorator="['dbName', {}]" /> -->
                  <a-select v-decorator="['dbName',validatorRules.templatedb]" placeholder="请选择数据源" @change="gettablenames">
                    <a-select-option v-for="(item,index) in dbnames" :value="item" :key="index" >{{ item}}</a-select-option>
                  </a-select>
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="主表数据表">
                  <a-select v-decorator="['mainTableName', validatorRules.templatetb]" placeholder="请选择主表数据表" @change="getdefault">
                    <a-select-option v-for="(item,index) in tablenames" :value="item" :key="index" >{{item}}</a-select-option>
                  </a-select>
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="后端包名">
                  <a-input placeholder="请输入后端包名" v-decorator="['mainEntityPackage', validatorRules.templatepg]" />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="主表实体类名">
                  <a-input placeholder="请输入主表实体类名" v-decorator="['mainEntityName', validatorRules.templateen]" />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="主表功能描述">
                  <a-input placeholder="请输入主表功能描述" v-decorator="['mainFtlDescription',validatorRules.templatedes]" />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="后端生成路径">
                  <a-input placeholder="请输入后端生成路径" v-decorator="['bussiPackage', validatorRules.templatebu]" />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="查询条件数">
                  <a-input-number v-decorator="[ 'searchFieldNum', validatorRules.templatese]" />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

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
                      <a-radio value='pm'>guid</a-radio>
                      <a-radio value='cmp'>id</a-radio>
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
        <!-- 选人组件 -->
        <!-- <a-row :gutter="24">
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
        </a-row> -->

      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
          <a-tab-pane tab="子表配置" :key="refKeys[0]" :forceRender="true">
            <j-editable-table
              :ref="refKeys[0]"
              :loading="codegenerOnetomanyDetailTable.loading"
              :columns="codegenerOnetomanyDetailTable.columns"
              :dataSource="codegenerOnetomanyDetailTable.dataSource"
              :maxHeight="300"
              :rowNumber="true"
              :rowSelection="true"
              :actionButton="true"/>
          </a-tab-pane>
      </a-tabs>

      <!-- 同步按钮 -->
      <a-form-item class="btnClass">
        
        <a-button @click="handleGenerate" icon="check" type="primary" class="confirm">生成</a-button>
        <a-button
          @click="handleOk"
          icon="check"
          type="primary"
          style="margin-left:10px"
          class="confirm"
        >保存</a-button>
        <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
      </a-form-item>

  </a-modal>
</template>

<script>

  import moment from 'moment'
  import pick from 'lodash.pick'
  import { FormTypes } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin,getAllTable,handleOk } from '@/mixins/JEditableTableMixin'
  import Vue from 'vue'
  import qs from 'qs'
  import { httpAction } from '@/api/manage'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import { VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables } from '@/utils/JEditableTableUtil'
  import JSelectMultiple from '@/components/cmp/JSelectMultiple'

  export default {
    name: 'CodegenerOnetomanyModal',
    mixins: [JEditableTableMixin],
    components: {
      JDictSelectTag,
      JSelectUserNew,
      JSelectMultiple
    },
    data() {
      return {
        jselectMultiple: {
          options: [],
          value:'',
        },
        jselectMultiple2: {
          options: [],
          value:'',
        },
        param:[],
        dbName:'',
        dbnames:[],
        mainTableName:'',
        mainEntityPackage:'',
        mainEntityName:'',
        tablenames:[],
        searchFieldNum:'',
        bussi_package:'',
        subTableName:'',
        nodeName: '',
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          templatedb: { rules: [{ required: true, message: '请选择数据源!' }] },
          templatetb: { rules: [{ required: true, message: '请选择数据表!' }] },
          templatepg: { rules: [{ required: true, message: '请输入后端包名!' }] },
          templateen: { rules: [{ required: true, message: '请输入实体类名!' }] },
          templatedes: { rules: [{ required: true, message: '请输入功能描述!' }] },
          templatese: { rules: [{ required: true, message: '请输入查询条目数!' }] ,initialValue:'2'},
          templatebu: { rules: [{ required: true, message: '请输入后端生成路径!' }],initialValue:'com.ecidi.modules.demo' },
          templatefp: { rules: [{ required: true, message: '请输入前端包名!' }] },
          templatefr: { rules: [{ required: false }],initialValue:'testdemo/test' },
          dictCode: {rules: [{ required: true, message: '请输入字典编号！'}]},
          searchName: {rules: [{ required: true, message: '请输入搜索名！'}]}
        },
        attachment: [],
        refKeys: ['codegenerOnetomanyDetail', ],
        activeKey: 'codegenerOnetomanyDetail',
        // 多表代码生成器子表配置
        codegenerOnetomanyDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '子表数据表',
              key: 'subTableName',
              type: FormTypes.select,
              options:[],
              defaultValue: '',
              placeholder: '请选择${title}',
            },
            // {
            //   title: '子表包名',
            //   key: 'subEntityPackage',
            //   type: FormTypes.input,
            //   defaultValue: '',
            //   placeholder: '请输入${title}',
            // },
            {
              title: '子表实体类名',
              key: 'subEntityName',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '子表功能描述',
              key: 'subFtlDescription',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '子表外键字段',
              key: 'subForeignkey',
              type: FormTypes.input,
              defaultValue: 'master_id',
              placeholder: '请输入${title}',
            },
          ]
        },
        url: {
          add: "/codegenerOnetomany/codegenerOnetomany/add",
          edit: "/codegenerOnetomany/codegenerOnetomany/edit",
          codegenerOnetomanyDetail: {
            list: '/codegenerOnetomany/codegenerOnetomany/queryCodegenerOnetomanyDetailByMainId'
          },
          fileFind: '/file/cmpFileGroup/findFilesByGroupId',
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById',
          getdbname:"/codegenerate/getdbname",
          gettable:"/codegenerate/gettable",
          getparam:"/codegenerate/getparam",
          code:"codegenerate/onetomany",
        },

        // 上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
        leftSearchVisible: false,
        leftSearchVisible1: false,
        leftSearchVisible2: false,
        attachment: [
         {
           groupId: '',
           fileTokens: '',
           fieldName: 'attachment',
           tableName: 'pm_stakeholder'
         }
        ],
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
      }
    },
    filters: {
      IconUrl(val) {
        switch (val) {
          case '新增':
            return require(`@/assets/img/login/add.png`)
            break
          case '编辑':
            return require(`@assets/img/login/edit.png`)
            break
          case '查看':
            return require(`@assets/img/login/view.png`)
            break
          case '审核':
            return require(`@assets/img/login/audit.png`)
            break
          default:
            break
        }
      }
    },
    created () {
       const token = Vue.ls.get(ACCESS_TOKEN)
       this.headers = { 'X-Access-Token': token }
       this.attachment[0].fileTokens = ''
    },
    watch:{     
    },
    mounted(){
      this.getdbnames();
    },
    // 计算属性
    computed: {
      // 附件上传url
      uploadAction: function() {
        return this.url.fileUpload
      },
    
    },
    methods: {

      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter(record) {
        if (record && record.formData) {
          this.model = Object.assign(
            {
              formPath: record.formPath,
              nodeName: record.nodeName,
              taskId: record.taskId,
            },
            record.formData,
            record.flowData
          )
          this.nodeName = record.nodeName
          
        }
        this.jselectMultiple.value=record.attachmentField;
        if (this.model.ifLeftSearch == 'true') {
          this.leftSearchVisible = true
        } else {
          this.leftSearchVisible = false
        }
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
            'mainTableName',
            'mainEntityPackage',
            'mainEntityName',
            'mainFtlDescription',
            'bussiPackage',
            'searchFieldNum',
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
          this.model.templatename = "onetomany"
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
        })
        if(this.model.dbName!=null){
          this.model.tablenames= this.gettablenames(this.model.dbName);
        }
        if(this.model.mainTableName!=null&&this.model.dbName!=null){
          this.model.param= this.getparam(this.model.mainTableName);
        }
        // 初始化任务通知方式
        if (this.model.notifyMethod != undefined) {
          this.model.notifyMethod = JSON.parse(this.model.notifyMethod)
        }

        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.codegenerOnetomanyDetail.list, params, this.codegenerOnetomanyDetailTable)
        }
        // 初始化选人组件字段
        this.auditUsers1.value = []
        this.auditUsers2.value = []
        // 初始化选人控件
        this.initSelectMan(this,record)

        // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
        this.initUpload(this, 0)
      },

      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        //时间格式化
        return {
          ...main, // 展开
          codegenerOnetomanyDetailList: allValues.tablesValue[0].values,
        }
      },
      request(formData) {
        let url = this.url.add, method = 'post'
        if (this.model.id) {
          url = this.url.edit
          method = 'post' //put修改
        }
        // 上传组件
        if(this.attachment && this.attachment.length > 0){
          for (let i = 0; i<this.attachment.length; i++) {
            formData.attachment = this.attachment[i].groupId
          }
        }
        //数据处理
        formData.attachmentField = this.jselectMultiple.value;
        let strFormData = JSON.stringify(formData),
          strAttachment = JSON.stringify(this.attachment)
        let data = {}
        data.strFormData = strFormData
        data.strAttachment = strAttachment

        data = qs.stringify(data)

        // 发起请求
        this.confirmLoading = true
        httpAction(url, data, method).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      // 上传组件改变回调  
      handleChange(info) {
        //调用改变方法
        this.handleChangeMixin(info, this, 0)
      },
      handleGenerate(){
          /** 触发表单验证 */
        this.getAllTable().then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
          
        }).then(allValues => {
          if (typeof this.classifyIntoFormData !== 'function') {
            throw this.throwNotFunction('classifyIntoFormData')
          }
            let method = 'post';
            let httpurlcode = this.url.code;
            let formData = this.classifyIntoFormData(allValues);
            formData.attachmentField = this.jselectMultiple.value;
            console.log(formData  )
            let list = formData.codegenerOnetomanyDetailList;
            for(let i = 0;i<list.length;i++){
              list[i].subForeignkey=list[i].subForeignkey.split(",");
            }
            let list2=JSON.parse(JSON.stringify(list).replace(/subEntityName/g,"entityName").replace(/subEntityPackage/g,"entityPackage")
            .replace(/subForeignkey/g,"foreignKeys").replace(/subFtlDescription/g,"ftlDescription").replace(/subTableName/g,"tableName"));
            let formData2 = {"mainTableVo":{
                                "entityPackage":formData.mainEntityPackage,
                                "entityName":formData.mainEntityName,
                                "tableName":formData.mainTableName,
                                "ftlDescription":formData.mainFtlDescription,
                                'searchFieldNum':formData.searchFieldNum,
                                'attachmentField':formData.attachmentField,
                                'ifLeftSearch':formData.ifLeftSearch,
                                'searchName':formData.searchName,
                                'dictCode':formData.dictCode,
                                'selectMan':formData.selectMan,
                                'userNames':formData.userNames,
                                'fullNames':formData.fullNames,
                                'selectDepart':formData.selectDepart,
                                'departNames':formData.departNames,
                                'orgCodes':formData.orgCodes,
                                },
                            "subTables":list2,
                            "dbName":formData.dbName,
                            "templatename":formData.templatename,
                            "bussiPackage":formData.bussiPackage,
                            "frontPackage":formData.frontPackage,
                            "frontRoute":formData.frontRoute,
                            'genername':formData.genername,
                        
                            }

            httpAction(httpurlcode,formData2,method).then((res)=>{
              if(res.success){
                this.$message.success(res.message);
                this.handleOk();             
              }else{
                this.$message.warning(res.message);
              }
              }).finally(() => {
                this.confirmLoading = false;
                })
          }).catch(e => {
        if (e.error === VALIDATE_NO_PASSED) {
          // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
          this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
        } else {
          console.error(e)
        }
      })
      },
      // 删除图片
      handlePicCancel() {
        this.previewVisible = false
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
            let mm = [];
            for (let i = 0; i<= this.tablenames.length;i++) {
              mm[i] = new Object();
              mm[i].value = this.tablenames[i];
              mm[i].title = this.tablenames[i];
            }
            this.codegenerOnetomanyDetailTable.columns[0].options=mm;

          }else{
          }
        })
      },
      getdefault(mainTableName){
        let dbname2 = this.form.getFieldValue('dbName');
        let str = this.strchange(mainTableName);
        this.form.setFieldsValue({ mainEntityPackage: str });
        this.form.setFieldsValue({ mainEntityName: str.replace(str[0],str[0].toUpperCase()) });
        this.form.setFieldsValue({ frontPackage: str });
        let data={"dbName":dbname2,"tableName":mainTableName};
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
      getparam(mainTableName){
        let dbname2 = this.model.dbName;

        let data={"dbName":dbname2,"tableName":mainTableName};
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
      getdefaultsub(tableName){
        let str = this.strchange(tableName);
        this.form.setFieldsValue({ subEntityPackage: str });
        this.form.setFieldsValue({ subEntityName: str.replace(str[0],str[0].toUpperCase()) });
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
          this.leftSearchVisible = true;
        } else {
          this.leftSearchVisible = false;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/less/modal.less';
</style>