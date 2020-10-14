<!--点码表 点码选择窗口 -->
<template>
  <a-modal title="选择采集点" v-model="visible" @ok="handleOk" :width="840">
    <a-input-search
      placeholder="输入采集点ID搜索"
      style="width: 30%; margin:0 20px 5px 10px;"
      @search="searchQueryByID"
    />
    <a-input-search
      placeholder="输入采集点名称搜索"
      style="width: 30%; margin-bottom: 5px;"
      @search="searchQueryByName"
    />
    <a-table
      bordered
      row-key="collectId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
      :customRow="rowClick"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type:'radio'}"
    ></a-table>
  </a-modal>
</template>

<script>
import { postAction } from '../../../../api/manage'
import { myCmpListMixin } from '../../../../mixins/myCmpListMixin'
import { queryProjectByPrjCode } from '@/api/api'
import Vue from 'vue'

export default {
  name: 'PointCodeSelectModal',
  mixins: [myCmpListMixin],
  props: {
    prjCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      columns: [
        {
          title: '采集点ID',
          dataIndex: 'collectId',
          key: 'collectId',
          align: 'center'
        },
        {
          title: '采集点名称',
          dataIndex: 'myName',
          key: 'myName',
          align: 'center'
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          key: 'deviceName',
          align: 'center'
        }
      ],
      dataSource: [],
      url: {
        list: '/data/deviceData/list'
      },
      queryParam: {
        // 请求参数
        collectId: '',
        myName: ''
      },
      projectMsg: {} // 项目信息
    }
  },
  created () {
    // queryProjectByPrjCode({ prjCode: this.prjCode }).then(res => {
    //   if (res.success) {
    //     this.projectMsg.dataServiceUrl = res.result.dataServiceUrl
    //     this.projectMsg.realDb = res.result.realDb
    //     this.projectMsg.prjCode = res.result.prjCode
    //     this.url.list = this.projectMsg.dataServiceUrl + '/data/deviceData/list'
    //     this.getPointCodeList()
    //   } else {
    //     this.$message.error('获取项目信息失败！')
    //     console.log('res.result =>', res.result)
    //   }
    // })

    // if(localStorage.getItem('lastPageNo')) {
    //   this.ipagination.current = localStorage.getItem('lastPageNo')
    // }
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    this.url.list = this.projectMsg.dataServiceUrl + '/data/deviceData/list'
    // this.getPointCodeList()
  },
  activated () {
    // this.getPointCodeList()
  },
  methods: {
    show () {
      this.visible = true
      this.getPointCodeList()
    },
    handleOk () {
      // console.log('hand param', this.dataSource[this.getCheckDataIndex()])
      this.$emit('ok', this.dataSource[this.getCheckDataIndex()])
      // this.$emit('setPointCode', this.dataSource[this.selectedRowKeys])
      localStorage.setItem('lastPageNo', this.ipagination.current)
      this.visible = false
    },
    searchQueryByID (arg) {
      this.queryParam.collectId = arg
      this.ipagination.current = 1
      this.getPointCodeList()
    },
    searchQueryByName (arg) {
      this.queryParam.myName = arg
      this.ipagination.current = 1
      this.getPointCodeList()
    },
    // 获取点码列表
    getPointCodeList () {
      const params = {
        collectId: this.queryParam.collectId,
        myName: this.queryParam.myName,
        realTimeDb: this.projectMsg.realDb,
        prjCode: this.projectMsg.prjCode,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize
      }
      // console.log('获取点码表参数==>', params)
      const that = this
      postAction(this.url.list, params).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
          // console.log('点码表页面==>', that.dataSource)
          that.ipagination.total = res.result.total
        } else {
          that.$message.error(res.message)
          // console.log(res)
        }
      })
    },
    handleTableChange (pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.getPointCodeList()
    },
    // 点击行选中
    rowClick (record, index) {
      return {
        on: {
          click: () => {
            const keys = []
            keys.push(record.collectId)
            this.selectedRowKeys = keys
          }
        }
      }
    },
    // 根据选中的行collectId 查询DataSource的index
    getCheckDataIndex () {
      if (this.selectedRowKeys.length > 0) {
        let tempKey = this.selectedRowKeys[0]
        let tempIndex = 0
        for (tempIndex; tempIndex < this.dataSource.length; tempIndex++) {
          if (this.dataSource[tempIndex].collectId === tempKey) {
            return tempIndex
          }
        }
      } else {
        this.$message.warning('未选择采集点')
      }
    }
  }
}
</script>

<style scoped>
.ant-table-tbody > tr > td {
  padding: 10px 10px;
  word-break: break-word;
}
</style>
