<!-- 子设备列表页面 已废弃-->
<template>
  <a-card :bordered="false">
    <a-button slot="tabBarExtraContent">Extra Action</a-button>
    <!-- </a-tabs> -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <span class="serachRight" v-if="toggleSearchStatus">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button
              type="primary"
              @click="mySearchReset"
              icon="reload"
              style="margin-left: 8px"
            >重置</a-button>
          </span>
          <a-col :md="5" :sm="8">
            <a-form-item label="设备编号">
              <j-input-lk
                :placeholder="'请输入设备编号'"
                @enterSearch="enterSearch($event,'deviceKey')"
                @inputValueLk="inputValueLk($event,'deviceKey')"
                :reset="clickReset"
              ></j-input-lk>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="设备名称">
              <j-input-lk
                :placeholder="'请输入设备名称'"
                @enterSearch="enterSearch($event,'deviceName')"
                @inputValueLk="inputValueLk($event,'deviceName')"
                :reset="clickReset"
              ></j-input-lk>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="设备状态">
              <j-dict-select-tag v-model="queryParam.deviceState" dictCode="iot_device_state" />
            </a-form-item>
          </a-col>
          <!--              <a-col :md="5" :sm="8">-->
          <!--                <a-form-item label="节点类型">-->
          <!--                  <j-dict-select-tag v-model="queryParam.nodeType" dictCode="iot_node_type" />-->
          <!--                </a-form-item>-->
          <!--              </a-col>-->
          <a-col :md="3" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                class="child_reload_button"
                @click="mySearchReset"
                icon="reload"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-layout>
      <a-layout-sider
        width="250px"
        theme="light"
        collapsedWidth="0"
        :trigger="null"
        collapsible
        v-model="collapsed"
        v-if="false"
      >
        <!--数据字典查询-->
        <j-left-tree @searchByTree="searchByTree" header dictCode></j-left-tree>
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible" v-if="false">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">添加子设备</a-button>
          <a-button
            @click="batchEdit"
            type="primary"
            icon="edit"
            :disabled="this.selectedRowKeys.length == 0"
          >编辑</a-button>
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
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}"
            @change="handleTableChange"
            :customHeaderRow="customHeaderRow"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="routerPush(record,'/iot/device/DeviceDetails')">查看</a>
              <a-divider type="vertical" />
              <a @click="batchAbandone(record.id)">删除</a>
            </span>
            <span slot="light_deviceState" slot-scope="text">
              <div class="light-device-state" :class="deviceStateClasses[text.deviceState]"></div>
            </span>
            <span class="my-switch-span" slot="deviceState" slot-scope="text, record">
              <a-switch
                :defaultChecked="text.deviceState == '1' ? true : false"
                @change="changeDeviceState(record)"
              />
            </span>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <ChildDeviceModal ref="modalForm" :parentId="this.parentId" @ok="modalFormOk"></ChildDeviceModal>
  </a-card>
</template>

<script>
import ChildDeviceModal from './modules/ChildDeviceModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { getAction, postAction, deleteAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk.vue'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import DeviceDetails from '@/views/iot/device/DeviceDetails'

