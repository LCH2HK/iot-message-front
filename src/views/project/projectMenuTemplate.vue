<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--      <a-button @click="handleAdd" type="primary" icon="check" :disabled="disable">启用</a-button>-->
      <!--      <a-button
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
      >同步菜单</a-button>

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
    <div class="menu-template-table-wrapper">
      <div class="ant-alert ant-alert-info" style="border: none;margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a>{{ selectedRowKeys.length }}</a>项
        <a @click="onClearSelected">清空</a>
      </div>
      <a-table
        size="middle"
        rowKey="id"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <!--          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <project-menu-template-modal ref="modalForm" @ok="modalFormOk"></project-menu-template-modal>
    <department-chosen-modal ref="departmentChosen" @departChosenOk="departChosenOk"></department-chosen-modal>
  </a-card>
</template>

<script>
import projectMenuTemplateModal from './modules/projectMenuTemplateModal'
import departmentChosenModal from './modules/departmentChosenModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { deleteAction, getAction } from '@/api/manage'

import AFormItem from 'ant-design-vue/es/form/FormItem'
import { postAction } from '../../api/manage'
import qs from 'qs'
export default {
  name: 'ProjectMenuTemplate',
  mixins: [CmpListMixin],
  components: {
    AFormItem,
    projectMenuTemplateModal,
    departmentChosenModal
  },
  data () {
    return {
      description: '项目菜单模板管理页面',
      visible: false,
      disable: true,
      loading: false,
      // 同步菜单的项目id
      projectId: '',
      projectCode: '',
      synParams: {},
      // 选择行信息
      selectedRowKeys: [],
      // 项目下拉框数据源
      projectItems: [],
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
          title: '菜单名称',
          align: 'left',
          dataIndex: 'name',
          key: 'name',
          width: 150
        },
        {
          title: '菜单类型',
          align: 'left',
          dataIndex: 'menuType',
          key: 'menuType',
          width: 100,
          customRender: function (text) {
            if (text == 0) {
              return '菜单'
            } else if (text == 1) {
              return '菜单'
            } else if (text == 2) {
              return '按钮'
            } else {
              return text
            }
          }
        },
        /* {
      title: '权限编码',
      dataIndex: 'perms',
      key: 'permissionCode',
    }, */ {
          title: 'icon',
          align: 'left',
          dataIndex: 'icon',
          key: 'icon',
          width: 80
        },
        {
          title: '组件',
          align: 'left',
          dataIndex: 'component',
          key: 'component',
          width: 250,
          scopedSlots: { customRender: 'component' }
        },
        {
          title: '路径',
          align: 'left',
          dataIndex: 'url',
          key: 'url',
          width: 250,
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '排序',
          align: 'left',
          dataIndex: 'sortNo',
          key: 'sortNo',
          width: 60
        },
        {
          title: '操作',
          align: 'left',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ],
      url: {
        list: '/projectPermission/sysProjectPermission/list',
        delete: '/projectPermission/sysProjectPermission/delete',
        deleteBatch: '/projectPermission/sysProjectPermission/deleteBatch',
        synchroize: '/projectPermission/sysProjectPermission/synchronizeMenu',
        projectList: '/project/sysProject/allList'
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
    loadData () {
      this.dataSource = []
      this.selectedRowKeys = []
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
            } else {
              that.$message.warning('操作失败')
            }
          })
        }
      })
    },

    // 选择行
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('选择的主键ID => ', selectedRowKeys)
      console.log('selected rows =>', selectedRows)
      this.selectedRowKeys = selectedRowKeys
      if (this.selectedRowKeys != '') {
        this.disable = false
      } else {
        this.disable = true
      }
      this.selectedRows = selectedRows
    },

    handleChange (value) {
      let p = value.split(',')
      this.projectId = p[0]
      this.projectCode = p[1]
      console.log(`selected ${value}`)
    },

    synchronizationBtn () {
      this.$refs.departmentChosen.isvisible = true
      this.$refs.departmentChosen.ids = this.getParams()
      this.$refs.departmentChosen.title = '选择项目'
    },

    getParams () {
      let params = {}
      let ids = []
      let rids = []
      this.selectedRows.forEach(function (value) {
        ids.push(value.id)
        ids.push(value.parentId)
      })
      ids.forEach(function (value) {
        if (rids.indexOf(value) === -1) {
          rids.push(value)
        }
      })
      return rids.join(',')
    },
    departChosenOk (params) {
      let url = this.url.synchroize
      postAction(url, params).then((res) => {
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
.menu-template-table-wrapper {
  :global(table) {
    word-break: break-all;
  }
}
</style>
