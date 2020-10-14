<template>
  <div style="width:95%; margin:0 auto">
    <a-card title="发布">
      <a-form :form="form">
        <a-row>
          <!--标题 -->
          <a-col :span="24">
            <a-form-item label="标题" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <a-input v-decorator="['title', {}]" />
            </a-form-item>
          </a-col>
          <!-- 富文本编辑器 -->
          <a-col :span="24">
            <a-form-item label="正文" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <j-editor v-model="msg" />
            </a-form-item>
          </a-col>

          <!-- 正文附件 -->
          <a-col :md="24" :sm="8">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              class="upload"
              label="正文附件"
            >
              <a-upload
                :action="uploadAction"
                listType="picture"
                :headers="headers"
                :fileList="fileList"
                @change="handleChange($event,'fileList',0)"
                @preview="handlePreview($event,'1')"
                :multiple="true"
                class="upload-list-inline"
              >
                <a-button>
                  <a-icon type="upload" />选择附件
                </a-button>
              </a-upload>
              <a-modal :visible="previewVisible1" :footer="null" @cancel="handlePicCancel('1')">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
              <br />
            </a-form-item>
          </a-col>
          <!-- 其他附件 -->
          <a-col :md="24" :sm="8">
            <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              class="upload"
              label="其他附件"
            >
              <a-upload
                :action="uploadAction"
                listType="picture"
                :headers="headers"
                :fileList="fileList2"
                @change="handleChange($event,'fileList2',1)"
                @preview="handlePreview($event,'2')"
                :multiple="true"
                class="upload-list-inline"
              >
                <a-button>
                  <a-icon type="upload" />选择附件
                </a-button>
              </a-upload>
              <a-modal :visible="previewVisible2" :footer="null" @cancel="handlePicCancel('2')">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
              <br />
            </a-form-item>
          </a-col>
          <!-- 填写日期 -->
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发布日期">
              <a-date-picker v-decorator="['createTime', {}]" disabled />
            </a-form-item>
          </a-col>
          <!-- 填写部门 -->
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发布部门">
              <a-input v-decorator="['informationDeptname', {}]" disabled />
            </a-form-item>
          </a-col>
          <!-- 填写人 -->
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发布人">
              <a-input v-decorator="['createBy', {}]" disabled />
            </a-form-item>
          </a-col>
          <!-- 作者 -->
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="作者">
              <a-input v-decorator="['authorFullname', {}]" />
            </a-form-item>
          </a-col>

          <!-- 按钮 -->
          <a-col :md="24" :sm="8">
            <a-form-item class="btnClass">
              <a-button icon="check" @click="handleOk(1)" class="confirm" type="primary">发布</a-button>
              <a-button icon="diff" @click="handleOk(2)" class="cancel" type="primary">暂存</a-button>
              <a-button icon="close" class="cancel" type="primary" @click="close">关闭</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import JEditor from '@/components/cmp/JEditor'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import Vue from 'vue'
