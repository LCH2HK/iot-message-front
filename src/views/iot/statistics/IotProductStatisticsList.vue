<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->

    <a-layout>
      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button
            @click="batchEdit"
            type="primary"
            icon="edit"
            :disabled="this.selectedRowKeys.length == 0"
          >编辑</a-button>
          <a-button
            @click="batchDel1"
            type="primary"
            icon="delete"
            :disabled="this.selectedRowKeys.length == 0"
          >删除</a-button>
        </div>

        <!-- table区域-begin -->
        <div>
          <a-table
            bordered
            ref="table"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="resumeTask(record)" v-if="record.status==0">启用</a>
              <a @click="pauseTask(record)" v-if="record.status==1">停用</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record,'查看')">查看</a>
            </span>
            <template slot slot-scope="status">
              <a-tag v-if="status==1" color="green">已启用</a-tag>
              <a-tag v-if="status==0" color="orange">未启用</a-tag>
            </template>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <iotProductStatistics-modal ref="modalForm" @ok="modalFormOk"></iotProductStatistics-modal>
  </a-card>
</template>

<script>
import IotProductStatisticsModal from './modules/IotProductStatisticsModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { deleteAction, getAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import { queryProjectByPrjCode } from '@/api/api'
import Vue from 'vue'

export default {
  name: 'IotProductStatisticsList',
  mixins: [CmpListMixin],
  components: {
    IotProductStatisticsModal,
    JLeftTree
  },
  data () {
    return {
      description: '产品数据统计管理页面',
      projectMsg: {},
      dataServiceUrl: '',
      prjCode: '',

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
          title: '产品id',
          align: 'center',
          dataIndex: 'productId'
        },
        {
          title: '设备分组id',
          align: 'center',
          dataIndex: 'groupId'
        },
        {
          title: '历史数据源',
          align: 'center',
          dataIndex: 'historyDb'
        },
        {
          title: '历史数据表',
          align: 'center',
          dataIndex: 'historyTable'
        },
        {
          title: '统计数据源',
          align: 'center',
          dataIndex: 'statisticsDb'
        },
        {
          title: '统计数据表',
          align: 'center',
          dataIndex: 'statisticsTable'
        },
        {
          title: '保存月份',
          align: 'center',
          dataIndex: 'keptMonth'
        },
        {
          title: '统计频率',
          align: 'center',
          dataIndex: 'frequency'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'customRenderStatus' },
          filterMultiple: false,
          filters: [
            { text: '已启用', value: '1' },
            { text: '未启用', value: '0' }
          ],
          onFilter: (value, record) => {
            if (record.status == value) {
              return record
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/statistics/iotProductStatistics/list',
        delete: '/statistics/iotProductStatistics/delete',
        deleteBatch: '/statistics/iotProductStatistics/deleteBatch',
        resumeTask: '/statistics/iotProductStatistics/resume',
        pauseTask: '/statistics/iotProductStatistics/pause',
        getPrjListByUser: '/project/sysProject/prjListByUser'
      },
      collapsed: false
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
  },
  beforeCreate () {
    // 自行定义方法，引用字典
    // 初始化字典
    initDictOptions('bpm_status').then(res => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('leave_type').then(res => {
      if (res.success) {
        this.leaveDictOptions = res.result
      }
    })
  },
  created () {},
  mounted () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (this.projectMsg) {
      // 项目级
      this.dataServiceUrl = this.projectMsg.dataServiceUrl
      this.prjCode = this.projectMsg.prjCode
      this.url.list = this.dataServiceUrl + this.url.list
      // this.$refs.myDeviceTree.loadProductNodeData(this.prjCode)
      // this.getDeviceNumberList(this.prjCode).then(() => {
      //   this.initTable()
      // })
    } else {
      new Promise(this.loadProjectData)
        .then(() => {
          // this.$refs.myDeviceTree.loadProjectTreeData(this.projectList)
          // this.getDeviceNumberList(this.prjCodes).then(() => {
          //   this.initTable()
          // })
        })
        .catch(reason => {
          console.log('失败：' + reason)
        })
    }
  },
  methods: {
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      let that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then(res => {
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
    // 根据部门查询
    searchByTree (key) {
      if (key) {
        // 搜索的字段prjType
        this.queryParam.prjType = key
        this.searchQuery()
        this.resertTable()
      } else {
        this.queryParam.prjType = ''
        this.searchQuery()
        this.resertTable()
      }
    },
    // 获取项目数据,填充projectList和prjCodes
    loadProjectData (resolve, reject) {
      if (!this.url.getPrjListByUser) {
        this.$message.error('请设置url.getPrjListByUser属性!')
        return
      }
      let params = null
      let that = this
      this.loading = true
      getAction(this.url.getPrjListByUser, params).then(res => {
        if (res.success) {
          that.projectList = res.result
          that.prjCodes = ''
          that.prjCodes += res.result.map(function (item) {
            return item.prjCode
          })
          that.nodeKey = that.prjCodes
          resolve(res.success)
        } else {
          reject(res.message)
          that.$message.error('获取项目数据失败!')
        }
        this.loading = false
      })
    },
    // 重置表格状态
    resertTable () {
      this.selectedRowKeys = []
    },
    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    },
    // 启动任务
    resumeTask: function (record) {
      var that = this
      this.$confirm({
        title: '确认启用',
        content: '是否启用选中任务?',
        onOk: function () {
          getAction(that.url.resumeTask, { taskId: record.id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 暂停任务
    pauseTask: function (record) {
      var that = this
      this.$confirm({
        title: '确认暂停',
        content: '是否暂停选中任务?',
        onOk: function () {
          getAction(that.url.pauseTask, { taskId: record.id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>
