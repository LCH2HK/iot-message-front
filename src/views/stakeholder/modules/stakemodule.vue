<template>
  <div class="stakemodule">
    <a-modal
      :footer="null"
      :title="null"
      :closable="false"
      :width="1000"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
      :destroyOnClose="true"
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
            <a-icon type="file-text" />表单详情
          </span>
          <a-spin :spinning="confirmLoading">
            <!-- 主表单区域 -->
            <a-form :form="form">
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="企业/个人编号">
                    <a-input placeholder v-decorator="['companyCode', {}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="企业/个人名称">
                    <a-input placeholder v-decorator="['companyName', {}]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="干系人类型">
                    <a-select
                      placeholder="选择"
                      v-decorator="['stakeholderType', {initialValue: ['0']}]"
                    >
                      <a-select-option value="0">干系人类型1</a-select-option>
                      <a-select-option value="1">干系人类型2</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="企业/单位性质">
                    <a-select
                      placeholder="选择"
                      v-decorator="['companyNature', {initialValue: ['0']}]"
                    >
                      <a-select-option value="0">性质1</a-select-option>
                      <a-select-option value="1">性质2</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                    <a-input placeholder v-decorator="['phoneNum', {}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="传真">
                    <a-input placeholder v-decorator="['fax', {}]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="邮编">
                    <a-input placeholder v-decorator="['postCode', {}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="网址">
                    <a-input placeholder v-decorator="['website', {}]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="地址">
                <a-textarea placeholder v-decorator="['address', {}]" :autosize="{minRows: 3, maxRows: 6}" />
              </a-form-item>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行">
                    <a-input placeholder v-decorator="['openingBank', {}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号">
                    <a-input placeholder v-decorator="['accountNumber', {}]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="备注/服务范围">
                <a-textarea placeholder v-decorator="['remarks', {}]" :autosize="{minRows: 3, maxRows: 6}" />
              </a-form-item>
              <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="上传附件">
                <!-- <a-input placeholder v-decorator="['attachment', {}]" /> -->
                <a-upload
                  :action="uploadAction"
                  listType="picture"
                  :headers="headers"
                  :fileList="fileList"
                  @change="handleChange"
                  :multiple="true"
                  :beforeUpload="beforeUpload"
                  class="upload-list-inline"
                  :data="uploadParams"
                >
                  <a-button>
                    <a-icon type="upload" />upload
                  </a-button>
                </a-upload>
              </a-form-item>
              <a-tabs v-model="activeKey" @change="handleChangeTabs">
                <a-tab-pane :key="refKeys[0]" :forceRender="true" class="stakeholder-list">
                  <span slot="tab">
                    <a-icon type="file-text" />干系人明细1
                  </span>
                  <j-editable-table
                    :ref="refKeys[0]"
                    :loading="stakeholderDetailTable.loading"
                    :columns="stakeholderDetailTable.columns"
                    :dataSource="stakeholderDetailTable.dataSource"
                    :maxHeight="240"
                    :rowNumber="true"
                    :rowSelection="true"
                    :actionButton="true"
                  />
                </a-tab-pane>
                <a-tab-pane :key="refKeys[1]" :forceRender="true" class="stakeholder-list">
                  <span slot="tab">
                    <a-icon type="file-text" />干系人明细2
                  </span>
                  <j-editable-table
                    :ref="refKeys[1]"
                    :loading="stakeholderDetailTable.loading"
                    :columns="stakeholderDetailTable.columns"
                    :dataSource="stakeholderDetailTable.dataSource"
                    :maxHeight="240"
                    :rowNumber="true"
                    :rowSelection="true"
                    :actionButton="true"
                  />
                </a-tab-pane>
              </a-tabs>

              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="录入人">
                    <a-input placeholder v-decorator="['inputerFullname', {}]" disabled />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                    <a-input placeholder v-decorator="['inputerPhoneNum', {}]" disabled />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="录入人部门">
                    <a-input placeholder v-decorator="['inputerDeptName', {}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="录入时间">
                    <!-- <a-input placeholder v-decorator="['inputerTime', {}]"/> -->
                    <a-date-picker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="录入时间"
                      v-decorator="['createTime', {}]"
                      disabled
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="新任务通知方式">
                <a-checkbox-group v-decorator="['notifyMethod', {initialValue: ['0']}]">
                  <a-checkbox value="0" disabled>邮件(默认必选)</a-checkbox>
                  <a-checkbox value="1">手机短信</a-checkbox>
                  <a-checkbox value="2">EUC消息</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="审批人">
                <j-select-user-new :selectedDetails="auditUsers" @callback="setAuditUser" />
              </a-form-item>
              <a-form-item
                :labelCol="labelCol1"
                :wrapperCol="wrapperCol1"
                label="审批意见"
                v-show="model.status !== undefined && model.status !== 0 && title !== '编辑' && nodeName != '填写表单'"
                :disabled="title == '编辑'"
              >
                <a-textarea :rows="4" v-decorator="[ '_taskComment', {}]" :disabled="!model.btns" />
              </a-form-item>

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
                    <a-menu slot="overlay" v-if="item.btnApi == '/task/jump'">
                      <a-menu-item v-for="(v,k) in model.rollBackAbleNodes" :key="k">
                        <div @click="goBack(v.nodeId)">{{ v.nodeName }}</div>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </template>
              </a-form-item>
              <!-- 同步按钮 -->
              <a-form-item class="btnClass" v-if="!model.btns">
                <a-button @click="handle('submit')" icon="check" type="primary" class="confirm">提交</a-button>
                <a-button
                  @click="handle('start')"
                  v-if="this.model !== undefined"
                  icon="save"
                  type="primary"
                  class="confirm"
                >暂存</a-button>
                <a-button @click="handleCancel" icon="close" type="primary" class="cancel">取消</a-button>
              </a-form-item>
              <!-- table区域-end -->
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
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import { FormTypes } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import { VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables, getValuesFormAndTables } from '@/utils/JEditableTableUtil'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import { httpAction, getAction, getActionUrl, httpActionHeader, downFile } from '@/api/manage'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import md5 from 'md5'
import { mapGetters } from 'vuex'
import qs from 'qs'
import STable from '@/components/table/'
import OptionList from '@/views/oa/modules/OptionList'

