import { reactive,provide, inject } from 'vue'
import axios from 'axios'
import { Toast } from 'vant'
let baseUrl,baseUrl2;
axios.defaults.timeout = 60000;
// if(process.env.NODE_ENV=='production'){
//     baseUrl = process.env.VUE_APP_MODE=='beta'?'https://scapi.youfushuyuan.com':'https://xgxapi.xueguoxue.com';
//     baseUrl2 = process.env.VUE_APP_MODE=='beta'?'https://loginapi.youfushuyuan.com':'https://loginapi.xueguoxue.com';
// }else{
    // baseUrl = 'https://scapi.youfushuyuan.com';
    // baseUrl2 = 'https://loginapi.youfushuyuan.com';
    baseUrl = 'https://xgxapi.xueguoxue.com';
    baseUrl2 = 'https://loginapi.xueguoxue.com';    
// }
axios.defaults.baseURL = baseUrl
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest', 
    "Content-Type": "application/json;charset=utf-8"
};
//请求拦截
axios.interceptors.request.use(
    config => {
        if(config.url.includes('/login/loginBySMS')){
            config.baseURL = baseUrl2
        }   
        if(config.token){
            config.headers['token'] = config.token;
            config.headers['userId'] = config.userId;
        }
        return config;
	},
    error => {
        return Promise.reject(error);
    }
)
//响应拦截
axios.interceptors.response.use(
    res => {
        if (res.status === 200) {
            const data = res.data
            if (data.status != 200 && !data.content) {
                Toast(data.message);
            }
            return res;
        }else{
            return Promise.reject(new Error(res.data.message || 'Error'));
        }
    },
    error => {
        return Promise.reject(error)
    }
)
export default axios