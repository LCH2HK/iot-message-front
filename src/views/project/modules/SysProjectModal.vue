<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;"
  >
    <div class="title">
      <div>
        <img :src="title | IconUrl" />
        {{ title }}
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="mainForm">
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目名称">
              <a-input
                placeholder="请输入项目名称"
                v-decorator="['prjName', {rules: [{required:true, message: '请输入项目名称！'}]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目编号">
              <a-input
                placeholder="请输入项目编号"
                v-decorator="['prjId', validatorRules.prjId]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目名称缩写">
              <a-input placeholder="请输入项目名称缩写" v-decorator="['prjNameAbbr', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目英文名">
              <a-input placeholder="请输入英文名" v-decorator="['prjNameEn', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目经理">
              <j-select-user-new
                :placeholder="'请选择项目经理'"
                :selectedDetails="auditUsers1"
                @callback="setAuditUser"
                class="userSelect"
                v-decorator="['projectManager', {rules: [{required:true, message: '请选择项目经理！'}]}]"
              ></j-select-user-new>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目类型">
              <j-dict-select-tag
                placeholder="请输入项目类型"
                :triggerChange="true"
                v-decorator="['type', {rules: [{required:true, message: '请输入项目类型！'}]}]"
                dictCode="project_types"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目区域">
              <j-dict-select-tag
                placeholder="请选择区域"
                :triggerChange="true"
                v-decorator="['place', {rules: [{required:true, message: '请选择区域！'}]}]"
                dictCode="project_area"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目分组">
              <j-dict-select-tag
                placeholder="请输入项目分组"
                :triggerChange="true"
                v-decorator="['projectGroup', {rules: [{required:true, message: '请输入项目分组！'}]}]"
                dictCode="project_group"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="历史数据源">
              <a-select
                v-decorator="['historyDb',{rules: [{required:true, message: '请选择历史数据源'}]}]"
                placeholder="请选择历史数据源"
              >
                <a-select-option
                  v-for="(item,index) in datasources"
                  :value="item.dbKey"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实时数据源">
              <a-select
                v-decorator="['realDb',{rules: [{required:true, message: '请选择实时数据源'}]}]"
                placeholder="请选择实时数据源"
              >
                <a-select-option
                  v-for="(item,index) in datasources"
                  :value="item.dbKey"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据服务数据源">
              <a-select
                v-decorator="['dataServiceDb',{rules: [{required:true, message: '请选择数据服务数据源'}]}]"
                placeholder="请选择数据服务数据源"
              >
                <a-select-option
                  v-for="(item,index) in datasources"
                  :value="item.dbKey"
                  :key="index"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据服务url">
              <a-input
                placeholder="请输入数据服务url"
                v-decorator="['dataServiceUrl', {rules: [{required: true, message: ' '}, { validator: this.valiUrl }]}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="计划开始日期">
              <a-date-picker
                showTime
                :disabledDate="disabledStartDate"
                format="YYYY-MM-DD"
                v-decorator="[ 'startDate', {}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="计划结束日期">
              <a-date-picker
                showTime
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD"
                v-decorator="[ 'finishDate', {}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目结束日期">
              <a-date-picker showTime format="YYYY-MM-DD" v-decorator="[ 'finishedDate', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目关闭日期">
              <a-date-picker showTime format="YYYY-MM-DD" v-decorator="[ 'closeDate', {}]" />
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目规模">
              <a-input placeholder="请输入项目规模" v-decorator="['category', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目体量">
              <a-input placeholder="请输入项目体量" v-decorator="['scale', {}]" />
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="限期">
              <a-input placeholder="请输入限期" v-decorator="['limitDays', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="传真">
              <a-input placeholder="请输入传真" v-decorator="['fax', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="业主">
              <a-input placeholder="请输入业主" v-decorator="['owner', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同类型">
              <a-input placeholder="请输入合同类型" v-decorator="['contractType', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同金额（元）">
              <!-- <a-input placeholder="请输入合同金额" v-decorator="['contractSum', {}]" /> -->
              <a-input-number
                placeholder="请输入合同金额（元）"
                :precision="precision"
                style="width: 100%;text-align: right;height: 35px;"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                :step="0.01"
                v-decorator="['contractSum', {initialValue: '0.00'}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同编号">
              <a-input placeholder="请输入合同编号" v-decorator="['contractNo', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同名称">
              <a-input placeholder="请输入合同名称" v-decorator="['contractName', {}]" />
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同人">
              <j-select-user-new
                :selectedDetails="auditUsers2"
                @callback="setAuditUser"
                class="userSelect"
                v-decorator="['contractUserId', {}]"
              ></j-select-user-new>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目目标">
              <a-input placeholder="请输入项目目标" v-decorator="['target', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否使用外币">
              <!-- <a-input placeholder="请输入是否使用外币" v-decorator="['foreignCurrency', {}]" /> -->
              <a-select placeholder="请输入是否使用外币" v-decorator="['foreignCurrency', {}]">
                <a-select-option key="是">是</a-select-option>
                <a-select-option key="否">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否采购">
              <!-- <a-input placeholder="请输入是否采购" v-decorator="['purchase', {}]" /> -->
              <a-select
                placeholder="请选择是否采购"
                @change="handleChange2"
                v-decorator="['purchase', {initialValue: '是'}]"
              >
                <a-select-option key="是">是</a-select-option>
                <a-select-option key="否">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-if="ifPurchase">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="采购人">
              <j-select-user-new
                :selectedDetails="auditUsers3"
                @callback="setAuditUser"
                class="userSelect"
                v-decorator="['purchaseUserId', {}]"
              ></j-select-user-new>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目描述">
              <a-input placeholder="请输入项目描述" v-decorator="['description', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目状态">
              <j-dict-select-tag
                placeholder="请选择项目状态"
                v-decorator="['status', {} ]"
                :triggerChange="true"
                dictCode="project_status"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目区域">
              <j-dict-select-tag
                placeholder="请选择区域"
                :triggerChange="true"
                v-decorator="['place', {}]"
                dictCode="project_area"
              />
            </a-form-item>
          </a-col>-->
          <a-col :md="12" :sm="8">
            <a-form-item label="项目图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
                <img
                  v-if="picUrl"
                  :src="getAvatarView()"
                  alt="项目图标"
                  style="height:104px;max-width:300px"
                />
                <div v-else>
                  <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="8">
            <a-form-item label="项目图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-upload
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                :action="uploadAction"
                :data="{'isup':1}"
                :headers="headers"
                :beforeUpload="beforeUpload"
                @change="handleChange1"
              >
                <img
                  v-if="picUrl1"
                  :src="getAvatarView1()"
                  alt="项目图片"
                  style="height:104px;max-width:300px"
                />
                <div v-else>
                  <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" style="margin-top: 60px">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
              >{{ model.status == undefined ? '提交' : '保存' }}</a-button>
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
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import qs from 'qs'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { isURL } from '@/views/iot/js/iot_validate'

