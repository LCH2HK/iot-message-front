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
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!-- 表单标题 -->
      <div class="title">
        <div>
          <img :src="title | IconUrl" />
          {{title}}
          <span>{{ nodeName ? '(' + nodeName + ')': ''}}</span>
        </div>
        <a-icon type="close" class="closeIcon" @click="handleCancel" />
      </div>

      <!-- 表单内容tabs -->
      <a-tabs defaultActiveKey="1">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="file-text" />表单详情
          </span>

          <!-- 主表单区域 -->
          <a-form :form="form">
            <!-- 常用选择/输入控件 -->
            <a-row :gutter="24">
              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目名称">
                  <a-input
                    placeholder="请输入项目名称"
                    v-decorator="['prjName', validatorRules.templatePrjName]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="表单编号">
                  <a-input placeholder="流程结束后自动生成" v-decorator="['formId', {}]" :disabled="true" />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="依托工程">
                  <a-input
                    placeholder="请选择依托工程"
                    @click="openRelyingEngineeringModel"
                    v-decorator="['relyingEngineering', validatorRules.templateRelyingEngineering]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  >
                  </a-input>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目负责人">
                  <j-select-user-new
                    v-decorator="['prjLeaderUsername',validatorRules.templatePrjLeader ]"
                    :selectedDetails="prjLeader"
                    @callback="setAuditUser"
                    class="userSelect"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请单位">
                  <j-select-depart
                    v-decorator="['applicantDeptId', validatorRules.templateApplicantDeptId]"
                    :trigger-change="true"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-depart>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参与单位">
                  <j-select-depart
                    v-decorator="['participatingDeptId', {}]"
                    :trigger-change="true"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-depart>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目领域">
                  <j-dict-select-tag
                    v-decorator="['prjArea', validatorRules.templatePrjArea ]"
                    :triggerChange="true"
                    placeholder="请选择项目领域"
                    dictCode="prj_area"
                    :disabled="(this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目级别">
                  <j-dict-select-tag
                    placeholder="请输入项目级别"
                    v-decorator="['prjLevel', validatorRules.templatePrjLevel]"
                    :triggerChange="true"
                    dictCode="prj_level"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="计划开始时间">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    v-decorator="[ 'planStarttime', validatorRules.templatePlanStarttime]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="计划完成时间">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    v-decorator="[ 'planEndtime', validatorRules.templatePlanEndtime]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否有外委">
                  <a-radio-group
                    placeholder="请输入是否有外委(有或无，单选)"
                    v-decorator="['proxyIf', validatorRules.templateProxyIf]"
                    @change="proxyIfStatus"
                  >
                    <a-radio
                      value="1"      
                      :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                    >是</a-radio>
                    <a-radio
                      value="0"
                      :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                    >否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="外委费用(元)">
                  <a-input-number
                    @change="addCost"
                    v-decorator="[ 'proxyCosts',validatorRules.templateProxyCosts]"
                    :step="1"
                    :precision="2"
                    :min="0"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看' || this.proxyExist == false"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->
              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="外部来款(元)">
                  <a-input-number
                    @change="addCost"
                    v-decorator="[ 'externalInputs', validatorRules.templateExternalInputs]"
                    :step="1"
                    :precision="2"
                    :min="0"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="总经费(元)">
                  <a-input-number
                    v-decorator="[ 'sumCost', validatorRules.templateSumCost]"
                    :step="1"
                    :precision="2"
                    :min="0"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    disabled
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="24" :sm="8">
                <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="目的、意义">
                  <a-textarea
                    placeholder="不多于2000字"
                    v-decorator="['prjPurpose', validatorRules.templatePrjPurpose]"
                    :rows="3"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                    maxlength="2000"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="24" :sm="8">
                <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="主要研究内容">
                  <a-textarea
                    placeholder="不少于50字"
                    v-decorator="['mainResearchContent', validatorRules.templateMainResearchContent]"
                    :rows="3"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <!-- 子表单区域 -->
            <a-tabs v-model="activeKey" @change="handleChangeTabs">
              <a-tab-pane tab="计划进度及研究成果" :key="refKeys[0]" :forceRender="true">
                <j-editable-table
                  :ref="refKeys[0]"
                  :loading="testMainZjhDetailTable.loading"
                  :columns="testMainZjhDetailTable.columns"
                  :dataSource="testMainZjhDetailTable.dataSource"
                  :maxHeight="300"
                  :rowNumber="true"
                  :rowSelection="true"
                  :actionButton="true"      
                  :readOnly="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                />
              </a-tab-pane>
            </a-tabs>

            <a-row :gutter="24">
              <!-- 附件上传 -->

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

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写人">
                  <a-input placeholder="请输入填写人姓名" v-decorator="['inputerFullname', {}]" disabled />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写时间">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    v-decorator="[ 'inputerTime', {}]"
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  />
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="24" :sm="8">
                <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="消息通知方式">
                  <a-checkbox-group v-decorator="['notifyMethod', {initialValue: []}]">
                    <a-checkbox value="sms">手机短信</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="承办单位领导审批">
                  <j-select-user-new
                    v-decorator="['auditUsername1',validatorRules.templateAuditUsername2 ]"
                    :selectedDetails="auditUsers1"
                    @callback="setAuditUser"
                    class="userSelect"
                    multiple
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="专家评审">
                  <j-select-user-new
                    v-decorator="['auditUsername2',validatorRules.templateAuditUsername2 ]"
                    :selectedDetails="auditUsers2"
                    @callback="setAuditUser"
                    class="userSelect"
                    multiple
                    :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
                  ></j-select-user-new>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->

              <a-col :md="12" :sm="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="科技部门领导审批">
                  <j-select-user-new
                    v-decorator="['auditUsername3',validatorRules.templateAuditUsername3 ]"
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
          </a-form>

          <!-- 异步按钮 -->
          <a-form-item class="btnClass" v-if="model.btns">
            <template v-for="(item, index) in model.btns">
              <a-dropdown placement="bottomCenter" :key="index">
                <a-button
                  style="margin-right:10px"
                  type="primary"
                  @click="handle(item.btnApi)"
                  :icon="item.btnIcon"
                  class="confirm"
                >{{item.btnName}}</a-button>
                <a-menu slot="overlay" v-if="item.btnApi == '/task/rollback'">
                  <a-menu-item v-for="(v,k) in model.rollBackAbleNodes" :key="k">
                    <div @click="goBack(v.nodeId)">{{ v.nodeName }}</div>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-form-item>
          <!-- 同步按钮 -->
          <a-form-item class="btnClass" v-if="!model.btns">
            <a-button
              @click="handle('submit')"
              icon="check"
              type="primary"
              class="confirm"
              v-if="model.status == undefined"
            >提交</a-button>
            <a-button
              @click="handle('start')"
              icon="save"
              type="primary"
              class="confirm"
              v-if="model.status == undefined"
            >暂存</a-button>
            <a-button @click="handleCancel" icon="close" type="primary" class="cancel">关闭</a-button>
            <a-button
              @click="handleEdit"
              icon="check"
              type="primary"
              style="margin-right:10px"
              class="confirm"
              v-if="model.status != undefined"
            >保存</a-button>
          </a-form-item>
          <a-row :gutter="24">
            <a-col :md="24" :sm="8">
              <option-list
                :commentList="commentList"
                :currentList="currentList"
                v-if="model.status !== undefined"
              ></option-list>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="2">
          <span slot="tab">
            <!-- <a-icon type="area-chart" />流程图 -->
            <img src="@/assets/img/login/process.png" alt />
            流程图
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
    </a-spin>
    <relying-engineering-model :visible="relyingVisible" @cancel="relyingCancel" @select="relyingSelect"></relying-engineering-model>
  </a-modal>
