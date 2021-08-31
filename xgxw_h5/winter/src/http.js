import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'

let timeout = 60000;
axios.defaults.timeout = timeout;
let baseUrl;
if(process.env.NODE_ENV=='production'){
    baseUrl = process.env.argv=='beta'?'https://scapi.youfushuyuan.com':'https://xgxapi.xueguoxue.com';
}else{
    baseUrl = 'https://scapi.youfushuyuan.com';
}
axios.defaults.baseURL = baseUrl
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest', 
    "Content-Type": "application/json;charset=utf-8"
};
axios.interceptors.request.use(
	config =>{
        config.url+=config.url.indexOf('?')>=0?('&_t=' + new Date().getTime()):'?_t=' + new Date().getTime()
		if (config.method === 'post' && config.headers['Content-Type'].includes("application/json")) {
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
        return response
    },
    error => {
        return Promise.reject(error)
    }
)
export default axios;
