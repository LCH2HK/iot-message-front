<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-sider
        width="400px"
        theme="light"
        collapsedWidth="0"
        :trigger="null"
        collapsible
        style="margin-right: 10px;overflow-x: auto"
      >
        <a-directory-tree @select="onSelect" @expand="onExpand">
          <a-tree-node v-for="moduleName in apiArr" :key="moduleName[0]" :title="moduleName[0]">
            <a-tree-node v-for="api in moduleName[1]" :key="api.path" :title="api.summary"> </a-tree-node>
          </a-tree-node>
        </a-directory-tree>
      </a-layout-sider>

      <a-layout-content>
        <!-- 操作按钮区域 -->
        <!-- table区域-begin -->
        <div>
          <a-row>
            <a-col :md="2" :sm="4">
              <a-select :value="requestMethod" style="width: 90px" @change="handleChange" size="large">
                <a-select-option value="post">POST</a-select-option>
                <a-select-option value="get">GET</a-select-option>
                <a-select-option value="put">PUT</a-select-option>
                <a-select-option value="delete">DELETE</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="20" :sm="16">
              <a-input-search
                placeholder
                :value="finalUrl"
                @search="onSearch"
                enterButton="发送"
                size="large"
              />
            </a-col>
            <a-col :md="2" :sm="4">
              &nbsp;&nbsp;&nbsp;&nbsp;<a-button size="large" @click="handleReset">重置</a-button>
            </a-col>
          </a-row>

          <a-tabs defaultActiveKey="2">
            <a-tab-pane tab="请求参数" key="1" forceRender>
              <j-editable-table-new
                ref="paramsTable"
                :loading="paramsTable.loading"
                :columns="paramsTable.columns"
                :dataSource="paramsTable.dataSource"
                :maxHeight="300"
                :rowNumber="true"
                :readOnly="isReadOnly"
                :rowSelection="!isReadOnly"
                :actionButton="!isReadOnly"
                @valueChange="getParams"
                @added="getParams"
                @deleted="getParams"
              >
                <template v-slot:action="props">
                  <a-tag v-if="props.text == 0" color="green">选填</a-tag>
                  <a-tag v-if="props.text == 1" color="red">必填</a-tag>
                </template>
              </j-editable-table-new>
            </a-tab-pane>
            <a-tab-pane tab="请求头" key="2" forceRender>
              <j-editable-table-new
                ref="headersTable"
                :loading="headersTable.loading"
                :columns="headersTable.columns"
                :dataSource="headersTable.dataSource"
                :maxHeight="300"
                :rowNumber="true"
                :readOnly="isReadOnly"
                :rowSelection="!isReadOnly"
                :actionButton="!isReadOnly"
                @valueChange="getHeaders"
                @added="getHeaders"
                @deleted="getHeaders"
              >
                <template v-slot:action="props">
                  <a-tag v-if="props.text == 0" color="green">选填</a-tag>
                  <a-tag v-if="props.text == 1" color="red">必填</a-tag>
                </template>
              </j-editable-table-new>
            </a-tab-pane>
            <a-tab-pane tab="请求体" key="3" forceRender>
              <j-editable-table-new
                ref="bodyTable"
                :loading="bodyTable.loading"
                :columns="bodyTable.columns"
                :dataSource="bodyTable.dataSource"
                :maxHeight="300"
                :rowNumber="true"
                :readOnly="isReadOnly"
                :rowSelection="!isReadOnly"
                :actionButton="!isReadOnly"
                @valueChange="getBody"
                @added="getBody"
                @deleted="getBody"
              >
                <template v-slot:action="props">
                  <a-tag v-if="props.text == 0" color="green">选填</a-tag>
                  <a-tag v-if="props.text == 1" color="red">必填</a-tag>
                </template>
              </j-editable-table-new>
            </a-tab-pane>
            <a-tab-pane tab="请求预览" key="4" forceRender>
              <div class="query-view-content">
                <span class="tag-title">基本信息</span>
                <span>请求路径：{{ url }}</span>
                <span>请求方法：{{ requestMethod }}</span>
                <span>接口作用：{{ apiDescription }}</span>
                <hr />
                <span class="tag-title">请求参数</span>
                <div v-for="entry in Object.entries(this.params)">
                  <span>{{ entry[0] }}:</span>{{ entry[1] }}
                </div>
                <hr />
                <span class="tag-title">请求头</span>
                <div v-for="entry in Object.entries(this.headers)">
                  <span>{{ entry[0] }}:</span>{{ entry[1] }}
                </div>
                <hr />
                <span class="tag-title">请求体</span>
                <div v-for="entry in Object.entries(this.body)">
                  <span>{{ entry[0] }}:</span>{{ entry[1] }}
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>

          <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="响应" key="1">
              <pre contenteditable="true">{{response}}</pre>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-content>
    </a-layout>
    <!-- table区域-end -->
    <!-- 表单区域 -->
  </a-card>
