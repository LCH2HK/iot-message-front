<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="8">
            <a-form-item label="周次">
              <a-week-picker placeholder="选择周次" v-model="queryParam.wDate" @change="onChange"></a-week-picker>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名" v-model="queryParam.btRealname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="目的地">
              <a-input placeholder="请输入目的地" v-model="queryParam.destination"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.prjName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->

    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

    <!-- table区域-begin -->
    <div style="width: 100%;overflow: auto;">
      <a-spin :spinning="confirmLoading" class="loading">
        <!-- 表头第一行 -->
        <div>
          <div class="left-box">
            <div class="larger week-box" @click="changeDate(0)">
              <a-icon type="double-left"/>
              上一周
            </div>
            <div class="larger week-box" @click="changeDate(1)">下一周
              <a-icon type="double-right"/>
            </div>
          </div>
          <div class="center-box" v-for="week in weekList">
            <div class="title-box">{{week.weekNum}}</div>
          </div>
          <!-- 表头第二行 -->
          <div class="left-box">
            <div class="title-box">姓名</div>
          </div>
          <div class="center-box" v-for="date in dateList">
            <div class="title-box">{{date.weekDate}}</div>
          </div>
          <!-- 表格内容 -->
          <div class="content-box" v-for="item in btList">
            <div class="left-box content-box-name">{{item.btRealname}}</div>

            <div
              class="content-box-in"
              v-for="detail in item.businessTripWeekDetailList"
              :style="{width: changeWidth(detail.length)}"
            >
              <!--存在内容的表格-->
              <div
                class="content-box-used"
                v-if="detail.startNum != undefined"
                @click="handleEdit(detail.btId)"
              >
                {{detail.destination}}
              </div>
              <!--空表格-->
              <div
                class="content-box-blank"
                v-if="detail.length == 1 && detail.startNum == undefined"
              ></div>
              <!--隐藏表格-->
              <div
                class="content-box-display"
                v-if="detail.length == 0"
              ></div>
            </div>
          </div>
          <!-- table区域-end -->
        </div>
      </a-spin>
    </div>
      <div class="foot-box">
        <a-pagination
          :current="queryParam.pageNo"
          size="large"
          :total="total"
          showSizeChanger
          showQuickJumper
          :showTotal="(total, range) => `${range[0]}-${range[1]} 共${total}条`"
          @change="changePage"
        />
      </div>
    <!-- 表单区域 -->
    <businessTrip-modal ref="modalForm" @ok="modalFormOk" @reset="searchReset"></businessTrip-modal>

  </a-card>
</template>

