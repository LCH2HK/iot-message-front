<template>
  <a-card :bordered="false">
    <div class="device-under-part-content">
      <DeviceTree class="device-tree-content" ref="myDeviceTree" @getSelectMessage="getSelectMessage"
                  @defaultFocus="initTable"></DeviceTree>
      <a-layout>
        <a-layout-content>
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :md="18" :sm="18">
                  <a-row :gutter="24">
                    <a-col :md="8" :sm="8">
                      <a-form-item label="设备名称">
                        <j-input-lk
                          :placeholder="'请输入设备名称'"
                          @enterSearch="enterSearch($event,'deviceName')"
                          @inputValueLk="inputValueLk($event,'deviceName')"
                          :reset="clickReset"
                        ></j-input-lk>
                      </a-form-item>
                    </a-col>
                    <a-col :md="8" :sm="8">
                      <a-form-item label="告警信息">
                        <j-input-lk
                          :placeholder="'请输入告警信息'"
                          @enterSearch="enterSearch($event,'errMsg')"
                          @inputValueLk="inputValueLk($event,'errMsg')"
                          :reset="clickReset"
                        ></j-input-lk>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :md="6" :sm="24">
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
          <!-- 操作按钮区域 -->
          <div class="table-operator" v-if="false">
            <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
            <a-button
              @click="batchEdit"
              type="primary"
              icon="edit"
              :disabled="this.selectedRowKeys.length == 0"
            >编辑
            </a-button>
            <a-button
              @click="batchDel1"
              type="primary"
              icon="delete"
              :disabled="this.selectedRowKeys.length == 0"
            >删除
            </a-button>
          </div>

          <!-- table区域-begin -->
          <div>
            <a-table
              bordered
              ref="table"
              size="middle"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="ipagination"
              :loading="loading"
              :customHeaderRow="customHeaderRow"
              @change="handleTableChange"
            >
              <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record,'查看')">查看</a>
              </span>
            </a-table>
          </div>
        </a-layout-content>
      </a-layout>
      <!-- table区域-end -->

      <!-- 表单区域 -->
      <iotMqttErrLog-modal ref="modalForm" @ok="modalFormOk" :errNoDictOptions="errNoDictOptions"></iotMqttErrLog-modal>
    </div>
  </a-card>
</template>

