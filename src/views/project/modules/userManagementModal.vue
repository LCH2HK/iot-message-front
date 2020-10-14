<template>
  <a-modal :title="title" v-if="visible" :visible="visible" @cancel="handleCancel" @ok="handleOk">
    <a-form :form="form">
      <a-form-item label="添加人员" :label-col="{span: 5}" :wrapper-col="{span: 12}">
        <j-select-user-new
          :selectedDetails="auditUsers"
          @callback="setAuditUser"
          :multiple="true"
          class="userSelect"
          v-decorator="['auditUsername']"
          :disabled="title == '查看'"
        ></j-select-user-new>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import JSelectUserNew from '@/components/cmpbiz/JSelectUserNew'
import { postAction } from '@/api/manage'
import qs from 'qs'
import { CmpListMixin } from '@/mixins/CmpListMixin'

export default {
  name: 'UserManagementModal',
  components: {
    JSelectUserNew
  },
  mixins: [CmpListMixin],
  data() {
    return {
      title: '',
      visible: false,
      projectId: '',
      form: this.$form.createForm(this),
      selectUser: ['auditUsers'],
      auditUsers: {
        colum: 'auditUsers',
        value: [],
        target: [{ to: 'auditUsername', from: 'username' }, { to: 'auditFullname', from: 'realname' }]
      },
      url: {
        addProjectUser: '/sys/user/addSysProjectWithUser', // 添加人员到指定项目
        addProjectUserBatch: '/sys/user/addSysProjectWithUserBatch' // 批量添加人员
      },
      model: {}
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      let that = this
      console.log(that)
      this.form.validateFields((err, values) => {
        if (!err) {
            console.log(values)
          let url = this.url.addProjectUserBatch,
            params = {
              usernames: values.auditUsername,
              projectId: this.projectId
            }
          params = qs.stringify(params)
          postAction(url, params).then(res => {
            if(res.success){
                that.$message.success(res.message);
                that.visible = false
                console.log(that.projectId)

                that.$emit('refresh', that.projectId)
            }
          })
        }
      })
    },
    edit(record, title) {
      this.title = title;
      let that = this;
      record.auditUsername = record.username;
      record.auditFullname = record.realname;
      this.visible = true;
      this.model = Object.assign({}, record)
      this.$nextTick(()=>{
        this.auditUsers.value = []
        // 初始化选人控件
        this.initSelectMan(this,record);
      })
    },
    loadData() {}
  }
}
</script>

<style lang="less" scoped>
</style>