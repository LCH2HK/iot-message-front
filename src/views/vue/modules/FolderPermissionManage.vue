<template>
  <div class="form-wrapper">
    <a-form :form="form" @submit="handleSubmit" layout="horizontal">
      <a-form-item label="文件夹目录">
        <a-tree
          checkable
          @check="onCheck"
          :checkedKeys="checkedKeys"
          :treeData="folderTree"
          @expand="onExpand"
          :expandedKeys="expandedKeysss"
          :checkStrictly="checkStrictly"
        ></a-tree>
        <!-- v-decorator="[
            'fileIds',
            {rules:[{required:false,message:'请选择被授予的文件夹！'}]}
        ]"-->
      </a-form-item>
      <a-form-item label="授权对象类型">
        <a-select
          @select="onSelect"
          v-decorator="[
                'type',
                {rules:[{required:true,message:'请选择要授权对象的类型！'}]}
            ]"
          placeholder="请选择要授权对象的类型"
        >
          <a-select-option key="0" value="user">用户</a-select-option>
          <a-select-option key="1" value="role">角色</a-select-option>
          <a-select-option key="2" value="department">部门</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="授权对象" v-if="userShown">
        <!-- 选择具体用户: -->
        <j-select-user-new
          placeholder="请选择要授权的具体用户"
          multiple
          v-decorator="[
            'userNames', 
            {rules:[{required:true,message:'请选择要授权的具体用户！'}]}
        ]"
          :selectedDetails="auditUsers1"
          @callback="setAuditUser"
          class="userSelect"
        />
      </a-form-item>
      <!-- 选择具体角色： -->
      <a-form-item v-if="roleShown" label="授权对象">
        <a-input
          @click="SelectRoleModal"
          placeholder="请选择要授权的具体角色"
          v-decorator="['roleIds', {rules:[{required:true,message:'请选择要授权的具体角色！'}]}]"
        ></a-input>
      </a-form-item>
      <!-- 选择具体部门： -->
      <a-form-item label="授权对象" v-if="departShown">
        <j-select-depart
          placeholder="请选择要授权的具体部门"
          v-decorator="[
            'departmentIds',
             validatorRules.departmentIds
          ]"
          :trigger-change="true"
        ></j-select-depart>
      </a-form-item>
      <a-form-item label="授予权限">
        <a-checkbox-group
          v-decorator="[
                'permission', 
                {rules: [{ required: true, message: '请选择授予的权限' }]}
            ]"
          style="width: 100%;"
        >
          <a-row>
            <a-col :span="6">
              <a-checkbox value="read">查看</a-checkbox>
            </a-col>
            <a-col :span="6">
              <a-checkbox value="edit">编辑</a-checkbox>
            </a-col>
            <a-col :span="6">
              <a-checkbox value="new">新增</a-checkbox>
            </a-col>
            <a-col :span="6">
              <a-checkbox value="delete">删除</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
    </a-form>

    <div class="bottom-button">
      <!-- <div class="bottom-left-button">
        <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作
            <a-icon type="up" />
          </a-button>
        </a-dropdown>
        <a-button style="float: left" type="primary" @click="handleInit">部门文件夹初始化</a-button>
      </div>-->

      <div class="bottom-right-button">
        <a-popconfirm title="确定初始化部门文件夹？" @confirm="handleInit" okText="确定" cancelText="取消">
          <a-button type="primary" style="margin-right: .8rem">部门文件夹初始化</a-button>
        </a-popconfirm>
        <!-- <a-button type="primary" style="margin-right: .8rem" @click="handleInit">部门文件夹初始化</a-button> -->
        <a-popconfirm title="确定放弃当前操作？" @confirm="reset" okText="确定" cancelText="取消">
          <a-button style="margin-right: .8rem">重置</a-button>
        </a-popconfirm>
        <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
      </div>
    </div>
    <a-alert message="请选择至少一个文件夹！" :banner="banner" closable v-show='alertShown'/>
    <!-- 选角色弹窗 -->
    <selectRole-modal :visible="roleVisible" @cancel="SelectRoleHandlCancel" @select="SelectRole"></selectRole-modal>
  </div>
</template>
<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import qs from 'qs'
import Vue from 'vue'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
import SelectRoleModal from './SelectRoleModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'

