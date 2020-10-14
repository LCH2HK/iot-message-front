<!--设备批次管理页面-->
<template>
  <a-card class="device-batch-card" :bordered="false">
    <div class="table-page-search-wrapper" id="searchapp">
      <a-form layout="inline">
        <a-row :gutter="24">
          <!-- <a-col :md="5" :sm="8">
            <a-form-item label="设备名称">
              <j-input-lk
                :placeholder="'请输入设备名称'"
                @enterSearch="enterSearch($event,'deviceName')"
                @inputValueLk="inputValueLk($event,'deviceName')"
                :reset="clickReset"
              ></j-input-lk>
            </a-form-item>
          </a-col> -->

          <a-col :md="5" :sm="8">
            <a-form-item label="批次编号">
              <j-input-lk
                :placeholder="'请输入批次编号'"
                @enterSearch="enterSearch($event,'batchCode')"
                @inputValueLk="inputValueLk($event,'batchCode')"
                :reset="clickReset"
              ></j-input-lk>
            </a-form-item>
          </a-col>

<!--          <a-col :md="4" :sm="8">-->
<!--            <span class="table-page-search-submitButtons serachReft">-->
<!--              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
<!--              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>-->
<!--            </span>-->
<!--          </a-col>-->
        </a-row>
        <div class="search-buttons-content">
              <span style="float: right;overflow: hidden;padding-right: 10px;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                >重置</a-button>
              </span>
        </div>
      </a-form>
    </div>
    <a-layout>
      <a-layout-content>
        <!-- table区域-begin -->
        <div>
          <a-table
            bordered
            ref="table"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="batchInfo"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
            :customHeaderRow="customHeaderRow"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleDownload(record.batchCode)">下载设备证书</a>
              <a-divider type="vertical" />
              <a @click="handleView(record,'批次详情')">查看</a>
              <a-divider type="vertical"  />
              <a @click="handleBatchDel(record)">全部删除</a>
            </span>
            <span slot="light_deviceState" slot-scope="text">
              <div class="light-device-state" :class="deviceStateClasses[text.deviceState]"></div>
            </span>
            <span class="my-switch-span" slot="deviceState" slot-scope="text, record">
              <a-switch
                :checked="text.deviceState === '1' ? true : false"
                @change="changeDeviceState(record)"
              />
            </span>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <device-batch-drawer ref="modalForm" @ok="modalFormOk"></device-batch-drawer>
  </a-card>
</template>

<script>

import DeviceBatchDrawer from './modules/DeviceBatchDrawer'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { getAction, deleteAction, downFile } from '@/api/manage'
import JInputLk from '@/components/cmp/JInputLk.vue'

