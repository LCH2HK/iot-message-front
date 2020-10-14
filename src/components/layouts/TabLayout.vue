<template>
  <global-layout @dynamicRouterShow="dynamicRouterShow">
    <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect" />
    <a-tabs
      @contextmenu.native="e => onContextmenu(e)"
      v-if="multipage"
      :active-key="activePage"
      class="tab-layout-tabs"
      style="height:52px"
      :hide-add="true"
      type="editable-card"
      @change="changePage"
      @edit="editPage"
    >
      <a-tab-pane :id="page.fullPath" :key="page.fullPath" v-for="page in pageList">
        <span slot="tab" :pagekey="page.fullPath">{{ page.meta.title }}</span>
      </a-tab-pane>
    </a-tabs>
    <!-- <div style="margin: 12px 12px 0;"> -->
    <div class="main-content">
      <div class="content-margin-div">
        <transition name="page-toggle">
          <keep-alive v-if="multipage">
            <router-view />
          </keep-alive>
          <router-view v-else />
        </transition>
      </div>
    </div>
  </global-layout>
</template>

<script>
import GlobalLayout from '@/components/page/GlobalLayout'
import Contextmenu from '@/components/menu/Contextmenu'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import store from '@/store'

/* const indexKey = '/roomList/roomListOrder' */

export default {
  name: 'TabLayout',
  components: {
    GlobalLayout,
    Contextmenu
  },
  mixins: [mixin, mixinDevice],
  data () {
    return {
      indexKey: '/iot/HomePage',
      pageList: [],
      linkList: [],
      activePage: '',
      menuVisible: false,
      menuItemList: [
        { key: '1', icon: 'arrow-left', text: '关闭左侧' },
        { key: '2', icon: 'arrow-right', text: '关闭右侧' },
        { key: '3', icon: 'close', text: '关闭其它' }
      ]
    }
  },
  computed: {
    multipage () {
      // 判断如果是手机模式，自动切换为单页面模式
      if (this.isMobile()) {
        return false
      } else {
        return this.$store.state.app.multipage
      }
    }
  },
  created () {
    const newRouters = store.getters.addRouters
    if (newRouters[0].redirect === '/iot/HomePage') {
      this.indexKey = '/iot/HomePage'
      if (this.$route.path != this.indexKey) {
        this.pageList.push({
          name: 'iot-HomePage',
          path: this.indexKey,
          fullPath: this.indexKey,
          meta: {
            icon: 'dashboard',
            title: '数据大盘'
          }
        })
        this.linkList.push(this.indexKey)
      }
    } else {
      this.indexKey = '/iot/HomePage'
      if (this.$route.path != this.indexKey) {
        this.pageList.push({
          name: 'iot-HomePage',
          path: this.indexKey,
          fullPath: this.indexKey,
          meta: {
            icon: 'dashboard',
            title: '数据大盘'
          }
        })
        this.linkList.push(this.indexKey)
      }
    }
    this.pageList.push(this.$route)
    this.linkList.push(this.$route.fullPath)
    this.activePage = this.$route.fullPath
  },
  watch: {
    $route: function (newRoute) {
      this.activePage = newRoute.fullPath
      if (!this.multipage) {
        this.linkList = [newRoute.fullPath]
        this.pageList = [Object.assign({}, newRoute)]
      } else if (this.linkList.indexOf(newRoute.fullPath) < 0) {
        this.linkList.push(newRoute.fullPath)
        this.pageList.push(Object.assign({}, newRoute))
      } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
        const oldIndex = this.linkList.indexOf(newRoute.fullPath)
        const oldPositionRoute = this.pageList[oldIndex]
        this.pageList.splice(oldIndex, 1, Object.assign({}, newRoute, { meta: oldPositionRoute.meta }))
      }
    },
    activePage: function (key) {
      const index = this.linkList.lastIndexOf(key)
      const waitRouter = this.pageList[index]
      this.$router.push(Object.assign({}, waitRouter))
    },
    multipage: function (newVal) {
      if (!newVal) {
        this.linkList = [this.$route.fullPath]
        this.pageList = [this.$route]
      }
    }
  },
  methods: {
    changePage (key) {
      this.activePage = key
    },
    editPage (key, action) {
      this[action](key)
    },
    remove (key) {
      if (key == this.indexKey) {
        this.$message.warning('当前页不能关闭!')
        return
      }
      if (this.pageList.length === 1) {
        this.$message.warning('这是最后一页，不能再关闭了啦')
        return
      }
      this.pageList = this.pageList.filter(item => item.fullPath !== key)
      let index = this.linkList.indexOf(key)
      this.linkList = this.linkList.filter(item => item !== key)
      index = index >= this.linkList.length ? this.linkList.length - 1 : index
      this.activePage = this.linkList[index]
    },
    onContextmenu (e) {
      const pagekey = this.getPageKey(e.target)
      if (pagekey !== null) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    getPageKey (target, depth) {
      depth = depth || 0
      if (depth > 2) {
        return null
      }
      let pageKey = target.getAttribute('pagekey')
      pageKey =
        pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
      return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
    },
    onMenuSelect (key, target) {
      const pageKey = this.getPageKey(target)
      switch (key) {
        case '1':
          this.closeLeft(pageKey)
          break
        case '2':
          this.closeRight(pageKey)
          break
        case '3':
          this.closeOthers(pageKey)
          break
        default:
          break
      }
    },
    closeOthers (pageKey) {
      const index = this.linkList.indexOf(pageKey)
      if (pageKey == this.indexKey) {
        this.linkList = this.linkList.slice(index, index + 1)
        this.pageList = this.pageList.slice(index, index + 1)
        this.activePage = this.linkList[0]
      } else {
        const indexContent = this.pageList.slice(0, 1)[0]
        this.linkList = this.linkList.slice(index, index + 1)
        this.pageList = this.pageList.slice(index, index + 1)
        this.linkList.unshift(this.indexKey)
        this.pageList.unshift(indexContent)
        this.activePage = this.linkList[1]
      }
    },
    closeLeft (pageKey) {
      if (pageKey == this.indexKey) {
        return
      }
      const tempList = [...this.pageList]
      const indexContent = tempList.slice(0, 1)[0]
      const index = this.linkList.indexOf(pageKey)
      this.linkList = this.linkList.slice(index)
      this.pageList = this.pageList.slice(index)
      this.linkList.unshift(this.indexKey)
      this.pageList.unshift(indexContent)
      if (this.linkList.indexOf(this.activePage) < 0) {
        this.activePage = this.linkList[0]
      }
    },
    closeRight (pageKey) {
      const index = this.linkList.indexOf(pageKey)
      this.linkList = this.linkList.slice(0, index + 1)
      this.pageList = this.pageList.slice(0, index + 1)
      if (this.linkList.indexOf(this.activePage < 0)) {
        this.activePage = this.linkList[this.linkList.length - 1]
      }
    },
    // update-begin-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
    dynamicRouterShow (key, title) {
      const keyIndex = this.linkList.indexOf(key)
      if (keyIndex >= 0) {
        const currRouter = this.pageList[keyIndex]
        const meta = Object.assign({}, currRouter.meta, { title: title })
        this.pageList.splice(keyIndex, 1, Object.assign({}, currRouter, { meta: meta }))
      }
    }
    // update-end-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
  }
}
</script>

