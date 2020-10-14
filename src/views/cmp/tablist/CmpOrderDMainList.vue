<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item label="订单号">
              <a-input placeholder="请输入订单号" v-model="queryParam.orderCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="订单类型">
              <a-select placeholder="请输入订单类型" v-model="queryParam.ctype">
                <a-icon slot="suffixIcon" type="caret-down" />
                <a-select-option value="1">国内订单</a-select-option>
                <a-select-option value="2">国际订单</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>


    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="caret-down"/>
        </a-button>
      </a-dropdown>

      <div class="ant-alert ant-alert-info">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        filterMultiple="filterMultiple"
        :columns="columns"  
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:type}"
        @change="handleTableChange"
        :customRow="clickThenCheck"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="客户信息" key="1">
        <Cmp-Order-Customer-List ref="CmpOrderCustomerList"></Cmp-Order-Customer-List>
      </a-tab-pane>
      <a-tab-pane tab="机票信息" key="2" forceRender>
        <Cmp-Order-Ticket-List ref="CmpOrderTicketList"></Cmp-Order-Ticket-List>
      </a-tab-pane>
    </a-tabs>

    <!-- 表单区域 -->
    <cmpOrderDMain-modal ref="modalForm" @ok="modalFormOk"></cmpOrderDMain-modal>

  </a-card>
</template>

<script>
  import CmpOrderDMainModal from './form/CmpOrderDMainModal'
  import CmpOrderCustomerList from './CmpOrderCustomerList'
  import CmpOrderTicketList from './CmpOrderTicketList'
  import {deleteAction} from '@/api/manage'
  import CmpOrderCustomerModal from './form/CmpOrderCustomerModal'
  import CmpOrderTicketModal from './form/CmpOrderTicketModal'
  import {CmpListMixin} from '@/mixins/CmpListMixin'

  export default {
    name: "CmpOrderDMainList",
    mixins: [CmpListMixin],
    components: {
      CmpOrderTicketModal,
      CmpOrderCustomerModal,
      CmpOrderDMainModal,
      CmpOrderCustomerList,
      CmpOrderTicketList,
    },
    data() {
      return {
        description: '订单管理页面',
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        // 表头
        columns: [{
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: "center",
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          }
        },
          {
            title: '订单号',
            align: "center",
            dataIndex: 'orderCode'
          },
          {
            title: '订单类型',
            align: "center",
            dataIndex: 'ctype',
            customRender: (text) => {
              let re = "";
              if (text === '1') {
                re = "国内订单";
              } else if (text === '2') {
                re = "国际订单";
              }
              return re;
            }
          },
          {
            title: '订单日期',
            align: "center",
            dataIndex: 'orderDate'
          },
          {
            title: '订单金额',
            align: "center",
            dataIndex: 'orderMoney'
          },
          {
            title: '订单备注',
            align: "center",
            dataIndex: 'content'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }],
        // 分页参数
        type: "radio",
        url: {
          list: "/test/order/orderList",
          delete: "/test/order/delete",
          deleteBatch: "/test/order/deleteBatch",
        },
      }
    },
    methods: {
      clickThenCheck(record) {
        return {
          on: {
            click: () => {
              this.onSelectChange(record.id.split(","), [record]);
            }
          }
        };
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
        this.$refs.CmpOrderCustomerList.getOrderMain(this.selectedRowKeys[0]);
        this.$refs.CmpOrderTicketList.getOrderMain(this.selectedRowKeys[0]);
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.$refs.CmpOrderCustomerList.queryParam.mainId = null;
        this.$refs.CmpOrderTicketList.queryParam.mainId = null;
        this.$refs.CmpOrderCustomerList.loadData();
        this.$refs.CmpOrderTicketList.loadData();
        this.$refs.CmpOrderCustomerList.selectedRowKeys = [];
        this.$refs.CmpOrderCustomerList.selectionRows = [];
        this.$refs.CmpOrderTicketList.selectedRowKeys = [];
        this.$refs.CmpOrderTicketList.selectionRows = [];
      },

      handleDelete: function (id) {
        var that = this;
        deleteAction(that.url.delete, {id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
            this.$refs.CmpOrderCustomerList.loadData();
            this.$refs.CmpOrderTicketList.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      searchQuery:function(){
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.$refs.CmpOrderCustomerList.queryParam.mainId = null;
        this.$refs.CmpOrderTicketList.queryParam.mainId = null;
        this.$refs.CmpOrderCustomerList.loadData();
        this.$refs.CmpOrderTicketList.loadData();
        this.$refs.CmpOrderCustomerList.selectedRowKeys = [];
        this.$refs.CmpOrderCustomerList.selectionRows = [];
        this.$refs.CmpOrderTicketList.selectedRowKeys = [];
        this.$refs.CmpOrderTicketList.selectionRows = [];
        this.loadData();
      }
    }
  }
</script>
<style lang='less' scoped>

  // 组件内直接引入ant组件样式覆盖
  .ant-form-item-label {
    line-height: 40px;
  }
  .table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item > :global(.ant-form-item-label) {
        line-height: 40px;
      }
    }
  }
  .ant-input {
    height: 40px;
  }
  /* 下拉选框 */
  .ant-select {
    /* height: 40px; */
    :global(.ant-select-selection--single) {
      height: 40px;
      :global(.ant-select-selection__rendered) {
        line-height: 40px;
      }
    }
  }
  .ant-btn-primary {
    height:40px;
  }
  .ant-dropdown-trigger {
    height: 40px;
  }
  .ant-card-body .table-operator {
    display: flex;
    margin-bottom: 20px;
    vertical-align: top;
    height: 40px;
  }

  .ant-card-body .table-operator>div {
    flex: 1;
    margin-left: 14px;
  }

  .ant-card-body .table-operator .ant-alert-info {
    border: unset;
    border-radius:4px;
    background: rgba(109,98,255,0.1);
  }

  // tab的下面横线样式
  .ant-tabs {
    :global(.ant-tabs-bar) {
      :global(.ant-tabs-nav-container) {
        :global(.ant-tabs-nav-scroll) {      
          :global(.ant-tabs-nav) {     
            :global(.ant-tabs-ink-bar) {
              width:24px!important;
              height:3px!important;
              border-radius:2px!important;
              margin-left:30px!important;
            }
          }
        }
      }
    }
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>