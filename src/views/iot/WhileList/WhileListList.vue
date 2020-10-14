<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="IP地址">
                  <j-input-lk
                    placeholder="请输入IP地址"
                    @enterSearch="enterSearch($event, 'ip')"
                    @inputValueLk="inputValueLk($event, 'ip')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="备注">
                  <j-input-lk
                    placeholder="请输入备注"
                    @enterSearch="enterSearch($event, 'comment')"
                    @inputValueLk="inputValueLk($event, 'comment')"
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
      <a-layout-sider width="250px"
                      theme="light"
                      collapsedWidth="0"
                      :trigger="null"
                      collapsible
                      v-model="collapsed"
                      v-if="false">
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible" v-if="false">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
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
    <whileList-modal ref="modalForm" @ok="modalFormOk"></whileList-modal>
  </a-card>
</template>

<script>
import WhileListModal from './modules/WhileListModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { deleteAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk'

export default {
  name: 'WhileListList',
  mixins: [CmpListMixin],
  components: {
    WhileListModal,
    JLeftTree,
    JInputLk
  },
  data () {
    return {
      description: '白名单管理管理页面',
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
          title: 'IP地址',
          align: 'left',
          dataIndex: 'ip'
        },
        {
          title: '备注',
          align: 'left',
          dataIndex: 'comment'
        },
        {
          title: '录入时间',
          align: 'left',
          width: 200,
          dataIndex: 'inputTime'
        },
        {
          title: '录入人姓名',
          align: 'left',
          width: 160,
          dataIndex: 'inputerFullname'
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
        list: '/whitelist/whiteList/list',
        delete: '/whitelist/whiteList/delete',
        deleteBatch: '/whitelist/whiteList/deleteBatch'
      },
      collapsed: false
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
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