</template>

<script>
import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
import { FormTypes } from '@/utils/JEditableTableUtil'
import { getAction, httpActionHeader2 } from '@/api/manage'
import JLeftTree from '@/components/cmp/JLeftTree'
import JInputLk from '@/components/cmp/JInputLk'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import JCodeEditor from '@/components/cmp/JCodeEditor'

export default {
  name: 'onlineApi',
  mixins: [JEditableTableMixin],
  components: {
    JLeftTree,
    JInputLk,
    JCodeEditor
  },
  data () {
    return {
      // header: {},
      hostIp: '10.215.48.57',
      // hostIp: 'localhost',
      description: 'API接口调试页面',
      map: new Map(), // 模块名到该模块内各接口的映射
      apiArr: {}, // map对象使用[...map]方法转换得到的数组
      paths: {},
      dataServiceUrl: '',
      confirmLoading: false,
      // 所有要展示的模块
      not_filtered: new Set(['设备历史数据', '设备实时数据', '设备信息表', '获取token']),
      // 属于平台的模块
      baseApiSet: new Set(['设备信息表', '获取token']),
      // 要额外去除的api
      filteredSet: new Set(['/history/historyDeviceData/historyDataForAlias555']),

      apiDescription: '',

      moduleIndex: '',
      apiIndex: '',
      entities: {},

      url: '',
      finalUrl: '',
      paramJson: '',
      resultJson: {},
      requestMethod: 'POST',

      apiUrl: '/v2/api-docs?group=data',
      tokenApiUrl: '/v2/api-docs?group=token',

      params: {},
      headers: {},
      body: {},
      response: '暂无返回值',

      missingParam: {
        param: [],
        header: [],
        body: []
      },

      isReadOnly: false, // 默认只读，点击编辑，修改

      paramsTable: {
        loading: false,
        dataSource: [],
        // dataSourceBak: [],
        columns: [
          {
            title: 'key',
            key: 'key',
            type: FormTypes.input,
            defaultValue: '',
            width: '10%',
            // eslint-disable-next-line no-template-curly-in-string
            placeholder: '请输入${title}',
            disabled: true,
            validateRules: [
              {
                required: true, // 必填
                // eslint-disable-next-line no-template-curly-in-string
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^.{2,20}$/, // 正则
                // eslint-disable-next-line no-template-curly-in-string
                message: '${title}不可少于2或多于20字'
              }
            ]
          },
          {
            title: 'value',
            key: 'value',
            width: '32%',
            type: FormTypes.input,
            defaultValue: '',
            // eslint-disable-next-line no-template-curly-in-string
            placeholder: '请输入对应${title}'
          },
          {
            title: '是否必填',
            key: 'isRequired',
            width: '8%',
            type: FormTypes.slot,
            defaultValue: '1',
            disabled: true,
            slotName: 'action'
          },
          {
            title: '含义',
            key: 'description',
            width: '10%',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true
          },
          {
            title: '示例',
            key: 'demo',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true,
            width: '32%'
          }
        ]
      },

      headersTable: {
        loading: false,
        dataSource: [],
        // dataSourceBak: [],
        columns: [
          {
            title: 'key',
            key: 'key',
            type: FormTypes.input,
            defaultValue: '',
            width: '10%',
            // eslint-disable-next-line no-template-curly-in-string
            placeholder: '请输入${title}',
            disabled: true,
            validateRules: [
              {
                required: true, // 必填
                // eslint-disable-next-line no-template-curly-in-string
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^.{2,20}$/, // 正则
                // eslint-disable-next-line no-template-curly-in-string
                message: '${title}不可少于2或多于20字'
              }
            ]
          },
          {
            title: 'value',
            key: 'value',
            type: FormTypes.input,
            defaultValue: '',
            width: '32%',
            // eslint-disable-next-line no-template-curly-in-string
            placeholder: '请输入对应${title}'
          },
          {
            title: '是否必填',
            key: 'isRequired',
            type: FormTypes.slot,
            width: '8%',
            defaultValue: '1',
            disabled: true,
            slotName: 'action'
          },
          {
            title: '含义',
            key: 'description',
            type: FormTypes.input,
            defaultValue: '',
            width: '10%',
            disabled: true
          },
          {
            title: '示例',
            key: 'demo',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true,
            width: '32%'
          }
        ]
      },

      bodyTable: {
        loading: false,
        dataSource: [],
        // dataSourceBak: [],
        columns: [
          {
            title: 'key',
            key: 'key',
            type: FormTypes.input,
            defaultValue: '',
            width: '10%',
            // eslint-disable-next-line no-template-curly-in-string
            placeholder: '请输入${title}',
            disabled: true,
            validateRules: [
              {
                required: true, // 必填
                // eslint-disable-next-line no-template-curly-in-string
                message: '请输入${title}' // 显示的文本
              },
              {
                pattern: /^.{2,20}$/, // 正则
                // eslint-disable-next-line no-template-curly-in-string
                message: '${title}不可少于2或多于20字'
              }
            ]
          },
          {
            title: 'value',
            key: 'value',
            type: FormTypes.input,
            defaultValue: '',
            width: '32%',
            // eslint-disable-next-line no-template-curly-in-string
            placeholder: '请输入对应${title}'
          },
          {
            title: '是否必填',
            key: 'isRequired',
            type: FormTypes.slot,
            defaultValue: '1',
            disabled: true,
            width: '8%',
            slotName: 'action'
          },
          {
            title: '含义',
            key: 'description',
            type: FormTypes.input,
            defaultValue: '',
            width: '10%',
            disabled: true
          },
          {
            title: '示例',
            key: 'demo',
            type: FormTypes.input,
            defaultValue: '',
            disabled: true,
            width: '32%'
          }
        ]
      }
    }
  },
  computed: {
    dataApi () {
      return `${this.projectMsg.dataServiceUrl}${this.apiUrl}`
    }
  },
  created () {
    // this.projectMsg = Vue.ls.get('PROJECT_MESSAGE')
    this.projectMsg = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE'))
    console.log('loginApi==>', this.loginApi)
    console.log('projectMsg==>', this.projectMsg)
    this.dataServiceUrl = this.projectMsg.dataServiceUrl
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token, 'api-version': 'V1' }
    this.not_filtered.forEach(moduleName => {
      this.map.set(moduleName, [])
    })
    this.loadData(this.dataApi)
    this.loadData(this.apiUrl)
    this.loadData(this.tokenApiUrl)
    this.apiArr = [...this.map]
    console.log('this.apiArr', this.apiArr)
  },
  methods: {

    onSearch (url) {
      console.log('this.params', this.params)
      console.log('this.headers', this.headers)
      console.log('this.body', this.body)
      console.log('send按钮，value=>', url)
      // 判断必填项是否填写   TODO
      // if (
      //   this.missingParam.param.length !== 0 ||
      //   this.missingParam.body.length !== 0 ||
      //   this.missingParam.header.length !== 0
      // ) {
      //   this.$message.warning('缺少必填项：' + JSON.stringify(this.missingParam))
      //   return
      // }
      const that = this
      httpActionHeader2(that.finalUrl, that.body, that.requestMethod, that.headers).then(res => {
        console.log('res==>', res)
        this.response = res
        if (res.success) {
          that.$message.success(res.message)
        } else {
          that.$message.warning('操作失败！')
        }
      })
    },

    changeVal (e) {
      try {
        let json = e.target.value
        json = json.replace(/\n/g, '')
        json = json.replace(/\s*/g, '')
        if (json.indexOf(',}') > 0) {
          json = json.replace(',}', '}')
        }
        this.paramJson = JSON.parse(json)
      } catch (e) {
        console.log(e)
        this.$message.error('非法的JSON字符串')
      }
    },
    handleChange (value) {
      this.requestMethod = value
    },
    onSelect (keys, event) {
      const nodePos = event.node.pos
      // 被点击的节点是具体的api时，nodePos的正则
      const apiRegex = /^\d+-\d+-\d+$/g
      // 被点击的是api节点时，才进行处理
      if (apiRegex.test(nodePos) === true) {
        console.log('是api')
        const firstSlash = nodePos.indexOf('-')
        const lastSlash = nodePos.lastIndexOf('-')
        // 模块下标
        this.moduleIndex = nodePos.substring(firstSlash + 1, lastSlash)
        // api在其模块内的下标
        this.apiIndex = nodePos.substring(lastSlash + 1)
        // 将Map对象转换成数组，方便按下标取值
        const modules = [...this.map.values()]
        const api = modules[this.moduleIndex][this.apiIndex]
        this.apiDescription = api.description
        // 清除旧接口数据
        this.clearOld()
        // 回填表格
        this.fillTable(api)
        // 回填地址栏
        this.finalUrl = this.url
      }
    },
    // 清除旧的参数
    clearOld () {
      this.params = {}
      this.headers = {}
      this.body = {}
      this.missingParam.param = []
      this.missingParam.header = []
      this.missingParam.body = []
    },
    // 使用api接口的信息回调到表格
    fillTable (apiInfo) {
      console.log('into fillTable')
      // 回填之前先清除之前的数据源
      this.paramsTable.dataSource = []
      this.headersTable.dataSource = []
      this.bodyTable.dataSource = []
      this.requestMethod = apiInfo.method
      const moduleName = apiInfo.tags[0]
      // 过滤请求地址
      if (this.baseApiSet.has(moduleName)) {
        // 平台接口
        // TODO: 暂时只展示菜单路径
        this.url = apiInfo.path
      } else {
        // 数据服务端接口
        this.url = this.dataServiceUrl + apiInfo.path
      }
      // console.log('api==>', apiInfo)
      apiInfo.parameters.forEach(param => {
        switch (param.in) {
          case 'header':
            this.fillHeadersTable(param)
            break
          case 'query':
            this.fillParamsTable(param)
            break
          case 'body':
            this.fillBodyTable(param)
            break
        }
      })
      this.bodyTable.dataSource = this.sortTable(this.bodyTable.dataSource)
      this.paramsTable.dataSource = this.sortTable(this.paramsTable.dataSource)
      this.headersTable.dataSource = this.sortTable(this.headersTable.dataSource)
    },
    fillParamsTable (param) {
      this.paramsTable.dataSource.push({
        id: param.name,
        key: param.name,
        isRequired: param.required ? 1 : 0,
        description: param.description,
        demo: param.default
      })
    },
    fillHeadersTable (param) {
      this.headersTable.dataSource.push({
        id: param.name,
        key: param.name,
        isRequired: param.required ? 1 : 0,
        description: param.description,
        demo: param.default
      })
    },
    fillBodyTable (param) {
      // str="#/definitions/paramsBody5"
      console.log('param==>', param)
      const str = param.schema.$ref
      const entityName = str.substring(str.lastIndexOf('/') + 1)
      const entity = this.entities[entityName]
      console.log('entity=>', entity)
      const required = new Set(entity.required)
      for (const prop in entity.properties) {
        this.bodyTable.dataSource.push({
          id: prop,
          key: prop,
          isRequired: required.has(prop) ? 1 : 0,
          description: entity.properties[prop].description,
          demo: this.isObject(entity.properties[prop].example)
            ? JSON.stringify(entity.properties[prop].example)
            : entity.properties[prop].example
        })
      }
    },

    isObject (param) {
      return param instanceof Object || param instanceof Array
    },
    getParams () {
      this.params = {}
      this.missingParam.param = []
      const that = this
      let queryParam = ''
      this.finalUrl = this.url
      // console.log('this.$refs==>', this.$refs)
      this.$refs.paramsTable.getValues((err, params) => {
        // console.log('请求参数表==>', params)
        params.forEach(param => {
          if (param.value !== null && param.value !== '') {
            that.params[param.key] = param.value
            queryParam = queryParam.concat(param.key, '=', param.value, '&')
          } else {
            if (param.isRequired === 1) {
              this.missingParam.body.push(param.key)
            }
          }
        })
      })
      if (queryParam !== '') {
        this.finalUrl = this.finalUrl.concat('?', queryParam.substring(0, queryParam.length - 1))
      }
    },
    getHeaders () {
      this.headers = {}
      this.missingParam.header = []
      // console.log('this.$refs==>', this.$refs)
      this.$refs.headersTable.getValues((err, headers) => {
        // console.log('请求头表==>', headers)
        headers.forEach(header => {
          if (header.value !== null && header.value !== '') {
            this.headers[header.key] = header.value
          } else {
            if (header.isRequired === 1) {
              this.missingParam.body.push(header.key)
            }
          }
        })
      })
    },
    getBody () {
      this.body = {}
      // console.log('into getBody==>')
      this.missingParam.body = []
      // console.log('this.$refs==>', this.$refs)
      this.$refs.bodyTable.getValues((err, body) => {
        // console.log('请求体表==>', body)
        body.forEach(val => {
          if (val.value !== null && val.value !== '') {
            // this.body[val.key]=JSON.parse(val.value)
            this.body[val.key] = val.value
          } else {
            if (val.isRequired === 1) {
              this.missingParam.body.push(val.key)
            }
          }
        })
      })
    },
    onExpand () {
      // console.log('Trigger Expand')
    },
    onLoadData (treeNode) {
      console.log('treeNode==>', treeNode)
    },

    // 请求接口
    loadData (url) {
      const that = this
      getAction(url, {}).then(res => {
        if (res) {
          that.paths = res.paths
          // 预处理返回结果，得到模块名到该模块内各个接口的映射
          console.log('res==>', res)
          const paths = res.paths
          for (const path in paths) {
            console.log('path==>', path)
            if (that.filteredSet.has(path)) {
              continue
            }
            // 一个API接口
            const api = paths[path]
            // 请求方法
            const method = Object.keys(api)[0]
            // 模块名
            const moduleName = api[method].tags[0]
            if (this.not_filtered.has(moduleName)) {
              const obj = Object.assign({}, api[method])
              obj.method = method
              obj.path = path
              this.map.get(moduleName).push(obj)
            }
          }
          // that.entities.push(res.definitions)
          that.entities = Object.assign(that.entities, res.definitions)
        }
      })
      console.log('map', this.map)
    },
    // 将表格的各行按下列规则排序：
    //  1、必填项放在选填项后面
    //  2、用户名放在密码上面
    sortTable (dataSource) {
      let group = [[], [], []]
      dataSource.forEach(a => {
        if (a.key === 'username' || a.key === 'password') {
          group[0].push(a)
        } else if (a.isRequired === 1) {
          group[1].push(a)
        } else {
          group[2].push(a)
        }
      })
      group[0].sort((a, b) => {
        if (a.key.toLocaleLowerCase() == 'username') {
          return -1
        }
      })
      let id = 1
      let sortedDataSource = []
      group.forEach(arr => {
        arr.forEach(item => {
          item.id = id++
          sortedDataSource.push(item)
        })
      })
      console.log(sortedDataSource)
      return sortedDataSource
    },
    handleReset () {
      // 清除旧接口数据
      console.log(Vue.ls)
      this.clearOld()
      // 回填表格
      // 将Map对象转换成数组，方便按下标取值
      const modules = [...this.map.values()]
      const api = modules[this.moduleIndex][this.apiIndex]
      this.fillTable(api)
      // 回填地址栏
      this.finalUrl = this.url
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
@import '~@views/iot/css/iotCommon.less';

.right-button {
  margin-left: auto;
  height: 36px;

  .default-button {
    height: 36px;
    margin-right: 0px;
    margin-left: 6px;
  }
}

.search-buttons-content {
  position: absolute;
  margin-right: 16px;
  right: -4px;
}

.query-view-content {
  display: flex;
  flex-direction: column;
  .tag-title {
    font-size: 15px;
    font-weight: 600;
  }
}
/deep/.ant-card-body {
  padding: 16px 16px;
}
</style>
