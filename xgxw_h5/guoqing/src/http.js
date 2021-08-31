import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import utils from './utils'
let setTimeoutArr = [ ];
let timeout = 60000;
axios.defaults.timeout = timeout;
let baseUrl1 = process.env.NODE_ENV=='production'?'https://xgxapi.xueguoxue.com':'https://scapi.youfushuyuan.com'
let baseUrl2 = process.env.NODE_ENV=='production'?'https://loginapi.xueguoxue.com':'https://loginapi.youfushuyuan.com'
let baseUrl3 = process.env.NODE_ENV=='production'?'https://courseapi.xueguoxue.com':'https://courseapi.youfushuyuan.com'
axios.defaults.baseURL = baseUrl1
axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest', 
    "Content-Type": "application/json;charset=utf-8"
};
axios.interceptors.request.use(
	config =>{
        if(config.url.includes('mobileCourses')){
            config.baseURL = baseUrl3
        }
        if(config.url.includes('/login/loginBySMS')){
            config.baseURL = baseUrl2
        }
        let uInfo = utils.getUser();
        let token = uInfo ? uInfo.accessToken : '';
        let userId = uInfo ? uInfo.id  : '';
        if(token){
            config.headers['token'] = token;
            config.headers['userId'] = userId;
        }
        config.url+=config.url.indexOf('?')>=0?('&_t=' + new Date().getTime()):'?_t=' + new Date().getTime()
		if (config.method === 'post' && config.headers['Content-Type'].includes("application/json")) {
            config.data.tokenType = "2";
            config.data.registerSource = 3;
            if(uInfo){
                config.data.userId = userId;
            }
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
        if(response.data.status==555){
            if(response.data.message=='系统异常'){

            }else{
                if(response.data.message.includes('过期')||response.data.message.includes('登录')){
                    utils.delUser()
                    window.location.replace('https://xgxm.xueguoxue.com/h5/nationalDay/index.html#/index')
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
