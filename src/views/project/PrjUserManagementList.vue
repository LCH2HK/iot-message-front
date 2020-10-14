<template>
  <a-card :bordered="false">
    <a-layout>
      <!-- 快捷查询区域 -->
      <a-layout-sider theme="light" v-if="!collapsed" class="quick-sider">
        <a-collapse v-model="activeKey" :bordered="false">
          <a-collapse-panel header="快捷查询" key="1" :style="customStyle">
            <a-radio :defaultChecked="true" :checked="radioChecked" @focus="defaultFocus">默认</a-radio>
          </a-collapse-panel>
          <!--          <a-collapse-panel header="项目列表" key="2" :style="customStyle">-->
          <!--            <a-tree-->
          <!--              :treeData="treeData"-->
          <!--              @select="selectTree"-->
          <!--              :selectedKeys="selectedKeys"-->
          <!--            />-->
          <!--          </a-collapse-panel>-->
          <a-collapse-panel style="border-bottom: 0;" header="项目树" key="2">
            <div>
              <a-tree showLine @select="onSelectPrj">
                <a-tree-node
                  v-for="item in this.projectData"
                  :title="item.prjName"
                  :key="item.id + '.' + item.prjCode"
                ></a-tree-node>
              </a-tree>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible" style="margin-right: 24px">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
      <!-- 主表区域 -->
      <a-layout>
        <a-layout-content>
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">
                <span class="serachRight" v-if="toggleSearchStatus">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
                </span>

                <a-col :md="7" :sm="7">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号/姓名">
                    <a-input
                      v-model="queryParam.dimName"
                      placeholder="请输入账号/姓名"
                      @keyup.enter="searchQuery"
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="7" :sm="7">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
                    <!-- <a-input v-model="queryParam.phone"></a-input> -->
                    <j-input-lk
                      :placeholder="'请输入手机号'"
                      @enterSearch="enterSearch($event,'phone')"
                      @inputValueLk="inputValueLk($event,'phone')"
                      :clickReset="clickReset"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
                <!-- <template v-if="toggleSearchStatus">
            <a-col :md="7" :sm="7">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目类型">
                <a-input v-model="queryParam.prjType"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="7">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目区域">
                <a-input v-model="queryParam.place"></a-input>
              </a-form-item>
            </a-col>
                </template>-->

                <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
                  <span class="table-page-search-submitButtons serachLeft">
                    <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                    <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <!-- 按钮 -->
          <div class="table-operator">
            <a-button type="primary" icon="plus" @click="handleAdd">添加人员</a-button>
            <a-button type="primary" icon="delete" @click="batchDel">删除人员</a-button>
            <a-button type="primary" icon="reload" @click="getTableData()">刷新</a-button>
          </div>
          <!-- 表格 -->
          <div>
            <a-table
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'checkbox',}"
              ref="table"
              size="middle"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :bordered="true"
              @change="handleTableChange"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record,'查看')">查看</a>
              </span>
            </a-table>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <user-management-modal ref="modalForm" @refresh="loadUserData(projectId)"></user-management-modal>
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { httpAction, getAction, postAction } from '@/api/manage'
import qs from 'qs'
import UserManagementModal from './modules/userManagementModal'
import JInputLk from '@/components/cmp/JInputLk'

