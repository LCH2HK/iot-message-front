<template>
  <a-card :bordered="false">
    <a-layout>
      <!-- 树 -->
      <a-layout-sider
        width="180px"
        theme="light"
        collapsedWidth="0"
        :trigger="null"
        collapsible
        v-model="collapsed"
        style="margin-right: 8px"
      >
              <!-- v-if="!collapsed" -->
        <!--部门树查询组件-->
        <a-collapse v-model="activeKey" style="height: inherit;border-bottom: 1px solid #d9d9d9">
          <a-collapse-panel header="快捷查询" key="1" :style="customStyle">
            <a-radio :defaultChecked="true" :checked="radioChecked" @focus="defaultFocus">默认</a-radio>
          </a-collapse-panel>
          <a-collapse-panel header="项目列表" key="2" :style="customStyle">
            <a-tree :treeData="treeData" @select="selectTree" :selectedKeys="selectedKeys" />
          </a-collapse-panel>
        </a-collapse>
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible" style="margin-right: 24px">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
      <!-- 主表区域 -->
      <a-layout-content>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="18" :sm="18">
                <a-row :gutter="24">
                  <a-col :md="7" :sm="7">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号/姓名">
                      <j-input-lk
                        @enterSearch="enterSearch($event,'dimName')"
                        @inputValueLk="inputValueLk($event,'dimName')"
                        placeholder="请输入账号/姓名"
                        @keyup.enter="searchQuery"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
                  </a-col>
                  <a-col :md="7" :sm="7">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
                      <!-- <a-input v-model="queryParam.phone"></a-input> -->
                      <j-input-lk
                        :placeholder="'请输入手机号'"
                        @enterSearch="enterSearch($event,'phone')"
                        @inputValueLk="inputValueLk($event,'phone')"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
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
        <!-- 按钮 -->
        <div class="table-operator">
          <a-button type="primary" icon="plus" @click="handleAdd">添加人员</a-button>
          <a-button type="primary" icon="delete" @click="batchDel">删除人员</a-button>
          <a-button type="primary" icon="reload" @click="getTableData(projectId)">刷新</a-button>
        </div>
        <!-- 表格 -->
        <div>
          <a-table
            bordered
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
    <user-management-modal ref="modalForm" @refresh="selectTree"></user-management-modal>
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
        list: '/test/testMainQcx/list',
        projectList: 'project/sysProject/allList', // 项目树接口
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
  mounted () {
    this.loadTreeData()
    this.selectTree(this.projectId)
  },
  methods: {
    searchQuery () {
      this.getTableData(this.projectId)

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
      const params = null
      const that = this
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
        const arr = []
        value.forEach((item, index) => {
          const arrItem = []
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
    // 选中项目，获取人员列表
    selectTree (key) {
      // 根据项目id获取项目人员列表
      this.getTableData(key)
      // 清除默认单选框选中状态
      this.radioChecked = false
    },
    // 获取人员列表公用方法
     getTableData (key) {
      const url = this.url.projectUserList
      if (key instanceof Array) {
        this.projectId = key[0]
        this.selectedKeys = key
      } else {
        this.projectId = key
        this.selectedKeys = [key]
      }
      let params = this.getQueryParams()
      params.projectId = this.projectId
      this.loading = true
      getAction(this.url.projectUserList, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result ? res.result.records : null
          this.ipagination.total = res.result ? res.result.total : 0
          this.selectedRowKeys = []
        }
        let params = this.getQueryParams()
        console.log('params==>',params)
        let dimName=params.dimName
        let phone=params.phone
        console.log('dimName:',dimName,',phone:',phone)
        if(dimName!=undefined && dimName!=''){
          dimName=dimName.trim().slice(1,-1)
          this.dataSource=this.dataSource.filter(value => {
            return value.username.indexOf(dimName)!=-1 || value.realname.indexOf(dimName)!=-1
          })
        }
        console.log(this.dataSource)

        if(phone!=undefined && phone!=''){
          phone=phone.trim().slice(1,-1);
          this.dataSource=this.dataSource.filter(value => {
            console.log('value:',value,'   value.phone!=null:',value.phone!=null)
            return value.phone!=null && value.phone.indexOf(phone)!=-1
          })
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
      this.getTableData(this.projectId)
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
      this.getTableData(this.projectId)
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
        const ids = this.selectedRowKeys.join()
        const params = {
          userIds: ids,
          projectId: this.projectId
        }
        const that = this
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
      this.getTableData(this.projectId)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
// @import '~@assets/less/modal.less';
@import '~@views/iot/css/iotCommon.less';
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

// div.switch-visible {
//   width: 30px;
//   height: 36px;
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
