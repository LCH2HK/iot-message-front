<!--产品详情页面 -->
<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <div>
        <div style="margin-bottom: 10px">
          <a-row style="font-size: larger">
            <strong>
              <span>{{ dataSource.productName }}</span>
            </strong>
            <a-button
              class="buttonWrap"
              type="primary"
              @click="doPublish"
              v-show="dataSource.productState !=='1'"
            >发布</a-button>
            <a-button
              class="buttonWrap"
              type="primary"
              @click="undoPublish"
              v-show="dataSource.productState ==='1'"
            >撤销发布</a-button>
          </a-row>
          <a-row :gutter="24" style="font-size: medium; padding-top: 20px">
            <a-col :span="8">
              产品编号:
              <span>{{ dataSource.productKey }}</span>
            </a-col>
            <a-col :span="8">
              设备数量:
              <span>{{ deviceNumber }}</span>
            </a-col>
            <a-col :span="8">
              <span
                style="color: #0000cc; cursor: pointer"
                @click="routerPush(recordId, '../device/DeviceList')"
              >前往管理</span>
            </a-col>
          </a-row>
        </div>
        <a-tabs>
          <a-tab-pane tab="产品信息" key="1">
            <a-collapse v-model="activeKey" :bordered="false">
              <a-collapse-panel header="产品信息" key="1">
                <a-row style="margin-bottom: 5px">
                  <a-button
                    class="buttonWrap"
                    @click="handleEdit"
                    type="primary"
                    v-show="dataSource.productState !=='1' && disable === true"
                    icon="edit"
                  >编辑</a-button>
                  <a-button
                    class="buttonWrap"
                    @click="undoChange"
                    type="primary"
                    style="margin-left:10px;"
                    v-show="dataSource.productState !=='1' && disable === false"
                    icon="close"
                  >重置</a-button>
                  <a-button
                    class="buttonWrap"
                    @click="saveChange"
                    type="primary"
                    v-show="dataSource.productState !=='1' && disable === false"
                    icon="save"
                  >保存</a-button>
                </a-row>
                <a-form :form="form">
                  <div class="product-info-container">
                    <div>
                      <span>产品名称:</span>
                      <a-textarea
                        class="info-content"
                        v-model="tempProductName"
                        :class="{ enableEdit: disable }"
                        :disabled="disable"
                      ></a-textarea>
                    </div>
                    <div>
                      <span>节点类型:</span>
                      <j-dict-select-tag
                        class="select-info-item"
                        placeholder="请选择节点类型"
                        :triggerChange="true"
                        dictCode="iot_node_type"
                        v-model="dataSource.nodeType"
                        @change="changeNodeType"
                        :disabled="disable !== false"
                      ></j-dict-select-tag>
                    </div>
                    <div>
                      <span>录入时间:</span>
                      <a-textarea
                        class="info-content"
                        :class="{ enableEdit: true }"
                        v-model="dataSource.createTime"
                        :disabled="true"
                      ></a-textarea>
                    </div>
                    <div>
                      <span>产品版本:</span>
                      <a-textarea
                        class="info-content"
                        value="version 1.0"
                        :class="{ enableEdit: true }"
                        :disabled="true"
                      ></a-textarea>
                    </div>
                    <div>
                      <span>所属分类:</span>
                      <a-textarea
                        class="info-content"
                        :class="{ enableEdit: true }"
                        v-model="dataSource.productType"
                        :disabled="true"
                      ></a-textarea>
                    </div>
                    <div>
                      <span>数据格式:</span>
                      <a-textarea
                        class="info-content"
                        v-model="dataFormat"
                        :class="{ enableEdit: disable }"
                        :disabled="disable"
                      ></a-textarea>
                    </div>
                    <div>
                      <span>状态:</span>
                      <j-dict-select-tag
                        class="select-info-item"
                        :triggerChange="true"
                        dictCode="iot_product_state"
                        v-model="dataSource.productState"
                        @change="changeProductState"
                        :disabled="true"
                      ></j-dict-select-tag>
                    </div>
                    <div>
                      <span>是否接入网关:</span>
                      <j-dict-select-tag
                        :triggerChange="true"
                        class="select-info-item"
                        dictCode="iot_is_access_gateway"
                        v-model="dataSource.isAccessGateway"
                        @change="changeIsAccessGateway"
                        :disabled="disable"
                      ></j-dict-select-tag>
                    </div>

                    <div v-if="dataSource.isAccessGateway === '0'">
                      <span>通讯协议:</span>
                      <a-select
                        v-model="dataSource.protocolType"
                        :disabled="disable"
                        class="select-info-item"
                      >
                        <a-select-option
                          v-for="item in interProtocol"
                          :key="item.value"
                        >{{ item.title }}</a-select-option>
                      </a-select>
                    </div>
                    <div v-if="dataSource.isAccessGateway === '1'">
                      <span>接入方式:</span>
                      <j-dict-select-tag
                        :triggerChange="true"
                        class="select-info-item"
                        dictCode="iot_product_networkmethod"
                        v-model="dataSource.networkMethod"
                        @change="changeNetWorkMethod"
                        :disabled="disable"
                      ></j-dict-select-tag>
                    </div>
                    <div>
                      <span>数据存储频率:</span>
                      <j-cron
                        class="info-content"
                        v-model="dataSource.historyDataFrequency"
                        :disabled="disable"
                      ></j-cron>
                    </div>
                    <div>
                      <span>数据保留月数:</span>
                      <a-input-number
                        :min="6"
                        :max="120"
                        class="select-info-item"
                        :disabled="disable"
                        v-model="dataSource.longestSaveMonth"
                      />
                    </div>
                    <div>
                      <span>心跳检测频率:</span>
                      <j-cron
                        class="info-content"
                        v-model="dataSource.heartBeatFrequency"
                        :disabled="disable"
                      ></j-cron>
                    </div>
                    <div class="description-area">
                      <span>描述信息:</span>
                      <a-textarea
                        class="description-content"
                        v-model="dataSource.productIntroduction"
                        :class="{ enableEdit: disable }"
                        :disabled="disable"
                      ></a-textarea>
                    </div>
                  </div>
                </a-form>
              </a-collapse-panel>
              <a-collapse-panel
                header="属性配置"
                key="3"
                :disabled="false"
                class="customStyle"
                v-if="true"
              >
                <ProductSetProperty ref="pointCode" :pData="pData"></ProductSetProperty>
              </a-collapse-panel>
              <a-collapse-panel
                header="属性配置"
                key="4"
                :disabled="false"
                class="customStyle"
                v-if="false"
              >
                <ProductSetPropertyForMqtt ref="pointCode2" :pData="pData"></ProductSetPropertyForMqtt>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
          <!-- <a-tab-pane tab="产品功能" key="2"></a-tab-pane> -->
          <a-tab-pane tab="设备分组" key="3" v-if="pData.isDivideGroup == 1">
            <DivideGroup :productId="pData.id" :ifProductPublished="pData.productState"></DivideGroup>
          </a-tab-pane>
          <a-tab-pane tab="动作指令" key="4" v-if="this.dataSource.isAccessGateway == '0'">
            <MqttActionList :productId="pData.id"></MqttActionList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import { httpAction } from '@/api/manage'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import qs from 'qs'
