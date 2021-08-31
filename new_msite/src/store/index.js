import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const state = {
  isWx:false,//是否是微信浏览器，
  isIos:false,//是否是iphone
  shareType:'',//分享类型
  courseShareData:{},//课程分享数据
  periodShareData:{},//课时分享数据
  audioData:{},//音频数据
  buySuccess:false,//是否购买了课程（与音频有关）
  hasOpenApp:true,//是否存在'下载APP'头部
  isFirstRegisAndNoInterest:false,//兴趣弹窗
  shareUserData:{},//分享购课得佣金(分享用户的ID)
  isSetInvitationCode:false,//是否设置邀请码
  isSetCommission:{},//是否设置了佣金
  isInvitationSee:false,//是否设置邀好友看
  InvitationSeeData:{},//邀好友看数据(分享状态：成功or失败)
  friendShareData:{},//邀好友看数据
  receivefriendShareData:{},//被邀请者接受邀请者的数据(邀请者id,课程id,课时id)
  assembleBoughtData:{},//团购下单成功后的数据
  isVip:false,
  editionType:1,//版本(1.成人,2.少人)
  searchToast: false,//搜索结果页面，进入课程，未登录|未购买提示
  chinaMobileDialog:false,//移动弹窗
  actionLableState: false,//国学大礼包弹窗
  actionFlagState:true,//表示大礼包活动状态加锁；
  giftFlag:'',//大客户礼包弹窗
  membershipCardDialog:'',//定制会员卡弹窗
  chinaMobileDialogShow:true,//移动弹窗是否出现，生命周期只弹1次
  passwordActionState:true,
  cooperativePlatformsData:{
    xxtId:''
  },
  //合作平台
  videoShowHideStore: false,//小视屏窗口的显示与否
  sourceData: {},//课程视频信息
  courseVideoData: {},
  videoHideBar: false,
  startPlay: false,
  playVideoFlag: false,
  heightVideoStore: 1,//大小视频的状态，1是大视频，2是小视频;
  videoIsRemove: false,
  stopMinVideoStore: false,
  isPlayRecord: false,
  topOrleftVal: '[-1, -1]',//小视屏位置记录
  stortIdCourse: false,
  browserTypeStort: true,//小视屏针对浏览器是否需要；
  existenceValState:true,
  shortVideoIdFromHome:'',//首页模块知识点进入精选列表页
  knowledgeRouteState: false,//当前播放的是不是课程知识点；
  commissionToStart: false,
  courseShowHeader:true,
  knowledgeIdInCourse:'',//课程详情里点击了知识点，存贮当前知识点id
  downloadFlag:false,//下载APP弹窗
  lastStudyPoint:-1,//最后一次播放时间点
}

