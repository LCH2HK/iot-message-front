import Vue from 'vue'
import {
  login,
  loginEncry,
  loginByPhone,
  loginByPhoneEncry,
  loginByWechat,
  logout
} from '@/api/login'
import {
  ACCESS_TOKEN,
  USER_NAME,
  USER_INFO,
  USER_AUTH,
  SYS_BUTTON_AUTH,
  CURRENT_GENKEY
} from '@/store/mutation-types'
import {
  welcome
} from '@/utils/util'
import {
  queryPermissionsByUser
} from '@/api/api'
import {
  putAction,
  postAction,
  getAction
} from '@/api/manage' // axios方法

const user = {
  state: {
    token: '',
    username: '',
    realname: '',
    welcome: '',
    avatar: '',
    permissionList: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      username,
      realname,
      welcome
    }) => {
      state.username = username
      state.realname = realname
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 账号登录
    Login ({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        if (typeof (userInfo) == 'string') {
          // 调用login api
          loginEncry(userInfo).then(response => {
            if (response.code == '200') {
              // 获取数据成功
              const result = response.result
              const userInfo = result.userInfo
              // 存入信息到 storage,有效时间 7 天
              Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
              // 存入信息到vuex store中
              commit('SET_TOKEN', result.token)
              commit('SET_INFO', userInfo)
              commit('SET_NAME', {
                username: userInfo.username,
                realname: userInfo.realname,
                welcome: welcome()
              })
              commit('SET_AVATAR', userInfo.avatar)
              resolve(response)
            } else {
              reject(response)
            }
          }).catch(error => {
            reject(error)
          })
        } else {
          // 调用login api
          login(userInfo).then(response => {
            if (response.code == '200') {
              // 获取数据成功
              const result = response.result
              const userInfo = result.userInfo
              // 存入信息到 storage,有效时间 7 天
              Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
              // 存入信息到vuex store中
              commit('SET_TOKEN', result.token)
              commit('SET_INFO', userInfo)
              commit('SET_NAME', {
                username: userInfo.username,
                realname: userInfo.realname,
                welcome: welcome()
              })
              commit('SET_AVATAR', userInfo.avatar)
              resolve(response)
            } else {
              reject(response)
            }
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 短信登录
    LoginByPhone ({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        if (userInfo.indexOf('identifyCode') == -1) {
          loginByPhoneEncry(userInfo).then(response => {
            if (response.code == '200') {
              const result = response.result
              const userInfo = result.userInfo
              Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', result.token)
              commit('SET_INFO', userInfo)
              commit('SET_NAME', {
                username: userInfo.username,
                realname: userInfo.realname,
                welcome: welcome()
              })
              commit('SET_AVATAR', userInfo.avatar)
              resolve(response)
            } else {
              reject(response)
            }
          }).catch(error => {
            reject(error)
          })
        } else {
          loginByPhone(userInfo).then(response => {
            if (response.code == '200') {
              const result = response.result
              const userInfo = result.userInfo
              Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', result.token)
              commit('SET_INFO', userInfo)
              commit('SET_NAME', {
                username: userInfo.username,
                realname: userInfo.realname,
                welcome: welcome()
              })
              commit('SET_AVATAR', userInfo.avatar)
              resolve(response)
            } else {
              reject(response)
            }
          }).catch(error => {
            reject(error)
          })
        }
      })
    },

    // 其他登陆登录
    LoginByOther ({
      commit
    }, otherLoginCode) {
      return new Promise((resolve, reject) => {
        getAction('/sys/callbackCheck?otherLoginCode=' + otherLoginCode, {})
          .then(response => {
            if (response.code == '200') {
              console.log(response)
              const result = response.result
              const userInfo = result.userInfo
              Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', result.token)
              commit('SET_INFO', userInfo)
              commit('SET_NAME', {
                username: userInfo.username,
                realname: userInfo.realname,
                welcome: welcome()
              })
              commit('SET_AVATAR', userInfo.avatar)
              resolve(response)
            } else {
              resolve(response)
            }
          }).catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetPermissionList ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        let v_token = Vue.ls.get(ACCESS_TOKEN)
        // let projectMessage = Vue.ls.get('PROJECT_MESSAGE') || ''
        let projectMessage = JSON.parse(sessionStorage.getItem('PROJECT_MESSAGE')) || ''
        let params = {
          token: v_token,
          projectId: projectMessage.id || ''
        }
        queryPermissionsByUser(params).then(response => {
          const menuData = response.result.menu
          const authData = response.result.auth
          const allAuthData = response.result.allAuth
          // Vue.ls.set(USER_AUTH,authData);
          sessionStorage.setItem(USER_AUTH, JSON.stringify(authData))
          sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))
          if (menuData && menuData.length > 0) {
            commit('SET_PERMISSIONLIST', menuData)
          } else {
            reject('getPermissionList: permissions must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({
      commit,
      state
    }) {
      return new Promise((resolve) => {
        let logoutToken = state.token
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONLIST', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove(CURRENT_GENKEY)
        // Vue.ls.remove('PROJECT_MESSAGE')
        sessionStorage.removeItem('PROJECT_MESSAGE')
        logout(logoutToken).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
