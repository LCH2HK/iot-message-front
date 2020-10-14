import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { generateIndexRouter } from '@/utils/util'
import { httpAction } from '@/api/manage'
import qs from 'qs'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/user/description', '/user/login', '/user/register', '/user/register-result'] // no redirect whitelist

localStorage.removeItem('fzRedirect')

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (to.fullPath.indexOf('X1') != -1 && to.fullPath.indexOf('X2') != -1) {
    // 方正平台跳转，如果有X1就重定向到方正的uri
    var str = to.fullPath.split('?')[1] // 包含X1和X2的字符串
    httpAction(
      '/sys/fzLogin',
      qs.stringify(
        // 方正登录，ad域登录验证
        {
          userName: str.split('&')[0].split('=')[1], // 用户名
          pwd: str.split('&')[1].split('=')[1] // 密码
        }
      ),
      'post'
    ).then(res => {
      if (res && res.code == 200) {
        localStorage.fzRedirect = to.path
        next({ path: '/user/login?redirect=' + to.path })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      } else {
        alert('身份验证失败！')
        next({ path: '/user/login?redirect=' + to.path })
        NProgress.done()
      }
    })
  } else if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      if (to.fullPath.indexOf('redirect') == -1 && !localStorage.fzRedirect)
      // 平台原有登录跳转
      {
        next({
          path: '/roomList/roomListOrder'
        })
      } else {
        // 方正平台跳转
        if (localStorage.fzRedirect) {
          next({ path: localStorage.fzRedirect })
        } else {
          // localStorage.fzRedirect = to.fullPath.split("redirect=")[1].replace(/%2F/g,"/");                      //方正平台跳转
          next({ path: to.fullPath.split('redirect=')[1].replace(/%2F/g, '/') })
        }
      }
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store
          .dispatch('GetPermissionList')
          .then(res => {
            const menuData = res.result.menu
            if (menuData === null || menuData === '' || menuData === undefined) {
              return
            }
            let constRoutes = []
            constRoutes = generateIndexRouter(menuData)
            // 添加主界面路由
            store
              .dispatch('UpdateAppRouter', {
                constRoutes
              })
              .then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({
                    ...to,
                    replace: true
                  })
                } else {
                  // 跳转到目的路由
                  next({
                    path: redirect
                  })
                }
              })
          })
          .catch(() => {
            /* notification.error({
              message: '系统提示',
              description: '请求用户信息失败，请重试！'
            }) */
            store.dispatch('Logout').then(() => {
              next({
                path: '/user/login',
                query: {
                  redirect: to.fullPath
                }
              })
            })
          })
      } else {
        if (localStorage.fzRedirect && to.path === '/iot/HomePage') {
          next({ path: localStorage.fzRedirect })
        } else {
          next()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      if (to.name == 'OnlineEdit' || to.name == 'OnlinePreview') {
        next({
          path: '/user/login',
          query: {
            // 将目的路由地址存入login的query中
            redirect: to.fullPath
          }
        })
      } else {
        next({
          // path: '/user/description', // 屏蔽信息介绍页
          path: '/user/login',
          query: {
            redirect: to.fullPath
          }
        })

        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
  // 方正平台登录才会带有X1
  if (window.location.href.indexOf('X1') != -1 && window.location.href.indexOf('X2') != -1) {
    var str = window.location.href.split('?')[1]
    var a = setInterval(function () {
      if ($('.login-button')) {
        $('#username').val('')
        $('#password').val('')
        console.log(str.split('&')[0].split('=')[1])
        console.log(str.split('&')[1].split('=')[1])
        $('#username').val(str.split('&')[0].split('=')[1])
        $('#password').val(str.split('&')[1].split('=')[1])
        $('.login-button').click()
      }
      clearInterval(a)
    }, 500)
  } else {
    localStorage.removeItem('fzRedirect')
  }
})
