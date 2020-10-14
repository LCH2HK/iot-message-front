<template>
  <div
  :id="id"
  :style="{width: '100%', height: '100%'}"
  ></div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils/util.js'
export default {
  name: 'EChartsContainer',
  props: {
    id: {
      type: String,
      default: ''
    },
    option: {
      type: Object,
      default: () => null
    },
    customLegend: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      myChart: null,
      chartResizeDebounce: null
    }
  },
  mounted () {
    this.myChart = echarts.init(document.getElementById(this.id), 'light')
    this.chartResizeDebounce = debounce(this.myChart.resize, 300)
    this.setOption()
    // 监听window的Resize
    window.addEventListener('resize', this.chartResizeDebounce)
    if (this.customLegend !== null) {
      this.legendStateChange()
    }
    setTimeout(() => {
      this.myChart.resize()
    }, 0)
    // 监听指定Dom的Resize,IE不支持
    // const resizeObserver = new ResizeObserver(entries => {
    //   this.myChart.resize()
    // })
    // resizeObserver.observe(document.getElementById(this.id))
  },
  activated () {
    // 切换标签页后resize
    this.myChart.resize()
  },
  beforeDestoryed () {
    window.removeEventListener('resize', this.chartResizeDebounce)
  },
  methods: {
    setOption () {
      this.myChart.setOption(this.option)
    },
    // 自定义图例
    legendStateChange () {
      let that = this
      this.myChart.on('legendselectchanged', function (params) {
        let { selected, name } = params
        let data = that.option.legend.data
        let theOption = data.find(dt => dt.name === name)
        if (selected[name]) {
          let activeImg = that.customLegend[name].active
          theOption.icon = activeImg
        } else {
          theOption.icon = that.customLegend[name].unactive
        }
        that.myChart.setOption({
          legend: { data: data }
        })
      })
    }
  },
  computed: {
    // 侧边栏是否打开
    sideBarFlag: function () {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    // 监听option参数变化
    option: function () {
      this.setOption()
    },
    // 侧边栏展开收起状态变化时改变大小
    sideBarFlag: function () {
      this.chartResizeDebounce()
    }
  }
}
</script>
