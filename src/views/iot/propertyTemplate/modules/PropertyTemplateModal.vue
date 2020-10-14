<!--属性模板弹窗 -->
<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    :width="1000"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- 表单标题 -->
    <div class="title">
      <div>
        <img :src="title | IconUrl"/>
        {{ title }}
        <a-tooltip placement="rightTop" :title="hint">
          <a-icon type="question-circle"/>
        </a-tooltip>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel"/>
    </div>
    <!-- 主表单区域 -->
    <a-form :form="form" style="padding-top: 30px">
      <!-- 常用选择/输入控件 -->
      <a-row :gutter="24">
        <a-col :md="12" :sm="8">
          <a-form-item
            style="height: 45px"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="属性模板名称"
          >
            <a-input
              v-decorator="['typeName', validatorRules.typeName]"
              placeholder="请输入属性模板名称"
              :disabled="title === '查看'"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item
            style="height: 45px"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="模板标识符"
          >
            <a-input
              v-decorator="['typeKey', validatorRules.typeKey]"
              placeholder="请输入模板标识符"
              :disabled="title === '查看'"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="属性配置" :key="refKeys[0]" :forceRender="true">
        <j-editable-table-new
          :ref="refKeys[0]"
          :loading="setBaseDeviceDataTable.loading"
          :columns="setBaseDeviceDataTable.columns"
          :dataSource="setBaseDeviceDataTable.dataSource"
          :maxHeight="300"
          :rowNumber="true"
          style="align: center;"
          :disabled="title === '查看'"
          :rowSelection="title !== '查看'"
          :actionButton="title !== '查看'"
        >
          <template v-slot:action="props">
            <!--            <a-checkbox @change="onChangeFormulaCheckbox(props)" >-->
            <!--            </a-checkbox>-->
<!--            <a @click="handleSetFormula(props)" :disabled="title === '查看'">公式配置</a>-->
            <a-tooltip  placement="rightTop" :title="props.text" v-show="title !== '查看'">
              <a @click="handleSetFormula(props)" v-show="title !== '查看'">公式配置</a>
            </a-tooltip>
            <span v-show="title === '查看'">{{props.text}}</span>
          </template>
<!--          <template v-slot:isCalculate="props">-->
<!--              <a-checkbox  :checked="isCalculates[props.rowId] ==='1'" :disabled="title === '查看'" @change="(e)=>onChangeFormulaCheckbox(e,props)" ></a-checkbox>-->
<!--          </template>-->
        </j-editable-table-new>
      </a-tab-pane>
    </a-tabs>
    <!-- 同步按钮 -->
    <a-form-item class="btnClass">
      <a-button
        @click="handleOk"
        icon="check"
        type="primary"
        style="margin-left:10px"
        class="confirm"
        v-if="title !== '查看'"
      >确定
      </a-button>
      <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
    </a-form-item>
    <FormulaSettingModal ref="formulaForm" @ok="formulaOk" @setFormula="setDataSourceFormula"
                         :data-source="currentDataSource" :row-id="rowId"></FormulaSettingModal>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import FormulaSettingModal from './FormulaSettingModal'
import { FormTypes, validateFormAndTables } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import qs from 'qs'
import { httpAction } from '@/api/manage'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'

import JSelectMultiple from '@/components/cmp/JSelectMultiple'
import { getAction } from '../../../../api/manage'
import { normalValidate, noBlank, numberOnly } from '../../js/iot_validate'
import JEditableTableNew from '@/components/cmp/JEditableTable1.5.0'
import { myCmpListMixin } from '@/mixins/myCmpListMixin'
import Vue from 'vue'

