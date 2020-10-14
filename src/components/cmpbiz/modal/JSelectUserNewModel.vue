<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <div class="title">
      <div>
        <img src="@/assets/img/login/selectUser.png" />
        选择用户
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel"/>
    </div>
    <a-row :gutter="13">
      <a-col :span="13">
        <a-tree-select
          class="treeSelect"
          style="width: 100%;margin-bottom: 10px;"
          :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
          :treeData="departTree"
          placeholder='请选择部门'
          @select="this.onSelectDepart"
          treeDefaultExpandAll
          v-model="value"
          allowClear
          dropdownMatchSelectWidth
        >
          <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
            Child Node1 {{value}}
          </span>
        </a-tree-select>
        <a-input-search
          placeholder="输入账号或姓名搜索"
          style="width: 100%;margin-bottom:10px;"
          @search="searchQuery"
          v-model="queryParam.dimName"
        />
          <!-- table区域-begin -->
            <a-tabs type="card">
              <a-tab-pane tab="用户列表" key="1">
                <div style="border:1px solid #e8e8e8;height:350px;">
                  <a-table
                    size="middle"
                    rowKey="id"
                    :columns="columns1"
                    :dataSource="dataSource1"
                    :pagination="ipagination"
                    :loading="loading"
                    :scroll="{ y: 250 }"
                    style="border-top:unset;"
                    :rowSelection="{selectedRowKeys: selectedRowKeys,onSelectAll:onSelectAll,onSelect:onSelect,onChange: onSelectChange, type: type}"
                    @change="handleTableChange">
                  </a-table>
                </div>
              </a-tab-pane>
              <a-tab-pane tab="最近添加" key="2">
                <div style="border:1px solid #e8e8e8;height:350px;">
                  <a-table               
                    size="middle"
                    rowKey="id"
                    :columns="columns1"
                    :dataSource="dataSource3"
                    :pagination="ipagination3"
                    :loading="loading"
                    :scroll="{ y: 250 }"
                    style="border-top:unset;"
                    :rowSelection="{selectedRowKeys: selectedRowKeys,onSelectAll:onSelectAll,onSelect:onSelect,onChange: onSelectChange, type: type}"
                    @change="handleTableChange3">
                  </a-table>
                </div>
              </a-tab-pane>
            </a-tabs>
          <!-- table区域-end -->
      </a-col> 
      <a-col :span="1">
        <!-- <a-icon type="right" class="selectUserIcon" style="margin-top:200px;width:30px;height:30px;line-height:32px;text-algin:center;border-radius:50%;background: rgba(109,98,255,0.1)"/> -->
      </a-col>
      <a-col :span="10">
          <!-- table区域-begin -->
          <div>
            <div style="margin-bottom:10px;height:30px;">
              <span>已选用户</span>
              <a-button style="float:right;right:0;top:0;" @click="clearSelected">清除</a-button>
            </div>
            <div style="border:1px solid #e8e8e8;height:440px;">
              <a-table
                size="middle"
                rowKey="id"
                :columns="columns2"
                :dataSource="dataSource2"
                :loading="loading"
                :scroll="{ y: 400 }"
                class="selectedTable"
              >
                <span slot="action" slot-scope="text, record">
                  <a @click="handleDelete(record)">删除</a>
                </span>
              </a-table>
            </div>
          </div>
          <!-- table区域-end -->
      </a-col>
    </a-row>
    <a-row :gutter="24">
        <div class="btnClass">
          <div>
            <span>共选择</span>
            <span>&nbsp;{{ selectLng }}&nbsp;</span>
            <span>人</span>
          </div>
          <a-button @click="handleCancel" icon="close" style="margin-right:10px" class="cancel">关闭</a-button>
          <a-button @click="handleOk" icon="check" type="primary" style="margin-right:10px" class="confirm">确定</a-button>
        </div>
    </a-row>
  </a-modal>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getAction, postAction } from '@/api/manage'
  import { queryDepartTreeList, getUserList, queryUserByDepId, getLastlatestTwoList } from '@/api/api'
  import { mapGetters } from 'vuex';

  export default {
    name: 'JSelectUserNewModal',
    data () {
      return {
        title: "用户列表",
        names: [],
        visible: false,
        placement: 'right',
        description: '人员管理页面',
        selectedKeys: [],
        departTree: [],
        // 查询条件
        queryParam: {},
        // 表头
        columns1: [
          {
            title: '账号',
            align:"center",
            width: 100,
            dataIndex: 'username'
          },
          {
            title: '姓名',
            align:"center",
            width: 100,
            dataIndex: 'realname'
          },
          {
            title: '所属部门',
            align:"center",
            width: 100,
            dataIndex: 'departName'
          }
        ],
        columns2: [
          {
            title: '账号',
            align: "center",
            dataIndex: 'username'
          },
          {
            title: '姓名',
            align:"center",
            width: 80,
            dataIndex: 'realname'
          },
          {
            title: '所属部门',
            align:"center",
            width: 80,
            dataIndex: 'departName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width: 100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        //数据集
        dataSource1:[],
        dataSource2:[],
        dataSource3:[],
        // 分页参数
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          // showTotal: (total, range) => {
          //   return range[0] + "-" + range[1] + " 共" + total + "条"
          // },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        ipagination3:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          // showTotal: (total, range) => {
          //   return range[0] + "-" + range[1] + " 共" + total + "条"
          // },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter:{
          column: 'createTime',
          order: 'desc',
        },
        loading:false,
        selectedRowKeys: [],
        selectedRows: [],
        url: {
          list: "/test/cmpDemo/list",
          UserList: "/sys/user/batchQueryByUsernames",
          recentlyAdd: "/recentlyAdd/recentlyAdd/add"
        },
        value: undefined
      }
    },
    props: {
      selectListUser: {
        type: Array,
        required: false
      },
      multiple: {
        type: Boolean,
        required: false
      }
    },
    created() {
      this.loadData();
      // 加载吧部门树
      this.queryDepartTree();
      // 请求最近添加列表
      this.latestTwoSelected();
    },
    methods: {
      ...mapGetters(['userInfo']),
      searchQuery(){
        this.loadData(1);
      },
      searchReset(){
        this.queryParam={};
        this.loadData(1);
      },
      handleCancel() {
        this.visible = false;
        this.selectedRowKeys = [];
        this.selectionRows = [];
      },
      handleOk() {
        let userName = '';
        let realName = '';
        for (let i = 0;i<this.dataSource2.length;i++) {
          if (i == this.dataSource2.length-1) {
            userName += this.dataSource2[i].username;
            realName += this.dataSource2[i].realname;
          } else {
            userName += this.dataSource2[i].username + ',';
            realName += this.dataSource2[i].realname + ',';
          }
        }
        let params = {
          currentUsername: this.userInfo().username,
          currentFullname: this.userInfo().realname,
          username: userName,
          realname: realName
        }
        postAction(this.url.recentlyAdd,params).then((res) => {
          this.$emit("selectFinished",this.dataSource2);
          this.visible = false;
          this.selectedRowKeys = [];
          this.selectionRows = [];
          this.latestTwoSelected();
        })
        
      },
      add() {
        this.visible = true;
      },
      loadData (arg){
        //加载数据 若传入参数1则加载第一页的内容
        if(arg===1){
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams(this.ipagination);//查询条件
        // getAction(this.url.list,params).then((res)=>{
        //   if(res.success){
        //     this.dataSource1 = res.result.records;
        //     this.ipagination.total = res.result.total;
        //   }
        // })
        getUserList(params).then((res) => {
          var that = this;
          if (res.success) {
            that.dataSource1 = res.result.records;
            that.ipagination.total = res.result.total;
          }
        })
      },
      latestTwoSelected(arg) {
        if(arg===1){
          this.ipagination3.current = 1;
        }
        var params = this.getQueryParams(this.ipagination3);
        params.currentUsername = this.userInfo().username;
        params.currentRealname = this.userInfo().realname;
        getLastlatestTwoList(params).then((res) => {
          if (res.success) {
            this.dataSource3 = res.result.records;
            this.ipagination3.total = res.result.total;
          }
        })
      },
      getQueryParams(ipagination){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = ipagination.current;
        param.pageSize = ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField(){
        //TODO 字段权限控制
      },
      onSelectAll (selected, selectedRows, changeRows) {
        if (selected===true) {
          for (let a = 0;a<changeRows.length;a++) {
            var c = true;
            for (let b = 0;b<this.dataSource2.length;b++) {
              if (changeRows[a].username == this.dataSource2[b].username) {
                  c = false;
              }else{    
              }
            }
            if(c){
              this.dataSource2.push(changeRows[a]);
            }        
          }
        } else {
          for(var b = 0;b<changeRows.length;b++){
            this.dataSource2.splice(this.dataSource2.indexOf(changeRows[b]),1);
          }
        }
      },
      onSelect (record,selected) {
        if(selected===true){
          // 单选
          if (this.type == 'radio') {
            this.dataSource2 = [];
            this.dataSource2[0] = record;
          } else {
            if (this.dataSource2 == null) {
              this.dataSource2 = [];
            }
            for (let i = 0;i<this.dataSource2.length;i++) {
              if (this.dataSource2[i].username == record.username) {
                return;
              }
            }
            this.dataSource2.push(record); 
          }
        } else {
          var index = this.dataSource2.indexOf(record);
          if(index >=0 ){
            this.dataSource2.splice(this.dataSource2.indexOf(record),1);
          }

        }
      },
      onSelectChange (selectedRowKeys,selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectedRows;
      },
      onClearSelected(){
        this.selectedRowKeys = [];
        this.selectionRows = [];
      },
      handleDelete: function(record){
        this.dataSource2.splice(this.dataSource2.indexOf(record),1);
      },
      handleTableChange(pagination, filters, sorter){
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length>0){
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend"==sorter.order?"asc":"desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleTableChange3(pagination, filters, sorter){
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length>0){
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend"==sorter.order?"asc":"desc"
        }
        this.ipagination3 = pagination;
        this.latestTwoSelected();
      },
      queryDepartTree() {
        queryDepartTreeList().then((res) => {
          if (res.success) {
            this.departTree = res.result;
          }
        })
      },
      // 点击树节点,筛选出对应的用户
      onSelectDepart(selectedKeys) {
        if (selectedKeys[0] != null) {
          this.queryUserByDepId(selectedKeys); // 调用方法根据选选择的id查询用户信息
          if (this.selectedKeys[0] !== selectedKeys[0]) {
            this.selectedKeys = [selectedKeys[0]];
          }
        }
      },
      // 根据选择的id来查询用户信息
      queryUserByDepId(selectedKeys) {
        queryUserByDepId({ departId: selectedKeys.toString() }).then((res) => {
          if (res.success) {
            this.dataSource1 = res.result;
            this.ipagination.total = res.result.length;
          }
        })
      },
      byUserList() {
        this.dataSource2 = this.selectListUser;
        this.$emit("selectFinished",this.dataSource2);
      },
      clearSelected() {
        this.dataSource2 = [];
        this.$emit("selectFinished",this.dataSource2);
      }
    },
    watch: {
      selectListUser() {
        this.byUserList();
      }
    },
    computed: {
      selectLng() {
        return this.dataSource2.length;
      },
      type() {
        if (this.multiple) {
          return 'checkbox'
        } else {
          return 'radio'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .ant-card-body .table-operator{
    margin-bottom: 18px;
  }
  .ant-table-tbody .ant-table-row td{
    padding-top:15px;
    padding-bottom:15px;
  }
  .anty-row-operator button{margin: 0 5px}
  .ant-btn-danger{background-color: #ffffff}

  .ant-modal-cust-warp{height: 100%}
  .ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
  .ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}

  .title {
    width: 100%;
    padding: 0px 24px 24px 0px;
    div {
      font-size:16px;
      font-family:MicrosoftYaHeiUI;
      font-weight:bold;
      color:rgba(25,25,25,1);
      line-height:32px;
    }
    .closeIcon {
      cursor: pointer;
      border: 0;
      background: transparent;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
      font-weight: 700;
      line-height: 1;
      text-decoration: none;
      transition: color 0.3s;
      color: rgba(0, 0, 0, 0.45);
      outline: 0;
      padding: 0;
      display: block;
      font-style: normal;
      text-align: center;
      text-transform: none;
      text-rendering: auto;
      width: 76px;
      height: 86px;
      line-height: 86px;
      font-size: 16px;
    }
  }
  .btnClass {
    // padding: 32px 32px 0px 32px;
    margin-top: 20px;
    text-align: right;
    div {
      display: inline-block;
      margin-right: 20px;
      :nth-child(2) {
        font-weight: bold;
      }
    }
    button {
      margin: 0;
      padding: 0;
      border: 1px solid transparent;  //自定义边框
      outline: none;  //消除默认点击蓝色边框效果
    }
    .cancel {
      min-width:82px;
      height:36px;
      background:rgba(238,238,238,1);
      border-radius:4px;
      color:rgba(51,51,51,1);
      padding: 5px;
    }
    .confirm {
      min-width:82px;
      border-radius:4px;
      height:36px;
      padding: 5px;
    }
  }
  // 这是tabs样式
    .ant-tabs {
      :global(.ant-tabs-bar) {
        border-bottom: unset;
        margin-bottom: unset;
        :global(.ant-tabs-nav-container) {
          :global(.ant-tabs-nav-wrap) {
            :global(.ant-tabs-nav) {
              :global(.ant-tabs-tab){
                width:100px!important;
                text-align: center!important;
                padding: unset!important;
                background: #fff!important;
                margin-right: unset!important;
                border:1px solid #EFF1F2!important;
              }
              :global(.ant-tabs-tab:first-child){
                border-top-right-radius:unset!important;
              }
              :global(.ant-tabs-tab:nth-child(2)){
                border-top-left-radius:unset!important;
              }
              :global(.ant-tabs-tab-active) {
                background: #EFF1F2!important;
              }

            }
          }
        }
      }
      // 表格头部颜色样式 
      :global(.ant-tabs-content) {
        :global(.ant-table) {
          :global(.ant-table-thead > tr > th) {
            background: #EFF1F2!important;
          }
        }
      }
    }
    // 已选择人员table头部颜色
    .selectedTable {
      :global(.ant-table-content){
        :global(.ant-table-thead > tr > th) {
          background: #EFF1F2!important;
        }
      }
    }

  // 统一输入框等的高度
  .treeSelect {
    :global(.ant-select-selection--single) {
      height: 36px;
      :global(.ant-select-selection__rendered) {
        line-height: 36px;
      }
    }
  }
  :global(.ant-input-affix-wrapper) {
    height: 36px;
  }
</style>