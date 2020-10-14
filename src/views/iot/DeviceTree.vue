<template>
  <div class="tree-container">
    <a-layout-sider
      width="200px"
      theme="light"
      collapsedWidth="0"
      :trigger="null"
      collapsible
      v-model="collapsed"
      :class="{'device-tree-sider':!collapsed}"
    >
      <a-collapse v-model="activeKey" style="height: inherit;border-bottom: 1px solid #d9d9d9">
        <a-collapse-panel header="快捷查询" key="1">
          <div style="padding: 16px;">
            <a-radio :checked="this.radioChecked" @focus="defaultFocus">默认</a-radio>
            <div v-if="showShearch">
              <a-input-search
                style="margin-top: 8px"
                placeholder="请输入设备编号"
                @search="onSearchKey"
                v-model="searchValueKey"
              />
              <a-input-search
                style="margin-top: 8px"
                placeholder="请输入设备名称"
                @search="onSearchName"
                v-model="searchValueName"
              />
            </div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel style="border-bottom: 0;" header="设备树" key="2">
          <div class="tree-content">
            <a-tree
              showLine
              @expand="onExpand"
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              :treeData="treeData"
              @select="onSelect"
              :loadData="onLoadData"
              :selectedKeys="selectedProKeys"
            >
              <!--搜索后使名称高亮-->
              <template slot="title" slot-scope="{ key, title }">
                <span v-if="highLightNodeKey.indexOf(key) > -1">
                  <span style="color: #f50">{{ title }}</span>
                </span>
                <span v-else-if="title.indexOf(searchValueName) > -1">
                  {{ title.substr(0, title.indexOf(searchValueName)) }}
                  <span
                    style="color: #f50"
                  >{{ searchValueName }}</span>
                  {{ title.substr(title.indexOf(searchValueName) + searchValueName.length) }}
                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-layout-sider>
    <!-- 切换按钮 -->
    <div class="switch-visible"   @click="switchVisible">
      <span :class="!collapsed ? 'show' : 'unshow'"></span>
    </div>
  </div>
</template>

<script>
import { postAction } from '@/api/manage'
import { getAction } from '../../api/manage'

const PROJECT_NODE_LEVEL = 1
// const PRODUCT_NODE_LEVEL = 2
// const DEVICE_GROUP_NODE_LEVEL = 3
const DEVICE_NODE_LEVEL = 4

