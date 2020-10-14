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
            <a-form-item label="填写人">
              <a-input placeholder="请输入填写人真实姓名" v-model="queryParam.inputerFullname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="项目">
              <a-input placeholder="请输入项目" v-model="queryParam.prjUse"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="填写时间">
                <a-date-picker
                  v-model="queryParam.minStartTime"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="至">
                <a-date-picker
                  v-model="queryParam.maxEndTime"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                />
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag
                  v-model="queryParam.status"
                  placeholder="请选择状态"
                  dictCode="bpm_status"
                />
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="用品名称">
                <a-input placeholder="请输入用品名称" v-model="queryParam.itemName"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="物品编号">
                <a-input placeholder="请输入物品编号" v-model="queryParam.itemId"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
          <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
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
        @change="handleTableChange"
      >
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
    <sysOfficeItem-modal ref="modalForm" @ok="modalFormOk"></sysOfficeItem-modal>
  </a-card>
</template>

<script>
import SysOfficeItemModal from './modules/SysOfficeItemModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '@/api/manage'
import qs from 'qs'

export default {
  name: 'SysOfficeItemList',
  mixins: [CmpListMixin],
  components: {
    SysOfficeItemModal,
    JDictSelectTag
  },
  data() {
    return {
      description: '办公用品登记管理页面',
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
        {
          title: '项目',
          align: 'center',
          dataIndex: 'prjUse'
        },
        {
          title: '用品名称',
          align: 'center',
          dataIndex: 'itemName'
        },
        {
          title: '物品编号',
          align: 'center',
          dataIndex: 'itemId'
        },
        {
          title: '领用人',
          align: 'center',
          dataIndex: 'auditFullname1'
        },
        {
          title: '填写人',
          align: 'center',
          dataIndex: 'inputerFullname'
        },
        {
          title: '填写时间',
          align: 'center',
          dataIndex: 'inputerTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text, record, index) => {
            return filterDictText(this.statusDictOptions, text)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sysOfficeItem/sysOfficeItem/list',
        deleteBatch: '/flowable/delete',
        exportXlsUrl: 'sysOfficeItem/sysOfficeItem/exportXls',
        importExcelUrl: 'sysOfficeItem/sysOfficeItem/importExcel',
        getEntityName: '/sysFlow/flowConfig/getProcessDefinitionKeyByEntityName'
      },
      //动态获取流程定义Key
      entityName: `SysOfficeItem`,
      processDefinitionKey: ''
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
    initDictOptions('bpm_status').then(res => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('leave_type').then(res => {
      if (res.success) {
        this.leaveDictOptions = res.result
      }
    })
  },
  created() {
    // 获取流程定义key
    this.getEntity()
  },
  methods: {
    // 自定义废弃方法覆盖混合模式
    batchAbandone: function(event, id) {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      var ids = ''
      var processInsId = ''
      // 支持多项废弃的操作，通用方法
      if (this.selectedRowKeys.length > 1) {
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
      } else if ((this.selectedRowKeys.length = 1 && this.selectedRowKeys[0] !== undefined)) {
        ids = this.selectedRowKeys[0]
      } else {
        ids = id
        if (id == undefined) {
          this.$message.warning('请选择一条记录！')
          return
        } else {
          ids = id
        }
      }
      let params = {
        id: ids,
        processDefinitionKey: this.processDefinitionKey
      }
      let method = 'post'
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function() {
          httpAction(that.url.deleteBatch, qs.stringify(params), method).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning('操作失败')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>