export default {
  name: 'SysProjectModal',
  // 组件应用定义
  components: {
    AFormItem,
    JDictSelectTag,
    JSelectUserNew
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data () {
    return {
      title: '操作',
      uploadLoading: false,
      picUrl: '',
      picUrl1: '',
      visible: false,
      model: {},
      datasources: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      validatorRules: {
        prjId: { rules: [{ validator: this.validatorPrjId }] },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: '/project/sysProject/add',
        edit: '/project/sysProject/edit',
        datasourceList: '/Datasource/Datasource/getAllDatasource',
        getDBUrlByName: '/Datasource/Datasource/getDBUrlByName',
        duplicateCheck:'/project/sysProject/uniquePrjId',
        // 上传组件地址
        fileUpload: window._CONFIG.domianURL + '/file/uploadFile/add',
        imgerverld: window._CONFIG.domianURL + '/file/uploadFile/previewFileById', // 李雕后台预览
        imgerver: window._CONFIG.domianURL + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById'
      },
      // 选人组件初始化
      projectManager: '',
      projectManagerFullname: '',
      contractUserId: '',
      contractUser: '',
      purchaseUserId: '',
      purchaseUser: '',
      selectUser: ['auditUsers1', 'auditUsers2', 'auditUsers3'],
      auditUsers1: {
        colum: 'auditUsers1',
        value: [],
        target: [
          { to: 'projectManager', from: 'username' },
          { to: 'projectManagerFullname', from: 'realname' }
        ]
      },
      auditUsers2: {
        colum: 'auditUsers2',
        value: [],
        target: [
          { to: 'contractUserId', from: 'username' },
          { to: 'contractUser', from: 'realname' }
        ]
      },
      auditUsers3: {
        colum: 'auditUsers3',
        value: [],
        target: [
          { to: 'purchaseUserId', from: 'username' },
          { to: 'purchaseUser', from: 'realname' }
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
      precision: 2, // 费用都是双精度类型
      ifPurchase: true
    }
  },
  beforeCreate () {
    // 自行定义方法，引用字典
    // 初始化字典
    /* initDictOptions('project_area').then((res) => {
        if (res.success) {
          console.log(res)
          //this.statusDictOptions = res.result;
        }
      }) */
  },
  // 钩子函数
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.attachment[0].fileTokens = ''
  },
  // 计算属性
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    }
  },
  filters: {
    IconUrl (val) {
      switch (val) {
        case '新增':
          return require('@/assets/img/login/add.png')
        case '编辑':
          return require('@assets/img/login/edit.png')
        case '查看':
          return require('@assets/img/login/view.png')
        case '审核':
          return require('@assets/img/login/audit.png')
        default:
          break
      }
    }
  },
  // 方法
  methods: {
    loadData () {},
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'prjId',
            'prjName',
            'prjNameEn',
            'prjNameAbbr',
            'type',
            'category',
            'scale',
            'place',
            'limitDays',
            'fax',
            'owner',
            'contractType',
            'contractSum',
            'contractNo',
            'contractName',
            'target',
            'purchase',
            'foreignCurrency',
            'description',
            'projectGroup',
            'status',
            'realDb',
            'historyDb',
            'dataServiceDb',
            'dataServiceUrl'
          )
        )
        // 初始化选人组件字段
        this.auditUsers1.value = []
        this.auditUsers2.value = []
        this.auditUsers3.value = []
        // 初始化选人控件
        this.initSelectMan(this, record)

        // 时间格式化
        this.form.setFieldsValue({ startDate: this.model.startDate ? moment(this.model.startDate) : null })
        this.form.setFieldsValue({ finishDate: this.model.finishDate ? moment(this.model.finishDate) : null })
        this.form.setFieldsValue({ finishedDate: this.model.finishedDate ? moment(this.model.finishedDate) : null })
        this.form.setFieldsValue({ closeDate: this.model.closeDate ? moment(this.model.closeDate) : null })
        // 初始化新任务通知
        if (this.model.notifyMethod != undefined) {
          this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
        }
      })
      if (record.ico) {
        this.picUrl = true
      }
      if (record.pic) {
        this.picUrl1 = true
      }
      this.model.datasources = this.getDatasources()
    },
    // getDataServiceUrl(dbKey){
    //   this.datasources.forEach(item=>{
    //     console.log('item=>',item);
    //     if(item.dbKey==dbKey){
    //       this.form.setFieldsValue({dataServiceUrl:item.url})
    //     }
    //   })
    // },
    getDatasources () {
      let data = null
      let httpurl = this.url.datasourceList
      let method = 'get'
      const that = this
      httpAction(httpurl, qs.stringify(data), method).then(res => {
        if (res.success) {
          console.log('datasources =>', res.result)
          that.datasources = res.result
        } else {
          console.log('获取数据源列表失败')
        }
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.picUrl = ''
      this.picUrl1 = ''
      this.fileList = []
      this.ifPurchase = true
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let actionUrl = ''
          let method = 'post'
          // 判断操作类型，新增或者编辑
          if (!this.model.id) {
            actionUrl += this.url.add
          } else {
            actionUrl += this.url.edit
          }
          // 表单数据赋值给formData
          let formData = Object.assign(this.model, values)

          // 选人控件字段赋值给formData
          this.uploadMan(formData, this)

          // 对formData中的时间字段进行 时间格式化
          formData.startDate = formData.startDate ? formData.startDate.format('YYYY-MM-DD HH:mm:ss') : null
          formData.finishDate = formData.finishDate ? formData.finishDate.format('YYYY-MM-DD HH:mm:ss') : null
          formData.finishedDate = formData.finishedDate ? formData.finishedDate.format('YYYY-MM-DD HH:mm:ss') : null
          formData.closeDate = formData.closeDate ? formData.closeDate.format('YYYY-MM-DD HH:mm:ss') : null

          // 发起提交或保存请求
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleChange (info) {
      this.picUrl = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log('upload =>', response)
        if (response.success) {
          console.log('aa', response)
          this.model.ico = response.result.uploadFile.savePath
          console.log('ico', this.model.ico)
          this.picUrl = true
          console.log('aa', this.model.ico)
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    handleChange1 (info) {
      this.picUrl1 = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        if (response.success) {
          console.log('aa', response)
          this.model.pic = response.result.uploadFile.savePath
          this.picUrl1 = true
          console.log('aa', this.model.ico)
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    handleChange2 (info) {
      if (info == '是') {
        this.ifPurchase = true
      } else {
        this.ifPurchase = false
      }
    },
    handlePicCancel () {
      this.previewVisible = false
    },
    handleCancel () {
      this.close()
    },

    beforeUpload: function (file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      // TODO 验证文件大小
    },
    getAvatarView (record) {
      if (record == undefined) {
        return this.url.imgerver + '/' + this.model.ico
      } else {
        return this.url.imgerver + '/' + record.ico
      }
    },
    getAvatarView1 (record) {
      if (record == undefined) {
        return this.url.imgerver + '/' + this.model.pic
      } else {
        return this.url.imgerver + '/' + record.pic
      }
    },
    // 时间选择器的禁用封装
    disabledStartDate (startValue) {
      const endValue = this.form.getFieldValue('finishDate')
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.form.getFieldValue('startDate')
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    valiUrl: function (rule, value, callback) {
      if (isURL(value)) {
        callback()
      } else {
        callback('请输入正确的Url地址!')
      }
    },
    //数据源标识符校验
    validatorPrjId(rule, value, callback) {
      let label = '项目编号'
      let length = [1, 32]
      let val = value ? value : ''
      if (val.length === 0) {
        callback('请填写' + label + '！')
      } else if (/[\s+]/g.test(value)) {
        callback('不可添加空格!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不可输入汉字!')
      } else if (val.length < length[0]) {
        callback('最少输入' + length[0] + '个字')
      } else if (val.length > length[1]) {
        callback('最多输入' + length[1] + '个字')
      } else {
        let method = 'get'
        let requestUrl=this.url.duplicateCheck+'?prjId='+val.trim()
        httpAction(requestUrl, null, method).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
.title {
  margin-bottom: 16px;
}
.ant-input-number {
  :global(.ant-input-number-input-wrap) {
    :global(input) {
      text-align: right;
      padding-right: 30px;
    }
  }
}
/deep/.ant-form-item-control {
  height: 40px;
}
.btnClass {
  margin-top: 15px;
}
</style>
