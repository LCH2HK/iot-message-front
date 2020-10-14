<template>
  <a-card :bordered="false">

    <a-layout>

      <a-layout-content>
        <!-- table区域-begin -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>

          <!--          <a-button @click="mySearchReset" type="primary" icon="reload">刷新</a-button>-->
          <!--          <a-dropdown v-if="selectedRowKeys.length > 0">
                      <a-menu slot="overlay">
                        <a-menu-item key="1" @click="batchDelAndRefresh"><a-icon type="delete"/>删除</a-menu-item>
                      </a-menu>
                      <a-button class="batchOperation"> 批量操作 <a-icon type="down" /></a-button>
                    </a-dropdown>
                    <div class="ant-alert ant-alert-info">
                      <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a>{{ selectedRowKeys.length }}</a>项
                      <a @click="onClearSelected">清空</a>
                    </div>-->
        </div>
        <div>
          <a-table
            ref="table"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
          >
        <span slot="action" slot-scope="text, record">
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                  <a @click="handleEdit(record,true)">编辑</a>
              </a-menu-item>
              <a-menu-item v-if="record.defaultMark==0">
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                  <a @click="handlePerssion(record.id)">授权</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <!--        <a @click="handleEdit(record,true)">编辑</a>-->
          <!--          <a-divider type="vertical"/>-->
          <!--          <a @click="authorize(record)">授权</a>-->
        </span>
          </a-table>
        </div>
        <!-- table区域-end -->
      </a-layout-content>
    </a-layout>
    <!-- 表单区域 -->
    <project-role-modal ref="modalForm" @ok="modalFormOk" :projectId="this.selectedProjectId"></project-role-modal>
    <user-role-modal ref="modalUserRole"></user-role-modal>
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import Vue from 'vue'
import projectRoleModal from '@/views/project/modules/projectRoleModal'
import UserRoleModal from '@/views/system/modules/UserRoleModal'

export default {
  name: 'projectMenu',
  mixins: [CmpListMixin],
  components: {
    projectRoleModal,
    UserRoleModal
  },
  data () {
    return {
      queryParam: {},
      projectRoleData: [],
      projectData: [],
      // selectedProjectId: Vue.ls.get("PROJECT_MESSAGE").id,
      selectedProjectId: JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE')).id,
      selectedRowKeys: [],
      selectedObject: {},
      radioValue: true,
      prjType: [],
      activeKey: ['1', '2'],
      startValue: null,
      endValue: null,
      endOpen: false,
      //       projectData:[{key:1,title:'项目A',children:[{key:'c1',title:'子项目'}]},{key:2,title:'项目B'}],
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '角色名',
          align: 'center',
          dataIndex: 'roleName'
        },
        {
          title: '角色编号',
          align: 'center',
          dataIndex: 'roleCode'
        },
        {
          title: '描述',
          align: 'center',
          dataIndex: 'description'
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/sys/role/list?projectId=' + JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE')).id,
        // list:'/sys/role/list?projectId='+ Vue.ls.get('PROJECT_MESSAGE').id,
        deleteBatch: '/sys/role/deleteBatch',
        delete: '/sys/role/delete',
        queryById: '/sys/role/list?projectId='
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      collapsed: false
    }
  },
  computed: {

  },
  beforeCreate () {
  },
  created () {

  },
  methods: {

    /*      batchDelAndRefresh(){
        this.batchDel();
        getAction(this.url.queryById + selectedKeys).then((res)=>{
          if(res.success){
            this.projectRoleData = res.result.records;
          }else{
            console.log("get projectMenu list failed");
          }
        });
      }, */

    // 选择行
    onSelectChange (selectedRowKeys, index) {
      console.log('选择的主键ID => ', selectedRowKeys)
      console.log('选择的对象 => ', index)
      this.selectedRowKeys = selectedRowKeys
      this.selectedObject = index[0]
      this.disable = false
    },

    handlePerssion: function (roleId) {
      // alert(roleId);
      // console.log('projectId=========== ' + Vue.ls.get('PROJECT_MESSAGE').id)
      console.log('projectId=========== ' + sessionStorage.getItem('PROJECT_MESSAGE').id)
      console.log('this role ID ============ ' + roleId)
      this.$refs.modalUserRole.show(roleId)
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
