<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form >
        <a-row :gutter="24">
          <a-col :md="7" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="标准/制度名称">
              <a-input placeholder="请输入标准/制度名称" v-model="queryParam.fileName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="一级类别">
              <a-input placeholder="请输入一级类别" v-model="queryParam.categoryone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="二级类别">
              <a-input placeholder="请输入二级类别" v-model="queryParam.categorytwo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="3">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>

          <a-col :md="7" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级主管部门">
              <a-input placeholder="请输入上级主管部门" v-model="queryParam.superior"></a-input>
            </a-form-item>
          </a-col>

           <a-col :md="7" :sm="8">
             <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发布日期">
               <a-date-picker
                 v-model="queryParam.minStartTime"
                 format='YYYY-MM-DD'
                 placeholder="开始时间"/>
             </a-form-item>
           </a-col>
           <a-col :md="7" :sm="8">
             <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="至">
               <a-date-picker
                 v-model="queryParam.maxEndTime"
                 format="YYYY-MM-DD"
                 placeholder="结束时间"/>
             </a-form-item>
           </a-col>
          <a-col :md="3" :sm="3">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button
                type="primary"
                @click="resetBtn"
                icon="reload"
                style="margin-left: 8px"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div>
<a-row class="table">

    <a-col class="filter-menu" v-if="quicksearchtoggle">
      <a-collapse v-model="activeKey">
        <a-collapse-panel header="快速查询" key="1">
          <a-radio defaultChecked>默认</a-radio>
        </a-collapse-panel>
        <a-collapse-panel header="标准类别" key="2" :disabled='false'>
          <a-tree
            showLine
            :treeData=treeData
            @select="onSelect"
          >
          </a-tree>
        </a-collapse-panel>
      </a-collapse>
    </a-col>

  <div class="switch-visible" @click="handleQuickToggleSearch">
    <span :class="quicksearchtoggle ? 'show' : 'unshow'"></span>
  </div>
    <!-- table区域-begin -->
      <a-col class="table-content">
        <div>
          <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
            bordered
            ref="table"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange">

            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record,true)">查看</a>

             <!-- <a-divider type="vertical" />
              <a @click="batchAbandone

              ($event,record.id,record.processInstanceId)">删除</a>-->
            </span>
            <template slot="title">
              <div>
                <div>
                  <a-button @click="handleAdd" type="primary" icon="plus">启动</a-button>
                  <a-button
                    type="primary"
                    icon="edit"
                    class="btn-style"
                    size="small"
                    @click="editBtn()"
                    :disabled="disable"
                  >修改</a-button>
                  <a-button
                    type="primary"
                    @click="batchAbandone($event,selectedRowKeys)"
                    icon="delete"
                    class="btn-style"
                    size="small"
                    :disabled="disable"
                  >废弃</a-button>
                  <a-button
                    type="primary"
                    icon="plus"
                    class="btn-style"
                    size="small"
                    :disabled="disable"
                    @click="urge()"
                  >催办</a-button>
                  <a-button @click="resetBtn" type="primary" icon="reload">刷新</a-button>
                </div>
              </div>
            </template>
          </a-table>
        </div>
      </a-col>
