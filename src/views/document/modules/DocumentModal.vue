<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;">
    <div class="title">
      <div>
         <img :src="title | IconUrl" />
           {{title}}
         <span>{{ nodeName ? '(' + nodeName + ')': ''}}</span>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <a-tabs defaultActiveKey="1">
       <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="project" />
              表单详情
          </span>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
      <a-row :gutter="24">
        <a-col :md="12" :sm="8">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="一级类别">
            <a-select style="width: 120px" @change="selectGetCategoryTwo" :disabled="isCheckOnly" v-decorator="['categoryone', {}]">
              <a-select-option v-for="item in categoryOneItems" :value="item.category" v-bind:key="item.id">{{item.category}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="二级类别">
            <a-select style="width: 120px" :disabled="isCheckOnly" v-decorator="['categorytwo', {}]">
              <a-select-option v-for="item in categoryTwoItems" :value="item.category" v-bind:key="item.id">{{item.category}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="标准/制度名称">
          <a-input placeholder="请输入标准/制度名称" :disabled="isCheckOnly" v-decorator="['fileName', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="标准/制度编号">
          <a-input placeholder="请输入标准/制度编号" :disabled="isCheckOnly" v-decorator="['standardnumber', {}]" />
        </a-form-item>
        </a-col>

        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="发布日期">
          <a-date-picker format='YYYY-MM-DD' :disabled="isCheckOnly" v-decorator="[ 'uploadTime', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="实施日期">
          <a-date-picker format='YYYY-MM-DD' :disabled="isCheckOnly" v-decorator="[ 'launchtime', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="上级主管部门">
            <j-select-depart :disabled="isCheckOnly" v-decorator="['superior']" :trigger-change="true"></j-select-depart>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="院内相关部门">
            <j-select-depart :disabled="isCheckOnly" v-decorator="['department']" :trigger-change="true"></j-select-depart>
          </a-form-item>
        </a-col>

        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="取代标准/制度">
          <a-input placeholder="请输入取代标准/制度" :disabled="isCheckOnly" v-decorator="['insteadfile', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="录入人用户名"
        hidden>
          <a-input placeholder="请输入录入人用户名" :disabled="isCheckOnly" v-decorator="['inputerName', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="录入人">
          <a-input placeholder="请输入录入人" :disabled="isCheckOnly" v-decorator="['inputerFullname', {}]" />
        </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
        <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="消息通知方式">
          <a-checkbox-group :disabled="isCheckOnly" v-decorator="['notifyMethod', {initialValue: []}]"><a-checkbox value="sms">手机短信</a-checkbox></a-checkbox-group>
        </a-form-item>
        </a-col>
    </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              class="upload"
              label="制度文件"
            >
              <a-upload
                :action="uploadAction"
                :fileList="fileList"
                :headers="headers"
                listType="picture"
                @change="disabledBtn"
                @preview="handlePreview"
                :multiple="true"
                class="upload-list-inline"
                :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看'"
              >
                <a-button>
                  <a-icon type="upload" />上传
                </a-button>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
                <br />
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目经理/组长">
              <j-select-user-new :disabled="isCheckOnly" v-decorator="['auditUsername1',{}]"
                                 :selectedDetails="auditUsers1" @callback="setAuditUser" class="userSelect"></j-select-user-new>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门主任">
              <j-select-user-new :disabled="isCheckOnly" v-decorator="['auditUsername2',{}]"
                                 :selectedDetails="auditUsers2" @callback="setAuditUser" class="userSelect"></j-select-user-new>
            </a-form-item>
          </a-col>
        </a-row>
    <a-form-item :labelCol="labelCol1" :wrapperCol="wrapperCol1" label="审批意见"
    v-show="(model.status !== undefined && model.status !== 0 && title !== '编辑' && nodeName != '填写表单' && title !== '查看')"
    :disabled="title == '编辑'">
       <a-textarea :rows="3" v-decorator="[ '_taskComment', {}]" :disabled="!model.btns"/>
    </a-form-item>
    <a-row :gutter="24" v-if="btns">
       <a-col :span="24">
          <a-form-item class="btnClass">
             <template v-for="(placement, index) in btns">
                <a-dropdown placement="bottomCenter" :key="index">
                   <a-button
                      style="margin-right:10px"
                      @click="onChange(placement)"
                      :icon="placement.btnIcon"
                      class="confirm"
                      type="primary"
                   >{{placement.btnName}}</a-button>
                   <a-menu slot="overlay" v-if="placement.btnApi == '/task/rollback'">
                      <a-menu-item v-for="(v,k) in rollback" :key="k">
                         <div @click="goBack(v.nodeId)">{{ v.nodeName }}</div>
                      </a-menu-item>
                   </a-menu>
                </a-dropdown>
             </template>
          </a-form-item>
        </a-col>
    </a-row>
		<a-row :gutter="24" v-if="!btns">
           <a-col :md="24" :sm="8">
               <a-form-item class="btnClass">
                   <a-button @click="handleOk" icon="check" class="confirm" type="primary">{{ model.status == undefined ? '提交' : '确定' }}</a-button>
                   <a-button @click="handleSave('start')" icon="diff" v-if="model.status == undefined" class="cancel">暂存</a-button>
                   <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
               </a-form-item>
           </a-col>
        </a-row>
      </a-form>
      <a-row :gutter="24">
          <a-col :md="24" :sm="8">
              <option-list :commentList="commentList" :currentList="currentList" v-if="model.status !== undefined"></option-list>
          </a-col>
      </a-row>
    </a-spin>
    </a-tab-pane>
    <a-tab-pane key="2" forceRender>
            <span slot="tab">
              <a-icon type="bell" />
              流程图
            </span>
            <div>
              <div class="proc_bg">
                <h3>
                  <span>流程图</span>
                </h3>
                <img :src="urlChart"/>
              </div>
              <div class="proc_bg">
                <h3>
                  <span>已完成</span>
                </h3>
                <s-table
                  :columns="goodsColumns"
                  :data="loadGoodsData"
                  v-if="commentList"
                  :pagination="false">
                </s-table>
              </div>
              <div class="proc_bg">
                <h3>
                  <span>处理中</span>
                </h3>
                <s-table
                    :columns="goodsColumns1"
                    :data="loadGoodsData1"
                    v-if="commentList"
                    :pagination="false">
                </s-table>
              </div>
            </div>
          </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
  import { httpAction, getActionUrl, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import OptionList from './OptionList'
  import qs from 'qs';
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import Vue from 'vue'
  import STable from '@/components/table/'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import { mapGetters } from 'vuex'
  import JSelectDepart from '@/components/cmpbiz/JSelectDepart'

  export default {
    name: "DocumentModal",
    //组件应用定义
    components: {
      STable,
      OptionList,
      JDictSelectTag,
      JSelectUserNew,
      JSelectDepart,
    },
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins: [CmpListMixin],
    // 数据定义
    data () {
      return {
        title:"操作",
        nodeId: '',
        nodeName: '',
        visible: false,
        model: {},

        //查看标识
        isCheckOnly:false,
        //快速查询列表
        quickSearchItems:[],
        categoryOneItems:[],
        categoryTwoItems:[],

        loginUserName : '',
        loginUserId: '',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 2 }
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 22 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        commentList: {},
        currentList: 0,
        unfinishedList:{},
        urlChart: '',
        //已完成表头设置
        goodsColumns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '步骤名称',
            dataIndex: 'nodeName',
            key: 'nodeName'
          },
          {
            title: '处理人',
            dataIndex: 'assigneeFullname',
            key: 'assigneeFullname',
            align:"center",
          },
          {
            title: '到达时间',
            dataIndex: 'startTime',
            key: 'startTime',
            align:"center",
          },
          {
            title: '完成时间',
            dataIndex: 'endTime',
            key: 'endTime',
            align: 'right',
            align:"center",
          },
          {
            title: '处理意见',
            dataIndex: '_taskComment',
            key: '_taskComment',
            customRender: (text, record, index) => {
              let re = "";
              if (!text) {
                re = "无意见";
              } else {
                re = text;
              }
                return re;
              }
           }
       ],
       //处理中表头
       goodsColumns1: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width: 80,
            align:"center",
            customRender:function (t,r,index) {
               return parseInt(index)+1;
            }
          },
          {
            title: '步骤名称',
            dataIndex: 'nodeName',
            key: 'nodeName'
          },
          {
            title: '当前处理',
            dataIndex: 'assigneeFullname',
            key: 'assigneeFullname',
            align:"center",
          },
          {
            title: '到达时间',
            dataIndex: 'startTime',
            key: 'startTime',
            align:"center",
          }
        ],
        arr: [], //初始化完成列表
        arr1: [], //初始化进行中列表
        url: {
          add: "/flowable/action",
          edit: "/document/document/edit",
          chart: '/flowable/process/diagram',
          taskComment: '/flowable/process/taskComment',
          getEntityName: '/sysFlow/flowConfig/getProcessDefinitionKeyByEntityName',
          //上传组件地址
          fileFind: '/file/cmpFileGroup/findFilesByGroupId',
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById',
          all: "/documentCategory/documentCategory/all",
          CategoryOne:"/documentCategory/documentCategory/CategoryOneList",
          CategoryTwoByP:"/documentCategory/documentCategory/CategoryTwoByP",
        },

        //动态获取流程定义Key
        entityName: `Document`,
        processDefinitionKey: '',

        //选人组件初始化
        auditUsername1: '',
        auditFullname1: '',
        auditUsername2: '',
        auditFullname2: '',
        selectUser: ['auditUsers1','auditUsers2'],
        auditUsers1: {
          colum: 'auditUsers1',
          value: [],
          target: [
            { to: 'auditUsername1', from: 'username' },
            { to: 'auditFullname1', from: 'realname' }
          ]
        },
        auditUsers2: {
          colum: 'auditUsers2',
          value: [],
          target: [
            { to: 'auditUsername2', from: 'username' },
            { to: 'auditFullname2', from: 'realname' }
          ]
        },
        // 上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
        attachment: [
         {
           groupId: '',
           fileTokens: '',
           fieldName: 'attachment',
           tableName: 'document'
         }
       ],
      }
    },
    filters: {
      IconUrl(val) {
        switch (val) {
          case '新增':
            return require(`@/assets/img/login/add.png`)
          case '编辑':
            return require(`@assets/img/login/edit.png`)
          case '查看':
            return require(`@assets/img/login/view.png`)
            break
          case '审核':
            return require(`@assets/img/login/audit.png`)
            break
          default:
            break
        }
      }
    },
    //钩子函数
    created () {
       const token = Vue.ls.get(ACCESS_TOKEN)
       this.headers = { 'X-Access-Token': token }
       this.attachment[0].fileTokens = ''
       this.getEntity();
       this.loginUserName = this.$store.getters.nickname
       this.loginUserId = this.$store.getters.userId
    },
    // 计算属性
    computed: {
      uploadAction: function() {
        return this.url.fileUpload
      },
      btns() {
        return this.model.btns
      },
      rollback() {
         return this.model.rollBackAbleNodes
      },
      disabledBtn() {
        return this.nodeId != '' && this.nodeId != 'UserTask_0'  || this.title == '查看' ? this.blank : this.handleChange
      },
    },
    //方法
    methods: {
      ...mapGetters(['nickname']),
      loadData(){},
      add () {
        getAction(this.url.CategoryOne, null).then((res) => {
          if (res.success) {
            this.categoryOneItems = res.result;
            // this.loading = false;
          } else {
            this.$message.warning(res.message);
            // this.loading = false;
          }
        });
        this.edit({});
      },
      edit (record,isDisabled) {
        this.isCheckOnly = isDisabled;
        //重置表单数据
        this.form.resetFields();
        //初始化表头
        if (record.nodeName != undefined) {
           this.nodeName = record.nodeName
        }
        //将record中毒的数据赋值给model
        if (record.formData !== undefined) {
          this.model = Object.assign({}, record.flowData.processVar, record.flowData, record.formData, {
          taskId: record.taskId
           })
        } else {
          this.model = Object.assign({}, record)
          this.model.inputerName = this.loginUserId;
          this.model.inputerFullname = this.loginUserName;
        }
        //弹窗打开
        this.visible = true;
        this.$nextTick(() => {

          //设置表单字段
          this.form.setFieldsValue(pick(this.model,'categoryone','categorytwo','fileName','standardnumber','savePath','uploadUser','fileSize','superior','department','insteadfile','inputerName','inputerFullname','notifyMethod','departmentLeaderUsername','departmentLeaderRealname','hrLeaderUsername','hrLeaderRealname','generalManagerUsername','generalManagerRealname','auditUsername1','auditFullname1','auditUsername2','auditFullname2'))

		   // 初始化选人组件字段
           this.auditUsers1.value = []
           this.auditUsers2.value = []
           // 初始化选人控件
           this.initSelectMan(this,record);

		  //时间格式化
          this.form.setFieldsValue({uploadTime:this.model.uploadTime?moment(this.model.uploadTime):null})
          this.form.setFieldsValue({launchtime:this.model.launchtime?moment(this.model.launchtime):null})
          // 初始化新任务通知
          if (this.model.notifyMethod != undefined) {
            that.form.setFieldsValue({ notifyMethod: eval(this.model.notifyMethod) })
          }
        });

        // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
        this.initUpload(this, 0)

       //请求流程图 + 审批意见
       // 第二个参数为流程图接口地址，第三哥参数为审批意见接口地址
       let that = this;
       setTimeout(function(){
          that.initChartAndComment(that, record, that.url.chart, that.url.taskComment)
       },)
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.fileList = []
      },
      // 提交和暂存函数在mins里面
      // handleOk(){},
      // handleSave(){},
      goBack(id) {
        this.onChange('jump', id)
      },
      // 时间格式化
      timeFormat(strFormData){
        //时间格式化
        strFormData.uploadTime = strFormData.uploadTime?strFormData.uploadTime.format('YYYY-MM-DD HH:mm:ss'):null;
        strFormData.launchtime = strFormData.launchtime?strFormData.launchtime.format('YYYY-MM-DD HH:mm:ss'):null;
      },
      handleCancel () {
        this.close()
        this.fileList = []
      },
      // 加载数据方法 必须为 Promise 对象
      loadGoodsData() {
        var that = this;
        return new Promise((resolve => {
          resolve({
            data: that.arr,
          })
        })).then(res => {
          return res
        })
      },
      loadGoodsData1() {
         var that = this;
         return new Promise((resolve => {
           resolve({
             data: that.arr1,
           })
         })).then(res => {
           return res
         })
      },
      handleChange(info) {
        //调用改变方法
        this.handleChange1(info, this, 0)
      },
      blank(info) {},
      handlePicCancel() {
        this.previewVisible = false
      },

      selectGetCategoryTwo(value) {
        let params = {pname:value};
        getAction(this.url.CategoryTwoByP, params).then((res) => {
          if (res.success) {
            this.categoryTwoItems = res.result;
            // this.loading = false;
          } else {
            this.$message.warning(res.message);
            // this.loading = false;
          }
        });
        console.log(`selected ${value}`);
      },
    }
  }
</script>

<style lang="less" scoped>
    @import '~@assets/less/modal.less';
</style>