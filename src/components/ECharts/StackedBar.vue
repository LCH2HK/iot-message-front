<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
  export default {
    name: 'StackedBarChart',
    props: {
      id: {
        type: String,
        default: 'main',
      },
      height: {
        type: String,
        default: '400px'
      },
      backgroundColor: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: '堆叠条形图'
      },
      xAxisItem: {
        type: Array,
        default: () => ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      series: {
        type: Array,
        default: () => [{
            name: '直接访问',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: '邮件营销',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: '搜索引擎',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
          }
        ]
      },
    },
    data() {
      return {
        myChart: ''
      }
    },
    computed: {
      // itemArray: function () {
      //   let itemArray = [];
      //   this.dataSource.map((item) => {
      //     itemArray.push(item.name);
      //   })
      //   return itemArray;
      // }
    },
    methods: {
      setOption() {
        this.myChart.setOption({
          color: [{
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#7E45FF'
              }, {
                offset: 1,
                color: '#8D8FFF'
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
                color: '#F083B1'
              }, {
                offset: 1,
                color: '#FFA2CE'
              }]
            }, {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#FFD378'
              }, {
                offset: 1,
                color: '#FFE17B'
              }]
            }
          ],
          title: {
            text: this.text,
            x: 'left',
            show: false
          },
          backgroundColor: this.backgroundColor,
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            // orient: 'vertical',
            borderRadius: 5,
            x: 'right',
            y: 'top',
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
            data: this.xAxisItem
          },
          yAxis: {
            type: 'value',
            name: '个'
          },
          barWidth: '6',
          itemStyle: {
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
          },
          series: this.series
        })
      }
    },
    mounted() {
      let echarts = require('echarts');
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById(this.id), 'light');
      // 绘制图表
      this.setOption();
      setTimeout(() => {
        this.myChart.resize();
      }, 0);
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },
    watch: {
      dataSource: function () {
        this.setOption()
      }
    }
  }
</script>