const actions = {
  setIsWx({commit},data){
    commit('SETISWX',data)
  },
  setIsIos({commit},data){
    commit('SETISIOS',data)
  },
  setShareType({commit},data){
    commit('SETSHARETYPE',data)
  },
  setCourseShareData({commit},data){
    commit('SETCOURSESHAREDATA',data)
  },
  setPeriodShareData({commit},data){
    commit('SETPERIODSHAREDATA',data)
  },
  setAudioData({commit},data){
    commit('SETAUDIODATA',data)
  },
  setBuySuccess({commit},data){
    commit('SETBUYSUCCESS',data)
  },
  setOpenAppFlag({commit},data){
    commit('SETOPENAPPFLAG',data)
  },
  setInterestFlag({commit},data){
    commit('SETINTERESTFLAG',data)
  },
  setActionStateFlag({commit},data){
    commit('SETACTIONSTATEFLAG',data)
  },
  setpasswardStates({commit},data){ 
  commit('SETPASSWARDACTIONSTATE',data)
  },
  setShareUserData({commit},data){
    commit('SETSHAREUSERDATA',data)
  },
  setFriendShareData({commit},data){
    commit('SETFRIENDSHAREDATA',data)
  },
  setReceivefriendShareData({commit},data){
    commit('SETRECEIVEFRIENDSHAREDATA',data)
  },
  setCommission({commit},data){
    commit('SETCOMMISSION',data)
  },
  setInvitationCode({commit},data){
    commit('SETINVITATIONCODE',data)
  },
  setInvitationSee({commit},data){
    commit('SETINVITATIONSEE',data)
  },
  setInvitationSeeData({commit},data){
    commit('SETINVITATIONSEEDATA',data)
  },
  setAssembleBoughtData({commit},data){
    commit('SETASSEMBLEBOUGHTDATA',data)
  },
  setIsVip({commit},data){
    commit('SETISVIP',data)
  },
  setEditionType({commit},data){
    commit('SETEDITIONTYPE',data)
  },
  setSearchToast({commit},data){
    commit('SETSEARCHTOAST',data)
  },
  setCooperativePlatformsData({commit},data){
    commit('SETCOOPERATIVEPLATFORMSDAtA',data)
  },
  setVideShowHideStoreData({commit},data) {
    commit('SETVIDEOSHOWHIDESTORE',data)
  },
  setVideoSourceData({commit},data) {
    commit('SETVIDEOSOURCEDATASTORT',data)
  },
  setVideoHideBar({commit},data) {
    commit('SETCIDEOHIDEBARBOOL',data)
  },
  setVideorCourse({commit},data){
    commit('SETCOURSEVIDEODATA',data)
  },
  setVideoStartPlay({commit},data) {
    commit('SETVIDEOSTARTPLAYDATA',data)
  },
  setPlayVideoFlag({commit},data) {
    commit('SETPLAYCIDEOFLAGDATA',data)
  },
  setheightVideoStore({commit},data) {
    commit('SETHEIGHTVIDEOSTPRE',data)
  },
  setVideoIsRemove({commit},data) {
    commit('SETVIDEOISREMOVE',data)
  },
  setStopMinVideoEven({commit},data) {
    commit('SETSTOPMINVIDEOEVEN',data)
  },
  setIsPlayRecordStort({commit},data) {
    commit('SETISPLAYRECORD',data)
  },
  setTopLeftVal({commit},data) {
    commit('SETTOPLEFTVALUES',data)
  },
  setCoursePlayIdVal({commit},data) {
    commit('SETCOURSEPLAYVALSTORE',data)
  },
  setActionflagstates({commit},data) {
    commit('SETACTIONFLAGSTATE',data)
  },
  setBrowserTypeStort({commit},data) {
    commit('SETBROWSERTYPES',data)
  },
  setExistenceState({commit},data) {
    commit('SETEXISTENCESTATEVAL',data)
  },
  setShortVideoId({commit},data){
    commit('SETSHORTVIDEOID',data)
  },
  setKnowledgeRouteState({commit},data) {
    commit('SETKNOWLEDGEROUTESTATES',data)
  },
  setCommissionToStart({commit},data) {
    commit('SETCOMMISSIONTOSTART',data)
  },
  setCourseShowheaders({commit},data) {
    commit('SETCOURSESHOWHEADER',data)
  },
  setGiftFlag({commit},data) {
    commit('SETGIFTFLAG',data)
  },
  setMembershipCardDialog({commit},data) {
    commit('SETMEMBERSHIPCARDDIALOG',data)
  },
  setKnowledgeIdInCourse({commit},data){
    commit('SETKNOWLEDGEIDINCOURSE',data)
  },
  setDownLoadFlag({commit},data){
    commit('SETDOWNLOADFLAG',data)
  },
  setLastStudyPoint({commit},data){
    commit('SETLASTSTUDYPOINT',data)
  },
  setChinaMobileDialog({commit},data){
    commit('SETCHINAMOBILEDIALOG',data)
  },
  setChinaMobileDialogShow({commit},data){
    commit('SETCHINAMOBILEDIALOGSHOW',data)
  }
}

