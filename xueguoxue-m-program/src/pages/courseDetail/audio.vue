<template>
    <view class="audio-pluge">    
        <view class="audio-box">
            <view class="copy_audio">
                <image class="imgs-css" webp lazy-load :src="objs.surfacePlot" @touchmove='touchmoveEven($event,1)' @touchstart="touchstartEven($event,1)" @touchend='touchendEven($event,1)'/>
                <view class="audio-layout" v-if="(Number(periodObg.isTrySee)==0&&Number(objs.isVip)==0)&&objs.isBuy==0&&objs.timeLimitType==1&&objs.isFree==0&&objs.isTrySee==0">
                    <image class='img-css' :src="player_lock" />    
                </view>   
                <view class="londing_xcx" v-if="londUrlBool">
                    <view class="contentinfo">
                        加载中...
                    </view>
                </view>
                <view class="audio-layout" v-if="(Number(periodObg.isTrySee)==1||Number(objs.isVip)==1||objs.isBuy==1||objs.timeLimitType==0||objs.isTrySee==1)&&showHideTypeOne&&periodObg.targetDuration!=0&&!playerIsNo&&!londUrlBool">
                    <image class='img-css' :src="pauseImg" @click="playOrPauseIconEven" v-if="playFlag"/>
                    <image class='img-css' :src="player_btn" @click="playOrPauseIconEven" v-else/>                     
                </view>                 
            </view>
            <view v-show="getDurations&&!londUrlBool" class="progressBox" @touchmove='touchmoveEven($event,2)' @touchstart="touchstartEven($event,2)" @touchend='touchendEven($event,2)'>
                <view class="progressBox2">
                    <v-progress :duration="timeDuration" :currentTime='changeDuration' @onDragEven='onDragEven' @setDataToHttp='setDataToHttp'/>
                </view>
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
                            <text class="text-css">{{objs.actualPeriodNum||0}}节</text>
                            <text class="text-css">|</text>
                            <text class="text-css">共{{objs.planPeriodNum||0}}节</text>
                            <text class="text-css">{{objs.courseBrowsCount?objs.courseBrowsCount+1>100000?'10w+':objs.courseBrowsCount+1:0}}人学习</text>   
                        </view>
                    </view>
                    <view class="moneyCourse" v-if="userCellphoneType&&!objs.isJoinAssemble&&iosOrAndroid=='Android'">
                        <view v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0" style="text-decoration:line-through;font-size:26rpx;text-align: center;color:#779DD3;">原价({{objs.originalPrice}})币</view>
                        <view class="moneyBut" @click="purchaseCourse" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&objs.timeLimitType==2">
                            <!-- 购买({{objs.timeLimitType==2?objs.spikePrice:objs.sellingPrice}}g币) -->
                            购买({{objs.spikePrice}}币)
                        </view>
                        <view class="moneyBut"  @click="purchaseCourseXgxwChanne(false)" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&xgxwChannelData.xgxwChannel&&objs.timeLimitType!=2">
                            {{'价格低至('+xgxwChannelData.minVal+')币'}}
                        </view>
                        <view class="moneyBut" @click="purchaseCourse" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&objs.timeLimitType!=2&&!xgxwChannelData.xgxwChannel">
                            <!-- <span v-if="objs.timeLimitType==2">
                                购买({{objs.spikePrice}}币)
                            </span>
                            <span v-else-if="xgxwChannelData.xgxwChannel&&objs.timeLimitType!=2">
                                {{'价格低至('+xgxwChannelData.minVal+')币'}}
                            </span>
                            <span v-else>
                                购买({{objs.sellingPrice}}f币)
                            </span> -->
                            购买({{objs.sellingPrice}}币)                          
                        </view>
                    </view>       
                    <view class="moneyCourse" v-if="!userCellphoneType&&!objs.isJoinAssemble&&iosOrAndroid=='Android'">
                        <view v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0" style="text-decoration:line-through;font-size:26rpx;text-align: center;color:#779DD3;">原价({{objs.originalPrice}})币</view>
                        <button class="moneyBut" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&loginType&&objs.timeLimitType==2" >
                            购买({{objs.spikePrice}}币)
                        </button>
                        <button class="moneyBut" @click="purchaseCourseXgxwChanne(true)" v-else-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&loginType&&xgxwChannelData.xgxwChannel&&objs.timeLimitType!=2" >
                            {{'价格低至('+xgxwChannelData.minVal+')币'}}
                        </button> 
                        <button class="moneyBut" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&loginType&&objs.timeLimitType!=2&&!xgxwChannelData.xgxwChannel">
                            购买({{objs.sellingPrice}}币)
                        </button>                        
                        <button class="moneyBut" @click="decryptLoginNumber" v-if="Number(objs.isFree)!=1&&Number(objs.isVip)!=1&&objs.isBuy!=1&&objs.timeLimitType!=0&&!loginType" >
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
        <view class="spellDilgeBox" v-if="spellDilgeBoxShowOrHide">
            <view class="spellListBox">
                <view class="spellCloseCss">
                    <image class='spellCloseCss' :src='spellClose' @click="spellCloseBut"/>
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
                <!-- <view class="isOkmoneyOne" v-if="!unserIsLogenType?true:false"> -->
                <view class="isOkmoneyOne" v-if="!userCellphoneType?true:false">
                    <view class="leftsOne" @click="getPhoneNumberButEven(1)">
                        <button class="lefts" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if='loginType'>
                            <view class='views'>原价:{{objs.sellingPrice}}币</view>
                            <view class='views'>单独购买</view>
                        </button>
                        <button class="lefts" @click="decryptLoginNumber" v-else>
                            <view class='views'>原价:{{objs.sellingPrice}}币</view>
                            <view class='views'>单独购买</view>
                        </button>                        
                    </view>
                    <view class="leftsOne" @click="getPhoneNumberButEven(2)">
                        <button class="rights" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" v-if='loginType'>
                            <view class='views'>拼团价:{{objs.assemblePrice}}币</view>
                            <view class='views'>发起拼团</view>
                        </button>   
                        <button class="rights" @click="decryptLoginNumber" v-else>
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
        <view v-if="!objs.isBuy&&objs.isVip!=1&&iosOrAndroid=='IOS'" class="moneySpellBoxAndroid">
            <view class="isOkmoneyThree">由于相关规范，iOS功能暂不可用</view>
        </view>                           
    </view>
