<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1000"
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
        {{title}}
        <span>{{ nodeName ? '(' + nodeName + ')': ''}}</span>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="project" />表单详情
        </span>
        <a-spin :spinning="confirmLoading">
          <a-form :form="form">
            <a-row :gutter="24">
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标题">
                  <a-input
                    placeholder="请输入标题"
                    v-decorator="['title', validatorRules.title ]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="来文时间">
                  <a-date-picker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    v-decorator="[ 'incomingDocumentTime', validatorRules.incomingDocumentTime ]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="编号">
                  <a-input
                    placeholder="请输入编号"
                    v-decorator="['numbering', validatorRules.numbering ]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="来文单位">
                  <j-dict-select-tag
                    v-decorator="['incomingDocumentUnit', validatorRules.incomingDocumentUnit ]"
                    :triggerChange="true"
                    placeholder="请选择来文单位"
                    dictCode="incoming_document_unit"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="来文文号">
                  <a-input
                    placeholder="请输入来文文号"
                    v-decorator="['incomingDocumentNumber', validatorRules.incomingDocumentNumber ]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="拟办意见">
                  <a-input
                    placeholder="请输入拟办意见"
                    v-decorator="['proposedOpinion', {}]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="8">
                <a-form-item
                  :labelCol="labelCol1"
                  :wrapperCol="wrapperCol1"
                  class="upload"
                  label="附件"
                >
                  <!-- <a-upload
                    :action="uploadAction"
                    listType="picture"
                    :headers="headers"
                    :fileList="fileList"
                    @change="handleChange"
                    @preview="handlePreview"
                    :multiple="true"
                    class="upload-list-inline"
                    v-decorator="['attachment',{}]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"
                  >-->
                  <a-upload
                    :action="uploadAction"
                    listType="picture"
                    :headers="headers"
                    :fileList="fileList"
                    @change="disabledBtn"
                    @preview="handlePreview"
                    :multiple="true"
                    class="upload-list-inline"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"
                  >
                    <a-button>
                      <a-icon type="upload" />上传
                    </a-button>
                  </a-upload>
                  <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                  </a-modal>
                  <br />
                </a-form-item>
              </a-col>
              <!-- <a-row :gutter="24"> -->
                <a-col :md="13" :sm="8">
                  <a-form-item :labelCol="labelCol2" :wrapperCol="wrapperCol2" label="文件类型">
                    <!-- <a-input
                      placeholder="请输入文件类型"  
                      v-decorator="['fileType', validatorRules.fileType ]"
                      :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                    />-->
                    <j-dict-select-tag
                      v-decorator="['fileType', validatorRules.fileType ]"
                      :triggerChange="true"
                      placeholder="请选择文件类型"
                      dictCode="file_type"
                      :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"
                    />
                  </a-form-item>
                </a-col>
              <!-- </a-row> -->
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写人">
                  <!-- <a-input
                    placeholder="请输入填写人"
                    v-decorator="['fillInMan', validatorRules.fillInMan ]"
                  />-->
                  <a-input
                    placeholder="请输入拟稿人"
                    v-decorator="['fillInMan', validatorRules.fillInMan]"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                  <!-- <a-input
                    placeholder="请输入联系电话"
                    v-decorator="['contactNumber', validatorRules.contactNumber ]"
                  />-->
                  <a-input
                    placeholder="请输入联系电话"
                    v-decorator="['contactNumber', validatorRules.contactNumber]"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写部门">
                  <!-- <a-input
                    placeholder="请输入填写部门"
                    v-decorator="['fillInDeptid', validatorRules.fillInDeptid ]"
                  />-->
                  <a-input
                    placeholder="请输入填写部门"
                    v-decorator="['fillInDeptid', validatorRules.fillInDeptid]"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写日期">
                  <!-- <a-date-picker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    v-decorator="[ 'fillInTime', validatorRules.fillInTime ]"
                  /> -->
                  <a-date-picker
                    showTime
                    format="YYYY-MM-DD"
                    v-decorator="[ 'fillInTime', validatorRules.fillInTime ]"
                    disabled
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新任务通知方式">
                  <a-checkbox-group
                    v-decorator="['notifyMethod', {initialValue: []}]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  >
                    <a-checkbox value="sms">手机短信</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公司总经理">
                  <j-select-user-new
                    v-decorator="['auditUsername1',validatorRules.auditUsername1 ]"
                    :selectedDetails="auditUsers1"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主办">
                  <j-select-user-new
                    v-decorator="['auditUsername2',validatorRules.auditUsername2 ]"
                    :selectedDetails="auditUsers2"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="协办">
                  <j-select-user-new
                    v-decorator="['auditUsername3',validatorRules.auditUsername3 ]"
                    :selectedDetails="auditUsers3"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              label="审批意见"
              v-show="(model.status !== undefined && model.status !== 0 && title !== '编辑' && nodeName != '填写表单' && title !== '查看')"
              :disabled="title == '编辑'"
            >
              <a-textarea :rows="3" v-decorator="[ '_taskComment', {}]" :disabled="!model.btns" />
            </a-form-item>
            <a-row :gutter="24" v-if="btns">
              <a-col :span="24">
                <a-form-item class="btnClass">
                  <template v-for="(placement, index) in btns">
                    <a-dropdown placement="bottomCenter" :key="index">
                      <a-button
                        style="margin-right:10px"
                        @click="onChange(placement)"
                        :icon="placement.btnIcon"
                        class="confirm"
                        type="primary"
                      >{{placement.btnName}}</a-button>
                      <a-menu slot="overlay" v-if="placement.btnApi == '/task/rollback'">
                        <a-menu-item v-for="(v,k) in rollback" :key="k">
                          <div @click="goBack(v.nodeId)">{{ v.nodeName }}</div>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </template>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="!btns">
              <a-col :md="24" :sm="8">
                <a-form-item class="btnClass">
                  <a-button
                    @click="handleOk"
                    icon="check"
                    class="confirm"
                    type="primary"
                  >{{ model.status == undefined ? '提交' : '确定' }}</a-button>
                  <a-button
                    @click="handleSave('start')"
                    icon="diff"
                    v-if="model.status == undefined"
                    class="cancel"
                  >暂存</a-button>
                  <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <a-row :gutter="24">
            <a-col :md="24" :sm="8">
              <option-list
                :commentList="commentList"
                :currentList="currentList"
                v-if="model.status !== undefined"
              ></option-list>
            </a-col>
          </a-row>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" forceRender>
        <span slot="tab">
          <a-icon type="bell" />流程图
        </span>
        <div>
          <div class="proc_bg">
            <h3>
              <span>流程图</span>
            </h3>
            <img :src="urlChart" />
          </div>
          <div class="proc_bg">
            <h3>
              <span>已完成</span>
            </h3>
            <s-table
              :columns="goodsColumns"
              :data="loadGoodsData"
              v-if="commentList"
              :pagination="false"
            ></s-table>
          </div>
          <div class="proc_bg">
            <h3>
              <span>处理中</span>
            </h3>
            <s-table
              :columns="goodsColumns1"
              :data="loadGoodsData1"
              v-if="commentList"
              :pagination="false"
            ></s-table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { httpAction, getActionUrl, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import OptionList from './OptionList'
import qs from 'qs'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import STable from '@/components/table/'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import { mapGetters } from 'vuex'

export default {
  name: 'ReceivingManagementModal',
  //组件应用定义
  components: {
    STable,
    OptionList,
    JDictSelectTag,
    JSelectUserNew
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data() {
    return {
      title: '操作',
      nodeId: '', //环节id
      nodeName: '',
      visible: false,
      model: {},
      // labelCol: {
      //   xs: { span: 24 },
      //   sm: { span: 5 } //修改此处可显示被输入框隐藏的字
      // },
      // wrapperCol: {
      //   xs: { span: 24 },
      //   sm: { span: 19 }
      // },
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
        sm: { span: 3 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        title: { rules: [{ required: true, message: '请输入标题!' }] },
        incomingDocumentTime: { rules: [{ required: true, message: '请输入来文时间!' }] },
        numbering: { rules: [{ required: true, message: '请输入编号!' }] },
        incomingDocumentUnit: { rules: [{ required: true, message: '请输入来文单位!' }] },
        incomingDocumentNumber: { rules: [{ required: true, message: '请输入来文文号!' }] },
        fileType: { rules: [{ required: true, message: '请输入文件类型!' }] },
        fillInMan: { rules: [{ required: true, message: '请输入填写人!' }] },
        contactNumber: { rules: [{ required: true, message: '请输入联系电话!' }] },
        fillInDeptid: { rules: [{ required: true, message: '请输入填写部门!' }] },
        fillInTime: { rules: [{ required: true, message: '请输入填写日期!' }] },
        auditUsername1: { rules: [{ required: true, message: '请输入公司总经理用户名!' }] },
        auditUsername2: { rules: [{ required: true, message: '请输入主办用户名!' }] },
        auditUsername3: { rules: [{ required: true, message: '请输入协办用户名!' }] }
      },
      commentList: {},
      currentList: 0,
      unfinishedList: {},
      urlChart: '',
      //已完成表头设置
      goodsColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '步骤名称',
          dataIndex: 'nodeName',
          key: 'nodeName'
        },
        {
          title: '处理人',
          dataIndex: 'assigneeFullname',
          key: 'assigneeFullname',
          align: 'center'
        },
        {
          title: '到达时间',
          dataIndex: 'startTime',
          key: 'startTime',
          align: 'center'
        },
        {
          title: '完成时间',
          dataIndex: 'endTime',
          key: 'endTime',
          align: 'right',
          align: 'center'
        },
        {
          title: '处理意见',
          dataIndex: '_taskComment',
          key: '_taskComment',
          customRender: (text, record, index) => {
            let re = ''
            if (!text) {
              re = '无意见'
            } else {
              re = text
            }
            return re
          }
        }
      ],
      //处理中表头
      goodsColumns1: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 80,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '步骤名称',
          dataIndex: 'nodeName',
          key: 'nodeName'
        },
        {
          title: '当前处理',
          dataIndex: 'assigneeFullname',
          key: 'assigneeFullname',
          align: 'center'
        },
        {
          title: '到达时间',
          dataIndex: 'startTime',
          key: 'startTime',
          align: 'center'
        }
      ],
      arr: [], //初始化完成列表
      arr1: [], //初始化进行中列表
      url: {
        add: '/flowable/action',
        edit: '/receivingManagement/receivingManagement/edit',
        chart: '/flowable/process/diagram',
        taskComment: '/flowable/process/taskComment',
        getEntityName: '/sysFlow/flowConfig/getProcessDefinitionKeyByEntityName',
        //上传组件地址
        fileFind: '/file/cmpFileGroup/findFilesByGroupId',
        fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById'
      },

      //动态获取流程定义Key
      entityName: `ReceivingManagement`,
      processDefinitionKey: '',

      //选人组件初始化
      auditUsername1: '',
      auditFullname1: '',
      auditUsername2: '',
      auditFullname2: '',
      auditUsername3: '',
      auditFullname3: '',
      selectUser: ['auditUsers1', 'auditUsers2', 'auditUsers3'],
      auditUsers1: {
        colum: 'auditUsers1',
        value: [],
        target: [{ to: 'auditUsername1', from: 'username' }, { to: 'auditFullname1', from: 'realname' }]
      },
      auditUsers2: {
        colum: 'auditUsers2',
        value: [],
        target: [{ to: 'auditUsername2', from: 'username' }, { to: 'auditFullname2', from: 'realname' }]
      },
      auditUsers3: {
        colum: 'auditUsers3',
        value: [],
        target: [{ to: 'auditUsername3', from: 'username' }, { to: 'auditFullname3', from: 'realname' }]
      },
      // 上传附件定义
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false,
      attachment: [
        {
          groupId: '',
          fileTokens: '',
          fieldName: 'attachment',
          tableName: 'receiving_management'
        }
      ]
    }
  },
  filters: {
    IconUrl(val) {
      switch (val) {
        case '新增':
          return require(`@/assets/img/login/add.png`)
        case '编辑':
          return require(`@assets/img/login/edit.png`)
        default:
          break
      }
    }
  },
  //钩子函数
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.attachment[0].fileTokens = ''
    this.getEntity()
  },
  // 计算属性
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    },
    btns() {
      return this.model.btns
    },
    rollback() {
      return this.model.rollBackAbleNodes
    },
    // 禁用上传函数切换  环节
    disabledBtn() {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    }
  },
  //方法
  methods: {
    ...mapGetters(['userInfo']), //当前登录用户的所有信息
    loadData() {},
    add() {
      this.edit({})
    },
    edit(record) {
      //重置表单数据
      this.form.resetFields()

      // 初始化环节id
      if (record.nodeId != undefined) {
        this.nodeId = record.nodeId
      }

      //初始化表头
      if (record.nodeName != undefined) {
        this.nodeName = record.nodeName
      }
      //将record中毒的数据赋值给model
      if (record.formData !== undefined) {
        this.model = Object.assign({}, record.flowData.processVar, record.flowData, record.formData, {
          taskId: record.taskId
        })
      } else {
        this.model = Object.assign({}, record)
      }
      //弹窗打开
      this.visible = true
      this.$nextTick(() => {
        //设置表单字段
        this.form.setFieldsValue(
          pick(
            this.model,
            'status',
            'notifyMethod',
            'title',
            'numbering',
            'incomingDocumentUnit',
            'incomingDocumentNumber',
            'proposedOpinion',
            'attachment',
            'fileType',
            'fillInMan',
            'contactNumber',
            'fillInDeptid',
            'auditUsername1',
            'auditFullname1',
            'auditUsername2',
            'auditFullname2',
            'auditUsername3',
            'auditFullname3',
            '_taskComment'
          )
        )

        // 初始化选人组件字段
        this.auditUsers1.value = []
        this.auditUsers2.value = []
        this.auditUsers3.value = []
        // 初始化选人控件
        this.initSelectMan(this, record)

        // 初始化填写人
        if (record.fillInMan) {
          this.form.setFieldsValue({ fillInMan: record.fillInMan })
        } else {
          this.form.setFieldsValue({ fillInMan: this.userInfo().username })
        }

        if (record.contactNumber) {
          this.form.setFieldsValue({ contactNumber: record.contactNumber })
        } else {
          this.form.setFieldsValue({ contactNumber: this.userInfo().phone })
        }

        if (record.fillInDeptid) {
          this.form.setFieldsValue({ fillInDeptid: record.fillInDeptid })
        } else {
          this.form.setFieldsValue({ fillInDeptid: this.userInfo().departName })
        }

        //时间格式化
        this.form.setFieldsValue({
          incomingDocumentTime: this.model.incomingDocumentTime ? moment(this.model.incomingDocumentTime) : null
        })
        // this.form.setFieldsValue({ fillInTime:  this.model.fillInTime ? moment(this.model.fillInTime) : null  })
         this.form.setFieldsValue({ fillInTime:  moment(this.model.fillInTime)  }) //修改为默认回填当前时间
        // 初始化新任务通知
        if (this.model.notifyMethod != undefined) {
          that.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
        }
      })

      // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
      this.initUpload(this, 0)

      //请求流程图 + 审批意见
      // 第二个参数为流程图接口地址，第三哥参数为审批意见接口地址
      let that = this
      setTimeout(function() {
        that.initChartAndComment(that, record, that.url.chart, that.url.taskComment)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.fileList = []
    },
    // 提交和暂存函数在mins里面
    // handleOk(){},
    // handleSave(){},
    goBack(id) {
      this.onChange('jump', id)
    },
    // 时间格式化
    timeFormat(strFormData) {
      //时间格式化
      strFormData.incomingDocumentTime = strFormData.incomingDocumentTime
        ? strFormData.incomingDocumentTime.format('YYYY-MM-DD HH:mm:ss')
        : null
      strFormData.fillInTime = strFormData.fillInTime ? strFormData.fillInTime.format('YYYY-MM-DD HH:mm:ss') : null
    },
    handleCancel() {
      this.close()
    },
    // 加载数据方法 必须为 Promise 对象
    loadGoodsData() {
      var that = this
      return new Promise(resolve => {
        resolve({
          data: that.arr
        })
      }).then(res => {
        return res
      })
    },
    loadGoodsData1() {
      var that = this
      return new Promise(resolve => {
        resolve({
          data: that.arr1
        })
      }).then(res => {
        return res
      })
    },
    handleChange(info) {
      //调用改变方法
      this.handleChange1(info, this, 0)
    },
    handlePicCancel() {
      this.previewVisible = false
    },
    // 取代禁用的handlechange方法
    blank(info) {}
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>