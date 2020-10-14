<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="drawerWidth"
    @cancel="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <div class="title">
      <div>
        <img :src="title | IconUrl" />
        {{ title }}
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="菜单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group @change="onChangeMenuType" v-decorator="['menuType',{'initialValue':0}]">
            <a-radio :value="0">一级菜单</a-radio>
            <a-radio :value="1">子菜单</a-radio>
            <a-radio :value="2">按钮/权限</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="menuLabel" hasFeedback>
          <a-input
            placeholder="请输入菜单名称"
            v-decorator="[ 'name', validatorRules.name]"
            :readOnly="disableSubmit"
          />
        </a-form-item>

        <a-form-item
          v-show="localMenuType!=0"
          label="上级菜单"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="treeData"
            v-model="model.parentId"
            placeholder="请选择父级菜单"
            :disabled="disableSubmit"
          ></a-tree-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback label="菜单路径">
          <a-input
            placeholder="请输入菜单路径"
            v-decorator="[ 'url', validatorRules.url]"
            :readOnly="disableSubmit"
          />
        </a-form-item>

        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
          label="前端组件"
        >
          <a-input
            placeholder="请输入前端组件"
            v-decorator="[ 'component', {initialValue: 'layouts/RouteView', rules: [{ required :true, message: '请输入前端组件'}]}]"
            :readOnly="disableSubmit"
          />
        </a-form-item>

        <a-form-item
          v-show="localMenuType==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="默认跳转地址"
        >
          <a-input
            placeholder="请输入路由参数 redirect"
            v-decorator="[ 'redirect', validatorRules.redirectUrl]"
            :readOnly="disableSubmit"
          />
        </a-form-item>

        <a-form-item v-show="!show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="授权标识">
          <a-input
            placeholder="多个用逗号分隔, 如: user:list,user:create"
            v-decorator="[ 'perms', {}]"
            :readOnly="disableSubmit"
          />
        </a-form-item>

        <a-form-item v-show="!show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="授权策略">
          <j-dict-select-tag
            v-decorator="['permsType', {}]"
            placeholder="请选择授权策略"
            :type="'radio'"
            :triggerChange="true"
            dictCode="global_perms_type"
          />
        </a-form-item>
        <a-form-item v-show="!show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <j-dict-select-tag
            v-decorator="['status', {}]"
            placeholder="请选择状态"
            :type="'radio'"
            :triggerChange="true"
            dictCode="valid_status"
          />
        </a-form-item>

        <a-form-item
          v-show="localMenuType==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="菜单图标"
        >
          <a-input placeholder="点击右侧按钮选择图标" v-model="model.icon" :readOnly="true">
            <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
          </a-input>
        </a-form-item>

        <a-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input-number
            placeholder="请输入菜单排序"
            style="width: 200px"
            :min="0"
            v-decorator="[ 'sortNo', {'initialValue':1.0,'rule':validatorRules.sortNo}]"
            :readOnly="disableSubmit"
          />
        </a-form-item>

        <a-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否路由菜单">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="routeSwitch" />
        </a-form-item>

        <a-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="隐藏路由">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="menuHidden" />
        </a-form-item>

        <a-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="聚合路由">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="alwaysShow" />
        </a-form-item>
      </a-form>

      <!-- 选择图标 -->
      <icons
        @choose="handleIconChoose"
        @close="handleIconCancel"
        :iconChooseVisible="iconChooseVisible"
      ></icons>
    </a-spin>

    <!-- <a-row :style="{textAlign:'right'}">
      <a-button :style="{marginRight: '8px'}" @click="handleCancel">关闭</a-button>
      <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
    </a-row>-->
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item class="btnClass">
          <a-button @click="handleCancel" class="cancel">关闭</a-button>
          <a-button :disabled="disableSubmit" @click="handleOk" type="primary" class="confirm">确定</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import Icons from '../../system/modules/icon/Icons'
import pick from 'lodash.pick'
import { getAction, putAction, postAction } from '@/api/manage'