export default {
  name: 'PropertyTemplateModal',
  mixins: [JEditableTableMixin, myCmpListMixin],
  components: {
    JDictSelectTag,
    JSelectUserNew,
    JSelectMultiple,
    JEditableTableNew,
    FormulaSettingModal
  },
  data () {
    return {
      projectMsg: {},
      // 校验规则
      validatorRules: {
        typeName: {
          rules: [{ required: true, message: ' ' }, { validator: this.validateTypeName }]
        },
        typeKey: {
          rules: [{ required: true, message: ' ' }, { validator: this.validateTypeKey }]
        }
      },
      addDefaultRowNum: 1, // 新增时子表默认添加几行空数据
      refKeys: ['setBaseDeviceData'],
      activeKey: 'setBaseDeviceData',
      setBaseDeviceDataTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '属性名称',
            key: 'unitName',
            width: '150px',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^.{2,20}$/, // 正则
                message: '${title}不可少于2或多于20字'
              },
              {
                // 自定义函数校验 handler
                handler (type, value, row, column, callback, target) {
                  // type 触发校验的类型（input、change、blur）
                  // value 当前校验的值
                  // callback(flag, message) 方法必须执行且只能执行一次
                  //          flag = 是否通过了校验，不填写或者填写 null 代表不进行任何操作
                  //          message = 提示的消息，默认使用配置的 message
                  // target 行编辑的实例对象
                  if (type === 'input') {
                    if (value.length > 20) {
                      callback(false, '${title}不能超过20字')
                      return
                    }
                    let { values } = target.getValuesSync({ validate: false })
                    let count = 0
                    for (let val of values) {
                      if (val.unitName === value) {
                        if (++count >= 2) {
                          callback(false, '${title}不能重复')
                          return
                        }
                      }
                    }
                    callback(true) // true = 通过验证
                  } else {
                    callback() // 不填写或者填写 null 代表不进行任何操作
                  }
                },
                message: '${title}默认提示'
              }
            ]
          },
          {
            title: '属性标识',
            key: 'alias',
            width: '150px',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^.{2,20}$/, // 正则
                message: '${title}不可少于2或多于20字'
              }
            ]
          },
          {
            title: '单位',
            width: '150px',
            key: 'unit',
            type: FormTypes.select,
            options: [],
            defaultValue: '',
            placeholder: '请选择对应${title}'
          },
          {
            title: '最小值',
            width: '150px',
            key: 'minValue',
            type: FormTypes.inputNumber,
            defaultValue: 0,
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '最大值',
            key: 'maxValue',
            width: '150px',
            type: FormTypes.inputNumber,
            defaultValue: 100,
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '值类型',
            width: '150px',
            key: 'valueType',
            type: FormTypes.select,
            options: [ // 下拉选项
              { title: 'varchar', value: 'varchar' },
              { title: 'int', value: 'int' },
              { title: 'double', value: 'double' },
              { title: 'datetime', value: 'datetime' },
              { title: 'decimal', value: 'decimal' },
              { title: 'text(64KB)', value: 'text' },//0~64kb
              { title: 'mediumtext(16MB)', value: 'mediumtext' },//0~16MB
              { title: 'blob(65KB)', value: 'blob' },//0~65kb
              { title: 'mediumblob(16MB)', value: 'mediumblob' },//0~16MB
            ],
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '值长度',
            key: 'valueLength',
            width: '150px',
            type: FormTypes.inputNumber,
            defaultValue: 20,
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '小数长度',
            key: 'digitLength',
            width: '150px',
            type: FormTypes.inputNumber,
            defaultValue: 0,
            placeholder: '请输入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '请输入${title}' // 显示的文本
              }
            ]
          },
          {
            title: '是否计算',
            key: 'isCalculate',
            width: '120px',
            type: FormTypes.checkbox,
            defaultChecked: false,
            customValue: ['1', '0']
          },
          // {
          //   title: '是否计算',
          //   key: 'isCalculate',
          //   width: '120px',
          //   type: FormTypes.slot,
          //   slotName: 'isCalculate',
          //   defaultValue: '0',
          // },
          {
            title: '公式',
            key: 'formula',
            width: '300px',
            type: FormTypes.slot,
            slot: 'action',
            defaultValue: '',
            slotName: 'action'
          }
        ]
      },
      currentDataSource: [],
      rowId: '',
      isCalculates: {},
      url: {
        add: '/propertyTemplate/propertyTemplate/add',
        edit: '/propertyTemplate/propertyTemplate/edit',
        list: '/propertyTemplate/propertyTemplate/list',
        units: '/propertyUnit/propertyUnit/getUnits',
        getDeviceTypes: '/propertyTemplate/propertyTemplate/getDeviceTypes',
        getProducts: '/product/product/queryById',
        duplicateCheck: '/propertyTemplate/propertyTemplate/duplicateCheck'
      }
    }
  },
  filters: {
    IconUrl (val) {
      switch (val) {
        case '新增':
          return require('@/assets/img/login/add.png')
        case '编辑':
          return require('@assets/img/login/edit.png')
        case '查看':
          return require('@assets/img/login/view.png')
        case '审核':
          return require('@assets/img/login/audit.png')
        default:
          break
      }
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息，判断是否为项目级
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log('属性模板对话框：projectMsg==>', this.projectMsg)
  },
  watch: {},
  computed: {
    hint () {
      let hintMsg = ''
      switch (this.title) {
        case '新增':
          hintMsg = '新增一个属性模板，并添加各个属性'
          break
        case '编辑':
          hintMsg = '编辑属性模板，可以改变各个属性的属性名称、属性标识等'
          break
        case '查看':
          hintMsg = '查看属性模板中包含的各个属性，不能进行修改'
          break
        default:
          hintMsg = '属性模板的基本参数'
      }
      return hintMsg
    }
  },
  methods: {
    editBefore (record) {
      this.getDeviceProperties()
      if (record) {
        if (record.nodeId !== undefined) {
          this.nodeId = record.nodeId
        }
        if (record.nodeName !== undefined) {
          this.nodeName = record.nodeName
        }
        this.model = Object.assign({ nodeName: record.nodeName }, record)
        this.nodeName = record.nodeName
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'typeName', 'typeKey'))
        })
      }
      // 加载子表数据
      if (this.model.id) {
        let params = { id: record.id }
        Promise.all([this.requestSubTableData(this.url.list, params, this.setBaseDeviceDataTable)]).then(() => {
          // console.log("editBefore =>")
        })
      }
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter (record) {
      this.getDeviceProperties()
      if (record) {
        if (record.nodeId !== undefined) {
          this.nodeId = record.nodeId
        }
        if (record.nodeName !== undefined) {
          this.nodeName = record.nodeName
        }
        this.model = Object.assign({ nodeName: record.nodeName }, record)
        this.nodeName = record.nodeName
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'typeName', 'typeKey'))
        })
      }
      // 加载子表数据
      if (this.model.id) {
        let params = { id: record.id }
        Promise.all([this.requestSubTableData(this.url.list, params, this.setBaseDeviceDataTable)]).then(() => {
          // console.log("editAfter =>")
        })
      }
    },
    /** 查询某个tab的数据 */
    requestSubTableData (url, params, tab) {
      tab.loading = true
      getAction(url, params)
        .then(res => {
          // console.log("requestSubTableData res =>",res)
          if (res.success) {
            let listArr = res.result.records[0].typeProperties
            tab.dataSource = JSON.parse(listArr)
            this.initisCalculates(tab.dataSource)
          } else {
            this.$message.error('获取属性配置表失败！')
          }
        })
        .finally(() => {
          tab.loading = false
          // console.log("requestSubTableData dataSource =>",tab.dataSource)
        })
    },
    /** 初始化isCalculates 记录checkBox状态 */
    initIsCalculates (dataSource) {
      console.log('initIsCalculates listArr=>', dataSource)
      for (let i in dataSource) {
        this.isCalculates[dataSource[i].id] = dataSource[i].isCalculate
      }
      console.log('initIsCalculates isCalculates=>', this.isCalculates)
    },
    // 获取单位
    getDeviceProperties () {
      let that = this
      getAction(that.url.units, {}).then(res => {
        console.log(res)
        if (res.success) {
          for (let i = 0; i < res.result.length; ++i) {
            let ops = []
            for (let i = 0; i < res.result.length; ++i) {
              ops[i] = new Object()

              ops[i].value = res.result[i].unitType
              ops[i].title = res.result[i].name + '(' + res.result[i].unitType + ')'
            }
            that.setBaseDeviceDataTable.columns[2].options = ops
          }
        } else {
          that.$message.error('获取属性模板属性失败')
        }
      })
    },
    /** 整理成formData */
    classifyIntoFormData (allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      // 时间格式化
      return {
        ...main, // 展开
        typeProperties: allValues.tablesValue[0].values
      }
    },
    handleOk () {
      /** 触发表单验证 */
      this.getAllTable()
        .then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
        })
        .then(allValues => {
          if (typeof this.classifyIntoFormData !== 'function') {
            throw this.throwNotFunction('classifyIntoFormData')
          }
          let that = this
          let method = 'post'
          let actionUrl = ''
          if (that.model.typeProperties === undefined) {
            actionUrl = that.url.add
          } else {
            actionUrl = that.url.edit
          }
          let formData = Object.assign(this.model, allValues.formValue)
          console.log('formData=>', formData)
          formData.typeProperties = JSON.stringify(allValues.tablesValue[0].values)
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.error('操作失败')
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        })
    },
    validateValue (rule, value, callback) {
      let label = '属性值'
      let length = [1, 32]
      numberOnly(label, length, rule, value, callback)
    },
    validatePropertyName (rule, value, callback) {
      let label = '属性名称'
      let length = [1, 32]
      noBlank(label, length, rule, value, callback)
    },
    validateTypeName (rule, value, callback) {
      let label = '属性模板名称'
      let length = [1, 32]
      normalValidate(label, length, rule, value, callback)
    },
    validateTypeKey (rule, val, callback) {
      let value = val || ''
      if (value.length === 0) {
        callback('请输入属性模板标识符！')
      } else if (/[\s+]/g.test(value)) {
        callback('不可添加空格!')
      } else if (val.length > 32) {
        callback('最多输入32个字')
      } else if (val.replace(/\s*/g, '') === '') {
        callback('属性模板标识符不可为空!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('标识符不可输入汉字!')
      } else {
        let params = {
          id: this.model.id,
          code: val.trim(),
          prjCode: this.projectMsg.prjCode
        }
        let method = 'post'
        httpAction(this.url.duplicateCheck, params, method).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      }
    },
    handleSetFormula (props) {
      let { rowId } = props
      console.log('handleSetFormula  rowId =>', rowId)
      console.log('handleSetFormula  props =>', props)
      Promise.all([this.$refs.setBaseDeviceData.getValuesPromise()]).then((values) => {
        // 调成功以后执行的操作
        console.log('datasource=>', values)
        this.currentDataSource = values[0]
        this.rowId = rowId
      }).then(() => {
        this.$refs.formulaForm.show()
        this.$refs.formulaForm.title = '公式配置'
      }).catch(error => {
        // 抛出错误信息
        console.log('error =>', error)
        this.$message.error('属性验证不通过，不能进行公式配置')
      })
    },
    formulaOk () {
      // this.dataSource[index].formula = value
      console.log('into formulaOk')
    },
    setDataSourceFormula (rowId, value) {
      // console.log('into setDataSourceFormula rowId=>', rowId)
      // console.log('into setDataSourceFormula this.currentDataSource=>', this.currentDataSource)
      // // this.currentDataSource[index].formula = value
      // console.log('into setDataSourceFormula value=>', value)
      // console.log('into setDataSourceFormula  this.currentDataSource=>', this.currentDataSource)
      Promise.all([this.$refs.setBaseDeviceData.setValues([{
        rowKey: rowId, // 行的id
        values: { // 在这里 values 中的 name 是你 columns 中配置的 key
          formula: value
        }
      }])
      ])
    },
    onChangeFormulaCheckbox (event, props) {
      console.log('into onChangeFormulaCheckbox props=>', props)
      // let {target,rowId} = props
      // let { id, checked } = target
      // Promise.all([this.$refs.setBaseDeviceData.handleChangeCheckboxCommon(event,row,)])
      // .then(
      //   // console.log('into onChangeFormulaCheckbox setBaseDeviceData Values=>', temp)
      // )
      // let temp = this.isCalculates[rowId] ==='0'?'1':'0';
      // this.isCalculates[rowId] = temp;
      // console.log('into onChangeFormulaCheckbox temp=>', temp)
      // Promise.all([this.$refs.setBaseDeviceData.setValues([{
      //   rowKey: rowId, // 行的id
      //   values: { // 在这里 values 中的 name 是你 columns 中配置的 key
      //     'isCalculate': temp
      //   }
      // }])
      // ]).then(
      //   // console.log('into onChangeFormulaCheckbox setBaseDeviceData Values=>', temp)
      // )
    },
    handleChangeCheckboxCommon (event, row, column) {
      console.log('into handleChangeCheckboxCommon row=>', row)
      let { id, checked } = event.target
      console.log('into handleChangeCheckboxCommon checked=>', checked)
      this.checkboxValues = this.bindValuesChange(checked, id, 'checkboxValues')

      // 触发valueChange 事件
      this.elemValueChange(FormTypes.checkbox, row, column, checked)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/less/modal.less';
  @import '~@assets/less/topBtns.less';
</style>
