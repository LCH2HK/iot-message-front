<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="10" :sm="12">
            <a-form-item label="账号/姓名" style="margin-left:8px">
              <a-input placeholder="请输入账号/姓名查询" v-model="queryParam.dimName"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
                style="margin-left: 18px"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" :md="24" :sm="24">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">用户录入</a-button>-->
      <!-- <a-button @click="handleEdit" type="primary" icon="edit">用户编辑</a-button> -->
      <a-button @click="handleAddUserDepartNew" type="primary" icon="plus">添加已有用户</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />删除关系
          </a-menu-item>
          <a-menu-item key="2" @click="batchChangeDepart">
            <a-icon type="edit" />修改部门
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">
          {{
          selectedRowKeys.length }}
        </a>项
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
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定要删除关系吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除关系</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>
    <Select-User-Modal ref="selectUserModal" @selectFinished="selectOK"></Select-User-Modal>
    <select-depart-modal
      ref="selectDepartModal"
      @selectDepartFinished="selectDepartOk"
      @selectDepartConfirmed="selectDepartConfirmedOk"
    />
    <j-select-user-new-modal ref="jSelectUserNewModal" @selectFinished="selectOK" :multiple="true" />
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { getAction, postAction, deleteAction } from '@/api/manage'
import SelectUserModal from './SelectUserModal'
import SelectDepartModal from './SelectDepartModal'
import JSelectUserNewModal from './JSelectUserNewModal'
import UserModal from './UserModal'
import qs from 'qs'

export default {
  name: 'DeptUserInfo',
  mixins: [CmpListMixin],
  components: {
    SelectUserModal,
    UserModal,
    SelectDepartModal,
    JSelectUserNewModal
  },
  data() {
    return {
      description: '用户信息',
      currentDeptId: '',
      // 表头
      columns: [
        {
          title: '用户账号',
          align: 'left',
          dataIndex: 'username'
        },
        {
          title: '用户名称',
          align: 'left',
          dataIndex: 'realname'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'left',
          width: 170
        }
      ],
      url: {
        list: '/sys/user/departUserList',
        edit: '/sys/user/editSysDepartWithUser',
        delete: '/sys/user/deleteUserInDepart',
        deleteBatch: '/sys/user/deleteUserInDepartBatch',
        changeDepart: '/sys/user/editDepartBatchForUserList'
      },
      selectDepartConfirmed: {}
    }
  },
  created() {},

  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      if (this.currentDeptId === '') return
      var params = this.getQueryParams() //查询条件
      params.departId = this.currentDeptId
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
      })
    },
    batchDel: function() {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            deleteAction(that.url.deleteBatch, { depId: that.currentDeptId, userIds: ids }).then(res => {
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
    handleDelete: function(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      deleteAction(that.url.delete, { depId: this.currentDeptId, userId: id }).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    batchChangeDepart() {
      this.$refs.selectDepartModal.visible = true
      this.$refs.selectDepartModal.title = '修改部门'
    },
    open(record) {
      this.currentDeptId = record.id
      this.loadData(1)
    },
    clearList() {
      this.currentDeptId = ''
      this.dataSource = []
    },
    hasSelectDept() {
      if (this.currentDeptId == null) {
        this.$message.error('请选择一个部门!')
        return false
      }
      return true
    },
    handleAddUserDepartNew() {
      if (this.currentDeptId == '') {
        this.$message.error('请选择一个部门!')
      } else {
        this.$refs.selectDepartModal.visible = true
        this.$refs.selectDepartModal.title = '所属单位确认'
        this.$refs.selectDepartModal.edit(this.currentDeptId)
        this.$refs.selectDepartModal.isDepartUserAdd = true
      }
    },
    handleAdd: function() {
      if (this.currentDeptId == '') {
        this.$message.error('请选择一个部门!')
      } else {
        this.$refs.modalForm.departDisabled = true
        this.$refs.modalForm.deptId = this.currentDeptId
        this.$refs.modalForm.add()
        this.$refs.modalForm.title = '新增'
      }
    },
    selectOK(data) {
      let params = {}
      params = Object.assign({}, this.selectDepartConfirmed)
      params.userIds = data.join(',')
      postAction(this.url.changeDepart, qs.stringify(params)).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    selectDepartOk(data) {
      let params = {}
      params = Object.assign({}, data)
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        let ids = this.selectedRowKeys.join(',')
        params.userIds = ids
      }
      let that = this
      postAction(this.url.changeDepart, qs.stringify(params)).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        }
      })
    },
    selectDepartConfirmedOk(data) {
      this.selectDepartConfirmed = data
      this.$refs.jSelectUserNewModal.visible = true
    }
  }
}
</script>
<style scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.ant-card {
  margin-left: -30px;
  margin-right: -30px;
}

.table-page-search-wrapper {
  margin-top: -16px;
  margin-bottom: 16px;
}
</style>