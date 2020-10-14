<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="数据源">
              <a-select v-model="queryParam.dbName" placeholder="请选择数据源">
                <a-select-option v-for="(item,index) in dbnames" :value="item" :key="index" >{{ item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="数据表">
              <a-input placeholder="请输入数据表" v-model="queryParam.tableName"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="后端包名">
              <a-input placeholder="请输入后端包名" v-model="queryParam.entityPackage"></a-input>
            </a-form-item>
          </a-col>
          </template>
        <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="实体类名">
              <a-input placeholder="请输入实体类名" v-model="queryParam.entityName"></a-input>
            </a-form-item>
          </a-col>
        </template>
        <template v-if="toggleSearchStatus">
          <a-col :md="6" :sm="8">
            <a-form-item label="功能描述">
              <a-input placeholder="请输入功能描述" v-model="queryParam.ftlDescription"></a-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('单表带流程')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
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
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <oneFlow-modal ref="modalForm" @ok="modalFormOk"></oneFlow-modal>
  </a-card>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import OneFlowModal from './modules/OneFlowModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { deleteAction } from '@/api/manage'

  export default {
    name: "OneFlowList",
    mixins:[CmpListMixin],
    components: {
      OneFlowModal
    },
    data () {
      return {
        dbnames:[],
        description: '单表带流程管理页面',
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
             title: '数据源',
             align:"center",
             dataIndex: 'dbName'
           },
           {
             title: '数据表',
             align:"center",
             dataIndex: 'tableName'
           },
           {
             title: '后端包名',
             align:"center",
             dataIndex: 'entityPackage'
           },
           {
             title: '实体类名',
             align:"center",
             dataIndex: 'entityName'
           },
           {
             title: '功能描述',
             align:"center",
             dataIndex: 'ftlDescription'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/oneFlow/oneFlow/list",
          delete: "/oneFlow/oneFlow/delete",
          deleteBatch: "/oneFlow/oneFlow/deleteBatch",
          exportXlsUrl: "oneFlow/oneFlow/exportXls",
          importExcelUrl: "oneFlow/oneFlow/importExcel",
          getdbname:"/codegenerate/getdbname",
       },
    }
  },
  mounted(){
      this.getdbnames();
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
       handleDelete: function (id) {
               if(!this.url.delete){
                 this.$message.error("请设置url.delete属性!")
                 return
               }
               var that = this;
               this.$confirm({
                 title: "确认删除",
                 content: "是否删除选中数据?",
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
             getdbnames(){
        let data={};
        let httpurl =this.url.getdbname;
        let method = 'get';
        httpAction(httpurl,data,method).then(res=>{
          if(res.success){
            this.dbnames=res.result;
          }else{
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>