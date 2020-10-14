import JEditableTable from '@/components/cmp/JEditableTable'
import JEditableTableNew from '@/components/cmp/JEditableTableNew'
import { VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables, getValuesFormAndTables } from '@/utils/JEditableTableUtil'
import { httpAction, getAction, getActionUrl, downFile } from '@/api/manage'
import qs from 'qs'

export const JEditableTableMixin = {
  components: {
    JEditableTable,
    JEditableTableNew
  },
  data() {
    return {
      title: '操作',
      visible: false,
      form: this.$form.createForm(this),
      confirmLoading: false,
      model: {},
      //两栏
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      // 一栏
      labelCol1: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      arr: [], //初始化完成列表
      arr1: [], //初始化进行中列表
      commentList: [], // 审批意见列表
      currentList: 0,
      urlChart: '', // 流程图
      // 完成列表表头
      goodsColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '步骤名称',
          dataIndex: 'nodeName',
          key: 'nodeName'
        },
        {
          title: '处理人',
          dataIndex: 'assigneeFullname',
          key: 'assigneeFullname',
          align: 'center'
        },
        {
          title: '到达时间',
          dataIndex: 'startTime',
          key: 'startTime',
          align: 'center'
        },
        {
          title: '完成时间',
          dataIndex: 'endTime',
          key: 'endTime',
          align: 'center'
        },
        {
          title: '审批意见',
          dataIndex: '_taskComment',
          key: '_taskComment',
          customRender: (text, record, index) => {
            let re = ''
            if (!text) {
              re = '无意见'
            } else {
              re = text
            }
            return re
          }
        }
      ],
      // 进行列表表头
      goodsColumns1: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 80,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '步骤名称',
          dataIndex: 'nodeName',
          key: 'nodeName'
        },
        {
          title: '当前处理',
          dataIndex: 'assigneeFullname',
          key: 'assigneeFullname',
          align: 'center'
        },
        {
          title: '到达时间',
          dataIndex: 'startTime',
          key: 'startTime',
          align: 'center'
        }
      ],
    }
  },
  methods: {

    /** 获取所有的editableTable实例 */
    getAllTable() {
      if (!(this.refKeys instanceof Array)) {
        throw this.throwNotArray('refKeys')
      }
      let values = this.refKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },

    /** 遍历所有的JEditableTable实例 */
    eachAllTable(callback) {
      // 开始遍历
      this.getAllTable().then(tables => {
        tables.forEach((item, index) => {
          if (typeof callback === 'function') {
            callback(item, index)
          }
        })
      })
    },

    /** 当点击新增按钮时调用此方法 */
    add() {
      if (typeof this.addBefore === 'function') this.addBefore()
      // 默认新增空数据
      console.log(typeof this.addBefore, 'before')
      let rowNum = this.addDefaultRowNum
      if (typeof rowNum !== 'number') {
        rowNum = 1
        console.warn('由于你没有在 data 中定义 addDefaultRowNum 或 addDefaultRowNum 不是数字，所以默认添加一条空数据，如果不想默认添加空数据，请将定义 addDefaultRowNum 为 0')
      }
      this.eachAllTable((item) => {
        item.add(rowNum)
      })
      if (typeof this.addAfter === 'function') this.addAfter(this.model)
      this.edit({})
    },
    /** 当点击了编辑（修改）按钮时调用此方法 */
    edit(record) {
      if (typeof this.editBefore === 'function') {
        console.log('如果editBefore方法存在，则调用')
        this.editBefore(record)
      }
      this.visible = true
      this.activeKey = this.refKeys[0]
      console.log("activeKey = "+this.activeKey);//testMainLjgDetail1
      // 表单重置数据
      this.form.resetFields()
      // 表单填充数据
      this.model = Object.assign({}, record)
      if (typeof this.editAfter === 'function') {
        console.log('如果editAfter方法存在，则调用, 并将信息record 传入方法')
        console.log(record,'record')
        this.editAfter(record)
      }
    },
    /** 关闭弹窗，并将所有JEditableTable实例回归到初始状态 */
    close() {
      this.visible = false
      this.eachAllTable((item) => {
        item.initialize()
      })
      this.$emit('close')
      this.fileList = []
    },

    /** 查询某个tab的数据 */
    requestSubTableData(url, params, tab) {
      tab.loading = true
      getAction(url, params).then(res => {
        tab.dataSource = res.result || []
      }).finally(() => {
        tab.loading = false
      })
    },
    /** 发起请求，自动判断是执行新增还是修改操作 */
    request(formData) {
      let url = this.url.add, method = 'post'
      if (this.model.id) {
        url = this.url.action
        method = 'post' //put修改
      }
      this.confirmLoading = true
      httpAction(url, formData, method).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },

    /* --- handle 事件 --- */

    /** ATab 选项卡切换事件 */
    handleChangeTabs(key) {
      // 自动重置scrollTop状态，防止出现白屏
      getRefPromise(this, key).then(editableTable => {
        editableTable.resetScrollTop()
      })
    },
    /** 关闭按钮点击事件 */
    handleCancel() {
      this.close()
    },
    /** 确定按钮点击事件 */
    handleOk() {
      /** 触发表单验证 */
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        return validateFormAndTables(this.form, tables)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)

        // 选人控件传值
        this.uploadMan(formData,this);
        // 发起请求
        return this.request(formData)
      }).catch(e => {
        if (e.error === VALIDATE_NO_PASSED) {
          // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
          this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
        } else {
          console.error(e)
        }
      })
    },
    /* --- throw --- */
    /** not a function */
    throwNotFunction(name) {
      return `${name} 未定义或不是一个函数`
    },

    /** not a array */
    throwNotArray(name) {
      return `${name} 未定义或不是一个数组`
    },
    /* 流程按钮统一事件 */
    handle(item, id) {
      switch (item) {
        case 'submit':
          item = '/process/startAndSubmit'
          break
        case 'start':
          item = '/process/start'
          break
        case '/task/jump':
          item = null
          break
        case 'jump':
          item = '/task/rollback'
          break
      }
      this.handleAction(item, id)
    },
    // 驳回
    goBack(id) {
      this.handle('jump', id)
    },
    /* 流程按钮提交 */
    handleAction(item, id, url) {
      /** 触发表单验证 */
      this.getAllTable()
        .then(tables => {
          /** 一次性验证主表和所有的次表 */
          // 若为暂存，则不加校验
          if (item === '/process/start') {
            return getValuesFormAndTables(this.form, tables)
          } else {
            // 不是暂存，加校验
            return validateFormAndTables(this.form, tables)
          }
        })
        .then(allValues => {
          if (typeof this.classifyIntoFormData !== 'function') {
            throw this.throwNotFunction('classifyIntoFormData')
          }
          // 表单参数
          let formData = this.classifyIntoFormData(allValues)
          let strFormData = Object.assign({}, formData)
          delete strFormData.btns
          delete strFormData.processVar
          delete strFormData.rollBackAbleNodes
          delete strFormData.taskListEnd
          delete strFormData.taskListIng

          // 流程参数
          let strFlowData = {}
          if(item != null || id != null){
            strFlowData = Object.assign(
              {},
              {
                api: item,
                processDefinitionKey: this.processDefinitionKey,
                targetNodeId: id ? id : null,
                taskId: formData.taskId
              }
            )
          }

          // 选人控件
          this.uploadMan(strFormData,this);
          // 上传组件
          if(this.attachment && this.attachment.length > 0){
            for (let i = 0; i<this.attachment.length; i++) {
              strFormData.attachment = this.attachment[i].groupId
            }
          }
          
          // 参数汇合
          let data = {}
          data.strFlowData = JSON.stringify(strFlowData)
          data.strFormData = JSON.stringify(strFormData)
          data.strAttachment = JSON.stringify(this.attachment)
          // 转换data格式
          data = qs.stringify(data)
          
          // 发起请求
          return this.request1(data, url)
        })
        .catch(e => {
          if (e.error === VALIDATE_NO_PASSED) {
            // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
            this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
          } else {
            console.error(e)
          }
        })
    },
    /* 发起请求 */
    request1(data, Editurl) {
      let url = ''
      if(Editurl){
        url = Editurl
      }else{
        url = this.url.action
      }
      let method = 'post' //put修改

      this.confirmLoading = true
      httpAction(url, data, method)
        .then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    loadGoodsData() {
      var that = this
      return new Promise(resolve => {
        resolve({
          data: that.arr
        })
      }).then(res => {
        return res
      })
    },
    loadGoodsData1() {
      var that = this
      return new Promise(resolve => {
        resolve({
          data: that.arr1
        })
      }).then(res => {
        return res
      })
    },
    // 初始化流程图和审批意见列表
    initChartAndComment(that, record, chartUrl, taskCommentUrl) {
      if (JSON.stringify(record) !== '{}') {
        let params = {
          id: that.model.id
        }
        let httpGetUrlC = chartUrl
        let httpGetUrlTc = taskCommentUrl
        // 获取流程图
        getActionUrl(httpGetUrlC, params)
          .then(res => {
            that.urlChart =
              'data:image/png;base64,' +
              btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          })
          .finally(() => {
            // that.confirmLoading = false;
            // that.close();
          })
        // 获取意见列表
        getAction(httpGetUrlTc, { id: that.model.id })
          .then(res => {
            that.commentList = res.result.taskListEnd.concat(res.result.taskListIng)
            that.currentList = res.result.taskListEnd.length - 1

            that.finishedList = Object.assign(res.result.taskListEnd)
            that.unfinishedList = Object.assign(res.result.taskListIng)

            // 渲染流程图tab中的数据列表
            that.arr.length = 0
            that.arr1.length = 0

            for (let i in that.finishedList) {
              that.arr.push(that.finishedList[i])
            }
            for (let i in that.unfinishedList) {
              that.arr1.push(that.unfinishedList[i])
            }
          })
          .finally(() => {})
      } else {
        let params = {
          processDefinitionKey: this.processDefinitionKey
        }
        that.arr.length = 0
        that.arr1.length = 0
        let httpGetUrlC = that.url.chart
        getActionUrl(httpGetUrlC, params)
          .then(res => {
            this.urlChart =
              'data:image/png;base64,' +
              btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          })
          .finally(() => {
            // that.confirmLoading = false;
            // that.close();
          })
      }
    },
    // 下载预览函数
    handlePreview(file) {
      let fileArray = file.name.split(".");
      let fileName = fileArray[0];
      let fileType = fileArray[1];
      if (file.type == "image/jpeg") {
        if (file.url || file.thumbUrl) {
          this.previewImage = file.url || file.thumbUrl
        } else {
          this.previewImage = this.getIdCardView();
        }
        this.previewVisible = true
      } else {
        downFile(this.url.fileDownLoad,{id: file.response.result.fileTokens}).then((data)=>{
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName + '.' + fileType )
          }else{
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.' + fileType )
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          }
        })
      }
    },
    // 上传组件改变回调Mixin
    handleChangeMixin(info,that,k) {
      if (info.file.status === 'removed') {
        that.attachment[k].fileTokens = that.attachment[k].fileTokens.replace(info.file.response.result.fileTokens + ',',"");
      }
      that.fileList = info.fileList;
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response;
        if (response.success) {
          if (that.attachment[k].fileTokens == '') {
            that.attachment[k].fileTokens += response.result.fileTokens;
          } else {
            that.attachment[k].fileTokens += "," + response.result.fileTokens;
          }
        } else {
          that.$message.warning(response.message);
        }
      }
    },
    // 选人控件回传值
    setAuditUser(val){    //val:{ colum:'' , target   ,value }
      for(var i=0;i<this[val.colum].target.length;i++){
        this[this[val.colum].target[i].to] = val.value[this[val.colum].target[i].from];
        if (i == 0) {
          let keys = this[val.colum].target[i].to;
          this.form.setFieldsValue({
            [keys]: val.value[this[val.colum].target[i].from]
          })
        }
      }
    },
    // 初始化选人
    initSelectMan(that,record) {
      if (JSON.stringify(record) !== "{}") {
        for(var i=0;i<that.selectUser.length;i++){
          var flag=1;
          var selectValue=[];
          var selectColum=[];
          for(var j=0;j<that[that.selectUser[i]].target.length;j++){
            if(that.model[that[that.selectUser[i]].target[j].to]==''){
              flag=0;
              break;
            }else{
              selectValue.push(that.model[that[that.selectUser[i]].target[j].to]);
              selectColum.push(that[that.selectUser[i]].target[j].from);
            }
          }
          if (flag) {
            that[that.selectUser[i]].value = that.initSelect(selectColum,selectValue);
            if (that[that.selectUser[i]].value == undefined) {
              that[that.selectUser[i]].value = [];
            }
          }
        }
      }
    },
    // 初始化选人组件
    initSelect(col,val) {
      if (val[0] != null) {
        var arr2=[];
        for(var i=0;i<val[0].split(',').length;i++ ) {
          var item = {};
          for (var j = 0; j < col.length; j++) {
            this.$set(item, col[j], val[j].split(',')[i]);
          }
          arr2.push(item);
        }
        return arr2;
      }
    },
    // 初始化上传组件
    initUpload(that,k){
      if (that.model.attachment !== undefined) {
        if (that.model.attachment == null || that.model.attachment == '') {
          that.attachment[k].groupId = that.uuid();
        } else {
          that.attachment[k].groupId = that.model.attachment;
        }
        that.attachment[k].fileTokens = '';
        getAction(that.url.fileFind,{groupId: that.model.attachment}).then((res)=>{
          for (let i = 0;i < res.result.length; i++) {
            if (res.result[i].uploadFile.savePath.substring(res.result[i].uploadFile.savePath.length-4) == 'jpeg' || res.result[i].uploadFile.savePath.substring(res.result[i].uploadFile.savePath.length-3) == 'jpg' || res.result[i].uploadFile.savePath.substring(res.result[i].uploadFile.savePath.length-3) == 'png') {
              let fileChild = {
                response: {
                  result: {
                    fileTokens: res.result[i].fileToken
                  }
                },
                uid: i,
                name: res.result[i].uploadFile.fileName,
                status: 'done',
                type: 'image/jpeg',
                url: that.url.imgerver + "/" + res.result[i].uploadFile.savePath
              };
              that.fileList.push(fileChild);
              that.attachment[k].fileTokens += res.result[i].fileToken + ','
            } else {
              let fileChild = {
                response: {
                  result: {
                    fileTokens: res.result[i].fileToken
                  }
                },
                uid: i,
                name: res.result[i].uploadFile.fileName,
                status: 'done',
                type: 'text/plain',
                url: that.url.imgerver + "/" + res.result[i].uploadFile.savePath
              };
              that.fileList.push(fileChild);
              that.attachment[k].fileTokens += res.result[i].fileToken + ','
            }
          }
        })
      } else {
        that.attachment[k].groupId = that.uuid();
        that.attachment[k].fileTokens = '';
      }
    },
    // 选人控件数据传入提交参数
    uploadMan(strFormData,that) {
      if(that.selectUser && that.selectUser.length > 0){
        for(var i=0;i<that.selectUser.length;i++){
          var flag=1;
          for(var j=0;j<that[that.selectUser[i]].target.length;j++){
            if(that[that[that.selectUser[i]].target[j].to]==''){
              flag=0;
              break;
            }else{
              strFormData[[that[that.selectUser[i]].target[j].to]] = that[that[that.selectUser[i]].target[j].to];
            }
          }
        }
        return strFormData;
      }
    },
    // 生成UUid  上传附件时给后端groupid
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      // s[8] = s[13] = s[18] = s[23] = "-";
      s[8] = s[13] = s[18] = s[23] = "";
      var uuid = s.join("");
      return uuid;
    },
  }
}