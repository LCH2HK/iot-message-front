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
                    <!-- <a-input placeholder="请输入数据源" v-model="queryParam.dbName"></a-input> -->
                    <a-select v-decorator="['dbName', validatorRules.templatedb]" placeholder="请选择数据源">
                      <a-select-option v-for="(item,index) in dbnames" :value="item" :key="index" >{{item}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                
                <a-col :md="12" :sm="8">
                  <a-form-item 
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="数据表">
                    <a-input placeholder="请输入需创建的数据表名" v-model="tableName" @change="getdefault"></a-input>
                  </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

               <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="表类型">
                <a-select v-decorator="['tableType', validatorRules.templatetbtype]" placeholder="请选择表类型">
                  <a-select-option value="1">单表</a-select-option>
                  <a-select-option value="2">主表</a-select-option>
                  <a-select-option value="3">附表</a-select-option>
                </a-select>
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="表描述">
                  <a-input placeholder="请输入表描述" v-decorator="['tableDes', validatorRules.templatetb]" />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="后端包名">
                  <a-input placeholder="请输入后端包名" v-decorator="['backPackage', validatorRules.templatebp]" />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="表实体类名">
                  <a-input placeholder="请输入表实体类名" v-decorator="['entityName', validatorRules.templateen]"  />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="后端生成路径">
                  <a-input placeholder="请输入后端生成路径" v-decorator="['backRoute', validatorRules.templatebr]" />
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



            <!-- 非附件上传 -->

                <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="前端生成路径">
                  <a-input placeholder="请输入前端生成路径" v-decorator="['frontRoute', validatorRules.templatefr]"  />
                </a-form-item>
                </a-col>



            <!-- 非附件上传 -->

                <!-- <a-col :md="12" :sm="8">
                <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="扩展字段">
                  <a-input placeholder="请输入扩展字段" v-decorator="['expandOne', {}]" />
                </a-form-item>
                </a-col> -->

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
          <a-tab-pane tab="数据表属性" :key="refKeys[0]" :forceRender="true">
            <j-editable-table
              :ref="refKeys[0]"
              :loading="formGenerateTableDetailTable.loading"
              :columns="formGenerateTableDetailTable.columns"
              :dataSource="formGenerateTableDetailTable.dataSource"
              :maxHeight="300"
              :rowNumber="true"
              :rowSelection="true"
              :actionButton="true"/>
          </a-tab-pane>
          <a-tab-pane tab="页面属性" :key="refKeys[1]" :forceRender="true">
            <j-editable-table
              :ref="refKeys[1]"
              :loading="formGeneratePageDetailTable.loading"
              :columns="formGeneratePageDetailTable.columns"
              :dataSource="formGeneratePageDetailTable.dataSource"
              :maxHeight="300"
              :rowNumber="true"
              :rowSelection="true"
              :actionButton="true"/>
          </a-tab-pane>
          <a-tab-pane tab="外键" :key="refKeys[2]" :forceRender="true">
            <j-editable-table
              :ref="refKeys[2]"
              :loading="formGenerateForeignDetailTable.loading"
              :columns="formGenerateForeignDetailTable.columns"
              :dataSource="formGenerateForeignDetailTable.dataSource"
              :maxHeight="300"
              :rowNumber="true"
              :rowSelection="true"
              :actionButton="true"/>
          </a-tab-pane>
      </a-tabs>

      <!-- 同步按钮 -->
      <a-form-item class="btnClass">
        <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
        <a-button
          @click="handleOk"
          icon="check"
          type="primary"
          style="margin-left:10px"
          class="confirm"
        >保存</a-button>
      </a-form-item>

  </a-modal>
</template>

<script>

  import moment from 'moment'
  import pick from 'lodash.pick'
  import { FormTypes } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import Vue from 'vue'
  import qs from 'qs'
  import { httpAction } from '@/api/manage'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import { randomUUID, randomNumber } from '@/utils/util'

  export default {
    name: 'FormGenerateModal',
    mixins: [JEditableTableMixin],
    components: {
      JDictSelectTag,
      JSelectUserNew
    },
    data() {
      return {
        dbName:'',
        dbnames:[],
        nodeName: '',
        tableName:'',
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
          templatedb: { rules: [{ required: true, message: '请选择数据源!' }] },
          templatetb: { rules: [{ required: true, message: '请输入表描述!' }] },
          templatebp: { rules: [{ required: true, message: '请输入后端包名!' }] },
          templateen: { rules: [{ required: true, message: '请输入实体类名!' }] },
          templatetbtype: { rules: [{ required: true, message: '请选择表类型!' }] },
          templatebr: { rules: [{ required: true, message: '请输入后端生成路径!' }],initialValue:'com.ecidi.modules.demo' },
          templatefp: { rules: [{ required: true, message: '请输入前端包名!' }] },
          templatefr: { rules: [{ required: false }],initialValue:'testdemo/test' },
        },
        attachment: [],
        refKeys: ['formGenerateTableDetail', 'formGeneratePageDetail', 'formGenerateForeignDetail', ],
        activeKey: 'formGenerateTableDetail',
        // 数据表属性
        formGenerateTableDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '字段名称',
              key: 'fieldName',
              width: '150px',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/, // 正则
                message: '${title}必须以字母开头，可包含数字、下划线、横杠'
              }
            ]
            },
            {
              title: '字段备注',
              key: 'fieldComment',
              width: '150px',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            
            ]
            },
            {
              title: '字段长度',
              key: 'fieldLength',
              width: '100px',
              type: FormTypes.inputNumber,
              defaultValue: 32,
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '请输入${title}' }]
            },
            {
              title: '小数点',
              key: 'fieldPoint',
              width: '100px',
              type: FormTypes.inputNumber,
              defaultValue: 0,
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '请输入${title}' }]
            },
            {
              title: '默认值',
              key: 'fieldDefault',
              width: '100px',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              validateRules: [{required: false}]
            },
            {
              title: '字段类型',
              key: 'fieldType',
              width: '150px',
              type: FormTypes.select,
              options: [ // 下拉选项
              { title: 'varchar', value: 'varchar' },
              { title: 'int', value: 'int' },
              { title: 'double', value: 'double' },
              { title: 'datetime', value: 'datetime' },
              { title: 'decimal', value: 'decimal' },

              ],
              defaultValue: '',
              placeholder: '请选择${title}',
              validateRules: [{ required: true, message: '请选择${title}' }]
            },
            {
              title: '主键',
              key: 'beprimary',
              width: '100px',
              type: FormTypes.checkbox,
              defaultChecked: false,
              customValue:['true','false']
            },
            {
              title: '允许空值',
              key: 'allownull',
              width: '100px',
              type: FormTypes.checkbox,
              defaultChecked: true,
              customValue:['true','false']
            },
            {
              title: '排序',
              key: 'fieldSeq',
              width: '100px',
              type: FormTypes.inputNumber,
              defaultValue: 1,
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '请输入${title}' }]
            },
          ]
        },
        // 页面属性
        formGeneratePageDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '字段名称',
              key: 'fieldName',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '字段备注',
              key: 'fieldComment',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '表单显示',
              key: 'formView',
              width: '100px',
              type: FormTypes.checkbox,
              defaultChecked: false,
              customValue:['true','false']
            },
            {
              title: '列表显示',
              key: 'listView',
              width: '100px',
              type: FormTypes.checkbox,
              defaultChecked: false,
              customValue:['true','false']
            },
            {
              title: '控件类型',
              key: 'controlType',
              width: '200px',
              type: FormTypes.select,
              options: [ // 下拉选项
                { title: '文本框', value: 0 },
                { title: '单选框', value: 1 },
                { title: '多选框', value: 2 },
                { title: '日期', value: 3 },
                { title: '文件', value: 4 },
                { title: '下拉框', value: 5 },
                { title: '下拉多选框', value: 6 },
                { title: '部门选择器', value: 7 },
                { title: '用户选择器', value: 8 },
              ],
              defaultValue: 0,
              placeholder: '请选择${title}',
              validateRules: [{ required: false, message: '请选择${title}' }]
            },
            {
              title: '控件长度',
              key: 'controlLength',
              type: FormTypes.inputNumber,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '是否查询',
              key: 'bequery',
              width: '100px',
              type: FormTypes.checkbox,
              defaultChecked: false,
              customValue:['true','false']
            },
            {
              title: '查询类型',
              key: 'queryType',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              customValue:['true','false']
            },
            {
              title: '扩展参数',
              key: 'expandParam',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '填值规则',
              key: 'valueRule',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
          ]
        },
        // 外键
        formGenerateForeignDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '字段名称',
              key: 'fieldName',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '字段备注',
              key: 'fieldComment',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '主表名',
              key: 'mainFieldName',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
            {
              title: '主表字段',
              key: 'mainField',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
            },
          ]
        },
        url: {
          add: "/formGenerate/formGenerate/add",
          edit: "/formGenerate/formGenerate/edit",
          formGenerateTableDetail: {
            list: '/formGenerate/formGenerate/queryFormGenerateTableDetailByMainId'
          },
          formGeneratePageDetail: {
            list: '/formGenerate/formGenerate/queryFormGeneratePageDetailByMainId'
          },
          formGenerateForeignDetail: {
            list: '/formGenerate/formGenerate/queryFormGenerateForeignDetailByMainId'
          },
          fileFind: '/file/cmpFileGroup/findFilesByGroupId',
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById',
          getdbname:"/codegenerate/getdbname",
        },

        //上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
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
    // 计算属性
    computed: {
      // 附件上传url
      uploadAction: function() {
        return this.url.fileUpload
      },
    },
    mounted() {
      this.getdbnames();     
    },
    methods: {

      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter(record) {
        if (record && record.formData) {
          this.model = Object.assign(
            {
              formPath: record.formPath,
              nodeName: record.nodeName,
              taskId: record.taskId
            },
            record.formData,
            record.flowData
          )
          this.nodeName = record.nodeName
        }
        // 初始化任务通知方式
        if (this.model.notifyMethod != undefined) {
          this.model.notifyMethod = JSON.parse(this.model.notifyMethod)
        }

        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.formGenerateTableDetail.list, params, this.formGenerateTableDetailTable)
          this.requestSubTableData(this.url.formGeneratePageDetail.list, params, this.formGeneratePageDetailTable)
          this.requestSubTableData(this.url.formGenerateForeignDetail.list, params, this.formGenerateForeignDetailTable)
        }

        // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
        this.initUpload(this, 0)

        this.$nextTick(() => {
                  this.form.setFieldsValue(pick(this.model, 'dbName', 'tableName', 'tableDes', 'tableType', 'backPackage', 'entityName', 'backRoute', 'frontPackage', 'frontRoute', 'expandOne', ))

                  // 初始化选人组件字段
                  this.auditUsers1.value = []
                  this.auditUsers2.value = []
                  // 初始化选人控件
                  this.initSelectMan(this,record)

                  if(JSON.stringify(record)=="{}"){
                    this.formGenerateTableDetailTable.dataSource = this.defaultData()
                  }
                })
      },

      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        //时间格式化
        return {
          ...main, // 展开
          formGenerateTableDetailList: allValues.tablesValue[0].values,
          formGeneratePageDetailList: allValues.tablesValue[1].values,
          formGenerateForeignDetailList: allValues.tablesValue[2].values,
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
        formData.tableName=this.tableName
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
      defaultData(){
        let arr= [
          {id: randomUUID(),fieldName:"id",fieldComment:"表单编号",fieldLength:32,fieldType:"varchar",fieldPoint:0,beprimary:'true',allownull:'false',fieldSeq:1},
          {id: randomUUID(),fieldName:"create_by",fieldComment:"创建人",fieldLength:32,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:2},
          {id: randomUUID(),fieldName:"create_time",fieldComment:"创建时间",fieldLength:0,fieldType:"datetime",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:3},
          {id: randomUUID(),fieldName:"update_by",fieldComment:"更新人",fieldLength:32,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:4},
          {id: randomUUID(),fieldName:"update_time",fieldComment:"更新时间",fieldLength:0,fieldType:"datetime",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:5},
          {id: randomUUID(),fieldName:"corp_code",fieldComment:"所属租户",fieldLength:50,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:6},
          {id: randomUUID(),fieldName:"prj_code",fieldComment:"所属项目",fieldLength:50,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:7},
          {id: randomUUID(),fieldName:"del_flag",fieldComment:"删除标志(0正常、1删除,必须设置默认为0)",fieldLength:2,fieldType:"varchar",fieldPoint:0,fieldDefault:'0',beprimary:'false',allownull:'true',fieldSeq:8},
          {id: randomUUID(),fieldName:"status",fieldComment:"状态(0暂存、1流转中、2已完成、3废弃)",fieldLength:2,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:9},
          {id: randomUUID(),fieldName:"inputer_name",fieldComment:"录入人用户名",fieldLength:32,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:10},
          {id: randomUUID(),fieldName:"inputer_fullname",fieldComment:"录入人姓名",fieldLength:32,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:11},
          {id: randomUUID(),fieldName:"notify_method",fieldComment:"消息通知方式",fieldLength:255,fieldType:"varchar",fieldPoint:0,beprimary:'false',allownull:'true',fieldSeq:12},
          ]
        
        return arr
      },
      getdefault(){
        
        let dbname2 = this.tableName;
        let str = this.strchange(dbname2);
        if(str!=null&&str[0]!=null){
          this.form.setFieldsValue({ backPackage: str });
          this.form.setFieldsValue({ entityName: str.replace(str[0],str[0].toUpperCase()) });
          this.form.setFieldsValue({ frontPackage: str });
        }
        
      
      },
      //驼峰命名
      strchange(str){
        var re=/_(\w)/g;
        return str.replace(re,function($0,$1){
          return $1.toUpperCase();
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/less/modal.less';
</style>