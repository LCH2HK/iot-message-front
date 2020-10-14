<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-sider
        width="180px"
        theme="light"
        collapsedWidth="0"
        :trigger="null"
        collapsible
        v-model="collapsed"
        style="margin-right: 8px"
      >
        <!--部门树查询组件-->
        <div style="width: 100%; height: 100%; overflow: auto;">
          <div style="width: auto">
            <a-collapse
              v-model="activeKey"
              style="height: inherit;border-bottom: 1px solid #d9d9d9"
            >
              <a-collapse-panel header="快捷查询" key="1">
                <a-radio :checked="this.radioChecked" @focus="resertTable">默认</a-radio>
              </a-collapse-panel>
              <a-collapse-panel style="border-bottom: 0;" header="项目树" key="2">
                <a-tree showLine @select="onSelect">
                  <a-tree-node
                    v-for="item in this.projectData"
                    :title="item.prjName"
                    :key="item.id + '.' + item.prjCode"
                  ></a-tree-node>
                </a-tree>
                <!--                <a-tree :treeData="treeData" @select="onSelect" :selectedKeys="selectedProKeys" />-->
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible" style="margin-right: 24px">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
      <a-layout-content>
        <!-- table区域-begin -->
            <div class="table-operator">
              <a-button @click="handleAdd" type="primary" icon="plus" :disabled="disable">新增</a-button>
            </div>
            <div>
              <a-table
                ref="table"
                rowKey="id"
                size="middle"
                :columns="columns"
                bordered
                :dataSource="projectRoleData"
                :loading="loading"
                @change="handleTableChange"
                :pagination="ipagination"
              >
                <span slot="action" slot-scope="text, record">
                  <a @click="handleRoleUser(record)">关联用户</a>
                                    <a-divider type="vertical" />
                  <a @click="handlePerssion(record.id)">授权</a>
                  <a-divider type="vertical" />
                  <a @click="handleEdit(record)">编辑</a>
                  <a-divider type="vertical" />
                 <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                          <a>删除</a>
                        </a-popconfirm>

                </span>
              </a-table>
            </div>
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <project-role-modal
      ref="modalForm"
      @ok="modalFormOk"
      @refresh="loadData"
      :projectId="this.selectedProjectId"
    ></project-role-modal>
    <user-role-modal ref="modalUserRole" :projectId="selectedProjectId" :prjCode="selectedPrjCode"></user-role-modal>
     <prjRoleUserDrawer ref="drawerForm" @ok="modalFormOk2"  :prjId="selectedProjectId"></prjRoleUserDrawer>
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { IotPrjTreeMixin } from '@/views/iot/js/IotPrjTreeMixin'
import prjRoleUserDrawer from './modules/prjRoleUserDrawer'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import projectRoleModal from './modules/projectRoleModal'
import UserRoleModal from '@/views/system/modules/UserRoleModal'
import { filterObj } from '@/utils/util'
import { deleteAction, postAction, getAction } from '@/api/manage'
import { searchByKeywords } from '../../api/api'

