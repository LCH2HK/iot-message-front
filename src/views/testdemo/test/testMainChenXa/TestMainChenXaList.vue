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
            <a-form-item label="资产编号">
              <a-input v-model="queryParam.assetsId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="资产名称">
              <a-input v-model="queryParam.assetsName"></a-input>
            </a-form-item>
          </a-col>
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

    <a-layout>
              <a-layout-sider width="250px"
                              theme="light"
                              collapsedWidth="0"
                              :trigger="null"
                              collapsible
                              v-model="collapsed"
                              v-if="false">
                <!--部门树查询组件-->
                <!--<j-left-tree-->
                  <!--@searchByTree="searchByTree"-->
                  <!--:header="JLeftTree.header"-->
                  <!--:searchKey="JLeftTree.searchKey"-->
                  <!--:tableName="JLeftTree.tableName"-->
                  <!--:parentId="JLeftTree.parentId"-->
                  <!--:optionName="JLeftTree.optionName"-->
                  <!--:permisson="JLeftTree.permisson"-->
                  <!--desc-->
                  <!--:sortCondition="JLeftTree.sortCondition"-->
                <!--&gt;</j-left-tree>-->

                <!--数据字典查询-->
                <j-left-tree @searchByTree="searchByTree"
                             header=""
                             dictCode=""
                             ></j-left-tree>
              </a-layout-sider>
              <!-- 切换按钮 -->
              <div class="switch-visible" @click="switchVisible" v-if="false">
                <span :class="!collapsed ? 'show' : 'unshow'"></span>
              </div>
        <a-layout-content>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="batchEdit" type="primary" icon="edit" :disabled="this.selectedRowKeys.length == 0">编辑</a-button>
      <a-button @click="batchDel1" type="primary" icon="delete" :disabled="this.selectedRowKeys.length == 0">删除</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('陈雪俺表单学习1')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button class="batchOperation"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
      <div class="ant-alert ant-alert-info">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a>{{ selectedRowKeys.length }}</a>项
        <a @click="onClearSelected">清空</a>
      </div> -->
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
          <!-- <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>-->
          <a @click="handleEdit(record,'查看')">查看</a>
        </span>

      </a-table>
    </div>
    </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <testMainChenXa-modal ref="modalForm" @ok="modalFormOk"></testMainChenXa-modal>
  </a-card>
</template>

<script>
  import TestMainChenXaModal from './modules/TestMainChenXaModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { deleteAction } from '@/api/manage'
  import JLeftTree from '@/components/cmp/JLeftTree'

  export default {
    name: "TestMainChenXaList",
    mixins:[CmpListMixin],
    components: {
      TestMainChenXaModal,
      JLeftTree
    },
    data () {
      return {
        description: '陈雪俺表单学习1管理页面',
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
             title: '资产编号',
             align:"center",
             dataIndex: 'assetsId'
           },
           {
             title: '资产名称',
             align:"center",
             dataIndex: 'assetsName'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/testMainChenXa/testMainChenXa/list",
          delete: "/testMainChenXa/testMainChenXa/delete",
          deleteBatch: "/testMainChenXa/testMainChenXa/deleteBatch",
          exportXlsUrl: "testMainChenXa/testMainChenXa/exportXls",
          importExcelUrl: "testMainChenXa/testMainChenXa/importExcel",
       },
       collapsed: false,
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
       batchAbandone: function (id) {
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
                       that.$message.warning('操作失败');
                     }
                   });
                 }
               });
             },
              // 根据部门查询
                     searchByTree(key) {
                       if (key) {
                         //搜索的字段prjType
                         this.queryParam.prjType = key
                         this.searchQuery()
                         this.resertTable()
                       } else {
                         this.queryParam.prjType = ''
                         this.searchQuery()
                         this.resertTable()
                       }
                     },
                     // 重置表格状态
                     resertTable() {
                       this.selectedRowKeys = []
                     },
                     //控制查询面板的显隐
                     switchVisible() {
                       this.collapsed = !this.collapsed
                     }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>