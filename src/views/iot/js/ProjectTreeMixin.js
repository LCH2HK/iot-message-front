/**
 * 引入项目树需要的公用变量与方法
 */
import { getAction } from '../../../api/manage'

export const ProjectTreeMixin = {
  data () {
    return {
      prjCode: '', // 记录当前选中的prjCode
      prjCodeString: '', // 所有的项目编码
      projectList: [], // 项目列表数组
      projectMsg: null, // 项目信息,企业级为null
      url: {
        getPrjListByUser: '/project/sysProject/prjListByUser'
      }
    }
  },
  created () {
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
  },
  methods: {
    /**
     * 判断为项目级还是企业级，然后加载数据
     */
    judgeCorpOrPrjThenLoadData () {
      return new Promise(resolve => {
        if (this.projectMsg) {
          // console.log('项目级', this.projectMsg)
          this.prjCodeString = this.projectMsg.prjCode
          this.initTable()
        } else {
          // console.log('企业级', this.projectMsg)
          this.loadTreeData().then(() => {
            this.initTable()
            this.$refs.projectTree.initTreeData(this.projectList)
          }).catch(reason => {
            this.$message.warning(reason.message)
            console.log(reason)
          })
        }
        resolve('success')
      })
    },
    /**
     * 初始表单，默认按钮点击事件
     */
    initTable () {
      this.prjCode = ''
      this.queryParam.prjCodes = this.prjCodeString
      this.loadData()
    },
    /**
     * 节点选择事件
     */
    getSelectMessage (prjCode) {
      this.prjCode = prjCode
      this.queryParam.prjCodes = prjCode
      this.searchQuery()
    },
    /**
     * 加载项目数据
     */
    loadTreeData () {
      return new Promise((resolve, reject) => {
        if (!this.url.getPrjListByUser) {
          this.$message.error('请设置url.getPrjListByUser属性!')
          return
        }
        const params = null
        const that = this
        getAction(this.url.getPrjListByUser, params).then(res => {
          // console.log('项目参数====>', params)
          if (res.success) {
            // 无项目
            if (res.result.length === 0) {
              reject(Error('暂无授权项目,请联系相关人员!'))
            } else {
              that.projectList = res.result
              that.prjCodeString = ''
              that.prjCodeString += res.result.map(function (item) {
                return item.prjCode
              })
              resolve(res.success)
            }
            // console.log('项目列表====>', res.result)
          } else {
            reject(res.message)
            that.$message.error('获取项目数据失败!')
          }
        })
      })
    },
    /**
     * 重置搜索
     */
    mySearchReset () {
      this.queryParam = []
      if (this.prjCode !== '') {
        this.queryParam.prjCodes = this.prjCode
      } else {
        this.queryParam.prjCodes = this.prjCodeString
      }
      this.clickReset = !this.clickReset
      this.loadData()
    }
  }
}
