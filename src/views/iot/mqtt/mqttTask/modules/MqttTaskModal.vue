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
    <div style="height:14px;"></div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              class="form-item"
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
              class="form-item"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="动作指令"
            >
              <a-select
                v-decorator="['mqttAction',validatorRules.mqttAction]"
                :triggerChange="true"
                @change="changeMqttAction"
                placeholder="请选择动作指令"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
              >
                <a-select-option
                  v-for="(item, index) in mqttActions"
                  :key="index"
                >{{ item.cmdName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="10" :sm="8" v-if="isActionParams">
            <a-form-item class="action-label">
              参数配置:
              <MqttActionParams ref="mattParams" :pData="pData"></MqttActionParams>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-button
              @click="viewProperties"
              icon="swap"
              v-if="isActionParams"
              class="action-label view-btn"
            >参数预览</a-button>
          </a-col>
          <a-col :md="10" :sm="8" v-if="isActionParams">
            <a-form-item class="action-label">
              组装结果:
              <pre style="height: 250px;">{{ actionParams }}</pre>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item class="action-label">
              选择设备:
              <DeviceSelectTransfer
                ref="deviceTransfer"
                :deviceTransferData="deviceTransferData"
                :selectDeviceIds="selectDeviceIds"
                @change="onTransgerChange"
              ></DeviceSelectTransfer>
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
  </a-modal>
</template>

<script>
import { getAction, httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import MqttActionParams from '../../mqttAction/MqttActionParams'
import DeviceSelectTransfer from '../../../device/DeviceSelectTransfer'
import { randomUUID, randomNumber } from '@/utils/util'
import qs from 'qs'
import { postAction } from '../../../../../api/manage'

export default {
  name: 'MqttTaskModal',
  // 组件应用定义
  components: {
    JDictSelectTag,
    JSelectUserNew,
    MqttActionParams,
    DeviceSelectTransfer
  },
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 父组件传参
  props: {
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
      projectMsg: {},
      nodeId: '',
      model: {},
      selectProduct: {}, // 选择的产品信息
      mqttActions: [], // 产品选择后赋值-对应的动作指令
      selectAction: {}, // 选择的动作信息
      deviceList: [], // 产品选择后赋值-所有在线设备信息
      deviceTransferData: [], // 设备穿梭框数据源 [{key:id,title:deviceName},{}...]
      deviceMsgMap: {}, // 设备Id与信息映射 {id：{devicemsg}}
      // isShowParams: false, //是否显示参数配置相关控件
      pData: [], // 参数配置数据源
      actionParams: {
        // 参数模板
        ID: '',
        DT: '',
        CmdType: ''
      },
      selectDeviceIds: [],
      isActionParams: false, // 是否加载参数相关控件
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
        productId: { rules: [{ required: true, message: '请选择对应产品!' }] },
        mqttAction: { rules: [{ required: true, message: '请选择动作指令!' }] }
      },
      url: {
        add: '/mqtt/mqttTask/add',
        edit: '/mqtt/mqttTask/edit',
        // 获取产品的动作指令
        getMqttActions: '/mqttAction/mqttAction/ActionAllByProductId',
        // 获取产品的设备
        getDeviceList: '/device/device/getDeviceInfoByProductId',

        mqttActionTask: '/mqtt/mqttTask/mqttActionTask',
        // 上传组件地址
        fileUpload: window._CONFIG.domianURL + '/file/uploadFile/add',
        imgerver: window._CONFIG.domianURL + '/sys/common/view',
        fileDownLoad: '/file/uploadFile/downloadFileById'
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
  // 钩子函数
  created () {
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // this.headers = { 'X-Access-Token': token }
    // // 初始化tokens
    // this.initTokens()
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
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
        case '发起指令':
          hintMsg = '选择一个产品下的若干设备，为其添加动作指令'; break
        default:
          hintMsg = '设备指令的基本参数'
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
        this.form.setFieldsValue(
          pick(
            this.model,
            'deviceId',
            'deviceKey',
            'productId',
            'cmdType',
            'cmdName',
            'cmdParams',
            'cmdState',
            'inputerName',
            'inputerFullname'
          )
        )

        // 时间格式化
        this.form.setFieldsValue({ inputTime: this.model.inputTime ? moment(this.model.inputTime) : null })

        // 初始化新任务通知
        if (this.model.notifyMethod != undefined) {
          this.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
        }
      })
      // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
      let that = this
      if (that.attachment.length != 0) {
        let arr = []
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
    close () {
      this.$emit('close')
      this.visible = false
      this.fileList = []
    },
    viewProperties () {
      this.backfillActionParams(this.pData, JSON.parse(this.selectAction.cmdTemplate))
    },
    handleOk () {
      const that = this
      // 调用参数预览函数 更新actionParams参数
      this.viewProperties()
      // 输入验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)
          // 组装设备id和key
          let deviceListParam = []
          this.selectDeviceIds.map(data => {
            deviceListParam.push({
              id: data,
              deviceKey: this.deviceMsgMap[data].deviceKey
            })
          })
          // 组装请求参数body
          let params = {
            productId: formData.productId,
            actionParams: this.actionParams,
            actionName: this.mqttActions[formData.mqttAction].cmdName,
            prjCode: this.projectMsg.prjCode,
            corpCode: this.projectMsg.corpCode,
            deviceList: deviceListParam
          }
          postAction(this.projectMsg.dataServiceUrl + this.url.mqttActionTask, params)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
              } else {
                that.$message.error(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
              that.$emit('close')
              that.visible = false
            })
        }
      })
      //   console.log('handleOk pData=>', this.pData)

      // 触发表单验证
      // this.form.validateFields((err, values) => {
      //   if (!err) {
      //     that.confirmLoading = true;
      //     let actionUrl = '';
      //     let method = 'post';
      //     //判断操作类型，新增或者编辑
      //     if(!this.model.id){
      //       actionUrl+=this.url.add;
      //     }else{
      //       actionUrl+=this.url.edit;
      //     }
      //     // 表单数据赋值给formData
      //     let formData = Object.assign(this.model, values);
      //
      //     //对formData中的时间字段进行 时间格式化
      //     formData.inputTime = formData.inputTime?formData.inputTime.format('YYYY-MM-DD HH:mm:ss'):null;
      //
      //     if (that.attachment.length == 1) {
      //        formData[that.attachment[0].fieldName] = that.attachment[0].groupId;
      //     } else {
      //        for (let i = 0; i < that.attachment.length; i++) {
      //          formData[that.attachment[i].fieldName] = that.attachment[i].groupId
      //        }
      //     }
      //     //发起提交或保存请求
      //     httpAction(actionUrl,qs.stringify(formData),method).then((res)=>{
      //       if(res.success){
      //         that.$message.success(res.message);
      //         that.$emit('ok');
      //       }else{
      //         that.$message.warning('操作失败');
      //       }
      //     }).finally(() => {
      //       that.confirmLoading = false;
      //       that.close();
      //     })
      //   }
      // })
    },
    handleChange (info) {
      // 调用改变方法
      this.handleChange1(info, this, 0)
    },
    handlePicCancel () {
      this.previewVisible = false
    },
    handleCancel () {
      // this.isShowParams = false;
      this.close()
    },
    initTokens () {
      if (this.attachment.length >= 1) {
        for (let i = 0; i < this.attachment.length; i++) {
          this.attachment[i].fileTokens = ''
        }
      }
    },
    // 选择产品回调函数  根据选择的产品查询设备信息和指令信息
    changeProduct (value) {
      this.selectProduct = this.getSelectProductById(value)
      console.log('changeProduct ,value=>', value)
      console.log('this.selectProduct =>', this.selectProduct)
      var that = this
      getAction(that.url.getMqttActions, {
        productId: value
      }).then(res => {
        if (res.success) {
          that.mqttActions = res.result
          console.log(' that.mqttActions =>', that.mqttActions)
        } else {
          that.$message.warning('查询动作信息失败')
        }
      })
      getAction(that.url.getDeviceList, {
        productId: value
      }).then(res => {
        if (res.success) {
          that.deviceList = res.result
          this.getDeviceTransgerData(res.result)
          console.log(' that.deviceList =>', that.deviceList)
        } else {
          that.$message.warning('查询设备信息失败')
        }
      })
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
    // 选择动作指令回调函数
    changeMqttAction (value) {
      this.isActionParams = false
      let id = this.mqttActions[value].id
      this.selectAction = this.getSelectActionById(id)
      console.log('changeMqttAction ,value=>', id)
      console.log('this.selectAction =>', this.selectAction)
      let cmdParams = JSON.parse(this.selectAction.cmdParams)
      // this.initPData(cmdParams);
      this.pData = cmdParams
      this.$nextTick(() => {
        this.isActionParams = true
      })
    },
    initPData (cmdParams) {
      console.log('initPData')
      let j = 0
      for (let i in cmdParams) {
        let tempData = {
          name: '',
          alias: '',
          value: ''
        }
        tempData.name = cmdParams[i]
        tempData.alias = i
        this.pData[j] = tempData
        j++
      }
      console.log('this.pData', this.pData)
    },
    backfillActionParams (pData, cmdTemplate) {
      for (let i in pData) {
        cmdTemplate[pData[i].alias] = pData[i].value
      }
      this.actionParams = cmdTemplate
    },
    // 根据id从mqttActions中获取选择的动作信息
    getSelectActionById (id) {
      var that = this
      var i, p
      var pnames = that.mqttActions
      for (i in pnames) {
        p = pnames[i]
        if (p.id === id) {
          break
        }
      }
      return p
    },
    getDeviceTransgerData (deviceList) {
      this.deviceTransferData = [] // 清空
      for (let i in deviceList) {
        this.deviceTransferData.push({
          key: deviceList[i].id,
          title: deviceList[i].deviceName,
          description: deviceList[i].deviceKey,
          disabled: false
        })
        this.deviceMsgMap[deviceList[i].id] = {
          title: deviceList[i].deviceName,
          deviceKey: deviceList[i].deviceKey
        }
      }
    },
    // 设备选择穿梭框change回调函数
    onTransgerChange (value) {
      this.selectDeviceIds = value
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';

.form-item {
  height: 45px;
}

.action-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.view-btn {
  margin: 140px 0 0 10px;
}

.btnClass {
  margin-top: 8px;
}
</style>
