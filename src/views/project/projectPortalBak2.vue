<!--
同一页面
行业板块和项目门户跳转
-->
<template>
  <a-card :bordered="false">
    <div class="controller-button" v-show="isInPrj">
      <!--      <a-radio-group v-model="type" @change="handleSizeChange(type)" class="type-toogle">-->
      <!--        <a-radio-button value="2">默认</a-radio-button>-->
      <!--        &lt;!&ndash; <a-radio-button value="0">区域</a-radio-button>-->
      <!--        <a-radio-button value="1">类型</a-radio-button>&ndash;&gt;-->
      <!--      </a-radio-group>-->
      <!-- 查询区域 -->
      <!--      <div class="table-page-search-wrapper" v-if="type==2">-->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="21" :sm="18">
              <a-row :gutter="24">
                <a-col :span="7">
                  <a-form-item label="项目名称">
                    <j-input-lk
                      :placeholder="'请输入项目名称'"
                      @enterSearch="enterSearch($event,'prjName')"
                      @inputValueLk="inputValueLk($event,'prjName')"
                      ref="ResetLk1"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
                <a-col :span="7">
                  <a-form-item label="项目经理">
                    <j-input-lk
                      :placeholder="'请输入项目经理'"
                      @enterSearch="enterSearch($event,'projectManagerFullname')"
                      @inputValueLk="inputValueLk($event,'projectManagerFullname')"
                      ref="ResetLk2"
                    ></j-input-lk>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :md="3" :sm="24">
              <div class="search-buttons-content">
                  <span class="table-page-search-submitButtons serachLeft">
                        <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                        <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
                          <a-button type="primary" @click="backToArea" icon="reload">测试</a-button>
                  </span>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <a-tabs>
      <a-tab-pane class='main-pane' :tab="tabTitle" key="1">
        <a-spin :spinning="isSpining">
          <a-card class="card" :title="null" :bordered="false" v-show="!isInPrj">
            <a-col :span="8" class="area-wrapper" @click="toArea(areaItem)" v-for="(areaItem,index) in areaData"
                   :key="index"
                   :style="{'backgroundImage':'url('+getAreaImgSrc(areaItem.areaName) +')'}"
            >
              <div class="mongolia"></div>
              <div class="area-message">
                <a class="area-title">{{ areaItem.areaName }}</a>
                <span class="area-prj">项目数量：<a class="area-number">{{ areaItem.prjCount }}</a>个</span>
                <span class="area-access-device">接入设备：<a class="area-number">{{ areaItem.accessDevice }}</a>个</span>
                <span class="area-online-device">在线设备：<a class="area-number">{{ areaItem.onlineDevice }}</a>个</span>
                <span class="area-intoArea">进入板块</span>
              </div>
            </a-col>
          </a-card>
          <a-card class="card" :title="null" :bordered="false" v-show="isInPrj">
            <a-col :span="8" class="prj-wrapper" @click="toProject(prjItem)" v-for="(prjItem, prjIndex) in prjList"
                   :key="prjIndex">
              <!--              <div class="mongolia"></div>-->
              <!--              <div class="area-logo">-->
              <!--                <img src="/prj_icon.jpg" alt="logo" />-->
              <!--              </div>-->
              <div class="prj-message">
                <span class="prj-title">
                {{ prjItem.prjName }}
                </span>
                <span class="prj-access-device">已接设备：{{ prjDeviceInfo[prjItem.prjCode].allCount }}</span>
                <span class="prj-online-device">在线设备：{{ prjDeviceInfo[prjItem.prjCode].online}}</span>
                <span class="prj-manager">项目经理：{{ prjItem.projectManagerFullname }}</span>
                <!--                <span class="area-description">项目简介：{{ prjItem.description }}</span>-->
                <!--                <span class="prj-intoPrj">进入项目</span>-->
              </div>
              <!--              <img-->
              <!--                :src="getAvatarView(prjItem.pic)"-->
              <!--                alt=""-->
              <!--                style="height:104px;max-width:300px"-->
              <!--              />-->
              <!--              <div class="enter-into-project" @click="toProject(prjItem)">-->
              <!--                <a>进入项目</a>-->
              <!--              </div>-->
            </a-col>
          </a-card>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import Item from 'ant-design-vue/es/transfer/item'
import { httpAction, getAction } from '@/api/manage'
import store from '@/store'
import router from '@/router'
import Vue from 'vue'
import JInputLk from '@/components/cmp/JInputLk'
import { ajaxGetDictItems } from '@/api/api'

