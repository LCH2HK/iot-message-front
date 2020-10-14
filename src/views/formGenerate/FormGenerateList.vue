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
            <a-form-item label="数据源">
              <a-input placeholder="请输入数据源" v-model="queryParam.dbName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="数据表">
              <a-input placeholder="请输入数据表" v-model="queryParam.tableName"></a-input>
            </a-form-item>
          </a-col>
           <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="表描述">
              <a-input placeholder="请输入表描述" v-model="queryParam.tableDes"></a-input>
            </a-form-item>
          </a-col>
          </template>
           <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="表类型">
              <a-input placeholder="请输入表类型" v-model="queryParam.tableType"></a-input>
            </a-form-item>
          </a-col>
          </template>
           <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="后端包名">
              <a-input placeholder="请输入后端包名" v-model="queryParam.backPackage"></a-input>
            </a-form-item>
          </a-col>
          </template>
           <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="表实体类名">
              <a-input placeholder="请输入表实体类名" v-model="queryParam.entityName"></a-input>
            </a-form-item>
          </a-col>
          </template>
           <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="后端生成路径">
              <a-input placeholder="请输入后端生成路径" v-model="queryParam.backRoute"></a-input>
            </a-form-item>
          </a-col>
          </template>
           <template v-if="toggleSearchStatus">
          <a-col :md="5" :sm="8">
            <a-form-item label="前端包名">
              <a-input placeholder="请输入前端包名" v-model="queryParam.frontPackage"></a-input>
            </a-form-item>
          </a-col>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('代码生成器配置页面')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>
        <span>已选择</span>
        <a style="font-weight: 600">
          {{ selectedRowKeys.length }}
        </a>
        <span>项</span>
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

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

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
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
    <formGenerate-modal ref="modalForm" @ok="modalFormOk"/>

  </a-card>
</template>

<script>

  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import FormGenerateModal from './modules/FormGenerateModal'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: "FormGenerateList",
    mixins: [CmpListMixin],
    components: {
      FormGenerateModal
    },
    data () {
      return {
        description: '代码生成器配置页面管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender:function (t, r, index) {
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
              title: '表描述',
              align:"center",
              dataIndex: 'tableDes'
            },
            {
              title: '表类型',
              align:"center",
              dataIndex: 'tableType'
            },
            {
              title: '后端包名',
              align:"center",
              dataIndex: 'backPackage'
            },
            {
              title: '表实体类名',
              align:"center",
              dataIndex: 'entityName'
            },
            {
              title: '后端生成路径',
              align:"center",
              dataIndex: 'backRoute'
            },
            {
              title: '前端包名',
              align:"center",
              dataIndex: 'frontPackage'
            },
            {
              title: '前端生成路径',
              align:"center",
              dataIndex: 'frontRoute'
            },
            {
              title: '扩展字段',
              align:"center",
              dataIndex: 'expandOne'
            },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        // 请求参数
    	url: {
              list: "/formGenerate/formGenerate/list",
              delete: "/formGenerate/formGenerate/delete",
              deleteBatch: "/formGenerate/formGenerate/deleteBatch",
              exportXlsUrl: "formGenerate/formGenerate/exportXls",
              importExcelUrl: "formGenerate/formGenerate/importExcel",
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
      })
    },


    methods: {

      initDictConfig() {
      }

    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>