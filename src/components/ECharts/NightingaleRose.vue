<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
  export default {
    name: 'NightingaleRoseChart',
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
        default: '南丁格尔玫瑰图'
      },
      itemArray: {
        type: Array,
        default: () => ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
      },
      dataSource: {
        type: Array,
        default: () => [
          {value:10, name:'rose1'},
          {value:5, name:'rose2'},
          {value:15, name:'rose3'},
          {value:25, name:'rose4'},
          {value:20, name:'rose5'},
          {value:35, name:'rose6'},
          {value:30, name:'rose7'},
          {value:40, name:'rose8'}
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
          //   backgroundColor: '#2c343c',  // 背景色
          title: {
            text: this.text,
            // subtext: '虚构数据',  // 小标题
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
            data: this.itemArray,
            show: false
          },
          // 工具栏
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          series: [{
            name:'半径模式',
            type:'pie',
            radius : [20, 110],
            center : ['25%', '50%'],
            roseType : 'radius',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data: this.dataSource
        },
        {
            name:'面积模式',
            type:'pie',
            radius : [30, 110],
            center : ['75%', '50%'],
            roseType : 'area',
            data: this.dataSource
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