<!--接入终端的产品属性配置 用于产品详情页面 -->
<template>
  <a-card :bordered="false">
    <div>
      <div>
        <a-row class="btnClass" style="padding: 5px">
          <a-button
            @click="editTable"
            icon="edit"
            type="primary"
            style="margin-left:10px; "
            class="buttonWrap"
            v-if="isReadOnly && !ifProductPublished && !propertiesIsNull "
            v-show="true"
          >编辑</a-button>
          <a-button
            @click="handleOk"
            icon="check"
            type="primary"
            style="margin-left:10px; "
            class="buttonWrap"
            v-if="!isReadOnly"
          >保存</a-button>
          <a-button
            @click="handleCancel"
            icon="reload"
            type="primary"
            style="margin-left:10px; "
            class="buttonWrap"
            v-if="!isReadOnly"
          >重置</a-button>
        </a-row>
        <j-editable-table-new
          :ref="refKeys[0]"
          :loading="setProductPropertyTable.loading"
          :columns="setProductPropertyTable.columns"
          :dataSource="setProductPropertyTable.dataSource"
          :maxHeight="300"
          :rowNumber="true"
          :readOnly="isReadOnly"
          :rowSelection="!isReadOnly"
          :actionButton="!isReadOnly"
        >
<!--          <template v-slot:action="props">-->
<!--            &lt;!&ndash;            <a-checkbox @change="onChangeFormulaCheckbox(props)" >&ndash;&gt;-->
<!--            &lt;!&ndash;            </a-checkbox>&ndash;&gt;-->
<!--            <a @click="handleSetFormula(props)" :disabled="isReadOnly">公式配置</a>-->
<!--          </template>-->
          <template v-slot:action="props">
            <!--            <a-checkbox @change="onChangeFormulaCheckbox(props)" >-->
            <!--            </a-checkbox>-->
            <!--            <a @click="handleSetFormula(props)" :disabled="title === '查看'">公式配置</a>-->
            <a-tooltip  placement="top" :title="props.text" v-if="!isReadOnly">
              <a @click="handleSetFormula(props)">公式配置</a>
            </a-tooltip>
            <span v-else>{{props.text}}</span>
          </template>
        </j-editable-table-new>
      </div>
    </div>
    <FormulaSettingModal ref="formulaForm" @ok="formulaOk" @setFormula="setDataSourceFormula"
                         :data-source="currentDataSource" :row-id="rowId"></FormulaSettingModal>
  </a-card>
</template>

<script>

import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import qs from 'qs'
import { FormTypes, validateFormAndTables } from '../../../utils/JEditableTableUtil'
import { getAction, httpAction } from '../../../api/manage'
import FormulaSettingModal from '../propertyTemplate/modules/FormulaSettingModal'

