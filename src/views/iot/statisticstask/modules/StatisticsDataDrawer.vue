<template>
  <a-drawer
    :title="title"
    :width="800"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible"
  >
    <a-layout-content>
      <div>
        <a-spin :spinning="confirmLoading">
          <a-form :form="form">
            <a-row :gutter="24">
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="统计设备">
                  <a-select
                    mode="multiple"
                    :triggerChange="true"
                    placeholder="请选择设备"
                    v-decorator="['deviceKeys',{}]"
                  >
                    <a-select-option v-for="key in taskInfo.deviceKeys.split(',')" :key="key">{{ key }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="设备属性">
                  <a-select
                    v-decorator="['aliasNames',{}]"
                    mode="multiple"
                    :triggerChange="true"
                    placeholder="请选择统计哪些设备属性"
                  >
                    <a-select-option v-for="alias in taskInfo.deviceProperties.split(',')" :key="alias">{{ alias }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="统计指标">
                  <a-select
                    v-decorator="['statisticsIndex',{}]"
                    :triggerChange="true"
                    placeholder="请选择统计指标"
                    mode="multiple"
                  >
                    <a-select-option v-for="index in taskInfo.statisticsIndex.split(',')" :key="index">{{ index }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="开始时间">
                  <a-date-picker
                    placeholder
                    :disabledDate="disabledStartDate"
                    format="YYYY-MM-DD  HH:mm:ss"
                    v-decorator="['startTime',{}]"
                    @openChange="handleStartOpenChange"
                    :showTime="{
                      hideDisabledOptions: true,
                      defaultValue: moment('00:00:00', 'HH:mm:ss')
                    }"
                  ></a-date-picker>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="结束时间">
                  <a-date-picker
                    placeholder
                    :disabledDate="disabledEndDate"
                    format="YYYY-MM-DD HH:mm:ss"
                    v-decorator="['endTime',{}]"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                    :showTime="{
                      hideDisabledOptions: true,
                      defaultValue: moment('00:00:00', 'HH:mm:ss')
                    }"
                  ></a-date-picker>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="24" :sm="8">
                <a-form-item class="btnClass">
                  <a-button @click="submit" type="primary" icon="check" class="confirm">查询</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </div>
      <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}">
        <a-table
          bordered
          ref="table"
          size="middle"
          rowKey="id"
          :columns="columns"
          :scroll="{ x: 1500 }"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :customHeaderRow="customHeaderRow"
          @change="handleTableChange">
        </a-table>
      </div>
    </a-layout-content>

    <a-button type="primary" @click="close">关闭</a-button>
  </a-drawer>
</template>

<script>
import { postAction, getAction, httpAction } from '@/api/manage'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment'
import qs from 'qs'

export default {
  name: 'StatisticsDataDrawer',
  mixins: [myCmpListMixin],
  props: {
    taskInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      title: '操作',
      visible: false,
      model: {},
      projectMsg: {},
      headers: {},

      tempEndValue: null,
      tempStartValue: null,
      endOpen: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 22 }
      },

      task: {},
      columns: [],
      params: {
        indices: '',
        pageNo: '',
        pageSize: '',
        taskKey: '',
        deviceKey: '',
        prjCode: '',
        startTime: '',
        endTime: '',
        aliasNames: ''
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        data: '/statisticstask/statisticsTask/statisticsResult'
      }
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    if (this.projectMsg) {
      // 项目级
      let dataServiceUrl = this.projectMsg.dataServiceUrl
      this.url.data = dataServiceUrl + this.url.data
    }
    this.params.pageNo = this.ipagination.current
    this.params.pageSize = this.ipagination.pageSize
    this.params.prjCode = this.projectMsg.prjCode
  },
  methods: {
    moment,
    loadData () {
      this.params.pageNo = this.ipagination.current
      this.params.pageSize = this.ipagination.pageSize
      let that = this
      that.columns = []
      postAction(that.url.data, that.params).then(res => {
        that.dataSource = res.result.records
        this.ipagination.total = res.result.total
        for (let p in that.dataSource[0]) {
          if (p == 'id' || p == 'deviceKey' || p == 'updateTime') {
            continue
          }
          let column = {
            title: p,
            dataIndex: p,
            align: 'center'
          }
          that.columns.push(column)
        }
        that.columns.sort((a, b) => {
          return a.title.localeCompare(b.title)
        })
        this.columns.unshift({
          title: '设备编号',
          dataIndex: 'deviceKey',
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          align: 'center'
        })
      })
    },
    edit (record) {
      this.form.resetFields()
      this.task = record

      this.params.taskKey = record.code
      this.params.deviceKey = record.deviceKeys

      this.loadData()

      // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.resetScreenSize()
      this.visible = true
    },
    handleTableChange (pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    submit () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          // 表单数据赋值给formData
          let formData = Object.assign(this.model, values)

          // 对formData中的时间字段进行 时间格式化
          this.params.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          this.params.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

          this.params.deviceKey = formData.deviceKeys ? formData.deviceKeys.join(',') : null
          this.params.aliasNames = formData.aliasNames ? formData.aliasNames.join(',') : null
          this.params.indices = formData.statisticsIndex ? formData.statisticsIndex.join(',') : null

          this.loadData()
          that.confirmLoading = false
        }
      })
    },

    close () {
      this.$emit('close')
      this.visible = false
    },
    customHeaderRow (record) {
      record.forEach(item => {
        item.align = 'center'
      })
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize () {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 1000
      }
    },
    // 日历控件绑定方法
    disabledStartDate (startValue) {
      const endValue = this.form.getFieldValue('endTime')
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.form.getFieldValue('startTime')
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    }
  }
}
</script>

<style lang="less" scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>
