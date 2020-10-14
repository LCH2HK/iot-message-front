<template>
  <div>
    <div style="width:90%; margin:0 auto; height: 450px">
      <a-card :bordered="false">
        <span style="text-align: center;display:block;font-size:20px">{{headline}}</span>
      </a-card>
      <a-card :bordered="false">
        <span
          style="text-align: right;display:block;font-size:15px"
        >发布人：{{issuer}} &nbsp;&nbsp; 发布时间：{{time}}</span>
      </a-card>
      <div v-html="msg" style="text-align:left;margin:0 auto;"></div>
      <div id="placeholder"></div>
      <div style="margin-top:40px;margin-bottom:60px">
        <span style="display:block">
          <strong>正文附件:</strong>
          <a
            v-if="fileNone1 === false"
            href="#"
            @click="preview"
            title="查看"
            style="margin-left:10px;"
          >{{fileName1}}</a>
          <span v-else style="margin-left:10px;">无</span>
        </span>
        <br />
        <span>
          <strong>其他附件：</strong>
          <a v-if="fileNone2 === false" href="#" @click="downLoad" title="下载" >{{fileName2}}</a>
          <span v-else>无</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { httpAction, getAction, downFile, postAction } from '@/api/manage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import qs from 'qs'
import axios from 'axios'
export default {
  name: 'PublicInformationModal',
  //组件应用定义
  components: {},
  // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
  mixins: [CmpListMixin],
  // 数据定义
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      fileNone1: true,
      fileNone2: true,
      //pdf预览地址
      pdfSrc: '',
      //获取数据变量定义
      msg: '',
      headline: '',
      formValue: '',
      issuer: '',
      time: '',
      visible: false,
      model: {},
      textAttachment: '',
      otherAttachment: '',
      fileName1: '',
      fileName2: '',
      savePath1: '',
      savePath2: '',
      fileId1: '',
      fileId2: '',
      url: {
        //根据groupId查文件接口
        attachments: 'http://localhost:3000/ecidi-cmp//file/cmpFileGroup/findFilesByGroupId',
        //根据文件id下载文件接口
        attachmentDownload: 'http://localhost:3000/ecidi-cmp/file/uploadFile/downloadFileById',
        //文件转PDF接口
        conversion: 'http://localhost:3000/ecidi-cmp/publicInformation/publicInformation/conversionPdf',
        //在线预览
        onlineFileEdit: '/office/only/getEditRight'
      },
      // 请求头定义
      headers: {}
    }
  },
  mounted() {
    var a = this.$route.query.info
    this.formValue = JSON.parse(a)
    //获得传入数据
    this.msg = this.formValue.text
    this.headline = this.formValue.title
    this.issuer = this.formValue.createBy
    this.time = this.formValue.createTime
    this.textAttachment = this.formValue.textAttachment
    this.otherAttachment = this.formValue.otherAttachment
    this.getAttachMent1()
    this.getAttachMent2()
    console.log(this.fileName1)
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = 'http://cmp.ecidi.com:8099/web-apps/apps/api/documents/api.js'
    document.body.appendChild(s)
  },
  // 钩子函数
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },
  //方法
  methods: {
    loadData() {},
    add() {
      this.edit({})
    },
    edit() {},
    //预览附件
    preview() {
      let rId = this.fileId1
      let httpurl = this.url.onlineFileEdit
      let method = 'post'
      let params = {
        edit: false,
        id: rId,
        type: 'embedded'
      }
      params = qs.stringify(params)
      let that = this
      postAction(httpurl, params).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          // that.$emit('ok');
          let json = res.result
          let theJsonValue = JSON.parse(json)
          var docEditor = new DocsAPI.DocEditor('placeholder', theJsonValue)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.id = null
      this.visible = false
    },
    //时间格式化
    close() {
      this.$emit('close')
      this.visible = false
      this.fileList = []
    },
    getAttachMent1: function() {
      axios
        .get(this.url.attachments, {
          headers: this.headers,
          params: {
            groupId: this.otherAttachment
          }
        })
        .then(res => {
          if (res.data.message != '查询结果为空') {
            this.fileName2 = res.data.result[0].uploadFile.fileName
            this.savePath2 = res.data.result[0].uploadFile.savePath
            this.fileId2 = res.data.result[0].uploadFile.id
            this.fileNone2 = false
          } else {
            console.log('aaaa------------>')
            this.fileNone2 = true
          }
        })
    },
    getAttachMent2: function() {
      axios
        .get(this.url.attachments, {
          headers: this.headers,
          params: {
            groupId: this.textAttachment
          }
        })
        .then(res => {
          if (res.data.message != '查询结果为空') {
            if (res.data.result[0].uploadFile.fileName.length != 0) {
              this.fileName1 = res.data.result[0].uploadFile.fileName
            }
            this.savePath1 = res.data.result[0].uploadFile.savePath
            this.fileId1 = res.data.result[0].uploadFile.id
            this.fileNone1 = false
            console.log(this.fileName1, 'aaaaaaaaaa')
            //如果正文内容为空，则预览正文附件
            if (this.fileName1.length != 0 || this.fileName1 == '无') {
              if (this.msg == '' || this.msg == 'undefined' || this.msg == null) {
                this.preview()
              }
            }
          } else {
            this.fileNone1 = true
          }
        })
    },
    downLoad() {
      let that = this
      var id = this.fileId2
      let url = this.url.attachmentDownload
      let fileType = this.fileName2.split('.').pop()
      let params = {
        id: this.fileId2
      }
      downFile(url, { id: id }).then(data => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), this.fileName2)
        } else {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.fileName2)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    conversion() {
      //还未拼上全路径
      let filePath = this.savePath1.substring(0, this.savePath1.lastIndexOf('.'))
      let fileSuffix = this.savePath1.split('.').pop()
      //原路径和生成pdf路径
      let pdfFile = filePath + 'preview.pdf'
      this.pdfSrc = '/public/pdf/web/viewer.html?file=' + encodeURIComponent(pdfFile)
      let inputFile = this.savePath1
      //发送请求
      let method = 'post'
      let params = {
        inputFile: inputFile,
        pdfFile: pdfFile
      }
      if (fileSuffix == 'pdf') {
      } else {
        httpAction(this.url.conversion, qs.stringify(params), method).then(res => {
          if (res.success) {
            console.log('转换成功')
          } else {
            console.log('操作失败')
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/modal.less';
.iframe {
  height: 900px;
}
</style>