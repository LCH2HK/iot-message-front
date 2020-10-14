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
            <a-row>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用印种类">
                  <a-select
                    v-decorator="['sealTypes', validatorRules.sealTypes ]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  >
                    <a-select-option
                      :value="item.value"
                      v-for="(item,index) in sealTypes"
                      :key="index"
                    >{{item.title}}</a-select-option>
                  </a-select>
                  <!-- <j-dict-select-tag  v-decorator="['sealTypes', {} ]" placeholder="请选择类型" dictCode="seal_apply"/> -->
                </a-form-item>
              </a-col>

              <a-col v-if="title=='编辑'||title=='查看'" :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用印编号">
                  <a-input disabled placeholder="用印编号" v-decorator="['sealNumber', {}]" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="文件名称">
                  <a-input
                    placeholder="请输入文件名称"
                    v-decorator="['fileName', validatorRules.fileName]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请日期">
                  <a-date-picker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    v-decorator="[ 'applyDate', validatorRules.applyDate]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请人">
                  <j-select-user-new
                    v-decorator="['applicant',validatorRules.applicant]"
                    :selectedDetails="auditUsers5"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选择部门">
                  <j-select-depart
                    v-decorator="['sealDeptid',validatorRules.sealDeptid]"
                    :trigger-change="true"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-depart>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用途">
                  <a-input
                    placeholder="请输入用途"
                    v-decorator="['purpose', validatorRules.purpose]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用印份数">
                  <a-input-number
                    v-decorator="[ 'copies', validatorRules.copies]"
                    :min="1"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写人">
                  <a-input v-decorator="['inputerFullname', {}]" disabled />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写日期">
                  <a-date-picker v-decorator="['createTime', {}]" disabled />
                </a-form-item>
              </a-col>

              <a-col :md="24" :sm="8">
                <a-form-item
                  :labelCol="labelCol1"
                  :wrapperCol="wrapperCol1"
                  class="upload"
                  label="附件"
                >
                  <a-upload
                    :action="uploadAction"
                    listType="picture"
                    :headers="headers"
                    :fileList="fileList"
                    @change="handleChange"
                    @preview="handlePreview"
                    :multiple="true"
                    class="upload-list-inline"
                    v-decorator="['attachment',{}]"
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
            </a-row>

          
              <a-row>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="消息通知方式">
                  <a-checkbox-group
                    v-decorator="['notifyMethod', {initialValue: []}]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  >
                    <a-checkbox value="sms">手机短信</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </a-col>
              </a-row>
           

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门负责人">
                  <j-select-user-new
                    v-decorator="['auditUsername1',validatorRules.auditUsername1]"
                    :selectedDetails="auditUsers1"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="总经理">
                  <j-select-user-new
                    v-decorator="['auditUsername2',validatorRules.auditUsername2]"
                    :selectedDetails="auditUsers2"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门经办人">
                  <j-select-user-new
                    v-decorator="['auditUsername3',validatorRules.auditUsername3]"
                    :selectedDetails="auditUsers3"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="综合管理部负责人">
                  <j-select-user-new
                    v-decorator="['auditUsername4',validatorRules.auditUsername4]"
                    :selectedDetails="auditUsers4"
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
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
import { mapGetters } from 'vuex'

