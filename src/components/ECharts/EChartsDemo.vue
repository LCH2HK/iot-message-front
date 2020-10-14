<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
  export default {
    name: 'EChartsDemo',
    props: {
      id: {
        type: String,
        default: 'main',
      },
      height: {
        type: String,
        default: '400px'
      },
      text: {
        type: String,
        default: '柱状图'
      },
      backgroundColor: {
        type: String,
        default: ''
      },
      itemArray: {
        type: Array,
        default: () => ['用户A', '用户B']
      },
      xAxisItem: {
        type: Array,
        default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      dataSource: {
        type: Array,
        default: () => [820, 932, 901, 934, 1290, 1330, 1320]
      },
      description: {
        type: String,
        default: '文本描述'
      }
    },
    data() {
      return {
        myChart: ''
      }
    },
    computed: {
      //   xAxisItem: function () {
      //     let xAxisItem = [];
      //     this.dataSource.map((item) => {
      //       xAxisItem.push(item.name);
      //     })
      //     return xAxisItem;
      //   }
    },
    methods: {
      setOption() {
        this.myChart.setOption({
          color: ['#3398DB'], // 条状颜色
          // 默认值
          // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
          backgroundColor: this.backgroundColor, //背景色，默认白色背景
          // color: {   // 背景色和条状颜色均可使用渐变以及纹理填充
          //     type: 'linear',    // 线性渐变
          //     x: 0,
          //     y: 0,
          //     x2: 0,
          //     y2: 1,
          //     colorStops: [{
          //         offset: 0, color: 'red' // 0% 处的颜色
          //     }, {
          //         offset: 1, color: 'blue' // 100% 处的颜色
          //     }],
          //     global: false // 缺省为 false
          // },
          title: { // 标题
            text: this.text, // 文本
            subtext: '副标题',
            show: true, // 是否显示
            link: 'https://www.echartsjs.com/zh/option.html#title.id', // 超链接
            target: 'self', // 超链接在当前窗口打开，默认值为blank，在新窗口打开
            textStyle: {
              // 在这里定义文字样式
            },
            // sublink: '', // 副标题超链接
            // subtarget: 'blank',
            // subtextStyle: {},
            textAlign: 'left', // 主副标题对齐方式
            left: '20px', // 组件距离容器左侧距离
            // top: '10px', 
            // right: '10%',
            // bottom: '',
            // x: 'center',
          },
          //图例组件、存在多种数据才需要图例
          legend: {
            orient: 'vertical', // 布局朝向 默认horizontal
            x: 'left',
            y: 'center',
            data: this.itemArray,
            show: false
          },
          grid: { // 直角坐标系内绘图网格
            // id:'',  // 指定可用于在 option 或者 API 中引用组件
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true, // grid区域是否包含坐标轴的刻度坐标，用于防止坐标溢出，默认false
            // tooltip: {} // 网格特定tooltip组件
          },
          xAxis: { // grid中的x轴
            // gridIndex: '', // 所在grid的索引，默认位于第一个grid
            // postion: 'top',   // 默认 grid 中的第一个 x 轴在 grid 的下方（'bottom'），第二个 x 轴视第一个 x 轴的位置放在另一侧。
            offset: '0', // 相对默认位置的偏移
            type: 'category', // 坐标轴类型 category类目 
            // name: '',
            // nameLocation: '',
            data: this.xAxisItem,
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: {
            type: 'value'
          },
          dataZoom: { // 用于区域缩放

          },
          visualMap: { // 视觉映射组件

          },
          tooltip: { // 提示框组件
            trigger: 'axis', // 触发类型 axis 坐标轴 | item 数据项图形 | none
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'cross', // 默认为直线，可选为：'line' | 'shadow' | 'cross' | 'none'
              //   axis: '', // x', 'y', 'radius', 'angle'
              // snap: '',   // 是否自动吸附到点上
            },
            triggerOn: 'mousemove', // 'mousemove' | 'click' | 'mousemove|click' | 'none'

          },
          axisPointer: {

          },

          //多种数据时需要自定义series,每种数据对应数组中的一个值
          series: [{
            name: this.description,
            type: 'bar',
            barWidth: '60%',
            data: this.dataSource,
          }]
        })
      }
    },
    mounted() {
      let echarts = require('echarts');
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById(this.id), 'light');
      // 绘制图表
      this.setOption();
      window.addEventListener("resize", () => {
        this.myChart.resize();
      })
    },
    watch: {
      dataSource: function () {
        this.setOption()
      }
    }
  }
</script>