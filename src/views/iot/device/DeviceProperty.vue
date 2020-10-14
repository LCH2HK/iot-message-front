<!--设备属性  用于设备详情中-->
<template>
  <a-card :bordered="false">
    <div>
      <div>
        <a-row class="btnClass" style="padding: 5px">
          <a-button
            @click="editTable"
            icon="edit"
            type="primary"
            style="margin-left: 10px"
            class="buttonWrap"
            v-if="isReadOnly && !isDeviceOnline && !propertiesIsNull"
            >编辑
          </a-button>
          <a-button
            @click="handleOk"
            icon="check"
            type="primary"
            style="margin-left: 10px"
            class="buttonWrap"
            v-if="!isReadOnly"
            >保存
          </a-button>
          <a-button
            @click="handleCancel"
            icon="reload"
            type="primary"
            style="margin-left: 10px"
            class="buttonWrap"
            v-if="!isReadOnly"
            >重置
          </a-button>
        </a-row>
        <j-editable-table
          :ref="refKeys[0]"
          :loading="setDevicePropertyTable.loading"
          :columns="setDevicePropertyTable.columns"
          :dataSource="setDevicePropertyTable.dataSource"
          :maxHeight="300"
          :rowNumber="true"
          :disabled="isReadOnly"
          :rowSelection="!isReadOnly"
        >
          <template v-slot:action="props">
            <!--            <a-checkbox @change="onChangeFormulaCheckbox(props)" >-->
            <!--            </a-checkbox>-->
            <!--            <a @click="handleSetFormula(props)" :disabled="title === '查看'">公式配置</a>-->
            <!-- <a-tooltip placement="rightTop" :title="props.text" v-show="isShowFormula[props.rowId]">
              <a @click="handleSetFormula(props)">公式配置</a>
            </a-tooltip> -->
            <!-- <span v-show="!isShowFormula[props.rowId]">{{props.text}}</span> -->
            <a-tooltip  placement="top" :title="props.text" v-if="!isReadOnly">
              <a @click="handleSetFormula(props)">公式配置</a>
            </a-tooltip>
            <span v-else>{{props.text}}</span>
          </template>
        </j-editable-table>
      </div>
    </div>
    <FormulaSettingModal
      ref="formulaForm"
      @ok="formulaOk"
      @setFormula="setDataSourceFormula"
      :data-source="currentDataSource"
      :row-id="rowId"
    ></FormulaSettingModal>
  </a-card>
</template>

<script>
import FormulaSettingModal from '../propertyTemplate/modules/FormulaSettingModal'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import JEditableTable from '../../../components/cmp/JEditableTable1.5.0'
import qs from 'qs'
import { FormTypes, validateFormAndTables } from '../../../utils/JEditableTableUtil'
import { getAction, httpAction } from '../../../api/manage'

