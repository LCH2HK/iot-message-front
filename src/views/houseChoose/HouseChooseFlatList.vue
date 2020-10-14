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
            <a-form-item label="楼幢外键">
              <a-input placeholder="请输入楼幢外键" v-model="queryParam.buildingId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="选房区域 外键ID">
              <a-input placeholder="请输入选房区域 外键ID" v-model="queryParam.chooseAreaId"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="幢号">
                <a-input placeholder="请输入幢号" v-model="queryParam.buildingNumber"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="房号">
                <a-input placeholder="请输入房号" v-model="queryParam.flatNumber"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="层数">
                <a-input placeholder="请输入层数" v-model="queryParam.floorNumber"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="单元号">
                <a-input placeholder="请输入单元号" v-model="queryParam.unitNumber"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="门牌号">
                <a-input placeholder="请输入门牌号" v-model="queryParam.doorNumber"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="期号">
                <a-input placeholder="请输入期号" v-model="queryParam.periodsNumber"></a-input>
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
      <a-button @click="batchHandleAdd" type="primary" icon="plus">批量添加</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('房源信息管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button class="batchOperation"> 批量操作
          <a-icon type="down"/>
        </a-button>
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

          <a-divider type="vertical"/>
          <a @click="handleDelete(record.id)">删除</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <houseChooseFlat-modal ref="modalForm" @ok="modalFormOk"></houseChooseFlat-modal>
    <batch-handle-add ref="batchHandleAddForm"></batch-handle-add>
  </a-card>
</template>

<script>
  import HouseChooseFlatModal from './modules/HouseChooseFlatModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { deleteAction } from '@/api/manage'
  import BatchHandleAdd from './modules/batchHandleAdd'

  export default {
    name: 'HouseChooseFlatList',
    mixins: [CmpListMixin],
    components: {
      BatchHandleAdd,
      HouseChooseFlatModal
    },
    data() {
      return {
        description: '房源信息管理管理页面',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          // {
          //   title: '楼幢外键',
          //   align: 'center',
          //   dataIndex: 'buildingId'
          // },
          // {
          //   title: '选房区域 外键ID',
          //   align: 'center',
          //   dataIndex: 'chooseAreaId'
          // },
          {
            title: '幢号',
            align: 'center',
            dataIndex: 'buildingNumber'
          },
          // {
          //   title: '房号',
          //   align: 'center',
          //   dataIndex: 'flatNumber'
          // },
          {
            title: '层数',
            align: 'center',
            dataIndex: 'floorNumber'
          },
          {
            title: '单元号',
            align: 'center',
            dataIndex: 'unitNumber'
          },
          {
            title: '门牌号',
            align: 'center',
            dataIndex: 'doorNumber'
          },
          {
            title: '期号',
            align: 'center',
            dataIndex: 'periodsNumber'
          },
          {
            title: '户型',
            align: 'center',
            dataIndex: 'type',
            // customRender: (text, record, index) => {
            //   //字典值替换通用方法
            //   return filterDictText(this.leaveDictOptions, text)
            // }
          },
          {
            title: '户型描述',
            align: 'center',
            dataIndex: 'description'
          },
          {
            title: '居室数',
            align: 'center',
            dataIndex: 'roomAmount'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/houseChoose/houseChooseFlat/list',
          delete: '/houseChoose/houseChooseFlat/delete',
          deleteBatch: '/houseChoose/houseChooseFlat/deleteBatch',
          exportXlsUrl: 'houseChoose/houseChooseFlat/exportXls',
          importExcelUrl: 'houseChoose/houseChooseFlat/importExcel'
        },
        queryParam: {
          buildingId: this.$route.query.buildingId
        },
        householdsInUnit: this.$route.query.householdsInUnit
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    beforeCreate() {
      // 自行定义方法，引用字典
      //初始化字典
      initDictOptions('bpm_status').then((res) => {
        if (res.success) {
          this.statusDictOptions = res.result
        }
      })
      initDictOptions('leave_type').then((res) => {
        if (res.success) {
          this.leaveDictOptions = res.result
        }
      })
    },
    methods: {
      handleDelete: function(id) {
        if (!this.url.delete) {
          this.$message.error('请设置url.delete属性!')
          return
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            deleteAction(that.url.delete, { id: id }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
              } else {
                that.$message.warning('操作失败')
              }
            })
          }
        })
      },
      modalFormOk() {
        this.searchQuery()
      },
      //  批量添加
      batchHandleAdd() {
        this.$refs.batchHandleAddForm.open(0)
      },
      //  重写重置方法
      mySearchReset() {
        this.queryParam = {
          buildingId: this.$route.query.buildingId
        }
        this.searchQuery()
      }
    },
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
</style>