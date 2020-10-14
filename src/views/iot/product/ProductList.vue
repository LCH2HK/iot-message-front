<!--产品列表展示页面 -->
<template>
  <a-card :bordered="false">
    <a-layout>
      <!--项目树-->
      <projectTree ref="projectTree" @getSelectMessage="getSelectMessage" @defaultFocus="initTable"></projectTree>
      <a-layout-content>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="21" :sm="18">
                <a-row :gutter="24">
                  <!--              <span class="serachRight" v-if="toggleSearchStatus">-->
                  <!--                <a-button type="primary" @click="mySearchQuery" icon="search">查询</a-button>-->
                  <!--                <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>-->
                  <!--              </span>-->
                  <a-col :md="7" :sm="8">
                    <a-form-item label="产品编号">
                      <j-input-lk
                        placeholder="请输入产品编号"
                        @enterSearch="enterSearch($event, 'productKey')"
                        @inputValueLk="inputValueLk($event, 'productKey')"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
                  </a-col>
                  <a-col :md="7" :sm="8">
                    <a-form-item label="产品名称">
                      <j-input-lk
                        placeholder="请输入产品名称"
                        @enterSearch="enterSearch($event, 'productName')"
                        @inputValueLk="inputValueLk($event, 'productName')"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
                  </a-col>
                  <template v-if="toggleSearchStatus">
                    <a-col :md="7" :sm="8">
                      <a-form-item label="产品型号">
                        <j-input-lk
                          placeholder="请输入产品型号"
                          @enterSearch="enterSearch($event, 'productModel')"
                          @inputValueLk="inputValueLk($event, 'productModel')"
                          :reset="clickReset"
                        ></j-input-lk>
                      </a-form-item>
                    </a-col>
                  </template>
                  <template v-if="toggleSearchStatus">
                    <a-col :md="7" :sm="8">
                      <a-form-item label="节点类型">
                        <j-dict-select-tag v-model="queryParam.nodeType" dictCode="iot_node_type" placeholder="请选择节点类型"/>
                      </a-form-item>
                    </a-col>
                  </template>
                  <a-col :md="2" :sm="8" v-if="!toggleSearchStatus">
                <span class="table-page-search-submitButtons serachLeft">
<!--                  <a-button type="primary" @click="mySearchQuery" icon="search">查询</a-button>-->
                  <!--                  <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>-->
                  <a @click="handleToggleSearch">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                  </a>
                </span>
                  </a-col>
                  <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
                <span class="table-page-search-submitButtons serachLeft">
                  <a @click="handleToggleSearch">
                    {{ toggleSearchStatus ? '收起' : '展开' }}
                    <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                  </a>
                </span>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :md="3" :sm="24">
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
        <!-- 操作按钮区域 -->
        <div class="table-operator" v-if="projectMsg">
          <a-button @click="handleAdd" type="primary" icon="plus">创建产品</a-button>
          <!--          <a-button @click="refresh" type="primary" icon="reload">刷新</a-button>-->
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
            style="margin-top: 8px"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="gotoProductDetail(record.id)">查看</a>
              <!--产品未发布时显示-->
              <span v-if="projectMsg">
                <a-divider type="vertical" :class="record.productState !== '1'? 'showVertical' : 'unshowVertical'"/>
                <a @click="handleEdit(record)" :disabled="record.productState === '1'">编辑</a>
                <a-divider type="vertical" :class="record.productState !== '1'? 'showVertical' : 'unshowVertical'"/>
                <a @click="handleDelete(record.id)" :disabled="record.productState === '1'">删除</a>
              </span>
            </span>
            <!-- 状态渲染模板 -->
            <template slot="customRenderStatus" slot-scope="productState">
              <img  :src="getProductStateImg(productState)"  />
