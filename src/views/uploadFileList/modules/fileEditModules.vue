<template>
  <a-modal
  width="1000"
  :footer="null"
  :visible="visible"
  @cancel="handleCancel"
  >
  <div class="fileEdit">
    <div id="placeholder" style="height:100%">1111111</div>
  </div>
    
  </a-modal>
</template>
<script>
export default {
  name: 'fileEdit',
  props:  ['json'] ,
  data() {
      return{
          visible: true
      }
  },
  methods: {
      handleCancel() {
        this.$emit('closeFile')
        this.visible = false
      },
      dosomething() {
          var docEditor = new DocsAPI.DocEditor("placeholder",this.json);
          console.log(docEditor)
      }
  },
  mounted() {
    console.log(222)
    console.log(this.json , 'props')
    var docEditor = new DocsAPI.DocEditor("placeholder",this.json);
  },
  
}
</script>
<style lang="less" scoped>
:global(.fileEdit){
  height: 750px!important;
}
</style>

