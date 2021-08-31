<template>
    <div class="player-olympic" ref="playerTemp" @click.stop="showVideoBar">
        <video id="player-con" class="andriod-player" v-if="isAndroid&&isWx"  x-webkit-airplay="true" preload="auto" playsinline="true" webkit-playsinline x5-video-player-typ="h5" ></video>
        <div id="player-con" v-else></div>
        <div class="player-controls">
            <van-loading color="#B4272D" class="video-loading" v-show="videoLoading"/>
            <div class="player-btn" :class="playerFlag?'pause':'play'" @click="playEvent($event)"><i></i></div>
            <div class="player-controls-bottom">
                <p class="cur-time">{{ curDuration }}</p>
                <div class="process-bar">
                    <van-slider v-model="processCurValue" active-color="#B4272D" @change="getCurValue">
                        <div slot="button" class="bar-btn" ref="barBtn"></div>
                    </van-slider>
                </div>
                <p class="total-time">{{totalDuration}}</p>
            </div>
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
    props:['shortVideoId','playings','duration'],
    data() {
        return {
            source:'',//资源地址
            time:'',//播放进度
            player:'',//播放器容器
            playerFlag:false,//按钮播放/暂停
            isAndroid:false,
            isWx:false,
            processCurValue:0,
            totalDuration:'00:00',
            processTotalValue:0,
            videoLoading:false,
            hideTimer:null
        }
    },
    computed:{
        curDuration(){
            let temp = Math.round(this.processTotalValue*(this.processCurValue/100))
            let curDurationTemp = temp>this.processTotalValue?this.processTotalValue:temp;
            return isNaN(curDurationTemp)?'00:00':formatSeconds(curDurationTemp)
        },
    },
    created() {
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.isWx = true;
        }else if (ua.match(/QQ/i) == "qq" &&  ua.match(/MQQbrowser/i)!='mqqbrowser'){
            this.isWx = true;
        }
        this.isAndroid = ua.indexOf('android') > -1 || ua.indexOf('linux') > -1;
        if(!(this.isAndroid&&this.isWx)){
            let Aliplayer = window.Aliplayer;
            if(!Aliplayer){
                this.$toast('视频资源加载，请刷新后重试')
                return false;
            }
        }
        this.getResoursePlayUrl()
    },
    mounted(){
        this.processTotalValue = parseInt(this.duration)
        this.totalDuration = formatSeconds(this.duration)
    },
    methods: {
        showVideoBar(){
            clearTimeout(this.hideTimer)
            let dom = document.querySelector('.player-controls')
			if(dom){
                dom.style.display = 'block';
                this.hideTimer = setTimeout(()=>{
                    dom.style.display = 'none';
                },3000)
            }
        },
        /**
         * 获取短视频地址
         */
        async getResoursePlayUrl(shareUserId){
            const query = {
                shortVideoId:this.shortVideoId,
                isCurrentPhone:1,
            }
            const res = await this.$http.post('/shortVideo/getPlayUrl',query);
            if(res.data.status ==200){
                this.source = res.data.content.address;
                this.createPlayer()
            }
        },          
        createPlayer(){
            if(this.isAndroid&&this.isWx){
                this.createPlayerInAndroid()
            }else{
                this.createPlayerInIos()
            }
        },
        createPlayerInAndroid(){
            //销毁
            if(this.player!=''){
                let parent = document.querySelector(".player-olympic");
                parent.removeChild(document.querySelector("#player-con"));
                let child = document.createElement("video");
                child.setAttribute('id','player-con');
                child.setAttribute('class','andriod-player')
                parent.appendChild(child)
                this.player = child
            }else{
                this.player = document.querySelector("#player-con")
            }
            if(Hls.isSupported()){
                let hls = new Hls();
                hls.loadSource(this.source);
                hls.attachMedia(this.player);
                hls.on(Hls.Events.MANIFEST_PARSED,()=>{
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
                })
                this.player.addEventListener('play',(e)=>{
                    this.$emit('update:playings',false)
                    this.playerFlag = true;
                    this.videoLoading = false;
                    clearTimeout(this.hideTimer)
                    this.hideTimer = setTimeout(()=>{
                        let dom = document.querySelector('.player-controls')
                        if(dom){
                            dom.style.display = 'none';
                        }
                    },3000)
                })
                this.player.addEventListener('playing',(e)=>{
                    clearTimeout(this.hideTimer)
                    let dom = document.querySelector('.player-controls')
                    if(dom){
                        dom.style.display = 'none';
                    }
                    this.videoLoading = false;
                })
                this.player.addEventListener('waiting',(e)=>{
                    this.videoLoading = true;
                    clearTimeout(this.hideTimer)
                    let dom = document.querySelector('.player-controls')
                    if(dom){
                        dom.style.display = 'block';
                    }
                })
                this.player.addEventListener('canplay',(e)=>{
                    this.videoLoading = false;
                })
                this.player.addEventListener('error',(e)=>{
                    this.videoLoading = false;
                })
                this.player.addEventListener('pause',(e)=>{
                    clearTimeout(this.hideTimer)
                    this.playerFlag = false
                    this.videoLoading = false;
                })
                this.player.addEventListener('ended',(e)=>{
                    this.playerFlag = false
                    this.videoLoading = false;
                    let dom = document.querySelector('.player-controls')
                    if(dom){
                        dom.style.display = 'block';
                    }
                })
                this.player.addEventListener('seeked',(e)=>{
                    this.videoLoading = true;
                    clearTimeout(this.hideTimer)
                    this.hideTimer = setTimeout(()=>{
                        let dom = document.querySelector('.player-controls')
                        if(dom){
                            dom.style.display = 'none';
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
            let props = {
                id: "player-con",
                width: "100%",
                height: "3.18rem",
                preload:false,
                source:this.source,
                isLive: false,
                mediaType:'video',
                rePlay:false,
                extraInfo:{
                    "x5-playsinline":""
                },
                autoplay:false,
                x5_type:"h5",
                x5_video_position:'top',
                controlBarVisibility:'always',
                cover:null
            };
            let player = new Aliplayer(props,(player)=>{
                if (window.WeixinJSBridge) {
                    WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
                        player.play()
                    }, false);
                } else {
                    document.addEventListener("WeixinJSBridgeReady", ()=>{
                        WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
                            player.play()
                        });
                    }, false);
                }
                player.play()
            });
            player.on('play',(e)=>{
                this.$emit('update:playings',false)
                this.playerFlag = true;
                this.videoLoading = false;
                clearTimeout(this.hideTimer)
                this.hideTimer = setTimeout(()=>{
                    let dom = document.querySelector('.player-controls')
                    if(dom){
                        dom.style.display = 'none';
                    }
                },3000)
            })
            player.on('playing',(e)=>{
                clearTimeout(this.hideTimer)
                let dom = document.querySelector('.player-controls')
                if(dom){
                    dom.style.display = 'none';
                }
                this.videoLoading = false;
            })
            player.on('waiting',(e)=>{
                this.videoLoading = true;
                clearTimeout(this.hideTimer)
                let dom = document.querySelector('.player-controls')
                if(dom){
                    dom.style.display = 'block';
                }
            })
            player.on('canplay',(e)=>{
                clearTimeout(this.hideTimer)
                let dom = document.querySelector('.player-controls')
                if(dom){
                    dom.style.display = 'none';
                }
                this.videoLoading = false;
            })
            player.on('error',(e)=>{
                this.videoLoading = false;
            })
            player.on('pause',(e)=>{
                clearTimeout(this.hideTimer)
                this.playerFlag = false
                this.videoLoading = false;
            })
            player.on('timeupdate',(e)=>{
                let curTime = Math.round(player.getCurrentTime())-1;
                this.processCurValue = curTime/this.processTotalValue*100;
                this.startProcess();
            })
            player.on('completeSeek',(e)=>{
                this.videoLoading = true;
                clearTimeout(this.hideTimer)
                this.hideTimer = setTimeout(()=>{
                    let dom = document.querySelector('.player-controls')
                    if(dom){
                        dom.style.display = 'none';
                    }
                },3000)
            })
            player.on('startSeek',()=>{
                clearTimeout(this.hideTimer)
            })
            player.on('ended',(e)=>{
                this.playerFlag = false
                this.videoLoading = false;
                let dom = document.querySelector('.player-controls')
                if(dom){
                    dom.style.display = 'block';
                }
            })
            this.player = player;
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
        startProcess(){
            this.processCurValue = Number((((this.processCurValue*100)+(100/this.processTotalValue*100))/100).toFixed(2));
        },
    }
};
</script>
<style lang="scss">
.prism-player{
    background: none!important;
}
.prism-controlbar,.prism-player .prism-big-play-btn,.prism-player .prism-loading,.prism-player .prism-info-display{
    display: none!important;
}
.van-slider__button-wrapper{
    z-index: 2;
}
</style>
<style lang="scss" scoped>
    .player-olympic{
        width: 100%;
        height: 3.18rem;
        position: relative;
    }
    #player-con{
        height: 100%!important;
        width: 100%;
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
        z-index:2;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: rgba(0,0,0,0.5);
        .player-btn{
            position: absolute;
            top:50%;
            left:50%;
            z-index: 999;
            transform: translate(-50%,-50%);   
            &.play{
                i{
                    display: block;
                    width: 0.6rem;
                    height: 0.6rem;
                    background: url('../assets/image/play.png')no-repeat 50% 50% / cover;
                }
            }
            &.pause{
                i{
                    display: block;
                    width: 0.6rem;
                    height: 0.6rem;
                    background: url('../assets/image/pause.png')no-repeat 50% 50% / cover;
                }
            }
        }
        .player-controls-bottom{
            position: absolute;
            bottom:0;
            left: 0;
            height: 0.8rem;
            width: 100%;
            z-index: 2;
            padding: 0 0.2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .process-bar{
                flex: 1;
                margin:0 0.45rem;
                height: 2px;
                position: relative;
                &::before{
                    content:'';
                    position: absolute;
                    top:0;
                    left: -0.2rem;
                    width: 0.25rem;
                    height: 2px;
                    background: rgb(180, 39, 45);
                }
                &::after{
                    content:'';
                    position: absolute;
                    top:0;
                    right: -0.2rem;
                    width: 0.25rem;
                    height: 2px;
                    background: #e5e5e5;
                }
                .bar-btn{
                    background: #B4272D;
                    width: 0.5rem;
                    height: 0.1rem;
                    color:#fff;
                    border-radius: 25px;
                    position: relative;
                }
            }
            .cur-time,.total-time{
                line-height: 0.34rem;
                color:#fff;
                font-size: 0.24rem;

            }
        }
    }
</style>