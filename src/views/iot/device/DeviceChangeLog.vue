<!--设备日志页面 设备详情-日志-->
<template>
  <div>
    <!-- table区域-begin -->
    <div>
      <a-table
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="ipagination"
        @change="handleTableChange"
      ></a-table>
    </div>
  </div>
</template>

<script>
import { getAction } from '../../../api/manage'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { queryProjectByPrjCode } from '@/api/api'

export default {
  name: 'DeviceChangeLog',
  mixins: [myCmpListMixin],
  // props: ['deviceId',prjCode],
  props: ['deviceData'],
  data () {
    return {
      dataSource: [],
      loading: false,
      tableKey: 'table',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 80,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '修改内容',
          align: 'center',
          dataIndex: 'logContent'
        },
        {
          title: '修改人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '修改时间',
          align: 'center',
          // sorter: true,
          dataIndex: 'createTime'
        }
      ],
      url: {
        list: '/log/deviceLog/queryByObjectId'
      }
    }
  },
  created () {
    // 获取项目地址
    let that = this
    queryProjectByPrjCode({ prjCode: that.deviceData.prjCode }).then(res => {
      let urlPrefix = res.result.dataServiceUrl
      that.url.list = urlPrefix + that.url.list
      that.queryParam.id = that.deviceData.id
      // 获取设备数据
      // this.getDeviceChangeLog()
      that.loadData()
    })
  },
  methods: {
    // 获取采集点信息
    getDeviceChangeLog () {
      console.log('获取设备变动日志,查看设备详细信息=>', this.deviceData)
      let that = this
      that.loading = true
      let actionUrl = that.url.list
      console.log('actionUrl=>', actionUrl)
      let params = {
        id: that.deviceData.id
      }
      getAction(actionUrl, params)
        .then(res => {
          if (res.success) {
            console.log('=====================', '获取数据成功', '=====================')
            console.log('=====================', res.result, '=====================')
            that.dataSource = res.result
            console.log('that.dataSource')
            console.log(that.dataSource)
          } else {
            console.log('获取数据失败')
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          that.loading = false
        })
    }
  },
  mounted () {
    // this.timer = setInterval(this.getDeviceChangeLog, 20000)
    this.timer = setInterval(this.loadData, 20000)
  }
}
</script>

<style scoped>
.styleWrap {
  resize: none;
  height: 32px;
  font-size: 15px;
}

.table-container {
  padding: 20px 20px;
}
</style>