<!--              <a-tag v-if="productState==0" color="gray">未发布</a-tag>-->
<!--              <a-tag v-if="productState==1" color="green">已发布</a-tag>-->
            </template>
            <!-- <template slot="accessGateWayRender" slot-scope="isAccessGateway">
              <a-tag v-if="isAccessGateway==0" color="orange">未接入</a-tag>
              <a-tag v-if="isAccessGateway==1" color="green">已接入</a-tag>
            </template>-->
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <product-modal ref="modalForm" @ok="modalFormOk"></product-modal>
  </a-card>
</template>

<script>
import ProductModal from './modules/ProductModal'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'
import { httpAction } from '../../../api/manage'
import qs from 'qs'
import JInputLk from '@/components/cmp/JInputLk'
import projectTree from '../ProjectTree'
import { ProjectTreeMixin } from '../js/ProjectTreeMixin'
import cronstrue from 'cronstrue/i18n'

export default {
  name: 'ProductList',
  mixins: [myCmpListMixin, ProjectTreeMixin],
  components: {
    ProductModal,
    JInputLk,
    projectTree
  },
  data () {
    return {
      description: '产品信息表管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => {
            return this.getIndexOfPage(index)
          }
        },
        {
          title: '产品编号',
          align: 'left',
          sorter: true,
          dataIndex: 'productKey'
        },
        {
          title: '产品名称',
          align: 'left',
          sorter: true,
          dataIndex: 'productName'
        },
        {
          title: '产品型号',
          align: 'left',
          sorter: true,
          dataIndex: 'productModel'
        },
        {
          title: '心跳检测频率',
          align: 'left',
          sorter: true,
          dataIndex: 'heartBeatFrequency',
          customRender: text => {
            if (text) {
              return cronstrue.toString(text, { locale: 'zh_CN' })
            }
          }
        },
        // {
        //   title: '节点类型',
        //   align: 'center',
        //   dataIndex: 'nodeType',
        //   sorter: true,
        //   customRender: text => {
        //     return filterDictText(this.nodetype, text)
        //   }
        // },
        {
          title: '是否接入终端',
          align: 'left',
          sorter: true,
          width: 140,
          dataIndex: 'isAccessGateway',
          customRender: text => {
            if (text === '1') {
              return '已接入'
            } else {
              return '未接入'
            }
          }
        },
        {
          title: '录入时间',
          align: 'left',
          sorter: true,
          width: 180,
          dataIndex: 'createTime'
        },
        {
          title: '发布状态',
          align: 'left',
          sorter: true,
          width: 140,
          dataIndex: 'productState',
          scopedSlots: { customRender: 'customRenderStatus' }
          // filterMultiple: false,
          // filters: [
          //   { text: '未发布', value: '0' },
          //   { text: '已发布', value: '1' }
          // ],
          // onFilter: (value, record) => {
          //   if (record.productState == value) {
          //     return record
          //   }
          // }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/product/product/listByUserPrj',
        delete: '/product/product/delete',
        deleteBatch: '/product/product/deleteBatch',
        exportXlsUrl: 'product/product/exportXls',
        importExcelUrl: 'product/product/importExcel'
      },
      isPublished: false,
      flag: true
    }
  },
  beforeCreate () {
    // 初始化字典
    initDictOptions('iot_node_type').then(res => {
      if (res.success) {
        this.nodetype = res.result
      }
    })
  },
  mounted () {
    // ProjectTreeMixin中方法
    this.judgeCorpOrPrjThenLoadData()
  },
  methods: {
    batchAbandone: function (event, id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      const method = 'post'
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: () => {
          httpAction(this.url.deleteBatch, qs.stringify(id), method).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.loadData(-1)
              this.onClearSelected()
            } else {
              this.$message.error('操作失败')
            }
          })
        }
      })
    },
    /**
     * 跳转到产品详情
     */
    gotoProductDetail (recordId) {
      this.$router.push({
        path: '/iot/product/ProductInfo',
        query: {
          recordId
        }
      })
    },
    // 查询方法customStyle
    mySearchQuery () {
      this.enterSearch()
    },
    // 获取产品状态 字典翻译
    getProductStateImg (productState) {
      return require(`@views/iot/img/product/state_${productState}.png`)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@views/iot/css/iotCommon.less';
</style>
