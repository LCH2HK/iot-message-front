<!--点码表的属性挂接输入框 在属性配置-->
<template>
  <div>
    <a-input
      placeholder="点击选择采集点"
      @click="openModal"
      v-model="pointCodeName"
      :disabled="readOnly"
      style="height: 32px"
    ></a-input>
    <PointCodeSelectModal ref="pointCodeSelect" @ok="handleOK" :prjCode="prjCode"></PointCodeSelectModal>
  </div>
</template>

<script>
import PointCodeSelectModal from './PointCodeSelectModal'

export default {
  name: 'PointCodeInput',
  components: {
    PointCodeSelectModal
  },
  props: {
    value: {
      required: false,
      type: Object,
      default: () => {
        return ''
      }
    },
    readOnly: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    prjCode: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      pointCodeName: this.value.text,
      pointCode: {
        rowKey: this.value.rowId,
        value: '',
        name: this.pointCodeName
      }
    }
  },
  methods: {
    openModal () {
      this.$refs.pointCodeSelect.show()
    },
    handleOK (val) {
      this.pointCodeName = val.myName
      this.pointCode.value = val.collectId
      this.pointCode.name = val.myName
      this.$emit('setPointCode', this.pointCode)
    }
  },
  watch: {
    value () {
      if (this.value.text === '') {
        this.pointCodeName = ''
        this.pointCode = {
          rowKey: this.value.rowId,
          value: '',
          name: this.pointCodeName
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
