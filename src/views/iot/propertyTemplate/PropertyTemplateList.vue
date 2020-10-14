<!--属性模板列表 -->
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
              <a-col :md="18" :sm="18">
                <a-row :gutter="24">
                  <a-col :md="8" :sm="8">
                    <a-form-item label="属性模板名称">
                      <j-input-lk
                        placeholder="请输入属性模板名称"
                        @enterSearch="enterSearch($event, 'typeName')"
                        @inputValueLk="inputValueLk($event, 'typeName')"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
                  </a-col>
                  <a-col :md="8" :sm="8">
                    <a-form-item label="模板标识符">
                      <j-input-lk
                        placeholder="请输入模板标识符"
                        @enterSearch="enterSearch($event, 'typeKey')"
                        @inputValueLk="inputValueLk($event, 'typeKey')"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
                  </a-col>
                  <!--          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">-->
                  <!--            <span class="table-page-search-submitButtons serachLeft">-->
                  <!--              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
                  <!--              <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>-->
                  <!--            </span>-->
                  <!--          </a-col>-->
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
        <!-- 操作按钮区域 -->
        <div class="table-operator" v-if="projectMsg">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!-- <a-button @click="handleTest" type="primary" icon="plus">测试</a-button> -->
          <span class="right-button">
            <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="header"
            :action="importExcelUrl"
            @change="handleImportExcel"
            >
              <a-button class="default-button"  icon="cloud-upload">导入</a-button>
            </a-upload>

            <a href="/file/水质监测设备属性模板.xlsx" download="模板属性表.xlsx">
              <a-button class="default-button" icon="download">模板下载</a-button>
            </a>
          </span>
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
            style="margin-top : 8px;"
          >
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record,'查看')">查看</a>
              <span v-if="projectMsg">
                <a-divider type="vertical" />
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="handleDelete(record.id)">删除</a>
              </span>
            </span>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <PropertyTemplateModal ref="modalForm" @ok="modalFormOk"></PropertyTemplateModal>
    <FormulaSettingModal ref="formulaForm" @ok="formulaOk"></FormulaSettingModal>
  </a-card>
</template>

<script>
import PropertyTemplateModal from './modules/PropertyTemplateModal'
import FormulaSettingModal from './modules/FormulaSettingModal'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { deleteAction, downFile } from '@/api/manage'
import JInputLk from '@/components/cmp/JInputLk'
import ProjectTree from '../ProjectTree'
import { ProjectTreeMixin } from '../js/ProjectTreeMixin'
import Vue from 'vue'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'

export default {
  name: 'PropertyTemplateList',
  mixins: [myCmpListMixin, ProjectTreeMixin],
  components: {
    FormulaSettingModal,
    ProjectTree,
    PropertyTemplateModal,
    JInputLk
  },
  data () {
    return {
      importExcelUrl: '/ecidi-cmp/propertyTemplate/propertyTemplate/importBatchProps',
      header: {},
      description: '属性模板表管理页面',
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
          title: '属性模板名称',
          align: 'left',
          dataIndex: 'typeName',
          sorter: true,
          validateRules: [
            {
              required: true, // 必填
              message: '请输入${title}' // 显示的文本
            }
          ]
        },
        {
          title: '模板标识符',
          align: 'left',
          dataIndex: 'typeKey',
          sorter: true,
          validateRules: [
            {
              required: true, // 必填
              message: '请输入${title}' // 显示的文本
            },
            {
              pattern: /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/, // 正则
              message: '${title}必须以字母开头，可包含数字、下划线、横杠'
            }
          ]
        },
        {
          title: '录入人',
          align: 'left',
          width: 160,
          sorter: true,
          dataIndex: 'inputerFullname'
        },
        {
          title: '录入时间',
          align: 'left',
          width: 200,
          sorter: true,
          dataIndex: 'createTime'
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
        list: '/propertyTemplate/propertyTemplate/listByUserPrj',
        delete: '/propertyTemplate/propertyTemplate/delete',
        deleteBatch: '/propertyTemplate/propertyTemplate/deleteBatch',
        exportXlsUrl: '/propertyTemplate/propertyTemplate/exportXls',
        importExcelUrl: '/propertyTemplate/propertyTemplate/importExcel'
      }
    }
  },
  created () {
    // ProjectTreeMixin中方法
    this.judgeCorpOrPrjThenLoadData()

    const userInfo = Vue.ls.get(USER_INFO)
    // const proInfo = Vue.ls.get('PROJECT_MESSAGE')
    const proInfo = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log('create(): userinfo==>', userInfo, '  proInfo==>', proInfo)
    this.header = {
      'X-Access-Token': Vue.ls.get(ACCESS_TOKEN),
      corpCode: proInfo.corpCode,
      createBy: userInfo.username,
      prjCode: proInfo.prjCode
    }
    console.log('create():header==>', this.header)
  },
  methods: {
    handleDownload (batchCode) {
      // console.log('handleDownload:batchCode==>',batchCode)
      // this.queryParam.batchCode = batchCode
      const param = { batchCode: batchCode }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param.selections = this.selectedRowKeys.join(',')
      }
      downFile(this.url.exportXlsUrl, param).then(data => {
        console.log('downFile():data=>', data)
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), '设备信息表-批次：' + batchCode + '.xls')
        } else {
          const url = window.URL.createObjectURL(new Blob([data]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '设备信息表-批次：' + batchCode + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
    batchAbandone: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      const that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData(-1)
            } else {
              that.$message.warning('操作失败')
            }
          })
        }
      })
    },
    // 控制表头居中
    customHeaderRow (record) {
      // record.forEach(item => {
      //   item.align = 'center'
      // })
    },
    // 公式配置modal测试
    handleTest () {
      this.$refs.formulaForm.show()
      this.$refs.formulaForm.title = '公式配置'
    },
    formulaOk () {
      //
      console.log('into formulaOk')
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
.right-button {
  margin-left: auto;
  height: 36px;
  .default-button{
    height: 36px;
    margin-right: 0px;
    margin-left: 6px;
  }
}
.search-buttons-content {
  position: absolute;
  margin-right: 16px;
  right: -4px;
}
</style>
