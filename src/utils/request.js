import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import {Modal, notification} from 'ant-design-vue'
import { ACCESS_TOKEN, CURRENT_GENKEY } from "@/store/mutation-types"
import { aesUtil } from '@/utils/aes'
import qs from 'qs'


// 创建 axios 实例
const service = axios.create({
  baseURL: '/ecidi-cmp', // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log("------异常响应------",token)
    console.log("------异常响应------",error.response.status)
    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问',duration: 4})
        break
      case 500:
        //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if(token && data.message=="Token失效，请重新登录"){
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
          // store.dispatch('Logout').then(() => {
          //     window.location.reload()
          // })
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
              })
            }
          })
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
        }
        break
      case 404:
          // notification.error({ message: '系统提示', description:'很抱歉，资源未找到!',dur0ation: 4})
          notification.error({ message: '系统提示', description: h => {
            return h('span', null, [h('span', null, "很抱歉，"), h('a', {'attrs': {title: error.response.data.path}}, '资源'), h('span', null, "未找到!") ])
          }, duration: 4})
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时'})
        break
      case 401:
        notification.error({ message: '系统提示', description:'未授权，请重新登录',duration: 4})
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ 'X-Access-Token' ] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  if(config.method=='get'){
    if (Vue.ls.get(CURRENT_GENKEY) != null) {
      config.params = {
        _t: Date.parse(new Date())/1000,
        ...config.params
      }
      config.params = ({
        data: aesUtil.encrypt(config.params, Vue.ls.get(CURRENT_GENKEY))
      })
    } else {
      config.params = {
        _t: Date.parse(new Date())/1000,
        ...config.params
      }
    }
    
  }
  if (config.method=='post' && config.url != '/sys/loginEncry' && config.url != '/sys/login') {
    if (Vue.ls.get(CURRENT_GENKEY) != null) {
      if (typeof(config.data) == "string") {
        config.data = qs.stringify({
          data: aesUtil.encrypt(decodeURIComponent(config.data), Vue.ls.get(CURRENT_GENKEY))
        })
      } else if (config.data == undefined) {
        config.data = qs.stringify({
          data: aesUtil.encrypt(config.params, Vue.ls.get(CURRENT_GENKEY)),
        })
        delete config.params;
      } else {
        config.data = ({
          data: aesUtil.encrypt(config.data, Vue.ls.get(CURRENT_GENKEY))
        })
      }
    }                                                                                                                                                                       
  }
  return config
},(error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
  }, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}