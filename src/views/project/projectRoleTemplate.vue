<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!--    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="角色名称">
              <a-input placeholder="请输入角色名称" v-model="queryParam.roleName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="8">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--      <a-button @click="handleAdd" type="primary" icon="check" :disabled="disable">启用</a-button>
      <a-button
        type="primary"
        @click="batchAbandone($event,selectedRowKeys)"
        icon="delete"
        class="btn-style"
        :disabled="disable"
      >禁用</a-button>-->
      <!--      <a-button
        type="primary"
        icon="edit"
        class="btn-style"
        @click="editBtn()"
        :disabled="disable"
      >修改</a-button>-->
      <a-button
        type="primary"
        icon="bulb"
        class="btn-style"
        @click="synchronizationBtn"
        :disabled="disable"
      >同步角色</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />删除
          </a-menu-item>
        </a-menu>
        <a-button class="batchOperation">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="border: none;margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a>{{ selectedRowKeys.length }}</a>项
        <a @click="onClearSelected">清空</a>
      </div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record,true)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 授权区域 -->
    <a-drawer
      title="菜单授权"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="authorizeVisible"
    ></a-drawer>
    <!-- 表单区域 -->
    <!-- <a-modal
      title="同步菜单"
      v-model="visible"
      :width="600"
      :maskClosable="false"
      @ok="synchronize">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="项目">
        <a-select style="width: 240px" @change="handleChange">
          <a-select-option v-for="item in this.projectItems" :value="item.prjCode" v-bind:key="item.id">{{item.prjName}}</a-select-option>
        </a-select>
      </a-form-item>

    </a-modal>-->

    <project-role-template-modal ref="modalForm" @ok="modalFormOk"></project-role-template-modal>
    <user-role-modal ref="modalUserRole"></user-role-modal>
    <department-chosen-modal ref="departmentChosen" @departChosenOk="departChosenOk"></department-chosen-modal>
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { deleteAction, getAction, postAction } from '@/api/manage'
import Options from 'ant-design-vue/es/vc-pagination/Options'
import ProjectRoleTemplateModal from './modules/projectRoleTemplateModal'
import departmentChosenModal from './modules/departmentChosenModal'

import UserRoleModal from '@/views/system/modules/UserRoleModal'
import qs from 'qs'

export default {
  name: 'ProjectRoleTemplate',
  mixins: [CmpListMixin],
  components: {
    ProjectRoleTemplateModal,
    Options,
    UserRoleModal,
    departmentChosenModal
  },
  data () {
    return {
      description: '项目角色模板管理页面',
      // 选择行信息
      selectedRowKeys: [],
      selectedRows: [],
      // 项目下拉框数据源
      projectItems: [],
      projectCode: '',
      authorizeVisible: false,
      disable: true,
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
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
          dataIndex: 'roleName'
        },
        {
          title: '角色编号',
          align: 'left',
          dataIndex: 'roleCode'
        },
        {
          title: '描述',
          align: 'left',
          dataIndex: 'description'
        },
        {
          title: '操作',
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sys/projectRole/queryall',
        delete: '/sys/projectRole/delete',
        deleteBatch: '/sys/projectRole/deleteBatch',
        projectList: '/project/sysProject/allList',
        synchroize: '/sys/projectRole/roleSync'
      }
    }
  },
  computed: {},
  beforeCreate () {
    // 自行定义方法，引用字典
    // 初始化字典
    initDictOptions('bpm_status').then((res) => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('leave_type').then((res) => {
      if (res.success) {
        this.leaveDictOptions = res.result
      }
    })
  },
  methods: {
    loadData (arg) {
      this.dataSource = []
      getAction(this.url.list, {}).then((res) => {
        if (res.success) {
          this.dataSource = res.result
        }
      })
    },

    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              this.disable = true
            } else {
              that.$message.warning('操作失败')
            }
          })
        }
      })
    },
    handleChange (value) {
      this.projectCode = value
      console.log(`selected ${value}`)
    },

    // 选择行
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('选择的主键ID => ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      if (this.selectedRowKeys != '') {
        this.disable = false
      } else {
        this.disable = true
      }
      this.selectedRows = selectedRows[0]
      console.log(this.selectedRows)
    },

    authorize () {
      this.authorizeVisible = true
    },

    onClose () {
      this.authorizeVisible = false
    },

    synchronizationBtn () {
      this.$refs.departmentChosen.isvisible = true
      this.$refs.departmentChosen.ids = this.getParams()
      this.$refs.departmentChosen.title = '选择项目'
    },
    getParams () {
      let params = {}
      let ids = new Array()
      this.selectedRowKeys.forEach(function (value) {
        ids.push(value)
      })
      return ids.join(',')
    },
    departChosenOk (params) {
      let url = this.url.synchroize
      params.prjCodes = params.prjCode
      delete params.prjCode
      postAction(url, qs.stringify(params)).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$refs.departmentChosen.isvisible = false
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handlePerssion: function (roleId) {
      // alert(roleId);
      this.$refs.modalUserRole.show(roleId)
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
      this.disable = true
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@views/iot/css/iotCommon.less';
/deep/.ant-card-body {
  padding: 8px 16px;
}
</style>