</template>

<script>
import { asmd } from '@/utils/asmd'
import { FormTypes } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { getAction } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment'
import pick from 'lodash.pick'
import Vue from 'vue'
import qs from 'qs'
import STable from '@/components/table/'
import OptionList from '@/views/oa/modules/OptionList'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
import { mapGetters } from 'vuex'
import relyingEngineeringModel from './relyingEngineeringModel'

export default {
  name: 'TestMainZjhModal',
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [JEditableTableMixin, CmpListMixin],
  //引入组件定义
  components: {
    STable,
    OptionList,
    JDictSelectTag,
    JSelectDepart,
    JSelectUserNew,
    relyingEngineeringModel,
    JDictSelectTag
  },
  data() {
    return {
      nodeId: '', //环节id
      relyingVisible: false,
      nodeName: '',
      processDefinitionKey: '',
      attachment: [],
      proxyExist: true,
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 2,
      validatorRules: {
        templatePrjName: { rules: [{ required: true, message: '请输入项目名称!' }] },
        templateRelyingEngineering: { rules: [{ required: true, message: '请输入依托工程!' }] },
        templatePrjLeader: { rules: [{ required: true, message: '请输入项目负责人!' }] },
        templateApplicantDeptId: { rules: [{ required: true, message: '请输入申请部门!' }] },
        templatePrjArea: { rules: [{ required: true, message: '请输入项目领域!' }] },
        templatePrjLevel: { rules: [{ required: true, message: '请输入项目级别!' }] },
        templatePlanStarttime: { rules: [{ required: true, message: '请输入计划开始时间!' }] },
        templatePlanEndtime: { rules: [{ required: true, message: '请输入计划完成时间!' }] },
        templateProxyIf: { rules: [{ required: true, message: '请输入是否有外委!' }] , initialValue: '1' },
        templateProxyCosts: { rules: [{ required: true, message: '请输入外委费用!' }], initialValue: 0.0 },
        templateExternalInputs: { rules: [{ required: true, message: '请输入外部来款!' }], initialValue: 0.0 },
        templateSumCost: { rules: [{ required: true, message: '请输入总经费!' }], initialValue: 0.0 },
        templatePrjPurpose: { rules: [{ required: true, message: '请输入目的意义!' }] },
        templateMainResearchContent: { rules: [{ validator: this.validateMainResearchContent }] },
        templateAttachment: { rules: [{ required: true, message: '请输入附件!' }] },
        templateAuditUsername1: { rules: [{ required: true, message: '请输入承办单位领导审批!' }] },
        templateAuditUsername2: { rules: [{ required: true, message: '请输入专家评审!' }] },
        templateAuditUsername3: { rules: [{ required: true, message: '请输入科技部门领导审批!' }] }
      },
      refKeys: ['testMainZjhDetail'],
      activeKey: 'testMainZjhDetail',
      // 计划进度及研究成果
      testMainZjhDetailTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '年月',
            key: 'planTime',
            type: FormTypes.date,
            defaultValue: '2019-08-01'
          },
          {
            title: '进度计划',
            key: 'planSchedule',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}'
          },
          {
            title: '成果目标',
            key: 'planGoal',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}'
          }
        ]
      },
      url: {
        add: '/testMainZjh/testMainZjh/add',
        edit: '/testMainZjh/testMainZjh/edit',
        action: '/flowable/action',
        testMainZjhDetail: {
          list: '/testMainZjh/testMainZjh/queryTestMainZjhDetailByMainId'
        },
        chart: '/flowable/process/diagram',
        taskComment: '/flowable/process/taskComment',
        getprocessDefinitionKey: '/sysFlow/flowConfig/getProcessDefinitionKeyByEntityName',

        //上传组件地址
        fileFind: '/file/cmpFileGroup/findFilesByGroupId',
        fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById'
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
          tableName: 'test_main_zjh'
        }
      ],

      //选人组件初始化
      auditUsername1: '',
      auditFullname1: '',
      auditUsername2: '',
      auditFullname2: '',
      auditUsername3: '',
      auditFullname3: '',
      prjLeaderUsername: '',
      prjLeaderFullname: '',

      selectUser: ['auditUsers1', 'auditUsers2', 'auditUsers3', 'prjLeader'],
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
      prjLeader: {
        colum: 'prjLeader',
        value: [],
        target: [{ to: 'prjLeaderUsername', from: 'username' }, { to: 'prjLeaderFullname', from: 'realname' }]
      }
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

  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.attachment[0].fileTokens = ''
  },

  mounted() {
    let params = { entityName: 'TestMainZjh' },
      method = 'get'
    getAction(this.url.getprocessDefinitionKey, params).then(res => {
      if (res.success) {
        this.processDefinitionKey = res.result
      }
    })
  },
  // 计算属性
  computed: {
    // 附件上传url
    uploadAction: function() {
      return this.url.fileUpload
    },
    // 禁用上传函数切换 环节
    disabledBtn() {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    }
  },
  methods: {
    ...mapGetters(['nickname']),
    openRelyingEngineeringModel(){
      this.relyingVisible = true
    },
    relyingCancel() {
      this.relyingVisible = false
    },
    relyingSelect(record){
      this.relyingVisible = false
      const that = this
      that.$nextTick(()=>{
        that.model = { prjLeaderUsername : record.prjLeaderUsername, prjLeaderFullname : record.prjLeaderFullname}
        that.form.setFieldsValue({ relyingEngineering : record.prjName })
        that.form.setFieldsValue({ applicantDeptId : record.applicantDeptId })
        that.initSelectMan(that, this.model)
      })
    },
    validateMainResearchContent(rule, value, callback) {
      var mainResearchContent = this.form.getFieldValue('mainResearchContent')
      if (mainResearchContent) {
        console.log(mainResearchContent.length, 'length')
        if (mainResearchContent.length < 50) {
          callback('主要内容不得少于50字!')
        } else {
          callback()
        }
      } else {
        callback('请输入主要研究内容!')
      }
    },
    proxyIfStatus() {
      var proxyIf = this.form.getFieldValue('proxyIf')
      console.log(proxyIf, 'proxyIf')

      if (proxyIf == '1') {
        this.validatorRules.templateProxyCosts.rules[0].required = false
        this.proxyExist = false
        this.form.setFieldsValue({proxyCosts:0})
        this.addCost()
      } else {
        this.validatorRules.templateProxyCosts.rules[0].required = true
        this.proxyExist = true
      }
    },
    addCost() {
      var proxyCosts = this.form.getFieldValue('proxyCosts')
      var externalInputs = this.form.getFieldValue('externalInputs')
      // console.log(itemAmount,unitPrice, "www");
      this.form.setFieldsValue({ sumCost: asmd.accAdd(proxyCosts, externalInputs) }) //itemAmount*unitPrice
    },
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

      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'prjName',
            'formId',
            'prjLeaderUsername',
            'prjLeaderFullname',
            'status',
            'applicantDeptId',
            'inputerTime',
            'prjLevel',
            'inputerName',
            'inputerFullname',
            'notifyMethod',
            'relyingEngineering',
            'participatingDeptId',
            'prjArea',
            'planStarttime',
            'planEndtime',
            'proxyIf',
            'proxyCosts',
            'externalInputs',
            'sumCost',
            'prjPurpose',
            'mainResearchContent',
            'prjAttachment',
            'auditUsername1',
            'auditFullname1',
            'auditUsername2',
            'auditFullname2',
            'auditUsername3',
            'auditFullname3'
          )
        )
        // 初始化选人组件字段
        this.auditUsers1.value = []
        this.auditUsers2.value = []
        this.auditUsers3.value = []
        this.prjLeader.value = []

        // 初始化选人控件
        this.initSelectMan(this, record)
        // 时间格式化
        this.form.setFieldsValue({ inputerTime: moment(this.model.inputerTime) })
        this.form.setFieldsValue({ planStarttime: this.model.planStarttime ? moment(this.model.planStarttime) : null })
        this.form.setFieldsValue({ planEndtime: this.model.planEndtime ? moment(this.model.planEndtime) : null })
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.testMainZjhDetail.list, params, this.testMainZjhDetailTable)
      }
      // else {
      //在JEditableTableMixin调用一个公共方法，让子表数据填值
      // }

      //请求流程图 + 审批意见
      // 第二个参数为流程图接口地址，第三哥参数为审批意见接口地址
      this.initChartAndComment(this, record, this.url.chart, this.url.taskComment)

      this.$nextTick(() => {
        // 初始化填写人
        if (record.inputerFullname) {
          this.form.setFieldsValue({ inputerFullname: record.inputerFullname })
        } else {
          this.form.setFieldsValue({ inputerFullname: this.nickname() })
        }
        //初始化表单编号
        if (record.formId) {
          this.form.setFieldsValue({ inputerFullname: record.formId })
        }
        //初始化子表的计划时间
        var nowYear = new Date().getFullYear()
        var date1 = new Date(nowYear + '-06-01')
        var date2 = new Date(nowYear, '-01-01')
        // if (record.planTime) {
        //   this.form.setFieldsValue({ planTime: record.planTime })
        // } else {
        //   this.form.setFieldsValue({ planTime: date })
        // }
      })
      //console.log(this.userInfo(),'用户信息')

      // 初始化环节id
      if (record.nodeId != undefined) {
        this.nodeId = record.nodeId
      }
      // 初始化任务通知方式
      if (this.model.notifyMethod != undefined) {
        this.model.notifyMethod = JSON.parse(this.model.notifyMethod)
      }

      // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
      this.initUpload(this, 0)
    },
    loadData() {},
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      //时间格式化
      main.inputerTime = main.inputerTime ? main.inputerTime.format('YYYY-MM-DD') : null
      main.planStarttime = main.planStarttime ? main.planStarttime.format('YYYY-MM-DD') : null
      main.planEndtime = main.planEndtime ? main.planEndtime.format('YYYY-MM-DD') : null
      return {
        ...main, // 展开
        testMainZjhDetailList: allValues.tablesValue[0].values
      }
    },
    // 编辑
    handleEdit() {
      this.handleAction(null, null, this.url.edit)
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
    // 取代禁用的handlechange方法
    blank(info) {}
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/modal.less';
</style>