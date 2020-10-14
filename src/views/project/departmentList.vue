<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <span class="serachRight" v-if="toggleSearchStatus">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
          </span>

          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目名称">
              <a-input v-model="queryParam.prjName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目负责人">
              <a-input v-model="queryParam.prjManagerFullname"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="7" :sm="7">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目类型">
                <a-input v-model="queryParam.prjName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="7">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目区域">
                <a-input v-model="queryParam.prjManagerFullname"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
          <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>-->
    <a-layout>
      <!-- 快捷潮汛区域 -->
      <a-layout-sider theme="light" v-if="!collapsed" class="quick-sider">
        <a-collapse v-model="activeKey" :bordered="false">
          <a-collapse-panel header="模板管理" key="1" :style="customStyle">
            <a-radio :defaultChecked="true" :checked="radioChecked" @focus="defaultFocus">项目部门模板</a-radio>
          </a-collapse-panel>
          <a-collapse-panel header="项目管理" key="2" :style="customStyle">
            <a-tree :treeData="treeData" @select="selectTree" :selectedKeys="selectedProKeys" />
          </a-collapse-panel>
        </a-collapse>
      </a-layout-sider>
      <!-- 内容区域 -->
      <a-layout>
        <a-layout-content>
          <!-- 按钮 -->
          <div class="table-operate-button">
            <a-button
              type="primary"
              @click="switchVisible"
              :icon="!collapsed ? 'caret-left' : 'caret-right'"
            ></a-button>
            <a-button
              type="primary"
              icon="book"
              :disabled="!checkedKeys.checked || !checkedKeys.checked.length"
              v-if="radioChecked"
              @click="sync"
            >同步</a-button>
            <a-button
              type="primary"
              :disabled="(checkedKeys.checked.length === 1) ? false : true "
              icon="plus"
              @click="addLeaf"
            >添加</a-button>
            <a-button
              type="primary"
              icon="edit"
              :disabled="(checkedKeys.checked.length === 1 && checkedKeys.checked[0] != 'companyId' && checkedKeys.checked[0] != projectId ) ? false : true "
              @click="editLeaf"
            >编辑</a-button>
            <a-button
              type="primary"
              icon="delete"
              @click="deleteLeaf"
              :disabled="(checkedKeys.checked.length == 0) || (checkedKeys.checked.indexOf('companyId') >= 0) || (checkedKeys.checked.indexOf(projectId) >= 0)"
            >删除</a-button>
            <!-- <a-button type="primary" icon="close-circle" @click="clear">清空</a-button> -->
            <a-button type="primary" icon="reload" @click="reload">刷新</a-button>
          </div>
          <!-- 树形结构 -->
          <a-spin :spinning="spinning">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
                <span style="user-select: none">
                  <a-tree
                    checkable
                    checkStrictly
                    v-model="checkedKeys"
                    :expandedKeys="iExpandedKeys"
                    :treeData="proDepartTreeData"
                    @expand="onExpand"
                    @rightClick="rightHandle"
                    @check="oncheck"
                    :selectedKeys="[]"
                  ></a-tree>
                </span>
                <!--新增右键点击事件,和增加添加和删除功能-->
                <a-menu slot="overlay">
                  <a-menu-item key="1" @click="addLeaf" class="right-click">
                    <img src="@assets/img/depart-manage-icon/add.png" />
                    <span>添加</span>
                  </a-menu-item>
                  <a-menu-item
                    key="2"
                    @click="editLeaf"
                    v-if="this.nodemessage.id"
                    class="right-click"
                  >
                    <img src="@assets/img/depart-manage-icon/edit.png" />
                    <span>编辑</span>
                  </a-menu-item>
                  <a-menu-item
                    key="3"
                    @click="rightDeleteLeaf"
                    v-if="this.nodemessage.id"
                    class="right-click"
                  >
                    <img src="@assets/img/depart-manage-icon/delete.png" />
                    <span>删除</span>
                  </a-menu-item>
                  <a-menu-item key="4" class="right-click">
                    <img src="@assets/img/depart-manage-icon/cancel.png" />
                    <span>取消</span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <department-template-modal ref="departmentmodal" @reload="reload"></department-template-modal>
    <department-chosen-modal ref="departmentChosen"></department-chosen-modal>
  </a-card>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import departmentTemplateModal from './modules/departmentTemplateModal'
