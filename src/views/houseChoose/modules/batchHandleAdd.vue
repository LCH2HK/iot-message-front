<template>
  <a-modal
    :title="title"
    :footer="null"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false"
    style="top:5%;">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!--隐藏字段-->
        <a-row :gutter="24">
          <a-col :md="12" :sm="8" style="display: none">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="楼幢外键">
              <a-input placeholder="请输入楼幢外键"
                       v-decorator="['buildingId', {initialValue: this.$route.query.buildingId}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8" style="display: none">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="选房区域 外键ID">
              <a-input placeholder="请输入选房区域 外键ID"
                       v-decorator="['chooseAreaId', {initialValue: this.$route.query.areaId}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="幢号">
              <a-input disabled v-decorator="['buildingNumber', {initialValue: buildingInfo.buildingNumber}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="总层数">
              <a-input disabled v-decorator="['floorsAmount', {initialValue: buildingInfo.floorsAmount}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!--选择层数-->
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              label="选择层数">
              <!--<a-checkbox  :checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange">全选</a-checkbox>-->
              <a-checkbox-group :options="plainOptions" @change="onChange" v-model="hasCheckedOptions"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!--选择单元-->
        <a-row>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              label="选择单元">
              <a-checkbox-group :options="unitsAmount" @change="onChangeUnit" v-model="hasCheckedUnitsAmounts"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!--选择户号-->
        <a-row>
          <a-col :md="24" :sm="24">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              label="选择户号">
              <a-radio-group  buttonStyle="solid"
                              v-decorator="['doorNumber', {initialValue:'0'}]">
                <a-radio v-for="(item,index) in householdsInUnit" :value="item" :key="index">{{ item }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="期号">
              <a-input :readOnly="title === '确定选房'" v-decorator="[ 'periodsNumber', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="户型">
              <a-input :readOnly="title === '确定选房'" placeholder="请输入户型" v-decorator="['type', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="户型描述">
              <a-input :readOnly="title === '确定选房'" placeholder="请输入户型描述" v-decorator="['description', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="居室数">
              <a-input :readOnly="title === '确定选房'" placeholder="请输入居室数" v-decorator="['roomAmount', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="建筑面积">
              <a-input
                :readOnly="title === '确定选房'"
                :onchange="inputNumberChange()"
                placeholder="请输入建筑面积"
                v-decorator="['constructionArea', {}]"
                addonAfter="平方米"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="套内建筑面积">
              <a-input
                :readOnly="title === '确定选房'"
                :onchange="inputNumberChange()"
                placeholder="请输入套内建筑面积"
                v-decorator="['innerArea', {}]"
                addonAfter="平方米"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="公摊面积">
              <a-input
                :readOnly="title === '确定选房'"
                :onchange="inputNumberChange()"
                placeholder="请输入公摊面积"
                v-decorator="['poolArea', {}]"
                addonAfter="平方米"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="得房率">
              <a-input
                :readOnly="title === '确定选房'"
                placeholder="请输入得房率" v-decorator="['roomRate', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="单价">
              <a-input
                :readOnly="title === '确定选房'"
                addonAfter="元/平方米"
                :onchange="inputNumberChange()"
                v-decorator="[ 'unitPrice', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="总价">
              <a-input
                :readOnly="title === '确定选房'"
                addonAfter="元"
                v-decorator="[ 'totalPrice', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="是否跃层">
              <!--<a-input placeholder="是否跃层" v-decorator="['duplex', {}]" />-->
              <a-radio-group  buttonStyle="solid"
                              v-decorator="['duplex', {initialValue:'0'}]">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="备注">
              <a-input
                :readOnly="title === '确定选房'"
                placeholder="请输入备注" v-decorator="['remark', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="24" :sm="8">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              class="upload"
              label="附件, 户型图">
              <a-upload
                :action="uploadAction"
                listType="picture"
                :headers="headers"
                :fileList="fileList"
                @change="handleChange"
                @preview="handlePreview"
                :multiple="true"
                class="upload-list-inline">
                <a-button>
                  <a-icon type="upload" />上传
                </a-button>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
              <br />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button @click="handleOk" type="primary" icon="check" class="confirm">{{ model.status == undefined ?
                '提交' : '保存' }}
              </a-button>
              <a-button @click="handleCancel" icon="close" class="cancel">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import ARow from 'ant-design-vue/es/grid/Row'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { httpAction } from '@/api/manage'
  import qs from 'qs'

  export default {
    name: 'batchHandleAdd',
    components: { ARow },
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins:[CmpListMixin],
    data() {
      return {
        title: '批量添加',
        visible: false,
        confirmLoading: false,
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
        form: this.$form.createForm(this),
        model: {},
        url: {
          add: "/houseChoose/houseChooseFlat/addBatch",
          edit: "/houseChoose/houseChooseFlat/edit",
          //上传组件地址
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById',
        },
        // 上传附件定义
        headers: {},
        fileList: [],
        previewImage: '',
        previewVisible: false,
        // attachment: [],
        attachment: [
          {
            groupId: '',
            fileTokens: '',
            fieldName: 'attachment',
            tableName: 'house_choose_flat'
          }
        ],
        buildingInfo: {}, // 楼幢信息，通过接口获得
        plainOptions: [], // 楼层数组
        hasCheckedOptions: [], // 已勾选的楼层数组
        unitsAmount: [], // 单元数组
        hasCheckedUnitsAmounts: [], //已勾选的单元数组
        indeterminate: true, // 是否全选
        checkAll: false,
        householdsInUnit: this.$route.query.householdsInUnit, // 总户数
        // 计算金额和面积用的变量
        constructionArea: '', //建筑面积
        innerArea: '', // 套内建筑面积
        poolArea: '', // 公摊面积
        unitPrice: '', // 单价
      }
    },
    // 钩子函数
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      this.attachment[0].fileTokens = ''
    },
    // 计算属性
    computed: {
      uploadAction: function() {
        return this.url.fileUpload
      },
      allCount: function() {
        return this.form.getFieldValue("unitPrice")
      }
    },
    methods: {
      loadData() {
      },
      open(val) {
        if (val === 0){
          this.hasCheckedOptions = []
          this.hasCheckedUnitsAmounts = []
        //  form表单初始化
          this.form.resetFields()
        }
        const that = this
        that.buildingInfo = {}
        that.plainOptions = []
        that.unitsAmount = []
        // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
        that.initUpload(this,0)
        that.axios.get('/houseChoose/houseChooseBuilding/queryById?id=' + this.$route.query.buildingId)
          .then((res) => {
            console.log(res.result)
            that.buildingInfo = res.result
            for (let i = 1; i <= that.buildingInfo.floorsAmount; i++) {
              let obj = {}
              obj.label = '第' + i + '层'
              obj.value = i
              that.plainOptions.push(obj)
            }
            for (let i = 1; i <= that.buildingInfo.unitsAmount; i++) {
              let obj = {}
              obj.label = '第' + i + '单元'
              obj.value = i
              that.unitsAmount.push(obj)
            }
            that.visible = true
          })
      },
      close() {
        this.visible = false
        this.fileList = []
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields( (err, values) => {
          if (!err) {
            that.confirmLoading = true
            // 表单数据赋值给formData
            let formData = Object.assign(this.model, values)
            formData.selectedFloor = that.hasCheckedOptions;
            formData.selectedUnit = that.hasCheckedUnitsAmounts;

            for (let i = 0; i < that.attachment.length; i++) {
              formData.attachment = that.attachment[i].groupId
            }
            let params2 = {
              strFormData: JSON.stringify(formData),
              strAttachment: JSON.stringify(this.attachment)
            }
            console.log(params2)
            //发起提交或保存请求
            httpAction(this.url.add, qs.stringify(params2), 'post').then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning('操作失败')
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      onChange(checkedValues) {
        console.log(checkedValues)
      },
      onChangeUnit(checkedValues) {
        console.log(checkedValues)
      },
      handleChange(info) {
        //调用改变方法
        this.handleChange1(info, this, 0)
      },
      handlePicCancel() {
        this.previewVisible = false
      },
      // 监听数字输入框的改变
      inputNumberChange() {
        const that = this
        //建筑面积
        if (that.form.getFieldValue('constructionArea') ===0 || that.form.getFieldValue('constructionArea') === undefined || isNaN(that.form.getFieldValue('constructionArea'))) {
          that.constructionArea = 0.00
        } else {
          that.constructionArea = parseFloat(that.form.getFieldValue('constructionArea'))
        }
        // 套内建筑面积
        if (that.form.getFieldValue('innerArea') ===0 || that.form.getFieldValue('innerArea') === undefined || isNaN(that.form.getFieldValue('innerArea'))) {
          that.innerArea = 0.00
        } else {
          that.innerArea = parseFloat(that.form.getFieldValue('innerArea'))
        }
        // 公摊面积
        if (that.form.getFieldValue('poolArea') ===0 || that.form.getFieldValue('poolArea') === undefined || isNaN(that.form.getFieldValue('poolArea'))) {
          that.poolArea = 0.00
        } else {
          that.poolArea = parseFloat(that.form.getFieldValue('poolArea'))
        }
        // 单价
        if (that.form.getFieldValue('unitPrice') ===0 || that.form.getFieldValue('unitPrice') === undefined || isNaN(that.form.getFieldValue('unitPrice'))) {
          that.unitPrice = 0.00
        } else {
          that.unitPrice = parseFloat(that.form.getFieldValue('unitPrice'))
        }
        // console.log(that.constructionArea,'-',that.innerArea,'-',that.poolArea,'-',that.unitPrice)
      },
      computeRoomRate() {
        const that = this
        that.$nextTick(() => {
          setTimeout(() => {
            that.form.setFieldsValue(
              { roomRate: (((that.innerArea/ (that.constructionArea + that.poolArea)) * 100)).toFixed(2) + '%' }
            )
          }, 0)
        })
      },
      computeTotalPrice() {
        const that = this
        that.$nextTick(() => {
          setTimeout(() => {
            that.form.setFieldsValue(
              { totalPrice: (that.constructionArea * that.unitPrice).toFixed(2) }
            )
          }, 0)
        })
      }
    },
    watch: {
      constructionArea: function() {
        this.computeRoomRate();
      },
      innerArea: function() {
        this.computeRoomRate();
      },
      poolArea: function() {
        this.computeRoomRate();
      },
      unitPrice: function() {
        this.computeTotalPrice();
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~@assets/less/modal.less';
</style>