export default {
  name: 'stakemodule',
  mixins: [JEditableTableMixin],
  components: {
    JDictSelectTag,
    JSelectUserNew,
    OptionList,
    STable
  },
  data() {
    return {
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {},
      refKeys: ['stakeholderDetail', 'stakeholderDetail2'],
      activeKey: 'stakeholderDetail',

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
      stakeholderDetailTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '姓名',
            key: 'name',
            type: FormTypes.input,
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '性别',
            key: 'sex',
            type: FormTypes.select,
            options: [
              {
                value: '男',
                title: '男'
              },
              {
                value: '女',
                title: '女'
              },
              {
                value: '保密',
                title: '保密'
              }
            ],
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '职务',
            key: 'job',
            type: FormTypes.input,
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '手机号',
            key: 'phoneNum',
            type: FormTypes.inputNumber,
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '办公电话',
            key: 'telephoneNum',
            type: FormTypes.inputNumber,
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '电子邮箱',
            key: 'email',
            type: FormTypes.input,
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '地址',
            key: 'address',
            type: FormTypes.input,
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '传真',
            key: 'fax',
            type: FormTypes.input,
            defaultValue: ''
            /* placeholder: '${title}' */
          },
          {
            title: '是否重要',
            key: 'important',
            type: FormTypes.checkbox,
            defaultChecked: false
          },
          {
            title: '备注',
            key: 'remark',
            type: FormTypes.input,
            defaultValue: ''
            /* placeholder: '${title}' */
          }
        ]
      },
      url: {
        add: '/stakeholder/stakeholder/add',
        edit: '/flowable/action',
        fileFind: '/file/cmpFileGroup/findFilesByGroupId',
        fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById',
        stakeholderDetail: {
          list: '/stakeholder/stakeholder/queryById'
        },
        chart: '/flowable/process/diagram',
        taskComment: '/flowable/process/taskComment'
      },
      headers: {},
      fileList: [],
      attachment: [
        {
          groupId: '',
          fileTokens: '',
          fieldName: 'attachment',
          tableName: 'pm_stakeholder'
        }
      ],
      uploadParams: {},
      curtime: null,
      departDetails: [], //选人组件选中对象
      subcontractorName: '',
      subcontractorFullname: '',

      nodeName: '',

      // 选人组件
      selectUser: ['auditUsers'],
      auditUsers: {
        colum: 'auditUsers',
        value: [],
        target: [{ to: 'subcontractorName', from: 'username' }, { to: 'subcontractorFullname', from: 'realname' }]
      },

      //审批意见列表
      commentList: {},
      currentList: 0,
      //流程图
      urlChart: '',
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
          dataIndex: 'num',
          key: 'num'
        }
      ],
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
      arr: [],
      arr1: []
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
  computed: {
    uploadAction() {
      return this.url.fileUpload
    }
  },
  methods: {
    ...mapGetters(['nickname', 'userInfo']),

    /** 调用完edit()方法之后会自动调用此方法，此处的参数record其实就是this.model */
    editAfter(record) {
      console.log('stakemodule record主表数据', record)
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
      console.log(this.model, 'this.model')
      //异步操作，表单渲染完毕后设置表单对应的值
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            // 从this.model中挑选以下字段，返回一个新对象，然后设置form表单中的值
            this.model,
            'companyCode', //企业/个人编号
            'companyName', //企业/个人名称
            'stakeholderType', //干系人类型
            'companyNature', //企业/单位性质
            'phoneNum', //联系电话
            'fax', //传真
            'postCode', //邮编
            'address', //地址
            'website', //网址
            'openingBank', //开户行
            'accountNumber', //账号
            'remarks', //备注/服务范围
            'inputerFullname', //录入人
            'inputerPhoneNum', //联系电话
            'inputerDeptName', //录入人部门
            'createTime', //录入时间
            'notifyMethod', //新任务通知方式
            '_taskComment'
            /* 'subcontractorName' */
          )
        )

        this.departDetails = []
        //编辑或审核而非启动时
        if (JSON.stringify(record) !== '{}') {
          // 初始化选人组件字段
          this.auditUsers.value = []
          // 初始化选人控件
          this.initSelectMan(this, record)

          //将notifyMethod字符串或者undefined转换为数组
          this.model.notifyMethod = JSON.parse(this.model.notifyMethod)
          this.form.setFieldsValue({ notifyMethod: this.model.notifyMethod })
          // 时间格式化
          this.form.setFieldsValue({
            createTime: this.model.createTime ? moment(this.model.createTime) : null
          })
        }
        //启动时
        else {
          //获取当前用户真实姓名和其他用户信息，设置录入人姓名、联系电话
          this.form.setFieldsValue({ inputerFullname: this.nickname() })
          this.form.setFieldsValue({ inputerPhoneNum: this.userInfo().phone })
          // 时间格式化
          this.form.setFieldsValue({
            createTime: moment(new Date())
          })
        }
        console.log(this.model)
      })

      //请求流程图 + 审批意见
      // 第二个参数为流程图接口地址，第三哥参数为审批意见接口地址
      this.initChartAndComment(this, record, this.url.chart, this.url.taskComment)
      // 初始化上传文件
      // 编辑而非启动
      if (this.model.attachment !== undefined) {
        this.attachment[0].groupId = this.model.attachment
        this.attachment[0].fileTokens = ''
        console.log('开始根据返回的attachment数据查询上传的附件')
        getAction(this.url.fileFind, { groupId: this.model.attachment }).then(res => {
          console.log('附件查询结果', res)
          let len = res.result.length
          for (let i = 0; i < len; i++) {
            // 如果文件扩展名为jpeg/jpg/png，图片格式，则执行以下操作
            if (
              res.result[i].viewPath.substring(res.result[i].viewPath.length - 4) == 'jpeg' ||
              res.result[i].viewPath.substring(res.result[i].viewPath.length - 3) == 'jpg' ||
              res.result[i].viewPath.substring(res.result[i].viewPath.length - 3) == 'png'
            ) {
              let fileChild = {
                response: {
                  result: {
                    fileTokens: res.result[i].fileToken
                  }
                },
                uid: i,
                name: res.result[i].uploadFile.fileName,
                status: 'done',
                type: 'image/jpeg',
                url: this.url.imgerver + '/' + res.result[i].viewPath
              }
              this.fileList.push(fileChild)
              this.attachment[0].fileTokens += res.result[i].fileToken + ','
            } else {
              let fileChild = {
                response: {
                  result: {
                    fileTokens: res.result[i].fileToken
                  }
                },
                uid: i,
                name: res.result[i].uploadFile.fileName,
                status: 'done',
                type: 'text/plain',
                url: this.url.imgerver + '/' + res.result[i].viewPath
              }
              this.fileList.push(fileChild)
              this.attachment[0].fileTokens += res.result[i].fileToken + ','
            }
          }
        })
      } else {
        this.attachment[0].groupId = this.uuid()
        this.attachment[0].fileTokens = ''
      }

      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        console.log('准备查询子表信息')
        this.stakeholderDetailTable.dataSource = this.stakeholderDetailTable.dataSource
        this.requestSubTableData(this.url.stakeholderDetail.list, params, this.stakeholderDetailTable)
        console.log('处理完的子表信息', this.stakeholderDetailTable)
      }
    },
    // 转换选人组件姓名账号对应的格式
    initSelectMan(that, record) {
      if (JSON.stringify(record) !== '{}') {
        for (var i = 0; i < that.selectUser.length; i++) {
          var flag = 1
          var selectValue = []
          var selectColum = []
          console.log(that[that.selectUser[i]], '看看有没有')
          for (var j = 0; j < that[that.selectUser[i]].target.length; j++) {
            if (that.model[that[that.selectUser[i]].target[j].to] == '') {
              flag = 0
              break
            } else {
              selectValue.push(that.model[that[that.selectUser[i]].target[j].to])
              selectColum.push(that[that.selectUser[i]].target[j].from)
            }
          }
          if (flag) {
            that[that.selectUser[i]].value = that.initSelect(selectColum, selectValue)
          }
        }
      }
    },
    // 初始化选人组件
    initSelect(col, val) {
      if (val[0] != null) {
        var arr2 = []
        for (var i = 0; i < val[0].split(',').length; i++) {
          var item = {}
          for (var j = 0; j < col.length; j++) {
            this.$set(item, col[j], val[j].split(',')[i])
          }
          arr2.push(item)
        }
        return arr2
      }
    },

    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      //时间格式化
      return {
        ...main, // 展开
        stakeholderDetailList: allValues.tablesValue[0].values
      }
    },
    /* 按钮统一事件 */
    handle(item, id) {
      switch (item) {
        case 'submit':
          item = '/process/startAndSubmit'
          break
        case 'start':
          item = '/process/start'
          break
        case '/task/jump':
          item = null
          break
        case 'jump':
          item = '/task/jump'
          break
      }
      console.log(item)
      this.handleAction(item, id)
    },
    goBack(id) {
      this.handle('jump', id)
    },
    // 新增提交
    request(formData) {
      let url = this.url.edit
      let method = 'post' //put修改

      this.confirmLoading = true
      httpAction(url, formData, method)
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleAction(item, id) {
      /** 触发表单验证 */
      this.getAllTable()
        .then(tables => {
          /** 一次性验证主表和所有的次表 */
          if (item === '/process/start') {
            return getValuesFormAndTables(this.form, tables)
          } else {
            return validateFormAndTables(this.form, tables)
          }
        })
        .then(allValues => {
          if (typeof this.classifyIntoFormData !== 'function') {
            throw this.throwNotFunction('classifyIntoFormData')
          }
          let formData = this.classifyIntoFormData(allValues)
          formData.stakeholderType = formData.stakeholderType ? '干系人类型1' : '干系人类型2'
          formData.companyNature = formData.companyNature ? '性质1' : '性质2'

          this.uploadMan(formData, this)

          for (let i = 0; i < this.attachment.length; i++) {
            formData.attachment = this.attachment[i].groupId
          }

          // important值true或false转换为1或0
          let len = formData.stakeholderDetailList.length
          for (let i = 0; i < len; i++) {
            formData.stakeholderDetailList[i].important = formData.stakeholderDetailList[i].important ? 1 : 0
          }

          // 发起请求
          let data = {}
          let strFlowData = Object.assign(
            {},
            {
              api: item,
              processDefinitionKey: 'stakeholder',
              targetNodeId: id ? id : null,
              taskId: formData.taskId
            }
          )
          console.log(strFlowData, 'formData')
          let strFormData = Object.assign({}, formData)
          let strAttachment = this.attachment
          // 手机号码和电话号码转换为数字
          strFormData.inputerPhoneNum = Number(strFormData.inputerPhoneNum) //录入人电话
          strFormData.phoneNum = Number(strFormData.phoneNum) //电话号码
          // 提醒方式数组改为字符串
          /* formDataString.notifyMethod = this.transformNotice(formDataString.notifyMethod) */

          strFormData.stakeholderDetailList.forEach(function(item, index) {
            item.phoneNum = Number(item.phoneNum)
            item.telephoneNum = Number(item.telephoneNum)
            item.id = null
          })
          data.strFlowData = JSON.stringify(strFlowData)
          data.strFormData = JSON.stringify(strFormData)
          data.strAttachment = JSON.stringify(strAttachment)
          console.log(data, 'handleActionData')
          data = qs.stringify(data)
          return this.request(data)
        })
        .catch(e => {
          if (e.error === VALIDATE_NO_PASSED) {
            // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
            this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
          } else {
            console.error(e)
          }
        })
    },
    handleCancel() {
      this.close()
      this.fileList = []
    },
    close() {
      this.$emit('close')
      this.picUrl = ''
      this.fileList = []
      this.visible = false
      this.stakeholderDetailTable.dataSource = []
    },
    // 上传文件改变时的状态，根据返回值中file的status，作出相应提示
    handleChange(info) {
      console.log(info, 'info', info.file.status)
      this.uploadParams = {}
      if (info.file.status === 'removed') {
        console.log(info, '移除返回')
        console.log(this.attachment[0].fileTokens, '母亲')
        console.log(info.file.response.result.fileTokens, 'jialuo')
        this.attachment[0].fileTokens = this.attachment[0].fileTokens.replace(
          info.file.response.result.fileTokens + ',',
          ''
        )
        console.log(this.attachment, '删除后的superstar')
      }
      this.fileList = info.fileList
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        if (response.success) {
          this.picUrl += response.message + ','
          console.log(response.result, '返回值')
          this.attachment[0].fileTokens += response.result.fileTokens + ','
          console.log(this.attachment[0].fileTokens, '看看之后')
          // this.attachment.push({
          //   name: response.result.uploadFile.fileName,
          //   url: response.result.viewPath,
          //   id: response.result.fileTokens
          // })
        } else {
          this.$message.warning(response.message)
        }
      }
    },

    handlePreview(file) {
      let fileArray = file.name.split('.')
      let fileName = fileArray[0]
      let fileType = fileArray[1]
      if (file.type == 'image/jpeg') {
        if (file.url || file.thumbUrl) {
          this.previewImage = file.url || file.thumbUrl
        } else {
          this.previewImage = this.getIdCardView()
        }
        this.previewVisible = true
      } else {
        downFile(this.url.fileDownLoad, { id: file.response.result.fileTokens }).then(data => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName + '.' + fileType)
          } else {
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.' + fileType)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
        })
      }
    },
    handlePicCancel() {
      this.previewVisible = false
    },
    // 上传文件前的钩子函数
    beforeUpload(file, fileList) {
      this.uploadParams = {
        json: '{"md5":"' + md5(JSON.stringify(file)) + '","fileName":"' + file.name + '"}'
      }
    },
    getIdCardView() {
      let pics = this.model.idcardPic.split(',')
      let pics_len = pics.length
      // 显示上传的最后一个图片
      return this.url.imgerver + '/' + pics[pics_len - 2]
    },
    userDetails(val) {
      this.subcontractorName = val.username
      this.subcontractorFullname = val.realname
    },
    uuid() {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      // s[8] = s[13] = s[18] = s[23] = "-";
      s[8] = s[13] = s[18] = s[23] = ''
      var uuid = s.join('')
      return uuid
    },
    /** 查询某个tab的数据 */
    requestSubTableData(url, params, tab) {
      tab.loading = true
      console.log('开始查询子表信息')
      getAction(url, params)
        .then(res => {
          console.log('获取到的子表信息', res.result.stakeholderDetailList)
          let listArr = res.result.stakeholderDetailList
          let len = listArr.length
          for (let i = 0; i < len; i++) {
            listArr[i].important = listArr[i].important ? true : false
          }
          tab.dataSource = listArr || []
          console.log("dataSource = "+tab.dataSource);
        })
        .finally(() => {
          tab.loading = false
        })
    },
    transformNotice(arr) {
      let len = arr.length
      if (len == 1) {
        return '100'
      } else if (len == 3) {
        return '111'
      } else if (len == 2) {
        if (arr[1] == '1') {
          return '110'
        } else {
          return '101'
        }
      }
    },
    transformNoticeBack(str) {
      switch (str) {
        case '100':
        case undefined:
          return ['0']
          break
        case '101':
          return ['0', '2']
          break
        case '110':
          return ['0', '1']
          break
        case '111':
          return ['0', '1', '2']
          break
      }
    },
    transformStakeHL(arr) {
      function trans(item, index) {
        console.log(item, index)
        item.phoneNum = Number(item.phoneNum)
        item.telephoneNum = Number(item.telephoneNum)
      }
      return arr.forEach(trans)
    },
    initChartAndComment(that, record, chartUrl, taskCommentUrl) {
      console.log(record, '初始化流程图和审批意见列表record')
      if (JSON.stringify(record) !== '{}') {
        let params = {
          id: that.model.id
        }
        console.log(params, 'params')
        let httpGetUrlC = chartUrl
        let httpGetUrlTc = taskCommentUrl
        // 获取流程图
        getActionUrl(httpGetUrlC, params)
          .then(res => {
            console.log('编辑流程图res', res)
            that.urlChart =
              'data:image/png;base64,' +
              btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          })
          .finally(() => {
            // that.confirmLoading = false;
            // that.close();
          })
        // 获取意见列表
        getAction(httpGetUrlTc, { id: that.model.id })
          .then(res => {
            console.log(res, '意见列表res')
            that.commentList = res.result.taskListEnd.concat(res.result.taskListIng)
            that.currentList = res.result.taskListEnd.length - 1

            that.finishedList = Object.assign(res.result.taskListEnd)
            that.unfinishedList = Object.assign(res.result.taskListIng)

            // 渲染流程图tab中的数据列表
            that.arr.length = 0
            that.arr1.length = 0

            for (let i in that.finishedList) {
              that.arr.push(that.finishedList[i])
            }
            for (let i in that.unfinishedList) {
              that.arr1.push(that.unfinishedList[i])
            }
            console.log(that.arr)
            console.log(that.arr1)
          })
          .finally(() => {})
      } else {
        console.log(record, '初始化流程图和审批意见列表record')
        let params = {
          processDefinitionKey: 'stakeholder'
        }
        that.arr.length = 0
        that.arr1.length = 0
        console.log(that.arr, 'arr')
        console.log(that.arr1, 'arr1')
        let httpGetUrlC = that.url.chart
        getActionUrl(httpGetUrlC, params)
          .then(res => {
            console.log('流程图res', res)
            this.urlChart =
              'data:image/png;base64,' +
              btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          })
          .finally(() => {
            // that.confirmLoading = false;
            // that.close();
          })
      }
    },
    // 加载数据方法 必须为 Promise 对象
    loadGoodsData() {
      var that = this
      return new Promise(resolve => {
        resolve({
          data: that.arr
        })
      }).then(res => {
        console.log('resloadData', res)
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
        console.log('resloadData', res)
        return res
      })
    },
    // 选人组件回传值
    setAuditUser(val) {
      //val:{ colum:'' , target   ,value }
      for (var i = 0; i < this[val.colum].target.length; i++) {
        this[this[val.colum].target[i].to] = val.value[this[val.colum].target[i].from]
      }
    },
    uploadMan(strFormData, that) {
      console.log(strFormData, 'strFormData')
      for (var i = 0; i < that.selectUser.length; i++) {
        var flag = 1
        for (var j = 0; j < that[that.selectUser[i]].target.length; j++) {
          if (that[that[that.selectUser[i]].target[j].to] == '') {
            console.log(that[that.selectUser[i]].target[j].to)
            flag = 0
            break
          } else {
            strFormData[[that[that.selectUser[i]].target[j].to]] = that[that[that.selectUser[i]].target[j].to]
          }
        }
      }
      console.log(strFormData, 'strFormDataAfter')
      return strFormData
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/modal.less';

.ant-tabs {
  margin-bottom: 20px;
  :global(.ant-tabs-content.ant-tabs-content-animated.ant-tabs-top-content) {
    .stakeholder-list {
      :global(.ant-select-selection) {
        border: none;
      }
    }
  }
}

.table-operator {
  button {
    margin-right: 5px;
  }
}
.ant-col-12 {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.ant-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
  :global(.ant-form-item-control-wrapper) {
    :glabal(td) {
      vertical-align: middle;
    }
  }
}

.btnClass {
  text-align: center;
}
</style>