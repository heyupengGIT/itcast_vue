// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入element-ui    看文档
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入index.css
import '@/assets/css/index.css'
import moment from 'moment'
// 引入全局的axios
import myaxios from '@/plugins/MyAxios'

// 注册插件 看文档
Vue.use(ElementUI)
// 注册全局的axios的插件
Vue.use(myaxios)

// 全局过滤器 格式化日期
Vue.filter('fmtDate', (value, fmtString) => {
  return moment(value).format(fmtString)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
