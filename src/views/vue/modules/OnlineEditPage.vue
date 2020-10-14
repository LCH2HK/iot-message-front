<template>
  <div class="wrapper">
    <div id="placeholder"></div>
  </div>
</template>

<script>
import { httpAction, getAction, postAction } from '@/api/manage'
import Vue from 'vue'
import qs from 'qs'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      linkKey: '',
      url: {
        onlineFileEdit: '/office/only/getEditRight',
        addViewRecord: '/recentlyView/recentlyView/add',
        share: '/fileFolderFile/fileShare/add'
      }
    }
  },
  mounted() {
    var url1 = window.location.href
    let recordId = this.$route.query.id
    if (window.location.search.indexOf('linkKey') >= 0) {
      // debugger
      this.linkKey = this.getQueryString('linkKey')
      console.log('this.linkKey', this.linkKey)
    }

    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = 'http://cmp.ecidi.com:8099/web-apps/apps/api/documents/api.js'
    document.body.appendChild(s)
    this.edit(recordId)
  },
  methods: {
    getQueryString(name) {
      // 获取url参数；
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    },
    edit(recordId) {
      //在线编辑；
      this.visible = true
      let username = JSON.parse(localStorage.getItem('pro__Login_Username')).value
      if (window.location.search.indexOf('linkKey') != -1) {
        //链接分享验证；
        let values = {
          linkKey: this.linkKey
        }
        let params1 = {
          jsonStr: JSON.stringify(values)
        }
        postAction(this.url.share, qs.stringify(params1)).then(res => {
          if (res.success) {
            // that.$message.success(res.message)
            console.log('验证成功')
          } else {
            that.$message.warning(res.message)
          }
        })
      }

      let rId = recordId
      let httpurl = this.url.onlineFileEdit
      let method = 'post'
      let params = {
        edit: true,
        id: rId
      }
      params = qs.stringify(params)
      let that = this
      postAction(httpurl, params).then(res => {
        if (res.success) {
          // that.$message.success(res.message)
          console.log(res.message)
          // that.$emit('ok');
          let json = res.result
          let theJsonValue = JSON.parse(json)
          var docEditor = new DocsAPI.DocEditor('placeholder', theJsonValue)
          let username = JSON.parse(localStorage.getItem('pro__Login_Username')).value
          let param = {
            fileId: rId,
            username: username
          }
          postAction(that.url.addViewRecord, qs.stringify(param)).then(res => {
            if (res.success) {
              // that.$message.success(res.message)
              console.log(res.message)
            } else {
              that.$message.warning(res.message)
            }
          })
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    close() {
      this.id = null
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  height: 99vh;
  width: 99vw;
}
</style>
