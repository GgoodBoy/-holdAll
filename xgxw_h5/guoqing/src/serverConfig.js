
let appId,env,link
// appId = 'wxfd920b9cc0f222c4';仿生
// appId = 'wx44e94e1ef84f486e'正式
if (process.env.NODE_ENV == 'development'){
    env = 'dev';
    appId = 'wxfd920b9cc0f222c4';
    link = 'https://scm.youfushuyuan.com/h5/nationalDay/index.html#/'
}else{
    env = 'build'
    appId = 'wx44e94e1ef84f486e'
    link = 'https://xgxm.xueguoxue.com/h5/nationalDay/index.html#/'
}

export default{
    appId,
    env,
    link,
    getOpenId: '/common/getWechatOpenId',//根据微信code获取openId
    login:'/login/loginBySMS',//登录
    sendSms:'/common/getCodeForLoginBySMS',//发送验证码
    getBuyUser:'/nationalDay/getBuyUser',//查询用户是否购买过
    verifyCourse:'/nationalDay/verifyCourse',//验证课程是否有购买过
    createOrder:'/nationalDay/createOrder',//创建订单
    getBuyOrderState:'/nationalDay/getBuyOrderState',//检查微信支付订单
}