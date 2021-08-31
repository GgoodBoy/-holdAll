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
    // getclassifyId:'/doubleTwelve/getclassifyId',//获取分类
    // searchCourseList:'/doubleTwelve/searchCourseList',//搜索课程
    getUserInfoById:'/user/getUserInfoById',//获取用户详情
    // pointPage:'/doubleTwelve/pointPage',//访问页打点
    // pointVisit:'/doubleTwelve/pointVisit',//访问次数
    // pointButton:'/doubleTwelve/pointButton',//BUTTON 打点
    // shakeIt:'/doubleTwelve/shakeIt',//摇一摇
    // receiveCouponByType:'/doubleTwelve/receiveCouponByType',//领取无门槛或者满减优惠券
    // receiveCourse:'/doubleTwelve/receiveCourse',//领取课程
    // receiveCoupon:'/doubleTwelve/receiveCoupon',//领取优惠券
    // shareAddTime:'/doubleTwelve/share',//分享增加摇一摇次数
    // getShakeNum:'/doubleTwelve/getShakeNum',//获取分享次数
    // uploadImg: '/common/upload/img',//上传图片

    
    getOpenId: '/common/getWechatOpenId',//根据微信code获取openId
    // login:'/login/loginBySMS',//登录
    // sendSms:'/common/getCodeForLoginBySMS',//发送验证码
    getBuyUser:'/nationalDay/getBuyUser',//查询用户是否购买过
    verifyCourse:'/nationalDay/verifyCourse',//验证课程是否有购买过
    createOrder:'/nationalDay/createOrder',//创建订单
    getBuyOrderState: '/nationalDay/getBuyOrderState',//检查微信支付订单   
    
    //福包
    getFuBaoMyGold: '/fuBao/myGold',
    //返回是否当天已领过
    getFuIsSignAndShare: '/fuBao/isSignAndShare',
    //中奖纪录
    getFuBaoAwardWinningRecordList: '/fuBao/getAwardWinningRecordList',
    //礼金纪录
    getFuBaoOurGoldListList: '/fuBao/getOurGoldList',
    //签到分享购买每日获取礼金
    getFuBaoSignAndShare: '/fuBao/signAndShare',
    //包福宝
    getFuBaoBaoFubao: '/fuBao/baoFubao',
    //添加符
    getFuBaoAddSpell: '/fuBao/addSpell',
    //我的待开奖福包列表
    getFuBaoWaitOpenFuBaoList: '/fuBao/getWaitOpenFuBaoList',
    //获取能开奖列表
    getFuBaoCanOpenFuBaoList:'/fuBao/getCanOpenFuBaoList',
    //开奖
    getFuBaoOpenLottery: '/fuBao/openLottery',
    //根据筛选课程 mtype(1.成人 2.少儿)classId（分类ID 大于0为单个等于0是全部）
    getSearchCourseList: '/fuBao/searchCourseList',
    //获取活动分类ID
    getFuBaoClassifyId: '/fuBao/getclassifyId',
    //button打点
    getFuBaoPointButton:'/fuBao/pointButton',
    //访问页打点
    getFuBaoPointPage:'/fuBao/pointPage',
    //访问人打点
    getFuBaoPointVisit:'/fuBao/pointVisit'
    
    
}