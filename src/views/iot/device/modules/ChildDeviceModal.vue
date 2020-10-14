<!--子设备弹窗 目前已废弃-->
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
        <img :src="title | IconUrl" />
        {{ title }}
        <span>{{ nodeName ? '(' + nodeName + ')': '' }}</span>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
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
              label="对应产品"
            >
              <a-select
                v-decorator="['productId',validatorRules.productId]"
                :triggerChange="true"
                placeholder="请选择对应产品"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              >
                <a-select-option v-for="i in productInfos" :key="i.id">{{ i.productName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelColRight"
              :wrapperCol="wrapperColRight"
              label="设备编号"
            >
              <a-input
                placeholder="保存成功后自动生成"
                v-decorator="['deviceKey', validatorRules.deviceKey]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="设备名称"
            >
              <a-input
                placeholder="请输入设备名称"
                v-decorator="['deviceName', validatorRules.deviceName]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="节点类型">
              <j-dict-select-tag
                v-decorator="['nodeType', {initialValue: selectProduct.nodeType}]"
                :triggerChange="true"
                placeholder="请选择节点类型"
                dictCode="iot_node_type"
                :disabled="true"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="接入网关">
              <a-select
                v-decorator="['parentId',validatorRules.parentId]"
                :triggerChange="true"
                @change="changeParentId"
                placeholder="请选择接入网关"
                :disabled="true"
              >
                <a-select-option v-for="i in gateways" :key="i.id">{{ i.deviceName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col :md="12" :sm="8">-->
          <!--            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="设备状态">-->
          <!--              <j-dict-select-tag-->
          <!--                v-decorator="['deviceState', validatorRules.deviceState]"-->
          <!--                :triggerChange="true"-->
          <!--                placeholder="请选择设备状态"-->
          <!--                dictCode="iot_device_state"-->
          <!--                :disabled="this.title == '查看' || this.title == '新增'"-->
          <!--              ></j-dict-select-tag>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="最后上线时间">
              <a-date-picker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="[ 'lastOnlineTime', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="节点类型">
              <a-input v-decorator="['nodeType', {initialValue: '3'}]" :disabled="true" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备密钥">
              <a-input
                placeholder="请输入设备密钥"
                v-decorator="['deviceSecret', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"
              />
            </a-form-item>
          </a-col>-->
          <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="录入人用户名">
          <a-input placeholder="请输入录入人用户名" v-decorator="['inputerName', {}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
        </a-form-item>
          </a-col>-->
          <!-- <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="录入人姓名">
          <a-input placeholder="请输入录入人姓名" v-decorator="['inputerFullname', {}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"/>
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="消息通知方式">
          <a-checkbox-group v-decorator="['notifyMethod', {initialValue: []}]"
          :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"><a-checkbox value="sms">手机短信</a-checkbox></a-checkbox-group>
        </a-form-item>
          </a-col>-->
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="设备描述">
              <a-input
                placeholder="请输入设备描述"
                v-decorator="['deviceIntroduction', validatorRules.deviceIntroduction]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
              >{{ model.status == undefined ? '提交' : '保存' }}</a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction, httpAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import qs from 'qs'
import { isLetters } from '@/views/iot/js/iot_validate'
import { unitValidate } from '../../js/iot_validate'

export default {
  name: 'ChildDeviceModal',
  props: {
    parentId: {
      type: String,
      default: ''
    }
  },
  // 组件应用定义
  components: {
    JSelectUserNew
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
      model: {},
      productInfos: [], // 所有已发布产品信息 id,productName,nodeType,productType
      gateways: [], // 所有网关信息 id ，name ，productId
      selectProduct: {}, // 选择的产品信息
      selectDeviceType: '', // 选中的设备类型
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
      labelColRight: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperColRight: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      // 输入框校验规则
      validatorRules: {
        deviceKey: {
          rules: [{ required: false, message: '输入设备编号，若不填写则自动生成编号' }, { validator: this.valiKey }]
        },
        deviceState: {
          rules: [{ required: true, message: '请选择设备状态!' }],
          initialValue: '0'
        },
        deviceName: {
          rules: [{ required: true, message: ' ' }, { validator: this.validatorDeviceName }]
        },
        productId: { rules: [{ required: true, message: '请选择对应产品!' }] },
        parentId: {
          rules: [{ required: false, message: '请选择接入网关!' }],
          initialValue: this.parentId
        },

        deviceIntroduction: {
          rules: [{ max: 250, message: '最多输入250字!' }]
        }
      },
      url: {
        add: '/device/device/add',
        edit: '/device/device/edit',
        // 上传组件地址
        fileUpload: window._CONFIG.domianURL + '/file/uploadFile/add',
        imgerver: window._CONFIG.domianURL + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById',
        productInfos: '/product/product/productNames',
        deviceListByType: '/device/device/deviceListByType',
        getChildDeviceProduct: '/product/product/childDeviceProduct'
      },
      // 上传附件定义
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false,
      attachment: []
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
  beforeCreate () {},
  // 钩子函数
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    // 初始化tokens
    this.initTokens()
    //
  },
  mounted () {
    this.getProductInfos() // 获取所有产品ID和名称
    this.changeProduct()
  },
  // 计算属性
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
    disabledBtn () {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    }
  },
  // 方法
  methods: {
    loadData () {},
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields()
      if (record.nodeId !== undefined) {
        this.nodeId = record.nodeId
      }
      if (record.nodeName !== undefined) {
        this.nodeName = record.nodeName
      }
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'productId',
            'parentId',
            'deviceKey',
            'deviceName',
            'deviceIntroduction',
            'deviceState',
            'nodeType',
            'deviceType',
            'deviceSecret',
            'inputerName',
            'inputerFullname',
            'notifyMethod',
            'deviceProperties'
          )
        )

        // 时间格式化
        this.form.setFieldsValue({
          lastOnlineTime: this.model.lastOnlineTime ? moment(this.model.lastOnlineTime) : null
        })

        // 初始化新任务通知
        if (this.model.notifyMethod !== undefined) {
          this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
        }
      })
      // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
      let that = this
      if (that.attachment.length != 0) {
        if (JSON.stringify(that.model) == '{}') {
          this.initUpload(that, 0)
        } else {
          for (let j in that.model) {
            if (j) {
              if (typeof j != Object) {
                if (j.indexOf('Attachment') != -1) {
                  for (let i = 0; i < that.attachment.length; i++) {
                    this.initUpload(that, i, that.model[j])
                  }
                }
              }
            }
          }
        }
      }
    },
    // 校验设备名称
    validatorDeviceName (rule, value, callback) {
      let label = '设备名称'
      let length = [2, 32]
      unitValidate(label, length, rule, value, callback)
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
          formData.lastOnlineTime = formData.lastOnlineTime
            ? formData.lastOnlineTime.format('YYYY-MM-DD HH:mm:ss')
            : null

          if (that.attachment.length === 1) {
            formData[that.attachment[0].fieldName] = that.attachment[0].groupId
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              formData[that.attachment[i].fieldName] = that.attachment[i].groupId
            }
          }
          console.log('查看数据', formData)
          // 发起提交或保存请求
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning('操作失败')
                console.log('操作失败 =>', res.result)
              }
            })
            .finally(() => {
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
      getAction(that.url.getChildDeviceProduct, {}).then(res => {
        if (res.success) {
          that.productInfos = that.productInfos.concat(res.result)
          console.log('表单初始化成功', res.result)
          // that.loadData();
        } else {
          that.$message.error('表单初始化失败')
        }
      })
    },

    // 选择产品回调函数  如果选择的产品节点类型是子设备，则查询所有的网关产品数据。
    changeProduct () {
      // this.selectProduct = this.getSelectProductById(value)
      // this.model.nodeType = this.selectProduct.nodeType
      var that = this
      postAction(that.url.deviceListByType, {
        nodeType: '2'
      }).then(res => {
        if (res.success) {
          var result = res.result[0]
          that.gateways = result.devices
          console.log('result devices')
          console.log(result.devices)
        } else {
          that.$message.error('查询设备信息失败')
        }
      })
      // console.log('value')
      // console.log(value)
    },
    changeParentId (value) {
      console.log('gateways => value =>', value)
    },
    // 根据id从productName中获取选择的产品信息
    getSelectProductById (id) {
      var that = this
      var i, p
      var pnames = that.productInfos
      for (i in pnames) {
        p = pnames[i]
        if (p.id === id) {
          break
        }
      }
      return p
    },
    // 编号验证
    valiKey: function (rule, value, callback) {
      if (isLetters(value)) {
        callback()
      } else {
        callback('请输入正确的设备编号(数字，字母，下划线,短横线)!')
      }
    },
    initTokens () {
      if (this.attachment.length >= 1) {
        for (let i = 0; i < this.attachment.length; i++) {
          this.attachment[i].fileTokens = ''
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
</style>
