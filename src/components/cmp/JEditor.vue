<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      :headers="headers"
      @onClick="onClick"
    ></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/link'
import 'tinymce/plugins/save'
import 'tinymce/plugins/template'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/code'
import 'tinymce/plugins/toc'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { log } from 'util'
import Vue from 'vue'

export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      required: false
    },
    triggerChange: {
      type: Boolean,
      default: false,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table textcolor wordcount contextmenu link save template wordcount fullscreen print preview searchreplace code toc' 
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo|fontsizeselect | styleselect|bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists  table | removeformat|link|save|template|fullscreen wordcount|media image|print preview|searchreplace code|toc'
    }
  },
  data() {
    return {
      //初始化配置
      init: {
        headers: {},
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/lightgray', //设置主题样式
        height: 430, //编辑器高度
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: true, //顶部菜单栏显示
        statusbar: false,
        paste_data_images: true, // 允许粘贴图像
        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          var xhr, formData
          var data = blobInfo.blob() //转化为易于理解的file对象
          xhr = new XMLHttpRequest()
          xhr.withCredentials = true //跨域指示
          const token = Vue.ls.get(ACCESS_TOKEN)
          xhr.open('POST', window._CONFIG['domianURL'] + '/file/uploadFile/add', 'true')
          xhr.setRequestHeader('X-Access-Token', token)
          var url = window._CONFIG['domianURL'] + '/sys/common/view'
          xhr.onload = function() {
            var json
            if (xhr.status != 200) {
              failure('HTTP Error: ' + xhr.status)
              return
            }
            json = JSON.parse(xhr.responseText)
            console.log('------------->>>', xhr.responseText)
            if (!json || typeof json.result.uploadFile.savePath != 'string') {
              failure('Invalid JSON: ' + xhr.responseText)
              return
            }
            var location = url + json.result.uploadFile.savePath
            success(location)
          }
          formData = new FormData()
          formData.append('file', data, data.name)
          console.log('formData', formData)
          xhr.send(formData)
        },

        // 视频/文件上传
        file_picker_callback: function(callback, value, meta) {
          //要先模拟出一个input用于上传本地文件
          var input = document.createElement('input')
          input.setAttribute('type', 'file')
          //你可以给input加accept属性来限制上传的文件类型
          //例如：input.setAttribute('accept', '.jpg,.png');
          input.click()
          input.onchange = function() {
            // 选择多个，目前只取第一个
            var file = this.files[0]
            var xhr, formData
            xhr = new XMLHttpRequest()
            // 进度
            xhr.upload.onprogress = function(e) {
              // 进度(e.loaded / e.total * 100)
              let percent = (e.loaded / e.total) * 100
              if (percent < 100) {
                tinymce.activeEditor.setProgressState(true) //是否显示loading状态：1（显示）0（隐藏）
              } else {
                tinymce.activeEditor.setProgressState(false)
              }
            }
            xhr.onerror = function() {
              console.log(xhr.status)
              tinymce.activeEditor.setProgressState(false)
              return
            }
            // 跨域指示
            xhr.withCredentials = true
            // 处理token
            const token = Vue.ls.get(ACCESS_TOKEN)
            xhr.open('POST', window._CONFIG['domianURL'] + '/file/uploadFile/add', 'true')
            xhr.setRequestHeader('X-Access-Token', token)
            // 预览的接口
            var url = window._CONFIG['domianURL'] + '/sys/common/view'
            // 上传函数
            xhr.onload = function() {
              var json
              // 上传失败
              if (xhr.status != 200) {
                this.$message.warning('HTTP Error: ' + xhr.status)
                return
              }
              json = JSON.parse(xhr.responseText)
              if (!json || typeof json.result.uploadFile.savePath != 'string') {
                this.$message.warning('Invalid JSON: ' + xhr.responseText)
                return
              }
              var location = url + json.result.uploadFile.savePath
              // 上传成功回调
              callback(location)
            }
            formData = new FormData()
            formData.append('file', file, file.name)
            xhr.send(formData)
          }
        }
      },
      myValue: this.value
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },
  mounted() {
    tinymce.init({})
    // const token = Vue.ls.get(ACCESS_TOKEN)
    // console.log(token)
  },
  methods: {
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      if (this.triggerChange) {
        console.log(1)
        this.$emit('change', newValue)
      } else {
        console.log(2)
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
<style scoped>
</style>