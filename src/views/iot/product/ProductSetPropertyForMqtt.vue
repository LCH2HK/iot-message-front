<!--不接入终端的产品（MQTT）属性配置  用于产品详情中 -->
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
        ></j-editable-table-new>
      </div>
    </div>
  </a-card>
</template>

<script>
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import qs from 'qs'
import { FormTypes, validateFormAndTables } from '../../../utils/JEditableTableUtil'
import { getAction, httpAction } from '../../../api/manage'

export default {
  name: 'ProductSetPropertyForMqtt',
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
  },
  data () {
    return {
      visible: false,
      description: '描述信息',
      // 表头
      confirmLoading: false,
      collapsed: false,
      isChange: false,
      propertiesIsNull: false, // 属性为空时，不渲染表格
      ifProductPublished: false, // 设备在线，不允许修改
      isReadOnly: true, // 默认只读，点击编辑，修改
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      refKeys: ['setProductPropertyData'],
      activeKey: 'setProductPropertyData',
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
            placeholder: '请输入对应${title}'
          },
          {
            title: '单位',
            key: 'unit',
            type: FormTypes.select,
            defaultValue: '',
            disabled: true,
            placeholder: '请选择对应${title}'
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
    console.log('isAccessGateway=>' + this.pData.isAccessGateway)
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
      console.log('pData', this.pData)
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
            this.$message.error('获取数据失败！')
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
      let that = this
      getAction(that.url.units, {}).then(res => {
        if (res.success) {
          for (let i = 0; i < res.result.length; ++i) {
            let ops = []
            for (let i = 0; i < res.result.length; ++i) {
              ops[i] = {}
              ops[i].value = res.result[i].unitType
              ops[i].title = res.result[i].name + '(' + res.result[i].unitType + ')'
            }
            that.setProductPropertyTable.columns[2].options = ops
          }
        } else {
          that.$message.error('获取设备属性失败')
        }
      })
    },
    handleOk () {
      /** 触发表单验证 */
      this.getAllTable()
        .then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
        })
        .then(allValues => {
          let aliasObj = {}
          allValues.tablesValue[0].values.map(data => {
            aliasObj[data.alias] = data.id
          })
          if (Object.keys(aliasObj).length < allValues.tablesValue[0].values.length) {
            this.$message.error('存在相同的属性标识!')
            return
          }
          let that = this
          let method = 'post'
          let actionUrl = that.url.edit
          let formData = that.pData

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
              that.confirmLoading = false
            })
        })
        .finally(() => {
          this.isChange = false
        })
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
