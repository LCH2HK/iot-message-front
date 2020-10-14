<template>
  <a-modal
    :visible="visible"
    v-if="visible"
    :title="null"
    :footer="null"
    :closable="false"
    :width="600"
  >
    <div class="title">
      <div>{{title}}</div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <a-form :form="form">
      <a-row :gutter="24" class="row2">
        <a-col :span="24">
          <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-tree-select
              :treeData="departTree"
              :dropdownStyle="{ maxHeight: '400px', width: '300px', overflow: 'auto' }"
              placeholder="请选择部门"
              treeDefaultExpandAll
              v-decorator="[ 'departId', {rules: [{required: true}]}]"
              @change="departSelected"
              :disabled="isDepartUserAdd"
            ></a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="row2">
        <a-col :span="24">
          <a-form-item label="所属单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-tree-select
              :treeData="PrjTree"
              :dropdownStyle="{ maxHeight: '400px', width: '300px', overflow: 'auto' }"
              placeholder="请选择单位"
              treeDefaultExpandAll
              v-decorator="[ 'corporationId', {rules: [{required: true}]}]"
            ></a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="24">
          <div class="btn-class">
            <a-button @click="handleCancel" icon="close" style="margin-right:10px" class="cancel">关闭</a-button>
            <a-button @click="handleSubmit" icon="check" type="primary" class="confirm">提交</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { queryIdTree } from '@/api/api'
import { getAction } from '@/api/manage'

export default {
  data() {
    return {
      visible: false,
      title: '',
      form: this.$form.createForm(this),
      isDepartUserAdd: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      departTree: [],
      PrjTree: [],
      initialcorporation: '',
      url: {
        parentDeparts: '/sysdepart/sysDepart/listParentDeparts' //通过部门节点查询该部门这条线列表
      }
    }
  },
  created() {
    this.queryDepartTree()
  },
  methods: {
    // 获取部门树形结构
    queryDepartTree() {
      queryIdTree().then(res => {
        if (res.success) {
          this.departTree = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    // 选择部门后，获取默认企业名称
    departSelected(value) {
      const that = this
      if (value) {
        let url = this.url.parentDeparts,
          params = { departId: value }
        getAction(url, params).then(res => {
          if (res.success) {
            this.PrjTree = res.result
            if (this.PrjTree && this.PrjTree.length > 0) {
              if (this.PrjTree[0].children && this.PrjTree[0].children.length > 0) {
                this.initialcorporation = this.PrjTree[0].children[0].key
              } else {
                this.initialcorporation = this.PrjTree[0].key
              }
              this.$nextTick(() => {
                this.form.setFieldsValue({ corporationId: this.initialcorporation })
              })
            }
          } else {
            console.log(res.message)
          }
        })
      }
    },
    edit(value) {
      console.log('value', value)
      if (value) {
        this.$nextTick(() => {
          this.form.setFieldsValue({ departId: value })
        })
        this.departSelected(value)
      } else {
        console.log('???????')
      }
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if(this.isDepartUserAdd){  //如果是部门人员添加
            console.log(values, '部门人员添加values')
            this.$emit('selectDepartConfirmed', values)
            this.visible = false
          } else {
            this.$emit('selectDepartFinished', values)
            this.visible = false
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/title-btn.less';
</style>