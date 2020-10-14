<!--设备标签 标签管理窗口 -->
<template>
  <a-modal title="标签管理" :footer="null" :visible="visible" @cancel="handleCancel">
    <a-button class="tag-btn" type="primary" icon="plus" @click="showAddModal">新增</a-button>
    <a-button class="tag-btn" type="primary" icon="delete" @click="deleteTags">删除</a-button>
    <a-table
      bordered
      rowKey="tagName"
      :columns="columns"
      :dataSource="deviceTagsMsg"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    ></a-table>
    <TagsAddModal ref="tagsAddModal" @loadNewTag="loadNewTag" :deviceTags="deviceTagsMsg"></TagsAddModal>
  </a-modal>
</template>

<script>
import { myCmpListMixin } from '../../../../mixins/myCmpListMixin'
import TagsAddModal from './TagsAddModal'
import { postAction } from '../../../../api/manage'
import qs from 'qs'
export default {
  name: 'TagsManageModal',
  mixins: [myCmpListMixin],
  components: {
    TagsAddModal
  },
  props: {
    deviceTagsMsg: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      selectedRowKeys: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => {
            return this.getIndexOfPage(index)
          }
        },
        {
          title: '标签名',
          dataIndex: 'tagName',
          key: 'tagName'
        }
      ],
      url: {
        deleteTags: '/tags/tags/deleteTags'
      }
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    showAddModal () {
      this.$refs.tagsAddModal.show()
    },
    /**
     * 改变标签后调用刷新数据
     */
    loadNewTag () {
      this.$emit('loadNewTags')
    },
    /**
     * 批量删除标签
     */
    deleteTags () {
      this.$confirm({
        title: '确认删除',
        content: '将删除所有设备中的同名标签,是否删除选中标签?',
        onOk: () => {
          console.log(this.selectedRowKeys)
          let tagNames = ''
          tagNames += this.selectedRowKeys.map(data => {
            return data
          })
          let params = {
            tagNames: tagNames
          }
          console.log(params)
          postAction(this.url.deleteTags, qs.stringify(params)).then(res => {
            console.log(res)
            if (res.success) {
              this.loadNewTag()
              this.$message.success('删除成功!')
            } else {
              this.$message.error('删除失败!')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.tag-btn {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
