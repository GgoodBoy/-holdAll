import axios from 'axios'
import Vue from 'vue'
import {Toast} from 'vant'

axios.defaults.timeout = 10000;
let baseUrl = process.env.NODE_ENV=='production'?'https://xgxapi.xueguoxue.com':'https://scapi.youfushuyuan.com'
axios.defaults.baseURL = baseUrl
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest', 
    "Content-Type": "application/json;charset=utf-8"
};
axios.interceptors.request.use(
	config =>{
        config.url+=config.url.indexOf('?')>=0?('&_t=' + new Date().getTime()):'?_t=' + new Date().getTime()
        if (config.method === 'post') {
            config.data = JSON.stringify(config.data);                                    
        }
        return config;
	},
    err => {
        return Promise.reject(err);
    }
)
axios.interceptors.response.use(
    response => {
        if(response.data.status!=200){
            Toast.clear()
            // Toast(response.data.message)
        }
        return response
    },
    error => {
        Toast.clear()
        Toast('系统异常')
        return Promise.reject(error)
    }
)
export default axios;