export default {
  name: 'DeviceProperty',
  mixins: [JEditableTableMixin],
  props: {
    deviceData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    FormulaSettingModal,
    JEditableTable
  },
  data () {
    return {
      visible: false,
      description: '描述信息',
      // 表头
      collapsed: false,
      isChange: false,
      oldFormula: '', // 暂存旧的公式
      propertiesIsNull: false, // 属性为空时，不渲染表格
      isDeviceOnline: false, // 设备在线，不允许修改
      isReadOnly: true, // 默认只读，点击编辑，修改
      addDefaultRowNum: 1, // 新增时子表默认添加几行空数据
      isShowFormula: {}, // 是否展示公式配置页面，内容为{rowId :true ,rowId : false}
      refKeys: ['setProductPropertyData'],
      activeKey: 'setProductPropertyData',
      currentDataSource: [],
      rowId: '',
      setDevicePropertyTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '属性名称',
            key: 'unitName',
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
            title: '属性标识',
            key: 'alias',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '请输入对应${title}'
          },
          {
            title: '单位',
            key: 'unit',
            type: FormTypes.select,
            defaultValue: '',
            placeholder: '请选择对应${title}'
          },
          {
            title: '值类型',
            key: 'valueType',
            type: FormTypes.select,
            options: [
              // 下拉选项
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
            width: '100px',
            type: FormTypes.slot,
            slot: 'action',
            defaultValue: '',
            slotName: 'action'
          }
        ]
      },
      url: {
        // changeProductState: '/product/product/changeProductState',
        queryById: '/device/device/queryById',
        edit: '/device/device/edit',
        list: '/device/device/list',
        units: '/propertyUnit/propertyUnit/getUnits',
        changeFormula: 'device/device/changeFormula'
      },
      projectMsg: ''
    }
  },
  beforeCreate () {},
  created () {
    console.log('isAccessGateway=>' + this.deviceData.isAccessGateway)
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log('DeviceProperty:this.projectMsg=>', this.projectMsg)
  },
  watch: {},
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
      console.log('deviceData', this.deviceData)
      // 加载子表数据
      this.requestSubTableData(this.url.queryById, { id: this.deviceData.id }, this.setDevicePropertyTable)
    },
    /** 查询某个tab的数据 */
    requestSubTableData (url, params, tab) {
      tab.loading = true
      getAction(url, params)
        .then((res) => {
          console.log('DeviceProperty:queryById=>', res.result)
          if (res.result.deviceState) {
            if (res.result.deviceState === '1') {
              this.isDeviceOnline = true
            }
            tab.dataSource = JSON.parse(res.result.deviceProperties)
            this.initShowFormula(tab.dataSource)
          } else {
            this.propertiesIsNull = true
          }
        })
        .finally(() => {
          tab.loading = false
        })
    },
    /** 重载子表数据 */
    handleCancel () {
      this.requestSubTableData(this.url.queryById, { id: this.deviceData.id }, this.setDevicePropertyTable)
      this.isReadOnly = true
    },
    handleEdit () {
      this.isEdit = true
    },
    /** 获取单位 */
    getDeviceProperties () {
      const that = this
      getAction(that.url.units, {}).then((res) => {
        if (res.success) {
          for (let i = 0; i < res.result.length; ++i) {
            const ops = []
            for (let i = 0; i < res.result.length; ++i) {
              ops[i] = {}
              ops[i].value = res.result[i].unitType
              ops[i].title = res.result[i].name + '(' + res.result[i].unitType + ')'
            }
            that.setDevicePropertyTable.columns[2].options = ops
          }
        } else {
          that.$message.error('获取设备属性失败')
        }
      })
    },
    /** 保存 */
    handleOk () {
      /** 触发表单验证 */
      this.getAllTable()
        .then((tables) => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
        })
        .then((allValues) => {
          const that = this
          const method = 'post'
          const actionUrl = that.url.edit
          const formData = that.deviceData
          that.setDevicePropertyTable.loading = true
          formData.deviceProperties = JSON.stringify(allValues.tablesValue[0].values)
          httpAction(actionUrl, qs.stringify(formData), method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
              } else {
                that.$message.error('操作失败')
              }
            })
            .finally(() => {
              that.isReadOnly = true
              that.setDevicePropertyTable.loading = false
            })
        })
        .finally(() => {
          this.isChange = false
        })
    },
    /** 配置公式 */
    handleSetFormula (props) {
      const { rowId } = props
      console.log('handleSetFormula  rowId =>', rowId)
      console.log('handleSetFormula  props =>', props)
      // 暂存旧的公式
      this.oldFormula = props.text
      let isOk = false
      Promise.all([this.$refs.setProductPropertyData.getValuesPromise()])
        .then((values) => {
          // 调成功以后执行的操作
          console.log('datasource=>', values)
          if (this.isShowFormula[rowId]) {
            this.currentDataSource = values[0]
            this.rowId = rowId
            isOk = true
          }
        })
        .then(() => {
          if (isOk) {
            this.$refs.formulaForm.show()
            this.$refs.formulaForm.title = '公式配置'
          } else {
            this.$message.warning('该属性不支持公式配置')
          }
        })
        .catch((error) => {
          // 抛出错误信息
          console.log('error =>', error)
          this.$message.warning('属性验证不通过，不能进行公式配置')
        })
    },
    /** 回填公式至表中 */
    setDataSourceFormula (rowId, value) {
      if (this.oldFormula !== value) {
        if (window.confirm('设备公式修改后会更新历史数据，是否修改？')) {
          Promise.all([
            this.$refs.setProductPropertyData.setValues([
              {
                rowKey: rowId, // 行的id
                values: {
                  // 在这里 values 中的 name 是你 columns 中配置的 key
                  formula: value
                }
              }
            ])
          ]).then(() => {
            // this.handleOk()
            this.changeFormulaOk(rowId, value)
          })
          // this.$message.success('设备公式已修改!')
        }
      } else {
        this.$message.success('设备公式未修改!')
      }
    },
    changeFormulaOk (rowId, value) {
      const that = this
      const actionUrl = that.url.changeFormula
      let tempAlias = ''
      // eslint-disable-next-line prefer-const
      for (let i in this.currentDataSource) {
        if (this.currentDataSource[i].id === rowId) {
          tempAlias = this.currentDataSource[i].alias
        }
      }
      // eslint-disable-next-line prefer-const
      let params = {
        deviceId: this.deviceData.id,
        formula: value,
        alias: tempAlias,
        productId: this.deviceData.productId,
        groupId: this.deviceData.deviceGroupId,
        prjCode: this.deviceData.prjCode
      }
      console.log('into changeFormulaOk params =>', params)
      that.setDevicePropertyTable.loading = true
      getAction(actionUrl, params)
        .then((res) => {
          if (res.success) {
            that.$message.success(res.message)
          } else {
            that.$message.error('操作失败')
          }
        })
        .finally(() => {
          that.isReadOnly = true
          that.setDevicePropertyTable.loading = false
        })
    },
    formulaOk () {
      // this.dataSource[index].formula = value
      console.log('into formulaOk')
    },
    /** 初始化isShowFormula 变量 */
    initShowFormula (dataSource) {
      // eslint-disable-next-line prefer-const
      for (let i in dataSource) {
        this.isShowFormula[dataSource[i].id] = dataSource[i].isCalculate === '1'
      }
      console.log('this.isShowFormula =>', this.isShowFormula)
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
</style>
