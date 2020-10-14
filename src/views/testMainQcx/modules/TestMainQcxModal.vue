<template>
  <a-modal
    :footer="null"
    :title="null"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :closable="false"
    cancelText="关闭"
    v-dialogDrag
    :maskClosable="false"
    style="top:5%;">
    <!-- 表单标题 -->
    <div class="title">
      <div>
        <img :src="title | IconUrl"/>
        {{title}}
        <span>{{ nodeName ? '(' + nodeName + ')': ''}}</span>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel"/>
    </div>

    <!-- 表单内容tabs -->
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="file-text"/>表单详情
          </span>
        <a-spin :spinning="confirmLoading">

          <!-- 主表单区域 -->
          <a-form :form="form">

            <!-- 常用选择/输入控件 -->
            <a-row :gutter="24">

              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目名称">
                  <a-input placeholder="请输入项目名称" v-decorator="['prjName', validatorRules.prjName]"
                           :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '') "/>
                  <!--此处加 :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '') " 判定的原因是
                      为了区分查看/审批 和 编辑/发起操作，如果是查看/审批操作，则为不可编辑状态-->
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="表单编号">
                  <a-input :disabled="disabled" placeholder="流程结束后自动生成" v-decorator="['formNum', {}]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="依托工程">
                  <a-input
                    :readOnly="isReadOnly"
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    @click="BasePrjModel"
                    placeholder="请选择依托工程"
                    v-decorator="['relyPrjName', validatorRules.relyPrjId]"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12" style="display: none">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="依托工程">
                  <a-input
                    placeholder="请选择依托工程ID"
                    v-decorator="['relyPrjId',{}]"></a-input>
                </a-form-item>
              </a-col>
              <!--项目负责人 userId-->
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目负责人">
                  <j-select-user-new
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    v-decorator="['prjManagerName', validatorRules.prjManagerName]"
                    placeholder="请选择项目负责人"
                    :selectedDetails="auditUsers4"
                    @callback="setAuditUser"
                    class="userSelect"
                  >
                  </j-select-user-new>
                </a-form-item>
              </a-col>
              <!--申请单位 Id-->
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请单位">
                  <!--<a-input placeholder="请选择申请单位" v-decorator="['applyGroupId', validatorRules.applyGroupId]"/>-->
                  <j-select-depart placeholder="请选择申请单位" v-decorator="['applyGroupId', validatorRules.applyGroupId]"
                                   :trigger-change="true"
                                   :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"></j-select-depart>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="参与单位">
                  <!--<a-input placeholder="请选择参与单位" v-decorator="['memberGroupId', validatorRules.memberGroupId]"/>-->
                  <j-select-depart placeholder="请选择参与单位" v-decorator="['memberGroupId', validatorRules.memberGroupId]"
                                   :trigger-change="true"
                                   :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"></j-select-depart>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目领域">
                  <j-dict-select-tag
                    v-decorator="['prjType', validatorRules.prjType]"
                    :triggerChange="true"
                    placeholder="请选择项目领域"
                    dictCode="prj_type_qcx"
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"></j-dict-select-tag>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目级别">
                  <j-dict-select-tag
                    v-decorator="['prjRank', validatorRules.prjRank]"
                    :triggerChange="true"
                    placeholder="请选择项目级别"
                    dictCode="prj_level_qcx"
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"></j-dict-select-tag>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="计划开始时间">
                  <a-date-picker v-decorator="[ 'startTime', validatorRules.startTime]"
                                 :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                                 :disabledDate="disabledStartDate"></a-date-picker>
                </a-form-item>
              </a-col>

              <!-- 非附件上传 -->
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="计划结束时间">
                  <a-date-picker v-decorator="[ 'endTime', validatorRules.endTime]"
                                 :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                                 :disabledDate="disabledEndDate"></a-date-picker>
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否有外委">
                  <a-radio-group @change="onChange" buttonStyle="solid"
                                 v-decorator="['outAppoint', {initialValue:'1'}]"
                                 :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="外委费用（元）"
                             v-if="this.disabledOut==false">
                  <a-input-number
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    :onchange="allMoney()"
                    :precision="precision"
                    style="width: 100%;text-align: right"
                    size="large"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    :step="0.01"
                    v-decorator="['outAppointCost', {initialValue: '0.00'}]"/>
                </a-form-item>
                <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="this.disabledOut==true">-->
                <!--</a-form-item>-->
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="外部来款（元）">
                  <a-input-number
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    :onchange="allMoney()"
                    :precision="precision"
                    style="width: 100%;text-align: right"
                    size="large"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    :step="0.01"
                    v-decorator="['outsideCost', {initialValue: '0.00'}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="总经费（元）">
                  <a-input-number
                    :precision="precision"
                    :disabled="disabled"
                    style="width: 100%;text-align: right"
                    size="large"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    :step="0.01"
                    v-decorator="['totalCost', {initialValue: '0.00'}]"/>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="目的意义">
              <a-textarea placeholder v-decorator="['purpose', validatorRules.purpose]"
                          :autosize="{minRows: 3, maxRows: 6}"
                          :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"></a-textarea>
            </a-form-item>
            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="主要研究内容">
              <a-textarea placeholder v-decorator="['content', validatorRules.content]"
                          :autosize="{minRows: 3, maxRows: 6}"
                          :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"></a-textarea>
            </a-form-item>

            <!-- 子表单区域 -->
            <a-tabs v-model="activeKey" @change="handleChangeTabs">
              <a-tab-pane tab="计划进度及成果目标" :key="refKeys[0]" :forceRender="true">
                <j-editable-table
                  :ref="refKeys[0]"
                  :loading="testMainQcxDetailTable.loading"
                  :columns="testMainQcxDetailTable.columns"
                  :dataSource="testMainQcxDetailTable.dataSource"
                  :maxHeight="300"
                  :rowNumber="true"
                  :rowSelection="true"
                  :actionButton="title == '查看' ? false : true"
                  :readOnly="title==='查看' || (nodeId !== undefined && nodeId !== '')"></j-editable-table>
              </a-tab-pane>
            </a-tabs>

            <a-row>
              <!-- 附件上传 -->
              <a-col :md="24" :sm="8" style="margin-top: 15px">
                <a-form-item
                  :labelCol="labelCol1"
                  :wrapperCol="wrapperCol1"
                  class="upload"
                  label="附件">
                  <a-upload
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    :action="uploadAction"
                    listType="picture"
                    :headers="headers"
                    :fileList="fileList"
                    @change="handleChange"
                    @preview="handlePreview"
                    :multiple="true"
                    class="upload-list-inline"
                    v-decorator="['attachment',{}]">
                    <a-button>
                      <a-icon type="upload"/>
                      上传
                    </a-button>
                  </a-upload>
                  <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicCancel">
                    <img alt="example" style="width: 100%" :src="previewImage"/>
                  </a-modal>
                  <br/>
                </a-form-item>
              </a-col>

            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写人">
                  <a-input placeholder
                           v-decorator="['inputerFullname', { initialValue:this.$store.getters.nickname}]"
                           disabled/>
                </a-form-item>
              </a-col>
              <a-col :span="12" style="display: none">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写人用户名">
                  <a-input placeholder v-decorator="['inputerName', {initialValue:this.$store.getters.userId}]"
                           disabled/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写日期">
                  <a-input
                    disabled
                    v-decorator="['inputDate',{initialValue: moment().format('YYYY-MM-DD')}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写人所属部门">
                  <a-input placeholder
                           v-decorator="['inputerDepartName', { initialValue:this.$store.getters.userInfo.departName}]"
                           disabled/>
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="新任务通知方式">
              <a-checkbox-group v-decorator="['notifyMethod', {initialValue: ['0']}]"
                                :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')">
                <a-checkbox value="0" disabled>邮件(默认必选)</a-checkbox>
                <a-checkbox value="1">手机短信</a-checkbox>
                <a-checkbox value="2">EUC消息</a-checkbox>
              </a-checkbox-group>
            </a-form-item>

            <!--审批人-->
            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="承办单位领导审批">
                  <j-select-user-new
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    multiple
                    v-decorator="['approverOneName', validatorRules.approverOneName]"
                    :selectedDetails="auditUsers1"
                    @callback="setAuditUser"
                    class="userSelect"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="专家评审">
                  <j-select-user-new
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    multiple
                    v-decorator="['approverTwoName', validatorRules.approverTwoName]"
                    :selectedDetails="auditUsers2"
                    @callback="setAuditUser"
                    class="userSelect"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="科技部门领导审批">
                  <j-select-user-new
                    :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
                    v-decorator="['approverThreeName', validatorRules.approverThreeName]"
                    :selectedDetails="auditUsers3"
                    @callback="setAuditUser"
                    class="userSelect"/>
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
                >{{item.btnName}}
                </a-button>
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
            >提交
            </a-button>
            <a-button
              @click="handle('start')"
              icon="save"
              type="primary"
              class="confirm"
              v-if="model.status == undefined"
            >暂存
            </a-button>
            <a-button
              @click="handleCancel"
              icon="close"
              type="primary"
              class="cancel"
              v-if="title != '查看'"
            >关闭
            </a-button>
            <a-button
              @click="handleEdit"
              icon="check"
              type="primary"
              style="margin-right:10px"
              class="confirm"
              v-if="model.status != undefined && title != '查看'"
            >保存
            </a-button>
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
        </a-spin>
      </a-tab-pane>

      <a-tab-pane key="2">
          <span slot="tab">
            <!-- <a-icon type="area-chart" />流程图 -->
            <img src="@/assets/img/login/process.png" alt/>
            流程图
          </span>
        <div>
          <div class="proc_bg">
            <h3>
              <span>流程图</span>
            </h3>
            <img :src="urlChart"/>
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
    <!--调用依托工程组件-->
    <base-prj-model
      :visible="basePrjVisible"
      @cancel="basePrjHandlCancel"
      @select="basePrjSelect"></base-prj-model>
  </a-modal>
