<template>
  <a-card :bordered="false">

    <a-layout>
      <div class="tree-content">
          <a-layout-sider
            width="200px"
            theme="light"
            collapsedWidth="0"
            :trigger="null"
            collapsible
            v-model="collapsed"
            style="margin-right: 10px"
            v-if="!isInProject"
          >
          <a-collapse
            v-model="activeKey"
            style="height: inherit;border-bottom: 1px solid #d9d9d9"
          >
            <a-collapse-panel header="快捷查询" key="1">
              <a-radio :checked="this.radioChecked" @focus="defaultFocus">默认</a-radio>
            </a-collapse-panel>
            <a-collapse-panel style="border-bottom: 0;" header="项目树" key="2">
              <a-tree showLine @select="onSelect" :selectedKeys="selectedProKeys">
                <a-tree-node
                  v-for="item in this.treeData"
                  :title="item.prjName"
                  :key="item.id"
                  :prjCode="item.prjCode"
                ></a-tree-node>
              </a-tree>
            </a-collapse-panel>
          </a-collapse>
        </a-layout-sider>
        <!-- 切换按钮 -->
        <div class="switch-visible" @click="switchVisible" v-if="!isInProject">
          <span :class="!collapsed ? 'show' : 'unshow'"></span>
        </div>
      </div>
      <a-layout-content>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="21" :sm="21">
                <a-row :gutter="24">
                  <a-col :md="7" :sm="8">
                    <a-form-item label="编号">
                      <j-input-lk
                        :placeholder="'请输入通讯管理机编号'"
                        @enterSearch="enterSearch($event,'code')"
                        @inputValueLk="inputValueLk($event,'code')"
                        :reset="clickReset"
                      ></j-input-lk>
                      <!--              <a-input v-model="queryParam.communcationManagerId"></a-input>-->
                    </a-form-item>
                  </a-col>
                  <a-col :md="7" :sm="8">
                    <a-form-item label="名称">
                      <j-input-lk
                        :placeholder="'请输入通讯管理机名称'"
                        @enterSearch="enterSearch($event,'name')"
                        @inputValueLk="inputValueLk($event,'name')"
                        :reset="clickReset"
                      ></j-input-lk>
                      <!--              <a-input v-model="queryParam.communcationManagerName"></a-input>-->
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :md="3" :sm="3">
                <div class="search-buttons-content">
                    <span class="table-page-search-submitButtons serachLeft">
                      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                      <a-button type="primary" @click="searchReset" style="margin-left: 8px" icon="reload">重置</a-button>
                    </span>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 操作按钮区域 -->

        <div class="table-operator" v-if="!isInProject">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
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
            @change="handleTableChange"
            :customHeaderRow="customHeaderRow"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="resumeTask(record)" v-if="record.watched==='0'">启用监视</a>
              <a @click="pauseTask(record)" v-if="record.watched==='1'">暂停监视</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record,'查看')">查看</a>
              <a-divider type="vertical" :class="record.watched !== '1'? 'showVertical' : 'unshowVertical'"/>
              <a @click="handleEdit(record)" :disabled="record.watched === '1'">编辑</a>
              <a-divider type="vertical" :class="record.watched !== '1'? 'showVertical' : 'unshowVertical'"/>
              <a @click="batchAbandone(record.id)" :disabled="record.watched === '1'">删除</a>
            </span>
            <template slot="customRenderStatus" slot-scope="status">
              <a-tag v-if="status==1" color="green">正常</a-tag>
              <a-tag v-if="status==2" color="red">异常</a-tag>
            </template>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <communcationManager-modal ref="modalForm" @ok="modalFormOk"></communcationManager-modal>
  </a-card>
</template>