export default {
  name: 'ChildDeviceList',
  mixins: [CmpListMixin],
  props: ['parentId'],
  components: {
    ChildDeviceModal,
    DeviceDetails,
    JLeftTree,
    JDictSelectTag,
    JInputLk
  },
  data () {
    console.log('into data')
    return {
      // 设备数量
      deviceCount: {
        allCount: 0,
        onlineCount: 0,
        inactivated: 0,
        abnormalCount: 0
      },
      // 产品名称列表
      productNames: [
        {
          id: '0',
          productName: '全部产品'
        }
      ],
      // 选中的产品ID
      selectProductId: '',
      // 选中的产品
      selectProduct: {
        key: '0',
        productName: '全部产品'
      },
      // 字典值
      nodeTypeDictOptions: [],
      deviceStateDictOptions: [],

      description: '设备信息表管理页面',
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
          title: '设备所属产品',
          align: 'left',
          dataIndex: 'productId',
          sorter: true,
          customRender: text => {
            return this.getProductNameById(text)
          }
        },
        {
          title: '节点类型',
          align: 'left',
          dataIndex: 'nodeType',
          sorter: true,
          width: 100,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.nodeTypeDictOptions, text)
          }
        },
        {
          title: '',
          align: 'right',
          width: 30,
          scopedSlots: {
            customRender: 'light_deviceState'
          }
        },
        {
          title: '设备状态',
          align: 'left',
          dataIndex: 'deviceState',
          sorter: true,
          width: 100,
          customRender: text => {
            // 字典值替换通用方法
            return filterDictText(this.deviceStateDictOptions, text)
          }
        },
        {
          title: '',
          align: 'left',
          width: 60,
          scopedSlots: {
            customRender: 'deviceState'
          }
        },
        {
          title: '最后上线时间',
          align: 'center',
          sorter: true,
          dataIndex: 'lastOnlineTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      // 校验规则
      validatorRules: {
        deviceState: {
          rules: [
            {
              required: true,
              message: '请选择设备状态!'
            }
          ]
        },
        productId: {
          rules: [
            {
              required: true,
              message: '请选择对应产品!'
            }
          ]
        },
        nodeType: {
          rules: [
            {
              required: true,
              message: '请选择节点类型!'
            }
          ]
        }
      },
      // URL
      url: {
        list: '/device/device/list',
        delete: '/device/device/delete',
        deleteBatch: '/device/device/deleteBatch',
        exportXlsUrl: 'device/device/exportXls',
        importExcelUrl: 'device/device/importExcel',
        productName: '/product/product/productNames',
        deviceList: 'device/device/deviceList', // 查询子设备信息
        changeState: '/device/device/changeState'
      },
      // 设备状态计数 样式类
      deviceStateClasses: {
        0: 'device-count-inactivated',
        1: 'device-count-online',
        2: 'device-count-offline',
        3: 'device-count-abnormal'
      },
      collapsed: false
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG.domianURL}/${this.url.importExcelUrl}`
    }
  },
  mounted () {
    this.getProductNames() // 获取所有产品ID和名称
  },
  beforeCreate () {
    // 自行定义方法，引用字典
    initDictOptions('bpm_status').then(res => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('leave_type').then(res => {
      if (res.success) {
        this.leaveDictOptions = res.result
      }
    })
  },
  created () {
    // nodeTypeDictOption() {
    initDictOptions('iot_node_type').then(res => {
      if (res.success) {
        this.nodeTypeDictOptions = res.result
      }
    })
    initDictOptions('iot_device_state').then(res => {
      if (res.success) {
        this.deviceStateDictOptions = res.result
      }
    })
    this.selectProductChange({
      key: '0',
      label: '全部产品'
    })
    this.selectProduct = {
      key: '0'
    }
  },
  activated () {
    let pid = this.$route.query.recordId
    this.selectProductId = pid || '0'
    if (pid) {
      this.selectProductChange({
        key: pid,
        label: this.getProductNameById(pid)
      })
      this.selectProduct = {
        key: this.selectProductId
      }
    } else {
      this.selectProductChange({
        key: '0',
        label: '全部产品'
      })
      this.selectProduct = {
        key: '0'
      }
    }
    // console.log(this.selectProductId);
    // console.log(this.selectProduct);
  },
  methods: {
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, {
            id: id
          }).then(res => {
            if (res.success) {
              that.$message.success('删除成功')
              that.myLoadData(-1)
            } else {
              that.$message.error('操作失败')
            }
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
    // 获取所有产品ID和名称
    getProductNames () {
      var that = this
      getAction(that.url.productName, {}).then(res => {
        if (res.success) {
          // that.$message.success('产品初始化成功')
          that.productNames = that.productNames.concat(res.result)

          // that.loadData();
        } else {
          that.$message.error('操作失败')
        }
      })
    },
    // 选择产品下拉列表 改变函数
    selectProductChange (value) {
      var that = this
      postAction(that.url.deviceList, {
        productId: value.key
      }).then(res => {
        if (res.success) {
          var result = res.result[0]
          // that.$message.success('查询设备信息成功')
          // that.productNames = that.productNames.concat(res.result)
          that.deviceCount.allCount = result.allCount
          that.deviceCount.onlineCount = result.state1
          that.deviceCount.inactivated = result.state0
          that.deviceCount.abnormalCount = result.state3

          // that.loadData();
        } else {
          that.$message.error('查询设备信息失败')
        }
      })
      if (value.key != '0') {
        that.selectProductId = value.key
      } else {
        that.selectProductId = ''
      }
      this.mySearchQuery()
    },
    // 查询
    mySearchQuery () {
      this.queryParam.productId = this.selectProductId
      this.myLoadData(1)
    },
    myLoadData (arg) {
      this.queryParam.parentId = this.parentId
      this.loadData(arg)
    },

    // 重置
    mySearchReset () {
      this.queryParam = {}
      this.queryParam.productId = this.selectProductId
      if (this.$refs.ResetLk) {
        this.$refs.ResetLk.ResetValue()
      }
      this.myLoadData(1)
      this.clickReset = !this.clickReset
      // this.searchReset()
    },

    // 刷新
    myReload () {
      if (this.selectProductId != '') {
        this.selectProductChange({
          key: this.selectProductId
        })
      } else {
        this.selectProductChange({
          key: '0'
        })
      }
    },
    // 改变设备状态
    changeDeviceState (record) {
      var dState = record.deviceState == '1' ? '2' : '1'
      if (!this.url.changeState) {
        this.$message.error('请设置url.changeState属性!')
        return
      }
      var that = this
      postAction(that.url.changeState, {
        id: record.id,
        deviceState: dState
      }).then(res => {
        if (res.success) {
          that.$message.success('修改设备状态成功')
          that.myReload()
        } else {
          that.$message.error('操作失败')
          console.log(res.message)
        }
      })
    },
    // 通过id获取产品名称
    getProductNameById (id) {
      var that = this
      var i, pName
      var pnames = that.productNames
      for (i in pnames) {
        let pname = pnames[i]
        if (pname.id == id) {
          pName = pname.productName
          break
        }
      }
      return pName
    },
    //
    // 带参跳转
    routerPush (record, url) {
      // console.log(record, url, '发送的record');
      this.$router.push({
        path: url,
        query: {
          recordId: record.id
        }
      })
    },
    // 控制表头居中
    customHeaderRow (record) {
      record.forEach(item => {
        item.align = 'center'
      })
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
  margin-left: 263px;
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

.device-count-num-inactivated {
  color: rgba(153, 153, 153, 1);
}

.device-all {
  width: 376px;
  height: 120px;
  margin-right: 20px;
  background-image: url(../img/all_device_img.png);
}

.device-online {
  width: 376px;
  height: 120px;
  margin-right: 20px;
  background-image: url(../img/online_img.png);
}

.device-inactived {
  width: 376px;
  height: 120px;
  margin-right: 20px;
  background-image: url(../img/not_active_img.png);
}

.device-abnormal {
  width: 376px;
  height: 120px;
  margin-right: 20px;
  background-image: url(../img/device_abnormal_img.png);
}

.device-content {
  margin-left: 260px;
  margin-top: 16px;
}

.device-count-all {
  background-color: rgb(19, 157, 211);
}

.device-count-online {
  background-color: rgb(13, 206, 55);
}

.device-count-offline {
  background-color: rgb(202, 216, 10);
}

.device-count-inactivated {
  background-color: rgb(102, 102, 102);
}

.device-count-abnormal {
  background-color: rgb(235, 16, 16);
}

.light-device-state {
  display: inline-block;
  width: 8px;
  height: 8px;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 50%;
}

.child_reload_button {
  margin-left: 25px;
}

@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>
