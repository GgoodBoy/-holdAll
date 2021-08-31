<template>
    <view class="video-pluge"> 
        <view class="video-box">
            <view v-if="videoFirst&&userCellphoneType">    
                <video id="myVideo" class="myVideoCss" :controls="videoControls" x5-video-player-type="h5" @error="videoErrorCallback" :src="src" :enable-play-gesture='true' :autoplay='autoplays' :poster="imgPoster" @progress="videoProgress" @ended='endedEven' @play="playEven" @pause="pauseEven" @timeupdate='timeupdateEven' show-center-play-btn ></video>
            </view>  
            <view class="video-img" v-if="!videoFirst||!userCellphoneType">
                <image class="video-img-one" :src="imgPoster" webp lazy-load/>
                <view class="video-img-two"  @click="playOrPauseIconEven" v-if="lookOrPick">
                    <image  class="img-css" :src="player_btn"/>
                </view>
            </view>
            <view class="video-layout" v-if="(Number(periodObg.isTrySee)==0&&Number(objs.isVip)==0)&&objs.isBuy==0&&objs.timeLimitType!=0&&objs.isFree==0">
                <image class="img-css" :src="player_lock" />    
            </view>   
        </view>      
        <view class="uni-btn-v">
            <view class="textCourse">
                <text class="courseTitle"> 
                    {{objs.title}}     
                </text>
                <view class="userBox">
                    <view class="textInfo">
                        <view class="titleRow1">
                            {{nameListArrays}}
                        </view>
                        <view class="titleRow2">
                            <text class="text1 text-css">{{objs.actualPeriodNum||0}}节</text>
                            <text class="text-css">|</text>
                            <text class="text-css">共{{objs.planPeriodNum||0}}节</text>
                            <text class="text-css">{{objs.courseBrowsCount?objs.courseBrowsCount+1>100000?'10w+':objs.courseBrowsCount+1:0}}人学习</text>   
                        </view>
                    </view>                   
                    <view class="moneyCourse" v-if="userCellphoneType&&!objs.isJoinAssemble&&iosOrAndroid=='Android'">
                        <view v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0" style="text-decoration:line-through;font-size:26rpx;text-align: center;color:#779DD3;">原价({{objs.originalPrice}})币</view>
                        <view class="moneyBut" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&objs.timeLimitType==2" @click="purchaseCourse">
                            购买({{objs.spikePrice}}币)
                        </view>
                        <view class="moneyBut" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&xgxwChannelData.xgxwChannel&&objs.timeLimitType!=2" @click="purchaseCourseXgxwChanne(false)">
                            {{'价格低至('+xgxwChannelData.minVal+')币'}}
                        </view>
                        <view class="moneyBut" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&objs.timeLimitType!=2&&!xgxwChannelData.xgxwChannel" @click="purchaseCourse">
                            购买({{objs.sellingPrice}}币)
                        </view>
                    </view>
                    <view class="moneyCourse" v-if="!userCellphoneType&&!objs.isJoinAssemble&&iosOrAndroid=='Android'">
                        <view v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0" style="text-decoration:line-through;font-size:26rpx;text-align: center;color:#779DD3;">原价({{objs.originalPrice}})币</view>
                        <button class="moneyBut" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&loginType&&objs.timeLimitType==2">
                            购买({{objs.timeLimitType==2?objs.spikePrice:objs.sellingPrice}}币)
                        </button>
                        <button class="moneyBut" @click="purchaseCourseXgxwChanne(true)" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&loginType&&xgxwChannelData.xgxwChannel&&objs.timeLimitType!=2">
                            {{'价格低至('+xgxwChannelData.minVal+')币'}}
                        </button>
                        <button class="moneyBut" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&loginType&&objs.timeLimitType!=2&&!xgxwChannelData.xgxwChannel">
                            购买({{objs.sellingPrice}}币)
                        </button>
                        <button class="moneyBut" @click="decryptLoginNumber"  v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&!loginType">
                            <!-- 购买({{objs.timeLimitType==2?objs.spikePrice:objs.sellingPrice}}币) -->
                            <span v-if="objs.timeLimitType==2">
                                购买({{objs.spikePrice}}币)
                            </span>
                            <span v-else-if="xgxwChannelData.xgxwChannel&&objs.timeLimitType!=2">
                                {{'价格低至('+xgxwChannelData.minVal+')币'}}
                            </span>
                            <span v-else>
                                购买({{objs.sellingPrice}}币)
                            </span>                            
                        </button>                        
                    </view>   
                </view>              
            </view> 
        </view> 
        <view class="spellPluge" v-if="spellTableData2.length>0&&Number(objs.isBuy)+''=='0'">  
            <view class="spellPlugeName">
                <view class="views">可参与的{{isNumberSpell}}人拼团</view>
                <image class="more" :src="rightIcon"  webp lazy-load @click="spellTenlistEven(1,'')"/>
            </view> 
            <view class="spelltags">
                <view class="spellList" v-for="(item,index) in spellTableData2" :key='index'>
                    <view class="spellLefts">
                        <view class="userBox" :style="{'width':80+3*40+'rpx'}">
                            <image class="users" :src="item1" :style="{'left':index1*40+'rpx'}"  webp lazy-load v-for="(item1,index1) in item.headUrlList" :key="index1+'u'"/>
                        </view>
                        <view class="userNum">还差{{item.remainderNum}}位成团</view>
                    </view>
                    <!-- <view @click="isNogetPhoneNumber(3,item)" v-if="(iosOrAndroid=='Android'&&!unserIsLogenType)?true:false"> -->
                    <view @click="isNogetPhoneNumber(3,item)" v-if="(iosOrAndroid=='Android'&&!userCellphoneType)?true:false">
                        <button class="moneyBut" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if='loginType'>     
                            立即成团
                        </button>  
                        <button class="moneyBut" @click="decryptLoginNumber" v-else>     
                            立即成团
                        </button>                          
                    </view>                          
                    <view class="spellRights" @click="spellTenlistEven(3,item)" v-else>
                        立即成团
                    </view>
                </view>
            </view>                  
        </view>         
        <view class="spellDilgeBox" v-if="spellDilgeBoxShowOrHide">
            <view class="spellListBox">
                <view class="spellCloseCss">
                    <image class="img-css" :src='spellClose' @click="spellCloseBut"/>
                </view>
                <view class="spellList" >
                    <view class="spellListTwo" v-for="(item,index) in spellTableData" :key='index'>
                        <view class="spellLefts">
                            <view class="userBox" style="width:160rpx">
                                <image class="users" :src="item1" :style="{'left':index1*40+'rpx'}"  webp lazy-load v-for="(item1,index1) in item.headUrlList" :key="index1+'u'"/>
                            </view>
                            <view class="userNum">还差{{item.remainderNum}}位成团</view>
                        </view>
                        <!-- <view @click="isNogetPhoneNumber(3,item)" v-if="(iosOrAndroid=='Android'&&!unserIsLogenType)?true:false"> -->
                        <view @click="isNogetPhoneNumber(3,item)" v-if="(iosOrAndroid=='Android'&&!userCellphoneType)?true:false">
                            <button class="moneyBut" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if='loginType'>     
                                立即成团
                            </button>  
                            <button class="moneyBut" @click="decryptLoginNumber" v-else>     
                                立即成团
                            </button>                              
                        </view>                          
                        <view class="spellRights" @click="spellTenlistEven(3,item)" v-else>
                            立即成团
                        </view>
                    </view>
                </view>
            </view>
        </view> 
        <view v-if="iosOrAndroid=='Android'">
            <view class="moneySpellBox" v-if="objs.isJoinAssemble&&!objs.isBuy&&objs.isVip!=1">
                <!-- <view class="isOkmoneyOne" v-if="(iosOrAndroid=='Android'&&!unserIsLogenType)?true:false"> -->
                <view class="isOkmoneyOne" v-if="(iosOrAndroid=='Android'&&!userCellphoneType)?true:false">
                    <view class="leftsOne" @click="getPhoneNumberButEven(1)">
                        <button class="lefts" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if='loginType'>
                            <view class='views'>原价:{{objs.sellingPrice}}币</view>
                            <view class='views'>单独购买</view>
                        </button>
                        <button class="lefts"  @click="decryptLoginNumber" v-else>
                            <view class='views'>原价:{{objs.sellingPrice}}币</view>
                            <view class='views'>单独购买</view>
                        </button>                        
                    </view>
                    <view class="leftsOne" @click="getPhoneNumberButEven(2)">
                        <button class="rights" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if='loginType'>
                            <view class='views'>拼团价:{{objs.assemblePrice}}币</view>
                            <view class='views'>发起拼团</view>
                        </button>   
                        <button class="rights"  @click="decryptLoginNumber" v-else>
                            <view class='views'>拼团价:{{objs.assemblePrice}}币</view>
                            <view class='views'>发起拼团</view>
                        </button>                                          
                    </view>              
                </view>
                <view class="isOkmoneyTwo" v-else>
                    <view class="lefts" @click="purchaseCourseAgentEven(1)">
                        <view class='views'>原价:{{objs.sellingPrice}}币</view>
                        <view class='views'>单独购买</view>
                    </view>
                    <view class="rights" @click="purchaseCourseAgentEven(2)">
                        <view class='views'>拼团价:{{objs.assemblePrice}}币</view>
                        <view class='views'>发起拼团</view>
                    </view>                
                </view>
            </view>             
        </view> 
        <view v-if="iosOrAndroid=='IOS'&&!objs.isBuy&&objs.isVip!=1" class="moneySpellBoxAndroid">
            <view class="isOkmoneyThree">由于相关规范，iOS功能暂不可用</view>
        </view>                                    
    </view>
