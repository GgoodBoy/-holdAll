import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import { DelCookies } from './setCookies.js'

let timeout = 60000;
axios.defaults.timeout = timeout;
let baseUrl,baseUrl2;
if(process.env.NODE_ENV=='production'){
    baseUrl = process.env.argv=='beta'?'https://scapi.youfushuyuan.com':'https://xgxapi.xueguoxue.com';
    baseUrl2 = process.env.argv=='beta'?'https://loginapi.youfushuyuan.com':'https://loginapi.xueguoxue.com';
}else{
    baseUrl = 'https://scapi.youfushuyuan.com';
    baseUrl2 = 'https://loginapi.youfushuyuan.com';
}
// let baseUrl = process.env.NODE_ENV=='production'?'https://scapi.youfushuyuan.com':'https://scapi.youfushuyuan.com'
// let baseUrl2 = process.env.NODE_ENV=='production'?'https://loginapi.youfushuyuan.com':'https://loginapi.youfushuyuan.com'
axios.defaults.baseURL = baseUrl
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest', 
    "Content-Type": "application/json;charset=utf-8"
};
axios.interceptors.request.use(
	config =>{
        if(config.url.includes('/login/loginBySMS')){
            config.baseURL = baseUrl2
        }
        if(config.token){
            config.headers['token'] = config.token;
            config.headers['userId'] = config.userId;
        }
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
        if(response.data.status!= 200){
            if(response.data.status == 401){
                DelCookies('uInfo');
            }else if(response.data.status==405){
                if(response.data.message!=''){
                    DelCookies('uInfo');
                }
            }
        }
        return response
    },
    error => {
        console.log("error",error)
        return Promise.reject(error)
    }
)
export default axios;