export default {
  name: 'ProjectMenuModal',
  components: { Icons },
  props: {
    projectId: {
      type: String,
      default: ''
    } 
  },
  data() {
    return {
      drawerWidth: 700,
      treeData: [],
      treeValue: '0-0-4',
      title: '操作',
      visible: false,
      disableSubmit: false,
      model: {},
      localMenuType: '1',
      alwaysShow: false, //表单元素-聚合路由
      menuHidden: false, //表单元素-隐藏路由
      routeSwitch: true, //是否路由菜单
      show: true, //根据菜单类型，动态显示隐藏表单元素
      menuLabel: '菜单名称',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入菜单名称!' }, {max: 30, message: '最多输入30个字！'} , {validator: this.ifName}] },
        url: { rules: [{required: true, message: '请输入菜单路径'}, {max: 100, message: '最多输入100个字！'}, {validator: this.ifUrl}]},
        redirectUrl: {rules: [{max: 100, message: '最多输入100个字！'}, {validator: this.ifRedirectUrl}]},
        permsType: { rules: [{ required: true, message: '请输入授权策略!' }] },
        sortNo: { rules: [{ validator: this.validateNumber }] }
      },
      iconChooseVisible: false
    }
  },
  created() {
    this.initDictConfig()
  },
  filters: {
    IconUrl(val) {
      switch (val) {
        case '新增':
          return require(`@/assets/img/login/add.png`)
        case '编辑':
          return require(`@assets/img/login/edit.png`)
        case '查看':
          return require(`@assets/img/login/view.png`)
        case '审核':
          return require(`@assets/img/login/audit.png`)
        default:
          break
      }
    }
  },
  methods: {
    loadTree() {
      var that = this
      getAction('/sys/permission/queryTreeList?projectId=' + this.projectId).then(res => {
        if (res.success) {
          that.treeData = []
          let treeList = res.result.treeList
          for (let a = 0; a < treeList.length; a++) {
            let temp = treeList[a]
            temp.isLeaf = temp.leaf
            that.treeData.push(temp)
          }
        }
      })
    },
    add() {
      // 默认值
      this.edit({ status: '1', permsType: '1', route: true })
    },
    edit(record) {
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.form.resetFields()
      this.model = Object.assign({}, record)
      //--------------------------------------------------------------------------------------------------
      //根据菜单类型，动态展示页面字段
      this.alwaysShow = !record.alwaysShow ? false : true
      this.menuHidden = !record.hidden ? false : true
      if (record.route != null) {
        this.routeSwitch = record.route ? true : false
      }

      this.show = record.menuType == 2 ? false : true
      this.menuLabel = record.menuType == 2 ? '按钮/权限' : '菜单名称'

      if (this.model.parentId) {
        this.localMenuType = 1
      } else {
        this.localMenuType = 0
      }
      //----------------------------------------------------------------------------------------------

      this.visible = true
      this.loadTree()
      let fieldsVal = pick(this.model, 'name', 'perms', 'permsType', 'redirect', 'component', 'url', 'sortNo', 'menuType', 'status')
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldsVal)
      })
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          this.model.alwaysShow = this.alwaysShow
          this.model.hidden = this.menuHidden
          this.model.route = this.routeSwitch
          let formData = Object.assign(this.model, values)
          // 去空格
          formData.name = formData.name.trim();
          let obj
          if (!this.model.id) {
            obj = postAction('/sys/permission/add?projectId=' + this.projectId, formData)
          } else {
            obj = putAction('/sys/permission/edit', formData)
          }
          obj
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateNumber(rule, value, callback) {
      if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
        callback()
      } else {
        callback('请输入正整数!')
      }
    },
    onChangeMenuType(e) {
      this.localMenuType = e.target.value
      if (e.target.value == 2) {
        this.show = false
        this.menuLabel = '按钮/权限'
      } else {
        this.show = true
        this.menuLabel = '菜单名称'
      }
    },
    selectIcons() {
      this.iconChooseVisible = true
    },
    handleIconCancel() {
      this.iconChooseVisible = false
    },
    handleIconChoose(value) {
      this.model.icon = value
      this.form.icon = value
      this.iconChooseVisible = false
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    initDictConfig() {},
    ifName(rule, value, callback) {
      if (value && value.trim() == '' && value !== '') {
        callback('菜单名称两边不能有空格！');
      } else {
        callback();
      }
    },
    ifUrl(rule, value, callback) {
      if (value && value.trim() == '' && value !== '') {
        callback('菜单路径两边不能有空格！');
      } else if (new RegExp(/[\u4E00-\u9FA5]/).test(value) || /[@#\$%\^&\*]+/g.test(value)) {
        callback('路径不能有中文汉字或者非法字符！');
      } else {
        callback();
      }
    },
    ifRedirectUrl(rule, value, callback) {
      if (value && value.trim() == '' && value !== '') {
        callback('默认跳转地址两边不能有空格！');
      } else {
        callback();
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
.title {
  margin-bottom: 10px;
}
</style>