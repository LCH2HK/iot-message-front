<template>
  <!-- <a-tooltip placement="topLeft" :title="tipTitle">去掉popup提示-->
  <a-tooltip placement="topLeft">
    <a-input :placeholder="placeholder"
             v-model="inputValue"
             @keyup.enter="searchQuery" ></a-input>
  </a-tooltip>
</template>

<script>
import { isHaveSpecialChar, specialCharReplace } from '../../views/iot/js/iot_validate'

export default {
  name: 'JInputLk',
  props: {
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    triggerChange: {
      type: Boolean,
      required: false,
      default: false
    },
    placeholder: {
      type: String,
      required: false,
      default: false
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      InputStringValue: '',
      inputValue: '',
      tipTitle: '输入查询条件'
    }
  },
  watch: {
    inputValue (val) {
      if (!val) {
        this.InputStringValue = ''
        this.$emit('inputValueLk', this.InputStringValue)
        this.tipTitle = '输入查询条件'
      } else if (!isHaveSpecialChar(val)) {
        val = val.replace(/(^\s*)|(\s*$)/g, '')
        this.InputStringValue = '*' + val + '*'
        this.$emit('inputValueLk', this.InputStringValue)
        this.tipTitle = '输入查询条件'
      } else {
        val = val.replace(/(^\s*)|(\s*$)/g, '')
        val = specialCharReplace(val)
        this.InputStringValue = '*' + val + '*'
        this.tipTitle = '查询条件含有特殊字符'
        this.$emit('inputValueLk', this.InputStringValue)
      }
    },
    reset () {
      this.ResetValue()
    }
  },
  methods: {
    searchQuery () {
      console.log('into searchQuery => ', this.InputStringValue)
      this.$emit('enterSearch', this.InputStringValue)
    },
    ResetValue () {
      this.inputValue = ''
    }
  }
}
</script>
