<!--设备运行状态展示页面 设备详情-运行状态-->
<template>
  <div>
    <a-form layout="inline">
      <a-row>
        <a-col :md="8" :sm="8">
          <a-form-item label="日期选择">
            <a-row>
              <a-col :md="11" :sm="11">
                <a-date-picker
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
              <a-col :md="11" :sm="11">
                <a-date-picker
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
        <a-col>
          <span style="float: left; overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="filterByDate" icon="search">查询</a-button>
            <a-button type="primary" @click="reset" icon="reload" style="margin-left: 8px">重置</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>

    <div class="chart-container">
      <div class="group-name">
        <span>设备运行状态图</span>
      </div>
                <!-- 折线图-->
          <div
            class="device-chart-content"
          >
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <span class="pl-2 pr-1 text-14">属性：</span>
                <a-select class="chart-select" v-model="chartAlias" width="150px" placeholder="请选择"
                          @change="aliasParamChange">
                  <a-select-option v-for="item in chartAliasList" :key="item.alias" :value="item.name">{{ item.name }}
                  </a-select-option>
                </a-select>
                <a-tooltip placement="rightTop" style="margin-left: 2px" title="只显示数值类型的属性">
                  <a-icon type="question-circle" />
                </a-tooltip>
              </a-col>
              <a-col :md="8" :sm="8">
                <span class="pl-2 pr-1 text-14">间隔周期：</span>
                <a-input-number class="chart-input-number" id="inputNumber" @change="periodChange" v-model="period" :min="1" :max="3600"/>
                <a-tooltip placement="rightTop" style="margin-left: 2px" title="隔多少分钟显示一条数据">
                  <a-icon type="question-circle" />
                </a-tooltip>
              </a-col>
              <a-col :md="8" :sm="8">
                <span class="pl-2 pr-1 text-14">其他条件：</span>
                <a-select class="chart-select" width="150px" placeholder="请选择" @change="otherOptionChange">
                  <a-select-option v-for="item in otherOptionsList" :key="item.value" :value="item.value">{{ item.label }}
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
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
          </div>
      <!-- <BaseLineChart
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
      ></BaseLineChart> -->
    </div>
  </div>
</template>

