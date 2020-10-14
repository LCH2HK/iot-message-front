<!--设备点码配置 用于设备详情中 -->
<template>
  <a-card :bordered="false">
    <div>
      <div>
        <!-- 同步按钮 -->
        <a-row class="btnClass" style="padding: 5px">
          <a-button
            @click="editTable"
            icon="edit"
            type="primary"
            style="margin-left:10px; "
            class="buttonWrap"
            v-if="isReadOnly && !isDeviceOnline && !propertiesIsNull && this.projectMsg"
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
        <j-editable-table
          :ref="refKeys[0]"
          :loading="setBaseDeviceDataTable.loading"
          :columns="setBaseDeviceDataTable.columns"
          :dataSource="setBaseDeviceDataTable.dataSource"
          :maxHeight="300"
          :rowNumber="true"
          :rowSelection="!isDeviceOnline && !isReadOnly"
          :disabled="isDeviceOnline || isReadOnly"
          @added="handleAddRow"
          @deleted="handleDeleteRow"
        >
          <template v-slot:selectCollect="props">
            <PointCodeInput
              :value="props"
              :prjCode="deviceData.prjCode"
              :readOnly="isDeviceOnline || isReadOnly|| isShowFormula[props.rowId]"
              @setPointCode="setPointCode"
            ></PointCodeInput>
          </template>
          <template v-slot:action="props">
            <!--            <a-checkbox @change="onChangeFormulaCheckbox(props)" >-->
            <!--            </a-checkbox>-->
            <!--            <a @click="handleSetFormula(props)" :disabled="title === '查看'">公式配置</a>-->
            <a-tooltip  placement="rightTop" :title="props.text" v-show="!isReadOnly && isShowFormula[props.rowId]">
              <a @click="handleSetFormula(props)">公式配置</a>
            </a-tooltip>
            <span v-show="isReadOnly">{{props.text}}</span>
          </template>
        </j-editable-table>
      </div>
    </div>
    <FormulaSettingModal ref="formulaForm" @ok="formulaOk" @setFormula="setDataSourceFormula"
                         :data-source="currentDataSource" :row-id="rowId"></FormulaSettingModal>
  </a-card>
</template>

<script>
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import qs from 'qs'
import { FormTypes } from '../../../utils/JEditableTableUtil'
import { getAction, httpAction } from '../../../api/manage'
import JEditableTable from '../../../components/cmp/JEditableTable1.5.0'
import PointCodeInput from './modules/PointCodeInput'
import FormulaSettingModal from '../propertyTemplate/modules/FormulaSettingModal'

