<template>
  <div :id="id"  ref="myEchart"></div>
</template>
<script>
import echarts from 'echarts'
import { debounce } from '@/utils/util.js'
import 'echarts/map/js/china.js' // 引入中国地图数据
export default {
  props: {
    id: {
      type: String,
      default: 'main'
    },
    height: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: '中国地图'
    },
    dataSource: {
      type: Array,
      default: function () {
        return [{
          name: '浙江',
          value: 200
        },
        {
          name: '福建',
          value: 0
        },
        {
          name: '海南',
          value: 55
        },
        {
          name: '北京',
          value: 100
        },
        {
          name: '新疆',
          value: 255
        },
        {
          name: '西藏',
          value: 100
        }
        ]
      }
    }
  },
  data () {
    return {
      myChart: '',
      chartResizeDebounce: null
    }
  },
  mounted () {
    this.initEchartMap()
    this.chartResizeDebounce = debounce(this.myChart.resize, 300)
    this.myChart = echarts.init(document.getElementById(this.id))
    window.addEventListener('resize', this.chartResizeDebounce)
  },
  activated () {
    setTimeout(() => {
      this.myChart.resize()
    }, 0)
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    window.removeEventListener('resize', this.chartResizeDebounce)
  },
  computed: {
    // 侧边栏是否打开
    sideBarFlag: function () {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    // 侧边栏展开收起状态变化时改变大小
    sideBarFlag: function () {
      this.chartResizeDebounce()
    }
  },
  methods: {
    initEchartMap () {
      // 这里使用固定的数据，真正使用时，用父组件传递来的数据替换series即可
      // let myChart = echarts.init(this.$refs.myEchart);
      this.myChart = echarts.init(document.getElementById(this.id))
      this.myChart.setOption({
        backgroundColor: 'rgba(128, 128, 128, 0)',
        title: {
          text: this.text,
          left: 'center',
          textStyle: {
            color: '#000'
          },
          show: false
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          show: false,
          min: 0,
          max: 255,
          // splitNumber: 5, //分割数量
          calculable: true,
          inRange: {
            // color: ['#D1ECF2', '#B0DDF2', '#67A8DC', '#00A1EA']
            color: ['#87cdfa', '#9fd7c8', '#b4dff2', '#c5e67c']
            // color: ['aqua', 'lime', 'yellow', 'orange', '#ff3333']
          },
          textStyle: {
            color: '#12223b'
          }
        },
        geo: {},
        series: [{
          type: 'map',
          map: 'china', // 表示中国地图
          roam: true, // 鼠标缩放和平移漫游
          layoutCenter: ['50%', '50%'],
          layoutSize: '130%',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,1)'
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#D1ECF2', // 默认区域颜色
              borderColor: 'rgba(255, 255, 255, 1)'
            },
            emphasis: {
              areaColor: '#D8C935', // 触发颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: this.dataSource
        }

        ]
      })
    }
  }
}
</script>
