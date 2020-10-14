<!--参数单位列表  -->
<template>
  <a-card :bordered="false">
    <a-layout>
      <!--项目树-->
      <projectTree
        ref="projectTree"
        @getSelectMessage="getSelectMessage"
        @defaultFocus="initTable"
      ></projectTree>
      <a-layout-content>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col
                :md="18"
                :sm="18"
              >
                <a-row :gutter="24">
                  <a-col
                    :md="8"
                    :sm="8"
                  >
                    <a-form-item label="参数">
                      <j-input-lk
                        placeholder="请输入参数名"
                        @enterSearch="enterSearch($event, 'name')"
                        @inputValueLk="inputValueLk($event, 'name')"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
                  </a-col>
                  <a-col
                    :md="8"
                    :sm="8"
                  >
                    <a-form-item label="单位">
                      <j-input-lk
                        placeholder="请输入单位"
                        @enterSearch="enterSearch($event, 'unitType')"
                        @inputValueLk="inputValueLk($event, 'unitType')"
                        :reset="clickReset"
                      ></j-input-lk>
                    </a-form-item>
                  </a-col>
                  <!--              <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">-->
                  <!--                <span class="table-page-search-submitButtons serachLeft">-->
                  <!--                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
                  <!--                  <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>-->
                  <!--                </span>-->
                  <!--              </a-col>-->
                </a-row>
              </a-col>
              <a-col
                :md="6"
                :sm="24"
              >
                <div class="search-buttons-content">
                  <span class="table-page-search-submitButtons serachLeft">
                    <a-button
                      type="primary"
                      @click="searchQuery"
                      icon="search"
                    >查询</a-button>
                    <a-button
                      type="primary"
                      @click="mySearchReset"
                      icon="reload"
                    >重置</a-button>
                  </span>
                </div>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 操作按钮区域 -->
        <div
          class="table-operator"
          v-if="projectMsg"
        >
          <a-button
            @click="handleAdd"
            type="primary"
            icon="plus"
          >新增
          </a-button>
          <span class="right-button">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :headers="header"
              :action="importExcelUrl"
              @change="handleImportExcel"
            >
              <a-button
                class="default-button"
                icon="cloud-upload"
              >导入</a-button>
            </a-upload>
            <!--          ../../../../public/file/logo.png-->
            <a
              href="/file/参数单位模板.xlsx"
              download="参数单位表.xlsx"
            >
              <a-button
                class="default-button"
                icon="download"
              >模板下载</a-button>
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
            <span
              slot="action"
              slot-scope="text, record"
            >
              <a @click="handleEdit(record,'查看')">查看</a>
              <span v-if="projectMsg">
                <a-divider type="vertical"/>
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical"/>
                <a @click="handleDelete(record.id)">删除</a>
              </span>
            </span>
          </a-table>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->
    <!-- 表单区域 -->
    <propertiesUnit-modal
      ref="modalForm"
      @ok="modalFormOk"
    ></propertiesUnit-modal>
  </a-card>
</template>

<script>
import PropertiesUnitModal from './modules/PropertyUnitModal'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import { deleteAction } from '@/api/manage'
import JInputLk from '@/components/cmp/JInputLk'
import ProjectTree from '../ProjectTree'
import { ProjectTreeMixin } from '../js/ProjectTreeMixin'
import Vue from 'vue'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'

export default {
  name: 'PropertyUnitList',
  mixins: [myCmpListMixin, ProjectTreeMixin],
  components: {
    PropertiesUnitModal,
    JInputLk,
    ProjectTree
  },
  data () {
    return {
      importExcelUrl: '/ecidi-cmp/propertyUnit/propertyUnit/importBatchUnits',
      header: {},
      description: '设备参数单位管理页面',
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
          title: '参数',
          align: 'left',
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '单位',
          align: 'left',
          dataIndex: 'unitType',
          sorter: true
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
        list: '/propertyUnit/propertyUnit/listByUserPrj',
        delete: '/propertyUnit/propertyUnit/delete',
        deleteBatch: '/propertyUnit/propertyUnit/deleteBatch',
        exportXlsUrl: 'propertiesunit/propertiesUnit/exportXls',
        importExcelUrl: 'propertiesunit/propertiesUnit/importExcel'
      }
    }
  },
  created () {
    // ProjectTreeMixin中方法
    this.judgeCorpOrPrjThenLoadData()

    let userInfo = Vue.ls.get(USER_INFO)
    // let proInfo = Vue.ls.get('PROJECT_MESSAGE')
    let proInfo = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    this.header = {
      'X-Access-Token': Vue.ls.get(ACCESS_TOKEN),
      corpCode: proInfo.corpCode,
      createBy: userInfo.username,
      prjCode: proInfo.prjCode
    }
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
          deleteAction(that.url.delete, { id: id }).then((res) => {
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
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';

/deep/.ant-card-body {
  padding: 16px 16px;
}
  .right-button {
    margin-left: auto;
    height: 36px;

    .default-button {
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
