<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="参数编码">
                  <j-input-lk
                    placeholder="请输入参数编码"
                    @enterSearch="enterSearch($event, 'code')"
                    @inputValueLk="inputValueLk($event, 'code')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="参数名称">
                  <j-input-lk
                    placeholder="请输入参数名称"
                    @enterSearch="enterSearch($event, 'name')"
                    @inputValueLk="inputValueLk($event, 'name')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="参数值">
                    <j-input-lk
                      placeholder="请输入参数值"
                      @enterSearch="enterSearch($event, 'value')"
                      @inputValueLk="inputValueLk($event, 'value')"
                      :reset="clickReset"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
              </template>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="参数说明">
                    <j-input-lk
                      placeholder="请输入参数说明"
                      @enterSearch="enterSearch($event, 'description')"
                      @inputValueLk="inputValueLk($event, 'description')"
                      :reset="clickReset"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
              </template>
              <a-col :md="2" :sm="8" >
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
    <configuration-modal ref="modalForm" @ok="modalFormOk"></configuration-modal>
  </a-card>
</template>

<script>
import ConfigurationModal from './modules/ConfigurationModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { deleteAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk'

export default {
  name: 'ConfigurationList',
  mixins: [CmpListMixin],
  components: {
    ConfigurationModal,
    JLeftTree,
    JInputLk
  },
  data () {
    return {
      description: '全局配置类管理页面',
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
          title: '参数名称',
          align: 'left',
          dataIndex: 'name'
        },
        {
          title: '参数编码',
          align: 'left',
          dataIndex: 'code'
        },
        {
          title: '参数值',
          align: 'left',
          width: 160,
          dataIndex: 'value'
        },
        {
          title: '参数说明',
          align: 'left',
          dataIndex: 'description'
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
        list: '/configuration/configuration/list',
        delete: '/configuration/configuration/delete',
        deleteBatch: '/configuration/configuration/deleteBatch'

      },
      collapsed: false
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