export default {
  name: 'DeviceList',
  mixins: [myCmpListMixin],
  props: ['prjCodes'],
  components: {
    DeviceBatchDrawer,
    JInputLk
  },
  data () {
    return {
      batchInfo: [],
      isorter: {
        column: 'batchCode',
        order: 'desc'
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => {
            return this.getIndexOfPage(index)
          }
        },
        {
          title: '批次编号',
          align: 'left',
          sorter: true,
          width: 200,
          dataIndex: 'batchCode'
        },
        {
          title: '设备所属产品',
          align: 'left',
          // sorter: true,
          width: 200,
          dataIndex: 'productName'
        },
        {
          title: '设备数量',
          align: 'left',
          // sorter: true,
          width: 150,
          dataIndex: 'deviceCount'
        },
        {
          title: '激活状态',
          align: 'left',
          dataIndex: 'activated_status',
          width: 200,
          // sorter: true,
          customRender: text => {
            // 字典值替换通用方法
            return this.filterDictText(this.activatedStatusDictOptions, text)
          }
        },
        {
          title: '创建时间',
          align: 'left',
          width: 200,
          // sorter: true,
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 400,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      url: {
        list: '/device/device/listBySelectTreeNode',
        deleteBatch: '/device/device/deleteByBatchCode',
        exportXlsUrl: 'device/device/deviceKeyAddBatchXls',
        // productName: '/product/product/productNames',
        // getMqttProduct: '/product/product/mqttProductNames',
        // deviceList: 'device/device/deviceList',
        // changeState: '/device/device/changeState',
        // getTagList: '/tags/tags/getTagList',
        // getPrjListByUser: '/project/sysProject/prjListByUser',
        getBatchInfo: '/device/deviceBatch/batchInfo'
      },
      dataSource: []
    }
  },
  beforeCreate () {},
  created () {
    console.log('设备批量管理：batchInfo==>', this.batchInfo)
    this.initActivatedStatus()
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
  },
  activated () {},
  mounted () {
    this.loadData()
  },
  methods: {
    // 进行查询得到数据源并进行分页
    loadData (arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // let currentPage = this.ipagination.current;
      let totalItem = this.ipagination.total
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      // 若传入参数为-1，则加载上一页的内容  解决删除一页最后一条数据时数据不显示的bug
      if (arg === -1 && (totalItem % 10 === 1) && this.ipagination.current === parseInt(totalItem / 10 + 1)) {
        this.ipagination.current--
      }

      var params = this.getQueryParams()// 查询条件
      params.prjCodes = this.prjCodes
      this.loading = true
      console.log('查询条件：', params)
      let that = this
      getAction(that.url.getBatchInfo, params).then(res => {
        if (res.success) {
          that.batchInfo = this.filterBatchInfo(res.result)
          // that.doPageData()
          console.log('getAction()=>', that.batchInfo)
          this.ipagination.total = res.result.batchList.total
        } else {
          console.log('getBatchInfo()调用失败')
        }
        this.loading = false
      })
    },
    // 对数据进行过滤 整理格式
    filterBatchInfo (result) {
      let batchList = result.batchList.records
      console.log('filterBatchInfo()=>', batchList)
      for (let i = 0; i < batchList.length; i++) {
        let tempCode = batchList[i].batchCode
        console.log('filterBatchInfo()=>', result[tempCode].createTime)
        batchList[i].createTime = result[tempCode].createTime
        batchList[i].activated_status = result[tempCode].activated_status
        batchList[i].deviceCount = result[tempCode].deviceCount
        batchList[i].productName = result[tempCode].productName
      }
      console.log('filterBatchInfo()=>', batchList)
      return batchList
    },
    // // 对数据源进行分页   已废弃
    // doPageData () {
    //   let origin_dataSource = this.batchInfo
    //   let params = this.getQueryParams() // 查询条件
    //   console.log('查询条件：', params)
    //   let productName = params.productName
    //   let deviceName = params.deviceName
    //   if (productName != null && productName != '') {
    //     productName = productName.substring(1, productName.length - 1)
    //     console.log('查询条件:productName=>', productName)
    //     origin_dataSource = origin_dataSource.filter(item => {
    //       return item.productName.indexOf(productName) != -1
    //     })
    //   }
    //   if (deviceName != null && deviceName != '') {
    //     deviceName = deviceName.substring(1, deviceName.length - 1)
    //     console.log('查询条件:deviceName=>', deviceName)
    //     origin_dataSource = origin_dataSource.filter(item => {
    //       return item.deviceName.indexOf(deviceName) != -1
    //     })
    //   }
    //   this.ipagination.total = origin_dataSource.length
    //   let currentPage = this.ipagination.current
    //   // let currentPage = 1
    //   let pageSize = this.ipagination.pageSize
    //   let startIndex = (currentPage - 1) * pageSize
    //   let endIndex = currentPage * pageSize
    //   origin_dataSource = origin_dataSource.slice(startIndex, endIndex)
    //   console.log('this.origin_dataSource', origin_dataSource)
    //   console.log('this.batchInfo', this.batchInfo)
    //   this.dataSource = origin_dataSource
    // },
    handleView: function (record, title) {
      this.$refs.modalForm.title = title
      console.log('handleView:record=>', record)
      this.$refs.modalForm.edit(record)
    },
    handleDownload (batchCode) {
      this.queryParam.batchCode = batchCode
      let param = { ...this.queryParam }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param.selections = this.selectedRowKeys.join(',')
      }
      downFile(this.url.exportXlsUrl, param).then(data => {
        console.log('downFile():data=>', data)
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), '设备信息表-批次：' + this.ModalBatCode + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '设备信息表-批次：' + batchCode + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
    handleBatchDel: function (record) {
      console.log('全部删除按钮：record==>', record)
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      let that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.deleteBatch, { batchCode: record.batchCode }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.$emit('handleBatchDel')
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    modalFormOk () {
      this.loadData()
    },
    searchQuery () {
      console.log('查询按钮被点击')
      this.loadData(1)
    },
    searchReset () {
      this.queryParam = {}
      this.clickReset = !this.clickReset
      this.loadData(1)
    },
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      let that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, {
            id: id
          }).then(res => {
            if (res.success) {
              that.$message.success('删除成功')
              that.loadData(-1)
              that.loadDeviceState()
            } else {
              that.$message.error('操作失败')
            }
          })
        }
      })
    },
    // 控制表头居中
    customHeaderRow (record) {
      // record.forEach(item => {
      //   item.align = 'center'
      // })
    },
    // 带参跳转
    routerPush (record, url, type) {
      console.log('查看record', record)
      this.$router.push({
        path: url,
        query: {
          recordId: record.id,
          type: type
        }
      })
    },
    initActivatedStatus () {
      this.activatedStatusDictOptions = [
        { text: '全部激活', title: '全部激活', value: '1' },
        { text: '部分激活', title: '部分激活', value: '0' },
        { text: '未激活', title: '未激活', value: '-1' }
      ]
      console.log('this.activatedStatusDictOptions=>', this.activatedStatusDictOptions)
    },
    filterDictText (dictOptions, text) {
      let re = ''
      dictOptions.forEach(function (option) {
        if (text == option.value) {
          re = option.text
        }
      })
      return re
    }
  }
}
</script>
<style lang="less" scoped>
.my-switch-span /deep/ .ant-switch-checked {
  background-color: rgb(13, 206, 55);
}