import departmentChosenModal from './modules/departmentChosenModal'
import qs from 'qs'

export default {
  name: 'UserManagementList',
  components: {
    departmentTemplateModal,
    departmentChosenModal
  },
  data() {
    return {
      activeKey: ['1', '2'],
      treeData: [], // 快捷查询项目列表数据
      proDepartTreeData: [], //项目部门树数据
      iExpandedKeys: [], //展开的树节点
      spinning: false, //加载状态
      projectId: '', //项目id
      radioChecked: true, //快捷查询中部门模板选中状态
      selectedProKeys: [], // 快捷查询中选中项目列表状态
      dropTrigger: '', //下拉菜单触发方式
      checkedKeys: {
        checked: [],
        halfChecked: []
      }, //复选框选中key
      nodemessage: { id: '' }, // 右键选中节点信息或者复选框最后选中的节点信息
      projectkey: '', //选中项目的部门根节点ID
      // api接口
      url: {
        projectdepartList: '/prj/sysProjectDepart/queryTreeList', // 根据项目查询部门
        getDepart: '/project/sysProject/queryProject?dictCode=project_group', //项目数据
        exportXlsUrl: 'test/testMainQcx/exportXls',
        importExcelUrl: 'test/testMainQcx/importExcel',
        synch: '/prj/sysProjectDepart/synchronizeOrg', //同步
        addLeaf: '/prj/sysProjectDepart/add', // 添加
        deleteLeaf: '/prj/sysProjectDepart/delete', //删除
        deleteBatch: '/prj/sysProjectDepart/deleteBatch', //批量删除
        editLeaf: '/prj/sysProjectDepart/edit' //编辑
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },

      collapsed: false, //快捷查询显隐状态
      // 快捷查询样式
      customStyle: {
        border: 0,
        overflow: 'hidden'
      },
      params: {}
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    isDeletable() {
      return !(this.checkedKeys.checked.length >= 1 && this.nodemessage.key !== this.projectId)
    }
  },
  mounted() {
    this.loadTreeData()
    this.defaultFocus()
  },
  methods: {
    // 获取快捷查询项目树数据
    loadTreeData(arg) {
      if (!this.url.getDepart) {
        this.$message.error('请设置url.getDepart属性!')
        return
      }
      let params = null,
        that = this
      getAction(this.url.getDepart, params).then(res => {
        if (res.success) {
          that.treeData = that.formate(res.result)
        } else {
          that.$message.warn(res.message)
        }
      })
    },
    // 序列化项目树
    formate(value) {
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
    // 默认单选框被选中时触发
    defaultFocus() {
      // 选中默认框
      this.radioChecked = true
      // 清除项目列表树选中状态
      this.selectedProKeys = []
      // 重置项目id
      this.projectId = ''
      this.params = {
        projectId: '',
        prjCode: '',
        isTemplate: '1'
      }
      this.checkedKeys = {
        checked: [],
        halfChecked: []
      }
      // 获取模板树形菜单数据
      this.getdepartTreeData(this.params)
    },
    // 选中项目，获取项目部门数据
    selectTree(key, e) {
      this.checkedKeys = {
        checked: [],
        halfChecked: []
      }
      this.projectId = key.join()
      this.params = {
        projectId: key.join(),
        prjCode: e.selectedNodes[0].data.props.prjCode,
        isTemplate: '0'
      }
      if (this.params.prjCode === undefined) {
        return
      }
      // 根据项目id和code获取项目人员列表
      this.getdepartTreeData(this.params)
      // 清除默认单选框选中状态
      this.radioChecked = false
      this.selectedProKeys = key
    },
    // 获取项目部门数据公用方法
    getdepartTreeData(params) {
      let url = this.url.projectdepartList
      this.spinning = true
      this.iExpandedKeys = []
      this.proDepartTreeData = []
      let that = this
      getAction(url, params).then(res => {
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.proDepartTreeData.push(temp)
            that.setThisExpandedKeys(temp)
          }
          that.spinning = false
        } else {
          that.$message.warn(res.message)
          that.spinning = false
        }
      })
    },
    // 将有子节点且子节点个数不为0的key值放到展开的树节点iExpandedKeys里，即加载后自动展开所有树节点
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    // 切换快捷查询列表显隐
    switchVisible() {
      this.collapsed = !this.collapsed
    },
    // 添加人员按钮
    handleAdd() {
      if (this.projectId === '') {
        this.$message.error('请选择项目！')
        return
      }
      this.$refs.usermodal.visible = true
      this.$refs.usermodal.projectId = this.projectId
    },
    // 调离人员
    batchDel() {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      } else if (this.projectId === '') {
        this.$message.error('请选择项目！')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        let ids = this.selectedRowKeys.join(),
          params = {
            userIds: ids,
            projectId: this.projectId
          },
          that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            postAction(that.url.deleteBatch, qs.stringify(params)).then(res => {
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
    // 展开收起节点触发，expandedKeys表示展开的节点的key值数组
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
    },
    // 右键单击触发，展开下拉菜单
    rightHandle(node) {
      this.nodemessage = Object.assign({ prjCode: this.params.prjCode }, node.node.dataRef)
      this.dropTrigger = 'contextmenu'
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    // 同步组织机构
    sync() {
      this.$refs.departmentChosen.isvisible = true
      this.$refs.departmentChosen.ids = this.getParams()
      this.$refs.departmentChosen.title = '同步'
    },
    // 获取选中部门的id集合
    getParams() {
      let key1 = this.checkedKeys.checked,
        key = key1.slice(0),
        index = key.indexOf('companyId')
      if (index >= 0) {
        key.splice(index, 1)
      }
      return key.join()
    },
    //刷新
    reload() {
      this.getdepartTreeData(this.params)
      this.checkedKeys = {
        checked: [],
        halfChecked: []
      }
    },
    // 清空选中部门
    clear() {
      this.checkedKeys = {
        checked: [],
        halfChecked: []
      }
    },
    // 给选中的部门添加子部门
    addLeaf() {
      this.$refs.departmentmodal.isvisible = true
      this.$refs.departmentmodal.template = this.radioChecked
      this.$refs.departmentmodal.add(this.nodemessage)
    },
    // 编辑选中的部门
    editLeaf() {
      this.$refs.departmentmodal.isvisible = true
      this.$refs.departmentmodal.template = this.radioChecked
      this.$refs.departmentmodal.edit(this.nodemessage)
    },
    // 删除选中的部门，支持批量删除
    deleteLeaf() {
      let params = {
        isTemplate: this.radioChecked ? 1 : 0,
        ids: this.checkedKeys.checked.join()
      }
      this.delete(params)
    },
    //右键选中部门删除（同时只能选中一项）
    rightDeleteLeaf() {
      let params = {
        isTemplate: this.radioChecked ? 1 : 0,
        ids: this.nodemessage.id
      }
      this.delete(params)
    },
    // 删除部门
    delete(params) {
      let that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function() {
          postAction(that.url.deleteBatch, qs.stringify(params)).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.reload()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 复选框操作
    oncheck(checkedKeys, node) {
      this.nodemessage = Object.assign(
        { prjCode: this.params.prjCode },
        node.checkedNodes.length > 0 ? node.checkedNodes[0].data.props.dataRef : null
      )
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@assets/less/modal.less';
.quick-sider {
  overflow-y: scroll;
  max-height: 636px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  margin-right: 20px;

  @scrollBarSize: 5px;
  &::-webkit-scrollbar {
    width: @scrollBarSize;
    height: @scrollBarSize;
    background-color: transparent;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #eee;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

    &:hover {
      background-color: #bbb;
    }

    &:active {
      background-color: #888;
    }
  }
}
.table-operate-button {
  display: flex;
  margin-bottom: 15px;
  button {
    margin: 0 5px;
  }
}

.row-content {
  display: flex;
  display: -webkit-flex;
  align-items: stretch;
}

div.switch-visible {
  width: 30px;
  height: 36px;
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
//右键点击
.right-click{
  display: flex;
  align-items: center;
  & > span{
    margin-left: 5px;
  }
}
</style>