<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import BusinessTripModal from './modules/BusinessTripModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'BusinessTripList',
    mixins: [CmpListMixin],
    components: {
      BusinessTripModal
    },
    data() {
      return {
        description: '出差管理管理页面',
        //加载效果
        confirmLoading: false,
        //用来选定周次的日期
        // 查询参数
        queryParam: {
          WDate: moment(),
          btRealname: '',
          destination: '',
          prjName: '',
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
        //当前登录人的用户名和id
        loginUserName: '',
        loginUserId: '',
        //选择周次存在出差记录的人员列表
        nameList: [],
        //表头循环集合
        weekList: [
          { weekNum: '星期一' }, { weekNum: '星期二' }, { weekNum: '星期三' }, { weekNum: '星期四' },
          { weekNum: '星期五' }, { weekNum: '星期六' }, { weekNum: '星期日' }
        ],
        dateList: [
          { weekDate: '' }, { weekDate: '' }, { weekDate: '' }, { weekDate: '' },
          { weekDate: '' }, { weekDate: '' }, { weekDate: '' }
        ],
        //表头，防止CmpListMixin中的方法报错
        columns: [],
        //获取的后端列表
        btList: [],
        //请求地址
        url: {
          list: '/businessTrip/businessTripWeek/list',
          queryById: '/businessTrip/businessTrip/queryById'
        }
      }
    },

    computed: {},

    beforeCreate() {

      // 自行定义方法，引用字典
      //初始化字典
      initDictOptions('bt_status').then((res) => {
        if (res.success) {
          this.statusDictOptions = res.result
        }
      })
    },


    created() {
      const that = this
      //设置默认日期列表为本星期列表
      that.queryParam.wDate = moment()
      that.queryParam.pageNo = 1
      that.getDateList(moment())
      that.getBtList()
    },

    methods: {
      ...mapGetters(['nickname', 'userId']),

      moment,

      handleEdit(id) {
        const that = this
        that.axios.get(that.url.queryById, {
          params: {
            id: id
          }
        })
          .then(function(res) {
            that.$refs.modalForm.title = '详情'
            that.$refs.modalForm.edit(res.result, true)
            that.startDisabled = true
            that.endDisabled = true
            that.buttonDisplay = false
          })
      },

      onChange() {
        this.getBtList()
      },


      searchQuery() {
        this.getBtList()
      },

      //重置
      searchReset() {
        const that = this
        that.queryParam.wDate = moment()
        that.queryParam.btRealname = ''
        that.queryParam.destination = ''
        that.queryParam.prjName = ''
        that.queryParam.pageNo = 1
        that.queryParam.pageSize = 10
        that.getDateList(new Date())
        that.getBtList()
      },

      getBtList() {
        this.confirmLoading = true
        const that = this
        that.axios.get(that.url.list, {
          params: {
            wDate: that.queryParam.wDate.format('YYYY-MM-DD'),
            btRealname: that.queryParam.btRealname,
            destination: that.queryParam.destination,
            prjName: that.queryParam.prjName,
            pageNo: that.queryParam.pageNo,
            pageSize: that.queryParam.pageSize
          }
        })
          .then(function(res) {
            that.confirmLoading = false
            that.btList = res.result.records
            that.total = res.result.total
          })
      },


      //获取日期列表
      getDateList(date) {
        //获取传入日期的星期
        var weekOfDay = moment(date).format('E')
        //获取星期一到星期日的日期值并传入数组
        for (let i = 0; i < 7; i++) {
          this.dateList[i].weekDate = moment(date).add(i + 1 - weekOfDay, 'day').format('YYYY-MM-DD')
        }
      },

      //上一周和下一周切换
      changeDate(pram) {
        var mill
        if (pram === 0) {
          mill = new Date(this.queryParam.wDate.format()).getTime() - 1000 * 60 * 60 * 24 * 7
        } else {
          mill = new Date(this.queryParam.wDate.format()).getTime() + 1000 * 60 * 60 * 24 * 7
        }
        var newDate = moment(mill)
        this.getDateList(newDate)
        this.queryParam.wDate = moment(newDate)
        this.queryParam.pageNo = 1
        this.getBtList()
      },

      //根据length参数计算DIV的宽度并返回
      changeWidth(length) {
        return (Math.round(length * 625) / 100).toFixed(2) + '%'
      },

      //分页方法
      changePage(page, pageSize) {
        const that = this
        that.queryParam.pageNo = page
        that.queryParam.pageSize = pageSize
        that.getBtList()
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';

  @table-title-height: 50px;
  @table-content-height: 50px;
    /*设置宽度小于1054px时左右宽度时，出现左右滚动条*/
  .ant-card {
    :global(.ant-card-body) {
      :global(.ant-spin-container) {
        min-width:1054px;
      }
    }
  }
  .week-box {
    background: @primary-color;
    width: 50%;
    border-style: none solid solid solid;
    border-width: 1q;
    border-color: white;
    text-align: center;
    /*background-color: #f7f7f7;*/
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
    color: white;
    height: 100%;
    line-height: @table-title-height;
    float: left;
  }

  .title-box {
    width: auto;
    border-style: none solid solid solid;
    border-width: 1q;
    border-color: white;
    text-align: center;
    /*background-color: #f7f7f7;*/
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
    color: white;
    height: 100%;
    line-height: @table-title-height;
  }

  .content-box {
    width: auto;
    height: 100%;
    text-align: center;
  }


  .larger:hover {
    transform: scale(1.1, 1.1);
    cursor: pointer;
  }

  .left-box {
    width: 12.5%;
    height: @table-title-height;
    line-height: @table-title-height;
    float: left;
  }


  .center-box {
    width: 12.5%;
    height: @table-title-height;
    line-height: @table-title-height;
    float: left;

  }

  .content-box-name {
    border-style: none solid solid solid;
    border-width: 1q;
    text-align: center;
    border-color: #d5d5d5;
  }

  .content-box-remarks {
    border-style: none solid solid none;
    border-width: 1q;
    text-align: center;
    border-color: #d5d5d5;
  }

  .content-box-in {
    width: 6.25%;
    height: @table-content-height;
    line-height: @table-content-height;
    float: left;
  }

  .content-box-used {
    border-style: none solid solid none;
    border-width: 1q;
    border-color: #d5d5d5;
    width: 100%;
    text-align: center;
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
    color: white;
    height: 100%;
    line-height: @table-title-height;
    background-color: #8ddd87;
    float: left;
    cursor: pointer;
  }


  .content-box-display {
    display: none;
    cursor: pointer;
  }

  .content-box-blank {
    border-style: none solid solid none;
    border-width: 1q;
    text-align: center;
    border-color: #d5d5d5;
    width: 100%;
    height: 100%;
    line-height: @table-content-height;
    float: left;
  }

  .foot-box {
    float: right;
    margin-top: 10px;
  }
  /*.innerBorder {*/
  /*   min-width:1054px;*/
  /* }*/

</style>