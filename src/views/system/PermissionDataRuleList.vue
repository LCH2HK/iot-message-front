<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="drawerWidth"
    @cancel="onClose"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <div class="title">
      <div>{{title}}</div>
      <a-icon type="close" class="closeIcon" @click="onClose" />
    </div>

    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="24">
          <a-col :md="9" :sm="8">
            <a-form-item label="规则名称" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
              <j-input-lk
                placeholder="请输入规则名称"
                @enterSearch="enterSearch($event,'ruleName')"
                @inputValueLk="inputValueLk($event,'ruleName')"
                ref="ResetLk1"
              ></j-input-lk>
            </a-form-item>
          </a-col>
          <a-col :md="9" :sm="8">
            <a-form-item label="规则值" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
              <j-input-lk
                placeholder="请输入规则值"
                @enterSearch="enterSearch($event,'ruleValue')"
                @inputValueLk="inputValueLk($event,'ruleValue')"
                ref="ResetLk2"
              ></j-input-lk>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>

      <div class="table-operator">
        <a-row>
          <a-col :md="24" :sm="24">
            <a-button
              style="margin-bottom: 10px"
              @click="addPermissionRule"
              type="primary"
              icon="plus"
            >添加</a-button>
          </a-col>
        </a-row>
      </div>
      <a-spin :spinning="spining">
        <a-table
          ref="table"
          rowKey="id"
          size="middle"
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :rowClassName="getRowClassname"
          :pagination="ipagination"
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">
              <a-icon type="edit" />编辑
            </a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-spin>
    </div>

    <permission-data-rule-modal @ok="modalFormOk" ref="modalForm"></permission-data-rule-modal>
  </a-modal>
</template>
<script>
import { getPermissionRuleList, queryPermissionRule } from '@/api/api'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import PermissionDataRuleModal from './modules/PermissionDataRuleModal'
import { getAction } from '@/api/manage'
import JInputLk from '@/components/cmp/JInputLk'

const columns = [
  {
    title: '规则名称',
    dataIndex: 'ruleName',
    key: 'ruleName',
    align: 'center'
  },
  {
    title: '规则字段',
    dataIndex: 'ruleColumn',
    key: 'ruleColumn',
    align: 'center'
  },
  {
    title: '规则值',
    dataIndex: 'ruleValue',
    key: 'ruleValue',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center'
  }
]
export default {
  name: 'PermissionDataRuleList',
  mixins: [CmpListMixin],
  components: {
    PermissionDataRuleModal,
    JInputLk
  },
  data() {
    return {
      title: '',
      queryParam: {},
      drawerWidth: 800,
      columns: columns,
      permId: '',
      visible: false,
      form: this.$form.createForm(this),
      loading: false,
      url: {
        //list: "/sys/permission/getPermRuleListByPermId",
        delete: '/sys/permission/deletePermissionRule',
        list: '/sys/permission/listPermDataRule'
      },
      spining: false
    }
  },
  created() {
    this.resetScreenSize()
  },
  methods: {
    loadData() {
      let that = this,
        url = this.url.list
      this.dataSource = []
      var params = this.getQueryParams() //查询条件
      this.spining = true
      getAction(url, params).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
          this.spining = false
          this.ipagination.total = res.result.total;
        }
      })
    },
    edit(record) {
      if (record.id) {
        this.visible = true
        this.permId = record.id
      }
      this.queryParam = {}
      this.queryParam.permissionId = record.id
      this.visible = true
      this.loadData()
      this.resetScreenSize()
    },
    addPermissionRule() {
      this.$refs.modalForm.add(this.permId)
      this.$refs.modalForm.title = '新增'
    },
    searchQuery() {
      let params = this.getQueryParams(),
        url = this.url.list
      params.permissionId = this.permId
      getAction(url, params).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })
    },
    searchReset() {
      this.queryParam = {}
      this.queryParam.permissionId = this.permId
      this.loadData(1)
      this.$refs.ResetLk1.ResetValue()
      this.$refs.ResetLk2.ResetValue()
    },
    onClose() {
      this.visible = false
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 800
      }
    },
    getRowClassname(record) {
      if (record.status != 1) {
        return 'data-rule-invalid'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';

.data-rule-invalid {
  background: #f4f4f4;
  color: #bababa;
}
.table-page-search-wrapper{
  margin-top: 10px;
}
.table-page-search-submitButtons{
  margin-top: 4px;
}
</style>