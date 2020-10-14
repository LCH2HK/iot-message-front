<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="11" :sm="8">
            <a-form-item label="干系人类型">
              <a-select placeholder="请选择干系人类型" v-model="queryParam.stakeholderType">
                <a-select-option value="0">干系人类型1</a-select-option>
                <a-select-option value="1">干系人类型2</a-select-option>
                <a-select-option value="2">干系人类型3</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :sm="8">
            <a-form-item label="企业/个人名称">
              <a-input placeholder="请输入企业/个人名称" v-model="queryParam.companyName"></a-input>
            </a-form-item>
          </a-col>
          <a-col>
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>
          <a-col :md="11" :sm="8">
            <a-form-item label="信息来源方式">
              <a-select placeholder="请选择信息来源方式" v-model="queryParam.companyName">
                <a-select-option value="0">项目新增</a-select-option>
                <a-select-option value="1">企业选入</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="11" :sm="8">
            <a-form-item label="企业/单位性质">
              <a-input placeholder="请输入企业/单位性质" v-model="queryParam.companyNature"></a-input>
            </a-form-item>
          </a-col>
          <!-- </template> -->
          <a-col>
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchReset" icon="reload">清空</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">启动</a-button>
      <a-button @click="batchAbandone" type="primary" icon="delete">删除</a-button>
      <a-button @click="searchReset" type="primary" icon="reload">刷新</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :bordered="false"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="batchAbandone($event, record.id, record.processInstanceId)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <stakemodule ref="modalForm" @ok="modalFormOk"></stakemodule>
  </a-card>
</template>

<script>
import stakemodule from './modules/stakemodule'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { httpAction } from '@/api/manage'
import qs from 'qs'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'stakeholder',
  mixins: [CmpListMixin],
  components: {
    stakemodule
  },
  data() {
    return {
      description: '请假申请管理页面',
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
          title: '干系人类型',
          align: 'center',
          dataIndex: 'stakeholderType'
        },
        {
          title: '企业/个人名称',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '企业/单位性质',
          align: 'center',
          dataIndex: 'companyNature'
        },
        /* {
          title: '干系人信息来源方式',
          align: 'center',
          dataIndex: 'sourceType'
        }, */
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text, record, index) => {
            //字典值替换通用方法
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
        list: '/stakeholder/stakeholder/list',  //获取列表数据接口
        delete: '/stakeholder/stakeholder/delete',
        deleteBatch: '/flowable/delete',  //删除接口
        exportXlsUrl: 'stakeholder/stakeholder/exportXls',
        importExcelUrl: 'stakeholder/stakeholder/importExcel'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    // 废弃选中的流程
    batchAbandone(event, id) {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      var ids = ''
      var processInsId = ''
      // 支持多项废弃的操作，通用方法
      if (this.selectedRowKeys.length > 1) {
        let len = this.selectedRowKeys.length
        for (var a = 0; a < len ; a++) {
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
        processDefinitionKey: 'stakeholder'
      }
      
      let method = 'post'
      var that = this
      this.$confirm({
        title: '确认废弃',
        content: '是否废弃选中数据?',
        onOk: function() {
          httpAction(that.url.deleteBatch, qs.stringify(params), method).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    }
  },
  beforeCreate(){
      // 自行定义方法，引用字典
      // 初始化字典
      initDictOptions('bpm_status').then((res) => {
        if (res.success) {
          this.statusDictOptions = res.result;
        }
      })
    }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/common.less';

/* 组件内直接引入ant组件样式覆盖 */
.ant-form-item-label {
  line-height: 40px;
}
.table-page-search-wrapper {
  .ant-form-inline {
    .ant-form-item > :global(.ant-form-item-label) {
      line-height: 40px;
    }
  }
}
.ant-input {
  height: 40px;
}
/* 下拉选框 */
.ant-select {
  /* height: 40px; */
  :global(.ant-select-selection--single) {
    height: 40px;
    :global(.ant-select-selection__rendered) {
      line-height: 40px;
    }
  }
}
.ant-btn-primary {
  height: 40px;
}
.ant-dropdown-trigger {
  height: 40px;
}
.ant-card-body .table-operator {
  display: flex;
  margin-bottom: 20px;
  vertical-align: top;
  height: 40px;
}

.ant-card-body .table-operator > div {
  flex: 1;
  margin-left: 14px;
}

.ant-card-body .table-operator .ant-alert-info {
  border: unset;
  border-radius: 4px;
  background: rgba(109, 98, 255, 0.1);
}

//时间选择
.ant-calendar-picker {
  width: 100% !important;
  :global(.ant-input) {
    height: 40px;
  }
}

</style>