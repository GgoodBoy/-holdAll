<template>
    <div class="audio-component" @touchend="touchEnd($event)" v-show="!hiddenCompFlag">
        <video v-if="isAndroid&&isWx"  id="audio-container" controls x-webkit-airplay="true" preload="auto" playsinline="true" webkit-playsinline x5-video-player-type="h5" x5-playsinline="true"></video>
        <div  class="ali-audio-player" id="audio-container" v-else></div>
        <div class="shrink clearfix" v-show="shrinkShow&&audioData.autoplay" @click="spreadFlag=true" :class="{'pause':!playerFlag,'out':audioData.isout,'in':!audioData.isout}" :style="{bottom:audioData.bottom}">
            <div class="shrink-box" @click="goCourseDetails">
                <div class="shrink-close" @click="closeAudioComp($event)">
                    <van-icon name="cross" class="" />
                </div>
                <div class="player-btns" >
                    <img :src="audioData.surfacePlot"/>
                    <van-circle
                        v-model="currentRate"
                        :rate="processCurValue"
                        color="#B4272D"
                        layer-color="#fff"
                        :speed="100"
                        class="circle-rate"
                        v-show="!playerLoadingFlag"
                        v-if="processCurValue>0"
                    />
                    <van-loading class="player-loading" color="#B4272D" v-show="playerLoadingFlag"/>
                </div>
                <div class="audio-info">
                    <p class="title textEllipsis">{{audioData.periodTitle}}</p>
                    <p class="time">{{curDuration}}/{{totalDuration}}</p>
                </div>
                <div class="like-area" @click="PlayerEvent($event)">
                    <van-icon v-show="!playerFlag" name="play" class="small-player-btn" />
                    <van-icon v-show="playerFlag" name="pause" class="small-player-btn" />
                </div>
            </div>
        </div>
        <div class="spread" :class="audioData.startPlay&&!shrinkShow?'show':''" :style="{top:hasOpenApp?'0.98rem':'0px'}">
                <img :src="audioData.surfacePlot" class="audio-surface"/>
                <div class="audio-main">
                    <!-- <p class="memory-tips" v-if="timeText.length>0">您上次播放至{{timeText}}处</p> -->
                    <van-loading color="#C30D23" class="waiting-loading" v-show="waiting" />
                    <div class="audio-play-btn" @click="PlayerEvent" ref="playBtn">
                        <i class="player-btn" :class="playerFlag?'pause':'play'"></i>
                    </div>
                    <div class="audio-controls">
                        <div class="t">
                            <div class="process">
                                <!-- <div class="bar-btn big" v-show="touchFlag" :style="{left:offsetLeft}">{{ curDuration }}/{{totalDuration}}</div> -->
                                <van-slider v-model="processCurValue" active-color="#f4f4f4" inactive-color="#f4f4f4" @change="getCurValue" @touchstart.native="touchProcess">
                                    <div slot="button" class="bar-btn" ref="barBtn">{{ curDuration }}/{{totalDuration}}</div>
                                </van-slider>
                            </div>
                            <div class="control-item prve" @click="prevResource"><i class="prve-btn" :class="prevFlag?'can':'cancel'"></i></div>
                            <div class="control-item next" @click="nextResource" ref="nextBtn"><i class="next-btn" :class="nextFlag?'can':'cancel'"></i></div>
                        </div>
                        <div class="b">
                            <!-- <p class="duration">{{ curDuration }}/{{totalDuration}}</p> -->
                            <div class="control-btns">
                                <div class="control-item speed-area" v-if="!isWx">
                                    <p class="cur-speed" @click="switchSpeedList">{{curSpeed.speed==1?'正常':curSpeed.speed+'x'}}</p>
                                    <div class="list" :class="speedFlag?'open':'close'">
                                       <div class="speed-item" v-for="(item,index) in speedList" :class="{'normal':item.speed==1,'active':item.active}" :key="index" @click="chooseSpeed(item)">
                                            <p>{{item.speed==1?'正常':item.speed+'x'}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="details" @click="showDetails">
                                    <i></i>
                                </div>
                                <div class="loop-btn" :class="loopFlag?'loop':''" @click="loopResource">
                                    <i></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>        
            <div class="share-wrap" :class="shareFlag?'show':''" v-if="support">
                <div class="share-box">
                    <div class="share-area">
                        <div @click="shareTo('wechatFriend')">
                            <img :src="'./static/img/course/wechat.png'" alt="">
                            <p>微信</p>
                        </div>
                        <div @click="shareTo('wechatTimeline')">
                            <img :src="'./static/img/course/wechat-circle.png'" alt="">
                            <p>朋友圈</p>
                        </div>
                    </div>
                    <div class="share-btn" @click="shareFlag=false">取消</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import Hls from 'hls.js';
const formatSeconds = value =>{
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    if(value<3600){
        return `${mStr}:${sStr}`
    }else{
        let h = parseInt(value/3600)
        let hStr = h<10?`0${h}`:h;
        return `${hStr}:${mStr}:${sStr}`
    }
};
const coverString = (subStr,str)=>{
   const reg = eval("/"+subStr+"/ig");
   return reg.test(str);
}
const iosDown = 'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8'
const pageNames = ['Auth','Login','Register','Forget','Bound','smsLogin']
export default {
    data(){
        return {
            hiddenCompFlag:false,
            periodId:'',
            periodsList:[],
            prevFlag:false,
            nextFlag:false,
            loopFlag:false,
            zanFlag:false,
            shareFlag:false,
            player:'',//播放器
            dragFlag:false,//进度条拖拽
            touchFlag:false,
            bodyScrollTop:0,//页面滚动高度
            spreadFlag:false,//展开/收缩
            playerFlag:false,//按钮播放/暂停
            playerLoadingFlag:false,//按钮loading
            playFinish:false,//当前音频是否播放完成
            speedFlag:false,//倍速list
            processCurValue:0,
            processTotalValue:0,
            totalDuration:0,
            curDurationTemp:0,
            curSpeed:{speed:1,className:'speed'},
            speedList:[
                {speed:0.5,className:'',active:false},
                {speed:0.75,className:'',active:false},
                {speed:1,className:'',active:true},
                {speed:1.25,className:'',active:false},
                {speed:1.5,className:'',active:false},
            ],
            timer:null,
            timeDuration:1000,//播放间隔
            timerd:null,//用于计算curtime-oldtime==timeDuration?'timer定时器正常':'页面进入后台重新进入页面'
            oldTime:0,
            isSwitchResource:false,//是否切换了资源
            loopEnlargeFlag:false,
            likeEnlargeFlag:false,
            currentRate:0,
            offsetLeft:0,
            isLogin:false,
            support:false,
            nativeShare:'',
            hiddenFlag:false,
            audioTime:'',
            tempPeriodId:'',
            autoplay:false,
            shrinkShow:false,
            timeText:'',
            waiting:false,
            memoryTimer:null,
            playing:false,
            getNewUrl:false,
            temp:'',
            isAndroid:false,
            isWx:false,
            hls:'',
            realLearnRate:0,//打开播放器，用户在页面停留的时间
            realLearnRateTimer:null,
            saveTimer:null,
            timeupdateTimer:null,
            studyBehaviorTimer:null,
            studyDuration:0,
        }
    },
    watch:{
        spreadFlag(cur,old){
            if(cur){
                this.bodyScrollTop = document.body.scrollTop
                document.body.classList.add('appStyle');
                document.querySelector("#app").classList.add("appStyle");
            }else{
                document.body.classList.remove('appStyle');
                document.querySelector("#app").classList.remove("appStyle");
                document.body.scrollTop = `${this.bodyScrollTop}`
            }
        },
        $route(cur,old){
            this.shrinkShow = cur.name=='course'&&cur.params.courseId==this.audioData.courseId?false:true;
            let index = pageNames.findIndex(item=>cur.name==item);
            this.hiddenCompFlag = index>=0?true:false;
            this.spreadFlag = false;
            if(this.isLogin) return;
            let uInfo = this.$getCookie('uInfo');
            if(uInfo){
                let isStart = false;//限时免费是否开始
                if(this.audioData.timeLimitType>=0&&this.audioData.timeLimitBeginAt!=''&&this.courseData.nowServerTime!=''){
                    let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
                    let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime()
                    isStart = now>=begin?true:false
                }
                this.isLogin = true
                if(this.audioData.isVip==1||this.audioData.isBuy>0||this.audioData.isFree==1||(this.audioData.timeLimitType==0&&isStart)){
                    this.getPeriodList()
                }else{
                    this.getTrySeePeriodList()
                }
            }else{
                
            }
        },
        audioData:{
            handler(newValue, oldValue) {
                this.loopFlag = newValue.loopFlag;
                if(newValue.speed){
                    this.curSpeed = {speed:newValue.speed}
                    if(this.player){
                        if(this.isAndroid&&this.isWx){
                            this.player.playbackRate = newValue.speed;
                        }else{
                            this.player.setSpeed(newValue.speed)
                        }
                    }
                }
                this.shrinkShow = this.$route.name=='course'&&this.$route.params.courseId==this.audioData.courseId?false:true
                //课时变了
    　　　　　　 if(newValue.periodId!=this.periodId){
                    this.audioTime = 0;
                    this.init();
                    this.initBtnState();
                    let timer = setInterval(()=>{
                        if(newValue.startPlay){
                            this.getNewUrl = false;
                            if (window.WeixinJSBridge) {
                                WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
                                    this.player.play()
                                }, false);
                            } else {
                                document.addEventListener("WeixinJSBridgeReady", ()=>{
                                    WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
                                        this.player.play()
                                    });
                                }, false);
                            }
                            this.playerFlag = true;
                            this.player.play()
                            clearInterval(timer);
                        }
                    },500)
                }else{
                    if(oldValue.startPlay==newValue.startPlay) return;
                    if(newValue.startPlay&&!newValue.click){
                        if (window.WeixinJSBridge) {
                            WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
                                this.player.play()
                            }, false);
                        } else {
                            document.addEventListener("WeixinJSBridgeReady", ()=>{
                                WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
                                    this.player.play()
                                });
                            }, false);
                        }
                        this.playerFlag = true;
                        this.player.play()
                        
                        // this.PlayerEvent()
                    }
                }
                //课程变了
                if(newValue.courseId!=oldValue.courseId){
                    let isStart = false;//限时免费是否开始
                    if(this.audioData.timeLimitType>=0&&this.audioData.timeLimitBeginAt!=''&&this.courseData.nowServerTime!=''){
                        let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
                        let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime()
                        isStart = now>=begin?true:false
                    }
                    if(this.audioData.isVip==1||this.audioData.isBuy>0||this.audioData.isFree==1||(this.audioData.timeLimitType==0&&isStart)){
                        this.getPeriodList()
                    }else{
                        this.getTrySeePeriodList()
                    }
                }
    　　　　 },
    　　　　 deep: true
        },
        buySuccess(cur,old){
            if(cur==true){
                this.getPeriodList()
                this.setBuySuccess(false)
            }
        }
    },
    computed:{
        ...mapState(['audioData','periodShareData','buySuccess','receivefriendShareData','isVip','hasOpenApp','cooperativePlatformsData','lastStudyPoint','isIos']),
        curDuration(){
            if(this.$refs.barBtn&&this.$refs.barBtn.getBoundingClientRect()){
                setTimeout(()=>{
                    let left = this.$refs.barBtn.getBoundingClientRect().left;
                    this.offsetLeft = `calc(${left}px - 0.5rem)`
                },1)
            }
            let temp = Math.round(this.processTotalValue*(this.processCurValue/100))
            this.curDurationTemp = temp>this.processTotalValue?this.processTotalValue:temp;
            return formatSeconds(this.curDurationTemp)
        },
    },
    created(){
        if(!this.canPlayAudio()) return;
        let ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.isWx = true;
        }
        let u = navigator.userAgent;
        this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 ? true : false;
        this.nativeShare = new NativeShare()
        this.browserSupport()
        this.shrinkShow = this.$route.name=='course'&&this.$route.params.courseId==this.audioData.courseId?false:true
        let uInfo = this.$getCookie('uInfo');
        let isStart = false;//限时免费是否开始
        if(this.audioData.timeLimitType>=0&&this.audioData.timeLimitBeginAt!=''&&this.courseData.nowServerTime!=''){
            let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
            let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime()
            isStart = now>=begin?true:false
        }
        if(uInfo){
            this.isLogin = true;
            if(this.audioData.isVip==1||this.audioData.isBuy>0||this.audioData.isFree==1||(this.audioData.timeLimitType==0&&isStart)){
                this.getPeriodList()
            }else{
                this.getTrySeePeriodList()
            }
        }else{
            this.getTrySeePeriodList()
        }
        this.getPeriodLists()
    },
    mounted(){
        document.querySelector('.process .van-slider__button-wrapper').style.zIndex="2";
        this.init('init');
        if(this.audioData.startPlay){
            this.playerFlag = true;
        }
        this.realLearnRateTimer = setInterval(()=>{
            this.realLearnRate++;
        },1000)
    },
    methods:{
        ...mapActions(['setAudioData','setPeriodShareData','setShareType','setBuySuccess','setLastStudyPoint']),
        touchEnd(e){
            e.stopPropagation();
        },
        goCourseDetails(){
            if(this.$route.name=='periodIntro'){
                this.$router.go(-1)
            }else{
                let id =this.audioData.courseId;
                setTimeout(()=>{
                    this.$router.push(`/course/${this.audioData.courseId}`)
                },1)
            }
        },
        /**
         * 初始化
         */
        init(flag){
            this.timeText = '';
            this.audioTime = 0;
            if(this.lastStudyPoint&&this.lastStudyPoint>=0){
                if(this.lastStudyPoint>=(this.audioData.duration-5)){
                    this.temp = this.audioTime = 0;
                }else{
                    this.temp = this.audioTime = this.lastStudyPoint;
                }
                this.timeText = formatSeconds(this.audioTime)
            }else{
                let audioHistoryData = localStorage.getItem('audioHistoryData')?JSON.parse(localStorage.getItem('audioHistoryData')):[];
            if(audioHistoryData.length>0){
                let courseObj = audioHistoryData.find(item=>item.courseId==this.audioData.courseId)
                    if(courseObj){
                        let obj = courseObj.periodList.find(item=>item.periodId==this.audioData.periodId)
                        if(obj&&obj.time>0){
                            this.audioTime = obj.time;
                            setTimeout(() => {
                                this.timeText = formatSeconds(obj.time)
                            }, 500);
                        }
                    }
                }
            }
            
            this.zanFlag = this.dragFlag = this.playerFlag = this.playerLoadingFlag = this.playFinish = false;
            this.processCurValue = this.processTotalValue = this.totalDuration = this.curDurationTemp = 0;
            this.oldTime = 0;
            this.$nextTick(()=>{
                this.createPlayer(flag)
                this.processTotalValue = this.audioData.duration;
                this.totalDuration = formatSeconds(this.audioData.duration);
                this.periodId = this.audioData.periodId;
                this.zanFlag = this.audioData.thumbsUpPeriodFlag;
            })
            document.title = this.audioData.periodTitle;
        },
        /**
		 * 浏览器是否支持微信、朋友圈分享
		 */
		browserSupport(){
			let UA = navigator.appVersion;
			let uc = UA.split('UCBrowser/').length > 1 ? 1 : 0;
			let qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0;
			let wx = /micromessenger/i.test(UA);
			if(uc||qq||wx){
				this.support = true;
			}else{
				this.support = false;
            }
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                this.hiddenFlag = true
            }else{
                this.hiddenFlag = false
            }
		},
        /**
         * 获取全部课时
         */
        getPeriodList(){
            this.$http.post(this.$server.getPeriodsListByCourseId,{
                courseId:this.audioData.courseId,
            }).then(res =>{
                if(res.data.status == 200){
                    this.periodsList = res.data.content;
                    this.$nextTick(()=>{
                        this.initBtnState()
                    })
                }
            })
        },
        getPeriodLists(){
            this.$http.post(this.$server.getPeriodsListByCourseId,{
                courseId:this.audioData.courseId,
            }).then(res =>{
                if(res.data.status == 200){
                    this.comparePeriodsList = res.data.content;
                }
            })
        },
        /**
         * 获取当前课程下可听课时列表
         */
        getTrySeePeriodList(){
            let params = {
                courseId:this.audioData.courseId
            }
            this.$http.post(this.$server.getTrySeePeriodList,params).then(res=>{
                if(res.data.status == 200){
                    this.periodsList = res.data.content.periodsList;
                    this.$nextTick(()=>{
                        this.initBtnState()
                    })
                }
            })
        },
        initBtnState(){
            let index = this.periodsList.findIndex(item=>item.id==this.audioData.periodId)
            if(index==-1){
                let sort = this.audioData.periodSort;
                let prveTemp = sort-1;
                let nextTemp = sort+1;
                let prevObj = this.periodsList.find(item=>item.sort==prveTemp);//上一首
                let prevItem = this.periodsList.find(item=>item.sort<sort);//上几首
                let nextObj = this.periodsList.find(item=>item.sort==nextTemp)//下一首
                let nextItem = this.periodsList.find(item=>item.sort>sort);//下几首
                this.prevFlag = prevObj||prevItem?true:false;
                this.nextFlag = nextObj||nextItem?true:false;
            }else{
                if(index==0){
                    if(this.periodsList.length==1){
                        this.prevFlag = false;
                        this.nextFlag = false;
                    }else{
                        this.prevFlag = false;
                        this.nextFlag = true;
                    }
                }else if(index==this.periodsList.length-1){
                    this.prevFlag = true;
                    this.nextFlag = false;
                }else{
                    this.prevFlag = true;
                    this.nextFlag = true;
                }
            }
        },
        /**
         * 创建音频播放器
         */
        createPlayer(flag){
            if(!this.canPlayAudio()) return;
            if(this.isAndroid&&this.isWx){
                this.createPlayerInAndroid(flag)
            }else{
                this.createPlayerInIos(flag)
            }
        },
        /**
         * 在安卓中使用hls.js创建音频播放器
         */
        createPlayerInAndroid(flag){
            this.temp = this.audioTime;
            clearInterval(this.saveTimer)
            this.saveTimer = setInterval(()=>{
                if(this.player!=''&&this.player!=undefined){
                    if(this.player.currentTime&&this.playing){
                        // this.time = this.player.currentTime;
                        this.savePeriodStudyRecords(this.player.currentTime,'','realLearnRate')
                    }
                }
            },5000)
            if(this.player!=''){
                this.player.pause()
                let parent = document.querySelector(".audio-component");
                parent.removeChild(document.querySelector("#audio-container"));
                let child = document.createElement("video");
                child.setAttribute('id','audio-container');
                child.setAttribute('class','ali-audio-player');
                let existingItem = document.querySelector('.shrink')
                parent.insertBefore(child,existingItem)
                this.player = child
            }else{
                this.player = document.querySelector("#audio-container")
            }
            if(Hls.isSupported()){
                var hls = new Hls();
                hls.loadSource(this.audioData.resourceUrl);
                hls.attachMedia(this.player);
                hls.on(Hls.Events.MANIFEST_PARSED,()=>{
                    if(this.curSpeed.speed!=1){
                        this.player.playbackRate = this.curSpeed.speed
                    }
                    if(this.isSwitchResource){
                        this.isSwitchResource = false;
                    }
                    this.waiting = true;
                    this.playing = false
                    setTimeout(()=>{
                        let doms = document.querySelectorAll('video');
                        for(let i=0;i<doms.length;i++){
                            doms[i].style.visibility = 'hidden';
                            doms[i].style.display = 'none';
                        }
                        if(this.temp>0){
                            this.player.pause()
                            setTimeout(()=>{
                                this.player.currentTime = this.temp;
                                let curTime = Math.round(this.player.currentTime)-1;
                                this.processCurValue = curTime/this.processTotalValue*100;
                                this.temp = 0;
                                this.player.play()
                            },700)
                            setTimeout(()=>{
                                this.timeText = ''
                            },5000)
                        }else{
                            this.player.currentTime = 1;
                            this.player.play()
                        }
                    },10) 
                });
                this.player.addEventListener('timeupdate',(e)=>{
                    if(this.touchFlag) return false;
                    if(this.player.currentTime==0) return false;
                    this.playerLoadingFlag = false;
                    let curTime = Math.round(this.player.currentTime)-1;
                    this.processCurValue = curTime/this.processTotalValue*100;
                    this.startProcess();
                    if(this.playing){
                        this.saveHistory(this.player.currentTime)
                    }
                    if(!this.timeupdateTimer){
                        this.timeupdateTimer = setInterval(()=>{
                            let learnRate = this.player.currentTime;
                            this.savePeriodStudyRecords(learnRate,'','realLearnRate')
                        },10000)
                    }
                })
                this.player.addEventListener('waiting',(e)=>{
                    this.waiting = true;
                    this.playing = false
                    this.playerLoadingFlag = true;
                    this.audioTime = this.player.currentTime
                })
                this.player.addEventListener('seeked',(e)=>{
                    this.audioTime = this.player.currentTime
                    this.saveHistory(this.audioTime)
                })
                this.player.addEventListener('playing',(e)=>{
                    this.playing = true;
                    this.waiting = false;
                    this.audioTime = this.player.currentTime
                    let learnRate = this.player.currentTime
                    this.savePeriodStudyRecords(learnRate,'','realLearnRate');
                    if(this.$getCookie('uInfo')){
                        clearInterval(this.studyBehaviorTimer);
                        this.studyBehaviorTimer = setInterval(()=>{
                            this.studyDuration++;
                            console.log('studyDuration=>'+this.studyDuration)
                        },1000)
                    }
                })
                this.player.addEventListener('pause',(e)=>{
                    this.playing = false;
                    this.playerLoadingFlag = false;
                    this.playerFlag = false
                    this.audioTime = this.player.currentTime
                    let learnRate = this.player.currentTime
                    this.savePeriodStudyRecords(learnRate)
                    this.saveStudyBehavior()
                })
                this.player.addEventListener('ended',(e)=>{
                    this.audioTime = this.player.currentTime
                    let learnRate = this.player.currentTime
                    this.savePeriodStudyRecords(learnRate,'','init-memory')
                    // this.saveStudyBehavior()
                    clearInterval(this.memoryTimer)
                    if(this.loopFlag){
                        this.dragFlag = this.playerFlag = this.playerLoadingFlag = this.playFinish = false;
                        this.processCurValue = this.curDurationTemp = 0;
                        this.oldTime = 0;
                        this.PlayerEvent()
                    }   
                    else{
                        if(this.nextFlag){
                            setTimeout(()=>{
                                this.$refs.nextBtn.click();
                                clearInterval(this.studyBehaviorTimer);
                                this.studyDuration = 0;
                                this.studyBehaviorTimer = setInterval(()=>{
                                    this.studyDuration++;
                                    console.log('studyDuration=>'+this.studyDuration)
                                },1000)
                            },1000)
                        }
                    }
                    this.$nextTick(()=>{
                        this.audioTime = 0;
                    })
                })
                this.player.addEventListener('error',(e)=>{
                    this.playing = false
                    this.audioTime = this.player.currentTime
                    if(this.cooperativePlatformsData&&this.cooperativePlatformsData.xxtId.length>0){
                        let query = {
                            definitionType:1,
                            periodId:this.audioData.periodId,
                            courseId:this.audioData.courseId,
                            xxtId:this.cooperativePlatformsData.xxtId
                        }
                        this.$http.post(this.$server.getResPlayUrlForXXT,query).then(res=>{
                            if(res.status==200){
                                let resourceUrl = res.data.content.resAddress;
                                let audioData = Object.assign({},this.audioData,{resourceUrl})
                                this.setAudioData(audioData)
                                this.$nextTick(()=>{
                                    this.init();
                                    this.initBtnState();
                                })
                            }
                        })
                    }else{
                        let query = {
                            definitionType:1,
                            periodId:this.audioData.periodId,
                            courseId:this.audioData.courseId
                        }
                        this.$http.post(this.$server.getResoursePlayUrl,query).then(res=>{
                            if(res.data.status == 200){
                                let resourceUrl = res.data.content;
                                let audioData = Object.assign({},this.audioData,{resourceUrl})
                                this.setAudioData(audioData)
                                this.$nextTick(()=>{
                                    this.init();
                                    this.initBtnState();
                                })
                            }
                        })
                    }
                })
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                this.player.src = res.data.content;
                this.player.addEventListener('loadedmetadata',function() {
                    this.player.play();
                });
            }
        },
        /**
         * 使用阿里云web播放器
         */
        createPlayerInIos(flag){
            this.temp = this.audioTime;
            clearInterval(this.saveTimer)
            this.saveTimer = setInterval(()=>{
                if(this.player!=''&&this.player!=undefined){
                    if(this.player.getCurrentTime()&&this.playing){
                        // this.time = this.player.getCurrentTime();
                        this.savePeriodStudyRecords(this.player.getCurrentTime(),'','realLearnRate')
                    }
                }
            },5000)
            // if(!flag){
            //     console.log('进来了')
            //     this.player.loadByUrl(this.audioData.resourceUrl,this.audioTime)
            //     this.player.seek(this.temp)
            //     return false;
            // }
            if(this.player){
                document.querySelector('#audio-container').innerHTML=''
                this.player.dispose();
                this.player = null;
            }
            if (document.querySelector("#audio-container") === null) {
                let parent = document.querySelector(".audio-component");
                let child = document.createElement("div");
                child.setAttribute('id','audio-container');
                child.setAttribute('class','ali-audio-player');
                let existingItem = document.querySelector('.shrink')
                parent.insertBefore(child,existingItem)
            }
            let autoplay = this.audioData.autoplay||this.autoplay
            let props = {
                id: "audio-container",
                preload:true,
                autoplay: autoplay,
                source:this.audioData.resourceUrl,
                isLive: false,
                mediaType:'audio',
                x5_fullscreen:false,
                useH5Prism:true,
                playsinline:true,
                extraInfo:{
                    "x5-playsinline":""
                },
                x5_type:"h5"
            }
            let Aliplayer = window.Aliplayer;
            if(Aliplayer){
                this.player = new Aliplayer(props,(player)=>{});
                this.player.on('ready',(e)=>{
                    if(this.audioTime>0){
                        this.player.seek(this.audioTime);
                    }
                    if(this.curSpeed.speed!=1){
                        this.player.setSpeed(this.curSpeed.speed)
                    }
                    if(this.audioData.autoplay){
                        this.player.play()
                        wx.config({
                            // 配置信息, 即使不正确也能使用 wx.ready
                            debug: false,
                            appId: '',
                            timestamp: 1,
                            nonceStr: '',
                            signature: '',
                            jsApiList: []
                        });
                        wx.ready(()=>{
                            this.player.play()
                        });
                    }
                    if(this.$getCookie('uInfo')){
                        clearInterval(this.studyBehaviorTimer);
                        this.studyBehaviorTimer = setInterval(()=>{
                            this.studyDuration++;
                            console.log('studyDuration=>'+this.studyDuration)
                        },1000)
                    }
                    this.player.on('canplay',(e)=>{
                        let learnRate = this.player.getCurrentTime()<=5?5:this.player.getCurrentTime();
                        this.waiting = false
                        if(this.temp>0){
                            if(learnRate<this.temp){
                                this.player.seek(this.temp);
                                this.temp = 0;
                            }
                        }
                        if(this.timeText!=''){
                            setTimeout(()=>{
                                this.timeText = ''
                            },5000)
                        }
                    })
                    this.player.on('play',(e)=>{
                        this.audioTime = this.player.getCurrentTime();
                        let learnRate = this.player.getCurrentTime();
                        this.playerFlag = true;
                    })
                    this.player.on('timeupdate',(e)=>{
                        if(this.touchFlag) return false;
                        if(this.player.getCurrentTime()==0) return false;
                        this.playerLoadingFlag = false;
                        let curTime = Math.round(this.player.getCurrentTime())-1;
                        this.processCurValue = curTime/this.processTotalValue*100;
                        this.startProcess();
                        if(this.playing){
                            this.saveHistory(this.player.getCurrentTime())
                        }
                        if(!this.timeupdateTimer){
                            this.timeupdateTimer = setInterval(()=>{
                                let learnRate = this.player.getCurrentTime();
                                this.savePeriodStudyRecords(learnRate,'','realLearnRate')
                            },10000)
                        }
                    })
                    this.player.on('waiting',(e)=>{
                        this.waiting = true;
                        this.playing = false
                        this.playerLoadingFlag = true;
                        this.audioTime = this.player.getCurrentTime()
                        let learnRate = this.player.getCurrentTime()
                    })
                    this.player.on('completeSeek',(e)=>{
                        this.audioTime = this.player.getCurrentTime()
                        this.saveHistory(this.audioTime)
                    })
                    this.player.on('playing',(e)=>{
                        this.playing = true;
                        this.audioTime = this.player.getCurrentTime()
                        let learnRate = this.player.getCurrentTime()
                        this.savePeriodStudyRecords(learnRate,'','realLearnRate');
                        if(this.$getCookie('uInfo')){
                            clearInterval(this.studyBehaviorTimer);
                            this.studyBehaviorTimer = setInterval(()=>{
                                this.studyDuration++;
                                console.log('studyDuration=>'+this.studyDuration)
                            },1000)
                        }
                    })
                    this.player.on('pause',(e)=>{
                        this.playing = false;
                        this.playerLoadingFlag = false;
                        this.playerFlag = false
                        this.audioTime = this.player.getCurrentTime()
                        let learnRate = this.player.getCurrentTime()
                        this.savePeriodStudyRecords(learnRate)
                        this.saveStudyBehavior()
                        console.log('pause')
                    })
                    this.player.on('error',(e)=>{
                        this.playing = false
                        this.audioTime = this.player.getCurrentTime()
                        if(this.cooperativePlatformsData&&this.cooperativePlatformsData.xxtId.length>0){
                            let query = {
                                definitionType:1,
                                periodId:this.audioData.periodId,
                                courseId:this.audioData.courseId,
                                xxtId:this.cooperativePlatformsData.xxtId
                            }
                            this.$http.post(this.$server.getResPlayUrlForXXT,query).then(res=>{
                                if(res.status==200){
                                    let resourceUrl = res.data.content.resAddress;
                                    let audioData = Object.assign({},this.audioData,{resourceUrl})
                                    this.setAudioData(audioData)
                                    this.$nextTick(()=>{
                                        this.init();
                                        this.initBtnState();
                                    })
                                }
                            })
                        }else{
                            let query = {
                                definitionType:1,
                                periodId:this.audioData.periodId,
                                courseId:this.audioData.courseId
                            }
                            this.$http.post(this.$server.getResoursePlayUrl,query).then(res=>{
                                if(res.data.status == 200){
                                    let resourceUrl = res.data.content;
                                    let audioData = Object.assign({},this.audioData,{resourceUrl})
                                    this.setAudioData(audioData)
                                    this.$nextTick(()=>{
                                        this.init();
                                        this.initBtnState();
                                    })
                                }
                            })
                        }
                        
                    })
                    this.player.on('ended',(e)=>{
                        this.audioTime = this.player.getCurrentTime()
                        let learnRate = this.player.getCurrentTime()
                        this.savePeriodStudyRecords(learnRate,'','init-memory')
                        // this.saveStudyBehavior()
                        clearInterval(this.memoryTimer)
                        if(this.loopFlag){
                            this.dragFlag = this.playerFlag = this.playerLoadingFlag = this.playFinish = false;
                            this.processCurValue = this.curDurationTemp = 0;
                            this.oldTime = 0;
                            this.PlayerEvent()
                        }   
                        else{
                            if(this.nextFlag){
                                setTimeout(()=>{
                                    this.$refs.nextBtn.click();
                                    clearInterval(this.studyBehaviorTimer);
                                    this.studyDuration = 0;
                                    this.studyBehaviorTimer = setInterval(()=>{
                                        this.studyDuration++;
                                    },1000)
                                },1000)
                            }
                        }
                        this.$nextTick(()=>{
                            this.audioTime = 0;
                        })
                    })
                    if(this.isSwitchResource){
                        this.isSwitchResource = false;
                    }
                    setTimeout(()=>{
                        let doms = document.querySelectorAll('video');
                        for(let i=0;i<doms.length;i++){
                            doms[i].style.visibility = 'hidden';
                            doms[i].style.display = 'none';
                        }
                    },10) 
                })
            }else{
                this.$toast('音频资源加载失败，请刷新页面重试');
                return;
            }
        },
        /**关闭组件 */
        closeAudioComp(e){
            e && e.stopPropagation();
            this.tempPeriodId = this.audioData.periodId;
            let audioData = Object.assign({},this.audioData,{
                show:false,
                periodId:'',
                autoplay:false,
                startPlay:false
            })
            this.setAudioData({})
        },
        /**
         * 副定时器任务,处理页面进入后台又重新进入页面后，主定时器任务timer定时不准确情况
         */
        startInterval(){
            if(this.timerd)return false;
            let firstTime = new Date().getTime();
            this.timerd = setInterval(()=>{
                let oldTime = this.oldTime==0?firstTime:this.oldTime;
                let curTime = new Date().getTime();
                let temp = this.timeDuration;
                if((curTime-oldTime)>=(temp-50)&&(curTime-oldTime)<=(temp+50)){
                    this.oldTime = curTime;
                }else{
                    if(this.playerFlag){
                        let curTime = Math.round(this.player.getCurrentTime());
                        this.processCurValue = curTime/this.processTotalValue*100;
                        this.oldTime = curTime;
                    }
                }
                if(this.curDurationTemp>=this.processTotalValue-1){
                    clearInterval(this.timerd)
                }
            },this.timeDuration)
        },
        /**播放\暂停事件 */
        PlayerEvent(e){
            e && e.stopPropagation();
            if(!this.canPlayAudio()) return;
            if(!this.playerFlag){
                if(this.dragFlag){
                    this.dragFlag = false;
                    if(this.isAndroid&&this.isWx){
                        this.player.currentTime = this.curDurationTemp
                    }else{
                        this.player.seek(this.curDurationTemp)
                    }
                }
                this.playerLoadingFlag = true;
                this.playerFlag = true;
                this.player.play();
                return false;
            }else{
                this.playerFlag = false;
                this.player.pause();
                return false;
            }
        },
        /**
         * 触摸进度条
         */
        touchProcess(){
            this.touchFlag = true;
        },
        /**
         * 拖拽进度条，获取进度条当前值
         */
        getCurValue(value){
            this.touchFlag = false;
            if(this.playerFlag){
                this.playerLoadingFlag = true;
                let temp = value*this.processTotalValue/100;
                this.curDurationTemp = temp;
                this.temp = 0;
                if(this.curDurationTemp==this.processTotalValue){
                    temp = this.processTotalValue-1
                }
                if(isNaN(temp))return;
                if(this.isAndroid&&this.isWx){
                    this.player.currentTime = temp
                }else{
                    this.player.seek(temp)
                }
                this.player.play();
            }else{
                this.dragFlag = true;
            }
        },
        /**
         * 进度条进行
         */
        startProcess(){
            this.processCurValue = Number((((this.processCurValue*100)+(100/this.processTotalValue*100))/100).toFixed(2));
        },
        /**
         * 倍速显示/隐藏
         */
        switchSpeedList(){
            this.speedFlag = !this.speedFlag
        },
        /**
         * 选择倍速
         */
        chooseSpeed(obj){
            this.curSpeed = {
                speed:obj.speed,
                className:obj.className
            }
            if(this.player){
                let audioData = Object.assign({},this.audioData,{
                    speed:obj.speed
                })
                this.setAudioData(audioData)
            }
            switch (true){
                case obj.speed==0.5:
                    this.timeDuration = 1000/0.5;
                    break;
                case obj.speed==0.75:
                    this.timeDuration = 1000/0.75;
                    break;
                case obj.speed==1:
                    this.timeDuration = 1000;
                    break;
                case obj.speed==1.25:
                    this.timeDuration = 1000/1.25;
                    break;
                case obj.speed==1.5:
                    this.timeDuration = 1000/1.5;
                    break;        
            }
            this.speedFlag = false;
            this.speedList.forEach(item=>item.active = false)
            let temp = this.speedList.find(item=>item.speed==obj.speed)
            temp.active = true;
        },
        /**
         * 获取课程信息(用于获取新的音频资源课时的信息，并同步更新store)
         */
        getSectionInfo(periodId,courseId,flag){
            let query = {
				periodId:periodId,
				courseType:2
            }
            this.$http.post(this.$server.getPeriodsInfo,query).then(res =>{
                if(res.data.status == 200){
                    let periodSort = this.comparePeriodsList.findIndex(item=>item.id==periodId)+1;
                    let audioData = Object.assign({},this.audioData,{
                        periodTitle:res.data.content.title,
                        periodSort,
                        periodUserLikeCount:res.data.content.periodUserLikeCount,
                        duration:res.data.content.audios.duration,
                        periodId:periodId,
                        courseId:courseId,
                        autoplay:true,
                        click:false
                    })
                    let title = res.data.content.courseTitle||'';
					let surfacePlot = res.data.content.courseSurfacePlot||'';
					let teacherName = res.data.content.courseTeacherName||'';
					let introduce = res.data.content.courseIntro||'';
					let id = res.data.content.id
					let shareData = {
                        courseId:courseId,
						title:title,
						introduce:introduce,
						surfacePlot:surfacePlot,
						teacherName:teacherName,
						link:window.location.href.split('#')[0]+'?wxshare=true&type=period&courseId='+courseId+'&periodId='+id+'&courseType=2'
                    }
					this.setPeriodShareData(shareData)
					this.setShareType('period')
                    if(flag=='base'){
                        this.zanFlag = res.data.content.thumbsUpPeriodFlag;
                        this.setAudioData(audioData)
                    }else{
                        if(this.cooperativePlatformsData&&this.cooperativePlatformsData.xxtId.length>0){
                            this.getResPlayUrlForXXT(periodId,courseId,audioData)
                        }else{
                            this.getResoursePlayUrl(periodId,courseId,audioData);
                        }
                    }
                }
            })
        },
        /**
         * 获取资源
         */
        getResoursePlayUrl(periodId,courseId,obj){
            let query = {
                definitionType:1,
                periodId:periodId,
                courseId:courseId
            }
            if(this.receivefriendShareData.friendId&&this.receivefriendShareData.friendShareCourseId==courseId&&periodId==this.receivefriendShareData.friendSharePeriodId){
                query.shareUserId = this.receivefriendShareData.friendId
            }
            this.$http.post(this.$server.getResoursePlayUrl,query).then(res=>{
                if(res.data.status == 200){
                    obj.resourceUrl = res.data.content;
                    this.setAudioData(obj)
                    this.isSwitchResource = true;
                    this.getNewUrl = true;
                }
            })
        },
        /**
         * 获取音视频播放地址(校讯通)
         */
        getResPlayUrlForXXT(periodId,courseId,obj){
            let query = {
				definitionType:1,
				periodId:periodId,
                courseId:courseId,
                xxtId:this.cooperativePlatformsData.xxtId
            }
            this.$http.post(this.$server.getResPlayUrlForXXT,query).then(res=>{
                if(res.status==200){
                    obj.resourceUrl = res.data.content.resAddress;
                    this.setAudioData(obj)
                    this.isSwitchResource = true;
                    this.getNewUrl = true;
                }
            })
        },
        /**
         * 循环/取消循环
         */
        loopResource(){
            let audioData = Object.assign({},this.audioData,{
                loopFlag:!this.loopFlag
            })
            this.setAudioData(audioData)
        },
        /**
         * 上一个
         */
        prevResource(){
            if(this.prevFlag){
                this.nextFlag = true;
                let index = this.periodsList.findIndex(item=>item.id==this.audioData.periodId);
                let periodId = '',courseId = '';
                if(index==-1){
                    let sort = this.audioData.periodSort;
                    let prve = sort-1;
                    let obj = this.periodsList.find(item=>item.sort==prve);
                    if(obj){
                        periodId = obj.id;
                        courseId = obj.courseId;
                    }else{
                        let tempArr = [...this.periodsList].reverse();
                        let prevItem = tempArr.find(item=>item.sort<sort);
                        if(prevItem){
                           periodId = prevItem.id;
                           courseId = prevItem.courseId
                        }
                    }
                    this.prevFlag = this.periodsList.findIndex(item=>item.sort==prve)==0?false:true;
                }else{
                    this.prevFlag = index-1==0?false:true
                    periodId = this.periodsList[index-1].id;
                    courseId = this.periodsList[index-1].courseId;
                }
                this.getSectionInfo(periodId,courseId)
                let obj = this.periodsList.find(item=>item.id==periodId);
                if(obj.getLastStudyPoint){
                    this.setLastStudyPoint(-1)
                }else{
                    this.setLastStudyPoint(obj.lastStudyPoint)
                    obj.getLastStudyPoint = true;
                }
                let doms = document.querySelectorAll(".catalog-item");
                for(let dom of doms){
                    let id = dom.getAttribute('id');
                    if(id&&id==periodId){
                        let getLastStudyPoint = dom.getAttribute('getLastStudyPoint');
                        if(getLastStudyPoint&&getLastStudyPoint=='true'){
                            this.setLastStudyPoint(-1)
                            break;
                        }
                    }
                }
            }else{
                this.$toast('已是第一首')
            }
        },
        /**
         * 下一个
         */
        nextResource(){
            if(this.nextFlag){
                this.prevFlag = true;
                let index = this.periodsList.findIndex(item=>item.id==this.audioData.periodId);
                let periodId = '',courseId = '';
                if(index==-1){
                    let sort = this.audioData.periodSort;
                    let next = sort+1;
                    let obj = this.periodsList.find(item=>item.sort==next);
                    if(obj){
                        periodId = obj.id;
                        courseId = obj.courseId;
                    }else{
                        let tempArr = [...this.periodsList]
                        let nextItem = tempArr.find(item=>item.sort>sort);
                        if(nextItem){
                            periodId = nextItem.id;
                            courseId = nextItem.courseId
                        }
                    }
                    this.nextFlag = this.periodsList.findIndex(item=>item.sort==next)==this.periodsList.length-1?false:true;
                }else{
                    this.nextFlag = (index+1)==this.periodsList.length-1?false:true
                    periodId = this.periodsList[index+1].id;
                    courseId = this.periodsList[index+1].courseId;
                }
                this.getSectionInfo(periodId,courseId);
                let obj = this.periodsList.find(item=>item.id==periodId);
                if(obj.getLastStudyPoint){
                    this.setLastStudyPoint(-1)
                }else{
                    this.setLastStudyPoint(obj.lastStudyPoint)
                    obj.getLastStudyPoint = true;
                }
                let doms = document.querySelectorAll(".catalog-item");
                for(let dom of doms){
                    let id = dom.getAttribute('id');
                    if(id&&id==periodId){
                        let getLastStudyPoint = dom.getAttribute('getLastStudyPoint');
                        if(getLastStudyPoint&&getLastStudyPoint=='true'){
                            this.setLastStudyPoint(-1)
                            break;
                        }
                    }
                }
            }else{
                this.$toast('已是最后一首')
            }
        },
        /**
         * 点赞
         */
        setPeriodPoint(){
            if(!this.$isLogin(this.$route.fullPath)) {
	            return;
            }
            if(this.zanFlag){
                this.$toast("您已点赞，不能重复点赞")
                return false;
            }else{
                let query = {
                    courseId:this.audioData.courseId,
					periodId:this.audioData.periodId
                }
                this.$http.post(this.$server.setPeriodPoint,query).then(res=>{
					if(res.data.status ==200){
                        this.zanFlag = true;
                        this.likeEnlargeFlag = true;
                        setTimeout(()=>{
                            this.likeEnlargeFlag = false;
                        },300)
                        let periodUserLikeCount = this.audioData.periodUserLikeCount++;
                        let audioData = Object.assign({},this.audioData,{periodUserLikeCount:periodUserLikeCount,thumbsUpPeriodFlag:1})
                        this.setAudioData(audioData)
                        if(res.data.content.totalNum&&res.data.content.totalNum>0){
							this.$rewardPointsToast({
								points:res.data.content.totalNum
							})
						}
					}
				})
            }
        },
        shareTo(command){
			let query = {
                courseId:this.periodShareData.courseId
            }
			this.$http.post(this.$server.getCourseState,query).then(res=>{
				if(res.data.status == 200){
					this.$toast.loading({
						mask: false,
						loadingType:'spinner'
					});
					let shareData;
					shareData = {
                        title:this.periodShareData.teacherName+":"+this.periodShareData.title,
                        desc:this.periodShareData.introduce,
                        link:this.periodShareData.link,
                        icon:this.periodShareData.surfacePlot,
                        success:()=>{
                            let query = {type:5}
                            this.$http.post(this.$server.addIntegral,query).then(res=>{

                            })
                        },
                        fail:()=>{
                            this.$toast('当前浏览器不支持分享！')
                        }
                    }
					this.nativeShare.setShareData(shareData)
					try {
                        let query = {type:5}
						this.$http.post(this.$server.addIntegral,query).then(res=>{

						})
						this.nativeShare.call(command)
					} catch (err) {
					}
				}
			})
        },
        saveStudyBehavior(){
            if(this.studyDuration==0) return;
            let uInfo = JSON.parse(this.$getCookie('uInfo'));
            if (uInfo && uInfo.accessToken) {
                clearInterval(this.studyBehaviorTimer);
                const query = {
                    courseId:this.audioData.courseId,
                    type:4,
                    studyDuration:this.studyDuration,
                    userId:uInfo.userId
                } 
                this.studyDuration = 0;
                this.$http.post(this.$server.saveStudyBehavior,query).then(res=>{
                    if(res.data.status==200){
                        
                    }
                })     
            }           
        },
        /**
         * 保存用户学习进度
         */
        savePeriodStudyRecords(learnRate,id,flag){
            let totalDuration = this.isAndroid&&this.isWx?parseInt(this.player.duration):parseInt(this.player.getDuration())
            if(parseInt(learnRate)>=totalDuration-1){
                let audioHistoryData = localStorage.getItem('audioHistoryData')?JSON.parse(localStorage.getItem('audioHistoryData')):[];
                if(audioHistoryData.length>0){
                    let courseObj = audioHistoryData.find(item=>item.courseId==this.audioData.courseId)
                    if(courseObj){
                        let obj = courseObj.periodList.find(item=>item.periodId==this.audioData.periodId)
                        if(obj){
                            obj.time = 0;
                            this.audioTime = 0;
                        }
                    }
                }
                localStorage.setItem('audioHistoryData',JSON.stringify(audioHistoryData))
            }
            else{
                this.saveHistory(learnRate)
            }
            if(this.$getCookie('uInfo')){
                let query = {
                    learnRate:learnRate?parseInt(learnRate):0,
                    periodId:id&&id!=''?id:this.audioData.periodId,
                    courseId:this.audioData.courseId,
                    netType:2
                }
                let time = 0,timer = null;
                if(flag&&flag=='realLearnRate'){
                    query.realLearnRate = this.realLearnRate;
                    time = 0;
                    timer = setInterval(()=>{
                        time++;
                    },1000)
                }
                let audioHistoryData = localStorage.getItem('audioHistoryData')
                let temp,courseObj,periodObj;
                if(audioHistoryData){
                    temp = JSON.parse(audioHistoryData);
                    courseObj = temp.find(item=>item.courseId==this.audioData.courseId);
                    periodObj = courseObj.periodList.find(item=>item.periodId==this.audioData.periodId)
                    query.studyPoint = periodObj.studyPoint.join(',');
                    query.lastStudyPoint = periodObj.time;
                }
                if(query.periodId&&query.periodId!=''){
                    this.$http.post(this.$server.savePeriodStudyRecords,query).then(res=>{
                        if(res.data.status == 200){
                            if(flag&&flag=='realLearnRate'){
                                clearInterval(timer);
                                this.realLearnRate = time;
                            }
                            periodObj.studyPoint = []
                            localStorage.setItem('audioHistoryData',JSON.stringify(temp))
                        }
                    })
                }
            }
        },
        /**
         * 保存记忆播放相关数据
         */
        saveHistory(realLearnRate){
            let learnRate = Math.ceil(realLearnRate)
            let audioHistoryData = localStorage.getItem('audioHistoryData')
            if(audioHistoryData){
                let temp = JSON.parse(audioHistoryData)
                let courseObj = temp.find(item=>item.courseId==this.audioData.courseId)
                if(courseObj){
                    let periodObj = courseObj.periodList.find(item=>item.periodId==this.audioData.periodId)
                    if(periodObj){
                        periodObj.cacheTime = new Date().getTime();
                        periodObj.time = learnRate;
                        if(periodObj.studyPoint){
                            let arr = [...periodObj.studyPoint]
                            arr.push(learnRate)
                            periodObj.studyPoint = [...new Set(arr)]
                        }else{
                            periodObj.studyPoint = [learnRate]
                        }
                        courseObj.curPeriodId = periodObj.periodId;
                        localStorage.setItem('audioHistoryData',JSON.stringify(temp))
                    }else{
                        courseObj.periodList.push({
                            periodId:this.audioData.periodId,
                            cacheTime:new Date().getTime(),
                            time:learnRate,
                            studyPoint:[learnRate]
                        })
                        courseObj.curPeriodId = this.audioData.periodId;
                        localStorage.setItem('audioHistoryData',JSON.stringify(temp))
                    }
                }else{
                    let courseObj = {
                        courseId:this.audioData.courseId,
                        periodList:[
                            {periodId:this.audioData.periodId,cacheTime:new Date().getTime(),time:learnRate,studyPoint:[learnRate]}
                        ],
                        curPeriodId:this.audioData.periodId
                    }
                    temp.push(courseObj)
                    localStorage.setItem('audioHistoryData',JSON.stringify(temp))
                }
            }else{
                audioHistoryData = [ ];
                let courseObj = {
                    courseId:this.audioData.courseId,
                    periodList:[
                        {periodId:this.audioData.periodId,cacheTime:new Date().getTime(),time:learnRate,studyPoint:[learnRate]}
                    ],
                    curPeriodId:this.audioData.periodId
                }
                audioHistoryData.push(courseObj)
                localStorage.setItem('audioHistoryData',JSON.stringify(audioHistoryData))
            }
        },
        /**
         * 查看详情
         */
        showDetails(){
            let obj = this.periodsList.find(item=>item.id==this.audioData.periodId)
            this.$router.push({
                path:'/periodIntro',
                query:{
                    period:obj
                }
            })
        },
        downloadApp(){
            if(this.isIos){
                window.location.href=`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`
                setTimeout(()=>{
                    var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
                    if(typeof hidden =="undefined" || hidden ==false){
                        window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
                    }
                }, 2500);
            }else{
                this.$toast.loading()
                let a = document.createElement('a');
                a.setAttribute('data-params', `{courseId:${this.$route.params.courseId}}`);
                a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
                a.setAttribute('data-jmlink', 'true');
                a.setAttribute('data-auto', 'false');
                document.body.appendChild(a);
                setTimeout(() => {
                    this.$toast.clear()
                    a.click();
                }, 2000);
            }
        },
        /**
         * 浏览器是否支持播放音频，如果音频文件被浏览器劫持，则判定无法播放，因为不能隐藏播放器
         */
        canPlayAudio(){
            if(this.isIos){
                let userAgent= navigator.userAgent.toLowerCase(); 
                let version=userAgent.match(/cpu iphone os (.*?) like mac os/);
                let temp = version[1].split('_')[0]
                if(temp<=9){
                    this.$dialog.confirm({
                        confirmButtonColor:"#D40015",
                        message: '当前ios版本<10.0.0，暂不支持浏览器端收听课程。是否立即前往APP？'
                    }).then(() => {
                        this.downloadApp()
                    }).catch(() => {
                        
                    });
                    return false;
                }
            }
            let ua = window.navigator.userAgent.toLowerCase()
            let uc = navigator.appVersion.split('UCBrowser/').length > 1;//uc浏览器
            let mqqbrowser = ua.includes('mqqbrowser')&&!ua.includes('micromessenger');//QQ浏览器
            let oppo = navigator.userAgent.includes('OppoBrowser');//oppo自带浏览器
            if(uc||mqqbrowser||oppo){
                this.$dialog.confirm({
                    confirmButtonColor:"#D40015",
                    message: `当前浏览器暂不支持收听，请更换浏览器收听课程，或者前往APP。是否立即前往APP？`
                }).then(() => {
                    this.downloadApp()
                }).catch(() => {
                    
                });
                return false;
            }
            let isChrome = navigator.userAgent.includes('Chrome');
            let isQQ = navigator.userAgent.includes('QQ'||'qq');
            if(coverString('HONOR',navigator.userAgent)||coverString('Honor',navigator.userAgent)||coverString('HUAWEI',navigator.userAgent)||coverString('huawei',navigator.userAgent)){
                if(this.isWx||isChrome||isQQ){
                    return true;
                }else{
                    this.$dialog.confirm({
                        confirmButtonColor:"#D40015",
                        message: '当前浏览器暂不支持收听，请更换浏览器，或者前往APP。是否立即前往APP？'
                    }).then(() => {
                        this.downloadApp()
                    }).catch(() => {
                        
                    });
                    return false;
                }
            }
            return true;
        }
    },
    beforeDestroy(){
        if(this.player!=''){
            let learnRate =this.isAndroid&&this.isWx?this.player.currentTime:this.player.getCurrentTime();
            this.savePeriodStudyRecords(learnRate,'','realLearnRate')
        }
        clearInterval(this.memoryTimer)
        clearInterval(this.realLearnRateTimer)
        clearInterval(this.saveTimer)
        clearInterval(this.timeupdateTimer)
        clearInterval(this.studyBehaviorTimer)
        document.title = '学国学网 | 专注优秀传统文化教育'
    }
}
</script>
<style>
    .appStyle{
        overflow: hidden;
        height: 100%;
    }
    .audio-component .spread .van-loading__circular circle{
        stroke-width:1!important;
    }
    @keyframes circleLoop {
        from{
            transform: rotate(0deg);
        }
        to{
            transform: rotate(360deg)
        }
    }
    #audio-container{
        height: 1rem!important;
        width: 100%;
        z-index: 98;
        position:fixed;
        bottom:-2.5rem;
        opacity: 0;
        z-index: 1;
        left: 0;
    }
