<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button type="primary" icon="plus">新增</a-button> -->
      <a-button type="primary" icon="book" :disabled="!selectedKey" @click="sync">同步部门</a-button>
      <!-- <a-button type="primary" icon="delete">批量删除</a-button> -->
    </div>

    <a-spin :spinning="spinning">
      <template>
        <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
          <span style="user-select: none">
            <a-tree
              checkable
              checkStrictly
              :expandedKeys="iExpandedKeys"
              :treeData="treeData"
              @expand="onExpand"
              @check="oncheck"
              @rightClick="rightHandle"
            ></a-tree>
          </span>
          <!--新增右键点击事件,和增加添加和删除功能-->
          <a-menu slot="overlay">
            <a-menu-item @click="addLeaf" key="1" class="right-click">
              <img src="@assets/img/depart-manage-icon/add.png" />
              <span>添加</span>
            </a-menu-item>
            <a-menu-item @click="deleteLeaf" key="2" class="right-click">
              <img src="@assets/img/depart-manage-icon/delete.png" />
              <span>删除</span>
            </a-menu-item>
            <a-menu-item key="3" class="right-click">
              <img src="@assets/img/depart-manage-icon/cancel.png" />
              <span>取消</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </a-spin>

    <department-template-modal ref="departmentmodal" @reload="reload"></department-template-modal>
    <department-chosen-modal ref="departmentChosen" @departChosenOk="departChosenOk"></department-chosen-modal>
  </a-card>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
//import { CmpListMixin } from '@/mixins/CmpListMixin'
import JEllipsis from '@/components/cmp/JEllipsis'
import departmentTemplateModal from './modules/departmentTemplateModal'
import departmentChosenModal from './modules/departmentChosenModal'
import qs from 'qs'

export default {
  name: 'PermissionList',
  /* mixins: [CmpListMixin], */
  components: {
    JEllipsis,
    departmentTemplateModal,
    departmentChosenModal
  },
  data() {
    return {
      description: '部门管理页面',
      // 表头
      loading: false,
      url: {
        list: '/projectPermission/sysProjectPermission/list',
        delete: '/projectPermission/sysProjectPermission/delete',
        deleteBatch: '/projectPermission/sysProjectPermission/deleteBatch',
        treeList: '/prj/sysProjectDepart/queryTreeList',
        addLeaf: '/prj/sysProjectDepart/add',
        deleteLeaf: '/prj/sysProjectDepart/delete',
        synch: '/prj/sysProjectDepart/synchronizeOrg'
      },
      treeData: [],
      iExpandedKeys: [],
      autoExpandParent: true,
      dropTrigger: '',
      record: {},
      spinning: false,
      selectedKey: '',
      checkedKeys: ''
    }
  },
  created() {
    this.getTemplate()
  },
  methods: {
    reload() {
      this.getTemplate()
    },
    getTemplate() {
      let url = this.url.treeList,
        params = {
          isTemplate: '1'
        },
        that = this
      that.treeData = []
      this.iExpandedKeys = []
      this.spinning = true
      getAction(url, params).then(res => {
        console.log(res, 'res')
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            console.log(temp)
            that.treeData.push(temp)
            that.setThisExpandedKeys(temp)
          }
          that.spinning = false
        }
      })
    },

    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    oncheck(key) {
      console.log(key, 'selectKey')
      this.selectedKey = key.checked
    },
    rightHandle(node) {
      this.dropTrigger = 'contextmenu'
      this.record = {
        title: node.node.title,
        key: node.node.eventKey
      }
      console.log(this.record)
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    addLeaf() {
      this.$refs.departmentmodal.isvisible = true
      this.$refs.departmentmodal.edit(this.record)
    },
    deleteLeaf() {
      let params = {
          isTemplate: 1,
          id: this.record.key
        },
        that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function() {
          postAction(that.url.deleteLeaf, qs.stringify(params)).then(res => {
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
    sync() {
      this.$refs.departmentChosen.isvisible = true
      this.$refs.departmentChosen.ids = this.getParams()
      this.$refs.departmentChosen.title = '选择项目'
    },
    getParams() {
      let key1 = this.selectedKey,
        key = key1.slice(0),
        index = key.indexOf('companyId')
      if (index >= 0) {
        key.splice(index, 1)
      }
      let len = key.length,
        str = ''
      for (let i = 0; i < len; i++) {
        str += key[i] + ','
      }
      return str
    },
    departChosenOk(params) {
      let url = this.url.synch
      postAction(url, params).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$refs.departmentChosen.isvisible = false
        } else {
          this.$message.warn(res.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
//右键点击
.right-click {
  display: flex;
  align-items: center;
  & > span {
    margin-left: 5px;
  }
}
</style>