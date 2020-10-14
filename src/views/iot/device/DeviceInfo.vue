<!--设备信息  用于设备详情中-->
<template>
  <a-card :bordered="false" :loading="confirmLoading">
    <div>
      <div>
        <a-row  class="deviceInfo-operate-row">
          <a-button
            class="buttonWrap "
            @click="handleEdit"
            style="margin-left:10px; "
            type="primary"
            v-show="isEdit && dataSource.deviceState !== '1' && projectMsg"
            icon="edit">编辑</a-button>
          <a-button
            class="buttonWrap "
            @click="handleReset"
            style="margin-left:10px; "
            type="primary"
            v-show="!isEdit"
            icon="reload">重置</a-button>
          <a-button class="buttonWrap " @click="handleOk" type="primary" v-show="!isEdit" icon="save">保存</a-button>
        </a-row>
        <a-form :form="form">
          <a-input-group>
            <a-row class="deviceInof-row" :gutter="24">
                  <a-col :md="8" :sm="12" style="padding: 0">
                      <span class="deviceInfo-lable"  >设备名称: </span>
<!--                    <a-textarea class="labelWrap" style="width: 35%;" value="设备名称" :disabled="true"></a-textarea>-->
                    <a-textarea class="deviceInfo-contentWrap"  v-model="tempDeviceName" :class="{enableEdit: isEdit}" :disabled="isEdit"></a-textarea>
                  </a-col>
                  <a-col :md="8" :sm="12" style="padding: 0;">
                    <span class="deviceInfo-lable"  >节点类型: </span>
                    <a-textarea class="deviceInfo-contentWrap"  v-model="nodeTypes[dataSource.nodeType]" :class="{enableEdit: true}" :disabled="isEdit"></a-textarea>
<!--                    <j-dict-select-tag-->
<!--                      placeholder="请选择节点类型"-->
<!--                      :triggerChange="true"-->
<!--                      dictCode="iot_node_type"-->
<!--                      class="deviceInfo-select"-->
<!--                      style=" background: white;"-->
<!--                      v-model="dataSource.nodeType"-->
<!--                      @change="change"-->
<!--                      :disabled="true">-->
<!--                    </j-dict-select-tag>-->
                  </a-col>
                  <a-col :md="8" :sm="12" style="padding: 0">
                    <span class="deviceInfo-lable"  >添加时间: </span>
                    <a-textarea class="deviceInfo-contentWrap"  v-model="dataSource.createTime" :class="{enableEdit: true}" :disabled="true"></a-textarea>
                  </a-col>
            </a-row>
            <a-row class="deviceInof-row" :gutter="24">
                  <a-col :md="8" :sm="12" style="padding: 0">
                    <span class="deviceInfo-lable"  >设备编号: </span>
                    <a-textarea class="deviceInfo-contentWrap"  v-model="dataSource.deviceKey" :class="{enableEdit: isEdit}" :disabled="isEdit"></a-textarea>
                  </a-col>
                  <a-col :md="8" :sm="12" style="padding: 0">
                    <span class="deviceInfo-lable"  >IP地址: </span>
                    <a-textarea class="deviceInfo-contentWrap"  value="192.168.0.0" :class="{enableEdit: true}" :disabled="true"></a-textarea>
                  </a-col>
                  <a-col :md="8" :sm="12" style="padding: 0">
                    <span class="deviceInfo-lable"  >激活时间: </span>
                    <a-textarea class="deviceInfo-contentWrap"  v-model="dataSource.createTime" :class="{enableEdit: true}" :disabled="true"></a-textarea>
                  </a-col>
            </a-row>
            <a-row  class="deviceInof-row" :gutter="24">
                  <a-col :md="8" :sm="12" style="padding: 0">
                    <span class="deviceInfo-lable"  >当前状态: </span>
                    <a-textarea class="deviceInfo-contentWrap"  v-model="deviceStates[dataSource.deviceState]" :class="{enableEdit: true}" :disabled="true"></a-textarea>
<!--                    <j-dict-select-tag-->
<!--                      placeholder="请选择当前状态"-->
<!--                      :triggerChange="true"-->
<!--                      dictCode="iot_device_state"-->
<!--                      class="ant-select-selection&#45;&#45;single"-->
<!--                      style="background: white;"-->
<!--                      v-model="dataSource.deviceState"-->
<!--                      @change="changeState"-->
<!--                      :disabled="true">-->
<!--                    </j-dict-select-tag>-->
                  </a-col>
                  <a-col :md="8" :sm="12" style="padding: 0">
                    <span class="deviceInfo-lable"  >实时延迟: </span>
                    <a-textarea class="deviceInfo-contentWrap" value="待采集" :class="{enableEdit: true}" :disabled="true"></a-textarea>
                  </a-col>
                  <a-col :md="8" :sm="12" style="padding: 0">
                      <span class="deviceInfo-lable"  >最后上线时间: </span>
                    <a-textarea class="deviceInfo-contentWrap" v-model="dataSource.lastOnlineTime" :class="{enableEdit: true}" :disabled="true"></a-textarea>
                  </a-col>
            </a-row>
          </a-input-group>
        </a-form>
      </div>
    </div>
  </a-card>
