<template>
    <div id="video-boxs">
        <div class="player-olympic" ref="playerTemp" @click.stop="showVideoBar">
            <van-loading color="#B4272D" class="video-loading" v-if="isAndroid&&isWx" v-show="videoLoading"/>
            <div class="player-controls normal" v-if="isAndroid&&isWx">
                <div class="player-controls-components">
                    <div class="player-btn" :class="playerFlag?'pause':'play'" @click="playEvent($event)"><i></i></div>
                    <div class="process-bar" :class="{'full':fullscreenFlag}">
                        <van-slider v-model="processCurValue" active-color="#B4272D" @change="getCurValue" @touchstart.native="touchProcess">
                            <div slot="button" class="bar-btn" ref="barBtn"></div>
                        </van-slider>
                    </div>
                    <div class="video-time"><p>{{ curDuration }}/{{totalDuration}}</p></div>
                    <div class="quality" v-if="fullscreenFlag">
                        <p class="cur-quality" @click="openQualityFlag=!openQualityFlag">{{curQuality}}</p>
                        <ul class="quality-list" v-show="openQualityFlag">
                            <li :class="{'active':definitionType==1}" @click="swithQualityEvent(1)">流畅</li>
                            <li :class="{'active':definitionType==2}" @click="swithQualityEvent(2)">标清</li>
                            <li :class="{'active':definitionType==3}" @click="swithQualityEvent(3)">高清</li>
                        </ul>
                    </div>
                    <div class="speed" v-if="fullscreenFlag">
                        <p class="cur-speed" @click="openSpeedFlag=!openSpeedFlag">{{speed==1?'正常':speed+'倍'}}</p>
                        <ul class="speed-list" v-show="openSpeedFlag">
                            <li :class="{'active':speed==1}" @click="switchSpeed(1)">1X</li>
                            <li :class="{'active':speed==0.5}" @click="switchSpeed(0.5)">0.5X</li>
                            <li :class="{'active':speed==2}" @click="switchSpeed(2)">2X</li>
                        </ul>
                    </div>
                    <div class="full-btn" @click="fullBtn">
                        <van-icon name="shrink" v-if="fullscreenFlag"/>
                        <van-icon name="expand-o" v-else/>
                    </div>
                </div>
            </div>
            <video id="player-con" class="andriod-player" v-if="isAndroid&&isWx" x-webkit-airplay="true" preload="auto" playsinline="true" webkit-playsinline x5-video-player-type="h5" x5-playsinline="true" x5-video-player-fullscreen="true"></video>
            <video id="player-con" v-if="isAndroid&&mqqbrowser" ref="andriodPlayer" class="andriod-player" controls="controls" preload="auto" webkit-playsinline="true" playsinline="true" x5-playsinline="true" :src="source"></video>
            <div id="player-con" v-if="!((isAndroid&&isWx)||(isAndroid&&mqqbrowser))"></div>
        </div>
        <p class="memory-tips" v-if="timeText.length>0">您上次观看至{{timeText}}处</p>
        <div class="player-end-dialog" v-if="endedFlag">
            <p class="restart-btn" @click="rePlayEvent">重新播放</p>
            <p class="next-btn" @click="nextEvent" v-if="nextBtnFlag">播放下一节</p>
            <p class="prev-btn" @click="prevEvent" v-if="prevBtnFlag">播放上一节</p>
        </div>
    </div>
</template>

