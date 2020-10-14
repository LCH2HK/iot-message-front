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
        <div style="width: 100%; height: 100%; overflow: auto">
          <div>
            <a-collapse
              v-model="activeKey"
              style="height: inherit;border-bottom: 1px solid #d9d9d9"
            >
              <a-collapse-panel header="快捷查询" key="1">
                <a-radio :checked="this.radioChecked" @focus="resertTable">默认</a-radio>
              </a-collapse-panel>
              <a-collapse-panel style="border-bottom: 0;" header="项目树" key="2">
                  <!--<a-tree :treeData="projectData"
                          showLine
                          :defaultExpandedKeys="[1]"
                          @select="onSelect">
                  </a-tree>-->
                  <a-tree showLine @select="onSelect">
                    <a-tree-node
                      v-for="item in this.projectData"
                      :title="item.prjName"
                      :key="item.id"
                    ></a-tree-node>
                  </a-tree>
<!--                  <a-tree :treeData="treeData" @select="onSelect" :selectedKeys="selectedProKeys" />-->
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

          <!--          <a-button
            type="primary"
            @click="batchDel"
            icon="delete"
            class="btn-style"
            :disabled="disable2"
          >删除
          </a-button>-->
        </div>
        <div>
          <a-table
            rowKey="id"
            size="middle"
            :columns="columns"
            :dataSource="projectMenuData"
            :pagination="false"
            :loading="loading"
            bordered
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a-dropdown v-if="record.defaultMark==0">
                <a class="ant-dropdown-link">
                  更多
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleEdit(record)">编辑</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                  <!-- <a-menu-item>
                   <a @click="handlePerssion(record.id)">授权</a>
                  </a-menu-item>-->
                </a-menu>
              </a-dropdown>
              <a-dropdown v-else>
                <a class="ant-dropdown-link" disabled="disabled">
                  更多
                  <a-icon type="down" />
                </a>
              </a-dropdown>
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
import { IotPrjTreeMixin } from '@/views/iot/js/IotPrjTreeMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { httpAction, getAction } from '@/api/manage'
import qs from 'qs'
import ARow from 'ant-design-vue/es/grid/Row'
import JLeftTree from '@/components/cmp/JLeftTree'

import projectMenuModal from './modules/projectMenuModal'

export default {
  name: 'projectMenu',
  mixins: [CmpListMixin, IotPrjTreeMixin],
  components: {
    JLeftTree,
    ARow,
    JDictSelectTag,
    projectMenuModal
  },
  data () {
    return {
      loading: false,
      queryParam: {},
      projectMenuData: [],
      selectedProjectId: '',
      selectedRowKeys: [],
      selectedProKeys: [], // 快捷查询中选中项目列表状态
      treeData: [], // 快捷查询项目列表数据
      selectedObject: {},
      radioChecked: true,
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
          key: 'name',
          width: 150
        },
        {
          title: '菜单类型',
          dataIndex: 'menuType',
          key: 'menuType',
          width: 100,
          align: 'left',
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
        {
          title: 'icon',
          dataIndex: 'icon',
          key: 'icon',
          width: 100,
          align: 'left'
        },
        {
          title: '组件',
          dataIndex: 'component',
          key: 'component',
          width: 250,
          scopedSlots: { customRender: 'component' }
        },
        {
          title: '路径',
          dataIndex: 'url',
          key: 'url',
          width: 250,
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '排序',
          dataIndex: 'sortNo',
          key: 'sortNo',
          width: 100,
          align: 'left'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'left',
          width: 150
        }
      ],
      url: {
        // 企业项目列表
        list: '/project/sysProject/allList',
        // 项目菜单
        queryById: '/sys/permission/list?projectId=',
        deleteBatch: '/sys/permission/deleteBatch',
        delete: '/sys/permission/delete',
        exportXlsUrl: 'test/testMainQcx/exportXls',
        importExcelUrl: 'test/testMainQcx/importExcel',
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
      disable2: true,
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
    initDictOptions('bpm_status').then(res => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('prj_level_qcx').then(res => {
      if (res.success) {
        this.prjLevel = res.result
      }
    })
    initDictOptions('prj_type_qcx').then(res => {
      if (res.success) {
        // 倒序排序
        this.prjType = res.result.reverse()
        console.log(this.prjType, '字典数组倒序排序')
      }
    })
  },
  created () {
    this.loading = false
    getAction(this.url.list).then(res => {
      console.log(res)
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
      this.onSelect(this.isInProject.id, '')
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
      getAction(this.url.getDepart, params).then(res => {
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
      this.projectMenuData = []
      if (this.selectedProjectId != '') {
        getAction(this.url.queryById + this.selectedProjectId, {}).then(res => {
          console.log(res)
          if (res.success) {
            this.projectMenuData = res.result
          }
        })
      }
    },
    onSelect (selectedKeys, info) {
      if (selectedKeys.length == 0) {
        this.disable = true
        return
      }
      this.disable = false
      this.selectedProjectId = selectedKeys
      getAction(this.url.queryById + selectedKeys).then(res => {
        console.log(res)
        if (res.success) {
          this.projectMenuData = res.result
        } else {
          console.log('get projectMenu list failed')
        }
      })

      // 清除默认单选框选中状态
      this.radioChecked = false
      this.selectedProKeys = key
      console.log(selectedKeys, info)
    },

    // 重置表格状态
    resertTable () {
      this.radioChecked = true
      this.selectedRowKeys = []
      this.selectedProjectId = ''
      this.disable = true
      this.loadData()
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
    },
    // 编辑行
    changeRow (selectedObject) {
      this.handleEdit(selectedObject)
    },

    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    }
  },
  watch: {
    activeKey (key) {
      // console.log(key)
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
// .menu-table-wrapper {
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
