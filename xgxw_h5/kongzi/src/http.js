import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'


let setTimeoutArr = [ ];
let timeout = 60000;
axios.defaults.timeout = timeout;
// https://xgxapi.xueguoxue.com
let baseUrl = process.env.NODE_ENV=='production'?'https://xgxapi.xueguoxue.com':'https://scapi.youfushuyuan.com'
axios.defaults.baseURL = baseUrl
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest', 
    "Content-Type": "application/json;charset=utf-8"
};
axios.interceptors.request.use(
	config =>{
        config.url+=config.url.indexOf('?')>=0?('&_t=' + new Date().getTime()):'?_t=' + new Date().getTime()
		if (config.method === 'post' && config.headers['Content-Type'].includes("application/json")) {
            config.data.tokenType = "2";
            config.data.registerSource = 3;
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
        console.log("error",error)
        return Promise.reject(error)
    }
)
export default axios;
