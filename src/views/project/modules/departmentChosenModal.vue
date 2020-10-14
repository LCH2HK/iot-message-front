<template>
  <a-modal
    :title="null"
    :footer="null"
    :closable="false"
    destroyOnClose
    :maskClosable="false"
    v-if="isvisible"
    :visible="isvisible"
    :width="600"
  >
    <div class="title">
      <div>{{title}}</div>
      <a-icon type="close" class="closeIcon" @click="handleCancel" />
    </div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="17" :sm="8">
            <j-dict-select-tag
              v-model="queryParam.type"
              @input="searchQuery"
              placeholder="请选择项目类型"
              dictCode="project_types"
              v-if="this.typeOrArea === 1"
            />
            <j-dict-select-tag
              v-model="queryParam.place"
              @input="searchQuery"
              placeholder="请选择项目区域"
              dictCode="project_area"
              v-else
            />
          </a-col>
          <a-col :md="7" :sm="8">
            <a-radio-group
              name="radioGroup"
              :defaultValue="1"
              v-model="typeOrArea"
              @change="typeOrAreaChange"
            >
              <a-radio :value="1">类型</a-radio>
              <a-radio :value="2">区域</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="8">
            <a-input-search
              placeholder="输入项目编号或名称查询"
              style="width: 100%;margin-bottom:10px;"
              @search="searchQuery"
              v-model="queryParam.prjName"
            />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ type: 'radio', columnTitle: '单选', onChange: onSelectChange }"
      />
    </div>
    <!-- table区域-end -->
    <a-row :gutter="24">
      <a-col :span="24">
        <div class="btn-class">
          <a-button @click="handleCancel" icon="close" style="margin-right:10px" class="cancel">关闭</a-button>
          <a-button @click="handleSubmit" icon="check" type="primary" class="confirm">提交</a-button>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { postAction, getAction } from '@/api/manage'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import qs from 'qs'
export default {
  name: 'departmentTemplateModal',
  mixins: [CmpListMixin],
  data() {
    return {
      title: '',
      isvisible: false,
      typeOrArea: 1,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 表头
      columns: [
        {
          title: '项目编号',
          align: 'left',
          dataIndex: 'prjId',
          width: 100
        },
        {
          title: '项目名称',
          align: 'left',
          dataIndex: 'prjName',
          width: 150
        },
        {
          title: '项目类型',
          align: 'left',
          dataIndex: 'type',
          width: 150,
          customRender: (text, record, index) => {
            //字典值替换通用方法
            return filterDictText(this.projectType, text)
          }
        }
      ],
      form: this.$form.createForm(this),
      url: {
        list: '/project/sysProject/list',
        add: '/prj/sysProjectDepart/add?isTemplate=1',
        getDepart: '/project/sysProject/queryProject?dictCode=project_group',
        sync: '/prj/sysProjectDepart/synchronizeOrg'
      },
      treeData: [],
      checkedIds: '', // 选中的项目id
      checkedCodes: '', // 选中的项目编号
      ids: '', // 需要同步的部门ids
      selectedRowKeys: ''
    }
  },
  beforeCreate() {
    // 自行定义方法，引用字典
    //初始化字典
    initDictOptions('project_types').then(res => {
      if (res.success) {
        console.log(res, 'type')
        this.projectType = res.result
      }
    }),
      initDictOptions('project_area').then(res => {
        if (res.success) {
          console.log(res, 'type')
          this.projectType = res.result
        }
      })
  },
  methods: {
    typeOrAreaChange() {
      delete this.queryParam.type
      delete this.queryParam.place
      this.searchQuery()
    },
    onSelectChange(val, record) {
      console.log(val, 'onSelectChange')
      console.log(record, 'record')
      this.checkedCodes = record[0].prjCode
      this.checkedIds = record[0].id
    },
    handleCancel() {
      this.isvisible = false
    },
    handleSubmit() {
      let that = this
      let url = this.url.sync,
        params = {
          ids: this.ids,
          isAllIds: '0',
          prjCode: this.checkedCodes,
          projectId: this.checkedIds
        }
      this.$emit('departChosenOk', params)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/title-btn.less';
.title {
  margin-bottom: 10px;
}
.confirm {
  float: right;
}
.table-page-search-wrapper {
  :global(form.ant-form) {
    :global(.ant-row) {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
  }
}
</style>
