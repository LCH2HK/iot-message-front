<template>
  <a-layout-sider
    :class="['sider', menuClass,  isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="222px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
    collapsedWidth="60px"
  >
    <logo v-if="layoutMode === 'sidemenu'" />
    <img
    class="trigger"
    src="@/assets/img/iot/manu/leftSideMenuIcon.png"
    @click="changeCollapsedValue"
    v-if="layoutMode === 'topsidemenu' && !collapsed"
    >
    <img
    class="trigger"
    src="@/assets/img/iot/manu/rightSideMenuIcon.png"
    @click="changeCollapsedValue"
    v-if="layoutMode === 'topsidemenu' && collapsed"
    >
<!--    <a-icon-->
<!--      class="trigger"-->
<!--      :type="collapsed ? 'menu-unfold' : 'menu-fold'"-->
<!--      @click="()=> collapsed = !collapsed"-->
<!--      v-if="layoutMode === 'topsidemenu'"-->
<!--    />-->
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      @select="onSelect"
      :mode="mode"
      :style="smenuStyle"
      class="sider-menu"
    ></s-menu>
  </a-layout-sider>
</template>

<script>
import ALayoutSider from 'ant-design-vue/es/layout/Sider'
import Logo from '../tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'SideMenu',
  components: { ALayoutSider, Logo, SMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    color: {
      type: String,
      required: false,
      default: '#0493f3'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: true
    },
    menus: {
      type: Array,
      required: true
    },
    layoutMode: {
      type: String,
      required: false,
      default: 'sidemenu'
    }
  },
  data () {
    return {

    }
  },
  computed: {
    smenuStyle () {
      const style = { paddingTop: '12px' }
      if (this.fixSiderbar) {
        style.height = 'calc(100% - 59px)'
        style.overflow = 'auto'
        style['overflow-x'] = 'hidden'
      }
      return style
    },
    // 根据主题颜色，修改菜单背景
    menuClass () {
      const themeColor = this.color
      const themeType = this.theme
      if (this.layoutMode === 'topsidemenu') {
        return 'topside'
      }
      if (themeType === 'dark') {
        return ''
      } else {
        if (themeColor === '#F5222D') {
          return 'red'
        } else if (themeColor === '#FA541C') {
          return 'orange'
        } else if (themeColor === '#FAAD14') {
          return 'yellow'
        } else if (themeColor === '#52C41A') {
          return 'green'
        } else if (themeColor === '#13C2C2') {
          return 'cyan-blue'
        } else if (themeColor === '#722ED1') {
          return 'purple'
        } else {
          return 'blue-default'
        }
      }
    }
  },
  methods: {
    onSelect (obj) {
      console.log('obj', obj)// 改变填充色
      this.$emit('menuSelect', obj)
    },
    changeCollapsedValue () {
      this.$emit('changeCollapsedValue')
    }
  },
  watch: {
    collapsed: function () {
      this.$store.commit('SET_SIDEBAR_TYPE', !this.collapsed)
    }
  }
}
</script>
<style lang="scss" scoped>
/* update_begin author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
$scrollBarSize: 10px;

// 侧边栏
.sider {
  // 整体背景
  & > :global(.ant-layout-sider-children) {
    // background: rgba(0, 0, 0, 0) no-repeat;
    background: #ffffff; /* Old browsers */
    background: -moz-linear-gradient(top,  #ffffff 0%, #ffffff 73%, #f1fbff 100%, #f1fbff 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  #ffffff 0%,#ffffff 73%,#f1fbff 100%,#f1fbff 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  #ffffff 0%,#ffffff 73%,#f1fbff 100%,#f1fbff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#f1fbff',GradientType=0 ); /* IE6-9 */
  }
  &.blue-default {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage.png);
      background-size: 100% 100%;
    }
  }
  &.red {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage-red.png);
      background-size: 100% 100%;
    }
  }
  &.orange {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage-orange.png);
      background-size: 100% 100%;
    }
  }
  &.yellow {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage-yellow.png);
      background-size: 100% 100%;
    }
  }
  &.green {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage-green.png);
      background-size: 100% 100%;
    }
  }
  &.cyan-blue {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage-cyan-blue.png);
      background-size: 100% 100%;
    }
  }
  &.purple {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage-purple.png);
      background-size: 100% 100%;
    }
  }
  &.dark {
    :global(.ant-layout-sider-children) {
      background-image: url(~@/assets/img/bgimg/sidermenu-bgimage-dark.png);
      background-size: 100% 100%;
    }
  }
  //菜单
  .sider-menu {
    background-color: rgba(0, 0, 0, 0);
    height: calc(100vh - 150px);
    overflow:scroll;
    // 清除ant-designUI框架菜单右侧选中状态条，放到左侧
    & > :global(.ant-menu-item.ant-menu-item-selected) {
      &:after {
        border-right: none;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        transform: scaleY(1);
        opacity: 1;
        transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
          opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
      }
    }
    & > :global(.ant-menu-item){
      // a {
      //   span{
      //     display: inline-block;
      //     margin-left: 15px;
      //   }
      // }
      &:hover {
        background: #cacdd744;
      }
    }
    & > :global(.ant-menu-submenu) {
      &:hover {
        background: #cacdd744
      }
    }
    //一级菜单
    & > :global(li) {
      // 没有二级菜单的
      &:global(.ant-menu-item) {
        padding-left: 20px !important;
      }
      //有二级菜单的
      & > :global(div.ant-menu-submenu-title) {
        padding-left: 20px !important;
      }
      & > :global(ul.ant-menu) {
        background-color: rgba(0, 0, 0, 0);
      }
    }
    //菜单中的图片
    :global(img) {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      line-height: 19px;
      vertical-align: sub;
    }
    //菜单中的文字
    :global(span) {
      color: rgba(255, 255, 255, 0.6);
    }
    //菜单中的子菜单
    & > :global(.ant-menu-submenu.ant-menu-submenu-inline.ant-menu-submenu-open) {
      :global(.ant-menu-item.ant-menu-item-selected) {
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          transform: scaleY(1);
          opacity: 1;
          transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
            opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        &:after {
          border-right: none;
        }
      }
    }
    //侧边栏导航菜单箭头颜色，默认#fff,0.6透明度
    :global(.ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
    :global(.ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
    :global(.ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
    :global(.ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
    :global(.ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow:after),
    :global(.ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow:after),
    :global(.ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow:after),
    :global(.ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow:after) {
      background: rgba(255, 255, 255, 0.6);
    }
  }
  &.topside {
    :global(.ant-layout-sider-children) {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
      .sider-menu {
        /deep/.ant-menu-item, /deep/.ant-menu-submenu{
          span {
            color: rgba(0, 0, 0, 0.65) !important;
          }
        }

        //侧边栏导航菜单箭头颜色
        :global(.ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
        :global(.ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
        :global(.ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
        :global(.ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow:before),
        :global(.ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow:after),
        :global(.ant-menu-submenu-vertical-left > .ant-menu-submenu-title .ant-menu-submenu-arrow:after),
        :global(.ant-menu-submenu-vertical-right > .ant-menu-submenu-title .ant-menu-submenu-arrow:after),
        :global(.ant-menu-submenu-inline > .ant-menu-submenu-title .ant-menu-submenu-arrow:after) {
          background-color: rgba(0, 0, 0, 0.5);
        }
        /deep/.ant-menu-submenu-selected {
          > div {
          img{
            filter: invert(49%) sepia(95%) saturate(7452%) hue-rotate(230deg) brightness(97%) contrast(88%);
          }
          span{
            color: #2F53EA !important;
          }
          }
        }
        /deep/.ant-menu-submenu-open{
          background: rgba(255, 255, 255, 0.4) !important;

          .ant-menu-sub > .ant-menu-item:hover {
            background: #cacdd744
          }
        }
        /deep/.ant-menu-item-selected {
          background: rgba(4, 147, 243, .1);
          span{
            color: #2F53EA !important;
          }
          img{
            filter: invert(49%) sepia(95%) saturate(7452%) hue-rotate(230deg) brightness(97%) contrast(88%);
          }
        }
      }
    }
  }

  ul.ant-menu {
    /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar {
      width: $scrollBarSize;
      height: $scrollBarSize;
      background-color: transparent;
      display: none;
    }

    & .-o-scrollbar {
      display: none;
    }

    /* 兼容IE */
    -ms-overflow-style: none;
    -ms-scroll-chaining: chained;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-content-zoom-limit-min: 100%;
    -ms-content-zoom-limit-max: 500%;
    -ms-scroll-snap-type: proximity;
    -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);

    /* 定义滚动条轨道 */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    /* 定义滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: $scrollBarSize;
      background-color: #eee;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);

      &:hover {
        background-color: #dddddd;
      }

      &:active {
        background-color: #bbbbbb;
      }
    }
  }

  /** 暗色系滚动条样式 */
  &.dark ul.ant-menu {
    &::-webkit-scrollbar-thumb {
      background-color: #666666;

      &:hover {
        background-color: #808080;
      }

      &:active {
        background-color: #999999;
      }
    }
  }
  // trigger
  .trigger{
    color: #2F53EA;
    margin-top: 20px;
    margin-left: 50%;
    position: relative;
    left: -29px;
  }
}
/* update_end author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
</style>
