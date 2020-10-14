<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :footer="null"
    :closable="false"
    :maskClosable="false"
    style="top:5%;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="告警规则" hasFeedback>
          <a-input
            placeholder="请输入告警规则名称"
            v-decorator="['alertRuleName', {rules: [{ required: true, message: '请输入告警规则名称!' }]}]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="告警等级" hasFeedback>
          <a-input-number
          :default-value="1"
          :min="1"
          :max="10"
          style="width: 100%;"
          :formatter="value => `${value}级(1~10)`"
          :parser="value => value.replace('级(1~10)', '')"
          placeholder="请输入告警等级"
          v-decorator="['alertLevel', {rules: [{ required: true, message: '请输入告警等级!' }]}]"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="连续周期" hasFeedback>
          <a-input-number
          placeholder="请输入连续周期"
          :default-value="1"
          :min="1"
          :max="10"
          style="width: 100%;"
          :formatter="value => `${value}周期(1~10)`"
          :parser="value => value.replace('周期(1~10)', '')"
          v-decorator="['continueCycle', {rules: [{ required: true, message: '请输入连续周期!' }]}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="静默周期" hasFeedback>
          <a-input-number
          placeholder="请输入静默周期"
          :default-value="1"
          :min="1"
          :max="10"
          style="width: 100%;"
          :formatter="value => `${value}周期(1~10)`"
          :parser="value => value.replace('周期(1~10)', '')"
          v-decorator="['slienceCycle', {rules: [{ required: true, message: '请输入静默周期!' }]}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="允许相等次数" hasFeedback>
          <a-input-number
          placeholder="请输入相等次数"
          :default-value="1"
          :min="1"
          :max="10"
          style="width: 100%;"
          :formatter="value => `${value}次(1~10)`"
          :parser="value => value.replace('次(1~10)', '')"
          v-decorator="['allowEqualTimes',{rules: [{ required: true, message: '请输入静默周期!' }]}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="应用产品" hasFeedback>
          <a-select
            showSearch
            placeholder="请选择使用此规则的产品"
            optionFilterProp="children"
            v-decorator="['productId', {}]"
          >
            <a-select-option
              v-for="i in productInfos"
              :key="i.id"
              @click="setProductName(i.productName)"
            >{{ i.productName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item hidden :labelCol="labelCol" :wrapperCol="wrapperCol" label="产品名称" hasFeedback>
          <a-input placeholder="请输入产品名称" v-decorator="['productName', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人组" hasFeedback>
          <a-select
            showSearch
            placeholder="请选择联系人组"
            optionFilterProp="children"
            v-decorator="['contactGroupId', {}]"
          >
            <a-select-option
              v-for="i in contactGroupInfos"
              :key="i.id"
              @click="setContactGroupName(i.groupName)"
            >{{ i.groupName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item hidden :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人组名" hasFeedback>
          <a-input placeholder="请输入联系人组名" v-decorator="['contactGroupName', {}]" />
        </a-form-item>
        <a-form-item hidden :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'status', {'initialValue': 1}]">
            <a-radio-button :value="0">正常</a-radio-button>
            <a-radio-button :value="1">停用</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm" v-if="title !== '查看'">确定</a-button>
              <a-button @click="close" icon="close" class="cancel">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import qs from 'qs'

export default {
  name: 'AlertRuleModal',
  components: {
  },
  props: {
    prjCodes: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '操作',
      visible: false,
      productInfos: [],
      contactGroupInfos: [],
      projectMsg: {},
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      cron: {
        label: '',
        value: ''
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        cron: {
          rules: [
            {
              required: true,
              message: '请输入静默周期!'
            }
          ]
        }
      },
      url: {
        add: '/alert/alertRule/add',
        edit: '/alert/alertRule/edit',
        productInfos: '/product/product/productNames',
        contactGroupInfos: '/alert/contactGroup/getAllContactGroup',
        productInfosHaveAlertRule: '/alert/alertRule/getProductIdsAndNames'
      },
      queryParam: {}
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    this.dataServiceUrl = this.projectMsg.dataServiceUrl
    this.realDb = this.projectMsg.realDb
    this.url.add = this.dataServiceUrl + this.url.add
    this.url.edit = this.dataServiceUrl + this.url.edit
    this.getProductInfos().then(prjInfos => {
      this.getProductInfosHaveAlertRule(prjInfos)
    })
    this.getContactGroupInfos()
  },
  methods: {
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields() // 弹窗初始化
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'alertRuleName',
            'alertLevel',
            'continueCycle',
            'slienceCycle',
            'allowEqualTimes',
            'productId',
            'productName',
            'contactGroupId',
            'contactGroupName',
            'status'
          )
        )
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'post' // put修改
          }
          let formData = Object.assign(this.model, values)
          // 时间格式化
          formData.realDb = this.realDb
          httpAction(httpurl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.getProductInfosHaveAlertRule(that.productInfos)
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
    handleCancel () {
      this.close()
    },
    setProductName (productName) {
      this.form.setFieldsValue({ productName: productName })
    },
    setContactGroupName (contactGroupName) {
      this.form.setFieldsValue({ contactGroupName: contactGroupName })
    },
    // 获取所有产品ID和名称
    getProductInfos () {
      return new Promise(resolve => {
        let that = this
        this.queryParam.prjCodes = this.prjCodes
        getAction(that.url.productInfos, that.queryParam).then(res => {
          if (res.success) {
            that.productInfos = res.result
            resolve(that.productInfos)
          } else {
            that.$message.warning('表单初始化失败')
          }
        })
      })
    },
    getProductInfosHaveAlertRule (prjInfos) {
      let that = this
      getAction(that.dataServiceUrl + that.url.productInfosHaveAlertRule, {
        prjCode: that.prjCodes,
        realDb: that.realDb
      }).then(res => {
        console.log('AlertRule  res= >', res.result)
        console.log('AlertRule prjinfo=>', prjInfos)
        // that.productInfos = that.arrayDiff(prjInfos, res.result)
      })
    },
    getContactGroupInfos () {
      let that = this
      this.queryParam.prjCodes = this.prjCodes
      getAction(that.dataServiceUrl + that.url.contactGroupInfos, that.queryParam).then(res => {
        if (res.success) {
          that.contactGroupInfos = that.contactGroupInfos.concat(res.result)
        } else {
          that.$message.warning('表单初始化失败')
        }
      })
    },
    arrayDiff (a, b) {
      for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < a.length; j++) {
          if (a[j].id == b[i].product_id) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      console.log('AlertRule arrayDiff=>', a)
      return a
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
  .form-item {
    height: 45px;
  }
</style>
