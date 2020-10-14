<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名" v-model="queryParam.btRealname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="目的地">
              <a-input placeholder="请输入目的地" v-model="queryParam.destination"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.prjName"></a-input>
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
<!--    <div class="table-operator">-->
<!--&lt;!&ndash;      <a-button type="primary" icon="download" @click="handleExportXls('出行详情')">导出</a-button>&ndash;&gt;-->
<!--&lt;!&ndash;      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">&ndash;&gt;-->
<!--&lt;!&ndash;        <a-button type="primary" icon="import">导入</a-button>&ndash;&gt;-->
<!--&lt;!&ndash;      </a-upload>&ndash;&gt;-->
<!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--        <a-menu slot="overlay">-->
<!--          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
<!--        </a-menu>-->
<!--        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
<!--      </a-dropdown>-->
<!--      <div class="ant-alert ant-alert-info">-->
<!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
<!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--      </div>-->
<!--    </div>-->

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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record"
              v-if="(new Date(record.endTime)).getTime() > (new Date()).getTime()"
        >

          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">取消</a>
        </span>

        <span slot="state"
              slot-scope="text, record">
          <!--会议开始时间大于当前时间，则会议未开始-->
              <a-tag  color="#87d068" v-if="(new Date(record.startTime)).getTime() > (new Date()).getTime()">
                未开始
              </a-tag>
          <!--会议开始时间小于当前时间，结束时间大于当前时间。则会议进行中-->
              <a-tag  color="#2db7f5" v-if="(new Date(record.startTime)).getTime() <= (new Date()).getTime() && (new Date(record.endTime)).getTime() >= (new Date()).getTime()">
                进行中
              </a-tag>
          <!--会议结束时间小于当前时间，则会议已结束-->
              <a-tag  color="#f50" v-if="(new Date(record.endTime)).getTime() < (new Date()).getTime()">
                已结束
              </a-tag>
        </span>
        <!-- 字符串超长截取省略号显示-->
        <span slot="content" slot-scope="text">
          <j-ellipsis :value="text"></j-ellipsis>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <businessTrip-modal ref="modalForm" @ok="modalFormOk"></businessTrip-modal>
  </a-card>
</template>

<script>
  import BusinessTripModal from './modules/BusinessTripModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { deleteAction } from '@/api/manage'
  import JEllipsis from '@/components/cmp/JEllipsis'

  export default {
    name: "BusinessTripList",
    mixins:[CmpListMixin],
    components: {
      BusinessTripModal,
      JEllipsis
    },
    data () {
      return {
        description: '出差管理管理页面',
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
            title: '用户名',
            align:"center",
            dataIndex: 'btUsername'
          },
          {
            title: '姓名',
            align:"center",
            dataIndex: 'btRealname'
          },
          {
            title: '目的地',
            align:"center",
            dataIndex: 'destination',
            sorter: (a, b) =>  a.destination -  b.destination,
          },
          {
            title: '联系电话',
            align:"center",
            dataIndex: 'phoneNum'
          },
          {
            title: '项目名称',
            align:"center",
            dataIndex: 'prjName'
          },
          {
            title: '出行事由',
            align:"center",
            dataIndex: 'content',
            scopedSlots: { customRender: 'content' },
          },
          {
            title: '开始日期',
            align:"center",
            dataIndex: 'startTime',
            customRender:function (text,record,index) {
              return text.split(' ')[0]+' '+(record.startFlag==0?'上午':'下午');
            },
            sorter: (a, b) =>  (new Date(a.startTime).getTime()) -  (new Date(b.startTime).getTime()),
          },
          {
            title: '结束日期',
            align:"center",
            dataIndex: 'endTime',
            customRender:function (text,record,index) {
              return text.split(' ')[0]+' '+(record.endFlag==0?'上午':'下午');
            },
            sorter: (a, b) =>  (new Date(a.endtime).getTime()) -  (new Date(b.endTime).getTime()),
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
                return (new Date(record.startTime)).getTime() > (new Date()).getTime()
              }else if (value == '进行中') {
                return (new Date(record.startTime)).getTime() <= (new Date()).getTime() && (new Date(record.endTime)).getTime() >= (new Date()).getTime()
              }else if (value == '已结束') {
                return (new Date(record.endTime)).getTime() < (new Date()).getTime()
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
          list: "/businessTrip/businessTrip/list",
          delete: "/businessTrip/businessTrip/delete",
          deleteBatch: "/businessTrip/businessTrip/deleteBatch",
          exportXlsUrl: "businessTrip/businessTrip/exportXls",
          importExcelUrl: "businessTrip/businessTrip/importExcel",
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

    },
    methods: {
      handleDelete: function (id) {
        if(!this.url.delete){
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        this.$confirm({
          title: "确认取消",
          content: "是否取消选中行程?",
          onOk: function () {
            deleteAction(that.url.delete, {id: id}).then((res) => {
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
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>