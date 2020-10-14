<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称查询" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="年龄">
              <a-input placeholder="请输入名称查询" v-model="queryParam.age"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="字典下拉">
                <j-dict-select-tag v-model="queryParam.sex" placeholder="请选择用户名称" dictCode="sex"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="字典表下拉">
                <j-dict-select-tag v-model="queryParam.realname" placeholder="请选择用户" dictCode="sys_user,realname,id"/>
              </a-form-item>
            </a-col>
          </template>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
          <a-col :md="6" :sm="24">

            <template v-if="superQueryFlag">
              <a-tooltip title="已有高级查询条件生效!">
                <button :disabled="false" class="ant-btn ant-btn-primary" @click="superQuery">
                  <a-icon type="appstore" theme="twoTone" spin="true"></a-icon>
                  <span>高级查询</span>
                </button>
              </a-tooltip>
            </template>
            <a-button v-else type="primary" @click="superQuery" icon="filter">高级查询</a-button>

            <a @click="handleToggleSearch" style="margin-left: 8px">
              {{ toggleSearchStatus ? '收起' : '展开' }}
              <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
            </a>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="plus" @click="jump">创建单据</a-button>
      <a-button type="primary" icon="plus" @click="onetomany">一对多</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('demo')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>

      <div class="ant-alert ant-alert-info">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
    </div>

    <!-- table区域-begin -->
    <div>
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

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
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
    <cmpDemo-modal ref="modalForm" @ok="modalFormOk"></cmpDemo-modal>

    <!-- 一对多表单区域 -->
    <CmpDemoTabsModal ref="cmpDemoTabsModal" @ok="modalFormOk"></CmpDemoTabsModal>

    <!-- 高级查询区域 -->
    <j-super-query :fieldList="fieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
  </a-card>
</template>

<script>
import CmpDemoModal from './modules/CmpDemoModal'
import JSuperQuery from '@/components/cmp/JSuperQuery.vue'
import CmpDemoTabsModal from './modules/CmpDemoTabsModal'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { CmpListMixin } from '@/mixins/CmpListMixin'

// 高级查询modal需要参数
const superQueryFieldList = [{
  type: 'date',
  value: 'birthday',
  text: '生日'
}, {
  type: 'string',
  value: 'name',
  text: '用户名'
}, {
  type: 'int',
  value: 'age',
  text: '年龄'
}]
export default {
  name: 'CmpDemoList',
  mixins: [CmpListMixin],
  components: {
    CmpDemoModal,
    JSuperQuery,
    CmpDemoTabsModal
  },
  data () {
    return {
      description: '用户管理页面',
      // 字典数组缓存
      sexDictOptions: [],
      importExcelUrl: `${window._CONFIG.domianURL}/test/cmpDemo/importExcel`,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '关键词',
          align: 'center',
          dataIndex: 'keyWord'
        },
        {
          title: '打卡时间',
          align: 'center',
          dataIndex: 'punchTime'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          customRender: (text) => {
            // 字典值替换通用方法
            return filterDictText(this.sexDictOptions, text)
          }
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: '生日',
          align: 'center',
          dataIndex: 'birthday'
        },
        {
          title: '邮箱',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: '个人简介',
          align: 'center',
          dataIndex: 'content'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/test/cmpDemo/list',
        delete: '/test/cmpDemo/delete',
        deleteBatch: '/test/cmpDemo/deleteBatch',
        exportXlsUrl: '/test/cmpDemo/exportXls'
      },
      fieldList: superQueryFieldList
    }
  },
  methods: {
    initDictConfig () {
      console.log('--我才是真的方法!--')
      // 初始化字典 - 性别
      initDictOptions('sex').then((res) => {
        if (res.success) {
          this.sexDictOptions = res.result
        }
      })
    },
    onetomany: function () {
      this.$refs.cmpDemoTabsModal.add()
      this.$refs.cmpDemoTabsModal.title = '编辑'
    },
    // 跳转单据页面
    jump () {
      // this.$router.push({path: '/cmp/helloworld'})
    }
  }
}
</script>
<style lang="less" scoped>

  // 组件内直接引入ant组件样式覆盖
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
    height:40px;
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

  .ant-card-body .table-operator>div {
    flex: 1;
    margin-left: 14px;
  }

  .ant-card-body .table-operator .ant-alert-info {
    border: unset;
    border-radius:4px;
    background: rgba(109,98,255,0.1);
  }

  //原来的
  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
</style>
