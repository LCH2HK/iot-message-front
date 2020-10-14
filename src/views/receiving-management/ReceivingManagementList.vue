<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
        <span class="serachRight" v-if="toggleSearchStatus">
           <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
           <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
        </span>
          <a-col :md="5" :sm="8">
            <a-form-item label="标题">
              <a-input placeholder="请输入标题" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="编号">
              <a-input placeholder="请输入编号" v-model="queryParam.numbering"></a-input>
            </a-form-item>
          </a-col>
          <!-- <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="状态">
                <a-input placeholder="请输入状态" v-model="queryParam.status"></a-input>
              </a-form-item>
            </a-col>
          </template> -->
          <template v-if="toggleSearchStatus">
              <a-col :md="5" :sm="8">
                  <a-form-item label="状态">
                    <j-dict-select-tag  v-model="queryParam.status" placeholder="请选择状态" dictCode="bpm_status"/>
                  </a-form-item>
              </a-col>
          </template>
          <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="来文文号">
              <a-input placeholder="请输入来文文号" v-model="queryParam.incomingDocumentNumber"></a-input>
            </a-form-item>
          </a-col>
          </template>
          <!-- <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="来文时间">
                <a-input placeholder="请输入来文时间" v-model="queryParam.incomingDocumentTime"></a-input>
              </a-form-item>
            </a-col>
          </template> -->
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8" v-if="toggleSearchStatus">
                <a-form-item label="来文时间">
                  <a-date-picker
                    v-model="queryParam.minStartTime"
                    :disabledDate="disabledStartDate"
                    showTime
                    format='YYYY-MM-DD HH:mm:ss'
                    placeholder="开始时间"/>
                </a-form-item>
              </a-col>
          </template>
           <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
                  <a-form-item label="至">
                    <a-date-picker
                      v-model="queryParam.maxEndTime"
                      :disabledDate="disabledEndDate"
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="结束时间"/>
                  </a-form-item>
            </a-col>
          </template>

           <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="来文单位">
              <!-- <a-input placeholder="请输入来文单位" v-model="queryParam.incomingDocumentUnit"></a-input> -->
              <j-dict-select-tag  v-model="queryParam.incomingDocumentUnit" placeholder="请选择来文单位" dictCode="incoming_document_unit"/>
            </a-form-item>
            <!-- <a-form-item label="选择部门">
              <j-select-depart v-model="queryParam.incomingDocumentUnit" :trigger-change="true"></j-select-depart>
            </a-form-item> -->
            
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item label="选择部门">
              <j-select-depart v-decorator="['incomingDocumentUnit']" :trigger-change="true"></j-select-depart>
            </a-form-item>
          </a-col>
          <a-col :span="12">选中的部门ID(v-decorator):{{ getDepartIdValue() }}</a-col> -->
          </template>
  
          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
          <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
               <a @click="handleToggleSearch">
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
      <a-button @click="handleAdd" type="primary" icon="plus">启动</a-button>
      <a-button @click="searchReset" type="primary" icon="reload">刷新</a-button>
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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a @click="batchAbandone

          ($event,record.id,record.processInstanceId)">删除</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <receivingManagement-modal ref="modalForm" @ok="modalFormOk"></receivingManagement-modal>
  </a-card>
</template>

<script>
  import ReceivingManagementModal from './modules/ReceivingManagementModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { httpAction } from '@/api/manage'
  import qs from 'qs';

  export default {
    name: "ReceivingManagementList",
    mixins:[CmpListMixin],
    components: {
      ReceivingManagementModal,
      JDictSelectTag
    },
    data () {
      return {
        description: '收文管理管理页面',
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
              title: '标题',
              align:"center",
              dataIndex: 'title'
            },
            {
              title: '编号',
              align:"center",
              dataIndex: 'numbering'
            },
            {
              title: '来文文号',
              align:"center",
              dataIndex: 'incomingDocumentNumber'
            },
            {
              title: '来文时间',
              align:"center",
              dataIndex: 'incomingDocumentTime'
            },
            {
              title: '来文单位',
              align:"center",
              dataIndex: 'incomingDocumentUnit'
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
            // {
            //   title: '消息通知方式',
            //   align:"center",
            //   dataIndex: 'notifyMethod'
            // },
            // {
            //   title: '拟办意见',
            //   align:"center",
            //   dataIndex: 'proposedOpinion'
            // },
            // {
            //   title: '附件',
            //   align:"center",
            //   dataIndex: 'attachment'
            // },
            // {
            //   title: '文件类型',
            //   align:"center",
            //   dataIndex: 'fileType'
            // },
            // {
            //   title: '填写人',
            //   align:"center",
            //   dataIndex: 'fillInMan'
            // },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/receivingManagement/receivingManagement/list",
          deleteBatch: "/flowable/delete",
          exportXlsUrl: "receivingManagement/receivingManagement/exportXls",
          importExcelUrl: "receivingManagement/receivingManagement/importExcel",
          getEntityName: '/sysFlow/flowConfig/getProcessDefinitionKeyByEntityName'
       },
       //动态获取流程定义Key
       entityName: `ReceivingManagement`,
       processDefinitionKey: '',

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
      created() {
        // 获取流程定义key
        this.getEntity();
      },
    methods: {
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
                 processDefinitionKey: this.processDefinitionKey
              }
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
                      that.$message.warning('操作失败');
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
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>