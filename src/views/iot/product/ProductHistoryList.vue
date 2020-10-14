<!--存储任务管理列表展示页面
  因为是以产品进行分表存储的，记录在产品和历史数据表的关联表中，所以历史数据存储用productHistory命名 -->
<template>
  <a-card :bordered="false">
    <!--     查询区域-->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="产品">
                  <j-input-lk
                    :placeholder="'请输入产品名称'"
                    @enterSearch="enterSearch($event,'productName')"
                    @inputValueLk="inputValueLk($event,'productName')"
                    :reset="clickReset"
                  ></j-input-lk>
                  <!--                  <a-input v-model="queryParam.productName"></a-input>-->
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="分组">
                  <j-input-lk
                    :placeholder="'请输入分组名称'"
                    @enterSearch="enterSearch($event,'groupName')"
                    @inputValueLk="inputValueLk($event,'groupName')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <!--            <template v-if="toggleSearchStatus">-->
              <!--              <a-col :md="5" :sm="8">-->
              <!--                <a-form-item label="productId">-->
              <!--                  <a-input v-model="queryParam.productId"></a-input>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <!--            </template>-->
              <!--            <template v-if="toggleSearchStatus">-->
              <!--              <a-col :md="5" :sm="8">-->
              <!--                <a-form-item label="tableName">-->
              <!--                  <a-input v-model="queryParam.tableName"></a-input>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <!--            </template>-->
              <!--            <template v-if="toggleSearchStatus">-->
              <!--              <a-col :md="5" :sm="8">-->
              <!--                <a-form-item label="updateFrequency">-->
              <!--                  <a-input v-model="queryParam.updateFrequency"></a-input>-->
              <!--                </a-form-item>-->
              <!--              </a-col>-->
              <!--            </template>-->
              <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
                <span class="table-page-search-submitButtons serachLeft">

                </span>
              </a-col>
              <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
                <span class="table-page-search-submitButtons serachLeft">
                  <a @click="handleToggleSearch">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                  </a>
                </span>
              </a-col>
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
      <!--项目树-->
      <projectTree ref="projectTree" @getSelectMessage="getSelectMessage" @defaultFocus="initTable"></projectTree>
      <a-layout-content>
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
            @change="handleTableChange"
            style="margin-top:8px;"
          >
            <span slot="action" slot-scope="text, record">
              <!-- <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical" />
              <a @click="handleDelete(record.id)">删除</a>-->
              <a @click="resumeTask(record)" v-if="record.status==-1">启用</a>
              <a @click="pauseTask(record)" v-if="record.status==0">停用</a>
              <a-divider type="vertical"/>
              <a @click="handleEdit(record,'查看')">查看</a>
              <a-divider type="vertical" :class="record.status == -1 ? 'showVertical' : 'unshowVertical'"/>
              <a @click="handleEdit(record)" :disabled="record.status === 0">编辑</a>
            </span>
            <template slot="customRenderStatus" slot-scope="status">
              <a-tag v-if="status==0" color="green">已启用</a-tag>
              <a-tag v-if="status==-1" color="orange">未启用</a-tag>
            </template>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <productHistory-modal ref="modalForm" @ok="modalFormOk"></productHistory-modal>
  </a-card>
</template>

<script>
import ProductHistoryModal from './modules/ProductHistoryModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { filterObj } from '@/utils/util'
import { deleteAction, getAction } from '@/api/manage'
import JInputLk from '@/components/cmp/JInputLk.vue'
import moment from 'moment'
import cronstrue from 'cronstrue/i18n'
import projectTree from '../ProjectTree'
import { ProjectTreeMixin } from '../js/ProjectTreeMixin'

export default {
  name: 'ProductHistoryList',
  mixins: [CmpListMixin, ProjectTreeMixin],
  components: {
    ProductHistoryModal,
    JInputLk,
    projectTree
  },
  // 数据服务URL
  dataServiceUrl: '',
  // 项目信息
  prjData: '',
  // 定时刷新
  dataReflashTimer: '',
  data () {
    return {
      description: '产品历史关联表管理页面',
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
          title: '产品',
          align: 'left',
          dataIndex: 'productName'
        },
        {
          title: '分组',
          align: 'left',
          dataIndex: 'groupName'
        },
        {
          title: '历史表名',
          align: 'left',
          dataIndex: 'historyTable1'
        },
        {
          title: '更新频率',
          align: 'left',
          dataIndex: 'updateFrequency',
          customRender: text => {
            if (text) {
              return cronstrue.toString(text, { locale: 'zh_CN' })
            }
          }
        },
        {
          title: '最久存储月数',
          align: 'left',
          dataIndex: 'longestSaveMonth'
        },
        {
          title: '最近执行时间',
          align: 'left',
          dataIndex: 'lastRunTime'
        },
        {
          title: '最近执行信息',
          align: 'left',
          dataIndex: 'lastRunInfo'
        },
        {
          title: '状态',
          align: 'left',
          dataIndex: 'status',
          scopedSlots: { customRender: 'customRenderStatus' },
          filterMultiple: false,
          filters: [
            { text: '已启用', value: '0' },
            { text: '未启用', value: '-1' }
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
          align: 'left',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: this.dataServiceUrl + '/product/productHistory/list',
        resumeTask: this.dataServiceUrl + '/product/productHistory/resume',
        pauseTask: this.dataServiceUrl + '/product/productHistory/pause',
        delete: this.dataServiceUrl + '/product/productHistory/delete',
        deleteBatch: this.dataServiceUrl + '/product/productHistory/deleteBatch',
        exportXlsUrl: this.dataServiceUrl + '/product/productHistory/exportXls',
        importExcelUrl: this.dataServiceUrl + '/product/productHistory/importExcel',
        exportXlsTemplateUrl: this.dataServiceUrl + '/product/productHistory/exportXlsTemplate'
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
    // 初始化数据服务URL
    // this.dataServiceUrl = Vue.ls.get('PROJECT_MESSAGE').dataServiceUrl
    // 初始化项目数据
    // this.prjData = Vue.ls.get('PROJECT_MESSAGE')
    this.prjData = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    this.dataServiceUrl = this.prjData.dataServiceUrl
  },
  mounted () {
    // 定时刷新页面
    clearInterval(this.dataReflashTimer)
    this.dataReflashTimer = setInterval(() => {
      this.loadData()
    }, 10 * 1000)
    // 项目树
    this.judgeCorpOrPrjThenLoadData()
  },
  methods: {
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.error('操作失败')
            }
          })
        }
      })
    },
    // 重置表格状态
    resertTable () {
      this.selectedRowKeys = []
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
      console.log(record)
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
    },
    // 查询
    mySearchQuery () {
      // debugger
      this.queryParam.prjCode = this.prjData.prjCode
      this.searchQuery()
    },
    getQueryParams () {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp.superQueryParams = encodeURI(this.superQueryParams)
      }
      this.queryParam.prjCode = this.prjData.prjCode
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      // 时间格式化
      param.minStartTime = param.minStartTime ? moment(param.minStartTime).format('YYYY-MM-DD HH:mm:ss') : null
      param.maxStartTime = param.maxStartTime ? moment(param.maxStartTime).format('YYYY-MM-DD HH:mm:ss') : null
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    }
  },
  beforeDestroy () {
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.dataReflashTimer)
    })
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
