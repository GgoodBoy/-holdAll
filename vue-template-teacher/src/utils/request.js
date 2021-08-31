import axios from 'axios'
import qs from 'qs'
import {
    Message
} from 'element-ui'
import store from '../store'
import {
    getToken,removeToken
} from '@/utils/auth'

const exportApi = ['/appHomePage/saveSubModule','/theKingOfKnowledge/importQuestionBank']//api报错不需要拦截，方便页面业务继续进行

let baseURL = process.env.NODE_ENV == 'production' ? process.env.BASE_API : 'https://sccms.youfushuyuan.com'
// let baseURL = process.env.NODE_ENV == 'production' ? process.env.BASE_API : 'http://172.16.120.6:8769'
// let baseURL = 'http://172.16.120.6:8769'
// let baseURL = 'http://devcms.youfushuyuan.com:8769'
// const arr = ['/api/course/constant'];
// 创建axios实例
const service = axios.create({
    baseURL: baseURL,
    transformRequest: [(data, headers) => {
        if (headers['Content-Type']!="multipart/form-data") {
            if (data && !data.transformRequest) {
                data = qs.stringify(data);
            } else if (data && data.transformRequest) {
                data = JSON.stringify(data)
            }
        }
        return data;
    }],
    validateStatus: function (status) {
        return status >= 200 && status < 300 ||
            status === 500 ||
            status === 502 ||
            status === 503 ||
            status === 401 ||
            status === 404 ||
            status === 403 ;
    }
     , timeout: 60000 // 请求超时时间
})
service.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest',
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
};
// request拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }       
        return config
    },
    error => {
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        let index = exportApi.findIndex(path=>response.config.url.includes(path))
        if (res.status !== 200&&res.status !== 417) {
            if(index>=0){
                return response.data
            }
            Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
            })
            if (res.status == 401) {
                removeToken();
                window.localStorage.removeItem('permissions')
                window.location.hash = '/login'
            }
            
            return Promise.reject('error')
        } else {
            return response.data
        }
        return response.data
    },
    error => {
        // window.location.hash = '/login'
        console.log(error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
