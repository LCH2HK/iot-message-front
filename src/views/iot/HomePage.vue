<template>
  <div class="main-content">
    <div class="left-content">
      <a-card class="left-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>7日内上报事件TOP5的事件</span>
        </div>
        <a-select class="select-tool" defaultValue="信息" @change="handleChange">
          <a-select-option value="jack">信息</a-select-option>
          <a-select-option value="lucy">信息2</a-select-option>
        </a-select>
        <div class="report-item-container">
          <div class="report-item" v-for="item in items" :key="item.name">
            <span class="report-name">{{ item.name }}</span>
            <div class="report-sum" :style="{color: item.color}">{{ item.value }}</div>
            <img class="report-point" :src="getPointImgSrc(item.img)" alt="">
          </div>
        </div>
      </a-card>
      <a-card class="left-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>7日内上报事件TOP5的设备</span>
        </div>
        <a-select class="select-tool" defaultValue="信息" @change="handleChange">
          <a-select-option value="jack">事件312</a-select-option>
          <a-select-option value="lucy">事件132</a-select-option>
        </a-select>
        <div class="report-item-container">
          <div class="report-item" v-for="item in items" :key="item.name">
            <span class="report-name">{{ item.name }}</span>
            <div class="report-sum" :style="{color: item.color}">{{ item.value }}</div>
            <img class="report-point" :src="getPointImgSrc(item.img)" alt="">
          </div>
        </div>
      </a-card>
      <a-card class="left-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>设备停用时长</span>
        </div>
        <EChartsContainer
          class="chart"
          id="leftChart"
          :style="{width: '100%', height: '80%'}"
          :option="deviceStopTime"
          v-if="DestroyIncomeStatistics">
        </EChartsContainer>
      </a-card>
    </div>
    <div class="center-content">
      <a-card class="center-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>设备在线率</span>
        </div>
        <ChinaMap class="map-content" id="chinaMap" v-if="DestroyIncomeStatistics"></ChinaMap>
        <a-row class="online-rate-row">
          <div class="online-rate-col">
            <img src="../iot/img/homepage/online-rate.png" alt="">
            <span class="online-tag">在线率</span>
            <div class="online-sum">78%</div>
          </div>
          <div class="online-rate-col">
            <img src="../iot/img/homepage/online-number.png" alt="">
            <span class="online-tag">在线数</span>
            <div class="online-sum">88</div>
          </div>
          <div class="online-rate-col">
            <img src="../iot/img/homepage/total-number.png" alt="">
            <span class="online-tag">总数</span>
            <div class="online-sum">108
            </div>
          </div>
        </a-row>
      </a-card>
      <a-card class="bottom-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>7日内上报事件类型分布</span>
        </div>
        <EChartsContainer
          class="chart"
          id="centerChert"
          :style="{width: '100%', height: '80%'}"
          :option="reportEventType"
          :customLegend="reportLegendDataMsg"
          v-if="DestroyIncomeStatistics">
        </EChartsContainer>
      </a-card>
    </div>
    <div class="right-content">
      <a-card class="right-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>产品种类</span>
        </div>
        <a-row class="product-type-message">
          <div class="tag-message">
            <div class="tag-item">
              <div class="tag-point1"></div>
              <span class="tag-name">自定义品类</span>
              <span class="tag-sum">{{ productType.series[0].data[0].value }}</span>
            </div>
            <div class="tag-item">
              <div class="tag-point2"></div>
              <span class="tag-name">网关</span>
              <span class="tag-sum">{{ productType.series[0].data[1].value }}</span>
            </div>
            <div class="tag-item">
              <div class="tag-point3"></div>
              <span class="tag-name">其他设备</span>
              <span class="tag-sum">{{ productType.series[0].data[2].value }}</span>
            </div>
            <div class="tag-item">
              <div class="tag-point4"></div>
              <span class="tag-name">其他</span>
              <span class="tag-sum">{{ productType.series[0].data[3].value }}</span>
            </div>
          </div>
          <div class="doughnut-container">
            <EChartsContainer
              class="doughnut-chart"
              id="rightChart1"
              :style="{ height: '100%', width: '100%', 'background-color': 'transparent'}"
              :option="productType"
              v-if="DestroyIncomeStatistics">
            </EChartsContainer>
          </div>
        </a-row>
      </a-card>
      <a-card class="right-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>30日设备指标趋势</span>
        </div>
        <EChartsContainer
          class="chart"
          id="rightChart2"
          :style="{width: '100%', height: '80%', 'background-color': 'transparent'}"
          :option="deviceTargetTrend"
          :customLegend="deviceTargetLegendData"
          v-if="DestroyIncomeStatistics">
        </EChartsContainer>
      </a-card>
      <a-card class="right-card" :bordered="false">
        <div class="group-name">
          <img src="../iot/img/homepage/card_title_img.png" alt="">
          <span>省级在线排名</span>
        </div>
        <EChartsContainer
          class="chart"
          id="rightChart3"
          :style="{width: '100%', height: '80%', 'background-color': 'transparent'}"
          :option="provinceRank"
          v-if="DestroyIncomeStatistics">
        </EChartsContainer>
      </a-card>
    </div>
  </div>
