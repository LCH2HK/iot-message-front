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

    <!-- 内容区域 -->
    <a-layout>
      <a-layout-content>
        <!-- 按钮 -->
        <div class="table-operate-button">
          <!-- <a-button
            type="primary"
            @click="switchVisible"
            :icon="!collapsed ? 'caret-left' : 'caret-right'"
          ></a-button>-->
          <!-- <a-button
            type="primary"
            icon="book"
            :disabled="!checkedKeys.checked || !checkedKeys.checked.length"
            v-if="radioChecked"
            @click="sync"
          >同步</a-button>-->
          <a-button
            type="primary"
            :disabled="(checkedKeys.checked.length === 1) ? false : true "
            icon="plus"
            @click="addLeaf"
          >添加</a-button>
          <a-button
            type="primary"
            :disabled=" !(checkedKeys.checked.length === 1 && nodemessage.key !== projectMessage.id )"
            icon="edit"
            @click="editLeaf"
          >编辑</a-button>
          <a-button
            type="primary"
            icon="delete"
            @click="deleteLeaf"
            :disabled=" !(checkedKeys.checked.length >= 1 && checkedKeys.checked.indexOf(projectMessage.id) === -1  )"
          >删除</a-button>
          <a-button type="primary" icon="close-circle" @click="clear">清空</a-button>
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
                <a-menu-item key="1" @click="addLeaf">新增</a-menu-item>
                <a-menu-item key="2" @click="editLeaf" v-if="this.nodemessage.id">编辑</a-menu-item>
                <a-menu-item key="3" @click="deleteLeaf" v-if="this.nodemessage.id">删除</a-menu-item>
                <a-menu-item key="4">取消</a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-spin>
      </a-layout-content>
    </a-layout>
    <department-template-modal ref="departmentmodal" @reload="reload"></department-template-modal>
  </a-card>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import departmentTemplateModal from './modules/departmentTemplateModal'
import qs from 'qs'
import Vue from 'vue'

export default {
  name: 'UserManagementList',
  components: {
    departmentTemplateModal
  },
  data () {
    return {
      activeKey: ['1', '2'],
      proDepartTreeData: [], // 项目部门树数据
      iExpandedKeys: [], // 展开的树节点
      spinning: false, // 加载状态
      projectId: '', // 项目id
      radioChecked: true, // 快捷查询中部门模板选中状态
      selectedProKeys: [], // 快捷查询中选中项目列表状态
      dropTrigger: '', // 下拉菜单触发方式
      checkedKeys: {
        checked: [],
        halfChecked: []
      }, // 复选框选中key
      nodemessage: { id: '' }, // 右键选中节点信息或者复选框最后选中的节点信息
      projectkey: '', // 选中项目的部门根节点ID
      // api接口
      url: {
        projectdepartList: '/prj/sysProjectDepart/queryTreeList', // 根据项目查询部门
        getDepart: '/project/sysProject/queryProject?dictCode=project_group', // 项目数据
        exportXlsUrl: 'test/testMainQcx/exportXls',
        importExcelUrl: 'test/testMainQcx/importExcel',
        synch: '/prj/sysProjectDepart/synchronizeOrg', // 同步
        addLeaf: '/prj/sysProjectDepart/add', // 添加
        deleteLeaf: '/prj/sysProjectDepart/delete', // 删除
        deleteBatch: '/prj/sysProjectDepart/deleteBatch', // 批量删除
        editLeaf: '/prj/sysProjectDepart/edit' // 编辑
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },

      collapsed: false, // 快捷查询显隐状态
      // 快捷查询样式
      customStyle: {
        border: 0,
        overflow: 'hidden'
      },
      params: {},
      projectMessage: {}
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
  },
  mounted () {
    // this.projectMessage = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMessage = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log(this.projectMessage)
    this.getdepartTreeData()
  },
  methods: {
    // 获取项目部门数据
    getdepartTreeData () {
      let url = this.url.projectdepartList
      let params = {
        projectId: this.projectMessage.id,
        prjCode: this.projectMessage.prjCode,
        isTemplate: '0'
      }
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
    setThisExpandedKeys (node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },

    // 展开收起节点触发，expandedKeys表示展开的节点的key值数组
    onExpand (expandedKeys) {
      this.iExpandedKeys = expandedKeys
    },
    // 右键单击触发，展开下拉菜单
    rightHandle (node) {
      this.nodemessage = Object.assign({ prjCode: this.params.prjCode }, node.node.dataRef)
      this.dropTrigger = 'contextmenu'
      console.log(node)
      console.log(this.checkedKeys)
      this.checkedKeys = {
        checked: [node.node.eventKey],
        halfChecked: []
      }
      console.log(this.checkedKeys)
    },
    // 右键点击下拉框改变事件
    dropStatus (visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },

    // 刷新
    reload () {
      this.getdepartTreeData()
      this.checkedKeys = {
        checked: [],
        halfChecked: []
      }
    },
    // 清空选中部门
    clear () {
      this.checkedKeys = {
        checked: [],
        halfChecked: []
      }
    },
    // 给选中的部门添加子部门
    addLeaf () {
      this.$refs.departmentmodal.isvisible = true
      this.$refs.departmentmodal.template = this.radioChecked
      this.$refs.departmentmodal.add(this.nodemessage)
    },
    // 编辑选中的部门
    editLeaf () {
      this.$refs.departmentmodal.isvisible = true
      this.$refs.departmentmodal.template = this.radioChecked
      this.$refs.departmentmodal.edit(this.nodemessage)
    },
    // 删除选中的部门，支持批量删除
    deleteLeaf () {
      if (!this.checkedKeys.checked || this.checkedKeys.checked.length == 0) {
        this.$message.warning('请至少选择一项数据！')
        return
      }
      let params = {
        isTemplate: this.radioChecked ? 1 : 0,
        ids: this.checkedKeys.checked.join()
      }
      let that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
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
    oncheck (checkedKeys, node) {
      console.log(node)
      this.nodemessage = Object.assign(
        { prjCode: this.params.prjCode },
        node.checkedNodes.length > 0 ? node.checkedNodes[0].data.props.dataRef : null
      )
      console.log(this.nodemessage)
      console.log(this.projectId)
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
</style>