export default {
  name: 'DeviceTree',
  props: {
    showShearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prjCodes: '', // 项目编码
      projectMsg: null, // 项目信息
      selectedProKeys: [], // 选中的树节点
      expandedKeys: [], // 展开的树节点
      activeKey: ['1', '2'], // 默认展开面板
      radioChecked: true, // 默认单选框是否选中
      collapsed: false, // 是否隐藏
      autoExpandParent: true, // 是否自动展开父节点
      treeData: [], // 节点数据
      searchValueName: '', // 根据名称搜索
      searchValueKey: '', // 根据设备编号搜索
      highLightNodeKey: [], // 记录需要高亮的设备ID
      clickReset: false, // 点击重置按钮，触发值的改变
      url: {
        getDeviceTreeData: 'deviceTree/treeNode/getDeviceTreeData',
        getChildNodeByParentNode: 'deviceTree/treeNode/getChildNodeByParentNode',
        getChildMqttNodeByParentNode: 'deviceTree/treeNode/getChildMqttNodeByParentNode',
        getTreeNodeKeyByDeviceName: 'deviceTree/treeNode/getTreeNodeKeyByDeviceName',
        getTreeNodeKeyByDeviceKey: 'deviceTree/treeNode/getTreeNodeKeyByDeviceKey',
        getTreeNodeKeyByDeviceInfo: 'deviceTree/treeNode/getTreeNodeKeyByDeviceInfo'
      }
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE') // 获取项目信息，判断是否为项目级
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE')) // 获取项目信息，判断是否为项目级
  },
  methods: {
    // 树节点选中事件
    onSelect (selectedKeys, e) {
      this.radioChecked = false
      // 节点取消选中时变为默认状态
      if (selectedKeys.length === 0) {
        this.defaultFocus()
        return
      }
      this.selectedProKeys = selectedKeys
      let nodePos = e.node.pos
      if (this.projectMsg) {
        // 在项目级中，去除了项目节点，在这里加上
        nodePos = '0-' + e.node.pos
      }
      let nodeLevel
      /**
       *  节点名      节点层级
       *  项目            1
       *  产品            2
       *  设备分组        3（设备分组功能暂时去除，代码可优化）
       *  设备            4
       */
      if (e.node.isLeaf) {
        nodeLevel = DEVICE_NODE_LEVEL // 令设备节点的nodeLevel为4
      } else {
        nodeLevel = nodePos.split('-').length - 1
      }
      const selectMessage = {
        nodeLevel: nodeLevel,
        nodeKey: selectedKeys[0],
        nodePos: nodePos
      }
      this.$emit('getSelectMessage', selectMessage) // 调用父组件选中节点方法
    },
    // 企业级，通过项目列表加载项目节点
    loadProjectTreeData (projectList) {
      const projectTreeData = []
      this.prjCodes += projectList.map(function (node) {
        projectTreeData.push({
          key: node.prjCode,
          title: node.prjName,
          isLeaf: false
        })
        return node.prjCode
      })
      this.treeData = projectTreeData
    },
    // 项目级，通过项目编码加载产品节点
    loadProductNodeData (prjCode) {
      this.prjCodes = prjCode
      const that = this
      const param = {
        nodeLevel: PROJECT_NODE_LEVEL,
        nodeKey: prjCode
      }
      postAction(this.url.getChildNodeByParentNode, param).then(res => {
        if (res.success) {
          console.log('节点获取', res)
          that.treeData = res.result[0]
        } else {
          that.$message.error('获取产品节点失败!')
        }
      })
    },
    loadMqttProductNodeData (prjCode) {
      this.prjCodes = prjCode
      const that = this
      const param = {
        nodeLevel: PROJECT_NODE_LEVEL,
        nodeKey: prjCode
      }
      postAction(this.url.getChildMqttNodeByParentNode, param).then(res => {
        console.log('MqttTaskList:loadProductNodeData:res=>', res)
        if (res.success) {
          that.treeData = res.result[0]
        } else {
          that.$message.error('获取产品节点失败!')
        }
      })
    },
    // 按需展开树节点
    onLoadData (treeNode) {
      console.log('设备树，loadData,treeNode=', treeNode)
      let nodePos = treeNode.pos
      if (this.projectMsg) {
        nodePos = '0-' + treeNode.pos
      }
      const nodeLevel = nodePos.split('-').length - 1
      const nodeKey = treeNode.eventKey
      const param = {
        nodeLevel: nodeLevel,
        nodeKey: nodeKey
      }
      const that = this
      return new Promise((resolve, reject) => {
        postAction(that.url.getChildNodeByParentNode, param).then(res => {
          if (res.success) {
            if (res.result[0].length != 0) {
              treeNode.dataRef.children = res.result[0]
              if (treeNode.dataRef.children[0].nodeLevel === '4') {
                treeNode.dataRef.children.map(data => {
                  data.scopedSlots = { key: 'key', title: 'title' }
                })
              }
            }
            that.treeData = [...that.treeData]
            // 搜索功能，异步加载树节点后，需再次调用该函数展开下一级
            that.onExpand(that.expandedKeys)
            resolve(res.result)
          } else {
            that.$message.error('获取子节点失败!')
            console.log(res)
            reject(res.message)
          }
        })
      })
    },
    /**
     * 获取指定pos的节点
     * 0-0-0-0-0
     */
    getNodeByPos (pos) {
      const posList = pos.split('-')
      if (this.projectMsg) {
        // 项目级，去掉首位
        posList.shift()
      }
      let node = this.treeData[posList[1]]
      for (let i = 2; i < posList.length; i++) {
        node = node.children[posList[i]]
      }
      return node
    },
    /**
     * 获取指定pos数组的节点
     * [0,0,0,0,0]
     */
    getNodeByPosList (posList) {
      if (this.projectMsg) {
        // 项目级，去掉首位
        posList.shift()
      }
      let node = this.treeData[posList[1]]
      for (let i = 2; i < posList.length; i++) {
        node = node.children[posList[i]]
      }
      return node
    },
    // 默认单选框被选中时触发
    defaultFocus () {
      this.radioChecked = true
      this.selectedProKeys = []
      this.searchValueName = ''
      this.searchValueKey = ''
      this.highLightNodeKey = []
      this.$emit('defaultFocus')
    },
    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    },
    // 树展开
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 根据设备名称和编号同时搜索
    onSearch (value) {
      this.highLightNodeKey = []
      this.radioChecked = false
      if (value.deviceName != undefined || value.deviceKey != undefined) {
        const that = this
        const params = {
          deviceName: value.deviceName,
          deviceKey: value.deviceKey,
          prjCodes: this.prjCodes
        }
        getAction(that.url.getTreeNodeKeyByDeviceInfo, params).then(res => {
          if (res.success) {
            if (res.result !== null) {
              const expandKeysBySearch = new Set()
              res.result.forEach(data => {
                expandKeysBySearch.add(data.prjCode)
                expandKeysBySearch.add(data.productId)
                that.highLightNodeKey.push(data.id)
              })
              that.expandedKeys = Array.from(expandKeysBySearch)
            }
          } else {
            that.$message.error('搜索失败!')
          }
        })
      }
    },
    // 根据名称搜索设备,模糊查询
    onSearchName (value) {
      this.highLightNodeKey = []
      if (value !== '') {
        const that = this
        const params = {
          deviceName: value,
          prjCodes: this.prjCodes
        }
        getAction(that.url.getTreeNodeKeyByDeviceName, params).then(res => {
          if (res.success) {
            if (res.result.length > 0) {
              this.radioChecked = false
              const expandKeysBySearch = new Set()
              res.result.forEach(data => {
                expandKeysBySearch.add(data.prjCode)
                expandKeysBySearch.add(data.productId)
              })
              that.expandedKeys = Array.from(expandKeysBySearch)
            }
          } else {
            that.$message.error('搜索失败!')
          }
        })
      }
    },
    // 根据设备编号搜索,模糊查询
    onSearchKey (value) {
      this.highLightNodeKey = []
      if (value !== '') {
        const that = this
        const params = {
          deviceKey: value,
          prjCodes: this.prjCodes
        }
        getAction(that.url.getTreeNodeKeyByDeviceKey, params).then(res => {
          if (res.success) {
            if (res.result.length > 0) {
              this.radioChecked = false
              const expandKeysBySearch = new Set()
              res.result.forEach(data => {
                expandKeysBySearch.add(data.prjCode)
                expandKeysBySearch.add(data.productId)
                that.highLightNodeKey.push(data.id)
              })
              that.expandedKeys = Array.from(expandKeysBySearch)
            }
          } else {
            that.$message.error('搜索失败!')
          }
        })
      }
    },
    // 通过项目列表搜索所有树节点，弃用
    loadDeviceTreeData (projectList) {
      if (!this.url.getDeviceTreeData) {
        this.$message.error('请设置url.getDeviceTreeData!')
        return
      }
      const prjInfos = JSON.stringify(projectList)
      const params = {
        prjInfos: prjInfos
      }
      const that = this
      postAction(this.url.getDeviceTreeData, params).then(res => {
        that.treeData = res.result[0]
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/topBtns.less';

div.tree-container {
  display: flex;
  box-sizing: border-box;
  min-height: 0;
}
.device-tree-sider{
  margin-right: 10px;
}
.tree-content {
  width: 100%;
  max-height: 560px;
  overflow: auto;
  padding: 16px;
}
/deep/.ant-collapse-content > .ant-collapse-content-box {
  padding: 0;
}

/deep/ .ant-tree {
  /deep/ .ant-tree-child-tree {
    /deep/ .ant-tree-switcher-noop {
      background: url('../../assets/img/iot/device/tree-leaf.png') no-repeat center/85% #fff;

      i {
        display: none;
      }
    }
  }
}

</style>
