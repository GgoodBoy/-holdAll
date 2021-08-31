import Qs from 'qs';
import {getCookie,delCookie} from '../utils/cache.js'

let Element;
if(process.client){
  Element = require('element-ui')
}
const notMessage = [
  '/user/loginByPwd',
  '/user/loginBySms',
  '/user/signUp',
  '/common/verifySmsCode',
  '/common/verifyImgCode',
  '/user/relatedCellphone',
  '/course/getResourcesUrl',
  '/course/saveLearningProgres',
  '/course/getInfo',
  '/course/getPeriodList',
  '/course/getBuyOrderState',
  '/doubleEleven/receiveCoupon'
]
export default ({req,app}) => {
  let axios = app.$axios;
  // 基本配置

  // let baseUrl = process.env.NODE_ENV=='development'?'http://localhost:3000':'https://www.xueguoxue.com'
  let baseUrl = '';
  if(process.env.ENVIRONMENT==='development'){
    baseUrl = 'http://localhost:3000'
  }else if(process.env.ENVIRONMENT==='beta'){
    baseUrl = 'https://dev.xueguoxue.com'
  }else if(process.env.ENVIRONMENT==='production'){
    baseUrl = 'https://www.xueguoxue.com'
  }
  axios.defaults.baseURL = baseUrl;
  axios.defaults.transformRequest = [function (data) {
    data = Qs.stringify(data)
    return data
  }]
  axios.interceptors.request.use((config)=>{
    if(process.client){
      let user = getCookie('xgx_user')?JSON.parse(getCookie('xgx_user')):null;
      if(user){
        config.headers.token = user.token;
        config.headers.userId = user.userId;
        if(config.method=='get'){
          if(config.params){
            config.params.userId = user.userId
          }
        }else{
          config.data.userId = user.userId;
        }
      }
    }else{
      if(req&&req.headers&&req.headers.cookie&&req.headers.cookie.includes("xgx_user")){
        let temp = req.headers.cookie.match(/xgx_user={(\S*)}/)[1]
        let user = JSON.parse('{'+temp+'}')
        config.headers.token = user.token;
        config.headers.userId = user.userId;
        if(config.method=='get'){
          if(config.params){
            config.params.userId = user.userId
          }
        }else{
          config.data.userId = user.userId;
        }
      }
    }
    config.url+=config.url.indexOf('?')>=0?('&_t=' + new Date().getTime()):'?_t=' + new Date().getTime()
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  axios.interceptors.response.use(
    response => {
      if(process.client){
        if(response.data.status==200){

        }else{
          if(response.data.status==401){
            delCookie('xgx_user')
            setTimeout(()=>{
              window.location.href = window.location.origin + '/auth/login';
            },2000)
          }else{
            let obj = notMessage.find(item=>response.config.url.includes(item))
            !obj && Element.Message.error(response.data.message)
          }
        }
        if(response.data.message=='请登录后操作'){
          window.location.href = window.location.origin + '/home';
        }
      }
      return response
    },
    error => {
      // Message.error('服务器崩溃啦')
      return Promise.reject(error)
    }
  )
};
