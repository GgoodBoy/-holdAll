let env,appId
if (process.env.NODE_ENV == 'development'){
    env = 'dev';
}
else{
    env = 'prod';
    appId='wxfd920b9cc0f222c4'//仿生 
    // appId = 'wx44e94e1ef84f486e' //线上
}
export default{
    env,
    appId,
    getOpenId: '/common/getWechatOpenId',
    verifyIsFollow:'/chongYang/verifyIsFollow',
    point:'/chongYang/point'
}