<script>
import CommuncationManagerModal from './modules/CommuncationManagerModal'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { IotPrjTreeMixin } from '@/views/iot/js/IotPrjTreeMixin'
import { deleteAction, getAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'

import JInputLk from '@/components/cmp/JInputLk.vue'

export default {
  name: 'CommuncationManagerList',
  mixins: [myCmpListMixin, IotPrjTreeMixin],
  components: {
    CommuncationManagerModal,
    JLeftTree,
    JInputLk
  },
  data () {
    return {
      description: '通讯管理机管理页面',
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
          title: '编号',
          align: 'left',
          dataIndex: 'code'
        },
        {
          title: '名称',
          align: 'left',
          dataIndex: 'name'
        },
        {
          title: '运行信息',
          align: 'left',
          dataIndex: 'runInfo'
        },
        {
          title: '录入时间',
          align: 'left',
          dataIndex: 'createTime'
        },
        {
          title: '状态更新时间',
          align: 'left',
          dataIndex: 'updateTime'
        },
        {
          title: '状态',
          align: 'left',
          dataIndex: 'status',
          scopedSlots: { customRender: 'customRenderStatus' },
          filterMultiple: false,
          filters: [
            { text: '正常', value: '1' },
            { text: '异常', value: '2' }
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
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/communcationManager/communcationManager/listByPrjCode',
        // list: '/project/sysProject/prjListByUser',
        delete: '/communcationManager/communcationManager/delete',
        deleteBatch: '/communcationManager/communcationManager/deleteBatch',
        resumeTask: '/communcationManager/communcationManager/resume',
        pauseTask: '/communcationManager/communcationManager/pause'
      },
      dataReflashTimer: '',
      collapsed: false,
      isPublished: false,
      flag: true,
      prjCodes: '',
      projects: [],
      unpaged_datasource: [],
      prjMaps: [] // 属性是prjCode，值是通讯管理机数组的数组
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
  },
  beforeCreate () {},
  created () {
    this.initPrjTree().then(() => {
      this.projects = this.treeData
      this.loadData()
    })
    clearInterval(this.dataReflashTimer)
    this.dataReflashTimer = setInterval(() => {
      this.loadData()
    }, 60 * 1000)
  },
  beforeDestroy () {
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.dataReflashTimer)
    })
  },
  methods: {
    // 查询数据并进行分页
    loadData () {
      let that = this
      that.unpaged_datasource = []
      that.projects.forEach(prj => {
        let url_prefix = prj.dataServiceUrl
        let list_url = url_prefix + that.url.list
        let params = { prjCode: prj.prjCode }
        getAction(list_url, params).then(res => {
          if (res.success) {
            that.prjMaps.push({ id: prj.id, data: res.result })
            that.unpaged_datasource = that.unpaged_datasource.concat(res.result)
            that.unpaged_datasource.sort((a, b) => {
              if (a.code > b.code) {
                return 1
              } else if (a.code < b.code) {
                return -1
              } else {
                return 0
              }
            })
            that.loadPageData(that.unpaged_datasource)
          } else {
            that.$message.error('请求失败!')
          }
        })
      })
    },
    // 对现有数据进行分页展示
    loadPageData (origin_dataSource) {
      let params = this.getQueryParams() // 查询条件
      let code = params.code
      let name = params.name
      if (code != null && code != '') {
        code = code.substring(1, code.length - 1)
        origin_dataSource = origin_dataSource.filter(item => {
          return item.code.indexOf(code) != -1
        })
      }
      if (name != null && name != '') {
        name = name.substring(1, code.length - 1)
        origin_dataSource = origin_dataSource.filter(item => {
          return item.name.indexOf(name) != -1
        })
      }
      this.ipagination.total = origin_dataSource.length
      let currentPage = this.ipagination.current
      let pageSize = this.ipagination.pageSize
      let startIndex = (currentPage - 1) * pageSize
      let endIndex = currentPage * pageSize
      origin_dataSource = origin_dataSource.slice(startIndex, endIndex)
      this.dataSource = origin_dataSource
    },

    // 分页、排序、筛选变化时触发
    handleTableChange (pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadPageData(this.unpaged_datasource)
    },
    onSelect (selectedKeys, info) {
      if (selectedKeys.length == 0) {
        this.disable = true
        return
      }
      this.disable = false
      this.selectedProKeys = selectedKeys
      let origin_dataSource = []
      this.prjMaps.forEach(prj => {
        if (prj.id == selectedKeys[0]) {
          origin_dataSource = prj.data
        }
      })
      this.loadPageData(origin_dataSource)
      this.ipagination.total = origin_dataSource.length
      // 清除默认单选框选中状态
      this.radioChecked = false
    },
    defaultFocus () {
      // 选中默认框
      this.radioChecked = true
      // 清除项目列表树选中状态
      this.selectedProKeys = []
      this.setPrjCodes()
      this.clickReset = !this.clickReset
      this.loadPageData(this.unpaged_datasource)
    },
    searchQuery () {
      this.loadPageData(this.unpaged_datasource)
    },
    searchReset () {
      this.queryParam = {}
      this.clickReset = !this.clickReset
      this.loadPageData(this.unpaged_datasource)
    },
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      // 查询待删除的通讯管理机所在项目的数据服务url
      let url_prefix = ''
      this.dataSource.forEach(item => {
        if (item.id == id) {
          let prjCode = item.prjCode
          this.projects.forEach(project => {
            if (project.prjCode == prjCode) {
              url_prefix = project.dataServiceUrl
            }
          })
        }
      })
      let delete_url = url_prefix + this.url.delete
      let that = this
      // that.loading = true
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(delete_url, { id: id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.loading = false
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
    // 控制表头居中
    customHeaderRow (record) {
      // record.forEach(item => {
      //   item.align = 'center'
      // })
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
      // 查询待启动任务的通讯管理机所在项目的数据服务url
      let url_prefix = ''
      this.projects.forEach(project => {
        if (project.prjCode == record.prjCode) {
          url_prefix = project.dataServiceUrl
        }
      })
      let resumeTask_url = url_prefix + this.url.resumeTask

      let that = this
      this.$confirm({
        title: '确认启用',
        content: '是否启用选中任务?',
        onOk: function () {
          getAction(resumeTask_url, { commID: record.id }).then(res => {
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
      // 查询待启动任务的通讯管理机所在项目的数据服务url
      let url_prefix = ''
      this.projects.forEach(project => {
        if (project.prjCode == record.prjCode) {
          url_prefix = project.dataServiceUrl
        }
      })
      let pauseTask_url = url_prefix + this.url.pauseTask

      let that = this
      this.$confirm({
        title: '确认暂停',
        content: '是否暂停选中任务?',
        onOk: function () {
          getAction(pauseTask_url, { commID: record.id }).then(res => {
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
@import '~@views/iot/css/iotCommon.less';
/deep/.ant-card-body {
  padding: 16px 16px;
}
div.tree-content {
  display: flex;
  box-sizing: border-box;
  min-height: 0;
  margin-right: 14px;
}
</style>
