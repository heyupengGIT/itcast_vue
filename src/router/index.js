import Vue from 'vue'
import Router from 'vue-router'
// 导入login.vue
import Login from '@/views/Login'
// 导入组件
Vue.use(Router)

export default new Router({
  routes: [
    { name: 'Login', path: '/login', component: Login }
  ]
})
