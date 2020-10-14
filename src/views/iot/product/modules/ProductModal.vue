<!--产品信息窗口 -->
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
  >
    <div class="title">
      <div>
        <img :src="title | IconUrl" />
<!--        {{ '创建产品' }}-->
        {{ title }}
        <span>{{ nodeName ? '(' + nodeName + ')': '' }}</span>
        <a-tooltip placement="rightTop" :title="hint">
          <a-icon type="question-circle" />
        </a-tooltip>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <!-- 无流程样式div-->
    <div style="height:24px;"></div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="产品名称"
            >
              <a-input
                placeholder="请输入产品名称"
                v-decorator="['productName', validatorRules.productName ]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="产品编号"
            >
              <a-input
                placeholder="输入产品编号"
                v-decorator="['productKey', validatorRules.productKey ]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="产品型号"
            >
              <a-input
                placeholder="请输入产品型号"
                v-decorator="['productModel', validatorRules.productModel]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="属性模板"
            >
              <a-select
                v-decorator="['productType', validatorRules.productType]"
                placeholder="请选择属性模板"
                @change="changeAttributeTemplate"
              >
                <a-select-option
                  v-for="types in attributeTemplates"
                  :key="types.typeName"
                >{{ types.typeName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col :md="12" :sm="8">-->
          <!--            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" style="height: 45px" label="产品类别">-->
          <!--              <a-select :mode="mode" v-model="productGroup" :autoClearSearchValue="false" style="width: 100%"-->
          <!--                        @change="changeGroup" @click="changeMode" filterable="true" placeholder="输入产品类别">-->
          <!--                <a-select-option v-for="item in productGroups" :key="item.groupName">{{item.groupName}}-->
          <!--                </a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          <a-col :md="12" :sm="8">-->
          <!--            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" style="height: 45px" label="厂商名称">-->
          <!--              <a-input placeholder="请输入厂商名称" v-decorator="['manufacturerName', validatorRules.manufacturerName]"-->
          <!--                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          <a-col :md="12" :sm="8">-->
          <!--            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" style="height: 45px" label="生产地">-->
          <!--              <a-input placeholder="请输入生产地" v-decorator="['productPlace', validatorRules.productPlace]"-->
          <!--                       :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->

          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="是否接入终端"
            >
              <a-radio-group
                @change="onChange"
                buttonStyle="solid"
                v-decorator="['isAccessGateway', {initialValue:'1'}]"
                :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
              >
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <!--          <a-col :md="12" :sm="8" v-show="this.play==true">-->
          <!--            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" style="height: 45px" label="联网方式"-->
          <!--                         :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')" v-if="this.play===true">-->
          <!--              <j-dict-select-tag v-decorator="['networkMethod', {initialValue:'0'}]" :triggerChange="true"-->
          <!--                                 placeholder="请选择联网方式" dictCode="iot_product_networkmethod" v-if="this.play===true"-->
          <!--                                 :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"></j-dict-select-tag>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!--          <a-col :md="12" :sm="8" v-show="this.showoff==true">-->
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="通讯协议"
            >
              <j-dict-select-tag
                v-decorator="['protocolType', {initialValue:'1'}]"
                :triggerChange="true"
                placeholder="请选择通讯协议"
                dictCode="iot_product_protocoltype"
                :disabled="this.play||title==='查看' || (nodeId !== undefined && nodeId !== '')"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="授权"
            >
              <a-input
                placeholder="请输入授权"
                v-decorator="['productAuthorize', validatorRules.productAuthorize]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="入网凭证"
            >
              <a-input
                placeholder="请输入入网凭证"
                v-decorator="['networkAccessCertificate', validatorRules.networkAccessCertificate]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据存储频率">
              <j-cron
                v-decorator="['historyDataFrequency', {'initialValue':'0/10 * * * * ? *', rules: [{ required: true, message: '请输入存储频率' }]}]"
              ></j-cron>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据保留时长">
              <a-input-number
                :min="6"
                :max="120"
                v-decorator="['longestSaveMonth', { initialValue: 6, rules: [{ required: true, message: '请输入保留月数' }]}]"
              />月
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="心跳检测频率">
              <j-cron
                v-decorator="['heartBeatFrequency', {'initialValue':'0/10 * * * * ? *', rules: [{ required: true, message: '请输入心跳检测频率' }]}]"
              ></j-cron>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show='false'>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="节点类型"
            >
              <j-dict-select-tag
                placeholder="请选择节点类型"
                :triggerChange="true"
                dictCode="iot_node_type"
                v-decorator="['nodeType', {initialValue:'1'}]"
                :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
              ></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="录入人姓名"
            >
              <a-input
                placeholder="请输入录入人姓名"
                v-decorator="['inputerFullname', { initialValue:this.$store.getters.nickname}]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
          <!--分组功能暂时隐藏-->
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              style="height: 45px"
              label="是否分组"
            >
              <a-radio-group
                buttonStyle="solid"
                v-decorator="['isDivideGroup', {initialValue:'0'}]"
                :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
              >
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="描述">
          <a-textarea
            v-decorator="['productIntroduction', validatorRules.productIntroduction]"
            :autosize="{minRows: 3, maxRows: 6}"
            :disabled="title==='查看' || (nodeId !== undefined && nodeId !== '')"
          ></a-textarea>
        </a-form-item>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button
                @click="handleOk"
                type="primary"
                icon="check"
                class="confirm"
              >{{ model.status == undefined ? '确定' : '提交' }}</a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
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
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import qs from 'qs'
import JCron from '@/components/cmp/JCron.vue'
import { normalValidate, codeValidate, specialValidate } from '../../js/iot_validate'
import { getAction } from '../../../../api/manage'

export default {
  name: 'ProductModal',
  // 组件应用定义
  components: {
    JDictSelectTag,
    JCron
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data () {
    return {
      networkMethods: [],
      title: '操作',
      nodeName: '',
      play: true,
      showoff: false,
      selectedNetworkType: '',
      nodeType: '',
      visible: false,
      nodeId: '',
      model: {},
      selectDeviceType: '', // 选择的设备属性
      productGroups: [], // 设备分组
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
        productKey: { rules: [{ required: true, message: ' ' }, { validator: this.validateProductKey }] },
        productName: { rules: [{ required: true, message: ' ' }, { validator: this.validateProductName }] },
        productModel: { rules: [{ required: true, message: ' ' }, { validator: this.validateProductModel }] },
        productType: { rules: [{ required: true, message: '请选择属性模板！' }] },
        manufacturerName: {
          initialValue: '测试产品默认厂商',
          rules: [{ required: true, message: ' ' }, { validator: this.validateManufacturerName }]
        },
        productPlace: {
          initialValue: '测试产品默认产地',
          rules: [{ required: true, message: ' ' }, { validator: this.validateProductPlace }]
        },
        productAuthorize: {
          initialValue: '000000',
          rules: [{ required: true, message: ' ' }, { validator: this.validateProductAuthorize }]
        },
        networkAccessCertificate: {
          initialValue: '000000',
          rules: [{ required: true, message: ' ' }, { validator: this.validateNetworkAccessCertificate }]
        },
        productIntroduction: { rules: [{ max: 250, message: '最多输入250字' }] }
      },
      url: {
        add: '/product/product/add',
        edit: '/product/product/edit',
        // 上传组件地址
        fileUpload: window._CONFIG.domianURL + '/file/uploadFile/add',
        imgerver: window._CONFIG.domianURL + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById',
        deviceType: '/propertyTemplate/propertyTemplate/getDeviceTypes',
        productGroups: '/product/productGroup/getProductGroups',
        duplicateCheck: '/product/product/duplicateCheck'
      },
      // 上传附件定义
      selectOne: '2', // 单选默认值
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false,
      attachment: [],
      attributeTemplates: [], // 属性模板组
      keyDownRecord: '',
      mode: 'tags',
      productGroup: ''
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
  // 钩子函数
  created () {
    // 获取属性模板
    this.getAttributeTemplate()
    // 获取产品分组
    this.getProductGroup()
  },
  destroyed () {},
  // 计算属性
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
    disabledBtn () {
      return (this.nodeId !== '' && this.nodeId !== 'UserTask_0') || this.title === '查看'
        ? this.blank
        : this.handleChange
    },
    hint () {
      let hintMsg = ''
      switch (this.title) {
        case '新增':
          hintMsg = '新增一个产品，并添加其基本属性。产品是属性相同的设备的集合，后续添加设备时会自动继承产品的属性。' +
           '“是否接入终端”属性表示该类设备的接入方式，是：点码表形式接入，否：通过协议接入，目前支持MQTT协议设备。' +
            '注意：产品创建后需要发布才能添加设备，发布且已添加设备的产品不能撤销发布，只有当产品下面没有设备时才能撤销发布！！'; break
        case '编辑':
          hintMsg = '编辑产品的基本属性'; break
        default:
          hintMsg = '产品的基本属性'
      }
      return hintMsg
    }
  },
  // 方法
  methods: {
    loadData () {},
    add () {
      this.edit({})
    },
    changeAttributeTemplate (value) {
      this.form.setFieldsValue({ productType: value })
    },
    edit (record) {
      this.form.resetFields()
      this.getAttributeTemplate()
      this.mode = 'tags'
      this.selectDeviceType = ''
      this.productGroup = undefined
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
            'productKey',
            'productName',
            'productModel',
            'productType',
            'productIntroduction',
            'productPlace',
            'manufacturerName',
            'nodeType',
            'isAccessGateway',
            'isDivideGroup',
            'networkMethod',
            'protocolType',
            'productAuthorize',
            'networkAccessCertificate',
            'historyDataFrequency',
            'heartBeatFrequency',
            'longestSaveMonth',
            'inputerFullname'
          )
        )
      })
      if (record.productGroup !== undefined) {
        this.productGroup = record.productGroup
      }
      // if (this.model.productType !== undefined) {
      //     this.selectDeviceType = this.model.productType;
      // } else {
      //     this.selectDeviceType = this.attributeTemplates[0].typeName;
      // }
    },
    validateProductName (rule, value, callback) {
      let label = '产品名称'
      let length = [1, 32]
      normalValidate(label, length, rule, value, callback)
    },
    // 产品编号校验
    validateProductKey (rule, val, callback) {
      let label = '产品编号'
      let length = [1, 4]
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
    },
    // 产品型号校验
    validateProductModel (rule, value, callback) {
      let label = '产品型号'
      let length = [1, 32]
      specialValidate(label, length, rule, value, callback)
    },
    // 厂商名称校验
    validateManufacturerName (rule, value, callback) {
      let label = '厂商名称'
      let length = [6, 48]
      normalValidate(label, length, rule, value, callback)
    },
    // 生产地校验
    validateProductPlace (rule, value, callback) {
      let label = '生产地'
      let length = [6, 64]
      normalValidate(label, length, rule, value, callback)
    },
    // 授权码校验
    validateProductAuthorize (rule, value, callback) {
      let label = '授权码'
      let length = [6, 32]
      codeValidate(label, length, rule, value, callback)
    },
    // 入网凭证校验
    validateNetworkAccessCertificate (rule, value, callback) {
      let label = '入网凭证'
      let length = [6, 32]
      codeValidate(label, length, rule, value, callback)
    },
    // 获取属性模板成功
    getAttributeTemplate () {
      let that = this
      getAction(that.url.deviceType, {}).then(res => {
        if (res.success) {
          that.attributeTemplates = res.result
        } else {
          that.$message.error('操作失败')
        }
      })
    },
    // 获取产品分组
    getProductGroup () {
      let that = this
      getAction(that.url.productGroups, {}).then(res => {
        if (res.success) {
          that.productGroups = res.result
        } else {
          that.$message.error('操作失败')
        }
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.fileList = []
    },
    onChange () {
      const that = this
      let val = that.form.getFieldValue('isAccessGateway')
      if (val === '0') {
        that.play = true
        that.showoff = false
      } else if (val === '1') {
        that.play = false
        that.showoff = true
      }
      that.$nextTick(() => {
        that.form.setFieldsValue({ networkMethods: this.selectedNetworkType })
      })
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
          let formData = Object.assign(this.model, values)

          // formData['productType'] =this.selectDeviceType;
          formData.productGroup = this.productGroup
          // 对formData中的时间字段进行 时间格式化

          if (that.attachment.length === 1) {
            formData[that.attachment[0].fieldName] = that.attachment[0].groupId
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              formData[that.attachment[i].fieldName] = that.attachment[i].groupId
            }
          }
          // 发起提交或保存请求
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
    },
    handleChange (info) {
      // 调用改变方法
      this.handleChange1(info, this, 0)
    },
    // 更改产品分组信息
    changeGroup (value) {
      this.productGroup = value[0]
      // this.mode = '';
    },
    handleBlur () {
      this.mode = ''
    },
    handleFocus () {
      this.mode = 'tags'
    },
    changeMode () {
      this.mode = 'tags'
    },
    handlePicCancel () {
      this.previewVisible = false
    },
    handleCancel () {
      this.close()
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
