<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
export default {
  name: 'BaseLineChart',
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
      default: '折线图'
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    itemArray: {
      type: Array,
      default: () => []
    },
    xAxisItem: {
      type: Array,
      default: () => []
    },
    yAxisName: {
      type: String,
      default: '件'
    },
    yAxisMin: {
      type: String,
      default: '0'
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    description: {
      type: String,
      default: '文本描述'
    },
    series: {
      type: Array,
      default: () => []
    },
    dataZoom: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      myChart: '',
      yAxisMinData: null
    }
  },
  computed: {
    // xAxisItem: function(){
    //   let xAxisItem = [];
    //   this.dataSource.map((item) => {
    //     xAxisItem.push(item.name);
    //   })
    //   return xAxisItem;
    // }
  },
  methods: {
    setOption () {
      this.myChart.setOption({
        animation: false,
        title: {
          text: this.text,
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
        backgroundColor: this.backgroundColor,
        xAxis: {
          type: 'category',
          data: this.xAxisItem
        },
        yAxis: {
          type: 'value',
          name: this.yAxisName,
          min: this.yAxisMinData
        },
        legend: {
          orient: 'horizontal',
          // top: '30px',
          right: '50px',
          data: this.itemArray, // 图例项的名称，应等于某系列的name值
          show: true,
          icon: 'circle'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
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
        series: this.series,
        dataZoom: this.dataZoom
      })
    }
  },
  mounted () {
    // const text = setInterval(() => {
    //   this.dataSource.push(
    //     moment().format('YYYY-MM-DD HH:mm:ss')
    //   )
    // }, 1000)
    if (this.yAxisMin === '0') {
      this.yAxisMinData = 0
    }
    if (this.yAxisMin === 'dataMin') {
      this.yAxisMinData = 'dataMin'
    }
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
    // 解决动态添加数据后dataZoom重置的问题
    this.myChart.on('dataZoom', (event) => {
      this.dataZoom[0].end = event.end
      this.dataZoom[0].start = event.start
    })
  },
  watch: {
    dataSource: function () {
      if (this.yAxisMin === '0') {
        this.yAxisMinData = 0
      }
      if (this.yAxisMin === 'dataMin') {
        this.yAxisMinData = 'dataMin'
      }
      this.setOption()
    }
  }
}
</script>
