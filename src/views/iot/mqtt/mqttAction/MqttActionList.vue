<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-content>
        <!-- 操作按钮区域 -->
        <div class="table-operator" v-if="projectMsg">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!--          <a-button @click="batchEdit" type="primary" icon="edit" :disabled="this.selectedRowKeys.length == 0">编辑-->
          <!--          </a-button>-->
          <!--          <a-button @click="batchDel1" type="primary" icon="delete" :disabled="this.selectedRowKeys.length == 0">删除-->
          <!--          </a-button>-->
        </div>
        <!-- table区域-begin -->
        <div>
          <a-table
            ref="table"
            size="middle"
            rowKey="id"
            bordered
            :scroll="{x:500}"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :customHeaderRow="customHeaderRow"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record,'查看')">查看</a>
              <a-divider type="vertical" v-if="projectMsg" />
              <a @click="handleEdit(record)" v-if="projectMsg">编辑</a>
              <a-divider type="vertical" v-if="projectMsg" />
              <a @click="handleDelete(record.id)" v-if="projectMsg">删除</a>
            </span>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <mqttAction-modal ref="modalForm" :productId="productId" :data="dataSource" @ok="modalFormOk"></mqttAction-modal>
  </a-card>
</template>

<script>
import MqttActionModal from './modules/MqttActionModal'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import JLeftTree from '@/components/cmp/JLeftTree'
import Vue from 'vue'

export default {
  name: 'MqttActionList',
  mixins: [myCmpListMixin],
  components: {
    MqttActionModal,
    JLeftTree
  },
  props: {
    productId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      description: '适用于mqtt协议的动作指令管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: '5%',
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },

        {
          title: '命令编码',
          align: 'left',
          width: '14%',
          sorter: (a, b) => a.cmdType - b.cmdType,
          dataIndex: 'cmdType'
        },
        {
          title: '命令名称',
          align: 'left',
          width: '12%',
          dataIndex: 'cmdName'
        },
        {
          title: '命令参数',
          align: 'left',
          dataIndex: 'cmdParams'
        },
        {
          title: '命令模板',
          align: 'left',
          dataIndex: 'cmdTemplate'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '10%',
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/mqttAction/mqttAction/ActionListByProductId',
        delete: '/mqttAction/mqttAction/delete',
        deleteBatch: '/mqttAction/mqttAction/deleteBatch'
      },
      projectMsg: null
    }
  },
  beforeCreate () {},
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log('this.productId=>', this.productId)
    this.queryParam.productId = this.productId
    this.loadData()
  },
  methods: {
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
</style>
