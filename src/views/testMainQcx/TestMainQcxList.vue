<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row :gutter="24">
          <span class="serachRight">
            <a-button type="primary" @click="mySearchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="mySearchReset" icon="reload">重置</a-button>
          </span>
          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目名称">
              <a-input v-model="queryParam.prjName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目负责人">
              <a-input v-model="queryParam.prjManagerFullname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
              <j-dict-select-tag
                v-model="queryParam.status"
                dictCode="bpm_status"
              />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请单位">
              <a-input v-model="queryParam.applyGroupName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="填写日期">
              <a-row>
                <a-col :md="11" :sm="11">
                  <a-date-picker
                    placeholder=""
                    :disabledDate="disabledStartDate"
                    format="YYYY-MM-DD"
                    v-model="startValue"
                    @openChange="handleStartOpenChange"
                  ></a-date-picker>
                </a-col>
                <a-col :md="2" :sm="2" style="text-align: center">
                  至
                </a-col>
                <a-col :md="11" :sm="11">
                  <a-date-picker
                    placeholder=""
                    :disabledDate="disabledEndDate"
                    format="YYYY-MM-DD"
                    v-model="endValue"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                  ></a-date-picker>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="7">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目级别">
              <j-dict-select-tag
                v-model="queryParam.prjRank"
                dictCode="prj_level_qcx"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-layout>
      <a-layout-sider width="250px"
                      theme="light"
                      collapsedWidth="0"
                      :trigger="null"
                      collapsible
                      v-model="collapsed">
        <!--部门树查询组件-->
        <!--<j-left-tree-->
          <!--@searchByTree="searchByTree"-->
          <!--:header="JLeftTree.header"-->
          <!--:searchKey="JLeftTree.searchKey"-->
          <!--:tableName="JLeftTree.tableName"-->
          <!--:parentId="JLeftTree.parentId"-->
          <!--:optionName="JLeftTree.optionName"-->
          <!--:permisson="JLeftTree.permisson"-->
          <!--desc-->
          <!--:sortCondition="JLeftTree.sortCondition"-->
        <!--&gt;</j-left-tree>-->

        <!--数据字典查询-->
        <j-left-tree @searchByTree="searchByTree"
                     header="项目领域"
                     dictCode="prj_type_qcx"
                     ></j-left-tree>
      </a-layout-sider>
      <!-- 切换按钮 -->
      <div class="switch-visible" @click="switchVisible">
        <span :class="!collapsed ? 'show' : 'unshow'"></span>
      </div>
      <a-layout-content>
        <!-- table区域-begin -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">发起</a-button>
          <a-button
            v-has="'user:qcxAdmin'"
            type="primary"
            icon="edit"
            @click="changeRow(selectedObject)"
            :disabled="disable"
          >修改
          </a-button>
          <a-button
            v-has="'user:qcxAdmin'"
            type="primary"
            @click="delCharge(selectedObject)"
            icon="delete"
            :disabled="disable"
          >废弃
          </a-button>
          <a-button
            v-has="'user:qcxAdmin'"
            @click="doNotify(selectedRowKeys,index)"
            type="primary"
            icon="bell"
            :disabled="disable"
          >催办
          </a-button>
          <a-button @click="mySearchReset" type="primary" icon="reload">刷新</a-button>
        </div>
        <div>
          <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio',}"
            ref="table"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
            :customRow="clickThenCheck">
              <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record,'查看')">查看</a>
              </span>
          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <testMainQcx-modal ref="modalForm" @ok="modalFormOk"></testMainQcx-modal>
  </a-card>
</template>

