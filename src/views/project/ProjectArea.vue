<template>
  <a-card :bordered="false">
    <a-tabs>
      <a-tab-pane class="main-pane" tab="行业板块" key="1">
        <a-spin :spinning="isSpining">
          <div class="card-container" :title="null" :bordered="false">
            <a-col
              :span="8"
              class="area-wrapper"
              @click="toArea(areaItem)"
              v-for="(areaItem,index) in data"
              :key="index"
              :style="{'backgroundImage':'url('+getAreaImgSrc(areaItem.areaName) +')'}"
            >
              <div class="mongolia"></div>
              <div class="area-message">
                <a class="area-title">{{ areaItem.areaName }}</a>
                <span class="area-prj">
                  项目数量：
                  <a class="area-number">{{ areaItem.prjCount }}</a>个
                </span>
                <span class="area-access-device">
                  接入设备：
                  <a class="area-number">{{ areaItem.accessDevice }}</a>个
                </span>
                <span class="area-online-device">
                  在线设备：
                  <a class="area-number">{{ areaItem.onlineDevice }}</a>个
                </span>
                <span class="area-intoArea">进入板块</span>
              </div>
            </a-col>
          </div>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import Item from 'ant-design-vue/es/transfer/item'
import { httpAction, getAction } from '@/api/manage'
import store from '@/store'
import Vue from 'vue'
import JInputLk from '@/components/cmp/JInputLk'
import { ajaxGetDictItems } from '@/api/api'

