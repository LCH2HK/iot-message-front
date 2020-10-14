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
      <!-- table区域-end -->
      <div class="table-operator">
        <a-button @click="handleAddUserRole" type="primary" icon="plus" :disabled="disable2">添加已有用户</a-button>
      </div>
      <div>
        <a-table
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
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete2(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </div>
      <!-- 表单区域 -->
      <Select-User-Modal ref="selectUserModal" @selectFinished="selectOK" :projectId="prjId"></Select-User-Modal>
    </a-card>
  </a-drawer>
</template>

<script>
import SelectUserModal from '@views/system/modules/SelectUserModal'
import { getAction, postAction, deleteAction } from '@/api/manage'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { filterObj } from '@/utils/util'
export default {
  name: 'prjRoleUserDrawer',
  mixins: [myCmpListMixin],
  props: {
    prjId: {
      type: String,
      default () {
        return {}
      }
    }
  },
  components: {
    SelectUserModal
  },
  data () {
    return {
      drawerWidth: 900,
      title: '关联用户',
      visible: false,
      show: true, // 根据菜单类型，动态显示隐藏表单元素
      confirmLoading: false,
      currentRoleId: '',
      disable2: false,
      loading2: false,
      dataSource2: [],
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
        {
          title: '状态',
          align: 'left',
          width: 80,
          dataIndex: 'status_dictText'
        },

        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'left',
          width: 120
        }
      ],
      url: {
        // 企业项目列表
        list2: '/sys/user/userRoleList',
        deleteBatch: '/sys/role/deleteBatch',
        delete: '/sys/role/delete',
        delete2: '/sys/user/deleteUserRole',
        queryById: '/sys/role/list?projectId=',
        addUserRole: '/sys/user/addSysUserRole',
        getDepart: '/project/sysProject/queryProject?dictCode=project_group' // 项目数据
      }
    }
  },
  created () {},
  methods: {
    edit (record) {
      console.log('抽屉窗口：batchCode=>', record)
      this.currentRoleId = record.id
      //   console.log('currentRoleId=>', this.currentRoleId)
      //   this.currentRoleId = record.id
      console.log('prjId=>', this.prjId)
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.visible = true
      this.loadData2()
      //   this.visible = true
      //   this.$refs.selectUserModal.loadData(1)
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
    handleAddUserRole () {
      if (this.currentRoleId == '') {
        this.$message.error('请选择一个角色!')
      } else {
        this.$refs.selectUserModal.loadData(1)
        this.$refs.selectUserModal.visible = true
      }
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

    getQueryParams2 () {
      // 获取查询条件
      let sqp = {}
      if (this.superQueryParams2) {
        sqp.superQueryParams = encodeURI(this.superQueryParams2)
      }
      var param = Object.assign(sqp, this.queryParam2, this.isorter2, this.filters2)
      param.pageNo = this.ipagination2.current
      param.pageSize = this.ipagination2.pageSize
      return filterObj(param)
    },

    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
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
      if (this.currentRoleId === '') {
        return
      }
      let params = this.getQueryParams2() // 查询条件
      params.roleId = this.currentRoleId
      this.loading2 = true
      getAction(this.url.list2, params).then((res) => {
        if (res.success) {
          this.dataSource2 = res.result.records
          this.ipagination2.total = res.result.total
        }
        this.loading2 = false
      })
    },
    selectOK (data) {
      let params = {}
      params.roleId = this.currentRoleId
      params.prjCode = this.prjId
      params.userIdList = []
      for (var a = 0; a < data.length; a++) {
        params.userIdList.push(data[a])
      }
      console.log(params)
      postAction(this.url.addUserRole, params).then((res) => {
        if (res.success) {
          this.loadData2()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleDelete2: function (id) {
      if (!this.url.delete2) {
        this.$message.error('请设置url.delete2属性!')
        return
      }
      var that = this
      deleteAction(that.url.delete2, { roleId: this.currentRoleId, userId: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData2()
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style  lang="less" scoped>
@import '~@assets/less/topBtns.less';
@import '~@views/iot/css/iotCommon.less';
/deep/.ant-drawer-body {
  padding: 0;
}
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
