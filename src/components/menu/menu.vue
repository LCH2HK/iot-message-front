<template>
  <div class="su-menu-container">
    <div class="menu-scroll-wrapper" v-if="layoutMode === 'topmenu'">
      <!-- 一级菜单 -->
      <ul class="su-menu-list" ref="menuList">
        <li
          v-for="(item, index) in menu"
          :key="index"
          ref="secondaryMenu"
          class="su-menu-item"
          :class="{active: isActive == index}"
          v-show="item.meta.title !== '首页'"
        >
          <div v-if="item.children" class="item-container title-div">
            <!-- <img :src="require(`@/assets/img/icon/${item.meta.icon}.png`)" /> -->
            <img :src="renderIcon(item.meta.icon)"/>
            <span :title="item.meta.title">{{item.meta.title}}</span>
          </div>
          <keep-alive v-else class="item-container">
            <router-link :to="{name:item.name}" class="link">
              <div class="title-div">
                <!-- <img :src="require(`@/assets/img/icon/${item.meta.icon}.png`)" class="title-icon"/> -->
                <img :src="renderIcon(item.meta.icon)" class="title-icon"/>
                <span class="custom-title-style" :title="item.meta.title">{{item.meta.title}}</span>
              </div>
            </router-link>
          </keep-alive>

          <!-- 二级菜单 -->
          <ul v-if="item.children" class="secondMenu">
            <li
              v-for="(secondMenu, i) in item.children"
              :key="i"
              class="secondItem"
              :class="{checked: secondMenu.id == isChecked}"
            >
              <keep-alive v-if="secondMenu.meta.keepAlive">
                <router-link :to="{name:secondMenu.name}" v-if="!secondMenu.children">
                  <div :title="secondMenu.meta.title">{{secondMenu.meta.title}}</div>
                </router-link>
                <div class="secondMenuTitle" v-else>
                  {{secondMenu.meta.title}}
                  <span class="right-arrow"></span>
                </div>
              </keep-alive>

              <!-- 三级菜单 -->
              <ul v-if="secondMenu.children" class="thirdMenu">
                <li
                  v-for="(thirdMenu, key) in secondMenu.children"
                  :key="key"
                  class="thirdItem"
                  :class="{chosed:thirdMenu.id == ischosed}"
                >
                  <keep-alive>
                    <router-link :to="{name:thirdMenu.name}">
                      <div>{{thirdMenu.meta.title}}</div>
                    </router-link>
                  </keep-alive>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="menu-scroll-wrapper" v-if="layoutMode === 'topsidemenu'">
      <!-- topsidemenu布局顶部只有一级菜单 -->
      <ul class="su-menu-list FirstMenu" ref="menuList">
        <li
          v-for="(item, index) in menu"
          :key="index"
          ref="secondaryMenu"
          class="su-menu-item"
          :class="{active: isActive == index }"
          v-show="item.meta.title !== '首页'"
          @click="handleMenuItemClick(index, item)"
        >
          <div v-if="item.children" class="item-container title-div">
            <img :src="renderIcon(item.meta.icon)"/>
            <span :title="item.meta.title">{{item.meta.title}}</span>
          </div>
          <keep-alive v-else class="item-container">
            <!-- <router-link :to="{name:item.name}" class="link"> -->
            <router-link
              :to="{name:item.name}"
              class="link"
            >
              <div class="title-div">
                <img :src="renderIcon(item.meta.icon)" class="title-icon"/>
                <span class="custom-title-style" :title="item.meta.title">{{item.meta.title}}</span>
              </div>
            </router-link>
          </keep-alive>
        </li>
      </ul>
    </div>

    <div class="su-menu-control">
      <div class="scroll">
        <img src="@/assets/img/setting/up.png" @click="up"/>
        <img src="@/assets/img/setting/down.png" @click="down"/>
      </div>
      <!--      <div class="all">-->
      <!--        <img src="@/assets/img/setting/allmenu.png" @click="toggleAll" />-->
      <!--        <div class="out" ref="out" @mouseleave="hiddenAll">-->
      <!--          <div class="menu-wrapper">-->
      <!--            &lt;!&ndash; 一级菜单 &ndash;&gt;-->
      <!--            <ul class="su-menu-list FirstMenu" ref="FirstMenu">-->
      <!--              <li-->
      <!--                v-for="(item, index) in menu"-->
      <!--                :key="index"-->
      <!--                class="su-menu-item"-->
      <!--                :class="{active: isActive == index}"-->
      <!--                v-show="item.meta.title !== '首页'"-->
      <!--                @mouseover="getData(index)"-->
      <!--                @mouseleave="clearData()"-->
      <!--              >-->
      <!--                <div class="item-container">-->
      <!--                  &lt;!&ndash; <i class="iconfont icon-icon-1"></i> &ndash;&gt;-->
      <!--                  <div class="icon-title-container title-div">-->
      <!--                    <img :src="renderIcon(item.meta.icon)" />-->
      <!--                    <span class="first-title-content">{{item.meta.title}}</span>-->
      <!--                  </div>-->
      <!--                  <span class="right-arrow"></span>-->
      <!--                </div>-->

      <!--                &lt;!&ndash; 二级菜单 &ndash;&gt;-->
      <!--                <ul v-if="item.children" class="secondMenu" ref="SecondMenu">-->
      <!--                  <li-->
      <!--                    v-for="(secondMenu, i) in item.children"-->
      <!--                    :key="i"-->
      <!--                    class="secondItem"-->
      <!--                    :class="{checked: secondMenu.id == isChecked}"-->
      <!--                    @mouseover.stop.prevent="getDataSecond(secondMenu, i, index)"-->
      <!--                  >-->
      <!--                    <div class="second-item-wrapper">-->
      <!--                      <keep-alive v-if="secondMenu.meta.keepAlive">-->
      <!--                        <router-link :to="{name:secondMenu.name}" v-if="!secondMenu.children">-->
      <!--                          <div>{{secondMenu.meta.title}}</div>-->
      <!--                        </router-link>-->
      <!--                        <div class="secondMenuTitle" v-else>-->
      <!--                          <span class="title-content">{{secondMenu.meta.title}}</span>-->
      <!--                          <span class="right-arrow"></span>-->
      <!--                        </div>-->
      <!--                      </keep-alive>-->
      <!--                    </div>-->

      <!--                    &lt;!&ndash; 三级菜单 &ndash;&gt;-->
      <!--                    <ul v-if="secondMenu.children" class="thirdMenu" ref="ThirdMenu">-->
      <!--                      <li-->
      <!--                        v-for="(thirdMenu, key) in secondMenu.children"-->
      <!--                        :key="key"-->
      <!--                        class="thirdItem"-->
      <!--                      >-->
      <!--                        <div class="third-item-wrapper">-->
      <!--                          <keep-alive>-->
      <!--                            <router-link :to="{name:thirdMenu.name}">-->
      <!--                              <div>{{thirdMenu.meta.title}}</div>-->
      <!--                            </router-link>-->
      <!--                          </keep-alive>-->
      <!--                        </div>-->
      <!--                      </li>-->
      <!--                    </ul>-->
      <!--                  </li>-->
      <!--                </ul>-->
      <!--              </li>-->
      <!--            </ul>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>

    <!-- 弹出框 -->
  </div>