export default {
  name: 'ProductSetProperty',
  mixins: [JEditableTableMixin],
  props: {
    pData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    FormulaSettingModal
  },
  data () {
    return {
      visible: false,
      description: '描述信息',
      // 表头
      collapsed: false,
      isChange: false,
      propertiesIsNull: false, // 属性为空时，不渲染表格
      ifProductPublished: false, // 设备在线，不允许修改
      isReadOnly: true, // 默认只读，点击编辑，修改
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      refKeys: ['setProductPropertyData'],
      activeKey: 'setProductPropertyData',
      currentDataSource: [],
      rowId: '',
      setProductPropertyTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '属性名称',
            key: 'unitName',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入${title}',
            disabled: true,
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
            title: '属性标识',
            key: 'alias',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true,
            placeholder: '请输入对应${title}',
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
            key: 'unit',
            type: FormTypes.select,
            defaultValue: '',
            disabled: true,
            placeholder: '请选择对应${title}'
          },
          {
            title: '最小值',
            key: 'minValue',
            type: FormTypes.inputNumber,
            defaultValue: 0,
            placeholder: '请输入${title}'
          },
          {
            title: '最大值',
            key: 'maxValue',
            type: FormTypes.inputNumber,
            defaultValue: 100,
            placeholder: '请输入${title}'
          },
          {
            title: '值类型',
            key: 'valueType',
            type: FormTypes.select,
            options: [ // 下拉选项
              { title: 'varchar', value: 'varchar' },
              { title: 'int', value: 'int' },
              { title: 'double', value: 'double' },
              { title: 'datetime', value: 'datetime' },
              { title: 'decimal', value: 'decimal' }

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
            width: '100px',
            type: FormTypes.checkbox,
            defaultChecked: false,
            customValue: ['1', '0']
          },
          {
            title: '公式',
            key: 'formula',
            type: FormTypes.slot,
            width: '200px',
            slot: 'action',
            defaultValue: '',
            slotName: 'action'
          }
        ]
      },
      url: {
        changeProductState: '/product/product/changeProductState',
        queryById: '/product/product/queryById',
        edit: '/product/product/edit',
        list: '/product/product/list',
        productInfos: '/product/product/productNames',
        units: '/propertyUnit/propertyUnit/getUnits'
      }
    }
  },
  beforeCreate () {},
  created () {
  },
  watch: {
    // '$route'(to, from) {
    //   //重新加载数据
    //   this.loadData()
    // }
  },
  mounted () {
    this.loadData()
  },
  computed: {},
  methods: {
    add () {
      this.edit({})
    },
    initTokens () {},
    // 编辑
    editTable () {
      this.isReadOnly = false
    },
    handleAddRow () {
      this.isReadOnly = false
    },
    handleDeleteRow () {
      this.isReadOnly = false
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    loadData () {
      // 获取采集数据单位
      this.getDeviceProperties()
      // 加载子表数据
      this.requestSubTableData(this.url.queryById, { id: this.pData.id }, this.setProductPropertyTable)
    },
    /** 查询某个tab的数据 */
    requestSubTableData (url, params, tab) {
      tab.loading = true
      getAction(url, params)
        .then(res => {
          if (res.success) {
            if (res.result.productProperties) {
              if (res.result.productState === '1') {
                this.ifProductPublished = true
              }
              tab.dataSource = JSON.parse(res.result.productProperties)
            } else {
              this.propertiesIsNull = true
            }
          } else {
            this.$message.error('获取点码表属性失败！')
          }
        })
        .finally(() => {
          tab.loading = false
        })
    },
    // 重载子表数据
    handleCancel () {
      this.requestSubTableData(this.url.queryById, { id: this.pData.id }, this.setProductPropertyTable)
      this.isReadOnly = true
    },
    handleEdit () {
      this.isEdit = true
    },
    // 获取单位
    getDeviceProperties () {
      const that = this
      getAction(that.url.units, {}).then(res => {
        if (res.success) {
          for (let i = 0; i < res.result.length; ++i) {
            const ops = []
            for (let i = 0; i < res.result.length; ++i) {
              ops[i] = {}
              ops[i].value = res.result[i].unitType
              ops[i].title = res.result[i].name + '(' + res.result[i].unitType + ')'
            }
            that.setProductPropertyTable.columns[1].options = ops
          }
        } else {
          that.$message.error('获取设备属性失败')
        }
      })
    },
    // 保存表单数据
    handleOk () {
      /** 触发表单验证 */
      this.getAllTable()
        .then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
        })
        .then(allValues => {
          const that = this
          const method = 'post'
          const actionUrl = that.url.edit
          const formData = that.pData
          that.setProductPropertyTable.loading = true
          formData.productProperties = JSON.stringify(allValues.tablesValue[0].values)
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
              } else {
                that.$message.error('操作失败')
              }
            })
            .finally(() => {
              that.isReadOnly = true
              that.setProductPropertyTable.loading = false
            })
        })
        .finally(() => {
          this.isChange = false
        })
    },
    // 配置公式
    handleSetFormula (props) {
      const { rowId } = props
      Promise.all([this.$refs.setProductPropertyData.getValuesPromise()]).then((values) => {
        // 调成功以后执行的操作
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
    // 配置公式后回填至表中
    setDataSourceFormula (rowId, value) {
      Promise.all([this.$refs.setProductPropertyData.setValues([{
        rowKey: rowId, // 行的id
        values: { // 在这里 values 中的 name 是你 columns 中配置的 key
          formula: value
        }
      }])
      ])
    },
    formulaOk () {
      // this.dataSource[index].formula = value
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';

.buttonWrap {
  float: right;
  color: white;
}

/deep/.input-table .tbody .td .ant-checkbox-wrapper {
  text-align: center;
}
</style>
