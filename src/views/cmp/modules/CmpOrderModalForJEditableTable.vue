<template>
  <a-modal
    :title="null"
    :footer="null"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :closable="false">
    <div style="font-size:16px;font-weight:bold;color:rgba(25,25,25,1);">
      <!-- <a-icon :type="typeIcon" /> -->
      {{ title }}
    </div>
    <div style="font-weight:bold;color:rgba(25,25,25,1);">
      订单信息
    </div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 主表单区域 -->
        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="订单号">
              <a-input
                placeholder="请输入订单号"
                v-decorator="['orderCode', {rules: [{ required: true, message: '请输入订单号!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="订单类型">
              <a-select placeholder="请选择订单类型" v-decorator="['ctype',{}]">
                <a-select-option value="1">国内订单</a-select-option>
                <a-select-option value="2">国际订单</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="订单日期">
              <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" style="width: 100%" v-decorator="[ 'orderDate',{}]"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="订单金额">
              <a-input-number placeholder="请输入订单金额" style="width: 100%" v-decorator="[ 'orderMoney', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="订单备注">
              <!-- <a-input placeholder="请输入订单备注" v-decorator="['content', {}]"/> -->
              <a-textarea placeholder="请输入订单备注" :rows="6" v-decorator="[ 'content', {}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-col :lg="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="订单备注">
              <a-input placeholder="请输入订单备注" v-decorator="['content', {}]"/>
            </a-form-item>
          </a-col> -->
      </a-form>

      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="客户信息" key="1" :forceRender="true">

          <j-editable-table
            ref="editableTable1"
            :loading="table1.loading"
            :columns="table1.columns"
            :dataSource="table1.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>

        </a-tab-pane>

        <a-tab-pane tab="机票信息" key="2" :forceRender="true">

          <j-editable-table
            ref="editableTable2"
            :loading="table2.loading"
            :columns="table2.columns"
            :dataSource="table2.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            class="btnClass"
          >
            <a-button @click="handleCancel" icon="close" style="margin-right:10px" class="cancel">取消</a-button>
            <a-button @click="handleOk" icon="check" class="confirm">确认</a-button>
          </a-form-item>
        </a-col>
      </a-row>


    </a-spin>
  </a-modal>
</template>

