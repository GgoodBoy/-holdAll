let env,appId,couponId;
if (process.env.NODE_ENV == 'development'){
    env = 'dev';
    couponId = '329'
}
else{
    if(process.env.argv=='beta'){
        env = 'beta';
        appId='wxfd920b9cc0f222c4'//仿生 
        couponId = '329'
    }else{
        env = 'prod';
        appId = 'wx44e94e1ef84f486e' //线上
        couponId = '181'
    }
}
export default{
    couponId,
    env,
    appId,
    getConfig:'/wx/getConfig',//获取微信分享配置
    sendSms:'/common/getCodeForLoginBySMS',//发送短信
    login:'/login/loginBySMS',//登录
    getclassifyId:'/doubleTwelve/getclassifyId',//获取分类
    searchCourseList:'/doubleTwelve/searchCourseList',//搜索课程
    getUserInfoById:'/user/getUserInfoById',//获取用户详情
    pointPage:'/doubleTwelve/pointPage',//访问页打点
    pointVisit:'/doubleTwelve/pointVisit',//访问次数
    pointButton:'/doubleTwelve/pointButton',//BUTTON 打点
    shakeIt:'/doubleTwelve/shakeIt',//摇一摇
    receiveCouponByType:'/doubleTwelve/receiveCouponByType',//领取无门槛或者满减优惠券
    receiveCourse:'/doubleTwelve/receiveCourse',//领取课程
    receiveCoupon:'/doubleTwelve/receiveCoupon',//领取优惠券
    shareAddTime:'/doubleTwelve/share',//分享增加摇一摇次数
    getShakeNum:'/doubleTwelve/getShakeNum',//获取分享次数
}