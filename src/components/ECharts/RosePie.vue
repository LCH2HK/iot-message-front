<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
  export default {
    name: 'RosePieChart',
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
        default: '玫瑰图'
      },
      itemArray: {
        type: Array,
        default: () => ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
      },
      dataSource: {
        type: Array,
        default: () => [
          { value: 335, name: '直接访问'},
          { value: 310, name: '邮件营销'},
          { value: 274, name: '联盟广告'},
          { value: 235, name: '视频广告'},
          { value: 400, name: '搜索引擎'}
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
    //   itemArray: function () {
    //     let itemArray = [];
    //     this.dataSource.map((item) => {
    //       itemArray.push(item.name);
    //     })
    //     return itemArray;
    //   }
    },
    methods: {
      setOption() {
        this.myChart.setOption({
          //   backgroundColor: '#2c343c',
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
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: 'center',
            data: this.itemArray,
            show: false
          },
          series: [{
            type: 'pie',
            name: this.description,
            radius: '80%',
            center: ['50%', '50%'],
            data: this.dataSource,
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(0, 0, 0, 1)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(0, 0, 0, 1)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            //图后阴影
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            //弹出效果
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
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