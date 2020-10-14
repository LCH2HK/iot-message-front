<template>
  <div :id="id" class="main" :style="{width: '100%', height: height}"></div>
</template>

<script>
  export default {
    name: 'DoughnutChart',
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
        default: '环图'
      },
      // itemArray: {
      //   type: Array,
      //   default: () => ['用户A', '用户B']
      // },
      backgroundColor: {
        type: String,
        default: ''
      },
      dataSource: {
        type: Array,
        default: () => [{
            value: 50,
            name: '用户A'
          },
          {
            value: 50,
            name: '用户B'
          },
        ],
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
      itemArray: function () {
        let itemArray = [];
        this.dataSource.map((item) => {
          itemArray.push(item.name);
        })
        return itemArray;
      },
      totalNumber: function () {
        let totalNumber = 0;
        this.dataSource.map((item) => {
          totalNumber += item.value;
        })
        return totalNumber;
      }
    },
    methods: {
      setOption() {
        this.myChart.setOption({
          title: {
            text: [
              '{value|' + this.totalNumber + '}',
              '{name|合计}',
            ].join('\n'),
            left: '87',
            textAlign: 'center',
            textStyle: {
              rich: {
                value: {
                  color: '#303133',
                  fontSize: 24,
                  fontFamily:'PingFang SC',
                  fontWeight: 500
                },
                name: {
                  color: '#92929D',
                  fontSize: 12,
                  fontFamily: 'Microsoft YaHei',
                  fontWeight: 400
                },
              },
            },
            top: 'center',
            show: true
          },
          backgroundColor: this.backgroundColor,
          grid: {
            left: '1%',
            right: '1%',
            bottom: '1%',
          },
          tooltip: {
            trigger: 'item',
            formatter: "数量 <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            y: 'center',
            data: this.itemArray,
            show: false
          },
          series: [{
            name: this.description,
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
            data: this.dataSource,
          }]
        })
      },
      clickChart() {
        let that = this;
        let lastClickItem;
        // 点击事件
        this.myChart.on('click', function (params) {
          let key = params.name;
          if (lastClickItem == key) {
            key = '';
            lastClickItem = '';
          } else {
            lastClickItem = key
          }
          that.$emit('searchByTree', key);
        })
      }
    },
    mounted() {
      let echarts = require('echarts');
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById(this.id));
      // 亮色主题
      // this.myChart = echarts.init(document.getElementById(this.id), 'light');
      // 绘制图表
      this.setOption();
      setTimeout(() => {
        this.myChart.resize();
      }, 0);
      // window.onresize = myChart.resize;  //多图表下可能失效
      window.addEventListener("resize", () => {
        this.myChart.resize();
      })
      this.clickChart();
    },
    watch: {
      dataSource: function () {
        this.setOption()
      }
    }
  }
</script>