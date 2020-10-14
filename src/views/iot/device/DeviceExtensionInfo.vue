<!--设备扩展信息  用于设备详情中-->
<template>
  <a-input-group class="table-container">
    <a-row class="device-extend-row" :gutter="24">
      <a-col :md="8" :sm="12" style="padding: 0">
        <span class="device-extend-lable"  >版本号: </span>
        <a-textarea class="device-extend-contentWrap" :class="{enableEdit: true}"  value="version  1.0"  :disabled="true"></a-textarea>
      </a-col>
      <a-col :md="8" :sm="12" style="padding: 0">
        <span class="device-extend-lable"  >模组商: </span>
        <a-textarea class="device-extend-contentWrap" :class="{enableEdit: true}"  value="默认模组商"  :disabled="true"></a-textarea>
      </a-col>
      <a-col :md="8" :sm="12" style="padding: 0">
        <span class="device-extend-lable"  >模组信息: </span>
        <a-textarea class="device-extend-contentWrap" :class="{enableEdit: true}"  value="默认模组1.0"  :disabled="true"></a-textarea>
      </a-col>
    </a-row>
    <a-row class="device-extend-row" :gutter="24">
      <a-col :md="8" :sm="12" style="padding: 0">
        <span class="device-extend-lable"  >序列号: </span>
        <a-textarea class="device-extend-contentWrap" :class="{enableEdit: true}" value="version  1.0"  :disabled="true"></a-textarea>
      </a-col>
      <a-col :md="8" :sm="12" style="padding: 0">
        <span class="device-extend-lable"  >型号: </span>
        <a-textarea class="device-extend-contentWrap" :class="{enableEdit: true}"  value="KJ23111212"  :disabled="true"></a-textarea>
      </a-col>
      <a-col :md="8" :sm="12" style="padding: 0">
        <span class="device-extend-lable"  >协议: </span>
        <a-textarea class="device-extend-contentWrap" :class="{enableEdit: true}" value="MQTT"  :disabled="true"></a-textarea>
      </a-col>
    </a-row>
<!--    <a-input-group>-->
<!--      <a-textarea class="styleWrap" style="width: 12%; border-radius: 4px; text-align: center" value="版本号" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap device-extend-info" style="width: 21%; border-radius: 4px;"value="version  1.0" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap" style="width: 12%; border-radius: 4px; text-align: center;" value="模组商" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap device-extend-info" style="width: 22%; border-radius: 4px;" value="填充模组商" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap" style="width: 12%; border-radius: 4px; text-align: center" value="模组信息" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap device-extend-info" style="width: 21%; border-radius: 4px;" value="填充模组信息" :disabled="true"></a-textarea>-->
<!--    </a-input-group>-->
<!--    <a-input-group>-->
<!--      <a-textarea class="styleWrap" style="width: 12%; border-radius: 4px; text-align: center" value="序列号" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap device-extend-info" style="width: 21%; border-radius: 4px;" value="YH123546455" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap" style="width: 12%; border-radius: 4px; text-align: center;" value="型号" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap device-extend-info" style="width: 22%; border-radius: 4px;" value="KJ23111212" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap" style="width: 12%; border-radius: 4px; text-align: center" value="协议" :disabled="true"></a-textarea>-->
<!--      <a-textarea class="styleWrap device-extend-info" style="width: 21%; border-radius: 4px;" value="PPP" :disabled="true"></a-textarea>-->
<!--    </a-input-group>-->
  </a-input-group>
</template>

<script>
export default {
  name: 'DeviceExtensionInfo',
  props: ['extensionData']
}
</script>

<style scoped>
  .styleWrap {
    resize: none;
    height: 32px;
    font-size: 15px;
  }
  .enableEdit {
    text-align: left;
    color: #999999;
  }
  .device-extend-info {
    color: #B7B7B7;
  }
  .table-container {
    padding: 30px 20px;
    background: white;
  }
  .device-extend-row{
    margin-bottom: 16px;
  }
  .device-extend-lable{
    width: 25%;
    float: left;
    font-size: 14px;
    font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
    font-weight: 400;
    text-align: right;
    color: #333333;
    line-height: 32px;
    margin-left: -25px;
    padding-right: 7px;
  }
  .device-extend-contentWrap {
    width: 60%;
    float: left;
    height: 30px;
    resize: none;
    font-size: 14px;
    font-family: Microsoft YaHei UI Regular, Microsoft YaHei UI Regular-Regular;
    font-weight: 400;
    padding-right: 30px;
  }
</style>
