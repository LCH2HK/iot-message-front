<template>
  <a-table
    bordered
    :showHeader="true"
    :scroll="{y: 250}"
    :columns="columns"
    :dataSource="dataSource"
    :pagination="false"
  >
    <template slot="value" slot-scope="text, record">
      <editable-cell :text="text" @change="onCellChange(record.alias, 'value', $event)" />
    </template>
  </a-table>
</template>
<script>
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange"  />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String
  },
  // <a-icon
  // type="check"
  // class="editable-cell-icon-check"
  // @click="check"
  //     />
  //     <a-icon type="edit" class="editable-cell-icon" @click="edit" />
  data () {
    return {
      value: this.cellValue,
      editable: true
    }
  },
  methods: {
    handleChange (e) {
      const value = e.target.value
      this.value = value
      this.$emit('change', this.value)
    },
    check () {
      // this.editable = false;
      this.$emit('change', this.value)
    },
    edit () {
      // this.editable = true;
    }
  }
}
export default {
  name: 'MqttActionParams',
  mixins: [],
  props: {
    pData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    EditableCell
  },
  data () {
    return {
      visible: false,
      description: '描述信息',
      // 表头
      confirmLoading: false,
      editingKey: '',
      dataSource: this.pData,
      loading: false,
      columns: [
        {
          title: '属性名称',
          dataIndex: 'name',
          width: '25%'
        },
        {
          title: '属性标识',
          dataIndex: 'alias',
          width: '15%'
        },
        {
          title: '值',
          dataIndex: 'value',
          width: '30%',
          scopedSlots: { customRender: 'value' }
        }
      ],
      url: {}
    }
  },
  beforeCreate () {},
  created () {
    console.log('pData=>', this.pData)
    // this.myedit
  },
  watch: {},
  mounted () {},

  computed: {},
  methods: {
    customHeaderRow (record) {
      record.forEach(item => {
        item.align = 'center'
      })
    },
    onCellChange (alias, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.alias === alias)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
      // console.log("onCellChange dataSource=>",this.dataSource)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
/deep/.ant-table-body {
  max-height: 195px !important;
}

.buttonWrap {
  float: right;
  color: white;
}
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
