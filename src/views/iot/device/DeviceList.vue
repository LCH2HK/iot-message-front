<!--设备列表页面-->
<template>
  <a-card :bordered="false">
    <div>
      <a-form layout="inline">
        <!--        <a-row>-->
        <!--          <div class="device-title">-->
        <!--            <span>设备管理</span>-->
        <!--          </div>-->
        <!--        </a-row>-->
        <a-row class="device-row">
          <a-col class="device-state device-all" :md="5" :sm="8" v-model="deviceCount.allCount">
            <div class="device-count-num device-count-num-all">{{ deviceCount.allCount }}</div>
            <div class="device-content">
              <span>全部设备</span>
            </div>
          </a-col>
          <a-col
            class="device-state device-online"
            :md="5"
            :sm="8"
            v-model="deviceCount.onlineCount"
          >
            <div class="device-count-num device-count-num-online">{{ deviceCount.onlineCount }}</div>
            <div class="device-content">
              <span>当前在线</span>
            </div>
          </a-col>
          <a-col
            class="device-state device-offline"
            :md="5"
            :sm="8"
            v-model="deviceCount.offlineCount"
          >
            <div class="device-count-num device-count-num-offline">{{ deviceCount.offlineCount }}</div>
            <div class="device-content">
              <span>离线</span>
            </div>
          </a-col>
          <a-col
            class="device-state device-inactived"
            :md="5"
            :sm="8"
            v-model="deviceCount.inactivated"
          >
            <div class="device-count-num device-count-num-inactivated">{{ deviceCount.inactivated }}</div>
            <div class="device-content">
              <span>未激活</span>
            </div>
          </a-col>
          <a-col
            class="device-state device-abnormal"
            :md="5"
            :sm="8"
            v-model="deviceCount.abnormalCount"
          >
            <div class="device-count-num device-count-num-abnormal">{{ deviceCount.abnormalCount }}</div>
            <div class="device-content">
              <span>异常</span>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="device-under-part-content">
      <DeviceTree
        class="device-tree-content"
        ref="myDeviceTree"
        @getSelectMessage="getSelectMessage"
        @defaultFocus="initTable"
      ></DeviceTree>
      <a-tabs class="device-tabs-content" @change='tabChange'>
        <a-tab-pane tab="设备列表" key="1">
          <a-button slot="tabBarExtraContent">Extra Action</a-button>
          <!-- </a-tabs> -->
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper" id="searchapp">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :md="18" :sm="18">
                  <a-row :gutter="24">
                    <a-col :md="8" :sm="8">
                      <a-form-item label="设备编号">
                        <j-input-lk
                          :placeholder="'请输入设备编号'"
                          @enterSearch="enterSearch($event,'deviceKey')"
                          @inputValueLk="inputValueLk($event,'deviceKey')"
                          :reset="clickReset"
                        ></j-input-lk>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="8">
                      <a-form-item label="设备名称">
                        <j-input-lk
                          :placeholder="'请输入设备名称'"
                          @enterSearch="enterSearch($event,'deviceName')"
                          @inputValueLk="inputValueLk($event,'deviceName')"
                          :reset="clickReset"
                        ></j-input-lk>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="8" v-if="toggleSearchStatus">
                      <a-form-item label="设备厂商">
                        <j-input-lk
                          :placeholder="'请输入设备厂商'"
                          @enterSearch="enterSearch($event,'manufacturerName')"
                          @inputValueLk="inputValueLk($event,'manufacturerName')"
                          :reset="clickReset"
                        ></j-input-lk>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="8" v-if="toggleSearchStatus">
                      <a-form-item label="设备状态">
                        <j-dict-select-tag v-model="queryParam.deviceState" dictCode="iot_device_state"
                                           placeholder="请选择设备状态"/>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="8" v-if="toggleSearchStatus">
                      <a-form-item label="标签分组">
                        <a-select v-model="queryParam.tagName" allowClear placeholder="请选择标签分组">
                          <a-icon slot="suffixIcon" type="caret-down"/>
                          <a-select-option v-for="i in tagNames" :key="i.tagName">{{ i.tagName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <!--              <a-col :md="5" :sm="8" v-if="toggleSearchStatus">-->
                    <!--                <a-form-item label="节点类型">-->
                    <!--                  <j-dict-select-tag v-model="queryParam.nodeType" dictCode="iot_node_type"/>-->
                    <!--                </a-form-item>-->
                    <!--              </a-col>-->
                    <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
                <span class="table-page-search-submitButtons serachLeft">
<!--                  <a-button type="primary" @click="mySearchQuery" icon="search">查询</a-button>-->
                  <!--                  <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>-->
                  <a @click="handleToggleSearch">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                  </a>
                </span>
                    </a-col>
                    <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
                      <span class="table-page-search-submitButtons serachLeft">
                        <a @click="handleToggleSearch">
                          {{ toggleSearchStatus ? '收起' : '展开' }}
                          <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                        </a>
                      </span>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :md="6" :sm="24">
                  <div class="search-buttons-content">
                    <span style="float: right;overflow: hidden;padding-right: 10px;"
                          class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                    <a-button
                      type="primary"
                      @click="mySearchReset"
                      icon="reload"
                      style="margin-left: 8px"
                    >重置</a-button>
                    </span>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <a-layout>
            <a-layout-content>
              <!-- 操作按钮区域 -->
              <div class="table-operator" v-if="projectMsg">
                <a-button @click="handleAdd" type="primary" icon="plus">添加设备</a-button>
                <a-button @click="handleAddBatch" type="primary" icon="plus">批量添加</a-button>
                <a-button type="primary" icon="paper-phane" @click="handleMqttTask()">
                  <img class="device-operator-icon" src="@views/iot/img/device/paper-phane.png" alt="">
                  发起指令
                </a-button>
                <span class="right-button">
                  <a-upload
                    name="file"
                    :showUploadList="false"
                    :multiple="false"
                    :headers="header"
                    :action="url.importExcelUrl"
                    @change="handleChange"
                  >
                  <a-button class="default-button" icon="cloud-upload">导入</a-button>
                </a-upload>
                <a-button class="default-button" icon="download" @click="handleExportXls('设备信息表')">导出
                </a-button>
                  <a href="/file/设备接入模板.xlsx" download="设备接入模板.xlsx">
                    <a-button class="default-button" icon="download">模板下载</a-button>
                  </a>
                </span>
              </div>
              <!-- table区域-begin -->
              <div>
                <a-table
                  bordered
                  ref="table"
                  size="middle"
                  rowKey="id"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :loading="loading"
                  :rowSelection="projectMsg ? {selectedRowKeys: selectedRowKeys, onChange: onSelectChange} : null"
                  @change="handleTableChange"
                  :customHeaderRow="customHeaderRow"
                >
                <span slot="action" slot-scope="text, record">
                  <a @click="routerPush(record,'/iot/device/DeviceDetails','查看')">查看</a>
                  <span v-if="projectMsg">
                    <a-divider type="vertical" :class="record.deviceState !== '1'? 'showVertical' : 'unshowVertical'"/>
                    <a @click="handleEdit(record)" :disabled="record.deviceState === '1'">编辑</a>
                    <a-divider type="vertical" :class="record.deviceState !== '1'? 'showVertical' : 'unshowVertical'"/>
                    <a @click="batchAbandone(record.id)" :disabled="record.deviceState === '1'">删除</a>
                    <a-divider type="vertical" v-show="record.nodeType === '2'"
                               :class="record.deviceState !== '1'? 'showVertical' : 'unshowVertical'"/>
                  </span>
                  <a
                    @click="routerPush(record, '/iot/device/DeviceDetails','子设备')"
                    v-show="record.nodeType === '2'"
                  >子设备</a>
                </span>
                  <!-- <span slot="light_deviceState" slot-scope="text">
                    <div class="light-device-state" :class="deviceStateClasses[text.deviceState]"></div>
                  </span>-->
                  <span slot="deviceState" slot-scope="text, record">
<!--                    <a-tag v-if="text==0" color="white">未激活</a-tag>-->
                    <!--                    <a-tag v-if="text==1" color="green">在线</a-tag>-->
                    <!--                    <a-tag v-if="text==2" color="#666666">离线</a-tag>-->
                    <!--                    <a-tag v-if="text==3" color="red">异常</a-tag>-->
                    <img :src="getDeviceStateImg(text)"/>
                    <a-divider type="vertical"/>
                    <img :src="getDeviceSwitchImg(text)" @click="changeDeviceState(record)"/>
                    <!--                  <a-switch-->
                    <!--                    class="my-switch-span"-->
                    <!--                    :checked="record.deviceState === '1' ? true : false"-->
                    <!--                    @change="changeDeviceState(record)"-->
                    <!--                  />-->
                </span>
                </a-table>
              </div>
            </a-layout-content>
          </a-layout>
          <!-- table区域-end -->
          <!-- 表单区域 -->
          <device-modal
            ref="modalForm"
            :prjCodes="prjCodes"
            :product-infos="productInfos"
            @ok="modalFormOk"
          ></device-modal>
          <device-add-batch-modal
            ref="addBatchForm"
            :prjCodes="prjCodes"
            :product-infos="productInfos"
            @ok="addBatchModalFormOk"
          ></device-add-batch-modal>
          <device-modal
            ref="modalForm"
            :prjCodes="prjCodes"
            :product-infos="productInfos"
            @ok="modalFormOk"
          ></device-modal>
          <device-add-batch-modal
            ref="addBatchForm"
            :prjCodes="prjCodes"
            :product-infos="productInfos"
            @ok="addBatchModalFormOk"
          ></device-add-batch-modal>
          <mqtt-task-modal ref="addMqttTask" :product-infos="mqttProductInfos" @ok="modalFormOk"></mqtt-task-modal>
        </a-tab-pane>
        <a-tab-pane tab="批次管理" key="2">
          <device-batch ref="deviceBatch" :prjCodes="prjCodes" @handleBatchDel="modalFormOk"></device-batch>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import DeviceModal from './modules/DeviceModal'
import DeviceBatch from './DeviceBatch'
import DeviceAddBatchModal from './modules/DeviceAddBatchModal'
import DeviceTree from '../DeviceTree'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { getAction, postAction, deleteAction } from '@/api/manage'
import JInputLk from '@/components/cmp/JInputLk.vue'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import Vue from 'vue'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'
import MqttTaskModal from '../mqtt/mqttTask/modules/MqttTaskModal'

export default {
  name: 'DeviceList',
  mixins: [myCmpListMixin],
  components: {
    DeviceModal,
    DeviceAddBatchModal,
    JDictSelectTag,
    JInputLk,
    DeviceTree,
    MqttTaskModal,
    DeviceBatch
  },
  data () {
    return {
      header: {},
      // 设备数量
      deviceCount: {
        allCount: 0,
        onlineCount: 0,
        offlineCount: 0,
        inactivated: 0,
        abnormalCount: 0
      },
      // 产品名称列表
      productNames: [
        {
          id: '0',
          productName: '全部产品'
        }
      ],
      // 选中的产品ID
      selectProductId: '',
      // 子设备数量
      subDeviceNumber: '',
      // 选中的产品
      selectProduct: {
        key: '0',
        productName: '全部产品'
      },
      // 字典值
      nodeTypeDictOptions: [],
      deviceStateDictOptions: [],
      // 设备标签组
      tagNames: [],
      description: '设备信息表管理页面',
      // 是否展示设备树
      isShowDeviceTree: true,
      // 选中的tab
      tabKey: 1,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => {
            return this.getIndexOfPage(index)
          }
        },
        {
          title: '设备编号',
          align: 'left',
          sorter: true,
          dataIndex: 'deviceKey'
        },
        {
          title: '设备名称',
          align: 'left',
          sorter: true,
          dataIndex: 'deviceName'
        },
        {
          title: '设备所属产品',
          align: 'left',
          sorter: true,
          dataIndex: 'productId',
          customRender: text => {
            return this.getProductNameById(text)
          }
        },
        {
          title: '设备厂商',
          align: 'left',
          sorter: true,
          dataIndex: 'manufacturerName'
        },
        // {
        //   title: '节点类型',
        //   align: 'center',
        //   dataIndex: 'nodeType',
        //   sorter: true,
        //   width: 150,
        //   customRender: (text, record, index) => {
        //     //字典值替换通用方法
        //     return filterDictText(this.nodeTypeDictOptions, text)
        //   }
        // },
        // {
        //   title: '',
        //   align: 'right',
        //   width: 30,
        //   scopedSlots: {
        //     customRender: 'light_deviceState'
        //   }
        // },
        {
          title: '设备状态',
          align: 'left',
          dataIndex: 'deviceState',
          width: 200,
          sorter: true,
          scopedSlots: {
            customRender: 'deviceState'
          }
          // customRender: text => {
          //   //字典值替换通用方法
          //   return filterDictText(this.deviceStateDictOptions, text)
          // }
        },
        // {
        //   title: '',
        //   align: 'left',
        //   width: 60,
        //   scopedSlots: {
        //     customRender: 'deviceState'
        //   }
        // },
        {
          title: '最后上线时间',
          align: 'left',
          sorter: true,
          width: 180,
          dataIndex: 'lastOnlineTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 160,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      // 校验规则
      validatorRules: {
        deviceState: {
          rules: [
            {
              required: true,
              message: '请选择设备状态!'
            }
          ]
        },
        productId: {
          rules: [
            {
              required: true,
              message: '请选择对应产品!'
            }
          ]
        },
        nodeType: {
          rules: [
            {
              required: true,
              message: '请选择节点类型!'
            }
          ]
        }
      },
      url: {
        list: '/device/device/listBySelectTreeNode',
        delete: '/device/device/delete',
        deleteBatch: '/device/device/deleteBatch',
        exportXlsUrl: 'device/device/deviceKeyXls',
        importExcelUrl: '/ecidi-cmp/device/device/importAllInOneExcel',
        productName: '/product/product/productNames',
        getMqttProduct: '/product/product/mqttProductNames',
        deviceList: 'device/device/deviceList',
        changeState: '/device/device/changeState',
        getTagList: '/tags/tags/getTagList',
        getPrjListByUser: '/project/sysProject/prjListByUser',
        getBatchInfo: '/device/device/batchInfo',
        import: '/device/device/importTemplate'
      },
      // 设备状态计数 样式类
      deviceStateClasses: {
        0: 'device-count-inactivated',
        1: 'device-count-online',
        2: 'device-count-offline',
        3: 'device-count-abnormal'
      },
      collapsed: false,
      prjCodeString: '',
      prjCodes: '',
      prjCode: '',
      productInfos: [],
      mqttProductInfos: [],
      projectList: [],
      nodeLevel: 0,
      nodeKey: '',
      projectMsg: null,
      batchInfo: []
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    initDictOptions('iot_node_type').then(res => {
      if (res.success) {
        this.nodeTypeDictOptions = res.result
      }
    })
    initDictOptions('iot_device_state').then(res => {
      if (res.success) {
        this.deviceStateDictOptions = res.result
      }
    })
    const userInfo = Vue.ls.get(USER_INFO)
    const proInfo = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (proInfo) {
      this.header = {
        'X-Access-Token': Vue.ls.get(ACCESS_TOKEN),
        corpCode: proInfo.corpCode,
        createBy: userInfo.username,
        prjCode: proInfo.prjCode
      }
      console.log('create():header==>', this.header)
    }
  },
  mounted () {
    if (this.projectMsg) {
      this.dataServiceUrl = this.projectMsg.dataServiceUrl
      this.prjCodes = this.prjCode = this.projectMsg.prjCode
      console.log('prjCodes==>', this.prjCodes)
      this.getBatchInfo()
      this.$refs.myDeviceTree.loadProductNodeData(this.prjCode)
      this.getProductNames()
      this.getMqttProductNames()
      this.initTable()
    } else {
      new Promise(this.loadProjectData)
        .then(() => {
          this.$refs.myDeviceTree.loadProjectTreeData(this.projectList)
          console.log('prjCodes==>', this.prjCodes)
          this.getBatchInfo()
          this.getProductNames()
          this.getMqttProductNames()
          this.initTable()
        })
        .catch(reason => {
          this.$message.warning(reason)
          console.log('失败：' + reason)
        })
    }
    this.getDeviceTagList()
    // //获取所有产品ID和名称
    // new Promise(this.loadProjectData).then((result) => {
    //   this.$refs.myDeviceTree.loadProjectTreeData(this.projectList)
    //   this.getProductNames()
    //   this.initTable()
    //   console.log('成功：' + result)
    // }).catch((reason) => {
    //   console.log('失败：' + reason)
    // })
  },
  activated () {
    console.log('activated')
  },
  deactivated () {
    console.log('deactivated')
  },
  methods: {
    // 初始化表格
    initTable () {
      this.nodeLevel = this.queryParam.nodeLevel = 0
      if (this.projectMsg) {
        this.nodeKey = this.queryParam.nodeKey = this.prjCode
      } else {
        this.nodeKey = this.queryParam.nodeKey = this.prjCodes
      }
      this.loadData()
      console.log('DeviceList:this.dataSource=>', this.dataSource)
      this.loadDeviceState()
    },
    // 切换面板回调
    tabChange (key) {
      if (key === '2' && !this.$refs.myDeviceTree.collapsed) {
        this.$refs.myDeviceTree.switchVisible()
      }
      if (key === '1' && this.$refs.myDeviceTree.collapsed) {
        this.$refs.myDeviceTree.switchVisible()
      }
    },
    // 获取设备标签列表
    getDeviceTagList () {
      const that = this
      getAction(this.url.getTagList).then(res => {
        if (res.success) {
          that.tagNames = res.result
        } else {
          this.$message.error('获取标签失败！')
        }
      })
    },
    // 树节点选中事件
    getSelectMessage (data) {
      this.nodeKey = data.nodeKey
      this.queryParam.nodeKey = data.nodeKey
      this.nodeLevel = data.nodeLevel
      this.queryParam.nodeLevel = data.nodeLevel
      this.loadDeviceState()
      this.loadData()
    },
    // 新增/修改 成功时，重载列表
    modalFormOk () {
      this.loadDeviceState()
      this.loadData()
    },
    addBatchModalFormOk () {
      this.loadDeviceState()
      this.loadData()
      this.$refs.deviceBatch.loadData()
    },
    // 获取项目数据
    loadProjectData (resolve, reject) {
      if (!this.url.getPrjListByUser) {
        this.$message.error('请设置url.getPrjListByUser属性!')
        return
      }
      const params = null
      const that = this
      getAction(this.url.getPrjListByUser, params).then(res => {
        if (res.success) {
          if (res.result.length === 0) {
            reject('暂无授权项目,请联系相关人员!')
          } else {
            that.projectList = res.result
            that.prjCodes = ''
            that.prjCodes += res.result.map(function (item) {
              return item.prjCode
            })
            that.nodeKey = that.prjCodes
            resolve(res.success)
          }
        } else {
          reject(res.message)
        }
      })
    },
    // 获取设备数量
    loadDeviceState () {
      const that = this
      postAction(that.url.deviceList, {
        nodeLevel: that.nodeLevel,
        nodeKey: that.nodeKey
      }).then(res => {
        if (res.success) {
          const result = res.result[0]
          that.deviceCount.allCount = result.allCount
          that.deviceCount.inactivated = result.state0
          that.deviceCount.onlineCount = result.state1
          that.deviceCount.offlineCount = result.state2
          that.deviceCount.abnormalCount = result.state3
        } else {
          that.$message.error('查询设备信息失败')
        }
      })
    },
    // 删除设备
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      const that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, {
            id: id
          }).then(res => {
            if (res.success) {
              that.$message.success('删除成功')
              that.loadData(-1)
              that.$refs.deviceBatch.loadData()
              that.loadDeviceState()
            } else {
              that.$message.error('操作失败')
            }
          })
        }
      })
    },
    // 控制表头居中
    customHeaderRow (record) {
      // record.forEach(item => {
      //   item.align = 'center'
      // })
    },
    // 获取设备状态 字典翻译
    getDeviceStateName (text) {
      return filterDictText(this.deviceStateDictOptions, text)
    },
    // 获取设备状态 字典翻译
    getDeviceStateImg (text) {
      // console.log('img-src =>', '@views/iot/img/device/state_' + text + '.png')
      return require('@views/iot/img/device/state_' + text + '.png')
    },
    getDeviceSwitchImg (text) {
      if (text == 1) {
        return require('@views/iot/img/device/switch_on.png')
      } else {
        return require('@views/iot/img/device/switch_off.png')
      }
    },
    // 获取所有产品ID和名称
    getProductNames () {
      const that = this
      this.queryParam.prjCodes = this.prjCodes
      getAction(that.url.productName, that.queryParam).then(res => {
        if (res.success) {
          that.productInfos = res.result
          that.productNames = [
            {
              id: '0',
              productName: '全部产品'
            }
          ].concat(that.productInfos)
        } else {
          that.$message.error('获取产品信息失败！')
        }
      })
    },
    // 获取所有MQTT产品ID和名称
    getMqttProductNames () {
      const that = this
      this.queryParam.prjCodes = this.prjCodes
      getAction(that.url.getMqttProduct, that.queryParam).then(res => {
        if (res.success) {
          that.mqttProductInfos = res.result
        } else {
          that.$message.warning('获取产品信息失败！')
        }
      })
    },
    // 查询
    mySearchQuery () {
      const searchTree = {}
      if (this.queryParam.deviceKey !== undefined && this.queryParam.deviceKey !== '') {
        searchTree.deviceKey = this.queryParam.deviceKey.substring(1, this.queryParam.deviceKey.length - 1)
      }
      if (this.queryParam.deviceName !== undefined && this.queryParam.deviceName !== '') {
        searchTree.deviceName = this.queryParam.deviceName.substring(1, this.queryParam.deviceName.length - 1)
      }
      console.log('searchTree==>', searchTree)
      this.$refs.myDeviceTree.onSearch(searchTree)
      this.searchQuery()
    },
    // 模糊查询回车事件
    enterSearch (val, bindVal) {
      this.queryParam[bindVal] = val
      this.mySearchQuery()
    },
    // // 选择产品下拉列表 改变函数
    // selectProductChange(value) {
    //   if (value.key != '0') {
    //     this.selectProductId = value.key
    //   } else {
    //     this.selectProductId = '0'
    //   }
    //   this.loadDeviceState()
    //   this.mySearchQuery()
    // },
    // onSelect(selectedKeys, info) {
    //   if (selectedKeys.length == 0) {
    //     this.disable = true
    //     return
    //   }
    //   this.disable = false
    //   this.prjCodes = info.selectedNodes[0].data.attrs.prjCode
    //   this.queryParam.prjCodes = info.selectedNodes[0].data.attrs.prjCode
    //   this.getProductNames()
    //   this.selectProductChange({
    //     key: '0',
    //     label: '全部产品'
    //   })
    //   this.selectProduct = {
    //     key: '0'
    //   }
    //   this.searchQuery()
    //   // 清除默认单选框选中状态
    //   this.radioChecked = false
    //   this.loadDeviceState()
    // },
    // 重置
    mySearchReset () {
      this.queryParam = {}
      this.queryParam.nodeLevel = this.nodeLevel
      this.queryParam.nodeKey = this.nodeKey
      this.clickReset = !this.clickReset
      this.loadDeviceState()
      this.mySearchQuery()
    },
    // 刷新
    myReload () {
      this.loadDeviceState()
      this.loadData()
    },
    // 改变设备状态
    changeDeviceState (record) {
      console.log(record)
      const dState = record.deviceState == '1' ? '2' : '1'
      if (!this.url.changeState) {
        this.$message.error('请设置url.changeState属性!')
        return
      }
      const that = this
      postAction(that.url.changeState, {
        id: record.id,
        deviceState: dState,
        prjCode: record.prjCode
      }).then(res => {
        if (res.success) {
          that.$message.success('修改设备状态成功')
          that.myReload()
        } else {
          that.$message.error('修改设备状态失败')
        }
      })
    },
    // 通过id获取产品名称
    getProductNameById (id) {
      const that = this
      let i, pName
      const pnames = that.productNames
      for (i in pnames) {
        const pname = pnames[i]
        if (pname.id == id) {
          pName = pname.productName
          break
        }
      }
      return pName
    },
    // 带参跳转
    routerPush (record, url, type) {
      console.log('查看record', record)
      this.$router.push({
        path: url,
        query: {
          recordId: record.id,
          type: type
        }
      })
    },
    // 批量添加
    handleAddBatch: function () {
      this.$refs.addBatchForm.add()
      this.$refs.addBatchForm.title = '批量添加'
    },
    handleMqttTask () {
      this.$refs.addMqttTask.add()
      this.$refs.addMqttTask.title = '发起指令'
    },

    getBatchInfo () {
      const that = this
      console.log('getBatchInfo():prjCodes=>', that.prjCodes)
      getAction(that.url.getBatchInfo, { prjCodes: that.prjCodes }).then(res => {
        if (res.success) {
          that.batchInfo = res.result
          console.log('getBatchInfo:batchInfo=>', that.batchInfo)
        } else {
          console.log('getBatchInfo()调用失败')
        }
      })
    },

    exportExcelTemplate () {
      const that = this
      getAction(that.url.import, null).then(res => {
        if (res.success) {
          console.log('导出模板成功')
        } else {
          console.log('导出模板失败')
        }
      })
    },

    handleChange (info) {
      console.log('info=>', info)
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.$message.success(`导入成功！导入的文件有：${JSON.stringify(info.file.response.result)} `)
        } else {
          this.$message.error(`${info.file.response.message}`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 导入失败.`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .my-switch-span {
    float: right;
  }

  /deep/ .ant-switch-checked {
    background-color: rgb(13, 206, 55);
  }

  .device-title {
    width: 74px;
    height: 19px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 20px;
  }

  .device-row {
    margin-top: 15px;
  }

  .device-count {
    display: inline-block;
    width: 8px;
    height: 8px;
    vertical-align: middle;
    margin-right: 7px;
    border-radius: 50%;
  }

  .device-count-num {
    margin-top: 18px;
    margin-left: 65%;
    width: 36px;
    height: 30px;
    font-size: 40px;
    font-family: DIN Bold, DIN Bold-Bold;
    font-weight: 700;
    text-align: left;
    color: #feffff;
    line-height: 48px;
  }

  .device-count-num-all {
    /*color: rgba(4, 147, 243, 1);*/
  }

  .device-count-num-online {
    /*color: rgba(31, 190, 15, 1);*/
  }

  .device-count-num-offline {
    /*color: rgba(255, 171, 10, 1);*/
  }

  .device-count-num-inactivated {
    /*color: rgba(153, 153, 153, 1);*/
  }

  .device-state {
    width: 19.8%;
    height: 82px;
  }

  .device-state:not(:nth-child(5n)) {
    margin-right: calc(1% / 4);
  }

  .device-all {
    background: url(../img/device/all_device_img.png) no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .device-online {
    background: url(../img/device/device_online_img.png) no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .device-offline {
    background: url(../img/device/device_offline_img.png) no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .device-inactived {
    background: url(../img/device/device_not_active_img.png) no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .device-abnormal {
    background: url(../img/device/device_abnormal_img.png) no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .device-content {
    margin-left: 33%;
    margin-top: -28px;
    font-size: 16px;
    font-family: Microsoft YaHei UI Bold, Microsoft YaHei UI Bold-Bold;
    font-weight: 700;
    text-align: left;
    color: #feffff;
    line-height: 48px;
  }

  .light-device-state {
    display: inline-block;
    width: 8px;
    height: 8px;
    vertical-align: middle;
    margin-right: 7px;
    border-radius: 50%;
  }

  /**
    设备列表下半部分容器样式属性
   */
  .device-under-part-content {
    display: flex;
    margin-left: 5px;

    .device-tree-content {
      margin-top: 16px;
    }

    .device-tabs-content {
      width: 100%;
    }

    .right-button {
      margin-left: auto;
      height: 36px;
    }

    .device-operator-icon {
      margin-right: 8px;
      height: 15px;
      top: 50%;
      position: relative;
      margin-top: -4px;
    }
  }

  .search-buttons-content {
    position: absolute;
    right: -4px;
  }

  .ant-divider {
    color: rgba(0, 0, 0, 0.65);
    background: rgba(53, 101, 247, 0);
  }

  div.ant-layout-content {
    margin-top: 12px;
    margin-left: 12px;
  }

  .ant-form-item-label {
    margin-left: 12px;
  }

  .ant-tabs-nav-scroll {
    margin-left: 13px;
  }

  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
  @import '~@views/iot/css/iotCommon.less';
</style>