export default {
  name: 'FolderPermissionManage',
  mixins: [CmpListMixin],
  components: {
    JSelectUserNew,
    JSelectDepart,
    SelectRoleModal
  },
  data() {
    return {
      banner:true,
      alertShown: false,
      roleVisible: false,
      userShown: false,
      roleShown: false,
      model:{},
      departShown: false,
      treeData: [],
      checkedIds: [],
      folderTree: [],
      defaultCheckedKeys: [],
      checkedKeys: [],
      iExpandedKeys: [],
      expandedKeysss: [],
      allTreeKeys: [],
      //   autoExpandParent: true,
      checkStrictly: true,
      title: '文件夹权限配置',
      loading: false,
      form: this.$form.createForm(this),
      url: {
        wholeTree: '/fileFolderFile/folder/tree', // 获取本企业/项目整个文件夹树;`
        folderPermissionManage: '/fileFolderFile/filePermission/add', // 将文件夹及其下所有子节点授权用户/角色/部门;`
        initDepFolderAndPer: '/fileFolderFile/initDepartmentFolderAndPermission' // 数据清空后从部门表获取数据作为初始化部门文件夹
      },
      selectUser: ['auditUsers1'],
      auditUsers1: {
        colum: 'auditUsers1',
        value: [],
        target: [{ to: 'userNames', from: 'username' }]
      },
      validatorRules: {
        userNames: { rules: [{ required: true, message: '授权具体用户不能为空！' }] },
        departmentIds: { rules: [{ required: true, message: '授权具体部门不能为空！' }] }
      }
    }
  },
  methods: {
    SelectRoleModal() {
      this.roleVisible = true
    },
    SelectRoleHandlCancel() {
      this.roleVisible = false // 组件点击关闭按钮，触发本回调方法，将组件的显隐状态置为false，隐藏本组件
    },
    SelectRole(record) {
      // 组件点击选择按钮，触发本回调方法，完成以下字段的回填
      this.roleVisible = false // 隐藏本组件
      const that = this
      console.log(record, '选择的角色的全部信息')

      that.$nextTick(() => {
        //异步
        that.model = { id: record.id }
        that.form.setFieldsValue({ roleIds: record.roleName })
      })
    },
    loadData() {
      this.reset()
      this.loadTree()
    },
    // 类型选择器相关-开始：
    onSelect(value) {
      if (value == 'user') {
        this.userShown = true
        this.departShown = false
        this.roleShown = false
      } else if (value == 'department') {
        this.userShown = false
        this.departShown = true
        this.roleShown = false
      } else {
        this.userShown = false
        this.departShown = false
        this.roleShown = true
      }
    },
    // 类型选择器相关-结束；
    // 文件夹树相关-开始：
    onCheck(o, e) {
      console.log(o, 'o')
      console.log(e, 'e')
      // this.checkedKeys = e.node.dataRef.id
      if (this.checkStrictly) {
        this.checkedKeys = o.checked
        // console.log(this.checkedKeys)
      } else {
        this.checkedKeys = o
        // console.log(this.checkedKeys)
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeysss = expandedKeys
      //   this.autoExpandParent = false
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.id)
        for (let a = 0; a < node.children.length; a++) {
          node.children[a].title = node.children[a].name
          node.children[a].key = node.children[a].id
          this.setThisExpandedKeys(node.children[a])
        }
      }
      // console.log(node.children)
    },
    loadTree() {
      // 文件夹目录树加载
      var that = this
      that.treeData = []
      that.folderTree = []
      getAction(this.url.wholeTree, {}).then(res => {
        if (res.success) {
          var tree = new Array()
          tree.push(res.result)
          // console.log('res.result', res.result)
          for (let i = 0; i < tree.length; i++) {
            tree[i].title = tree[i].name
            tree[i].key = tree[i].id
            let temp = tree[i]
            that.checkedIds.push(temp.id)
            that.treeData.push(temp)
            that.folderTree.push(temp)
            that.setThisExpandedKeys(temp)
          }
          // console.log('tree', that.folderTree)
          // console.log('that.checkedIds',that.checkedIds)
          this.loading = false
          //   this.visible = true
        }
      })
    },
    reset() {
      this.form.resetFields()
      this.form.setFieldsValue({ permission: [] })
      this.form.setFieldsValue({ userNames: '' })
      this.form.setFieldsValue({ departmentIds: '' })
      this.form.setFieldsValue({ roleIds: '' })
      this.expandedKeysss = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.loading = false
    },
    closeAll() {
      this.expandedKeysss = []
    },
    switchCheckStrictly(v) {
      //父子关联/取消关联
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    },
    // 文件夹树相关-结束；
    handleSubmit() {
      // console.log('checkedKeys', this.checkedKeys)
      this.form.validateFields((err, values) => {
        // debugger
        values.fileIds = this.checkedKeys

        if (!err) {
          // console.log('values.folderIds', values.folderIds)
          if(values.fileIds.length>0){
            if (this.userShown == true) {
              values.userNames = values.userNames.split(',')
            } else if (this.departShown == true) {
              values.departmentIds = values.departmentIds.split(',')
              // console.log("values.departmentIds",values.departmentIds)
            } else {
              // console.log('roleShown',values.roleIds)
              values.roleIds = this.model.id.split(',')
            }
            // debugger
            values.permission = values.permission.join(',')
            // console.log('values', values)
            let params = {
              jsonStr: JSON.stringify(values)
            }
            postAction(this.url.folderPermissionManage, qs.stringify(params))
              .then(res => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.$emit('ok')
                } else {
                  this.$message.warning(res.message)
                }
              })
              .finally(() => {
                this.confirmLoading = false
              })
          }else{
            this.alertShown = true
          }
          
        }
      })
    },
    handleInit() {
      postAction(this.url.initDepFolderAndPer, {}).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.loadTree()
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/index.less';
.form-wrapper {
  padding: 6vh 6vw;
}
.bottom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  // border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  // right: 7vw;
  background: #fff;
  border-radius: 0 0 2px 2px;
  // .bottom-left-button{

  // }
  .bottom-right-button {
    right: 11vw;
  }
}
&.mobile {
  .form-wrapper{
    .bottom-right-button {
      right: 6vw;
    }
  }
}
</style>