import qs from 'qs'
import pick from 'lodash.pick'
import moment from 'moment'
import { httpAction } from '@api/manage'
import { mapGetters } from 'vuex'
import { close } from 'fs'
import vuex from 'vue'
export default {
  components: {
    JEditor
  },
  mixins: [CmpListMixin],
  data() {
    return {
      text: '',
      model: {},
      form: this.$form.createForm(this),
      msg: '',
      url: {
        release: '/publicInformation/publicInformation/release',
        temporary: '/publicInformation/publicInformation/temporary',
        fileUpload: window._CONFIG['domianURL'] + '/file/uploadFile/add',
        fileFind: '/file/cmpFileGroup/findFilesByGroupId',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      disabled: false,
      //必填部分样式
      labelCol: {
        xs: { span: 13 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 11 },
        sm: { span: 20 }
      },
      //附件样式
      labelCol1: {
        xs: { span: 23 },
        sm: { span: 2 }
      },
      wrapperCol1: {
        xs: { span: 1 },
        sm: { span: 17 }
      },
      //输入框样式
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 22 }
      },
      formValue: '',
      // 上传附件定义
      headers: {},
      fileList: [],
      fileList2: [],
      previewImage: '',
      previewVisible1: false,
      previewVisible2: false,
      attachment: [
        {
          groupId: '',
          fileTokens: '',
          fieldName: 'textAttachment',
          tableName: 'public_information'
        },
        {
          groupId: '',
          fileTokens: '',
          fieldName: 'otherAttachment',
          tableName: 'public_information'
        }
      ],
      JLeftTree: {
        header: '申请单位',
        searchKey: 'id',
        tableName: 'sys_depart',
        parentId: 'parent_id',
        optionName: 'depart_name',
        sortCondition: 'depart_name',
        permisson: '1' // 0:查询所属公司下所有节点 1:查询所属子部门下的所有节点
      }
    }
  },

  methods: {
    ...mapGetters(['userInfo']),
    edit(record) {
      //重置表单
      this.form.resetFields()
      this.$nextTick(() => {
        //设置表单字段
        this.form.setFieldsValue(pick(this.model, 'title', 'createTime', 'informationDeptname', 'createBy','authorFullname'))
        this.form.setFieldsValue({ createTime: moment(this.model.createTime) })
        this.form.setFieldsValue({ createBy: this.userInfo().realname })
        this.form.setFieldsValue({ informationDeptname: this.userInfo().departName })
      })
      //编辑时初始化表单
      if (this.formValue && this.formValue != {}) {
        this.model = Object.assign({}, this.formValue)
      } else {
        this.model = Object.assign({}, record)
      }
      this.msg = this.formValue.text
      // this.attachment[0].groupId = this.formValue.textAttachment
      // console.log('heiehi haaha', this.attachment[0].groupId)

      // 初始化上传文件 0代表第1个上传附件初始化，1就代表第二个上传附件初始化，以此类推
      let that = this
      if (that.attachment.length != 0) {
        let arr = []
        if (JSON.stringify(that.model) == '{}') {
          if (that.attachment.length == 1) {
            this.initUpload(that, 0)
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              this.initUpload(that, i)
            }
          }
        } else {
          for (let j in that.model) {
            if (j) {
              if (typeof j != Object) {
                if (j.indexOf('textAttachment') != -1) {
                  this.initUpload(that, 0, that.model[j], 'fileList')
                } else if (j.indexOf('otherAttachment') != -1) {
                  this.initUpload(that, 0, that.model[j], 'fileList2')
                }
              }
            }
          }
        }
      }
    },
    // 提交数据
    handleOk(type) {
      let that = this
      let values = that.form.getFieldsValue()
      let method = 'post'
      let httpUrl = ''
      //判断类型为暂存还是发布，调取相应接口
      if (type == 1) {
        httpUrl = that.url.release
      } else {
        httpUrl = that.url.temporary
      }

      let formData = Object.assign(that.model, values)
      formData.textAttachment = that.attachment[0].groupId
      formData.otherAttachment = that.attachment[1].groupId

      formData.text = this.msg
      let params = {
        strFormData: JSON.stringify(formData),
        strAttachment: JSON.stringify(that.attachment)
      }
      httpAction(httpUrl, qs.stringify(params), method).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          alert('提交成功')
          this.$store.commit('listUpdate')
          console.log(this.$store.state.app.listRefresh, '父亲违反物权法')
          // window.close()
        } else {
          that.$message.warning('操作失败！')
        }
      })
    },
    //关闭窗口
    close() {
      if (window.confirm('现在关闭不会保存数据，确定关闭吗')) {
        window.close()
        return true
      } else {
        return false
      }
    },
    handleChange(info, list, k) {
      //调用改变方法
      this.handleChange1(info, this, k, list)
    },
    handlePicCancel(val) {
      this['previewVisible' + val] = false
    },
    loadData() {}
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    if (this.$route.query.text) {
      var a = this.$route.query.text
      this.formValue = JSON.parse(a)
    }
    this.edit({})
  },
  watch: {
    '$store.app.state.listRefresh': function() {
      console.log('jjjj')
      console.log(this.$store.getters.listRefresh)

      //this.searchReset();
    },
    listRefresh: function() {
      //li就是改变后的wifiList值
      console.log('刷新成功')
    }
  },
  mounted() {},
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    },
    ...mapGetters(['listRefresh'])
  },
  searchByTree(key) {
    if (key) {
      this.queryParam.prjType = key
      this.searchQuery()
      this.resertTable()
    } else {
      this.queryParam.prjType = ''
      this.searchQuery()
      this.resertTable()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
/deep/.mce-content-body {
  height: 500px;
}
// .ant-col-md-24 {
//   margin-left:90px;
// }
</style>