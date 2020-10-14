<template>
  <a-card :bordered="false">
    <!--     查询区域   nodeLevel=4，展示历史数据时加载-->
    <div class="table-page-search-wrapper" v-if="nodeLevel == 4 ">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="16">
            <a-form-item label="日期选择">
              <a-row>
                <a-col :md="6" :sm="11">
                  <a-date-picker
                    placeholder="请选择开始时间"
                    :disabledDate="disabledStartDate"
                    format="YYYY-MM-DD  HH:mm:ss"
                    v-model="tempStartValue"
                    @openChange="handleStartOpenChange"
                    :showTime="{
                  hideDisabledOptions: true,
                  defaultValue: moment('00:00:00', 'HH:mm:ss')
                }"
                  ></a-date-picker>
                </a-col>
                <a-col :md="2" :sm="2" style="text-align: center">至</a-col>
                <a-col :md="6" :sm="11">
                  <a-date-picker
                    placeholder="请选择结束时间"
                    :disabledDate="disabledEndDate"
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="tempEndValue"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                    :showTime="{
                  hideDisabledOptions: true,
                  defaultValue: moment('00:00:00', 'HH:mm:ss')
                }"
                  ></a-date-picker>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="5">
             <a-form-item label="其他条件">
                <a-select class="chart-select" width="150px" placeholder="请选择" @change="otherOptionChange">
                  <a-select-option v-for="item in otherOptionsList" :key="item.key" :value="item.value">{{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
          </a-col> -->
          <!-- <a-col :md="3" :sm="3">
            <div class="search-buttons-content">
                  <span class="table-page-search-submitButtons serachLeft">
                        <a-button type="primary" @click="filterByDate" icon="search">查询</a-button>
                        <a-button type="primary" @click="reset" icon="reload">重置</a-button>
                  </span>
            </div>
          </a-col> -->
          <a-col :md="6" :sm="24">
                  <div class="search-buttons-content">
                    <span style="float: right;overflow: hidden;padding-right: 10px;"
                          class="table-page-search-submitButtons">
                    <a-button type="primary" @click="filterByDate" icon="search">查询</a-button>
                    <a-button
                      type="primary"
                      @click="reset"
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
      <!--  左侧设备树-->
      <DeviceTree
        ref="myDeviceTree"
        :showShearch="true"
        @getSelectMessage="getSelectMessage"
        @defaultFocus="initTable"
      ></DeviceTree>
      <!--  右侧容器-->
      <a-layout-content>
        <!--右侧卡片布局-->
        <a-card
          class="right-card"
          :bordered="false"
          :tabList="tabList"
          :activeTabKey="activeTitleKey"
          @tabChange="key => onTabChange(key, 'activeTitleKey')"
        >
          <!-- 实时数据的图表-->
          <div class="device-msg-content" v-if="activeTitleKey === 'showCardGrid' && nodeLevel ==2">
            <div class="device-msg-grid" v-for="i in notNullRealDataList" :key="i.deviceName">
              <!--演示用-->
              <img
                src="../img/water_meter.png"
                class="device-type-img"
                v-if="i.deviceName.indexOf('水位计') > -1"
              />
              <img
                src="../img/fans.png"
                class="device-type-img"
                v-else-if="i.deviceName.indexOf('风机') > -1"
              />
              <img src="../img/default_device.png" class="device-type-img" v-else/>
              <div class="device-realdata-content">
                <div class="device-name-content">{{ i.deviceName }}</div>
                <div class="device-value-content" v-for="j in columns" :key="j.title">
                  <div
                    v-if="j.unit != null && i[j.dataIndex] != null "
                  >{{j.dataIndex + ':'+ i[j.dataIndex] + j.unit }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 折线图-->
          <div
            class="device-chart-content"
            v-if="activeTitleKey === 'showCardGrid' && nodeLevel ==4"
          >
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <span class="pl-2 pr-1 text-14">属性：</span>
                <a-select class="chart-select" v-model="chartAlias" placeholder="请选择"
                          @change="aliasParamChange">
                  <a-select-option v-for="item in chartAliasList" :key="item.alias" :value="item.name">{{ item.name }}
                  </a-select-option>
                </a-select>
                <a-tooltip placement="rightTop" style="margin-left: 2px" title="只显示数值类型的属性">
                  <a-icon type="question-circle" />
                </a-tooltip>
              </a-col>
              <a-col :md="6" :sm="8">
                <span class="pl-2 pr-1 text-14">间隔周期：</span>
                <a-input-number class="chart-input-number" id="inputNumber" @pressEnter="periodChange" v-model="period" :min="1" :max="3600"/>
                <a-tooltip placement="rightTop" style="margin-left: 2px" title="隔多少分钟显示一条数据">
                  <a-icon type="question-circle" />
                </a-tooltip>
              </a-col>
              <a-col :md="6" :sm="8">
                <span class="pl-2 pr-1 text-14">其他条件：</span>
                <a-select class="chart-select"  placeholder="请选择" @change="otherOptionChange">
                  <a-select-option v-for="item in otherOptionsList" :key="item.key" :value="item.value">{{ item.label }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-spin :spinning="loading">
              <BaseLineChart
                class="chart"
                id="lineChart"
                :style="{width: '100%', height: '500px'}"
                :yAxisName="deviceData.yAxisName"
                :itemArray="deviceData.itemArray"
                :xAxisItem="deviceData.xAxisItem"
                :dataSource="deviceData.xAxisItem"
                :series="deviceData.series"
                :dataZoom="deviceData.dataZoom"
                yAxisMin="dataMin"
              ></BaseLineChart>
            </a-spin>
          </div>
          <!-- 表格-->
          <a-table
            bordered
            size="middle"
            rowKey="rowIndex"
            v-show="activeTitleKey === 'showTable'"
            :columns="columns"
            :dataSource="dataSource"
            :scroll="scroll"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
            class="data-table"
          >
            <span slot="link" slot-scope="text, record">
              <a :href="text" target="_blank">{{text}}</a>
            </span>
          </a-table>
        </a-card>
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import DeviceTree from '../DeviceTree'
import { getAction, postAction, httpActionHeader2 } from '@/api/manage'
import { DataDisplayMixin } from './DataDisplayMixin'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import moment from 'moment'
import BaseLineChart from '@/components/ECharts/BaseLine'

export default {
  name: 'DataDisplay',
  mixins: [DataDisplayMixin, myCmpListMixin],
  components: {
    DeviceTree,
    BaseLineChart
  },
  data () {
    return {
      tabList: [
        // 标签页信息
        {
          key: 'showTable',
          tab: '实时数据表'
        },
        {
          key: 'showCardGrid',
          tab: '图表',
          disabled: true
        }
      ],
      activeTitleKey: 'showTable', // 默认选中的标签页
      projectMsg: null, // 项目信息
      isAccessGateWay: '0', // 是否接入采集终端（1接入，0不接入）
      startValue: null, // 根据时间筛选历史数据
      tempStartValue: null,
      endValue: null,
      tempEndValue: null,
      endOpen: false,
      scroll: {}, // 多行数据滚动条
      projectList: [], // 项目列表
      prjIndex: '', // 所选节点所属项目在列表中的位置
      deviceNumberList: [], // 各项目设备数量表
      prjCode: '', // 项目级
      prjCodes: '', // 企业级
      nodeKey: '', // 节点键
      nodeLevel: '', // 节点级别
      nodePos: '', // 节点位置 0-0-0-0-0  根节点-
      dataReflashTimer: '', // 定时器
      productId: '', // 产品id
      deviceIds: '', // 设备id串 id1,id2
      deviceDict: [], // 设备id、Name字典
      dataSource: [], // 表格数据
      notNullRealDataList: [], // 不为null的实时数据
      currentDevice: {}, // node=4时 当前的设备信息 id，key，name，
      dataServiceUrl: '', // 数据源地址
      loading: false, // 正在加载标记
      chartAlias: '', // 地图标点弹框参数类型
      period: 1, // 采样周期，默认1
      // dialogParamDesc: '', // 下拉选择框 参数描述
      chartAliasList: {}, // 地图标点弹框参数类型
      otherOption: '',
      // TODO: 福田项目数据展示增加过滤条件
      otherOptionsList: [
        {
          key: '',
          label: '默认',
          value: ''
        },
        {
          key: '命令编号',
          label: '命令编号=2011',
          value: '=2011'
        },
        {
          key: '命令编号',
          label: '命令编号=2031',
          value: '=2031'
        },
        {
          key: '命令编号',
          label: '命令编号=2051',
          value: '=2051'
        },
        {
          key: '命令编号',
          label: '命令编号=2061',
          value: '=2061'
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: (t, r, index) => {
            return this.getIndexOfPage(index)
          }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'left'
        },
        {
          title: '设备数量',
          dataIndex: 'deviceNumber',
          align: 'left'
        }
      ],
      url: {
        getPrjListByUser: '/project/sysProject/prjListByUser',
        getColumnsByTreeNode: '/deviceTree/treeNode/getDisplayColumns',
        getHistoryData: '/history/historyDeviceData/list',
        getRealTimeData: '/data/deviceData/realDataByIds',
        getDeviceInfoByGroupId: '/device/device/getDeviceInfoByGroupId',
        getDeviceInfoByProductId: '/device/device/getDeviceInfoByProductId',
        getDeviceNumberByPrjList: '/device/device/getDeviceNumberByPrjList',
        getProductById: '/product/product/queryById',
        getDeviceById: '/device/device/queryById',
        getChartHistoryData: '/history/historyDeviceData/historyDataAll3'
      },
      deviceData: {
        xAxisItem: [],
        yAxisName: '',
        itemArray: [],
        series: [
          {
            name: '',
            type: 'line',
            smooth: 'false',
            stack: 'PH',
            data: []
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'filter',
            show: true,
            start: 80,
            end: 100
          },
          {
            type: 'inside',
            show: false
          }
        ]
      }
    }
  },
  mounted () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (this.projectMsg) {
      // 项目级
      this.dataServiceUrl = this.projectMsg.dataServiceUrl
      this.prjCode = this.projectMsg.prjCode
      this.$refs.myDeviceTree.loadProductNodeData(this.prjCode)
      this.getDeviceNumberList(this.prjCode).then(() => {
        this.initTable()
      })
    } else {
      new Promise(this.loadProjectData)
        .then(() => {
          this.$refs.myDeviceTree.loadProjectTreeData(this.projectList)
          this.getDeviceNumberList(this.prjCodes).then(() => {
            this.initTable()
          })
        })
        .catch(reason => {
          console.log('失败：' + reason)
        })
    }
  },
  watch: {
    nodeLevel: function () {
      if (this.nodeLevel === 4) {
        this.tabList[0].tab = '历史数据表'
      } else {
        this.tabList[0].tab = '实时数据表'
      }
    }
    // chartAliasList: function () {
    //   console.log('this.chartAliasList.length' + this.chartAliasList)
    //   if (this.chartAliasList) {
    //     console.log('this.chartAliasList.length' + this.chartAliasList.length)
    //     // this.chartAlias = chartAliasList[0].value
    //   }
    // }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.dataReflashTimer)
  },
  destroyed () {
    // 清除定时器
    clearInterval(this.dataReflashTimer)
  },
  methods: {
    moment,
    // 日历控件绑定方法
    disabledStartDate (startValue) {
      const endValue = this.tempEndValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.tempStartValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    filterByDate () {
      this.startValue = this.tempStartValue
      this.endValue = this.tempEndValue
      this.ipagination.current = 1
      if (this.activeTitleKey == 'showTable') {
        this.getHistoryDataSource(this.nodeKey, this.nodePos)
      } else {
        this.getChartData()
      }
    },
    reset () {
      this.otherOptionChange()
      this.tempEndValue = this.endValue = null
      this.tempStartValue = this.startValue = null
      if (this.activeTitleKey == 'showTable') {
        this.getHistoryDataSource(this.nodeKey, this.nodePos)
      } else {
        this.getChartData()
      }
    },
    initTable () {
      this.initTab()
      this.nodeLevel = 0
      this.productId = ''
      this.tempEndValue = this.endValue = null
      this.tempStartValue = this.startValue = null
      this.scroll.x = 0
      clearInterval(this.dataReflashTimer)
      this.dataSource = []
      this.ipagination.total = this.projectList.length
      this.ipagination.current = 1
      if (this.projectMsg) {
        const initData = {
          nodeKey: '',
          nodeLevel: 2,
          nodePos: '0-0-0'
        }
        initData.nodeKey = this.$refs.myDeviceTree.treeData[0].key
        this.getSelectMessage(initData)
      } else {
        this.projectList.map(data => {
          this.dataSource.push({
            projectName: data.prjName,
            deviceNumber: this.deviceNumberList[data.prjCode]
          })
        })
      }
      // else {
      //   this.$refs.myDeviceTree.expandedKeys.push(this.$refs.myDeviceTree.treeData[0].key)

      //   initData.nodeKey = this.$refs.myDeviceTree.treeData[0].children[0].key

      // }
      this.initTableColumns()
      // if (this.projectMsg) {
      //   this.dataSource = [{
      //     projectName: this.projectMsg.prjName,
      //     deviceNumber: this.deviceNumberList[this.projectMsg.prjCode]
      //   }]
      // } else {
      //   this.projectList.map(data => {
      //     this.dataSource.push({
      //       projectName: data.prjName,
      //       deviceNumber: this.deviceNumberList[data.prjCode]
      //     })
      //   })
      // }
    },
    getSelectMessage (data) {
      this.ipagination.current = 1
      this.nodeKey = data.nodeKey
      this.nodeLevel = data.nodeLevel
      this.nodePos = data.nodePos
      const posArray = data.nodePos.split('-')
      // 企业级
      if (this.projectMsg === null) {
        this.prjIndex = posArray[1] // 所选项目在项目列表中的位置
        this.prjCode = this.projectList[this.prjIndex].prjCode // 获取项目编码
        this.dataServiceUrl = this.projectList[this.prjIndex].dataServiceUrl
      }
      if (this.nodeLevel > 1) {
        const productId = this.$refs.myDeviceTree.getNodeByPosList(posArray.slice(0, 3)).key
        this.loading = true
        const that = this
        getAction(that.url.getProductById, { id: productId }).then(res => {
          if (res.success) {
            that.isAccessGateWay = res.result.isAccessGateway
            that.getColumnsByTreeNode(productId, that.nodeLevel)
            that.getTableDataSource()
          } else {
            that.$message.error('获取产品信息失败!')
          }
          that.loading = false
        })

        // this.setIsAccessGateWay(productId).then(res=>{
        //   this.getColumnsByTreeNode(productId, this.nodeLevel)
        //   this.getTableDataSource()
        // })
      } else {
        this.initTab()
        this.initTableColumns()
        this.ipagination.total = 1
        this.ipagination.current = 1
        this.scroll.x = 0
        this.productId = ''
        this.dataSource = [
          {
            projectName: this.projectList[this.prjIndex].prjName,
            deviceNumber: this.deviceNumberList[this.prjCode]
          }
        ]
      }
      clearInterval(this.dataReflashTimer)
      this.dataReflashTimer = setInterval(() => {
        this.reFlashTableDataSource()
      }, 30 * 1000)
    },
    // 获取项目数据,填充projectList和prjCodes
    loadProjectData (resolve, reject) {
      if (!this.url.getPrjListByUser) {
        this.$message.error('请设置url.getPrjListByUser属性!')
        return
      }
      const params = null
      const that = this
      this.loading = true
      getAction(this.url.getPrjListByUser, params).then(res => {
        if (res.success) {
          that.projectList = res.result
          that.prjCodes = ''
          that.prjCodes += res.result.map(function (item) {
            return item.prjCode
          })
          that.nodeKey = that.prjCodes
          resolve(res.success)
        } else {
          reject(res.message)
          that.$message.error('获取项目数据失败!')
        }
        this.loading = false
      })
    },
    /**
       * 获取每个项目对应的设备数量
       */
    getDeviceNumberList (prjCodes) {
      const that = this
      return new Promise(resolve => {
        this.loading = true
        getAction(that.url.getDeviceNumberByPrjList, { prjCodes: prjCodes }).then(res => {
          if (res.success) {
            that.deviceNumberList = res.result
            resolve('成功')
          } else {
            that.$message.error('获取设备数量失败!')
          }
          this.loading = false
        })
      })
    },
    initTableColumns () {
      this.columns = [
        {
          title: '序号',
          dataIndex: 'rowIndex',
          width: 80,
          align: 'center',
          fixed: 'left',
          customRender: (t, r, index) => {
            return this.getIndexOfPage(index)
          }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'left'
        },
        {
          title: '设备数量',
          dataIndex: 'deviceNumber',
          align: 'left'
        }
      ]
    },
    /**
       * 根据选择节点加载表格行属性
       */
    getColumnsByTreeNode (productId, nodeLevel) {
      if (nodeLevel === 4) {
        this.columns[1] = {
          title: '时间',
          dataIndex: 'update_time',
          customRender: '',
          width: 200,
          fixed: 'left'
        }
      } else {
        this.columns[1] = {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 200,
          fixed: 'left'
        }
      }
      if (this.productId !== productId) {
        this.productId = productId
        const that = this
        const params = {
          nodeKey: productId
        }
        this.loading = true
        // 根据树节点获取表头属性
        postAction(this.url.getColumnsByTreeNode, params).then(res => {
          if (res.success) {
            const properties = JSON.parse(res.result)
            console.log(properties)
            that.columns = that.columns.slice(0, 2)
            that.scroll.x = 150 * properties.length + 300
            for (let i = 0; i < properties.length; i++) {
              const column = {
                title: `${properties[i].unitName}(${properties[i].unit})`,
                dataIndex: properties[i].alias,
                align: 'left',
                unit: properties[i].unit
              }
              if (properties[i].valueType === 'mediumtext') {
                column.scopedSlots = { customRender: 'link' }
              }
              that.columns.push(column)
            }
            console.log(that.columns)
          } else {
            that.$message.error('获取表头数据失败!')
          }
          this.loading = false
        })
      }
    },
    /**
       * 根据设备Id获取历史数据
       */
    getHistoryDataSource (deviceId, nodePos) {
      const posArray = nodePos.split('-')
      const productId = this.$refs.myDeviceTree.getNodeByPosList(posArray.slice(0, 3)).key
      let groupId = 0

      if (posArray.length === 5) {
        groupId = this.$refs.myDeviceTree.getNodeByPosList(posArray.slice(0, 4)).key
      }
      const params = {
        deviceId: deviceId,
        prjCode: this.prjCode,
        productId: productId,
        groupId: groupId,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize
      }
      if (this.startValue && this.endValue) {
        params.startTime = moment(this.startValue).format('YYYY-MM-DD HH:mm:ss')
        params.endTime = moment(this.endValue).format('YYYY-MM-DD HH:mm:ss')
      }
      const getHistoryDataUrl = this.dataServiceUrl + this.url.getHistoryData
      this.loading = true
      // 获取历史数据
      postAction(getHistoryDataUrl, params).then(res => {
        this.dataSource = []
        this.ipagination.total = 0
        if (res.success) {
          if (res.result) {
            this.ipagination.total = res.result.total
            this.dataSource = res.result.records
            console.log(this.dataSource)
          }
        } else {
          this.$message.error('获取历史数据失败!')
        }
        this.loading = false
      })
    },
    /**
       * 根据设备Id列表获取实时数据
       */
    getRealTimeDataSource (deviceIds) {
      let realTimeDb
      if (this.projectMsg) {
        realTimeDb = this.projectMsg.realDb
      } else {
        realTimeDb = this.projectList[this.prjIndex].realDb
      }
      const params = {
        ids: deviceIds,
        realTimeDb: realTimeDb,
        prjCode: this.prjCode,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        isAccessGateWay: this.isAccessGateWay
      }
      const getRealTimeDataUrl = this.dataServiceUrl + this.url.getRealTimeData
      const that = this
      this.loading = true
      postAction(getRealTimeDataUrl, params).then(res => {
        that.dataSource = []
        that.notNullRealDataList = []
        that.ipagination.total = 0
        if (res.success) {
          if (res.result) {
            that.ipagination.total = res.result.total
            if (res.result.records.length > 0) {
              res.result.records.forEach(data => {
                const realData = {}
                for (const i in data) {
                  if (data[i] != null) {
                    realData[i] = data[i]
                  }
                  // that.notNullRealDataList.
                }
                that.notNullRealDataList.push(realData)
                that.dataSource.push(data)
              })
            }
          }
        } else {
          that.$message.error('获取实时数据失败!')
        }
        this.loading = false
      })
      // if(this.isAccessGateWay){//接入网关，从实时数据库查数据
      //   let realTimeDb = this.projectList[this.prjIndex].realDb
      //   let params = {
      //     ids: deviceIds,
      //     realTimeDb: realTimeDb,
      //     prjCode: this.prjCode,
      //     pageNo: this.ipagination.current,
      //     pageSize: this.ipagination.pageSize
      //   }
      //   let getRealTimeDataUrl = this.dataServiceUrl + this.url.getRealTimeData
      //   let that = this
      //   postAction(getRealTimeDataUrl, params).then(res => {
      //     that.ipagination.total = res.result.total
      //     that.dataSource = []
      //     if (res.result.records.length > 0) {
      //       res.result.records.map((data) => {
      //         that.dataSource.push(data)
      //       })
      //     }
      //   })
      // }else{//不接入网关，从iot_device_info表中获取实时数据
      //
      // }
    },
    // 获取表数据
    getTableDataSource () {
      this.dataSource = []
      if (this.nodeLevel === 4) {
        // 设备
        this.loading = true
        const that = this
        getAction(that.url.getDeviceById, { id: this.nodeKey }).then(res => {
          if (res.success) {
            that.currentDevice = {
              id: this.nodeKey,
              name: res.result.deviceName,
              key: res.result.deviceKey,
              prjCode: res.result.prjCode
            }
            this.initChartAliasList(res.result.deviceProperties)
            that.isAccessGateWay = res.result.isAccessGateway
          } else {
            that.$message.error('获取设备信息失败!')
          }
          that.loading = false
        }).then(() => {
          this.tabList[1].disabled = false
          if (this.activeTitleKey === 'showTable') {
            this.ipagination.pageSize = 10
            this.getHistoryDataSource(this.nodeKey, this.nodePos)
          } else {
            this.getChartData()
          }
        })
      } else if (this.nodeLevel === 3) {
        // 分组
        this.initTab()
        // 根据设备分组获取设备列表
        const groupPos = this.nodePos
        const groupId = this.$refs.myDeviceTree.getNodeByPos(groupPos).key
        const that = this
        this.loading = true
        getAction(this.url.getDeviceInfoByGroupId, { deviceGroupId: groupId }).then(res => {
          that.deviceIds = ''
          if (res.success) {
            if (res.result.length > 0) {
              that.deviceIds += res.result.map(data => {
                that.deviceDict[data.id] = data.deviceName
                return data.id
              })
            }
            that.deviceIds = that.deviceIds.slice(0, -1)
            if (that.deviceIds !== '') {
              this.getRealTimeDataSource(that.deviceIds)
            } else {
              that.dataSource = []
              that.ipagination.total = 0
            }
          } else {
            this.$message.error('获取设备信息失败!')
          }
          this.loading = false
        })
      } else if (this.nodeLevel === 2) {
        // 产品
        // 图表卡片页展示折线图
        this.tabList[1].disabled = false
        const that = this
        this.loading = true
        getAction(this.url.getDeviceInfoByProductId, { productId: this.productId }).then(res => {
          that.deviceIds = ''
          if (res.success) {
            if (res.result.length > 0) {
              that.deviceIds += res.result.map(data => {
                that.deviceDict[data.id] = data.deviceName
                return data.id
              })
            }
            if (that.deviceIds !== '') {
              this.getRealTimeDataSource(that.deviceIds)
            } else {
              that.dataSource = []
              that.ipagination.total = 0
            }
          } else {
            this.$message.error('获取设备信息失败!')
          }
          this.loading = false
        })
      }
    },
    reFlashTableDataSource () {
      console.log('定时任务运行中...')
      if (this.nodeLevel === 1) {
        this.getDeviceNumberList(this.prjCodes)
      } else if (this.nodeLevel === 4) {
        if (this.activeTitleKey === 'showTable') {
          this.getHistoryDataSource(this.nodeKey, this.nodePos)
        } else {
          if (this.chartAlias !== '选择属性') {
            this.getChartData()
          }
        }
      } else {
        if (this.deviceIds !== '') {
          this.getRealTimeDataSource(this.deviceIds)
        } else {
          this.dataSource = []
          this.ipagination.total = 0
        }
      }
    },
    handleTableChange (pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.reFlashTableDataSource()
    },
    initTab () {
      this.tabList[1].disabled = true
      this.ipagination.pageSize = 10
      this.activeTitleKey = 'showTable'
    },
    setIsAccessGateWay (productId) {
      getAction(this.url.getProductById, { id: productId }).then(res => {
        this.isAccessGateWay = res.result.isAccessGateWay
      })
    },
    onTabChange (key, type) {
      this[type] = key
      // TODO：展示用
      if (key === 'showCardGrid') {
        this.ipagination.pageSize = 9999
        this.getTableDataSource()
        clearInterval(this.dataReflashTimer)
        this.dataReflashTimer = setInterval(() => {
          this.reFlashTableDataSource()
        }, 30 * 1000)
      } else {
        this.ipagination.pageSize = 10
        this.getTableDataSource()
      }
    },
    // 点击设备节点时 初始化该设备的折线图下拉框的属性列表（只保留int，double，decimal类型的属性）
    initChartAliasList (property) {
      this.chartAliasList = {}
      const jsonProperty = JSON.parse(property)
      for (const i in jsonProperty) {
        const temp = jsonProperty[i]
        if (temp.valueType == 'int' || temp.valueType == 'double' || temp.valueType == 'decimal') {
          const aliasTemp = {
            name: temp.unitName,
            alias: temp.alias,
            unit: temp.unit
          }
          this.chartAliasList[temp.unitName] = aliasTemp
        }
        if (i === '0') {
          this.chartAlias = temp.unitName
        }
      }
    },
    otherOptionChange (key, option) {
      this.otherOption = ''
      let temp = {}
      if (key != null && key != '') {
        temp[option.key] = key
      }
      this.otherOption = JSON.stringify(temp)
      this.getChartData()
    },
    // tableOtherOptionChange (key, option) {
    //   this.otherOption = {}
    //   if (key != null && key != '') {
    //     this.otherOption[option.key] = key
    //   }
    //   this.filterByDate()
    // },
    periodChange () {
      this.getChartData()
    },
    getChartData () {
      // console.log('into getChartData nodeKey=>', this.nodeKey)
      // console.log('chartAlias =>', this.chartAlias)
      // console.log('this.otheroption =>', this.otherOption)
      // eslint-disable-next-line prefer-const
      let queryParams = {
        deviceKey: this.currentDevice.key,
        groupId: 0,
        propNames: this.chartAlias,
        pageNo: 1,
        pageSize: 100,
        period: this.period,
        prjCode: this.currentDevice.prjCode
      }
      queryParams.additionalCondition = this.otherOption
      if (this.startValue) {
        queryParams.startTime = moment(this.startValue).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.endValue) {
        queryParams.endTime = moment(this.endValue).format('YYYY-MM-DD HH:mm:ss')
      }
      // console.log('queryParams =>', queryParams)
      const headers = {
        'Content-Type': 'application/json',
        'api-version': 'V1'
      }
      const method = 'post'
      const that = this
      this.loading = true
      httpActionHeader2(this.dataServiceUrl + this.url.getChartHistoryData, queryParams, method, headers).then(res => {
        if (res.success) {
          const properName = that.chartAlias
          const properTime = that.chartAlias + '_更新时间'
          if (res.result.total > 0) {
            that.deviceData.yAxisName = that.chartAliasList[properName].unit
            that.deviceData.series[0].stack = properName
            const xData = []
            const yData = []
            const records = res.result.records

            for (let i = records.length - 1; i >= 0; i--) {
              xData.push(records[i][properTime])
              yData.push(records[i][properName])
            }
            that.deviceData.xAxisItem = xData
            that.deviceData.series[0].data = yData
            that.deviceData.itemArray = [properName]
            that.deviceData.series[0].name = properName
          } else {
            that.deviceData.xAxisItem = []
            that.deviceData.series[0].data = []
            that.deviceData.itemArray = [properName]
            that.deviceData.series[0].name = properName
            that.$message.warning('该区间无历史数据!')
          }
        } else {
          that.$message.error('获取历史数据失败!')
        }
        this.loading = false
      })
    },
    aliasParamChange (value) {
      this.getChartData()
      // TODO: 此处写参数下拉框改变后逻辑
    }
  }
}
</script>

<style scoped lang="less">
  @import '~@assets/less/topBtns.less';
  @import '~@views/iot/css/iotCommon.less';

  .right-card{
    /deep/ .ant-card-body {
       padding-left: 0px;
    }
  }
  .device-msg-content {
    display: flex;
    flex-wrap: wrap;

    .device-msg-grid {
      display: flex;
      width: 23%;
      height: 150px;
      margin-bottom: 10px;
      margin-right: 2%;
      border: 1px solid #dddddd;

      .device-type-img {
        position: relative;
        width: 136px;
        height: 96px;
        top: 50%;
        margin-left: 5%;
        margin-top: -48px;
      }

      .device-realdata-content {
        overflow-y: auto;
        width: 100%;
        margin-left: 5%;

        .device-name-content {
          padding-top: 12px;
          padding-bottom: 6px;
          font-size: 14px;
          font-weight: bold;
        }

        .device-value-content {
          color: #909293;
        }
      }

      .device-realdata-content::-webkit-scrollbar {
        width: 6px;
        // border: 1px solid #dddddd;
      }

      /*定义滚动条轨道 内阴影+圆角*/

      .device-realdata-content::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0 .2);
        padding-left: 3px;
        padding-right: 3px;
        border-radius: 0;
        background: rgba(0, 0, 0, 0 .1);
      }

      /*定义滑块 内阴影+圆角*/

      .device-realdata-content::-webkit-scrollbar-thumb {
        background: #dddddd;
        border-radius: 2px;
      }
    }
  }
  /deep/ .data-table {
    td {
      user-select: text;
      -webkit-user-select: text;
    }
  }

  /deep/ .ant-tabs {
    .ant-tabs-large-bar .ant-tabs-tab {
      padding: 12px;
      font-size: 14px;
      font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
      font-weight: 400;
      text-align: left;
      color: #333333;
      line-height: 32px;
    }

    .ant-tabs-nav-wrap {
      margin-bottom: 0px;
    }
  }

  .device-chart-content {
    .chart-select {
      width: 70%;
    }

    .chart-input-number {
      width: 70%;
    }
    div.ant-tabs-nav-scroll{
      margin-bottom: 12px;
    }
  }
</style>
