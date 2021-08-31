let env;
if(process.env.ENVIRONMENT==='development'){
    env = 'dev'
}else if(process.env.ENVIRONMENT==='beta'){
    env = 'beta'
}else if(process.env.ENVIRONMENT==='production'){
    env = 'prod'
}
export default {
    env,
    getImgCode:'/common/getImgCode',//获取图形验证码
    verifyCellphone:'/user/verifyCellphone',//验证电话号码是否存在
    verifyImgCode:'/common/verifyImgCode',//验证图形验证码
    getSmsCode:'/common/getSmsCode',//获取短信验证码
    verifySmsCode:'/common/verifySmsCode',//验证短信验证码
    signUp:'/user/signUp',//注册
    loginByPwd:'/user/loginByPwd',//密码登录
    changePassword:'/user/changePassword',//修改密码
    loginBySms:'/user/loginBySms',//短信登录
    loginByThird:'/user/loginByThird',//第三方登录
    relatedCellphone:'/user/relatedCellphone',//关联手机号
    getEducationList:'/user/getEducationList',//查询学历列表
    getIndustryList:'/user/getIndustryList',//查询行业列表
    getOccupationList:'/user/getOccupationList',//查询职业列表
    getInterestList:'/user/getInterestList',//查询兴趣列表
    uploadForOSS:'/common/uploadForOSS',//上传图片
    updateInfo:'/user/updateInfo',//编辑用户资料
    getInfo:'/user/getInfo',//获取用户资料
    search:'/pcCourse/search',//搜索课程
    getHotWordList:'/common/getHotWordList',//获取搜索热词
    loginOut:'/user/loginOut',//退出登录
    getclassifyList:'/pcCourse/getclassifyList',//获取课程分类列表
    getCourseListByClassify:'/pcCourse/getCourseListByClassify',//根据课程分类查询课程列表
    getCourseInfo:'/pcCourse/getInfo',//查询课程详情
    getPeriodList:'/pcCourse/getPeriodList',//根据课程id查询课时目录
    getEssenceCommentList:'/pcCourse/getEssenceCommentList',//根据课程id查询精华评论列表
    getRelationList:'/pcCourse/getRelationList',//根据课程id关联课程列表
    getResourcesUrl:'/pcCourse/getResourcesUrl',//获取播放地址
    getPeriodInfo:'/pcCourse/getPeriodInfo',//查询课时详情
    getAvailableList:'/pcCourse/getAvailableList',//买课程页面查询可用优惠券列表
    buy:'/pcCourse/buy',//购买课程
    getBuyOrderState:'/pcCourse/getBuyOrderState',//查询微信支付购买课程订单状态
    thumbsUp:'/user/thumbsUp',//点赞
    addComment:'/user/addComment',//评论
    saveLearningProgress:'/pcCourse/saveLearningProgress',//保存学习进度
    getCommenList:'/pcCourse/getCommenList',//根据课程id查询课程评论
    getHotList:'/pcCourse/getHotList',//查询热门课程
    addInformationComment:'/information/addComment',//添加资讯评论
    getInformationCommentList:'/information/getCommentList',//获取资讯列表
    addInformationCommentLike:'/information/addCommentLike',//资讯评论点赞
    getSchoolList:'/school/getList',//获取学校列表
    getRegionList:'/region/getList',//获取地区列表
    getGradeList:'/school/getGradeList',//获取年级
    getThemeInfo:'/aboutUs/getThemeInfo',//获取主题色
    getClassifyListByParentId:'/classify/getClassifyListByParentId',//根据一级分类查询二级分类
    verifyProhibitedWord:'/comment/verifyProhibitedWord',//验证评论内容违禁词
    loginByUserId:'/user/loginByUserId',
    searchCourseList:'/doubleEleven/searchCourseList',
    getCouponInfo:'/doubleEleven/getCouponInfo',
    receiveCoupon:'/doubleEleven/receiveCoupon',
    saveStudyBehavior:'/pcCourse/saveStudyBehavior'
}