const mutations = {
  SETDOWNLOADFLAG(state,data){
    state.downloadFlag = data
  },
  SETKNOWLEDGEIDINCOURSE(state,data){
    state.knowledgeIdInCourse = data
  },
  SETISWX(state,data){
    state.isWx = data;
  },
  SETISIOS(state,data){
    state.isIos = data;
  },
  SETSHARETYPE(state, data) {
    state.shareType = data;
  },
  SETCOURSESHAREDATA(state, data) {
    state.courseShareData = data;
  },
  SETPERIODSHAREDATA(state, data) {
    state.periodShareData = data;
  },
  SETAUDIODATA(state, data) {
    state.audioData = data;
  },
  SETBUYSUCCESS(state, data) {
    state.buySuccess = data;
  },
  SETOPENAPPFLAG(state, data) {
    state.hasOpenApp = data;
  },
  SETINTERESTFLAG(state, data) {
    state.isFirstRegisAndNoInterest = data;
  },
  SETACTIONSTATEFLAG(state, data) {
    state.actionLableState = data;
  },
  SETPASSWARDACTIONSTATE(state, data) { 
    state.passwordActionState = data;
  },
  SETSHAREUSERDATA(state, data) {
    state.shareUserData = data;
  },
  SETFRIENDSHAREDATA(state, data) {
    state.friendShareData = data;
  },
  SETCOMMISSION(state, data) {
    state.isSetCommission = data;
  },
  SETRECEIVEFRIENDSHAREDATA(state, data) {
    state.receivefriendShareData = data;
  },
  SETINVITATIONCODE(state, data) {
    state.isSetInvitationCode = data;
  },
  SETINVITATIONSEE(state, data) {
    state.isInvitationSee = data;
  },
  SETINVITATIONSEEDATA(state, data) {
    state.InvitationSeeData = data;
  },
  SETASSEMBLEBOUGHTDATA(state, data) {
    state.assembleBoughtData = data;
  },
  SETISVIP(state, data) {
    state.isVip = data;
  },
  SETEDITIONTYPE(state, data) {
    state.editionType = data;
  },
  SETSEARCHTOAST(state, data) {
    state.searchToast = data;
  },
  SETCOOPERATIVEPLATFORMSDAtA(state, data) {
    state.cooperativePlatformsData = data;
  },
  //视频显示隐藏
  SETVIDEOSHOWHIDESTORE(state, data) {
    state.videoShowHideStore = data
  },
  SETVIDEOSOURCEDATASTORT(state, data) {
    state.sourceData = data
  },
  SETCIDEOHIDEBARBOOL(state, data) {
    state.videoHideBar = data
  },
  SETCOURSEVIDEODATA(state, data){
    state.courseVideoData = data;
  },
  SETVIDEOSTARTPLAYDATA(state, data) {
    state.startPlay = data;
  },
  SETPLAYCIDEOFLAGDATA(state, data) {
    state.playVideoFlag = data;
  },
  SETHEIGHTVIDEOSTPRE(state, data) {
    state.heightVideoStore = data;
  },
  SETVIDEOISREMOVE(state, data) {
    state.videoIsRemove = data;
  },
  SETSTOPMINVIDEOEVEN(state, data) {
    state.stopMinVideoStore = data;
  },
  SETISPLAYRECORD(state, data) {
    state.isPlayRecord = data;
  },
  SETTOPLEFTVALUES(state, data) {
    state.topOrleftVal = data;
  },
  SETCOURSEPLAYVALSTORE(state, data) {
    state.stortIdCourse = data;
  },
  SETACTIONFLAGSTATE(state, data) {
    state.actionFlagState = data;
  },
  SETBROWSERTYPES(state, data) {
    state.browserTypeStort = data;
  },
  SETEXISTENCESTATEVAL(state, data) {
    state.existenceValState = data;
  },
  SETSHORTVIDEOID(state,data){
    state.shortVideoIdFromHome = data;
  },
  SETKNOWLEDGEROUTESTATES(state, data) {
    state.knowledgeRouteState = data;
  },
  SETCOMMISSIONTOSTART(state, data) {
    state.commissionToStart = data;
  },
  SETCOURSESHOWHEADER(state, data) {
    state.courseShowHeader = data;
  },
  SETGIFTFLAG(state,data){
    state.giftFlag = data;
  },
  SETMEMBERSHIPCARDDIALOG(state,data){
    state.membershipCardDialog = data;
  },
  SETLASTSTUDYPOINT(state,data){
    state.lastStudyPoint = data;
  },
  SETCHINAMOBILEDIALOG(state,data){
    state.chinaMobileDialog = data;
  },
  SETCHINAMOBILEDIALOGSHOW(state,data){
    state.chinaMobileDialogShow = data;
  }
}

const getters = {

}

export default new Vuex.Store({
  state,getters,actions,mutations
})