</template>

<script> 
import player_lock from '../../static/courseDetail/player_lock.png';
import player_btn from '../../static/courseDetail/player_btn.png'
import rightIcon from '../../static/investMoney/icon-1.png';
import spellClose from '../../static/courseDetail/close.png'
import {mapState,mapActions} from 'vuex'
export default {

    data() {
        return {
            player_lock:player_lock,//锁
            player_btn:player_btn,
            title: 'video',
            videoContext:'',
            src:'',
            autoplays:false,
            openType:false,//是否开启自动播放属性
            studyPoint:[],//学习时间点 1,2,3...
            lastStudyPoint:0,//暂停，退出，播放结束的进度条所在位置的时间；
            learnRate:0,//学习时长
            endVideoTime:0,//视频播放结束时的时间值
            realTimeData:'',//进度条最新实时数据
            periodId:'',
            timeDuration:'',//总时长
            changeDuration:0,//播放状态的时候的时间；
            playerIsNo:false,//表示课程节是否可以观看；
            playEndState:false,//播放结束
            // unserIsLogenType:false,//当前用户是否已绑定电话号码
            userinfos:'',//缓存
            nameListArrays:'',
            videoControls:true,//视频是否可以不放
            periodIdState:true,//检查视频播放路径有没有变化
            imgPoster:'',
            videoFirst:false,
            pathChangeType:false,
            pathChangeTypeOther:false,
            phoneTypeInfo:'',
            lookOrPick:true,
            //拼团
            rightIcon:rightIcon,
            spellClose:spellClose,//关闭平团弹框按钮
            spellTableData:[],//拼团列表
            spellTableData2:[],
            spellDilgeBoxShowOrHide:false,//拼团列表页面是否存在   
            isSpellCourseBuy:1,//1是普通，2是开团，3是拼团 是不是使用拼团价格购买  
            isNumberSpell:0,
            selectSpellListId:'',
            propsData:{}
        }
    },
    props:['selectMoneyData','xgxwChannelData','loginType','userCellphoneType','objs','periodObg','imgUrls','datalist','courseIsSpellStates','iosOrAndroid'],
    onReady: function (res) {
        //this这个参数必须传递，表示当前实例；
        this.videoContext = uni.createVideoContext('myVideo',this);
        let users = wx.getStorageSync('userInfo');
        if(users){
            this.userinfos = JSON.parse(users);
        }
        // this.getUserInfoEven();
    },
    components:{},    
    created(){
        // this.getUserInfoEven();
        this.getMobilePhoneInfo();
        this.tteacherNameList();
        this.imgPoster = this.objs.surfacePlot;
    },
    watch:{
        periodObg:{
            handler(newVal, oldVal) {
                if(newVal.firstTouch){
                    if(newVal.periodId&&newVal.periodId!=oldVal.periodId){
                        this.periodIdState=true;
                        this.openType = newVal.newPath;
                        this.periodId = newVal.periodId;
                        if((Number(newVal.isTrySee)==0&&Number(this.objs.isVip)==0)&&this.objs.isBuy==0&&this.objs.timeLimitType!=0&&this.objs.isFree==0){
                                this.lookOrPick = false;
                        }
                    }
                }else{
                    if(this.objs.courseId!=''){
                        if(this.phoneType.indexOf(this.phoneTypeInfo)!=-1){
                            this.pathChangeType = false;
                        }else{
                            this.pathChangeTypeOther = false;
                        }
                        this.periodIdState=true;
                        this.openType = newVal.newPath;
                        this.periodId = newVal.periodId;                        
                        if(!this.videoFirst){
                            this.videoFirst = true;
                            this.getCoursePath(newVal);
                        }else{
                            this.getCoursePath(newVal);
                        }
                    }
                }
            },        
            immediate:true,    
            deep:true
        },
        'videoData.statusCourseVidChoose': {
            handler(news,olds) {
                let data = this.datalist[news];
                if(data){
                    this.$emit('toVideoEven',{id:data.id,courseId:data.courseId,targetDuration:data.targetDuration,courseId:data.courseId,isTry:data.isTry,lastStudyPoint:data.lastStudyPoint});
                }             
            }
        },       
        selectMoneyData:{
            handler(newVal, oldVal) {
                console.log('newVal',newVal);
                if(!newVal.e){
                    if(newVal.type>0){
                        this.propsData = newVal;
                        this.purchaseCourse();
                    }
                }else{
                    this.propsData = newVal;
                    this.decryptPhoneNumber(newVal.e);
                }
            },        
            immediate:true,    
            deep:true
        },
        pathChangeType(newVal, oldVal){
            if(newVal){
                this.videoContext.pause();
                if(this.periodObg.targetDuration-this.periodObg.lastStudyPoint<1){
                    this.videoContext.seek(2);
                }else{
                    this.videoContext.seek(this.periodObg.lastStudyPoint);
                }                
                setTimeout(()=>{
                    this.videoContext.play();
                },1500);
            }
        },  
        loginType(news,olds){
            let users = wx.getStorageSync('userInfo');
            if(users){
                this.userinfos = JSON.parse(users);
            }
        },
        objs:{
            handler(newVal, oldVal){
                //获取可加入拼团列表
                if(newVal.isJoinAssemble){
                    this.getOpenAssembleCourseInfoEven();
                    this.getSpellCourseList(2);
                }
            },        
            immediate:true,    
            deep:true
        }, 
    },
    computed:{
        ...mapState(['audioData','timeArry','videoData','phoneType','handOperation','recordStartTime']),
    },        
    mounted(){
        //判断当前模块是否渲染完成
        setTimeout(()=>{
            this.$emit('isOkvideoOraudioType',true);
        },200);
    },
    methods: {
        ...mapActions(['setPlayCourseState','setAudioData','sethandOperation','setRecordStartTime','setStatusCourseChoose','setCourseaudioListInfoData','setLocalaudioListInfoData','setVideoDateEven','setTimeArryData']),
        //查看手机机型
        getMobilePhoneInfo(){
            var self = this;
            wx.getSystemInfo({
                success (res) {
                    self.phoneTypeInfo = res.model;
                    console.log(res.model);
                }
            })				
        },         
        //第一次进入详情
        playOrPauseIconEven(){
            var self = this;
            this.videoFirst = true;
            var indexUnm =-1;
            this.sethandOperation(true);
            if(self.videoData.catalogList){
                self.videoData.catalogList.forEach((element,index)=>{
                    if(element.periodId==self.periodId){
                        indexUnm = index;
                    }
                });
            }         
            let temp = Object.assign({},this.videoData,{playCourseVideState:true,statusCourseVidChoose:indexUnm})
            this.setVideoDateEven(temp);
            //

        },
        //是否加载一小段信息；
        videoProgress(){

        },
        //记录手动操作保存数据
        setUserHandOperationData(courseId){
            let users = wx.getStorageSync('userInfo');
            if(users){
                let userInfo = JSON.parse(users); 
                let newTime = parseInt(new Date().getTime()/1000)-Number(this.recordStartTime);
                let query = {
                    userId:userInfo.userId,
                    courseId:courseId,
                    type:5,
                    studyDuration:newTime
                }
                this.setRecordStartTime(''); 
                this.$http.post(this.$server.setsaveStudyBehavior,query,{urlType:true}).then(resInfo=>{
                    if(resInfo.data.status==200){
                        console.log("数据保存成功",query);
                    }
                });                   
            }            
        },
        //验证是否可以
        //拼接老师名字长度
        tteacherNameList(){
            let stringLists = ''
            this.objs.lectureTeacherList.forEach((element,index) => {
                if((index+1)!=this.objs.lectureTeacherList.length){
                    stringLists = stringLists+element.name+' | ';
                }else{
                    stringLists = stringLists+element.name;
                }
            });
            this.nameListArrays = stringLists;
        },       
        // //获取用户信息
        // getUserInfoEven(){
        //     let users = wx.getStorageSync('userInfo');
        //     if(users){
        //         let userInfo = JSON.parse(users); 
        //         if(userInfo.cellphone){
        //             this.unserIsLogenType = true;
        //         }else{
        //             this.unserIsLogenType = false;
        //         }                
        //     }else{
        //         this.unserIsLogenType = false;
        //     }
        // },            
        //通过绑定手机号登录
        decryptPhoneNumber: function (e) {
            var self = this;
            // this.getUserInfoEven();
            // if(!this.unserIsLogenType){
            //     uni.navigateTo({
            //         url: `/pages/auth/index?id=${this.objs.courseId}`
            //     });           
            // }else{   
                if(this.audioData.playerCreat){
                    wx.getNetworkType({
                        success (res) {                
                            //暂停，切换页面调用接口；
                            const backgroundAudioManager = wx.getBackgroundAudioManager();
                            //暂停，切换页面调用接口；
                            var realLearnRatelong = self.$store.state.timeArry;               
                            backgroundAudioManager.stop();                                 
                            let data = self.audioData;
                            if(Number(self.recordStartTime)>0){
                                self.setUserHandOperationData(data.courseId);
                            }
                            let query = {
                                periodId:data.periodId,//课时id 
                                courseId:data.courseId,
                                learnRate:realLearnRatelong[realLearnRatelong.length-1],
                                realLearnRate:realLearnRatelong.length,
                                studyPoint:realLearnRatelong.toString(),
                                lastStudyPoint:realLearnRatelong[realLearnRatelong.length-1]
                            };
                            if (res.networkType == 'wifi'){
                                query['netType'] = 2;
                            }else{
                                query['netType'] = 1;
                            } 
                            self.$http.post(self.$server.savePeriodStudyRecordsUser,query).then(resInfo=>{
                                if(resInfo.data.status==200){
                                    self.setAudioData({
                                        title:'',//标题
                                        cur:'00:00',//当前播放时间
                                        total:'20:00',//总时间
                                        surfacePlot:'',//课程封面
                                        courseId: '',//课程ID
                                        show:false,//音频播放条是否存在
                                        playFlag: false,//是否在播放中
                                        periodId: '',//课时id;
                                        playerCreat:false
                                    });
                                    self.setStatusCourseChoose(-1);
                                    self.setPlayCourseState(false);
                                    self.$store.commit('SETTimeARRYS',[])
                                    self.setCourseaudioListInfoData([]);
                                    self.setLocalaudioListInfoData([]);
                                    setTimeout(()=>{
                                        var ivObj = e.detail.iv
                                        var telObj = e.detail.encryptedData
                                        var codeObj = "";
                                        //---------登录有效期检查
                                        wx.checkSession({
                                            success: function () {
                                                //session_key 未过期，并且在本生命周期一直有效
                                                if (e.detail.errMsg == "getPhoneNumber:ok") { // 同意授权
                                                    wx.showLoading();
                                                    wx.login({
                                                        success (res) {
                                                            if (res.code) {
                                                                var objs = {
                                                                    encryptedData:telObj,
                                                                    iv:ivObj,
                                                                    code:res.code
                                                                }
                                                                self.getDecryptCellphone(objs); 
                                                            } 
                                                        }
                                                    })
                                                }else{
                                                    // 拒绝手机号授权
                                                    uni.showToast({
                                                        title: '手机号授权失败！',
                                                        icon: 'none'
                                                    });
                                                }
                                            },
                                            fail: function () {
                                            // session_key 已经失效，需要重新执行登录流程
                                            
                                            }
                                        });
                                    },200);
                                }
                            });   
                        }
                    });                          
                }else{
                    var ivObj = e.detail.iv
                    var telObj = e.detail.encryptedData
                    var codeObj = "";
                    //---------登录有效期检查
                    wx.checkSession({
                        success: function () {
                            //session_key 未过期，并且在本生命周期一直有效
                            if (e.detail.errMsg == "getPhoneNumber:ok") { // 同意授权
                                wx.showLoading();
                                wx.login({
                                    success (res) {
                                        if (res.code) {
                                            var objs = {
                                                encryptedData:telObj,
                                                iv:ivObj,
                                                code:res.code
                                            }
                                            self.getDecryptCellphone(objs); 
                                        } 
                                    }
                                })
                            }else{
                                // 拒绝手机号授权
                                uni.showToast({
                                    title: '手机号授权失败！',
                                    icon: 'none'
                                });
                            }
                        },
                        fail: function () {
                        // session_key 已经失效，需要重新执行登录流程
                        
                        }
                    });                
                }
            // }
        },       
        //获取电话号绑定用户电话
        setCellphoneEven(data){
                //调用绑定电话号码的接口；
                var self = this;
                let query = {
                    openId:this.userinfos.userId,//第三方登录的系统用户id
                    tokenType: 2,//访问端类型 1 ios_app 2 android_app 3 web_app 4第三方 5pc端
                    cellphone: data.cellphone,//手机号
                    origin: 14 //14.微信小程序
                };
                this.$http.post(this.$server.setWeChatBindCellphone,query).then(res=>{
                    if(res.data.status==200){
                        //返回的数据；
                        var objs = {
                            nickname:res.data.content.nickname||self.userinfos.nickname,
                            cellphone:res.data.content.cellphone,
                            userId:res.data.content.id,
                            isVip:self.userinfos.isVip,
                            token:self.userinfos.token,
                            avatar:res.data.content.avatar||self.userinfos.avatar,
                            openId:self.userinfos.openId
                        };
                        wx.removeStorageSync('userInfo')
                        self.userinfos = wx.getStorageSync('userInfo');
                        wx.setStorageSync('userInfo',JSON.stringify(objs));                      
                        wx.hideLoading();
                        if(self.objs.isJoinAssemble){
                            var moneySpikePrice=self.isSpellCourseBuy!=1?self.objs.assemblePrice:self.objs.sellingPrice;
                        }else{
                            var moneySpikePrice=self.objs.timeLimitType==2?self.objs.spikePrice:self.objs.sellingPrice;
                        }
                        // wx.redirectTo({
                        //     url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                        // })
                    //判断是不是7天，30天价格的设置课程
                        if(this.propsData.type==1||this.propsData.type==2){
                            wx.redirectTo({
                                url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId+"&xgxwType="+self.propsData.type
                            });
                        }else{
                            wx.redirectTo({
                                url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                            });                                            
                        }                        
                    }
                });
        },
        //获取解密接口
        getDecryptCellphone(data){
            //调用绑定电话号码的接口；
            // var openids = wx.getStorageSync('openId');
            // var code = wx.getStorageSync('code');
            let query = {
                encryptedData: data.encryptedData,
                iv: data.iv,
                code:data.code
            };
            wx.setStorageSync('code',data.code);
            this.$http.post(this.$server.getLoginWeChatUserPhone,query).then(res=>{
                if(res.data.status==200){
                    var objs = {
                        cellphone:res.data.content
                    };
                    this.setCellphoneEven(objs);
                }
            });
        },         
        //进度条前进事件
        timeupdateEven(data){
            var self= this;
                this.realTimeData = data.detail;
                var times = Math.floor(data.detail.currentTime);
                if(times!=this.studyPoint[this.studyPoint.length-1]){
                    this.studyPoint.push(times);
                } 
                    
            let temp = Object.assign({},self.videoData,{studyPoint:self.studyPoint,periodId:this.periodId})
            let endNum = Number(data.detail.duration)-Number(data.detail.currentTime);
            if(endNum<1&&Number(self.recordStartTime)>0){
                this.endedEven();
            }
            this.setVideoDateEven(temp);
        },        
        //暂停事件
        pauseEven(data){
            var self = this;    
            var objs = {
                    periodId:self.periodId,//课时id 
                    learnRate:self.studyPoint.length>0?self.studyPoint[self.studyPoint.length-1]:0,
                    studyPoint:self.studyPoint,
                    lastStudyPoint:self.studyPoint.length>0?self.studyPoint[self.studyPoint.length-1]:0                
            }     
            if(Number(self.recordStartTime)>0){
                self.setUserHandOperationData(self.periodObg.courseId); 
            }
            self.studyPoint =[];      
            this.$emit('setDataToHttp',objs);   
        },
        //播放事件
        playEven(){
            var self = this;     
                if(!self.periodIdState){
                    this.$emit('setIntervalVarEven',{'bools':false});
                }else{
                    this.$emit('setIntervalVarEven',{'bools':true});
                }
                var indexUnm =-1;
                if(self.videoData.catalogList){
                    self.videoData.catalogList.forEach((element,index)=>{
                        if(element.periodId==this.periodId){
                            indexUnm = index;
                        }
                    });
                }                  
                let temp = Object.assign({},self.videoData,{playCourseVideState:true,statusCourseVidChoose:indexUnm})
                this.setVideoDateEven(temp); 
                if(this.phoneType.indexOf(this.phoneTypeInfo)!=-1){
                    if(!this.pathChangeType){
                        this.pathChangeType = true;
                    }
                }else{
                    if(!this.pathChangeTypeOther){
                        this.pathChangeTypeOther = true;
                        if(this.periodObg.targetDuration-this.periodObg.lastStudyPoint<1){
                            this.videoContext.seek(2);
                        }else{
                            this.videoContext.seek(this.periodObg.lastStudyPoint);
                        }
                    }               
                }
                let setIntvals = parseInt(new Date().getTime()/1000);
                this.setRecordStartTime(setIntvals);                
        },
        //播放结束事件
        endedEven(){
            var self =this;
            self.playEndState = true;
            self.periodIdState = false;
            if(Number(self.recordStartTime)>0){
                self.setUserHandOperationData(self.periodObg.courseId);
            }
            var objs = {
                    periodId:self.periodId,//课时id 
                    learnRate:self.studyPoint.length>0?self.studyPoint[self.studyPoint.length-1]:0,
                    studyPoint:self.studyPoint,
                    lastStudyPoint:self.studyPoint.length>0?self.studyPoint[self.studyPoint.length-1]:0                
            }
            this.$emit('setDataToHttp',objs);
            this.studyPoint =[];     
            let temp = Object.assign({},self.videoData,{playCourseVideState:false,studyPoint:[]})
            this.setVideoDateEven(temp);               
        },
        videoErrorCallback: function (e) {
            console.log(e.target.errMsg)
        },

        getCoursePath(newVal){
            var self = this;
                let query = {
                    definitionType: 1,
                    periodId: Number(newVal.periodId),//课时id 
                    courseId: this.objs.courseId
                }
                this.timeDuration = newVal.targetDuration;
                if(Number(this.objs.isFree)==1||Number(this.objs.isVip)==1||this.objs.isBuy==1||this.objs.timeLimitType==0||newVal.isTrySee==1){
                    if(this.audioData.playerCreat){
                        wx.getNetworkType({
                            success (res) {                
                                //暂停，切换页面调用接口；
                                const backgroundAudioManager = wx.getBackgroundAudioManager();
                                //暂停，切换页面调用接口；
                                var realLearnRatelong = self.$store.state.timeArry;     
                                let data = self.audioData;
                                if(Number(self.recordStartTime)>0){
                                    self.setUserHandOperationData(data.courseId);
                                }
                                let queryOther = {
                                    periodId:data.periodId,//课时id 
                                    courseId:data.courseId,
                                    learnRate:realLearnRatelong[realLearnRatelong.length-1],
                                    realLearnRate:realLearnRatelong.length,
                                    studyPoint:realLearnRatelong.toString(),
                                    lastStudyPoint:realLearnRatelong[realLearnRatelong.length-1]
                                };
                                if (res.networkType == 'wifi'){
                                    queryOther['netType'] = 2;
                                }else{
                                    queryOther['netType'] = 1;
                                }                        
                                self.$http.post(self.$server.savePeriodStudyRecordsUser,queryOther).then(resInfo=>{
                                    self.$store.commit('SETTimeARRYS', []);
                                    if(resInfo.data.status==200){
                                        self.setAudioData({
                                            title:'',//标题
                                            cur:'00:00',//当前播放时间
                                            total:'20:00',//总时间
                                            surfacePlot:'',//课程封面
                                            courseId: '',//课程ID
                                            show:false,//音频播放条是否存在
                                            playFlag: false,//是否在播放中
                                            periodId: '',//课时id;
                                            playerCreat:false
                                        });
                                        self.setStatusCourseChoose(-1);
                                        self.setPlayCourseState(false);
                                        self.setCourseaudioListInfoData([]);
                                        self.setCourseaudioListInfoData([]);  
                                        backgroundAudioManager.stop();   
                                        if(!self.periodIdState){
                                            self.$emit('setIntervalVarEven',{'bools':false});
                                        }else{
                                            self.$emit('setIntervalVarEven',{'bools':true});
                                        }
                                        wx.getNetworkType({
                                            success (res) {                    
                                                if (res.networkType == 'wifi'){
                                                        query['netType'] = 2;
                                                    }else{
                                                        query['netType'] = 1;
                                                    }                     
                                                    self.$http.post(self.$server.getResoursePlayUrl,query,{urlType:true}).then(resInfo=>{
                                                        if(resInfo.data.status==200){
                                                            self.src = resInfo.data.content;
                                                            if(self.openType){
                                                                //控制自动播放；
                                                                self.autoplays = true;
                                                            }                                                            
                                                            if(self.handOperation){
                                                                let setIntvals = parseInt(new Date().getTime()/1000);
                                                                self.setRecordStartTime(setIntvals);
                                                                self.sethandOperation(false);
                                                            }
                                                        }
                                                    });
                                                }
                                        });                     
                                    }
                                });  
                            }
                        });                           
                    }else{
                        wx.getNetworkType({
                            success (res) {                    
                                if (res.networkType == 'wifi'){
                                        query['netType'] = 2;
                                    }else{
                                        query['netType'] = 1;
                                    }                     
                                    self.$http.post(self.$server.getResoursePlayUrl,query,{urlType:true}).then(resInfo=>{
                                        if(resInfo.data.status==200){
                                            self.src = resInfo.data.content;                                            
                                            if(self.openType){
                                                //控制自动播放；
                                                self.autoplays = true;
                                            }
                                            if(self.handOperation){
                                                let setIntvals = parseInt(new Date().getTime()/1000);
                                                self.setRecordStartTime(setIntvals);
                                                self.sethandOperation(false);
                                            }
                                        }
                                    });
                                }
                        }); 
                    }                   
                }else{
                    this.src = '';
                    uni.showToast({
                        title: '尚未购买该课时',
                        duration: 2000,
                        icon: 'none'
                    });                    
                }

        },      
        //跳转登录
        decryptLoginNumber(){
            uni.navigateTo({
                url: `/pages/auth/index?id=${this.objs.courseId}`
            });            
        },      
        purchaseCourse(){
            // this.getUserInfoEven();
            // if(!this.unserIsLogenType){
            //     uni.navigateTo({
            //         url: `/pages/auth/index?id=${this.objs.courseId}`
            //     });           
            // }else{
                const res = wx.getSystemInfoSync()
                if(res.system.includes('iOS')){
                    wx.showToast({
                        title:'由于相关规范，IOS功能暂不可用',
                        icon:'none',
                        duration:2000,
                        mask:true
                    })
                    return;
                }
                var self = this;
                if(this.audioData.playerCreat){
                    wx.getNetworkType({
                        success (res) {
                            //暂停，切换页面调用接口；
                            const backgroundAudioManager = wx.getBackgroundAudioManager();
                            //暂停，切换页面调用接口；
                            var realLearnRatelong = self.$store.state.timeArry;                
                            backgroundAudioManager.stop();                
                            let data = self.audioData;   
                            if(Number(self.recordStartTime)>0){
                                self.setUserHandOperationData(data.courseId);
                            }  
                            let query = {
                                periodId:data.periodId,//课时id 
                                courseId:data.courseId,
                                learnRate:realLearnRatelong[realLearnRatelong.length-1],
                                realLearnRate:realLearnRatelong.length,
                                studyPoint:realLearnRatelong.toString(),
                                lastStudyPoint:realLearnRatelong[realLearnRatelong.length-1]
                            };                                          
                            if (res.networkType == 'wifi'){
                                query['netType'] = 2;
                            }else{
                                query['netType'] = 1;
                            }
                            self.$http.post(self.$server.savePeriodStudyRecordsUser,query).then(resInfo=>{
                                if(resInfo.data.status==200){
                                    self.$store.commit('SETTimeARRYS',[]);
                                    self.setAudioData({
                                        title:'',//标题
                                        cur:'00:00',//当前播放时间
                                        total:'20:00',//总时间
                                        surfacePlot:'',//课程封面
                                        courseId: '',//课程ID
                                        show:false,//音频播放条是否存在
                                        playFlag: false,//是否在播放中
                                        periodId: '',//课时id;
                                        playerCreat:false
                                    });
                                    self.setStatusCourseChoose(-1);
                                    self.setPlayCourseState(false);
                                    self.setCourseaudioListInfoData([]);
                                    self.setLocalaudioListInfoData([]);
                                    if(self.objs.isJoinAssemble){
                                        var moneySpikePrice=self.isSpellCourseBuy!=1?self.objs.assemblePrice:self.objs.sellingPrice;
                                    }else{
                                        var moneySpikePrice=self.objs.timeLimitType==2?self.objs.spikePrice:self.objs.sellingPrice;
                                    }
                                    // wx.redirectTo({
                                    //     url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                                    // });
                                    //判断是不是7天，30天价格的设置课程
                                    if(this.propsData.type==1||this.propsData.type==2){
                                        wx.redirectTo({
                                            url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId+"&xgxwType="+self.propsData.type
                                        });
                                    }else{
                                        wx.redirectTo({
                                            url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                                        });                                            
                                    }                                                            
                                }
                            }); 
                        }
                    })
                }else{
                    if(self.objs.isJoinAssemble){
                        var moneySpikePrice=self.isSpellCourseBuy!=1?self.objs.assemblePrice:self.objs.sellingPrice;
                    }else{
                        var moneySpikePrice=self.objs.timeLimitType==2?self.objs.spikePrice:self.objs.sellingPrice;
                    }
                    //判断是不是7天，30天价格的设置课程
                    if(this.propsData.type==1||this.propsData.type==2){
                        wx.redirectTo({
                            url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId+"&xgxwType="+self.propsData.type
                        });
                    }else{
                        wx.redirectTo({
                            url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                        });                                            
                    }                    
                    // wx.redirectTo({
                    //     url: '../investMoney/index?id='+Number(self.objs.courseId)+"&buyType="+self.objs.buyType+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId,
                    // });                 
                }
            // }    
        },
        //点击详情页面拼团列表中的按钮事件
        spellTenlistEven(type,data){
            if(type==1){
                this.getSpellCourseList(10);
                setTimeout(()=>{
                    this.spellDilgeBoxShowOrHide=true;
                },100);
            }else{
                this.isSpellCourseBuy = type;
                this.selectSpellListId = data.id;
                if(this.iosOrAndroid=='Android'){
                    this.getVerifyUserAssembleEven(data)
                }else{
                    this.iosDegilogs();
                }
            }
        },
        iosDegilogs(){
            wx.showToast({
                title: '由于相关规范，IOS功能暂不可用！',
                icon: 'none',
                mask:false,
                duration: 1500//持续的时间
            })            
        },
        //获取拼团列表
        getSpellCourseList(Num){
            var self = this; 	
            let query = {
                currentPage:1,
                pageSize:Num,
                assembleCourseId:this.objs.assembleCourseId
            }
            self.$http.post(self.$server.getJoinAssembleCourseInfo,query,{urlType:false}).then(resInfo=>{
                if(resInfo.data.status==200){ 
                    if(Num==2){
                        this.spellTableData2 = resInfo.data.content.pageInfo.list.slice(0,2);
                    }else{
                        this.spellTableData = resInfo.data.content.pageInfo.list; 
                    }      
                }
            });				
        },
        //关闭拼团列表弹框
        spellCloseBut(){
            this.spellDilgeBoxShowOrHide=false;
        },
        //判断是不是加入了当前拼团userId  courseId
        getVerifyUserAssembleEven(data){
            let self = this; 	            
            let users = wx.getStorageSync('userInfo');
            if(users){
                let userInfo = JSON.parse(users); 
                let query = {
                    userId:userInfo.userId,
                    courseId:self.objs.courseId
                }
                self.$http.post(self.$server.getVerifyUserAssemble,query,{urlType:false}).then(resInfo=>{
                    if(resInfo.data.status==200){
                        if(resInfo.data.content.isJoin!=1){
                            this.spellCoursePayEven();
                            // this.purchaseCourse();
                        }else{
                            uni.showToast({
                                title: '已参加当前拼团',
                                icon: 'none'
                            });
                        }            
                    }
                });	
            }			            
        },
        //已绑定手机就跳转支付，没有就绑定手机然后跳转支付
        spellCoursePayEven(){
            this.purchaseCourse();
        },
        purchaseCourseAgentEven(num){
            this.isSpellCourseBuy = num;
            this.getVerifyUserAssembleEven();
        },
        getOpenAssembleCourseInfoEven(){
            let self = this; 	
            let query = {
                assembleCourseId:this.objs.assembleCourseId
            }
            self.$http.post(self.$server.getOpenAssembleCourseInfo,query,{urlType:false}).then(resInfo=>{
                if(resInfo.data.status==200){
                    self.isNumberSpell=Number(resInfo.data.content.peopleNum);
                }
            });

        },
        getPhoneNumberButEven(num){
            this.isSpellCourseBuy = num;
        },
        isNogetPhoneNumber(num,item){
            this.isSpellCourseBuy = num;
            this.selectSpellListId = item.id;
        },
        //2021.4.29  7天30天价格设置
        purchaseCourseXgxwChanne(type){
            this.$emit('chooseOrOpenCancel',{
					type:type
				});
        } 
          
    }
        
}


