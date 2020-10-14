<!--批量添加设备的弹窗 -->
<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="600"
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
          <a-col :md="24" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="对应产品"
            >
              <a-select
                v-decorator="['productId',validatorRules.productId]"
                :triggerChange="true"
                @change="changeProduct"
                placeholder="请选择对应产品"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              >
                <a-select-option v-for="i in productInfos" :key="i.id">{{ i.productName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="通讯管理机"
            >
              <a-select
                v-decorator="['commKey',{}]"
                :triggerChange="true"
                placeholder="请选择对应通讯管理机"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              >
                <a-select-option v-for="commInfo in commInfos" :key="commInfo.code">{{ commInfo.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="设备名称"
            >
              <a-input
                placeholder="请输入设备名称，自动生成编号"
                v-decorator="['deviceName', validatorRules.deviceName]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="厂商名称"
            >
              <a-input
                placeholder="请输入厂商名称"
                v-decorator="['manufacturerName', validatorRules.manufacturerName]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8" v-show="selectProduct.isDivideGroup=='1'">
            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="设备分组">
              <a-select
                v-decorator="['deviceGroupId',validatorRules.deviceGroupId]"
                :triggerChange="true"
                placeholder="请选择设备分组"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              >
                <a-select-option
                  v-for="i in deviceGroup"
                  :key="i.id"
                  @click="setDeviceGroupName(i.deviceGroupName)"
                >{{ i.deviceGroupName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="设备分组名称">
              <a-input v-decorator="['deviceGroupName', validatorRules.deviceGroupName]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备数量">
              <a-input-number
                placeholder
                :min="1"
                :max="50"
                v-decorator="['deviceAmount', validatorRules.deviceAmount]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="19" :sm="8">
            <a-form-item
              :labelCol="{xs: { span: 24 }, sm: { span: 5 }}"
              :wrapperCol="{xs: { span: 24 }, sm: { span: 19 }}"
              label="标签分组"
            >
              <a-select
                mode="multiple"
                placeholder="请选择标签"
                @change="handleSelectChange"
                v-model="selectTags"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              >
                <a-select-option v-for="i in tagNames" :key="i.tagName">{{ i.tagName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item>
              <a @click="showAddTagsModal">新增标签</a>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">
                {{ model.status == undefined ?
                '提交' : '保存' }}
              </a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <add-batch-alert-modal
      ref="addBatchAlert"
      :title="this.alertTitle"
      :message="this.alertMessage"
      :batchCode="this.alertBatchCode"
      @showFather="this.add"
    ></add-batch-alert-modal>
    <TagsAddModal ref="addDeviceTags" :deviceTags="tagNames" @loadNewTag="loadNewTag"></TagsAddModal>
  </a-modal>
</template>

<script>
import { getAction, httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import { unitValidate } from '../../js/iot_validate'
import TagsAddModal from './TagsAddModal'
import AddBatchAlertModal from './AddBatchAlertModal'
import Vue from 'vue'

export default {
  name: 'DeviceAddBatchModal',
  // 组件应用定义
  components: {
    JSelectUserNew,
    TagsAddModal,
    AddBatchAlertModal
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [myCmpListMixin],
  props: {
    prjCodes: {
      type: String,
      default: ''
    },
    productInfos: {
      type: Array,
      default () {
        return []
      }
    }
  },
  // 数据定义
  data () {
    return {
      title: '操作',
      nodeName: '',
      visible: false,
      nodeId: '',
      prjCode: '',
      model: {},
      projectMsg: {},
      commInfos: [],
      showDetails: false,
      deviceGroup: [],
      selectProduct: {}, // 选择的产品信息
      selectDeviceType: '', // 选中的设备类型
      deviceAmount: 0, // 设备数量
      alertTitle: '添加成功',
      alertMessage: '默认信息',
      alertBatchCode: '0',
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
        deviceName: { rules: [{ required: true, message: ' ' }, { validator: this.validatorDeviceName }] },
        productId: { rules: [{ required: true, message: '请选择对应产品!' }] },
        deviceAmount: { initialValue: 1, rules: [{ required: true, message: '请填写设备数量!' }] },
        deviceGroupId: { initialValue: '0', rules: [{ required: true, message: '请选择对应分组!' }] },
        manufacturerName: {
          initialValue: '测试产品默认厂商',
          rules: [{ required: true, message: ' ' }, { validator: this.validateManufacturerName }]
        },
        deviceGroupName: { initialValue: '默认分组', rules: [{ required: true, message: '请选择对应分组!' }] }
      },
      url: {
        addBatch: '/device/device/addBatch',
        edit: '/device/device/edit',
        getTagList: '/tags/tags/getTagList',
        commInfos: '/communcationManager/communcationManager/listByPrjCode',
        // 上传组件地址
        fileUpload: window._CONFIG.domianURL + '/file/uploadFile/add',
        imgerver: window._CONFIG.domianURL + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById',
        productInfos: '/product/product/productNames',
        deviceListByType: '/device/device/deviceListByType',
        getDeviceGroupByProduct: '/device/deviceGroup/getDeviceGroupByProduct'
      },
      // 上传附件定义
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false,
      attachment: [],
      selectTags: [], // 已选标签
      tagNames: [] // 标签列表
    }
  },
  filters: {
    IconUrl (val) {
      switch (val) {
        case '批量添加':
          return require('@/assets/img/login/add.png')
        default:
          break
      }
    }
  },
  beforeCreate () {
  },
  // 钩子函数
  created () {
    this.getTagList()
  },
  mounted () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (this.projectMsg) {
      this.prjCode = this.projectMsg.prjCode
      this.getCommInfos()
    }
  },
  // 计算属性
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
    disabledBtn () {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    },
    hint () {
      let hintMsg = ''
      switch (this.title) {
        case '批量添加':
          hintMsg = '批量添加同一产品下的多个设备'
          break
        default:
          hintMsg = '设备批量管理'
      }
      return hintMsg
    }
  },
  // 方法
  methods: {
    loadNewTag (value) {
      this.getTagList()
      this.selectTags.push(value)
      this.handleSelectChange(value)
    },
    getTagList () {
      let that = this
      getAction(this.url.getTagList).then(res => {
        if (res.success) {
          that.tagNames = res.result
        } else {
          this.$message.error('获取标签失败！')
        }
      })
    },
    showAddTagsModal () {
      this.$refs.addDeviceTags.show()
    },
    handleSelectChange (value) {
      let tags = ''
      tags = value.toString()
      this.model.tagNames = tags
    },
    loadData () {
    },
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields()
      console.log('查看edit 方法： record:', record)
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'productId',
            'deviceName',
            'manufacturerName',
            'inputerName',
            'inputerFullname',
            'deviceGroupId',
            'deviceGroupName',
            'deviceAmount'
          )
        )
        this.selectTags = []
        if (this.model.tagNames != null) {
          let tags = this.model.tagNames.split(',')
          this.selectTags = tags
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
            actionUrl += this.url.addBatch
          } else {
            actionUrl += this.url.edit
          }
          // 表单数据赋值给formData
          let formData = Object.assign(this.model, values)

          // 对formData中的时间字段进行 时间格式化
          // formData.lastOnlineTime = formData.lastOnlineTime
          //     ? formData.lastOnlineTime.format('YYYY-MM-DD HH:mm:ss')
          //     : null
          if (that.attachment.length === 1) {
            formData[that.attachment[0].fieldName] = that.attachment[0].groupId
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              formData[that.attachment[i].fieldName] = that.attachment[i].groupId
            }
          }
          console.log('查看数据', formData)
          // 发起提交或保存请求
          httpAction(actionUrl, formData, method)
            .then(res => {
              if (res.success) {
                // that.$message.success(res.message);
                console.log('batchCode =>', res.result.batchCode)
                that.alertTitle = '添加成功'
                that.alertMessage = '添加成功,批次号为：' + res.result.batchCode
                that.alertBatchCode = res.result.batchCode
                this.openNotification('添加成功', that.alertMessage, res.result.batchCode)
                that.$emit('ok')
              } else {
                that.$message.error(res.message)
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
      this.queryParam.prjCodes = this.prjCodes
      console.log(this.prjCodes)
      getAction(that.url.productInfos, that.queryParam).then(res => {
        console.log('p:', res)
        if (res.success) {
          that.productInfos = that.productInfos.concat(res.result)
        } else {
          that.$message.error('表单初始化失败')
        }
      })
    },
    // 获取所有通讯管理机的信息
    getCommInfos () {
      let param = { prjCode: this.prjCode }
      let url_prefix = this.projectMsg.dataServiceUrl
      this.url.commInfos = url_prefix + this.url.commInfos
      let that = this
      getAction(that.url.commInfos, param).then(res => {
        if (res.success) {
          console.log('通讯管理机信息：', res.result)
          that.commInfos = res.result
        } else {
          that.$message.error('未能查找到通讯管理机信息')
        }
      })
    },
    // 选择产品回调函数  如果选择的产品节点类型是子设备，则查询所有的网关产品数据。
    changeProduct (value) {
      this.selectProduct = this.getSelectProductById(value)
      console.log(this.selectProduct)
      // this.model.nodeType = this.selectProduct.nodeType
      // 如果分组，则查询选中产品的分组信息
      if (this.selectProduct.isDivideGroup === '1') {
        var that = this
        console.log(that.selectProduct.id)
        getAction(that.url.getDeviceGroupByProduct, { productId: that.selectProduct.id }).then(res => {
          console.log(res)
          if (res.success) {
            that.deviceGroup = res.result
          } else {
            that.$message.error('查询分组信息失败')
          }
        })
      }
    },
    setDeviceGroupName (deviceGroupName) {
      console.log(deviceGroupName)
      this.form.setFieldsValue({ deviceGroupName: deviceGroupName })
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
    // 自定义通知提示框
    openNotification (title, message, batCode) {
      this.$refs.addBatchAlert.showModal()
      this.$refs.addBatchAlert.ModalTitle = title
      this.$refs.addBatchAlert.ModalText = message
      this.$refs.addBatchAlert.ModalBatCode = batCode
    },
    addBatchAlertOk () {
      this.loadDeviceState()
      this.loadData()
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
</style>