<script>
  import TestMainQcxModal from './modules/TestMainQcxModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import { httpAction } from '@/api/manage'
  import qs from 'qs'
  import ARow from 'ant-design-vue/es/grid/Row'
  import JLeftTree from '@/components/cmp/JLeftTree'

  export default {
    name: 'TestMainQcxList',
    mixins: [CmpListMixin],
    components: {
      JLeftTree,
      ARow,
      TestMainQcxModal,
      JDictSelectTag
    },
    data() {
      return {
        selectKey: [],
        selectedRowKeys: [],
        selectedObject: {},
        radioValue: true,
        prjType: [],
        activeKey: ['1', '2'],
        startValue: null,
        endValue: null,
        endOpen: false,
        description: '科研项目立项建议管理页面',
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
            title: '项目名称',
            align: 'center',
            dataIndex: 'prjName'
          },
          {
            title: '项目负责人',
            align: 'center',
            dataIndex: 'prjManagerFullname'
          },

          {
            title: '申请单位',
            align: 'center',
            dataIndex: 'applyGroupName'
          },
          {
            title: '计划开始日期',
            align: 'center',
            dataIndex: 'startTime'
          },
          {
            title: '计划结束日期',
            align: 'center',
            dataIndex: 'endTime'
          },
          {
            title: '总经费（元）',
            align: 'center',
            dataIndex: 'totalCost'
          },
          {
            title: '项目领域',
            align: 'center',
            dataIndex: 'prjType',
            customRender: (text, record, index) => {
              return filterDictText(this.prjType, text)
            }
          },
          {
            title: '填写时间',
            align: 'center',
            dataIndex: 'inputDate'
          },
          {
            title: '填写人',
            align: 'center',
            dataIndex: 'inputerFullname'
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            customRender: (text, record, index) => {
              //字典值替换通用方法
              return filterDictText(this.statusDictOptions, text)
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/test/testMainQcx/list',
          deleteBatch: '/flowable/delete',
          exportXlsUrl: 'test/testMainQcx/exportXls',
          importExcelUrl: 'test/testMainQcx/importExcel'
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 }
        },
        disable: true, // 控制催办按钮的显隐
        titleType: '', // 标题的研究领域
        JLeftTree: {
          header: '申请单位',
          searchKey: 'id',
          tableName: 'sys_depart',
          parentId: 'parent_id',
          optionName: 'depart_name',
          sortCondition: 'depart_name',
          permisson: '1' // 0:查询所属公司下所有节点 1:查询所属子部门下的所有节点
        },
        collapsed: false,
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
      initDictOptions('bpm_status').then((res) => {
        if (res.success) {
          this.statusDictOptions = res.result
        }
      })
      initDictOptions('prj_level_qcx').then((res) => {
        if (res.success) {
          this.prjLevel = res.result
        }
      })
      initDictOptions('prj_type_qcx').then((res) => {
        if (res.success) {
          //倒序排序
          this.prjType = res.result.reverse()
          console.log(this.prjType,'字典数组倒序排序')
        }
      })
    },
    methods: {
      // 判断是否可删除
      delCharge(selectedObject) {
        if (selectedObject.status == '2' || selectedObject.status == '3') {
          this.$message.warn('已完成或者已废弃的工单不可删除')
        } else {
          this.batchAbandone(selectedObject.id)
        }
      },
      // 自定义废弃方法覆盖混合模式
      batchAbandone: function(event, id) {
          console.log(event, id, '删除方法')
        if (!this.url.deleteBatch) {
          this.$message.error('请设置url.deleteBatch属性!')
          return
        }
        var ids = ''
        var processInsId = ''
        // 支持多项废弃的操作，通用方法
        if (this.selectedRowKeys.length > 1) {
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ','
          }
        } else if (this.selectedRowKeys.length = 1 && this.selectedRowKeys[0] !== undefined) {
          ids = this.selectedRowKeys[0]
        } else {
          ids = id
          if (id == undefined) {
            this.$message.warning('请选择一条记录！')
            return
          } else {
            ids = id
          }
        }
        let params = {
          id: ids,
          processDefinitionKey: 'test_main_qcx'
        }
        let method = 'post'
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function() {
            httpAction(that.url.deleteBatch, qs.stringify(params), method).then((res) => {
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
      //日历控件绑定方法
      disabledStartDate(startValue) {
        const endValue = this.endValue
        if (!startValue || !endValue) {
          return false
        }
        return startValue.valueOf() > endValue.valueOf()
      },
      disabledEndDate(endValue) {
        const startValue = this.startValue
        if (!endValue || !startValue) {
          return false
        }
        return startValue.valueOf() >= endValue.valueOf()
      },
      handleStartOpenChange(open) {
        if (!open) {
          this.endOpen = true
        }
      },
      handleEndOpenChange(open) {
        this.endOpen = open
      },
      // 重置表格状态
      resertTable() {
        this.selectedRowKeys = []
        this.disable = true
      },
      // 页面刷新
      mySearchReset() {
        this.resertTable()
        this.startValue = null
        this.endValue = null
        this.searchReset()
      },
      // 查询方法customStyle
      mySearchQuery() {
        this.resertTable()
        this.searchQuery()
      },
      // 选择行
      onSelectChange(selectedRowKeys, index) {
        console.log('选择的主键ID => ', selectedRowKeys)
        console.log('选择的对象 => ', index)
        this.selectedRowKeys = selectedRowKeys
        this.selectedObject = index[0]
        this.disable = false
      },
      //编辑行
      changeRow(selectedObject) {
        this.handleEdit(selectedObject)
      },
      // 根据树节点的key获取项目领域的文本
      getPrjTypeByKey(key) {
        const arr = this.prjType
        for (let i = 0; i < arr.length; i++) {
          if (key == arr[i].value) {
            return arr[i].title
          }
        }
      },
      // 催办业务
      doNotify(selectedRowKeys) {
        this.$message.success('业务编码为' + selectedRowKeys + '的工单催办完成！')
      },
      // 设置行属性
      clickThenCheck(record) {
        return {
          on: { // 事件
            //点击行
            click: () => {
              this.onSelectChange(record.id.split(','), [record])
            }
          }
        }
      },
      // 根据部门查询
      searchByTree(key) {
        console.log(key, 'key')
        if (key) {
          this.queryParam.prjType = key
          this.searchQuery()
          this.resertTable()
        } else {
          this.queryParam.prjType = ''
          this.searchQuery()
          this.resertTable()
        }
      },
      //控制查询面板的显隐
      switchVisible() {
        this.collapsed = !this.collapsed
      }
    },
    watch: {
      //监听日历控件选择日期动作
      startValue(val) {
        if (val != null) {
          console.log(val.format('YYYY-MM-DD'))
          this.queryParam.minStartTime = val.format('YYYY-MM-DD')
        }
      },
      endValue(val) {
        if (val != null) {
          console.log(val.format('YYYY-MM-DD') + ' ' + '23:59:59')
          this.queryParam.maxStartTime = val.format('YYYY-MM-DD') + ' ' + '23:59:59'
        }
      },
      activeKey(key) {
        // console.log(key)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';
  @import '~@assets/less/modal.less';

  .row-content {
    display: flex;
    display: -webkit-flex;
    align-items: stretch;
  }

  div.switch-visible {
    width: 15px;
    height: 48px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin: 0 10px 0 0;
    cursor: pointer;
  }

  span.show,
  span.unshow {
    position: relative;
  }
  span.show:after {
    content: '';
    position: absolute;
    top: -8px;
    right: -10px;
    display: inline-block;
    width: 8px;
    height: 16px;
    border-right: 8px solid #444;
    border-top: 8px solid #fff;
    border-left: 0px solid #fff;
    border-bottom: 8px solid #fff;
  }
  span.unshow:after {
    content: '';
    position: absolute;
    top: -8px;
    left: 3px;
    display: inline-block;
    width: 8px;
    height: 16px;
    border-right: 0px solid #fff;
    border-top: 8px solid #fff;
    border-left: 8px solid #444;
    border-bottom: 8px solid #fff;
  }
</style>