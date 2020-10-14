<!--
    背景卡片式项目门户页面 已废弃
-->
<template>
  <a-card :bordered="false">
    <div class="controller-button">
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
                <!--            <a-col :span="3" >-->
                <!--              <span style="float: right;overflow: hidden;padding-right: 10px;" class="table-page-search-submitButtons">-->
                <!--                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
                <!--                <a-button-->
                <!--                  type="primary"-->
                <!--                  @click="searchReset"-->
                <!--                  icon="reload"-->
                <!--                  style="margin-left: 8px"-->
                <!--                >重置</a-button>-->
                <!--              </span>-->
                <!--            </a-col>-->
                <!--            <a-col :span="8" >-->
                <!--              <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">-->
                <!--                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
                <!--                <a-button-->
                <!--                  type="primary"-->
                <!--                  @click="searchReset"-->
                <!--                  icon="reload"-->
                <!--                  style="margin-left: 8px"-->
                <!--                >重置</a-button>-->
                <!--              </span>-->
                <!--            </a-col>-->
              </a-row>
            </a-col>
            <a-col :md="3" :sm="24">
              <div class="search-buttons-content">
                  <span class="table-page-search-submitButtons serachLeft">
                        <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                        <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
                  </span>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>

    <a-tabs>
      <a-tab-pane v-for="(item, index) in industryList" class='prj-pane' :tab="currentArea" :key="index">
        <a-spin :spinning="isSpining">
          <a-card class="card" :title="null" :bordered="false">
            <!--            <a-col :span="8">-->
            <!--            <span class="device-msg">-->
            <!--              设备厂商:{{ dataSource.manufacturerName }}-->
            <!--            </span>-->
            <!--            </a-col>-->
            <!--                   :style="{'backgroundImage':'url('+filterPrjBackgroundImgSrc(prjItem.pic) +')'}"-->
            <a-col :span="8" class="prj-wrapper" @click="toProject(prjItem)" v-for="(prjItem, prjIndex) in item.list"
                   :key="prjIndex"
                   :style="{'backgroundImage':'url('+filterPrjBackgroundImgSrc(prjItem.pic) +')'}"
            >
              <div class="mongolia"></div>
              <!--              <div class="prj-logo">-->
              <!--                <img src="/prj_icon.jpg" alt="logo" />-->
              <!--              </div>-->
              <div class="prj-message">
                <a class="prj-title">{{ prjItem.prjName }}</a>
                <span class="prj-manager">项目经理：{{ prjItem.projectManagerFullname }}</span>
                <span class="prj-description">项目简介：{{ prjItem.description }}</span>
                <span class="prj-manager">接入设备：{{ prjDeviceInfo[prjItem.prjCode].allCount }}</span>
                <span class="prj-manager">在线设备：{{ prjDeviceInfo[prjItem.prjCode].online}}</span>
                <span class="prj-intoPrj">进入项目</span>
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

