<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
<!--              <span class="serachRight" v-if="toggleSearchStatus">-->
<!--                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
<!--                <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>-->
<!--              </span>-->
              <a-col :md="8" :sm="8">
                <a-form-item label="动作编码">
                  <j-input-lk
                    :placeholder="'请输入动作编码'"
                    @enterSearch="enterSearch($event,'cmdType')"
                    @inputValueLk="inputValueLk($event,'cmdType')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="动作名称">
                  <j-input-lk
                    :placeholder="'请输入动作名称'"
                    @enterSearch="enterSearch($event,'cmdName')"
                    @inputValueLk="inputValueLk($event,'cmdName')"
                    :reset="clickReset"
                  ></j-input-lk>
                </a-form-item>
              </a-col>
<!--              <a-col :md="4" :sm="8">-->
<!--                <span class="table-page-search-submitButtons">-->
<!--                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
<!--                  <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>-->
<!--                </span>-->
<!--              </a-col>-->
            </a-row>
          </a-col>
          <a-col :md="6" :sm="24">
            <div class="search-buttons-content">
            <span class="table-page-search-submitButtons serachLeft">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
                </span>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-layout>
      <DeviceTree ref="myDeviceTree" @getSelectMessage="getSelectMessage" @defaultFocus="initTable"></DeviceTree>

      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator" v-if="false">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button
            @click="batchEdit"
            type="primary"
            icon="edit"
            :disabled="this.selectedRowKeys.length == 0"
          >编辑</a-button>
          <a-button
            @click="batchDel1"
            type="primary"
            icon="delete"
            :disabled="this.selectedRowKeys.length == 0"
          >删除</a-button>
          <a-button
            type="primary"
            icon="download"
            @click="handleExportTemplateXls('mqtt任务列表模板')"
          >导出模板</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls('mqtt任务列表')">导出</a-button>
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="importExcelUrl"
            @change="handleImportExcel"
          >
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload>
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
            @change="handleTableChange"
            :customHeaderRow="customHeaderRow"
          >
            <span slot="action" slot-scope="text, record">
              <!-- <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
              <a @click="handleDelete(record.id)">删除</a>-->
              <a @click="handleEdit(record,'查看')">查看</a>
            </span>
            <template slot="customRenderStatus" slot-scope="cmdState">
              <a-tag v-if="cmdState==0" color="grey">尚未执行</a-tag>
              <a-tag v-if="cmdState==1" color="blue">正在执行</a-tag>
              <a-tag v-if="cmdState==2" color="green">执行成功</a-tag>
              <a-tag v-if="cmdState==3" color="red">执行失败</a-tag>
            </template>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!--    <mqttTask-modal ref="modalForm" @ok="modalFormOk"></mqttTask-modal>-->
    <mqtt-task-modal-for-see ref="modalForm" @ok="modalFormOk"></mqtt-task-modal-for-see>
  </a-card>
</template>

