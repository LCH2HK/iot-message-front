<template>
  <div>
    <!--<div style="position: absolute;z-index: 10000;left: 0px;top: 0px">-->
      <!--<a-button @click="getScene">获取相机</a-button>-->
    <!--</div>-->
    <div id="cesiumContainer" class="cesium"></div>
  </div>
</template>

<script>
  const Cesium = window.Cesium
  export default {
    name: 'cesiumView',
    props: {
      url: {
        type: String
      }
    },
    data() {
      return {
        viewer: {},
        scene: ''
      }
    },
    methods: {
      newCesium(Cesium) {
        // let viewer = {}
        this.viewer = new Cesium.Viewer('cesiumContainer')
        $('.cesium-widget-credits')[0].style.visibility = 'hidden'
        $('.cesium-viewer-navigationContainer')[0].style.visibility = 'hidden'
        var scene = this.viewer.scene
        this.scene = scene
        var promise = scene.open(this.url)
        let camera = this.scene.camera
        promise.then(function(obliqueLayers) {
          camera.setView({ // 先定位，开始渲染定位区域的倾斜
            destination: new Cesium.Cartesian3(-2856321.1262691813, 4758201.291912403, 3144000.7780084647),
            orientation: {
              heading: 6.273766185912881,
              pitch: -0.8944653517797656,
              roll: 6.283180759669486
            }
          })
        })
        Cesium.when(promise, function (layers){
          var layer = scene.layers.find('江北1@新昌江北');
          console.log(layer)
          //设置属性查询参数
          layer.setQueryParameter({
            url: 'http://gisct.ecidi.com:8001/iserver/services/data-XC_test/rest/data',
            dataSourceName: '新昌江北',
            dataSetName: '江北1',
            keyWord: 'SmID'
          });
        })
      },
      getScene() {
        let camera = this.scene.camera
        console.log(camera)
        let position = camera.position
        console.log(position)
      },
    },
    mounted: function() {
      this.newCesium(Cesium)
    }
  }
</script>

<style scoped>
  .cesium {
    width: 100%;
    height: 100%;
  }
</style>