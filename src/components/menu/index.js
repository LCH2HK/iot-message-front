import Menu from 'ant-design-vue/es/menu'

const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
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
    }
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted () {
    this.updateMenu()
  },
  watch: {
    menu () {
      if (this.menu.length > 0) {
        let item = this.menu.find(item => item.hidden !== true)
        this.selectedKeys = [
          item.path]
        this.$router.push({
          path: item.path
        })
      }
    },
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange (openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      const openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }
      // update-begin-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
      if (!this.selectedKeys || this.selectedKeys[0].indexOf(':') < 0) {
        this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
      }
      // update-end-author:taoyan date:20190510 for:online表单菜单点击展开的一级目录不对
    },

    // render路由列表
    renderItem (item) {
      // 如果item的hidden属性不为空
      if (!item.hidden) {
        // 如果item的children属性存在且hideChildrenInMenu属性不存在，则调用renderSubMenu()方法，否则调用renderMenuItem方法
        return item.children && !item.hideChildrenInMenu ? this.renderSubMenu(item) : this.renderMenuItem(item)
      }
      return null
    },
    // 没有子路由的
    renderMenuItem (menu) {
      const target = menu.meta.target || null
      const tag = (target && 'a') || 'router-link'
      let props = { to: { name: menu.name } }
      if (menu.route && menu.route === '0') {
        props = { to: { path: menu.path } }
      }

      const attrs = { href: menu.path, target: menu.meta.target }

      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }

      return (
        <Item {...{ key: menu.path }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </tag>
        </Item>
      )
    },
    // 有子路由的
    renderSubMenu (menu) {
      // console.log(menu)
      const itemArr = []
      // 如果item的hideChildrenInMenu属性不存在
      if (!menu.hideChildrenInMenu) {
        // 则将item的children路由数组的每一项再次调用renderItem,并将返回结果放入itemArr空数组中
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      // 返回一个子路由模板
      return (
        <SubMenu {...{ key: menu.path }}>
          <span slot="title">
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    // 渲染图标
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      // const props = {}
      /* typeof (icon) === 'object' ? props.component = icon : props.type = icon */
      /* return (
        <Icon {... { props } }/>
      ) */
      return (
        <img src={require(`@/assets/svg/${icon}.svg`)} ></img>
        // <embed id="embed" src={require(`@/assets/svg/${icon}.svg`)} type="image/svg+xml"></embed>
        // <object id="object" data={require(`@/assets/svg/${icon}.svg`)} type="image/svg+xml"></object>
      )
    }
  },
  // render函数
  render () {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys
    }

    const on = {
      select: obj => {
        console.log('on-->', obj)
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }
    // 根据后台返回的动态路由数据，生成模板，子路由层层递归
    const menuTree = menu.map(item => {
      // 如果menu的hidden属性存在，则返回空
      if (item.hidden) {
        return null
      }
      // 否则该项调用renderItem()方法
      return this.renderItem(item)
    })
    // {...{ props, on: on }}

    // 最后，渲染成DOM树
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
