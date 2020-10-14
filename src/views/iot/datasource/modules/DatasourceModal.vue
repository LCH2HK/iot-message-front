<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;"
  >
    <div class="title">
      <div>
        <img :src="title | IconUrl"/>
        {{ title }}
        <span>{{ nodeName ? '(' + nodeName + ')': '' }}</span>
        <a-tooltip placement="rightTop" :title="hint">
          <a-icon type="question-circle"/>
        </a-tooltip>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel"/>
    </div>
    <!-- 无流程样式div-->
    <div style="height:16px;"></div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="标识符"
            >
              <a-input
                placeholder="请输入数据源标识符"
                v-decorator="['dbKey', validatorRules.dbKey]"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="名称"
            >
              <a-input
                placeholder="请输入数据源名称"
                v-decorator="['name', validatorRules.name]"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="用户名"
            >
              <a-input
                placeholder="请输入数据源用户名"
                v-decorator="['username', validatorRules.username]"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="密码"
            >
              <a-input
                placeholder="请输入数据源密码"
                :type="pswType"
                v-decorator="['password', validatorRules.password]"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              >
                <a-icon
                  slot="suffix"
                  @click="changePswType('show')"
                  type="eye-invisible"
                  v-if="pswType == 'password'"
                />
                <a-icon
                  slot="suffix"
                  @click="changePswType('hidden')"
                  type="eye"
                  v-if="pswType == 'text'"
                />
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="类型"
            >
              <a-radio-group
                v-decorator="['dbType', validatorRules.dbType]"
                buttonStyle="solid"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              >
                <a-radio-button value="com.mysql.jdbc.Driver">Mysql</a-radio-button>
                <a-radio-button value="dm.jdbc.driver.DmDriver">达梦</a-radio-button>
                <!--                <a-radio-button value="com.microsoft.sqlserver.jdbc.SQLServerDriver">Sqlserver</a-radio-button>-->
                <!--                <a-radio-button value="oracle.jdbc.driver.OracleDriver">Oracle</a-radio-button>-->
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="16">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              label="地址"
            >
              <a-input
                placeholder="请输入数据源地址，例如jdbc:mysql://localhost:3306/cmp?characterEncoding=UTF-8&useUnicode=true&useSSL=false"
                v-decorator="['url', validatorRules.url]"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="16">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              label="描述"
            >
              <a-textarea
                placeholder="请输入数据源描述"
                v-decorator="['dbDescription', validatorRules.dbDescription]"
                :autosize="{minRows: 3, maxRows: 6}"
                :disabled="this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看'"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button
                @click="handleTest"
                icon
                v-if="title !== '查看'"
                type="primary"
                class="confirm"
              >测试连接
              </a-button>
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
                v-if="title !== '查看' "
              >{{ model.status == undefined ? '确定' : '提交' }}
              </a-button>
              <a-button @click="handleCancel" icon="close" v-if="true" class="cancel">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import qs from 'qs'
  import { normalValidate, unitValidate, specialValidate, dbUrlValidate, charNumValidate } from '../../js/iot_validate'
  import { codeValidate } from '@/views/iot/js/iot_validate'

  export default {
    name: 'DatasourceModal',
    //组件应用定义
    components: {
      JDictSelectTag,
      JSelectUserNew
    },
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins: [CmpListMixin],
    // 数据定义
    data() {
      return {
        title: '操作',
        nodeName: '',
        visible: false,
        nodeId: '',
        model: {},
        //连接测试控制标记
        linkCheckCount: -1,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 21 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          dbKey: { rules: [{ required: true, message: ' ' }, { validator: this.validatorKey }] },
          name: { rules: [{ required: true, message: ' ' }, { validator: this.validateDSName }] },
          username: { rules: [{ required: true, message: ' ' }, { validator: this.validateUsername }] },
          password: { rules: [{ required: false, message: ' ' }, { validator: this.validatePassword }] },
          url: { rules: [{ required: true, message: ' ' }, { validator: this.validateDBUrl }] },
          dbType: { rules: [{ required: true, message: '请选择数据库类型！' }] },
          dbDescription: { rules: [{ required: false, message: ' ' }] }
        },
        url: {
          add: '/Datasource/Datasource/add',
          edit: '/Datasource/Datasource/edit',
          test: '/Datasource/Datasource/test',
          //上传组件地址
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById',
          duplicateCheck: '/Datasource/Datasource/duplicateCheck'
        },
        // 上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
        attachment: [],
        pswType: 'password'
      }
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
    // 钩子函数
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      // 初始化tokens
      this.initTokens()
    },
    // 计算属性
    computed: {
      uploadAction: function() {
        return this.url.fileUpload
      },
      disabledBtn() {
        return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
      },
      hint() {
        let hintMsg = ''
        switch (this.title) {
          case '新增':
            hintMsg = '新增一个数据源，并添加其基本属性'
            break
          case '编辑':
            hintMsg = '编辑数据源的基本属性'
            break
          case '查看':
            hintMsg = '查看数据源的基本属性'
            break
          default:
            hintMsg = '数据源的基本属性'
        }
        return hintMsg
      }
    },
    //方法
    methods: {
      loadData() {
      },
      add() {
        this.edit({})
      },
      moment,
      edit(record) {
        this.form.resetFields()
        if (record.nodeId != undefined) {
          this.nodeId = record.nodeId
        }
        if (record.nodeName != undefined) {
          this.nodeName = record.nodeName
        }
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(this.model, 'name', 'dbKey', 'username', 'password', 'url', 'dbType', 'dbDescription')
          )
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.fileList = []
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let actionUrl = ''
            let method = 'post'
            //判断操作类型，新增或者编辑
            if (!this.model.id) {
              actionUrl += this.url.add
            } else {
              actionUrl += this.url.edit
            }
            // 表单数据赋值给formData
            let formData = Object.assign(this.model, values)
            console.log('查看formData', formData)
            if (that.attachment.length === 1) {
              formData[that.attachment[0].fieldName] = that.attachment[0].groupId
            } else {
              for (let i = 0; i < that.attachment.length; i++) {
                formData[that.attachment[i].fieldName] = that.attachment[i].groupId
              }
            }
            //测试连接
            console.log('before test')
            httpAction(this.url.test, qs.stringify(formData), method).then(res => {
              console.log('after test')
              if (res.success) {
                that.$message.success(res.message)
                that.linkCheckCount = 1
                that.$emit('ok')
              } else {
                that.linkCheckCount = 0
                that.$message.error('数据源连接测试失败')
              }
              if (that.linkCheckCount <= 0) {
                that.confirmLoading = false
                return
              } else {
                //发起提交或保存请求
                httpAction(actionUrl, qs.stringify(formData), method)
                  .then(res => {
                    if (res.success) {
                      that.$message.success(res.message)
                      that.$emit('ok')
                    } else {
                      that.$message.error('操作失败')
                    }
                  })
                  .finally(() => {
                    that.confirmLoading = false
                    that.close()
                  })
              }
            })
          }
        })
      },
      handleChange(info) {
        //调用改变方法
        this.handleChange1(info, this, 0)
      },
      handlePicCancel() {
        this.previewVisible = false
      },
      handleCancel() {
        this.close()
      },
      //连接测试
      handleTest() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            // 表单数据赋值给formData
            let method = 'post'
            let formData = Object.assign(this.model, values)
            console.log('查看formData', formData)

            //发起提交或保存请求
            httpAction(this.url.test, qs.stringify(formData), method)
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.linkCheckCount = 1
                  that.$emit('ok')
                } else {
                  that.linkCheckCount = 0
                  that.$message.error('数据源连接测试失败')
                }
              })
              .finally(() => {
              })
          }
        })
      },
      initTokens() {
        if (this.attachment.length >= 1) {
          for (let i = 0; i < this.attachment.length; i++) {
            this.attachment[i].fileTokens = ''
          }
        }
      },

      //数据源标识符校验
      validatorKey(rule, value, callback) {
        let label = '数据源标识符'
        let length = [1, 32]
        let val = value ? value : ''
        if (val.length === 0) {
          callback('请填写' + label + '！')
        } else if (/[\s+]/g.test(value)) {
          callback('不可添加空格!')
        } else if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback('不可输入汉字!')
        } else if (val.length < length[0]) {
          callback('最少输入' + length[0] + '个字')
        } else if (val.length > length[1]) {
          callback('最多输入' + length[1] + '个字')
        } else {
          let params = {
            id: this.model.id,
            code: val.trim()
          }
          let method = 'post'
          httpAction(this.url.duplicateCheck, params, method).then(res => {
            if (res.success) {
              callback()
            } else {
              callback(res.message)
            }
          })
        }
      },
      //数据源名称校验
      validateDSName(rule, value, callback) {
        let label = '数据源名称'
        let length = [1, 32]
        normalValidate(label, length, rule, value, callback)
      },
      validateDBUrl(rule, value, callback) {
        let label = '数据源地址'
        let length = [1, 255]
        dbUrlValidate(label, length, rule, value, callback)
      },
      // 浠水项目配置无密码，暂时去除
      // validatePassword(rule, value, callback) {
      //   let label = '密码'
      //   let length = [1, 32]
      //   codeValidate(label, length, rule, value, callback)
      // },
      // validateDesc(rule, value, callback) {
      //     let label = '数据源描述'
      //     let length = [0, 255]
      //     charNumValidate(label, length, rule, value, callback)
      // },
      changePswType(toType) {
        if (toType == 'show') {
          this.pswType = 'text'
        }
        if (toType == 'hidden') {
          this.pswType = 'password'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';

  /deep/ .ant-radio-button-wrapper-disabled {
    span {
      color: rgba(0, 0, 0, 0.55);
    }
  }

  /deep/ .ant-radio-button-wrapper-checked {
    span {
      color: rgba(0, 0, 0, 0.85);
    }
  }
</style>