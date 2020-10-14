<!--
  !!! 已废弃 ！！！ 代码生成器生成，已废弃
  -->
<template>
  <a-card :bordered="false">
    <a-button slot="tabBarExtraContent">Extra Action</a-button>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <span class="serachRight" v-if="toggleSearchStatus">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
          </span>
          <a-col :md="5" :sm="8">
            <a-form-item label="所属产品">
              <a-select
                labelInValue
                :defaultValue="{key:'0'}"
                v-model="selectProduct"
                style="width: 120px"
                @change="selectProductChange"
              >
                <a-select-option v-for="i in productNames" :key="i.id">{{i.productName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
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
          <!--          <a-col :md="5" :sm="8">-->
          <!--            <a-form-item label="节点类型">-->
          <!--              &lt;!&ndash; <a-input v-model="queryParam.nodeType"></a-input> &ndash;&gt;-->
          <!--              <j-dict-select-tag v-model="queryParam.nodeType" dictCode="iot_node_type"/>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <!-- <template v-if="toggleSearchStatus">
      <a-col :md="5" :sm="8">
        <a-form-item label="设备名称">
          <a-input v-model="queryParam.deviceName"></a-input>
        </a-form-item>
      </a-col>
          </template>-->
          <!-- <template v-if="toggleSearchStatus">
      <a-col :md="5" :sm="8">
        <a-form-item label="设备描述">
          <a-input v-model="queryParam.deviceIntroduction"></a-input>
        </a-form-item>
      </a-col>
          </template>-->
          <!-- <template v-if="toggleSearchStatus">
      <a-col :md="5" :sm="8">
        <a-form-item label="设备状态">
          <a-input v-model="queryParam.deviceState"></a-input>
        </a-form-item>
      </a-col>
    </template>
    <template v-if="toggleSearchStatus">
      <a-col :md="5" :sm="8">
        <a-form-item label="节点类型">
          <a-input v-model="queryParam.deviceType"></a-input>
        </a-form-item>
      </a-col>
          </template>-->
          <!-- <template v-if="toggleSearchStatus">
      <a-col :md="5" :sm="8">
        <a-form-item label="最后上线时间">
          <a-input v-model="queryParam.lastOnlineTime"></a-input>
        </a-form-item>
      </a-col>
          </template>-->
          <!-- <template v-if="toggleSearchStatus">
      <a-col :md="5" :sm="8">
        <a-form-item label="设备密钥">
          <a-input v-model="queryParam.deviceSecret"></a-input>
        </a-form-item>
      </a-col>
          </template>-->
          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="mySearchReset" icon="reload" class="serachRight">重置</a-button>
              <!-- <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>
          <!-- <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
         <span class="table-page-search-submitButtons serachLeft">
           <a @click="handleToggleSearch">
             {{ toggleSearchStatus ? '收起' : '展开' }}
             <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
           </a>
         </span>.........................................
          </a-col>-->
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
          <!--              <a-button @click="handleAdd" type="primary" icon="plus">添加设备</a-button>-->
          <!--          <a-button-->
          <!--            @click="batchEdit"-->
          <!--            type="primary"-->
          <!--            icon="edit"-->
          <!--            :disabled="this.selectedRowKeys.length == 0"-->
          <!--          >编辑-->
          <!--          </a-button>-->
          <!-- <a-button @click="batchDel1" type="primary" icon="delete" :disabled="this.selectedRowKeys.length == 0">删除</a-button> -->
          <!-- <a-button type="primary" icon="download" @click="handleExportXls('设备信息表')">导出</a-button>
  <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
    <a-button type="primary" icon="import">导入</a-button>
          </a-upload>-->
          <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
    <a-menu slot="overlay">
      <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
    </a-menu>
    <a-button class="batchOperation"> 批量操作 <a-icon type="down" /></a-button>
  </a-dropdown>
  <div class="ant-alert ant-alert-info">
    <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a>{{ selectedRowKeys.length }}</a>项
    <a @click="onClearSelected">清空</a>
          </div>-->
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
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record,productNames)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record,productNames,'查看')">查看</a>
              <!--                  <a-divider type="vertical"/>-->
              <!--                  <a @click="batchAbandone(record.id)">删除</a>-->
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

          <!-- <a-table
             ref="table"
             size="middle"
             rowKey="id"
             :columns="columns"
             :dataSource="dataSource"
             :pagination="ipagination"
             :loading="loading"
             :expandedRowKeys="expandedRowKeys"
             @change="handleTableChange"
             @expand="handleExpand"
             v-bind="tableProps">

         <span slot="action" slot-scope="text, record">
           <a @click="handleEdit(record)">编辑</a>
           <a-divider type="vertical" />
           <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
             <a>删除</a>
           </a-popconfirm>
         </span>

          </a-table>-->
          <!--          <point-code-modal ref="PointCodeModal"></point-code-modal>-->
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <point-code-modal ref="modalForm" @ok="modalFormOk"></point-code-modal>
    <!--
        <device-modal ref="modalForm" @ok="modalFormOk"></device-modal>
    -->
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { getAction, postAction, deleteAction } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk.vue'
import PointCodeModal from './modules/PointCodeModal'

