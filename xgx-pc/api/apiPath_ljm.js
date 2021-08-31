export default {
    //关于我的
    getAboutUsTypeInfo:'/about/getAboutUsInfo', //获取关羽我们的信息不包含常见问题
    getAboutUsProblemPageInfo:'/about/getAboutUsProblemPageInfo', //获取关羽我们的信息不包含常见问题
    //资讯
    getInformationTop:'/informations/informationBannerTopInfo', //获取资讯banner和置顶
    getInformationPageInfo:'/informations/informationListInfo', //获取资讯列表
    getInformationViewInfo:'/informations/informationDetailInfo', //获取资讯详情

    //我的消息
    getMessagePetPage: '/message/getPage',//全部
    getMyFeedBacks:'/user/addUserFeedBacks',
    getMyBalance:'/user/accountBalance',
    getMyAccountDetail:'/user/getUserCoinsPage',
    getMyUserders: '/user/getUserOrdersPage',
    //优惠券
    getCopponDataList: '/user/getUserCouponsList',    
    getDetailDataList:'/user/getCourseList',


    //首页
    getHomeModelListInfo: '/models/modelSelectAll',
    //课程列表 get
    getMyCourseList: "/pcCourse/getPurchasedCourseList",
    //合作平台
    getHoerDateList: "/aboutUsHoer/getPage",
    //未读消息
    getMyUnreadNum: '/message/getMsgTypeNum',

    //机构认证-验证是否存在认证 post
    getVerifityMechanism: '/mechanism/verifityMechanism',
    //机构认证-添加或修改认证信息 post
    saveMechanism:'/mechanism/saveMechanism'
}
