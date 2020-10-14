<!--
   ！！！已废弃！！！  现在用PointCodeInput、PointCodeSelectModal
-->
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
        <img :src="title | IconUrl" />
        {{ title }}
        <span>{{ nodeName ? '(' + nodeName + ')': '' }}</span>
      </div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <!-- 主表单区域 -->
    <a-form :form="form" style="padding-top: 30px">
      <!-- 常用选择/输入控件 -->
      <a-row :gutter="24">
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="对应产品">
            <a-input
              v-model="deviceType"
              :triggerChange="true"
              :disabled="this.nodeId != '' && this.nodeId != 'UserTask_0' || this.title == '查看'|| this.title == '编辑'"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="设备编号">
            <a-input
              placeholder="请输入设备编号,不填写则自动生成"
              v-decorator="['deviceKey', {}]"
              :disabled="true"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备名称">
            <a-input placeholder="请输入设备名称" v-decorator="['deviceName', {}]" :disabled="true" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8">
          <a-form-item :labelCol="labelColRight" :wrapperCol="wrapperColRight" label="设备状态">
            <j-dict-select-tag
              v-decorator="['deviceState', {}]"
              :triggerChange="true"
              placeholder="请选择设备状态"
              dictCode="iot_device_state"
              :disabled="true"
            ></j-dict-select-tag>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="8" v-if="false">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设备名称">
            <a-input placeholder="请输入设备名称" v-decorator="['deviceProperties', {}]" :disabled="true" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="属性配置" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="setBaseDeviceDataTable.loading"
          :columns="setBaseDeviceDataTable.columns"
          :dataSource="setBaseDeviceDataTable.dataSource"
          :maxHeight="300"
          :rowNumber="true"
          :rowSelection="false"
          :actionButton="title !== '查看'"
          :readOnly="title==='查看' || (nodeId !== undefined && nodeId !== '')"
        ></j-editable-table>
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
        v-show="title !== '查看'"
      >保存</a-button>
      <a-button @click="handleCancel" icon="close" class="cancel" v-show="title !== '查看'">关闭</a-button>
    </a-form-item>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { FormTypes } from '@/utils/JEditableTableUtil'
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import Vue from 'vue'
import qs from 'qs'
import { httpAction } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import { validateFormAndTables } from '@/utils/JEditableTableUtil'
import JSelectMultiple from '@/components/cmp/JSelectMultiple'
import { getAction, postAction } from '../../../../api/manage'

