/**
 * 废弃
 */
import Vue from 'vue'
import { getAction } from '../../../api/manage'

export const IotPrjTreeMixin = {
  data () {
    return {
      collapsed: false,
      activeKey: ['1', '2'], // 默认展开标识
      radioChecked: true, // 快捷查询中部门模板选中状态
      selectedProKeys: [], // 快捷查询中选中项目列表状态
      treeData: [], // 快捷查询项目列表数据
      projectData: [], // 项目数据数组
      isInProject: '', // 项目级判断标志
      url: {
        getPrjListByUser: '/project/sysProject/prjListByUser'
      },
      prjCodeString: '' // 项目编码字符串
    }
  },
  beforeCreate () {
  },
  created () {
    // this.isInProject = Vue.ls.get('PROJECT_MESSAGE');
    this.isInProject = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
  },
  mounted () {
    // this.initPrjTree()
  },
  methods: {
    initPrjTree () {
      return new Promise(this.loadTreeData).then((result) => {
        this.setPrjCodes()
        console.log('成功：' + result)
      }).catch(reason => {
        console.log('失败：' + reason)
      })
    },
    // 获取快捷查询项目树数据
    loadTreeData (resolve, reject) {
      // debugger
      if (!this.url.getPrjListByUser) {
        this.$message.error('请设置url.getPrjListByUser属性!')
        return
      }
      let params = null
      let that = this
      getAction(this.url.getPrjListByUser, params).then(res => {
        console.log('IotPrjTreeMixin:res=>', res)
        // Vue.ls.set("PROJECT_INFO_LIST", res.result)
        if (res.success) {
          that.treeData = res.result
          console.log('that.treeData=>', that.treeData)
          that.prjCodeString = ''
          that.prjCodeString += res.result.map(function (item) {
            return item.prjCode
          })
          resolve(res.success)
        } else {
          reject(res.message)
        }
      })
    },
    // 序列化项目树
    // formate(value) {
    //   if (value && value.length > 0) {
    //     let arr = []
    //     value.forEach((item, index) => {
    //       let arrItem = []
    //       if (item.list && item.list.length > 0) {
    //         item.list.forEach((listItem, listIndex) => {
    //           arrItem.push({
    //             title: listItem.prjName,
    //             key: listItem.id,
    //             prjCode: listItem.prjCode
    //           })
    //         })
    //       }
    //       arr.push({
    //         title: item.item,
    //         key: index,
    //         /* disabled: true, */
    //         children: arrItem
    //       })
    //     })
    //     return arr
    //   }
    // },
    setPrjCodes () {
      this.queryParam.prjCodes = this.prjCodeString
    },
    onSelect (selectedKeys, info) {
      if (selectedKeys.length == 0) {
        this.disable = true
        return
      }
      this.selectedProKeys = selectedKeys
      this.disable = false
      this.queryParam.prjCodes = info.selectedNodes[0].data.attrs.prjCode
      // console.log(this.queryParam)
      this.searchQuery()
      // 清除默认单选框选中状态
      this.radioChecked = false
    },
    // 默认单选框被选中时触发
    defaultFocus () {
      // 选中默认框
      this.radioChecked = true
      // 清除项目列表树选中状态
      this.selectedProKeys = []
      this.setPrjCodes()
      this.clickReset = !this.clickReset
      this.loadData(1)
    },
    // 控制查询面板的显隐
    switchVisible () {
      this.collapsed = !this.collapsed
    },
    resertTable () {
      this.selectedRowKeys = []
      this.disable = true
    },
    // 刷新页面
    mySearchReset () {
      this.radioChecked = true
      this.queryParam = {}
      this.resertTable()
      this.defaultFocus()
    }
  }
}
