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
    sendSms:'/common/getCodeForLoginBySMS',//发送短信
    login:'/login/loginBySMS',//登录
    receiveCoupon:'/common/receiveCoupon',//领取优惠券
    verifyIsComplete:'/caiGenTan/verifyIsComplete',//菜根谭-验证活动是否完成
    receiveBook:'/caiGenTan/receiveBook',//菜根谭-领取图书
    receiveInfo:'/caiGenTan/receiveInfo',//菜根谭-获取领取详情
    getUserInfoById:'/user/getUserInfoById',
    pointPage:'/caiGenTan/pointPage',//菜根谭-活动访问统计
    pointButton:'/caiGenTan/pointButton',//BUTTON 打点
}