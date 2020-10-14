<template>
  <a-card :bordered="false" class="lijie">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24" >

          <a-col :md="8" :sm="8" :xs="24">
            <a-form-item label="手机号码">
              <j-input-lk
                :placeholder="'请输入手机号'"
                @enterSearch="enterSearch($event,'phone')"
                @inputValueLk="inputValueLk($event,'phone')"
                ref="ResetLk"
              ></j-input-lk>
              <!--<a-input placeholder="请输手机号码" v-model="queryParam.phone" @keyup.enter="searchQuery"></a-input>-->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8" :xs="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
              <j-input-lk
                :placeholder="'请输入姓名'"
                @enterSearch="enterSearch($event,'realname')"
                @inputValueLk="inputValueLk($event,'realname')"
                ref="ResetLk"
              ></j-input-lk>
              <!--<a-input  placeholder="请输入姓名" v-model="queryParam.realname" @keyup.enter="searchQuery" ></a-input>-->
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">

          <a-col :md="8" :sm="8" :xs="24">
            <a-form-item label="小组名称" >
              <a-select placeholder="请选择小组名称" v-model="queryParam.groupName" style="position: static; height: 40px" >
                <a-select-option   :value="item.value" v-for="(item,index) in groupList" :key="index" @keyup.enter="searchQuery">
                  {{item.title}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8" :xs="24">
            <a-form-item label="办公号码" >
              <j-input-lk
                :placeholder="'请输入办公号码'"
                @enterSearch="enterSearch($event,'officePhone')"
                @inputValueLk="inputValueLk($event,'officePhone')"
                ref="ResetLk"
              ></j-input-lk>
              <!--<a-input  placeholder="办公号码" v-model="queryParam.officePhone" @keyup.enter="searchQuery" ></a-input>-->
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8" :xs="24">
            <a-form-item label="兴趣爱好" >
              <j-input-lk
                :placeholder="'请输入兴趣爱好'"
                @enterSearch="enterSearch($event,'hobbies')"
                @inputValueLk="inputValueLk($event,'hobbies')"
                ref="ResetLk"
              ></j-input-lk>
              <!--<a-input  placeholder="兴趣爱好" v-model="queryParam.hobbies" @keyup.enter="searchQuery" ></a-input>-->
            </a-form-item>
          </a-col>
          <!--<a-col :md="6" :sm="8">
            <a-form-item label="密码">
              <a-input placeholder="请输入密码" v-model="queryParam.password"></a-input>
            </a-form-item>
          </a-col>-->

        </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
               <a-button type="primary" style="margin-left: 8px" v-has="'mail:export'" icon="download" @click="handleExportXls('test')">导出</a-button>
              <a @click="handleToggleSearch" style="">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>



    <!-- table区域-begin -->
    <div>
      <!--<div class="table-operator" style="">
        &lt;!&ndash;<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>&ndash;&gt;

        &lt;!&ndash;<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>&ndash;&gt;
        &lt;!&ndash;<a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
        </a-dropdown>&ndash;&gt;
      </div>-->
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->
      <!-- 操作按钮区域 -->

      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >


          <div id="signatures" ref="signatures"  slot="signature" slot-scope="text, record, index" style="width: 150px; height: 20px; overflow: hidden;
                display: block; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;" :title="record.personalSignature" >

            <a-popconfirm :title="record.personalSignature" okText="ok" cancelText="close">
              <p>{{record.personalSignature}}</p>
            </a-popconfirm>
          </div>
        <div  slot="interest" slot-scope="text, record, index" style="width: 150px; height: 20px; overflow: hidden;
                display: block; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;" :title="record.hobbies" >
          <a-popconfirm :title="record.hobbies" okText="ok" cancelText="close">
            <p>{{record.hobbies}}</p>
          </a-popconfirm>
          </div>

        <div  slot="realName" slot-scope="text, record, index" style="width: 70px; height: 20px;" >
            <p>{{record.realname}}</p>
        </div>
        <div  slot="groupname" slot-scope="text, record, index" style="width: 80px; height: 20px;" >
            <p>{{record.groupName}}</p>
        </div>


        <template  slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>


        <span slot="action" slot-scope="text, record">
          <a v-show="record.username != userName"  v-has="'admin:edit'" @click="handleEdit(record,false)">编辑</a>
          <a  v-if="record.username == userName"  @click="handleEdit(record,false)" >编辑</a>
          <a  v-show="record.username != userName" v-has="'user:see'" @click="handleEdit(record, true)">查看</a>
          <!--<a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysUserCopy-modal ref="modalForm" @ok="modalFormOk"></sysUserCopy-modal>
  </a-card>
</template>

<script>
  import SysUserCopyModal from './modules/SysUserCopyModal'
  import {CmpListMixin} from '@/mixins/CmpListMixin'
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import JInputLk from '@/components/cmp/JInputLk.vue'

  export default {
    name: "SysUserCopyList",
    mixins:[CmpListMixin],
    components: {
      SysUserCopyModal,
      JInputLk
    },
    data () {
      return {
        labelCol: {
          xs: { span: 6},
          sm: { span: 10},
          //md:{span:15}
        },
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 14 },
        },
        description: 'test管理页面',
        userName: '',
        filteredInfo: null,
        sortedInfo: null,
        //小组名
        groupList: '',
        // 表头
        queryParam:{},
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender: this.getPageidnex
           },
		   /*{
            title: '登录账号',
            align:"center",
            dataIndex: 'username'
           },*/
          {
            title: '头像',
            align:"center",
            width:120,
            dataIndex: 'avatar',
            //slots: {filterIcon: 'avatar'},
            scopedSlots: {customRender: "avatarslot"}
          },
		   {
            title: '姓名',
            width:60,
            align:"left",
            dataIndex: 'realname',
           scopedSlots: {customRender: "realName"}
            /*customHeaderCell:this.handleClick*/
            /*customHeaderRow: this.refreshlist(column,index)*/

           /*sorter: (a, b) => a.name.length - b.name.length,
           sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,*/
           },
          {
            title: '手机号码',
            width:60,
            align:"left",
            dataIndex: 'phone'
          },
		   {
            title: '电子邮件',
            align:"left",
            width:60,
            dataIndex: 'email'
           },

       {
            title: '小组名',
            align:"left",
            width:150,
            dataIndex: 'groupName',
            scopedSlots: {customRender: "groupname"}
          },
          /*{
            title: '所属部门',
            align:"center",
            dataIndex: 'departName'
          },*/
		   {
            title: '办公号码',
            align:"left",
           width:60,
            dataIndex: 'officePhone'
           },
          {
            title: '爱好',
            align:"left",
            width:150,
            dataIndex: 'hobbies',
            scopedSlots: { customRender: 'interest' }
          },
          {
            title: '个性签名',
            align:"left",
            width:150,
            dataIndex: 'personalSignature',
            scopedSlots: { customRender: 'signature' }
          },
		   /*{
            title: '办公地址',
            align:"center",
            dataIndex: 'address'
           },*/
          {
            title: '操作',
            dataIndex: 'action',
            width:60,
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/sys/user/list/",
          /*list: "/sys/user/userListWithDepartName/",*/
          delete: "/sys/user/delete",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          /*delete: "/test/sysUserCopy/delete",*/

          //exportXlsUrl: "test/sysUserCopy/exportXls",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "/sys/user/importExcel",
       },
    }
  },
    created() {
      var a = JSON.parse( localStorage.getItem("pro__Login_Username"))
      this.userName =a.value;

      console.log(this.ipagination,"aaa")
    },
    beforeCreate() {
      /*初始化引入小组名称的字典*/
      initDictOptions('group_name_list').then((res) =>{
        if(res.success) {
          this.groupList =  res.result
        }
      })
    },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
    /*refreshlist(column,index) {
      console.log(column[index])
      /!*this.loadData();*!/
    },*/


    /*getAvatarView: function (avatar) {
      return this.url.imgerver + "/" + avatar;
    },*/
  },
    methods: {

      getPageidnex(t,r,index) {
        return parseInt((this.ipagination.current-1)*10+ index)+1;
      },

      /*表头的点击事件*/
      /*handleClick(column) {
        return {
          on:{
            click:() =>{
              console.log(column)
              this.queryParam.realNameType = "0";
              this.loadData(this.queryParam);
            }
          }
        }

      },*/

      getAvatarView: function (avatar) {
        return this.url.imgerver + "/" + avatar;
      },
    },

    watch: {
      change: function (e) {
        console.log(e);
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  .ant-form-item-label {
    line-height: 40px;
  }

  .ant-select {
  /* height: 40px; */
  :global(.ant-select-selection--single) {
    height: 40px;
  :global(.ant-select-selection__rendered) {
    line-height: 40px;
  }
  }
  }
  /*.table-page-search-wrapper .ant-form-inline .ant-form-item > .ant-form-item-label{
    line-height: 40px !important;
  }*/
   .anty-form-btn{
    line-height: 40px;
  }
  .table-page-search-wrapper .ant-form-inline
    .ant-form-item > :global(.ant-form-item-label) {
      line-height: 40px;
    }




  .ant-input {
    height: 40px;
  }

  .ant-btn-primary {
    height: 40px;
  }
  .ant-dropdown-trigger {
    height: 40px;
  }
  .ant-card-body .table-operator {
    display: flex;
    margin-bottom: 20px;
    vertical-align: top;
    height: 40px;
  }
</style>