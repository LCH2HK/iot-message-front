<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="18" :sm="18">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="规则名称">
                  <a-input placeholder="请输入规则名称" v-model="queryParam.alertRuleName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="应用产品" >
                  <a-select v-model="queryParam.productId" @focus="getProductNames" placeholder="请选择应用产品" allowClear>
                    <a-icon slot="suffixIcon" type="caret-down" />
                    <a-select-option v-for="i in productInfos" :key="i.id">{{ i.productName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="任务状态">
                  <a-select  v-model="queryParam.status" placeholder="请选择状态" allowClear>
                    <a-icon slot="suffixIcon" type="caret-down" />
                    <a-select-option value>全部</a-select-option>
                    <a-select-option value="0">已启用</a-select-option>
                    <a-select-option value="1">未启用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
<!--              <a-col :md="6" :sm="10">-->
<!--                <span style="float: left; overflow: hidden;" class="table-page-search-submitButtons">-->
<!--                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
<!--                  <a-button-->
<!--                    type="primary"-->
<!--                    @click="mySearchReset"-->
<!--                    icon="reload"-->
<!--                    style="margin-left: 8px"-->
<!--                  >重置</a-button>-->
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
      <!--项目树-->
      <projectTree ref="projectTree" @getSelectMessage="getSelectMessage" @defaultFocus="initTable"></projectTree>
      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!-- <a-button type="primary" icon="download" @click="handleExportXls('告警规则信息')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>-->
          <!-- </a-upload> -->
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel">
                <a-icon type="delete" />删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <!-- table区域-begin -->
        <div>
          <div class="ant-alert ant-alert-info" style="border: none;margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
            <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange"
          >
            <!-- 字符串超长截取省略号显示-->
            <!-- <span slot="productId" slot-scope="text">
          <j-ellipsis :value="text" :length="25" />
            </span>-->
            <span slot="action" slot-scope="text, record">
              <a @click="resumeRule(record)" v-if="record.status==='1'">启用</a>
              <a @click="pauseRule(record)" v-if="record.status==='0'">停用</a>
              <a-divider type="vertical" :class="record.status ==='1' ? 'showVertical' : 'unshowVertical'"/>
              <a @click="handleEdit(record)" :disabled="record.status === '0'" >编辑</a>
              <a-divider type="vertical" :class="record.status === '1' ? 'showVertical' : 'unshowVertical'"/>
              <a @click="handleDelete(record.id)" :disabled="record.status === '0'" >刪除</a>
<!--              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" :disabled="record.status == 0">-->
<!--                      <a>删除</a>-->
<!--              </a-popconfirm>-->
<!--              <a-dropdown>-->
<!--                <a class="ant-dropdown-link">-->
<!--                  更多-->
<!--                  <a-icon type="down" />-->
<!--                </a>-->
<!--                <a-menu slot="overlay">-->
<!--                  <a-menu-item>-->
<!--                    <a @click="handleEdit(record)">编辑</a>-->
<!--                  </a-menu-item>-->
<!--                  <a-menu-item>-->
<!--                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                      <a>删除</a>-->
<!--                    </a-popconfirm>-->
<!--                  </a-menu-item>-->
<!--                </a-menu>-->
<!--              </a-dropdown>-->
            </span>
            <!-- 状态渲染模板 -->
            <template slot="customRenderStatus" slot-scope="status">
              <a-tag v-if="status==0" color="green">已启用</a-tag>
              <a-tag v-if="status==1" color="orange">未启用</a-tag>
            </template>
          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <alert-rule-modal ref="modalForm" @ok="modalFormOk" :prjCodes="prjCodeString"></alert-rule-modal>
  </a-card>
</template>

<script>
import AlertRuleModal from './modules/AlertRuleModal'
import { getAction, postAction, deleteAction } from '@/api/manage'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import projectTree from '../ProjectTree'
import { ProjectTreeMixin } from '../js/ProjectTreeMixin'

export default {
  name: 'AlertRule',
  mixins: [myCmpListMixin, ProjectTreeMixin],
  components: {
    AlertRuleModal,
    projectTree
  },
  data () {
    return {
      // productId: '阈值告警规则设置',
      // 查询条件
      queryParam: {},
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
          title: '规则名称',
          align: 'left',
          dataIndex: 'alertRuleName',
          sorter: true
        },
        {
          title: '应用产品',
          align: 'left',
          width: 300,
          dataIndex: 'productName',
          scopedSlots: { customRender: 'productName' }
        },
        {
          title: '告警等级',
          align: 'left',
          dataIndex: 'alertLevel'
        },
        {
          title: '连续周期',
          align: 'left',
          dataIndex: 'continueCycle'
        },
        {
          title: '静默周期',
          align: 'left',
          dataIndex: 'slienceCycle'
        },
        {
          title: '允许相等次数',
          align: 'left',
          dataIndex: 'allowEqualTimes'
        },
        {
          title: '联系人组',
          align: 'left',
          dataIndex: 'contactGroupName'
        },
        {
          title: '状态',
          align: 'left',
          dataIndex: 'status',
          scopedSlots: { customRender: 'customRenderStatus' },
          filterMultiple: false,
          filters: [
            { text: '已启用', value: '0' },
            { text: '未启用', value: '1' }
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
        list: '/alert/alertRule/listByUserPrj',
        delete: '/alert/alertRule/delete',
        deleteBatch: '/alert/alertRule/deleteBatch',
        changeState: '/alert/alertRule/changeAlertRuleState',
        productName: '/product/product/productNames'
      },
      productInfos: [],
      projectMsg: {},
      realDb: [],
      contactGroupInfos: [],
      dataServiceUrl: ''
    }
  },
  created () {
    this.dataServiceUrl = this.projectMsg.dataServiceUrl
    this.url.list = this.dataServiceUrl + this.url.list
    this.queryParam.realDb = this.realDb = this.projectMsg.realDb
    this.judgeCorpOrPrjThenLoadData()
  },
  methods: {
    // onSelect(selectedKeys, info) {
    //   if (selectedKeys.length == 0) {
    //     this.disable = true
    //     return
    //   }
    //   this.disable = false
    //   this.queryParam.realDb = this.realDb[info.selectedNodes[0].data.attrs.prjCode]
    //   console.log(info)
    //   this.queryParam.prjCodes = info.selectedNodes[0].data.attrs.prjCode
    //   console.log(this.queryParam)
    //   this.searchQuery()
    //   // 清除默认单选框选中状态
    //   this.radioChecked = false
    // },
    pauseRule: function (record) {
      var that = this
      this.$confirm({
        title: '确认停用',
        content: '是否停用选中任务?',
        onOk: function () {
          postAction(that.dataServiceUrl + that.url.changeState, {
            id: record.id,
            status: '1',
            realDb: that.realDb
          }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    resumeRule: function (record) {
      console.log(record)
      var that = this
      this.$confirm({
        title: '确认启用',
        content: '是否启用选中任务?',
        onOk: function () {
          postAction(that.dataServiceUrl + that.url.changeState, {
            id: record.id,
            status: '0',
            realDb: that.realDb
          }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    // 获取所有产品ID和名称
    getProductNames () {
      var that = this
      this.queryParam.prjCodes = this.prjCodeString
      console.log(this.queryParam.prjCodes)
      getAction(that.url.productName, that.queryParam).then(res => {
        if (res.success) {
          that.productInfos = [
            {
              id: '0',
              productName: '全部产品'
            }
          ].concat(res.result)
        } else {
          that.$message.warning('操作失败')
        }
      })
    },
    // 重置搜索
    mySearchReset () {
      this.queryParam = []
      this.selectedRowKeys = []
      this.queryParam.realDb = this.projectMsg.realDb
      console.log(this.prjCode)
      if (this.prjCode !== '') {
        this.queryParam.prjCodes = this.prjCode
      } else {
        this.queryParam.prjCodes = this.prjCodeString
      }
      this.clickReset = !this.clickReset
      this.loadData()
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            deleteAction(that.dataServiceUrl + that.url.deleteBatch, { ids: ids, realDb: that.projectMsg.realDb }).then(
              res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadData()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              }
            )
          }
        })
      }
    },

    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.dataServiceUrl + that.url.delete, { id: id, realDb: that.projectMsg.realDb }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
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
