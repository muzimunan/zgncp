import axios from 'axios'
import { serialize } from '@/util/util'
import { getStore } from '@/util/store'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import router from '@/router/router'
import { Message } from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'
import store from '@/store' // progress bar style
axios.defaults.timeout = 30000
// 返回其他状态吗
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const MARKET_ID = getStore({ name: 'marketId' })
  const isToken = (config.headers || {}).isToken === false
  const token = store.getters.access_token
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token// token
  }
  if (MARKET_ID) {
    config.headers['MARKET-ID'] = MARKET_ID // 市场ID
  }

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }

  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
axios.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401) {
    Message({
      message: message,
      type: 'warning'
    })
    store.dispatch('LogOut').then(() => {
      router.push({ path: '/login' })
    })
    return
  }
  if (res.data.code === 2) {
    Message({
      message: message,
      type: 'warning'
    })
    return Promise.reject(new Error(message))
  }
  if (status !== 200) {
    Message({
      message: message,
      type: 'warning'
    })
    return Promise.reject(new Error(message))
  }

  return res
}, error => {
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default axios
