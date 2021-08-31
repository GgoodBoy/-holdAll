<template>
    <div class="player-olympic" @click.stop="showVideoBar">
        <video :id="id" x-webkit-airplay="true" preload="auto" playsinline="true" webkit-playsinline x5-video-player-typ="h5" ></video>
        <div class="player-controls" :class="className">
            <van-loading color="#B4272D" class="video-loading" v-show="videoLoading"/>
            <div class="player-btn" :class="playerFlag?'pause':'play'" @click="playEvent($event)"><i></i></div>
            <div class="player-controls-bottom">
                <p class="cur-time">{{ curDuration }}</p>
                <p class="unit"></p>
                <p class="total-time">{{totalDuration}}</p>
                <div class="process-bar">
                    <van-slider v-model="processCurValue" active-color="#B4272D" @change="getCurValue">
                        <!-- <div slot="button" class="bar-btn" ref="barBtn"></div> -->
                        <div slot="button" class="bar-btn" ref="barBtn">
                            <i></i>
                        </div>
                    </van-slider>
                </div>
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
export default {
    props:['duration','source','id','className'],
    data() {
        return {
            player:'',//播放器容器
            playerFlag:false,//按钮播放/暂停
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
        this.processTotalValue = parseInt(this.duration)
        this.totalDuration = formatSeconds(this.duration)
    },
    mounted(){
        this.createPlayer()
    },
    methods: {
        showVideoBar(){
            clearTimeout(this.hideTimer)
            let dom = document.querySelector(`.${this.className}`)
			if(dom){
                dom.style.display = 'block';
                this.hideTimer = setTimeout(()=>{
                    dom.style.display = 'none';
                },3000)
            }
        },
        createPlayer(){
            this.player = document.querySelector(`#${this.id}`)
            this.player.setAttribute('src',this.source)
            this.player.addEventListener('play',(e)=>{
                if(this.id=='player-con1'){
                    document.querySelector('#player-con2').pause()
                    document.querySelector('.player-controls2').style.display = 'block'
                }else{
                    document.querySelector('#player-con1').pause()
                    document.querySelector('.player-controls1').style.display = 'block'
                }
                this.playerFlag = true;
                this.videoLoading = false;
                clearTimeout(this.hideTimer)
                this.hideTimer = setTimeout(()=>{
                    let dom = document.querySelector(`.${this.className}`)
                    if(dom){
                        dom.style.display = 'none';
                    }
                },3000)
            })
            this.player.addEventListener('playing',(e)=>{
                clearTimeout(this.hideTimer)
                let dom = document.querySelector(`.${this.className}`)
                if(dom){
                    dom.style.display = 'none';
                }
                this.videoLoading = false;
            })
            this.player.addEventListener('waiting',(e)=>{
                this.videoLoading = true;
                clearTimeout(this.hideTimer)
                let dom = document.querySelector(`.${this.className}`)
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
                let dom = document.querySelector(`.${this.className}`)
                if(dom){
                    dom.style.display = 'block';
                }
            })
            this.player.addEventListener('seeked',(e)=>{
                this.videoLoading = true;
                clearTimeout(this.hideTimer)
                this.hideTimer = setTimeout(()=>{
                    let dom = document.querySelector(`.${this.className}`)
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
            console.log(value)
            let temp = value*this.processTotalValue/100;
            if(isNaN(temp))return;
            this.player.currentTime = temp
            this.player.play();
        },
        startProcess(){
            this.processCurValue = Number((((this.processCurValue*100)+(100/this.processTotalValue*100))/100).toFixed(2));
        },
    }
};
</script>
<style lang="scss">
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
        height: 3.24rem;
        position: relative;
    }
    #player-con1,#player-con2{
        height: 100%!important;
        width: 100%;
    }
    .video-loading{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
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
            color:#fff;
            .process-bar{
                flex: 1;
                margin:0 0 0 0.25rem;
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
                    display: none;
                }
                &::after{
                    content:'';
                    position: absolute;
                    top:0;
                    right: -0.2rem;
                    width: 0.25rem;
                    height: 2px;
                    background: #e5e5e5;
                     display: none;
                }
                .bar-btn{
                    width: 0.4rem;
                    height: 0.2rem;
                    background: none;
                    position: relative;
                    i{
                        display: block;
                        width: 0.1rem;
                        height: 0.1rem;
                        background: #B4272D;
                        border-radius: 25px;
                        position: relative;
                        left: 0.12rem;
                        top:0.05rem;
                    }
                }
            }
            .unit{
                color:#fff;
                height: 0.24rem;
                line-height: 0.24rem;
                overflow: hidden;
                background: #fff;
                width: 1px;
                transform: rotate(20deg);
            }
            .cur-time,.total-time{
                line-height: 0.34rem;
                color:#fff;
                font-size: 0.24rem;
                width: 0.74rem;
                text-align: center;
            }
        }
    }
</style>