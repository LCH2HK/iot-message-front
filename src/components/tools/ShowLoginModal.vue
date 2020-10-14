<template>
  <div>
    <a-modal
      :footer="null"
      title="在线用户"
      :width="1000"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      style="top:5%;"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="2" :sm="8" style="text-align: center">登录人</a-col>
            <a-col :md="8" :sm="8">
              <a-input placeholder="请输入登录人" v-model="queryParam.loginUname"></a-input>
            </a-col>

            <a-col :md="2" :sm="8" style="text-align: center">ip地址</a-col>
            <a-col :md="7" :sm="8">
              <a-input placeholder="请输入ip地址" v-model="queryParam.loginIp"></a-input>
            </a-col>
            <a-col :md="5" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              </span>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="2" :sm="8" style="text-align: center">登录日期</a-col>
            <a-col :md="8" :sm="8" title>
              <a-date-picker
                placeholder
                :disabledDate="disabledStartDate"
                format="YYYY-MM-DD"
                v-model="queryParam.logintime_start"
                @openChange="handleStartOpenChange"
              ></a-date-picker>
            </a-col>
            <a-col :md="2" :sm="8" style="text-align: center">至</a-col>
            <a-col :md="7" :sm="8">
              <a-date-picker
                placeholder
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD"
                v-model="queryParam.logintime_end"
                :open="endOpen"
                @openChange="handleEndOpenChange"
              ></a-date-picker>
            </a-col>

            <a-col :md="5" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                >重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div>
        <a-layout-content>
          <!-- table区域-begin -->
          <div class="table-operator">
            <a-button type="primary" icon="bar-chart" @click="viewLoginDetail()">人数统计</a-button>
            <a-button type="primary" icon="logout" >强制下线</a-button>
          </div>
          <div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;margin-top:15px;">
              <i class="anticon anticon-info-circle ant-alert-icon"></i>
              <span>已选择</span>
              <a style="font-weight: 600">
                {{ selectedRowKeys.length }}
              </a>
              <span>项</span>
              <a style="margin-left: 24px" @click="onClearSelected">清空</a>
            </div>
            <a-table
              bordered
              ref="table"
              size="middle"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              @change="handleTableChange"
              :visible="listVisible"
            >
              <!--插槽-->
              <span slot="action" slot-scope="text, record">
                <a @click="chose(record)">选择</a>
              </span>
            </a-table>
          </div>
        </a-layout-content>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import JSelectDepart from '@/components/cmpbiz/JSelectDepart'
import { getAction, putAction } from '@/api/manage'
import { filterObj } from '@/utils/util';

export default {
  name: 'ShowLoginModal',
  mixins: [CmpListMixin],
  components: {
    JSelectUserNew,
    JSelectDepart
  },
  props: {
    visible: false
  },
  data() {
    return {
      form: this.$form.createForm(this),
      confirmLoading: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      listVisible: true,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '登录人',
          align: 'center',
          dataIndex: 'loginUname'
        },
        {
          title: '登录时间',
          align: 'center',
          dataIndex: 'loginTime'
        },
        {
          title: '离开时间',
          align: 'center',
          dataIndex: 'logoutTime'
        },
        {
          title: 'ip地址',
          align: 'center',
          dataIndex: 'loginIp'
        }
      ],
      url: {
        list: '/websocket/logininfo/list'
      },
      //选人组件
      model: {},
      prjManagerName: '',
      prjManagerFullname: '',
      selectUser: ['auditUsers1'],
      auditUsers1: {
        colum: 'auditUsers1',
        value: [],
        target: [{ to: 'loginUname', from: 'username' }, { to: 'loginUname2', from: 'realname' }]
      }
    }
  },
  create() {
    // 初始化Form表单
    this.form.resetFields()
  },

  methods: {
    searchReset() {
      this.queryParam.loginUname = ''
      this.queryParam.loginUname2 = ''
      this.queryParam.loginIp = ''
      this.queryParam.logintime_start = ''
      this.queryParam.logintime_end = ''
      this.queryParam.startValue = null
      this.queryParam.endValue = null
      this.queryParam.logoutTime = ''
      this.searchQuery()
    },
    handleCancel() {
      this.$emit('cancel') //触发组件的cancel方法
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)

      // 时间格式化
      param.minStartTime = param.startTime ? moment(param.logintime_start).format('YYYY-MM-DD') : null
      param.maxStartTime = param.endTime ? moment(param.logintime_end).format('YYYY-MM-DD') : null
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    // 时间选择器的禁用封装(保证开始时间小于结束时间)
    disabledStartDate(startValue) {
      const endValue = this.queryParam.logintime_end
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.queryParam.logintime_start
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
    chose(record) {
      this.$emit('select', record)
    },
    viewLoginDetail() {
      //this.listVisible= false;
      getAction('/websocket/logininfo/onlineNum', '').then(res => {
        this.$notification.open({
          message: <b>在线人数统计</b>,
          description: '在线人数为：' + res + '人',
          icon: <a-icon type="fire" style="color: red" />,
          duration: 2 //默认4.5s，取消自动关闭只要将该值设为 0 即可。
        })
      })
    }
  }
}
</script>

<style scoped>
</style>