export default {
  name: 'PointCodeList',
  mixins: [CmpListMixin],
  components: {
    JLeftTree,
    JInputLk,
    PointCodeModal
  },
  data () {
    return {
      // 设备数量
      deviceCount: {
        allCount: 0,
        onlineCount: 0,
        inactivated: 0
      },
      // 产品名称列表
      productNames: [{ id: '0', productName: '全部产品' }],
      // 选中的产品ID
      selectProductId: '',
      // 选中的产品
      selectProduct: { key: '0', productName: '全部产品' },
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
          align: 'center',
          dataIndex: 'deviceKey'
        },
        {
          title: '设备名称',
          align: 'center',
          dataIndex: 'deviceName'
        },
        {
          title: '设备所属产品',
          align: 'center',
          dataIndex: 'productId',
          customRender: (text, record, index) => {
            return this.getProductNameById(text)
          }
        },
        /* {
              title: '设备属性',
              align: 'center',
              dataIndex: 'deviceProperties'
          }, */
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 校验规则
      validatorRules: {
        deviceState: { rules: [{ required: true, message: '请选择设备状态!' }] },
        productId: { rules: [{ required: true, message: '请选择对应产品!' }] },
        nodeType: { rules: [{ required: true, message: '请选择节点类型!' }] }
      },
      // URL
      url: {
        list: '/device/device/list',
        delete: '/device/device/delete',
        deleteBatch: '/device/device/deleteBatch',
        exportXlsUrl: 'device/device/exportXls',
        importExcelUrl: 'device/device/importExcel',
        productName: '/product/product/productNames',
        deviceList: 'device/device/deviceList',
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
    this.getProductNames()
  },
  beforeCreate () {
    // 自行定义方法，引用字典
    // 初始化字典
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
  },
  activated () {
    let pid = this.$route.query.recordId
    console.log('pid' + pid)
    this.selectProductId = pid || '0'
    if (pid) {
      this.selectProductChange({ key: pid, label: this.getProductNameById(pid) })
      this.selectProduct = { key: this.selectProductId }
    } else {
      this.selectProductChange({ key: '0', label: '全部产品' })
      this.selectProduct = { key: '0' }
    }
    console.log(this.selectProductId)
    console.log(this.selectProduct)
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
          deleteAction(that.url.delete, { id: id }).then(res => {
            if (res.success) {
              that.$message.success('删除成功')
              that.loadData(-1)
            } else {
              that.$message.warning('操作失败')
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
    /* 只适用用本方案 */
    handleEdit: function (record, params, title) {
      let param = '查看'
      if (title === '查看') {
        this.$refs.modalForm.title = '查看'
      } else {
        this.$refs.modalForm.title = '编辑'
      }
      for (let i = 0; i < params.length; ++i) {
        if (record.productId === params[i].id) {
          param = params[i].productType
          break
        }
      }
      this.$refs.modalForm.editAfter(record, param)
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
          that.$message.warning('操作失败')
        }
      })
    },
    // 选择产品下拉列表 改变函数
    selectProductChange (value) {
      var that = this
      postAction(that.url.deviceList, { productId: value.key }).then(res => {
        if (res.success) {
          var result = res.result[0]
          // that.$message.success('查询设备信息成功')
          // that.productNames = that.productNames.concat(res.result)
          that.deviceCount.allCount = result.allCount
          that.deviceCount.onlineCount = result.state1
          that.deviceCount.inactivated = result.state0

          // that.loadData();
        } else {
          that.$message.warning('查询设备信息失败')
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
      this.searchQuery()
    },
    // 重置
    mySearchReset () {
      this.queryParam = {}
      this.queryParam.productId = this.selectProductId
      if (this.$refs.ResetLk) {
        this.$refs.ResetLk.ResetValue()
      }
      this.loadData(1)
      // this.searchReset()
    },
    // 刷新
    myReload () {
      if (this.selectProductId != '') {
        this.selectProductChange({ key: this.selectProductId })
      } else {
        this.selectProductChange({ key: '0' })
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
      postAction(that.url.changeState, { id: record.id, deviceState: dState }).then(res => {
        if (res.success) {
          that.$message.success('修改设备状态成功')
          that.myReload()
        } else {
          that.$message.warning('操作失败')
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
    }
    //
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>
