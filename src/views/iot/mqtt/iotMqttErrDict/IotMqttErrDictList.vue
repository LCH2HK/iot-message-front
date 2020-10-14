<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="异常代码">
                  <j-input-lk
                    :placeholder="'请输入异常代码'"
                    @enterSearch="enterSearch($event,'errNo')"
                    @inputValueLk="inputValueLk($event,'errNo')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="异常信息">
                  <j-input-lk
                    :placeholder="'请输入异常信息'"
                    @enterSearch="enterSearch($event,'errMsg')"
                    @inputValueLk="inputValueLk($event,'errMsg')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
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
      <a-layout-sider
        width="250px"
        theme="light"
        collapsedWidth="0"
        :trigger="null"
        collapsible
        v-model="collapsed"
        v-if="false"
      >
        <!--数据字典查询-->
        <j-left-tree @searchByTree="searchByTree" header dictCode></j-left-tree>
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible" v-if="false">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator" v-if="projectMsg">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!-- <a-button @click="batchEdit" type="primary" icon="edit" :disabled="this.selectedRowKeys.length == 0">编辑</a-button>
          <a-button @click="batchDel1" type="primary" icon="delete" :disabled="this.selectedRowKeys.length == 0">删除</a-button>-->
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
            :customHeaderRow="customHeaderRow"
            @change="handleTableChange"
          >
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
    <iotMqttErrDict-modal ref="modalForm" @ok="modalFormOk"></iotMqttErrDict-modal>
  </a-card>
</template>

<script>
import IotMqttErrDictModal from './modules/IotMqttErrDictModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { deleteAction } from '@/api/manage'
import projectTree from '@views/iot/ProjectTree'
import { ProjectTreeMixin } from '@views/iot/js/ProjectTreeMixin'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk.vue'

export default {
  name: 'IotMqttErrDictList',
  mixins: [CmpListMixin, ProjectTreeMixin],
  components: {
    IotMqttErrDictModal,
    JLeftTree,
    JInputLk,
    projectTree
  },
  data () {
    return {
      description: 'MQTT协议异常代码字典表管理页面',
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
          title: '异常代码',
          align: 'left',
          dataIndex: 'errNo'
        },
        {
          title: '异常信息',
          align: 'left',
          dataIndex: 'errMsg'
        },
        {
          title: '录入人',
          align: 'left',
          width: 160,
          dataIndex: 'createBy'
        },
        {
          title: '录入时间',
          align: 'left',
          width: 200,
          dataIndex: 'createTime'
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
        list: '/iotMqttErrDict/iotMqttErrDict/list',
        delete: '/iotMqttErrDict/iotMqttErrDict/delete',
        deleteBatch: '/iotMqttErrDict/iotMqttErrDict/deleteBatch'
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
  },
  created () {
    // ProjectTreeMixin中方法
    this.judgeCorpOrPrjThenLoadData()
  },
  methods: {
    // 控制表头居中
    customHeaderRow (record) {
      // record.forEach(item => {
      //   item.align = 'center'
      // })
    },
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
    // 重置表格状态
    resertTable () {
      this.selectedRowKeys = []
    },
    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
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
