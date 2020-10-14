<template>

    <a-modal 
        :visible="visible" 
        :closable="true"
        :keyboard='true'
        :maskClosable='false'
        title="在线编辑" 
        @ok="handleOk"
        @cancel="handleCancel"
        cancelText="关闭"
        :confirmLoading="confirmLoading"
        :width="1000"
        :height="800"
    >
        <div class="wrapper">
            <div  id = "placeholder" style="height:100%" > </div> 
        </div>
    </a-modal>
</template>
<script>
    import { httpAction, getAction,getActionUrl,postAction } from '@/api/manage'
    import Vue from 'vue'
    import qs from 'qs'

    export default {
        data(){
            return{
                visible: false,
                confirmLoading: false,
                // destroyOnClose:true,//关闭时销毁 Modal 里的子元素;
                // bodyStyle:{
                //     width:"90%",
                //     height:"90%",
                // },
                url:{
                    onlineFileEdit:"/office/only/getEditRight",
                }   
            };
        },
        mounted(){
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = 'http://cmp.ecidi.com:8099/web-apps/apps/api/documents/api.js';
            document.body.appendChild(s);
        },
        methods:{
            edit(record){//在线编辑；
                console.log(record);
                this.visible = true;
                // debugger;
                let rId = record.id;
                let httpurl = this.url.onlineFileEdit;
                let method = 'post';
                let params={
                    edit:true,
                    id:rId,
                };
                params = qs.stringify(params)
                let that=this;
                postAction(httpurl,params).then((res)=>{
                    if(res.success){
                        that.$message.success(res.message);
                        console.log(res);
                        // that.$emit('ok');
                        let json=res.result;
                        let theJsonValue= JSON.parse(json);
                        var docEditor=new DocsAPI.DocEditor("placeholder",theJsonValue);
                    }else{
                        that.$message.warning(res.message);
                    }
                });
            },
            preview(record){//在线预览；
                this.visible = true;
                let rId = record.id;
                let httpurl = this.url.onlineFileEdit;
                let method = 'post';
                let params={
                    edit:false,
                    id:rId,
                };
                params = qs.stringify(params);
                let that=this;
                postAction(httpurl,params).then((res)=>{
                    if(res.success){
                        that.$message.success(res.message);
                        console.log(res);
                        // that.$emit('ok');
                        let json=res.result;
                        let theJsonValue= JSON.parse(json);
                        var docEditor=new DocsAPI.DocEditor("placeholder",theJsonValue);
                    }else{
                        that.$message.warning(res.message);
                    }
                });
            },
            handleOk(){
                console.log('handleOk');
            },
            handleCancel() {
                this.close();
            },
            close() {
                this.id = null;
                this.visible = false;
            },
        }
    }
</script>
<style lang="less" scoped>
:global(.wrapper){
    height:800px;
}
</style>
