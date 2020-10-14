<!--批次管理设备的右侧抽屉页面 -->
<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-layout-content>
      <div>
        <div class="header-msg">产品名称：{{productName}}</div>
        <div class="header-msg">添加时间：{{createTime}}</div>
        <div class="header-msg">添加数量：{{deviceCount}}</div>
        <div>
          <a-button  class="right-button" icon="download" @click="handleDownload(batchCode)">下载设备证书</a-button>
        </div>
        <!--      <a-button @click="handleDownload(batchCode)" type="primary" icon="plus">下载设备证书</a-button>-->
      </div>
      <div
        :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}"
      >
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
        >
        <span slot="action" slot-scope="text, record">
          <a @click="routerPush(record,'/iot/device/DeviceDetails','查看')">查看</a>
          <a-divider type="vertical" :class="record.deviceState !== '1'? 'showVertical' : 'unshowVertical'"/>
          <a @click="batchAbandone(record.id)" :disabled="record.deviceState === '1'">删除</a>
        </span>
          <span slot="deviceState" slot-scope="text, record">
          <img :src="getDeviceStateImg(text)"/>
        </span>
        </a-table>
      </div>
    </a-layout-content>
  </a-drawer>
</template>

<script>
import { getAction, downFile, deleteAction } from '@/api/manage'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'

import { myCmpListMixin } from '@/mixins/myCmpListMixin'

export default {
  name: 'DeviceBatchDrawer',
  mixins: [myCmpListMixin],
  components: {},
  data () {
    return {
      productName: '',
      batchCode: '',
      deviceCount: 0,
      createTime: '',
      dataSource: [],
      drawerWidth: 900,
      title: '操作',
      visible: false,
      queryParam: {},
      show: true, // 根据菜单类型，动态显示隐藏表单元素
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      columns: [
        {
          title: '设备编号',
          align: 'left',
          sorter: true,
          dataIndex: 'deviceKey'
        },
        {
          title: '设备名称',
          align: 'left',
          sorter: true,
          dataIndex: 'deviceName'
        },
        {
          title: '设备状态',
          align: 'left',
          dataIndex: 'deviceState',
          width: 120,
          sorter: true,
          scopedSlots: {
            customRender: 'deviceState'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 160,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      confirmLoading: false,
      url: {
        exportXlsUrl: 'device/device/deviceKeyAddBatchXls',
        delete: '/device/device/delete',
        list: '/device/device/getDeviceListByBatchCode'
      }
    }
  },
  created () {
    initDictOptions('iot_device_state').then(res => {
      if (res.success) {
        this.deviceStateDictOptions = res.result
      }
    })
  },
  methods: {
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
      if (arg === -1 && totalItem % 10 === 1 && this.ipagination.current === parseInt(totalItem / 10 + 1)) {
        this.ipagination.current--
      }
      this.queryParam.batchCode = this.batchCode
      let params = this.getQueryParams() // 查询条件
      console.log('调用loadData,params:', params)
      console.log('this.url.list:', this.url.list)
      this.loading = true
      getAction(this.url.list, params).then(res => {
        console.log('res==>', res)
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        } else {
          this.$message.error('查询数据失败!')
          console.error(res)
        }
        this.loading = false
        this.selectedRowKeys = []
      })
    },
    add () {
      // 默认值
      this.edit({ status: '1', permsType: '1', route: true })
    },
    edit (record) {
      this.productName = record.productName
      this.deviceCount = record.deviceCount
      this.createTime = record.createTime
      // this.dataSource = record.deviceInfos
      this.batchCode = record.batchCode
      this.loadData()
      console.log('抽屉窗口：batchCode=>', this.batchCode)
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.visible = true
    },
    handleDownload (batchCode) {
      // console.log('handleDownload:batchCode==>',batchCode)
      // this.queryParam.batchCode = batchCode
      let param = { batchCode: batchCode }
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
          window.navigator.msSaveBlob(new Blob([data]), '设备信息表-批次：' + batchCode + '.xls')
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
              that.queryParam.batchCode = that.batchCode
              that.$emit('ok')
              that.loadData()
              that.deviceCount--;
            } else {
              that.$message.error('操作失败')
            }
          })
        }
      })
    },
    close () {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleOk () {
      this.$emit('ok')
      this.close()
    },
    handleCancel () {
      this.close()
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
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize () {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    // 获取设备状态 字典翻译
    getDeviceStateImg (text) {
      console.log('img-src =>', '@views/iot/img/device/state_' + text + '.png')
      return require('@views/iot/img/device/state_' + text + '.png')
    }
  }
}
</script>

<style scoped>
  .right-button {
    display: block;
    margin-left: auto;
    margin-bottom: 10px;
    height: 36px;
  }

  .header-msg {
    font-size: 14px;
    font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 32px;
  }

  .showVertical {
    background: rgba(53, 101, 247, 1);
  }

  .unshowVertical {
    background: rgba(53, 101, 247, 0);
  }
</style>
