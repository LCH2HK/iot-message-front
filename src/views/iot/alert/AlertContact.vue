<template>
  <!--  <a-row :gutter="10">-->
  <!--    <a-col :md="24" :sm="24" style="margin-bottom: 20px">-->
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="10">
                <a-form-item label="联系人组名">
                  <a-input placeholder="请输入联系人组名" v-model="queryParam.groupName"></a-input>
                  <!--                  <j-input-lk-->
                  <!--                    placeholder="请输入联系人组名"-->
                  <!--                    @enterSearch="enterSearch($event,'groupName')"-->
                  <!--                    @inputValueLk="inputValueLk($event,'groupName')"-->
                  <!--                    :reset="clickReset"-->
                  <!--                  ></j-input-lk>-->
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="6" :sm="24">
            <div class="search-buttons-content">
              <span class="table-page-search-submitButtons serachLeft">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
              </span>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-layout>
      <!--项目树-->
      <projectTree ref="projectTree" @getSelectMessage="getSelectMessage" @defaultFocus="initTable"></projectTree>
      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!--              <a-button type="primary" icon="download" @click="handleExportXls('告警规则信息')">导出</a-button>-->
          <!--              <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
          <!--                :action="importExcelUrl" @change="handleImportExcel">-->
          <!--                <a-button type="primary" icon="import">导入</a-button>-->
          <!--              </a-upload>-->
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
            <!-- 字符串超长截取省略号显示-->
            <span slot="productId" slot-scope="text">
              <j-ellipsis :value="text" :length="25" />
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="manageGroup(record)">管理</a>
              <a-divider type="vertical" />
              <a @click="handleDelete(record.id)">删除</a>
              <!--                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
              <!--                          <a>删除</a>-->
              <!--                  </a-popconfirm>-->
            </span>
          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <AlertContactModal ref="modalForm" @ok="modalFormOk"></AlertContactModal>
    <alert-contact-drawer ref="drawerForm" @ok="modalFormOk2"></alert-contact-drawer>
  </a-card>
  <!--  </a-row>-->
</template>

<script>
import { getAction, postAction, deleteAction } from '@/api/manage'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import AlertContactModal from './modules/AlertContactModal'
import AlertContactDrawer from './modules/AlertContactDrawer'
import JEllipsis from '@/components/cmp/JEllipsis'
import projectTree from '../ProjectTree'
import { ProjectTreeMixin } from '../js/ProjectTreeMixin'
import { filterObj } from '@/utils/util'

