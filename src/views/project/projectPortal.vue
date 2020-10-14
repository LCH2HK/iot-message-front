<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-content>
         <!-- 查询区域 -->
    <!-- <div class="controller-button"> -->
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
                  </span>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
    <!-- </div> -->
    <a-tabs>
      <a-tab-pane class='main-pane' :tab="tabTitle" key="1">
        <a-spin :spinning="isSpining">
          <a-card class="card" :bordered="false" v-if="isCard">
            <a-col :span="8" class="prj-wrapper" @click="toProject(prjItem,1)" v-for="(prjItem, prjIndex) in prjList"
                   :key="prjIndex">
              <div class="prj-message">
                <span class="prj-title">
                {{ prjItem.prjName }}
                </span>
                <span class="prj-access-device">已接设备：{{ prjDeviceInfo[prjItem.prjCode].allCount }}</span>
                <span class="prj-online-device">在线设备：{{ prjDeviceInfo[prjItem.prjCode].online}}</span>
                <span class="prj-manager">项目经理：{{ prjItem.projectManagerFullname }}</span>
              </div>
            </a-col>
            <a-col :span="8" class="prj-add-wrapper" @click="addProject()">
              <div class="prj-message">
                <!-- <a-icon type="plus" :style="{ fontSize: '50px', color: '#3565f7' }"></a-icon> -->
                <img class="prj-add-plus" src="@views/iot/img/project/prj_plus.png"/>
                <!-- <span class="prj-title">
                {{ prjItem.prjName }}
                </span> -->
                <!-- <span class="prj-access-device">已接设备：{{ prjDeviceInfo[prjItem.prjCode].allCount }}</span>
                <span class="prj-online-device">在线设备：{{ prjDeviceInfo[prjItem.prjCode].online}}</span> -->
                <!-- <span class="prj-manager">项目经理：</span> -->
              </div>
            </a-col>
          </a-card>
          <a-card class="card" :bordered="false" v-if="!isCard">
            <a-table
              bordered
              ref="table"
              size="middle"
              rowKey="id"
              :pagination="prjTableData.ipagination"
              :columns="prjTableData.columns"
              :data-source="prjTableData.dataSource"
              @change="handleTableChange"
              class="prj-table"
            >
             <span slot="action" slot-scope="text, record">
                <a @click="toProject(record,2)">进入项目</a>
              </span>
            </a-table>
          </a-card>
        </a-spin>
      </a-tab-pane>
      <div slot="tabBarExtraContent" class="tab-extra-content" v-if="isCard">
        <img @click="clickCardIcon" class="tab-extra-icon" src="@/views/iot/img/project/card_icon_select.png"/>
        <img @click="clickListIcon" class="tab-extra-icon" src="@/views/iot/img/project/list_icon_default.png"/>
      </div>
      <div slot="tabBarExtraContent" class="tab-extra-content" v-if="!isCard">
        <img @click="clickCardIcon" class="tab-extra-icon" src="@/views/iot/img/project/card_icon_default.png"/>
        <img @click="clickListIcon" class="tab-extra-icon" src="@/views/iot/img/project/list_icon_select.png"/>
      </div>
      <!--      <img  slot="tabBarExtraContent"  src="@/views/iot/img/project/card_icon.png" />-->
      <!--      <img  slot="tabBarExtraContent" class="tab-extra-icon" src="@/views/iot/img/project/list_icon.png" />-->
    </a-tabs>
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <sysProject-modal ref="modalForm" @ok="modalFormOk"></sysProject-modal>
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
import SysProjectModal from './modules/SysProjectModal'