.device-title {
  width: 74px;
  height: 19px;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 20px;
}

.device-row {
  margin-top: 15px;
}

.device-count {
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 50%;
}

.device-count-num {
  margin-top: 31px;
  margin-left: 68%;
  width: 21px;
  height: 28px;
  font-size: 36px;
  font-family: Microsoft YaHei UI;
  font-weight: 400;
  line-height: 48px;
}

.device-count-num-all {
  color: rgba(4, 147, 243, 1);
}

.device-count-num-online {
  color: rgba(31, 190, 15, 1);
}

.device-count-num-offline {
  color: rgba(255, 171, 10, 1);
}

.device-count-num-inactivated {
  color: rgba(153, 153, 153, 1);
}

.device-state {
  width: 19%;
  height: 120px;
}

.device-state:not(:nth-child(5n)) {
  margin-right: calc(5% / 4);
}

.device-all {
  background: url(../img/all_device_img.png) no-repeat;
  background-position: center center;
  background-size: cover;
}

.device-online {
  background: url(../img/online_img.png) no-repeat;
  background-position: center center;
  background-size: cover;
}

.device-offline {
  background: url(../img/device_offline_img.png) no-repeat;
  background-position: center center;
  background-size: cover;
}

.device-inactived {
  background: url(../img/not_active_img.png) no-repeat;
  background-position: center center;
  background-size: cover;
}

.device-abnormal {
  background: url(../img/device_abnormal_img.png) no-repeat;
  background-position: center center;
  background-size: cover;
}

.device-content {
  margin-left: 68%;
  margin-top: 16px;
}

.light-device-state {
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 50%;
}
.search-buttons-content {
  position: absolute;
  top: 2px;
  right: -4px;
}
/*/deep/.device-batch-card{*/
/*  padding: 0px 0px;*/
/*}*/
/deep/.ant-card-body{
  padding: 0px 0px;
}

div.ant-layout-content{
  margin-top: 12px;
}

.ant-form-item-label{
  margin-left: 0px;
}

@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>