<script>
import IotMqttErrLogModal from './modules/IotMqttErrLogModal'
import DeviceTree from '@/views/iot/DeviceTree'
import { DataDisplayMixin } from '@/views/iot/data/DataDisplayMixin'
import Vue from 'vue'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { IotPrjTreeMixin } from '@/views/iot/js/IotPrjTreeMixin'
import { deleteAction, getAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk.vue'
import { filterDictText, initErrNoDictOptions } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'IotMqttErrLogList',
  mixins: [myCmpListMixin, IotPrjTreeMixin, DataDisplayMixin],
  components: {
    IotMqttErrLogModal,
    JLeftTree,
    JInputLk,
    DeviceTree
  },
  data () {
    return {
      description: '支持MQTT协议的机器上报告警日志管理页面',
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
          dataIndex: 'deviceName'
        },
        {
          title: '告警信息',
          align: 'left',
          dataIndex: 'errNo',
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.errNoDictOptions, text)
          }
        },
        {
          title: '录入人',
          align: 'left',
          width: 160,
          dataIndex: 'createBy'
        },
        {
          title: '录入时间',
          align: 'left',
          width: 200,
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/iotMqttErrLog/iotMqttErrLog/listByPrjCode',
        delete: '/iotMqttErrLog/iotMqttErrLog/delete',
        deleteBatch: '/iotMqttErrLog/iotMqttErrLog/deleteBatch',
        getPrjListByUser: '/project/sysProject/prjListByUser',
        getAllDeviceByGroupId: '/device/device/getAllDeviceByGroupId',
        getAllDeviceByProductId: '/device/device/getAllDeviceByProductId',
        getProductById: '/product/product/queryById',
        getDeviceNumberByPrjList: '/device/device/getDeviceNumberByPrjList'
      },
      errNoDictOptions: [],
      collapsed: false,
      isPublished: false,
      flag: true,
      prjCodes: '',
      projects: [],
      unpaged_datasource: [],
      prjMaps: [], // 属性是prjCode，值是通讯管理机数组的数组

      // 以下数据用于设备树
      projectList: [],
      deviceNumberList: [],
      prjCode: '', // 项目级
      prjCodes: '', // 企业级
      nodeKey: '',
      nodeLevel: '',
      prjIndex: '',
      nodePos: '',
      dataReflashTimer: '',
      productId: '',
      deviceIds: [],
      dataServiceUrl: ''
    }
  },
  computed: {},
  beforeCreate () {

  },
  created () {
  },
  mounted () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (this.projectMsg) {
      // 项目级
      this.dataServiceUrl = this.projectMsg.dataServiceUrl
      this.prjCode = this.projectMsg.prjCode
      this.$refs.myDeviceTree.loadProductNodeData(this.prjCode)
      let promise = this.getDeviceNumberList(this.prjCode)
      promise.then(() => {
        this.initTable()
      })
    } else {
      new Promise(this.loadProjectData)
        .then(() => {
          this.$refs.myDeviceTree.loadProjectTreeData(this.projectList)
          let promise = this.getDeviceNumberList(this.prjCodes)
          promise.then(() => {
            this.initTable()
          })
        })
        .catch(reason => {
          console.log('失败：' + reason)
        })
    }
    let params = {
      prjCode: this.projectMsg.prjCode
    }
    initErrNoDictOptions(params).then(res => {
      // console.log("initErrNoDictOptions res =>",res)
      this.errNoDictOptions = res
      // console.log("initErrNoDictOptions =>",this.errNoDictOptions)
    })
  },
  methods: {
    initTable () {
      this.unpaged_datasource = []
      this.prjMaps = []
      let that = this
      this.initPrjTree().then(() => {
        that.projects = that.treeData
        that.projects.forEach(prj => {
          let url_prefix = prj.dataServiceUrl
          let list_url = url_prefix + that.url.list
          console.log(list_url)
          let params = { prjCode: prj.prjCode }
          this.loading = true
          getAction(list_url, params).then(res => {
            if (res.success) {
              that.prjMaps.push({ id: prj.id, data: res.result })
              that.unpaged_datasource = that.unpaged_datasource.concat(res.result)
              that.loadPageData(that.unpaged_datasource)
            } else {
              this.$message.error('请求失败!')
            }
            this.loading = false
          })
        })
      })
    },

    // 获取项目数据,填充projectList和prjCodes
    loadProjectData (resolve, reject) {
      if (!this.url.getPrjListByUser) {
        this.$message.error('请设置url.getPrjListByUser属性!')
        return
      }
      let params = null
      let that = this
      this.loading = true
      getAction(this.url.getPrjListByUser, params).then(res => {
        if (res.success) {
          that.projectList = res.result
          that.prjCodes = ''
          that.prjCodes += res.result.map(function (item) {
            return item.prjCode
          })
          that.nodeKey = that.prjCodes
          console.log(that.nodeKey)
          resolve(res.success)
        } else {
          reject(res.message)
          this.$message.error('获取项目列表失败!')
        }
        this.loading = false
      })
    },

    getSelectMessage (data) {
      console.log('data=======>', data)
      this.ipagination.current = 1
      this.nodeKey = data.nodeKey
      this.nodeLevel = data.nodeLevel
      this.nodePos = data.nodePos
      if (this.projectMsg === null) {
        this.prjIndex = data.nodePos.split('-')[1]
        this.prjCode = this.projectList[this.prjIndex].prjCode
        this.dataServiceUrl = this.projectList[this.prjIndex].dataServiceUrl
      }
      if (this.nodeLevel > 1) {
        let posArr = this.nodePos.split('-')
        let productPos = posArr[0] + '-' + posArr[1] + '-' + posArr[2]
        this.productId = this.$refs.myDeviceTree.getNodeByPos(productPos).key

        this.getTableDataSource()
      } else {
        let prjCode = this.projectList[this.prjIndex].prjCode
        let selectedDS = this.unpaged_datasource.filter(item => {
          return item.prjCode == prjCode
        })
        this.loadPageData(selectedDS)
      }
      clearInterval(this.dataReflashTimer)
      // this.dataReflashTimer = setInterval(() => {
      //   this.reFlashTableDataSource()
      // }, 10000)
    },

    getTableDataSource () {
      let selectedDS = []
      if (this.nodeLevel == 4) {
        // 设备，nodeKey为设备id
        selectedDS = this.unpaged_datasource.filter(item => {
          return item.deviceId == this.nodeKey
        })
        this.loadPageData(selectedDS)
      } else if (this.nodeLevel == 3) {
        // 分组
        // 根据设备分组获取设备列表
        console.log('this.nodeLevel=>', this.nodeLevel, 'this.nodePos=>', this.nodePos)
        let groupPos = this.nodePos

        let groupId = this.$refs.myDeviceTree.getNodeByPos(groupPos).key
        let that = this
        this.loading = true
        getAction(this.url.getAllDeviceByGroupId, { deviceGroupId: groupId }).then(res => {
          that.deviceIds = []
          if (res.result.length > 0) {
            res.result.map(data => {
              that.deviceIds.push(data.id)
            })
          }
          console.log('DataDisplay:that.deviceIds=>', that.deviceIds)
          selectedDS = that.unpaged_datasource.filter(item => {
            let flag = false
            that.deviceIds.forEach(deviceId => {
              if (deviceId == item.deviceId) {
                flag = true
              }
            })
            return flag
          })
          this.loadPageData(selectedDS)
          this.loading = false
        })
      } else if (this.nodeLevel == 2) {
        // 产品级
        let that = this
        this.loading = true
        getAction(this.url.getAllDeviceByProductId, { productId: this.productId }).then(res => {
          that.deviceIds = []
          if (res.result.length > 0) {
            res.result.map(data => {
              that.deviceIds.push(data.id)
            })
          }
          console.log('DataDisplay:that.deviceIds=>', that.deviceIds)
          selectedDS = that.unpaged_datasource.filter(item => {
            let flag = false
            that.deviceIds.forEach(deviceId => {
              if (deviceId == item.deviceId) {
                flag = true
              }
            })
            return flag
          })
          this.loadPageData(selectedDS)
          this.loading = false
        })
      }
    },

    reFlashTableDataSource () {
      this.initTable()
    },
    handleTableChange (pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.reFlashTableDataSource()
    },

    // 对所有项目的数据进行分页,并按照搜索条件进行过滤
    loadPageData (origin_dataSource) {
      let params = this.getQueryParams() // 查询条件
      let deviceName = params.deviceName
      let errMsg = params.errMsg
      console.log('queryParam:deviceName=>', deviceName)
      console.log('queryParam:errMsg=>', errMsg)

      if (deviceName != null && deviceName != '' && deviceName != undefined) {
        deviceName = deviceName.substring(1, deviceName.length - 1)
        console.log('queryParam:deviceName=>', deviceName)
        origin_dataSource = origin_dataSource.filter(item => {
          return item.deviceName.indexOf(deviceName) != -1
        })
      }

      if (errMsg != null && errMsg != '' && errMsg != undefined) {
        errMsg = errMsg.substring(1, errMsg.length - 1) // 去掉两边的*号
        let errNo = this.getErrNoByMsg(errMsg)
        console.log('queryParam:errNo=>', errNo)
        origin_dataSource = origin_dataSource.filter(item => {
          return item.errNo == errNo
        })
      }

      this.ipagination.total = origin_dataSource.length
      let currentPage = this.ipagination.current
      let pageSize = this.ipagination.pageSize
      let startIndex = (currentPage - 1) * pageSize
      let endIndex = currentPage * pageSize

      origin_dataSource = origin_dataSource.slice(startIndex, endIndex)
      this.dataSource = origin_dataSource
    },
    getErrNoByMsg (errMsg) {
      let errNo = ''
      this.errNoDictOptions.forEach(item => {
        if (item.text.indexOf(errMsg) != -1) {
          errNo = item.value
        }
      })
      console.log('getErrNoByMsg =>', this.errNoDictOptions)
      console.log('errNo =>', errNo)
      return errNo
    },

    // 分页、排序、筛选变化时触发
    handleTableChange (pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadPageData(this.unpaged_datasource)
    },
    onSelect (selectedKeys, info) {
      if (selectedKeys.length == 0) {
        this.disable = true
        return
      }
      this.disable = false
      let origin_dataSource = []
      this.prjMaps.forEach(prj => {
        if (prj.id == selectedKeys[0]) {
          origin_dataSource = prj.data
        }
      })
      this.loadPageData(origin_dataSource)
      // 清除默认单选框选中状态
      this.radioChecked = false
    },
    defaultFocus () {
      // 选中默认框
      this.radioChecked = true
      // 清除项目列表树选中状态
      this.selectedProKeys = []
      this.setPrjCodes()
      this.clickReset = !this.clickReset
      this.loadPageData(this.unpaged_datasource)
    },
    searchQuery () {
      this.ipagination.current = 1
      this.loadPageData(this.unpaged_datasource)
    },
    searchReset () {
      this.queryParam = {}
      this.clickReset = !this.clickReset
      this.initTable()
      // this.loadPageData(this.unpaged_datasource)
    },
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }

      // 获取数据服务url
      let prjCode = ''
      this.dataSource.forEach(item => {
        if (item.id == id) {
          prjCode = item.prjCode
          console.log('prjCode=>', prjCode)
        }
      })
      let url_prefix = ''
      this.projects.forEach(prj => {
        if (prj.prjCode == prjCode) {
          url_prefix = prj.dataServiceUrl
          console.log('url_prefix=>', url_prefix)
        }
      })

      let deleteUrl = url_prefix + this.url.delete
      let that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          this.loading = true
          deleteAction(deleteUrl, { id: id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.initTable()
            } else {
              that.$message.warning('操作失败')
            }
            this.loading = false
          })
        }
      })
    },
    // 根据部门查询
    searchByTree (key) {
      if (key) {
        // 搜索的字段prjType
        this.queryParam.prjType = key
        this.searchQuery()
        this.resertTable()
      } else {
        this.queryParam.prjType = ''
        this.searchQuery()
        this.resertTable()
      }
    },
    // 重置表格状态
    resertTable () {
      this.selectedRowKeys = []
    },
    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    },
    getDeviceNumberList (prjCodes) {
      let that = this
      return new Promise((resolve, reject) => {
        this.loading = true
        getAction(that.url.getDeviceNumberByPrjList, { prjCodes: prjCodes }).then(res => {
          that.deviceNumberList = res.result
          resolve('成功')
          this.loading = false
        })
      })
    },
    // 控制表头居中
    customHeaderRow (record) {
      // record.forEach(item => {
      //   item.align = 'center'
      // })
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
  .device-under-part-content {
    display: flex;
    .device-tree-content {
      // display: flex;
      box-sizing: border-box;
      min-height: 0;
      margin-right: 14px;
    }
  }
</style>
