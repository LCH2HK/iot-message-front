<template>
  <a-card>
    <a-row>
      <a-col :span="4">
        <a-spin :spinning="confirmLoadingLeft" class="loading">
        <div class="div-col">
          <!--2幢二单元1202-->
          <div class="title-box top-button">{{ chooseInfo.buildingNumber }} {{ nowUnitNumber }} {{ nowDoorNumber }}</div>
          <!--户型图-->
          <div class="img-div">
            <img style="width: 100%;height: 100%"
                 :src="imgUrl" v-if="imgUrl !== ''">
          </div>
          <!--确认选房按钮-->
          <!--<a-button type="primary" block class="top-button-block">确认选房</a-button>-->
          <!--房屋选择情况-->
          <div class="choose-info">
            <div style="width: 100%; height: auto;">
              <!--状态介绍-->
              <div style="margin-bottom: 10px">
                <a-row>
                  <a-col :span="3">
                    <div style="width: 20px; height: 20px; background: #008002;"></div>
                  </a-col>
                  <a-col :span="3">
                    <div class="statu-font">可选</div>
                  </a-col>
                  <a-col :span="3">
                    <div style="width: 20px; height: 20px; background: #ff9833;"></div>
                  </a-col>
                  <a-col :span="3">
                    <div class="statu-font">已选</div>
                  </a-col>
                </a-row>
              </div>
              <!--遍历数据生成选择情况图-->
              <!--幢号-->
              <div class="list-header title-box">{{ chooseInfo.buildingNumber }}</div>
              <div :style="{ width: getWidth(chooseInfo.unit.length)}" v-for="item in chooseInfo.unit"
                   class="unit title-box">
                <!--单元号-->
                <div>{{ item.unitNumber}}</div>
                <div v-for="buildingInfo in item.buildingInfo">
                  <div v-for="info in buildingInfo.info"
                       :style="{ width: getWidth(buildingInfo.info.length)}"
                       class="info">
                    <div
                      :style="{ width: '100%', height: '100%', background: getBackGround(info.statu) }"
                      @click="unitClick(info)"
                      @mouseenter="changeImg(info)">
                      {{ info.doorNumber }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </a-spin>
      </a-col>
      <a-col :span="16">
        <div class="div-col">
          <cesium-view style="height: 100%;"
                       url="http://gisct.ecidi.com:8001/iserver/services/3D-XC_test/rest/realspace"></cesium-view>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="div-col">
          <web-socket ref="webSocketModel" @getThisChooser="getThisChooser"></web-socket>
        </div>
      </a-col>
    </a-row>
    <!-- 表单区域 -->
    <house-choose-flat-modal
      :nowChooserId="nowChooserId"
      :nowChooserName="nowChooserName"
      ref="modalForm"
      @ok="modalFormOk"
      @getChooseInfo="getChooseInfo"
    ></house-choose-flat-modal>
  </a-card>
</template>

<script>
  import CesiumView from './cesiumView'
  import ACol from 'ant-design-vue/es/grid/Col'
  import WebSocket from './modules/WebSocket'
  import HouseChooseFlatModal from './modules/HouseChooseFlatModal'
  import { CmpListMixin } from '@/mixins/CmpListMixin'
  import { getAction } from '@/api/manage'

  export default {
    name: 'onlineChoose',
    // 混合模式引用，变量和方法都可直接用，本地可同名方法覆盖
    mixins: [CmpListMixin],
    components: { HouseChooseFlatModal, WebSocket, ACol, CesiumView },
    data() {
      return {
        chooseInfo: {},
        confirmLoadingLeft: false,
        nowChooserId: '',
        nowChooserName: '',
        imgServer: window._CONFIG['domianURL'] + '/sys/common/view',
        imgUrl: '',
        //缓存户型图 减少数据库请求
        houseTypeMap: new Map(),
        nowUnitNumber: '',
        nowDoorNumber: '',
      }
    },
    created() {
      this.getChooseInfo()
    },
    methods: {
      loadData() {},
      // 获取页面所需参数
      getChooseInfo() {
        const that = this;
        that.confirmLoadingLeft = true;
        that.axios.get('/online/choose/list?buildingId=c75fdc1d55f15e88a3830c71660aa313')
          .then((res)=>{
            that.chooseInfo = res.result;
            that.confirmLoadingLeft = false;
          })
        if (that.$refs.webSocketModel !== undefined){
          that.$refs.webSocketModel.getTypeList()
          that.$refs.webSocketModel.nextChooser()
        }
      },
      //转换百分数
      toPercent(val) {
        return (100 / val).toFixed(2) + '%'
      },
      // 获取宽度百分比
      getWidth(val) {
        return this.toPercent(val)
      },
      // 获取颜色
      getBackGround(val) {
        if (val == 1){
          return '#ff9833'
        } else {
          return '#008002'
        }
      },
      // 点击单元格
      unitClick(info) {
        console.log(info)
        if (info.statu == 0){
          this.handleEdit(info)
          this.$refs.modalForm.title = "确定选房";
        } else {
          this.$message.warn("该房源已经被预定了")
        }
      },
      //监听返回当前的选房人
      getThisChooser(val,type) {
        if (type === 1){
          this.nowChooserId = val
        } else if (type === 2){
          this.nowChooserName = val
        }
      },
      getImgUrl(groupId) {
        getAction('/file/cmpFileGroup/findFilesByGroupId',{groupId: groupId})
          .then( (res) => {
            if (res.success) {
              this.imgUrl = this.imgServer + "/" + res.result[0].uploadFile.savePath
              this.houseTypeMap.set(groupId,this.imgUrl) // 添加地址缓存
            }
          } )
      },
      changeImg(info) {
        this.nowUnitNumber = info.unitNumber + '单元'
        this.nowDoorNumber = info.doorNumber
        if (this.houseTypeMap.get(info.attachment) !== undefined) {
          this.imgUrl = this.houseTypeMap.get(info.attachment)
        } else {
          this.getImgUrl(info.attachment)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @unit-height: 30px;
  @title-height: 40px;
  .top-button {
    width: 100%;
    height:@title-height;
    line-height: @title-height;
    color: white;
    text-align: center;
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
  }

  .top-button-block {
    margin-top: 5px;
  }

  .img-div {
    width: auto;
    height: 200px;
  }

  .div-col {
    width: 100%;
    height: 800px;
    border: 1px solid rgba(161, 163, 157, 0.55)
  }

  .choose-info {
    width: 100%;
    height: 530px;
    overflow: auto;
    padding: 10px;
  }

  .list-header {
    height: @unit-height;
    line-height: @unit-height;
    color: white;
    text-align: center;
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
  }

  .unit {
    float: left;
    border: 1q solid rgba(161, 163, 157, 0.55);
    color: white;
    text-align: center;
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
  }

  .info {
    height: @unit-height;
    line-height: @unit-height;
    float: left;
    border: 1q solid rgba(161, 163, 157, 0.55);
    color: white;
    text-align: center;
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
  }
  .statu-font {
    font-family: 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'STHeitiSC-Light', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
    font-weight: bold;
  }
  .info:hover {
    border: 2px solid white;
    cursor:pointer
  }
</style>