export default {
  name: 'ProjectPortal',
  components: { Item, JInputLk },
  data () {
    return {
      industryList: '',
      isSpining: true,
      currentArea: '所有版块',
      prjDeviceInfo: '',
      isRouter: false,
      type: '2',
      timer: '',
      data: [],
      queryParam: {},
      url: {
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
    this.queryProject('2')
  },
  activated () {
    // this.currentArea = '所有版块'
    // this.isRouter = false;
    // this.queryProject('2')
  },
  watch: {
    $route () {
      this.recordId = this.$route.query.recordId
      // 重新加载数据
      if (this.$route.query.area != null) {
        this.currentArea = this.$route.query.area
        this.isRouter = true
      }
      // 加载数据
      this.queryProject('2')
    }
  },
  mounted () {
    // this.timer = setTimeout(this.searchReset(), 3000);
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
    /* 获取项目列表 */
    queryProject (type) {
      let url = this.url.list
      let params = {}
      if (type == '0') {
        url = url + '?dictCode=project_area'
      } else if (type == '1') {
        url = url + '?dictCode=project_types'
      } else {
        url = this.url.allList
        params = Object.assign({}, this.queryParam)
        if (this.isRouter) {
          params.areaName = this.currentArea
        }
      }
      // console.log(params)
      getAction(url, params).then(res => {
        if (res.success) {
          if (res.result.length === 0) {
            this.$message.warning('暂无授权项目,请联系相关人员!')
          }
          if (type == '2') {
            this.industryList = [
              {
                item: '项目',
                list: this.filterImgSrc(res.result.prjList)
              }
            ]
            this.prjDeviceInfo = res.result.prjDeviceInfo
          } else {
            this.industryList = res.result
          }
          this.isSpining = false
          // console.log('this', this.industryList)
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
        // console.log("toProject=>", res)
        if (res.success) {
          // Vue.ls.set('PROJECT_MESSAGE', projectMessage, 7 * 24 * 60 * 60 * 1000)
          sessionStorage.setItem('PROJECT_MESSAGE', JSON.stringify(projectMessage))
          let routeUrl = this.$router.resolve({
            path: '/'
          })
          window.open(routeUrl.href, '_self')

          // 调用cloudepc的登录接口（项目级）
          var that = this
          // console.log(that.$store.state.app.openFZFlag)
          var openFZFlag = that.$store.state.app.openFZFlag
          var fzurl = that.$store.state.app.FZLoginUrl
          if (openFZFlag) {
            $.ajax({
              url: fzurl + '/servlet/LoginServlet.cmd?action=getPubkey',
              type: 'GET',
              dataType: 'jsonp',
              async: false,
              success: function (data) {
                // console.log(data)
                // 用公钥对用户名进行加密
                // var pwd = "";
                // if(localStorage.ddPassword!="" && localStorage.ddPassword!=undefined){
                //   var encrypt = new JSEncrypt();
                //   encrypt.setPublicKey(data.pubkey);
                //   pwd = encrypt.encrypt(localStorage.ddPassword);
                // }
                var pwd = 'chenm2test' // 单点登录的密码
                var username = 'chen_m2'
                $.ajax({
                  url:
                      fzurl +
                      '/servlet/LoginServlet.cmd?action=tologin&login=true&username=' +
                      username +
                      '&password=' +
                      pwd +
                      '&saveInfo=true&local=undefined' +
                      '&projectId=2147&projectName=杭州师范大学附属实验学校工程',
                  type: 'GET',
                  dataType: 'jsonp',
                  async: false,
                  success: function (data) {
                    // console.log(data)
                    if (data.login) {
                      window.open('http://cloudepc.simulate.com:8080/cloudpm/framework.html')

                      location.reload()
                    } else if (data.errmsg == 0) {
                      alert('暂无该项目！')
                      location.reload()
                    }
                  },
                  error: function () {
                    alert('验证时出现错误，请稍后再试')
                  }
                })
              },
              error: function () {
                alert('验证时出现错误，请稍后再试')
              }
            })
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    handleSizeChange (type) {
      this.queryProject(type)
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
      this.queryProject('2')
    },
    // 重置搜索框
    searchReset () {
      this.queryParam = {}
      this.$refs.ResetLk1.ResetValue()
      this.$refs.ResetLk2.ResetValue()
      this.queryProject('2')
    },
    // 已废弃
    getAvatarView (pic) {
      if (pic == undefined) {
        return null
      } else {
        return this.url.imgerver + '/' + pic
      }
    },
    // 加载项目信息后 过滤图片路径 预加载图片
    filterImgSrc (list) {
      // 过滤图片路径 判断图片是否加载成功
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
        imgObj.onload = function () {
          // 图片加载成功会调用onload()
          that.industryList[0].list[imgObj.id].pic = that.url.imgerver + newMsg
        }
        imgObj.onerror = function () {
          // 图片加载出错会调用onerror()
          that.industryList[0].list[imgObj.id].pic = '../iot/img/default_background.png'
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

    .prj-pane {
      width: 19%;
      height: 20%;
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
      height: 200px;
      -webkit-box-shadow: 0px 6px 3px 0px rgba(122, 138, 147, 0.48);
      box-shadow: 0px 6px 3px 0px rgba(122, 138, 147, 0.48);

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
      }

      .prj-logo {
        width: 80px;
        height: 80px;
        margin-right: 30px;
        flex-shrink: 0;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .prj-message {
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

        .prj-title {
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.9);
        }

        .prj-manager {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }

        .prj-description {
          font-size: 12px;
          font-weight: lighter;
          /* white-space: normal; */
          color: rgba(255, 255, 255, 0.85);
        }

        .prj-intoPrj {
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

    .prj-wrapper:hover {
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

      .prj-title {
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        // color: #2eb2ff;
        color: rgb(255, 242, 193);
      }

      .prj-intoPrj {
        display: block;
        position: absolute;
        top: 50%;
        left: 60%;
        margin-top: -25px;
        margin-left: -100px;
        width: 200px;
        height: 50px;
        font-size: 28px;
        color: rgba(255, 255, 255, 0.85);
        font-family: Microsoft YaHei;
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
