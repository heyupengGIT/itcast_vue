import axios from 'axios'
const MyAxios = {}
MyAxios.install = function (Vue) {
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
<<<<<<< HEAD
    
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
=======
      // 设置axios的拦截器
  // Add a request interceptor
  // 请求的拦截器
  // 发送请求之前，判断当前请求是否是login，如果是登录继续执行
  // 如果不是login，设置请求头中的Authorization
  axios.interceptors.request.use(function (config) {
    // 获取到当前请求的路径
    // 设置请求头
    // console.log(config);
    // console.log(config.headers);
    // console.log(config.url);
    if (config.url.toLocaleLowerCase() !== 'login') {
      // 设置请求头
      const token = sessionStorage.getItem('token')
      config.headers.Authorization = token;
    }

    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  });

  // Add a response interceptor
  // 响应的拦截器
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error)
  })
>>>>>>> dev-rights

    axios.interceptors.response.use(function (response) {
        return response
    },function (error) {
        return Promise.reject(error)
    })

    // 给vue实例添加一个成员$http
    Vue.prototype.$http = axios
}
export default MyAxios