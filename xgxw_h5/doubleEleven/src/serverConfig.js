let env,appId
if (process.env.NODE_ENV == 'development'){
    env = 'dev';
}
else{
    if(process.env.argv=='beta'){
        env = 'beta';
        appId='wxfd920b9cc0f222c4'//仿生 
    }else{
        env = 'prod';
        appId = 'wx44e94e1ef84f486e' //线上
    }
}
export default{
    env,
    appId,
    sendSms:'/common/getCodeForLoginBySMS',//发送短信
    login:'/login/loginBySMS',//登录
    getCouponInfo:'/doubleEleven/getCouponInfo',//获取优惠券
    receiveCoupon:'/doubleEleven/receiveCoupon',//领取优惠券
    searchCourseList:'/doubleEleven/searchCourseList',//查询课程
    getclassifyId:'/doubleEleven/getclassifyId',//获取分类
}