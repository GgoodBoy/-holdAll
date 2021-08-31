import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        //新绣需求状态字段
        recordStartTime: '',//在点击开始时的当前时间 parseInt(new Date().getTime()/1000)
        //新需求字段，表示开始按钮是不是手动操作开始
        handOperation: false,
        //新需求字段，表示开始按钮是不是手动操作结束
        handOperationIsEnd:false,        
        //旧版本状态        
        statusBarHeight: 20,
        statusCourseChoose: -1,//当前选中的节点
        lessonListNum: 0,//当前课程一共有多少节课
        audioOrVideo:'other',
        playCourseState:false,
        phoneType:['iPhone 6<iPhone7,2>'],//手机型号
        audioData:{
            title:'',//标题
            cur:'00:00',//当前播放时间
            total:'20:00',//总时间
            surfacePlot:'',//课程封面
            courseId: '',//课程ID
            show:false,//音频播放条是否存在
            playFlag: false,//是否在播放中
            periodId: '',//课时id;
            playerCreat:false
        },
        copyAudioData: {
            title: '',//标题
            total: '20:00',//总时间
            courseId: '',//课程ID
            surfacePlot: '',
            show:false
        },
        videoData: {
            studyPoint: [],
            statusCourseVidChoose: -1,
            periodId:'',
            playCourseVideState: false,
            catalogList:[]//视频目录列表
        },
        timeArry: [],//音频听课时间段;
        courseaudioListInfo: [],//音频课程目录
        localaudioListInfo: [],//音频课程目录
    },
    mutations: {
        SETHANDOPERATION(state,data) { 
            state.handOperation = data
        },
        SETHANDOPERATIONISEND(state,data) { 
            state.handOperationIsEnd = data
        },
        SETRECORDSTARTTIME(state,data) { 
            state.recordStartTime = data
        },
        SETSTATUSBARHEIGHT(state,data){
            state.statusBarHeight = data
        },
        SETCOURSECHOOSEUNM(state,data){
            state.statusCourseChoose = data
        },
        SETLESSONLISTNUM(state,data){
            state.lessonListNum = data
        },
        SETPLAYCOURSESTATE(state,data){
            state.playCourseState = data
        },
        SETAUDIODATA(state,data){
            state.audioData = data;
        },
        SETCOPYAUDIODATA(state,data){
            state.copyAudioData = data;
        },        
        SETTimeARRYS(state,data){
            state.timeArry = data;
        },
        SETCOURSEAUDIOLISTINFO(state,data){
            state.courseaudioListInfo = data;
        },
        SETLOCALAUDIOLISTINFO(state,data){
            state.localaudioListInfo = data;
        },
        SETAUDIOORVIDEOS(state,data){
            state.audioOrVideo = data;
        },
        SETVIDEODATE(state,data) { 
            state.videoData = data;
        },
        SETPHONETYPE(state,data) { 
            state.phoneType = data;
        }
    },
    actions: {
        sethandOperation({commit},data){
            commit('SETHANDOPERATION',data)
        },
        sethandOperationIsEnd({commit},data){
            commit('SETHANDOPERATIONISEND',data)
        },
        setRecordStartTime({commit},data){
            commit('SETRECORDSTARTTIME',data)
        },
        setStatusBarHeight({commit},data){
            commit('SETSTATUSBARHEIGHT',data)
        },
        setStatusCourseChoose({commit},data){
            commit('SETCOURSECHOOSEUNM',data)
        },
        setLessonListNums({commit},data){
            commit('SETLESSONLISTNUM',data)
        },
        setPlayCourseState({commit},data){
            commit('SETPLAYCOURSESTATE',data)
        },
        setAudioData({commit},data){
            commit('SETAUDIODATA',data)
        },
        setCopyAudioData({commit},data){
            commit('SETCOPYAUDIODATA',data)
        },        
        setTimeArryData({commit},data){
            commit('SETTimeARRYS',data)
        },
        setCourseaudioListInfoData({commit},data){
            commit('SETCOURSEAUDIOLISTINFO',data)
        },
        setLocalaudioListInfoData({commit},data){
            commit('SETLOCALAUDIOLISTINFO',data)
        },
        setAudioOrVideo({commit},data){
            commit('SETAUDIOORVIDEOS',data)
        },
        setVideoDateEven({commit},data){
            commit('SETVIDEODATE',data)
        },
        setPhoenTypeEven({commit},data){
            commit('SETPHONETYPE',data)
        }
    }
})

export default store