</style>
<style lang="scss" scoped>
    .audio-component{
        &.hidden{
            opacity: 0;
            z-index: 1;
        }
        .shrink{
            position:fixed;
            height: 1.16rem;
            width: 100%;
            bottom:8px;
            left: 0;
            z-index: 99;
            padding:0 0.15rem;
            transition: bottom 0.1s ease-in,transform 0.3s ease-in;
            .shrink-box{
                padding: 0.14rem 0.4rem;
                background: RGBA(110, 110, 110, 0.9);
                overflow: hidden;
                border:1px solid #595958;
                border-radius: 5rem;
            }
            &.pause{
                .shrink-close,.player-btns,.audio-info{
                    transform: translateX(0);
                }
                img{
                    animation: initial!important;
                }
                .audio-info .title{
                    width: 3.36rem;
                }
            }
            &.out{
                transform: translateY(5rem);
                z-index: 9;
            }
            &.in{
                transform: translateY(0);
                z-index: 9;
            }
            .shrink-close{
                color:#fff;
                display: block;
                height:0.8rem;
                width: 0.5rem;
                // margin-right: 0.4rem;
                float: left;
                text-align: center;
                transform: translateX(-0.9rem);
                transition: transform 0.3s ease;
                i{
                    opacity: 0.6rem;
                    line-height: 0.8rem;
                    font-size: 0.5rem;
                    display: inline-block;
                }
            }
            .player-btns{
                float: left;
                height: 0.8rem;
                width: 0.8rem;
                margin-left: 0.4rem;
                padding: 0.08rem;
                border-radius: 50%;
                background: #fff;
                position: relative;
                transform: translateX(-0.9rem);
                transition: transform 0.3s ease;
                img{
                    border-radius: 50%;
                    height: 100%;
                    width: 100%;
                    animation: circleLoop 5s infinite linear 1s;
                    position: relative;
                    z-index: 2;
                }
                .player-loading{
                    position: absolute;
                    z-index: 1;
                    width: calc(0.72rem +  10px);
                    height: calc(0.72rem + 10px);
                    top:calc(0.08rem - 5px);
                    left: calc(0.08rem - 5px);
                    opacity: 0.4;
                    .van-loading__circular circle{
                        stroke-width:1;
                    }
                }
                .circle-rate{
                    position: absolute;
                    top:1px;
                    left: 1px;
                    width: calc(100% - 2px)!important;
                    height: calc(100% - 2px)!important;
                }
                .icon{
                    position: absolute;
                    z-index: 2;
                    top:50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    height: 0.36rem;
                    width: 0.36rem;
                    &.play{
                        background: url('../../assets/image/audio-play.png')no-repeat 50% 50%;
                        background-size: cover;
                    }
                    &.pause{
                        background: url('../../assets/image/audio-pause.png')no-repeat 50% 50%;
                        background-size: cover;
                    }
                }
            }
            .audio-info{
                margin-left:0.24rem;
                float: left;
                transform: translateX(-0.9rem);
                transition: transform 0.3s ease;
                .title{
                    font-size: 0.28rem;
                    margin-bottom:0.05rem;
                    color:#fff;
                    width: 4.1rem;
                }
                .time{
                    font-size: 0.24rem;
                    color:#fff;
                }
            }
            .like-area{
                text-align: center;
                position: absolute;
                right: 0.72rem;
                top:0.16rem;
                .small-player-btn{
                    font-size: 0.6rem;
                    color:#fff;
                    margin:0.1rem 0 0.02rem 0;
                }
            }
        }
        .spread{
            position: fixed;
            top:0.98rem;
            left: 0;
            height: 4.2rem;
            width: 100%;
            background: #fff;
            z-index: 2;
            display: none;
            &.show{
                z-index:3;
                display: block;
            }
            .audio-surface{
                position: absolute;
                width: 100%;
                height:100%;
                left: 50%;
                top: 50%;
                z-index: 1;
                transform: translate(-50%,-50%);
            }
            .audio-main{
                position: relative;
                z-index: 2;
                background: rgba(0,0,0,0.45);
                width: 100%;
                height:100%;
                .memory-tips{
                    position: absolute;
                    top:0.3rem;
                    left: 0;
                    width: 100%;
                    color:#fff;
                    z-index: 991;
                    text-align: center;
                    font-size: 0.24rem;
                }
                .waiting-loading{
                    height: 1.2rem;
                    width: 1.2rem;
                    position: absolute;
                    top:40%;
                    left: 50%;
                    margin:-0.6rem 0 0 -0.6rem;
                    z-index: 992;
                }
                .audio-play-btn{
                    position: absolute;
                    top:40%!important;
                    left:50%;
                    height:1.04rem;
                    width: 1.04rem;
                    margin:-0.52rem 0 0 -0.52rem;
                    .player-btn{
                        display: block;
                        width: 100%;
                        height: 100%;
                        &.play{
                            background: url('../../assets/image/player_btn.png')no-repeat 50% 50%;
                            background-size: cover;
                        }
                        &.pause{
                            background: url('../../assets/image/pause.png')no-repeat 50% 50%;
                            background-size: cover;
                        }
                    }
                }
                    .audio-controls{
                        position: absolute;
                        width: 100%;
                        height: 1rem;
                        bottom:0;
                        left: 0;
                        .t{
                            padding: 0.22rem 0;
                            position: absolute;
                            bottom:0.75rem;
                            left: 0;
                            width: 100%;
                        }
                        .process{
                            width: 5.26rem;
                            height: 2px;
                            margin:0 auto;
                            padding: 0 0.25rem;
                            position: relative;
                            &::before{
                                position: absolute;
                                content:'';
                                width: 0.5rem;
                                height: 2px;
                                top:0;
                                left: -0.25rem;
                                display: block;
                                background: #f4f4f4;
                                z-index: 0;
                            }
                            &::after{
                                position: absolute;
                                content:'';
                                width: 0.5rem;
                                height: 2px;
                                top:0;
                                right: -0.25rem;
                                display: block;
                                background: #F4F4F4;
                                z-index: 0;
                            }
                            .bar-btn{
                                background: #B4272D;
                                color:#fff;
                                border-radius: 25px;
                                position: relative;
                                padding: 0 6px;
                                box-sizing: content-box;
                                &.big{
                                    position: absolute;
                                    bottom:0.4rem;
                                    left: 0;
                                    padding:0.2rem;
                                    z-index: 3;
                                }
                            }
                        }
                        .prve{
                            width: 0.48rem;
                            height: 0.48rem;
                            padding:0.12rem;
                            position: absolute;
                            top:0;
                            left: 0.24rem;
                            i{
                                display: block;
                                height: 100%;
                                width: 100%;
                                background: url('../../assets/image/prev.png')no-repeat 50% 50% / cover;
                            }
                        }
                        .next{
                            width: 0.48rem;
                            height: 0.48rem;
                            padding:0.12rem;
                            position: absolute;
                            top:0;
                            right: 0.24rem;
                            i{
                                display: block;
                                height: 100%;
                                width: 100%;
                                background: url('../../assets/image/next.png')no-repeat 50% 50% / cover;
                            }
                        }
                        .b{
                            position: absolute;
                            bottom:0;
                            left: 0;
                            width: 100%;
                            .duration{
                                position: absolute;
                                font-size: 0.24rem;
                                color:#FFFFFF;
                                left: 0.3rem;
                                bottom:0.2rem;
                            }
                            .control-btns{
                                position: absolute;
                                right: 0.27rem;
                                bottom:0.15rem;
                                font-size: 0;
                                .speed-area{
                                    height: 0.4rem;
                                    min-width: 0.44rem;
                                    display: inline-block;
                                    vertical-align: middle;
                                    position: relative;
                                    .cur-speed{
                                        color:#fff;
                                        font-size: 0.24rem;
                                        padding: 0 0.1rem;
                                        background: url('../../assets/image/cur-speed.png')no-repeat 50% 50%;
                                        background-size: 95% 110%;
                                        text-align: center;
                                        position: relative;
                                        height: 0.4rem;
                                        line-height: 0.4rem;
                                    }
                                    .list{
                                        position: absolute;
                                        right: 0.8rem;
                                        top:0;
                                        display: flex;
                                        transform-origin:right;
                                        transition: all 0.3s;
                                        .speed-item{
                                            &.normal{
                                                p{
                                                    width: 0.7rem;
                                                    text-align: center;
                                                }
                                            }
                                            &.active{
                                                p{
                                                    color:#C30D23;    
                                                }
                                            }
                                            p{
                                                padding: 0 0.05rem;
                                                font-size: 0.24rem;
                                                background:#2d2d2d;
                                                color:#fff;
                                                border-right: 1px solid #888888;
                                                line-height: 0.4rem;
                                            }
                                            &:last-child{
                                                p{
                                                    border:none;
                                                }
                                            }
                                        }
                                        &.open{
                                            transform: scaleX(1);
                                        }
                                        &.close{
                                            transform: scaleX(0);
                                        }
                                    }
                                }
                                .details{
                                    margin-left: 0.1rem;
                                    display: inline-block;
                                    vertical-align: middle;
                                    display: none;
                                    i{
                                        width: 0.48rem;
                                        height: 0.48rem;
                                        display: block;
                                        // background: url('./assets/content.png')no-repeat 50% 50%/cover;
                                    }
                                }
                                .loop-btn{
                                    margin-left: 0.1rem;
                                    display: inline-block;
                                    vertical-align: middle;
                                    i{
                                        width: 0.48rem;
                                        height: 0.48rem;
                                        display: block;
                                        background: url('../../assets/image/no-loop.png')no-repeat 50% 50%/cover;
                                    }
                                    &.loop{
                                        i{
                                            background: url('../../assets/image/loop.png')no-repeat 50% 50%/cover;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .control{
                    display: flex;
                    justify-content:space-between;
                    align-items:center;
                    padding: 0.5rem 0;
                    position: relative;
                    .control-item{
                        width: 0.8rem;
                        height: 0.8rem;
                        padding: 0.2rem;
                        position: relative;
                        &.player{
                            width: 1.77rem;
                            height: 1.77rem;
                            .player-loading{
                                position: absolute;
                                width: calc(1.37rem + 10px);
                                height: calc(1.37rem + 10px);
                                top:calc(0.2rem - 7px);
                                left: calc(0.2rem - 5px);
                                opacity: 0.5;
                                .van-loading__circular circle{
                                    stroke-width:1;
                                }
                            }
                        }
                    }
                    i{
                        display: block;
                        height: 100%;
                        box-sizing: content-box;
                        &.loop-btn{
                            background: url('../../assets/image/no-loop.png')no-repeat 50% 50%;
                            background-size: cover;
                            transition: transform 0.1s linear;
                            &.loop{
                                background: url('../../assets/image/loop.png')no-repeat 50% 50%;
                                background-size: cover;
                            }
                            &.enlarge{
                                transform: scale(2);
                            }
                        }
                        &.prve-btn{
                            &.can{
                                background: url('../../assets/image/prev-1.png')no-repeat 50% 50%;
                                background-size: cover;
                            }
                            &.cancel{
                                background: url('../../assets/image/prev-2.png')no-repeat 50% 50%;
                                background-size: cover;
                            }
                        }
                        &.player-btn{
                            &.play{
                                background: url('../../assets/image/big-play.png')no-repeat 50% 50%/cover;
                            }
                            &.pause{
                                background: url('../../assets/image/big-pause.png')no-repeat 50% 50%/cover;
                            }
                        }
                        &.next-btn{
                            &.can{
                                background: url('../../assets/image/next-1.png')no-repeat 50% 50%;
                                background-size: cover;
                            }
                            &.cancel{
                                background: url('../../assets/image/next-2.png')no-repeat 50% 50%;
                                background-size: cover;
                            }
                        }
                        &.zan-btn{
                            &.like{
                                background: url('../../assets/image/zan-1.png')no-repeat 50% 50%;
                                background-size: cover;
                            }
                            background: url('../../assets/image/zan-2.png')no-repeat 50% 50%;
                            background-size: cover;
                            transition: transform 0.1s linear;
                            &.enlarge{
                                transform: scale(2);
                            }
                        }
                    }
                }
                .period-title{
                    font-size: 0.28rem;
                    color:#000;
                    text-align: center;
                }
            
            .share-wrap{
                position: absolute;
                top:0;
                left: 0;
                z-index: 101;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                visibility: hidden;
                opacity: 0;
                transition: all 0.3s;
                &.show{
                    visibility: visible;
                    opacity: 1;
                }
                .share-box{
                    position: absolute;
                    width: 100%;
                    bottom:0;
                    left: 0;
                    height: 3.7rem;
                    .share-area{
                        background: rgba(255,255, 255, 0.85);
                        height: 2.7rem;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        text-align: center;
                        img{
                            width: .7rem;
                            height: .7rem;
                        }
                        p{
                            margin-top: .15rem;
                            color: #9A9A9A;
                            font-size: .26rem;
                        }
                    }
                    .share-btn{
                        text-align: center;
                        line-height: 1rem;
                        height: 1rem;
                        color:#CACACA;
                        font-size: 0.32rem;
                        background: #fff;
                        letter-spacing: 1px;
                    }
                }
            }
        }
    }
</style>
