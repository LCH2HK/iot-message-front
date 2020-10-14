<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="发起人">
              <a-input placeholder="请输入发起人" v-model="queryParam.startUserFullName" @keyup.enter="searchQuery"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="任务类型">
              <a-input placeholder="请输入任务类型" v-model="queryParam.processDefinitionName" @keyup.enter="searchQuery"></a-input>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="任务名称">
                <a-input placeholder="请输入任务名称" v-model="queryParam.taskSubject" @keyup.enter="searchQuery"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="环节名称">
                <a-input placeholder="请输入环节名称" v-model="queryParam.taskName" @keyup.enter="searchQuery"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="执行人">
                <a-input placeholder="请输入执行人" v-model="queryParam.assigneeFullname" @keyup.enter="searchQuery"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="任务创建时间">
                <a-date-picker
                  v-model="queryParam.minStartTime"
                  :disabledDate="disabledStartDate"
                  :defaultPickerValue="moment('00:00:00', 'HH:mm:ss')"
                  placeholder="任务创建开始时间"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="至">
                <a-date-picker
                  v-model="queryParam.maxStartTime"
                  :disabledDate="disabledEndDate"
                  :defaultPickerValue="moment('23:59:59', 'HH:mm:ss')"
                  placeholder="任务创建结束时间"/>
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
      </a-form>
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
          <a @click="handleEditform(record)">处理</a>&nbsp;
          <a @click="handleEntrust(record)">委托</a>
        </span>
      </a-table>

    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <component :is="comName" ref="modalForm" @ok="modalFormOk"></component>
    <task-modal ref="modalForm1" @ok="modalFormOk"></task-modal>
  </a-card>
</template>

<script>
  import TaskModal from './modules/TaskModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import { getAction } from '@/api/manage'
  import JDate from '@/components/cmp/JDate'
  import { setTimeout } from 'timers';
  import moment from "moment"

  export default {
    name: "TaskList",
    mixins:[CmpListMixin],
    components: {
      JDate,
      TaskModal
    },
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
            title: '发起人',
            align:"center",
            dataIndex: 'startUserFullname'
          },
		      {
            title: '任务类型',
            align:"center",
            dataIndex: 'taskCategory'
          },
		      {
            title: '任务名称',
            align:"center",
            dataIndex: 'taskSubject'
          },
		      {
            title: '环节名称',
            align:"center",
            dataIndex: 'nodeName'
          },
		      {
            title: '任务创建时间',
            align:"center",
            dataIndex: 'startTime'
          },
		      {
            title: '执行人',
            align:"center",
            dataIndex: 'assigneeFullname'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],

        //接口
		    url: {
          list: "/flowable/tasks/list",
          form: "/flowable/tasks/form"
        },
        rowkey: '',
        componentsUrl: 'oa/modules/LeaveApplicationModal'
      }
    },
    methods: {
      moment,
      handleEditform: function (record) {
        let params = {
          businessKey: record.businessKey,
          processDefinitionKey: record.processDefinitionKey, 
          processDefinitionId: record.processDefinitionId, 
          processInstanceId: record.processInstanceId, 
          taskId: record.taskId
        }
        getAction(this.url.form, params).then((res) => {
          let that = this;
          if (res.success) {
            that.componentsUrl = res.result.formPath;
            record = Object.assign(res.result, {taskId: record.taskId},{nodeName: record.nodeName},{nodeId: record.nodeId})
            setTimeout(function(){ 
              that.$refs.modalForm.edit(record);
              that.$refs.modalForm.title = "处理";
            },)
          }
        })
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
            this.dataSource = res.result.dataList;
            this.ipagination.total = res.result.total;
          }
          this.loading = false;
        })
      },
      // 第二个弹窗  委托方法
      handleEntrust(record) {
        this.$refs.modalForm1.edit(record);
        this.$refs.modalForm1.title = "任务委托";
      },
      // 时间选择器的禁用封装
      disabledStartDate (startValue) {
        const endValue = this.queryParam.maxStartTime;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      },
      disabledEndDate (endValue) {
        const startValue = this.queryParam.minStartTime;
        if (!endValue || !startValue) {
          return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
      }
    },
    computed: {
      comName: function () {
        console.log(this.componentsUrl)
        return () => import(`@/views/${this.componentsUrl}.vue`)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>