export default {
  name: 'SealApplyModal',
  //组件应用定义
  components: {
    STable,
    OptionList,
    JDictSelectTag,
    JSelectUserNew,
    JSelectDepart
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data() {
    return {
      nodeId: '',
      sealTypes: '',
      title: '操作',
      nodeName: '',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        sealTypes: { rules: [{ required: true, message: '请输入用印种类！' }] },
        fileName: { rules: [{ required: true, message: '请输入文件名！' }] },
        applyDate: { rules: [{ required: true, message: '请输入申请日期！' }] },
        applicant: { rules: [{ required: true, message: '请输入申请人！' }] },
        purpose: { rules: [{ required: true, message: '请输入用途' }] },
        copies: { rules: [{ required: true, message: '请输入用印份数' }] },
        sealDeptid: { rules: [{ required: true, message: '请输入申请部门' }] },
        auditUsername1: { rules: [{ required: true, message: '请输入部门负责人' }] },
        auditUsername2: { rules: [{ required: true, message: '请输入总经理' }] },
        auditUsername3: { rules: [{ required: true, message: '请输入部门经办人' }] },
        auditUsername4: { rules: [{ required: true, message: '请输入综合管理部负责人' }] }
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
        edit: '/sealApply/sealApply/edit',
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
      entityName: `SealApply`,
      processDefinitionKey: '',

      //选人组件初始化
      auditUsername1: '',
      auditFullname1: '',
      auditUsername2: '',
      auditFullname2: '',
      auditUsername3: '',
      auditFullname3: '',
      auditUsername4: '',
      auditFullname4: '',
      applicant: '',
      applicantFullname: '',

      selectUser: ['auditUsers1', 'auditUsers2', 'auditUsers3', 'auditUsers4', 'auditUsers5'],
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
      auditUsers4: {
        colum: 'auditUsers4',
        value: [],
        target: [{ to: 'auditUsername4', from: 'username' }, { to: 'auditFullname4', from: 'realname' }]
      },
      auditUsers5: {
        colum: 'auditUsers5',
        value: [],
        target: [{ to: 'applicant', from: 'username' }, { to: 'applicantFullname', from: 'realname' }]
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
          tableName: 'seal_apply'
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
  beforeCreate() {
    initDictOptions('seal_apply').then(res => {
      if (res.success) {
        this.sealTypes = res.result
      }
    })
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
    }
  },
  //方法
  methods: {
    ...mapGetters(['nickname']),
    ...mapGetters(['userInfo']),
    loadData() {},
    add() {
      this.edit({})
    },
    edit(record) {
      //重置表单数据
      this.form.resetFields()
      //初始化表头
      if (record.nodeName != undefined) {
        this.nodeName = record.nodeName
      }
      // 初始化环节id
      if (record.nodeId != undefined) {
        this.nodeId = record.nodeId
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
            'sealTypes',
            'sealNumber',
            'fileName',
            'applicant',
            'apply_date',
            'applicantFullname',
            'sealDeptid',
            'purpose',
            'copies',
            'attachment',
            'notifyMethod',
            'auditUsername1',
            'auditUsername2',
            'auditUsername3',
            'auditUsername4',
            '_taskComment'
          )
        )

        // 初始化选人组件字段
        this.auditUsers1.value = []
        this.auditUsers2.value = []
        this.auditUsers3.value = []
        this.auditUsers4.value = []
        this.auditUsers5.value = []
        // 初始化选人控件
        this.initSelectMan(this, record)

        // 初始化请假人
        if (record.inputerFullname) {
          this.form.setFieldsValue({ inputerFullname: record.inputerFullname })
        } else {
          this.form.setFieldsValue({ inputerFullname: this.nickname() })
        }

        //时间格式化
        this.form.setFieldsValue({ applyDate: this.model.applyDate ? moment(this.model.applyDate) : null })
        this.form.setFieldsValue({ createTime: moment(this.model.applyDate) })
        // 初始化新任务通知
        if (this.model.notifyMethod != undefined) {
          that.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
        }
        console.log('aaaa')
        console.log(this.nickname())
        console.log(this.userInfo().departName)
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
      strFormData.applyDate = strFormData.applyDate ? strFormData.applyDate.format('YYYY-MM-DD HH:mm:ss') : null
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
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
//调整附件按钮位置
.ant-col-sm-8.ant-col-md-12,
.ant-col-sm-8.ant-col-md-24 {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
//调整默认边距
.ant-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  /* :global(.ant-form-item-control-wrapper) {
    :glabal(td) {
      vertical-align: middle;
    }
  } */
}
</style>