<style lang="scss">
.main-content {
  overflow-y: auto;
  .content-margin-div {
    position: relative;
    height: calc(100vh - 170px);
    margin: 12px 24px 0;
    background: transparent; /* Old browsers */
    background: -moz-linear-gradient(top,  #ffffff 0%, #ffffff 73%, #f1fbff 100%, #f1fbff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  #ffffff 0%,#ffffff 73%,#f1fbff 100%,#f1fbff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  #ffffff 0%,#ffffff 73%,#f1fbff 100%,#f1fbff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  }
}
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.contextmenu {
  z-index: 2 !important;
}

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/*美化弹出Tab样式*/
.ant-tabs-nav-container {
  /* margin-top: 4px; */
  /* margin-left: 62px; */
}

/* 修改 ant-tabs 样式 */
.tab-layout-tabs.ant-tabs {
  /* border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc; */
  background-color: #eff1f2;
  padding-top: 13px;
  height: 50px !important;
  padding-left: 24px;

  .ant-tabs-bar {
    /* margin: 4px 0 0; */
    margin-bottom: 0;
    border: none;
    height: 100%;
  }
}
.topmenu .tab-layout-tabs.ant-tabs {
  margin: 0;
  padding-left: 22px;
}

.ant-tabs {
  &.ant-tabs-card .ant-tabs-tab {
    padding: 0 16px !important;
    background-color: #eff1f2 !important;
    /* margin-right: 10px !important; */
    width: 168px;

    .ant-tabs-close-x {
      width: 12px !important;
      height: 12px !important;
      opacity: 0 !important;
      cursor: pointer !important;
      font-size: 12px !important;
      margin: 0 !important;
      position: absolute;
      top: 36%;
      right: 6px;
      opacity: 1 !important;
    }

    &:hover .ant-tabs-close-x {
      opacity: 1 !important;
    }
  }
}

.ant-tabs.ant-tabs-card > .ant-tabs-bar {
  .ant-tabs-tab {
    border: none !important;
    padding-left: 0 !important;
    span {
      padding-left: 16px;
    }
  }
  .ant-tabs-tab-active {
    background: #fff !important;
  }
}
:global(.topmenu
    .ant-layout-content
    .tab-layout-tabs.ant-tabs
    .ant-tabs-bar.ant-tabs-top-bar.ant-tabs-card-bar
    .ant-tabs-tab) {
  span {
    border-color: rgba(255, 255, 255, 0.5) !important;
  }
}
:global(.ant-layout-content .tab-layout-tabs.ant-tabs .ant-tabs-bar.ant-tabs-top-bar.ant-tabs-card-bar .ant-tabs-tab) {
  span {
    border-left: 1px solid #999999 !important;
  }

  &:first-child {
    span {
      border: none !important;
    }
  }
}
:global(.ant-layout-content
    .tab-layout-tabs.ant-tabs
    .ant-tabs-bar.ant-tabs-top-bar.ant-tabs-card-bar
    .ant-tabs-tab-active) {
  span {
    border: none !important;
  }

  & + .ant-tabs-tab {
    span {
      border: none !important;
    }
  }
}
</style>