<script>
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
}
import {mapActions,mapState} from 'vuex'
import Hls from 'hls.js';
export default {
    props:['sourceData','startPlay','mqqbrowser','haveCourse','periodListTemp','currentPeriodId'],
    data() {
        return {
            source:'',//资源地址
            time:0,//播放进度
            isSeekMemoryTime:false,//是否初始化了记忆播放进度
            timeText:'',//记忆播放提示
            delayTimer:null,//删除记忆播放的提示timer
            timer:null,//记忆播放的timer 
            saveTimer:null,//保存学习进度的timer
            temp:'',
            hideTimer:null,
            definitionType:1,//清晰度
            speed:1,//自定义播放速度
            player:'',//播放器容器
            playing:false,//是否在播放中的状态
            getNewUrl:false,//是否获取了新的播放地址
            playerFlag:false,//按钮播放/暂停
            isAndroid:false,//是安卓？
            processCurValue:0,
            totalDuration:'00:00',
            processTotalValue:0,
            videoLoading:false,
            realLearnRate:0,//打开播放器，用户在页面停留的时间
            realLearnRateTimer:null,
            studyBehaviorTimer:null,
            studyDuration:0,
            switchQualityFlag:false,//是否切换了清晰度
            periodsList:[],
            getTrySeePeriodListFlag:false,
            endedFlag:false,
            fullscreenFlag:false,
            openQualityFlag:false,//安卓微信自定义清晰度list的打开/收起
            openSpeedFlag:false,//安卓微信自定义速率list的打开/收起
            isStartPlayInAndriodWx:false,//安卓微信开始播放后才能开启全屏功能
            screenW:0,
            screenH:0,
        }
    },
    computed:{
        ...mapState(['audioData','knowledgeIdInCourse','isIos','lastStudyPoint','isWx']),
        curDuration(){
            // if(this.$refs.barBtn&&this.$refs.barBtn.getBoundingClientRect()){
            //     setTimeout(()=>{
            //         let left = this.$refs.barBtn.getBoundingClientRect().left;
            //         this.offsetLeft = `calc(${left}px - 0.5rem)`
            //     },1)
            // }
            let temp = Math.round(this.processTotalValue*(this.processCurValue/100))
            this.curDurationTemp = temp>this.processTotalValue?this.processTotalValue:temp;
            const time = isNaN(this.curDurationTemp)?0:this.curDurationTemp
            return formatSeconds(time)
        },
        nextBtnFlag(){
            const index = this.periodsList.findIndex(item=>item.id==this.sourceData.periodId)
            return index!=this.periodsList.length-1&&this.periodsList.length>1;
        },
        prevBtnFlag(){
            const index = this.periodsList.findIndex(item=>item.id==this.sourceData.periodId)
            return index==this.periodsList.length-1&&this.periodsList.length>1;
        },
        curQuality(){
            const sourceFormat = ['流畅','标清','高清'];
            const index = Number(this.definitionType) - 1;
            return sourceFormat[index]
        }
	},
    watch: {
        source(now,old){
            if(this.isAndroid&&this.mqqbrowser) return;
            this.createPlayer();
        },
        startPlay(cur,old){ 
            if(cur){
                this.time = 0;
                this.timeText = '';
                clearTimeout(this.delayTimer)
                if(this.knowledgeIdInCourse&&this.knowledgeIdInCourse!=''){
                    //不处理
                }else{
                    let videoHistoryData = localStorage.getItem('videoHistoryData')?JSON.parse(localStorage.getItem('videoHistoryData')):[];
                    if(videoHistoryData.length>0){
                        let courseObj = videoHistoryData.find(item=>item.courseId==this.sourceData.courseId)
                        if(courseObj){
                            let obj = courseObj.periodList.find(item=>item.periodId==this.sourceData.periodId)
                            if(obj&&obj.time){
                                this.temp = this.time = obj.time;
                                this.timeText = obj.time>0?formatSeconds(obj.time):''
                                this.delayTimer = setTimeout(()=>{
                                    this.timeText = ''
                                },5000)
                            }
                        }
                    }
                }
                let timer = setInterval(()=>{
                    if(this.getNewUrl){
                        this.getNewUrl = false;
                        if(this.audioData.show&&this.audioData.periodId){
                            clearInterval(timer);
                            return false;
                        }
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
                        this.player.play()
                        clearInterval(timer);
                    }
                },1000)
            }
        },
        sourceData:{
            handler(cur,old){
                if(cur.shareUserId){
                    this.getResoursePlayUrl(cur.shareUserId)
                }else{
                    this.getResoursePlayUrl()
                }
            },
            deep:true
        },
        knowledgeIdInCourse(cur,old){
            if(cur!='')
                this.getResoursePlayUrl();
        },
        haveCourse:{
            handler(cur){
                if(cur){
                    this.periodsList = [...this.periodListTemp];
                }else{
                    this.getTrySeePeriodList()
                }
            },
            immediate:true
        }
    },
    created() {       
        this.isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1;
        if(this.knowledgeIdInCourse&&this.knowledgeIdInCourse!=''){
            this.getResoursePlayUrl()
        }else{
            if(this.sourceData.periodId){
                if(this.lastStudyPoint&&this.lastStudyPoint>=0){
                    if(this.lastStudyPoint>=(this.sourceData.cur.targetDuration-5)){
                        this.temp = this.time = 0;
                    }else{
                        this.temp = this.time = this.lastStudyPoint;
                    }
                    this.timeText = this.time>0?formatSeconds(this.time):''
                    this.delayTimer = setTimeout(()=>{
                        this.timeText = ''
                    },5000)
                }else{
                    const videoHistoryData = localStorage.getItem('videoHistoryData')?JSON.parse(localStorage.getItem('videoHistoryData')):[];
                    if(videoHistoryData.length>0){
                        const courseObj = videoHistoryData.find(item=>item.courseId==this.sourceData.courseId)
                        if(courseObj){
                            const obj = courseObj.periodList.find(item=>item.periodId==this.sourceData.periodId)
                            if(obj&&obj.time){
                                this.temp = this.time = obj.time;
                                this.timeText = this.time>0?formatSeconds(this.time):''
                                this.delayTimer = setTimeout(()=>{
                                    this.timeText = ''
                                },5000)
                            }
                        }
                    }
                }
                if(this.sourceData.shareUserId){
                    this.getResoursePlayUrl(this.sourceData.shareUserId)
                }else{
                    this.getResoursePlayUrl()
                }
            }
        }
        let timer = setInterval(()=>{
            if(this.getNewUrl){
                this.getNewUrl = false;
                if(this.audioData.show&&this.audioData.periodId){
                    clearInterval(timer);
                    return false;
                }
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
                this.player.play()
                clearInterval(timer);
            }
        },1000)
        this.definitionType = Number(localStorage.getItem('definitionType'))||1;
    },
    mounted(){
        this.realLearnRateTimer = setInterval(()=>{
            this.realLearnRate++;
        },1000)
        this.$nextTick(()=>{
            if(this.isAndroid&&this.mqqbrowser){
                this.player = this.$refs.andriodPlayer;
            }
        })
        this.screenW = window.screen.width;
        this.screenH = window.screen.height;
        document.addEventListener('fullscreenchange', e => {
            if(this.fullscreenFlag){
                this.exitFullscreen();
            }else{
                this.enterFullscreen();
            }
        })
    },
    methods: {
        ...mapActions(['setAudioData','setKnowledgeIdInCourse','setPlayVideoFlag']),
        showVideoBar(){
            clearTimeout(this.hideTimer)
            const dom = document.querySelector('.prism-controlbar')
            if(dom){
                dom.style.display = 'block';
            }
            const dom1 = document.querySelector('.player-controls')
			if(dom1){
				dom1.style.display = 'block';
            }
            const dom2 = document.querySelector('.course-header')
			if(dom2){
				dom2.style.visibility = 'visible';
            }
            this.hideTimer = setTimeout(()=>{
                let dom = document.querySelector('.player-controls')
                if(dom){
                    dom.style.display = 'none';
                }
                let dom2 = document.querySelector('.course-header')
                if(dom2){
                    dom2.style.visibility = 'hidden';
                }
            },3000)
        },
        /**
         * 保存用户学习路径
         */
        saveStudyBehavior(){
            if (this.$getCookie('uInfo')) {
                clearInterval(this.studyBehaviorTimer);
                const query = {
                    courseId:this.sourceData.courseId,
                    type:4,
                    studyDuration:this.studyDuration,
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
        savePeriodStudyRecords(learnRate,flag){
            if(this.$getCookie('uInfo')){
                if(this.sourceData.periodId&&this.sourceData.courseId){
                    let query = {
                        learnRate:parseInt(learnRate),
                        periodId:this.sourceData.periodId,
                        courseId:this.sourceData.courseId,
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
                    let videoHistoryData = localStorage.getItem('videoHistoryData')
                    let temp,courseObj,periodObj;
                    if(videoHistoryData){
                        temp = JSON.parse(videoHistoryData);
                        courseObj = temp.find(item=>item.courseId==this.sourceData.courseId);
                        periodObj = courseObj.periodList.find(item=>item.periodId==this.sourceData.periodId)
                        if(!periodObj.studyPoint) return;
                        query.studyPoint = periodObj.studyPoint.join(',');
                        query.lastStudyPoint = periodObj.time;
                    }
                    this.$http.post(this.$server.savePeriodStudyRecords,query).then(res=>{
                        if(res.data.status == 200){
                            if(flag&&flag=='realLearnRate'){
                                clearInterval(timer);
                                this.realLearnRate = time;
                            }
                            periodObj.studyPoint = []
                            localStorage.setItem('videoHistoryData',JSON.stringify(temp))
                        }
                    })
                }
            }
        },
        /**
         * 保存记忆播放相关数据
         */
        saveHistory(realLearnRate){
            if(this.knowledgeIdInCourse!='') return false;
            let learnRate = Math.ceil(realLearnRate)
            let videoHistoryData = localStorage.getItem('videoHistoryData')
            if(videoHistoryData){
                let temp = JSON.parse(videoHistoryData)
                let courseObj = temp.find(item=>item.courseId==this.sourceData.courseId)
                if(courseObj){
                    let periodObj = courseObj.periodList.find(item=>item.periodId==this.sourceData.periodId)
                    if(periodObj){
                        if(learnRate>=0){
                            periodObj.cacheTime = new Date().getTime();
                            periodObj.time = learnRate;
                            if(periodObj.studyPoint){
                                let arr = [...periodObj.studyPoint]
                                arr.push(learnRate)
                                periodObj.studyPoint = [...new Set(arr)]
                            }else{
                                periodObj.studyPoint = [learnRate]
                            }
                        }
                        courseObj.curPeriodId = periodObj.periodId;
                        localStorage.setItem('videoHistoryData',JSON.stringify(temp))
                    }else{
                        let obj = {
                            periodId:this.sourceData.periodId,
                        }
                        if(learnRate>=0){
                            obj.cacheTime = new Date().getTime();
                            obj.time = learnRate;
                            obj.studyPoint = [learnRate] 
                        }
                        courseObj.periodList.push(obj)
                        courseObj.curPeriodId = this.sourceData.periodId;
                        localStorage.setItem('videoHistoryData',JSON.stringify(temp))
                    }
                }else{
                    let courseObj = {
                        courseId:this.sourceData.courseId,
                        periodList:[],
                        curPeriodId:this.sourceData.periodId
                    }
                    if(learnRate>=0){
                        courseObj.periodList.push(
                            {periodId:this.sourceData.periodId,cacheTime:new Date().getTime(),time:learnRate,studyPoint:[learnRate]}
                        )
                    }
                    temp.push(courseObj)
                    localStorage.setItem('videoHistoryData',JSON.stringify(temp))
                }
            }else{
                videoHistoryData = [ ];
                let courseObj = {
                    courseId:this.sourceData.courseId,
                    periodList:[],
                    curPeriodId:this.sourceData.periodId
                }
                if(learnRate>=0){
                    courseObj.periodList.push(
                        {periodId:this.sourceData.periodId,cacheTime:new Date().getTime(),time:learnRate,studyPoint:[learnRate]}
                    )
                }
                videoHistoryData.push(courseObj)
                localStorage.setItem('videoHistoryData',JSON.stringify(videoHistoryData))
            }
        },
        /**
         * 获取视频地址
         */
        getResoursePlayUrl(shareUserId){
            if(this.knowledgeIdInCourse&&this.knowledgeIdInCourse!=''){
                let query = {
                    definitionType:1,
                    shortVideoId:this.knowledgeIdInCourse,
                    courseId:Number(this.$route.params.courseId)
                }
                this.$http.post(this.$server.getResPlayUrlForShortVideo,query).then(res=>{
                    if(res.data.status==200){
                        this.source = res.data.content.resAddress
                        this.getNewUrl = true;
                        this.$emit('update:startPlay',false)
                        this.$nextTick(()=>{
                            this.$emit('update:startPlay',true)
                        })
                    }else{
                        this.setKnowledgeIdInCourse('')
                    }
                })
            }else{
                this.definitionType = Number(localStorage.getItem('definitionType'))||1
                let query = {
                    definitionType:this.definitionType,
                    periodId:this.sourceData.periodId,
                    courseId:this.sourceData.courseId
                }
                if(shareUserId){
                    query.shareUserId = shareUserId;
                }
                this.$http.post(this.$server.getResoursePlayUrl,query).then(res=>{
                    if(res.data.status ==200){
                        this.source = res.data.content
                        if(this.isAndroid&&this.mqqbrowser){
                            this.getNewUrl = true;
                        }
                    }
                })
            }
        },
        /**
         * 切换视频
         */
        switchQuality(){
            let learnRate = this.time;
            this.savePeriodStudyRecords(learnRate,'realLearnRate')
            const dom1 = document.querySelector('.prism-setting-quality'),dom2 = document.querySelector('.prism-quality-selector');
            if(dom1){
                dom1.removeEventListener("click",this.addQualityBtn)
            }
            if(dom2){
                dom2.removeEventListener("click",this.addQualityEvent)
            }
            if(this.sourceData.shareUserId){
                this.getResoursePlayUrl(this.sourceData.shareUserId)
            }else{
                this.getResoursePlayUrl()
            }
            this.switchQualityFlag = true;
        },
        isPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                        "SymbianOS", "Windows Phone",
                        "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },           
        createPlayer(){
            if(this.isPC()){
                this.createPlayerInIos()
                return;
            }
            if(this.isAndroid&&this.isWx){
                this.createPlayerInAndroid()
            }else{
                this.createPlayerInIos()
            }
        },
        createPlayerInAndroid(){
            this.saveHistory(-1)
            clearInterval(this.timer)
            clearInterval(this.saveTimer)
            this.timer = setInterval(()=>{
                if(this.player!=''&&this.player!=undefined){
                    if(this.player.currentTime&&this.playing){
                        this.saveHistory(this.player.currentTime)
                    }
                }
            },1000)
            this.saveTimer = setInterval(()=>{
                if(this.player!=''&&this.player!=undefined){
                    if(this.player.currentTime&&this.playing){
                        this.savePeriodStudyRecords(this.player.currentTime,'realLearnRate')
                    }
                }
            },5000)
            //销毁
            if(this.player!=''){
                this.player.pause()
                let parent = document.querySelector(".player-olympic");
                parent.removeChild(document.querySelector("#player-con"));
                let child = document.createElement("video");
                child.setAttribute('id','player-con');
                child.setAttribute('poster',this.img)
                child.setAttribute('class','andriod-player')
                parent.appendChild(child)
                this.player = child
            }else{
                this.player = document.querySelector("#player-con")
                this.player.setAttribute('poster',this.img)
            }
            var temp = this.time;
            if(Hls.isSupported()){
                let hls = new Hls();
                hls.loadSource(this.source);
                hls.attachMedia(this.player);
                hls.on(Hls.Events.MANIFEST_PARSED,()=>{
                    this.getNewUrl = true;
                    setTimeout(() => {
                        if(temp>0){
                            this.player.currentTime = temp;
                        }
                    }, 100);
                })
                if(this.switchQualityFlag){
                    this.player.play();
                    this.switchQualityFlag = false;
                }
                this.player.addEventListener('play',(e)=>{
                    this.setAudioData({})
                    this.playerFlag = true;
                    this.videoLoading = false;
                    clearTimeout(this.hideTimer)
                    this.hideTimer = setTimeout(()=>{
                        let dom = document.querySelector('.player-controls')
                        if(dom){
                            dom.style.display = 'none';
                        }
                        let dom2 = document.querySelector('.course-header')
                        if(dom2){
                            dom2.style.visibility = 'hidden';
                        }
                    },3000)
                })
                this.player.addEventListener('playing',(e)=>{
                    clearTimeout(this.hideTimer)
                    this.hideTimer = setTimeout(()=>{
                        let dom = document.querySelector('.player-controls')
                        if(dom){
                            dom.style.display = 'none';
                        }
                        let dom2 = document.querySelector('.course-header')
                        if(dom2){
                            dom2.style.visibility = 'hidden';
                        }
                    },3000)
                    this.playing = true;
                    this.videoLoading = false;
                    this.time = this.player.currentTime;
                    this.savePeriodStudyRecords(this.time,'realLearnRate')
                    if(this.$getCookie('uInfo')){
                        clearInterval(this.studyBehaviorTimer);
                        this.studyBehaviorTimer = setInterval(()=>{
                            this.studyDuration++;
                        },1000)
                    }
                    this.isStartPlayInAndriodWx = true;
                })
                this.player.addEventListener('waiting',(e)=>{
                    this.playing = false;
                    this.videoLoading = true;
                })
                this.player.addEventListener('canplay',(e)=>{
                    this.processTotalValue = parseInt(this.player.duration)
                    this.totalDuration = formatSeconds(this.player.duration)
                    let learnRate = this.player.currentTime;
                    if(this.temp>0){
                        if(learnRate<temp){
                            this.player.currentTime = this.temp;
                            this.temp = 0;
                        }
                    }
                    this.playing = true;
                    this.videoLoading = false;
                    this.time = this.player.currentTime;
                })
                this.player.addEventListener('error',(e)=>{
                    this.playing = false;
                    this.videoLoading = false;
                })
                this.player.addEventListener('pause',(e)=>{
                    clearTimeout(this.hideTimer)
                    this.time = this.player.currentTime;
                    this.savePeriodStudyRecords(this.time)
                    this.saveStudyBehavior()
                    this.playing = false;
                    this.playerFlag = false
                    this.videoLoading = false;
                })
                this.player.addEventListener('ended',(e)=>{
                    this.time = this.player.currentTime;
                    this.savePeriodStudyRecords(this.time)
                    this.playerFlag = false
                    this.videoLoading = false;
                    this.saveHistory(0);
                    this.endedFlag = true;
                })
                this.player.addEventListener('seeked',(e)=>{
                    this.time = this.player.currentTime;
                    this.saveHistory(this.player.currentTime)
                    this.videoLoading = true;
                    clearTimeout(this.hideTimer)
                    this.hideTimer = setTimeout(()=>{
                        let dom = document.querySelector('.player-controls')
                        if(dom){
                            dom.style.display = 'none';
                        }
                        let dom2 = document.querySelector('.course-header')
                        if(dom2){
                            dom2.style.visibility = 'hidden';
                        }
                    },3000)
                })
                this.player.addEventListener('seeking',()=>{
                    clearTimeout(this.hideTimer)
                })
                this.player.addEventListener('timeupdate',()=>{
                    this.videoLoading = false;
                    let curTime = Math.round(this.player.currentTime)-1;
                    this.processCurValue = curTime/this.processTotalValue*100;
                    this.startProcess();
                })
            }
        },
        createPlayerInIos(){
            this.saveHistory(-1)
            clearInterval(this.timer)
            clearInterval(this.saveTimer)
            this.timer = setInterval(()=>{
                if(this.player!=''&&this.player!=undefined){
                    if(this.player.getCurrentTime()&&this.playing){
                        this.saveHistory(this.player.getCurrentTime())
                    }
                }
            },1000)
            this.saveTimer = setInterval(()=>{
                if(this.player!=''&&this.player!=undefined){
                    if(this.player.getCurrentTime()&&this.playing){
                        this.savePeriodStudyRecords(this.player.getCurrentTime(),'realLearnRate')
                    }
                }
            },5000)
            if(this.player!=''){
                document.querySelector('#player-con').innerHTML=''
                this.player.dispose();
                this.player = ''
            }
            if (document.getElementById("player-con") === null) {
                try {
                    let playerDomWrap = this.$refs.playerTemp;
                    let playerDom = document.createElement("div");
                    playerDom.setAttribute("id", "player-con");
                    playerDomWrap.appendChild(playerDom);
                } catch (e) {
                    this.$toast("播放视频失败，请稍后重试");
                }
            }
            if(!this.img){
                this.img = this.sourceData.targetImg;
            }
            let props = {
                id: "player-con",
                width: "100%",
                height: "4.2rem",
                preload:false,
                source:this.source,
                isLive: false,
                mediaType:'video',
                rePlay:false,
                playsinline:true,
                extraInfo:{
                    "x5-playsinline":"true"
                },
                autoplay:false,
                x5_type:"h5",
                x5_video_position:'top',
                x5_fullscreen:false,
                controlBarVisibility:'always',
                cover:this.img||null
            };
            let player = new Aliplayer(props,(player)=>{
                this.getNewUrl = true;
                document.querySelector('.prism-setting-quality').addEventListener("click",this.addQualityBtn,false)
                document.querySelector('.prism-quality-selector').addEventListener("click",this.addQualityEvent,false)
                if(this.$getCookie('uInfo')){
                    clearInterval(this.studyBehaviorTimer);
                    this.studyBehaviorTimer = setInterval(()=>{
                        this.studyDuration++;
                    },1000)
                }
                if(this.switchQualityFlag){
                    player.play();
                    this.switchQualityFlag = false;
                }
            });
            player.on('play',(e)=>{
                this.setAudioData({})
                if(this.stopMinVideoStore){
                    this.setStopMinVideoEven(false);
                }
            })
            player.on('playing',(e)=>{
                if(this.temp>0){
                    player.seek(this.temp);
                    this.temp = 0;
                }
                this.time = player.getCurrentTime();
                this.savePeriodStudyRecords(this.time,'realLearnRate')
                this.playing = true;
                if(this.$getCookie('uInfo')){
                    clearInterval(this.studyBehaviorTimer);
                    this.studyBehaviorTimer = setInterval(()=>{
                        this.studyDuration++;
                    },1000)
                }
            })
            player.on('waiting',(e)=>{
                this.playing = false;
            })
            player.on('canplay',(e)=>{
                let learnRate = player.getCurrentTime();
                if(this.temp>0){
                    if(learnRate<this.temp){
                        player.seek(this.temp);
                        this.temp = -1;
                    }
                }
                this.playing = true;
                this.time = player.getCurrentTime();
            })
            player.on('error',(e)=>{
                this.timeText = ''
                this.playing = false;
                this.$dialog.confirm({
                    confirmButtonColor:"#D40015",
                    message: `播放出错啦，请更换浏览器观看课程，或者前往APP。是否立即前往APP？`
                }).then(() => {
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
                }).catch(() => {
                    
                });
            })
            player.on('pause',(e)=>{
                this.time = player.getCurrentTime();
                this.savePeriodStudyRecords(this.time)
                this.saveStudyBehavior()
                this.playing = false;
            })
            player.on('ended',(e)=>{
                this.time = player.getCurrentTime();
                this.savePeriodStudyRecords(this.time)
                this.saveHistory(0);
                this.endedFlag = true;
            })
            player.on('completeSeek',(e)=>{
                this.time = player.getCurrentTime();
                this.saveHistory(player.getCurrentTime())
            })
            this.player = player;
        },
        /**
         * 自定义视频清晰度切换组件
         */
        addQualityBtn(){
            let sourceFormat=['流畅','标清','高清']
            let parentDom = document.querySelector('.prism-quality-selector .selector-list');
            parentDom.classList.add("my-setting")
            let html = ''
            for(let i in sourceFormat){
                if(i == this.definitionType-1)
                    html+=`<li class="my-set-quality active" data-quality=${i+1}><span class="my-set-quality">${sourceFormat[i]}</span></li>`
                else
                    html+=`<li class="my-set-quality" data-quality=${i+1}><span class="my-set-quality">${sourceFormat[i]}</span></li>`
            }
            setTimeout(()=>{
                parentDom.innerHTML = html
            },0)
        },
        /**
         * 自定义视频清晰度切换事件
         */
        addQualityEvent(e){
            let ref = e.target||e.srcElement;
            if(ref.className.includes('my-set-quality')){
                let current = ref.nodeName.toLocaleLowerCase()=='span'?ref.parentNode:ref;
                if(this.definitionType == Number(current.getAttribute('data-quality'))){
                    return false;
                }
                this.definitionType = Number(current.getAttribute('data-quality'));
                localStorage.setItem('definitionType',this.definitionType)
                this.time = this.isAndroid&&this.isWx?this.player.currentTime:this.player.getCurrentTime();
                this.switchQuality()
            }
        },
        /**
         * 安卓微信自定义切换清晰度
         */
        swithQualityEvent(definitionType){
            this.openQualityFlag = false;
            if(this.definitionType == definitionType){
                return;
            }
            this.definitionType = definitionType;
            localStorage.setItem('definitionType',this.definitionType);
            this.time = this.isAndroid&&this.isWx?this.player.currentTime:this.player.getCurrentTime();
            this.videoLoading = true;
            this.switchQuality()
        },
        /**
         * 安卓微信自定义切换速率
         */
        switchSpeed(speed){
            this.openSpeedFlag = false;
            this.speed = speed;
            this.player.playbackRate = speed;
        },
        playEvent(e){
            e && e.stopPropagation();
            if(this.playerFlag){
                this.playerFlag = false;
                this.player.pause();
                return false;
            }else{
                this.playerFlag = true;
                this.player.play();
                return false;
            }
        },
        getCurValue(value){
            let temp = value*this.processTotalValue/100;
            if(isNaN(temp))return;
            if(this.isAndroid&&this.isWx){
                this.player.currentTime = temp
            }else{
                this.player.seek(temp)
            }
            this.player.play();
        },
        touchProcess(){

        },
        startProcess(){
            this.processCurValue = Number((((this.processCurValue*100)+(100/this.processTotalValue*100))/100).toFixed(2));
        },
        fullBtn(){
            if(!this.isStartPlayInAndriodWx){
                this.$toast('视频播放后才能开启全屏');
                return;
            }
            if(this.fullscreenFlag){
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                }
            }else{
                const ele = document.documentElement;
                if (ele .requestFullscreen) {
                    ele .requestFullscreen();
                } else if (ele .mozRequestFullScreen) {
                    ele .mozRequestFullScreen();
                } else if (ele .webkitRequestFullScreen) {
                    ele .webkitRequestFullScreen();
                }
            }
        },
        enterFullscreen(){
            const dom = document.querySelector('.player-olympic')
            let style = ''
            style += "width:" + this.screenH + "px;";
            style += "height:" + this.screenW + "px;";
            style += "position:fixed;top:0;left:0;z-index:101";
            dom.style.cssText = style;
            document.body.append(dom); 
            this.fullscreenFlag = true;
        },
        exitFullscreen(){
            const dom = document.querySelector('.player-olympic');
            const parentDom = document.querySelector('#video-boxs');
            dom.style.cssText = "position:relative;z-index:1;width:100%;height:100%";
            parentDom.appendChild(dom);
            this.fullscreenFlag = this.openQualityFlag = this.openSpeedFlag = false;
        },
        /**
         * 获取当前课程下可听课时列表
         */
        getTrySeePeriodList(){
            if(this.getTrySeePeriodListFlag) return;
            let params = {
                courseId:this.$route.params.courseId
            }
            this.$http.post(this.$server.getTrySeePeriodList,params).then(res=>{
                if(res.data.status == 200){
                    this.getTrySeePeriodListFlag = true;
                    this.periodsList = res.data.content.periodsList
                }
            })
        },
        rePlayEvent(){
            this.endedFlag = false; 
            this.time = this.temp = 0;          
            if(this.isAndroid&&this.isWx){
                this.player.currentTime = 0;
            }else{
                this.player.seek(0)
            }
            this.player.play();
        },
        nextEvent(){
            this.endedFlag = false;
            const index = this.periodsList.findIndex(item=>item.id==this.sourceData.periodId)
            const targetId = Number(this.periodsList[index+1].id);
            this.$emit('update:startPlay',false)
            this.$emit('update:currentPeriodId',targetId)
            this.$nextTick(()=>{
                this.$emit('update:startPlay',true);
                document.querySelector('.video-course-init .player-btn').click()
            })
        },
        prevEvent(){
            this.endedFlag = false;
            const index = this.periodsList.findIndex(item=>item.id==this.sourceData.periodId)
            const targetId = Number(this.periodsList[index-1].id);
            this.$emit('update:startPlay',false)
            this.$emit('update:currentPeriodId',targetId)
            this.$nextTick(()=>{
                this.$emit('update:startPlay',true);
                document.querySelector('.video-course-init .player-btn').click()
            })
        }
    },
    beforeDestroy(){
        if(this.player!=''){
            let learnRate = this.isAndroid&&this.isWx?this.player.currentTime:this.player.getCurrentTime();
            this.savePeriodStudyRecords(learnRate,'realLearnRate')
        }
        clearInterval(this.realLearnRateTimer)
        clearInterval(this.timer)
        clearInterval(this.saveTimer)
        clearInterval(this.studyBehaviorTimer)
    }
};
</script>
<style lang="scss">
.player-olympic,.audio-surface{
    height: 100%;
}
#video-boxs{
    height: 100%;
}
#player-con {
    height: 100%;
    overflow: hidden;
}
.my-set-quality{
    &.active{
        color:#30adf2;
    }
}
.prism-player .prism-big-play-btn{
    display: none!important;
    width: 0.72rem!important;
    height: 0.72rem!important;
    background:  url('../../assets/image/player_btn.png')no-repeat 50% 50%/cover!important;
    left: 50%!important;
    bottom:50%!important;
    margin:0 0 -0.36rem -0.36rem;
}
.prism-player .prism-big-play-btn .outter,.prism-player .prism-cc-btn{
    display: none;
}
.prism-player .prism-setting-btn{
    margin-right: 8px!important;
}
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
.prism-setting-item.prism-setting-audio,.prism-setting-item.prism-setting-cc,.prism-player .prism-volume{
    display: none!important;
}
.andriod-player{
    width: 100%;
    position: absolute;
    top:0;
    left:0;
    object-fit:contain;
}
</style>
<style lang="scss" scoped>
    .player-olympic{
        background: #000;
        position: relative;
        overflow: hidden;
    }
    .video-loading{
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        margin:auto;
        width: 0.8rem;
        height: 0.8rem;
    }
    .player-controls{
        z-index:10;
        &.normal{
            height: 0;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.5);
            &::after{
                content: '';
                box-shadow: -20px -40px 1rem #323232;
                display: block;
                width: 120%;
                height: 1rem;
                position: relative;
                z-index: 3;

            }
            .player-controls-components{
                position: absolute;
                top:-1rem;
                left: 0;
                height: 1rem;
                width: 100%;
                z-index: 4;
                .player-btn{
                    display: inline-block;
                    vertical-align: middle;
                    padding:0.25rem 0.2rem 0.25rem 0.25rem;
                    &.play{
                        i{
                            display: block;
                            width: 0.5rem;
                            height: 0.5rem;
                            background: url('../../assets/image/audio-play.png')no-repeat 50% 50% / cover;
                        }
                    }
                    &.pause{
                        i{
                            display: block;
                            width: 0.5rem;
                            height: 0.5rem;
                            background: url('../../assets/image/audio-pause.png')no-repeat 50% 50% / cover;
                        }
                    }
                }
                .process-bar{
                    // width:3.4rem;
                    width: calc(100% - 4rem);
                    height: 2px;
                    display: inline-block;
                    vertical-align: middle;
                    position: relative;
                    margin:0 0.2rem;
                    &.full{
                        width: calc(100% - 5.6rem);
                    }
                    &::before{
                        content:'';
                        position: absolute;
                        left:-0.2rem;
                        width: 0.2rem;
                        top:0;
                        height: 2px;
                        background: #B4272D;
                        z-index: 1;
                    }
                    &::after{
                        content:'';
                        position: absolute;
                        right:-0.2rem;
                        width: 0.2rem;
                        top:0;
                        height: 2px;
                        background: #e5e5e5;
                        z-index: 1;
                    }
                    /deep/ .van-slider{
                        z-index: 2;
                    }
                    .bar-btn{
                        background: #B4272D;
                        width: 0.5rem;
                        height: 0.15rem;
                        color:#fff;
                        border-radius: 25px;
                        position: relative;
                    }
                }
                .video-time{
                    line-height: 0.52rem;
                    display: inline-block;
                    vertical-align: middle;
                    color:#fff;
                    font-size: 0.24rem;
                    margin-left: 0.25rem;
                }
                .quality,.speed{
                    width: 0.8rem;
                    text-align:center;
                    display: inline-block;
                    vertical-align: middle;
                    position: relative;
                    .cur-quality,.cur-speed{
                        font-size: 0.24rem;
                        color:#fff;
                        background: rgba(0,0,0,0.4);
                        height: 0.5rem;
                        line-height: 0.5rem;
                    }
                    .quality-list,.speed-list{
                        position: absolute;
                        bottom:0.5rem;
                        left:0;
                        li{
                            font-size: 0.24rem;
                            color:#fff;
                            background: rgba(0,0,0,0.4);
                            height: 0.5rem;
                            line-height: 0.5rem;
                            margin:0.06rem 0;
                            width: 0.8rem;
                            &.active{
                                color:#C30D23;
                            }
                        }
                    }
                    &.speed{
                        margin-right: 0.7rem;
                    }
                }
                
                .full-btn{
                    padding: 0.25rem 0.3rem 0.25rem 0;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    i{
                        font-size: 0.4rem;
                        color:#fff;
                    }
                }
            }
        }
        &.small{
            display: none;
            position: absolute;
            top: calc(70% + 0.2rem);
            left: 0px;
            background: rgba(0,0,0,0.5);
            width: 100%;
            height: 0.6rem;
            padding:0.1rem;
            .player-btn{
                display: inline-block;
                vertical-align: middle;
                &.play{
                    i{
                        display: block;
                        width: 0.4rem;
                        height: 0.4rem;
                        background: url('../../assets/image/audio-play.png')no-repeat 50% 50% / cover;
                    }
                }
                &.pause{
                    i{
                        display: block;
                        width: 0.4rem;
                        height: 0.4rem;
                        background: url('../../assets/image/audio-pause.png')no-repeat 50% 50% / cover;
                    }
                }
            }
        }
    }
    .player-end-dialog{
        position: absolute;
        top:0;
        left: 0;
        background: rgba(0,0,0,0.7);
        width: 100%;
        height: 100%;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        p{
            width: 2.08rem;
            height: 0.64rem;
            border:1px solid #fff;
            border-radius: 0.4rem;
            text-align: center;
            line-height: 0.62rem;
            color:#fff;
            font-size: 0.26rem;
            &.next-btn,&.prev-btn{
                margin-left: 0.56rem;
            }
        }
    }
</style>