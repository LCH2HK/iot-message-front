<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="20" :sm="18">
              <a-row :gutter="24">
                <a-col :md="18" :sm="12">
                  <a-form-item label="用户账号/用户姓名">
                    <a-input
                      placeholder="请输入用户账号/用户姓名"
                      v-model="queryParam2.username"
                      @keyup.enter="searchQuery2"
                    ></a-input>
                  </a-form-item>
                </a-col>
<!--                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
<!--                    <a-col :md="9" :sm="24">-->
<!--                      <a-button-->
<!--                        type="primary"-->
<!--                        @click="searchQuery2"-->
<!--                        icon="search"-->
<!--                        style="margin-left: 21px"-->
<!--                      >查询</a-button>-->
<!--                      <a-button-->
<!--                        type="primary"-->
<!--                        @click="searchReset2"-->
<!--                        icon="reload"-->
<!--                        style="margin-left: 8px"-->
<!--                      >重置</a-button>-->
<!--                    </a-col>-->
<!--                  </span>-->
              </a-row>
            </a-col>
            <a-col :md="4" :sm="24">
              <div class="search-buttons-content">
                    <span style="float: right;overflow: hidden;padding-right: 10px;" class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchQuery2" icon="search">查询</a-button>
                    <a-button
                      type="primary"
                      @click="searchReset2"
                      icon="reload"
                      style="margin-left: 8px"
                    >重置</a-button>
                    </span>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div class="table-operator" :md="24" :sm="24">
        <a-button @click="handleAddUserRoleNew" type="primary" icon="plus">添加用户</a-button>
      </div>
      <!-- table区域-begin -->
      <div>
<!--        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择-->
<!--          <a style="font-weight: 600">{{ selectedRowKeys2.length }}</a>项-->
<!--          <a style="margin-left: 24px" @click="onClearSelected2">清空</a>-->
<!--        </div>-->
        <a-table
          style="height:500px"
          ref="table2"
          bordered
          size="middle"
          rowKey="id"
          :columns="columns2"
          :dataSource="dataSource2"
          :pagination="ipagination2"
          :loading="loading2"
          @change="handleTableChange2"
        >
            <span slot="action" slot-scope="text, record">
<!--              <a @click="handleEdit2(record)">编辑</a>-->
<!--              <a-divider type="vertical"/>-->
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete2(record.id)">
                      <a>删除</a>
              </a-popconfirm>
            </span>
        </a-table>
      </div>
      <!-- table区域-end -->
      <!-- 表单区域 -->
      <AlertContactModal ref="modalForm" @ok="modalFormOk"></AlertContactModal>
      <Select-User-Modal ref="selectUserModal" @selectFinished="selectOK"></Select-User-Modal>
      <j-select-user-new-modal
        ref="jSelectUserNewModal"
        @selectFinished="selectOK"
        :multiple="true"
      />
    </a-card>
  </a-drawer>
</template>

<script>
import SelectUserModal from '@views/system/modules/SelectUserModal'
import JSelectUserNewModal from './JSelectUserNewModal'
import { getAction, postAction, deleteAction } from '@/api/manage'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import AlertContactModal from './AlertContactModal'
import { filterObj } from '@/utils/util'
export default {
  name: 'AlertContactDrawer',
  mixins: [myCmpListMixin],
  components: {
    SelectUserModal,
    JSelectUserNewModal,
    AlertContactModal
  },
  data () {
    return {
      drawerWidth: 900,
      title: '管理联系人组',
      visible: false,
      show: true, // 根据菜单类型，动态显示隐藏表单元素
      confirmLoading: false,
      model2: {},
      queryParam2: {},
      dataSource2: [],
      currentGroupId: '',
      loading2: false,
      selectedRowKeys2: [],
      selectionRows2: [],
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
      isorter2: {
        column: 'createTime',
        order: 'desc'
      },
      filters2: {},
      columns2: [
        {
          title: '用户账号',
          align: 'left',
          dataIndex: 'username',
          width: 120
        },
        {
          title: '用户名称',
          align: 'left',
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
          align: 'left',
          width: 80
        }
      ],
      url: {
        list2: '/alert/contactGroup/getUserListByGroupId',
        delete2: '/alert/contactGroup/deleteUserById',
        deleteBatch: '/alert/contactGroup/deleteBatch',
        addUsersToGroup: '/alert/contactGroup/addUsersToGroup'
      }
    }
  },
  created () {

  },
  methods: {
    onSelectChange2 (selectedRowKeys, selectionRows) {
      this.selectedRowKeys2 = selectedRowKeys
      this.selectionRows2 = selectionRows
    },
    onClearSelected2 () {
      this.selectedRowKeys2 = []
      this.selectionRows2 = []
    },
    getQueryParams2 () {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams2) {
        sqp.superQueryParams = encodeURI(this.superQueryParams2)
      }
      var param = Object.assign(sqp, this.queryParam2, this.isorter2, this.filters2)
      param.field = this.getQueryField2()
      param.pageNo = this.ipagination2.current
      param.pageSize = this.ipagination2.pageSize
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
      console.log('into loadData2 ')
      if (!this.url.list2) {
        this.$message.error('请设置url.list2属性!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination2.current = 1
      }
      if (this.currentGroupId === '') {
        console.log('loadData2 => currentGroupId is null')
        return
      }
      const params = this.getQueryParams2() // 查询条件
      console.log('异常联系人页面', params)
      params.groupId = this.currentGroupId
      if (params.username != undefined && params.username != '') {
        params.username = '%' + params.username + '%'
      }
      console.log(params)
      this.loading2 = true
      getAction(this.url.list2, params).then(res => {
        if (res.success) {
          this.dataSource2 = res.result.records
          this.ipagination2.total = res.result.total
        }
        this.loading2 = false
      })
    },
    handleDelete2: function (id) {
      if (!this.url.delete2) {
        this.$message.error('请设置url.delete2属性!')
        return
      }
      var that = this
      console.log(this.currentGroupId, id)
      deleteAction(that.url.delete2, { groupId: this.currentGroupId, userId: id }).then(res => {
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
            }).then(res => {
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
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize () {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    close () {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    edit (record) {
      console.log('抽屉窗口：batchCode=>', record)
      this.currentGroupId = record.id
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.loadData2()
      this.visible = true
    },
    handleCancel () {
      this.close()
    },
    selectOK (data) {
      console.log(data, 'data')
      const params = {}
      params.groupId = this.currentGroupId
      params.userIdList = []
      for (var a = 0; a < data.length; a++) {
        params.userIdList.push(data[a])
      }
      console.log(params)
      postAction(this.url.addUsersToGroup, params).then(res => {
        console.log(res)
        if (res.success) {
          this.loadData2()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style  lang="less" scoped>
  @import '~@assets/less/topBtns.less';
  @import '~@views/iot/css/iotCommon.less';
  .right-button {
    display: block;
    margin-left: auto;
    margin-bottom: 10px;
    height: 36px;
  }

  .header-msg {
    font-size: 14px;
    font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
  }

  .showVertical {
    background: rgba(53, 101, 247, 1);
  }

  .unshowVertical {
    background: rgba(53, 101, 247, 0);
  }
</style>
