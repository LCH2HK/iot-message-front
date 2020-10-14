<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="请假人">
              <j-input-lk
              :placeholder="'请输入请假人'"
              @enterSearch="enterSearch($event,'inputerFullname')"
              @inputValueLk="inputValueLk($event,'inputerFullname')"
              ref="ResetLk">
              </j-input-lk>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="请假类型">
              <j-dict-select-tag v-model="queryParam.type" placeholder="请选择类型" dictCode="leave_type"/>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="请假时间">
              <a-date-picker
                v-model="queryParam.minStartTime"
                :disabledDate="disabledStartDate"
                :defaultPickerValue="moment('00:00:00', 'HH:mm:ss')"
                placeholder="开始时间"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="至">
              <a-date-picker
                v-model="queryParam.maxEndTime"
                :disabledDate="disabledEndDate"
                :defaultPickerValue="moment('23:59:59', 'HH:mm:ss')"
                placeholder="开始时间"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <j-dict-select-tag  v-model="queryParam.status" placeholder="请选择状态" dictCode="bpm_status"/>
            </a-form-item>
          </a-col>
        </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">发起</a-button>
      <!-- <a-button @click="batchAbandone" type="primary" icon="delete">删除</a-button> -->
      <a-button @click="batchEdit" type="primary" icon="edit" v-has="'leave:editAndDelete'" :disabled="this.selectedRowKeys.length == 0">编辑</a-button>
      <a-button @click="batchDel" type="primary" icon="delete" v-has="'leave:editAndDelete'" :disabled="this.selectedRowKeys.length == 0">删除</a-button>
      <a-button @click="searchReset" type="primary" icon="reload">刷新</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        key="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        class="titleCenter"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: 'radio'}">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record,'查看')">查看</a>

          <!-- <a-divider type="vertical" /> -->
          <!-- <a @click="batchAbandone($event,record.id,record.processInstanceId)">删除</a> -->
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <leaveApplication-modal ref="modalForm" @ok="modalFormOk"></leaveApplication-modal>
  </a-card>
</template>

<script>
  import LeaveApplicationModal from './modules/LeaveApplicationModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import { httpAction } from '@/api/manage'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import qs from 'qs';
  import moment from "moment"
  import { filterObj } from '@/utils/util';
  import JInputLk from '@/components/cmp/JInputLk'

  export default {
    name: "LeaveApplicationList",
    mixins:[CmpListMixin],
    components: {
      LeaveApplicationModal,
      JDictSelectTag,
      JInputLk
    },
    
    data () {
      return {
        description: '请假申请管理页面',
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
            title: '请假人',
            align:"center",
            dataIndex: 'inputerFullname',
          },
          {
            title: '请假类型',
            align:"center",
            dataIndex: 'type',
            customRender: (text, record, index) => {
              //字典值替换通用方法
              return filterDictText(this.leaveDictOptions, text);
            }
          },
          {
            title: '请假开始时间',
            align:"center",
            dataIndex: 'timeStart'
          },
          {
            title: '请假结束时间',
            align:"center",
            dataIndex: 'timeEnd'
          },
          {
            title: '请假原因',
            align: "center",
            dataIndex: 'reason'
          },
          {
            title: '项目经理/组长',
            align:"center",
            dataIndex: 'auditFullname1'
          },
          {
            title: '部门主任',
            align:"center",
            dataIndex: 'auditFullname2'
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'status',
            customRender: (text, record, index) => {
              //字典值替换通用方法
              return filterDictText(this.statusDictOptions, text);
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/oa/leaveApplication/list",
          deleteBatch: "/flowable/delete",
        },
        queryParamLk: {}
      }
    },
    methods: {
      moment,
      // 自定义废弃方法覆盖混合模式
      batchAbandone: function (event,id) {
        if(!this.url.deleteBatch){
          this.$message.error("请设置url.deleteBatch属性!")
          return
        }
        var ids = "";
        var processInsId= "";
        // 支持多项废弃的操作，通用方法
        if(this.selectedRowKeys.length > 1){
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ",";
          }
        } else if (this.selectedRowKeys.length = 1 && this.selectedRowKeys[0] !== undefined) {
          ids = this.selectedRowKeys[0];
        } else {
          ids = id;
          if (id == undefined) {
            this.$message.warning('请选择一条记录！');
            return;
          } else {
            ids = id;
          }
        }
        let params = {
          id: ids,
          processDefinitionKey: 'leave'
        }
        // let formDataString = {
        //   id: ids
        // }
        // let params = {
        //   flowDataString: JSON.stringify(flowDataString),
        //   formDataString: JSON.stringify(formDataString),
        // };
        let method = 'post';
        var that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            httpAction(that.url.deleteBatch, qs.stringify(params), method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning('操作失败！');
              }
            });
          }
        });
      },
      // 时间选择器的禁用封装
      disabledStartDate (startValue) {
        const endValue = this.queryParam.maxEndTime;
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
      },
      // 时间条件覆盖
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        
        // 时间格式化
        param.minStartTime = param.minStartTime ? moment(param.minStartTime).format('YYYY-MM-DD HH:mm:ss') : null;
        param.maxEndTime = param.maxEndTime ? moment(param.maxEndTime).format('YYYY-MM-DD HH:mm:ss') : null;

        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      batchEdit() {
        if (this.selectedRowKeys.length != 0) {
          this.handleEdit(this.selectionRows[0]);
        } else {
          this.$message.warning('请选择一条记录！')
        }
      },
      batchDel() {
        if (this.selectedRowKeys.length != 0) {
          this.batchAbandone('',this.selectionRows[0].id);
        } else {
          this.$message.warning('请选择一条记录！')
        }
      },
    },
    beforeCreate(){
      // 自行定义方法，引用字典
      //初始化字典
      initDictOptions('bpm_status').then((res) => {
        if (res.success) {
          this.statusDictOptions = res.result;
        }
      });
      initDictOptions('leave_type').then((res) => {
        if (res.success) {
          this.leaveDictOptions = res.result;
        }
      });
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>