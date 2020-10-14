<template>
  <div>
    <div></div>
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="文件名">
                <a-input placeholder="请输入文件名" v-model="queryParam.fileName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="文件类型">
                <a-input placeholder="请输入文件类型" v-model="queryParam.fileType"></a-input>
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :md="6" :sm="8">
                <a-form-item label="上传时间">
                  <a-input placeholder="请输入上传时间" v-model="queryParam.uploadTime"></a-input>
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
        <!-- 文件上传 -->

        <a-upload
          :action="uploadAction"
          listType="picture"
          :headers="headers"
          :fileList="fileList"
          @change="handleChange"
          :multiple="false"
          :showUploadList="false"
          class="upload-list-inline"
        >
          <a-button type="primary">
            <a-icon type="upload" />文件上传
          </a-button>
        </a-upload>
        <a-button type="primary">
          <a-icon type="plus" />新建文件
        </a-button>
        <a-popover>
          <template slot="content">
            <p>导出列表信息</p>
          </template>
          <a-button type="primary" icon="download" @click="handleExportXls('上传文件')">导出</a-button>
        </a-popover>
        <a-upload
          name="file"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="importExcelUrl"
          @change="handleImportExcel"
        >
          <a-popover>
            <template slot="content">
              <p>导入列表信息</p>
            </template>
            <a-button type="primary" icon="import">导入</a-button>
          </a-popover>
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
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>

            <a-divider type="vertical" />
            <a @click="handleDelete(record.id)">预览</a>

            <a-divider type="vertical" />
            <a @click="handleDelete(record.id)">下载</a>

            <a-divider type="vertical" />
            <a @click="handleDelete(record.id)">删除</a>
          </span>
        </a-table>
      </div>
      <!-- table区域-end -->

      <!-- 弹窗区域 -->
      <fileEdit-modules ref="modalForm" :json="jsonData" v-if="isvisible" @closeFile="closeFile"></fileEdit-modules>
    </a-card>
  </div>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText, JDictSelectTag } from '@/components/dict/JDictSelectUtil'
import { httpAction, deleteAction, getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import qs from 'qs'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import fileEditModules from './modules/fileEditModules'

export default {
  name: 'UploadFileList',
  mixins: [CmpListMixin],
  components: {
    fileEditModules
  },
  data() {
    return {
      description: '在线文件管理页面',
      isvisible: false,
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
          title: '文件名',
          align: 'center',
          dataIndex: 'fileName'
        },
        {
          title: '上传时间',
          align: 'center',
          dataIndex: 'uploadTime'
        },
        {
          title: '上传者',
          align: 'center',
          dataIndex: 'uploadUser'
        },
        {
          title: '文件大小',
          align: 'center',
          dataIndex: 'fileSize'
        },
        {
          title: '下载次数',
          align: 'center',
          dataIndex: 'downloadTimes'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/file/uploadFile/list',
        delete: '/file/uploadFile/delete',
        deleteBatch: '/file/uploadFile/deleteBatch',
        exportXlsUrl: 'file/uploadFile/exportXls',
        importExcelUrl: 'file/uploadFile/importExcel',
        addOnlineFile: '/file/uploadFile/addOnlineFile',
        fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/addOnlineFile',
        fileEdit: '/office/only/getEditRight'
      },
      onlinePath: '',
      headers: null,
      // previewImage: '',
      // previewVisible: false,
      fileList: [],
      attachment: [
        {
          groupId: '',
          fileTokens: '',
          fieldName: 'attachment',
          tableName: 'doc_main'
        }
      ],
      json: {}
    }
  },

  beforeCreate() {
    // 自行定义方法，引用字典
    //初始化字典
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
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.attachment[0].fileTokens = ''
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    uploadAction() {
      return this.url.fileUpload
    },
    jsonData() {
      return this.json
    }
  },

  methods: {
    handleChange(info) {
      //调用改变方法
      this.handleChange1(info, this, 0)
      this.searchReset()
    },
    handlePicCancel() {
      this.previewVisible = false
    },
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
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      params.type = '1'
      console.log(params, '自渡川')
      this.loading = true
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        this.loading = false
      })
    },
    handleEdit(record) {
      console.log(record, 'record')

      let params = { id: record.id, edit: true }
      params = qs.stringify(params)
      console.log(params)
      postAction(this.url.fileEdit, params).then(res => {
        if (res.success) {
          console.log(res, 'res')
          let json = res.result
          console.log(JSON.parse(json), 'json')
          this.json = JSON.parse(json)
          this.isvisible = true
        }
      })
    },
    closeFile(){
      this.isvisible = false
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
:global(.fileEdit){
  border-color: red;
  color: red;
  background-color: red;
}
  :global(.ant-modal-body){
    height: 1200px;
  }
</style>