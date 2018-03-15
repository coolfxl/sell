import axios from 'axios'
// import router from '../../router/index'

const baseURL = window.location.origin
if (process.env.NODE_ENV !== 'development') {
  axios.defaults.baseURL = baseURL
}

axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

/* 请求 request 拦截器 */
axios.interceptors.request.use((config) => {
  // 如果是post请求，将参数用&拼接起来
  if (config.method === 'post') {
    // config.data = ret.slice(0, ret.length - 1)
    console.log('进来了' + config.url)
  }
  // 如果是get请求，将参数写入url中
  if (config.method === 'get') {
    // config.data拿到请求参数
    // let url = config.url
    // let user_id = window.localStorage.getItem('user_id')
    // let ret = ''
    // ret = url + '/device_type/mobile/is_admin/1/user_id/' + user_id
    // config.url = ret
    // console.log(config.data);
    if (config.data) {
      let data = config.data
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      config.data = ret.slice(0, ret.length - 1)
      config.url += '?' + config.data
    }
  }
  // 给每个请求加上token
  // if (window.localStorage.getItem('token')) {
  //     config.headers.token = window.localStorage.getItem('token')
  // }
  return config
}, (error) => {
  alert('错误的传参', 'fail')
  return Promise.reject(error)
})

/* 反应 response 拦截器 */
// axios.interceptors.response.use((response) => { // 7token不存在
//   // console.log(response)
//   if (response.data.code == 9 || response.data.code == 8 || response.data.code == 7) {
//       window.localStorage.removeItem('token')
//       window.localStorage.removeItem('user_id')
//       console.log('进来了')
//       router.replace({
//           path: '/login',
//           query: {redirect: router.currentRoute.fullPath}
//       })
//       return Promise.reject(response.data.msg)
//   } else {
//       return response
//   }
// }, (error) => {
//   console.log(error)
// })

function http (url, method, params) {
  let met = ''
  if (method !== 'post') {
    met = 'get'
  } else {
    met = 'post'
  }
  if (params) {
    return new Promise((resolve, reject) => {
      axios({
        method: met,
        url: url,
        data: params
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      axios({
        method: met,
        url: url
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

// localhost:8080/api/echarts
export default {
  echarts (data) {
    return http('/api/autointerface/echarts', 'post', data)
  }
}