</a-row>
    <!-- table区域-end -->
    </div>
    <!-- 表单区域 -->
    <document-modal ref="modalForm" @ok="modalFormOk"></document-modal>

    <a-modal title="催办"
            v-model="cuiban"
            :width="800"
            :maskClosable="false"
            style="top:5%;">
      <a-form :form="form">
        <a-row :gutter="24" >
          <a-col :span="14">
            <a-form-item label="多选组合" :labelCol="labelCol"
                         :wrapperCol="wrapperCol">
              <j-checkbox
                v-model="jcheckbox.values"
                :options="jcheckbox.options"
              />
            </a-form-item>
          </a-col>
  <!--        <a-col :span="10">多选组合(v-model)：{{ jcheckbox.values }}</a-col>-->
        </a-row>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  import DocumentModal from './modules/DocumentModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JCheckbox from '@/components/cmp/JCheckbox'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import { httpAction } from '@/api/manage'
  import qs from 'qs'
  import ACol from "ant-design-vue/es/grid/Col"
  import { getAction } from '@/api/manage'

  export default {
    name: "DocumentList",
    mixins:[CmpListMixin],
    components: {
      ACol,
      DocumentModal,
      JDictSelectTag,
      JCheckbox
    },

    data () {
      return {
        description: '制度文件管理管理页面',
        quicksearchtoggle:true,
        treeData:[],
        //催办弹窗
        cuiban:false,
        jcheckbox: {
          values: 'spring,cmpboot',
          options: [
            { label: '邮件通知', value: 'mail' },
            { label: '短信通知', value: 'text' },
            { label: '站内通知', value: 'inner', disabled: true },
          ]
        },
        //选择行信息
        selectedRowKeys: [],
        selectedRowContent:{},
        disable: true, // 控制催办按钮的显隐
        //默认展开项
        activeKey: ['1','2'],
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
            {
              title: '一级类别',
              align:"center",
              dataIndex: 'categoryone'
            },
            {
              title: '二级类别',
              align:"center",
              dataIndex: 'categorytwo'
            },
            {
              title: '标准/制度名称',
              align:"center",
              dataIndex: 'fileName'
            },
            {
              title: '标准/制度编号',
              align:"center",
              dataIndex: 'standardnumber'
            },
            {
              title: '发布日期',
              align:"center",
              dataIndex: 'uploadTime'
            },
            {
              title: '实施日期',
              align:"center",
              dataIndex: 'launchtime'
            },
            {
              title: '上级主管部门',
              align:"center",
              dataIndex: 'superiorName'
            },
            {
              title: '院内相关部门',
              align:"center",
              dataIndex: 'departmentName'
            },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/document/document/list",
          deleteBatch: "/flowable/delete",
          exportXlsUrl: "document/document/exportXls",
          importExcelUrl: "document/document/importExcel",
          getEntityName: '/sysFlow/flowConfig/getProcessDefinitionKeyByEntityName',
          all: "/documentCategory/documentCategory/all",
          tree:"/documentCategory/documentCategory/tree"
       },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
       //动态获取流程定义Key
       entityName: `Document`,
       processDefinitionKey: '',

    }
  },
    mounted() {
      getAction(this.url.tree, null).then((res) => {
        if (res.success) {
          this.treeData = res.result;
          // this.loading = false;
        } else {
          this.$message.warning(res.message);
          // this.loading = false;
        }
      });
    },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
  beforeCreate(){
        // 自行定义方法，引用字典
        //初始化字典
        initDictOptions('bpm_status').then((res) => {
          if (res.success) {
            this.statusDictOptions = res.result;
          }
        });
        initDictOptions('leave_type').then((res) => {
          if (res.success) {
            this.leaveDictOptions = res.result;
          }
        });
      },
      created() {
        // 获取流程定义key
        this.getEntity();
      },
    methods: {
        // 自定义废弃方法覆盖混合模式
            batchAbandone: function (event,id) {
              if(!this.url.deleteBatch){
                this.$message.error("请设置url.deleteBatch属性!")
                return
              }
              var ids = "";
              var processInsId= "";
              // 支持多项废弃的操作，通用方法
              if(this.selectedRowKeys.length > 1){
                for (var a = 0; a < this.selectedRowKeys.length; a++) {
                  ids += this.selectedRowKeys[a] + ",";
                }
              } else if (this.selectedRowKeys.length = 1 && this.selectedRowKeys[0] !== undefined) {
                ids = this.selectedRowKeys[0];
              } else {
                ids = id;
                if (id == undefined) {
                  this.$message.warning('请选择一条记录！');
                  return;
                } else {
                  ids = id;
                }
              }
              let params = {
                 id: ids,
                 processDefinitionKey: this.processDefinitionKey
              }
              let method = 'post';
              var that = this;
              this.$confirm({
                title: "确认删除",
                content: "是否删除选中数据?",
                onOk: function () {
                  httpAction(that.url.deleteBatch, qs.stringify(params), method).then((res) => {
                    if (res.success) {
                      that.$message.success(res.message);
                      that.loadData();
                      that.onClearSelected();
                    } else {
                      that.$message.warning('操作失败');
                    }
                  });
                }
              });
            },
      onSelect (selectedKeys, info) {
        console.log('selected', selectedKeys, info);
        if (selectedKeys.toString().length==3){
          console.log('start to search categoryone!');
          this.queryParam.categoryone = info.selectedNodes[0].componentOptions.propsData.title;
          this.searchQuery();
          this.queryParam.categoryone = '';
        }else{
          this.queryParam.categorytwo = info.selectedNodes[0].componentOptions.propsData.title;
          this.searchQuery();
          this.queryParam.categorytwo = '';
        }
      },
      handleQuickToggleSearch(){
        this.quicksearchtoggle = !this.quicksearchtoggle;
      },

      // 选择行
      onSelectChange(selectedRowKeys,selectedRows) {
        console.log('选择的主键ID => ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
        this.disable = false;
        this.selectedRowContent = selectedRows[0];
        console.log(this.selectedRowContent);
      },

      //选择行后的修改按钮
      editBtn(){
        this.handleEdit(this.selectedRowContent);
      },

      resetBtn(){
          this.selectedRowKeys = [];
          this.searchReset();
          this.disable = true;
      },

      urge(){
        this.cuiban = !this.cuiban;
      },
    },
    watch: {
      activeKey(key){
        console.log(key)
      }
    },
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/less/topBtns.less';

  div.ant-row.table {
    display: flex;

    div.filter-menu {
      width: 250px;
    }
    div.table-content {
      flex: 1;
      .ant-table-title {
        & > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          & > div button {
            margin-left: 10px;
            width: 80px;
          }
        }
      }
    }
  }

  div.switch-visible {
    width: 15px;
    height: 48px;
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin: 0 5px;
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