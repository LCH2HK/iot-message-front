<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="任务编号">
                  <j-input-lk
                    :placeholder="'请输入任务编号'"
                    @enterSearch="enterSearch($event,'code')"
                    @inputValueLk="inputValueLk($event,'code')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="统计指标">
                  <j-input-lk
                    :placeholder="'请输入统计指标'"
                    @enterSearch="enterSearch($event,'statisticsIndex')"
                    @inputValueLk="inputValueLk($event,'statisticsIndex')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="设备">
                    <j-input-lk
                      :placeholder="'请输入设备编号'"
                      @enterSearch="enterSearch($event,'deviceKeys')"
                      @inputValueLk="inputValueLk($event,'deviceKeys')"
                      :reset="clickReset"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
              </template>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="设备属性">
                    <j-input-lk
                      :placeholder="'请输入设备属性'"
                      @enterSearch="enterSearch($event,'deviceProperties')"
                      @inputValueLk="inputValueLk($event,'deviceProperties')"
                      :reset="clickReset"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
              </template>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="状态">
                    <a-select v-model="queryParam.status">
                      <a-select-option value="-1">待激活</a-select-option>
                      <a-select-option value="0">已暂停</a-select-option>
                      <a-select-option value="1">已启动</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
          </a-col>
          <a-col :md="6" :sm="24">
            <div class="search-buttons-content">
              <span class="table-page-search-submitButtons serachLeft">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              </span>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        </div>

        <!-- table区域-begin -->
        <div>
          <a-table
            ref="table"
            size="middle"
            rowKey="id"
            bordered
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="resumeJob(record)" v-if="record.status==0">启动</a>
          <a @click="pauseJob(record)" v-if="record.status==1">停止</a>
          <a @click="activate(record)" v-if="record.status==-1">激活</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record,'查看')">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="handleDelete(record.id)">删除</a>
          <a-divider type="vertical"/>
          <a @click="showData(record,'统计数据')">数据</a>
        </span>
            <!-- 状态渲染模板 -->
            <template slot="customRenderStatus" slot-scope="status">
              <a-tag v-if="status==-1" color="gray">待激活</a-tag>
              <a-tag v-if="status==1" color="green">已启动</a-tag>
              <a-tag v-if="status==0" color="orange">已暂停</a-tag>
            </template>

          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <statisticsTask-modal ref="modalForm" @ok="modalFormOk"></statisticsTask-modal>
    <statistics-data-drawer ref="modalForm2" :taskInfo="taskInfo"></statistics-data-drawer>
  </a-card>
</template>

<script>
import StatisticsTaskModal from './modules/StatisticsTaskModal'
import StatisticsDataDrawer from './modules/StatisticsDataDrawer'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { deleteAction, postAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import Vue from 'vue'

import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import JInputLk from '@/components/cmp/JInputLk.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'StatisticsTaskList',
  mixins: [myCmpListMixin],
  components: {
    StatisticsTaskModal,
    StatisticsDataDrawer,
    JLeftTree,
    JInputLk
  },
  data () {
    return {
      description: '统计任务管理页面',
      statIndexDictOptions: [],

      taskInfo: {},

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '任务编号',
          align: 'left',
          width: 160,
          dataIndex: 'code'
        },
        {
          title: '统计周期',
          align: 'left',
          width: 80,
          dataIndex: 'period'
        },
        {
          title: '设备编号',
          align: 'left',
          width: 200,
          dataIndex: 'deviceKeys'
        },
        {
          title: '设备属性',
          align: 'left',
          dataIndex: 'deviceProperties'
        },
        {
          title: '统计指标',
          align: 'left',
          dataIndex: 'statisticsIndex'
        },
        {
          title: '任务执行时机',
          align: 'left',
          width: 160,
          dataIndex: 'taskRunTime'
        },
        {
          title: '添加时间',
          align: 'left',
          width: 200,
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          align: 'left',
          dataIndex: 'status',
          width: 120,
          scopedSlots: { customRender: 'customRenderStatus' },
          filterMultiple: false,
          filters: [
            { text: '已启动', value: '1' },
            { text: '已暂停', value: '0' }
          ]
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 240,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/statisticstask/statisticsTask/list',
        delete: '/statisticstask/statisticsTask/delete',
        deleteBatch: '/statisticstask/statisticsTask/deleteBatch',
        resume: '/statisticstask/statisticsTask/resumeJob',
        pause: '/statisticstask/statisticsTask/pauseJob',
        activate: '/statisticstask/statisticsTask/activateJob',
        statCodeName: '/statisticstask/statisticsIndex/all'
      },
      collapsed: false,
      dataServiceUrl: '',
      prjCode: ''
    }
  },
  beforeCreate () {
    initDictOptions('statistics_index').then((res) => {
      if (res.success) {
        this.statIndexDictOptions = res.result
      }
    })
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    if (this.projectMsg) {
      // 项目级
      this.dataServiceUrl = this.projectMsg.dataServiceUrl
      this.prjCode = this.projectMsg.prjCode
      this.url.list = this.dataServiceUrl + this.url.list
      this.url.delete = this.dataServiceUrl + this.url.delete
      this.url.resume = this.dataServiceUrl + this.url.resume
      this.url.pause = this.dataServiceUrl + this.url.pause
      this.url.activate = this.dataServiceUrl + this.url.activate
      this.url.statCodeName = this.dataServiceUrl + this.url.statCodeName
    }
    this.loadData()
  },
  methods: {
    activate: function (record) {
      const that = this
      // 激活定时任务
      this.$confirm({
        title: '确认激活',
        content: '是否激活选中任务?',
        onOk: function () {
          postAction(that.url.activate, record).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    pauseJob: function (record) {
      const that = this
      // 暂停定时任务
      this.$confirm({
        title: '确认暂停',
        content: '是否暂停选中任务?',
        onOk: function () {
          postAction(that.url.pause, record).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    resumeJob: function (record) {
      const that = this
      // 恢复定时任务
      this.$confirm({
        title: '确认启动',
        content: '是否启动选中任务?',
        onOk: function () {
          postAction(that.url.resume, record).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    showData: function (record, title) {
      this.$refs.modalForm2.title = title
      this.taskInfo = record
      this.$refs.modalForm2.edit(record)
    },
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      const that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning('操作失败')
            }
          })
        }
      })
    },
    // 重置表格状态
    resertTable () {
      this.selectedRowKeys = []
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
  @import '~@views/iot/css/iotCommon.less';
/deep/.ant-card-body {
  padding: 16px 16px;
}
</style>
