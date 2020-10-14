<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="6" :sm="6">
                <a-form-item label="设备名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input placeholder="请输入设备名称" v-model="queryParam.deviceName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="12">
                <a-form-item label="异常出现时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-row>
                    <a-col :md="11" :sm="11">
                      <a-date-picker
                        placeholder="请选择开始时间"
                        :disabledDate="disabledStartDate"
                        format="YYYY-MM-DD"
                        v-model="startValue"
                        @openChange="handleStartOpenChange"
                      ></a-date-picker>
                    </a-col>
                    <a-col :md="2" :sm="2" style="text-align: center">至</a-col>
                    <a-col :md="11" :sm="11">
                      <a-date-picker
                        placeholder="请选择结束时间"
                        :disabledDate="disabledEndDate"
                        format="YYYY-MM-DD"
                        v-model="endValue"
                        :open="endOpen"
                        @openChange="handleEndOpenChange"
                      ></a-date-picker>
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="6">
                <a-form-item label="当前状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select
                    style="width: 220px"
                    v-model="queryParam.status"
                    placeholder="请选择当前状态"
                    allowClear
                  >
                    <a-icon slot="suffixIcon" type="caret-down" />
                    <a-select-option value>全部</a-select-option>
                    <a-select-option value="2">已告警</a-select-option>
                    <a-select-option value="1">异常监测</a-select-option>
                    <a-select-option value="0">已解除</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :md="6" :sm="6">
            <div class="search-buttons-content">
              <span class="table-page-search-submitButtons serachLeft">
                <a-button type="primary" @click="mySearchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
              </span>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-layout>
      <!--项目树-->
      <projectTree ref="projectTree" @getSelectMessage="getSelectMessage" @defaultFocus="initTable"></projectTree>
      <a-layout-content>
        <!-- table区域-begin -->
        <div>
          <!-- <div class="ant-alert ant-alert-info" style="border: none;margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
            <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div> -->
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <!-- 字符串超长截取省略号显示-->
            <!-- <span slot="productId" slot-scope="text">
          <j-ellipsis :value="text" :length="25" />
            </span>-->
            <span slot="action" slot-scope="text, record">
              <a @click="routerPush(record,'/iot/alert/AbnormalHistoryDetail')">查看</a>
              <!-- <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item><a @click="handleEdit(record)">编辑</a></a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
              </a-dropdown>-->
            </span>
            <!-- 状态渲染模板 -->
            <template slot="customRenderStatus" slot-scope="status">
              <a-tag v-if="status==0" color="green">已解除</a-tag>
              <a-tag v-if="status==1" color="orange">异常监测</a-tag>
              <a-tag v-if="status==2" color="red">已告警</a-tag>
            </template>
          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { getAction } from '@/api/manage'
import projectTree from '../ProjectTree'
import { ProjectTreeMixin } from '../js/ProjectTreeMixin'

export default {
  name: 'AbnormalHistory',
  mixins: [myCmpListMixin, ProjectTreeMixin],
  components: {
    projectTree
  },
  data () {
    return {
      // 表头
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
          title: '设备名称',
          align: 'left',
          dataIndex: 'deviceName',
          sorter: true
        },
        {
          title: '设备参数',
          align: 'left',
          dataIndex: 'parameterName',
          sorter: true
        },
        {
          title: '异常出现时间',
          align: 'left',
          width: 200,
          dataIndex: 'abnormalTime',
          sorter: true
        },
        {
          title: '异常解除时间',
          align: 'left',
          width: 200,
          dataIndex: 'resolveTime',
          sorter: true
        },
        {
          title: '当前状态',
          align: 'left',
          width: 160,
          dataIndex: 'status',
          scopedSlots: { customRender: 'customRenderStatus' },
          filterMultiple: false,
          filters: [
            { text: '已解除', value: '0' },
            { text: '异常监测', value: '1' },
            { text: '已告警', value: '2' }
          ],
          onFilter: (value, record) => {
            if (record.status == value) {
              return record
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/alert/abnormalHistory/listByUserPrj',
        getPrjListByUser: '/project/sysProject/prjListByUser',
        getDeviceInfo: ''
      },
      deviceDict: [],
      projectList: [],
      // 查询条件
      queryParam: {},
      // 控制日历控件区间搜索
      startValue: null,
      endValue: null,
      endOpen: false,
      // 输入框布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      }
    }
  },
  computed: {},
  mounted () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    this.dataServiceUrl = this.projectMsg.dataServiceUrl
    this.url.list = this.dataServiceUrl + this.url.list
    this.queryParam.realDb = this.realDb = this.projectMsg.realDb
    this.judgeCorpOrPrjThenLoadData()
    // new Promise(this.loadProjectData).then((result) => {
    //   this.$refs.myDeviceTree.loadProjectTreeData(this.projectList)
    // })
  },
  methods: {
    // 获取项目数据
    loadProjectData (resolve, reject) {
      if (!this.url.getPrjListByUser) {
        this.$message.error('请设置url.getPrjListByUser属性!')
        return
      }
      const params = null
      const that = this
      getAction(this.url.getPrjListByUser, params).then((res) => {
        if (res.success) {
          that.projectList = res.result
          that.prjCodes = ''
          that.prjCodes += res.result.map(function (item) {
            return item.prjCode
          })
          that.nodeKey = that.prjCodes
          resolve(res.success)
        } else {
          reject(res.message)
          that.$message.error('获取项目数据失败!')
        }
      })
    },

    // 日历控件绑定方法
    disabledStartDate (startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    // 带参跳转
    routerPush (record, url) {
      // debugger
      console.log('查看record', record)
      this.$router.push({
        path: url,
        query: {
          record: JSON.stringify(record)
        }
      })
    },
    // 重写查询重置方法
    mySearchQuery () {
      if (this.startValue !== null) {
        this.queryParam.minStartTime = this.startValue.format('YYYY-MM-DD') + ' 00:00:00'
      }
      if (this.endValue !== null) {
        this.queryParam.maxStartTime = this.endValue.format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.searchQuery()
    },
    mySearchReset () {
      this.queryParam = {}
      this.queryParam.realDb = this.projectMsg.realDb
      this.queryParam.prjCodes = this.projectMsg.prjCode
      this.clickReset = !this.clickReset
      this.startValue = null
      this.endValue = null
      this.loadData(1)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@views/iot/css/iotCommon.less';
/deep/.ant-card-body {
  padding: 16px 16px;
}
</style>
