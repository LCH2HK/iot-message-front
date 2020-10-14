<!--设备标签 编辑标签窗口 -->
<template>
  <a-modal title="设备标签" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-select
      class="tagSelect"
      mode="multiple"
      placeholder="请选择标签"
      @change="handleSelectChange"
      v-model="selectTags"
    >
      <a-select-option v-for="i in deviceTagsMsg" :key="i.tagName">{{ i.tagName }}</a-select-option>
    </a-select>
  </a-modal>
</template>

<script>
import { postAction } from '../../../../api/manage'
export default {
  name: 'TagsEditModal',
  components: {},
  props: {
    deviceId: {
      type: String,
      default: ''
    },
    deviceTagsArray: {
      type: Array,
      default () {
        return []
      }
    },
    deviceTagsMsg: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      selectTags: [],
      tagNamesString: '',
      url: {
        editTagsByDeviceId: '/tags/deviceTags/editTagsByDeviceId'
      }
    }
  },
  watch: {
    deviceTagsArray: function () {
      this.selectTags = this.deviceTagsArray
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      let params = {
        deviceId: this.deviceId,
        tagNames: this.tagNamesString
      }
      postAction(this.url.editTagsByDeviceId, params).then(res => {
        if (res.success) {
          this.$emit('loadNewTags', this.selectTags)
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
      this.visible = false
    },
    handleSelectChange (value) {
      let tags = ''
      tags = value.toString()
      this.tagNamesString = tags
    }
  }
}
</script>

<style scoped lang="less">

@import '~@assets/less/modal.less';
.ant-btn .ant-btn-default {
  height: 36px;
}
.tagSelect {
  width: 100%;
}
</style>
