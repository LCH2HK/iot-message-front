<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="primary"
        icon="delete"
      >批量删除</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="border: none;margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;
        <a style="font-weight: 600">
          {{
          selectedRowKeys.length }}
        </a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        :columns="columns"
        size="middle"
        bordered
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
                <a href="javascript:;" @click="handleDataRule(record)">数据规则</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <!-- 字符串超长截取省略号显示 -->
        <span slot="url" slot-scope="text">
          <j-ellipsis :value="text" :length="25" />
        </span>
        <!-- 字符串超长截取省略号显示-->
        <span slot="component" slot-scope="text">
          <j-ellipsis :value="text" />
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
    <permission-data-rule-list ref="PermissionDataRuleList" @ok="modalFormOk"></permission-data-rule-list>
  </a-card>
</template>

<script>
import PermissionModal from './modules/PermissionModal'
import { getPermissionList } from '@/api/api'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import PermissionDataRuleList from './PermissionDataRuleList'
import JEllipsis from '@/components/cmp/JEllipsis'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '菜单类型',
    dataIndex: 'menuType',
    key: 'menuType',
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
    dataIndex: 'icon',
    key: 'icon'
  },
  {
    title: '组件',
    dataIndex: 'component',
    key: 'component',
    scopedSlots: { customRender: 'component' }
  },
  {
    title: '路径',
    dataIndex: 'url',
    key: 'url',
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '排序',
    dataIndex: 'sortNo',
    key: 'sortNo'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'left',
    width: 150
  }
]

export default {
  name: 'PermissionList',
  mixins: [CmpListMixin],
  components: {
    PermissionDataRuleList,
    PermissionModal,
    JEllipsis
  },
  data () {
    return {
      description: '这是菜单管理页面',
      // 表头
      columns: columns,
      loading: false,
      url: {
        list: '/sys/permission/list',
        delete: '/sys/permission/delete',
        deleteBatch: '/sys/permission/deleteBatch'
      }
    }
  },
  methods: {
    loadData () {
      this.dataSource = []
      getPermissionList().then(res => {
        if (res.success) {
          this.dataSource = res.result
        }
      })
    },
    // 打开数据规则编辑
    handleDataRule (record) {
      this.$refs.PermissionDataRuleList.edit(record)
      this.$refs.PermissionDataRuleList.title = '数据权限规则'
    }
  }
}
</script>
<style lang="less" scoped >
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
/deep/.ant-card-body {
  padding: 16px 16px;
}
</style>