</template>

<script> 
import player_lock from '../../static/courseDetail/player_lock.png' 
// import home_audio from '../../static/courseDetail/audio.jpg'
import pauseImg from '../../static/courseDetail/pause.png' 
import player_btn from '../../static/courseDetail/player_btn.png'
import rightIcon from '../../static/investMoney/icon-1.png';
import spellClose from '../../static/courseDetail/close.png'
import c_progress from './cProgress.vue';//视频播器组件
import {mapState,mapActions} from 'vuex'
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)
  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}
export default {

    data() {
        return {
            player_lock:player_lock,//锁
            home_audio:'',
            pauseImg:pauseImg,//播放icon
            player_btn:player_btn,//暂停icon
            title: 'audio',
            audioContext:'',
            src:'',
            autoplays:false,
            openType:false,//是否开启自动播放属性
            progressType:true,//进度条手动拖动还是自动前进的状态判断，自动前进为true，手动拖动为false
            studyPoint:[],//学习时间点 1,2,3...
            saveObjs:{
                lastStudyPoint:0,//暂停，退出，播放结束的进度条所在位置的时间；
                studyPoint:[],
                learnRate:0,//学习时长
                periodId:''
            },
            firstAutoplays:false,//刚进入详情页是否处于播放状态
            endAudioTime:0,//视频播放结束时的时间值
            realTimeData:'',//进度条最新实时数据
            lockNum:0,//表示当前进度的对比时间值
            periodId:'',
            timeupdatBool:false,//是否执行了滚动条变化事件
            getDurations:false,//第一播放，进度条显示隐藏；
            timeDuration:0,//总时长
            changeDuration:0,//播放状态的时候的时间；
            showHideTypeOne:true,  //遮罩可播放播放状态的隐藏变量（根据定时器改变，只有在播放切遮罩出现的时候才会触发）
            playOrPauseIcon:false,//播放和暂停的Icon的切换
            playOrPauseType:false,//当前播放器是播放还是暂停状态
            onDragType:false,//滚动条拖拽过成中的状态
            maskType:0,//表示当前手指触摸的是哪一层；
            playerIsNo:false,//表示课程节是否可以观看；
            touchVar:false,//当前手指是处于按下还是抬起状态
            // unserIsLogenType:true,//判断当前用户是否绑定手机号
            playFlag:false,
            player:'',
            userinfos:'',
            loading:false,
            londUrlBool:false,
            londUrlBoolTow:false,
            nameListArrays:'',
            timeDurationIsover:-1,
            courseEveryTime:0,
            backgrCurrentTime:0,
            isOkPlay:false,
            phoneTypeInfo:'',
            courseIds:'',
            isNewPageType:true,
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
    props:['selectMoneyData','xgxwChannelData','loginType','userCellphoneType','objs','periodObg','imgUrls','changeDurationNew','versionType','datalist','courseIsSpellStates','iosOrAndroid'],
    components:{
        'v-progress':c_progress
    },
    onReady: function (res) {
        //this这个参数必须传递，表示当前实例；
        this.audioContext = uni.createVideoContext('myAudio',this);
        let users = wx.getStorageSync('userInfo');
        if(users){
            this.userinfos = JSON.parse(users);
        }
    },
    created(){
        this.getMobilePhoneInfo();
    },
    computed:{
        ...mapState(['audioData','courseaudioListInfo','audioOrVideo','timeArry','localaudioListInfo','videoData','statusCourseChoose','phoneType','recordStartTime','handOperation','handOperationIsEnd'])
    },
    watch:{
        changeDurationNew(newVal, oldVal){
            if(newVal!=oldVal){
                if(newVal>1){
                    this.londUrlBool = false;
                    if(!this.londUrlBoolTow){
                        setTimeout(()=>{
                            this.londUrlBoolTow = true;
                        },2000);
                    }
                }
                this.changeDuration=Number(newVal);
            }
        },
        statusCourseChoose(news,olds){
            if(news!=-1&&news!=olds){
                let data = this.datalist[news];
                this.$emit('toVideoEven',{id:data.id,courseId:data.courseId,targetDuration:data.targetDuration,courseId:data.courseId,isTry:data.isTry,lastStudyPoint:data.lastStudyPoint});
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
        periodObg:{
            handler(newVal, oldVal) {
                if(newVal.firstTouch){
                    if(newVal.periodId&&newVal.periodId!=oldVal.periodId){
                        this.openType = newVal.newPath;
                        this.periodId = newVal.periodId;
                        this.courseIds = newVal.courseId;
                        this.timeDuration = Number(newVal.targetDuration);
                    }
                }else{
                    this.openType = newVal.newPath;
                    this.periodId = newVal.periodId;
                    if(this.objs.courseId!=''){
                        if(this.versionType){
                            if(!this.audioData.playerCreat){
                                let temp = Object.assign({},this.videoData,{studyPoint:[]});                                  
                                this.setVideoDateEven(temp);            
                                this.getCoursePath(newVal.periodId,newVal);
                            }else{      
                                if(newVal.newPath){
                                    this.londUrlBool=true; 
                                    this.londUrlBoolTow = false;
                                }else{
                                    this.londUrlBool=false; 
                                }                                    
                                if(this.player==''){
                                    this.player = wx.getBackgroundAudioManager();
                                }                                  
                                let temp = Object.assign({},this.videoData,{studyPoint:[]})
                                this.setVideoDateEven(temp);               
                                this.changeDuration = 1;       
                                var subsectionCourse = {
                                    periodId:newVal.periodId,
                                    targetDuration:newVal.targetDuration,
                                    newPath:newVal.newPath,
                                    isTrySee:newVal.isTrySee,
                                    courseId:newVal.courseId,
                                    lastStudyPoint:newVal.lastStudyPoint
                                };                                        
                                this.getAuthCoursePath(this.player,subsectionCourse);
                            }
                        }
                    }
                }
            },        
            immediate:true,    
            deep:true
        },
        playOrPauseIcon(cur,old){
            if(cur!=old){
                if(cur){
                    setTimeout(()=>{
                        this.showHideTypeOne = false;
                    },2000);
                }else{
                    this.showHideTypeOne = true;
                }
            }
        },  
        loginType(news,olds){
            let users = wx.getStorageSync('userInfo');
            if(users){
                this.userinfos = JSON.parse(users);
            }
        },
        objs:{
            handler(cur, old){
            if(JSON.stringify(cur)!=JSON.stringify(old)){
                this.tteacherNameList();
            }
            //获取可加入拼团列表
            if(cur.isJoinAssemble){
                this.getOpenAssembleCourseInfoEven();
                this.getSpellCourseList(2);
            }            
            if(Number(cur.courseId)==Number(this.audioData.courseId)){
                if(this.audioData.playFlag){
                    this.playOrPauseIcon = true;
                    this.playFlag = true;
                    this.getDurations = true;
                    // cons 
                }else{
                    this.playOrPauseIcon = false;
                    this.playFlag = false;
                    this.getDurations = false; 
                }    
            }else{
                this.playOrPauseIcon = false;
                this.playFlag = false;
                this.getDurations = false;                
            }
            },        
            immediate:true,    
            deep:true
        }
    },     
    mounted(){
        //判断当前模块是否渲染完成
        setTimeout(()=>{
            this.$emit('isOkvideoOraudioType',true);
        },200);
    },    
    methods: {
        ...mapActions(['setPlayCourseState','setAudioData','setStatusCourseChoose','setCourseaudioListInfoData','setTimeArryData','setLessonListNums','setLocalaudioListInfoData','setVideoDateEven','setRecordStartTime','sethandOperation','sethandOperationIsEnd']),
        //查看手机机型
        getMobilePhoneInfo(){
            var self = this;
            wx.getSystemInfo({
                success (res) {
                    self.phoneTypeInfo = res.model;
                }
            })				
        },             
        //跳转登录
        decryptLoginNumber(){
            uni.navigateTo({
                url: `/pages/auth/index?id=${this.objs.courseId}`
            });            
        }, 
        tteacherNameList(){
                let stringLists = '';
                if(this.objs.lectureTeacherList){
                    this.objs.lectureTeacherList.forEach((element,index) => {
                        if((index+1)!=this.objs.lectureTeacherList.length){
                            stringLists = stringLists+element.name+' | ';
                        }else{
                            stringLists = stringLists+element.name;
                        }
                    });
                    this.nameListArrays = stringLists;
                }
        },        
        //创建音频播放器
        creatBackAudioObject(src,lastTimes){
            var self =this;
            const version = wx.getSystemInfoSync().SDKVersion;
            if (compareVersion(version, '1.9.94') >= 0){
                        console.log('从新创建新的');
                        const backgroundAudioManager = wx.getBackgroundAudioManager()
                        backgroundAudioManager.title = this.objs.title
                        backgroundAudioManager.epname = ''
                        backgroundAudioManager.singer = this.objs.lectureTeacherList[0].name
                        backgroundAudioManager.src = src;
                        if(this.phoneType.indexOf(this.phoneTypeInfo)!=-1){
                            setTimeout(()=>{
                                backgroundAudioManager.pause();
                                backgroundAudioManager.seek(lastTimes+2);
                                backgroundAudioManager.play();
                            },1000);
                        }
                        backgroundAudioManager.startTime=lastTimes;
                        backgroundAudioManager.protocol = 'hls';
                        backgroundAudioManager.playbackRate= 1;                      
                        backgroundAudioManager.onCanplay(()=>{
                            console.log("可以播放了");
                            this.londUrlBool = false;
                            this.playFlag=true;
                        });  
                        backgroundAudioManager.onTimeUpdate(()=>{
                            this.backgrCurrentTime = backgroundAudioManager.currentTime;
                        })                           
                        //监听背景音乐播放；
                        backgroundAudioManager.onPlay(()=>{
                            console.log('我播放了');      
                            var realLearnRatelong = self.$store.state.timeArry;
                            if(realLearnRatelong.length>0){
                                self.$store.commit('SETTimeARRYS',[]);
                            }                                                   
                            setTimeout(()=>{
                                if(this.courseEveryTime==0){
                                    this.courseEveryTime = backgroundAudioManager.duration;
                                } 
                            },4000);
                            //播放的时候进行进度条事件通知;
                            this.playOrPauseType = true;
                            this.playOrPauseIcon = true;
                            this.timeDurationIsover = -1;
                            this.playFlag=true;
                            this.$emit('progressEmit',{type:false,objs:backgroundAudioManager});                           
                            //第一次创建的时候就保存状态
                            if(!this.isOkPlay){
                                this.isOkPlay = true;
                                let audioDataLet = this.$store.state.audioData;
                                let copyAudioDataLet = this.$store.state.copyAudioData;
                                let temp ={}; 
                                let tempTwo = {};
                                if(this.isNewPageType){
                                    temp = Object.assign({},audioDataLet,{
                                        title:this.objs.title,
                                        surfacePlot:this.objs.surfacePlot,
                                        total:this.$formatSeconds(this.timeDuration),
                                        courseId:this.objs.courseId,
                                        playerCreat:true,
                                        playFlag:true,
                                        periodId:self.periodId,
                                        show:false
                                    });
                                    tempTwo = Object.assign({},copyAudioDataLet,{
                                        title:this.objs.title,
                                        surfacePlot:this.objs.surfacePlot,
                                        total:this.$formatSeconds(this.timeDuration),
                                        courseId:this.objs.courseId,
                                        show:false
                                    });
                                    this.$store.commit('SETCOPYAUDIODATA',tempTwo);
                                }else{
                                    temp = Object.assign({},audioDataLet,{
                                        title:copyAudioDataLet.title,
                                        surfacePlot:copyAudioDataLet.surfacePlot,
                                        total:this.$formatSeconds(this.timeDuration),
                                        courseId:copyAudioDataLet.courseId,
                                        playerCreat:true,
                                        playFlag:true,
                                        periodId:self.periodId,
                                        show:true
                                    });
                                    tempTwo = Object.assign({},copyAudioDataLet,{
                                        show:true
                                    });    
                                    this.$store.commit('SETCOPYAUDIODATA',tempTwo);                                
                                }
                                this.$store.commit('SETAUDIODATA',temp)
                            }  
                            this.setPlayCourseState(true);       
                            if(this.$store.state.handOperation){
                                let setIntvals = parseInt(new Date().getTime()/1000);
                                this.$store.commit('SETRECORDSTARTTIME',setIntvals);
                                this.$store.commit('SETHANDOPERATION',false);
                            }    
                        });                 
                        //监听背景音乐暂停
                        backgroundAudioManager.onPause(()=>{
                            console.log('我暂停了');
                            var audioDataLet = this.$store.state.audioData;
                            var pageStores = this.$store.state.audioOrVideo;
                            this.playOrPauseType = false;
                            this.playOrPauseIcon = true; 
                            this.playFlag = false;
                            let temp = Object.assign({},audioDataLet,{playFlag:false});
                            this.$store.commit('SETAUDIODATA',temp);
                            this.setPlayCourseState(false); 
                            self.$emit('progressEmit',{type:true,objs:backgroundAudioManager});
                            if((pageStores=='video'||pageStores=='other')||(pageStores=='audio'&&audioDataLet.courseId!=this.courseIds)){
                                console.log("没进来了");
                            }else{
                                console.log("进来了"); 
                                this.getListValToTimeEven(audioDataLet);
                            } 
                            if(this.$store.state.handOperationIsEnd){
                                if(Number(this.$store.state.recordStartTime)>0){
                                    self.setUserHandOperationData(self.objs.courseId);
                                    // self.sethandOperationIsEnd(false);
                                    this.$store.commit('SETHANDOPERATIONISEND',false);
                                } 
                            }
                        });
                        backgroundAudioManager.onEnded(()=>{
                            console.log("播放结束")      
                            this.isOkPlay = false;                  
                            if(this.timeDurationIsover==-1){
                                this.timeDurationIsover = this.periodId;
                               //自动下一首播放
                                if(!this.getDurations){
                                    this.getDurations = true;
                                }                               
                                this.changeIndexForEnen(false);
                            } 
                            if(this.$store.state.handOperationIsEnd){                              
                                if(Number(this.$store.state.recordStartTime)>0){
                                    self.setUserHandOperationData(self.objs.courseId);
                                    // self.sethandOperationIsEnd(false);
                                    this.$store.commit('SETHANDOPERATIONISEND',false);
                                } 
                            }
                        });             
                        //监听背景音频停止事件
                        backgroundAudioManager.onStop(()=>{
                            console.log('我停止了');                            
                            this.playFlag = false;
                            this.isOkPlay = false;
                            this.playOrPauseType = false;   
                            this.playOrPauseIcon = true; 
                            var audioDataLet = this.$store.state.audioData;    
                            var timeArryLet = this.$store.state.timeArry;                   
                            self.$emit('progressEmit',{type:true,objs:backgroundAudioManager});
                            if(Number(audioDataLet.courseId)>0&&timeArryLet.length>0){
                                console.log('从这里进入的？');
                                this.getListValToTimeEven(audioDataLet);
                                this.tabRemoveLocalInfo();
                            }
                            if(this.timeDurationIsover!=this.periodId&&this.courseEveryTime>=this.timeDuration&&(this.courseEveryTime-this.backgrCurrentTime<1)){
                                this.timeDurationIsover = this.periodId;
                                this.courseEveryTime=0;
                                //自动下一首播放
                                if(!this.getDurations){
                                    this.getDurations = true;
                                }                                
                                this.changeIndexForEnen(false);
                            }  
                            if(this.$store.state.handOperationIsEnd){
                                if(Number(this.$store.state.recordStartTime)>0){
                                    self.setUserHandOperationData(self.objs.courseId);
                                    // self.sethandOperationIsEnd(false);
                                    this.$store.commit('SETHANDOPERATIONISEND',false);
                                } 
                            }                                                    
                        });                    
                        this.player = backgroundAudioManager
            }
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
        //浮动按钮删除
        tabRemoveLocalInfo(){                                                   
                   var temp = {
                        title:'',//标题
                        cur:'00:00',//当前播放时间
                        total:'20:00',//总时间
                        surfacePlot:'',//课程封面
                        courseId: '',//课程ID
                        show:false,//音频播放条是否存在
                        playFlag: false,//是否在播放中
                        periodId: '',//课时id;
                        playerCreat:false
                    };
                    console.log("同手音频删除");
                    this.$store.commit('SETAUDIODATA',temp)                    
                    this.$store.commit('SETTimeARRYS',[])         
        },
        getListValToTimeEven(data){
			//暂停，切换页面调用接口；
                var self = this;
                    wx.getNetworkType({
                        success (res) {                
                        var realLearnRatelong = self.$store.state.timeArry;
                        let query = {
                            periodId:data.periodId,//课时id 
                            courseId:data.courseId,
                            learnRate:self.changeDuration,
                            realLearnRate:realLearnRatelong.length,
                            studyPoint:realLearnRatelong.toString(),
                            lastStudyPoint:self.changeDuration
                        };
                        if (res.networkType == 'wifi'){
                            query['netType'] = 2;
                        }else{
                            query['netType'] = 1;
                        }                        
                        self.$http.post(self.$server.savePeriodStudyRecordsUser,query).then(res=>{
                            if(res.data.status==200){
                                console.log('成功了删除');
                                self.$store.commit('SETTimeARRYS', [])
                            }
                        });
                    }
                });                          
        },        
        //拖拽过程中触发事件
        onDragEven(data){
            if(data.type){
                if(!this.onDragType){
                    this.onDragType = true;
                }
            }else{
                setTimeout(()=>{
                    this.onDragType = false;
                },300);
            }
        },
        //滚动条拖动定位播放
        setDataToHttp(data){
            if(!this.versionType){
                // this.touchSeekEven(data.timeInfo);
                // this.play();
            }else{ 
                this.$emit('lockNumEmit',{lockNum:0});
                this.player = wx.getBackgroundAudioManager();
                this.player.seek(Number(data.timeInfo));
                this.playFlag = true;
                let temp = Object.assign({},this.audioData,{playFlag:this.playFlag})
                this.setAudioData(temp);                           
            }
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
                this.$store.commit('SETRECORDSTARTTIME','')
                this.$http.post(this.$server.setsaveStudyBehavior,query,{urlType:true}).then(resInfo=>{
                    if(resInfo.data.status==200){
                        console.log("数据保存成功",query);
                    }
                });
            }              
        },        
        //自动下一首播放
        //全屏 
        requestFullScreen(){
             this.audioContext.requestFullScreen();
        },
        //退出全屏
        exitFullScreen(){
             this.audioContext.exitFullScreen();
        },    
        //点击按钮是否播放
        //type:1停止;2播放;
        playOrPauseIconEven(type,bools){
                var self = this;
                if(this.playFlag){
                    this.sethandOperationIsEnd(true);
                    this.$store.commit('SETHANDOPERATIONISEND',true)                    
                }if(!this.playFlag){
                    this.sethandOperation(true);
                    this.$store.commit('SETHANDOPERATION',true)
                }
                var audioDataLet = this.$store.state.audioData;
                if(!audioDataLet.show){
                    //点击播放当全局唯一音频对象不存在时，走创建流程
                    if(!audioDataLet.playerCreat){                    
                        //打开进度条和播放按钮
                        if(!this.getDurations){
                            this.getDurations = true;
                            this.changeIndexForEnen(true);
                        }else{
                            this.getCoursePath(this.periodObg.periodId,this.periodObg);
                        } 
                        
                    }else{
                        //当前全局音频对象存在时，将音频对象赋值
                        this.player = wx.getBackgroundAudioManager();
                        //再根据状态控制播放场景1.正在播放,就暂停
                        if(this.objs.courseId==audioDataLet.courseId){
                            if(this.playFlag){
                                this.playFlag = false;
                                this.playOrPauseIcon = false;
                                this.player.pause();
                            }else{
                                this.player.play();
                                this.playFlag = true;   
                                this.playOrPauseIcon = true;    
                            }
                        }
                        let temp = Object.assign({},audioDataLet,{playFlag:this.playFlag})
                        this.setAudioData(temp)                        
                    }
                }else{
                    wx.getNetworkType({
                        success (res) {                     
                            if(!self.player){
                                self.player = wx.getBackgroundAudioManager();
                            }
                            //暂停，切换页面调用接口；
                            var realLearnRatelong = self.$store.state.timeArry;          
                            var data = audioDataLet;
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
                            self.$http.post(self.$server.savePeriodStudyRecordsUser,query).then(res=>{
                                if(res.data.status==200){ 
                                    self.$store.commit('SETCOURSEAUDIOLISTINFO',self.$store.state.localaudioListInfo);
                                    self.$store.commit('SETLOCALAUDIOLISTINFO',[]);
                                    self.$store.commit('SETTimeARRYS',[]);
                                    if(audioDataLet.courseId!=self.courseIds){
                                        self.setStatusCourseChoose(-1);
                                        setTimeout(()=>{
                                            if(!self.getDurations){
                                                self.getDurations = true;
                                            }
                                            self.changeIndexForEnen(true);
                                        },1000);
                                    }
                                }
                            });
                    }
                }); 
            }
        },  

        //拖动播放
        // touchSeekEven(unms){
        //     this.audioContext.seek(Number(unms));
        // },
        //手指按下事件
        touchstartEven(data,type){
            if(type==2){
                this.touchVar = true;
            }
        },
        touchmoveEven(data,type){
        },
        //手指抬起事件
        touchendEven(data,type){
            var self = this
            this.touchVar = false;
            this.maskType = type; 
            if(type==1){
                if(this.playOrPauseType&&!this.onDragType){
                    this.showHideTypeOne = true;
                    setTimeout(()=>{
                        if(self.playOrPauseType){
                            this.showHideTypeOne = false;
                        }
                    },2000);
                }
                if(!this.playOrPauseType){
                    this.showHideTypeOne = true;
                }                
            }
        },
        audioErrorCallback: function (e) {
            console.log(e.target.errMsg)
        },
        //新版本音频使用;        
        getAuthCoursePath(player,subsectionCourse){
                var self = this;        
                let query = {
                    definitionType: 0,
                    periodId: Number(subsectionCourse.periodId),//课时id 
                    courseId: subsectionCourse.courseId
                }
                this.periodId = Number(subsectionCourse.periodId);
                if(subsectionCourse.isTrySee==1||self.objs.isVip==1||self.objs.isBuy==1||self.objs.timeLimitType==0||self.objs.isFree==1){
                    this.timeDuration = Number(subsectionCourse.targetDuration);
                    this.changeDuration= subsectionCourse.lastStudyPoint;  
                    wx.getNetworkType({
                        success (res) {               
							if (res.networkType == 'wifi'){
								query['netType'] = 2;
							}else{
								query['netType'] = 1;
							}                                 
                            self.$http.post(self.$server.getResoursePlayUrl,query,{urlType:true}).then(resInfo=>{
                                if(resInfo.data.status==200){
                                    self.playerIsNo = false;
                                    self.src = resInfo.data.content; 
                                    if(subsectionCourse.newPath){
                                        var lastTimes = 0;
                                        if(self.timeDuration-subsectionCourse.lastStudyPoint<1){
                                            lastTimes = 0;
                                        }else{
                                            lastTimes = subsectionCourse.lastStudyPoint;
                                        }
                                        if(!self.getDurations){
                                            self.getDurations = true;
                                        }                                
                                        self.creatBackAudioObject(resInfo.data.content,lastTimes);                              
                                    }
                                }
                            }); 
                        }
                    });                     
                }else{
                        if(this.audioData.playerCreat){
                            this.player = wx.getBackgroundAudioManager();
                            this.player.stop();
                        }
                        this.playerIsNo = true;
                        self.playOrPauseIcon = false;
                        self.playFlag =false;                   
                        uni.showToast({
                            title: '未购买课程',
                            icon:'none',
                            duration: 2000
                        }); 
                }
        },
        getUrlToBackgroundAudio(dataObj){
            var self = this;
                self.periodId = dataObj.periodId;
                self.timeDuration = Number(dataObj.targetDuration);            
            wx.getNetworkType({
                success (res) {       
                    let query = {
                        courseId:self.courseIds,
                        periodId:dataObj.periodId,
                        definitionType:0
                    };        
                    if (res.networkType == 'wifi'){
                        query['netType'] = 2;
                    }else{
                        query['netType'] = 1;
                    }                                 
                    self.$http.post(self.$server.getResoursePlayUrl,query,{urlType:true}).then(resInfo=>{
                        if(resInfo.data.status==200){
                            self.player = wx.getBackgroundAudioManager();
                            self.playerIsNo = false;
                            self.src = resInfo.data.content; 
                            self.player.src=resInfo.data.content;
                            self.player.seek(0);
                        }
                    }); 
                }
            });
        },
        //根据小标切换视频
        changeIndexForEnen(type){
            var self = this;      
            let audioCoursetList =  []; 
            var pageTypes = this.$store.state.audioOrVideo;
            var audioDataLet = this.$store.state.audioData;
            var copyAudioDataLet = this.$store.state.copyAudioData;
            var list1 = this.$store.state.courseaudioListInfo;
            var list2 = this.$store.state.localaudioListInfo;
            if(pageTypes=='video'||pageTypes=='other'||(pageTypes=='audio'&&copyAudioDataLet.show)||!list2.length){
                audioCoursetList = list1;
            }else{
                audioCoursetList = list2;
            }     
            function checkAdult(element){
                if(element.isTrySee==1||self.objs.isVip==1||self.objs.isBuy==1||self.objs.timeLimitType==0){
                    return  element;
                }
            }  
            this.setLastTimeToStort(self.periodId);
            let newArray = audioCoursetList.map(element=>{return element.periodId});
            let indexsId = newArray.indexOf(self.periodId); 
            if(type){
                this.isNewPageType = true;
                this.setStatusCourseChoose(indexsId);
            }else{
                var isokInfoArry =audioCoursetList.slice(indexsId+1);
                var isTryCourse = isokInfoArry.filter(checkAdult);               
                if(indexsId!=newArray.length-1){
                    if(newArray&&isTryCourse.length>0){
                        newArray.forEach((element,index)=>{
                            if(element==isTryCourse[0].periodId){
                                if(pageTypes=='video'||pageTypes=='other'||(pageTypes=='audio'&&copyAudioDataLet.show)){
                                    //获取url从新赋值；
                                    this.isNewPageType = false;
                                    this.getUrlToBackgroundAudio(isTryCourse[0]);
                                }else{
                                    this.isNewPageType = true;
                                    this.setStatusCourseChoose(index);
                                }
                            }
                        });
                    }else{
                        this.playFlag=false;
                        this.playOrPauseType = false;
                        this.playOrPauseIcon = false;
                        let temp = Object.assign({},audioDataLet,{playFlag:false});
                        this.setAudioData(temp);
                        this.$store.commit('SETAUDIODATA',temp)
                        self.$emit('progressEmit',{type:true,objs:backgroundAudioManager});
                        console.log('没有课程目录了');                        
                    }
                }else{
                    console.log('没有课程目录了');
                    this.playFlag = false;
                    this.playOrPauseType = false;
                    this.playOrPauseIcon = false;
                    let temp = Object.assign({},audioDataLet,{playFlag:this.playFlag});
                    this.setAudioData(temp);
                    this.$store.commit('SETAUDIODATA',temp)
                }
            } 
        },
        //切换存储数组最后的值；
        setLastTimeToStort(periodId){
            //取出存储的路径播放数组；
            var self= this;
            let audioCoursetList =  this.$store.state.courseaudioListInfo; 
            //获取数据存储的最后值；
            var realLearnRatelong = self.$store.state.timeArry; 
            if(realLearnRatelong.length){
                var lastVals = realLearnRatelong[realLearnRatelong.length-1];
                audioCoursetList.forEach((element,index)=>{
                    if(element.periodId==periodId){
                        element.lastStudyPoint = lastVals;
                    }
                });
                this.setLessonListNums(audioCoursetList.length);
            }
        },
        //老版本音频兼容
        getCoursePath(ids,newVal){
                var self = this;              
                let query = {
                    definitionType: 0,
                    periodId: Number(ids),//课时id 
                    courseId: this.objs.courseId
                }
                this.timeDuration = Number(newVal.targetDuration);
                if(Number(this.objs.isFree)==1||Number(this.objs.isVip)==1||this.objs.isBuy==1||this.objs.timeLimitType==0||newVal.isTrySee==1){
                    wx.getNetworkType({
                        success (res) {               
							if (res.networkType == 'wifi'){
								query['netType'] = 2;
							}else{
								query['netType'] = 1;
							}                     
                            self.$http.post(self.$server.getResoursePlayUrl,query,{urlType:true}).then(resInfo=>{
                                if(resInfo.data.status==200){
                                    self.playerIsNo = false;
                                    self.src = resInfo.data.content;  
                                    if(newVal.newPath){
                                        self.openType = newVal.newPath;
                                        var lastTimes = 0;
                                        if(newVal.targetDuration-newVal.lastStudyPoint<1){
                                            lastTimes = 0;
                                        }else{
                                            lastTimes = newVal.lastStudyPoint;
                                        }             
                                        if(!self.getDurations){
                                            self.getDurations = true;
                                        }                                             
                                        self.creatBackAudioObject(resInfo.data.content,lastTimes);
                                    }                   
                                }else{
                                    self.playerIsNo = true;
                                    if(self.audioData.playerCreat){
                                        self.player = wx.getBackgroundAudioManager();
                                        self.player.stop();
                                        self.src = '';
                                    }                    
                                }
                            });
                        }
                    });                    
                }else{
                    uni.showToast({
                        title: '还未购买该课程',
                        icon: 'none'
                    });                                     
                }

        },        
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
                            if(!self.player){
                                self.player = wx.getBackgroundAudioManager();
                            }
                            //暂停，切换页面调用接口；
                            var realLearnRatelong = self.$store.state.timeArry;           
                            let data = self.audioData;
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
                            self.$http.post(self.$server.savePeriodStudyRecordsUser,query).then(res=>{
                                if(res.data.status==200){
                                    self.$store.commit('SETTimeARRYS',[]);
                                    self.player.stop();
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
                                                    console.log("code有过期");
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
                        }
                        wx.removeStorageSync('userInfo')
                        self.userinfos = wx.getStorageSync('userInfo');
                        wx.setStorageSync('userInfo',JSON.stringify(objs));
                        wx.hideLoading();
                        if(self.objs.isJoinAssemble){
                            var moneySpikePrice=self.isSpellCourseBuy!=1?self.objs.assemblePrice:self.objs.sellingPrice;
                        }else{
                            var moneySpikePrice=self.objs.timeLimitType==2?self.objs.spikePrice:self.objs.sellingPrice;
                        }

                        //判断是不是7天，30天价格的设置课程
                        if(this.propsData.type==1||this.propsData.type==2){
                            wx.redirectTo({
                                url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId+"&xgxwType="+self.propsData.type
                            });
                        }else{
                            wx.redirectTo({
                                url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                            });                                            
                        } 
                    }
                });
        },
        //获取解密接口
        getDecryptCellphone(data){
            //调用绑定电话号码的接口；
            let query = {
                encryptedData: data.encryptedData,
                iv: data.iv,
                code:data.code
            };
            wx.setStorageSync('code',data.code);
            this.$http.post(this.$server.getLoginWeChatUserPhone,query).then(res=>{
                if(res.data.status==200){
                    var objs = {
                        cellphone:res.data.content,
                    };
                    this.setCellphoneEven(objs);
                }
            });
        },
        purchaseCourse(){           
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
                            if(!self.player){
                                self.player = wx.getBackgroundAudioManager();
                                self.player.stop(); 
                            }else{
                                self.player.stop();
                            }
                            //暂停，切换页面调用接口；
                            var realLearnRatelong = self.$store.state.timeArry;           
                            let data = self.audioData;
                            let query = {
                                periodId:data.periodId,//课时id 
                                courseId:data.courseId,
                                learnRate:realLearnRatelong[realLearnRatelong.length-1],
                                realLearnRate:realLearnRatelong.length,
                                studyPoint:realLearnRatelong.toString(),
                                lastStudyPoint:realLearnRatelong[realLearnRatelong.length-1],
                                show:false
                            };
                            if (res.networkType == 'wifi'){
                                query['netType'] = 2;
                            }else{
                                query['netType'] = 1;
                            }
                            self.$http.post(self.$server.savePeriodStudyRecordsUser,query).then(res=>{
                                if(res.data.status==200){
                                    self.$store.commit('SETTimeARRYS',[])
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
                                    setTimeout(()=>{
                                        if(self.objs.isJoinAssemble){
                                            var moneySpikePrice=self.isSpellCourseBuy!=1?self.objs.assemblePrice:self.objs.sellingPrice;
                                        }else{
                                            var moneySpikePrice=self.objs.timeLimitType==2?self.objs.spikePrice:self.objs.sellingPrice;
                                        }
                                        // wx.redirectTo({
                                        //     url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                                        // });
                                        //判断是不是7天，30天价格的设置课程
                                        if(this.propsData.type==1||this.propsData.type==2){
                                            wx.redirectTo({
                                                url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId+"&xgxwType="+self.propsData.type
                                            });
                                        }else{
                                            wx.redirectTo({
                                                url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                                            });                                            
                                        }                                        
                                    },200);
                                }
                            });  
                        }
                    });                           
                }else{
                    if(self.objs.isJoinAssemble){
                        var moneySpikePrice=self.isSpellCourseBuy!=1?self.objs.assemblePrice:self.objs.sellingPrice;
                    }else{
                        var moneySpikePrice=self.objs.timeLimitType==2?self.objs.spikePrice:self.objs.sellingPrice;
                    }
                    //判断是不是7天，30天价格的设置课程
                    if(this.propsData.type==1||this.propsData.type==2){
                        wx.redirectTo({
                            url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId+"&xgxwType="+self.propsData.type
                        });
                    }else{
                        wx.redirectTo({
                            url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId
                        });                                            
                    }                     
                    // wx.redirectTo({
                    //     url: '../investMoney/index?id='+Number(self.objs.courseId)+"&timeLimitType="+self.objs.timeLimitType+"&spikePrice="+moneySpikePrice+"&isJoinAssemble="+self.objs.isJoinAssemble+"&assembleCourseId="+self.objs.assembleCourseId+"&isSpellCourseBuy="+self.isSpellCourseBuy+"&selectSpellListId="+self.selectSpellListId,
                    // });                
                }
        },

        //点击详情页面拼团列表中的按钮事件
        spellTenlistEven(type,data){
            if(type==1){
                this.getSpellCourseList(10);
                setTimeout(()=>{
                    this.spellDilgeBoxShowOrHide=true;
                },100);
            }else{
                this.isSpellCourseBuy=type;
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
        isNogetPhoneNumber(num,item){
            this.isSpellCourseBuy = num;
            this.selectSpellListId = item.id;
        },
        getPhoneNumberButEven(num){
            this.isSpellCourseBuy = num;
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
.audio-pluge{
    background: #fff;
    padding: 0 0 29rpx 0;     
    .audio-box{
        position: relative;
        .shareCss{
            position: absolute;
            z-index: 99999;
            top: 10rpx;
            right: 10rpx;
            width: 50px;
            height: 20px;
            border-radius: 20px;
            font-size: 24rpx;
            background: rgba(217,10,10,0.3);
            color: #fff;
            text-align: center;
            line-height: 20px;
        }
        .audioImgBox{
            width: 100%;
            height: 100%;
            .audioImg{
                width: 100%;
                height: 100%;                
            }
        }
        .myAudioCss{
            width:100% !important;
            height: 480rpx;
        }
        .copy_audio{
            width:100% !important;
            height: 480rpx;   
            position: relative;
            .londing_xcx{ 
                position: absolute;
                top:0;
                width:100% !important;
                height: 480rpx;    
                display: flex;    
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.5);
                .contentinfo{
                    color:#fff;
                    font-size: 30rpx;
                }                                   
            }
            .imgs-css{
                width: 100%;
                height: 100%;
            }  
            .player-btn{
                position: absolute;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
                z-index: 10;
                font-size: 30rpx;
                color:red;
            }
            .audio-layout{
                position: absolute;
                z-index: 10;
                top: 0;
                left: 0;
                bottom: 0rpx;
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
    }
    .progressBox{
        position: absolute;
        bottom: 82rpx;
        left: 0rpx;
        right: 0rpx;
        .progressBox2{
            width: 100%;
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
                    }
                    .titleRow1{
                        margin-top: 20rpx;
                        font-size: 28rpx;
                        color: #666666FF;
                        width: 500rpx;
                        overflow:hidden; //超出一行文字自动隐藏
                        text-overflow:ellipsis;//文字隐藏后添加省略号
                        white-space:nowrap; 
                    }
                    .titleRow2{
                        margin-top: 20rpx;
                        font-size: 26rpx;
                        color: #999999FF;
                    }                    
                }
                .moneyCourse{
                    width: 250rpx;
                    height: 66rpx;
                    .moneyBut{
                        width: 100%;
                        height: 66rpx;
                        line-height: 66rpx;
                        text-align: center;
                        font-size: 27rpx;
                        border-radius: 66rpx;
                        padding: 0 6rpx;
                        color: #fff;
                        background-color: #C81229;                        
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
                    font-size: 18rpx;
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
                    font-size: 18rpx;
                }
            }            
        }
    }    
}
</style>
<style>
</style>