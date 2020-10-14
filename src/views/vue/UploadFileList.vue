<template>
  <div class="onlineDocument">
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :md="5" :sm="24">
          <a-row>
            <a-col :span="16">
              <span class="page-title">在线文档</span>
            </a-col>
            <a-col :span="8">
              <!-- 新增按钮-开始 -->
              <span class="file-add">
                <!-- （部门）： -->
                <a-dropdown :trigger="['click']" v-if="newDepartBtn" placement="bottomCenter">
                  <a-menu slot="overlay">
                    <a-menu-item key="021" @click="handleAdd('docx')">
                      <a-icon type="file-word" :style="{ fontSize: '17px',color:'#0188fb' }" />新建文档
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="022" @click="handleAdd('xlsx')">
                      <a-icon type="file-excel" :style="{ fontSize: '17px',color:'#02ca75' }" />新建表格
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="01" @click="handleAddFolder">
                      <a-icon type="folder" :style="{ fontSize: '17px',color:'#00beff' }" />新建文件夹
                    </a-menu-item>
                    <a-menu-divider />
                    <!-- 直接上传文件 -->
                    <a-menu-item key="04">
                      <a-upload
                        :action="uploadAction"
                        :showUploadList="false"
                        :headers="headers"
                        :fileList="fileList"
                        :beforeUpload="beforeUpload"
                        @change="handleChange"
                        class="upload-list-inline"
                        v-decorator="[
                          'attachment',
                          {rules: [{ required: true, message: '请上传文件！' }]}]"
                      >
                        <span>
                          <a-icon type="upload" :style="{ fontSize: '17px',color:'#ff6935' }" />&nbsp;上传文档
                        </span>
                      </a-upload>
                    </a-menu-item>
                  </a-menu>
                  <a-button type="primary" size="large" :disabled="disabled">
                    <a-icon type="plus" :style="{ fontSize: '17px' }" />新建
                  </a-button>
                </a-dropdown>
              </span>
            </a-col>
          </a-row>
          <!-- 新增按钮-结束 -->
          <!-- 侧边菜单-开始 -->
          <div class="content-submenu">
            <!-- 目录树-开始 -->
            <!-- 我的文档树： -->
            <a-directory-tree
              selectable
              :defaultExpandParent="aa"
              :defaultExpandAll="aa"
              :selectedKeys="tSelectedKeys"
              :defaultSelectedKeys="tDefaultSelectedKeys"
              @select="onSelect"
              @expand="onExpand"
              :expandedKeys="tExpandedKeys"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="departTree1"
            />
            <!-- 部门文档树： -->
            <a-directory-tree
              selectable
              :defaultExpandParent="aa"
              :defaultExpandAll="aa"
              :selectedKeys="tSelectedKeys"
              @select="onSelect"
              @expand="onExpand"
              :expandedKeys="tExpandedKeys"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="departTree"
            />
            <!-- 目录树-结束 -->
            <!-- 加载列表相关菜单-开始 -->
            <a-menu
              :defaultSelectedKeys="defaultSelectedKeys"
              :selectedKeys="mSelectedKeys"
              type="inner"
            >
              <a-menu-divider />
              <a-menu-item key="21" @click="loadSharedList">
                <a-icon type="share-alt" />与我共享
              </a-menu-item>
              <a-menu-item key="22" @click="loadSharingList">
                <a-icon type="share-alt" />我的分享
              </a-menu-item>
              <!-- <a-menu-divider /> -->
              <a-menu-item key="23" @click="loadViewRecord">
                <a-icon type="clock-circle" />最近浏览
              </a-menu-item>
              <a-menu-item key="24" class="starDoc" @click="loadCollectFile">
                <a-icon type="star" />我的收藏
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="25" @click="loadRecycleBinFile">
                <a-icon type="delete" />回收站
              </a-menu-item>
            </a-menu>
            <!-- 加载列表相关菜单-结束 -->
          </div>
          <!-- 侧边菜单-结束 -->
        </a-col>
        <a-col :md="1">
          <div class="vertical-line"></div>
        </a-col>
        <!-- 表单查询及列表区域-开始 -->
        <a-col :md="18" :sm="24">
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper" v-show="tSelectedKeys.length>0">
            <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :md="8" :sm="10">
                  <a-form-item label="文件名">
                    <a-input placeholder="请输入文件名" v-model="queryParam.fileName"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="10">
                  <a-form-item label="创建者">
                    <a-input placeholder="请输入创建者姓名" v-model="queryParam.creatorRealname"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="8">
                  <span
                    style="float: left;overflow: hidden;"
                    class="table-page-search-submitButtons"
                  >
                    <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                    <a-button
                      type="primary"
                      @click="searchReset"
                      icon="reload"
                      style="margin-left: 8px"
                    >重置</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <!-- 标题 -->
          <div class="listTitle">{{currentList}}</div>
          <div class="table-details">
            <!-- 操作按钮区域 -->
            <div class="table-operator">
              <!-- 批量操作区域-开始 -->
              <a-dropdown
                v-if="(selectedRowKeys.length > 0) && (selectedMenuOption == 'recycleBin') "
              >
                <a-menu slot="overlay" v-if="selectedMenuOption == 'recycleBin'">
                  <a-menu-item key="002" @click="batchRecycle(2)">
                    <a-icon type="undo" />还原
                  </a-menu-item>
                  <a-menu-item key="003" @click="batchDel">
                    <a-icon type="delete" />彻底删除
                  </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px">
                  批量操作
                  <a-icon type="down" />
                </a-button>
              </a-dropdown>
            </div>
            <!-- table区域-begin -->
            <div>
              <a-table
                ref="table"
                size="middle"
                rowKey="id"
                :columns="selectedMenuOption =='sharing' ? columns1 : columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                @change="handleTableChange"
                :customRow="click"
              >
                <!-- 不在回收站的文件的操作插槽 -->
                <span
                  slot="action"
                  slot-scope="text, record"
                  v-if="record.inRecycleBin == 0 && record.isFile == 1"
                  style="display:absolute; z-index:1000"
                >
                  <!-- <a @click="$refs.modal.edit(record)">编辑</a> -->
                  <router-link
                    tag="a"
                    target="_blank"
                    :to="{path:'/online_edit',query:{id:record.id}}"
                    v-show="record.permission.indexOf('edit')>=0"
                  >编辑</router-link>
                  <a-divider type="vertical" />
                  <!-- <a @click="$refs.modal.preview(record)">预览</a> -->
                  <router-link
                    tag="a"
                    target="_blank"
                    :to="{path:'/online_preview',query:{id:record.id}}"
                    v-show="record.permission.indexOf('edit') ||record.permission.indexOf('read')>=0"
                  >预览</router-link>
                  <a-divider type="vertical" />
                  <a-dropdown>
                    <a class="ant-dropdown-link">
                      更多
                      <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item v-show="record.permission.indexOf('edit')>=0">
                        <a @click.stop="handleRename(record)">重命名</a>
                      </a-menu-item>
                      <a-menu-divider
                        v-show="(record.permission.indexOf('permissionChange')>=0) && (record.directoryType == 0)"
                      />
                      <a-menu-item
                        v-show="(record.permission.indexOf('permissionChange')>=0) && (record.directoryType == 0)"
                      >
                        <a @click.stop="handleFilePermission(record)">权限控制</a>
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item>
                        <a
                          @click.stop="handleCollect(record)"
                        >{{record.collected ==0?'添加收藏':'取消收藏'}}</a>
                      </a-menu-item>
                      <a-menu-divider v-show="record.permission.indexOf('share')>=0" />
                      <a-menu-item v-show="record.permission.indexOf('share')>=0">
                        <a @click.stop="handleShare(record)">分享</a>
                      </a-menu-item>
                      <a-menu-divider v-show="record.permission.indexOf('share')>=0" />
                      <!-- 弹窗链接 -->
                      <a-menu-item key="sub20" v-show="record.permission.indexOf('share')>=0">
                        <a @click.stop="handleLink(record)">获取分享链接</a>
                      </a-menu-item>

                      <a-menu-divider
                        v-show="(record.permission.indexOf('delete')>=0) && (record.lastViewTime == undefined)"
                      />
                      <a-menu-item
                        v-show="(record.permission.indexOf('delete')>=0) && (record.lastViewTime == undefined)"
                      >
                        <a @click.stop="handleRecycle(record)">删除</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </span>
                <!-- 不在回收站的文件夹的操作插槽 -->
                <span
                  slot="action"
                  slot-scope="text, record"
                  v-else-if="record.inRecycleBin == 0 && record.isFile == 0"
                >
                  <a
                    @click.stop="handleRecycle(record)"
                    v-show="record.permission.indexOf('delete')>=0"
                  >删除</a>
                  <a-divider type="vertical" />
                  <a
                    @click.stop="handleRename1(record)"
                    v-show="record.permission.indexOf('edit')>=0"
                  >重命名</a>
                  <a-divider
                    type="vertical"
                    v-show="(record.permission.indexOf('permissionChange')>=0) && (record.directoryType == 0)"
                  />
                  <a
                    @click.stop="handleFilePermission1(record)"
                    v-show="(record.permission.indexOf('permissionChange')>=0) && (record.directoryType == 0)"
                  >权限控制</a>
                </span>
                <!-- 回收站内文件的操作插槽 -->
                <span slot="action" slot-scope="text, record" v-else>
                  <a @click.stop="handleRecycle(record)">还原</a>
                  <a-divider type="vertical" />
                  <a @click.stop="handleDelete(record.id)">彻底删除</a>
                </span>
                <span slot="fileIcon" slot-scope="text, record">
                  <a class="file-icon">
                    <a-icon
                      :type="record.isFile==0 ? 'folder' :'file-text'"
                      :style="{fontSize:'18px'}"
                      theme="filled"
                    ></a-icon>
                  </a>
                </span>
                <span slot="star" slot-scope="text,record">
                  <a class="star">
                    <a-icon type="star" theme="filled" v-show="record.collected == 1"></a-icon>
                  </a>
                </span>
                <!-- 我的分享插槽 -->
                <span slot="action1" slot-scope="text, record">
                  <span v-show="record.permission.indexOf('read')>=0">预览</span>
                  <a-divider type="vertical" v-show="record.permission.indexOf('edit')>=0" />
                  <span v-show="record.permission.indexOf('edit')>=0">编辑</span>
                  <a-divider type="vertical" v-show="record.permission.indexOf('delete')>=0" />
                  <span v-show="record.permission.indexOf('delete')>=0">删除</span>
                  <a-divider type="vertical" v-show="record.permission.indexOf('share')>=0" />
                  <span v-show="record.permission.indexOf('share')>=0">分享</span>
                </span>
                <!-- OnlyOffice自身带有下载功能 -->
              </a-table>
            </div>
            <!-- table区域-end -->
          </div>
        </a-col>
        <!-- 表单查询及列表区域-结束 -->
      </a-row>

      <!-- 文件上传弹窗 -->
      <!-- <uploadFile-modal ref="modalForm" @ok="modalFormOk"></uploadFile-modal> -->
      <!-- 文件新增/重命名弹窗 -->
      <createFile-modal ref="modalForm1" @ok="modalFormOk"></createFile-modal>
      <!-- 文件夹新增/重命名弹窗 -->
      <createFolder-modal ref="modalForm3" @ok="modalFormOk"></createFolder-modal>
      <!-- 文件分享弹窗 -->
      <fileShare-modal ref="modalForm2" @ok="modalFormOk"></fileShare-modal>
      <!-- 文件夹授权管理弹窗 -->
      <!-- <folderPermissionManage-modal ref="modalForm4" @ok="modalFormOk"></folderPermissionManage-modal> -->
      <!-- 获取链接设置弹窗 -->
      <shareLink-modal ref="modalForm5" @ok="modalFormOk"></shareLink-modal>
    </a-card>
  </div>
