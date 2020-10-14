<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="21" :sm="18">
            <a-row :gutter="24">
              <a-col :md="7" :sm="8">
                <a-form-item label="数据源标识符">
                  <j-input-lk
                    placeholder="请输入数据源标识符"
                    @enterSearch="enterSearch($event, 'dbKey')"
                    @inputValueLk="inputValueLk($event, 'dbKey')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <a-col :md="7" :sm="8">
                <a-form-item label="数据源名称">
                  <j-input-lk
                    placeholder="请输入数据源名称"
                    @enterSearch="enterSearch($event, 'name')"
                    @inputValueLk="inputValueLk($event, 'name')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="3" :sm="24">
            <div class="search-buttons-content">
                  <span class="table-page-search-submitButtons serachLeft">
                    <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                    <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
                  </span>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-layout>
      <!--      <a-layout-sider-->
      <!--        width="180px"-->
      <!--        theme="light"-->
      <!--        collapsedWidth="0"-->
      <!--        :trigger="null"-->
      <!--        collapsible-->
      <!--        v-model="collapsed"-->
      <!--        style="margin-right: 10px"-->
      <!--        v-if="!isInProject"-->
      <!--      >-->
      <!--        <div style="width: 100%; height: 100%; overflow: auto">-->
      <!--          <div>-->
      <!--            <a-collapse-->
      <!--              v-model="activeKey"-->
      <!--              style="height: inherit;border-bottom: 1px solid #d9d9d9"-->
      <!--            >-->
      <!--              <a-collapse-panel header="快捷查询" key="1">-->
      <!--                <a-radio :checked="this.radioChecked" @focus="defaultFocus">默认</a-radio>-->
      <!--              </a-collapse-panel>-->
      <!--              <a-collapse-panel style="border-bottom: 0;" header="项目树" key="2">-->
      <!--                &lt;!&ndash;<a-tree :treeData="projectData"-->
      <!--                        showLine-->
      <!--                        :defaultExpandedKeys="[1]"-->
      <!--                        @select="onSelect">-->
      <!--                </a-tree>&ndash;&gt;-->
      <!--                <a-tree showLine @select="onSelect">-->
      <!--                  <a-tree-node-->
      <!--                    v-for="item in this.treeData"-->
      <!--                    :title="item.prjName"-->
      <!--                    :key="item.id"-->
      <!--                    :prjCode="item.prjCode"-->
      <!--                  ></a-tree-node>-->
      <!--                </a-tree>-->
      <!--                &lt;!&ndash;                <a-tree :treeData="treeData" @select="onSelect" :selectedKeys="selectedProKeys"/>&ndash;&gt;-->
      <!--              </a-collapse-panel>-->
      <!--            </a-collapse>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </a-layout-sider>-->
      <!-- 切换按钮 -->
      <!--      <div class="switch-visible" @click="switchVisible" v-if="!isInProject">-->
      <!--        <span :class="!collapsed ? 'show' : 'unshow'"></span>-->
      <!--      </div>-->

      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!--          <a-button-->
          <!--            @click="batchEdit"-->
          <!--            type="primary"-->
          <!--            icon="edit"-->
          <!--            :disabled="this.selectedRowKeys.length === 0"-->
          <!--          >编辑</a-button>-->

          <!--          <a-button-->
          <!--            @click="batchDel1"-->
          <!--            type="primary"-->
          <!--            icon="delete"-->
          <!--            :disabled=" this.selectedRowKeys.length === 0"-->
          <!--          >删除</a-button>-->
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
          <!--             :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}" -->
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record,'查看')">查看</a>
              <a-divider type="vertical"/>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a @click="handleDelete(record.id)">删除</a>
            </span>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <datasource-modal ref="modalForm" @ok="modalFormOk"></datasource-modal>
  </a-card>
</template>

<script>
import DatasourceModal from './modules/DatasourceModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { deleteAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk'

export default {
  name: 'DatasourceList',
  mixins: [CmpListMixin],
  components: {
    DatasourceModal,
    JLeftTree,
    JInputLk
  },
  data () {
    return {
      description: '属性模板表管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => {
            return this.getIndexOfPage(index)
          }
        },
        {
          title: '数据源标识符',
          align: 'left',
          dataIndex: 'dbKey',
          sorter: true,
          width: 160,
          validateRules: [
            {
              required: true, // 必填
              message: '请输入${title}' // 显示的文本
            }
          ]
        },
        {
          title: '数据源名称',
          align: 'left',
          dataIndex: 'name',
          sorter: true,
          validateRules: [
            {
              required: true, // 必填
              message: '请输入${title}' // 显示的文本
            }
          ]
        },
        {
          title: '数据源描述',
          align: 'left',
          dataIndex: 'dbDescription',
          sorter: true,
          validateRules: [
            {
              required: true, // 必填
              message: '请输入${title}' // 显示的文本
            }
          ]
        },
        {
          title: '数据源类型',
          align: 'left',
          dataIndex: 'dbType',
          sorter: true,
          width: 160,
          customRender: text => {
            return this.getDbTypeByClass(text)
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
        list: '/Datasource/Datasource/list',
        delete: '/Datasource/Datasource/delete',
        deleteBatch: '/Datasource/Datasource/deleteBatch',
        exportXlsUrl: '/Datasource/Datasource/exportXls',
        importExcelUrl: '/Datasource/Datasource/importExcel'
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
  mounted () {
    this.initPrjTree().then(() => {
      this.loadData()
    })
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
              that.loadData(-1)
            } else {
              that.$message.warning('操作失败')
            }
          })
        }
      })
    },
    // 控制表头居中
    customHeaderRow (record) {
      // record.forEach(item => {
      //   item.align = 'center'
      // })
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
    // 通过驱动类名称获取数据库类型
    getDbTypeByClass (className) {
      switch (className) {
        case 'com.mysql.jdbc.Driver':
          return 'MySql'
        case 'dm.jdbc.driver.DmDriver':
          return '达梦'
        default:
          return ' '
      }
    },
    // 重置表格状态
    resertTable () {
      this.selectedRowKeys = []
    },
    mySearchReset () {
      this.queryParam = {}
      this.resertTable()
      this.searchReset()
    }
    /* myEnterSearch(event, value) {
                   console.log('进入自定义方法');
                   value.replace(/(^\s*)|(\s*$)/g, "");
                   console.log('查看value',value);
                   ;
               }, */
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
  .switch-visible {
    width: 15px;
    height: 48px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin: 0 10px 0 0;
    cursor: pointer;
  }
</style>