</template>

<script>
import qs from 'qs'
import { unitValidate1 } from '../js/iot_validate'
import { postAction } from '../../../api/manage'

export default {
  name: 'DeviceInfo',
  mixins: [],
  props: {
    dataSource: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      visible: false,
      projectMsg: null,
      description: '描述信息',
      // 表头
      confirmLoading: false,
      form: this.$form.createForm(this),
      collapsed: false,
      isEdit: true,
      deviceState: '',
      deviceStates: {
        0: '未激活',
        1: '在线',
        2: '离线',
        3: '异常'
      },
      nodeTypes: {
        1: '设备',
        2: '网关',
        3: '子设备'
      },
      datas: '',
      tempDeviceName: '临时存储更改的设备名称',
      IP: '', // 设备ip地址
      url: {
        changeProductState: '/product/product/changeProductState',
        queryById: '/device/device/queryById',
        edit: '/device/device/edit'
      },
      validatorRules: {
        deviceKey: {
          rules: [{ required: false, message: '输入设备编号，若不填写则自动生成编号' }, { validator: this.valiKey }]
        },
        deviceState: {
          rules: [{ required: true, message: '请选择设备状态!' }],
          initialValue: '0'
        },
        deviceName: {},
        productId: { rules: [{ required: true, message: '请选择对应产品!' }] },
        parentId: { rules: [{ required: false, message: '请选择接入网关!' }] },
        deviceIntroduction: {
          rules: [{ max: 250, message: '最多输入250字!' }]
        }
      }
    }
  },
  beforeCreate () {
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    // 加载数据
    this.tempDeviceName = this.dataSource.deviceName

    console.log('loadData', this.tempDeviceName)
  },
  /* watch: {
         '$route'(to, from) {
             this.datas = this.dataSource;
             //重新加载数据
             console.log('路由更改重新加载组件',to,from);
         }
     }, */
  // 计算属性
  computed: {
    disabledBtn () {
      return this.nodeId !== '' && this.nodeId !== 'UserTask_0' || this.title === '查看' ? this.blank : this.handleChange
    }
  },
  methods: {
    add () {
      this.edit({})
    },
    initTokens () {
    },
    change (value) {
      console.log('查看value', value)
      this.dataSource.nodeType = value
    },
    changeState (value) {
      this.dataSource.deviceState = value
    },
    changeActivekey (value) {
      console.log(value)
    },
    close () {
    },
    handleCancel () {
    },
    handleEdit () {
      this.isEdit = false
    },
    handleReset () {
      // 重新加载数据
      this.$emit('reloadData')
      this.isEdit = true
      this.tempDeviceName = this.dataSource.deviceName
    },
    checkForm () {
      // 校验修改后的设备名称
      let checkInfo = ''
      checkInfo = unitValidate1('设备名称', [2, 32], this.tempDeviceName)
      // console.log(checkInfo)
      if (checkInfo !== 0) {
        this.$message.error(checkInfo)
        return false
      } else {
        return true
      }
    },
    handleOk () {
      const that = this
      // this.form.validateFields((err, values) => {
      //   if (!err) {
      //
      //   }
      // })
      if (this.checkForm()) {
        that.dataSource.deviceName = that.tempDeviceName
        const formData = that.dataSource
        postAction(that.url.edit, qs.stringify(formData)).then(res => {
          if (res.success) {
            that.$message.success('保存成功！')
          } else {
            that.$message.error('操作失败！')
          }
        }).finally(() => {
          this.isEdit = true
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
  /deep/.ant-card-body {
    padding-top: 0px !important;
  }
  .buttonWrap {
    float: right;
    color: white;
  }

  .labelWrap {
    text-align: center;
    height: 30px;
    resize: none;
  }

  .enableEdit {
    text-align: left;
    color: #999999;
  }
  .deviceInfo-operate-row{
    height: 48px;
    padding-right: 90px;
    padding-bottom: 10px;
  }
  .deviceInof-row{
    margin-bottom: 16px;
  }
  .deviceInfo-lable{
    width: 25%;
    height: 36px;
    float: left;
    font-size: 14px;
    font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
    font-weight: 400;
    text-align: right;
    color: #333333;
    line-height: 34px;
    margin-left: -25px;
    padding-right: 7px;
  }
  .deviceInfo-contentWrap {
    width: 60%;
    float: left;
    height: 30px;
    resize: none;
    font-size: 14px;
    font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
    font-weight: 400;
    padding-right: 30px;
  }
</style>
