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
        <a-row :gutter="24">

          <a-col :md="12" :sm="8" style="display: none">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="楼幢外键">
              <a-input placeholder="请输入楼幢外键"
                       v-decorator="['buildingId',{initialValue: this.$route.query.buildingId}]"/>
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
              <a-input :readOnly="title === '确定选房'" placeholder="请输入幢号" v-decorator="['buildingNumber', {}]"/>
            </a-form-item>
          </a-col>
          <!--<a-col :md="12" :sm="8">-->
            <!--<a-form-item-->
              <!--:labelCol="labelCol"-->
              <!--:wrapperCol="wrapperCol"-->
              <!--label="房号">-->
              <!--<a-input placeholder="请输入房号" v-decorator="['flatNumber', {}]"/>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="层数">
              <a-input :readOnly="title === '确定选房'" placeholder="请输入层数" v-decorator="['floorNumber', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="单元号">
              <a-input :readOnly="title === '确定选房'" placeholder="请输入单元号" v-decorator="['unitNumber', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="门牌号">
              <a-input :readOnly="title === '确定选房'" placeholder="请输入门牌号" v-decorator="['doorNumber', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="期号">
              <a-input :readOnly="title === '确定选房'" v-decorator="[ 'periodsNumber', {}]" style="width: 100%"/>
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
                              v-decorator="['duplex', {initialValue:'0'}]"
                              :disabled="title === '确定选房'">
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
              label="户型图">
              <a-upload
                :disabled="title === '确定选房'"
                :action="uploadAction"
                listType="picture"
                :headers="headers"
                :fileList="fileList"
                @change="handleChange"
                @preview="handlePreview"
                :multiple="true"
                class="upload-list-inline"
                v-decorator="['attachment',{}]">
                <a-button>
                  <a-icon type="upload"/>
                  上传
                </a-button>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicCancel">
                <img alt="example" style="width: 100%" :src="previewImage"/>
              </a-modal>
              <br/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button v-if="title === '确定选房'" @click="chooseOk" type="primary" icon="check" class="confirm">
                确定选房
              </a-button>
              <a-button v-if="title !== '确定选房'" @click="handleOk" type="primary" icon="check" class="confirm">{{ model.status == undefined ?
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
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
  import qs from 'qs'

  export default {
    name: 'HouseChooseFlatModal',
    //组件应用定义
    components: {
      JDictSelectTag,
      JSelectUserNew
    },
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins: [CmpListMixin],
    // 数据定义
    props: {
      nowChooserId: {
        type: String,
      },
      nowChooserName: {
        type: String,
      }
    },
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
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
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          add: '/houseChoose/houseChooseFlat/add',
          edit: '/houseChoose/houseChooseFlat/edit',
          //上传组件地址
          fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
          fileFind: '/file/cmpFileGroup/findFilesByGroupId',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileDownLoad: '/file/uploadFile/downloadFileById'
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
        // 计算金额和面积用的变量
        constructionArea: '', //建筑面积
        innerArea: '', // 套内建筑面积
        poolArea: '', // 公摊面积
        unitPrice: '', // 单价
      }
    },
    // 钩子函数
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers = { 'X-Access-Token': token }
      this.attachment[0].fileTokens = ''
    },
    // 计算属性
    computed: {
      uploadAction: function() {
        return this.url.fileUpload
      },
    },
    //方法
    methods: {
      loadData() {
      },
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'buildingId', 'chooseAreaId', 'buildingNumber', 'flatNumber', 'floorNumber', 'unitNumber', 'doorNumber', 'periodsNumber', 'type', 'description', 'roomAmount', 'constructionArea', 'innerArea', 'poolArea', 'roomRate', 'unitPrice', 'totalPrice', 'duplex', 'remark', 'attachment'))
        })
        // 初始化上传文件  0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
        this.initUpload(this,0,this.model.attachment)
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.fileList = []
      },
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let actionUrl = ''
            let method = 'post'
            //判断操作类型，新增或者编辑
            if (!this.model.id) {
              actionUrl += this.url.add
            } else {
              actionUrl += this.url.edit
            }
            // 表单数据赋值给formData
            let formData = Object.assign(this.model, values)

            // 选人控件字段赋值给formData
            // this.uploadMan(formData, this)

            //对formData中的时间字段进行 时间格式化

            // 上传组件
            console.log(that.attachment,'上传文件信息')
            for (let i = 0; i < that.attachment.length; i++) {
              formData.attachment = that.attachment[i].groupId
            }
            let params2 = {
              strFormData: JSON.stringify(formData),
              strAttachment: JSON.stringify(this.attachment)
            }
            //发起提交或保存请求
            httpAction(actionUrl, qs.stringify(params2), method).then((res) => {
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
      handleChange(info) {
        //调用改变方法
        this.handleChange1(info, this, 0)
      },
      handlePicCancel() {
        this.previewVisible = false
      },
      handleCancel() {
        this.close()
      },
      chooseOk() {
        if (this.nowChooserId === undefined || this.nowChooserId === ''){
          this.$message.error('当前选房人为空，操作无效')
        } else {
          this.axios.post('/online/choose/add', {
            chooserId: this.nowChooserId,
            chooserName: this.nowChooserName,
            chooseAreaId: this.model.chooseAreaId,
            buildingId: this.model.buildingId,
            id: this.model.id,
            type: this.model.type,
            buildingNumber: this.model.buildingNumber,
            unitNumber: this.model.unitNumber,
            doorNumber: this.model.doorNumber,
          })
            .then((res) => {
              console.log(res)
            })
          this.$emit('getChooseInfo')
        }
        this.close()
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

<style lang="less" scoped>
  @import '~@assets/less/modal.less';
</style>