</template>

<script>
// import UploadFileModal from './modules/UploadFileModal'
import CreateFileModal from './modules/CreateFileModal'
import CreateFolderModal from './modules/CreateFolderModal'
import FileShareModal from './modules/FileShareModal'
import ShareLinkModal from './modules/ShareLinkModal'
import { CmpListMixin } from '@/mixins/CmpListMixin'
import { initDictOptions, filterDictText, JDictSelectTag } from '@/components/dict/JDictSelectUtil'
import { httpAction, deleteAction, getAction, postAction, downFile } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import qs from 'qs'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'UploadFileList',
  mixins: [CmpListMixin, mixinDevice],
  components: {
    // UploadFileModal,
    CreateFileModal,
    CreateFolderModal,
    FileShareModal,
    ShareLinkModal
  },
  data () {
    return {
      description: '在线文档管理页面',
      currentList: '',
      localUser: '',
      aa: false,
      newDepartBtn: true,
      urlPre: window.location.host,
      disabled: true,
      disabled1: false,
      tDefaultSelectedKeys: [],
      tSelectedKeys: [], // 侧边目录树选中项，
      mSelectedKeys: [], // 侧边菜单选中项，
      // iExpandedKeys: [],
      tExpandedKeys: [],
      checkedKeys: [],
      departTree: [],
      departTree1: [],
      treeData: [],
      currentFolder: '', // 记录左侧目录树当前选择的节点，用以传值,
      loading: false,
      openKeys: [],
      defaultSelectedKeys: [],
      selectedTreeOption: '', // 存放选择树节点的ID,用于取消收藏或重命名等之后的列表加载判断，
      selectedMenuOption: '', // 存放选择菜单项的innerText,用于取消收藏或重命名等之后的列表加载判断,
      // 表头:
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '',
          align: 'center',
          dataIndex: 'star',
          scopedSlots: { customRender: 'star' }
        },
        {
          title: '',
          align: 'right',
          scopedSlots: { customRender: 'fileIcon' }
        },
        {
          title: '名称',
          align: 'left',
          dataIndex: 'fileName'
        },
        {
          title: '创建时间',
          align: 'left',
          dataIndex: 'createTime'
        },
        {
          title: '创建者',
          align: 'left',
          dataIndex: 'creatorRealname'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns1: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '',
          align: 'center',
          dataIndex: 'star',
          scopedSlots: { customRender: 'star' }
        },
        {
          title: '',
          align: 'right',
          scopedSlots: { customRender: 'fileIcon' }
        },
        {
          title: '名称',
          align: 'left',
          dataIndex: 'fileName'
        },
        {
          title: '分享对象',
          align: 'left',
          dataIndex: 'objectName'
        },
        {
          title: '分享时间',
          align: 'left',
          dataIndex: 'shareTime'
        },
        {
          title: '分享权限',
          dataIndex: 'action1',
          align: 'left',
          scopedSlots: { customRender: 'action1' }
        }
      ],
      id: '',
      url: {
        list: '/online/onlineFile/list',
        recycleBatch: '/fileFolderFile/file/batchRecycleBin', // 批量删除进回收站/批量从回收站还原；
        deleteBatch: '/fileFolderFile/file/batchDelete', // 回收站内-批量彻底删除；
        addOnlineFile: '/online/onlineFile/addOnlineFile', // 上传接口；
        fileUpload: window._CONFIG.domianURL + '/online/onlineFile/addOnlineFile?isSave=0', // 上传地址；
        submit: '/online/onlineFile/submitOnlineFile', // 上传确认提交；
        solveRecycleBinFile: '/fileFolderFile/file/recycleBin', // 回收站（删除/还原）；
        delete: '/fileFolderFile/file/delete', // 回收站内-彻底删除文件或文件夹级联删除；
        recycleBinList: '/fileFolderFile/recycleBin/list', // 回收站列表；
        solveCollectFile: '/online/onlineFile/solveCollectFile', // 收藏操作；
        collectList: '/fileFolderFile/collected/list', // 收藏夹列表；
        viewRecordList: '/fileFolderFile/recently/list', // 最近浏览列表；
        publicTree: '/fileFolderFile/publicFolder/tree', // 左侧公有文档目录树；
        publicList: '/fileFolderFile/publicFile/list', // 右侧公有文档对应的文件（夹）列表；
        personalTree: '/fileFolderFile/personalFolder/tree', // 左侧我的（私有）文档目录树；
        personalList: '/fileFolderFile/personalFile/list', // 右侧我的（私有）文档对应的文件（文件夹）列表；
        sharedList: '/fileFolderFile/fileShared/list', // 获取别人分享给我的文件列表；
        myShareList: '/fileFolderFile/myShare/list' // 获取我分享给别人的文件列表；
      },
      queryParam: {},
      onlinePath: '',
      headers: null,
      fileList: [],
      attachment: [
        {
          groupId: '',
          fileTokens: '',
          fieldName: 'attachment',
          tableName: 'doc_main'
        }
      ]
    }
  },
  beforeCreate () {
    // 自行定义方法，引用字典
    // 初始化字典
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
  created () {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.attachment[0].fileTokens = ''
    this.localUser = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.username
    console.log(this.localUser, 'this.localUser')
  },
  computed: {
    // rowSelection() {
    //   var a = "sadsadas"
    //   var b ="f"
    //   console.log("ss",a.indexOf(b) == -1)
    //   const { selectedRowKeys } = this;
    //   return {
    //     getCheckboxProps: record => ({
    //       props: {
    //         disabled: record.permission.indexOf('delete') ==-1, // Column configuration not to be checked
    //         // name: record.name,
    //       }
    //     }),
    //   }
    // },
    // getCheckboxProps: record => ({
    //   props: {
    //     disabled: record.permission? true:false, // Column configuration not to be checked
    //     name: record.permission
    //   }
    // })
    uploadAction () {
      return this.url.fileUpload
    }
  },
  methods: {
    // 文件直接上传相关-开始：
    beforeUpload (file) {
      // 上传文件类型判断；
      let suffixName = file.name.split('.')
      let last = suffixName[suffixName.length - 1]
      console.log('hzm', last)
      let tp = 'docx,xlsx'
      let ap = tp.split(',')
      if (ap.indexOf(last) < 0) {
        this.$message.warning('仅支持上传后缀名为.docx或.xlsx的文件！')
        return false
      }
    },
    handleChange (info) {
      // 调用改变方法
      this.handleChange1(info, this, 0)
    },

    handleChange1 (info, that, k) {
      if (info.file.status === 'removed') {
        that.attachment[k].fileTokens = that.attachment[k].fileTokens.replace(
          info.file.response.result.fileTokens + ',',
          ''
        )
      }
      that.fileList = info.fileList
      if (info.file.status === 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        if (response.success) {
          that.attachment[k] = response.result
          that.handleOk()
        } else {
          that.$message.warning(response.message)
          return false
        }
      }
    },
    handleOk () {
      // 上传确认函数
      const that = this
      that.confirmLoading = true
      let httpurl = ''
      let method = 'post'
      httpurl += this.url.submit
      let formData = {}
      for (let i = 0; i < that.attachment.length; i++) {
        formData = that.attachment[i]
      }
      formData.directoryType = this.currentFolder.directoryType
      formData.fileParentId = this.currentFolder.id
      formData.fileParentDepartmentId = this.currentFolder.departmentId || this.currentFolder.fileParentDepartmentId
      // console.log(values.permission,'多选框数值')
      formData.filePermission = 'read,delete,edit'
      // console.log('values',values)
      delete formData.uploadTime
      delete formData.updateTime
      delete formData.createTime
      // console.log(httpurl, formData, '就')
      httpAction(httpurl, qs.stringify(formData), method)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message)
            that.$emit('ok')
            that.loadData()
          } else {
            that.$message.warning(res.message)
          }
        })
        .finally(() => {
          that.confirmLoading = false
        })
    },
    // 文件直接上传相关-结束；
    /*  */
    searchQuery () {
      this.loadData(1)
    },
    searchReset () {
      this.queryParam = {}
      if (this.$refs.ResetLk) {
        this.$refs.ResetLk.ResetValue()
      }
      this.loadData(1)
    },
    modalFormOk () {
      if (this.selectedTreeOption) {
        // debugger
        this.loadData()
      } else {
        switch (this.selectedMenuOption) {
          case 'shared':
            this.loadSharedList()
            break
          case 'recently':
            this.loadViewRecord()
            break
          case 'collect':
            this.loadCollectFile()
            break
        }
      }
    },
    // 获取链接操作相关-开始：
    handleLink (record) {
      this.$refs.modalForm5.create(record)
      this.$refs.modalForm5.title = '获取链接'
    },
    // 获取链接操作相关-结束：
    // 新增按钮相关-开始：
    // handleUpload() {
    //   this.$refs.modalForm.add(this.currentFolder)
    //   this.$refs.modalForm.title = '上传文件'
    // },
    handleAdd (arg) {
      this.$refs.modalForm1.add(this.currentFolder, arg)
      // arg:记录要创建的是文档还是表格；
      if (arg == 'docx') {
        this.$refs.modalForm1.title = '新建文档'
      } else {
        this.$refs.modalForm1.title = '新建表格'
      }
    },
    handleAddFolder () {
      this.$refs.modalForm3.add(this.currentFolder)
      this.$refs.modalForm3.title = '新建文件夹'
    },
    // 新增按钮相关-结束；

    // 左侧目录树相关—开始：
    onSelect (selectedKeys, e) {
      console.log(selectedKeys, e, 'selectedKeys')
      if (this.tSelectedKeys[0] !== selectedKeys[0]) {
        this.tSelectedKeys = [selectedKeys[0]]
      }
      let record = e.node.dataRef
      console.log('onSelect-record', record)
      this.selectedMenuOption = ''
      this.selectedTreeOption = record.id
      this.currentFolder = record
      var params = this.getQueryParams()
      params.parentId = record.id
      this.checkedKeys.push(record.id)
      let httpurl = ''
      if (record.directoryType == 0) {
        // 0是公有；
        httpurl = this.url.publicList
        this.currentList = '公有文档'
      }
      if (record.directoryType == 1) {
        // 1是私有；
        httpurl = this.url.personalList
        this.currentList = '我的文档'
      }
      if (httpurl) {
        getAction(httpurl, params).then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
            if (selectedKeys == record.id) {
              if (this.currentFolder.permission.indexOf('new') != -1) {
                // 判断当前分支下能否新增：
                this.disabled = false
              } else {
                this.disabled = true
              }
            } else {
              this.disabled = true
            }
          } else {
            this.$message.success(res.message)
          }
          this.loading = false
        })
      }
    },
    loadTree () {
      // 文件目录树加载
      var that = this
      that.treeData = []
      that.departTree = []
      that.departTree1 = []
      getAction(this.url.publicTree, {}).then(res => {
        if (res.success) {
          // console.log('tree', res.result)
          var tree = new Array()
          tree.push(res.result)
          for (let i = 0; i < tree.length; i++) {
            tree[i].title = tree[i].name
            // tree[i].key = tree[i].id
            if (!tree[i].id) {
              tree[i].key += 'publicRoot'
            } else {
              tree[i].key = tree[i].id
            }
            // if the current node's id is exist, there will assign the id to its key;
            // or, the key will be created by system automatically.
            let temp = tree[i]
            that.treeData.push(temp)
            that.departTree.push(temp)
            that.setThisExpandedKeys(temp)
            // console.log(temp.id)
          }
          // console.log('tree', that.departTree)
          // console.log('this.tExpandedKeys',this.tExpandedKeys)
          this.loading = false
        }
      })
      getAction(this.url.personalTree, {}).then(res => {
        if (res.success) {
          // console.log('tree', res.result)
          var tree1 = new Array()
          tree1.push(res.result)
          for (let i = 0; i < tree1.length; i++) {
            tree1[i].title = tree1[i].name
            if (!tree1[i].id) {
              tree1[i].key += 'personalRoot'
            } else {
              tree1[i].key = tree1[i].id
            }
            // this.tDefaultSelectedKeys = tree1[i].key.split(',')
            // if the current node's id is exist, there will assign the id to its key;
            // or, the key will be created by system automatically.
            let temp1 = tree1[i]
            // that.treeData.push(temp1)
            that.departTree1.push(temp1)
            that.setThisExpandedKeys(temp1)
          }
          this.loading = false
        }
      })
    },
    setThisExpandedKeys (node) {
      if (node.children && node.children.length > 0) {
        //  this.iExpandedKeys.push(node.id)
        for (let a = 0; a < node.children.length; a++) {
          node.children[a].title = node.children[a].name
          node.children[a].key = node.children[a].id
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },

    onExpand (expandedKeys) {
      // console.log("this.tSelectedKeys",this.tSelectedKeys)
      // console.log('onExpand', expandedKeys)
      // 如果没有将autoExpandParent设置为false，如果子节点被展开，则父节点不能折叠; 或者，可以删除所有展开的子节点。
      this.tExpandedKeys = expandedKeys
      // console.log("this.tExpandedKeys",this.tExpandedKeys)
      // this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    refresh () {
      this.loading = true
      this.loadTree()
    },
    // 左侧目录树相关—结束；
    // 右侧列表相关-开始：
    // 批量操作相关-开始：

    batchRecycle (option) {
      // 1:批量删除进回收站;
      // 2:批量从回收站还原;
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择至少一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        let userName = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.username
        let params = {
          ids: ids
        }
        if (option == 1) {
          this.$confirm({
            title: '确认批量删除',
            content: '是否批量删除选中数据?',
            onOk: function () {
              params.inRecycleBin = userName
              postAction(that.url.recycleBatch, qs.stringify(params)).then(res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadAfterDelete()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        } else {
          this.$confirm({
            title: '确认批量还原',
            content: '是否批量还原选中数据?',
            onOk: function () {
              params.inRecycleBin = 0
              postAction(that.url.recycleBatch, qs.stringify(params)).then(res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadRecycleBinFile()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
      }
    },
    batchDel () {
      // 回收站内-批量彻底删除；
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择至少一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
      }
      let params = {
        ids: ids
      }
      postAction(this.url.deleteBatch, qs.stringify(params)).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadRecycleBinFile()
          this.onClearSelected()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 批量操作相关-结束：
    click (record, index) {
      // 点击文件夹行加载其内容
      return {
        on: {
          click: () => {
            if (record.isFile == 0 && this.selectedTreeOption != '') {
              // 还需要同步左侧树的被选中项
              var params = this.getQueryParams()
              params.parentId = record.id
              let httpurl = ''
              // if(this.tSelectedKeys.length){
              this.currentFolder = record
              this.checkedKeys.push(record.id)
              console.log('this.currentFolder', this.currentFolder)
              if (record.directoryType == 0) {
                // 0是公有；
                httpurl = this.url.publicList
              }
              if (record.directoryType == 1) {
                // 1是私有；
                httpurl = this.url.personalList
              }
              if (httpurl) {
                getAction(httpurl, params).then(res => {
                  if (res.success) {
                    console.log('')
                    this.tSelectedKeys = record.id.split(',')
                    this.tExpandedKeys.push(record.id)
                    // this.onExpand(record.id.split(','))
                    this.dataSource = res.result.records
                    this.ipagination.total = res.result.total
                    if (this.currentFolder.permission.indexOf('new') >= 0) {
                      // 判断当前分支下能否新增：
                      this.disabled = false
                    } else {
                      this.disabled = true
                    }
                  }
                  this.loading = false
                })
              }
            }
          }
        }
      }
    },
    loadData (arg) {
      // 初始列表加载；
      this.refresh()
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() // 查询条件
      params.recycle = 0 // 不在回收站；
      let userId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.id
      params.userId = userId
      params.parentId = this.tSelectedKeys[0]
      this.loading = true
      let httpurl = ''
      if (this.currentFolder.directoryType == 0) {
        // 0是公有；
        httpurl = this.url.publicList
      }
      if (this.currentFolder.directoryType == 1) {
        // 1是私有；
        httpurl = this.url.personalList
      }
      if (httpurl) {
        getAction(httpurl, params).then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            // console.log('sss', this.dataSource)
            this.ipagination.total = res.result.total
          }
          this.loading = false
        })
      }
    },
    handleRename (record) {
      // console.log(record,'record')
      this.$refs.modalForm1.edit(record)
      this.$refs.modalForm1.title = '文件重命名'
    },
    handleRename1 (record) {
      console.log('当前record', record)
      this.$refs.modalForm3.edit(record)
      this.$refs.modalForm3.title = '文件夹重命名'
    },

    // 分享相关操作-开始：
    handleShare (record) {
      this.$refs.modalForm2.edit(record)
      this.$refs.modalForm2.title = '文件分享'
    },
    loadSharedList (arg) {
      // 获取别人分享给我的文件列表
      if (arg === 1) {
        this.ipagination.current = 1
      }
      getAction(this.url.sharedList, {}).then(res => {
        if (res.success) {
          this.currentList = '与我共享'
          this.tSelectedKeys = []
          this.disabled = true
          let recordsArr = new Array()
          recordsArr = res.result.records
          for (let i = 0; i < recordsArr.length; i++) {
            recordsArr[i].isFile = 1
          }
          this.dataSource = recordsArr
          this.ipagination.total = res.result.total

          this.selectedTreeOption = ''
          this.selectedMenuOption = 'shared'
        }
        this.loading = false
      })
    },
    loadSharingList (arg) {
      // 获取我分享给别人的文件列表
      if (arg === 1) {
        this.ipagination.current = 1
      }
      getAction(this.url.myShareList, {}).then(res => {
        if (res.success) {
          this.currentList = '我的分享'
          this.tSelectedKeys = []
          this.disabled = true
          let recordsArr = new Array()
          recordsArr = res.result.records
          for (let i = 0; i < recordsArr.length; i++) {
            recordsArr[i].isFile = 1
          }
          this.dataSource = recordsArr
          this.ipagination.total = res.result.total

          this.selectedTreeOption = ''
          this.selectedMenuOption = 'sharing'
        }
        this.loading = false
      })
    },
    // 分享相关操作-结束；
    // 收藏夹操作-开始：
    handleCollect (record) {
      // 收藏/取消收藏；
      let fileId = record.id
      // this.id = record.id;
      let userId = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.id
      // console.log('文件ID和用户ID',fileId,userId)
      let params = {
        fileId: fileId,
        userId: userId
      }
      let httpurl = ''
      if (record.collected == 0) {
        httpurl = this.url.solveCollectFile + '?collect=1' // 文件未被收藏时请求的地址;
      } else {
        httpurl = this.url.solveCollectFile + '?collect=0' // 文件已被收藏时请求的地址;
      }
      console.log('collect-url', httpurl)
      postAction(httpurl, qs.stringify(params)).then(res => {
        if (res.success) {
          // 判断进行收藏/取消收藏后加载的列表是哪一个：
          if (this.selectedTreeOption) {
            this.loadData()
          } else {
            switch (this.selectedMenuOption) {
              case 'shared':
                this.loadSharedList()
                break
              // case 'sharing':
              //   this.loadSharingList()
              //   break
              case 'recently':
                this.loadViewRecord()
                break
              case 'collect':
                this.loadCollectFile()
                break
              // case 'personal':
              //   this.loadPersonalFile()
              //   break
            }
          }
          if (record.collected != 0) {
            this.loadCollectFile()
          }
          this.$message.success(res.message)
          this.$emit('ok')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    loadCollectFile (arg) {
      // 收藏夹列表加载；
      if (arg === 1) {
        this.ipagination.current = 1 // 加载第一页列表；
      }
      getAction(this.url.collectList, {}).then(res => {
        if (res.success) {
          this.currentList = '我的收藏'
          this.tSelectedKeys = []
          this.disabled = true

          this.dataSource = res.result.records
          this.ipagination.total = res.result.total

          this.selectedTreeOption = ''
          this.selectedMenuOption = 'collect'
        }
        this.loading = false
      })
    },
    // 收藏夹操作-结束；
    // 回收站相关操作-开始：
    loadAfterDelete () {
      // 执行删除、批量删除操作后的列表加载判断；
      if (this.selectedTreeOption) {
        this.loadData()
      } else {
        switch (that.selectedMenuOption) {
          case 'shared':
            this.loadSharedList()
            break
          case 'recently':
            this.loadViewRecord()
            break
          case 'collect':
            this.loadCollectFile()
            break
        }
      }
    },
    handleRecycle (record) {
      // 回收站操作(删除/还原)
      var that = this
      let rId = record.id
      let params = {}
      params.id = rId
      let userName = JSON.parse(localStorage.getItem('pro__Login_Userinfo')).value.username
      let inRBin = record.inRecycleBin
      if (inRBin == 0) {
        // 删除进回收站
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            params.inRecycleBin = userName
            let httpurl = that.url.solveRecycleBinFile
            // console.log('params', params)
            postAction(httpurl, qs.stringify(params)).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                if (record.inRecycleBin == 0) {
                  that.loadAfterDelete()
                } else {
                  that.loadRecycleBinFile()
                }
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      } else {
        this.$confirm({
          title: '确认还原',
          content: '是否还原选中数据?',
          onOk: function () {
            params.inRecycleBin = 0
            let httpurl = that.url.solveRecycleBinFile
            console.log('params', params)
            postAction(httpurl, qs.stringify(params)).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                if (record.inRecycleBin == 0) {
                  that.loadData()
                } else {
                  that.loadRecycleBinFile()
                }
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    handleDelete (id) {
      // 彻底删除文件
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '确认彻底删除',
        content: '是否彻底删除选中数据?',
        onOk: function () {
          deleteAction(that.url.delete, { id: id }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadRecycleBinFile()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    loadRecycleBinFile (arg) {
      // 回收站文件列表加载；
      if (arg === 1) {
        // 加载数据 若传入参数1则加载第一页的内容
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() // 查询条件
      this.loading = true
      getAction(this.url.recycleBinList, {}).then(res => {
        if (res.success) {
          this.currentList = '回收站'
          this.tSelectedKeys = []
          this.disabled = true

          this.dataSource = res.result.records
          console.log('this.dataSource', this.dataSource)
          this.ipagination.total = res.result.total
          this.selectedTreeOption = ''
          this.selectedMenuOption = 'recycleBin'
        }
        this.loading = false
      })
    },
    // 回收站相关操作-结束；
    // 最近浏览记录相关-开始：
    loadViewRecord (arg) {
      // 最近浏览列表加载；
      if (arg === 1) {
        this.ipagination.current = 1
      }
      getAction(this.url.viewRecordList, {}).then(res => {
        if (res.success) {
          this.currentList = '最近浏览'
          this.tSelectedKeys = []
          this.disabled = true

          this.dataSource = res.result.records
          this.ipagination.total = res.result.total

          this.selectedTreeOption = ''
          this.selectedMenuOption = 'recently'
        }
        this.loading = false
      })
    },
    // 最近浏览记录相关-结束；
    /**/
    // 内部侧边菜单-开始：
    onSelect1 (selectedKeys) {
      console.log('selectedKeys', selectedKeys)
      //   // this.mSelectedKeys = selectedKeys
      if (this.mSelectedKeys[0] !== selectedKeys[0]) {
        this.mSelectedKeys = [selectedKeys[0]]
      }
    },
    // 内部侧边菜单-结束；
    // 文件（夹）权限重配-开始：
    handleFilePermission (record) {
      // 文件-本部门权限更改
      // console.log(record,'record')
      this.$refs.modalForm1.reAccredit(record)
      this.$refs.modalForm1.title = '文件权限更改'
    },
    handleFilePermission1 (record) {
      // 文件夹-本部门权限更改
      console.log('当前record', record)
      this.$refs.modalForm3.reAccredit(record)
      this.$refs.modalForm3.title = '文件夹权限更改'
    }
    // 文件（夹）权限重配-结束；
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
@import '~@assets/less/topBtns.less';
.onlineDocument {
  .page-title {
    font-size: 20px;
    color: #000;
    margin-left: 1vh;
  }
  // 目录树样式：
  /deep/.ant-tree.ant-tree-directory {
    margin-left: 1vh;
    // line-height: 34px;
  }
  /deep/li span.ant-tree-node-content-wrapper {
    display: inline-block;
    white-space: nowrap;

    width: 100%;
    height: 34px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 34px;
  }
  /deep/.ant-tree li span.ant-tree-iconEle {
    margin-top: 5px;
  }
  /deep/.ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper:before {
    height: 34px;
    // padding: 5px;
  }
  /deep/.ant-tree.ant-tree-directory
    .ant-tree-child-tree
    > li.ant-tree-treenode-selected
    > span.ant-tree-node-content-wrapper:before {
    height: 34px;
    // padding: 5px;
  }
  //内部侧边菜单样式：
  /deep/.ant-menu {
    background: #fff;
    color: rgba(0, 0, 0, 0.7);
    .ant-menu-item:hover {
      color: rgb(168, 168, 168);
    }
    .ant-menu-item-selected {
      color: #fff;
    }
  }
  /deep/.ant-menu-vertical {
    border-right: #fff;
  }
  //logo和文件上传按钮的样式：
  .logo,
  .file-add,
  .file-upload-btn,
  .permission-manage {
    //使子元素垂直居中：
    height: 60px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .file-add {
    button {
      margin-top: -3vh;
      width: 70px;
      height: 32px;
      // border-radius: 50%
      text-align: center;
      line-height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  /deep/span.upload-list-inline {
    width: 100%;
  }
  //垂直分割线样式：
  /deep/.ant-col-md-1 {
    display: flex;
    align-items: center;
    justify-content: center;
    .vertical-line {
      width: 1px;
      border-right: 1px #e8e8e8 solid;
      height: 100vh;
    }
  }
  .file-icon {
    text-decoration: none;
    cursor: default;
  }
  /deep/.ant-tree li span.ant-tree-switcher,
  .ant-tree li span.ant-tree-iconEle {
    //箭头
    width: 2px;
    margin-top: 5px;
  }

  .listTitle {
    font-size: 20px;
  }
}
/* 移动端样式： */
&.mobile {
  .onlineDocument {
    .vertical-line {
      display: none;
    }
  }
}
</style>
