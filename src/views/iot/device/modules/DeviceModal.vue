<!--设备信息弹窗 -->
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
        <a-tooltip placement="rightTop" :title="hint">
          <a-icon type="question-circle" />
        </a-tooltip>
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
                @change="changeProduct"
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
                <a-select-option v-for="commInfo in commInfos" :key="commInfo.code">{{ commInfo.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelColRight"
              :wrapperCol="wrapperColRight"
              label="设备编号"
            >
              <a-input
                placeholder="可以输入也可以自动生成"
                v-decorator="['deviceKey', validatorRules.deviceKey]"
                :disabled="false"
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
        </a-row>

        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="经度"
            >
              <a-input
                :min="-180" :max="180"
                v-decorator="['longitude', validatorRules.longitude]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="纬度"
            >
              <a-input
                :min="-90" :max="90"
                v-decorator="['latitude', validatorRules.latitude]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="详细地址">
              <a-input
                placeholder="请输入设备地址"
                v-decorator="['position', {}]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="厂商名称">
              <a-input
                placeholder="请输入厂商名称"
                v-decorator="['manufacturerName', validatorRules.manufacturerName]"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="18" :sm="8">
            <a-form-item
              style="height: 45px"
              :labelCol="{xs: { span: 24 }, sm: { span: 4 }}"
              :wrapperCol="{xs: { span: 24 }, sm: { span: 20 }}"
              label="标签分组"
            >
              <a-select
                mode="multiple"
                placeholder="请选择标签"
                @change="handleSelectChange"
                v-model="selectTags"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'"
              >
                <a-select-option v-for="i in tagNames" :key="i.tagName">{{ i.tagName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item>
              <a @click="showAddTagsModal">新增标签</a>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8" v-show="selectProduct.isDivideGroup=='1'">
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
                >{{ i.deviceGroupName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" v-show="false">
            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="设备分组名称">
              <a-input v-decorator="['deviceGroupName', validatorRules.deviceGroupName]"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
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
          <a-col :md="12" :sm="8" v-show="model.nodeType=='3'">
            <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="接入网关">
              <a-select
                v-decorator="['parentId',validatorRules.parentId]"
                :triggerChange="true"
                @change="changeParentId"
                placeholder="请选择接入网关"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
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
              <a-input
                v-decorator="['nodeType', {initialValue: selectProduct.nodeType}]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="描述">
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
    <TagsAddModal ref="addDeviceTags" :deviceTags="tagNames" @loadNewTag="loadNewTag"></TagsAddModal>
  </a-modal>
</template>

<script>
import { getAction, httpAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import qs from 'qs'
import { isLetters } from '@/views/iot/js/iot_validate'
import { unitValidate, floatNumberValidate } from '../../js/iot_validate'
import TagsAddModal from './TagsAddModal'
import Vue from 'vue'

export default {
  name: 'DeviceModal',
  // 组件应用定义
  components: {
    JSelectUserNew,
    TagsAddModal
  },
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
      // productInfos: [],//所有已发布产品信息 id,productName,nodeType,productType
      gateways: [], // 所有网关信息 id ，name ，productId
      deviceGroup: [],
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
        manufacturerName: {
          initialValue: '测试产品默认厂商',
          rules: [{ required: true, message: ' ' }, { validator: this.validateManufacturerName }]
        },
        productId: { rules: [{ required: true, message: '请选择对应产品!' }] },
        parentId: { rules: [{ required: false, message: '请选择接入网关!' }] },
        deviceIntroduction: {
          rules: [{ max: 250, message: '最多输入250字!' }]
        },
        latitude: {
          rules: [{ validator: this.validateLatitude }]
        },
        longitude: {
          rules: [{ validator: this.validateLongitude }]
        }
      },
      url: {
        add: '/device/device/add',
        edit: '/device/device/edit',
        getTagList: '/tags/tags/getTagList',
        getTagListByDeviceId: '/tags/deviceTags/getTagListByDeviceId',
        productInfos: '/product/product/productNames',
        commInfos: '/communcationManager/communcationManager/listByPrjCode',
        deviceListByType: '/device/device/deviceListByType',
        getDeviceGroupByProduct: '/device/deviceGroup/getDeviceGroupByProduct'
      },
      attachment: [],
      tagNames: [],
      selectTags: []
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
    this.getTagList()
  },
  // 计算属性
  computed: {
    disabledBtn () {
      return (this.nodeId != '' && this.nodeId != 'UserTask_0') || this.title == '查看' ? this.blank : this.handleChange
    },
    hint () {
      let hintMsg = ''
      switch (this.title) {
        case '新增':
          hintMsg = '新增一个设备，并添加其基本参数'; break
        case '编辑':
          hintMsg = '编辑设备的基本参数'; break
        case '查看':
          hintMsg = '查看设备的基本参数，但不能进行修改'; break
        default:
          hintMsg = '设备命令的基本参数'
      }
      return hintMsg
    }
  },
  mounted () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (this.projectMsg) {
      this.prjCode = this.projectMsg.prjCode
      this.getCommInfos()
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
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields()
      console.log('查看edit 方法： record:', record)
      if (record.nodeId !== undefined) {
        this.nodeId = record.nodeId
      }
      if (record.nodeName !== undefined) {
        this.nodeName = record.nodeName
      }
      this.model = Object.assign({}, record)
      console.log('model-->', this.model)

      // 获取设备标签
      getAction(this.url.getTagListByDeviceId, { deviceId: this.model.id }).then(res => {
        if (res.success) {
          res.result.forEach(data => {
            this.selectTags.push(data.tagName)
          })
        } else {
          console.log('tag-->', res)
          this.$message.error('获取标签失败！')
        }
      })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'productId',
            'parentId',
            'deviceKey',
            'tagNames',
            'deviceName',
            'manufacturerName',
            'deviceIntroduction',
            'deviceState',
            'nodeType',
            'deviceType',
            'deviceSecret',
            'inputerName',
            'inputerFullname',
            'notifyMethod',
            'deviceProperties',
            'deviceGroupId',
            'deviceGroupName',
            'position',
            'longitude',
            'latitude'
          )
        )
        this.selectTags = []
        // if(this.model.tagNames != null) {
        //   let tags = this.model.tagNames.split(',')
        //   this.selectTags = tags
        // }
      })
    },
    // 校验设备名称
    validatorDeviceName (rule, value, callback) {
      let label = '设备名称'
      let length = [2, 32]
      unitValidate(label, length, rule, value, callback)
    },
    validateLongitude (rule, value, callback) {
      let label = '经度'
      let length = [1, 16]
      floatNumberValidate(label, length, rule, value, callback)
    },
    validateLatitude (rule, value, callback) {
      let label = '维度'
      let length = [1, 16]
      floatNumberValidate(label, length, rule, value, callback)
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

          console.log('formData=>', formData)

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
                that.$message.error('操作失败')
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
    handleSelectChange (value) {
      let tags = ''
      tags = value.toString()
      console.log(tags)
      this.model.tagNames = tags
    },
    handleCancel () {
      this.close()
    },
    // 获取所有产品ID和名称
    getProductInfos () {
      let that = this
      this.queryParam.prjCodes = this.prjCodes
      console.log('this.prjCodes', this.prjCodes)
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
      this.model.nodeType = this.selectProduct.nodeType
      if (this.selectProduct.nodeType === '3') {
        var that = this
        postAction(that.url.deviceListByType, {
          nodeType: '2'
        }).then(res => {
          if (res.success) {
            var result = res.result[0]
            that.gateways = result.devices
          } else {
            that.$message.error('查询设备信息失败')
          }
        })
      }
      if (this.selectProduct.isDivideGroup === '1') {
        let that = this
        console.log(that.selectProduct.id)
        getAction(that.url.getDeviceGroupByProduct, { productId: that.selectProduct.id }).then(res => {
          if (res.success) {
            that.deviceGroup = res.result
          } else {
            that.$message.error('查询设备信息失败')
          }
        })
      }
    },
    changeParentId (value) {
      console.log('gateways => value =>', value)
    },
    setDeviceGroupName (deviceGroupName) {
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
    // 编号验证
    valiKey: function (rule, value, callback) {
      if (isLetters(value)) {
        callback()
      } else {
        callback('请输入正确的设备编号(数字，字母，下划线,短横线)!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';

/deep/.ant-select-selection__rendered {
  line-height: 34px;
}
</style>