import { normalValidate1 } from '../js/iot_validate'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import ProductSetProperty from './ProductSetProperty'
import ProductSetPropertyForMqtt from './ProductSetPropertyForMqtt'
import MqttActionList from '../mqtt/mqttAction/MqttActionList'
import DivideGroup from './DivideGroup'
import JCron from '@/components/cmp/JCron.vue'
import { getAction } from '../../../api/manage'

export default {
  name: 'ProductInfo',
  mixins: [CmpListMixin],
  components: {
    ProductSetProperty,
    ProductSetPropertyForMqtt,
    MqttActionList,
    JCron,
    DivideGroup
  },
  data () {
    return {
      visible: false,
      // 表头
      confirmLoading: false,
      collapsed: false,
      form: this.$form.createForm(this),
      recordId: this.$route.query.recordId,
      dataSource: [],
      deviceNumber: 0,
      activeKey: ['1'],
      nodeType: '',
      netProtocol: '',
      interProtocol: '',
      netMethod: '',
      isAccessGateway: '',
      productState: '',
      disable: true,
      isAccessGatewayChanged: false,
      pData: '',
      dataFormat: '暂未定义',
      tempProductName: '临时产品名称', // 用于存放临时更改的产品名称
      url: {
        changeProductState: '/product/product/changeProductState',
        queryById: '/product/product/queryById',
        list: '/product/product/list',
        edit: '/product/product/edit',
        getGroupNum: '/device/deviceGroup/getGroupNumberByProductId',
        getDeviceNum: '/device/device/getDeviceNumberByProductId'
      },
      validatorRules: {
        productName: {
          rules: [
            { required: true, message: '请输入产品名称!' },
            { max: 20, message: '最多输入20字' }
          ]
        },
        productIntroduction: { rules: [{ max: 2000, message: '最多输入2000字' }] }
      }
    }
  },
  beforeCreate () {
    // 获取字典数据
    // 节点类型字典
    initDictOptions('iot_node_type').then(res => {
      if (res.success) {
        this.nodetype = res.result
      }
    })
    // //产品类别字典
    // initDictOptions('iot_product_model').then((res) => {
    //   if (res.success) {
    //     this.product_model = res.result
    //   }
    // })
    // //产品发布状态字典
    // initDictOptions('iot_product_state').then((res) => {
    //   if (res.success) {
    //     this.productstate = res.result
    //   }
    // })
    // 联网协议字典
    initDictOptions('iot_product_protocoltype').then(res => {
      if (res.success) {
        this.interProtocol = res.result
        console.log('interProtocol-->', this.interProtocol)
      }
    })
    // //是否是网关字典
    // initDictOptions('iot_is_access_gateway').then((res) => {
    //   if (res.success) {
    //     this.isaccessgateway = res.result
    //   }
    // })
    // //接入方式字典
    // initDictOptions('iot_product_networkmethod').then((res) => {
    //   if (res.success) {
    //     this.networkmethod = res.result
    //     console.log('接入方式字典', res.result)
    //   }
    // })
  },
  mounted () {},
  watch: {
    $route (to, from) {
      this.recordId = this.$route.query.recordId
      // 重新加载数据
      // console.log('路由更改重新加载组件', to, from)
      // 加载数据
      this.loadData()
    }
  },
  created () {
    // 加载数据
    // this.loadData()
  },
  // 计算属性
  computed: {
    disabledBtn () {
      return (this.nodeId !== '' && this.nodeId !== 'UserTask_0') || this.title === '查看'
        ? this.blank
        : this.handleChange
    }
  },
  methods: {
    loadData: function () {
      const that = this
      this.confirmLoading = true
      that.dataSource = []
      that.axios
        .get(that.url.queryById, { params: { id: this.recordId } })
        .then(function (res) {
          that.confirmLoading = true
          that.dataSource = res.result
          that.tempProductName = that.dataSource.productName
          console.log('加载数据=>', that.tempProductName)
          console.log('加载数据 dataSource=>', that.dataSource)
          that.pData = that.dataSource
          // 翻译字典数据
          // 此方法写到此处的原因是获取数据的速度比页面创建的速度慢
          // that.myFilterDictText();
        })
        .finally(() => {
          this.confirmLoading = false
        })
      getAction(this.url.getDeviceNum, { productId: this.recordId }).then(res => {
        that.deviceNumber = res.result
      })
    },
    routerPush (recordId, url) {
      if (this.dataSource.productState === '0') {
        alert('还未进行' + this.dataSource.productName + '发布，请先发布')
      } else {
        this.$router.push({
          path: url,
          query: {
            recordId: recordId
          }
        })
        this.$emit('close')
        this.visible = false
      }
    },
    changeNodeType (value) {
      this.dataSource.nodeType = value
    },
    changeProductState (value) {
      this.dataSource.productState = value
    },
    changeIsAccessGateway (value) {
      if (value) {
        // console.log('changeIsAccessGateway', value);
        this.dataSource.isAccessGateway = value
        if (value === '1') {
          this.isAccessGatewayChanged = true
          this.isNetworkMethods = true
        } else {
          this.isAccessGatewayChanged = false
          this.isNetworkMethods = false
        }
      }
    },
    changeProtocolType (value) {
      if (value) {
        // console.log('protocolType', value);
        this.dataSource.protocolType = value
      }
    },
    changeNetWorkMethod (value) {
      if (value) {
        this.dataSource.networkMethod = value
      }
      // console.log('networkMethod', value);
    },
    handleCancel () {},
    // 发布操作
    doPublish () {
      const that = this
      if (this.dataSource.isDivideGroup === '1') {
        getAction(that.url.getGroupNum, { productId: that.dataSource.id }).then(res => {
          if (res.result === 0) {
            that.$message.warning('未添加设备分组！')
          } else {
            that.publishAction()
          }
        })
      } else if (this.dataSource.isAccessGateway === '0') {
        const productProperties = JSON.parse(this.dataSource.productProperties)
        let flag = false
        const propertiesMap = {}
        console.log('productProperties==>', productProperties)
        for (let i = 0; i < productProperties.length; i++) {
          propertiesMap[productProperties[i].alias] = i
          if (
            productProperties[i].alias === '' ||
            productProperties[i].alias === null ||
            productProperties[i].alias === undefined
          ) {
            this.$message.warning('未配置属性标识！')
            flag = true
            break
          }
        }
        if (flag === false && Object.keys(propertiesMap).length < productProperties.length) {
          this.$message.warning('存在重复的属性标识！')
          flag = true
        }
        if (!flag) {
          that.publishAction()
        }
      } else {
        that.publishAction()
      }
    },
    publishAction () {
      const method = 'post'
      const params = {
        id: this.recordId,
        productState: '1'
      }
      const that = this
      this.$confirm({
        title: '确认发布',
        content: '是否发布' + this.dataSource.productName + '?',
        onOk: function () {
          httpAction(that.url.changeProductState, params, method).then(res => {
            if (res.success) {
              that.$message.success('发布成功！')
              // 刷新页面
              that.refresh()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    undoPublish () {
      const method = 'post'
      const params = {
        id: this.recordId,
        productState: '0'
      }
      const that = this
      this.$confirm({
        title: '确认撤销发布',
        content: '是否撤销对' + this.dataSource.productName + '的发布?',
        onOk: function () {
          httpAction(that.url.changeProductState, params, method).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              // 刷新页面
              that.refresh()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    handleEdit () {
      this.disable = false
    },
    checkForm () {
      // 校验修改后的产品名称
      // console.log('进入校验模块')
      let checkInfo = ''
      checkInfo = normalValidate1('产品名称', [1, 32], this.tempProductName)
      if (checkInfo !== 0) {
        this.$message.error(checkInfo)
        return false
      } else if (this.dataSource.productIntroduction === null) {
        this.dataSource.productIntroduction = ''
      } else if (this.dataSource.productIntroduction.length > 250) {
        this.$message.error('描述信息不能超过250字！')
        return false
      }
      return true
    },
    saveChange () {
      const method = 'post'
      const that = this
      if (that.checkForm()) {
        this.$confirm({
          title: '确认保存修改',
          content: '是否保存对' + this.dataSource.productName + '的修改?',
          onOk: function () {
            that.dataSource.productName = that.tempProductName
            const params = that.dataSource
            httpAction(that.url.edit, qs.stringify(params), method).then(res => {
              if (res.success) {
                // console.log('保存修改成功')
                that.$message.success('保存成功')
                // 刷新页面
                that.refresh()
                that.disable = true
              } else {
                that.$message.warning('保存失败')
              }
            })
          }
        })
      }
    },
    // 撤销更改
    undoChange () {
      this.refresh()
      this.disable = true
    },
    isAccessByGateWay () {
      // console.log('查看', this.dataSource.isAccessGateway)
      return this.dataSource.isAccessGateway === '1'
    },
    refresh () {
      this.dataSource = []
      this.loadData()
      this.dataFormat = '暂未定义'
    }
  }
}
</script>
<style lang="less" scoped>
.buttonWrap {
  margin-right: 30px;
  float: right;
  color: white;
}

.enableEdit {
  color: #b7b7b7;
}

.product-info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 14px;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    margin-bottom: 16px;
    span {
      width: 100px;
      text-align: right;
      margin: 0 8px 2px 0;
    }
    .select-info-item {
      display: inline-block;
      height: 36px;
      width: 65%;
      margin: 0;
    }
    .info-content {
      width: 65%;
      resize: none;
      margin: 0;
    }
  }
  .description-area {
    width: 100%;
    .description-content {
      resize: none;
      width: 89.5%;
      height: 75px;
    }
  }
}

@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>
