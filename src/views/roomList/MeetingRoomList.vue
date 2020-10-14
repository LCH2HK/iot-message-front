<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="会议室名">
              <a-input placeholder="请输入会议室名" v-model="queryParam.meetingRoom"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="会议日期">
              <j-date placeholder="请选择会议日期" v-model="queryParam.meetingDate" dateFormat="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8" >
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
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
      <div class="ant-alert ant-alert-info" style="margin-left: 0px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"

        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="state"
              slot-scope="text, record">
          <!--会议开始时间大于当前时间，则会议未开始-->
              <a-tag  color="#87d068" v-if="(new Date(record.meetingDate + ' ' + record.meetingStartTime)).getTime() > (new Date()).getTime()">
                未开始
              </a-tag>
          <!--会议开始时间小于当前时间，结束时间大于当前时间。则会议进行中-->
              <a-tag  color="#2db7f5" v-if="(new Date(record.meetingDate + ' ' + record.meetingStartTime)).getTime() <= (new Date()).getTime() && (new Date(record.meetingDate + ' ' + record.meetingEndTime)).getTime() >= (new Date()).getTime()">
                进行中
              </a-tag>
          <!--会议结束时间小于当前时间，则会议已结束-->
              <a-tag  color="#f50" v-if="(new Date(record.meetingDate + ' ' + record.meetingEndTime)).getTime() < (new Date()).getTime()">
                已结束
              </a-tag>
        </span>

        <span slot="action"
              slot-scope="text, record"
              v-if="(new Date(record.meetingDate + ' ' + record.meetingEndTime)).getTime() > (new Date()).getTime()">
          <a @click="handleEdit(record)">修改</a>

          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">取消</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <meetingRoom-modal ref="modalForm" @ok="modalFormOk"></meetingRoom-modal>
  </a-card>
</template>

<script>
  import MeetingRoomModal from './modules/MeetingRoomModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { deleteAction } from '@/api/manage'
  import JDate from '@/components/cmp/JDate'
  import { mapGetters } from 'vuex'

  export default {
    name: "MeetingRoomList",
    mixins:[CmpListMixin],
    components: {
      MeetingRoomModal,
      JDate,
    },

    data () {
      return {
        description: '',
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
            title: '会议室名',
            align:"center",
            dataIndex: 'meetingRoom'
          },
          {
            title: '会议主题',
            align:"center",
            dataIndex: 'subject'
          },
          {
            title: '预订人',
            align:"center",
            dataIndex: 'contact'
          },
          {
            title: '联系人电话',
            align:"center",
            dataIndex: 'contactPhone'
          },
          {
            title: '会议日期',
            align:"center",
            dataIndex: 'meetingDate',
            // sorter:"true"
            sorter: (a, b) =>  (new Date(a.meetingDate).getTime()) -  (new Date(b.meetingDate).getTime()),
          },
          {
            title: '开始时间',
            align:"center",
            dataIndex: 'meetingStartTime',
          },
          {
            title: '结束时间',
            align:"center",
            dataIndex: 'meetingEndTime',
          },
          {
            title: '状态',
            align:"center",
            dataIndex: 'state',
            scopedSlots: { customRender: 'state' },
            filters: [
              { text: '未开始', value: '未开始' },
              { text: '进行中', value: '进行中' },
              { text: '已结束', value: '已结束' },
            ],
            onFilter : (value, record) => {
              if (value == '未开始') {
                return (new Date(record.meetingDate + ' ' + record.meetingStartTime)).getTime() > (new Date()).getTime()
              }else if (value == '进行中') {
                return (new Date(record.meetingDate + ' ' + record.meetingStartTime)).getTime() <= (new Date()).getTime() && (new Date(record.meetingDate + ' ' + record.meetingEndTime)).getTime() >= (new Date()).getTime()
              }else if (value == '已结束') {
                return (new Date(record.meetingDate + ' ' + record.meetingEndTime)).getTime() < (new Date()).getTime()
              }
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
          list: "/meetingRoom/list",
          delete: "/meetingRoom/cancel",
          deleteBatch: "/meetingRoom/cancelBatch",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
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
    },
    methods: {
      ...mapGetters(["userId"]),
      handleDelete: function(id) {
        if (!this.url.delete) {
          this.$message.error("请设置url.delete属性!")
          return
        }
        const that = this;
        this.$confirm({
          title: "确认取消",
          content: "是否取消预约?",
          onOk: function() {
            deleteAction(that.url.delete, { id: id }).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
              } else {
                that.$message.warning(res.message);
              }
            });
          }
        });
      },
    },
    watch : {
      $route(to,from){
        console.log(to.path,'我的预约跳转');
        this.searchQuery();
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>