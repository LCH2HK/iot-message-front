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
    style="top:5%;">
    <div class="title">
      <div>
        <img :src="title | IconUrl"/>
        {{title}}
        <span>{{ nodeName ? '(' + nodeName + ')': ''}}</span>
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
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="所属产品">
              <a-select
                v-decorator="['productId',{ rules: [{ required: true, message: '请选择所属产品' }]}]"
                :triggerChange="true"
                placeholder="请选择产品"
                @change="changeProduct"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              >
                <a-select-option v-for="productInfo in productInfos" :key="productInfo.id">{{ productInfo.productName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="统计设备">
              <a-select
                mode="multiple"
                @change="handleSelectChange"
                :triggerChange="true"
                placeholder="请选择设备"
                v-decorator="['deviceIds',{ rules: [{ required: true, message: '请选择设备' }]}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              >
                <a-select-option v-for="deviceInfo in deviceInfos" :key="deviceInfo.id">{{ deviceInfo.deviceName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="设备属性">
              <a-select
                v-decorator="['deviceProperties',{ rules: [{ required: true, message: '请选择设备属性' }]}]"
                mode="multiple"
                :triggerChange="true"
                placeholder="请选择统计哪些设备属性"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              >
                <a-select-option v-for="propInfo in propInfos" :key="propInfo.alias">{{ '名称: '+propInfo.unitName+',标识符:'+propInfo.alias }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col :md="12" :sm="8">-->
          <!--            <a-form-item-->
          <!--              :labelCol="labelCol"-->
          <!--              :wrapperCol="wrapperCol"-->
          <!--              label="过滤条件">-->
          <!--              <a-input placeholder="请输入过滤条件" v-decorator="['filterCondition', {}]"-->
          <!--                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="任务编号">
              <a-input placeholder="请输入任务编号" v-decorator="['code', validatorRules.code]"
                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="统计指标">
              <a-select
                v-decorator="['statisticsIndex',{ rules: [{ required: true, message: '请选择统计指标' }]}]"
                :triggerChange="true"
                placeholder="请选择统计指标"
                mode="multiple"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看' || this.title == '编辑'"
              >
                <a-select-option v-for="index in statisticsIndex" :key="index.code">{{ index.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="统计周期">
              每
              <a-input-number
                :min="1"
                v-decorator="['period', {'initialValue':'1', rules: [{ required: true, message: '请填写统计周期' }]}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>
              分钟算一次统计值
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="执行时机">
              <j-cron
                ref="innerVueCron"
                v-decorator="['taskRunTime', {'initialValue':'0/50 * * * * ? *', rules: [{ required: true, message: '请输入任务执行时机' }]}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              ></j-cron>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="开始时间">
              <a-date-picker
                placeholder
                :disabledDate="disabledStartDate"
                format="YYYY-MM-DD  HH:mm:ss"
                v-decorator="['startTime',{rules: [{ required: true, message: '请选择开始时间' }]}]"
                @openChange="handleStartOpenChange"
                :showTime="{
                      hideDisabledOptions: true,
                      defaultValue: moment('00:00:00', 'HH:mm:ss')
                    }"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              ></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="结束时间">
              <a-date-picker
                placeholder
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="['endTime',{rules: [{ required: true, message: '请选择结束时间' }]}]"
                :open="endOpen"
                @openChange="handleEndOpenChange"
                :showTime="{
                      hideDisabledOptions: true,
                      defaultValue: moment('00:00:00', 'HH:mm:ss')
                    }"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              ></a-date-picker>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">确定</a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import qs from 'qs'
import { getAction, httpAction } from '@/api/manage'
import JCron from '@/components/cmp/JCron.vue'

export default {
  name: 'StatisticsTaskModal',
  // 组件应用定义
  components: {
    JDictSelectTag,
    JSelectUserNew,
    JCron
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data () {
    return {
      title: '操作',
      nodeName: '',
      visible: false,
      nodeId: '',
      productId: '',
      model: {},
      projectMsg: null, // 项目信息
      tempEndValue: null,
      tempStartValue: null,
      endOpen: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        code: {
          rules: [{
            required: true, message: '请输入任务编号!'
          }, {
            validator: this.validateTaskKey
          }]
        }
      },
      productInfos: [],
      deviceInfos: [],
      propInfos: [],
      statisticsIndex: [],
      url: {
        add: '/statisticstask/statisticsTask/add',
        edit: '/statisticstask/statisticsTask/edit',
        productInfos: '/product/product/productNames',
        deviceInfos: '/device/device/getDeviceInfoByProductId',
        propInfos: '/product/product/getPropsByProductId',
        statCodeName: '/statisticstask/statisticsIndex/all',
        duplicateCheck: '/statisticstask/statisticsTask/duplicateCheck'
      },
      prjCode: '',
      dataServiceUrl: ''
    }
  },
  filters: {
    IconUrl (val) {
      switch (val) {
        case '新增':
          return require('@/assets/img/login/add.png')
          break
        case '编辑':
          return require('@assets/img/login/edit.png')
          break
        case '查看':
          return require('@assets/img/login/view.png')
          break
        case '审核':
          return require('@assets/img/login/audit.png')
          break
        default:
          break
      }
    }
  },
  // 钩子函数
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (this.projectMsg) {
      // 项目级
      this.dataServiceUrl = this.projectMsg.dataServiceUrl
      this.prjCode = this.projectMsg.prjCode
      this.url.add = this.dataServiceUrl + this.url.add
      this.url.edit = this.dataServiceUrl + this.url.edit
      this.url.duplicateCheck = this.dataServiceUrl + this.url.duplicateCheck
      this.url.statCodeName = this.dataServiceUrl + this.url.statCodeName
    }
    this.getProductInfos()
    this.getStatisticsIndex()
  },
  // 计算属性
  computed: {
    disabledBtn () {
      return this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看' ? this.blank : this.handleChange
    },
    historyTable () {
      let productId = this.form.getFieldValue('productId')
      // 默认产品历史表的分组都为1
      let groupId = 1
      let productInfo = null
      this.productInfos.forEach(item => {
        if (item.id === productId) {
          productInfo = item
        }
      })
      let productKey = productInfo.productKey.toLowerCase()
      let nameArr = [this.prjCode, productKey, groupId, 'history']
      return nameArr.join('_')
    },
    deviceKeys () {
      let deviceIdArr = this.form.getFieldValue('deviceIds')
      let deviceKeys = []
      deviceIdArr.forEach(deviceId => {
        this.deviceInfos.forEach(deviceInfo => {
          if (deviceId == deviceInfo.id) {
            deviceKeys.push(deviceInfo.deviceKey)
          }
        })
      })
      return deviceKeys.join(',')
    }
  },
  // 方法
  methods: {
    moment,
    changeProduct (value) {
      this.form.setFieldsValue({ productId: value })
      this.getDeviceInfos()
      this.getPropInfos()
      this.clearInput()
    },
    clearInput () {
      this.form.setFieldsValue({ deviceKeys: '' })
      this.form.setFieldsValue({ props: '' })
    },
    handleSelectChange (value) {
      // let tags = ''
      // tags = value.toString()
      // this.model.tagNames = tags
    },
    loadData () {
    },
    add () {
      this.edit({})
    },
    edit (record) {
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
        this.form.setFieldsValue(pick(this.model, 'deviceIds', 'code', 'deviceProperties', 'filterCondition', 'productId', 'statisticsIndex', 'period', 'startTime', 'endTime', 'taskRunTime'))

        // 时间格式化
        this.form.setFieldsValue({ inputTime: this.model.inputTime ? moment(this.model.inputTime) : null })
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      })
    },
    // 日历控件绑定方法
    disabledStartDate (startValue) {
      const endValue = this.form.getFieldValue('endTime')
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.form.getFieldValue('startTime')
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.fileList = []
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

          // 对formData中的时间字段进行 时间格式化
          formData.inputTime = formData.inputTime ? formData.inputTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

          formData.deviceIds = formData.deviceIds.join(',')
          formData.deviceProperties = formData.deviceProperties.join(',')
          formData.statisticsIndex = formData.statisticsIndex.join(',')
          formData.historyTable = this.historyTable
          formData.historyDb = this.projectMsg.historyDb
          formData.deviceKeys = this.deviceKeys

          // 发起提交或保存请求
          httpAction(actionUrl, qs.stringify(formData), method).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              that.$message.warning('操作失败')
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
          })
        }
      })
    },
    handleChange (info) {
      // 调用改变方法
      this.handleChange1(info, this, 0)
    },
    handlePicCancel () {
      this.previewVisible = false
    },
    handleCancel () {
      this.close()
    },
    // 获取所有产品ID和名称
    getProductInfos () {
      let that = this
      this.queryParam.prjCodes = this.prjCode
      getAction(that.url.productInfos, that.queryParam).then(res => {
        if (res.success) {
          that.productInfos = res.result
        } else {
          that.$message.error('表单初始化失败')
        }
      })
    },
    getDeviceInfos () {
      let that = this
      let param = { productId: this.form.getFieldValue('productId') }
      getAction(that.url.deviceInfos, param).then(res => {
        if (res.success) {
          that.deviceInfos = res.result
        } else {
          that.$message.error('表单初始化失败')
        }
      })
    },
    getPropInfos () {
      let that = this
      let param = { productId: this.form.getFieldValue('productId') }
      getAction(that.url.propInfos, param).then(res => {
        if (res.success) {
          that.propInfos = res.result
        } else {
          that.$message.error('表单初始化失败')
        }
      })
    },

    getStatisticsIndex () {
      let that = this
      getAction(that.url.statCodeName, {}).then(res => {
        if (res.success) {
          that.statisticsIndex = res.result
        } else {
          that.$message.error('表单初始化失败')
        }
      })
    },
    // 任务编号校验
    validateTaskKey (rule, val, callback) {
      let label = '任务编号'
      let length = [1, 32]
      let value = val || ''
      if (value.length === 0) {
        callback('请输入' + label + '！')
      } else if (/[\s*]/g.test(value)) {
        callback('不可添加空格!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('不可输入汉字!')
      } else if (
        /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g.test(value)
      ) {
        callback('不可输入特殊字符!')
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
    }

  }
}
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
</style>
