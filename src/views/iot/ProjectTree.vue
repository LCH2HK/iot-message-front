<template>
  <div class="tree-content" v-if="!projectMsg">
    <a-layout-sider
      width="200px"
      theme="light"
      collapsedWidth="0"
      :trigger="null"
      collapsible
      v-model="collapsed"
      style="margin-right: 10px"
    >
      <a-collapse v-model="activeKey" style="height: inherit;border-bottom: 1px solid #d9d9d9">
        <a-collapse-panel header="快捷查询" key="1">
          <a-radio :checked="this.radioChecked" @focus="defaultFocus">默认</a-radio>
        </a-collapse-panel>
        <a-collapse-panel style="border-bottom: 0;" header="项目树" key="2">
          <a-tree showLine @select="onSelect" :selectedKeys="selectedProKeys">
            <a-tree-node
              v-for="item in this.treeData"
              :title="item.prjName"
              :key="item.id"
              :prjCode="item.prjCode"
            ></a-tree-node>
          </a-tree>
        </a-collapse-panel>
      </a-collapse>
    </a-layout-sider>
    <!-- 切换按钮 -->
    <div class="switch-visible" @click="switchVisible">
      <span :class="!collapsed ? 'show' : 'unshow'"></span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'ProjectTree',
  data () {
    return {
      projectMsg: null, // 项目信息
      selectedProKeys: [], // 选中的树节点
      activeKey: ['1', '2'], // 默认展开面板
      radioChecked: true, // 默认单选框是否选中
      collapsed: false, // 是否隐藏
      treeData: [] // 节点数据
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息，判断是否为项目级
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
  },
  methods: {
    // 初始化树节点
    initTreeData (projectList) {
      this.treeData = projectList
    },
    // 节点选择事件
    onSelect (selectedKeys, e) {
      this.radioChecked = false
      if (selectedKeys.length === 0) {
        this.defaultFocus()
        return
      }
      this.selectedProKeys = selectedKeys
      this.$emit('getSelectMessage', e.selectedNodes[0].data.attrs.prjCode)
    },
    // 默认单选框被选中时触发
    defaultFocus () {
      this.radioChecked = true
      this.selectedProKeys = []
      this.$emit('defaultFocus')
    },
    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/topBtns.less';

div.tree-content {
  display: flex;
  box-sizing: border-box;
  min-height: 0;
  margin-right: 14px;
}
</style>
