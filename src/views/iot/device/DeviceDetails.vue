<!--设备详情页面-->
<template>
  <a-card :bordered="false">
    <div>
      <div class="device-info">
        <a-row style="font-size: larger">
          <a-col>
            <span class="device-name">{{ dataSource.deviceName }}</span>
            <img :src="imgUrl" style="margin-left: 25px;" alt="">
            <span class="state-name" :style="'color:'+ deviceColor[dataSource.deviceState]">{{ deviceStates[dataSource.deviceState] }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" style="padding-top: 20px">
          <a-col :span="8">
            <img class="device-top-img" src="@views/iot/img/device/productName_icon.png"  alt="">
            <span class="device-top-title">
              所属产品:
            </span>
            <span class="device-top-msg">
              {{ productName }}
            </span>
          </a-col>
          <a-col :span="8">
            <img class="device-top-img" src="@views/iot/img/device/productKey_icon.png" alt="">
            <span class="device-top-title">
              产品编号:
            </span>
            <span class="device-top-msg">
              {{  productKey }}
            </span>
          </a-col>
          <a-col :span="8">
            <img class="device-top-img" src="@views/iot/img/device/commKey_icon.png"  alt="">
            <span class="device-top-title">
              通讯管理机编号:
            </span>
            <span class="device-top-msg">
              {{   dataSource.commKey }}
            </span>
          </a-col>
          <!--          <a-col :span="8" v-if="deviceGroupName != ''">-->
          <!--            <span class="device-top-title">-->
          <!--              所属分组:{{deviceGroupName}}-->
          <!--            </span>-->
          <!--          </a-col>-->
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <img class="device-top-img" src="@views/iot/img/device/manufacturer_icon.png" alt="">
            <span class="device-top-title">
              设备厂商:
            </span>
            <span class="device-top-msg">
              {{  dataSource.manufacturerName  }}
            </span>
          </a-col>
          <a-col :span="8">
            <img class="device-top-img" src="@views/iot/img/device/deviceKey_icon.png"  alt="">
            <span class="device-top-title">
              设备编号:
            </span>
            <span class="device-top-msg">
              {{  dataSource.deviceKey  }}
            </span>
          </a-col>
        </a-row>
      </div>
      <a-tabs @change="tabChange" style="font-size: larger" :defaultActiveKey="defaultOpenTag">
        <!--设备信息-->
        <a-tab-pane tab="设备信息" key="1">
          <a-tab-pane label="设备信息">设备信息</a-tab-pane>
          <div>
            <a-collapse @change="changeActivekey" v-model="activeKey" :bordered="false" v-if="loaded === true">
              <a-collapse-panel header="设备信息" key="1">
                <DeviceInfo ref="deviceInfo" :dataSource="dataSource" @reloadData="reloadData"></DeviceInfo>
              </a-collapse-panel>
              <a-collapse-panel header="设备拓展信息" key="2">
                <DeviceExtensionInfo :extensionData="extensionData"></DeviceExtensionInfo>
              </a-collapse-panel>
              <a-collapse-panel header="点码表" key="3" :disabled="false" v-if="pointCodeShow">
                <PointCode ref="pointCode" :datas="pData" :deviceData="dataSource"></PointCode>
              </a-collapse-panel>
              <a-collapse-panel header="设备属性" key="4" :disabled="false" v-if="devicePropertyShow">
                <DeviceProperty ref="deviceProperty" :datas="pData" :deviceData="dataSource"></DeviceProperty>
              </a-collapse-panel>
              <a-collapse-panel header="应用信息" key="5">
                <span>所属应用：无应用信息</span><b>--</b> <span>立即添加</span>
              </a-collapse-panel>
              <a-collapse-panel header="标签信息" key="6">
                <TagsMessageModal :deviceId="this.dataSource.id"></TagsMessageModal>
              </a-collapse-panel>
            </a-collapse>
          </div>

        </a-tab-pane>
        <a-tab-pane tab="运行状态" key="2">
          <DeviceDataDisplay :deviceInfo="dataSource" :tabKey="tabKey"></DeviceDataDisplay>
        </a-tab-pane>
        <a-tab-pane tab="设置" key="3">
        </a-tab-pane>
        <a-tab-pane tab="子设备" key="4" v-if="dataSource.nodeType=='2'">
          <ChildDeviceList :parentId="this.dataSource.id"></ChildDeviceList>
        </a-tab-pane>
        <a-tab-pane tab="日志" key="5">
          <DeviceChangeLog :deviceData="this.dataSource"></DeviceChangeLog>
          <!--           <DeviceChangeLog :deviceData="this.dataSource" :deviceId="this.dataSource.id" :prjCode="this.dataSource.prjCode"></DeviceChangeLog>-->
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import qs from 'qs'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import PointCode from './PointCode'
import DeviceProperty from './DeviceProperty'
import DeviceInfo from './DeviceInfo'
import ChildDeviceList from './ChildDeviceList'
import { getAction, postAction } from '@/api/manage'
import DeviceExtensionInfo from './DeviceExtensionInfo'
import DeviceDataDisplay from './DeviceDataDisplay'
import DeviceChangeLog from './DeviceChangeLog'
import TagsMessageModal from './modules/TagsMessageModal'

export default {
  name: 'DeviceDetails',
  mixins: [],
  components: {
    PointCode,
    DeviceInfo,
    DeviceExtensionInfo,
    ChildDeviceList,
    DeviceDataDisplay,
    DeviceChangeLog,
    DeviceProperty,
    TagsMessageModal
  },
  data () {
    return {
      imgUrl: '',
      visible: false,
      description: '描述信息',
      // 表头
      confirmLoading: false,
      tabKey: 1, // 当前的tab页的key值
      collapsed: false,
      form: this.$form.createForm(this),
      id: this.$route.query.recordId,
      defaultOpenTag: this.$route.query.type === '子设备' ? '4' : '1',
      productName: '',
      deviceGroupName: '',
      productKey: '',
      dataSource: [],
      activeKey: ['1', '2', '3', '4'],
      pData: [],
      extensionData: [],
      pointCodeShow: false,
      devicePropertyShow: false,
      loaded: false,
      // 设备状态
      deviceState: '',
      url: {
        changeProductState: '/product/product/changeProductState',
        queryById: '/device/device/queryById',
        edit: '/device/device/edit',
        ProductQueryById: '/product/product/queryById'

      },
      // 设备状态计数 样式类
      deviceStateClasses: {
        0: 'device-count-inactivated',
        1: 'device-count-online',
        2: 'device-count-offline',
        3: 'device-count-abnormal'
      },
      // 设备状态数组
      deviceStates: {
        0: '未激活',
        1: '在线',
        2: '离线',
        3: '异常'
      },
      deviceColor: ['#FFB238', '#2BBB65', '#ACACAC', '#E75A5A']
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = this.$route.query.recordId
      // 重新加载数据
      if (to.name === 'iot-device-DeviceDetails') {
        console.log('路由更改重新加载组件', to, from)
        this.loadDeviceInfo()
      }
    }
  },
  beforeCreate () {
    initDictOptions('iot_device_state').then((res) => {
      if (res.success) {
        this.devicestate = res.result
        // console.log('查看字典数据',this.devicestate)
      }
    })
    // 初始化数据字典
    initDictOptions('bpm_status').then((res) => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('leave_type').then((res) => {
      if (res.success) {
        this.leaveDictOptions = res.result
      }
    })
    initDictOptions('iot_node_type').then((res) => {
      if (res.success) {
        this.nodetype = res.result
      }
    })
  },
  created () {
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // this.headers = {
    //     'X-Access-Token': token
    // }
    // // 初始化tokens
    // this.initTokens()
  },
  mounted () {
    // 查询产品信息
    this.loadDeviceInfo()
  },
  computed: {
  },
  methods: {
    add () {
      this.edit({})
    },
    initTokens () {
    },
    changeActivekey (value) {
      console.log(value)
    },
    // 翻译设备状态
    // myFilterDictText() {
    //     if (this.devicestate !== undefined) {
    //         console.log('查看字典数据', this.devicestate)
    //         this.deviceState = filterDictText(this.devicestate, this.dataSource.deviceState);
    //         console.log("查看翻译后的deviceState", this.deviceState)
    //     } else {
    //         // console.log('查看数据字典和码值',this.devicestate, this.dataSource.deviceState)
    //         this.router.go(0);
    //     }
    // },
    // 查询设备信息
    loadDeviceInfo () {
      const params = {
        id: this.id
      }
      const that = this
      that.confirmLoading = true
      getAction(that.url.queryById, params).then(res => {
        if (res.success) {
          // that.$message.success('查询设备信息成功');
          console.log('设备信息', res.result)
          that.dataSource = res.result
          if (res.result.deviceGroupName) {
            that.deviceGroupName = res.result.deviceGroupName
            // console.log(that.deviceGroupName)
          }
          // 翻译设备状态
          // this.myFilterDictText();
          // if (res.result.nodeType === '2') {
          //   that.pointCodeShow = false
          // }
          // 如果是不接入网关，则点码表也要隐藏
          // TODO
          // console.log('DeviceDetails:isAccessGateWay=>',res.result.isAccessGateway)
          if (res.result.isAccessGateway === '0') {
            that.devicePropertyShow = true
            that.pointCodeShow = false
          } else {
            that.pointCodeShow = true
            that.devicePropertyShow = false
          }
          this.imgUrl = require('../img/device_state_img' + this.dataSource.deviceState + '.png')
          /* else if (res.result.deviceProperties == null) {
                                      that.$message.warning("该设备的属性还未配置！")
                                       that.pointCodeShow = false;
                                  } */
          const ops = {
            id: res.result.id,
            deviceName: res.result.deviceName
          }
          console.log(that.dataSource.deviceName, ops)
          that.pData = ops
          that.loaded = true
          that.getProductNameById(that.dataSource.productId)
          // that.$refs.deviceInfo.tempDeviceName = that.dataSource.deviceName
        } else {
          that.$message.error('查询设备信息失败')
          console.log(res.message)
        }
      }).finally(() => {
        that.confirmLoading = false
        // if(res.result.isAccessGateway==0){
        //   this.$refs.deviceProperty.loadData()
        // }else{
        //   this.$refs.pointCode.loadData()
        // }
      })
    },
    getProductNameById (productId) {
      const params = {
        id: productId
      }
      const that = this
      console.log(params)
      getAction(that.url.ProductQueryById, params).then(res => {
        if (res.success) {
          console.log(res.result)
          that.productName = res.result.productName
          that.productKey = res.result.productKey
        } else {
          that.$message.error('获取产品名称失败')
          console.log('获取产品名称失败', res.result)
        }
      })
    },
    close () {
    },
    handleCancel () {
    },
    reloadData () {
      // 重新加载数据
      this.loadDeviceInfo()
    },
    handleOk () {
      const that = this
      const formData = that.dataSource
      postAction(that.url.edit, qs.stringify(formData)).then(res => {
        if (res.success) {
          that.$message.warning('保存成功！')
        } else {
          that.$message.error('操作失败！')
        }
      })
    },
    tabChange (key) {
      this.tabKey = key
      console.log('tabKey =>', key)
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
/deep/.ant-card-body {
  padding: 16px 16px;
}
  .device-info {
    font-size: 14px;
    font-family: Microsoft YaHei UI;
    font-weight: 400;
    margin-bottom: 10px;
    margin-left: 16px;
    color: rgba(102, 102, 102, 1);
    .device-name {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }

    .state-name {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      margin-left: 5px;
      vertical-align: bottom;
    }
    .device-top-img{
      margin-top: -4px;
    }
    .device-top-title {
      margin-left: 16px;
      width: 64px;
      height: 14px;
      font-size: 14px;
      font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
      font-weight: 400;
      text-align: left;
      color: #999999;
      line-height: 32px;
    }
    .device-top-msg{
      margin-left: 6px;
      width: 168px;
      height: 14px;
      font-size: 14px;
      font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
      font-weight: 400;
      text-align: left;
      color: #333333;
      line-height: 32px;
    }
  }

  .light-device-state {
    display: inline-block;
    width: 8px;
    height: 8px;
    vertical-align: middle;
    margin-right: 7px;
    border-radius: 50%;
  }

  .buttonWrap {
    color: white;
  }

  .styleWrap {
    resize: none;
    height: 40px;
    font-size: 15px;
  }
</style>