<script>
import { httpActionHeader2 } from '../../../api/manage'
import { queryProjectByPrjCode } from '../../../api/api'
import BaseLineChart from '@/components/ECharts/BaseLine'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { DataDisplayMixin } from '../data/DataDisplayMixin'
import moment from 'moment'
export default {
  name: 'DeviceDataDisplay',
  mixins: [DataDisplayMixin, myCmpListMixin],
  components: {
    BaseLineChart
  },
  props: {
    deviceInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      timer: null, // 定时器
      lastQueryTime: '', // 记录上一次请求的时间
      projectMsg: '', // 记录所属项目信息
      startValue: null, // 根据时间筛选历史数据
      tempStartValue: null,
      endValue: null,
      tempEndValue: null,
      endOpen: false,
      isStartLoad: false,
      loading: false, // 正在加载标记
      chartAlias: '', // 选择的参树标识
      chartAliasList: {}, // 弹框参数类型
      otherOption: '',
      otherOptionsList: [
        {
          label: '默认',
          value: ''
        },
        {
          label: '命令编号=2011',
          value: '=2011'
        }
      ],
      period: 1, // 采样周期，默认1
      url: {
        // data: '/data/deviceData/deviceData',
        mqttDeviceData: '/device/device/queryById',
        getColumnsByProductId: '/deviceTree/treeNode/getDisplayColumns',
        getHistoryData: '/history/historyDeviceData/list',
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
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.timer)
    console.log('beforeDestroy')
  },
  destroyed () {
    // 清除定时器
    clearInterval(this.timer)
    console.log('destroyed')
  },
  created () {
    // this.lastQueryTime = '1997-01-01 00:00:00'
    // let yTime=(new Date).getTime()-24*60*60*1000; // 当前时间减去24h
    // this.lastQueryTime = new Date(yTime)  // 获取前一天的数据
    // 查询项目数据
    queryProjectByPrjCode({ prjCode: this.deviceInfo.prjCode })
      .then(res => {
        if (res.success) {
          this.projectMsg = res.result
          // this.url.data = this.projectMsg.dataServiceUrl + this.url.data
          this.url.getHistoryData = this.projectMsg.dataServiceUrl + this.url.getHistoryData
          this.url.getChartHistoryData = this.projectMsg.dataServiceUrl + this.url.getChartHistoryData
        } else {
          this.$message.error('获取项目数据失败!')
        }
      })
      .then(() => {
        // 获取设备数据
        // this.getDeviceDate()
        // that.getColumnsByProductId(that.deviceInfo.productId)
        this.initChartAliasList(this.deviceInfo.deviceProperties)
      })
      .then(() => {
        if (this.chartAliasList.length > 0) {
          this.getChartData()
        }
      })
  },
  computed: {},
  methods: {
    // 初始化图表并设置定时器
    initChartAndSetTimer () {
      this.timer = setInterval(() => {
        if (this.isStartLoad) {
          this.getChartData()
        }
      }, 5000)
    },
    // 加载图表数据
    getChartData () {
      console.log('chartAlias =>', this.chartAlias)
      // eslint-disable-next-line prefer-const
      let queryParams = {
        deviceKey: this.deviceInfo.deviceKey,
        groupId: 0,
        propNames: this.chartAlias,
        pageNo: 1,
        pageSize: 100,
        period: this.period,
        prjCode: this.deviceInfo.prjCode
      }
      if (this.otherOption) {
        queryParams.additionalCondition = {
          命令编号: this.otherOption
        }
      }
      if (this.startValue) {
        queryParams.startTime = moment(this.startValue).format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.endValue) {
        queryParams.endTime = moment(this.endValue).format('YYYY-MM-DD HH:mm:ss')
      }
      const headers = {
        'Content-Type': 'application/json',
        'api-version': 'V1'
      }
      const method = 'post'
      const that = this
      this.loading = true
      httpActionHeader2(this.url.getChartHistoryData, queryParams, method, headers).then(res => {
        if (res.success) {
          const properName = that.chartAlias
          const properTime = that.chartAlias + '_更新时间'
          console.log(res)
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
            that.$message.error('该区间无历史数据!')
          }
          console.log('getChartData :httpActionHeader res=>', that.deviceData)
        } else {
          that.$message.error('获取历史数据失败!')
          console.log(res)
        }
        this.loading = false
      })
    },
    // 其他条件改变
    otherOptionChange (value) {
      this.otherOption = value
      this.getChartData()
    },
    periodChange () {
      this.getChartData()
    },
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
    // 查询按钮点击事件
    filterByDate () {
      this.startValue = this.tempStartValue
      this.endValue = this.tempEndValue
      this.getChartData()
      clearInterval(this.timer)
    },
    // 重置按钮点击事件
    reset () {
      this.tempEndValue = this.endValue = null
      this.tempStartValue = this.startValue = null
      this.initChartAndSetTimer()
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
          // console.log('into if+++++++++')
          this.chartAlias = temp.unitName
        }
      }
    },
    aliasParamChange (value) {
      // // 清除定时器
      this.isStartLoad = true
      // clearInterval(this.timer)
      // this.initChartAndSetTimer()
      console.log('into aliasParamChange,value=>', value)
      this.getChartData()
      // TODO: 此处写参数下拉框改变后逻辑
    }
  }
}
</script>

<style scoped lang="less">
@import '~@assets/less/topBtns.less';
  @import '~@views/iot/css/iotCommon.less';

.styleWrap {
  resize: none;
  height: 32px;
  font-size: 15px;
}

.chart-container {
  margin-top: 15px;
}
.device-chart-content {
    .chart-select {
      width: 250px;
    }

    .chart-input-number {
      width: 250px;
    }
  }
</style>
