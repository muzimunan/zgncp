import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import './cache'// 页面缓冲
import router from './router/router'
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion } from '@/config/env'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import AvueFormDesign from '@sscfaith/avue-form-design'
import basicContainer from './components/basic-container/main'
import Print from 'vue-print-nb'
import { numberToCurrencyNo } from '@/filters/numberToCurrency'
// 配置全局过滤器，实现数字千分位格式
Vue.filter('numberToCurrency', numberToCurrencyNo)
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 防止浏览器出现缓存begin
// eslint-disable-next-line no-undef
const VUE_APP_VERSION = require('../package.json').version
const vers = window.localStorage.getItem('appVersion')
if (VUE_APP_VERSION !== vers) {
  localStorage.clear()
  window.localStorage.setItem('appVersion', VUE_APP_VERSION)
  location.reload()
}
// 防止浏览器出现缓存end
Vue.use(Print)
// 插件 json 展示
Vue.use(router)

Vue.use(AvueFormDesign)

window.axios = axios
Vue.use(VueAxios, axios)

Vue.use(ElementUI, {
  size: 'small',
  menuType: 'text'
})

// eslint-disable-next-line no-undef
Vue.use(AVUE, {
  size: 'small',
  menuType: 'text'
})

// 注册全局容器
Vue.component('basicContainer', basicContainer)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false
// 防抖处理-立即执行(全局的click增加防止重复点击)
const on = Vue.prototype.$on
Vue.prototype.$on = function(event, func) {
  let timer
  let flag = true
  let newFunc = func
  if (event === 'click') {
    newFunc = function() {
      if (flag) {
        func.apply(this, arguments)
        flag = false
      }
      clearTimeout(timer)
      timer = setTimeout(function() {
        flag = true
      }, 500)
    }
  }
  on.call(this, event, newFunc)
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