export default {
  name: 'AlertContact',
  mixins: [myCmpListMixin, ProjectTreeMixin],
  components: {
    AlertContactModal,
    AlertContactDrawer,
    JEllipsis,
    projectTree
  },
  data () {
    return {
      // 查询条件
      queryParam: {},
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
          title: '联系人组名',
          align: 'left',
          dataIndex: 'groupName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 480,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/alert/contactGroup/listByUserPrj',
        list2: '/alert/contactGroup/getUserListByGroupId',
        delete: '/alert/contactGroup/delete',
        delete2: '/alert/contactGroup/deleteUserById',
        deleteBatch: '/alert/contactGroup/deleteBatch',
        exportXlsUrl: '/alert/contactGroup/exportXls',
        importExcelUrl: '/alert/contactGroup/importExcel',
        addUsersToGroup: '/alert/contactGroup/addUsersToGroup'
      },
      columns2: [
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'username',
          width: 120
        },
        {
          title: '用户名称',
          align: 'center',
          width: 100,
          dataIndex: 'realname'
        },
        // {
        //   title: '状态',
        //   align: 'center',
        //   width: 80,
        //   dataIndex: 'status_dictText'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 120
        }
      ],
      productInfos: [],
      // prjCodes: 'prj6,prj11',
      model1: {},
      model2: {},
      currentGroupId: '',
      queryParam1: {},
      queryParam2: {},
      dataSource1: [],
      dataSource2: [],
      loading1: false,
      loading2: false,
      selectedRowKeys1: [],
      selectedRowKeys2: [],
      selectionRows1: [],
      selectionRows2: [],
      ipagination1: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      ipagination2: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      isorter1: {
        column: 'createTime',
        order: 'desc'
      },
      isorter2: {
        column: 'createTime',
        order: 'desc'
      },
      filters1: {},
      filters2: {}
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
    // leftColMd() {
    //     return this.selectedRowKeys1.length === 0 ? 24 : 12
    // },
    // rightColMd() {
    //     return this.selectedRowKeys1.length === 0 ? 0 : 12
    // }
  },
  created () {
    this.judgeCorpOrPrjThenLoadData()
    this.loadData()
  },
  methods: {
    manageGroup (record) {
      // this.selectedRowKeys1 = [record.id]
      // this.model1 = Object.assign({}, record)
      // this.currentGroupId = record.id
      // this.onClearSelected2()
      // this.loadData2()
      // console.log('handleEdit:record=>', record)
      this.$refs.drawerForm.edit(record)
    },
    onSelectChange2 (selectedRowKeys, selectionRows) {
      this.selectedRowKeys2 = selectedRowKeys
      this.selectionRows2 = selectionRows
    },
    onClearSelected2 () {
      this.selectedRowKeys2 = []
      this.selectionRows2 = []
    },
    onClearSelected1 () {
      this.selectedRowKeys1 = []
      this.selectionRows1 = []
    },
    onSelectChange1 (selectedRowKeys, selectionRows) {
      this.selectedRowKeys1 = selectedRowKeys
      this.selectionRows1 = selectionRows
      this.model1 = Object.assign({}, selectionRows[0])
      console.log(this.model1)
      this.currentGroupId = selectedRowKeys[0]
      this.loadData2()
    },
    getQueryParams2 () {
      // 获取查询条件
      let sqp = {}
      if (this.superQueryParams2) {
        sqp.superQueryParams = encodeURI(this.superQueryParams2)
      }
      let param = Object.assign(sqp, this.queryParam2, this.isorter2, this.filters2)
      param.field = this.getQueryField2()
      param.pageNo = this.ipagination2.current
      param.pageSize = this.ipagination2.pageSize
      console.log('告警联系人，查询条件:', param)
      return filterObj(param)
    },
    getQueryField2 () {
      // TODO 字段权限控制
      var str = 'id,'
      this.columns2.forEach(function (value) {
        str += ',' + value.dataIndex
      })
      return str
    },
    handleEdit2: function (record) {
      this.$refs.modalForm2.edit(record)
      this.$refs.modalForm2.title = '编辑'
    },
    handleAdd2: function () {
      if (this.currentGroupId == '') {
        this.$message.error('请选择一个角色!')
      } else {
        this.$refs.modalForm2.roleDisabled = true
        this.$refs.modalForm2.roleId = this.currentGroupId

        this.$refs.modalForm2.add()

        this.$refs.modalForm2.title = '新增'
      }
    },
    loadReset () {
      this.selectedRowKeys1 = []
    },
    modalFormOk () {
      // 新增/修改 角色成功时，重载列表
      this.loadData()
      this.selectedRowKeys1 = []
    },
    modalFormOk2 () {
      // 新增/修改 成功时，重载列表
      this.loadData2()
    },
    loadData2 (arg) {
      if (!this.url.list2) {
        this.$message.error('请设置url.list2属性!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination2.current = 1
      }
      if (this.currentGroupId === '') {
        return
      }
      let params = this.getQueryParams2() // 查询条件
      params.groupId = this.currentGroupId
      console.log(params)
      this.loading2 = true
      getAction(this.url.list2, params).then((res) => {
        if (res.success) {
          this.dataSource2 = res.result.records
          this.ipagination2.total = res.result.total
        }
        this.loading2 = false
      })
    },
    handleDelete1: function (id) {
      this.handleDelete(id)
      this.dataSource2 = []
      this.currentGroupId = ''
    },
    handleDelete2: function (id) {
      if (!this.url.delete2) {
        this.$message.error('请设置url.delete2属性!')
        return
      }
      var that = this
      console.log(this.currentGroupId, id)
      deleteAction(that.url.delete2, { groupId: this.currentGroupId, userId: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData2()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    batchDel2: function () {
      if (!this.url.deleteBatch2) {
        this.$message.error('请设置url.deleteBatch2属性!')
        return
      }
      if (this.selectedRowKeys2.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys2.length; a++) {
          ids += this.selectedRowKeys2[a] + ','
        }
        var that = this
        console.log(this.currentDeptId)
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            deleteAction(that.url.deleteBatch2, {
              roleId: that.currentGroupId,
              userIds: ids
            }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData2()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    selectOK (data) {
      console.log(data, 'data')
      let params = {}
      params.groupId = this.currentGroupId
      params.userIdList = []
      for (var a = 0; a < data.length; a++) {
        params.userIdList.push(data[a])
      }
      console.log(params)
      postAction(this.url.addUsersToGroup, params).then((res) => {
        console.log(res)
        if (res.success) {
          this.loadData2()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    handleAddUserRole () {
      if (this.currentGroupId == '') {
        this.$message.error('请选择一个角色!')
      } else {
        this.$refs.selectUserModal.visible = true
      }
    },
    handleAddUserRoleNew () {
      if (this.currentGroupId == '') {
        this.$message.error('请选择一个角色!')
      } else {
        this.$refs.jSelectUserNewModal.visible = true
      }
    },
    handleOpen (record) {
      this.selectedRowKeys1 = [record.id]
      this.model1 = Object.assign({}, record)
      this.currentGroupId = record.id
      this.onClearSelected2()
      this.loadData2()
    },

    handleEdit: function (record) {
      if (this.currentGroupId == '') {
        this.$message.error('请选择一个角色!')
      } else {
        this.$refs.modalForm.edit(record)
        this.$refs.modalForm.title = '编辑'
      }
    },
    searchQuery2 () {
      this.loadData2(1)
    },
    searchReset2 () {
      this.queryParam2 = {}
      this.loadData2(1)
    },
    handleTableChange2 (pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter2.column = sorter.field
        this.isorter2.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination2 = pagination
      this.loadData2()
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
</style>
