<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
export default {
  name: 'BaseBarChart',
  props: {
    id: {
      type: String,
      default: 'main'
    },
    height: {
      type: String,
      default: '400px'
    },
    text: {
      type: String,
      default: '柱状图'
    },
    color: {
      type: Object,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    yAxisName: {
      type: String,
      default: '个'
    },
    itemArray: {
      type: Array,
      default: () => ['用户A', '用户B']
    },
    // xAxisItem: {
    //   type: Array,
    //   default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    // },
    dataSource: {
      type: Array,
      default: () => [820, 932, 901, 934, 1290, 1330, 1320]
    },
    description: {
      type: String,
      default: '文本描述'
    }
  },
  data () {
    return {
      myChart: ''
    }
  },
  computed: {
    xAxisItem: function () {
      const xAxisItem = []
      this.dataSource.map((item) => {
        xAxisItem.push(item.name)
      })
      return xAxisItem
    }
  },
  methods: {
    setOption () {
      this.myChart.setOption({
        color: this.color,
        backgroundColor: this.backgroundColor,
        // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        title: {
          text: this.text,
          x: 'center',
          show: false
        },
        xAxis: {
          type: 'category',
          data: this.xAxisItem,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: this.yAxisName,
          // nameLocation: 'end',
          nameGap: 15
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        // 存在多种数据才需要图例
        legend: {
          orient: 'vertical',
          x: 'left',
          y: 'center',
          data: this.itemArray,
          show: false
        },
        // 多种数据时需要自定义series,每种数据对应数组中的一个值
        series: [{
          name: this.description,
          type: 'bar',
          barWidth: '6',
          itemStyle: {
            barBorderRadius: [5, 5, 0, 0]
          },
          data: this.dataSource
        }]
      })
    }
  },
  mounted () {
    const echarts = require('echarts')
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById(this.id), 'light')
    // 绘制图表
    this.setOption()
    setTimeout(() => {
      this.myChart.resize()
    }, 0)
    window.addEventListener('resize', () => {
      this.myChart.resize()
    })
  },
  // activated() {
  //   this.myChart.resize();
  // },
  watch: {
    dataSource: function () {
      this.setOption()
    }
  }
}
</script>
