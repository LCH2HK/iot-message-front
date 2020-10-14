<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="发起人">
              <a-input placeholder="请输入发起人" v-model="queryParam.inputerFullname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="任务类型">
              <a-input placeholder="请输入任务类型" v-model="queryParam.taskCategory"></a-input>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="任务名称">
                <a-input placeholder="请输入任务名称" v-model="queryParam.taskName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="环节名称">
                <a-input placeholder="请输入环节名称" v-model="queryParam.nodeName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="开始时间">
                <a-input placeholder="请输入开始时间" v-model="queryParam.startTime"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '精确查询' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form> -->
    </div>

    <!-- table区域-begin -->
    <div>
      
      <a-table
        ref="table"
        size="middle"
        :rowKey="rowkey"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEditform(record)">发起</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <component :is="comName" ref="modalForm" @ok="modalFormOk"></component>
  </a-card>
</template>

<script>
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import { getAction } from '@/api/manage'
  import { setTimeout } from 'timers';

  export default {
    name: "formFill",
    mixins:[CmpListMixin],
    data () {
      return {
        description: '待办任务管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
		      {
            title: '表单名称',
            align:"center",
            dataIndex: 'menuName'
          },
          {
            title: '所在模块',
            align: "center",
            dataIndex: 'parentMenuName'
          },
          {
            title: '表单简介',
            align: "center",
            dataIndex: 'description'
          },
          {
            title: '技术支持',
            align: "center",
            dataIndex: 'maintainUserFullname'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		    url: {
          list: "/sysFlow/flowConfig/list",
          form: "/flowable/tasks/form"
        },
        rowkey: '',
        componentsUrl: 'stakeholder/modules/stakemodule'
      }
    },
    methods: {
      handleEditform: function (record) {
        let oldform = this.$refs.modalForm;
        this.componentsUrl = record.formPath;
        let that=this;
        setTimeout(function(){
          that.$refs.modalForm.add();
          that.$refs.modalForm.title = "新增";
        },)
      },
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          this.loading = false;
        })
      },
      // 覆盖刷新界面
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData();
        this.$emit('ok');
      },
    },
    created() {
      this.loadData();
    },
     computed: {
       comName: function () {
         console.log(this.componentsUrl);
         return () => import(`@/views/${this.componentsUrl}.vue`)
       }
     
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
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

</style>