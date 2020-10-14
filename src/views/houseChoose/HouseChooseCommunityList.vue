<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
            <span class="serachRight" v-if="toggleSearchStatus">
               <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
               <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
            </span>
          <a-col :md="5" :sm="8">
            <a-form-item label="楼盘名称">
              <a-input placeholder="请输入楼盘名称" v-model="queryParam.communityName"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="楼幢数量">
              <a-input placeholder="请输入楼幢数量" v-model="queryParam.buildingAmount"></a-input>
            </a-form-item>
          </a-col>
        </template>
        <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="总期数">
              <a-input placeholder="请输入总期数" v-model="queryParam.stage"></a-input>
            </a-form-item>
          </a-col>
        </template>
          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('楼盘管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button class="batchOperation"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
      <div class="ant-alert ant-alert-info">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a>{{ selectedRowKeys.length }}</a>项
        <a @click="onClearSelected">清空</a>
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
        <span slot="chooserSort" slot-scope="text, record">
          <a>选房人排序</a>
        </span>
        <span slot="lzgl" slot-scope="text, record">
          <a @click="routerPush(record, '/houseChoose/HouseChooseBuildingList')">楼幢管理</a>
        </span>
        <span slot="monitor" slot-scope="text, record">
          <a>选房队列监控</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <houseChooseCommunity-modal ref="modalForm" @ok="modalFormOk"></houseChooseCommunity-modal>
  </a-card>
</template>

<script>
  import HouseChooseCommunityModal from './modules/HouseChooseCommunityModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { deleteAction } from '@/api/manage'

  export default {
    name: "HouseChooseCommunityList",
    mixins:[CmpListMixin],
    components: {
      HouseChooseCommunityModal
    },
    data () {
      return {
        description: '楼盘管理管理页面',
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
             title: '楼盘名称',
             align:"center",
             dataIndex: 'communityName'
           },
           {
             title: '楼幢数量',
             align:"center",
             dataIndex: 'buildingAmount'
           },
          {
            title: '选房人排序',
            align: 'center',
            dataIndex: 'chooserSort',
            scopedSlots: { customRender: 'chooserSort'}
          },
          {
            title: '楼幢管理',
            align: 'center',
            dataIndex: 'lzgl',
            scopedSlots: { customRender: 'lzgl'}
          },
          {
            title: '选房队列监控',
            align: 'center',
            dataIndex: 'monitor',
            scopedSlots: { customRender: 'monitor'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        queryParam: {
          chooseAreaId: this.$route.query.areaId
        },
		url: {
          list: "/houseChoose/houseChooseCommunity/list",
          delete: "/houseChoose/houseChooseCommunity/delete",
          deleteBatch: "/houseChoose/houseChooseCommunity/deleteBatch",
          exportXlsUrl: "houseChoose/houseChooseCommunity/exportXls",
          importExcelUrl: "houseChoose/houseChooseCommunity/importExcel",
       }
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
                       that.$message.warning('操作失败');
                     }
                   });
                 }
               });
             },
      // 路由跳转并传参
      routerPush (record,url) {
        console.log(record,url,'获得的record')
        this.$router.push({
          path: url,
          query: {
            communityId: record.id,
            areaId: this.$route.query.areaId
          }
        })
      },
      modalFormOk() {
        this.searchQuery()
      },
    //  重写重置方法
      mySearchReset () {
         this.queryParam = {
           chooseAreaId: this.$route.query.areaId
         };
         this.searchQuery();
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>