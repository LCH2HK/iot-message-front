<!--参数单位 弹窗 -->
<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="close"
    cancelText="关闭"
    :maskClosable="false"
  >
    <div class="title">
      <div>
        <img :src="title | IconUrl" />
        {{ title }}
        <a-tooltip
          placement="rightTop"
          title="新增或编辑一个参数单位,维护平台的单位列表，后续可在属性模板菜单中配置属性的单位。"
        >
          <a-icon type="question-circle" />
        </a-tooltip>
      </div>

      <a-icon
        type="close"
        class="closeIcon"
        @click="close"
      />
    </div>
    <!-- 无流程样式div-->
    <div style="height:26px;"></div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col
            :md="24"
            :sm="12"
          >
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="参数"
            >
              <a-input
                placeholder="请输入参数名"
                v-decorator="['name', validatorRules.name]"
                :disabled="this.title === '查看'"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="24"
            :sm="12"
          >
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="单位"
            >
              <a-input
                placeholder="请输入单位"
                v-decorator="['unitType', validatorRules.unitType]"
                :disabled="this.title === '查看'"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="12"
            :sm="8"
            v-show="false"
          >
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="录入人"
            >
              <a-input
                placeholder
                v-decorator="['inputerFullname', validatorRules.inputerFullname ]"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col
            :md="12"
            :sm="8"
            v-show="false"
          >
            <a-form-item
              class="form-item-style"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="录入时间"
            >
              <a-input
                placeholder
                v-decorator="['inputTime', {initialValue: moment().format('YYYY-MM-DD HH:mm:ss')}]"
                disabled
              ></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col
            :md="24"
            :sm="8"
          >
            <a-form-item class="btnClass">
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
                v-if="title !== '查看'"
              >{{ model.status == undefined ? '确定' : '提交' }}</a-button>
              <a-button
                @click="close"
                icon="close"
                class="cancel"
              >关闭</a-button>
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
import qs from 'qs'
import { normalValidate, unitValidate } from '../../js/iot_validate'
export default {
  name: 'PropertiesUnitModal',
  data () {
    return {
      title: '操作', // 标题
      hint: '',
      visible: false, // 是否显示
      confirmLoading: false, // 确定按钮 loading
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 21 }
      },
      form: this.$form.createForm(this), // 表单
      validatorRules: {
        // 表单校验
        name: {
          rules: [{ required: true, message: ' ' }, { validator: this.validatorName }]
        },
        unitType: {
          rules: [{ required: true, message: ' ' }, { validator: this.validatorUnitType }]
        },
        inputerFullname: {
          initialValue: this.$store.getters.nickname
        }
      },
      url: {
        add: '/propertyUnit/propertyUnit/add',
        edit: '/propertyUnit/propertyUnit/edit',
        duplicateCheck: '/propertyUnit/propertyUnit/duplicateCheck'
      }
    }
  },
  filters: {
    IconUrl (val) {
      switch (val) {
        case '新增':
          return require('@/assets/img/login/add.png')
        case '编辑':
          return require('@assets/img/login/edit.png')
        case '查看':
          return require('@assets/img/login/view.png')
        case '审核':
          return require('@assets/img/login/audit.png')
        default:
          break
      }
    }
  },
  methods: {
    moment,
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.model.inputTime = moment(this.model.inputTime).format('YYYY-MM-DD HH:mm:ss')
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'name', 'unitType', 'inputTime', 'inputerFullname'))
      })
    },
    close () {
      this.visible = false
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let actionUrl = ''
          let method = 'post'
          // 判断操作类型，新增或者编辑
          if (!this.model.id) {
            actionUrl += this.url.add
          } else {
            actionUrl += this.url.edit
          }
          // 表单数据赋值给formData
          let formData = Object.assign(this.model, values)
          // 发起确定或保存请求
          httpAction(actionUrl, qs.stringify(formData), method)
            .then((res) => {
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
    },
    // 字段校验
    validatorName (rule, value, callback) {
      let label = '参数'
      let length = [1, 32]
      if (value.length === 0) {
        callback('请填写' + label + '！')
      } else if (/[\s+]/g.test(value)) {
        callback('不可添加空格!')
      } else if (value.length < length[0]) {
        callback('最少输入' + length[0] + '个字')
      } else if (value.length > length[1]) {
        callback('最多输入' + length[1] + '个字')
      } else {
        let params = {
          unitNames: value.trim()
        }
        let method = 'post'
        httpAction(this.url.duplicateCheck, params, method).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      }
    },
    validatorUnitType (rule, value, callback) {
      let label = '单位'
      let length = [1, 32]
      unitValidate(label, length, rule, value, callback)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';

.form-item-style {
  height: 45px;
}
</style>
