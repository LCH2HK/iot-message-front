<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <div style="height: 100%; width: auto">
      <a-collapse
        v-model="activeKey"
        style="height: inherit;border-bottom: 1px solid #d9d9d9"
      >
        <a-collapse-panel
          header="快捷查询"
          key="1"
        >
          <a-radio
            :checked="this.radioValue"
            @focus="focus">默认
          </a-radio>
        </a-collapse-panel>
        <a-collapse-panel style="border-bottom: 0;" :header="header" key="2">
          <div>
            <a-tree
              showLine
              @select="onSelect"
              :selectedKeys="selectKey"
              @expand="onExpand"
              :treeData="treeData"
              :autoExpandParent="autoExpandParent"
              :expandedKeys="expandedKeys"
            >
            </a-tree>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import { queryDepartTreeList } from '@/api/api'
  import ACol from 'ant-design-vue/es/grid/Col'

  export default {
    name: 'JLeftTree',
    components: { ACol },
    props: {
      // 表头名称
      header: {
        type: String
      },
      // queryParam查询使用的字段
      searchKey: {
        type: String
      },
      // 数据库中表名
      tableName: {
        type: String
      },
      // 父节点ID
      parentId: {
        type: String
      },
      // 节点名称，对应数据库中的列名
      optionName: {
        type: String
      },
      // 权限，0:查询所属公司下所有节点 1:查询所属子部门下的所有节点
      permisson: {
        type: String
      },
      // 是否使用字典值
      dictCode: {
        type: String,
        defaultValue: null
      },
      // 是否倒序排序
      desc: {
        type: Boolean,
        defaultValue: false
      },
      // 是否正序排序
      asc: {
        type: Boolean,
        defaultValue: false
      },
      // 排序条件
      sortCondition: {
        type: String
      }
    },
    data() {
      return {
        activeKey: ['1', '2'],
        radioValue: true,
        treeData: [],
        autoExpandParent: true,
        expandedKeys: [],
        selectKey: [],
        dictType: [], // 数据字典中获得的数组
      }
    },
    created() {
      // 直接显示字典值即可
      if (this.dictCode != null) {
        initDictOptions(this.dictCode)
          .then((res) => {
            if (res.success) {
              this.dictType = this.desc ? res.result.reverse() : res.result
              // 需要把treeData中的value转化为key
              this.treeData = JSON.parse(JSON.stringify(this.dictType).replace(/"value"/g, '"key"'))
              console.log(this.treeData, '打印treeData')
            }
          })
      } else {
        console.log(this.$store.getters.userInfo.orgCode, '登录用户的部门ID')
        this.axios.post('/test/getTree/list',
          {
            id: this.searchKey,
            dbTable: this.tableName,
            pId: this.parentId,
            title: this.optionName,
            orgCode: this.$store.getters.userInfo.orgCode,
            corpCode: this.$store.getters.userInfo.corpCode,
            permisson: this.permisson,
            desc: this.desc,
            asc: this.asc,
            sortCondition: this.sortCondition
          }
        )
          .then((response) => {
            console.log(response, '部门树')
            this.treeData = response
            this.initExpandedKeys(response)
          })
      }
    },
    methods: {
      focus() {
        this.radioValue = true
        this.selectKey = []
        console.log('默认快捷查询')
        this.$emit('searchByTree')
      },
      //点击树节点
      onSelect(keys, index) {
        this.selectKey = keys
        this.radioValue = false
        console.log('树节点选择了key => ', keys[0])
        console.log(index.selectedNodes[0].data.props.dataRef)
        this.$emit('searchByTree', keys[0])
      },
      initExpandedKeys(arr) {
        if (arr && arr.length > 0) {
          let keys = []
          for (let item of arr) {
            if (item.children && item.children.length > 0) {
              keys.push(item.key)
            }
          }
          this.expandedKeys = [...keys]
        } else {
          this.expandedKeys = []
        }
      },
      onExpand(expandedKeys) {
        console.log('展开关闭节点')
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      }
    }
  }
</script>

<style scoped>

</style>