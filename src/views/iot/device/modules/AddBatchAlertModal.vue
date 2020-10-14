<!--批量添加后提示窗，用于批量添加后下载设备证书-->
<template>
  <div class="alert-modal">
    <a-modal
      :footer="null"
      :title="ModalTitle"
      :visible="visible"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <p>{{ ModalText }}</p>
      <a-button @click="handleContinue()" icon="close" class="alert-modal-button">继续添加</a-button>
      <a-button @click="handleDownload()" icon="download">下载证书</a-button>
    </a-modal>
  </div>
</template>

<script>
import { downFile } from '@/api/manage'

export default {
  name: 'AddBatchAlertModal',
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    batchCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ModalText: this.message,
      visible: false,
      confirmLoading: false,
      ModalTitle: this.title,
      ModalBatCode: '0',
      // fileName : '设备列表'+this.ModalBatCode,
      queryParam: {
        batchCode: ''
      },
      url: {
        exportXlsUrl: 'device/device/deviceKeyAddBatchXls'
      }

    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk () {
      this.ModalText = 'The modal will be closed after 10 seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 10 * 1000)
    },
    handleCancel () {
      console.log('Clicked cancel button')
      this.visible = false
    },
    handleContinue () {
      console.log('Clicked handleContinue')
      this.visible = false
      this.$emit('showFather')
    },
    handleDownload () {
      this.queryParam.batchCode = this.ModalBatCode
      let param = { ...this.queryParam }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param.selections = this.selectedRowKeys.join(',')
      }
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), '设备信息表-批次：' + this.ModalBatCode + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '设备信息表-批次：' + this.ModalBatCode + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.alert-modal-button{
  margin-right: 8px;
}
</style>
