let env,appId;
if (process.env.NODE_ENV == 'production') {
    if(process.env.VUE_APP_MODE=='beta'){
        env = 'beta';
        appId='wxfd920b9cc0f222c4'//仿生
    }else{
        env = 'prod';
        appId = 'wx44e94e1ef84f486e' //线上
    }
}
export default {
    env,
    appId,
    sendSms:'/common/getCodeForLoginBySMS',//发送验证码
    login:'/login/loginBySMS',//登录
    getWechatOpenId: '/common/getWechatOpenId',//根据微信code获取openId
    
    getPackLotteryRecord: '/hbzd/lotteryRecord',//红包组队-抽奖记录
    getPackLottery:'/hbzd/lottery',//红包组队-抽奖
    getPackJoinHb: '/hbzd/joinHb',//红包组队-立即参与红包
    getPackShareActivity:'/hbzd/shareActivity',//分享成功后接口
    getConfig: '/wx/getConfig',//获取微信分享配置
    //红包组队-button打点
    pointButton: '/hbzd/pointButton',
    //红包组队-访问页打点
    pointPage:'/hbzd/pointPage',
    //红包组队-访问打点
    pointVisit:'/hbzd/pointVisit',
}