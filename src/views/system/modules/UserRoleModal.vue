<template>
  <a-modal
    :title="null"
    :footer="null"
    :maskClosable="true"
    :closable="false"
    :width="800"
    placement="right"
    @cancel="close"
    :visible="visible"
  >
    <!-- 标题 -->
    <div class="title">
      <div>{{title}}</div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>

    <!-- 按钮 -->
    <div>
      <a-button type="primary" @click="expandAll">展开所有</a-button>
      <a-button type="primary" @click="closeAll">收起所有</a-button>
      <a-button type="primary" @click="checkALL">全部勾选</a-button>
      <a-button type="primary" @click="cancelCheckALL">取消全选</a-button>
      <a-button type="primary" @click="switchCheckStrictly" v-text="isAssociation"></a-button>
    </div>

    <a-form class="role-form-wrapper">
      <a-form-item label="所拥有的权限">
        <a-tree
          checkable
          @check="onCheck"
          :checkedKeys="checkedKeys"
          :treeData="treeData"
          @expand="onExpand"
          @select="onTreeNodeSelect"
          :expandedKeys="expandedKeysss"
          :checkStrictly="checkStrictly"
        >
          <span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
            {{ slotTitle }}
            <a-icon v-if="ruleFlag" type="align-left" style="margin-left:5px;color: red;"></a-icon>
          </span>
        </a-tree>
      </a-form-item>
    </a-form>

    <!-- <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作
          <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>-->

    <div class="btn-class">
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem" class="cancel">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" @click="handleSubmit" :loading="loading" class="confirm">确定</a-button>
    </div>
    <role-datarule-modal ref="datarule"></role-datarule-modal>
  </a-modal>
</template>
<script>
import { queryTreeListForRole, queryRolePermission, saveRolePermission } from '@/api/api'
import RoleDataruleModal from './RoleDataruleModal.vue'
import { getAction } from '@/api/manage'

export default {
  name: 'RoleModal',
  components: {
    RoleDataruleModal
  },
  props: {
    projectId: String,
    prjCode: String
  },
  data () {
    return {
      isAssociation: '父子关联',
      title: '',
      roleId: '',
      treeData: [],
      defaultCheckedKeys: [],
      checkedKeys: [],
      expandedKeysss: [],
      allTreeKeys: [],
      autoExpandParent: true,
      checkStrictly: true, // 默认取消关联状态
      title: '角色权限配置',
      visible: false,
      loading: false,
      url: {
        // 项目菜单
        queryById: '/sys/role/queryTreeList?projectId='
      }
    }
  },
  created () {
    if (this.checkStrictly) {
      this.isAssociation = '关联父子'
    } else {
      this.isAssociation = '取消关联'
    }
  },
  methods: {
    onTreeNodeSelect (id) {
      this.$refs.datarule.show(id[0], this.roleId)
    },
    onCheck (o) {
      if (this.checkStrictly) {
        this.checkedKeys = o.checked
      } else {
        this.checkedKeys = o
      }
    },
    show (roleId) {
      this.roleId = roleId
      this.visible = true
      this.title = '授权'
    },
    close () {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    onExpand (expandedKeys) {
      this.expandedKeysss = expandedKeys
      this.autoExpandParent = false
    },
    reset () {
      this.expandedKeysss = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.loading = false
    },
    expandAll () {
      this.expandedKeysss = this.allTreeKeys
    },
    closeAll () {
      this.expandedKeysss = []
    },
    checkALL () {
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL () {
      // this.checkedKeys = this.defaultCheckedKeys
      this.checkedKeys = []
    },
    switchCheckStrictly (v) {
      this.checkStrictly = !this.checkStrictly
      this.isAssociation = this.checkStrictly ? '关联父子' : '取消关联'
    },
    handleCancel () {
      this.close()
    },
    handleSubmit () {
      let that = this
      let params = {
        roleId: that.roleId,
        permissionIds: that.checkedKeys.join(','),
        lastpermissionIds: that.defaultCheckedKeys.join(','),
        prjCode: this.prjCode
      }
      that.loading = true
      console.log('请求参数：', params)
      saveRolePermission(params).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loading = false
          that.close()
        } else {
          that.$message.error(res.message)
          that.loading = false
          that.close()
        }
      })
    }
  },
  watch: {
    visible () {
      if (this.visible) {
        let projectId = this.projectId
        // console.log('user role prjId=>', this.projectId)
        // console.log('user role prjCode=>', this.prjCode)
        if (!projectId) {
          projectId = ''
        }
        getAction(this.url.queryById + projectId, {}).then(res => {
          if (res.success) {
            this.treeData = res.result.treeList
            this.allTreeKeys = res.result.ids
            let params = {
              roleId: this.roleId,
              prjCode: this.prjCode
            }
            queryRolePermission(params).then(res => {
              if (res.success) {
                // console.log('test=>', res)
                this.checkedKeys = [...res.result]
                this.defaultCheckedKeys = [...res.result]
                // this.expandedKeysss = this.allTreeKeys
                this.expandedKeysss = []
              } else {
                this.$message.error('请求失败')
              }
            })
          } else {
            this.$message.error('请求失败')
          }
        })
        // queryTreeListForRole().then(res => {
        //   console.log(res)
        //   this.treeData = res.result.treeList
        //   this.allTreeKeys = res.result.ids
        //   queryRolePermission({ roleId: this.roleId }).then(res => {
        //     console.log(res)
        //     this.checkedKeys = [...res.result]
        //     this.defaultCheckedKeys = [...res.result]
        //     //this.expandedKeysss = this.allTreeKeys
        //     this.expandedKeysss = []
        //     //console.log(this.defaultCheckedKeys)
        //   })
        // })
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/title-btn.less';

/* .drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
} */

.role-form-wrapper{
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-top: 12px;
  padding: 10px 20px 0;
}
</style>
