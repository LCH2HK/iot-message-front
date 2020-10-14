/**
 * 引入设备树需要的公用变量方法
 */
import { getAction } from '../../../api/manage'
import Vue from 'vue'

export const DeviceTreeMixin = {
  data () {
    return {
      projectMsg: null,
      projectList: []
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
  },
  methods: {
    /**
     * 企业级中，分页请求多个数据源下的数据
     */
    loadDataWithMultDataService () {
      this.dataSource = []
      const dataServiceUrlSet = new Set()
      this.projectList.map(prjMsg => {
        dataServiceUrlSet.add(prjMsg.dataServiceUrl)
      })
      // let dataServiceUrlArray = Array.from(dataServiceUrlSet)
      dataServiceUrlSet.map(serviceUrl => {
        this.url.list = serviceUrl + this.url.list
        this.loadDataInOneProject()
      })
    },
    loadDataInOneProject (arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // let currentPage = this.ipagination.current;
      const totalItem = this.ipagination.total
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      // 若传入参数为-1，则加载上一页的内容  解决删除一页最后一条数据时数据不显示的bug
      if (arg === -1 && totalItem % 10 === 1 && this.ipagination.current === parseInt(totalItem / 10 + 1)) {
        this.ipagination.current--
      }
      var params = this.getQueryParams() // 查询条件
      params.pageSize = this.ipagination.pageSize - this.dataSource.length
      console.log('调用loadData,params:', params)
      console.log('this.url.list:', this.url.list)
      getAction(this.url.list, params).then(res => {
        console.log('res==>', res)
        if (res.success) {
          this.dataSource.push(res.result.records)
          this.ipagination.total += res.result.total
        } else {
          this.$message.error('查询数据失败!')
          console.error(res)
        }
        this.selectedRowKeys = []
      })
    }
  }
}
