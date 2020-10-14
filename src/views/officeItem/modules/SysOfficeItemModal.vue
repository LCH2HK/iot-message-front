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
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目">
                  <a-input
                    placeholder="请输入项目"
                    v-decorator="['prjUse', {}]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物品编号">
                  <a-input placeholder="请输入物品编号" v-decorator="['itemId', validatorRules.itemId ]" 
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用品名称">
                  <a-input
                    placeholder="请输入用品名称"
                    v-decorator="['itemName', validatorRules.itemName ]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="规格型号">
                  <a-input placeholder="请输入规格型号" v-decorator="['itemType', {}]" 
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="计量单位">
                  <a-input placeholder="请输入计量单位" v-decorator="['measurement', {}]" 
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参考单价">
                  <a-input-number
                    @change="multiple2"
                    v-decorator="[ 'unitPrice', { initialValue : 0.00 }]"
                    :step="1"
                    :precision="2"
                    :min="0"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />(元)
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数量">
                  <a-input-number @change="multiple1" v-decorator="[ 'itemAmount', {}]" :min="1"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="金额">
                  <a-input-number
                    v-decorator="[ 'sumPrice', { initialValue : 0.00 }]"
                    :step="1"
                    :precision="2"
                    :min="0"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></a-input-number>(元)
                </a-form-item>
              </a-col>
              <a-col :md="24" :sm="8">
                <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="备注">
                  <a-textarea
                    placeholder="请输入备注"
                    v-decorator="['remark', {}]"
                    size:small
                    :rows="3"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写人">
                  <a-input placeholder="请输入填写人姓名" v-decorator="['inputerFullname', {}]" disabled />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系方式">
                  <a-input placeholder="请输入联系方式" v-decorator="['inputerPhone', {}]" disabled />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写部门">
                  <a-input placeholder="请输入填写部门" v-decorator="['inputerDeptid', {}]" disabled />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写时间">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    v-decorator="[ 'inputerTime', validatorRules.inputerTime ]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="领用人">
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
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="领用人部门">
                  <j-select-depart
                    v-decorator="['userDeptid', validatorRules.userDeptid]"
                    :trigger-change="true"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-depart>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门负责人">
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
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="领用部门管理员">
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
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="财务经理">
                  <j-select-user-new
                    v-decorator="['financialMgrUsername',validatorRules.financialMgr]"
                    :selectedDetails="financialMgr"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

            </a-row>
            <a-row>
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新任务通知方式">
                  <a-checkbox-group v-decorator="['notifyMethod', {initialValue: []}]">
                    <a-checkbox value="sms">手机短信</a-checkbox>
                  </a-checkbox-group>
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
              <a-textarea
                :rows="3"
                v-decorator="[ '_taskComment', {}]"
                :disabled="!model.btns"
              />
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
import { asmd } from '@/utils/asmd'
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
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
import { mapGetters } from 'vuex'

export default {
  name: 'SysOfficeItemModal',
  //组件应用定义
  components: {
    STable,
    OptionList,
    JDictSelectTag,
    JSelectDepart,
    JSelectUserNew
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data() {
    return {
      nodeId: '', //环节id
      title: '操作',
      nodeName: '',
      visible: false,
      model: {},
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
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        itemId: { rules: [{ required: true, message: '请输入物品编号！' }] },
        itemName: { rules: [{ required: true, message: '请输入物品名称！' }] },
        auditUsername1: { rules: [{ required: true, message: '请输入领用人！' }] },
        userDeptid: { rules: [{ required: true, message: '请输入领用人部门！' }] },
        auditUsername2: { rules: [{ required: true, message: '请输入部门负责人！' }] },
        auditUsername3: { rules: [{ required: true, message: '请输入领用部门管理员！' }] },
        inputerTime: { rules: [{ required: true, message: '请输入填写日期！' }] },
        financialMgr: { rules: [{ required: true, message: '请输入财务经理！' }] },
        inputerTime: { rules: [{ required: true, message: '请输入填写时间！' }] }
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
        edit: '/sysOfficeItem/sysOfficeItem/edit',
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
      entityName: `SysOfficeItem`,
      processDefinitionKey: '',

      //选人组件初始化
      auditUsername1: '',
      auditFullname1: '',
      auditUsername2: '',
      auditFullname2: '',
      auditUsername3: '',
      auditFullname3: '',
      financialMgrUsername: '',
      financialMgrFullname: '',
      selectUser: ['auditUsers1', 'auditUsers2', 'auditUsers3', 'financialMgr'],
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
      financialMgr: {
        colum: 'financialMgr',
        value: [],
        target: [{ to: 'financialMgrUsername', from: 'username' }, { to: 'financialMgrFullname', from: 'realname' }]
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
          tableName: 'oa_leave_application'
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
    }
  },
  //方法
  methods: {
    ...mapGetters(['userInfo']),
    multiple1(record) {
      var itemAmount = record
      var unitPrice = this.form.getFieldValue('unitPrice')
      // console.log(itemAmount,unitPrice, "www");
      if (unitPrice) {
        this.form.setFieldsValue({ sumPrice: asmd.accMul(itemAmount, unitPrice) }) //itemAmount*unitPrice
      }
    },
    multiple2(record) {
      var itemAmount = this.form.getFieldValue('itemAmount')
      var unitPrice = record
      console.log(itemAmount, unitPrice, 'www')
      if (itemAmount) {
        this.form.setFieldsValue({ sumPrice: asmd.accMul(itemAmount, unitPrice) })
      }
    },
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
            'inputerFullname',
            'prjUse',
            'itemName',
            'notifyMethod',
            'itemId',
            'itemType',
            'measurement',
            'unitPrice',
            'itemAmount',
            'sumPrice',
            'remark',
            // 'inputerName',
            'inputerPhone',
            'inputerDeptid',
            'inputerTime',
            'auditUsername1',
            // 'auditFullname1',
            'userDeptid',
            'auditUsername2',
            // 'auditFullname2',
            'financialMgrUsername',
            // 'financialMgrFullname',
            'auditUsername3',
            '_taskComment'
          )
        )

        // 初始化选人组件字段
        this.auditUsers1.value = []
        this.auditUsers2.value = []
        this.auditUsers3.value = []
        this.financialMgr.value = []
        // 初始化选人控件
        this.initSelectMan(this, record)

        // 初始化填写人
        if (record.inputerFullname) {
          this.form.setFieldsValue({ inputerFullname: record.inputerFullname })
        } else {
          this.form.setFieldsValue({ inputerFullname: this.userInfo().realname })
        }
        // 初始化填写电话
        if (record.inputerPhone) {
          this.form.setFieldsValue({ inputerPhone: record.inputerPhone })
        } else {
          this.form.setFieldsValue({ inputerPhone: this.userInfo().phone })
        }
        // 初始化填写部门
        if (record.inputerDeptid) {
          this.form.setFieldsValue({ inputerDeptid: record.inputerDeptid })
        } else {
          this.form.setFieldsValue({ inputerDeptid: this.userInfo().departName })
        }
        // 初始化环节id
        if (record.nodeId != undefined) {
          this.nodeId = record.nodeId
        }
        //时间格式化
        // this.form.setFieldsValue({ inputerTime: this.model.inputerTime ? moment(this.model.inputerTime) : null })
        this.form.setFieldsValue({ inputerTime: moment(this.model.inputerTime) })
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
      strFormData.inputerTime = strFormData.inputerTime ? strFormData.inputerTime.format('YYYY-MM-DD HH:mm:ss') : null
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
</style>