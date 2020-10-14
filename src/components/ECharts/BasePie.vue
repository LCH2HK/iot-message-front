<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
  export default {
    name: 'BasePieChart',
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
        default: '饼图'
      },
      itemArray: {
        type: Array,
        default: () => ['西凉', '益州', '兖州', '荆州', '幽州']
      },
      dataSource: {
        type: Array,
        default: () => [{
            value: 1548,
            name: '幽州'
          },
          {
            value: 535,
            name: '荆州'
          },
          {
            value: 510,
            name: '兖州'
          },
          {
            value: 634,
            name: '益州'
          },
          {
            value: 735,
            name: '西凉'
          }
        ]
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
      // itemArray: function(){
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
          title: {
            text: this.text,
            // subtext: '虚构数据',  //小标题
            x: 'center',
            show: false
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: 'center',
            data: this.itemArray
          },
          series: [{
            type: 'pie',
            name: this.description,
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