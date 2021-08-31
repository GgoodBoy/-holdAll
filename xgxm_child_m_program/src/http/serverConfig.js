export default {
    getHomePageInfo: '/home/getPageInfo',
    // getResoursePlayUrl:'/courses/getWechatResoursePlayUrl',   //xcx获取音视频播放地址 olg
    getResoursePlayUrl:'/appletCourses/getWechatResoursePlayUrl',   //xcx获取音视频播放地址 
    // getCourseInfoCourses: '/courses/getWechatCourseInfo',  // xcx根据课程ID查询课程详情 old
    getCourseInfoCourses: '/appletCourses/getWechatCourseInfo',  // xcx根据课程ID查询课程详情
    // getCourseInfoCourses: '/courses/getCourseInfo',
    // getPeriodsListByCourseIdCourses: '/courses/getWechatPeriodsListByCourseId',   //xcx根据课程ID查询课时信息列表 old
    getPeriodsListByCourseIdCourses:'/appletCourses/getWechatPeriodsListByCourseId',   //xcx根据课程ID查询课时信息列表 old
    // getPeriodsListByCourseIdCourses: '/courses/getPeriodsListByCourseId',
    // 获取我的优惠券列表
    getWechatUserCouponsListForBuyCourse: '/user/getWechatUserCouponsListForBuyCourse',
    // 购买课程
    // getCourseWechatBuyCourse: '/courses/wechatBuyCourse', // old
    getCourseWechatBuyCourse: '/appletCourses/wechatBuyCourse',
    //微信支付回调地址
    getUserWechatNotifyUrl: '/user/wechatNotifyUrl',
    //绑定手机(验证手机号码是否注册)
    setWeChatBindCellphone:'/user/weChatBindCellphone',
    //微信JSAPI支付获取openId
    getWechatAppletOpenIdCommon: '/common/getWechatAppletOpenId',
    //获取登录用户电话号码
    getLoginWeChatUserPhone: '/login/getWeChatUserPhone',
    //查询课程下单页面数据
    // getWechatOrderForCourseInfoCourses: '/courses/getWechatOrderForCourseInfo', //old
    getWechatOrderForCourseInfoCourses:'/appletCourses/getWechatOrderForCourseInfo',
    savePeriodStudyRecordsUser: '/user/savePeriodStudyRecords',
    getOrderForCourseInfo: '/courses/getOrderForCourseInfo',
    loginForWeChat:'/login/loginForWeChat',//小程序登录
    loginWeChatGetUserInfo:'/login/loginWeChatGetUserInfo',//根据openID获取授权/登录用户信息 
    getWechatHomeInfo:'/home/getWechatHomeInfo',//获取小程序首页数据
    getWechatColumnList:'/home/getWechatColumnList',//获取首页栏目列表
    getWechatAllClassify:'/classify/getWechatAllClassify',//课程分类
    // getWechatListByNavigation:'/courses/getWechatListByNavigation',//分类导航根据分类id查询课程列表 old
    getWechatListByNavigation:'/appletCourses/getWechatListByNavigation',//分类导航根据分类id查询课程列表
    getWechatList:'/timeLimitedDiscount/getWechatList',//获取限时购列表
    // getWechatFreeList:'/courses/getWechatFreeList',//查询免费课程列表 old
    getWechatFreeList:'/appletCourses/getWechatFreeList',//查询免费课程列表
    // getWechatHotList: '/courses/getWechatHotList',//获取热门课程列表 old
    getWechatHotList:'/appletCourses/getWechatHotList',//获取热门课程列表
    // getWechatListByClassifyIdLabelId: '/courses/getWechatListByClassifyIdLabelId',//根据标签id或分类id查询课程列表 old
    getWechatListByClassifyIdLabelId:'/appletCourses/getWechatListByClassifyIdLabelId',//根据标签id或分类id查询课程列表
    getWechatHotWordList:'/home/getWechatHotWordList',//获取热词列表
    getWechatDefaultHotWords:'/home/getWechatDefaultHotWords',//获取默认词
    // getWechatPurchasedCourseList:'/courses/getWechatPurchasedCourseList',//查询用户课程列表 old
    getWechatPurchasedCourseList:'/appletCourses/getWechatPurchasedCourseList',//查询用户课程列表 
    getWechatCourseOrderList: '/user/getWechatCourseOrderList',//查询用户订单列表
    //打点计时器记录课程的操作播放时长和次数
    setsaveStudyBehavior:'/appletCourses/saveStudyBehavior',
    //小程序少儿版
    // getSearchChildCourseList: '/courses/searchWechatChildCourseList', // old
    getSearchChildCourseList:'/appletCourses/searchWechatChildCourseList',
    getUserChildrenInfo: '/user/getWechatUserInfoById',//少儿查询用户详情
    
    //拼团课程更多
    getAssembleCourseLists:'/assemble/getAssembleCourseList2',
    //获取拼团列表
    getJoinAssembleCourseInfo:'/assemble/getJoinAssembleCourseInfo',
    //验证用户是否加入拼团
    getVerifyUserAssemble:'/assemble/verifyUserAssemble',
    //验证课程拼团是否已经结束
    getVerifyIsEnd: '/assemble/verifyIsEnd',
    //获取开团/参团下单页面详情
    getSpellPlaceOrderInfo: '/assemble/getPlaceOrderInfo',
    //查询开团页面详情(判断是三人团还是2人团)
    getOpenAssembleCourseInfo: '/assemble/getOpenAssembleCourseInfo'
}