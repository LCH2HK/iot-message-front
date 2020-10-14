<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator" :md="24" :sm="24" style="margin: -25px 0px 10px 2px">
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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <CmpOrderTicket-modal ref="modalForm" @ok="modalFormOk"></CmpOrderTicket-modal>
  </a-card>
</template>

<script>
  import CmpOrderTicketModal from './form/CmpOrderTicketModal'
  import {CmpListMixin} from '@/mixins/CmpListMixin'
  import {getAction} from '@/api/manage'

  export default {
    name: "CmpOrderTicketList",
    mixins: [CmpListMixin],
    components: {
      CmpOrderTicketModal,
    },
    data() {
      return {
        description: '机票信息',
        // 表头
        columns: [{
          title: '航班号',
          align: "center",
          dataIndex: 'ticketCode'
        }, {
          title: '航班时间',
          align: "center",
          dataIndex: 'tickectDate'
        }, {
          title: '订单号码',
          align: "center",
          dataIndex: 'orderId',
        }, {
          title: '创建人',
          align: "center",
          dataIndex: 'createBy'
        }, {
          title: '创建时间',
          align: "center",
          dataIndex: 'createTime',
          sorter: true
        }, {
          title: '操作',
          key: 'operation',
          align: "center",
          width: 130,
          scopedSlots: {customRender: 'action'},
        }],
        url: {
          list: "/test/order/listOrderTicketByMainId",
          delete: "/test/order/deleteTicket",
          deleteBatch: "/test/order/deleteBatchTicket",
        }
      }
    },
    methods: {
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();
        getAction(this.url.list, {mainId: params.mainId}).then((res) => {
          if (res.success) {
            this.dataSource = res.result;
          } else {
            this.dataSource = null;
          }
        })
      },
      getOrderMain(orderId) {
        this.queryParam.mainId = orderId;
        this.loadData(1);
      },
      handleAdd: function () {
        this.$refs.modalForm.add(this.queryParam.mainId);
        this.$refs.modalForm.title = "添加机票信息";
      },
    }
  }
</script>
<style lang="less" scoped>
  .ant-card {
    margin-left: -30px;
    margin-right: -30px;
  }
  /* 没有搜索框的list样式 */
  .ant-btn-primary {
    height: 40px;
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
</style>