let env,inviteFriendDoorwayPage,appId,privacyAgreement,registerAgreement
if (process.env.NODE_ENV == 'development'){
    env = 'dev';
    inviteFriendDoorwayPage = 'http://172.16.120.7/msiteH5/inviteFriendDoorwayPage.html',
    privacyAgreement = 'https://scm.youfushuyuan.com/invitation/privacyAgreement.html';
    registerAgreement = 'https://scm.youfushuyuan.com/invitation/registerAgreement.html';
}
else{
    if(process.env.argv=='beta'){
        env = 'beta';
        appId='wxfd920b9cc0f222c4'
        inviteFriendDoorwayPage = 'https://scm.youfushuyuan.com/invitation/inviteFriendDoorwayPage.html';
        privacyAgreement = 'https://scm.youfushuyuan.com/invitation/privacyAgreement.html';
        registerAgreement = 'https://scm.youfushuyuan.com/invitation/registerAgreement.html'
    }else{
        env = 'prod';
        appId = 'wx44e94e1ef84f486e'
        inviteFriendDoorwayPage = 'https://xgxm.xueguoxue.com/invitation/inviteFriendDoorwayPage.html';
        privacyAgreement = 'https://xgxm.xueguoxue.com/invitation/privacyAgreement.html';
        registerAgreement = 'https://xgxm.xueguoxue.com/invitation/registerAgreement.html';
    }
}
export default{
    env,
    appId,
    inviteFriendDoorwayPage,
    privacyAgreement,
    registerAgreement,
    loginByThirdPartyForMStation:'/user/loginByThirdPartyForMStation',//第三方登录
    login:'/user/login',//登录
    sendSms:'/common/sendSMS',//发送验证码
    checkVeriCode:'/common/checkVeriCode',//检查验证码
    register:'/user/register',//注册
    modifyPassword:'/user/modifyPassword',//忘记密码
    getAppIndexConfigs:'/home/getAppIndexConfigs',//获取首页模块列表
    getClassifyListByType:'/home/getClassifyListByType',
    getCoursesListByClassIfy:'/courses/getCoursesListByClassIfy',//根据课程分类查询课程列表
    getPopularCourseList:'/courses/getPopularCourseList',//获取热门课程列表
    getTimeLimitPurchaseCourseList:'/courses/getTimeLimitPurchaseCourseList',//查询体验课程列表
    getGuessLikeCourseList:'/courses/getGuessLikeCourseList',//获取猜你喜欢列表
    getCourseInfo:'/courses/getCourseInfo',//获取课程详情
    getPeriodsListByCourseId:'/courses/getPeriodsListByCourseId',//根据课程ID查询课时列表
    getPeriodsInfo:'/courses/getPeriodsInfo',//根据课时ID查询课时信息
    getResoursePlayUrl:'/courses/getResoursePlayUrl',//获取课程音频视频
    setPeriodPoint:'/courses/setPeriodPoint',//课时点赞
    setComentPoint:'/courses/setComentPoint',//评论点赞
    addComment:'/courses/addComment2',//添加评论
    getOrderForCourseInfo:'/courses/getOrderForCourseInfo',//查询订单页数据
    getPurchasedPageList:'/courses/getPurchasedPageList',//查询用户已购课程页面
    getPurchasedCourseList:'/courses/getPurchasedCourseList',//查询用户已购课程列表(包含免费课程列表)
    getBrowsingHistoryList:'/courses/getBrowsingHistoryList',//查询用户课程浏览记录列表
    getListForRecommend:'/courses/getListForRecommend',//推荐位列表
    getEducationList:'/user/getEducationList',//获取学历列表
    getIndustryList:'/user/getIndustryList',//获取行业列表
    getOccupationList:'/user/getOccupationList',//获取职业列表
    updateInfo:'/user/updateInfo',//修改资料
    getUserCouponsList:'/user/getUserCouponsList',//获取优惠券列表
    getCommonProblemList:'/home/getCommonProblemList',//获取常见问题列表
    getCommonProblemInfoById:'/home/getCommonProblemInfoById',//常见问题详情
    addUserFeedBacks:'/user/addUserFeedBacks',//添加用户反馈
    getCourseOrderList:'/user/getCourseOrderList',//购课记录列表
    getUserCouponsNum:'/user/getUserCouponsNum',//查询优惠券数量
    getMessageTypeInfoList:'/home/getMessageTypeInfoList',//获取消息列表
    getUnreadMessageNum:'/home/getUnreadMessageNum',//获取用户未读消息数量
    getMessageListByType:'/home/getMessageListByType',//根据消息类型获取用户消息列表
    getHotWordList:'/home/getHotWordList',//获取搜索热词
    searchCourseList:'courses/searchCourseList',//根据key搜索课程
    getShareCode:'/user/getShareCode',//获取分享二维码参数
    getCoinsList:'/user/getCoinsList',//获取夫子币充值列表
    getWxConfig:'/wx/getConfig',//获取微信分享的公众号配置
    buyCoins:'/user/buyCoins',//夫子币充值
    getRechargeRecords:'/user/getRechargeRecords',//获取夫子币充值记录
    uploadImg:'/common/upload/img',//上传图片
    getUserInfoById:'/user/getUserInfoById',//获取用户基本信息
    getOpenId:'/common/getWechatOpenId',//根据微信code获取openId
    checkOrder:'/common/verifyWechatPayResult',//查询微信订单，检查微信支付结果
    getInvitationDetailsList:'/user/getInvitationDetailsList',//邀请明细列表
    getActivityCouponInfo:'/common/getActivityCouponInfo',//获取活动优惠券信息
    receiveCoupons:'/user/receiveCoupons',//分享页领取优惠券
    buyCourse:'/courses/buyCourse',//购买课程
    savePeriodStudyRecords:'/user/savePeriodStudyRecords',//保存用户学习进度
    getTrySeePeriodList:'/courses/getTrySeePeriodList',//免费试听免费试看
    bindCellphone:'/user/bindCellphone',//绑定手机
    getCellPhoneState:'/user/getCellPhoneState',//查询手机注册状态
    updatePassword:'/user/updatePassword',//修改密码
    refreshUserTokenDeadline:'/user/refreshUserTokenDeadline',//刷新token时间
    getUserCouponsListForBuyCourse:'/user/getUserCouponsListForBuyCourse',//购买课程获取优惠券列表
    getCommentList:'/courses/getCommentList2',//课时详情页面查询评论列表
    getCourseState:'/courses/getCourseState',//查询课程状态
    getLearningCardPageByUserId:'/user/getLearningCardPageByUserId',//查询我的学习卡列表
    bindLearningCard:'/user/bindLearningCard',//绑定学习卡
    getLearningCardCourseNames:'/user/getLearningCardCourseNames',//查询定制学习卡课程名
    receiveCouponByCellphone:'/user/receiveCouponByCellphone',//根据电话号码领取优惠券
    getCouponsInfoById:'/user/getCouponsInfoById',//查询优惠券详情
    getLearningCardInfo:'/user/getLearningCardInfo',//查询学习卡详情
    receivLearningCard:'/user/receivLearningCard',//领取学习卡
    getCodeForLoginBySMS:'/common/getCodeForLoginBySMS',//短信验证码登录获取验证码
    loginBySMS:'/user/loginBySMS',//短信登录
    getRelatedCourseList:'/courses/getRelatedCourseList',//课程-查询关联课程列表
    getEssentialCommentPage:'/courses/getEssentialCommentPage',//课程-查询精华评论列表
    getInterestList:'/user/getInterestList',//查询兴趣列表
    getIntegralInfo:'/user/getIntegralInfo',//查询用户积分详情
    getUserIntegralRecordList:'/user/getUserIntegralRecordList',//查询用户积分明细列表
    signIn:'/user/signIn',//用户签到
    getSignRecord:'/user/getSignRecord',//根据月份查询签到记录
    getMedalList:'/user/getMedalList',//查询勋章列表
    addIntegral:'/user/addIntegral',//添加用户积分(分享)
    getIntegralRuleList:'/common/getIntegralRuleList',//查询积分规则
    getProfitList:'/user/getProfitList',//查询收益列表
    getUserProfitInfo:'/user/getUserProfitInfo',//查询用户收益信息
    getUserWithdrawCashInfo:'/user/getUserWithdrawCashInfo',//查询用户提现信息
    addWithdrawalsRecord:'/user/addWithdrawalsRecord',//添加提现记录
    getUserWithDrawRecordList:'/user/getUserWithDrawRecordList',//查询用户提现记录列表
    receiveInvitationCode:'/invitationCode/receiveInvitationCode',//领取邀请码
    useInvitationCode:'/invitationCode/useInvitationCode',//使用邀请码
    getUserInvitationCodeList:'/invitationCode/getUserInvitationCodeList',//查询我的邀请码记录列表
    sharePeriodToFriends:'/invitationSee/sharePeriodToFriends',//分享课时给好友(邀好友看)
    getSharePeriodInfo:'/invitationSee/getSharePeriodInfo',//查询分享课时详情(邀好友看)
    getSharePeriodList:'/invitationSee/getSharePeriodList',//查询分享课时列表(邀好友看)
    receiveInvitationSharePeriod:'/invitationSee/receiveInvitationSharePeriod',//领取邀好友看分享的课时(邀好友看)
    getShareUserInfo:'/invitationSee/getShareUserInfo',//获取分享用户信息(邀好友看)
    verifyReceiveInvitationSee:'/invitationSee/verifyReceiveInvitationSee',//验证邀好友看好友是否拥有该课时
    getSharePosterInfo:'/commission/getSharePosterInfo',//查询课程海报信息
    getAssembleCourseList:'/assemble/getAssembleCourseList',//查询拼团课程列表
    getAssembleCourseListNew:'/assemble/getAssembleCourseList2',//查询拼团列表（区分成人少儿）
    getOpenAssembleCourseInfo:'/assemble/getOpenAssembleCourseInfo',//查询开团页面详情
    getJoinAssembleCourseInfo:'/assemble/getJoinAssembleCourseInfo',//查询拼团页面详情
    getPlaceOrderInfo:'/assemble/getPlaceOrderInfo',//获取开团/参团下单页面详情
    getUserAssembleRecordList:'/assemble/getUserAssembleRecordList',//获取我的拼团列表
    verifyTimeLimitExpired:'/courses/verifyTimeLimitExpired',//验证秒杀是否已下架（过期）
    verifyUserAssemble:'/assemble/verifyUserAssemble',//验证是否加入拼团
    getShareDesc:'/common/getShareDesc',//分享-查询分享描述（h5页面向app传输分享信息）
    getUserMemberInfo:'/member/getUserMemberInfo',//查询用户会员信息
    getMemberRecordList:'/member/getMemberRecordList',//查询用户会员购买记录
    buyMember:'/member/buyMember',//购买会员(下单)
    getMemberRecordList:'/member/getMemberRecordList',//会员购买记录
    getOrderPageInfo:'/member/getOrderPageInfo',//获取会员下单页面数据
    getCourseShareModelState:'/courses/getCourseShareModelState',//查询是否设置课程分享模板
    getShareModelList:'/courses/getShareModelList',//查询课程分享模板列表
    setCoursePoint:'/courses/setCoursePoint2',//课程点赞
    getAppShareList:'/home/getAppShareList',//获取邀模板
    getRecommendList:'/courses/getRecommendList',//搜索页查询推荐课程列表
    bindMember:'/member/bind',//绑定会员卡
    getBindCardList: '/member/getBindCardList',//查询绑定会员卡列表
    getResPlayUrlForXXT:'/courses/getResPlayUrlForXXT',//获取音视频播放地址(校讯通)
    getShortVideoInfo:'/shortVideo/getInfo',//获取短视频详情
    verifyUp:'/shortVideo/verifyUp',//验证短视频是否下架
    //改版新的接口

    //获取首页栏目列表
    getHomeColumnList: '/home/getColumnList',
    //获取首页当前模块信息
    getHomePageInfo: "/home/getPageInfo",
    getInformationInfo:'/information/getInfo',//查询资讯详情
    getInfoCommentList:'/information/getInfoCommentList',//查询资讯评论列表
    sendInformationComment:'/information/sendComment',//发表资讯评论
    informationThumbsUp:'/information/thumbsUp',//资讯(评论)点赞
    getInformationSecondPageList: '/information/getSecondPageList',//获取资讯二级列表
    //查询限时购二级页面；
    getTimeLimiteList:'/timeLimitedDiscount/getList',
    //免费查询2级页面；
    getFreeList:'/courses/getFreeList',
    //热门课程2级页面；
    getHotList: '/courses/getHotList',
    //标题分类级页面；
    getListByClassifyIdLabelId: '/courses/getListByClassifyIdLabelId', 
    //二级页面分类列表
    getTitleClassList: '/classify/getSecondPageList', 
    //二级页面标签列表
    getTitleLabellList: '/label/getSecondPageList', 
    //专题列表
    getspecialList: '/thematicActivity/getSecondPageList',
    //名师推荐
    getTeacherList: '/teacher/getSecondPageList',
    //新的分类标签合体接口
    getListByNavigation: '/courses/getListByNavigation',
    //获取地区接口
    getRegionList: '/region/getList',
    //学校
    getSchooleList: '/schoole/getList',
    //年纪
    getGradeList: '/schoole/getGradeList',
    //会员卡验证
    getTerifyCode: '/member/verify',
    //学历
    getEducationList: '/user/getEducationList',
    //活动大礼包
    getGiftBagInfo: '/giftBag/getInfo',
    //活动大礼包领取
    getGiftBagReceive: 'giftBag/receive',
    //兑换邀请码
    getExchangeCode: '/invitationCode/exchangeCode',
    


    //短视频id
    getShortVideo: '/shortVideo/getPage',
    //获取当前视频地址
    getVideourl: '/shortVideo/getPlayUrl',
    //视频点赞
    setVideoPoint: '/shortVideo/setPoint',
    //获取短视频详情
    getshortVideoInfo: '/shortVideo/getInfo',
    //获取vip列表
    getMemberCourseList: '/member/getMemberCourseList',
    //获取详情页段视频
    getCourseShortVideoList: '/courses/getCourseShortVideoList',
    
    //课程详情获取短视频播放地址
    getResPlayUrlForShortVideo:'/courses/getResPlayUrlForShortVideo'
}