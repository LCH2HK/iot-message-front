<template>
 <div>
  <a-modal
    :footer="null"
    title="依托工程"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.prjName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="8">
            <a-form-item label="项目负责人">
              <j-select-user-new
                v-model="queryParam.prjLeaderUsername"
                :selectedDetails="auditUsers1"
                @callback="setAuditUser"
                class="userSelect"
              ></j-select-user-new>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
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
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="chose(record)">确认</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-modal>
 </div>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'

export default {
  name: 'relyingEngineeringModel',
  mixins: [CmpListMixin],
  components: {
    JSelectUserNew,
    JSelectDepart
  },
  props: {
      visible : false,
  },
  data() {
    return {
      description: '依托工程页面',
      form: this.$form.createForm(this),
      confirmLoading: false,
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
          title: '表单编号',
          align: 'center',
          dataIndex: 'formId'
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'prjName'
        },

        {
          title: '承办单位',
          align: 'center',
          dataIndex: 'applicantDeptId'
        },
        {
          title: '项目负责人',
          align: 'center',
          dataIndex: 'prjLeaderFullname'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 请求参数
      url: {
        list: '/testMainZjh/testMainZjh/list'
      },
      //选人组件
      model: {},
      prjLeaderUsername: '',
      prjLeaderFullname: '',
      selectUser: ['auditUsers1'],
      auditUsers1: {
        colum: 'auditUsers1',
        value: [],
        target: [{ to: 'approverOneName', from: 'username' }, { to: 'approverOneFullname', from: 'realname' }]
      }
    }
  },
  create() {
    // 初始化Form表单
    this.form.resetFields()
  },
  methods: {
    searchReset() {
      this.queryParam.prjName = ''
      this.queryParam.applicantDeptId = ''
      this.queryParam.prjLeaderUsername = ''
      this.queryParam.prjLeaderFullname = ''
      this.auditUsers1.value = []
      this.searchQuery()
    },
    handleCancel() {
      this.$emit('cancel')
    },
    chose(record) {
      this.$emit('select', record)
    }
  },
}
</script>
<style scoped>
</style>