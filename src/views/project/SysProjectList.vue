<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="项目编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <j-input-lk
                    :placeholder="'请输入项目编号'"
                    @enterSearch="enterSearch($event,'prjId')"
                    @inputValueLk="inputValueLk($event,'prjId')"
                    ref="prjId"
                  ></j-input-lk>
                  <!-- <a-input placeholder="请输入项目编号" v-model="queryParam.prjId"></a-input> -->
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <j-input-lk
                    :placeholder="'请输入项目名称'"
                    @enterSearch="enterSearch($event,'prjName')"
                    @inputValueLk="inputValueLk($event,'prjName')"
                    ref="prjName"
                  ></j-input-lk>
                  <!-- <a-input placeholder="请输入项目名称" v-model="queryParam.prjName"></a-input> -->
                </a-form-item>
              </a-col>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <j-input-lk
                      :placeholder="'请输入项目经理'"
                      @enterSearch="enterSearch($event,'projectManager')"
                      @inputValueLk="inputValueLk($event,'projectManager')"
                      ref="projectManager"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
              </template>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="项目类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <j-dict-select-tag
                      v-model="queryParam.type"
                      placeholder="请选择类型"
                      dictCode="project_types"
                    />
                  </a-form-item>
                </a-col>
              </template>
              <template v-if="toggleSearchStatus">
                <a-col :md="8" :sm="8">
                  <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <j-input-lk
                      :placeholder="'请输入状态'"
                      @enterSearch="enterSearch($event,'status')"
                      @inputValueLk="inputValueLk($event,'status')"
                      ref="status"
                    ></j-input-lk>
                    <!-- <a-input placeholder="请输入状态" v-model="queryParam.status"></a-input> -->
                  </a-form-item>
                </a-col>
              </template>
              <a-col :md="2" :sm="8">
                <span class="table-page-search-submitButtons serachLeft">
                  <a @click="handleToggleSearch">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="6" :sm="6">
            <div class="search-buttons-content">
              <span class="table-page-search-submitButtons serachLeft">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              </span>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <span class="right-button">
        <a-upload
          name="file"
          :showUploadList="false"
          :multiple="false"
          :action="importExcelUrl"
          @change="handleImportExcel"
        >
          <a-button class="default-button" icon="download" @click="handleExportXls('企业多项目')">导出</a-button>
        </a-upload>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel">
              <a-icon type="delete" />删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </span>
    </div>
    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="border: none;margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <a-table
        bordered
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <!--        class="titleCenter"-->
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysProject-modal ref="modalForm" @ok="modalFormOk"></sysProject-modal>
  </a-card>
</template>

<script>
import SysProjectModal from './modules/SysProjectModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { deleteAction } from '@/api/manage'
import JInputLk from '@/components/cmp/JInputLk'
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'SysProjectList',
  mixins: [CmpListMixin],
  components: {
    SysProjectModal,
    JInputLk,
    JDictSelectTag
  },
  data () {
    return {
      description: '企业多项目管理页面',

      projectStatus: '', // 项目的状态
      projectType: '', // 项目的类型
      projectArea: '', // 项目的区域
      projectGroup: '', // 项目的分组
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '项目编号',
          align: 'left',
          dataIndex: 'prjId'
        },
        {
          title: '项目名称',
          align: 'left',
          dataIndex: 'prjName'
        },
        {
          title: '项目经理',
          align: 'left',
          dataIndex: 'projectManager'
        },
        {
          title: '项目类型',
          align: 'left',
          dataIndex: 'type',
          customRender: (text, record, index) => {
            // 字典值替换通用方法
            return filterDictText(this.projectType, text)
          }
        },
        {
          title: '项目区域',
          align: 'left',
          dataIndex: 'place',
          customRender: (text, record, index) => {
            // 字典值替换通用方法
            return filterDictText(this.projectArea, text)
          }
        },
        {
          title: '项目分组',
          align: 'left',
          dataIndex: 'projectGroup',
          customRender: (text, record, index) => {
            // 字典值替换通用方法
            return filterDictText(this.projectGroup, text)
          }
        },
        {
          title: '历史数据源',
          align: 'left',
          dataIndex: 'historyDb'
        },
        {
          title: '实时数据源',
          align: 'left',
          dataIndex: 'realDb'
        },
        {
          title: '数据服务数据源',
          align: 'left',
          dataIndex: 'dataServiceDb'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/project/sysProject/list',
        delete: '/project/sysProject/delete',
        deleteBatch: '/project/sysProject/deleteBatch',
        exportXlsUrl: 'project/sysProject/exportXls',
        importExcelUrl: 'project/sysProject/importExcel'
      },
      // 输入框布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
  },
  beforeCreate () {
    // 自行定义方法，引用字典
    // 初始化字典
    initDictOptions('project_types').then((res) => {
      if (res.success) {
        this.projectType = res.result
      }
    })
    initDictOptions('project_status').then((res) => {
      if (res.success) {
        this.projectStatus = res.result
      }
    })
    initDictOptions('project_area').then((res) => {
      if (res.success) {
        this.projectArea = res.result
      }
    })
    initDictOptions('project_group').then((res) => {
      if (res.success) {
        this.projectGroup = res.result
      }
    })
  },
  methods: {
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    searchReset () {
      for (const ref1 in this.queryParam) {
        if (this.$refs[ref1]) {
          this.$refs[ref1].ResetValue()
        }
      }
      this.queryParam = {}
      this.loadData(1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@views/iot/css/iotCommon.less';
/deep/.ant-card-body {
  padding: 16px 16px;
}
.ant-form-item-label {
  line-height: 36px;
}

.ant-select {
  /* height: 40px; */
  :global(.ant-select-selection--single) {
    height: 36px;
    :global(.ant-select-selection__rendered) {
      line-height: 36px;
    }
  }
}
/*.table-page-search-wrapper .ant-form-inline .ant-form-item > .ant-form-item-label{
    line-height: 40px !important;
  }*/
.anty-form-btn {
  line-height: 36px;
}
.table-page-search-wrapper .ant-form-inline .ant-form-item > :global(.ant-form-item-label) {
  line-height: 36px;
}

.ant-input {
  height: 36px;
}

.ant-btn-primary {
  height: 36px;
}
.ant-dropdown-trigger {
  height: 36px;
}
.ant-card-body .table-operator {
  display: flex;
  margin-bottom: 20px;
  vertical-align: top;
  height: 36px;
}
</style>