export default {
  name: 'PointCode',
  mixins: [JEditableTableMixin],
  props: {
    datas: {
      type: Object,
      default () {
        return {}
      }
    },
    deviceData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    JEditableTable,
    PointCodeInput,
    FormulaSettingModal
  },
  data () {
    return {
      visible: false,
      prjInfo: {},
      description: '描述信息',
      projectData: '',
      // 表头
      confirmLoading: false,
      collapsed: false,
      isChange: false,
      oldFormula: '', // 暂存旧的公式
      propertiesIsNull: false, // 属性为空时，不渲染表格
      isDeviceOnline: false, // 设备在线，不允许修改
      isReadOnly: true, // 默认只读，点击编辑，修改
      isShowFormula: {}, // 是否展示公式配置页面，内容为{rowId :true ,rowId : false}
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      refKeys: ['setBaseDeviceData'],
      activeKey: 'setBaseDeviceData',
      currentDataSource: [],
      rowId: '',
      setBaseDeviceDataTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '属性名称',
            key: 'unitName',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true,
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
            disabled: true,
            placeholder: '请输入对应${title}'
          },
          {
            title: '单位',
            key: 'unit',
            disabled: true,
            type: FormTypes.select,
            options: [],
            defaultValue: '',
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
            title: '采集点编号',
            key: 'collect',
            type: FormTypes.input,
            disabled: true,
            defaultValue: '',
            placeholder: '自动回填${title}'
          },
          {
            title: '采集点名称',
            key: 'collectName',
            type: FormTypes.slot,
            slotName: 'selectCollect',
            defaultValue: ''
          },
          {
            title: '是否计算',
            key: 'isCalculate',
            width: '100px',
            disabled: true,
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
        changeProductState: '/product/product/changeProductState',
        queryById: '/device/device/queryById',
        edit: '/device/device/edit',
        list: '/device/device/list',
        // 获取采集点名称
        // getCollectNames: '/data/deviceData/getCollectNames',
        productInfos: '/product/product/productNames',
        units: '/propertyUnit/propertyUnit/getUnits',
        setAlertCondition: '/data/deviceData/setAlertConditionByCollect',
        changeFormula: 'device/device/changeFormula'
      },
      rowKey: '',
      projectMsg: ''
    }
  },
  beforeCreate () {},
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))

    //   //查询项目数据数据
    // let that = this
    //   queryProjectByPrjCode({prjCode:this.deviceData.prjCode})
    //       .then((res) => {
    //         that.prjInfo.dataServiceUrl = res.result.dataServiceUrl;
    //         that.prjInfo.realDb = res.result.realDb
    //         that.prjInfo.prjCode = res.result.prjCode
    //           // this.projectData = res.result;
    //           // this.url.getCollectNames = this.dataServiceUrl+this.url.getCollectNames;
    //           console.log("res.result =>",res.result)
    //           // console.log("getCollectNames =>",this.url.getCollectNames)
    //       }).then(()=>{
    //       //获取采集点
    //       // this.getCollectNames(this.deviceData.deviceName)
    //   })
    console.log(this.projectMsg)
    console.log('PointCode:this.datas=>', this.datas)
    console.log('PointCode:this.deviceData=>', this.deviceData)
  },
  watch: {
    // '$route'(to, from) {
    //   //重新加载数据
    //   this.loadData()
    // }
  },
  mounted () {
    // 加载数据
    this.loadData()
  },
  // 计算属性
  computed: {},
  methods: {
    setPointCode (selectPointCode) {
      this.$refs.setBaseDeviceData.setValues([
        {
          rowKey: selectPointCode.rowKey,
          values: {
            collect: selectPointCode.value.toString(10),
            collectName: selectPointCode.name
          }
        }
      ])
    },
    add () {
      this.edit({})
    },
    handleAddRow () {
      this.isReadOnly = false
    },
    handleDeleteRow () {
      this.isReadOnly = false
    },
    // 编辑点码表
    editTable () {
      this.isReadOnly = false
      this.setBaseDeviceDataTable.columns[1].readOnly = true
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    loadData () {
      // 获取采集数据单位
      this.getDeviceProperties()
      // 加载子表数据
      this.requestSubTableData(this.url.list, { id: this.deviceData.id }, this.setBaseDeviceDataTable)
    },
    /** 查询某个tab的数据 */
    requestSubTableData (url, params, tab) {
      console.log('requestSubTableData', tab)
      tab.loading = true
      getAction(url, params)
        .then(res => {
          // debugger
          if (res.result.records[0].deviceProperties) {
            if (res.result.records[0].deviceState === '1') {
              this.isDeviceOnline = true
            }
            const listArr = res.result.records[0].deviceProperties
            tab.dataSource = JSON.parse(listArr)
            this.initShowFormula(tab.dataSource)
          } else {
            this.propertiesIsNull = true
          }
        })
        .finally(() => {
          tab.loading = false
        })
    },
    // 获取单位
    getDeviceProperties () {
      const that = this
      getAction(that.url.units, {}).then(res => {
        if (res.success) {
          for (let i = 0; i < res.result.length; ++i) {
            const ops = []
            for (let i = 0; i < res.result.length; ++i) {
              ops[i] = new Object()
              ops[i].value = res.result[i].unitType
              ops[i].title = res.result[i].name + '(' + res.result[i].unitType + ')'
            }
            that.setBaseDeviceDataTable.columns[1].options = ops
          }
        } else {
          that.$message.error('获取设备属性失败')
        }
      })
    },
    // //获取采集点
    // getCollectNames(name) {
    //     // let name = '汇流箱'
    //     let that = this
    //     let params = {
    //         collectDeviceName: name,
    //         realDb :this.projectData.realDb
    //     }
    //     postAction(this.url.getCollectNames, params).then(res => {
    //         if (res.success) {
    //             let ops = []
    //             // console.log("res.result =>", res.result);
    //             for (let i = 0; i < res.result.length; ++i) {
    //                 ops[i] = new Object();
    //                 ops[i].value = res.result[i].collectId.toString(10);
    //                 ops[i].title = res.result[i].collectName
    //                 // ops[i].value = res.result[i].collectName;
    //             }
    //             that.setBaseDeviceDataTable.columns[4].options = ops
    //         } else {
    //             that.$message.warning('采集点获取失败')
    //         }
    //     })
    // },
    handleCancel () {
      // 重载子表数据
      console.log('重载子表数据', this.setBaseDeviceDataTable)
      this.setBaseDeviceDataTable.dataSource.forEach(data => {
        // debugger
        if (data.collect == '') {
          this.$refs.setBaseDeviceData.setValues([
            {
              rowKey: data.id,
              values: {
                collectName: ''
              }
            }
          ])
        }
      })
      this.requestSubTableData(this.url.list, { id: this.deviceData.id }, this.setBaseDeviceDataTable)
      this.isReadOnly = true
    },
    handleEdit () {
      this.isEdit = true
    },
    handleOk () {
      /** 触发表单验证 */
      this.$refs.setBaseDeviceData.getValues((error, values) => {
        // console.log(values)
        //
        // console.log(this.deviceData.deviceName)
        // alias、valueLength、valueType属性拼接
        for (var i = 0; i < values.length; i++) {
          values[i].alias = this.setBaseDeviceDataTable.dataSource[i].alias
          values[i].valueType = this.setBaseDeviceDataTable.dataSource[i].valueType
          values[i].valueLength = this.setBaseDeviceDataTable.dataSource[i].valueLength
          values[i].digitLength = this.setBaseDeviceDataTable.dataSource[i].digitLength
        }
        // 错误数 = 0 则代表验证通过
        if (error === 0) {
          const that = this
          const method = 'post'
          const actionUrl = that.url.edit
          const formData = that.deviceData
          formData.deviceProperties = JSON.stringify(values)
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              console.log(res)
              if (res.success) {
                that.$message.success(res.message)
              } else {
                that.$message.error('操作失败')
              }
            })
            .finally(() => {
              that.isReadOnly = true
              that.confirmLoading = false
            })
            .finally(() => {
              this.isChange = false
            })
        } else {
          this.$message.error('验证未通过')
        }

        // TODO: 挂接后回填 已废弃 统一在后端编辑接口里处理
        // console.log(values)
        // values.forEach(data => {
        //   const params = {
        //     minValue: data.minValue,
        //     maxValue: data.maxValue,
        //     productId: this.deviceData.productId,
        //     deviceName: this.deviceData.deviceName,
        //     deviceId: this.deviceData.id,
        //     collect: data.collect,
        //     realDb: this.projectMsg.realDb,
        //     prjCode: this.projectMsg.prjCode
        //   }
        //   console.log('params=>', params)
        //   postAction(this.projectMsg.dataServiceUrl + this.url.setAlertCondition, params).then(res => {
        //     console.log(res)
        //   })
        // })
      })
    },
    handleSetFormula (props) {
      const { rowId } = props
      // 暂存旧的公式
      this.oldFormula = props.text
      console.log('handleSetFormula  rowId =>', rowId)
      Promise.all([this.$refs.setBaseDeviceData.getValuesPromise()]).then((values) => {
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
      that.setBaseDeviceDataTable.loading = true
      getAction(actionUrl, params).then(res => {
        if (res.success) {
          that.$message.success(res.message)
        } else {
          that.$message.error('操作失败')
        }
      })
        .finally(() => {
          that.isReadOnly = true
          that.setBaseDeviceDataTable.loading = false
        })
    },
    setDataSourceFormula (rowId, value) {
      if (this.oldFormula !== value) {
        if (window.confirm('设备公式修改后会更新历史数据，是否修改？')) {
          Promise.all([this.$refs.setBaseDeviceData.setValues([{
            rowKey: rowId, // 行的id
            values: { // 在这里 values 中的 name 是你 columns 中配置的 key
              formula: value
            }
          }])
          ]).then(() => {
            // this.handleOk()  点码表中不提交 点击保存后一起提交
            this.changeFormulaOk(rowId, value)
            // this.$message.success('设备公式已修改!')
          })
        }
      } else {
        this.$message.success('设备公式未修改!')
      }
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
