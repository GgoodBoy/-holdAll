<template>
    <div class="course-detials-page" :style="{'min-height':minHeight+'px'}">
        <!-- <transition name="el-fade-in">
            <div class="shade-box" v-if="showShare"></div>
        </transition> -->
        <div class="error-box" v-if="error">
            <img :src="errorImg"/>
            <p class="tips">小夫子在此恭候多时</p>
            <p class="tips">{{errorText}}</p>
            <p @click="$router.replace('/home')" class="btn">跟我走吧</p>
        </div>
        <div class="content" v-else>
            <div class="page-top">
                <BreadCrumb :listData="breadCrumb"></BreadCrumb>
                <div class="course-info">
                    <div class="clearfix wrapper">
                        <div class="course-info-left">
                            <div class="shade"></div>
                            <img class="course-surface" v-lazy="courseData.surfacePlot"/>
                            <i class="player-btn" :class="canPlay?'could':'not-allow'" @click="goPlayerPage"></i>
                        </div>
                        <div class="course-info-right" :class="{'long-title':courseData.timeLimitType!=''&&courseData.timeLimitType>=0&&courseData.upType>0}">
                            <p class="course-title">{{courseData.title}}</p>
                            <p class="course-des">{{courseData.intro}}</p>
                            <div class="clearfix">
                                <div class="sell-price">
                                    <p v-if="courseData.isFree>0">免费</p>
                                    <div v-else>
                                        <p v-if="courseData.timeLimitType==0&&isStart">限时免费</p>
                                        <div v-else>
                                            <p v-if="courseData.timeLimitType==2&&isStart">价格 : {{courseData.spikePrice}}币</p>
                                            <p v-else>价格 : {{courseData.sellingPrice}}币</p>
                                        </div>
                                    </div>
                                </div>
                                <p class="limit-time clearfix" v-if="time.length>0&&courseData.timeLimitBeginAt&&courseData.timeLimitEndAt"><i></i><span class="type-name">{{timeLimitTypeArr[courseData.timeLimitType]}}</span><span class="right-box" :class="ms==''?'status1':'status2'"><span>{{timeDes}}</span><span class="count-down-time" :class="ms==''?'status1':'status2'">{{time}}<span v-show="ms!=''" class="m">:</span></span><span class="msec">{{ms}}</span></span></p>
                            </div>
                            <p class="ori-price" v-if="courseData.isFree==0">
                                <span v-if="courseData.timeLimitType&&isStart">
                                    原价 : {{courseData.basicPrice}}币
                                </span>
                                <span v-else>原价 : {{courseData.originalPrice}}币</span>
                            </p>
                            <p class="section-num">更新至{{courseData.actualPeriodNum}}/{{courseData.planPeriodNum}}课时</p>
                            <p class="channel-buy-avaliday" v-if="courseData.channelBuyAvaliDay!=0">{{courseData.channelBuyAvaliDay}}前有效</p>
                            <div class="course-txt">
                                <div class="praise-num" :class="thumbsUpCourseFlag?'praised':''" @click="courseThumbsUp">
                                    <i></i>
                                    <p>{{courseData.courseUserLikeCount>10000?'1万+':courseData.courseUserLikeCount}}赞</p>
                                </div>
                                <div class="browse-num">
                                    <i></i>
                                    <p>{{courseData.courseBrowsCount>100000?'10万+':courseData.courseBrowsCount}}人看过</p>
                                </div>
                                <div class="course-share">
                                    <i></i>
                                    <p>分享</p>
                                    <share :config="shareConfig" class="my-share"></share>
                                </div>
                            </div>
                            <div class="course-btn-area">
                                <div v-if="userData.isVip&&userData.isVip>0">
                                    <button class="course-btn" @click="goPlayerPage">开始学习</button>
                                </div>
                                <div v-else>
                                    <button class="course-btn" v-if="courseData.isBuy>0" @click="goPlayerPage">开始学习</button>
                                    <div v-else>
                                        <button class="course-btn" v-if="courseData.isFree>0" @click="goPlayerPage">开始学习</button>
                                        <div v-else>
                                            <button class="course-btn" v-if="courseData.timeLimitType==0&&isStart" @click="goPlayerPage">开始学习</button>
                                            <button class="course-btn" v-else @click="buyCourse">立即购买</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="course-tag">
                                <p class="time-limit" v-if="courseData.timeLimitType&&courseData.timeLimitType!=''&&courseData.timeLimitType>=0">{{courseData.timeLimitType==0?'限时免费':(courseData.timeLimitType==1?'限时折扣':'限时秒杀')}}</p>
                                <p class="new" v-if="courseData.upType>0">{{courseData.upType==1?'上新':'更新'}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-body clearfix">
                <div class="course-tabs" ref="courseTab">
                    <div class="tabs-bar-box" ref="tabBar">
                        <div :style="tabBarStyle">
                            <span></span>
                        </div>
                    </div>
                    <div class="tabs-txt">
                        <p v-for="(item,index) in courseTabs" :key="index" :class="{'active':item.active}" @click="changeTab(item,index)">{{item.name}}</p>
                    </div>
                    <div class="tabs-content">
                        <div class="item course-intro" :class="{'active':activeIndex==0}">
                            <div v-html="courseData.introduce"></div>
                        </div>
                        <div class="item course-catalogue" :class="{'active':activeIndex==1}" >
                            <div class="course-catalogue-item clearfix" v-for="(item,index) in periodList" :key="index" @click="goPlayer(item)">
                                <p class="sort l ">第{{index+1}}节</p>
                                <p class="section-title l textEllipsis">{{item.title}}</p>
                                <p class="is-try r " v-if="!(courseData.isBuy>0||userData.isVip>0)">
                                    <span v-if="courseData.isFree>0"></span>
                                    <span v-else>{{item.isTry>0?(courseData.courseType==1?'试看':'试听'):''}}</span>
                                </p>
                                <div class="could-area r"  v-if="userData.isVip>0||courseData.isBuy>0">
                                    <div class="details-icon-box" @click="lookPeriodDetails($event,item)"><i class="details-icon"></i></div>
                                    <div class="play-state" >
                                        <p class="progress">{{item.progress}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item course-comment" :class="{'active':activeIndex==2}">
                            <div class="comment-area" v-if="courseData.isBuy>0||userData.isVip>0">
                                <textarea v-model="commentContent" maxlength="200" ></textarea>
                                <div class="clearfix">
                                    <el-button type="primary" class="btn" @click="addComment" :disabled="commentHttp">发表评论</el-button>
                                </div>
                                <p class="comment-word">{{commentContent.length}}/200</p>
                            </div>
                            <div class="course-comment-item" v-for="(item,index) in commentList" :key="index">
                                <div class="item-box">
                                    <div class="comment-t clearfix">
                                        <div class="l">
                                            <img class="comment-user-avatar" :src="item.commentUserAvatar"/>
                                            <p class="comment-user-nickname">{{item.commentUserName}}</p>
                                        </div>
                                        <div class="r">
                                            <p class="comment-time">{{item.createdAt}}</p>
                                            <p class="comment-praise-num" :class="item.thumbsUpPeriodFlag?'praised':''" @click="commentThumbsUp(item,index)"><i></i>{{item.praisePoint}}</p>
                                        </div>
                                    </div>
                                    <div class="comment-m">
                                        <p class="comment-content">{{item.content}}</p>
                                        <p class="forbid" v-if="item.prohibitedFlag==1">
                                            <i></i>
                                            <span>该条评论含有违禁词汇，违禁部分已隐藏。</span>
                                        </p>
                                    </div>
                                    <div class="comment-b">
                                        <div class="comment-reply" v-if="item.commentRepliesList.length>0">
                                            <p>{{item.commentRepliesList[0].content}}</p>
                                            <!-- <p v-for="(option,i) in item.commentRepliesList" :key="i">{{option.content}}</p> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="page-box" v-if="totals>0">
                                 <Page
                                    :pageSize="pageSize"
                                    :currentPage.sync="pageNo"
                                    :totals="totals"
                                    :numberStatus="'0'"
                                ></Page>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="course-relative">
                    <div class="mechanism" v-if="courseData.mechanismName">
                        <p class="title">{{courseData.mechanismName}}</p>
                        <p class="content">{{courseData.synopsis}}</p>
                    </div>
                    <div class="course-teacher" ref="courseTeacher">
                        <p class="title">授课老师</p>
                        <div :style="teacherBoxStyle">
                            <div ref="teacherItemBox">
                                <div class="course-teacher-item" v-for="(item,index) in courseData.lectureTeacherList" :key="index" ref="teacherItem" @click="getAllCourseByName(item)">
                                    <img :src="item.avatar" class="teacher-avatar"/>
                                    <p class="teacher-name">{{item.name}}</p>
                                    <el-tooltip class="title textEllipsis" effect="light" :content="item.intro" placement="top" >
                                        <p class="teacher-intro">{{item.intro.length>16?(item.intro.substr(0,16)+'...'):item.intro}}</p>
                                    </el-tooltip>
                                    <!-- <p class="teacher-intro">{{item.intro}}</p> -->
                                </div>
                            </div>
                        </div>
                        <div class="arrow" v-if="getMore" @click="getMoreTeacher">
                            <i class="el-icon-d-arrow-right"></i>
                        </div>
                    </div>
                    <div class="course-relevance" v-if="relationList.length>0">
                        <p class="title">推荐课程</p>
                        <div class="course-relevance-item" v-for="(item,index) in relationList" :key="index" @click="goCourseDetails(item)">
                            <div class="course-avatar-box">
                                <img :src="item.surfacePlot" class="course-avatar"/>
                            </div>
                            <p class="course-title">{{item.title}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="el-fade-in">
            <div class="course-dialog" v-show="dialogFlag">
                <div class="course-dialog-box">
                    <div class="title">温馨提示</div>
                    <div class="body">
                        <img class="xiaofuzi" :src="dialogImg"/>
                        <p>{{dialogTips}}</p>
                        <div class="btns">
                            <button class="confirm" @click="confirmTodo">{{dialogConfirmText}}</button>
                            <button class="cancel" @click="dialogFlag=false">我再想想</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="el-fade-in">
            <div class="content-dialog" v-show="contentDialog">
                <div class="content-dialog-box">
                    <div class="title">温馨提示</div>
                    <div class="body">
                        <i class="el-icon-warning"/>
                        <p class="tips1">评论发表失败</p>
                        <p class="tips2">该条评论含有如下违禁词汇</p>
                        <p class="prohibited-word">{{prohibitedWord}}</p>
                        <p class="btn" @click="contentDialog=false">返回重新编辑</p>
                    </div>
                </div>
            </div>
        </transition>
        <el-dialog
            custom-class="period-details-dialog"
            :visible.sync="periodDetailsFlag"
            :show-close="false"
            center>
            <div class="title" slot="title">
                <i class="left-icon"></i>
                <p>赏析</p>
                <i class="right-icon"></i>
            </div>
            <div class="intro" :style="periodDetailBoxStyle">
                <div v-html="periodIntroduce"></div>
            </div>
            <div class="dialog-btns">
                <el-button type="primary" class="save-btn" @click="periodDetailsFlag=false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import {Component,Vue,Watch,Inject} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex'
import { NuxtContext } from 'nuxt'
import server from '~/api/index'
import BreadCrumb from '~/components/breadcrumb.vue'
import Page from '~/components/Page.vue'
import { watch } from 'fs';
const DialogImg = require('@/assets/images/xiaofuzi.png');
const errorImg = require('@/assets/images/no_course.png')
if(process.client){
    require('~/plugins/share.js');
}
@Component({
    watchQuery:['id'],
    components:{BreadCrumb,Page},
    async asyncData({app,query,req}:NuxtContext):Promise<any>{
        let {id} = query;
        let pageNo = 1,pageSize = 10;
        let queryData = {
            params:{}
        }
        let commentQuery = {
            params:{
                pageNo,
                pageSize
            }
        }
        let [courseRes,periodListRes,commentRes,relationListRes] =  await Promise.all([
            app.$axios.$get(`${server.getCourseInfo}/${id}`,queryData),
            app.$axios.$get(`${server.getPeriodList}/${id}`,queryData),
            app.$axios.$get(`${server.getCommenList}/${id}`,commentQuery),
            app.$axios.$get(`${server.getRelationList}/${id}`,queryData)
        ])
        // var urls =  `http://dev.xueguoxue.com/course/details?id=${id}`
        var urls = ''
        return{
            finish:true,
            error:courseRes.content.id?false:true,
            errorText:courseRes.message.includes('下架')?'告诉你个小秘密，该课程已经下架了':'',
            courseData:courseRes.status==200?courseRes.content:{},
            periodList:periodListRes.content,
            commentList:commentRes.content.list,
            relationList:relationListRes.content.length>4?relationListRes.content.splice(0,4):relationListRes.content,
            pageNo:pageNo,
            pageSize:pageSize,
            totals:commentRes.content.total,
            isLogin:req&&req.headers.cookie&&req.headers.cookie.includes('xgx_user')?true:false,
            shareConfig:{
                url: urls,
                source:urls,
                title: courseRes.content.title,
                description:courseRes.content.intro,
                image: courseRes.content.surfacePlot,
                sites: ['qzone', 'qq', 'weibo', 'wechat'],
                wechatQrcodeHelper:'',
            },
            showShare:true,
            breadCrumb:[{name:'首页',link:'/home'},{name:'课程',link:'/course/courseList?id=0&sortType=1&pageNo=1&pageSize=12&freeType=2'},{name:courseRes.content.title}],
            thumbsUpCourseFlag:courseRes.content.thumbsUpCourseFlag==1?true:false
        }
    },
    computed:{
        ...mapState(['userData'])
    },
})
export default class Details extends Vue{
    minHeight = 500
    errorImg = errorImg
    error = false
    errorText = '告诉你个小秘密，该课程已经下架了'
    breadCrumb = [{name:'首页'},{name:'课程'},{name:'----'}]
    courseTabs = [{name:'课程介绍',active:true},{name:'课程目录',active:false},{name:'课程评论',active:false},]
    activeIndex = 0
    tabBarStyle = {}
    canPlay = false
    courseData = []
    thumbsUpCourseFlag = false
    periodList = []
    commentList = []
    relationList = []
    pageNo = 1
    pageSize = 10
    totals = 1
    shareConfig = {}
    showShare = true
    teacherBoxStyle = {}//老师模块的高度
    getMore = false
    dialogImg = DialogImg
    dialogFlag = false
    dialogTips = '登录到学国学网'
    dialogConfirmText = '立即登录'
    periodDetailsFlag = false
    periodIntroduce = ''
    periodDetailBoxStyle = {}
    commentContent = ''
    commentHttp = false;
    timeLimitTypeArr = ['限时免费','限时折扣','秒杀']
    time = ''
    timeDes = ''
    ms= 99
    timer = null
    msTimer = null
    isStart = false
    contentDialog = false
    prohibitedWord = ''
    @Inject('reload') reload
    @Watch("pageNo")
    oncurrentPageChanged(val, oldVal) {
        if(val==0) return false;
        this.pageNo = val;
        this.getCommenList()
    }
    @Watch('$route')    
    onRouteChanged(val,oldVal){
        this.reload();
    }
    head(){
        return{
            title:`${this.courseData.title} | 学国学网`
        }
    }
    created(){
        if(process.client){
            this.showShare = false;
            this.isLogin = this.userData.hasOwnProperty('userId')?true:false
            this.periodDetailBoxStyle = {
                'max-height':`${window.screen.height/2}px`
            }
            if(this.courseData.timeLimitType>=0&&this.courseData.timeLimitBeginAt&&this.courseData.nowServerTime){
                let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
                let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime()
                this.isStart = now>=begin?true:false
            }
            let timeLimitType = this.courseData.timeLimitType
            this.canPlay = this.userData.isVip>0||this.courseData.isBuy>0||this.courseData.isFree>0||this.courseData.isTrySee>0||(timeLimitType==0&&this.isStart);
            if(timeLimitType>=0){
                let timeLimitBeginAt = this.courseData.timeLimitBeginAt;
                let timeLimitEndAt = this.courseData.timeLimitEndAt;
                let nowServerTime = this.courseData.nowServerTime;
                this.isStartCountDown(timeLimitBeginAt,timeLimitEndAt,nowServerTime)
            }
            let id = this.$route.query.id;
            let url = window.location.origin == 'https://www.xueguoxue.com'?`http://www.xueguoxue.com/course/details?id=${id}`:`http://dev.xueguoxue.com/course/details?id=${id}`;
            this.shareConfig.url = url
            this.shareConfig.source = url
            document.body.scrollTop = 0;
        }
    }
    mounted(){
        this.showShare = false;
        this.minHeight = window.screen.availHeight-287-53-18
        if(!this.courseData.id) return;
        console.log(this.courseData)
        let length = this.courseData.lectureTeacherList.length
        if(length>5){
            let height = 0;
            for(let i=0;i<5;i++){
                height+=this.$refs.teacherItem[i].clientHeight;
            }
            this.teacherBoxStyle = {
                'height':`${height}px`,
                'overflow':'hidden'
            }
            this.getMore = true;
        }else{
            this.teacherBoxStyle = {
                'height':'auto'
            }
            this.getMore = false
        }
        this.$nextTick(()=>{
            let h1 = this.$refs.courseTeacher.clientHeight;
            document.getElementsByClassName('course-tabs')[0].style.minHeight =  `${h1}px`
            document.getElementsByClassName('course-comment')[0].style.minHeight = `${h1-66}px`
        })
    }
    /**是否进行倒计时 */
    isStartCountDown(timeLimitBeginAt,timeLimitEndAt,nowServerTime){
        if(timeLimitEndAt && timeLimitBeginAt){
            let begin = new Date(timeLimitBeginAt.replace(/-/g, '/')).getTime();
            let end = new Date(timeLimitEndAt.replace(/-/g, '/')).getTime();
            let now = new Date(nowServerTime.replace(/-/g,'/')).getTime()
            switch(true){
                case now<begin:
                    this.timeDes = '距离活动开始还有';
                    this.startCountDown(begin,now,1)
                    break;
                case now>=begin&&now<end:
                    this.timeDes = '距离活动结束还有';
                    this.startCountDown(end,now,2)
                    break;
                case now>=end:
                    this.timeDes = '';
                    clearInterval(this.timer)
                    break;
            }
        }
    }
    /**
     * 开始倒计时
     */
    startCountDown(time1,time2,status){
        let time = parseInt((time1-time2)/1000)
        let date;
        if(time>=0){
            let h = parseInt((time-parseInt(time/ 86400)*86400 )/3600)<10?'0'+parseInt((time-parseInt(time/ 86400)*86400 )/3600):parseInt((time-parseInt(time/ 86400)*86400 )/3600);
            let m = parseInt(time % 3600 / 60)<10?'0'+parseInt(time % 3600 / 60):parseInt(time % 3600 / 60);
            let s = parseInt(time % 3600 % 60)<10?'0'+parseInt(time % 3600 % 60):parseInt(time % 3600 % 60)
            if(status==1||status==2){
                let day = parseInt(time/ 86400)>0?parseInt(time/ 86400) + '天':''
                this.time = day+h+ ':' + m + ':' + s ;
                this.timer = setInterval(()=>{
                    time--;
                    let curTime = new Date().getTime();
                    let temp = parseInt((time1-curTime)/1000);
                    if(time>=0){
                        let h = parseInt((time-parseInt(time/ 86400)*86400 )/3600)<10?'0'+parseInt((time-parseInt(time/ 86400)*86400 )/3600):parseInt((time-parseInt(time/ 86400)*86400 )/3600);
                        let m = parseInt(time % 3600 / 60)<10?'0'+parseInt(time % 3600 / 60):parseInt(time % 3600 / 60);
                        let s = parseInt(time % 3600 % 60)<10?'0'+parseInt(time % 3600 % 60):parseInt(time % 3600 % 60);
                        let day = parseInt(time/ 86400)>0?parseInt(time/ 86400) + '天':''
                        this.time = day+h+ ':' + m + ':' + s ;
                        if(time-temp>=3){
                            time = temp;
                            this.time = parseInt(time/ 86400) + '天'+h+ ':' + m + ':' + s ;
                        }
                    }else{
                        this.time = ''
                        this.limitFlag = true
                        clearInterval(this.timer)
                        window.location.reload()
                    }
                },1000)
                let ms = 99;
                this.msTimer = setInterval(()=>{
                    ms--;
                    this.ms = ms<10?'0'+ms:ms;
                    if(time<=0){
                        this.ms = '00'
                        clearInterval(this.msTimer)
                    }
                    if(ms<=0){
                        ms = 99;
                    }
                },10)
            }
        }
    }
    /**
     * 切换Tabs
    */
    changeTab(obj,index){
        let width = this.$refs.tabBar.clientWidth/3;
        this.courseTabs.forEach(item=>item.active = false)
        obj.active = true;
        this.activeIndex = index;
        this.tabBarStyle = {
            transform:`translateX(${index*width}px)`
        }
        // this.tabBarStyle = {
        //     transform:`translateX(${index*width*0.245}px)`,
        //     width:index==2?'51%':'24.5%'
        // }
    }
    /**
     * 课时列表，点击某个课时去播放页面
     */
    goPlayer(obj){
        if(this.userData&&this.userData.userId){
            if(this.userData.isVip&&this.userData.isVip>0){
                this.$router.push({
                    path:'/course/player',
                    query:{courseId:obj.courseId,periodId:obj.id,targetId:obj.targetId}
                })
            }else{
                if(this.courseData.isFree>0){
                    this.$router.push({
                        path:'/course/player',
                        query:{courseId:obj.courseId,periodId:obj.id,targetId:obj.targetId}
                    })
                }else{
                    if(this.courseData.isBuy>0){
                        this.$router.push({
                            path:'/course/player',
                            query:{courseId:obj.courseId,periodId:obj.id,targetId:obj.targetId}
                        })
                    }else{
                        if(this.courseData.timeLimitType==0&&this.isStart){
                            this.$router.push({
                                path:'/course/player',
                                query:{courseId:obj.courseId,periodId:obj.id,targetId:obj.targetId}
                            })
                        }else{
                            if(obj.isTry>0){
                                this.$router.push({
                                    path:'/course/player',
                                    query:{courseId:obj.courseId,periodId:obj.id,targetId:obj.targetId}
                                })
                            }else{
                                this.dialogTips = '当前课程未购买，是否立即购买'
                                this.dialogConfirmText = '立即购买'
                                this.dialogFlag = true;
                            }
                        }
                    }
                }
            }
        }else{
            if(obj.isTry>0||this.courseData.isFree>0||(this.courseData.timeLimitType==0&&this.isStart)){
                this.$router.push({
                    path:'/course/player',
                    query:{courseId:obj.courseId,periodId:obj.id,targetId:obj.targetId}
                })
            }else{
                this.dialogTips = '登录到学国学网'
                this.dialogConfirmText = '立即登录'
                this.dialogFlag = true;
            }
        }
    }
    /**
     * 通过button或者播放按钮去播放页面
     */
    goPlayerPage(){
        if(!this.canPlay) return;
        if((this.userData.isVip&&this.userData.isVip>0)||this.courseData.isBuy>0||this.courseData.isFree>0||(this.courseData.timeLimitType==0&&this.isStart)){
            let query = {
                courseId:this.courseData.id,
                periodId:this.periodList[0].id,
                targetId:this.periodList[0].targetId
            }
            this.$router.push({
                path:'/course/player',
                query:query
            })
            return;
        }
        if(this.courseData.isTrySee){
            let obj = this.periodList.find(item=>item.isTry>0)
            let query = {
                courseId:this.courseData.id,
                periodId:obj.id,
                targetId:obj.targetId
            }
             this.$router.push({
                path:'/course/player',
                query:query
            })
        }
    }
    /**
    * 老师模块，点击箭头获取更多老师(length>5)
    */
    getMoreTeacher(){
        this.teacherBoxStyle = {
            'height':`auto`,
            'overflow':'initial',
            'transition':'all 0.3s'
        }
        this.getMore = false
    }
    /**
     * 去购买
     */
    buyCourse(){
        if(this.userData&&this.userData.userId){
            if(this.userData.cellphone){
                this.$router.push({
                    path:`/course/order`,
                    query:{
                       id:this.courseData.id
                    }
                })
            }else{
                this.dialogTips = '请认证手机号'
                this.dialogConfirmText = '关联手机'
                this.dialogFlag = true;
            }
        }else{
            this.dialogTips = '登录到学国学网'
            this.dialogConfirmText = '立即登录'
            this.dialogFlag = true;
        }
    }
    /**
     * dialog确定事件
     */
    confirmTodo(){
        if(this.dialogConfirmText=='立即登录'){
            this.goLogin();
        }else if(this.dialogConfirmText=='关联手机'){
            this.goBindPhone()
        }else if(this.dialogConfirmText=='立即购买'){
            this.buyCourse()
        }
    }
    /**
     * 去登录
     */
    goLogin(){
        let url = this.$route.fullPath
        sessionStorage.setItem('redirectUrl',url)
        this.$router.push({
            path:'/auth/login'
        })
    }
    /**
     * 去关联手机号
     */
    goBindPhone(){
        let url = this.$route.fullPath
        sessionStorage.setItem('redirectUrl',url)
        this.$router.push({
            path:'/auth/bindPhone'
        })
    }
    /**
     * 查看课时详情
     */
    async lookPeriodDetails(e,obj){
        e.stopPropagation()
        let res = await this.$axios.$get(`${this.$server.getPeriodInfo}/${obj.id}`,{});
        if(res.status==200){
            this.periodIntroduce = res.content.introduce;
            this.periodDetailsFlag = true;
        }
    }
    pressKeyDown(e){
        if(e.keyCode=='13'){
            this.addComment()
        }
    }
    /**
     * 添加评论
     */
    addComment(){
        if(this.commentContent.length==0){
            this.$message.info('请输入评论');
            return;
        }
        if(this.userData&&this.userData.userId){
            if(this.userData.cellphone){
                let content = this.commentContent.replace(/(^\s*)|(\s*$)/g, "");
                this.commentHttp = true;
                this.$axios.$post(this.$server.verifyProhibitedWord,{content:content}).then(response=>{
                    if(response.content.length>0){
                        this.contentDialog = true;
                        this.prohibitedWord = response.content;
                        this.commentHttp = false;
                    }else{
                        let query = {
                            courseId:this.courseData.id,
                            content:content
                        }
                        this.$axios.$post(this.$server.addComment,query).then(res=>{
                            if(res.status==200){
                                this.$message({
                                    message: '发表成功',
                                    type: 'success'
                                });
                                this.commentContent = ''
                                this.pageNo = 1;
                                this.$nextTick(()=>{
                                    this.getCommenList()
                                    this.commentHttp = false;
                                })
                            }else{
                                this.commentHttp = false;
                            }
                        })
                    }
                })
            }else{
                this.dialogTips = '请认证手机号'
                this.dialogConfirmText = '关联手机'
                this.dialogFlag = true;
            }
        }
    }
    /**
     * 获取评论
     */
    async getCommenList(){
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('login-page')[0],
            background:'rgba(255,255,255,0)'
        });
        let query = {
            params:{
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }
        }
        let res = await this.$axios.$get(`${this.$server.getCommenList}/${this.courseData.id}`,query)
        loadingInstance.close()
        if(res.status==200){
            this.commentList = res.content.list
            this.totals = res.content.total
        }
    }
    /**
     * 评论点赞(课时，评论)
     */
    async commentThumbsUp(obj,index){
        if(obj.thumbsUpPeriodFlag){
            this.$message.info('请勿重复点赞！')
            return;
        };
        if(this.userData&&this.userData.userId){
            if(this.userData.cellphone){
                let query = {
                    commentId:obj.id,
                    type:2
                }
                let res = await this.$axios.$post(this.$server.thumbsUp,query);
                if(res.status==200){
                    obj.thumbsUpPeriodFlag = true;
                    obj.praisePoint++;
                    this.$set(this.commentList,index,obj)
                }
            }else{
                this.dialogTips = '请认证手机号'
                this.dialogConfirmText = '关联手机'
                this.dialogFlag = true;
            }
        }else{
            this.dialogTips = '登录到学国学网'
            this.dialogConfirmText = '立即登录'
            this.dialogFlag = true;
            return;
        }

    }
    /**
     * 课程点赞
     */
    async courseThumbsUp(){
        if(this.thumbsUpCourseFlag){
            this.$message.info('请勿重复点赞！')
            return;
        }
        if(this.userData&&this.userData.userId){
            if(this.userData.cellphone){
                let query = {
                    type:1,
                    courseId:this.courseData.id
                }
                let res = await this.$axios.$post(this.$server.thumbsUp,query);
                if(res.status==200){
                    this.thumbsUpCourseFlag = true;
                    this.courseData.courseUserLikeCount++;
                }
            }else{
                this.dialogTips = '请认证手机号'
                this.dialogConfirmText = '关联手机'
                this.dialogFlag = true;
            }
        }else{
            this.dialogTips = '登录到学国学网'
            this.dialogConfirmText = '立即登录'
            this.dialogFlag = true;
        }
    }
    /**
     * 搜索出老师下面所有课程
     */
    getAllCourseByName(obj){
        this.$router.push({
            path:'/search',
            query:{keywords:obj.name}
        })
    }
    /**
     * 去课程详情
     */
    goCourseDetails(obj){
        this.$router.push({
            path:'/course/details',
            query:{
                id:obj.id
            }
        })
    }
}
</script>
<style lang="scss" scoped>
    .course-detials-page{
        background: #F3F5F7;
        .error-box{
            background: #F3F5F7;
            text-align: center;
            padding:160px 0 0 0;
            img{
                display: inline-block;
                width: 220px;
            }
            .tips{
                color:#999999;
            }
            .btn{
                margin:28px 0 28px 0;
                color:#333333;
                text-decoration: underline;
                cursor: pointer;
                &:hover{
                    opacity: 0.85
                }
            }
        }
        .content{
            width: 1200px;
            margin:0 auto;
            .page-top{
                .breadcrumb{
                    padding: 24px 0 0 0;
                }
                .course-info{
                    border-radius: 4px;
                    height: 380px;
                    background: #fff;
                    box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
                    padding: 30px;
                    .wrapper{
                        height: 100%;
                        .course-info-left{
                            width:530px;
                            margin-right: 40px;
                            height: 100%;
                            float: left;
                            position: relative;
                            overflow: hidden;
                            &:hover{
                                img{transform: scale(1.1)}
                            }
                            .shade{
                                position: absolute;
                                top:0;
                                left:0;
                                width:100%;
                                height: 100%;
                                z-index: 2;
                                background: #000;
                                opacity: 0.3;
                            }
                            img{
                                width: 100%;
                                height: 100%;
                                transition: all 0.3s;
                                position: relative;
                                z-index: 1;
                               
                            }
                            .player-btn{
                                position: absolute;
                                top:50%;
                                left: 50%;
                                width: 70px;
                                height: 70px;
                                display: block;
                                transform: translate(-50%,-50%);
                                z-index: 3;
                                &.could{
                                    background: url('../../../assets/images/play_icon.png')no-repeat 50% 50% / cover;
                                }
                                &.not-allow{
                                    background: url('../../../assets/images/lock_icon.png')no-repeat 50% 50% / cover;
                                }
                            }
                        }
                        .course-info-right{
                            overflow: hidden;
                            height: 100%;
                            position: relative;
                            &.long-title{
                                .course-title{
                                    width: 406px;
                                    word-break: break-word;
                                }
                                .course-txt{
                                    margin:20px 0 24px 0;
                                }
                            }
                            .course-title{
                                font-size: 24px;
                                // line-height: 24px;
                                font-weight: bold;
                                color:#333333;
                            }
                            .course-des{
                                font-size: 14px;
                                line-height: 14px;
                                color:#999;
                                margin: 12px 0 30px 0;
                            }
                            .sell-price{
                                color:#c30d23;
                                font-size: 20px;
                                line-height: 28px;
                                font-weight: bold;
                                float: left;
                                p{
                                    font-size: 20px;
                                    font-weight: bold;
                                }
                            }
                            .limit-time{
                                float: left;
                                line-height: 28px;
                                margin-left: 40px;
                                .type-name{
                                    color:#c30d23;
                                    font-size: 20px;
                                    line-height: 28px;
                                    font-weight: bold;
                                    margin-right: 40px;
                                    display: none;
                                }
                                .right-box{
                                    color:#c30d23;
                                    span{
                                         font-size: 14px;
                                    }
                                }
                            }
                            .ori-price{
                                font-size: 16px;
                                line-height: 16px;
                                color:#999;
                                text-decoration: line-through;
                                margin: 14px 0 0 0;
                            }
                            .section-num{
                                color:#333333;
                                font-size: 14px;
                                line-height: 14px;
                                margin-top:18px;
                            }
                            .channel-buy-avaliday{
                                color:#666666;
                                font-size: 14px;
                                position: absolute;
                                top:180px;
                                left: 0;
                            }
                            .course-btn-area{
                                position: absolute;
                                bottom:0;
                                left: 0;
                            }
                            .course-txt{
                                margin:52px 0 24px 0;
                                .praise-num,.browse-num,.course-share{
                                    position: relative;
                                    display: inline-block;
                                    vertical-align: middle;
                                    margin-right: 22px;
                                    font-size: 0;
                                    i{
                                        display: inline-block;
                                        vertical-align: middle;
                                        margin-right: 8px;
                                        width: 18px;
                                        height: 18px;
                                    }
                                    p{
                                        display: inline-block;
                                        vertical-align: middle;
                                        color:#333333;
                                        font-size: 14px;
                                        line-height: 14px;
                                    }
                                }
                                .praise-num{cursor: pointer;}
                                .praise-num i{background: url('../../../assets/images/zan_icon.png')no-repeat 50% 50% /cover;margin-bottom:2px;}
                                .browse-num i{background: url('../../../assets/images/course_browse_icon.png')no-repeat 50% 50% /cover}
                                .course-share i{background: url('../../../assets/images/course_share_icon.png')no-repeat 50% 50% /cover}
                                .praise-num.praised i{background: url('../../../assets/images/praise_active_icon.png')no-repeat 50% 50% /cover;margin-bottom:2px;}
                                .course-share{
                                    cursor: pointer;
                                    .social-share{
                                        position: absolute;
                                        width: 160px;
                                        top: -210%;
                                        left: 50%;
                                        margin-left: -80px;
                                        opacity: 0;
                                        visibility: hidden;
                                        transition: all 0.3s;
                                    }
                                    &:hover{
                                        .social-share{
                                           visibility: visible;
                                           opacity: 1;
                                        }
                                    }
                                }
                            }
                            .course-btn{
                                width: 170px;
                                height: 48px;
                                line-height: 48px;
                                text-align: center;
                                background: #c30d23;
                                color:#fff;
                                font-size:22px;
                                letter-spacing: 1px;
                                cursor: pointer;
                                border:none;
                                outline: none;
                                border-radius: 5px;
                                &:hover{
                                    background: #d3132a;
                                }
                            }
                            .course-tag{
                                position: absolute;
                                top:5px;
                                right: 0;
                                .time-limit,.new{
                                    display: inline-block;
                                    vertical-align: middle;
                                    height: 26px;
                                    line-height: 26px;
                                    color:#fff;
                                    font-size: 14px;
                                    border-radius: 20px;
                                    padding: 0 12px;
                                }
                                .time-limit{
                                    background: linear-gradient(to bottom right, #A2DB59 , #69A916);
                                }
                                .new{
                                    margin-left: 12px;
                                    background: linear-gradient(to bottom right, #EB8474 , #DB3734);
                                }
                            }
                        }
                    }
                }
            }
            .page-body{
                padding:30px 0;
                .course-tabs{
                    float: left;
                    width: 795px;
                    box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
                    margin-right: 25px;
                    border-radius: 4px;
                    position: relative;
                    background: #fff;
                    .tabs-bar-box{
                        position: absolute;
                        top:64px;
                        left: 0;
                        height: 4px;
                        width: 100%;
                        z-index: 2;
                        >div{
                            width: 33.33%; 
                            position: relative;
                            height: 100%;    
                            transition: all 0.3s ease;
                            >span{
                                width: 84px;
                                margin:0 auto;
                                height: 100%;
                                background: #c30d23;
                                display: block;
                            } 
                        }
                        // span{
                        //     width: 33.33%;
                        //     position: relative;
                        //     height: 100%;
                        //     background: #c30d23;
                        //     display: block;
                        //     transition: all 0.3s ease;
                        // }
                    }
                    .tabs-txt{
                        font-size: 0;
                        p{
                            display: inline-block;
                            vertical-align: middle;
                            line-height: 70px;
                            height: 66px;
                            width: 33.33%;
                            text-align: center;
                            color:#333333;
                            font-size: 22px;
                            cursor: pointer;
                            &.active{
                                color:#c30d23;
                            }
                            // &:last-child{
                            //     width: 51%;
                            //     text-align: left;
                            //     padding-left: 10%;
                            // }
                        }
                    }
                    .tabs-content{
                        position: relative;
                        .item{
                            width: 100%;
                            display: none;
                            &.active{
                                display: block;
                            }
                            &.course-intro{
                                min-height: 200px;
                                padding: 20px;
                            }
                            &.course-catalogue{
                                .course-catalogue-item{
                                    height: 60px;
                                    padding: 0 30px;
                                    font-size: 16px;
                                    &:nth-of-type(odd){
                                        background: #FAFAFA
                                    }
                                    .l{
                                        float: left;
                                    }
                                    .r{
                                        float: right;
                                    }
                                    .sort{
                                        margin-right: 20px;
                                        line-height: 60px;
                                    }
                                    .section-title{
                                        line-height: 60px;
                                        max-width: 77%;
                                    }
                                    .is-try{
                                        margin-right: 10px;
                                        color:#c30d23;
                                        line-height: 60px;
                                        min-width: 34px;
                                        height: 100%;
                                    }
                                    .details-icon-box{
                                        padding: 22px 8px;
                                        display: inline-block;
                                        vertical-align: middle;
                                        .details-icon{
                                            display: block;
                                            width:16px;
                                            height: 16px;
                                            background: url('../../../assets/images/period_icon.png')no-repeat 50% 50%/cover;
                                        }
                                    }
                                    .play-state{
                                        display: inline-block;
                                        vertical-align: middle;
                                        width: 42px;
                                    }
                                }
                            }
                            &.course-comment{
                                padding-bottom:50px;
                                .comment-area{
                                    position: relative;
                                    padding: 30px;
                                    textarea{
                                        width:100%;
                                        display: block;
                                        height: 140px;
                                        background: #F4F4F4;
                                        border-radius: 3px;
                                        border:1px solid rgba(204,204,204,1);
                                        outline: none;
                                        resize: none;
                                        padding:20px;
                                        line-height: 20px;
                                    }
                                    /deep/ .btn{
                                        &.is-disabled{
                                            cursor: pointer;
                                        }
                                    }
                                    button{
                                        float: right;
                                        margin-top:20px;
                                    }
                                    .comment-word{
                                        position: absolute;
                                        right: 50px;
                                        top:135px;
                                        color:#3A3A3A;
                                        font-size: 14px;
                                    }
                                }
                                .page-box{
                                    width: 100%;
                                    position: absolute;
                                    bottom:10px;
                                }
                                .course-comment-item{
                                    padding-left: 30px;
                                    font-size: 16px;
                                    .item-box{
                                        border-top:1px solid #CCCCCC;
                                        padding: 30px 30px 30px 0;
                                    }
                                    .l{
                                        float: left;
                                        font-size: 0;
                                    }
                                    .r{
                                        float: right;
                                        font-size: 0;
                                    }
                                    .comment-m{
                                        margin:10px 0 15px 0;
                                        padding: 0 10px 0 50px;
                                        .comment-content{
                                            font-size: 14px;
                                            color:#333;
                                            line-height: 24px;
                                            word-wrap:break-word;
                                        }
                                        .forbid{
                                            font-size: 0;
                                            margin:16px 0;
                                            i{
                                                width: 36px;
                                                height: 36px;
                                                display: inline-block;
                                                vertical-align: middle;
                                                margin-right: 12px;
                                                background: url('../../../assets/images/forbid.png')no-repeat 50% 50%/cover;
                                            }
                                            span{
                                                display: inline-block;
                                                vertical-align: middle;
                                                border-radius: 6px;
                                                background:rgba(195, 13, 35, 0.5);
                                                font-size: 14px;
                                                color:#fff;
                                                padding:0px 18px;
                                                line-height: 32px;
                                                height: 32px;
                                            }
                                        }
                                    }
                                    .comment-b{
                                        padding: 0 10px 0 50px;
                                    }
                                    .comment-user-avatar{
                                        width: 39px;
                                        height: 39px;
                                        display: inline-block;
                                        vertical-align: middle;
                                        border-radius: 50%;
                                        margin-right: 11px;
                                    }
                                    .comment-user-nickname{
                                        display: inline-block;
                                        vertical-align: middle;
                                        font-size: 18px;
                                    }
                                    .comment-time{
                                        display: inline-block;
                                        vertical-align: middle;
                                        line-height: 39px;
                                        height: 39px;
                                        font-size: 12px;
                                    }
                                    .comment-praise-num{
                                        display: inline-block;
                                        vertical-align: middle;
                                        margin:0 10px 0 20px;
                                        line-height: 39px;
                                        height: 39px;
                                        font-size: 12px;
                                        cursor: pointer;
                                        i{
                                            margin-right: 4px;
                                            display: inline-block;
                                            vertical-align: text-top;
                                            width: 14px;
                                            height: 14px;
                                            background: url('../../../assets/images/zan_icon.png')no-repeat 50% 50%/cover;
                                        }
                                        &.praised{
                                            i{
                                                background: url('../../../assets/images/praise_active_icon.png')no-repeat 50% 50%/cover;
                                            }
                                        }
                                    }

                                    .comment-reply{
                                        p{
                                            color:#ccc;
                                            font-size: 14px;

                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .course-relative{
                    width: 380px;
                    float: left;
                    .mechanism{
                        background: #fff;
                        box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
                        padding:20px 20px 60px 20px;
                        border-radius: 4px;
                        position: relative;
                        margin-bottom:20px;
                        .title{
                            font-size: 22px;
                            color:#333;
                            margin-bottom:20px;
                            text-align: center;
                        }
                        .content{
                            line-height: 24px;
                            font-size: 16px;
                            color:#666;
                            width: 100%;
                        }
                    }
                    .course-teacher{
                        background: #fff;
                        box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
                        padding:20px 20px 60px 20px;
                        min-height: 340px;
                        border-radius: 4px;
                        position: relative;
                        .title{
                            color:#333333;
                            font-size: 22px;
                        }
                        .course-teacher-item{
                            text-align: center;
                            padding: 40px 0 0 0;
                            .teacher-avatar{
                                display:inline-block;
                                width: 95px;
                                height: 95px;
                                border-radius: 50%;
                            }
                            .teacher-name{
                                color:#07111A;
                                font-size: 22px;
                                margin:10px 0;
                            }
                            .teacher-intro{
                                font-size: 18px;
                                color:#999999;
                                cursor: default;
                            }
                        }
                        .arrow{
                            position: absolute;
                            bottom:16px;
                            left: 50%;
                            margin-left: -12px;
                            transform: rotate(90deg);
                            i{
                                font-size: 24px;
                                color:#999;
                                animation: move 1s linear infinite both;
                            }
                        }
                    }
                    .course-relevance{
                        background: #fff;
                        box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
                        padding:20px;
                        margin-top:17px;
                        border-radius: 4px;
                        .title{
                            color:#333333;
                            font-size: 22px;
                        }
                        .course-relevance-item{
                            margin:20px 0;
                            font-size: 0;
                            .course-avatar-box{
                                width: 100%;
                                height: 217px;
                                overflow: hidden;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    transition: all 0.3s;
                                }
                                &:hover{
                                    img{
                                        transform: scale(1.1)
                                    }
                                }
                            }
                            .course-title{
                                text-align: center;
                                color:#07111A;
                                font-size: 18px;
                                margin-top:20px;
                            }
                        }
                    }
                }
            }
        }
        .content-dialog{
            .content-dialog-box{
                min-height: 457px;
                height:auto!important;
                padding:0 0 50px 0;
            }
            i{
                color:#C30D23;
                font-size: 72px;
                margin-top:50px;
            }
            .tips1{
                color:#333;
                font-size: 33px!important;
                font-weight: bold!important;
                margin:17px 0 31px 0;
            }
            .tips2{
                font-size: 24px!important;
                color:#333!important;
            }
            .prohibited-word{
                color:#C30D23!important;
                font-size: 24px!important;
                margin:20px auto 37px ;
                width: 80%;
            }
            .btn{
                color:#C30D23!important;
                font-size: 24px!important;
                text-decoration: underline!important;
                cursor: pointer;
            }
        }
        .course-dialog,.content-dialog{
            position: fixed;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10;
            .course-dialog-box,.content-dialog-box{
                width: 523px;
                height: 457px;
                position: absolute;
                top:50%;
                left: 50%;
                background: #fff;
                border-radius: 5px;
                transform: translate(-50%,-50%);
                .title{
                    font-size: 19px;
                    color:#6A6A6A;
                    height: 56px;;
                    line-height:56px;
                    padding-left:29px;
                    background: #EDF1F7;
                }
                .body{
                    text-align: center;
                    img{
                        display:inline-block;
                        width: 114px;
                        height: 191px;
                        margin:42px 0 25px 0;
                    }
                    p{
                       text-align: center;
                       font-size: 22px;
                       color:#6A6A6A;
                       letter-spacing: 1px;
                    }
                    .btns{
                        display: inline-block;
                        font-size: 0;
                        margin-top:30px;
                        button{
                            display: inline-block;
                            vertical-align: middle;
                            width:130px;
                            height:40px;
                            line-height: 38px;
                            font-size: 16px;
                            border-radius: 5px;
                            outline: none;
                            border:none;
                            cursor: pointer;
                        }
                        .confirm{
                            color:#fff;
                            background: #C30D23;
                            border:1px solid #C30D23;
                            &:hover{
                                background: #d6394c;
                            }
                            margin-right: 66px;
                        }
                        .cancel{
                            color:#C30D23;
                            background: #fff;
                            border:1px solid #C30D23;
                            &:hover{
                                background: #fbf3f3;
                            }
                        }
                    }
                }
            }
        }
        .period-details-dialog{
            border-radius: 5px!important;
            width: 834px;
            position: absolute;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            .title{
                padding-top:30px;
                i,p{
                    display: inline-block;
                    vertical-align: middle;
                }
                i{
                    width: 18px;
                    height: 27px;
                    &.left-icon{
                        background: url('../../../assets/images/dialog_left_icon.png')no-repeat 50% 50%/cover;
                    }
                    &.right-icon{
                        background: url('../../../assets/images/dialog_right_icon.png')no-repeat 50% 50%/cover;
                    }
                }
                p{
                    font-size: 20px;
                    font-weight: bold;
                    color:#000;
                    margin:0 30px;
                }
            }
            .intro{
                padding: 0 15px;
                overflow: auto;
            }
            .save-btn{
                width: 184px;
            }
            .dialog-btns{
                text-align: center;
                margin-top:35px;
                button{
                    display:inline-block;
                }
            }
        }
    }
    .shade-box{
        background: #fff;
        z-index: 9999;
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    @keyframes move{
        0%{
            transform: translateX(-5px)
        }
        25%{
            transform: translateX(0)
        }
        50%{
            transform: translateX(5px)
        }
        75%{
            transform: translateX(0px)
        }
        100%{
            transform: translateX(-5px)
        }
    }
</style>
<style>
.period-details-dialog{
    border-radius: 5px!important;
    width: 834px;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    margin:0!important;
}
/* ::-webkit-scrollbar-thumb{
    background: #c30d23;
}
::-webkit-scrollbar {
    width:5px;
    height:10px;
} */
</style>