export default {
  name: 'ProjectArea',
  components: { Item, JInputLk },
  data() {
    return {
      loading: false,
      industryList: '',
      tabTitle: '行业板块',
      isSpining: true,
      type: '2',
      timer: '',
      routerUrl: '../project/projectPortal',
      myRoutes: [
        {
          path: '/projectPortal',
          name: 'projectPortal',
          component: () => import('@/views/project/projectPortal.vue')
        }
      ],
      data: {},
      prjInfoList: {},
      queryParam: {},
      url: {
        areaData: '/device/device/areaInfoByUser'
      }
    }
  },
  created() {
    this.initDataByDict()
  },
  mounted() {
    // this.timer = setTimeout(this.searchReset(), 3000);
  },
  mutations: {},
  actions: {},
  methods: {
    /* 根据字典 初始化板块列表 */
    initDataByDict() {
      this.loading = true
      ajaxGetDictItems('project_types', null)
        .then(res => {
          if (res.success) {
            for (let v in res.result) {
              let temp = {
                areaName: res.result[v].text,
                prjCount: 0,
                accessDevice: 0,
                onlineDevice: 0,
                pic: '../iot/img/default_background.png'
              }
              this.data[res.result[v].text] = temp
            }
          }
        })
        .then(() => {
          this.initAreaData()
        })
    },
    initAreaData() {
      this.loading = true
      getAction(this.url.areaData, null)
        .then(res => {
          console.log('init area =>', res.result.areaInfo)
          if (res.success && res.result.areaInfo !== {}) {
            for (let i in res.result.areaInfo) {
              this.data[i].prjCount = res.result.areaInfo[i].prjCount
              this.data[i].accessDevice = res.result.areaInfo[i].allCount
              this.data[i].onlineDevice = res.result.areaInfo[i].online
            }
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch(e => {
          console.error(e)
        })
        .then(() => {
          this.loading = false
          this.isSpining = false
        })
    },
    /*点击进入项目*/
    toArea(areaItem) {
      if (areaItem.prjCount === 0) {
        this.$message.warning('该板块下暂无项目')
      } else {
        console.log('areaItem key=>', areaItem.areaName)
        this.$router.push({
          path: this.routerUrl,
          query: {
            area: areaItem.areaName
          }
        })
        this.$emit('close')
        this.visible = false
      }
    },
    //图片背景url 是否增加require
    filterPrjBackgroundImgSrc(pic) {
      if (pic.trim().length < 1 || pic.toString().slice(0, 1) === '.') {
        //如果是路径为空，或者路径是../开头的默认路径  返回默认路径 需加require
        return require('../iot/img/default_background.png')
      } else {
        //如果是 this.url.imgerver + newMsg 直接返回 不需加require
        return pic
      }
    },
    getAreaImgSrc(areaName) {
      //TODO 配置板块背景路径
      switch (areaName) {
        case '智慧风场':
          return require('../iot/img/project/wind.png')
        case '智慧工地':
          return require('../iot/img/project/site.png')
        case '智慧水务':
          return require('../iot/img/project/water.png')
        case '数字建管':
          return require('../iot/img/project/build.png')
        case '智慧光伏':
          return require('../iot/img/project/light.png')
        default:
          return require('../iot/img/project/build.png')
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/topBtns.less';
@import '~@views/iot/css/iotCommon.less';
/deep/.ant-card-body {
  padding: 10px 24px;
}
.card-container {
  margin-top: 20px;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-color: #aaa;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 16px;
  font-weight: 900;
  display: flex;
  flex-wrap: wrap;
  font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
  .area-wrapper {
    width: calc(50% - 32px);
    @media screen and (min-width: 1290px) {
      width: calc(33% - 32px);
    }
    @media screen and (min-width: 1600px) {
      width: calc(25% - 32px);
    }
    min-width: 300px;
    max-width: 500px;
    height: 200px;
    margin: 0 32px 32px 0;
    background-size: cover;
    border-radius: 10px;
    -webkit-box-shadow: 1px 0.22px 15px 0px #7a8a937a;
    box-shadow: 1px 0.22px 15px 0px #7a8a937a;

    .mongolia {
      display: none;
      background-color: rgba(0, 0, 0, 0.65);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding-bottom: 5px;
      border-bottom: 1px solid #d8d8d8;
      border-radius: 10px;
      z-index: 100;
    }
    .area-message {
      display: flex;
      flex: 1 1;
      width: 10px;
      margin-top: 15px;
      margin-left: 20px;
      flex-direction: column;
      flex-wrap: wrap;

      & > span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .area-title {
        font-size: 20px;
        font-weight: 700;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0px 1px 3px 0px rgba(2, 17, 31, 0.51);
      }

      .area-manager {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.85);
      }
      .area-number {
        color: #f7cc2b;
        margin-right: 5px;
        font-weight: 500;
      }
      .area-prj {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        position: absolute;
        bottom: 19%;
        font-weight: 400;
        color: #feffff;
        line-height: 32px;
      }
      .area-access-device {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        position: absolute;
        left: 50%;
        bottom: 19%;
        font-weight: 400;
        color: #feffff;
        line-height: 32px;
      }
      .area-online-device {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        position: absolute;
        bottom: 4%;
        font-weight: 400;
        color: #feffff;
        line-height: 32px;
      }

      .area-description {
        font-size: 12px;
        font-weight: lighter;
        /* white-space: normal; */
        color: rgba(255, 255, 255, 0.85);
      }
      .area-intoArea {
        display: none;
      }
    }

    .enter-into-project {
      margin-left: 30px;
      width: 60px;
      font-size: 14px;
      cursor: pointer;
      right: 0;
      flex-shrink: 0;

      a {
        display: none;
      }
    }

    &:hover {
      .enter-into-project {
        a {
          display: block;
          // color: #2eb2ff;
          color: @primary-color;
        }
      }
    }
  }

  .area-wrapper:hover {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.65);

    .mongolia {
      display: inline;
      background-color: rgba(0, 0, 0, 0.65);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding-bottom: 5px;
      border-bottom: 1px solid #d8d8d8;
      border-radius: 10px;
    }
    .area-title {
    }
    .area-intoArea {
      display: block;
      position: absolute;
      font-size: 28px;
      font-weight: 400;
      text-align: center;
      color: #fefefe;
      top: 50%;
      left: 50%;
      margin-top: -25px;
      margin-left: -100px;
      width: 200px;
      height: 50px;
      z-index: 200;
    }
  }
}

/*滚动条样式*/
.card::-webkit-scrollbar {
  width: 4px;
}

.card::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);

  .card::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>