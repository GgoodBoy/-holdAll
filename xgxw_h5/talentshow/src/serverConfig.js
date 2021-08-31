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
    getConfig: '/wx/getConfig',//获取微信分享配置


    getCarnivalCourses: '/expertplan/courseList',//达人列表
    getPotenceList:'/expertplan/potenceList',//达人计划-权益列表
    getCourseInfo: '/mobileCourses/getCourseInfo',//获取课程详情
    getOrderForCourseInfo: '/mobileCourses/getOrderForCourseInfo',//订单
    getUserCouponsListForBuyCourse: '/user/getUserCouponsListForBuyCourse',
    buyCourse:'/mobileCourses/buyCourse',//下单
    getPeriodsListByCourseId: '/mobileCourses/getPeriodsListByCourseId',//根据课程ID查询课时列表    
    getResoursePlayUrl: '/mobileCourses/getResoursePlayUrl',//获取课程音频视频
    savePeriodStudyRecords: '/user/savePeriodStudyRecords',//保存用户学习进度
    saveStudyBehavior: '/mobileCourses/saveStudyBehavior',//保存用户学习时长（路径）
    getUserInfoById: '/user/getUserInfoById',//获取用户基本信息
}