<template>
  <div style="background-color: #F0F0F0; padding: 20px;">
    <!-- tab切换 -->
    <div style>
      <a-radio-group
        v-model="type"
        @change="handleSizeChange(type)"
        style="position:absolute;  z-index: 1000; top: 20px; right:39px"
      >
        <a-radio-button value="1">按区域</a-radio-button>
        <a-radio-button value="0">按行业</a-radio-button>
      </a-radio-group>
    </div>

    <a-row :gutter="16">
      <a-col :span="8" v-for="(item, index) in industryList" :key="index">
        <!-- 分类标题（可以按照行业和区域划分） -->
        <a-card class="card" :title="item.item" :bordered="true">
          <!-- <a-card-meta
            @click="toProject(i.id)"
            v-for="(i, index) in item.list"
            :key="index"
            :title="i.prjName"
            class="card-meta"
          >
            <template
              slot="description"
            >项目经理:{{i.projectManager}}</template>
          </a-card-meta>-->

          <div class="prj-wrapper" v-for="(prjItem, prjIndex) in item.list" :key="prjIndex">
            <div class="prj-title" @click="toProject(prjItem)">{{prjItem.prjName}}</div>
            <div class="prj-desc">项目经理：{{prjItem.projectManager}}</div>
          </div>

          <a href="#" slot="extra">共{{item.list.length}}条</a>
          <!--<p>
              <span style="font-weight: 700">华东水利项目</span><br>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目经理:{{i.name}}</span>
          </p>-->
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Item from 'ant-design-vue/es/transfer/item'
import { httpAction } from '@/api/manage'
import store from '@/store'
import { generateIndexRouter1 } from '@/utils/util'
import router from '@/router'
import Vue from 'vue'

export default {
  components: { Item },
  data () {
    return {
      industryList: '',
      type: '1',
      data: [],
      url: {
        list: '/project/sysProject/queryProject', // 获取项目列表
        SelectProjet: '/project/sysProject/selectProject?id=', // 选择某个项目
        getpromit: '/sys/getLoginUserPermissions'
      }
    }
  },
  created () {
    this.queryProject('1')
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
      let method = 'get'
      let url = this.url.list
      if (type == '0') {
        url = url + '?type=0'
      } else {
        url = url + '?type=1'
      }
      let params = {}

      httpAction(url, params, method).then(res => {
        console.log(res, 'res')
        if (res.success) {
          this.industryList = res.result
          console.log('this', this.industryList)
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
        console.log(res)
        if (res.success) {
          // Vue.ls.set('PROJECT_MESSAGE', projectMessage, 7 * 24 * 60 * 60 * 1000)
          sessionStorage.setItem('PROJECT_MESSAGE', JSON.stringify(projectMessage))
          // let routeUrl = this.$router.resolve({
          //   path: '/'
          // })
          // window.open(routeUrl.href, '_self')

          // 调用cloudepc的登录接口（项目级）
          var that = this
          console.log(that.$store.state.app.openFZFlag)
          var openFZFlag = that.$store.state.app.openFZFlag
          if (openFZFlag) {
            $.ajax({
              url: 'http://cloudepc.simulate.com:8080/cloudpm/servlet/LoginServlet.cmd?action=getPubkey',
              type: 'GET',
              dataType: 'jsonp',
              success: function (data) {
                console.log(data)
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
                  url: 'http://cloudepc.simulate.com:8080/cloudpm/servlet/LoginServlet.cmd?action=tologin&login=true&username=' + username +
                        '&password=' + pwd +
                        '&saveInfo=true&local=undefined' +
                        '&projectId=2147&projectName=杭州师范大学附属实验学校工程',
                  type: 'GET',
                  dataType: 'jsonp',
                  success: function (data) {
                    console.log(data)
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
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  text-align: center;
  margin-top: 10px;
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  // display:-webkit-box;
  // -webkit-box-orient: vertical;
  //background: #ececec;
  border-color: white;
  width: 100%;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 16px;
  font-weight: 900;
  .prj-wrapper {
    border-bottom: 1px solid #d8d8d8;
    margin-bottom: 20px;
    .prj-title {
      color: red;
      font-size: 20px;
      margin-bottom: 10px;
      cursor: pointer;
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
