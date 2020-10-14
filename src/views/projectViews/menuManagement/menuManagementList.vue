<template>
  <a-card :bordered="false">

    <a-layout>

      <a-layout-content>
        <!-- table区域-begin -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus"
          >新增</a-button>

          <a-button
            type="primary"
            @click="batchDel"
            icon="delete"
            class="btn-style"
            :disabled="disable2"
          >删除
          </a-button>
        </div>
        <div>
          <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,}"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record)">编辑</a>
              </span>
          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <project-menu-modal ref="modalForm" @ok="modalFormOk" :projectId="this.selectedProjectId"></project-menu-modal>
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction, getAction } from '@/api/manage'
import qs from 'qs'
import Vue from 'vue'
import ARow from 'ant-design-vue/es/grid/Row'

import projectMenuModal from '@/views/project/modules/projectMenuModal'

export default {
  name: 'projectMenu',
  mixins: [CmpListMixin],
  components: {
    ARow,
    JDictSelectTag,
    projectMenuModal
  },
  data () {
    return {
      loading: false,
      selectedProjectId: null,
      selectedRowKeys: [],
      selectedObject: {},
      radioValue: true,
      prjType: [],
      activeKey: ['1', '2'],
      endValue: null,
      endOpen: false,
      projectData: [],
      collapsed: false,
      // 表头
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'name',
          key: 'name'
        }, {
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
        }, /* {
      title: '权限编码',
      dataIndex: 'perms',
      key: 'permissionCode',
    }, */{
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
          align: 'center',
          width: 150
        }
      ],
      url: {
        // list: '/sys/permission/list?projectId=' + Vue.ls.get('PROJECT_MESSAGE').id,
        list: '/sys/permission/list?projectId=' + JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE')).id,
        deleteBatch: '/sys/permission/deleteBatch'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      disable2: true,
      collapsed: false
    }
  },
  computed: {

  },
  beforeCreate () {
  },
  created () {

  },
  methods: {
    loadData (arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()// 查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result
          this.ipagination.total = res.result.total
        }
        this.loading = false
      })
      this.disable2 = true
    },
    // 选择行
    onSelectChange (selectedRowKeys, index) {
      console.log('选择的主键ID => ', selectedRowKeys)
      console.log('选择的对象 => ', index)
      if (selectedRowKeys.length == 0) {
        this.disable2 = true
      } else {
        this.disable2 = false
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectedObject = index[0]
    }

  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
  @import '~@assets/less/modal.less';

  .row-content {
    display: flex;
    display: -webkit-flex;
    align-items: stretch;
  }

  div.switch-visible {
    width: 15px;
    height: 48px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin: 0 10px 0 0;
    cursor: pointer;
  }

  span.show,
  span.unshow {
    position: relative;
  }
  span.show:after {
    content: '';
    position: absolute;
    top: -8px;
    right: -10px;
    display: inline-block;
    width: 8px;
    height: 16px;
    border-right: 8px solid #444;
    border-top: 8px solid #fff;
    border-left: 0px solid #fff;
    border-bottom: 8px solid #fff;
  }
  span.unshow:after {
    content: '';
    position: absolute;
    top: -8px;
    left: 3px;
    display: inline-block;
    width: 8px;
    height: 16px;
    border-right: 0px solid #fff;
    border-top: 8px solid #fff;
    border-left: 8px solid #444;
    border-bottom: 8px solid #fff;
  }
</style>