</script>

<style lang="scss">
.video-pluge{
    background: #fff;
    padding: 0 0 29rpx 0;  
    .video-box{
        position: relative;
        font-size: 0;
        .myVideoCss{
            width:100% !important;
            height: 420rpx;
        }
        .video-img{
            width:100% !important;
            height: 420rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            .video-img-one{
                display: block;
                width:100%;             
            }
            .video-img-two{
                position: absolute;
                z-index: 10;
                top: 0;
                left: 0;
                height: 420rpx;
                right: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .img-css{
                    width:102rpx;
                    height: 102rpx;
                }
            } 
        }        
        .video-layout{
            position: absolute;
            height: 100%;
            z-index: 10;
            top: 0;
            left: 0;
            bottom: 10rpx;
            right: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .img-css{
                width:102rpx;
                height: 102rpx;
            }
        }
    }
    .uni-btn-v{
        .textCourse{
            padding: 30rpx 30rpx;
            .userBox{
                display: flex;
                flex-direction: row;
                justify-content:space-between;
                align-items: flex-end;
                .textInfo{
                    .text-css{
                        margin-left: 10rpx;
                        font-size: 26rpx;
                    }
                    .text1{
                        margin:0;
                    }
                    .titleRow1{
                        margin-top: 20rpx;
                        font-size: 28rpx;
                        color: #666666FF;
                        max-width: 500rpx;
                        overflow:hidden; //超出一行文字自动隐藏
                        text-overflow:ellipsis;//文字隐藏后添加省略号
                        white-space:nowrap;                             
                    }
                    .titleRow2{
                        margin-top: 20rpx;
                        font-size: 0;
                        color: #999999FF;
                    }                    
                }
                .moneyCourse{
                    // width: 270rpx;
                    height: 66rpx;
                    .moneyBut{
                        border-radius: 66rpx;
                        color: #fff;
                        background:linear-gradient(0deg,rgba(195,13,35,1) 0%,rgba(236,53,75,1) 100%);                       
                        padding: 0 20rpx;
                        height: 66rpx;
                        line-height: 66rpx;
                        text-align: center;
                        font-size: 27rpx;
                    }
                }
            }
            .courseTitle{
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp:2;
                -webkit-box-orient: vertical;              
                font-size: 32rpx;
                font-weight: 700;
            }
        }
    }


    .spellPluge{
        padding: 1rpx 30rpx 10rpx;
        background: #fff;
        margin-top: 20rpx;   
        .spellPlugeName{
            font-size:30rpx;
            font-weight:800;
            position: relative;
            margin: 40rpx 0;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
            .views{
                height: 40rpx;
                line-height: 40rpx;
                padding: 0 30rpx;
                font-size: 36rpx;
                color: #333;
                font-weight: 500;            
            }
            .more{
                display: block;
                width: 32rpx;
                height: 32rpx;
            }
        }
        .spellPlugeName:before{
                content:'';
                height: 40rpx;
                width: 8rpx;
                bottom: 0;
                left: 10rpx;                
                display: block;   
                position: absolute;
                background: #C30D23;
        }
        .spelltags{
            .spellList:nth-child(2){
                border-top: 2rpx solid #f4f4f4;
            }
            .spellList{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .spellLefts{
                    display: flex;
                    flex-direction: row;
                    justify-content:flex-start;
                    align-items: center;
                    padding: 40rpx 0;
                    .userBox{
                        position: relative;
                        height: 80rpx;
                        .users{
                            position: absolute;
                            width: 80rpx;
                            height: 80rpx;
                            border-radius: 50%;
                            display: block;
                        }
                    }
                    .userNum{
                        padding:0 10rpx;
                        color: #333333;
                        font-family: 'PingFangSC-Light';
                    }
                }
                .spellRights{
                    width: 120rpx;
                    height: 40rpx;
                    text-align: center;
                    line-height: 40rpx;
                    font-size: 22rpx;
                    background: #C30D23;
                    border-radius: 40rpx;
                    color: #fff;
                }
                .moneyBut{
                    width: 120rpx;
                    height: 40rpx;
                    text-align: center;
                    line-height: 40rpx;
                    font-size: 22rpx;
                    background: #C30D23;
                    border-radius: 40rpx;
                    color: #fff;     
                    padding: 0;   
                    margin: 0;                              
                }
            }
        }                
    }         
	.spellDilgeBox{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 99999;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.6);     
		.spellListBox{
			width: 550rpx;
			max-height:780rpx;
			border-radius: 20rpx;
			position: absolute;
			top:50%;
			left: 50%;
			background: #fff;
            padding: 30rpx;   
			transform: translate(-50%,-50%); 
            .spellCloseCss{
                width: 48rpx;
                height: 48rpx;
                position: absolute;
                top: -70rpx;
                right: 0;
                .img-css{
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }              
			.spellList{
                position: relative; 
                max-height:780rpx; 
                overflow-y: auto;                  
                .spellListTwo:not(:nth-last-child(1)){
                    border-bottom: 2rpx solid #f4f4f4;
                }                
                .spellListTwo{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    .spellLefts{
                        display: flex;
                        flex-direction: row;
                        justify-content:flex-start;
                        align-items: center;
                        padding: 40rpx 0;
                        .userBox{
                            position: relative;
                            height: 80rpx;
                            .users{
                                position: absolute;
                                width: 80rpx;
                                height: 80rpx;
                                border-radius: 50%;
                                display: block;
                            }
                        }
                        .userNum{
                            padding:0 10rpx;
                            color: #333333;
                            font-family: 'PingFangSC-Light';
                        }
                    }
                    .spellRights{
                        width: 120rpx;
                        height: 40rpx;
                        text-align: center;
                        line-height: 40rpx;
                        font-size: 22rpx;
                        background: #C30D23;
                        border-radius: 40rpx;
                        color: #fff;
                    }
                    .moneyBut{
                        width: 120rpx;
                        height: 40rpx;
                        text-align: center;
                        line-height: 40rpx;
                        font-size: 22rpx;
                        background: #C30D23;
                        border-radius: 40rpx;
                        color: #fff;     
                        padding: 0;   
                        margin: 0;                              
                    }                    
                }
			}					
		}   
	}     
    .moneySpellBoxAndroid{
        position: fixed;
        bottom: 40rpx;
        left: 0;
        right: 0;
        height: 98rpx;
        z-index: 999;
        .isOkmoneyThree{
            margin-left: 50rpx;
            width: 650rpx;
            height: 100%;
            line-height: 98rpx;
            font-family: 'PingFangSC-Medium';
            font-size: 30rpx;
            color: #fff;
            text-align: center;
            border-radius: 98rpx;
            background: url('../../static/courseDetail/iSIosTypeIcon.png') no-repeat 50% 50% / cover;
        }
    }
    .moneySpellBox{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 98rpx;
        z-index: 999;
        .isOkmoneyOne,.isOkmoneyTwo{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }
        .isOkmoneyOne{
            .leftsOne{
                width: 50%;
                height: 100%;
                .lefts{
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content:center;
                    align-items: center;
                    margin: 0;
                    padding: 0;
                    background: #FACC22;
                    border-radius: 0;
                    .views{
                        color: #fff;
                    }
                    .views:nth-child(1){
                        font-size: 28rpx;
                        line-height: 40rpx;
                        font-weight: 500;
                        font-family: 'PingFangSC-Medium';
                    }
                    .views:nth-child(2){
                        font-size: 18rpx;
                        line-height: 18rpx;
                        margin: 0;
                        padding: 0;
                    }
                }
                .rights{
                    width: 100%;
                    height: 100%;
                    background: #C30D23;
                    text-align: center;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    justify-content:center;
                    align-items: center;
                    margin: 0;
                    padding: 0;
                    border-radius: 0;
                    .views{
                        color: #fff;
                    }
                    .views:nth-child(1){
                        font-size: 28rpx;
                        line-height: 40rpx;
                        font-weight: 500;
                        font-family: 'PingFangSC-Medium';
                    }
                    .views:nth-child(2){
                        font-size: 18rpx;
                        line-height: 18rpx;
                        margin: 0;
                        padding: 0;
                    }
                }
            }
        }
        .isOkmoneyTwo{
            .lefts{
                width: 50%;
                height: 100%;
                background: #FACC22;
                text-align: center;
                color: #fff;
                display: flex;
                flex-direction: column;
                justify-content:center;
                align-items: center;
                .views:nth-child(1){
                    font-size: 28rpx;
                    line-height: 40rpx;
                    font-weight: 500;
                    font-family: 'PingFangSC-Medium';
                }
                .views:nth-child(2){
                    font-size: 21rpx;
                    line-height: 18rpx;
                    margin: 0;
                    padding: 0;
                }
            }
            .rights{
                width: 50%;
                height: 100%;
                background: #C30D23;
                text-align: center;
                color: #fff;
                display: flex;
                flex-direction: column;
                justify-content:center;
                align-items: center;
                .views:nth-child(1){
                    font-size: 28rpx;
                    line-height: 40rpx;
                    font-weight: 500;
                    font-family: 'PingFangSC-Medium';
                }
                .views:nth-child(2){
                    font-size: 21rpx;
                    line-height: 18rpx;
                    margin: 0;
                    padding: 0;
                }
            }            
        }
    }    
}
</style>
<style>
</style>