<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <span class="serachRight" v-if="toggleSearchStatus">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
          </span>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.prjName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目负责人">
              <a-input placeholder="请输入项目负责人" v-model="queryParam.prjLeader"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag
                v-model="queryParam.status"
                placeholder="请选择项目状态"
                dictCode="bpm_status"
              />
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="申请部门">
                <a-input placeholder="请输入申请部门" v-model="queryParam.applicantDeptId"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="4" :sm="8">
              <a-form-item label="填写时间">
                <a-date-picker
                  v-model="queryParam.minStartTime"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                />
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="8">
              <a-form-item label="至">
                <a-date-picker
                  v-model="queryParam.maxEndTime"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                />
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="项目级别">
                <a-input placeholder="请输入项目级别" v-model="queryParam.prjLevel"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
          <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-layout>
      <a-layout-sider width="150px"
                      theme="light"
                      collapsedWidth="0"
                      :trigger="null"
                      collapsible
                      v-model="collapsed">
        <!--部门树查询组件-->
        <j-left-tree
          @searchByTree="searchByTree"
          :header="JLeftTree.header"
          :searchKey="JLeftTree.searchKey"
          :tableName="JLeftTree.tableName"
          :parentId="JLeftTree.parentId"
          :optionName="JLeftTree.optionName"
          :permisson="JLeftTree.permisson"
          asc
          sortCondition="depart_name"
        ></j-left-tree>
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
      <a-layout-content>
        <!-- table区域-begin -->
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">发起</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls('科研项目立项建议')">导出</a-button>
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="importExcelUrl"
            @change="handleImportExcel"
          >
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel">
                <a-icon type="delete" />删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i>
            <span>已选择</span>
            <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>
            <span>项</span>
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>

              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => batchAbandone(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <testMainZjh-modal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import TestMainZjhModal from './modules/TestMainZjhModal'
import { httpAction, getAction } from '@/api/manage'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import qs from 'qs'
import JLeftTree from '@/components/cmp/JLeftTree'

export default {
  name: 'TestMainZjhList',
  mixins: [CmpListMixin],
  components: {
    TestMainZjhModal,
    JLeftTree,
    JDictSelectTag
  },
  data() {
    return {
      description: '科研项目立项建议管理页面',
      processDefinitionKey: '',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },

        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'prjName'
        },
        {
          title: '项目负责人',
          align: 'center',
          dataIndex: 'prjLeaderFullname'
        },
        {
          title: '申请单位',
          align: 'center',
          dataIndex: 'applicantDeptName'
        },
        {
          title: '计划开始日期',
          align: 'center',
          dataIndex: 'planStarttime'
        },
        {
          title: '计划完成日期',
          align: 'center',
          dataIndex: 'planEndtime'
        },
        {
          title: '总经费（元）',
          align: 'center',
          dataIndex: 'sumCost'
        },
        {
          title: '项目级别',
          align: 'center',
          dataIndex: 'prjLevel',
          customRender: (text, record, index) => {
            return filterDictText(this.prjLevel, text)
          }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.statusDictOptions, text)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求参数
      url: {
        list: '/testMainZjh/testMainZjh/list',
        delete: '/testMainZjh/testMainZjh/delete',
        deleteBatch: '/flowable/delete', //删除接口
        exportXlsUrl: 'testMainZjh/testMainZjh/exportXls',
        importExcelUrl: 'testMainZjh/testMainZjh/importExcel',
        getprocessDefinitionKey: '/sysFlow/flowConfig/getProcessDefinitionKeyByEntityName'
      },
      JLeftTree: {
        header: '申请单位',
        searchKey: 'id',
        tableName: 'sys_depart',
        parentId: 'parent_id',
        optionName: 'depart_name',
        permisson: '1' // 0:查询所属公司下所有节点 1:查询所属子部门下的所有节点
      },
      collapsed: false
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    // 获取processDefinitionKey值，流程需要用到
    let params = { entityName: 'TestMainZjh' },
      method = 'get'
    getAction(this.url.getprocessDefinitionKey, params).then(res => {
      if (res.success) {
        this.processDefinitionKey = res.result
      }
    })
  },
  beforeCreate() {
    // 自行定义方法，引用字典
    //初始化字典
    initDictOptions('bpm_status').then(res => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('prj_level').then((res) => {
      if (res.success) {
        this.prjLevel = res.result
      }
    })
  },
  methods: {
    // 流程物理删除
    batchAbandone(id) {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (id == undefined) {
        this.$message.warning('请选择一条记录！')
        return
      }
      let params = {
        id: id,
        processDefinitionKey: this.processDefinitionKey
      }
      let method = 'post'
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function() {
          httpAction(that.url.deleteBatch, qs.stringify(params), method).then(res => {
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
    // 重置表格状态
    resertTable() {
      this.selectedRowKeys = []
      this.disable = true
    },
    // 页面刷新
    mySearchReset() {
      this.resertTable()
      this.startValue = null
      this.endValue = null
      this.searchReset()
    },
    // 查询方法customStyle
    mySearchQuery() {
      this.resertTable()
      this.searchQuery()
    },
    // 选择行
    onSelectChange(selectedRowKeys, index) {
      console.log('选择的主键ID => ', selectedRowKeys)
      console.log('选择的对象 => ', index)
      this.selectedRowKeys = selectedRowKeys
      this.selectedObject = index[0]
      this.disable = false
    },
    //编辑行
    changeRow(selectedObject) {
      this.handleEdit(selectedObject)
    },
    // 根据树节点的key获取项目领域的文本
    getPrjTypeByKey(key) {
      const arr = this.prjType
      for (let i = 0; i < arr.length; i++) {
        if (key == arr[i].value) {
          return arr[i].title
        }
      }
    },
    // 根据部门查询
    searchByTree(key) {
      console.log(key, 'key')
      if (key) {
        this.queryParam.applicantDeptId = key
        this.searchQuery()
        this.resertTable()
      } else {
        this.queryParam.applicantDeptId = ''
        this.searchQuery()
        this.resertTable()
      }
    },
    //控制查询面板的显隐
    switchVisible() {
      this.collapsed = !this.collapsed
    },
    initDictConfig() {}
  }
}
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
  @import '~@assets/less/modal.less';

  .row-content {
    display: flex;
    display: -webkit-flex;
    align-items: stretch;
  }

  div.switch-visible {
    width: 15px;
    height: 48px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin: 0 10px 0 0;
    cursor: pointer;
  }

  span.show,
  span.unshow {
    position: relative;
  }
  span.show:after {
    content: '';
    position: absolute;
    top: -8px;
    right: -10px;
    display: inline-block;
    width: 8px;
    height: 16px;
    border-right: 8px solid #444;
    border-top: 8px solid #fff;
    border-left: 0px solid #fff;
    border-bottom: 8px solid #fff;
  }
  span.unshow:after {
    content: '';
    position: absolute;
    top: -8px;
    left: 3px;
    display: inline-block;
    width: 8px;
    height: 16px;
    border-right: 0px solid #fff;
    border-top: 8px solid #fff;
    border-left: 8px solid #444;
    border-bottom: 8px solid #fff;
  }
</style>