export default {
  name: 'PointCodeModal',
  mixins: [JEditableTableMixin],
  components: {
    JDictSelectTag,
    JSelectUserNew,
    JSelectMultiple
  },
  data() {
    return {
      attachment: [],
      param: [],
      filterName: '',
      deviceDatas: [],
      nodeName: '',
      nodeId: '',
      productInfos: [],
      deviceType: '',
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
        sm: { span: 3 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      labelColRight: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperColRight: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      validatorRules: {
        typeName: {
          rules: [{ required: true, message: ' ' }, { validator: this.validateTypeName }]
        },
        typeKey: {
          rules: [{ required: true, message: ' ' }, { validator: this.validateTypeKey }]
        },
        description: {
          rules: [{ validator: this.validateDescription }]
        }
      },
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      refKeys: ['setBaseDeviceData'],
      activeKey: 'setBaseDeviceData',
      setBaseDeviceDataTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '属性',
            key: 'unitName',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true,
            placeholder: '请输入${title}'
          },
          {
            title: '单位',
            key: 'unit',
            type: FormTypes.select,
            options: [],
            defaultValue: '',
            placeholder: '请选择对应${title}'
          },
          {
            title: '采集点',
            key: 'collect',
            type: FormTypes.select,
            options: [],
            defaultValue: '',
            placeholder: '请选择对应${title}'
          }
        ]
      },
      url: {
        list: '/device/device/list',
        edit: '/device/device/edit',
        //  list: "/attributeTemplate/deviceType/list",
        //获取采集点名称
        getCollectNames: '/data/deviceData/getCollectNames',
        productInfos: '/product/product/productNames',
        units: '/propertyUnit/propertyUnit/getUnits'
      }
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
        case '审核':
          return require(`@assets/img/login/audit.png`)
        default:
          break
      }
    }
  },
  beforeCreate() {},
  created() {
  },
  mounted() {},
  // 计算属性
  computed: {},
  methods: {
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter(record, deviceType) {
      console.log('查看selectProductNames', deviceType)
      this.deviceType = deviceType
      console.log('查看record', record)
      if (record) {
        if (record.nodeId !== undefined) {
          this.nodeId = record.nodeId
        }
        if (record.nodeName !== undefined) {
          this.nodeName = record.nodeName
        }
        this.model = Object.assign(
          {
            nodeName: record.nodeName
          },
          record
        )

        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'deviceKey', 'deviceName', 'deviceState', 'deviceProperties'))
        })
        //获取采集点
        if (this.model.deviceName) {
          this.getCollectNames(this.model.deviceName)
        }
        //获取采集数据单位
        this.getDeviceProperties()

        // 加载子表数据
        if (this.model.deviceProperties) {
          let param = { id: this.model.id }
          this.requestSubTableData(this.url.list, param, this.setBaseDeviceDataTable)
        }
      }
    },
    /** 查询某个tab的数据 */
    requestSubTableData(url, params, tab) {
      tab.loading = true
      getAction(url, params)
        .then(res => {
          if (res.success) {
            let listArr = res.result.records[0].deviceProperties
            tab.dataSource = JSON.parse(listArr)
          } else {
            console.log('dataSource = ' + tab.dataSource)
            this.$message.error('获取点码表数据失败！')
          }
        })
        .finally(() => {
          tab.loading = false
        })
    },
    //获取所有产品ID和名称
    getProductInfos() {
      let that = this
      getAction(that.url.productInfos, {}).then(res => {
        if (res.success) {
          // that.$message.success('表单初始化成功')
          that.productInfos = that.productInfos.concat(res.result)
          console.log('查看数据=》', that.productInfos)
          // that.loadData();
        } else {
          that.$message.warning('表单初始化失败')
        }
      })
    },
    //获取单位
    getDeviceProperties() {
      let that = this
      getAction(that.url.units, {}).then(res => {
        if (res.success) {
          for (let i = 0; i < res.result.length; ++i) {
            let ops = []
            for (let i = 0; i < res.result.length; ++i) {
              ops[i] = new Object()
              ops[i].value = res.result[i].unitType
              ops[i].title = res.result[i].name + '(' + res.result[i].unitType + ')'
            }
            that.setBaseDeviceDataTable.columns[1].options = ops
          }
        } else {
          that.$message.warning('获取设备属性失败')
        }
      })
    },
    //获取采集点
    getCollectNames(name) {
      // let name = '汇流箱'
      let that = this
      let params = {
        collectDeviceName: name
      }
      postAction(this.url.getCollectNames, params).then(res => {
        if (res.success) {
          let ops = []
          for (let i = 0; i < res.result.length; ++i) {
            ops[i] = new Object()
            //ops[i].value = res.result[i].collectId;
            ops[i].title = res.result[i].collectName
            ops[i].value = res.result[i].collectName
          }
          that.setBaseDeviceDataTable.columns[2].options = ops
        } else {
          that.$message.warning('采集点获取失败')
        }
      })
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      console.log(allValues.tablesValue[0].values)
      //时间格式化
      return {
        ...main // 展开
        // typeProperties: allValues.tablesValue[0].values,
      }
    },
    // request(formData) {
    //   let actionUrl = ''
    //   let url = this.url.add, method = 'post'
    //   if (this.model.id) {
    //     url = this.url.edit
    //     method = 'post' //put修改
    //   }
    //   // 发起请求
    //   this.confirmLoading = true
    //   httpAction(url, data, method).then((res) => {
    //     if (res.success) {
    //       this.$message.success(res.message)
    //       this.$emit('ok')
    //       this.close()
    //     } else {
    //       this.$message.warning(res.message)
    //     }
    //   }).finally(() => {
    //     this.confirmLoading = false
    //   })
    // },
    // 上传组件改变回调
    handleChange(info) {
      //调用改变方法
      this.handleChangeMixin(info, this, 0)
    },
    handleOk() {
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
          let actionUrl = that.url.edit
          let formData = Object.assign(this.model, allValues.formValue)
          console.log('form=>', allValues.formValue)
          console.log('subTag=>', allValues.tablesValue[0].values)

          formData['deviceProperties'] = JSON.stringify(allValues.tablesValue[0].values)
          httpAction(actionUrl, qs.stringify(formData), method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                console.log(res)
                that.$message.warning('操作失败')
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        })
    },
    onChange(val, visible) {
      if (val.target.value == '1') {
        this[visible] = true
      } else {
        this[visible] = false
      }
    },
    onChange1(val) {
      if (val.target.value == 'true') {
        this.previewVisible = true
      } else {
        this.previewVisible = false
      }
    },
    validateTypeName(rule, value, callback) {
      let val = value ? value : ''
      if (val.length == 0) {
        callback('请输入类别名称!')
      } else if (val.length > 200) {
        callback('类别名称不可超过200个字符')
      } else if (val.replace(/\s*/g, '') == '') {
        callback('类别名称不可为空!')
      } else {
        callback()
      }
    },
    validateTypeKey(rule, val, callback) {
      let value = val ? val : ''
      if (value.length === 0) {
        callback('请输入标识符！')
      } else if (val.length > 100) {
        callback('标识符不可超过100个字符')
      } else if (val.replace(/\s*/g, '') === '') {
        callback('标识符不可为空!')
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback('标识符不可输入汉字!')
      } else {
        let params = {
          code: val.trim()
        }
        let method = 'post'
        console.log(params)
        httpAction(this.url.duplicateCheck, params, method).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/modal.less';
</style>