<script>

  import JEditableTable from '@/components/cmp/JEditableTable'
  import { FormTypes, VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables } from '@/utils/JEditableTableUtil'
  import { httpAction, getAction } from '@/api/manage'
  import JDate from '@/components/cmp/JDate'
  import pick from 'lodash.pick'
  import moment from 'moment'

  export default {
    name: 'CmpOrderModalForJEditableTable',
    components: {
      JDate, JEditableTable
    },
    data() {
      return {
        title: '操作',
        visible: false,
        form: this.$form.createForm(this),
        confirmLoading: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 - 6 }
        },
        activeKey: '1',
        // 客户信息
        table1: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '客户名',
              key: 'name',
              width: '24%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '${title}不能为空' }]
            },
            {
              title: '性别',
              key: 'sex',
              width: '18%',
              type: FormTypes.select,
              options: [ // 下拉选项
                { title: '男', value: '1' },
                { title: '女', value: '2' }
              ],
              defaultValue: '',
              placeholder: '请选择${title}'
            },
            {
              title: '身份证号',
              key: 'idcard',
              width: '24%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              validateRules: [{
                pattern: '^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|[xX])$',
                message: '${title}格式不正确'
              }]
            },
            {
              title: '手机号',
              key: 'telphone',
              width: '24%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              validateRules: [{
                pattern: '^1(3|4|5|7|8)\\d{9}$',
                message: '${title}格式不正确'
              }]
            }
          ]
        },
        // 机票信息
        table2: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '航班号',
              key: 'ticketCode',
              width: '40%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '请输入${title}',
              validateRules: [{ required: true, message: '${title}不能为空' }]
            },
            {
              title: '航班时间',
              key: 'tickectDate',
              width: '30%',
              type: FormTypes.date,
              placeholder: '请选择${title}',
              defaultValue: ''
            }
          ]
        },
        url: {
          add: '/test/cmpOrderMain/add',
          edit: '/test/cmpOrderMain/edit',
          orderCustomerList: '/test/cmpOrderMain/queryOrderCustomerListByMainId',
          orderTicketList: '/test/cmpOrderMain/queryOrderTicketListByMainId'
        }
      }
    },
    created() {
    },
    methods: {

      // 获取所有的editableTable实例
      getAllTable() {
        return Promise.all([
          getRefPromise(this, 'editableTable1'),
          getRefPromise(this, 'editableTable2')
        ])
      },

      add() {
        // 默认新增一条数据
        this.getAllTable().then(editableTables => {
          editableTables[0].add()
          editableTables[1].add()
        })

        this.edit({})
      },
      edit(record) {
        this.visible = true
        this.activeKey = '1'
        this.form.resetFields()
        this.model = Object.assign({}, record)

        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'orderCode', 'ctype', 'orderMoney', 'content'))
          //时间格式化
          this.form.setFieldsValue({ orderDate: this.model.orderDate ? moment(this.model.orderDate) : null })
        })

        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestTableData(this.url.orderCustomerList, params, this.table1)
          this.requestTableData(this.url.orderTicketList, params, this.table2)
        }

      },
      close() {
        this.visible = false
        this.getAllTable().then(editableTables => {
          editableTables[0].initialize()
          editableTables[1].initialize()
        })
        this.$emit('close')
      },
      /** 查询某个tab的数据 */
      requestTableData(url, params, tab) {
        tab.loading = true
        getAction(url, params).then(res => {
          tab.dataSource = res.result || []
        }).finally(() => {
          tab.loading = false
        })
      },
      handleOk() {
        this.validateFields()
      },
      handleCancel() {
        this.close()
      },
      /** ATab 选项卡切换事件 */
      handleChangeTabs(key) {
        getRefPromise(this, `editableTable${key}`).then(editableTable => {
          editableTable.resetScrollTop()
        })
      },

      /** 触发表单验证 */
      validateFields() {
        this.getAllTable().then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
        }).then(allValues => {
          let formData = this.classifyIntoFormData(allValues)
          // 发起请求
          return this.requestAddOrEdit(formData)
        }).catch(e => {
          if (e.error === VALIDATE_NO_PASSED) {
            // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
            this.activeKey = e.index == null ? this.activeKey : (e.index + 1).toString()
          } else {
            console.error(e)
          }
        })
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let orderMain = Object.assign(this.model, allValues.formValue)
        //时间格式化
        orderMain.orderDate = orderMain.orderDate ? orderMain.orderDate.format('YYYY-MM-DD HH:mm:ss') : null
        return {
          ...orderMain, // 展开
          cmpOrderCustomerList: allValues.tablesValue[0].values,
          cmpOrderTicketList: allValues.tablesValue[1].values
        }
      },
      /** 发起新增或修改的请求 */
      requestAddOrEdit(formData) {
        let url = this.url.add, method = 'post'
        if (this.model.id) {
          url = this.url.edit
          method = 'post' // put修改
        }
        this.confirmLoading = true
        httpAction(url, formData, method).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      }

    }
  }
</script>

<style lang="less" scoped>

// 组件内直接引入ant组件样式覆盖
  .ant-form-item-label {
    line-height: 40px;
  }
  .table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item > :global(.ant-form-item-label) {
        line-height: 40px;
      }
    }
  }
  .ant-input {
    height: 40px;
  }
  textarea.ant-input {
    height: 80px;
  }
  /* 下拉选框 */
  .ant-select {
    /* height: 40px; */
    :global(.ant-select-selection--single) {
      height: 40px;
      :global(.ant-select-selection__rendered) {
        line-height: 40px;
      }
    }
  }
  .ant-btn-primary {
    height:40px;
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

  .ant-card-body .table-operator>div {
    flex: 1;
    margin-left: 14px;
  }

  .ant-card-body .table-operator .ant-alert-info {
    border: unset;
    border-radius:4px;
    background: rgba(109,98,255,0.1);
  }
  // tab的下面横线样式
  .ant-tabs {
    :global(.ant-tabs-bar) {
      :global(.ant-tabs-nav-container) {
        :global(.ant-tabs-nav-scroll) {      
          :global(.ant-tabs-nav) {     
            :global(.ant-tabs-ink-bar) {
              width:24px!important;
              height:3px!important;
              border-radius:2px!important;
              margin-left:30px!important;
            }
          }
        }
      }
    }
  }

  //按钮样式
  .btnClass {
    margin-top: 42px;
    :global(.ant-form-item-control-wrapper) {
      width: 100%;
      text-align: center;
      button {
        margin: 0;
        padding: 0;
        border: 1px solid transparent;  //自定义边框
        outline: none;  //消除默认点击蓝色边框效果
      }
      .cancel {
        width:96px;
        height:40px;
        background:rgba(238,238,238,1);
        border-radius:4px;
        color:rgba(51,51,51,1);
      }
      .confirm {
        width:96px;
        height:40px;
        background:rgba(109,98,255,1);
        border-radius:4px;
        color: rgba(255,255,255,1);
      }
    }
  }
</style>