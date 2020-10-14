<template>
  <div>
    <a-modal
      :footer="null"
      title="选择角色"
      :width="1000"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      style="top:5%;"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="角色名称">
                <a-input
                  placeholder="请输入角色名称"
                  v-model="queryParam.roleName"
                  @keyup.enter="mySearchQuery"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="角色编码">
                <a-input
                  placeholder="请输入角色编码"
                  v-model="queryParam.roleCode"
                  @keyup.enter="mySearchQuery"
                ></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="mySearchQuery" icon="search">查询</a-button>
                <a-button
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                >重置</a-button>
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
          @change="handleTableChange"
        >
          <!--插槽-->
          <span slot="action" slot-scope="text, record">
            <a @click="chose(record)">选择</a>
          </span>
          <span slot="rolename" slot-scope="text">
            <span class="rolename">
              <span>{{text}}</span>
            </span>
          </span>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'

export default {
  name: 'JSelectRoleModal',
  mixins: [CmpListMixin],
  props: {
    visible: {
      type: Boolean, // 定义属性的类型
      defaultValue: false // 定义该属性的默认值
    }
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
          title: '角色名称',
          align: 'center',
          dataIndex: 'roleName',
          scopedSlots: { customRender: 'rolename' }
        },
        {
          title: '角色编码',
          align: 'center',
          dataIndex: 'roleCode'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sys/role/list'
      },
      //选人组件
      model: {},
      roleName: '',
      roleCode: ''
    }
  },
  create() {
    // 初始化Form表单
    this.form.resetFields()
  },
  methods: {
    mySearchQuery() {
      // this.queryParam.roleName = this.roleName
      // this.queryParam.roleCode = this.roleCode
      this.searchQuery()
    },
    searchReset() {
      this.queryParam.roleName = ''
      this.queryParam.roleCode = ''
      this.searchQuery()
    },
    handleCancel() {
      // 组件中点击取消
      this.$emit('cancel') // 回调
    },
    chose(record) {
      // 组件中点击选择
      this.$emit('select', record) // 回调并给父页面的回调函数传值
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/common.less';
/deep/span.rolename {
  display: inline-block;
  white-space: nowrap;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666666;
}
</style>