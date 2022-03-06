import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Cookies from 'js-cookie'
import Element from 'element-ui'

// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import './icons' // icon
// import '@/icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import * as filters from './filters' // global filters

// 通过两种方式定义相对路径，并且省略了文件的后缀名。
// .方式
// 以父子目录的方式定义相对路径
//     . /指当前目录
//     . ./指当前目录的上一层目录
//
// @方式
// 以根目录的方式定义相对路径

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(Element, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
   // locale: enLang // 如果使用中文，无需设置，请删除
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)


// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
console.log('【./src/main.js】初始化VUE')