</template>

<script>
export default {
  name: 'SuMenu',
  data () {
    return {
      menuTop: 0,
      menuheight: 0, // 菜单实际高度
      isActive: null,
      isChecked: null,
      ischosed: null,
      visible: false,
      activePath: ''
    }
  },
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    layoutMode: {
      type: String,
      required: false,
      default: 'topmenu'
    }
  },
  watch: {
    menuheight: function (val) {
      this.menuheight = val
      this.$refs.menuList.style.top = 0
    },
    // 监控isActive，在点击tab标签时，依旧可以更新左侧菜单栏的数据  2020.6.11 by jxk
    isActive (newVal) {
      console.log('!!!!!!!!!!!!!!!!!!!!', newVal)
      if (newVal !== null) {
        this.$emit('menuItemChange', this.menu[this.isActive].children)
      }
    },
    // 监控路由，根据路由的变化来改变菜单栏的背景和字体颜色
    '$route.path': function (newVal, oldVal) {
      this.viewChange(newVal)
      // let returnFlag = false
      // this.menu.forEach(item => {
      //   if (item.children !== undefined) {
      //     item.children.forEach(ele => {
      //       if (ele.path === this.$route.fullPath) {
      //         this.activePath = item.path
      //         returnFlag = true
      //       }
      //     })
      //   } else {
      //     if (item.path === this.$route.fullPath) {
      //       this.activePath = item.path
      //       return false
      //     }
      //   }
      // })
    }
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        if (this.$refs.menuList) {
          this.menuheight = this.$refs.menuList.clientHeight
        }
      })()
    }
    this.viewChange(this.$route.path)
    if (this.isActive !== null) {
      this.$emit('menuItemChange', this.menu[this.isActive].children)
    }
    // let returnFlag = false
    // for (let i = 0; i < this.menu.length; i++) {
    //   if (this.menu[i].children !== undefined) {
    //     this.menu[i].children.forEach(ele => {
    //       if (ele.path === this.$route.fullPath) {
    //         this.activePath = this.menu[i].path
    //         returnFlag = true
    //         return false
    //       }
    //     })
    //     if (returnFlag) {
    //       return false
    //     }
    //   } else {
    //     if (this.menu[i].path === this.$route.fullPath) {
    //       this.activePath = this.menu[i].path
    //       return
    //     }
    //   }
    // }
  },
  methods: {
    handleMenuItemClick (index, item) {
      console.log('handleMenuItemClick-index', index)
      console.log('handleMenuItemClick-item', item)
      console.log('handleMenuItemClick-this.$route.fullPath', this.$route.fullPath)
      console.log('handleMenuItemClick-this.activePath', this.activePath)
      this.isActive = index
      // 将子菜单数据传给侧边栏
      this.$emit('menuItemChange', item.children)
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      return require(`@/assets/img/icon/${icon}.png`)
    },
    up () {
      this.$refs.menuList.style.top = `${this.menuTop}px`
      let top = this.$refs.menuList.style.top
      console.log('top1 =>', top)
      top = Number(top.replace('px', ''))
      console.log('top2 =>', top)
      const menuHeight = this.$refs.menuList.clientHeight
      console.log('menuHeight =>', menuHeight)
      if (top < 0) {
        top += 84
        this.$refs.menuList.style.top = top + 'px'
        this.menuTop = top
      } else {
        top = 84 - menuHeight
        this.$refs.menuList.style.top = top + 'px'
        this.menuTop = top
      }
    },
    down () {
      this.$refs.menuList.style.top = `${this.menuTop}px`
      let top = this.$refs.menuList.style.top
      console.log('top1 =>', top)
      top = Number(top.replace('px', ''))
      console.log('top2 =>', top)
      const menuHeight = this.$refs.menuList.clientHeight
      console.log('menuHeight =>', menuHeight)
      if (menuHeight + top > 84) {
        top += -84
        this.$refs.menuList.style.top = top + 'px'
        this.menuTop = top
      } else {
        top = 0
        this.$refs.menuList.style.top = top + 'px'
        this.menuTop = top
      }
    },
    viewChange (val) {
      const firstMenu = this.menu
      if (firstMenu && firstMenu.length > 0) {
        firstMenu.forEach((firstItem, firstIndex) => {
          /* //if (firstItem.path && firstItem.path === '/roomList/roomListOrder') {
                        if (firstItem.path && firstItem.path === '/dashboard/analysis') {
                          this.clear()
                        } */
          if (firstItem.path === val) {
            this.isActive = firstIndex
          }
          if (firstItem.children && firstItem.children.length > 0) {
            const secondMenu = firstItem.children
            secondMenu.forEach((secondItem, secondIndex) => {
              if (secondItem.path && secondItem.path === val) {
                this.checked(secondItem, firstIndex)
              }
              if (secondItem.children && secondItem.children.length > 0) {
                const thirdMenu = secondItem.children
                thirdMenu.forEach((thirdItem, thirdIndex) => {
                  if (thirdItem.path && thirdItem.path === val) {
                    this.chosed(thirdItem, secondItem, firstIndex)
                  }
                })
              }
            })
          }
        })
      }
    },
    // 二级菜单颜色变化
    checked (item, index) {
      this.clear()
      this.isChecked = item.id
      this.isActive = index
    },
    // 三级菜单颜色变化
    chosed (thirdMenu, secondMenu, index) {
      this.ischosed = thirdMenu.id
      this.isChecked = secondMenu.id
      this.isActive = index
    },
    clear () {
      this.isChecked = null
      this.ischosed = null
      this.isActive = null
    },
    toggleAll () {
      this.visible = !this.visible
      if (this.visible == true) {
        this.$refs.out.style.visibility = 'visible'
      } else {
        this.$refs.out.style.visibility = 'hidden'
      }
      /* this.$refs.out.style.visibility = 'visible' */
    },
    hiddenAll () {
      this.visible = false
      this.$refs.out.style.visibility = 'hidden'
      /* this.$refs.out.style.visibility = 'visible' */
    },
    getData (index) {
      const firstLen = this.menu.length - 1
      const secondLen = this.menu[index].children ? this.menu[index].children.length : 0
      let height
      const length = firstLen > secondLen ? firstLen : secondLen
      height = length * 40 + 24 * 2 + (length - 1) * 12
      this.$refs.FirstMenu.style.height = height + 2 + 'px'
      this.$refs.FirstMenu.style.width = '418px'
      this.$refs.SecondMenu[index - 1].style.height = height - 48 + 'px'
    },
    clearData () {
      this.$refs.FirstMenu.style.height = 'unset'
      this.$refs.FirstMenu.style.width = '210px'
    },
    getDataSecond (secondMenu, i, index) {
      if (secondMenu.children && secondMenu.children.length > 0) {
        this.$refs.FirstMenu.style.width = '626px'
        const firstLen = this.menu.length - 1
        const secondLen = this.menu[index].children.length
        const thirdLen = secondMenu.children.length
        const len = Math.max(firstLen, secondLen, thirdLen)
        let height
        height = len * 40 + 24 * 2 + (len - 1) * 12
        this.$refs.FirstMenu.style.height = height + 2 + 'px'
        this.$refs.SecondMenu[index - 1].style.height = height - 48 + 'px'

        const length = this.$refs.ThirdMenu.length
        for (let i = 0; i < length; i++) {
          this.$refs.ThirdMenu[i].style.height = height - 48 + 'px'
        }
      } else {
        this.$refs.FirstMenu.style.width = '418px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .title-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 15px;
    height: 100%;
    img {
      width: 25px;
      height: 25px;
      margin: 0 12px;
      vertical-align: middle;
    }
  }

  .custom-title-style {
    font-size: 16px;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title-icon {
    margin: -5px 12px 0 12px;
  }

  .link {
    text-decoration: none;
  }

  .su-menu-container {
    display: flex;
    height: 84px;
    position: relative;
    overflow: hidden;
    // 右箭头
    span.right-arrow {
      position: relative;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-top: 1px solid #333333;
      border-right: 1px solid #333333;
      transform: rotate(45deg);
    }

    // 顶部导航条
    .menu-scroll-wrapper {
      flex: 1 1;
      position: relative;

      .su-menu-list.FirstMenu {
        position: absolute;
        top: 0;
        margin-bottom: 0;
        display: flex;
        flex-wrap: wrap;

        .su-menu-item {
          color: #fff;
          // padding: 18px 0;
          height: 84px;
          width: 140px;
          box-sizing: border-box;
          line-height: 30px;

          .item-container {
            span {
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              white-space: nowrap;
            }
          }

          .secondMenu {
            display: none;
          }

          &:hover {
            //& {
            .secondMenu {
              position: relative;
              display: block;
              background-color: #fff;
              width: 140px;
              border-radius: 4px;
              box-shadow: 0px 12px 16px 0px rgba(170, 170, 170, 0.4);
              padding: 17px 16px;
              z-index: 999;

              li.secondItem {
                position: relative;
                padding: 0 14px;

                & > a > div {
                  height: 44px;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis; //超出部分以省略号显示
                  white-space: nowrap;
                }

                .thirdMenu {
                  display: none;
                }

                &:hover .thirdMenu {
                  //& .thirdMenu {
                  display: block;
                  position: absolute;
                  top: 0;
                  background-color: #fff;
                  width: 200px;
                  max-height: 500px;
                  overflow-y: scroll;
                  right: -200px;
                  box-shadow: 0px 12px 16px 0px rgba(170, 170, 170, 0.4);
                  border-radius: 4px;
                  padding: 16px;

                  @scrollBarSize: 1px;

                  &::-webkit-scrollbar {
                    width: @scrollBarSize;
                    height: @scrollBarSize;
                    background-color: transparent;
                  }

                  &::-webkit-scrollbar-track {
                    background-color: #f0f0f0;
                  }

                  &::-webkit-scrollbar-thumb {
                    background-color: #eee;
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

                    &:hover {
                      background-color: #bbb;
                    }

                    &:active {
                      background-color: #888;
                    }
                  }

                  .thirdItem {
                    height: 44px;

                    a {
                      display: inline-block;
                      width: 100%;
                      padding: 0 14px;

                      div {
                        width: 100%;
                        height: 44px;
                        overflow: hidden;
                        text-overflow: ellipsis; //超出部分以省略号显示
                        white-space: nowrap;
                      }
                    }
                  }

                  .thirdItem:hover,
                  .thirdItem.chosed {
                    border-radius: 4px;
                    /* a {
                      background: rgba(109, 98, 255, 0.1);
                    } */
                  }
                }

                div.secondMenuTitle {
                  color: #333333;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  /* span.right-arrow {
                    position: relative;
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-top: 1px solid #333333;
                    border-right: 1px solid #333333;
                    transform: rotate(45deg);
                  } */
                }

                a {
                  color: #333333;
                  text-decoration: none;
                }

                &:hover,
                &.checked {
                  /* background: rgba(109, 98, 255, 0.1); */
                  border-radius: 4px;
                }
              }
            }
          }

          & > .item-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 100%;
            img {
              width: 25px;
              height: 25px;
              margin: 0 12px;
            }

            span {
              font-size: 16px;
            }
          }

          &:hover .item-container,
          &.active .item-container {
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }
        }
        .active {
          div {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }
        }
        :hover {
           div {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }
        }
      }
    }

    // 控制按钮
    .su-menu-control {
      width: 104px;
      display: flex;

      .scroll {
        height: 84px;
        width: 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 24px;

        img {
          height: 8px;
          width: 16px;
          opacity: 0.4;

          &:hover {
            cursor: pointer;
            opacity: 1;
          }
        }
      }

      .all {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: 84px;

        & > img {
          width: 16px;
          height: 16px;
          opacity: 0.4;

          &:hover {
            cursor: pointer;
            opacity: 1;
          }
        }
      }
    }

    // 弹出导航
    .out {
      visibility: hidden;
      z-index: 99999;

      ul.su-menu-list.FirstMenu {
        box-shadow: 0px 12px 16px 0px rgba(170, 170, 170, 0.4);
        border-radius: 4px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 61px;
        left: -320px;
        padding: 24px 0 12px;
        background-color: #fff;
        max-height: 800px;
        overflow-y: scroll;

        @scrollBarSize: 0px;

        &::-webkit-scrollbar {
          width: @scrollBarSize;
          height: @scrollBarSize;
          background-color: transparent;
        }

        &::-webkit-scrollbar-track {
          background-color: #f0f0f0;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #eee;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

          &:hover {
            background-color: #bbb;
          }

          &:active {
            background-color: #888;
          }
        }

        & > li.su-menu-item {
          width: 208px;
          height: 52px;
          padding: 0 24px;
          font-size: 16px;
          background-color: #fff;
          cursor: pointer;
          // 一级菜单图标、标题和右箭头
          .item-container {
            height: 40px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 4px;

            .icon-title-container {
              display: flex;
              align-items: center;

              img {
                width: 22px;
                height: 22px;
                margin-right: 3px;
              }
            }
          }

          ul.secondMenu {
            display: none;
          }

          &:hover ul.secondMenu {
            //&:nth-child(8) > ul.secondMenu{
            display: block;
            position: absolute;
            top: 0;
            left: 208px;
            width: 208px;
            /* right: -208px; */
            background-color: #fff;
            border-left: 1px solid rgba(238, 238, 238, 1);
            /* padding: 24px 0 12px; */
            margin: 24px 0;

            & > li.secondItem {
              background-color: #fff;
              height: 52px;
              padding: 0 24px;

              & > div.second-item-wrapper {
                height: 40px;
                display: flex;
                align-items: center;
                border-radius: 4px;
                padding: 0 16px;

                & > div.secondMenuTitle {
                  height: 40px;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                }
              }

              &:hover > ul.thirdMenu {
                //& > ul.thirdMenu{
                display: block;
                position: absolute;
                width: 208px;
                background-color: #fff;
                top: 0;
                right: -208px;
                border-left: 1px solid rgba(238, 238, 238, 1);

                & > li.thirdItem {
                  background-color: #fff;
                  height: 52px;
                  padding: 0 24px;

                  & > div.third-item-wrapper {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    border-radius: 4px;
                    /* padding: 0 16px; */

                    a {
                      padding: 0 16px;
                    }
                  }
                }
              }
            }

            ul.thirdMenu {
              display: none;
            }

            a > div {
              height: 40px;
              line-height: 40px;
              width: 128px;
              overflow: hidden;
              text-overflow: ellipsis; //超出部分以省略号显示
              white-space: nowrap;
            }

            span.title-content {
              height: 40px;
              line-height: 40px;
              width: 118px;
              overflow: hidden;
              text-overflow: ellipsis; //超出部分以省略号显示
              white-space: nowrap;
            }
          }
        }
      }

      span.first-title-content {
        height: 40px;
        line-height: 40px;
        max-width: 90px;
        overflow: hidden;
        text-overflow: ellipsis; //超出部分以省略号显示
        white-space: nowrap;
        margin-left: 5px;
      }
    }
  }
</style>