<script>
import MqttTaskModal from './modules/MqttTaskModal'
import MqttTaskModalForSee from './modules/MqttTaskModalForSee'
import DeviceTree from '@/views/iot/DeviceTree'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { getAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk.vue'
import Vue from 'vue'

export default {
  name: 'MqttTaskList',
  mixins: [myCmpListMixin],
  components: {
    MqttTaskModal,
    MqttTaskModalForSee,
    JLeftTree,
    JInputLk,
    DeviceTree
  },
  data () {
    return {
      description: 'mqtt任务列表管理页面',

      // 以下数据用于设备树
      projectList: [],
      // deviceNumberList: [],
      prjCode: '', // 项目级
      prjCodes: '', // 企业级
      nodeKey: '',
      nodeLevel: '',
      // prjIndex: '',
      nodePos: '',
      // dataReflashTimer: '',
      productId: '',
      // deviceIds: [],
      dataServiceUrl: '',

      // isPublished: false,
      // projects: [],
      // unpaged_datasource: [],
      // prjMaps: [], //属性是prjCode，值是该项目下所有设备命令数组的数组

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
          title: '设备编号',
          align: 'left',
          dataIndex: 'deviceKey',
          sorter: (a, b) => a.deviceKey > b.deviceKey,
          sortDirections: ['descend']
        },
        {
          title: '动作编码',
          align: 'left',
          dataIndex: 'cmdType',
          sorter: (a, b) => a.cmdType - b.cmdType
        },
        {
          title: '动作名称',
          align: 'left',
          dataIndex: 'cmdName'
        },
        {
          title: '动作参数',
          align: 'left',
          dataIndex: 'cmdParams'
        },
        {
          title: '动作状态',
          align: 'left',
          dataIndex: 'cmdState',
          scopedSlots: { customRender: 'customRenderStatus' },
          onFilter: (value, record) => record.cmdState.indexOf(value) === 0,
          filters: [
            { text: '尚未执行', value: '0' },
            { text: '正在执行', value: '1' },
            { text: '执行成功', value: '2' },
            { text: '执行失败', value: '3' }
          ]
        },
        {
          title: '录入时间',
          align: 'left',
          dataIndex: 'createTime',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/mqtt/mqttTask/listBySelectTreeNode',
        tempList: '/mqtt/mqttTask/listBySelectTreeNode',
        delete: '/mqtt/mqttTask/delete',
        deleteBatch: '/mqtt/mqttTask/deleteBatch',
        getPrjListByUser: '/project/sysProject/prjListByUser',
        getAllDeviceByGroupId: '/device/device/getAllDeviceByGroupId',
        getAllDeviceByProductId: '/device/device/getAllDeviceByProductId',
        getProductById: '/product/product/queryById',
        getDeviceNumberByPrjList: '/device/device/getDeviceNumberByPrjList'
      }
    }
  },
  // computed: {
  //   importExcelUrl: function() {
  //     return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
  //   }
  // },
  // beforeCreate() {},
  mounted () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    if (this.projectMsg) {
      // 项目级
      this.prjCodes = this.prjCode = this.projectMsg.prjCode
      this.$refs.myDeviceTree.loadMqttProductNodeData(this.prjCode)
      this.url.list = this.projectMsg.dataServiceUrl + this.url.list
      // this.$refs.myDeviceTree.loadProductNodeData(this.prjCode)
      this.initTable()
    } else {
      new Promise(this.loadProjectData)
        .then(() => {
          this.$refs.myDeviceTree.loadProjectTreeData(this.projectList)
          this.initTable()
        })
        .catch(reason => {
          console.log('失败：' + reason)
        })
    }
  },
  methods: {
    initTable () {
      this.nodeLevel = this.queryParam.nodeLevel = 0
      if (this.projectMsg) {
        this.nodeKey = this.queryParam.nodeKey = this.prjCode
        this.loadData()
      } else {
        this.url.list = this.projectList[0].dataServiceUrl + this.url.tempList
        this.nodeKey = this.queryParam.nodeKey = this.projectList[0].prjCode
        this.loadData()
      }
      // this.unpaged_datasource = []
      // this.prjMaps = []
      // let that = this
      // this.initPrjTree().then(() => {
      //   that.projects = that.treeData
      //   console.log('that.projects=>', that.projects)
      //   that.projects.forEach(prj => {
      //     let url_prefix = prj.dataServiceUrl
      //     let list_url = url_prefix + that.url.list
      //     let params = { prjCode: prj.prjCode }
      //     getAction(list_url, params).then(res => {
      //       if (res.success) {
      //         that.prjMaps.push({ id: prj.id, data: res.result })
      //         that.unpaged_datasource = that.unpaged_datasource.concat(res.result)
      //         that.loadPageData(that.unpaged_datasource)
      //       } else {
      //         console.log('请求失败')
      //       }
      //     })
      //   })
      // })
    },
    // 获取项目数据,填充projectList和prjCodes
    loadProjectData (resolve, reject) {
      if (!this.url.getPrjListByUser) {
        this.$message.error('请设置url.getPrjListByUser属性!')
        return
      }
      let params = null
      let that = this
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
        }
      })
    },
    getSelectMessage (data) {
      console.log(data)
      this.nodeKey = data.nodeKey
      this.queryParam.nodeKey = data.nodeKey
      this.nodeLevel = data.nodeLevel
      this.queryParam.nodeLevel = data.nodeLevel
      let posList = data.nodePos.split('-')
      if (this.projectMsg === null) {
        this.url.list = this.projectList[posList[1]].dataServiceUrl + this.url.tempList
      }
      this.loadData()
    },
    // getSelectMessage(data) {
    //   console.log('data=======>', data)
    //   this.ipagination.current = 1
    //   this.nodeKey = data.nodeKey
    //   this.nodeLevel = data.nodeLevel
    //   this.nodePos = data.nodePos
    //   if (this.projectMsg === null) {
    //     this.prjIndex = data.nodePos.split('-')[1]
    //     this.prjCode = this.projectList[this.prjIndex].prjCode
    //     this.dataServiceUrl = this.projectList[this.prjIndex].dataServiceUrl
    //   }
    //   if (this.nodeLevel > 1) {
    //     let posArr = this.nodePos.split('-')
    //     let productPos = posArr[0] + '-' + posArr[1] + '-' + posArr[2]
    //     this.productId = this.$refs.myDeviceTree.getNodeByPos(productPos).key

    //     this.getTableDataSource()
    //   } else {
    //     let prjCode = this.projectList[this.prjIndex].prjCode
    //     let selectedDS = this.unpaged_datasource.filter(item => {
    //       return item.prjCode == prjCode
    //     })
    //     this.loadPageData(selectedDS)
    //   }
    //   clearInterval(this.dataReflashTimer)
    //   // this.dataReflashTimer = setInterval(() => {
    //   //   this.reFlashTableDataSource()
    //   // }, 10000)
    // },

    // getTableDataSource() {
    //   let selectedDS = []
    //   if (this.nodeLevel == 4) {
    //     //设备，nodeKey为设备id
    //     selectedDS = this.unpaged_datasource.filter(item => {
    //       return item.deviceId == this.nodeKey
    //     })
    //     this.loadPageData(selectedDS)
    //   } else if (this.nodeLevel == 3) {
    //     //分组
    //     // 根据设备分组获取设备列表
    //     console.log('this.nodeLevel=>', this.nodeLevel, 'this.nodePos=>', this.nodePos)
    //     let groupPos = this.nodePos

    //     let groupId = this.$refs.myDeviceTree.getNodeByPos(groupPos).key
    //     let that = this
    //     getAction(this.url.getAllDeviceByGroupId, { deviceGroupId: groupId }).then(res => {
    //       that.deviceIds = []
    //       if (res.result.length > 0) {
    //         res.result.map(data => {
    //           that.deviceIds.push(data.id)
    //         })
    //       }
    //       console.log('DataDisplay:that.deviceIds=>', that.deviceIds)
    //       selectedDS = that.unpaged_datasource.filter(item => {
    //         let flag = false
    //         that.deviceIds.forEach(deviceId => {
    //           if (deviceId == item.deviceId) {
    //             flag = true
    //           }
    //         })
    //         return flag
    //       })
    //       this.loadPageData(selectedDS)
    //     })
    //   } else if (this.nodeLevel == 2) {
    //     //产品级
    //     let that = this
    //     getAction(this.url.getAllDeviceByProductId, { productId: this.productId }).then(res => {
    //       that.deviceIds = []
    //       if (res.result.length > 0) {
    //         res.result.map(data => {
    //           that.deviceIds.push(data.id)
    //         })
    //       }
    //       console.log('DataDisplay:that.deviceIds=>', that.deviceIds)
    //       selectedDS = that.unpaged_datasource.filter(item => {
    //         let flag = false
    //         that.deviceIds.forEach(deviceId => {
    //           if (deviceId == item.deviceId) {
    //             flag = true
    //           }
    //         })
    //         return flag
    //       })
    //       this.loadPageData(selectedDS)
    //     })
    //   }
    // },

    // reFlashTableDataSource() {
    //   this.initTable()
    // },
    // handleTableChange(pagination, filters, sorter) {
    //   if (Object.keys(sorter).length > 0) {
    //     this.isorter.column = sorter.field
    //     this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
    //   }
    //   this.ipagination = pagination
    //   this.reFlashTableDataSource()
    // },

    // //对所有项目的数据进行分页,并按照搜索条件进行过滤
    // loadPageData(origin_dataSource) {
    //   let params = this.getQueryParams() //查询条件
    //   let cmdType = params.cmdType
    //   let cmdName = params.cmdName
    //   console.log('queryParam:cmdType=>', cmdType)
    //   console.log('queryParam:cmdName=>', cmdName)

    //   if (cmdType != null && cmdType != '' && cmdType != undefined) {
    //     cmdType = cmdType.substring(1, cmdType.length - 1)
    //     console.log('queryParam:cmdType=>', cmdType)
    //     origin_dataSource = origin_dataSource.filter(item => {
    //       return item.cmdType.indexOf(cmdType) != -1
    //     })
    //   }

    //   if (cmdName != null && cmdName != '' && cmdName != undefined) {
    //     cmdName = cmdName.substring(1, cmdName.length - 1) //去掉两边的*号
    //     console.log('queryParam:cmdName=>', cmdName)
    //     origin_dataSource = origin_dataSource.filter(item => {
    //       return item.cmdName.indexOf(cmdName) != -1
    //     })
    //   }

    //   this.ipagination.total = origin_dataSource.length
    //   let currentPage = this.ipagination.current
    //   let pageSize = this.ipagination.pageSize
    //   let startIndex = (currentPage - 1) * pageSize
    //   let endIndex = currentPage * pageSize

    //   origin_dataSource = origin_dataSource.slice(startIndex, endIndex)
    //   this.dataSource = origin_dataSource
    // },

    // //分页、排序、筛选变化时触发
    // handleTableChange(pagination, filters, sorter) {
    //   if (Object.keys(sorter).length > 0) {
    //     this.isorter.column = sorter.field
    //     this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
    //   }
    //   this.ipagination = pagination
    //   this.loadPageData(this.unpaged_datasource)
    // },
    // onSelect(selectedKeys, info) {
    //   if (selectedKeys.length == 0) {
    //     this.disable = true
    //     return
    //   }
    //   this.disable = false
    //   let origin_dataSource = []
    //   this.prjMaps.forEach(prj => {
    //     if (prj.id == selectedKeys[0]) {
    //       origin_dataSource = prj.data
    //     }
    //   })
    //   this.loadPageData(origin_dataSource)
    //   // 清除默认单选框选中状态
    //   this.radioChecked = false
    // },
    // defaultFocus() {
    //   // 选中默认框
    //   this.radioChecked = true
    //   // 清除项目列表树选中状态
    //   this.selectedProKeys = []
    //   this.setPrjCodes()
    //   this.clickReset = !this.clickReset
    //   this.loadPageData(this.unpaged_datasource)
    // },
    // searchQuery() {
    //   this.loadPageData(this.unpaged_datasource)
    // },
    // 重置
    mySearchReset () {
      this.queryParam = {}
      this.queryParam.nodeLevel = this.nodeLevel
      this.queryParam.nodeKey = this.nodeKey
      this.loadData()
    },
    // batchAbandone: function(id) {
    //   if (!this.url.delete) {
    //     this.$message.error('请设置url.delete属性!')
    //     return
    //   }
    //   let that = this
    //   this.$confirm({
    //     title: '确认删除',
    //     content: '是否删除选中数据?',
    //     onOk: function() {
    //       deleteAction(that.url.delete, { id: id }).then(res => {
    //         if (res.success) {
    //           that.$message.success(res.message)
    //           that.loadData()
    //         } else {
    //           that.$message.warning('操作失败')
    //         }
    //       })
    //     }
    //   })
    // },
    // // 根据部门查询
    // searchByTree(key) {
    //   if (key) {
    //     //搜索的字段prjType
    //     this.queryParam.prjType = key
    //     this.searchQuery()
    //     this.resertTable()
    //   } else {
    //     this.queryParam.prjType = ''
    //     this.searchQuery()
    //     this.resertTable()
    //   }
    // },
    // // 重置表格状态
    // resertTable() {
    //   this.selectedRowKeys = []
    // },
    // //控制查询面板的显隐
    // switchVisible() {
    //   this.collapsed = !this.collapsed
    // },

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
.search-buttons-content {
  position: absolute;
  margin-right: 16px;
  right: -4px;
}
</style>
