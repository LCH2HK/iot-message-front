<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <span class="serachRight" v-if="toggleSearchStatus">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
          </span>
          <a-col :md="5" :sm="8">
            <a-form-item label="标题">
              <j-input-lk
                :placeholder="'请输入标题'"
                @enterSearch="enterSearch($event,'title')"
                @inputValueLk="inputValueLk($event,'title')"
                ref="ResetLk"
              ></j-input-lk>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="发布部门名称">
              <j-input-lk
                :placeholder="'请输入标题'"
                @enterSearch="enterSearch($event,'informationDeptname')"
                @inputValueLk="inputValueLk($event,'informationDeptname')"
                ref="ResetLk"
              ></j-input-lk>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
            <a-col :md="5" :sm="8">
              <a-form-item label="信息状态">
                <j-dict-select-tag
                  v-model="queryParam.informationStatus"
                  placeholder="请选择信息状态"
                  dictCode="public_information"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="发布时间">
                <a-date-picker
                  v-model="queryParam.minStartTime"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="至">
                <a-date-picker
                  v-model="queryParam.maxEndTime"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="4" :sm="8" v-if="!toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
          <a-col :md="2" :sm="8" v-if="toggleSearchStatus">
            <span class="table-page-search-submitButtons serachLeft">
              <a @click="handleToggleSearch">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary">
        <router-link tag="a" target="_blank" :to="{path:'/text_edit'}">新增</router-link>
      </a-button>
      <a-button type="primary">
        <router-link
          tag="a"
          target="_blank"
          :to="{path:'/public_information',query:{info:JSON.stringify(selectedObject) }}"
        >查看</router-link>
      </a-button>
      <a-button type="primary" @click="withdraw(selectedRowKeys)">撤下</a-button>
      <a-button icon="reload" @click="searchReset" type="primary">刷新</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: 'radio'}"
        @change="handleTableChange"
      >
        <!-- :customRow="click" -->
        <span slot="action" slot-scope="text, record">
          <a>
            <router-link
              tag="a"
              target="_blank"
              :to="{path:'/text_edit', query:{text: JSON.stringify(record)}}"
            >编辑</router-link>
          </a>

          <a-divider type="vertical" />
          <a @click.stop="handleDelete(record.id)">删除</a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { deleteAction } from '@/api/manage'
import { httpAction } from '@api/manage'
import qs from 'qs'
import moment from 'moment'
import JInputLk from '@/components/cmp/JInputLk.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PublicInformationList',
  mixins: [CmpListMixin],
  components: {
    JInputLk
  },
  data() {
    return {
      selectedObject: {},
      selectedRowKeys: [],
      selectKey: [],
      description: '公共信息发布管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '标题',
          align: 'left',
          dataIndex: 'title'
        },
        {
          title: '发布部门名称',
          align: 'center',
          dataIndex: 'informationDeptname'
        },

        {
          title: '发布日期',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '发布人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'informationStatus'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/publicInformation/publicInformation/list',
        delete: '/publicInformation/publicInformation/delete',
        deleteBatch: '/publicInformation/publicInformation/deleteBatch',
        exportXlsUrl: 'publicInformation/publicInformation/exportXls',
        importExcelUrl: 'publicInformation/publicInformation/importExcel',
        //文件下载
        fileDownLoad: '/file/uploadFile/downloadFileById',
        queryById: 'publicInformation/publicInformation/queryById',
        //更改状态
        withdrawById: 'publicInformation/publicInformation/withdraw'
      },
      userIcons: ''
    }
  },
  watch: {
    listRefresh: function() {
      //li就是改变后的wifiList值
      console.log("aaaaaaa")
      this.searchReset();
    }
  },
  computed: {
    ...mapGetters(['listRefresh'])
  },
  beforeCreate() {
    // 自行定义方法，引用字典
    //初始化字典
    initDictOptions('bpm_status').then(res => {
      if (res.success) {
        this.statusDictOptions = res.result
      }
    })
    initDictOptions('leave_type').then(res => {
      if (res.success) {
        this.leaveDictOptions = res.result
      }
    })
  },
  methods: {
    withdraw(selectedRowKeys) {
      let that = this
      let method = 'post'
      let params = { id: selectedRowKeys[0] }
      httpAction(this.url.withdrawById, qs.stringify(params), method).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          that.loadData()
        } else {
          that.$message.warning('操作失败！')
        }
      })
    },
    //删除
    handleDelete: function(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '是否删除选中数据?',
        onOk: function() {
          deleteAction(that.url.delete, { id: id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning('操作失败')
            }
          })
        }
      })
    },
    //根据id查询数据
    handleLook(id) {
      const that = this
      that.axios.get(that.url.queryById, {
        params: {
          id: id
        }
      })
    },
    clickThenCheck(record) {
      return {
        on: {
          // 事件
          //点击行
          click: () => {
            this.onSelectChange(record.id.split(','), [record])
          }
        }
      }
    },
    onSelectChange(selectedRowKeys, index) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedObject = index[0]
      this.disable = false
    },
    click(record, index) {
      console.log('---------------------->', record)
      return {
        on: {
          click: () => {
            const { href } = this.$router.push({
              name: 'PublicInformation',
              params: {
                info: JSON.stringify(record)
              }
            })
            window.open(href, '_blank')
          }
        }
      }
    }
  },
  created() {
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
</style>