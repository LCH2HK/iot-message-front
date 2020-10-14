<!--设备标签 标签信息展示 用于设备详情页面中展示标签信息-->
<template>
  <a-card :bordered="null">
    <span>设备标签：{{ deviceTagsString !== "" ? deviceTagsString : "暂无设备标签" }}</span>
    <a-button class="tag-btn" type="primary" @click="showTagsManagerModal" v-if="projectMsg">标签项管理</a-button>
    <a-button class="tag-btn" icon="edit" type="primary" @click="showTagsEditModal" v-if="projectMsg">编辑</a-button>
    <TagsManageModal ref="tagsManagerModal" :deviceTagsMsg="deviceTagsMsg" @loadNewTags="init"></TagsManageModal>
    <TagsEditModal
      ref="tagsEditModal"
      :deviceTagsArray="deviceTagsArray"
      :deviceTagsMsg="deviceTagsMsg"
      :deviceId="deviceId"
      @loadNewTags="loadNewTags"
    ></TagsEditModal>
  </a-card>
</template>

<script>
import { getAction } from '../../../../api/manage'
import TagsEditModal from './TagsEditModal'
import TagsManageModal from './TagsManageModal'
import Vue from 'vue'

export default {
  name: 'TagsMessageModal',
  props: {
    deviceId: {
      type: String,
      default: ''
    }
  },
  components: {
    TagsEditModal,
    TagsManageModal
  },
  data () {
    return {
      projectMsg: null,
      deviceTagsString: '', // 设备标签字符串
      deviceTagsArray: [], // 设备标签名数组
      deviceTagsMsg: [], // 设备标签信息数组
      url: {
        getTagList: '/tags/tags/getTagList',
        getTagListByDeviceId: '/tags/deviceTags/getTagListByDeviceId'
      }
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    this.init()
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      this.getTagListByDeviceId()
      this.getTagList()
    },
    /**
     * 编辑标签后重新加载
     */
    loadNewTags (newTags) {
      this.deviceTagsString = ''
      this.deviceTagsArray = []
      this.deviceTagsString += newTags.map(data => {
        this.deviceTagsArray.push(data)
        return data
      })
    },
    /**
     * 获取包含所有标签的列表
     */
    getTagList () {
      getAction(this.url.getTagList).then(res => {
        if (res.success) {
          this.deviceTagsMsg = []
          this.deviceTagsMsg = res.result
        } else {
          this.$message.error('获取标签失败！')
        }
      })
    },
    /**
     * 查询该设备的标签
     */
    getTagListByDeviceId () {
      console.log('deviceId=',this.deviceId)
      getAction(this.url.getTagListByDeviceId, { deviceId: this.deviceId }).then(res => {
        if (res.success) {
          console.log('res=>',res)
          this.deviceTagsString = ''
          this.deviceTagsArray = []
          this.deviceTagsString += res.result.map(data => {
            this.deviceTagsArray.push(data.tagName)
            return data.tagName
          })
        }
      })
    },
    showTagsEditModal () {
      this.$refs.tagsEditModal.show()
    },
    showTagsManagerModal () {
      this.$refs.tagsManagerModal.show()
    }
  }
}
</script>

<style scoped>
.tag-btn {
    float: right;
    margin-right: 10px;
}
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>
