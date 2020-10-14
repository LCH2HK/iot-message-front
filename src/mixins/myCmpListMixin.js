/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util'
import { deleteAction, getAction, downFile, getActionUrl, httpAction } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment'
import qs from 'qs'

export const myCmpListMixin = {
  data () {
    return {
      // 点击重置按钮，触发值的改变
      clickReset: false,
      // token header
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 模糊查询列表 */
      queryParamLk: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc'
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys */
      selectedRowKeys: [],
      /* table选中records */
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: ''
    }
  },
  created () {
  },
  methods: {
    loadData (arg) {
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
      if (arg === -1 && (totalItem % 10 === 1) && this.ipagination.current === parseInt(totalItem / 10 + 1)) {
        this.ipagination.current--
      }
      const params = this.getQueryParams()// 查询条件
      console.log('查询条件:', params)
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        } else {
          this.$message.error('查询数据失败!')
          console.error(res)
        }
        this.loading = false
        this.selectedRowKeys = []
      })
    },
    initDictConfig () {
      console.log('--这是一个假的方法!')
    },
    handleSuperQuery (arg) {
      // 高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams () {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp.superQueryParams = encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      // 时间格式化
      param.minStartTime = param.minStartTime ? moment(param.minStartTime).format('YYYY-MM-DD HH:mm:ss') : null
      param.maxStartTime = param.maxStartTime ? moment(param.maxStartTime).format('YYYY-MM-DD HH:mm:ss') : null
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    // 模糊查询回车事件
    enterSearch (val, bindVal) {
      this.queryParam[bindVal] = val
      this.searchQuery()
    },
    // 模糊查询回绑值
    inputValueLk (val, bindVal) {
      // console.log(val, bindVal);
      this.queryParam[bindVal] = val
    },
    getQueryField () {
      // TODO 字段权限控制
      var str = 'id,'
      this.columns.forEach(function (value) {
        str += ',' + value.dataIndex
      })
      return str
    },

    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchQuery () {
      this.loadData(1)
    },
    superQuery () {
      this.$refs.superQueryModal.show()
    },
    searchReset () {
      this.queryParam = {}
      this.clickReset = !this.clickReset
      this.loadData(1)
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    /* isDisabled是针对于通讯录的  其他的可以不传 */
    handleEdit: function (record, isDisabled) {
      if (isDisabled) {
        this.$refs.modalForm.title = '查看'
      } else {
        this.$refs.modalForm.title = '编辑'
      }
      this.$refs.modalForm.edit(record, isDisabled)
    },
    /* /!*针对用户管理的*!/
    handleEdit1: function (record, isDisabled) {
      this.$refs.modalForm.edit(record, isDisabled);
      if(isDisabled){
        this.$refs.modalForm.title = "查看";
      }else{
        this.$refs.modalForm.title = "编辑";
      }
    }, */
    handleAdd: function () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
    },
    handleTableChange (pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选

      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    handleToggleSearch () {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    modalFormOk () {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },

    batchEdit () {
      if (this.selectedRowKeys.length != 0) {
        this.handleEdit(this.selectionRows[0])
      } else {
        this.$message.warning('请选择一条记录！')
      }
    },
    batchDel1 () {
      if (this.selectedRowKeys.length != 0) {
        this.batchAbandone(this.selectionRows[0].id)
      } else {
        this.$message.warning('请选择一条记录！')
      }
    },
    /* 导出 */
    handleExportXls2 () {
      const paramsStr = encodeURI(JSON.stringify(this.getQueryParams()))
      const url = `${window._CONFIG.domianURL}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`
      window.location.href = url
    },
    handleExportXls (fileName) {
      if (!fileName || typeof fileName !== 'string') {
        fileName = '导出文件'
      }
      const param = { ...this.queryParam }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param.selections = this.selectedRowKeys.join(',')
      }
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName + '.xls')
        } else {
          const url = window.URL.createObjectURL(new Blob([data]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
    /* 导入 */
    handleImportExcel (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.$message.success(`${info.file.name} 文件上传成功`)
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `)
      }
    },
    /* 图片预览 */
    getImgView (text) {
      if (text && text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      return window._CONFIG.imgDomainURL + '/' + text
    },
    /* 文件下载 */
    uploadFile (text) {
      if (!text) {
        this.$message.warning('未知的文件')
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      window.open(window._CONFIG.domianURL + '/sys/common/download/' + text)
    },

    // 初始化选人组件
    initSelect (col, val) {
      if (val[0] != null) {
        var arr2 = []
        for (var i = 0; i < val[0].split(',').length; i++) {
          var item = {}
          for (var j = 0; j < col.length; j++) {
            this.$set(item, col[j], val[j].split(',')[i])
          }
          arr2.push(item)
        }
        return arr2
      }
    },

    // 初始化上传组件
    initUpload (that, k, fromAttachment, list = 'fileList') {
      if (fromAttachment !== undefined) {
        if (fromAttachment == null || fromAttachment == '') {
          that.attachment[k].groupId = that.uuid()
        } else {
          that.attachment[k].groupId = fromAttachment
        }
        that.attachment[k].fileTokens = ''
        getAction(that.url.fileFind, { groupId: fromAttachment }).then((res) => {
          for (let i = 0; i < res.result.length; i++) {
            if (res.result[i].uploadFile.savePath.substring(res.result[i].uploadFile.savePath.length - 4) == 'jpeg' || res.result[i].uploadFile.savePath.substring(res.result[i].uploadFile.savePath.length - 3) == 'jpg' || res.result[i].uploadFile.savePath.substring(res.result[i].uploadFile.savePath.length - 3) == 'png') {
              const fileChild = {
                response: {
                  result: {
                    fileTokens: res.result[i].fileToken
                  }
                },
                uid: i,
                name: res.result[i].uploadFile.fileName,
                status: 'done',
                type: 'image/jpeg',
                url: that.url.imgerver + '/' + res.result[i].uploadFile.savePath
              }
              that[list].push(fileChild)
              that.attachment[k].fileTokens += res.result[i].fileToken + ','
            } else {
              const fileChild = {
                response: {
                  result: {
                    fileTokens: res.result[i].fileToken
                  }
                },
                uid: i,
                name: res.result[i].uploadFile.fileName,
                status: 'done',
                type: 'text/plain',
                url: that.url.imgerver + '/' + res.result[i].uploadFile.savePath
              }
              that[list].push(fileChild)
              that.attachment[k].fileTokens += res.result[i].fileToken + ','
            }
          }
        })
      } else {
        that.attachment[k].groupId = that.uuid()
        that.attachment[k].fileTokens = ''
      }
    },
    // 生成UUid  上传附件时给后端groupid
    uuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      // s[8] = s[13] = s[18] = s[23] = "-";
      s[8] = s[13] = s[18] = s[23] = ''
      var uuid = s.join('')
      return uuid
    },
    // 下载预览函数
    handlePreview (file, val = '') {
      const fileArray = file.name.split('.')
      const fileName = fileArray[0]
      const fileType = fileArray[1]
      if (file.type == 'image/jpeg') {
        if (file.url || file.thumbUrl) {
          this.previewImage = file.url || file.thumbUrl
        } else {
          this.previewImage = this.getIdCardView()
        }
        this['previewVisible' + val] = true
      } else {
        downFile(this.url.fileDownLoad, { id: file.response.result.fileTokens }).then((data) => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName + '.' + fileType)
          } else {
            const url = window.URL.createObjectURL(new Blob([data]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.' + fileType)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) // 下载完成移除元素
            window.URL.revokeObjectURL(url) // 释放掉blob对象
          }
        })
      }
    },
    // 上传改变函数
    handleChange1 (info, that, k, list = 'fileList') {
      if (info.file.status === 'removed') {
        if (that.attachment[k].fileTokens.indexOf(',') != -1) {
          const target = info.file.response.result.fileTokens
          const str = that.attachment[k].fileTokens
          if (target === str.substr(-target.length)) {
            that.attachment[k].fileTokens = that.attachment[k].fileTokens.replace(',' + info.file.response.result.fileTokens, '')
          } else {
            that.attachment[k].fileTokens = that.attachment[k].fileTokens.replace(info.file.response.result.fileTokens + ',', '')
          }
        } else {
          that.attachment[k].fileTokens = that.attachment[k].fileTokens.replace(info.file.response.result.fileTokens, '')
        }
      }
      that[list] = info.fileList
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        if (response.success) {
          if (that.attachment[k].fileTokens == '') {
            that.attachment[k].fileTokens += response.result.fileTokens
          } else {
            that.attachment[k].fileTokens += ',' + response.result.fileTokens
          }
        } else {
          that.$message.warning(response.message)
        }
      }
    },

    // 初始化流程图和意见审批表
    initChartAndComment (that, record, chartUrl, taskCommentUrl) {
      if (JSON.stringify(record) !== '{}') {
        const params = {
          id: that.model.id
        }
        const httpGetUrlC = chartUrl
        const httpGetUrlTc = taskCommentUrl
        getActionUrl(httpGetUrlC, params).then((res) => {
          that.urlChart = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        }).finally(() => {
          // that.confirmLoading = false;
          // that.close();
        })
        getAction(httpGetUrlTc, { id: that.model.id }).then((res) => {
          that.commentList = res.result.taskListEnd.concat(res.result.taskListIng)
          that.currentList = res.result.taskListEnd.length - 1

          that.finishedList = Object.assign(res.result.taskListEnd)
          that.unfinishedList = Object.assign(res.result.taskListIng)

          // 渲染流程图tab中的数据列表
          that.arr.length = 0
          that.arr1.length = 0

          for (const i in that.finishedList) {
            that.arr.push(that.finishedList[i])
          }
          for (const i in that.unfinishedList) {
            that.arr1.push(that.unfinishedList[i])
          }
        }).finally(() => {
        })
      } else {
        const params = {
          processDefinitionKey: this.processDefinitionKey
        }
        const httpGetUrlC = that.url.chart
        getActionUrl(httpGetUrlC, params).then((res) => {
          this.urlChart = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        }).finally(() => {
          // that.confirmLoading = false;
          // that.close();
        })
      }
    },

    // 选人控件回传值
    setAuditUser (val) { // val:{ colum:'' , target   ,value }
      for (var i = 0; i < this[val.colum].target.length; i++) {
        this[this[val.colum].target[i].to] = val.value[this[val.colum].target[i].from]
        if (i == 0) {
          const keys = this[val.colum].target[i].to
          this.form.setFieldsValue({
            [keys]: val.value[this[val.colum].target[i].from]
          })
        }
      }
    },
    // 初始化选人
    initSelectMan (that, record) {
      if (JSON.stringify(record) !== '{}') {
        for (var i = 0; i < that.selectUser.length; i++) {
          var flag = 1
          var selectValue = []
          var selectColum = []
          for (var j = 0; j < that[that.selectUser[i]].target.length; j++) {
            if (that.model[that[that.selectUser[i]].target[j].to] == '') {
              flag = 0
              break
            } else {
              selectValue.push(that.model[that[that.selectUser[i]].target[j].to])
              selectColum.push(that[that.selectUser[i]].target[j].from)
            }
          }
          if (flag) {
            that[that.selectUser[i]].value = that.initSelect(selectColum, selectValue)
            if (that[that.selectUser[i]].value == undefined) {
              that[that.selectUser[i]].value = []
            }
          }
        }
      }
    },
    // 初始化选部门
    initSelectDepart (that, record) {
      if (JSON.stringify(record) !== '{}') {
        for (var i = 0; i < that.selectDepart.length; i++) {
          var flag = 1
          var selectValue = []
          var selectColum = []
          for (var j = 0; j < that[that.selectDepart[i]].target.length; j++) {
            if (that.model[that[that.selectDepart[i]].target[j].to] == '') {
              flag = 0
              break
            } else {
              selectValue.push(that.model[that[that.selectDepart[i]].target[j].to])
              selectColum.push(that[that.selectDepart[i]].target[j].from)
            }
          }
          if (flag) {
            that[that.selectDepart[i]].value = that.initSelect(selectColum, selectValue)
            if (that[that.selectDepart[i]].value == undefined) {
              that[that.selectDepart[i]].value = []
            }
          }
        }
      }
    },
    // 选人组件提交数据整合
    uploadMan (strFormData, that) {
      if (that.selectUser) {
        for (var i = 0; i < that.selectUser.length; i++) {
          var flag = 1
          for (var j = 0; j < that[that.selectUser[i]].target.length; j++) {
            if (that[that[that.selectUser[i]].target[j].to] == '') {
              flag = 0
              break
            } else {
              strFormData[[that[that.selectUser[i]].target[j].to]] = that[that[that.selectUser[i]].target[j].to]
            }
          }
        }
        return strFormData
      }
    },
    // 选部门组件提交数据整合
    uploadDepart (strFormData, that) {
      if (that.selectDepart) {
        for (var i = 0; i < that.selectDepart.length; i++) {
          var flag = 1
          for (var j = 0; j < that[that.selectDepart[i]].target.length; j++) {
            if (that[that[that.selectDepart[i]].target[j].to] == '') {
              flag = 0
              break
            } else {
              strFormData[[that[that.selectDepart[i]].target[j].to]] = that[that[that.selectDepart[i]].target[j].to]
            }
          }
        }
        return strFormData
      }
    },
    // 提交函数
    handleOk () {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let actionUrl = ''
          let method = ''
          // 表单数据赋值给formData
          const strFormData = Object.assign(this.model, values)
          const strFlowData = {}
          method = 'post'
          // 判断操作类型，新增或者编辑
          if (!that.model.id) {
            actionUrl += that.url.add
            strFlowData.api = '/process/startAndSubmit'
            strFlowData.processDefinitionKey = that.processDefinitionKey
          } else {
            actionUrl += this.url.edit
          }
          // 时间格式化
          that.timeFormat(strFormData)
          // 选人控件传值
          that.uploadMan(strFormData, this)
          // 选部门组件传值
          that.uploadDepart(strFormData, that)
          // 上传组件
          if (that.attachment.length == 1) {
            strFormData[that.attachment[0].fieldName] = that.attachment[0].groupId
          } else {
            for (let i = 0; i < that.attachment.length; i++) {
              strFormData[that.attachment[i].fieldName] = that.attachment[i].groupId
            }
          }

          const params = {
            strFlowData: JSON.stringify(strFlowData),
            strFormData: JSON.stringify(strFormData),
            strAttachment: JSON.stringify(this.attachment)
          }
          // 发起提交或保存请求
          httpAction(actionUrl, qs.stringify(params), method).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              that.$message.warning('操作失败！')
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
          })
        }
      })
    },
    // 暂存操作
    handleSave (lab, id) {
      const that = this
      // 触发表单验证
      if (lab == '/task/submit') {
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            const strFormData = Object.assign(this.model, values)
            httpurl += this.url.add
            method = 'post'
            const strFlowData = {}
            if (lab !== 'start') {
              strFlowData.api = lab
              if (lab == '/task/rollback') {
                strFlowData.targetNodeId = id
              }
            } else {
              strFlowData.api = '/process/start'
            }
            strFlowData.processDefinitionKey = this.processDefinitionKey

            // 时间格式化
            that.timeFormat(strFormData)

            // 选人控件
            that.uploadMan(strFormData, that)

            // 选部门组件传值
            that.uploadDepart(strFormData, that)
            // 上传组件
            if (that.attachment.length == 1) {
              strFormData[that.attachment[0].fieldName] = that.attachment[0].groupId
            } else {
              for (let i = 0; i < that.attachment.length; i++) {
                strFormData[that.attachment[i].fieldName] = that.attachment[i].groupId
              }
            }

            const params1 = {
              strFlowData: JSON.stringify(strFlowData),
              strFormData: JSON.stringify(strFormData),
              strAttachment: JSON.stringify(that.attachment)
            }
            httpAction(httpurl, qs.stringify(params1), method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning('操作失败！')
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      } else if (this.processDefinitionKey == 'leave') {
        if (this.form.getFieldValue('type') == undefined) {
          this.$message.warning('请假类型不能为空')
        }
      } else {
        const values = this.form.getFieldsValue()
        that.confirmLoading = true
        let httpurl = ''
        let method = ''
        const strFormData = Object.assign(this.model, values)
        httpurl += this.url.add
        method = 'post'
        const strFlowData = {}
        if (lab !== 'start') {
          strFlowData.api = lab
          if (lab == '/task/rollback') {
            strFlowData.targetNodeId = id
          }
        } else {
          strFlowData.api = '/process/start'
        }
        strFlowData.processDefinitionKey = this.processDefinitionKey

        // 时间格式化
        that.timeFormat(strFormData)

        // 选人控件
        that.uploadMan(strFormData, that)

        // 上传组件
        if (that.attachment.length == 1) {
          strFormData[that.attachment[0].fieldName] = that.attachment[0].groupId
        } else {
          for (let i = 0; i < that.attachment.length; i++) {
            strFormData[that.attachment[i].fieldName] = that.attachment[i].groupId
          }
        }

        const params1 = {
          strFlowData: JSON.stringify(strFlowData),
          strFormData: JSON.stringify(strFormData),
          strAttachment: JSON.stringify(that.attachment)
        }
        httpAction(httpurl, qs.stringify(params1), method)
          .then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              that.$message.warning('操作失败！')
            }
          })
          .finally(() => {
            that.confirmLoading = false
            that.close()
          })
      }
    },
    onChange (value, id) {
      var lab = ''
      if (value.btnApi == '/process/save') {
        lab = '/process/save'
        this.handleSave(lab)
      } else if (value.btnApi == '/task/submit') {
        lab = '/task/submit'
        this.handleSave(lab)
      } else if (value.btnApi == '/task/audit') {
        lab = '/task/audit'
        this.handleSave(lab)
      } else if (value.btnApi == '/process/delete') {
        lab = '/process/delete'
        this.handleSave(lab)
      } else if (value.btnApi == '/task/rollback') {

      } else if ((value = 'jump')) {
        lab = '/task/rollback'
        this.handleSave(lab, id)
      }
    },
    getEntity () {
      const params = {
        entityName: this.entityName
      }
      getAction(this.url.getEntityName, params).then((res) => {
        this.processDefinitionKey = res.result
      }).finally(() => {
      })
    },
    getIndexOfPage (index) {
      const i = (this.ipagination.current - 1) * 10 + index + 1
      return i
    }
  }

}
