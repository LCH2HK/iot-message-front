<!--选择设备的穿梭框 用于指令配置 -->
<template>
  <div>
    <a-transfer
      :dataSource="deviceTransferData"
      :listStyle="{
        width: '453px',
        height: '300px',
      }"
      :titles="['待选设备', '已选设备']"
      :targetKeys="targetKeys"
      :selectedKeys="selectedKeys"
      @change="handleChange"
      @selectChange="handleSelectChange"
      @scroll="handleScroll"
      :render="item => item.title"
      :disabled="disabled"
    />
  </div>
</template>
<script>
export default {
  name: 'DeviceSelectTransfer',
  mixins: [],
  props: {
    deviceTransferData: {
      type: Array,
      default () {
        return []
      }
    },
    selectDeviceIds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      targetKeys: this.selectDeviceIds,
      selectedKeys: [],
      disabled: false
    }
  },
  methods: {
    handleChange (nextTargetKeys, direction, moveKeys, itemSelect) {
      console.log('deviceTransferData--> ', this.deviceTransferData)
      console.log('itemSelect: =>', itemSelect)
      this.targetKeys = nextTargetKeys
      console.log('targetKeys =>', nextTargetKeys)
      console.log('direction: =>', direction)
      let result = nextTargetKeys
      console.log('moveKeys: =>', moveKeys)
      this.$emit('change', result)
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]

      console.log('sourceSelectedKeys: ', sourceSelectedKeys)
      console.log('targetSelectedKeys: ', targetSelectedKeys)
    },
    handleScroll (direction, e) {
      console.log('direction:', direction)
      console.log('target:', e.target)
    }
    // handleDisable(disabled) {
    //     this.disabled = disabled;
    // },
  }
}
</script>
