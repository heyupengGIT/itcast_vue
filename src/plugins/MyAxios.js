import axios from 'axios'
const MyAxios = {}
MyAxios.install = function (Vue) {
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    
    // 请求的拦截器
    axios.interceptors.request.use(function (config) {
        // 获取到当前的请求路径
        // 设置请求头
        if (config.url.toLocaleLowerCase() !== 'login') {
            // 设置请求头
            const token = sessionStorage.getItem('token')
            config.headers.Authrization = token
        }
        return config
    },function (error) {
        return Promise.reject(error)
    })

    axios.interceptors.response.use(function (response) {
        return response
    },function (error) {
        return Promise.reject(error)
    })

    // 给vue实例添加一个成员$http
    Vue.prototype.$http = axios
}
export default MyAxios