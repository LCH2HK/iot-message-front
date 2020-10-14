<template>
  <a-modal
    :title="null"
    :maskClosable="false"
    :width="1000"
    :footer="null"
    placement="right"
    :closable="false"
    :visible="visible"
  >
    <!-- 标题 -->
    <div class="title">
      <div>
        <img :src="title | IconUrl"/>
        {{title}}
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel"/>
    </div>
    <!-- 表单内容 -->
    <a-spin :spinning="confirmLoading" class="spining">
      <a-form :form="form">
        <!-- 账户、姓名 -->
        <a-row :gutter="24" class="row2">
          <a-col :span="12">
            <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入用户账号"
                v-decorator="[ 'username', validatorRules.username]"
                :readOnly="!!model.id"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入用户姓名" v-decorator="[ 'realname', validatorRules.realname]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 密码、确认密码 -->
        <a-row :gutter="24" class="row2" v-if="!model.id">
          <a-col :span="12">
            <a-form-item label="登陆密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="password"
                placeholder="请输入登陆密码"
                v-decorator="[ 'password', validatorRules.password]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="password"
                @blur="handleConfirmBlur"
                placeholder="请重新输入登陆密码"
                v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 生日、性别 -->
        <a-row :gutter="24" class="row2">
          <a-col :span="12">
            <a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker
                style="width: 100%"
                placeholder="请选择生日"
                v-decorator="['birthday', {initialValue: !model.birthday ? null : moment(model.birthday,dateFormat)}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <!-- <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                v-decorator="[ 'sex', {rules:[{required: true, message: '请选择性别!' }]}]"
                placeholder="请选择性别"
              >
                <a-select-option :value="1">男</a-select-option>
                <a-select-option :value="0">女</a-select-option>
                <a-select-option :value="2">保密</a-select-option>
              </a-select>
            </a-form-item>-->
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group name="sex" v-decorator="['sex', {initialValue: 1}]">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="0">女</a-radio>
                <a-radio :value="2">保密</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 邮箱、手机 -->
        <a-row :gutter="24" class="row2">
          <a-col :span="12">
            <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入邮箱" v-decorator="[ 'email', validatorRules.email]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入手机号码"
                :disabled="disabledAuth('user:form:phone')"
                v-decorator="[ 'phone', validatorRules.phone]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 头像、图签 -->
        <a-row :gutter="24" class="row2">
          <a-col :span="12">
            <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-upload
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                :action="uploadAction"
                :data="{'isup':1}"
                :headers="headers"
                :beforeUpload="beforeUpload"
                @change="handleChange"
              >
                <img
                  v-if="picUrl"
                  :src="getAvatarView()"
                  alt="头像"
                  style="height:104px;max-width:300px"
                />
                <div v-else>
                  <a-icon :type="uploadLoading ? 'loading' : 'plus'"/>
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="签名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-upload
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="false"
                :action="uploadAction"
                :data="{'isup':1}"
                :headers="headers"
                :beforeUpload="beforeUpload"
                @change="handleChange1"
              >
                <img
                  v-if="picUrl1"
                  :src="getAvatarView1()"
                  alt="签名"
                  style="height:104px;max-width:300px"
                />
                <div v-else>
                  <a-icon :type="uploadLoading1 ? 'loading' : 'plus'"/>
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-form-item label="工作流引擎" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag
            v-decorator="['activitiSync', {}]"
            placeholder="请选择是否同步工作流引擎"
            :type="'radio'"
            :triggerChange="true"
            dictCode="activiti_sync"
          />
        </a-form-item>-->
        <!--部门、单位分配-->
        <a-row :gutter="24" class="row2" v-if="!departDisabled">
          <a-col :span="12">
            <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-tree-select
                :treeData="departTree"
                :dropdownStyle="{ maxHeight: '400px', width: '300px', overflow: 'auto' }"
                placeholder="请选择部门"
                treeDefaultExpandAll
                v-decorator="[ 'departId', {}]"
                @change="departSelected"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-tree-select
                :treeData="PrjTree"
                :dropdownStyle="{ maxHeight: '400px', width: '300px', overflow: 'auto' }"
                placeholder="请选择单位"
                treeDefaultExpandAll
                v-decorator="[ 'corporationId', {initialValue: initialcorporation}]"
              ></a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 角色分配及是否同步到通讯录 -->
        <a-row :gutter="24" class="row2">
          <a-col :span="12" v-if="!roleDisabled">
            <a-form-item label="角色分配" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                mode="multiple"
                style="width: 100%"
                placeholder="请选择用户角色"
                v-decorator="[ 'selectedRoles', validatorRules.selectedRoles]"
              >
                <a-select-option
                  v-for="(role,roleindex) in roleList"
                  :key="roleindex.toString()"
                  :value="role.id"
                >{{ role.roleName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--新增时是否同步到通讯录-->
          <a-col :span="12" v-if="title == '新增'||title == '编辑'">
            <a-form-item label="同步到通讯录" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group name="radioGroup" v-decorator="['toUserMail', {initialValue:true}]">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- <div class="drawer-bootom-button" v-show="!disableSubmit">
          <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
            <a-button style="margin-right: .8rem">取消</a-button>
          </a-popconfirm>
          <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
        </div>-->
        <!-- 按钮 -->
        <a-row :gutter="24" v-if="!disableSubmit">
          <a-col :span="24">
            <a-form-item class="btnClass">
              <a-button
                @click="handleCancel"
                icon="close"
                style="margin-right:10px"
                class="cancel"
              >关闭
              </a-button>
              <a-button
                @click="handleSubmit"
                icon="check"
                type="primary"
                style="margin-right:10px"
                class="confirm"
              >提交
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import Vue from 'vue'
  // 引入搜索部门弹出框的组件
  import departWindow from './DepartWindow'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { getAction, httpAction } from '@/api/manage'
  import { addUser, editUser, queryUserRole, queryall, checkUsername } from '@/api/api'
  import { disabledAuthFilter } from '@/utils/authFilter'
  import { queryIdTree } from '@/api/api'

  export default {
    name: 'RoleModal',
    components: {
      departWindow
    },
    // props:['roleId'],
    data() {
      return {
        departDisabled: false, //是否是我的部门调用该页面
        deptId: '',
        roleId:'',
        roleDisabled: false, //是否是角色维护调用该页面
        modalWidth: 800,
        drawerWidth: 700,
        modaltoggleFlag: true,
        toUserMail: true,
        confirmDirty: false,
        selectedDepartKeys: [], //保存用户选择部门id
        checkedDepartKeys: [],
        checkedDepartNames: [], // 保存部门的名称 =>title
        checkedDepartNameString: '', // 保存部门的名称 =>title
        checkedPrjNameString: '', // 保存单位名称
        userId: '', //保存用户id
        disableSubmit: false,
        userDepartModel: { userId: '', departIdList: [] }, // 保存SysUserDepart的用户部门中间表数据需要的对象
        dateFormat: 'YYYY-MM-DD',
        validatorRules: {
          username: {
            rules: [
              {
                required: true,
                message: '请输入用户账号!'
              },
              {
                validator: this.validateUsername
              }
            ]
          },
          password: {
            rules: [
              {
                required: true,
                message: '请输入密码!'
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          },
          confirmpassword: {
            rules: [
              {
                required: true,
                message: '请重新输入登陆密码!'
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          },
          realname: { rules: [{ required: true, message: '请输入用户名称!' }] },
          selectedRoles: { rules: [{ required: true, message: '请选择所属部门!' }] },
          phone: { rules: [{ validator: this.validatePhone }] },
          email: { rules: [{ type: 'email', message: '请输入正确格式的电子邮箱!' }] },
          roles: {}
          //  sex:{initialValue:((!this.model.sex)?"": (this.model.sex+""))}
        },
        title: '操作',
        visible: false,
        model: {},
        roleList: [],
        selectedRole: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        labelCol21: {
          xs: { span: 24 },
          sm: { span: 10 }
        },
        wrapperCol21: {
          xs: { span: 24 },
          sm: { span: 14 }
        },
        labelCol22: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol22: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        uploadLoading: false,
        uploadLoading1: false,
        confirmLoading: false,
        headers: {},
        form: this.$form.createForm(this),
        picUrl: '',
        picUrl1: '',
        url: {
          addUDepartIds: '/sys/user/addUDepartIds', // 引入为用户添加部门信息需要的url
          editUDepartIds: '/sys/user/editUDepartIds', // 引入为用户更新部门信息需要的url
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          userWithDepart: '/sys/user/getDepartByOrgPathId', // 引入为指定用户查看部门信息需要的url
          userId: '/sys/user/generateUserId', // 引入生成添加用户情况下的url
          syncUserByUserName: '/process/extActProcess/doSyncUserByUserName', //同步用户到工作流
          addToMail: '/mailList/mailList/add', //添加到用户通讯录
          parentDeparts: '/sysdepart/sysDepart/listParentDeparts' //通过部门节点查询该部门这条线列表
        },
        departTree: [], // 部门树
        PrjTree: [], // 企业树
        initialcorporation: '' // 默认企业名称
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      console.log('新增用户对话框：roleId=>',this.roleId)
    },
    computed: {
      // 上传url
      uploadAction: function() {
        return this.url.fileUpload
      }
    },
    filters: {
      IconUrl(val) {
        switch (val) {
          case '新增':
            return require(`@/assets/img/login/add.png`)
            break
          case '编辑':
            return require(`@assets/img/login/edit.png`)
            break
          case '查看':
            return require(`@assets/img/login/view.png`)
            break
          case '审核':
            return require(`@assets/img/login/audit.png`)
            break
          default:
            break
        }
      }
    },
    methods: {
      disabledAuth(code) {
        return disabledAuthFilter(code)
      },
      //窗口最大化切换
      toggleScreen() {
        if (this.modaltoggleFlag) {
          this.modalWidth = window.innerWidth
        } else {
          this.modalWidth = 800
        }
        this.modaltoggleFlag = !this.modaltoggleFlag
      },
      // 获取角色列表
      initialRoleList() {
        console.log('usermodal:initialRoleList()方法被调用')
        queryall().then(res => {
          console.log('usermodal:queryall result=>',res)
          if (res.success) {
            console.log('usermodal:initialRoleList=>成功')
            this.roleList = res.result
          } else {
            console.log('usermodal:initialRoleList=>失败')
            console.log(res.message)
          }
        })
      },
      // 查询用户角色信息
      loadUserRoles(userid) {
        queryUserRole({ userId: userid }).then(res => {
          if (res.success) {
            let userRoles = res.result,
              selectedRoles = []
            for (let i = 0, len = userRoles.length; i < len; i++) {
              selectedRoles.push(userRoles[i].id)
            }
            console.log(selectedRoles, 'selectedRoles')
            this.$nextTick(() => {
              this.form.setFieldsValue({ selectedRoles: selectedRoles })
            })
          } else {
            console.log(res.message)
          }
        })
      },
      // 重置数据
      refresh() {
        this.selectedDepartKeys = []
        this.checkedDepartKeys = []
        this.checkedDepartNames = []
        this.checkedDepartNameString = ''
        this.userId = ''
      },
      // 添加用户
      add() {
        this.picUrl = ''
        this.picUrl1 = ''
        this.refresh()
        this.edit({})
      },
      edit(record) {
        console.log(record, 'record')
        this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        let that = this
        that.initialRoleList()
        that.queryDepartTree()
        that.checkedDepartNameString = ''
        that.form.resetFields()
        if (record.hasOwnProperty('id')) {
          that.loadUserRoles(record.id)
          this.picUrl = 'Has no pic url yet'
          this.picUrl1 = 'Has no pic url yet'
        }
        that.userId = record.id || null
        that.visible = true
        that.model = Object.assign({}, record)
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model, 'username', 'realname', 'sex', 'email', 'phone'))
        })
        // 调用查询用户对应的部门信息的方法
        that.checkedDepartKeys = []
        that.loadCheckedDeparts(record)
        console.log('title', this.title)
      },
      //获取选择用户部门及企业
      loadCheckedDeparts(record) {
        let that = this
        if (!that.userId) {
          return
        }
        let params = {
          defaultOrgPathId: record.defaultOrgPathId,
          orgPathId: record.orgPathId
        }
        getAction(that.url.userWithDepart, params).then(res => {
          that.checkedDepartNames = []
          if (res.success) {
            /* for (let i = 0; i < res.result.length; i++) {
              that.checkedDepartNames.push(res.result[i].title)
              this.checkedDepartNameString = this.checkedDepartNames.join(',')
              that.checkedDepartKeys.push(res.result[i].key)
            } */
            let corporationId = res.result.corporation.id,
              departId = res.result.depart.id
            this.departSelected(departId)
            this.$nextTick(() => {
              this.form.setFieldsValue({ corporationId: corporationId, departId: departId })
            })
          } else {
            console.log(res.message)
          }
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.disableSubmit = false
        this.selectedRole = []
        this.userDepartModel = {}
        this.checkedDepartNames = []
      },
      moment,
      // 提交表单

      handleSubmit() {
        console.log(this.departDisabled)
        console.log(this.roleDisabled)
        if (this.departDisabled === true) {
          this.handleSubmitDepart()
          return
        } else if (this.roleDisabled === true) {
          this.handleSubmitRole()
          return
        }
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let avatar = that.model.avatar
            if (!values.birthday) {
              values.birthday = ''
            } else {
              values.birthday = values.birthday.format(this.dateFormat)
            }
            let formData = Object.assign(this.model, values)
            formData.avatar = avatar
            formData.selectedRoles = formData.selectedRoles.length > 0 ? formData.selectedRoles.join(',') : ''
            // formData.toUserMail = this.toUserMail ? true : false
            //that.addDepartsToUser(that, formData) // 调用根据当前用户添加部门信息的方法
            let obj
            if (!this.model.id) {
              formData.id = this.userId
              obj = addUser(formData)
              //同步到通讯录
              /* if (this.toUserMail) {
                let formData1 = JSON.parse(JSON.stringify(formData))
                let httpurl = ''
                httpurl += this.url.addToMail
                formData1.userType = 1
                formData1.birthday = null
                httpAction(httpurl, qs.stringify(formData1), method).then(res => {
                  if (res.success) {
                    //*that.$message.success("已经同步到通讯录");
                    that.$emit('ok')
                  } else {
                    that.$message.warning(res.message)
                  }
                })
              } */
            } else {
              obj = editUser(formData)
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
                that.checkedDepartNames = []
                that.close()
              })
          }
        })
      },
      // 提交表单（我的部门调用)
      handleSubmitDepart() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let avatar = that.model.avatar
            if (!values.birthday) {
              values.birthday = ''
            } else {
              values.birthday = values.birthday.format(this.dateFormat)
            }
            let formData = Object.assign(this.model, values)
            formData.avatar = avatar
            formData.selectedRoles = formData.selectedRoles.length > 0 ? formData.selectedRoles.join(',') : ''
            //生成userId
            getAction(this.url.userId).then(res => {
              if (res.success) {
                this.userId = res.result
                console.log('generateUserId:' + this.userId)
                formData.id = that.userId
                console.log('formData.id:' + formData.id)
                this.addDepartsToUser1(that, formData) // 调用根据当前用户添加部门信息的方法
                addUser(formData)
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
                    that.checkedDepartNames = []
                    that.close()
                  })
              }
            })
          }
        })
      },
      //提交表单（角色维护调用）
      handleSubmitRole() {
        console.log('usermodal:handlesubmitrole() invoked')
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          console.log('handleSubmitRole:表单验证结束')
          console.log('err=>',err)
          console.log('values=>',values)
          console.log('roleId=>',this.roleId)
          if (!err) {
            that.confirmLoading = true
            let avatar = that.model.avatar
            if (!values.birthday) {
              values.birthday = ''
            } else {
              values.birthday = values.birthday.format(this.dateFormat)
            }
            let formData = Object.assign(this.model, values)
            formData.avatar = avatar
            //通过用户管理模块进入
            if(formData.selectedRoles!=undefined){
              formData.selectedRoles = formData.selectedRoles.length > 0 ? formData.selectedRoles.join(',') : ''
            }else{
              //通过角色用户管理模块进入
              formData.selectedRoles=that.roleId
            }
            console.log(formData.selectedRoles)
            // 为当前用户添加部门
            that.addDepartsToUser(that, formData)
            let obj
            if (!this.model.id) {
              formData.id = this.userId
              obj = addUser(formData)
            } else {
              obj = editUser(formData)
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
                that.checkedDepartNames = []
                that.close()
              })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      // 根据当前用户添加部门信息的方法
      addDepartsToUser(that, formData) {
        let httpurl = ''
        let method = ''
        //编辑时formData.id不为空，新增时是空
        if (this.userDepartModel.userId != formData.id) {
          httpurl += this.url.addUDepartIds
          method = 'post'
        } else {
          httpurl += this.url.editUDepartIds
          method = 'post' // put修改
        }
        httpAction(httpurl, this.userDepartModel, method).then(res => {
          if (res.success) {
            this.userDepartModel = {}
          } else {
            that.$message.warning(res.message)
          }
        })
      },
      // 根据当前用户添加部门信息的方法（我的部门调用）
      addDepartsToUser1: function() {
        let httpurl = ''
        let method = ''
        httpurl += this.url.addUDepartIds
        method = 'post'
        let departIdList = []
        departIdList.push(this.deptId)
        httpAction(httpurl, { userId: this.userId, departIdList: departIdList }, method).then(res => {
          if (res.success) {
            this.userId = ''
            this.deptId = ''
            this.departIdList = []
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      validateToNextPassword(rule, value, callback) {
        const form = this.form
        const confirmpassword = form.getFieldValue('confirmpassword')
        if (value && confirmpassword && value !== confirmpassword) {
          callback('两次输入的密码不一样！')
        }
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback()
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.form
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不一样！')
        } else {
          callback()
        }
      },
      validatePhone(rule, value, callback) {
        if (!value || new RegExp(/^1[3|4|5|7|8][0-9]\d{8}$/).test(value)) {
          callback()
        } else {
          callback('请输入正确格式的手机号码!')
        }
      },
      validateUsername(rule, value, callback) {
        var params = {
          id: this.model.id,
          username: value
        }
        checkUsername(params).then(res => {
          if (res.success) {
            callback()
          } else {
            callback('用户账号已存在！')
          }
        })
      },
      handleConfirmBlur(e) {
        const value = e.target.value
        this.confirmDirty = this.confirmDirty || !!value
      },
      normFile(e) {
        console.log('Upload event:', e)
        if (Array.isArray(e)) {
          return e
        }
        return e && e.fileList
      },
      beforeUpload: function(file) {
        var fileType = file.type
        if (fileType.indexOf('image') < 0) {
          this.$message.warning('请上传图片')
          return false
        }
        //TODO 验证文件大小
      },
      handleChange(info) {
        this.picUrl = ''
        if (info.file.status === 'uploading') {
          this.uploadLoading = true
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response
          this.uploadLoading = false
          console.log(response)
          if (response.success) {
            this.model.avatar = response.message
            this.picUrl = 'Has no pic url yet'
          } else {
            this.$message.warning(response.message)
          }
        }
      },
      handleChange1(info) {
        this.picUrl1 = ''
        if (info.file.status === 'uploading') {
          this.uploadLoading1 = true
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response
          this.uploadLoading1 = false
          console.log(response)
          if (response.success) {
            this.model.attachmentAutograph = response.message
            this.picUrl1 = 'Has no pic url yet'
          } else {
            this.$message.warning(response.message)
          }
        }
      },
      getAvatarView() {
        return this.url.imgerver + '/' + this.model.avatar
      },
      getAvatarView1() {
        return this.url.imgerver + '/' + this.model.attachmentAutograph
      },
      // 搜索用户对应的部门API
      onSearch() {
        console.log(this.userId, 'this.userId')
        this.$refs.departWindow.add(this.checkedDepartKeys, this.userId)
      },
      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk(formData) {
        console.log('usermodal:modalFormOk() invoked')
        this.checkedDepartNames = []
        this.selectedDepartKeys = []
        this.userId = formData.userId
        this.userDepartModel.userId = formData.userId
        for (let i = 0; i < formData.departIdList.length; i++) {
          this.selectedDepartKeys.push(formData.departIdList[i].key)
          this.checkedDepartNames.push(formData.departIdList[i].title)
          this.checkedDepartNameString = this.checkedDepartNames.join(',')
        }
        this.userDepartModel.departIdList = this.selectedDepartKeys
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
      // 获取部门树形结构
      queryDepartTree() {
        queryIdTree().then(res => {
          if (res.success) {
            this.departTree = res.result
          } else {
            console.log(res.message)
          }
        })
      },
      // 选择部门后，获取默认企业名称
      departSelected(value) {
        const that = this
        if (value) {
          let url = this.url.parentDeparts,
            params = { departId: value }
          getAction(url, params).then(res => {
            if (res.success) {
              this.PrjTree = res.result
              if (this.PrjTree && this.PrjTree.length > 0) {
                if (this.PrjTree[0].children && this.PrjTree[0].children.length > 0) {
                  this.initialcorporation = this.PrjTree[0].children[0].key
                } else {
                  this.initialcorporation = this.PrjTree[0].key
                }
                this.$nextTick(() => {
                  this.form.setFieldsValue({ corporationId: this.initialcorporation })
                })
              }
            } else {
              console.log(res.message)
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';

  .spining {
    padding-top: 20px;
  }

  .avatar-uploader > .ant-upload {
    width: 104px;
    height: 104px;
  }

  .ant-upload-select-picture-card i {
    font-size: 49px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }

  /* .row2 {
    margin-left: 0 !important;
    margin-right: 0 !important;

    & .ant-col-12 {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  } */
</style>