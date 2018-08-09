import Vue from 'vue'
import Router from 'vue-router'
// 导入login.vue
import Login from '@/views/Login'
import Home from '@/views/Home'
import Users from '@/views/users/Users'
// 导入组件
Vue.use(Router)

export default new Router({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    {
      name: 'Home',
      path: '/',
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users }
      ]
    }
  ]
})