export default {
  name: 'ProjectMenu',
  mixins: [CmpListMixin, IotPrjTreeMixin],
  components: {
    projectRoleModal,
    UserRoleModal,
    prjRoleUserDrawer
  },
  data () {
    return {
      queryParam: {},
      projectRoleData: [],
      projectData: [],
      // 根据角色Id查用户
      currentRoleId: '',
      selectedProKeys: [], // 快捷查询中选中项目列表状态
      treeData: [], // 快捷查询项目列表数据
      // disable2: true,
      // loading2: false,
      selectedProjectId: '',
      selectedPrjCode: '',
      selectedRowKeys: [],
      selectedObject: {},
      radioChecked: true,
      prjType: [],
      activeKey: ['1', '2'],
      startValue: null,
      endValue: null,
      endOpen: false,
      //       projectData:[{key:1,title:'项目A',children:[{key:'c1',title:'子项目'}]},{key:2,title:'项目B'}],
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
          title: '角色名',
          align: 'left',
          dataIndex: 'roleName',
          width: 240
        },
        {
          title: '角色编号',
          align: 'left',
          dataIndex: 'roleCode',
          width: 240
        },
        {
          title: '描述',
          align: 'left',
          dataIndex: 'description'
        },
        {
          title: '操作',
          align: 'left',
          width: 220,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        // 企业项目列表
        list: '/project/sysProject/allList',
        list2: '/sys/user/userRoleList',
        deleteBatch: '/sys/role/deleteBatch',
        delete: '/sys/role/delete',
        delete2: '/sys/user/deleteUserRole',
        queryById: '/sys/role/list?projectId=',
        addUserRole: '/sys/user/addSysUserRole',
        getDepart: '/project/sysProject/queryProject?dictCode=project_group' // 项目数据
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      disable: true,
      titleType: '', // 标题的研究领域
      collapsed: false
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
    initDictOptions('bpm_status').then((res) => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
  },
  created () {
    this.loading = false
    getAction(this.url.list).then((res) => {
      if (res.success) {
        this.projectData = res.result
      } else {
        console.log('get project list failed')
      }
    })
  },
  mounted () {
    this.loadTreeData()
    if (this.isInProject) {
      console.log(this.isInProject)
      let p = new Array()
      p[0] = this.isInProject.id + '.' + this.isInProject.prjCode
      this.onSelect(p, '')
    }
  },
  methods: {
    // 获取快捷查询项目树数据
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
    loadData () {
      this.projectRoleData = []
      var params = this.getQueryParams() // 查询条件
      this.loading = true
      if (this.selectedProjectId != '') {
        getAction(this.url.queryById + this.selectedProjectId, params).then((res) => {
          if (res.success) {
            this.projectRoleData = res.result.records
            this.ipagination.total = res.result.total
          }
        })
      }
      this.loading = false
    },
    onSelect (selectedKeys, info) {
      console.log(selectedKeys)
      if (selectedKeys.length == 0) {
        return
      }
      let keystr = selectedKeys[0]
      this.selectedProjectId = keystr.split('.')[0]
      this.selectedPrjCode = keystr.split('.')[1]
      this.disable = false
      this.radioChecked = false
      getAction(this.url.queryById + this.selectedProjectId).then((res) => {
        if (res.success) {
          this.projectRoleData = res.result.records
          this.ipagination.total = res.result.total
          this.ipagination.current = 1
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    batchDelAndRefresh () {
      this.batchDel()
      getAction(this.url.queryById + selectedKeys).then((res) => {
        if (res.success) {
          this.projectRoleData = res.result.records
        } else {
          console.log('get projectMenu list failed')
        }
      })
    },

    // 选择行
    onSelectChange (selectedRowKeys, index) {
      console.log('selectedRowKeys', selectedRowKeys)
      console.log('index', index)
      this.selectedRowKeys = selectedRowKeys
      this.selectedObject = index[0]
      this.disable = false
      this.currentRoleId = selectedRowKeys[0]
      // this.loadData2()
      // this.disable2 = false
      // this.$refs.selectUserModal.loadData(1)
    },
    // 编辑行
    changeRow (selectedObject) {
      this.handleEdit(selectedObject)
    },

    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    },

    handlePerssion: function (roleId) {
      this.$refs.modalUserRole.show(roleId)
    },

    handleAddUserRole () {
      if (this.currentRoleId == '') {
        this.$message.error('请选择一个角色!')
      } else {
        this.$refs.selectUserModal.visible = true
      }
    },
    // 重置表格状态
    resertTable () {
      this.radioChecked = true
      this.selectedRowKeys = []
      this.selectedProjectId = ''
      this.loadData(1)
      // this.loadData2()
    },

    handleRoleUser (record) {
      console.log('record', record)
      // this.currentRoleId = record.id
      // this.selectedRowKeys = [record.id]
      this.disable = false
      this.resetRoleId(record.id)
      this.$refs.drawerForm.edit(record)
      // this.disable2 = false
      // this.loadData2()
      // this.$refs.drawerForm.edit(record)
    },
    modalFormOk2 () {
      // 新增/修改 成功时，重载列表
      this.loadData(1)
    },
    resetRoleId (roleId) {
      this.currentRoleId = roleId
      this.selectedRowKeys = [roleId]
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
// .role-table-wrapper {
//   :global(table) {
//     word-break: break-all;
//   }
// }

// .row-content {
//   display: flex;
//   display: -webkit-flex;
//   align-items: stretch;
// }

// div.switch-visible {
//   width: 15px;
//   height: 48px;
//   border: 1px solid rgba(0, 0, 0, 0.2);
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   margin: 0 10px 0 0;
//   cursor: pointer;
// }

// span.show,
// span.unshow {
//   position: relative;
// }
// span.show:after {
//   content: '';
//   position: absolute;
//   top: -8px;
//   right: -10px;
//   display: inline-block;
//   width: 8px;
//   height: 16px;
//   border-right: 8px solid #444;
//   border-top: 8px solid #fff;
//   border-left: 0px solid #fff;
//   border-bottom: 8px solid #fff;
// }
// span.unshow:after {
//   content: '';
//   position: absolute;
//   top: -8px;
//   left: 3px;
//   display: inline-block;
//   width: 8px;
//   height: 16px;
//   border-right: 0px solid #fff;
//   border-top: 8px solid #fff;
//   border-left: 8px solid #444;
//   border-bottom: 8px solid #fff;
// }
</style>
