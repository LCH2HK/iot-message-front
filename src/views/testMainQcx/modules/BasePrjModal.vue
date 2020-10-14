<template>
  <div>
    <a-modal
      :footer="null"
      title="依托工程"
      :width="1000"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      style="top:5%;">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.prjName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="项目负责人">
              <j-select-user-new
                v-model="queryParam.prjManagerName"
                :selectedDetails="auditUsers1"
                @callback="setAuditUser"
                class="userSelect"></j-select-user-new>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="承办单位">
              <!--<j-select-depart v-model="departId" :trigger-change="true"></j-select-depart>-->
              <j-select-depart v-model="queryParam.applyGroupId"></j-select-depart>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="mySearchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
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
        @change="handleTableChange">
              <!--插槽-->
              <span slot="action" slot-scope="text, record">
                <a @click="chose(record)">选择</a>
              </span>
      </a-table>
    </div>
    </a-modal>
  </div>
</template>

<script>
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import JSelectDepart from '@/components/cmpbiz/JSelectDepart'

  export default {
    name: 'BasePrjModal',
    mixins: [CmpListMixin],
    components : {
      JSelectUserNew,
      JSelectDepart
    },
    props: {
      visible: {
        type: Boolean, // 定义属性的类型
        defaultValue: false // 定义该属性的默认值
      },
    },
    data() {
      return {
        form: this.$form.createForm(this),
        confirmLoading: false,
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '项目编号',
            align: 'center',
            dataIndex: 'formNum'
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex: 'prjName'
          },
          {
            title: '承办单位',
            align: 'center',
            dataIndex: 'applyGroupName'
          },
          {
            title: '项目负责人',
            align: 'center',
            dataIndex: 'prjManagerFullname'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          },
        ],
        url: {
          list: '/test/testMainQcx/list'
        },
        //选人组件
        model: {},
        prjManagerName: '',
        prjManagerFullname: '',
        selectUser: ['auditUsers1'],
        auditUsers1: {
          colum: 'auditUsers1',
          value: [],
          target: [
            { to: 'prjManagerName', from: 'username' },
            { to: 'prjManagerFullname', from: 'realname' }
          ]
        },
      }
    },
    create () {
      // 初始化Form表单
      this.form.resetFields();
    },
    methods: {
      mySearchQuery() {
        this.queryParam.prjManagerFullname = this.prjManagerFullname
        console.log(this.queryParam,'依托工程请求参数')
        this.searchQuery()
      },
      searchReset () {
        this.queryParam.prjName = ''
        this.queryParam.applyGroupId = ''
        this.queryParam.prjManagerName = ''
        this.queryParam.prjManagerFullname = ''
        this.auditUsers1.value = []
        this.searchQuery()
      },
      handleCancel () { // 组件中点击取消
        this.$emit('cancel') // 回调
      },
      chose(record) { // 组件中点击选择
        this.$emit('select',record) // 回调并给父页面的回调函数传值
      }
    },
  }
</script>

<style scoped>

</style>