</template>

<script>
import EChartsContainer from '@/components/ECharts/EChartsContainer'
import ChinaMap from '@/components/ECharts/ChinaMap'
export default {
  name: 'HomePage',
  components: {
    EChartsContainer,
    ChinaMap
  },
  data () {
    return {
      DestroyIncomeStatistics: true,
      windowSizeFlag: true,
      productType: {
        title: {
          text: [
            '{value|336}',
            '{name|合计}'
          ].join('\n'),
          left: '48%',
          textAlign: 'center',
          textStyle: {
            rich: {
              value: {
                color: '#171725',
                fontSize: 36,
                fontFamily: 'DIN',
                fontWeight: 400
              },
              name: {
                color: '#92929D',
                fontSize: 15,
                fontFamily: 'Microsoft YaHei',
                fontWeight: 400
              }
            }
          },
          top: 'center',
          show: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '数量 <br/>{b}: {c} ({d}%)'
        },
        series: [{
          type: 'pie',
          radius: ['65%', '80%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: 114,
              name: '网关',
              itemStyle: {
                borderType: 'dotted',
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [{
                    offset: 0.2,
                    color: '#03C5FC' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#00E9C7' // 100% 处的颜色
                  }
                  ]
                }
              }
            },
            {
              value: 169,
              name: '其他',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0.2,
                    color: '#FF42A4' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FD876F' // 100% 处的颜色
                  }
                  ]
                }
              }
            },
            {
              value: 176,
              name: '自定义品类',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#13DCEF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#3387F6' // 100% 处的颜色
                  }
                  ]
                }
              }
            },
            {
              value: 68,
              name: '其他设备',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [{
                    offset: 0.2,
                    color: '#FFBD0A' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFC80A' // 100% 处的颜色
                  }
                  ]
                }
              }
            }

          ]
        }]
      },
      provinceRank: {
        color: { // 背景色和条状颜色均可使用渐变以及纹理填充
          type: 'linear', // 线性渐变
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#567FF7' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#56AAFF' // 100% 处的颜色
          }]
        },
        title: {
          text: '省级在线排名',
          // x: 'center',
          top: '15px',
          left: '20px',
          textStyle: {
            // 在这里定义文字样式
            fontWeight: '500',
            fontSize: 15
          },
          show: false
        },
        xAxis: {
          type: 'category',
          data: ['北京', '上海', '天津', '重庆', '安徽', '河南', '浙江', '山东', '湖南', '海南']
        },
        yAxis: {
          type: 'value',
          name: '个',
          min: 0,
          splitNumber: 5
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          // top: '30px',
          right: '50px',
          data: ['已处理', '事件上报'], // 图例项的名称，应等于某系列的name值
          show: true,
          icon: 'circle'
        },
        grid: { // 直角坐标系内绘图网格
          // id:'',  // 指定可用于在 option 或者 API 中引用组件
          top: '20%',
          left: '3%',
          right: '7%',
          bottom: '8%',
          containLabel: true // grid区域是否包含坐标轴的刻度坐标，用于防止坐标溢出，默认false
          // tooltip: {} // 网格特定tooltip组件
        },
        series: [{
          name: '邮件营销',
          type: 'line',
          smooth: true,
          stack: '总量1', // stack相同，绘图时会数据会累加
          data: [{
            value: 100,
            name: '北京'
          },
          {
            value: 195,
            name: '上海'
          },
          {
            value: 230,
            name: '天津'
          },
          {
            value: 245,
            name: '重庆'
          },
          {
            value: 245,
            name: '安徽'
          },
          {
            value: 385,
            name: '河南'
          },
          {
            value: 220,
            name: '浙江'
          },

          {
            value: 250,
            name: '山东'
          },
          {
            value: 370,
            name: '湖南'
          },
          {
            value: 195,
            name: '海南'
          }
          ],
          areaStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#195EF9' // 0% 处的颜色
              }, {
                offset: 0.25,
                color: '#0ED2F7'
              },
              {
                offset: 0.6,
                color: '#B2FEFA'
              },
              {
                offset: 1,
                color: '#ffffff' // 100% 处的颜色
              }]
            }
          }
        }
        ],
        dataZoom: []
      },
      deviceTargetLegendData: {
        已处理: {
          active: `image://${require('./img/homepage/legend-icon-green.png')}`,
          unactive: `image://${require('./img/homepage/legend-icon-grey.png')}`
        },
        事件上报: {
          active: `image://${require('./img/homepage/legend-icon-red.png')}`,
          unactive: `image://${require('./img/homepage/legend-icon-grey.png')}`
        }
      },
      deviceTargetTrend: {
        color: [{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#FE5A7B'
          }, {
            offset: 1,
            color: '#F699B4'
          }]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#F7971E'
          }, {
            offset: 1,
            color: '#FFE259'
          }]
        }],
        title: {
          text: '20ri',
          // x: 'center',
          top: '15px',
          left: '20px',
          textStyle: {
            // 在这里定义文字样式
            fontWeight: '500',
            fontSize: 15
          },
          show: false
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          name: '件',
          min: 0,
          splitNumber: 3
        },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b}: {c}'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          // top: '30px',
          right: '50px',
          itemWidth: 16,
          itemHeight: 16,
          textStyleObject: {
            color: '#92929d'
          },
          data: [
            {
              name: '已处理',
              icon: `image://${require('./img/homepage/legend-icon-green.png')}`
            },
            {
              name: '事件上报',
              icon: `image://${require('./img/homepage/legend-icon-red.png')}`
            }
          ]
        },
        grid: { // 直角坐标系内绘图网格
          // id:'',  // 指定可用于在 option 或者 API 中引用组件
          top: '20%',
          left: '3%',
          right: '7%',
          bottom: '8%',
          containLabel: true // grid区域是否包含坐标轴的刻度坐标，用于防止坐标溢出，默认false
          // tooltip: {} // 网格特定tooltip组件
        },
        series: [
          {
            name: '已处理',
            type: 'line',
            stack: '总量1',
            data: [120, 132, 101, 134, 90, 230, 210],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0.2,
                  color: '#FE5A7B' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#FFFFFF' // 100% 处的颜色
                }]
              }
            }
          },
          {
            name: '事件上报',
            type: 'line',
            stack: '总量2',
            data: [220, 182, 191, 234, 290, 330, 310],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0.2,
                  color: '#f4dbb5' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#FFFFFF' // 100% 处的颜色
                }]
              }
            }
          }
        ],
        dataZoom: []
      },
      deviceStopTime: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#F9887D'
          }, {
            offset: 1,
            color: '#FF5983'
          }]
        },
        xAxis: {
          type: 'category',
          data: ['30天内', '60天内', '90天内', '120天内', '150天内', '180天内'],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: '秒',
          nameGap: 15
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        series: [{
          data: [{
            value: 100,
            name: '30天内'
          },
          {
            value: 600,
            name: '60天内'
          },
          {
            value: 3300,
            name: '90天内'
          },
          {
            value: 3900,
            name: '120天内'
          },
          {
            value: 3200,
            name: '150天内'
          },
          {
            value: 2200,
            name: '180天内'
          }
          ],
          type: 'bar',
          showBackground: true,
          barWidth: '6',
          itemStyle: {
            barBorderRadius: [3, 3, 0, 0]
          },
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }
        }]
      },
      reportLegendDataMsg: {
        故障: {
          active: `image://${require('./img/homepage/legend-icon-green.png')}`,
          unactive: `image://${require('./img/homepage/legend-icon-grey.png')}`
        },
        告警: {
          active: `image://${require('./img/homepage/legend-icon-yellow.png')}`,
          unactive: `image://${require('./img/homepage/legend-icon-grey.png')}`
        },
        信息: {
          active: `image://${require('./img/homepage/legend-icon-blue.png')}`,
          unactive: `image://${require('./img/homepage/legend-icon-grey.png')}`
        }
      },
      reportEventType: {
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#0072FF'
            }, {
              offset: 1,
              color: '#00C6FF'
            }]
          },
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#F7971E'
            }, {
              offset: 1,
              color: '#FFD200'
            }]
          },
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#07A7BF'
            }, {
              offset: 1,
              color: '#38EF7D'
            }]
          }
        ],
        title: {
          x: 'left',
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          // orient: 'vertical',
          y: 'top',
          right: '3%',
          itemWidth: 16,
          itemHeight: 16,
          textStyleObject: {
            color: '#92929d'
          },
          data: [
            {
              name: '故障',
              icon: `image://${require('./img/homepage/legend-icon-green.png')}`
            },
            {
              name: '告警',
              icon: `image://${require('./img/homepage/legend-icon-yellow.png')}`
            },
            {
              name: '信息',
              icon: `image://${require('./img/homepage/legend-icon-blue.png')}`
            }
          ]
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: { show: false },
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          name: '次'
        },
        barWidth: '6',
        itemStyle: {
          label: {
            normal: {
              show: false,
              position: 'insideRight'
            }
          }
        },
        series: [{
          name: '故障',
          type: 'bar',
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0]
          },
          data: [320, 302, 301, 334, 390, 330, 320]
        },
        {
          name: '告警',
          type: 'bar',
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0]
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '信息',
          type: 'bar',
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0]
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
        ]
      },
      deviceOnlineRate: {
        dataSource: [{
          name: '在线率',
          finished: 88,
          total: 98
        }]
      },
      items: [
        {
          name: '事件312',
          value: 168,
          color: 'rgba(253,186,6,1)',
          img: 'ball_1.png'
        },
        {
          name: '事件132',
          value: 176,
          color: 'rgba(142,194,252,1)',
          img: 'ball_2.png'
        },
        {
          name: '网关',
          value: 114,
          color: 'rgba(238,155,134,1)',
          img: 'ball_3.png'
        },
        {
          name: '其他设备',
          value: 98,
          color: 'rgba(53,101,247,1)',
          img: 'ball_4.png'
        },
        {
          name: '其他',
          value: 88,
          color: 'rgba(53,101,247,1)',
          img: 'ball_5.png'
        }
      ]
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    // window.onresize = () => {
    //   if (document.body.clientWidth > 1070 && this.windowSizeFlag) {
    //     this.DestroyIncomeStatistics = false
    //     this.$nextTick(() => {
    //       this.DestroyIncomeStatistics = true
    //     })
    //     this.windowSizeFlag = false
    //   } else if (document.body.clientWidth < 1070 && this.windowSizeFlag) {
    //     this.DestroyIncomeStatistics = false
    //     this.$nextTick(() => {
    //       this.DestroyIncomeStatistics = true
    //     })
    //     this.windowSizeFlag = false
    //   }
    // }
  },
  watch: {},
  methods: {
    asideRepaint () {

    },
    handleChange () {
    },
    getPointImgSrc (name) {
      return require('../iot/img/homepage/' + name)
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';

  .main-content {
    background: #EFF1F2;
    display: flex;
    justify-content: space-between;
    font-family: Microsoft YaHei;
    position: relative;
    width: 100%;
    height: 100%;

    /deep/ .ant-card-body {
      height: 100%;
      padding: 0px;
      -webkit-box-shadow: 5px 5px 21px 0px rgba(3, 95, 173, 0.1);
      -moz-box-shadow: 5px 5px 21px 0px rgba(3, 95, 173, 0.1);
      box-shadow: 5px 5px 21px 0px rgba(3, 95, 173, 0.1);
      overflow: hidden;
    }

    .group-name {
      margin-left: 15px;
      margin-top: 12px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(5, 14, 41, 1);

      span {
        line-height: 16px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(5, 14, 41, 1);
        margin-left: 8px;
      }
    }

    .left-content {
      width: 30%;
      min-width: 360px;
      max-width: 640px;

      .left-card {
        height: 31%;
        min-height: 185px;
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .center-content {
      width: 37%;
      margin: 0 24px;
      min-width: 360px;
      max-width: 740px;

      .center-card {
        height: calc(62% + 24px);
        min-height: 394px;
        margin-bottom: 24px;

        .map-content {
          height: 75%;
          width: 100%;
          background-image: url('../iot/img/homepage/map_background.png');
          background-size: 100% 100%;
        }

        .online-rate-row {
          position: absolute;
          width: 100%;
          bottom: 4%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .online-rate-col {
            border: 1px solid #EAEBEB;
            width: 187px;
            height: 50px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .online-tag {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              line-height: 16px;
            }
            .online-sum {
              display: inline-block;
              font-size:24px;
              font-family:DIN;
              font-weight:bold;
              color:rgba(5,25,51,1);
              line-height: 16px;
            }
          }
        }
      }

      .bottom-card {
        height: 31%;
      }
    }

    .right-content {
      width: 30%;
      min-width: 360px;
      max-width: 640px;

      .right-card {
        height: 31%;
        min-height: 185px;
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .ant-card-head {
  }

  .clearfix::after {
    content: '';
    display: block;
    clear: both;
  }

  body, dl, dd, h1, h2, h3, h4, h5, h6, p, form, ol, ul {
    margin: 0;
    padding: 0;
  }

  .main {
    width: 100%;
  }

  .ant-divider-horizontal {
    margin: 10px 0;
  }

  .product-type-message {
    height: calc(100% - 60px);
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .tag-message {
    width: 40%;
    margin: 30px 1px 0 34px;
  }

  .tag-item {
    margin-bottom: 8px;
  }

  .tag-item > div {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
  }

  .tag-point1 {
    background: linear-gradient(149deg, rgba(9, 120, 240, 1) 0%, rgba(3, 220, 241, 1) 100%);
  }

  .tag-point2 {
    background: linear-gradient(-44deg, rgba(0, 233, 199, 1) 0%, rgba(3, 197, 252, 1) 100%);
  }

  .tag-point3 {
    background: linear-gradient(-44deg, rgba(247, 151, 30, 1) 0%, rgba(255, 210, 0, 1) 100%);
  }

  .tag-point4 {
    background: linear-gradient(26deg, rgba(253, 135, 111, 1), rgba(255, 66, 164, 1), rgba(253, 135, 111, 1));
  }

  .tag-name {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(146, 146, 157, 1);
    line-height: 24px;
    margin-left: 6px;
  }

  .tag-sum {
    float: right;
    font-size: 16px;
    font-family: DIN;
    font-weight: 500;
    color: rgba(68, 68, 79, 1);
    line-height: 24px;
  }

  .main > div {
    float: left;
    margin-left: 20px;
  }

  .chart {
    /*background-image: url('../iot/img/homepage/map_background.png') !important;*/
    /*margin-top: 20px;*/
  }

.doughnut-container {
  width: 40%;
  height: 100%;
  .doughnut-chart {
    margin: auto;
  }
}

  .device-count {
    background-color: #D7D7D7;
    margin: 20px auto;
    width: 300px;
  }

  .device-sum {
    margin: 0 0 5px 100px;
    float: left;
  }

  .report-item-container {
    width: 100%;
    height: 58%;
    text-align: center;
    position: absolute;
    display: flex;
    bottom: 10%;
    left: 3%;
    /*margin-right: 18px;*/
  }

  .report-item {
    /*display: inline-block;*/
    /*margin: 66px 0 0 2%;*/
    width: 17%;
    height: 100%;
    padding: 5px 0;
    margin-right: 2%;
    background: #f0f6ff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .report-sum {
    height: 24px;
    line-height: 24px;
    font-size: 24px;
    font-family: DIN Bold, DIN Bold-Bold;
    font-weight: 700;
    /* color: rgba(253,186,6,1); */
  }

  .report-point {
    width: 22px;
    height: 21px;
  }

  .report-name {
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }

  .select-tool {
    width: 100px;
    position: absolute;
    top: 13px;
    right: 16px;
    background: rgba(10, 33, 92, 0);
    color: rgba(153, 153, 153, 1);
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
  }
</style>
