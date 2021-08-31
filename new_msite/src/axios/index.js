import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import { SetCookies ,  GetCookies, DelCookies } from '../utils/setCookies.js'
import Toast from 'vant/lib/toast';
import 'vant/lib/toast/style';
import Dialog from 'vant/lib/dialog';
import 'vant/lib/dialog/style';

const includeArr = [
    '/user/login',
    '/common/sendSMS',
    '/user/modifyPassword',
    '/user/register',
    '/home/getAppIndexConfigs',
    '/courses/getPurchasedPageList',
    'user/updateInfo',
    '/courses/getTrySeePeriodList',
    '/user/buyCoins',
    '/courses/buyCourse',
    '/user/getCouponsInfoById',
    '/user/updateInfo',
    '/user/addWithdrawalsRecord',
    '/user/getUserWithdrawCashInfo',
    
]//需要显示loading的接口
const excludeArr = [
    '/home/getAppIndexConfigs',
    '/home/getUnreadMessageNum',
    '/courses/getPurchasedPageList',
    '/user/getUserInfoById',
    '/user/getUserCouponsNum',
    '/user/refreshUserTokenDeadline',
    '/home/getCommonProblemList',
    '/user/getLearningCardInfo',
    '/user/addIntegral'
]//code为401,不需要登录的接口
const noToastArr = [
    '/user/getCouponsInfoById',
    '/courses/getPeriodsInfo',
    '/common/getWechatOpenId/',
    '/courses/getCourseInfo',
    '/invitationSee/sharePeriodToFriends',
    '/invitationSee/receiveInvitationSharePeriod',
    '/common/getWechatOpenId',
    '/user/savePeriodStudyRecords',
    '/common/getShareDesc',
    '/member/buyMember',
    '/member/bind',
    '/information/getInfo'
]//code为500，不需要提示
const netWork = [
    '/user/savePeriodStudyRecords',
    '/user/addIntegral',
    '/common/upload/img'
]
let setTimeoutArr = [ ];
let timeout = 60000;
axios.defaults.timeout = timeout;
let baseUrl,baseURL1,baseURL2;
if(process.env.NODE_ENV=='production'){
    baseUrl = process.env.argv=='beta'?process.env.beta_API:process.env.prod_API
    baseURL1 = process.env.argv=='beta'?'https://courseapi.youfushuyuan.com':'https://courseapi.xueguoxue.com'
    baseURL2 = process.env.argv=='beta'?'https://loginapi.youfushuyuan.com':'https://loginapi.xueguoxue.com'
}else{
    baseUrl = process.env.beta_API
    baseURL1 = 'https://courseapi.youfushuyuan.com'
    baseURL2 = 'https://loginapi.youfushuyuan.com'
}
axios.defaults.baseURL = baseUrl;

axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest', 
    "Content-Type": "application/json;charset=utf-8"
};
axios.interceptors.request.use(
    config => {
        if(config.url.includes('mobileCourses')){
            config.baseURL = baseURL1
        }
        if(config.url.includes('/login/loginBySMS')||config.url.includes('/login/login')||config.url.includes('/login/register')){
            config.baseURL = baseURL2
        }
        config.url+=config.url.indexOf('?')>=0?('&_t=' + new Date().getTime()):'?_t=' + new Date().getTime()
        let loadingFlag;
        if(config.method=='post'){
            loadingFlag = config.data.loading && config.data.loading == 'false' ? false : true;
            if(config.data.loading){
                delete config.data.loading
            }
        }
        
        let cookie = GetCookies('uInfo');
        let token = cookie ? JSON.parse(cookie).accessToken : '';
        let userId = cookie ? JSON.parse(cookie).userid  : '';
        if(token){
            config.headers['token'] = token;
            config.headers['userId'] = userId;
        }
		if (config.method === 'post' && config.headers['Content-Type'].includes("application/json")) {
            config.data.tokenType = "2";//终端类型 1:APP端，2：M站，3：pc端
            config.data.registerSource = 3;//移动终端类型 1 ios_app 2 android_app 3 web_app
            if(userId){
                config.data.userId = userId;
            }
            if(config.url.includes('/courses/getResoursePlayUrl')){
                config.data.netType=2
            }
            config.data = JSON.stringify(config.data);                                    
        }
        let index = includeArr.findIndex(item=>config.url.includes(item))
        if(index>=0&&loadingFlag){
            setTimeoutArr[index] = setTimeout(()=>{
                Toast.loading({
                    forbidClick: true,
                    loadingType:'spinner',
                    duration:timeout
                });
            },1000)
        }
        return config;
	},
    err => {
        return Promise.reject(err);
    }
)
axios.interceptors.response.use(
    response => {
        let index = includeArr.findIndex(item => response.config.url.includes(item));
        var urlIsOk = response.config.url.includes('getPurchasedPageList');
        if(index>=0){
            Toast.clear();
            clearTimeout(setTimeoutArr[index])
        }
        if(response.data.status!= 200){
            if(response.data.status == 401){
                DelCookies('uInfo');
                let flag = excludeArr.find(item=>response.config.url.includes(item))
                if(!flag){
                    sessionStorage.setItem('rediectUrl',window.location.hash.split('#')[1]);
                    window.location.replace('/#/auth');
                }
            }else if(response.data.status==405){
                if(response.data.message!=''){
                    DelCookies('uInfo');
                    window.location.hash = 'login';
                    window.location.reload()
                }
            }else if((response.data.status==500||response.data.status==555)&&!urlIsOk){
                let noToastFlag = noToastArr.find(item=>response.config.url.includes(item))
                if(noToastFlag){
                    Toast.clear();
                }
                else{
                    if(response.data.message.includes('null')||response.data.message.length==0){

                    }
                    else
                        Toast(response.data.message)
                }
                if(response.data.message.includes('请重新登录')){
                    Toast.clear();
                    DelCookies("uInfo");
                    window.location.replace('/#/auth');
                }
                if(response.data.message.includes('个数限制')){
                    Toast.clear();
                    DelCookies("uInfo");
                    window.location.replace('/#/auth');
                }
            }
            else{
                if(response.data.message.includes('null')||response.data.message.length==0||urlIsOk){

                }else{
                    Toast(response.data.message)
                }
            }
        }
        return response
    },
    error => {
        console.log("error",error)
        Toast.clear();
        let flag = netWork.find(item=>error.config.url.includes(item))
        if(!flag)
            Toast('您的网络开了小差，请稍后再试！')
        return Promise.reject(error)
    }
)
export default axios;
