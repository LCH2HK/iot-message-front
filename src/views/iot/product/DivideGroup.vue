<!--设备分组列表展示页面 已停用，默认不分组 -->
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
            v-if="isReadOnly && this.ifProductPublished == 0 "
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
        <j-editable-table
          :ref="refKeys[0]"
          :loading="setDivideGroupTable.loading"
          :columns="setDivideGroupTable.columns"
          :dataSource="setDivideGroupTable.dataSource"
          :maxHeight="300"
          :rowNumber="true"
          :readOnly="isReadOnly"
          :rowSelection="!isReadOnly"
          :actionButton="!isReadOnly"
        ></j-editable-table>
      </div>
    </div>
  </a-card>
</template>

<script>
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import JDictSelectTag from '../../../components/dict'
import { FormTypes, validateFormAndTables } from '../../../utils/JEditableTableUtil'
import { getAction, httpActionHeader } from '../../../api/manage'

export default {
  name: 'DivideGroup',
  mixins: [JEditableTableMixin],
  props: {
    productId: {
      type: String,
      default: ''
    },
    ifProductPublished: {
      type: Number,
      default: 0
    }
  },
  components: {
    JDictSelectTag
  },
  data () {
    return {
      visible: false,
      description: '描述信息',
      // 表头
      confirmLoading: false,
      collapsed: false,
      isChange: false,
      isReadOnly: true, // 默认只读，点击编辑，修改
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      refKeys: ['setProductPropertyData'],
      activeKey: 'setProductPropertyData',
      setDivideGroupTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '组名',
            key: 'deviceGroupName',
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
          }
        ]
      },
      url: {
        queryById: '/product/product/queryById',
        edit: '/device/deviceGroup/edit',
        list: '/product/product/list',
        productInfos: '/product/product/productNames',
        getDeviceGroupByProduct: 'device/deviceGroup/getDeviceGroupByProduct'
      }
    }
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
      // 加载子表数据
      this.requestSubTableData(
        this.url.getDeviceGroupByProduct,
        { productId: this.productId },
        this.setDivideGroupTable
      )
    },
    /** 查询某个tab的数据 */
    requestSubTableData (url, params, tab) {
      tab.loading = true
      getAction(url, params)
        .then(res => {
          if (res.success) {
            tab.dataSource = res.result
          } else {
            this.$message.error('获取分组数据失败！')
          }
        })
        .finally(() => {
          tab.loading = false
        })
    },
    // 重载子表数据
    handleCancel () {
      this.requestSubTableData(
        this.url.getDeviceGroupByProduct,
        { productId: this.productId },
        this.setDivideGroupTable
      )
      this.isReadOnly = true
    },
    handleEdit () {
      this.isEdit = true
    },
    handleOk () {
      /** 触发表单验证 */
      this.getAllTable()
        .then(tables => {
          /** 一次性验证主表和所有的次表 */
          return validateFormAndTables(this.form, tables)
        })
        .then(allValues => {
          let that = this
          let method = 'post'
          let actionUrl = that.url.edit
          let productId = that.productId
          let formData = {
            productId: productId,
            groupList: JSON.stringify(allValues.tablesValue[0].values),
            deleteIds: JSON.stringify(allValues.tablesValue[0].deleteIds)
          }
          httpActionHeader(actionUrl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                allValues.tablesValue[0].deleteIds = []
                this.loadData()
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