export default {
  name: 'UserManagementList',
  mixins: [CmpListMixin],
  components: {
    UserManagementModal,
    JInputLk
  },
  data () {
    return {
      activeKey: ['1', '2'],
      selectedProjectId: '',
      selectedPrjCode: '',
      disable: true,
      projectData: [], // 左侧项目列表数据
      // 快捷查询树模拟数据
      treeData: [],
      projectId: '',
      radioChecked: true,
      selectedKeys: [],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: '80px',
          align: 'center',
          // fixed: true,
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '账号',
          align: 'left',
          dataIndex: 'username',
          width: '100px'
        },
        {
          title: '姓名',
          align: 'left',
          dataIndex: 'realname',
          width: '100px'
        },
        {
          title: '手机号',
          align: 'left',
          dataIndex: 'phone',
          width: '100px'
        },
        {
          title: '办公号码',
          dataIndex: 'officePhone',
          align: 'left',
          width: '100px'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          align: 'left',
          width: '100px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // table模拟数据
      dataSource: [],
      url: {
        // list: '/test/testMainQcx/list',
        getPrjList: '/project/sysProject/allList',
        getDepart: '/project/sysProject/queryProject?dictCode=project_group', // 项目数据
        projectUserList: '/sys/user/projectUserList', // 项目人员列表
        addProjectUser: '/sys/user/addSysProjectWithUser', // 添加人员到指定项目
        addProjectUserBatch: '/sys/user/addSysProjectWithUserBatch', // 批量添加人员
        // deleteBatch: '/sys/user/deleteUserInProject', // 从项目中移除人员
        deleteBatch: '/sys/user/deleteUserInProjectBatch', // 批量移除
        // deleteBatch: '/flowable/delete',
        exportXlsUrl: 'test/testMainQcx/exportXls',
        importExcelUrl: 'test/testMainQcx/importExcel'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      collapsed: false,
      customStyle: {
        border: 0,
        overflow: 'hidden'
      },
      clickReset: false
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
  },
  created () {
    // this.loading = false
    this.loadLeftPrjTree()
  },
  mounted () {},
  methods: {
    searchQuery () {
      this.getTableData()
    },
    loadLeftPrjTree () {
      getAction(this.url.getPrjList).then((res) => {
        if (res.success) {
          this.projectData = res.result
          if (this.projectData.length > 0) {
            this.projectId = this.projectData[0].id
          }
          this.loadUserData()
        } else {
          console.log('get  getPrjList failed')
        }
      })
    },
    loadUserData () {
      console.log('into loadUserData')
      this.onSelectPrj(this.projectId)
    },
    onSelectPrj (selectedKeys, info) {
      if (selectedKeys.length == 0) {
        return
      }
      if (selectedKeys instanceof Array) {
        let keystr = selectedKeys[0]
        this.selectedProjectId = keystr.split('.')[0]
        this.selectedPrjCode = keystr.split('.')[1]
      } else {
        this.selectedProjectId = selectedKeys
        this.projectId = selectedKeys
        this.selectedKeys = [selectedKeys]
      }
      this.disable = false
      // 根据项目id获取项目人员列表
      this.getTableData()
      // 清除默认单选框选中状态
      this.radioChecked = false
    },
    loadData () {},
    // 获取快捷查询项目树数据
    /* loadTreeData(arg) {
              if (!this.url.list) {
                this.$message.error('请设置url.list属性!')
                return
              }
              //加载数据 若传入参数1则加载第一页的内容
              this.loading = true
              let params = null
              getAction(this.url.projectList, params).then(res => {
                if (res.success) {
                  let data = res.result
                  data.forEach((item, index) => {
                    let prjItem = {}
                    prjItem.title = item.prjName
                    prjItem.key = item.id
                    this.treeData.push(prjItem)
                  })
                }
                this.loading = false
              })
            }, */
    loadTreeData (arg) {
      if (!this.url.getDepart) {
        this.$message.error('请设置url.getDepart属性!')
        return
      }
      let params = null
      let that = this
      getAction(this.url.getDepart, params).then((res) => {
        if (res.success) {
          that.treeData = that.formate(res.result)
        } else {
          that.$message.warn(res.message)
        }
      })
    },
    // 序列化项目树
    formate (value) {
      if (value && value.length > 0) {
        let arr = []
        value.forEach((item, index) => {
          let arrItem = []
          if (item.list && item.list.length > 0) {
            item.list.forEach((listItem, listIndex) => {
              arrItem.push({
                title: listItem.prjName,
                key: listItem.id,
                prjCode: listItem.prjCode
              })
            })
          }
          arr.push({
            title: item.item,
            key: index,
            /* disabled: true, */
            children: arrItem
          })
        })
        return arr
      }
    },
    // 获取人员列表公用方法
    getTableData () {
      let key = this.selectedProjectId
      let url = this.url.projectUserList
      if (key instanceof Array) {
        this.projectId = key[0]
        this.selectedKeys = key
      } else {
        this.projectId = key
        this.selectedKeys = [key]
      }
      var params = this.getQueryParams()
      params.projectId = this.projectId
      this.loading = true
      getAction(this.url.projectUserList, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result ? res.result.records : null
          this.ipagination.total = res.result ? res.result.total : 0
          this.selectedRowKeys = []
          console.log('data2=>', this.dataSource)
        }
        this.loading = false
      })
    },
    // 切换快捷查询列表显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    },
    // 分页、排序、筛选变化时触发
    handleTableChange (pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.getTableData()
    },
    // 添加人员按钮
    handleAdd () {
      if (this.projectId === '') {
        this.$message.error('请选择项目！')
        return
      }
      this.$refs.modalForm.visible = true
      this.$refs.modalForm.projectId = this.projectId
      this.$refs.modalForm.title = '增加'
    },
    // 默认单选框被选中时触发
    defaultFocus () {
      // 选中默认框
      this.radioChecked = true
      // 清除项目列表树选中状态
      this.selectedKeys = []
      // 重置项目id
      this.projectId = ''
      // 获取所有人员列表
      this.getTableData()
    },
    // 调离人员
    batchDel () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      } else if (this.projectId === '') {
        this.$message.error('请选择项目！')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        let ids = this.selectedRowKeys.join()
        let params = {
          userIds: ids,
          projectId: this.projectId
        }
        let that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            postAction(that.url.deleteBatch, qs.stringify(params)).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.getTableData(that.projectId)
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    searchReset () {
      this.queryParam = {}
      this.clickReset = !this.clickReset
      this.loadData(1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@assets/less/modal.less';
/deep/.ant-card-body {
  padding: 16px 16px;
}
// .quick-sider {
//   overflow-y: scroll;
//   max-height: 636px;
//   border: 1px solid #d8d8d8;
//   border-radius: 4px;
//   margin-right: 20px;

//   @scrollBarSize: 5px;
//   &::-webkit-scrollbar {
//     width: @scrollBarSize;
//     height: @scrollBarSize;
//     background-color: transparent;
//   }
//   &::-webkit-scrollbar-track {
//     background-color: #f0f0f0;
//   }
//   &::-webkit-scrollbar-thumb {
//     background-color: #eee;
//     box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

//     &:hover {
//       background-color: #bbb;
//     }

//     &:active {
//       background-color: #888;
//     }
//   }
// }
// .table-operate-button {
//   display: flex;
//   margin-bottom: 15px;
//   button {
//     margin: 0 5px;
//   }
// }

// .row-content {
//   display: flex;
//   display: -webkit-flex;
//   align-items: stretch;
// }
</style>