</template>

<script>

  import { FormTypes } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
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
  import ARow from 'ant-design-vue/es/grid/Row'
  import BasePrjModel from './BasePrjModal'
  import JSelectDepart from '../../../components/cmpbiz/JSelectDepart'
  import { validateTables, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'

  export default {
    name: 'TestMainQcxModal',
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins: [JEditableTableMixin],
    //引入组件定义
    components: {
      JSelectDepart,
      ARow,
      STable,
      OptionList,
      JDictSelectTag,
      JSelectUserNew,
      BasePrjModel
    },
    data() {
      return {
        nodeId: '', // 当前流程审批人标识
        isReadOnly: true, // 控制只读权限
        disabledValue: false,
        model: {},
        basePrjVisible: false, // 依托工程控件的显隐
        val1: 0, // 外委费用
        val2: 0, // 外部来款
        precision: 2, // 双精度
        disabledOut: false, //外委费用显隐控制
        nodeName: '',
        processDefinitionKey: 'test_main_qcx',
        disabled: true, // 禁用控制
        attachment: [],
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 2,
        refKeys: ['testMainQcxDetail'],
        activeKey: 'testMainQcxDetail',
        // 科研项目立项建议_邱承鑫_明细表
        testMainQcxDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '日期',
              key: 'date',
              type: FormTypes.date,
              defaultValue: '2019-08-01',
              placeholder: '请输入${title}'
            },
            {
              title: '计划任务',
              key: 'plan',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}'
            },
            {
              title: '成果目标',
              key: 'goal',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}'
            }
          ]
        },
        url: {
          // add: "/test/testMainQcx/add",
          add: '/flowable/action',
          edit: '/test/testMainQcx/edit',
          action: '/flowable/action',
          testMainQcxDetail: {
            list: '/test/testMainQcx/queryTestMainQcxDetailByMainId'
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
            tableName: 'test_main_qcx'
          }
        ],

        //选人组件
        approverOneName: '',
        approverOneFullname: '',
        approverTwoName: '',
        approverTwoFullname: '',
        approverThreeName: '',
        approverThreeFullname: '',
        prjManagerName: '',
        prjManagerFullname: '',
        selectUser: ['auditUsers1', 'auditUsers2', 'auditUsers3', 'auditUsers4'],
        auditUsers1: {
          colum: 'auditUsers1',
          value: [],
          target: [
            { to: 'approverOneName', from: 'username' },
            { to: 'approverOneFullname', from: 'realname' }
          ]
        },
        auditUsers2: {
          colum: 'auditUsers2',
          value: [],
          target: [
            { to: 'approverTwoName', from: 'username' },
            { to: 'approverTwoFullname', from: 'realname' }
          ]
        },
        auditUsers3: {
          colum: 'auditUsers3',
          value: [],
          target: [
            { to: 'approverThreeName', from: 'username' },
            { to: 'approverThreeFullname', from: 'realname' }
          ]
        },
        auditUsers4: {
          colum: 'auditUsers4',
          value: [],
          target: [
            { to: 'prjManagerName', from: 'username' },
            { to: 'prjManagerFullname', from: 'realname' }
          ]
        },
        // 非空校验
        validatorRules: {
          prjName: { rules: [{ required: true, message: '项目名称不能为空！' }] },
          relyPrjId: { rules: [{ required: true, message: '依托工程不能为空！' }] },
          prjManagerName: { rules: [{ required: true, message: '项目负责人不能为空！' }] },
          applyGroupId: { rules: [{ required: true, message: '申请单位不能为空！' }] },
          memberGroupId: { rules: [{ required: true, message: '参与单位不能为空！' }] },
          prjType: { rules: [{ required: true, message: '项目领域不能为空！' }] },
          prjRank: { rules: [{ required: true, message: '项目级别不能为空！' }] },
          startTime: { rules: [{ required: true, message: '计划开始时间不能为空！' }] },
          endTime: { rules: [{ required: true, message: '计划结束时间不能为空！' }] },
          purpose: { rules: [{ required: true, message: '目的意义不能为空！' }, { max: 50, message: '最多输入五十字' }] },
          content: {
            rules: [{ required: true, message: '主要研究内容不能为空！' }, { min: 50, message: '最少输入五十字' },
              { max: 2000, message: '最多输入两千字' }]
          },
          approverOneName: { rules: [{ required: true, message: '承办单位领导不能为空！' }] },
          approverTwoName: { rules: [{ required: true, message: '评审专家不能为空！' }] },
          approverThreeName: { rules: [{ required: true, message: '科技部门领导不能为空！' }] }
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
      console.log(this.$store.getters.userInfo, '当前登录用户的信息')
    },

    mounted() {
      let params = { entityName: 'TestMainQcx' },
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
      }
    },
    methods: {
      BasePrjModel() {
        this.basePrjVisible = true
      },
      basePrjHandlCancel() {
        this.basePrjVisible = false // 组件点击关闭按钮，触发本回调方法，将组件的显隐状态置为false，隐藏本组件
      },
      basePrjSelect(record) { // 组件点击选择按钮，触发本回调方法，完成以下字段的回填
        this.basePrjVisible = false // 隐藏本组件
        const that = this
        console.log(record, '选择的依托工程的全部信息')
        that.$nextTick(() => { //异步
          that.model = { prjManagerName: record.prjManagerName, prjManagerFullname: record.prjManagerFullname }
          that.form.setFieldsValue({ relyPrjId: record.id }) // 依托工程ID回填
          that.form.setFieldsValue({ relyPrjName: record.prjName }) // 依托工程名称回填
          that.form.setFieldsValue({ applyGroupId: record.applyGroupId }) // 依托工程名称回填
          that.initSelectMan(that, this.model) // 选人组件的回填
        })
      },
      moment,
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter(record) {
        console.log(record.nodeId,'调完了edit调用editAfter')
        if (record.nodeId !== undefined){
          this.nodeId = record.nodeId
        }
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
          this.form.setFieldsValue(pick(this.model,
            'prjNum',
            'prjName',
            'formNum',
            'relyPrjId',
            'managementGroupName',
            'prjManagerName',
            'prjManagerFullname',
            'applyGroupId',
            'applyGroupName',
            'memberGroupId',
            'memberGroupName',
            'prjType',
            'prjRank',
            'startTime',
            'endTime',
            'outAppoint',
            'outAppointCost',
            'outsideCost',
            'totalCost',
            'purpose',
            'content',
            'attachment',
            'approverOneName',
            'approverOneFullname',
            'approverTwoName',
            'approverTwoFullname',
            'approverThreeName',
            'approverThreeFullname',
            'inputerName',
            'inputerFullname',
            'inputDate',
            'notifyMethod',
            'remarks',
            'status',
            'relyPrjName',
            'inputerDepartName'))
          // 是否外委回填
          if ( this.form.getFieldValue('outAppoint') == '0'){
            this.disabledOut = true
          } else {
            this.disabledOut = false
          }

          // 时间格式化
          this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
          this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
          // this.form.setFieldsValue({ inputDate: this.model.inputDate ? moment(this.model.inputDate) : null })
          this.initSelectMan(this, record)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.testMainQcxDetail.list, params, this.testMainQcxDetailTable)
        }
        //请求流程图 + 审批意见
        // 第二个参数为流程图接口地址，第三哥参数为审批意见接口地址
        this.initChartAndComment(this, record, this.url.chart, this.url.taskComment)

        // 初始化选人组件字段
        this.auditUsers1.value = []
        this.auditUsers2.value = []
        this.auditUsers3.value = []
        this.auditUsers4.value = []
        // 初始化选人控件
        this.initSelectMan(this, record)

        // 初始化任务通知方式
        if (this.model.notifyMethod != undefined) {
          this.model.notifyMethod = JSON.parse(this.model.notifyMethod)
        }

        // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
        this.initUpload(this, 0)
      },

      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        //时间格式化
        main.startTime = main.startTime ? main.startTime.format() : null
        main.endTime = main.endTime ? main.endTime.format() : null
        // main.inputDate = main.inputDate ? main.inputDate.format() : null;
        return {
          ...main, // 展开
          testMainQcxDetailList: allValues.tablesValue[0].values
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
      onChange() {
        // debugger
        const that = this
        let val = that.form.getFieldValue('outAppoint')
        if (val === '1') {
          that.disabledOut = true
          that.form.setFieldsValue(
            { outAppointCost: 0.00 }
          )
        } else if (val === '0') {
          that.disabledOut = false
        }


      },
      //监听外委费用和外部来款,定义变量val1 和 val2
      allMoney() {
        const that = this
        if (that.visible === true) {
          // 外委费用
          if (that.form.getFieldValue('outAppointCost') === 0 || that.form.getFieldValue('outAppointCost') === undefined || isNaN(that.form.getFieldValue('outAppointCost'))) {
            that.val1 = 0.00
          } else {
            that.val1 = parseFloat(that.form.getFieldValue('outAppointCost'))
          }

          // 外部来款
          if (isNaN(that.form.getFieldValue('outsideCost'))) {
            that.val2 = 0.00
          } else {
            that.val2 = parseFloat(that.form.getFieldValue('outsideCost'))
          }
          // console.log('外委费用 =>',that.val1,'外部来款 =>',that.val2)
        }
      },
      // 时间选择器的禁用封装
      disabledStartDate(startValue) {
        const endValue = this.form.getFieldValue('endTime')
        if (!startValue || !endValue) {
          return false
        }
        return startValue.valueOf() > endValue.valueOf()
      },
      disabledEndDate(endValue) {
        const startValue = this.form.getFieldValue('startTime')
        if (!endValue || !startValue) {
          return false
        }
        return startValue.valueOf() >= endValue.valueOf()
      }
    },
    watch: {
      // 监听外委费用和外部来款val1 和 val2,计算总费用并回显
      val1: function() {
        const that = this
        that.$nextTick(() => {
          setTimeout(() => {
            that.form.setFieldsValue(
              { totalCost: (that.val1 + that.val2).toFixed(2) }
            )
          }, 0)
        })
      },
      val2: function() {
        const that = this
        that.$nextTick(() => {
          setTimeout(() => {
            that.form.setFieldsValue(
              { totalCost: (that.val1 + that.val2).toFixed(2) }
            )
          }, 0)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/less/modal.less';
</style>
