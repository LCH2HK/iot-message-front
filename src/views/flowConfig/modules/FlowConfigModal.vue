<template>
  <a-modal
    :title="title"
    :footer="null"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="流程定义key">
              <a-input placeholder="请输入流程定义key" v-decorator="['processDefinitionKey', validatorRules.processDefinitionKey]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="流程名称">
              <a-input placeholder="请输入流程名称" v-decorator="['processName', {}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="表单名称">
              <a-input placeholder="请输入表单名称" v-decorator="['formName',]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
              <a-input placeholder="请输入描述" v-decorator="['description', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="功能状态">
              <j-dict-select-tag
                v-decorator="['status', {initialValue: '0'}]"
                :triggerChange="true"
                dictCode="func_status"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属模块名称">
              <a-input placeholder="请输入所属模块名称" v-decorator="['parentMenuName', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="功能名称">
              <a-input placeholder="请输入功能名称" v-decorator="['menuName', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="访问路径">
              <a-input placeholder="请输入访问路径" v-decorator="['router', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="前端表单路径">
              <a-input placeholder="请输入前端表单路径" v-decorator="['formPath', validatorRules.formPath]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="后端包路径"
            >
              <a-input
                placeholder="请输入后端包路径"
                v-decorator="['packagePath', {}]"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实体类名">
              <a-input placeholder="请输入实体类名" v-decorator="['entityName', validatorRules.entityName]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据表名">
              <a-input placeholder="请输入数据表名" v-decorator="['formTableName', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据库名">
              <a-input placeholder="请输入数据库名" v-decorator="['formDbName', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="维护人员用户名">
              <a-input placeholder="请输入维护人员用户名" v-decorator="['maintainUserName', {}]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="维护人员姓名">
              <a-input placeholder="请输入维护人员姓名" v-decorator="['maintainUserFullname', validatorRules.maintainUserFullname]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="维护人员联系电话">
              <a-input placeholder="请输入维护人员联系电话" v-decorator="['maintainUserPhoneNum', {}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button
                @click="handleCancel"
                icon="close"
                style="margin-right:10px"
                class="cancel"
              >取消</a-button>
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
              >{{ model.status == undefined ? '提交' : '确定' }}</a-button>
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
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import qs from 'qs'

export default {
  name: 'FlowConfigModal',
  components: {
    JDictSelectTag
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        processDefinitionKey: { rules: [{ required: true, message: '请输入流程定义Key!' }] },
        formPath: { rules: [{ required: true, message: '请输入前端表单路径!' }] },
        entityName: { rules: [{ required: true, message: '请输入实体类名!' }] },
        maintainUserFullname: { rules: [{ required: true, message: '请输入维护人员姓名!' }] }
      },
      url: {
        add: '/sysFlow/flowConfig/add',
        edit: '/sysFlow/flowConfig/edit'
      }
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'processDefinitionKey',
            'processName',
            'formName',
            'description',
            'status',
            'parentMenuName',
            'menuName',
            'router',
            'formPath',
            'packagePath',
            'entityName',
            'formTableName',
            'formDbName',
            'maintainUserName',
            'maintainUserFullname',
            'maintainUserPhoneNum'
          )
        )
        //时间格式化
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = 'post'
          if (!this.model.id) {
            httpurl += this.url.add
          } else {
            httpurl += this.url.edit
          }
          let formData = Object.assign(this.model, values)
          //时间格式化

          console.log(formData)
          httpAction(httpurl, qs.stringify(formData), method)
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
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>