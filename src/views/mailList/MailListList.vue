<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="真实姓名">
              <a-input placeholder="请输入真实姓名" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="电话">
              <a-input placeholder="请输入电话号码" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="办公地址">
                <a-input placeholder="请输入办公地址" v-model="queryParam.password"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="电子邮箱">
                <a-input placeholder="请输入电子邮箱" v-model="queryParam.salt"></a-input>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('通讯录')">导出</a-button>
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
      <div class="ant-alert ant-alert-info">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user" />
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a @click="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <mailList-modal ref="modalForm" @ok="modalFormOk"></mailList-modal>
  </a-card>
</template>

<script>
import MailListModal from './modules/MailListModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { deleteAction } from '@/api/manage'

export default {
  name: 'MailListList',
  mixins: [CmpListMixin],
  components: {
    MailListModal
  },
  data() {
    return {
      description: '通讯录管理页面',
      queryParam: {},
      userTypeList: null,
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
          title: '姓名',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '电话',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '小组名',
          align: 'center',
          dataIndex: 'groupName'
        },
        {
          title: '电子邮件',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: '部门名称',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '用户类型',
          align: 'center',
          dataIndex: 'userType',
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.userTypeList, text)
          }
        },

        {
          title: '办公号码',
          align: 'center',
          dataIndex: 'officePhone'
        },
        {
          title: '办公地址',
          align: 'center',
          dataIndex: 'address'
        },
        {
          title: '头像',
          align: 'center',
          width: 120,
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatarslot' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/mailList/mailList/list',
        delete: '/mailList/mailList/delete',
        deleteBatch: '/mailList/mailList/deleteBatch',
        exportXlsUrl: 'mailList/mailList/exportXls',
        importExcelUrl: 'mailList/mailList/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  beforeCreate() {
    // 自行定义方法，引用字典
    //初始化字典
    initDictOptions('bpm_status').then(res => {
      if (res.success) {
        this.statusDictOptions = res.result
        console.log(this.statusDictOptions, 'this.statusDictOptions')
      }
    })
    initDictOptions('leave_type').then(res => {
      if (res.success) {
        this.leaveDictOptions = res.result
      }
    })

    initDictOptions('mail_user_type').then(res => {
      if (res.success) {
        this.userTypeList = res.result
        console.log('this.userTypeList ', this.userTypeList)
      }
    })
    /*initDictOptions("meeting_level").then((res) =>{
      if(res.success) {
        this.userTypeList = res.result;
        console.log("meet ",this.userTypeList );
      }
    })*/
  },
  methods: {
    handleDelete: function(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function() {
          deleteAction(that.url.delete, { id: id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    getAvatarView: function(avatar) {
      console.log(this.url.imgerver + '/' + avatar)
      return this.url.imgerver + '/' + avatar
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>