export default {
  name: 'ProjectPortal',
  components: {
    Item,
    SysProjectModal,
    JInputLk
  },
  data () {
    return {
      prjList: '',
      isSpining: true,
      isCard: true,
      tabTitle: '所有项目',
      currentArea: '行业板块',
      prjDeviceInfo: '',
      prjTableData: {
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function (t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '项目名称',
            align: 'left',
            dataIndex: 'prjName'
          },
          {
            title: '项目负责人',
            align: 'left',
            dataIndex: 'projectManager'
          },
          {
            title: '已接设备',
            align: 'left',
            dataIndex: 'allCount'
          },
          {
            title: '在线设备',
            align: 'left',
            dataIndex: 'online'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'left',
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataSource: [],
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        }
      },
      type: '2',
      timer: '',
      data: [],
      queryParam: {},
      url: {
        list: '/device/device//listPrjAndDeviceByUser', // 分页查询项目列表和设备数据
        SelectProjet: '/project/sysProject/selectProject?id=', // 选择某个项目
        allList: '/device/device/prjAndDeviceInfoByUser' // 查询项目列表和设备数据
      }
    }
  },
  created () {
    // 重新加载数据
    if (this.$route.query.area != null) {
      this.currentArea = this.$route.query.area
      this.tabTitle = this.currentArea + '/项目列表'
      this.isRouter = true
    }
    // 加载数据
    this.queryProject()
  },
  activated () {
  },
  deactivated () {
  },
  watch: {
    $route () {
      if (this.$route.query.area != null) {
        this.currentArea = this.$route.query.area
      }
    },
    currentArea () {
      this.tabTitle = this.currentArea + '/项目列表'
      this.isRouter = true
      this.queryProject()
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
    /* 获取项目列表 */
    queryProject () {
      console.log('into queryProject')
      const url = this.isCard ? this.url.allList : this.url.list; let params = {}
      params = Object.assign({}, this.queryParam)
      if (this.currentArea !== '行业板块') {
        params.areaName = this.currentArea
      }
      if (!this.isCard) {
        params.pageNo = this.prjTableData.ipagination.current
        params.pageSize = this.prjTableData.ipagination.pageSize
      }
      this.isSpining = true
      getAction(url, params).then(res => {
        if (res.success) {
          if (res.result.length === 0) {
            this.$message.warning('暂无授权项目,请联系相关人员!')
          }
          if (this.isCard) {
            this.prjList = res.result.prjList
            this.prjDeviceInfo = res.result.prjDeviceInfo
          } else {
            this.prjList = res.result.prjList.records
            this.prjTableData.dataSource = res.result.prjDeviceInfo
            // this.prjTableData.ipagination.current = res.result.prjList.current
            // this.prjTableData.ipagination.pageSize = res.result.prjList.pageSize
            this.prjTableData.ipagination.total = res.result.prjList.total
          }
          this.isSpining = false
          console.log('prjDeviceInfo =>', this.prjDeviceInfo)
          console.log('prjList =>', this.prjList)
          console.log('dataSource =>', this.prjTableData.dataSource)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    /* 点击进入项目 */
    toProject (record, flag) {
      const id = record.id
      if (flag === 2) {
        record = this.findPrjMessage(id)
      }
      console.log('into toProject projectMessage', record)
      const method = 'get'
      const url = this.url.SelectProjet + id
      const params = {}
      httpAction(url, params, method).then(res => {
        if (res.success) {
          sessionStorage.setItem('PROJECT_MESSAGE', JSON.stringify(record))
          // Vue.ls.set('PROJECT_MESSAGE', record, 7 * 24 * 60 * 60 * 1000)
          const routeUrl = this.$router.resolve({
            path: '/'
          })
          window.open(routeUrl.href, '_blank')
        } else {
          this.$message.warning(res.message)
        }
      }).then(res => {
        sessionStorage.removeItem('PROJECT_MESSAGE')
      })
    },
    // 添加项目
    addProject () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
    },
    // 添加成功时刷新数据
    modalFormOk () {
      // 新增/修改 成功时，重载列表
      this.queryProject()
    },
    handleSizeChange () {
      this.queryProject()
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
      this.prjTableData.ipagination.current = 1
      this.prjTableData.ipagination.pageSize = 10
      this.queryProject()
    },
    // 重置搜索框
    searchReset () {
      this.queryParam = {}
      this.$refs.ResetLk1.ResetValue()
      this.$refs.ResetLk2.ResetValue()
      this.queryProject()
    },
    clickCardIcon () {
      console.log('into clickCardIcon')
      this.isCard = true
      this.queryProject()
    },
    clickListIcon () {
      console.log('into clickListIcon')
      this.isCard = false
      this.queryProject()
    },
    findPrjMessage (id) {
      for (const i in this.prjList) {
        if (this.prjList[i].id === id) {
          return this.prjList[i]
        }
      }
      return null
    },
    handleTableChange (pagination, filters, sorter) {
      console.log('handleTableChange方法被调用。。。')
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      this.prjTableData.ipagination = pagination
      this.queryProject()
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
/deep/.ant-card-body {
  padding: 16px 16px;
}
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
    height: 580px;
    overflow-x: hidden;
    overflow-y: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-color: #aaa;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    /*font-size: 16px;*/
    /*font-weight: 900;*/

    & > :global(.ant-card-body) {
      padding: 0;
    }

    .main-pane {
      width: 19%;
      height: 20%;
    }

    .prj-table{
      /*font-size: 16px;*/
      /*font-weight: 900;*/
    }
    .prj-add-wrapper{
      margin-top: 5px;
      padding-bottom: 5px;
      margin-right: 20px;
      display: inline-flex;
      align-items: initial;
      justify-content: flex-start;
      background-size: cover;
      border: 1px dashed #3565f7;
       border-radius: 4px;
      width: calc(25% - 20px);
      height: 120px;
      -webkit-box-shadow: 0px 1px 6px 0px rgba(31, 33, 34, 0.17);
      box-shadow: 0px 1px 6px 0px rgba(31, 33, 34, 0.17);

        .prj-add-plus{
          position: absolute;
          left: 50%;
          margin-top: -16px;
          margin-left: -12px;
          top: 50%;
        }
    }
    .prj-add-wrapper:hover {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.65);
      -webkit-box-shadow: 0px 0px 13px 1px rgba(53, 101, 247, 0.43);
      box-shadow: 0px 0px 13px 1px rgba(53, 101, 247, 0.43);
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
      border-radius: 4px;
      width: calc(25% - 20px);
      height: 120px;
      -webkit-box-shadow: 0px 1px 6px 0px rgba(31, 33, 34, 0.17);
      box-shadow: 0px 1px 6px 0px rgba(31, 33, 34, 0.17);

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

        .prj-number {
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
          left: 50%;
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
      -webkit-box-shadow: 0px 0px 13px 1px rgba(53, 101, 247, 0.43);
      box-shadow: 0px 0px 13px 1px rgba(53, 101, 247, 0.43);

      .prj-title {
      }
    }

  }

  .tab-extra-content {
    width: 90px;
    height: 30px;
    text-align: right;
  }

  .tab-extra-icon {
    width: 25px;
    height: 25px;
    margin-left: 16px;
    cursor: pointer;
  }

  .tab-extra-icon:hover {
    width: 25px;
    height: 25px;
    margin-left: 16px;
    -webkit-box-shadow: 0px 0px 13px 1px rgba(53, 101, 247, 0.43);
    box-shadow: 0px 0px 13px 1px rgba(53, 101, 247, 0.43);
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
