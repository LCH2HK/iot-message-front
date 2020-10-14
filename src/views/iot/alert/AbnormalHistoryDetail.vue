<template>
  <a-card :bordered="false">
    <a-row>
      <div class="group-name">
        <span>异常历史信息</span>
      </div>
    </a-row>
    <a-row>
      <a-col :span="8" class="abnormal-label">设备名称：{{ AbnormalHistoryInfo.deviceName }}</a-col>
      <a-col :span="8" class="abnormal-label">设备参数：{{ AbnormalHistoryInfo.parameterName }}</a-col>
      <a-col :span="8" class="abnormal-label">当前状态：{{ status[AbnormalHistoryInfo.status] }}</a-col>
    </a-row>
    <a-row>
      <a-col :span="8" class="abnormal-label">异常出现时间：{{ AbnormalHistoryInfo.abnormalTime }}</a-col>
      <a-col :span="8" class="abnormal-label">异常结束时间：{{ AbnormalHistoryInfo.resolveTime }}</a-col>
    </a-row>
    <a-divider />
    <a-row>
      <div class="group-name">
        <span>异常数据图</span>
      </div>
      <div v-if="loading" class="loading">Loading...</div>
      <BaseLineChart
        class="chart"
        id="lineChart"
        :style="{width: '100%', height: '400px'}"
        :xAxisItem="this.AbnormalData.xAxisItem"
        :series="this.AbnormalData.series"
        :itemArray="this.AbnormalData.itemArray"
        yAxisMin="dataMin"
        v-if="!loading"
      ></BaseLineChart>
    </a-row>
  </a-card>
</template>

<script>
import { getAction } from '../../../api/manage'
import Vue from 'vue'
import BaseLineChart from '@/components/ECharts/BaseLine'
export default {
  name: 'AbnormalHistoryDetail',
  components: {
    BaseLineChart
  },
  data () {
    return {
      url: {
        getAbnormalData: '/alert/abnormalData/getDataByAbnormalHistoryId'
      },
      AbnormalHistoryInfo: {},
      AbnormalData: {
        xAxisItem: [],
        itemArray: ['值'],
        series: [
          {
            name: '值',
            type: 'line',
            stack: '异常值',
            data: [],
            markLine: {
              data: [
                {
                  name: '最小值',
                  label: { formatter: '规定最小值：{c}' },
                  yAxis: JSON.parse(this.$route.query.record).minValue,
                  lineStyle: { color: 'red' }
                },
                {
                  name: '最大值',
                  label: { formatter: '规定最大值：{c}' },
                  yAxis: JSON.parse(this.$route.query.record).maxValue,
                  lineStyle: { color: 'red' }
                }
              ]
            }
          }
        ]
      },
      loading: true,
      status: ['已解除', '异常监测', '已告警'],
      projectMsg: {}
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    this.AbnormalHistoryInfo = JSON.parse(this.$route.query.record)
    this.getAbnormalDataById()
  },
  watch: {
    $route (to, from) {
      this.AbnormalHistoryInfo = JSON.parse(this.$route.query.record)
      // 重新加载数据
      if (to.name === 'iot-alert-AbnormalHistoryDetail') {
        console.log('路由更改重新加载组件', to, from)
        this.getAbnormalDataById()
      }
    }
  },
  methods: {
    getAbnormalDataById () {
      this.loading = true
      console.log(this.$route.query)
      var params = {
        id: this.AbnormalHistoryInfo.id,
        realDb: this.projectMsg.realDb
      }
      getAction(this.projectMsg.dataServiceUrl + this.url.getAbnormalData, params).then(res => {
        console.log('异常数据图请求res', res)
        if (res.success) {
          this.AbnormalData.xAxisItem = []
          this.AbnormalData.series[0].data = []
          for (let i = 0; i < res.result.length; i++) {
            this.AbnormalData.xAxisItem.push(res.result[i].create_time)
            this.AbnormalData.series[0].data.push(res.result[i].abnormal_value)
          }
          console.log(this.AbnormalData)
        } else {
          this.$message.error('操作失败!')
        }
        this.loading = false
      })
    }
  }
}
</script>

<style>
.abnormal-label {
  font-size: 16px;
  padding-top: 10px;
  padding-left: 20px;
}
.group-name > span {
  font-size: 18px;
  line-height: 18px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(23, 23, 37, 1);
  margin-left: 13px;
}
</style>
