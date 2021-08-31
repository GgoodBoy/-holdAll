/**
 * Created by wy on 2018/11/22.
 */
let exportCommissionRecordPage,exportCourseVisitRank,exportIntegral,exportUnicom,exportClassmatesMsgList,h5,exportQuestionUserDetailList,downloadExcelModel,downLoadGoldExchangeList,exportWrongBookList,exportQuestion,exportQuestionUser,exportAddressList  
let httpCode = 'https://sccms.youfushuyuan.com';
// let httpCode = 'http://172.16.120.6:8769';
if (process.env.NODE_ENV == 'production') {
    if(process.env.argv=='beta'){
        exportCommissionRecordPage = httpCode+'/commission/export/commissionRecordPage'
        exportCourseVisitRank = httpCode+'/courseVisitRank/exportRank'
        exportIntegral = httpCode+'/integral/exportAllUserIntegralRecord'
        exportUnicom = httpCode+'/unicom/orderListExport'
        exportClassmatesMsgList = httpCode+'/classmatesMsg/export/classmatesMsgList'
        h5='https://scm.youfushuyuan.com/h5/answer/index.html'
        exportQuestionUserDetailList = httpCode+'/theKingOfKnowledge/export/questionUserDetailList'
        downloadExcelModel = httpCode+'/theKingOfKnowledge/downloadExcelModel'
        downLoadGoldExchangeList = httpCode+'/theKingOfKnowledge/export/downLoadGoldExchangeList'
        exportWrongBookList = httpCode+'/theKingOfKnowledge/export/wrongBookList'
        exportQuestion = httpCode+'/theKingOfKnowledge/export/questionList'
        exportQuestionUser = httpCode+'/theKingOfKnowledge/export/userList'
        exportAddressList = httpCode+'/theKingOfKnowledge/export/downLoadAddressList'
    }else{
        exportCommissionRecordPage = 'https://xgxcms.xueguoxue.com/commission/export/commissionRecordPage'
        exportCourseVisitRank = 'https://xgxcms.xueguoxue.com/courseVisitRank/exportRank'
        exportIntegral = 'https://xgxcms.xueguoxue.com/integral/exportAllUserIntegralRecord'
        exportUnicom = 'https://xgxcms.xueguoxue.com/unicom/orderListExport'
        exportClassmatesMsgList = 'https://xgxcms.xueguoxue.com/classmatesMsg/export/classmatesMsgList'
        h5='https://xgxm.xueguoxue.com/h5/answer/index.html'
        exportQuestionUserDetailList = 'https://xgxcms.xueguoxue.com/theKingOfKnowledge/export/questionUserDetailList'
        downloadExcelModel = 'https://xgxcms.xueguoxue.com/theKingOfKnowledge/downloadExcelModel'
        downLoadGoldExchangeList = 'https://xgxcms.xueguoxue.com/theKingOfKnowledge/export/downLoadGoldExchangeList'
        exportWrongBookList = 'https://xgxcms.xueguoxue.com/theKingOfKnowledge/export/wrongBookList'
        exportQuestion = 'https://xgxcms.xueguoxue.com/theKingOfKnowledge/export/questionList'
        exportQuestionUser = 'https://xgxcms.xueguoxue.com/theKingOfKnowledge/export/userList'
        exportAddressList = 'https://xgxcms.xueguoxue.com/theKingOfKnowledge/export/downLoadAddressList'
    }
}else{
    exportCommissionRecordPage = 'http://devcms.youfushuyuan.com:8769/commission/export/commissionRecordPage'
    exportCourseVisitRank = httpCode+'/courseVisitRank/exportRank'
    exportIntegral = httpCode+'/integral/exportAllUserIntegralRecord'
    exportUnicom = httpCode+'/unicom/orderListExport'
    exportClassmatesMsgList = httpCode+'/classmatesMsg/export/classmatesMsgList'
    h5='https://scm.youfushuyuan.com/h5/answer/index.html'
    exportQuestionUserDetailList = httpCode+'/theKingOfKnowledge/export/questionUserDetailList'
    downloadExcelModel = httpCode+'/theKingOfKnowledge/downloadExcelModel'
    downLoadGoldExchangeList = httpCode+'/theKingOfKnowledge/export/downLoadGoldExchangeList'
    exportWrongBookList = httpCode+'/theKingOfKnowledge/export/wrongBookList'
    exportQuestion = httpCode+'/theKingOfKnowledge/export/questionList'
    exportQuestionUser = httpCode+'/theKingOfKnowledge/export/userList'
    exportAddressList = httpCode+'/theKingOfKnowledge/export/downLoadAddressList'
}
let ly = {
    // login:'/login/cms',
    // logout:'/login/logout',
    periodInfo: '/period/period/',//课时信息
    // categoryIndex: '/category/index',
    categoryIndex:(objs) => { return `category/index?page=${objs.page}&pageSize=${objs.pageSize}&name=${objs.name}&mtype=${objs.mtype}` },
    getCategory: '/category/category',
    teacherIndex2: '/teacher/index',
    teacherIndex: '/teacher/list',
    teacherIndex1: '/teacher/getBounsTeacherList',
    teacher: '/teacher/teacher/',//
    videoIndex: '/video/index',//
    video: '/video/video',//
    playAuth: '/video/play-auth',//
    playAuthNext: '/video/getResoursePlayUrl',//
    playToken: '/video/play-security-token',
    audioIndex: '/audio/index',
    audio: '/audio/audio',
    courseIndex: '/course/index',
    courseConstant: '/course/constant',
    course: '/course/course',
    courseReview: '/course/course/review',
    courseCopy: '/course/course/copy',
    periodSort: '/period/period/sort',
    courseAuditIndex: '/course/audit/index',
    courseAuditConstant: '/course/audit/constant',
    courseAuditDeny: '/course/audit/deny',
    courseAuditPass: '/course/audit/pass',
    courseDown: (id) => { return `/course/course/${id}/down` },
    courseSubmitAudit: (courseId) => { return `/course/course/${courseId}/submit-audit` },
    courseAuditLog: (id) => { return `/course/course/${id}/auditLog` },
    // upload: 'http://xgxcms.youfushuyuan.com/uploadx/pic',
    // upload: 'http://sccms.youfushuyuan.com/uploadx/pic',
    // upload:'https://sccms.youfushuyuan.com/uploadx/pic',
    courseUp: (id) => { return `course/course/${id}/up` },
    //课时上架接口 period/period/${id}/up
    periodIdUp: (id) => { return `/period/period/${id}/up` },
    //课时下架接口 period/period/${id}/down
    periodIdDown: (id) => { return `/period/period/${id}/down` },




    //合作老师禁止使用
    cooperativeTeacher: (courseId) => { return `/teacherCooperative/${courseId}/enable` },
    teacherCooperativePassword: (id) => { return `teacherCooperative/${id}/resetPwd` },
    ceratedUserId: '/teacherCooperative/search',
    teacherCooperativeAdd: 'teacherCooperative/add',
    teacherCooperatIncome: (objs) => { return `teacherCooperative/incomeOverview?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&startDateStr=${objs.startDateStr}&endDateStr=${objs.endDateStr}&id=${objs.id}` },
    teacherSellPageInfo: (id) => { return `teacherCooperative/${id}/sellPageInfo` },
    teachercCourseName: (id) => { return `teacherCooperative/${id}/courseName` },
    teacherCourseChoose: (objs) => { return `teacherCooperative/${objs.id}/sellStat?pageNo=${objs.pageNo || ''}&pageSize=${objs.pageSize || ''}&courseType=${objs.courseType}&courseId=${objs.courseId}&startDateStr=${objs.startDateStr}&endDateStr=${objs.endDateStr}` },
    teacherCoursesalesQuery: (objs) => { return `teacherCooperative/${objs.id}/sellList?courseId=${objs.courseId}&pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    getVersionList: '/version/list',
    getlastVersionList: (type) => { return `/version/${type}/versionNum` },
    VersionFormAdd: "/version/add",
    uploadVideo: '/uploadx/audio',
    uploadAudio: '/uploadx/audio',
    getRole: '/security/getRole',//查询角色列表
    addRole: '/security/addRole',//添加角色
    viewRole: '/security/viewRole',//查看角色
    deleteRole: '/security/deleteRole/',//删除角色
    addPermission: '/security/addPermission/',//给角色添加权限
    delUserFromRole: '/security/deleteUser/',//从角色下面删除用户
    queryCmsUser: '/cmsUser/getPage',//获取后台用户列表
    teacherCooperative: (objs) => { return `/teacherCooperative/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&userName=${objs.userName || ''}` },
    addCmsUser: '/cmsUser/add',//创建后台账户
    resetCmsUserPwd: '/cmsUser/resetPwd',//重置用户密码
    diyEnable: '/cmsUser/diyEnable',//禁用启用用户
    allotRole: '/cmsUser/allotRole',//给账户分配角色
    saveResource: '/video/saveRes',//保存音频视频
    getSelectUserCount: '/appUser/selectUserCount',
    getUserShareRecordLis:'/userShareRecord/getUserShareRecordList',
    //课程测评
    addCmmentCourseurl: '/course/evaluation',
    //学习卡
    studyCardList: (objs) => { return `/studyCard/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&type=${objs.type}&keyword=${objs.keyword}&status=${objs.status}` },
    studyCardAadd: '/studyCard/add',
    studyCardDetail: (id) => { return `/studyCard/${id}/detail` },
    studyCardRemove: (objs) => { return `/studyCard/${objs.id}/del` },
    studyCardCancel: (objs) => { return `/studyCard/${objs.id}/cancel` },


    //活动学习卡
    activityStudyCardList: (objs) => { return `/activityStudyCard/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&type=${objs.type}&keyword=${objs.keyword}&status=${objs.status}` },
    activityStudyCardAdd: '/activityStudyCard/add',
    activityStudyCardCancel: (objs) => { return `/activityStudyCard/${objs.id}/cancel` },
    activityStudyCardRemove: (objs) => { return `/activityStudyCard/${objs.id}/del` },

    //兴趣管理
    interestAdd: 'interest/add',
    interestUpdate: 'interest/update',
    interestQuery: (objs) => { return `/interest/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    interestDel: (objs) => { return `/interest/${objs.id}/del` },

    //积分管理;
    integralSwitch: '/integral/config/switch',//积分兑换
    integralRecord: (objs) => { return `/integral/record?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&userId=${objs.userId}` }, //用户积分记录详情
    integralUserQuery: (objs) => { return `/integral/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&keyword=${objs.keyword}&status=${objs.status}` }, //用户积分信息查询
    integralConfig: (objs) => { return `/integral/config/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}` }, //积分配置信息列表
    integralUpdate: 'integral/config/update', //积分配置信息列表
    integralEnable: '/integral/config/enable',//积分配置状态启用，禁用
    integralSource: '/integral/config/source',
    integralAdd: '/integral/config/add',
    medalSwitch: '/medal/switch',
    integralSwitch: 'integral/config/switch',

    //佣金
    //(1)佣金列表
    commissionList: (objs) => { return `/commission/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&keyWord=${objs.keyWord}&courseType=${objs.courseType}&status=${objs.status}` },
    //(2)佣金删除
    commissionDel: (objs) => { return `/commission/${objs.id}/del` },
    //(3)佣金详情
    commissionDetail: (objs) => { return `/commission/${objs.id}/detail?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    //(4)佣金更新
    commissionUpdate: '/commission/update',
    //(5)佣金新增
    commissionAdd: '/commission/add',
    //佣金课程列表
    commissionCourses: '/commission/courses',
    exportCommissionRecordPage,
    //启动，禁止
    commissionEnable: (objs) => { return `/commission/${objs.id}/${objs.enable}` },

    //邀请二维码
    //邀请码启用禁用
    invitationCodeStatus: (objs) => { return `/invitationCode/${objs.id}/${objs.status}` },
    //邀请码列表
    invitationCodeList: (objs) => { return `/invitationCode/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&keyWord=${objs.keyWord}&startTime=${objs.startTime}&endTime=${objs.endTime}` },
    //邀请码详情
    invitationCodeDetail: (objs) => { return `/invitationCode/${objs.id}/detail?status=${objs.status}&keyWord=${objs.keyWord}&pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    //新增邀请码
    invitationCodeAdd: '/invitationCode/add',
    //邀请码选择课程
    invitationCodeCourses: '/invitationCode/courses',
    //激活邀请码
    invitationCodeActivation:(objs) => { return `/invitationCode/activation/${objs.id}` },


    //邀请好友看
    invitationCodeSet: '/invitationCode/share/set',
    invitationCodeLists: (objs) => { return `invitationCode/share/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&courseName=${objs.courseName}` },

    //财务管理
    //记录列表
    withdrawList: (objs) => { return `/withdraw/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&applyPhone=${objs.applyPhone}&applyStatus=${objs.applyStatus}` },
    //审核
    withdrawAudit: (objs) => { return `/withdraw/audit?id=${objs.id}&auditOpertionType=${objs.auditOpertionType}&rejectReason=${objs.rejectReason}` },
    //分销明细
    withdrawUserId: (objs) => { return `/withdraw/${objs.userId}?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&courseName=${objs.courseName}` },
    //莫用户审核通过的所有记录
    withdrawRecord: (objs) => { return `/withdraw/${objs.userId}/record` },


    //课程渠道设置 添加渠道课程/编辑post
    channelCourseAdd: '/channelCourse/add',
    //列表--删除 deletc
    channelCourseDelete: (objs) => { return `/channelCourse/delete/${objs.id}` },
    //列表--查看 get
    channelCourseView: (objs) => { return `/channelCourse/view/${objs.id}` },
    //列表/筛选 get
    channelCourseGetPage: (objs) => { return `/channelCourse/getPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&pipelineId=${objs.pipelineId}` },
    //添加课程渠道--选择渠道（下拉框）/筛选--渠道名称 get
    channelCoursePipelines: '/channelCourse/pipelines',
    //获取渠道同步的选项 get
    pipelineSync:'/pipeline/sync/option',
    //渠道同步数据 post
    pipelineSync: (objs) => { return `/pipeline/${objs.channelId}/sync` },

    //勋章接口
    medalList: (objs) => { return `/medal/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    medalUpdate: '/medal/update',
    medalAdd: '/medal/add',
    medalEnable: (objs) => { return `/medal/enable/${objs.status}` },


    //查询商品分类列表
    getGoodsClassifyList: '/goodsClassify/getGoodsClassifyList',
    //添加商品分类
    getAddGoodsClassify:'/goodsClassify/addGoodsClassify',
    //修改商品分类
    getUpdateGoodsClassify: '/goodsClassify/updateGoodsClassify',
    //删除商品分类
    getDeleteGoodsClassify: '/goodsClassify/deleteGoodsClassify',
    //商品分类排序
    getSortClassify: '/goodsClassify/sort',


    //商品管理
    //商品列表查询
    getGoodsList:'/goods/getGoodsList',
    //添加商品
    getAddGoods: '/goods/addGoods',
    //修改商品
    getGoodsUpdateGoods: '/goods/updateGoods',
    //删除商品
    getGoodsDeleteGoods: '/goods/deleteGoods',
    //上架商品
    getGoodsUpGoods: '/goods/upGoods',
    //下架商品
    getGoodsDownGoods: '/goods/downGoods',
    //置顶和取消置顶商品
    getGoodsToppingGoods:'/goods/toppingGoods',
    //根据商品ID查询商品
    getGoodsFindById: '/goods/findById',
    //好物推荐
    getgoodsRecommendation: '/course/goodsRecommendation',
    //商品推荐id查找关联的好物列表
    getFindGoodsIdsByCourseId:'/courseGoodsRelation/findGoodsIdsByCourseId',
    getClassmatesMsgList:'/classmatesMsg/getClassmatesMsgList',//学友圈说说列表
    recommendClassmatesMsg:'/classmatesMsg/recommendClassmatesMsg',//学友圈说说推荐和取消推荐
    essenceClassmatesMsg:'/classmatesMsg/essenceClassmatesMsg',//学友圈说说精华和取消精华
    toppingClassmatesMsg:'/classmatesMsg/toppingClassmatesMsg',//学友圈说说置顶或取消置顶
    showClassmatesMsg:'/classmatesMsg/showClassmatesMsg',//学友圈说说隐藏
    approvalClassmatesMsg:'/classmatesMsg/approvalClassmatesMsg',//学友圈说说批量审核
    exportClassmatesMsgList,//学友圈说说列表导出
    getClassmatesMsgReportList:'/classmatesMsg/getReportList',//学友圈说说查询举报列表
    communityList:'/integral/config/communityList',//学友圈积分列表

    //拼团
    //拼团列表
    assembleList: (objs) => { return `/assemble/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&courseName=${objs.courseName}&startTime=${objs.startTime}&endTime=${objs.endTime}&isEnd=${objs.isEnd}&mtype=${objs.mtype}` },
    //拼团明细
    assembleId: (objs) => { return `/assemble/${objs.id}/detail?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&courseName=${objs.courseName}` },
    //拼团新增
    assembleAdd: '/assemble/add',
    //拼团选择课程
    assembleGetCourses: (objs) => { return `/assemble/getCourses?courseName=${objs.courseName}` },
    //修改
    assembleUpdate: '/assemble/update',
    //下架
    assembleOffShelves: (objs) => { return `/assemble/${objs.id}/offShelves` },
    //生成海报
    createOrUpdatePoster: '/commission/createOrUpdatePoster',

    //校园管理详情
    schooleDetails: (objs) => { return `/schoole/details?id=${objs.id}&pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },

    //测评管理
    //获取莫测评题目列表，如果有选择的标识
    h5QuestionOption: (objs) => { return `/evaluation/${objs.evaluationId}/questionOption?keyword=${objs.keyword}` },
    //获取莫个测评的题目与答案的关联关系
    h5AnswerRelation: (objs) => { return `/evaluation/${objs.evaluationId}/answerRelation?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}` },
    //删除测评和题的关联关系
    h5Relation: (objs) => { return `/evaluation/${objs.relationId}` },
    //获取某个测评管理的题
    h5Questions: (objs) => { return `/evaluation/${objs.id}/questions?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    //给某测评添加题目关联关系
    h5AddQuestionRelation: '/evaluation/addQuestionRelation',
    //测评生成，上线，下线操作
    h5OperationType: (objs) => { return `/evaluation/${objs.id}/${objs.operationType}` },
    //背景图片查询
    h5BackgroundImg: '/evaluation/backgroundImg',
    //测评查询
    h5Query: (objs) => { return `/evaluation/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}` },
    //测评 新增，修改
    h5SaveOrUpdate: '/evaluation/saveOrUpdate',
    //获取题目选项外部诗词
    h5GetRelationOuterQuestions: '/evaluation/getRelationOuterQuestions',
    //获取题目选项供选择
    h5GetRelationVaildInnerQuestions: (objs) => { return `/evaluation/getRelationVaildInnerQuestions?evaluationId=${objs.evaluationId}&level=${objs.level}&currExerciseId=${objs.currExerciseId}` },
    //更改入口设置
    h5UpdateEntrance: '/evaluation/updateEntrance',
    //获取某个测评信息
    h5GetEvaluationInfo: (objs) => { return `/evaluation/${objs.id}` },
    //获取下个题目的信息
    h5GetNextQuestion: (objs) => { return `/evaluation/getNextQuestion?evaluationId=${objs.evaluationId}&currentExerciseId=${objs.currentExerciseId}` },
    //添加答案关联关系 post
    h5AddRelationAnswer: '/evaluation/addRelationAnswer',

    //测评统计
    //测评详情 get
    h5EvaluationId: (objs) => { return `/evaluationStatistics/${objs.evaluationId}/detail?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}` },
    //测评统计列表 get
    h5EvaluationList: (objs) => { return `/evaluationStatistics/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}` },

    //测评-诗词库
    //诗词列表 get
    h5PoetryList: (objs) => { return `/poetry/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}` },
    //海报列表 get
    h5PoetryGetPosterUrl: (objs) => { return `/poetry/getPosterUrl?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}` },
    //修改 post
    h5PoetryGetUpdate: (objs) => { return `/poetry/${objs.id}` },
    //海报添加 post
    h5PoetryAdd: '/poetry/add',

    //12月活动-获取活动统计基础数据
    getActivityBaseData: '/doubleTwelve/getActivityBaseData',
    //12月活动-获取活动统计列表
    getListByChannel: '/doubleTwelve/getListByChannel',
    //12月活动-获取用户详情
    getUserDetailByChannel: '/doubleTwelve/getUserDetailByChannel',
    //12月活动-购买详情
    getOrderDetailByChannel: '/doubleTwelve/getOrderDetailByChannel',
    //12月活动-访问用户
    getUserVisitDetail: '/doubleTwelve/getUserVisitDetail',
    //12月活动-查询Button打点数据列表
    getButtonList: '/doubleTwelve/getButtonList',
    //12月活动-查询统计表中课程
    getCourseDoubleTwelve: '/doubleTwelve/getCourse',

    //积分数据活动统计
    getStatisticsList: '/mobileActivity/getStatisticsList',
    //观看排序
    getVisitRankListSort: '/mobileActivity/getVisitRankList',
    //观看排序明细
    getSortDetail: '/mobileActivity/getDetail/',
    

    //菜根谭-获取BUTTON列表
    cgtGetButtonList: '/caiGenTan/getButtonList',
    //菜根谭-获取统计基础数据
    cgtGetActivityBaseData: '/caiGenTan/getActivityBaseData',
    //菜根谭-根据渠道获取列表
    cgtGetListByChannel: '/caiGenTan/getListByChannel',
    //菜根谭-用户详情
    cgtGetUserDetailByChannel: '/caiGenTan/getUserDetailByChannel',
    //菜根谭-购买详情
    cgtGetOrderDetailByChannel: '/caiGenTan/getOrderDetailByChannel',
    //菜根谭-地址列表数据
    cgtGetAdressList: '/caiGenTan/getAdressList',
    //菜根谭-修改是否已收货
    cgtUpdateStatus:'/caiGenTan/updateStatus',



    //测评-题目库
    //添加题目与答案 POST
    h5QuestionAdd: '/question/add',
    //更改题目以及答案内容 POST
    h5QuestionUpdate: '/question/update',
    //查询题目库列表 get
    h5QuestionList: (objs) => { return `/question/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}` },
    //导入excel题目 post
    // h5QuestionImportExcel: '/question/importExcel',

    //测评-设置
    // 新增 post
    h5BackgroundImgAdd: '/backgroundImg/add',
    //删除 post
    h5BackgroundImgId: (objs) => { return `/backgroundImg/${objs.id}` },
    //海报地址 get
    h5BackgroundImgShare: (objs) => { return `/backgroundImg/share?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    //查询试题背景 get
    h5BackgroundImgQuestion: (objs) => { return `/backgroundImg/question?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },

    //获取视频上传凭着和路径
    uploadxgetUploadAuth:'/uploadx/getUploadAuth',
    //刷新上传凭证
    refreshUploadAuth:'/uploadx/refreshUploadAuth',
    //上传视频转码
    uploadxSubmitTranscode:'/uploadx/submitTranscode',

    //分享活动
    // 分享活动查询
    activityShareList: (objs) => { return `/share/activity/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&title=${objs.title}` },
    //分享活动新增
    activityAdd: '/share/activity/add',
    //分享活动修改
    activityUpdate: '/share/activity/update',
    //分享活动关联选项
    activityGetOptionList: (objs) => { return `/share/activity/getOptionList?name=${objs.name}&type=${objs.type}` },

    //标签
    getAjaxLabelnList:(objs) => { return `/label/getPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}&mtype=${objs.mtype}` },
    updatelabel: '/label/update',
    addLabel: '/label/add',
    deleteLabel: (objs) => { return `/label/delete/${objs.id}` },

    //课程标签列表
    courseLabelList: (objs) => { return `courseLabel/courseLabel/${objs.id}` },
    courseLabelGetPage: (objs) => { return `/courseLabel/getPage?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&name=${objs.name}&mtype=${objs.mtype}` },
    courseLabelAdd:'/courseLabel/add',

    //会员卡
    //会月卡列表/会员卡-->查询 get
    memberSelectPage: (objs) => { return `/member/selectPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}&timeType=${objs.timeType}&state=${objs.state}` },
    //会员卡-->新建会员卡/编辑 post
    memberMemberAdd: 'member/add',
    memberMemberEdit: (objs) => { return `/member/edit/${objs.id}` },
    //会员卡列表-->上线 post
    memberUp: (objs) => { return `/member/member/${objs.id}/up` },
    //会员卡列表-->上线 post
    memberDown: (objs) => { return `/member/member/${objs.id}/down` },
    //会员卡设备价格
    memberMemberPrice: 'member/memberPrice',
    //会员卡列表-->查看  get
    memberRecordSelectPage: (objs) => { return `/memberRecord/selectPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&memberId=${objs.memberId}&searchContent=${objs.searchContent}` },
    //会员记录详情
    memberOrderSelectPage: (objs) => { return `/memberOrder/selectPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&cellphone=${objs.cellphone}&timeType=${objs.timeType}` },

    //特殊账户
    //特殊账户-->查询
    specialUserSelectPage: (objs) => { return `specialUser/selectPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&cellphone=${objs.cellphone}&state=${objs.state}` },
    //特殊账户列表-->修改
    specialUserEdit: (objs) => { return `specialUser/edit/${objs.id}` },
    //特殊账户-->添加账户
    specialUserAdd: 'specialUser/add',
    //特殊账户列表--启用
    specialUserUp: (objs) => { return `/specialUser/specialUser/${objs.id}/up` },
    //特殊账户列表--禁用
    specialUserDown: (objs) => { return `/specialUser/specialUser/${objs.id}/down` },
    //特殊账户会员
    specialUserSpecialVIP: '/specialUser/specialVIP?pageSize=10&pageNo=1',

    //学习进度
    courseCourseProgress: (objs) => { return `/course/courseProgress/${objs.id}?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&searchContent=${objs.searchContent}` },
    courseCourseProgressNew:'/course/courseProgress',
    //专题
    //发布修改
    thematicActivitySave:'/thematicActivity/save',
    //专题查询
    thematicActivityPetPage: '/thematicActivity/getPage',
    //删除
    thematicActivityDelete: (objs) => { return `/thematicActivity/delete/${objs.id}` },
    //上线
    thematicActivityUp: (objs) => { return `/thematicActivity/up/${objs.id}` },
    //下线
    thematicActivityDown: (objs) => { return `/thematicActivity/down/${objs.id}` },
    //专题详情
    thematicActivityView: (objs) => { return `/thematicActivity/view/${objs.id}` },



    //红包组队-获取统计基础数据
    getPackActivityBaseData: '/hbzd/getActivityBaseData',
    //红包组队-Button打点数据
    getPackButtonList: '/hbzd/getButtonList',
    //红包组队-根据渠道获取列表
    getPackListByChannel: '/hbzd/getListByChannel',
    //红包组队-访问用户列表
    getPackvisitUserList: '/hbzd/visitUserList',
    //红包组队-邀请用户列表
    getPackInviteUserList: '/hbzd/inviteUserList/',
    //红包组队-获奖记录
    getPackLotteryRecord: '/hbzd/lotteryRecord/',
    //红包组队-成功组队
    getPackSuccessTeam: '/hbzd/successTeam',
    //红包组队-成功组队详情
    getPackSuccessTeamDetail: '/hbzd/successTeamDetail/',
    //红包组队-组队中
    getPackUnSuccessTeam:'/hbzd/unSuccessTeam',


    //移动赠课弹窗-查询列表
    getMobilePopupGetPage:'/mobilePopup/getPage',
    //移动赠课弹窗-下架
    getMobilePopupDown:'/mobilePopup/down/',
    //移动赠课弹窗-上架
    getMobilePopupUp: '/mobilePopup/up/',
    //移动赠课弹窗-编辑
    setMobilePopupEdit:'/mobilePopup/edit/',
    //移动赠课弹窗-添加
    setMobilePopupAdd:'/mobilePopup/add',

    //分类一级删除
    setDelCategoryOne: '/category/delCategoryOne',
    //分类管理-分类排序
    setCategorySort:'/category/sort',

    //分类查询接口
    courseClassifies:'/course/classifies',
    //评论列表
    getTypeCommentList: (objs) => { return `/information/view/getCommentList?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&informationId=${objs.informationId}` },
    //显示隐藏 /information/view/setCommentShow
    getSetCommentShow: '/information/view/setCommentShow',
    //级列表查询
    getInformationsecondList:'/information/secondList',
    //删除课程列表分类选中数据
    setDeleteBySecondList: (objs) => { return `/information/deleteSecondMenu/${objs.id}` },
    //资讯多选接口
    getinformationList: (objs) => { return `/information/informationList?name=${objs.name}` },
    //资讯多选确认添加接口
    getAddSecondMenu: '/information/addSecondMenu',
    //限时购，资讯二级菜单开关
    getInformationEnable: '/information/enable',
    //开启状态查询
    getInformationSwitch:(objs) => { return `/information/switch/${objs.type}` },


    //限时购课程列表
    getTimeLimitedDiscounts: (objs) => { return `/timeLimitedDiscounts/chooseCourseBySecondMenu?&title=${objs.title}&mtype=${objs.mtype}` },
    getTimeLimiteDsecondList: (objs) => { return `/timeLimitedDiscounts/secondList?&mtype=${objs.mtype}` },
    getTimeLimitedAddSecondMenu: '/timeLimitedDiscounts/addSecondMenu',
    getTimeLimiteddeleteById:  (objs) => { return `/timeLimitedDiscounts/deleteBySecondListId/${objs.id}` },

    //资讯管理
    //资讯管理-->新建资讯 post
    informationAdd: '/information/add',
    //资讯管理列表-->编辑 post
    informationUpdate: '/information/update',
    //资讯管理列表-->上线 post
    informationUp: (objs) => { return `/information/${objs.id}/up` },
    //资讯管理列表-->下线
    informationDown: (objs) => { return `/information/${objs.id}/down` },
    //资讯管理列表-->置顶
    informationUpTop: (objs) => { return `/information/${objs.id}/upTop` },
    //资讯管理列表-->取消置顶
    informationDownTop: (objs) => { return `/information/${objs.id}/downTop` },
    //资讯管理-->列表分页/查询/搜索
    informationPetPage: (objs) => { return `/information/getPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}&state=${objs.state}` },
    //资讯管理列表-->删除
    informationDelete: (objs) => { return `/information/${objs.id}/delete` },
    //资讯管理列表-->编辑回显详情
    informationView: (objs) => { return `/information/view?id=${objs.id}` },


    //排序
    informationSort:'/information/sort',


    //订单充值
    rechargeSelectIncome: (objs) => { return `/recharge/selectIncome?beginAt=${objs.beginAt}&endAt=${objs.endAt}` },
    orderSelectInco: (objs) => { return `/order/selectIncome?beginAt=${objs.beginAt}&endAt=${objs.endAt}&paymentType=${objs.paymentType}` },


    //特殊海报
    //后台模板管理-->分页
    courseShareModelList: (objs) => { return `/courseShareModel/selectPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&type=${objs.type}` },
    //后台模板管理-->新建模板
    courseShareModelNew: '/courseShareModel/add',
    //后台模板管理-->关
    courseShareModelDown: (objs) => { return `/courseShareModel/model/${objs.id}/down` },
    //后台模板管理-->开
    courseShareModelUp: (objs) => { return `/courseShareModel/model/${objs.id}/up` },
    //删除
    courseShareModelDelete: (objs) => { return `/courseShareModel/model/${objs.id}` },

    //定制会员卡
    customizedCardList: (objs) => { return `/memberMake/getPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&name=${objs.name}&state=${objs.state}&categoryType=${objs.categoryType}` },
    customizedCardAdd: '/memberMake/add',
    customizedCardUpdate:(objs) => { return `/memberMake/update/${objs.id}` },
    customListSeeData: (objs) => { return `/memberMakeRecord/selectPage?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&memberId=${objs.memberId}&searchContent=${objs.searchContent}&activitionFlag=${objs.activitionFlag}&beginAt=${objs.beginAt}&endAt=${objs.endAt}` },
    delayDetailedlist: (objs) => { return `/memberMakePostpone/selectPage?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&searchContent=${objs.searchContent}&memberId=${objs.memberId}` },
    memberMakeGetUserPage: (objs) => { return `/memberMake/getUserPage?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&memberId=${objs.memberId}` },
    delayOnleyOne: '/memberMakePostpone/addOne',
    delaySomeList: '/memberMakePostpone/addAll',
    customMakeDown: (objs) => { return `/memberMake/down/${objs.id}` }, //pageNo=1&pageSize=10&searchContent=
    customMakeUp: (objs) => { return `/memberMake/up/${objs.id}` },
    //ljm 19-12-13
    //定制会员卡 回显已选的排除课程 memberId
    memberMakeGetAlreadyCourse: (objs) => { return `/memberMake/getAlreadyCourse?memberId=${objs.memberId}` },
    //定制会员卡 获取自有课程
    memberMakeGetOurCourses:(objs) => { return `/memberMake/getOurCourses?title=${objs.title}` },
    // 定制会员卡 电话号码核验
    memberMakeCheckCourse: '/memberMake/checkCourse',


    //添加课程匹配
    courseMatchingAdd: '/courseMatching/add',
    //编辑课程匹配信息
    courseMatchingEdit: (objs) => { return `/courseMatching/edit/${objs.id}` },
    // 删除课程匹配信息
    courseMatchingDel: (objs) => { return `/courseMatching/del/${objs.id}` },
    //查询课程匹配分页列表
    courseMatchingGetPage: (objs) => { return `/courseMatching/getPage?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&searchContent=${objs.searchContent}` },
    //添加课程匹配背景
    courseMatchingBackgroundadd: '/courseMatchingBackground/add',
    //修改课程匹配背景信息
    courseMatchingBackgroundEdit: (objs) => { return `/courseMatchingBackground/edit/${objs.id}` },
    //删除课程匹配背景信息
    courseMatchingBackgroundDel: (objs) => { return `/courseMatchingBackground/del/${objs.id}` },
    //查询课程匹配背景分页列表
    courseMatchingBackgroundGetPage: (objs) => { return `/courseMatchingBackground/getPage?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&searchContent=${objs.searchContent}` },
    //获取课程数据
    coursePragramCourseList: '/course/getCourseList',
    //华为课程匹配
    //华为教育课程ID匹配-添加
    getHwEduAdd: '/hwEdu/add',
    //华为教育课程ID匹配-编辑
    getHwEduAdit: '/hwEdu/edit',
    //华为教育课程ID匹配-删除
    getHwEduDel:  (objs) => { return `/hwEdu/del/${objs.id}` },
    //华为教育课程ID匹配-查询
    getHwEduList: (objs) => { return `/hwEdu/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&searchContent=${objs.searchContent}` },
    // getHwEduList: '/hwEdu/list',



    //学友圈
    //学友圈话题列表查询
    getTopicListTopic: '/topic/getTopicList',
    //学友圈话题添加
    getAddTopicTopic: '/topic/addTopic',
    //学友圈话题修改
    getUpdateTopicTopic: '/topic/updateTopic',
    //学友圈删除话题
    getDeleteTopicTopic: '/topic/deleteTopic',
    //学友圈话题上线和下线
    getUpTopicTopic:'/topic/upTopic',
    //学友圈话题置顶或取消置顶
    getToppingTopicTopic: '/topic/toppingTopic',
    //学友圈话题预置
    getPresetTopicTopic:'/topic/presetTopic',
    //学友圈话题审批
    getApprovalTopicTopic:'/topic/approvalTopic',
    //学友圈根据id查询话题
    getFindTopicById: '/topic/findTopicById',

    //学友圈说说评论列表
    getClassmatesMsgCommentList:'/classmatesMsgComment/getClassmatesMsgCommentList',
    //学友圈说说评论隐藏和显示
    getShowClassmatesMsgComment:'/classmatesMsgComment/showClassmatesMsgComment',
    //学友圈说说评论批量审核
    getApprovalClassmatesMsgComment:'/classmatesMsgComment/approvalClassmatesMsgComment',
    //学友圈说说评论查询举报列表
    getReportList:'/classmatesMsgComment/getReportList',
    //学友圈教师认证
    getAuthenticationTeacher:'/teacher/authenticationTeacher',
    //学友圈查询认证信息
    getTeacherAuthRecord:'/teacher/getTeacherAuthRecord',
    //学友圈取消教师认证
    getCancelAuth:'/teacher/cancelAuth',



    //新添加课程管理接口
    // 获取分类的一级列表
    getCategoryOneListCategory: '/category/getCategoryOneList',
    getCategoryTwoListCategory: (objs) => { return `/category/getCategoryTwoList?id=${objs.id}` },


    //4.23活动基础数据
    getActivityBaseDataRd: '/rd/getActivityBaseData',
    //4.23根据渠道获取列表
    getListByChannelRd: '/rd/getListByChannel',
    //4.23根据渠道获取用户详情
    getUserDetailByChannelRd: '/rd/getUserDetailByChannel',
    //4.23获取注册用户详情
    getRegisterUserDetailRd:'/rd/getRegisterUserDetail',
    //4.23获取积分详情
    getIntegralDetailRd:'/rd/getIntegralDetail/',
    //4.23获取用户充值详情
    getOrderDetailRd: '/rd/getOrderDetail/',
    //4.23活动打点数据
    getButtonListRd:'/rd/getButtonList',


    //添加2级分类
    addCategoryTwoCategory: '/category/addCategoryTwo',
    //删除二级分类
    delCategoryTwoCategory: '/category/delCategoryTwo',
    //修改二级分类名称
    editCategoryTwoCategory: '/category/editCategoryTwo',
    //查询二级分类列表
    getCategoryTwocategory:(objs) => { return `/category/getCategoryTwo?id=${objs.id}&pageNo=${objs.pageNo}&pageSize=${objs.pageSize}` },

    //积分活动数据回填
    integralActivityManagementGetinfo: '/integralActivityManagement/getinfo',
    integralThematicActivitySave:'/integralActivityManagement/save',

    //关于我们 1，公司简介 2，大事记 3，荣誉资质 4，联系我们 5，关于隐私 6，责任免声明
    informAboutUsSave: '/aboutUs/save',
    informAboutUsView: (objs) => { return `/aboutUs/view?type=${objs.type}`},
    informImgList: (objs) => { return `/aboutUs/getPage?type=${objs.type}&pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    //荣誉资质
    aboutUsDelete: (objs) => { return `/aboutUs/delete/${objs.id}`},

    //渠道管理
    channelAllList: (objs) => { return `/pipeline/list?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&name=${objs.name}&channelType=${objs.channelType}` },
    channelDel: (objs) => { return `/pipeline/${objs.id}/del` },
    channelListName: 'pipeline/option',
    channelUpdate: 'pipeline/update',
    channelAdd: 'pipeline/add',
    getChannelDataNext:'pipeline/sync/option',
    getChannelData: (objs) => { return `/pipeline/${objs.channelId}/sync` },
    //设置评论精华
    getCreamElite: (objs) => { return `/comment/${objs.id}/${objs.isElite}` },
    //关联课程
    relevanceCourseId: (objs) => { return `/course/${objs.courseId}/setMapping` },
    //关联课程列表
    relevanceCourseList:(objs) => { return `/course/selectCourse/?title=${objs.title}&courseId=${objs.courseId}` },
    //课程销售排行
    courseStatslist: (objs) => { return `/course/stats/list?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&courseName=${objs.courseName || ''}&sellStatus=${objs.sellStatus}&sortType=${objs.sortType}` },
    //课程销售统计
    courseStatistics: (objs) => { return `/course/stats/statistics?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&sellStatus=${objs.sellStatus}&courseName=${objs.courseName}&beginAt=${objs.beginAt}&endAt=${objs.endAt}` },
    businessCooperation: (objs) => { return `/businessCooperation/list?name=${objs.name}&pageNo=${objs.pageNo}&pageSize=${objs.pageSize}` },
    coperationLook: (objs) => { return `/businessCooperation/${objs.id}/${objs.isContacted}?name=${objs.name}&pageNo=${objs.pageNo}&pageSize=${objs.pageSize}` },
    batchListInfo: (objs) => { return `/studyCard/${objs.id}/detail?pageSize=${objs.pageSize}&activitionFlag=${objs.activitionFlag}&pageNo=${objs.pageNo}&cardNum=${objs.cardNum || ''}` },
    batchActivityStudyCardListInfo:(objs) => { return `/activityStudyCard/${objs.id}/detail?pageSize=${objs.pageSize}&activitionFlag=${objs.activitionFlag}&pageNo=${objs.pageNo}&cardNum=${objs.cardNum||''}` },


    //大客户
    // 大客户课程包 添加
    customerAddBag: '/customer/addBag',
    //大客户课程包 条件分页查询
    customerGetPage:(objs) => { return `/customer/getPage?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&bagName=${objs.bagName}&status=${objs.status}` },
    //大客户课程包 自有课程查询
    customergetOurCourses: "/customer/getOurCourses",
    //大客户课程包 启动
    customerStart: "/customer/start",
    //大客户课程包 禁用
    customerDisable:'/customer/disable',
    //大客户课程包 查询已选课程
    customerGetCourses: (objs) => { return `/customer/getCourses?courseBagId=${objs.courseBagId}` },
    //大客户课程包 追加课程
    customerAddCourses:'/customer/addCourses',
    //大客户课程包 电话号码回显
    customerGetUsers: (objs) => { return `/customer/getUsers?courseBagId=${objs.courseBagId}` },
    //大客户课程包 追加号码
    customerAddCellphones:'/customer/addCellphones',
    //大客户课程包 详情查询（上面部分）
    customerGetBagUserHeader:(objs) => { return `/customer/getBagUserHeader?courseBagId=${objs.courseBagId}` },
    //大客户课程包 详情查询（下面部分）
    customerGetBagUserItem: (objs) => { return `/customer/getBagUserItem?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&courseBagId=${objs.courseBagId}&receiveStatus=${objs.receiveStatus}&status=${objs.status}&cellphone=${objs.cellphone}` },
    // 大客户课程包 禁用用户
    customerUserDisable:'/customer/userDisable',
    //大用户课程包 用户开启
    customerUserStart: '/customer/userStart',
    //大客户课程包 修改操作回显数据
    customerEdit:(objs) => { return `/customer/edit?courseBagId=${objs.courseBagId}` },
    getStudyCardCourseList: (objs) => { return `/studyCard/getCourseList?cardBaseId=${objs.cardBaseId}&title=${objs.title}&mtype=${objs.mtype}&pipelineId=${objs.pipelineId}` },
    getStudyCardAddCourse: '/studyCard/addCourse',
    getStudyCardaddNum: '/studyCard/addNum',

    getActivityStudyCardCourseList: (objs) => { return `/activityStudyCard/getCourseList?cardBaseId=${objs.cardBaseId}&title=${objs.title}&mtype=${objs.mtype}&pipelineId=${objs.pipelineId}` },
    getActivityStudyCardAddCourse: '/activityStudyCard/addCourse',
    getActivityStudyCardaddNum: '/activityStudyCard/addNum',


    //闪屏广告
    getFlashAdvertisingList: (objs) => { return `/flashAdvertising/getFlashAdvertisingList?pageNo=${objs.pageNo}&pageSize=${objs.pageSize}&createdAt=${objs.createdAt}&title=${objs.title}` },
    //删除闪屏广告列表;
    deleteFlash: '/flashAdvertising/deleteFlash',
    //查询课程列表
    getCourseListNewAdvied: '/flashAdvertising/getCourseList',
    //闪屏广告-点击数
    flashAdvertisingClickNum:'/flashAdvertising/clickNum/',




    addUserorigin: '/userorigin/add',//添加用户
    deleteUserorigin: '/userorigin/delete',
    updateUserorigin: '/userorigin/update',
    useroriginGetAllOrigin:'/userorigin/getAllOrigin',
    useroriGingetPageList:(objs) => { return `/userorigin/getPageList?id=${objs. id}&pageNo=${objs.pageNo}&pageSize=${objs.pageSize}` },


    getColumnList:'/appHomePage/getColumnList',//查询app首页栏目列表
    getAppHomePage:'/appHomePage/moduleList',//查询app首页数据列表
    getSubModuleInfoList:'/appHomePage/subModuleInfoList',//查询app首页子模板数据列表
    getCourseList:'/course/getList',//首页设置-查询课程列表
    getInformationList:'/information/getList',//首页设置-查询资讯列表
    getClassifyList:'/appHomePage/getClassifyList',//查询分类列表(注销)
    getClassify:'/appHomePage/getClassify',//查询一级或二级的分类（按成人或少儿）
    getCategoryTwoList:'/category/getCategoryTwoList',//根据一级分类查询二级分类
    getLabelList:'/label/getList',//查询标签列表
    getTimeLimitCourses:'/timeLimitedDiscounts/getList',//查询限时购课程列表
    getFreeListForPeriod:'/course/getFreeListForPeriod',//查询免费课程列表包含课时列表
    getFreePeriodListForCourse:'/course/getFreePeriodListForCourse',//查询所有带试看课时的课程列表
    getThematicActivityList:'/thematicActivity/getList',//查询专题活动列表
    getListByClassifyId:'/course/getListByClassifyId',//根据分类查询课程列表
    getListByLabelId:'/course/getListByLabelId',//根据标签查询课程列表
    getAppHomeListByTeacher:'/teacher/getAppHomeList',//获取app首页模块老师列表
    modColumnName:'/appHomePage/modColumnName',//修改栏目名称
    saveSubModule:'/appHomePage/saveSubModule',//保存子模块数据
    delColumnInfo:'/appHomePage/delColumnInfo',//首页栏目删除
    saveSubModuleSort:'/appHomePage/saveSubModuleSort',//保存模块排序数据
    columnInfoSort:'/appHomePage/columnInfoSort',//首页栏目排序修改
    getAssembleCourses:'/appHomePage/getAssembleCourses',//获取拼团课程
    getAppSecondPageLabelList:'/label/getAppSecondPageLabelList',//查询app二级页面标签设置列表
    addAppSecondPageLabel:'/label/addAppSecondPageLabel',//添加appapp二级页面标签
    delAppSecondPageLabel:'/label/delAppSecondPageLabel',//删除app二级页面标签
    sortAppSecondPageLabel:'/label/sortAppSecondPageLabel',//app二级页面标签排序
    getRegionList:'/region/getList',//获取地区列表
    getSchoolList:'/schoole/getPage',//获取学校管理列表
    addSchool:'/schoole/add',//学校管理添加合作学校
    editSchool:'/schoole/mod',//学校管理编辑学校信息
    addCooperationPlatform:'/cooperationPlatform/add',//添加合作平台
    getCooperationPlatformList:'/cooperationPlatform/getPage',//查询合作平台数据列表
    editCooperationPlatform:'/cooperationPlatform/mod',//编辑合作平台
    upCooperationPlatform:'/cooperationPlatform/up',//上架合作平台
    downCooperationPlatform:'/cooperationPlatform/down',//下架合作平台
    getWxColumnList:'/appletHomePage/getColumnList',//查询小程序首页栏目列表
    modWxColumnName:'/appletHomePage/modColumnName',//修改小程序首页栏目名称
    moduleList:'/appletHomePage/moduleList',//查询小程序首页数据列表
    subModuleInfoList:'/appletHomePage/subModuleInfoList',//查询小程序首页子模板数据列表
    saveWxSubModule:'/appletHomePage/saveSubModule',//小程序保存模块数据
    saveWxSubModuleSort:'/appletHomePage/saveSubModuleSort',//小程序首页设置保存模块排序数据
    columnWxInfoSort:'/appletHomePage/columnInfoSort',//小程序首页栏目排序修改
    delWxColumnInfo:'/appletHomePage/delColumnInfo',//小程序首页栏目删除
    updateHotWordsType:'/hotword/updateHotWordsType',//设置热词
    getGiftList:'/gift/getPage',//获取礼包列表
    addGiftBag:'/gift/add',//添加大礼包
    editGift:'/gift/mod',//编辑大礼包信息
    upGift:'/gift/up',//上架大礼包
    downGift:'/gift/down',//下架大礼包
    goDetail:'/gift/details',//查询详情
    getGiveCourseList:'/giveCourseActivities/getGiveCourseList',//赠送课程-获取赠送课程列表
    addGiveCourseActivities:'/giveCourseActivities/addGiveCourseActivities',//赠送课程-添加
    deleteGiveCourseActivities:'/giveCourseActivities/deleteGiveCourseActivities',//赠送课程-删除
    updateGiveCourseActivities:'/giveCourseActivities/updateGiveCourseActivities',//赠送课程-修改
    findDetail:'/giveCourseActivities/findDetail',//赠送课程-获取详情
    getGiveCourseRecordList:'/giveCourseActivities/getGiveCourseRecordList',//赠送课程-领取记录列表
    getAppSecondPageClassifyList:'/category/getAppSecondPageClassifyList',//查询app二级页面分类设置列表
    addAppSecondPageClassify:'/category/addAppSecondPageClassify',//添加appapp二级页面分类
    delAppSecondPageClassify:'/category/delAppSecondPageClassify',//删除app二级页面分类
    sortAppSecondPageClassify:'/category/sortAppSecondPageClassify',//app二级页面分类排序
    getUserPermission:'/login/userPermission',//获取权限
    addShortVideo:'/shortVideo/add',//短视频添加
    getShortVideoList:'/shortVideo/getPage',//查询短视频列表
    shortVideoTop:'/shortVideo/top',//短视频置顶
    shortVideoCancelTop:'/shortVideo/cancelTop',//短视频取消置顶
    getTopCount:'/shortVideo/getTopCount',//获取短视频置顶数量
    shortVideoUp:'/shortVideo/up',//上架短视频
    shortVideoDown:'/shortVideo/down',//下架短视频
    updateShortVideo:'/shortVideo/mod',//编辑短视频
    snapshotList:'/shortVideo/snapshotList',//获取视频截图地址
    searchWord:'/hotword/searchWord',//查询热词热度
    studyRecord:'/appUser/studyRecord',//查询用户学习记录
    getDataAuth:'/dataAuthority/listAuth',//获取数据权限
    saveDataAuth:'/dataAuthority/save',//保存数据权限
    getAuthList:'/permission/selectPage',//获取权限列表(分页)
    addAuth:'/permission/add',//添加权限菜单
    getAllAuth:'/permission/selectList',//获取权限列表(不分页)
    getCourseVisitRank:'/courseVisitRank/getPage',//查询课程统计页面分页
    exportCourseVisitRank,//导出课程统计排行榜
    prohibitedWordAdd:'/prohibitedWord/add',//违禁词添加
    prohibitedWordList:'/prohibitedWord/getPage',//违禁词查询
    prohibitedWordDel:'/prohibitedWord/delete',//违禁词删除
    commentTotal:'/comment/selectCommentCount',//获取总的评论数
    commentList:'/comment/getPage',//获取评论列表
    auditComment:'/comment/audit',//评论审核
    commentReply:'comment/reply',//小夫子回复
    commentTop:'/comment/top',//评论设置推荐
    commentElite:'/comment/elite',//评论设置精华
    offEliteTop:'/comment/offEliteTop',//评论管理 取消推荐/精华
    commentShow:'/comment/display',//评论显示
    commentHide:'/comment/hide',//评论隐藏
    commentReportList:'/comment/reportItem',//获取评论举报详情
    exportIntegral,//导出积分
    //查询
    courseRelationgGetPage:(objs) => { return `/courseRelation/getPage?keyWordId=${objs.keyWordId}&pageNo=${objs.pageNo}&pageSize=${objs.pageSize}` },
    courseRelationDelete:(objs) => { return `/courseRelation/delete/${objs.id}` },
    courseRelationSave:'/courseRelation/save',
    getOurCoursesUse:'/course/getOurCoursesUse',//查询上架的自有课程（学国学网）
    addUnicomBag:'/unicom/addUnicomBag',//添加联通包
    editUnicomBag:'/unicom/editUnicomBag',//编辑联通客户包
    getUnicomPage:'/unicom/getPage',//联通流量包分页查询
    getCount:'/unicom/getCount',//获取总订购数 和 取消订购数
    getdetailPage:'/unicom/getdetailPage',//明细分页查询
    detailInfo:'/unicom/detailInfo',//查看明细数据
    getOrderList:'/unicom/getOrderList',//获取每月订单列表
    exportUnicom:exportUnicom,
    addPlayCount:'/shortVideo/addPlayCount',//短视频追加虚拟播放次数
    addCourseBrowsCount: '/course/addCourseBrowsCount',//课程追加虚拟播放次数
    getflowOrderListUnicom:(objs) => { return `/unicom/getflowOrderList?id=${objs.id}&cellphone=${objs.cellphone}&pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&type=${objs.type}` },

    getCardCountStudyCard: (objs) => { return `/studyCard/getCardCount?cardBaseId=${objs.cardBaseId}` },
    getOriginStudyCard: '/studyCard/getOrigin',
    getCardCountActivityStudyCard: (objs) => { return `/activityStudyCard/getCardCount?cardBaseId=${objs.cardBaseId}` },
    // getOriginaAtivityStudyCard: '/activityStudyCard/getOrigin',
    addCellphoneStudyCard:'/studyCard/addCellphone',
    addCellphoneActivityStudyCard:'/activityStudyCard/addCellphone',
    getCouponsCountCoupons: (objs) => { return `/coupons/getCouponsCount?couponId=${objs.couponId}` },
    receiveCouponByCellphonecoupons: "/coupons/receiveCouponByCellphone",
    getThemeInfoAboutUs: 'aboutUs/getThemeInfo',
    saveThemeAboutUs: (objs) => { return `/aboutUs/saveTheme/${objs.type}` },
    //查询分类列表
    getCategoryGetList:'/category/getList',







    //互动课-追加播放数
    h5AddAddHits: '/interact/addAddHits',
    //互动课-修改课程
    h5ModifyCourse: '/interact/modifyCourse/',
    //互动课-课程详情
    h5Course: '/interact/course/',
    //互动课-获取课程列表获取需要传递Id
    h5CourseList: '/interact/courseList',
    //互动课-添加互动课程
    h5courses: '/interact/course',
    //互动课-获取互动课活动列表
    h5GetCourseActivity: '/interact/getCourseActivity',
    //互动课-新增互动课活动
    h5AddCourseActivity: '/interact/addCourseActivity',
    
    //互动课-互动课活动设置
    h5SetActivityCurrency: '/interact/setActivityCurrency',
    //互动课-查询课活动设置
    h5GetActivityCurrency:'/interact/getActivityCurrency',
    //互动课-孚星，智力值
    h5CourseCurrency: '/interact/courseCurrency/',
    //互动课-新增/修改孚星，智力值
    h5CourseCurrencyEdit: '/interact/courseCurrency',
    //互动课-查询勋章,互动课-新增\修改勋章
    h5InteractMedal: '/interact/medal',

    //互动课-课时列表
    h5PeriodList: '/interact/periodList',
    //互动课-总结列表
    h5SummaryList: '/interact/summaryList',
    //1.互动课-创建课时 2.互动课-课时详情 3.互动课-修改课时
    h5Period: '/interact/period',
    //1.互动课-创建总结 2.互动课-修改总结
    h5Summary: '/interact/summary',
    //互动课-订单列表
    h5GetOrderPage: '/interact/getOrderPage',
    //互动课-订单邮寄记录
    h5OrderMail: '/interact/orderMail/',
    //互动课-邮寄
    h5InteractMail:'/interact/mail',
    //互动课-邮寄修改
    h5InteractModifyMail:'/interact/modifyMail',
    // 互动课-收货地址
    h5AddressList: '/interact/addressList',
    //互动课-用户列表
    h5InteractUserList: '/interact/userList',
    //互动课-用户详情
    h5InteractUserDetail: '/interact/userDetail',
    


    //互动课-获取视屏封面图
    getInteractVideo:'/interact/getVideo',
    //互动课-课时设置
    h5InteractSetPeriod:'/interact/setPeriod/',


    //疯狂猜猜猜-获取统计基础数据
    ciGetActivityBaseData:'/ci/getActivityBaseData',
    //疯狂猜猜猜-Button打点数据
    ciGetButtonList:'/ci/getButtonList',
    //疯狂猜猜猜-根据渠道获取列表
    ciGetListByChannel:'/ci/getListByChannel',
    //疯狂猜猜猜-访问用户列表
    ciVisitUserList:'/ci/visitUserList',
    //疯狂猜猜猜-购买用户列表
    ciPayUserList:'/ci/payUserList',
    //疯狂猜猜猜-邀请用户列表
    ciInviteUserList: '/ci/inviteUserList/',
    //疯狂猜猜猜-用户得分列表
    ciUserScoreList: '/ci/userScoreList/',
    //疯狂猜猜猜-发货
    ciMail: '/ci/mail/',

    //H5
    getExchangeRecord:'/interact/exchangeRecord/',


    //cpa
    // /CPA-CPA列表
    cpaGetCpaList: '/cpa/getCpaList',
    //新建编辑CPA
    cpaSaveCpa: '/cpa/saveCpa',
    //-注册用户列表
    cpaGetUserList: '/cpa/getUserList',
    //CPA-基础信息
    cpaGetBaseData: '/cpa/getBaseData',
    //CPA-订单
    cpaGetOrderList:'/cpa/getOrderList',


    //智慧屏
    //查询智慧屏首页栏目列表
    getColumnListType: '/wisdomScreen/getColumnList',
    //保存子模块数据
    getSaveSubModule: '/wisdomScreen/saveSubModule',
    //查询智慧屏首页数据列表
    getHomeModuleList: '/wisdomScreen/moduleList',
    //保存模块排序数据
    getSaveSubModuleSort: '/wisdomScreen/saveSubModuleSort',
    //查询根据成人或少儿查询分类列表
    getModelClassifyList: '/wisdomScreen/getClassifyList',
    //查询课程接口
    getModelCourseList: '/wisdomScreen/getCourseList',
    //查询智慧屏首页子模板数据列表
    subScreenModuleInfoList: '/wisdomScreen/subModuleInfoList',
    //开屏图
    saveWisdomScreenImgScreen: '/wisdomScreen/saveWisdomScreen',
    //智慧屏查询开屏图
    getFlashScreenWisdomScreen:'/wisdomScreen/getFlashScreen',

    //赠课注册列表
    //赠课注册活动-查询注册活动列表 get
    getActivityRegisterList: '/activityRegister/getActivityRegisterList',
    //赠课注册活动-修改 post
    getUpdateActivityRegister:'/activityRegister/updateActivityRegister',
    //赠课注册活动-根据ID查询 get
    getRegisterFindById: '/activityRegister/findById',
    //赠课注册活动-是否禁用 post
    getRegisterSetEnabled: '/activityRegister/setEnabled',
    //赠课注册活动-追加课程记录列表
    getRegisterRecord:'/activityRegister/getRecord',
    //赠课注册活动-详情 get
    getRegisterDetail: '/activityRegister/detail',
    //赠课注册活动-追加课程 post
    getAdditionalCourse: '/activityRegister/additionalCourse',
    //赠课注册活动-获取年级 get
    getGradeListType:'/schoole/getGradeList',


    //移动积分活动
    getPageMobileActivity: '/mobileActivity/getPage',
    removeMobileActivity: '/mobileActivity/cancel/',
    setMobileActivity: '/mobileActivity/add',
    getInfoPageMobileActivity: '/mobileActivity/getInfoPage/',
    //商品ID
    getRelationPage: '/mobileActivity/getRelationPage',
    setAddRelation: '/mobileActivity/addRelation',
    editRelationMobileActivity: '/mobileActivity/editRelation/',
    setDelRelation: '/mobileActivity/delRelation/',
    

    getCollectionOrderList: '/collectionOrder/getCollectionOrderList', 
    getCollectionOrderDetail: '/collectionOrder/detail/',
    
    //课程管理圈子
    saveOrUpdateCourseCircle: '/course/saveOrUpdateCourseCircle', 
    //课程管理广告语
    saveOrUpdateCourseAdvertisement: '/course/saveOrUpdateCourseAdvertisement ',
    //课程管理圈子
    getCircleByCourseId:'/course/getCircleByCourseId/',
    //课程管理圈子
    getAdvertisementByCourseId: '/course/getAdvertisementByCourseId/',
    

    //移动合集订单-查询列表
    getMobilePopupOrderPage: '/mobilePopupOrder/getPage',
    //移动合集订单-查看详情
    getMobilePopupOrderDetail:'/mobilePopupOrder/getDetail/',

    //添加月度会员
    addMonthMember: '/monthMember/add',
    //编辑月度会员
    editMonthMember: (objs) => { return `/monthMember/edit/${objs.id}` },
    //会员上线
    upMonthMember: (objs) => { return `/monthMember/up/${objs.id}` },
    //会员下线
    downMonthMember: (objs) => { return `/monthMember/down/${objs.id}` },

    //查询入口设置信息
    getEntranceInfoUnicom: '/unicom/getEntranceInfo',
    //保存入口信息
    saveEntranceInfoUnicom: '/unicom/saveEntranceInfo',
    //查询订购详情列表分页
    getDetailMonthMember: (objs) => { return `/monthMember/getDetailPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&id=${objs.id}` },
    //查询月度会员卡列表分页
    getPageMonthMember: (objs) => { return `/monthMember/getPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    //查询月度会员订单列表分页
    getOrderMonthMember: (objs) => { return `/monthMember/getOrderPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&searchContent=${objs.searchContent}&state=${objs.state}&paymentType=${objs.paymentType}&beginAt=${objs.beginAt}&endAt=${objs.endAt}` },
    //查询联通会员用户列表
    getUnicomUserPageUnicom: (objs) => { return `/unicom/getUnicomUserPage?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}&cellphone=${objs.cellphone}` },
    getEquityPageMonthMember: (objs) => { return `/monthMember/getEquityPage/${objs.id}?pageSize=${objs.pageSize}&pageNo=${objs.pageNo}` },
    addEquityUnicom: '/monthMember/addEquity',
    getUnicomBagListUnicom:'/unicom/getUnicomBagList',
    // getGoodsList:'/goods/getGoodsList',
    // getGoodsClassifyList:'/goodsClassify/getGoodsClassifyList',
    goodsGetAllGoodsPageInfo:'/goodsPageInfo/getAllGoodsPageInfo',//查询商品页数据
    goodsSaveSubModuleSort:'/goodsPageInfo/saveSubModuleSort',//保存商品页模块
    goodsSaveSubModule:'/goodsPageInfo/saveSubModule',//添加商品页子模块
    goodsSubModuleInfoList:'/goodsPageInfo/subModuleInfoList',//查询商品页子模块数据
    addQuestionBank:'/questionBank/addQuestionBank',//新增题库
    questionBankPage:'/questionBank/questionBankPage',//查询题库列表\
    modQuestionBank:'/questionBank/modQuestionBank',//修改题库
    saveQuestionTitle:'/questionBank/saveQuestionTitle',//保存题目
    questionTitleList:'/questionBank/questionTitleList',//根据题库ID查询题目列表
    h5,
    getInterestList:'interest/list',//获取兴趣列表
    getWaitMessageList:'/message/getWaitMessageList',//站内信-查询待发送消息列表


    //新的限时购
    timeLimitNewGetDiscountsActivityList: '/discountsActivity/getDiscountsActivityList',
    //删除列表
    timeLimitNewdelete: '/discountsActivity/delete/',
    //立即结束
    timeLimitNewEndNow:'/discountsActivity/endNow/',
    //创建限时购
    timeLimitAddDiscountsActivity: '/discountsActivity/addDiscountsActivity',
    //编辑限时购
    timeLimitUpdateDiscountsActivity: '/discountsActivity/updateDiscountsActivity',
    //编辑数据回填
    timeLimitDetail: '/discountsActivity/detail/',
    
    //首页设置 新的限时购 活动获取
    getHomeActionList: '/discountsActivity/searchDiscountsActivityList',
    //根据活动获取课程
    getBasisActiongetCourse:'/discountsActivity/searchDiscountsActivityCourseList',


    //微页面
    //根据条件查询课程
    getSearchCourseList: '/microPage/searchCourseList',
    //查询微页面列表
    getMicroPageList: '/microPage/getMicroPageList',
    //根据微页面获取详情
    getWxMicroPage: '/microPage/getDetail/',
    //新增微页面详情
    setWxSaveMicroPageDetail: '/microPage/saveMicroPageDetail',
    //删除微页面
    deleteWxMicroPage: '/microPage/deleteMicroPage/',
    //微页面上下线
    upAndDownWxMicroPage: '/microPage/upAndDownMicroPage/',
    //新建微页面
    setWxSaveAndEditMicroPage: '/microPage/saveAndEditMicroPage',
    //获取视频
    getWxVideoList: '/microPage/getVideoList',
    

    //春节活动-button打点
    getFuBaoButtonList: '/fuBao/getButtonList',
    //春节活动-获取活动统计基础数据
    getFuBaoActivityBaseData: '/fuBao/getActivityBaseData',   
    //春节活动-获取活动统计列表
    getFuBaoListByChannel: '/fuBao/getListByChannel ', 
    //春节活动-注册用户详情
    getFuBaoUserDetailByChannel: '/fuBao/getUserDetailByChannel',
    //春节活动-访问用户详情
    getFuBaoUserVisitDetail: '/fuBao/getUserVisitDetail',
    //活动课程详情
    getFuBaoCourseDetailList: '/fuBao/getCourseDetailList',
    //课程详情详情
    getFuBaoCourseDetail: '/fuBao/getCourseDetail/',
    //获奖记录
    getFuBaoAwardWinningRecordList:'/fuBao/getAwardWinningRecordList/',
    //礼金记录
    getFuBaoOurGoldList: '/fuBao/getOurGoldList/',
    //
    getQuestionBankUserAnswerRecord:"/questionBank/userAnswerRecord/"

}
    // let urlObj = 'http://15351q680y.imwork.net:12905';
    // let urlObj = 'http://sccms.youfushuyuan.com';
    let urlObj = 'https://sccms.youfushuyuan.com';
    // let urlObj = 'http://172.16.120.6:8769';


// BASE_API: '"http://sccms.youfushuyuan.com"', //仿生环境
// BASE_API:'"http://xgxcms.youfushuyuan.com"'

let base_url = process.env.NODE_ENV == 'production'?process.env.BASE_API:urlObj;
let ljm = {
    withdrawExport: (objs) => { return base_url + `/withdraw/export/${objs.userId}?token=${objs.token}` },
    invitationCodeExport: (objs) => { return base_url + `/invitationCode/export/${objs.id}?token=${objs.token}` },
    teacherExportSurvey: (id) => { return base_url + `/teacherCooperative/${id}/export/overview` },
    teacherExportIncom: (id) => { return base_url + `/teacherCooperative/${id}/export/sellInfo` },
    studyCardExport: (objs) => { return base_url + `/studyCard/export/${objs.id}?token=${objs.token}` },
    studyCardExportObs: (objs) => { return base_url + `/studyCard/export/list?type=${objs.type}&token=${objs.token}&keyword=${objs.keyword}&activitionFlag=${objs.activitionFlag || ''}` },
    courseStatsListExport: (objs) => { return base_url + `/course/stats/export?token=${objs.token}&courseName=${objs.courseName || ''}&sellStatus=${objs.sellStatus}` },
    newAllExport: (objs) => { return base_url + `/studyCard/export/${objs.id}?token=${objs.token}` }, //studyCard/export/{id}
    newAllActivityStudyCardExport: (objs) => { return base_url + `/activityStudyCard/export/${objs.id}?token=${objs.token}` }, //studyCard/export/{id}
    //学友圈话题列表导出
    getTopicListExportTopic: (objs) => { return base_url + `/topic/export/topicList?token=${objs.token}&topicName=${objs.topicName}&status=${objs.status}&topStatus=${objs.topStatus}&presetStatus=${objs.presetStatus}` },
    schooleSchooleExport: (objs) => { return base_url + `/schoole/schooleExport?id=${objs.id}&token=${objs.token}` },
    //进度条导出
    exportExcelcourseProgress: base_url + "/course/export/",
    //学友圈评论列表导出功能
    getExportClassmatesMsgCommentList: (objs) => { return base_url + `/classmatesMsgComment/export/classmatesMsgCommentList?token=${objs.token}&commentContent=${objs.commentContent}&reportStatus=${objs.reportStatus}&warningStatus=${objs.warningStatus}&showStatus=${objs.showStatus}&examineStatus=${objs.examineStatus}&beginAt=${objs.beginAt}&endAt=${objs.endAt}` },
    // exportExcelUser: (objs) => { return base_url + `/appUser/export/UserList?nickNameOrPhone=${objs.nickNameOrPhone}&gender=${objs.gender}&status=${objs.status}&beginAt=${objs.beginAt}&endAt=${objs.endAt}&token=${objs.token}&channelId=${objs.channelId}` },
    exportExcelUser: base_url + "/appUser/export/UserList",
    exportExcelCourseList: base_url + "/course/export/courseList",
    exportExcelOrder: base_url + '/order/export/orderList',
    exportExcelMoney: base_url + '/recharge/export/orderList',
    exportMobilePopupOrderList: base_url + '/mobilePopupOrder/export/orderList',
    exportStatistics: (objs) => { return base_url + `/course/stats/exportStatistics?token=${objs.token}&courseName=${objs.courseName || ''}&sellStatus=${objs.sellStatus}&beginAt=${objs.beginAt}&endAt=${objs.endAt}` },
    exportExcelmemberRecord: base_url + '/memberRecord/export/memberRecordList',
    exportExcelCouponDe: base_url + '/coupons/export/couponDetails',
    customCardExport: base_url + '/memberMakeRecord/export/memberMakeRecordList',
    //4.23导出访问用户详情
    exportUserDetailByChannelRd: base_url + '/rd/export/exportUserDetailByChannel',
    //4.23导出注册用户数据
    exportUserDetailList: base_url + '/rd/export/userDetailList',
    //互动活动导出
    exportOrderList:base_url + '/interact/export/orderList',

    //4.23活动打点数据导出
    exportButtonListRd: base_url + '/rd/export/ButtonList',
    //4.23活动积分导出 
    exportIntegralDetail: base_url + '/rd/export/integralDetail/',
    //4.23活动订单导出
    exportOrderDetail: base_url + '/rd/export/orderDetail/',
    //月度会员导出
    downMonthmemberList: (objs) => { return base_url + `/monthMember/export/monthmemberList?searchContent=${objs.searchContent}&state=${objs.state}&paymentType=${objs.paymentType}&beginAt=${objs.beginAt}&endAt=${objs.endAt}&token=${objs.token}` },
    //大客户课程包 导出
    customerUserExport: (objs) => { return base_url + `/customer/userExport?receiveStatus=${objs.receiveStatus}&cellphone=${objs.cellphone}&status=${objs.status}&courseBagId=${objs.courseBagId}&token=${objs.token}` },
    //热词搜索
    hotwordSearchWordExport: (objs) => { return base_url + `/hotword/searchWordExport?word=${objs.word}&type=${objs.type}&token=${objs.token}` },
    //移动积分导出
    exportInfoPageMobileActivity: (objs) => { return base_url + `/mobileActivity/exportInfoPage/${objs.id}?searchContent=${objs.searchContent}&beginTime=${objs.beginTime}&endTime=${objs.endTime}&token=${objs.token}`},
    exportCollectionOrderList: (objs) => { return base_url + `/collectionOrder/export/collectionOrderList?orderId=${objs.orderId}&orderStatus=${objs.orderStatus}&paymentType=${objs.paymentType}&beginAt=${objs.beginAt}&endAt=${objs.endAt}&token=${objs.token}` },
    actionImgOrvideo: base_url + '/uploadx/pic',


    //新的上传
    actionImgOrvideoNew: base_url + '/uploadx/file',


    //红包活动访问用户导出
    packExportVisitUserList: base_url + '/hbzd/export/visitUserList',
    //红包活动邀请用户列表导出
    packExportInviteUserList: base_url + '/hbzd/export/inviteUserList/',
    //红包活动获奖记录导出
    packExportLotteryRecord: base_url + '/hbzd/export/lotteryRecord/',
    
    packExportButtonList:base_url + '/hbzd/export/ButtonList',


    actionAudiouploadOss: base_url + '/uploadx/uploadOss',
    h5QuestionImportExcel: base_url + '/question/importExcel',

    uploadResource: base_url + '/uploadx/audio',
    
    upload: base_url + '/uploadx/pic',
    // actionImgOrvideoNew: base_url + '/uploadx/imgIo'
    getOriginList: '/common/getOriginList',
    //12月活动-用户详情导出
    userDetailList: base_url + '/doubleTwelve/export/userDetailList',
    //12月活动-访问用户
    userVisitDetail: base_url + '/doubleTwelve/export/userVisitDetail',
    //12月活动-购买详情导出
    OrderDetailList: base_url + '/doubleTwelve/export/OrderDetailList',
    //12月活动-导出Button打点数据列表
    exportButtonList: base_url + '/doubleTwelve/export/ButtonList',
    //12月活动-导出全部Button打点数据列表
    exportButtonListAll: base_url + '/doubleTwelve/export/AllButtonList',

    //疯狂猜猜猜-打点导出
    ciExportButtonList:base_url +'/ci/export/ButtonList',
    //疯狂猜猜猜-访问用户导出
    ciExportVisitUserList:base_url +'/ci/export/visitUserList',
    //疯狂猜猜猜-购买用户导出
    ciExportPayUserList:base_url +'/ci/export/payUserList',
    //疯狂猜猜猜-邀请用户导出
    ciExportInviteUserList:base_url +'/ci/export/inviteUserList/',
    //疯狂猜猜猜-用户得分导出
    ciExportUserScoreList:base_url +'/ci/export/userScoreList/',


     //用户管理-下载模板
    getWisdomDownloadExcelModel:base_url +'/appUser/downloadExcelModel',

    

    //元旦活动-用户详情导出
    nYuserDetailList: base_url + '/newYear/export/userDetailList',
    //元旦活动-访问用户
    nYuserVisitDetail: base_url + '/newYear/export/userVisitDetail',
    //元旦活动-购买详情导出
    nYOrderDetailList: base_url + '/newYear/export/OrderDetailList',
    //元旦活动-导出Button打点数据列表
    nYexportButtonList: base_url + '/newYear/export/ButtonList',
    //元旦活动-导出全部Button打点数据列表
    eYexportButtonListAll: base_url + '/newYear/export/AllButtonList',

    //元旦活动-获取活动统计基础数据
    getNyActivityBaseData: '/newYear/getActivityBaseData',
    //元旦活动-获取活动统计列表
    getNyListByChannel: '/newYear/getListByChannel',
    //元旦活动-获取用户详情
    getNyUserDetailByChannel: '/newYear/getUserDetailByChannel',
    //元旦活动-购买详情
    getNyOrderDetailByChannel: '/newYear/getOrderDetailByChannel',
    //元旦活动-访问用户
    getNyUserVisitDetail: '/newYear/getUserVisitDetail',
    //元旦活动-查询Button打点数据列表
    getNyButtonList: '/newYear/getButtonList',
    //元旦活动-查询统计表中课程
    getNyCourseDoubleTwelve: '/newYear/getCourse',


    //达人计划-添加课程
    getExpertAddCourses: '/expertplan/addCourses',
    //达人计划-课程列表 get
    getExpertCoursesList: '/expertplan/coursesList',
    //达人计划-删除课程
    getExpertDeleteCourses: '/expertplan/deleteCourses/',
    //达人计划-编辑狂欢节课程
    getExpertEditCarnival: '/expertplan/editCarnival',
    //达人计划-狂欢节列表 get
    getExpertCarnivalList: '/expertplan/carnivalList',
    //达人计划-优惠券列表
    getExpertCouponList: '/expertplan/couponList',
    //达人计划-狂欢节详情
    getExpertCarnivalDetail: '/expertplan/carnivalDetail/',
    //达人计划-返佣说明,达人计划-编辑返佣说明
    getExpertAddAbout: '/expertplan/addAbout',
    //达人计划-用户列表
    getExpertUserList: '/expertplan/userList',
    //达人计划-成长值详情
    getExpertScoreRecord: '/expertplan/scoreRecord/',
    //达人计划-清理
    getExpertClean: '/expertplan/clean',
    //达人计划-清理记录
    getExpertCleanRecord:'/expertplan/cleanRecord',
    //达人计划-清理列表
    getExpertCleanUserList: '/expertplan/cleanUserList',
    //课程列表选择
    getSelectCourseList: '/expertplan/getSelectCourseList',
    //达人计划-添加权益
    setSelectAddPotence: '/expertplan/addPotence',
    //达人计划-权益列表
    getExpertPotenceList: '/expertplan/potenceList',
    //达人计划-删除权益
    getExpertDeletePotence: '/expertplan/deletePotence/',
    //达人计划-查询返佣说明
    getExpertDboutList: '/expertplan/aboutList',
    //达人计划-返佣比例设置
    getExpertEditCommission: '/expertplan/editCommission',
    //达人计划-查看佣金设置
    getExpertCommissionList: '/expertplan/commissionList',
    //达人计划-成长值配置
    getExpertEditScore: '/expertplan/editScore',
    //达人计划-查看成长值配置
    getExpertScoreList: '/expertplan/scoreList',
    //达人计划-立即结束
    getExpertEndCarnival:'/expertplan/endCarnival/',
    

    //互动课-小节版本列表
    getPeriodVersion:'/interact/version/',
    //互动课-添加小节版本
    getAddVersion:'/interact/addVersion',
    
    //用户召回历史记录列表-
    getUserRecallRecordList: '/appUser/userRecallRecordList',
    //用户召回列表展示
    getUserRecallList: '/appUser/userRecallList',
    //用户召回信息发送
    getSendMessageForUserRecall:'/appUser/sendMessageForUserRecall',

    //春节活动-导出Button打点数据列表
    fuBaoexportButtonList: base_url + '/fuBao/export/ButtonList',
    //春节活动-导出全部Button打点数据列表
    fuBaoexportButtonListAll: base_url + '/fuBao/export/AllButtonList',
    //春节活动-用户详情导出
    gwtFuBaouserDetailList: base_url + '/fuBao/export/userDetailList',
    //春节活动-购买详情导出
    getFuBaoOrderDetailList: base_url + '/fuBao/export/userVisitDetail',
    //春节活动-导出课程详情 
    exportFuBaoButtonListAll: base_url + '/fuBao/export/courseDetail/',
    //达人导出-导出课程详情 
    exportLanUserList:base_url + '/expertplan/export/userList',

    //修改图片
    appGetDetailInfo:'/topFeatures/getDetailInfo ',
    //新增图片
    appAddTopFeatures: '/topFeatures/addTopFeatures',
    
    //互动课-商品列表
    getGoodsList: '/interact/goodsList',
    //互动课-编辑商品信息
    getEditGoods: '/interact/editGoods',
    //互动课-上下架
    getEditState: '/interact/editState/',
    //互动课-追加兑换数
    getAddStar: '/interact/addExchangeNum/',
    //互动课-追加库存
    getAddStock: '/interact/addStock/',
    //互动课-兑换订单
    getExchangeOrderList:'/interact/exchangeOrderList',
    //互动课-邮寄
    getMallExchangeOrder: '/interact/mallExchangeOrder/',
    //详情
    getGoodsDetail:'/interact/goodsDetail/',
    

    //智慧平台-用户列表
    wisdomCourseUserList: '/wisdomPlatform/courseUserList/',
    //智慧平台-新增课程用户
    wisdomAddCourseUser: '/wisdomPlatform/addCourseUser',
    //智慧平台-修改课程
    wisdomModifyCourse: '/wisdomPlatform/modifyCourse',
    //智慧平台-获取选择课程列表
    wisdomGetCourseList: '/wisdomPlatform/getCourseList',
    //智慧平台-课程列表
    wisdomCourseList: '/wisdomPlatform/courseList',
    //智慧平台-新增平台课
    wisdomAddCourse: '/wisdomPlatform/addCourse',
    //智慧平台-删除名句
    wisdomDelSentence: '/wisdomPlatform/delSentence/',
    //智慧平台-名句列表
    wisdomSentenceList: '/wisdomPlatform/sentenceList',
    //智慧平台-添加、修改名句
    wisdomEditSentence: '/wisdomPlatform/editSentence',
    //智慧平台-追加天数
    wisdomAddDays:'/wisdomPlatform/addDays/',
    //智慧平台-禁用启用
    wisdomUpdateStatus:'/wisdomPlatform/updateStatus/',
    //智慧平台-订单列表
    wisdomOrderList:'/wisdomPlatform/orderList',
    //智慧平台-设置价格
    wisdomEditRenewSet: '/wisdomPlatform/editRenewSet',
    //智慧平台-设置价格回显
    wisdomRenewSetDetail: '/wisdomPlatform/renewSetDetail',
    //用户管理-职业列表
    wisdomGetOccupationList:'/appUser/getOccupationList',
    //用户管理-行业
    wisdomGetIndustryList:'/appUser/getIndustryList',
    //用户管理-学历
    wisdomGetEducationList:'/appUser/getEducationList',
    //智慧平台-课程详情
    wisdomBatchCourseDetail: '/wisdomPlatform/batchCourseDetail/',
    //获取用户信息
    getWisdomSelectUserPage: '/appUser/selectUserPage',
    //用户管理-手动注册
    setHandleRegister: '/appUser/handleRegister',


    //分类列表
    getClassifiesList: '/wisdomPlatform/classifiesList',
    //添加编辑分类
    getEditClassifies: '/wisdomPlatform/editClassifies',
    //删除分类
    getDelClassifies: '/wisdomPlatform/delClassifies/',
    //给批次添加类型
    getBatchClassifies:'/wisdomPlatform/batchClassifies',
    //批次分类列表
    getBatchClassifiesList: "/wisdomPlatform/batchClassifiesList/",
    //给课程添加分类
    getAddCourseClassifies: '/wisdomPlatform/addCourseClassifies/',
    //关联课程列表
    geRelateCourse: '/wisdomPlatform/relateCourse',
    //删除批次分类
    getDelBatchClassifies:'/wisdomPlatform/delBatchClassifies/',



    //用户管理-导入
    getWisdomImportRegister: base_url +'/appUser/importRegister',
    

    //cpa  订单导出
    cpaExportOrderList:base_url +'/cpa/export/getOrderList',
    //用户导出
    cpaExportUserList: base_url + '/cpa/export/getUserList',
    //智慧平台-设置导出
    wisdomExportOrderList:base_url + '/wisdomPlatform/export/orderList',

    //
    exportExchangeOrderList: base_url +'/interact/export/exchangeOrderList',
    //菜根谭-导出BUTTON数据
    cgeExportButtonList: base_url + '/caiGenTan/export/ButtonList',
    //菜根谭-导出BUTTON数据
    cgeExportButtonListAll: base_url + '/caiGenTan/export/AllButtonList',
    //菜根谭-导出购买详情
    cgtExportOrderDetailList: base_url + '/caiGenTan/export/OrderDetailList',
    //菜根谭-导出用户数据
    cgtUserDetailList: base_url + '/caiGenTan/export/userDetailList',
    //菜根谭-导出邮寄列表
    cgtAddressList: base_url + '/caiGenTan/export/addressList',
    flowOrderListExport:(objs) => { return base_url +`/unicom/flowOrderListExport?id=${objs.id}&type=${objs.type}&cellphone=${objs.cellphone}&token=${objs.token}` },
    //联通管理，详情，导出
    detailUnicomListExport:base_url +'/unicom/export/detailList',
    //移动积分查询导出
    exportSortDetailList:base_url + '/mobileActivity/export/detailList/',  
    //移动积分活动导出
    exportSortStatisticsList:base_url +'/mobileActivity/export/statisticsList', 
    getQuestionList:'/theKingOfKnowledge/getQuestionList',//小程序知识王者获取题库列表
    addQuestion:'/theKingOfKnowledge/addQuestion',//知识王者添加题目
    updateQuestion:'/theKingOfKnowledge/updateQuestion',//修改题目
    getQuestionDetail:'/theKingOfKnowledge/detail',//获取题目详情(单个)
    deleteQuestion:'/theKingOfKnowledge/delete',//删除题目
    getQuestionUserDetailList:'/theKingOfKnowledge/getQuestionUserDetailList',//获取题目详情
    exportQuestionUserDetailList,//导出题目详情
    downloadExcelModel,//下载模板
    importQuestionBank:'/theKingOfKnowledge/importQuestionBank',//导入题库
    exportQuestion,//导出
    getHurdleList:'/theKingOfKnowledge/getHurdleList',//查询关卡奖项列表
    hurdleDetailList:'/theKingOfKnowledge/hurdleDetailList',//查看当前关卡详情
    addRelationQuestion:'/theKingOfKnowledge/addRelationQuestion',//添加关联题目
    questionRelationQuestionDetail:'/theKingOfKnowledge/questionRelationQuestionDetail',//查看关联所有题目
    questionRelationQuestionDetailForUpdate:'/theKingOfKnowledge/questionRelationQuestionDetailForUpdate',//查询关联的题目
    getAwardRecordList:'/theKingOfKnowledge/getAwardRecordList',//根据关卡ID获取中奖详情
    getHurdleAwardDetail:'/theKingOfKnowledge/getHurdleAwardDetail',//查询奖品详情
    addAwardForHandle:'/theKingOfKnowledge/addAwardForHandle',//添加奖项
    deleteAwardForHandle:'/theKingOfKnowledge/deleteAwardForHandle',//删除奖品
    getUserList:'/theKingOfKnowledge/getUserList',//获取用户
    exportQuestionUser,//
    getWrongBookList:'/theKingOfKnowledge/getWrongBookList',//错题本列表
    exportWrongBookList,//导出错题本
    getGoldDetailList:'/theKingOfKnowledge/getGoldDetailList',//金币明细
    getReceiveDetailList:'/theKingOfKnowledge/getReceiveDetailList',//领奖记录
    getGoldExchangeList:'/theKingOfKnowledge/getGoldExchangeList',//小程序积分兑换
    downLoadGoldExchangeList,//小程序积分兑换导出
    getRankList:'/theKingOfKnowledge/getRankList',//小程序段位列表
    addRank:'/theKingOfKnowledge/addRank',//小程序添加段位
    updateRank:'/theKingOfKnowledge/updateRank',//小程序更新段位
    deleteRank:'/theKingOfKnowledge/deleteRank',//小程序删除段位
    getSettingInfoDetail:'/theKingOfKnowledge/getSettingInfoDetail',//获取小程序全局设置
    addSettingInfo:'/theKingOfKnowledge/addSettingInfo',//添加or修改全局设置
    getAddressList:'/theKingOfKnowledge/getAddressList',//获取书籍邮寄列表
    updateStatus:'/theKingOfKnowledge/updateStatus',//更新邮寄状态
    exportAddressList,//导出书籍邮寄列表
}
export default Object.assign({}, ly, ljm)
