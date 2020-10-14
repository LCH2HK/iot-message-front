<template>
  <div class="components-input-demo-presuffix">
    <!---->
    <a-input @click="openModal" placeholder="请点击选择部门" v-model="departNames" readOnly :disabled="disabled">
      <a-icon slot="prefix" type="cluster" title="部门选择控件"/>
      <!-- <a-icon v-if="departIds" slot="suffix" type="close-circle" @click="handleEmpty" title="清空"/> -->
      <a-icon slot="suffix" type="close-circle" @click="handleEmpty" title="清空"/>
    </a-input>

    <j-select-depart-modal-new
      ref="innerDepartSelectModal"
      :modal-width="modalWidth"
      :multi="multi"
      :rootOpened="rootOpened"
      :depart-id="value"
      @ok="handleOK"
      @initComp="initComp"
      :selectListDepart="selectedDetails.value"/>
  </div>
</template>

<script>
  import JSelectDepartModalNew from './modal/JSelectDepartModalNew'
  export default {
    name: 'JSelectDepartNew',
    components:{
      JSelectDepartModalNew
    },
    props:{
      modalWidth:{
        type:Number,
        default:500,
        required:false
      },
      multi:{
        type:Boolean,
        default:false,
        required:false
      },
      rootOpened:{
        type:Boolean,
        default:true,
        required:false
      },
      value:{
        type:String,
        required:false
      },
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
      },
      disabled:{
        type: Boolean,
        required: false,
        default: false
      },
      selectedDetails: {
        // type: Object,
        // required: false
      }
    },
    data(){
      return {
        visible:false,
        confirmLoading:false,
        departNames:"",
        departIds:'',
        orgCodes: ''
      }
    },
    mounted(){
      this.departIds = this.value
    },
    watch:{
      value(val){
        this.departIds = val
      }
    },
    methods:{
      initComp(departNames){
        this.departNames = departNames
      },
      openModal(){
        this.$refs.innerDepartSelectModal.show()
      },
      handleOK(rows,idstr){
        if(!rows){
          this.departNames = ''
          this.departIds = ''
          this.orgCodes = ''
        }else{
          let temp = ''
          let temp1 = ''
          if (rows.length == 1) {
            temp = rows[0].departName;
            temp1 = rows[0].orgCode;
          } else {
            for (let i = 0; i < rows.length ;i++) {
              if (i != rows.length-1) {
                temp+=rows[i].departName+','
                temp1+=rows[i].orgCode+','
              } else {
                temp+=rows[i].departName
                temp1+=rows[i].orgCode
              }
            }
          }
          this.departNames = temp;
          this.orgCodes = temp1;
          this.departIds = idstr;
        }

        let userDetails = {colum:'',target:[],value:{}}
        userDetails.colum=this.selectedDetails.colum;
        userDetails.target=this.selectedDetails.target;
        userDetails.value = {
          // departId: this.departIds,
          departname: this.departNames,
          orgcode: this.orgCodes,
        }
        this.$emit("callback",userDetails)
        // if(this.triggerChange){
        //   this.$emit("change",this.departIds)
        // }else{
        //   this.$emit("input",this.departIds)
        // }
      },
      getDepartNames(){
        return this.departNames
      },
      handleEmpty(){
        this.handleOK('')
      }
    }
  }
</script>

<style scoped>
  .components-input-demo-presuffix .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }
  .components-input-demo-presuffix .anticon-close-circle:hover {
    color: #f5222d;
  }
  .components-input-demo-presuffix .anticon-close-circle:active {
    color: #666;
  }
</style>