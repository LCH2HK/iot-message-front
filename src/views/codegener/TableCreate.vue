<template>

  <a-card :borderd="false">
    

    <a-tooltip style="margin:0px auto 15px;" placement="top" :autoAdjustOverflow="true">
      <a-button @click="handleTableCreate" type="primary">生成数据表</a-button>
    </a-tooltip>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="数据源">
              <!-- <a-input placeholder="请输入数据源" v-model="queryParam.dbName"></a-input> -->
              <a-select v-model="dbName" placeholder="请选择数据源" @change="gettablenames">
                <a-select-option v-for="(item,index) in dbnames" :value="item" :key="index" >{{ item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="数据表">
              <a-input placeholder="请输入需创建的数据表名" v-model="tableName"></a-input>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <j-editable-table
      ref="editableTable"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowNumber="true"
      :rowSelection="true"
      :actionButton="true"
      style="margin-top: 8px;height:1200px"
      @selectRowChange="handleSelectRowChange">

      <template v-slot:action="props">
        <a @click="handleDelete(props)">{{ props.text }}</a>
      </template>

    </j-editable-table>

  </a-card>

</template>

<script>
  import moment from 'moment'
  import JEditableTable from '@/components/cmp/JEditableTable'
  import { FormTypes } from '@/utils/JEditableTableUtil'
  import { randomUUID, randomNumber } from '@/utils/util'
  import { httpAction } from '@/api/manage'
  import qs from 'qs'


  export default {
    name: 'CmpEditableTableExample',
    components: {
      JEditableTable
    },
    data() {
      return {
        tablenames:[],
        dbName:'',
        dbnames:[],
        tableName:'',
        loading: false,
        columns: [
          {
            title: '字段名称',
            key: 'fieldName',
            // width: '19%',
            width: '200px',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
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
            title: '字段备注',
            key: 'fieldComment',
            // width: '19%',
            width: '300px',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            
            ]
          },

          
          {
            title: '字段类型',
            key: 'fieldType',
            // width: '18%',
            width: '150px',
            type: FormTypes.select,
            options: [ // 下拉选项
              { title: 'varchar', value: 'varchar' },
              { title: 'int', value: 'int' },
              { title: 'double', value: 'double' },
              { title: 'datetime', value: 'datetime' },
              { title: 'decimal', value: 'decimal' },

            ],
            defaultValue: '',
            placeholder: '请选择${title}',
            validateRules: [{ required: true, message: '请选择${title}' }]
          }, 
          
          {
            title: '字段长度',
            key: 'fieldLength',
            // width: '8%',
            width: '100px',
            type: FormTypes.inputNumber,
            defaultValue: 32,
            placeholder: '${title}',
            validateRules: [{ required: true, message: '请输入${title}' }]
          },
          {
            title: '小数点',
            key: 'fieldPoint',
            // width: '8%',
            width: '100px',
            type: FormTypes.inputNumber,
            defaultValue: 0,
            placeholder: '${title}',
            validateRules: [{ required: true, message: '请输入${title}' }]
          },
          {
            title: '默认值',
            key: 'fieldDefault',
            // width: '19%',
            width: '200px',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: false, // 必填
              }
            
            ]
          },
          {
            title: '主键',
            key: 'bePrimary',
            // width: '19%',
            width: '100px',
            type: FormTypes.checkbox,
            defaultChecked: false,
          },
          {
            title: '允许空值',
            key: 'allowNull',
            // width: '19%',
            width: '100px',
            type: FormTypes.checkbox,
            defaultChecked: true,
          },
          {
            title: '排序',
            key: 'fieldSeq',
            // width: '8%',
            width: '100px',
            type: FormTypes.inputNumber,
            defaultValue: 1,
            placeholder: '${title}',
            validateRules: [{ required: true, message: '请输入${title}' }]
          },

          // {
          //   title: '控件类型',
          //   key: 'controlType',
          //   // width: '18%',
          //   width: '300px',
          //   type: FormTypes.select,
          //   options: [ // 下拉选项
          //     { title: '文本框', value: 0 },
          //     { title: '单选框', value: 1 },
          //     { title: '多选框', value: 2 },
          //     { title: '日期', value: 3 },
          //     { title: '文件', value: 4 },
          //     { title: '下拉框', value: 5 },
          //     { title: '下拉多选框', value: 6 },
          //     { title: '部门选择器', value: 7 },
          //     { title: '用户选择器', value: 8 },

          //   ],
          //   defaultValue: 0,
          //   placeholder: '请选择${title}',
          //   validateRules: [{ required: false, message: '请选择${title}' }]
          // }, 
          
          {
            title: '操作',
            key: 'action',
            // width: '8%',
            width: '100px',
            type: FormTypes.slot,
            slot: 'action',
            defaultValue:"删除"
          }

        ],
        url: {
          tablecreate:"tablecreate/create",
          getdbname:"/codegenerate/getdbname",
          gettable:"/codegenerate/gettable",
        },
        dataSource: [],
        selectedRowIds: [],
        model: {},

      }
    },
    created() {

    },
    mounted() {
      this.getdbnames();
      this.defaultData();
    },
    methods: {
      handleTableCreate(){
        const that = this;
        if(!this.dbName){
          this.$message.warning('数据源不能为空！');
        }else if(!this.tableName){
          this.$message.warning('数据表不能为空！');
        }else if((this.tablenames.indexOf(this.tableName))!=-1){
          this.$message.warning('数据表不能重复！');
        }else{
          this.$refs.editableTable.getValues((error, values) => {
            if(!error){
              that.confirmLoading = true;
              let method = 'post';
              let httpurlcode = this.url.tablecreate;
              let formData2 = {'list':values,
              'dbname':this.dbName,
              'tablename':this.tableName
              }
              httpAction(httpurlcode,formData2,method).then((res)=>{
                if(res.success){
                  that.$message.success(res.message);
                  // this.tablenames.push(this.tableName)
                }else{
                  that.$message.warning(res.message);
                }
                }).finally(() => {
                  that.confirmLoading = false;
                  })
            }
          })
          
        }
        
        
      },

      handleSelectRowChange(selectedRowIds) {
        this.selectedRowIds = selectedRowIds
      },

      handleDelete(props) {
        let { rowId, target } = props
        target.removeRows(rowId)
      },
      getdbnames(){
        let data={};
        let httpurl =this.url.getdbname;
        let method = 'get';
        httpAction(httpurl,data,method).then(res=>{
          if(res.success){
            this.dbnames=res.result;
          }else{
          }
        })
      },
      defaultData(){
        let datadefault = []
        datadefault= [
          {id: randomUUID(),fieldName:"id",fieldComment:"表单编号",fieldLength:32,fieldType:"varchar",fieldPoint:0,bePrimary:true,allowNull:false,fieldSeq:1},
          {id: randomUUID(),fieldName:"create_by",fieldComment:"创建人",fieldLength:32,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:2},
          {id: randomUUID(),fieldName:"create_time",fieldComment:"创建时间",fieldLength:0,fieldType:"datetime",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:3},
          {id: randomUUID(),fieldName:"update_by",fieldComment:"更新人",fieldLength:32,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:4},
          {id: randomUUID(),fieldName:"update_time",fieldComment:"更新时间",fieldLength:0,fieldType:"datetime",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:5},
          {id: randomUUID(),fieldName:"corp_code",fieldComment:"所属租户",fieldLength:50,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:6},
          {id: randomUUID(),fieldName:"prj_code",fieldComment:"所属项目",fieldLength:50,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:7},
          {id: randomUUID(),fieldName:"del_flag",fieldComment:"删除标志(0正常、1删除,必须设置默认为0)",fieldLength:2,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:8},
          {id: randomUUID(),fieldName:"status",fieldComment:"状态(0暂存、1流转中、2已完成、3废弃)",fieldLength:2,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:9},
          {id: randomUUID(),fieldName:"inputer_name",fieldComment:"录入人用户名",fieldLength:32,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:10},
          {id: randomUUID(),fieldName:"inputer_fullname",fieldComment:"录入人姓名",fieldLength:32,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:11},
          {id: randomUUID(),fieldName:"notify_method",fieldComment:"消息通知方式",fieldLength:255,fieldType:"varchar",fieldPoint:0,bePrimary:false,allowNull:true,fieldSeq:12},
          ]
        
        this.dataSource = datadefault
      },
      gettablenames(dbName){
        let data={"dbName":dbName};
        let httpurl =this.url.gettable;
        let method = 'post';
        httpAction(httpurl,qs.stringify(data),method).then(res=>{
          if(res.success){
            this.tablenames=res.result;

          }else{
          }
        })
      },

    }
  }
</script>

<style scoped>

</style>