export default {
  name: 'ProjectPortal',
  components: { Item, JInputLk },
  data () {
    return {
      prjList: '',
      isSpining: true,
      tabTitle: '行业板块',
      currentArea: '行业板块',
      prjDeviceInfo: '',
      isInPrj: false,
      type: '2',
      timer: '',
      areaData: {},
      data: [],
      queryParam: {},
      url: {
        areaData: '/device/device/areaInfoByUser',
        list: '/device/device/prjAndDeviceInfoByUser', // 获取项目列表
        SelectProjet: '/project/sysProject/selectProject?id=', // 选择某个项目
        getpromit: '/sys/getLoginUserPermissions',
        imgerver: window._CONFIG.domianURL + '/sys/common/view',
        allList: '/device/device/prjAndDeviceInfoByUser'
      },
      src: '/ecidi-cmp/sys/common/view/corp/A01/2020/06/18/f31498b7f5a84f95abb9b07fd2433f34.jpg'
    }
  },
  created () {
    this.initDataByDict()
  },
  activated () {
  },
  watch: {
    isInPrj () {
      this.tabTitle = this.isInPrj ? this.currentArea + '/项目列表' : '行业板块'
    }
  },
  mounted () {

  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { username, realname, welcome }) => {
      state.username = username
      state.realname = realname
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },
  actions: {},
  methods: {
    /* 根据字典 初始化板块列表 */
    initDataByDict () {
      ajaxGetDictItems('project_types', null).then((res) => {
        if (res.success) {
          console.log('project_types =>', res.result)
          for (let v in res.result) {
            let temp = {
              areaName: res.result[v].text,
              prjCount: 0,
              accessDevice: 0
            }
            this.areaData[res.result[v].text] = temp
          }
        }
      }).then(() => {
        this.initAreaData()
      })
    },
    /* 初始化板块数据 */
    initAreaData () {
      getAction(this.url.areaData, null).then((res) => {
        this.isSpining = false
        if (res.success) {
          for (let i in res.result.areaInfo) {
            console.log('initAreaData i =>', i)
            this.areaData[i].prjCount = res.result.areaInfo[i].prjCount
            this.areaData[i].accessDevice = res.result.areaInfo[i].allCount
            this.areaData[i].onlineDevice = res.result.areaInfo[i].online
          }
          console.log('this data =>', this.areaData)
        } else {
          this.$message.warning(res.message)
        }
      }).catch(e => {
        console.error(e)
      }).then(() => {
      })
    },
    /* 进入板块 */
    toArea (areaItem) {
      if (areaItem.prjCount === 0) {
        alert('该板块下暂无项目')
      } else {
        console.log('areaItem =>', areaItem)
        console.log('areaItem key=>', areaItem.areaName)
        this.currentArea = areaItem.areaName
        this.isInPrj = true
        this.$emit('close')
        this.visible = false
        this.queryProject()
      }
    },
    /* 获取项目列表 */
    queryProject () {
      let url = this.url.list
      let params = {}
      url = this.url.allList
      params = Object.assign({}, this.queryParam)
      if (this.isInPrj) {
        params.areaName = this.currentArea
      }
      getAction(url, params).then(res => {
        if (res.success) {
          if (res.result.length === 0) {
            this.$message.warning('暂无授权项目,请联系相关人员!')
          }
          this.prjList = this.filterImgSrc(res.result.prjList)
          this.prjDeviceInfo = res.result.prjDeviceInfo
          this.isSpining = false
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    /* 点击进入项目 */
    toProject (projectMessage) {
      let method = 'get'
      let url = this.url.SelectProjet + projectMessage.id
      let params = {}
      httpAction(url, params, method).then(res => {
        if (res.success) {
          // Vue.ls.set('PROJECT_MESSAGE', projectMessage, 7 * 24 * 60 * 60 * 1000)
          sessionStorage.setItem('PROJECT_MESSAGE', JSON.stringify(projectMessage))
          let routeUrl = this.$router.resolve({
            path: '/'
          })
          window.open(routeUrl.href, '_self')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleSizeChange () {
      this.queryProject()
    },
    /* 返回至板块页面 */
    backToArea () {
      if (this.isInPrj) {
        this.currentArea = '行业板块'
        this.isInPrj = false
      }
    },
    // 模糊查询回车事件
    enterSearch (val, bindVal) {
      this.queryParam[bindVal] = val
      this.searchQuery()
    },
    // 模糊查询回绑值
    inputValueLk (val, bindVal) {
      this.queryParam[bindVal] = val
    },
    // 搜索
    searchQuery () {
      this.queryProject()
    },
    // 重置搜索框
    searchReset () {
      this.queryParam = {}
      this.$refs.ResetLk1.ResetValue()
      this.$refs.ResetLk2.ResetValue()
      this.queryProject()
    },
    // 加载项目信息后 过滤图片路径 预加载图片
    filterImgSrc (list) {
      // 过滤图片路径 判断图片是否加载成功
      console.log('list =>', list)
      for (var i in list) {
        let reg = new RegExp('\\\\', 'g')
        if (list[i].pic === null) {
          list[i].pic = '../iot/img/default_background.png'
          continue
        }
        let newMsg = list[i].pic.replace(reg, '/')
        // 必须用let
        let imgObj = new Image()
        imgObj.src = this.url.imgerver + newMsg
        imgObj.id = i
        let that = this
        console.log('imgObj.id =>', imgObj.id)
        console.log('prjList.id =>', this.prjList)
        imgObj.onload = function () {
          // 图片加载成功会调用onload()
          list[imgObj.id].pic = that.url.imgerver + newMsg
          // this.prjList[imgObj.id].pic = that.url.imgerver + newMsg
        }
        imgObj.onerror = function () {
          // 图片加载出错会调用onerror()
          list[imgObj.id].pic = '../iot/img/default_background.png'
          // this.prjList[imgObj.id].pic = '../iot/img/default_background.png'
        }
      }
      return list
    },
    // 图片背景url 是否增加require
    filterPrjBackgroundImgSrc (pic) {
      if (pic.trim().length < 1 || pic.toString().slice(0, 1) === '.') {
        // 如果是路径为空，或者路径是../开头的默认路径  返回默认路径 需加require
        return require('../iot/img/default_background.png')
      } else {
        // 如果是 this.url.imgerver + newMsg 直接返回 不需加require
        return pic
      }
    },
    getAreaImgSrc (areaName) {
      // TODO 配置板块背景路径
      switch (areaName) {
        case '智慧风场':
          return require('../iot/img/project/wind.png')
        case '智慧工地':
          return require('../iot/img/project/site.png')
        case '智慧水务':
          return require('../iot/img/project/water.png')
        case '数字建管':
          return require('../iot/img/project/build.png')
        default:
          return require('../iot/img/project/build.png')
      }
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }

}
</script>

<style lang="less" scoped>
  @import '~@assets/less/topBtns.less';
  @import '~@views/iot/css/iotCommon.less';

  .controller-button {
    /*display: flex;*/
    justify-content: space-between;
    height: 56px;
  }

  .card-title {
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 24px;
    border-bottom: 1px solid #d8d8d8;

    .title {
      display: inline-block;
      width: 100%;
      text-align: center;
    }

    .projectAmount {
      position: absolute;
      right: 10px;
      font-size: 10px;
    }
  }

  .card {
    margin-top: 20px;
    height: 580px;
    overflow-x: hidden;
    overflow-y: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-color: #aaa;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    font-size: 16px;
    font-weight: 900;

    & > :global(.ant-card-body) {
      padding-top: 0;
    }

    .main-pane {
      width: 19%;
      height: 20%;
    }

    .area-wrapper {
      margin-top: 5px;
      padding-bottom: 5px;
      margin-right: 20px;
      display: inline-flex;
      align-items: initial;
      justify-content: flex-start;
      background-size: cover;
      border-bottom: 1px solid #d8d8d8;
      border-radius: 10px;
      width: 23%;
      height: 200px;
      -webkit-box-shadow: 1px 0.22px 15px 0px #7a8a937a;
      box-shadow:1px 0.22px 15px 0px #7a8a937a;

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
        z-index:100;
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
          font-family: Microsoft YaHei UI Bold, Microsoft YaHei UI Bold-Bold;
          font-weight: 700;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0px 1px 3px 0px rgba(2,17,31,0.51);
        }

        .area-manager {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }
        .area-number{
          color: #f7cc2b;
          margin-right: 5px;
        }
        .area-prj {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          position: absolute;
          bottom: 19%;
          font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
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
          font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
          font-weight: 400;
          color: #feffff;
          line-height: 32px;
        }
        .area-online-device {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          position: absolute;
          bottom: 4%;
          font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
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
      .area-intoArea{
        display: block;
        position: absolute;
        font-size: 28px;
        font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
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
    .prj-wrapper {
      margin-top: 5px;
      padding-bottom: 5px;
      margin-right: 20px;
      display: inline-flex;
      align-items: initial;
      justify-content: flex-start;
      background-size: cover;
      border-bottom: 1px solid #d8d8d8;
      border-radius: 10px;
      width: 23%;
      height: 120px;
      -webkit-box-shadow: 1px 0px 5px 0px #3565f729;
      box-shadow:1px 0px 5px 0px #3565f729;
      .prj-message {
        display: flex;
        flex: 1 1;
        width: 10px;
        margin-top: 15px;
        flex-direction: column;
        flex-wrap: wrap;

        & > span {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
          font-weight: 400;
          text-align: left;
          color: #a1a6b2;
        }

        .prj-title {
          font-size: 16px;
          font-family: Microsoft YaHei UI Bold, Microsoft YaHei UI Bold-Bold;
          font-weight: 700;
          cursor: pointer;
          color: #2f2f2f;
          padding-left: 10px;
          border-left: #3da2ff solid 5px;
          /*text-shadow: 0px 1px 3px 0px rgba(2,17,31,0.51);*/
        }

        .prj-manager {
          position: absolute;
          left: 14px;
          bottom: 20px;
        }
        .prj-number{
          color: #f7cc2b;
          margin-right: 5px;
        }
        .prj-access-device {
          position: absolute;
          left: 14px;
          bottom: 49px;
        }
        .prj-online-device {
          position: absolute;
          bottom: 49px;
          left:50%;
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

    .prj-wrapper:hover {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.65);
      .prj-title {
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
