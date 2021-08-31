<template>
    <div class="player-olympic" @click.stop="showVideoBar">
        <div class="player-box">
            <div class="surface" v-if="!startPlay"></div>
            <video id="video" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="" x5-video-orientation="portraint"></video>
        </div>
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
export default {
    props:['duration','source'],
    data() {
        return {
            player:'',//播放器容器
            playerFlag:false,//按钮播放/暂停
            processCurValue:0,
            totalDuration:'00:00',
            processTotalValue:0,
            videoLoading:false,
            hideTimer:null,
            startPlay:false,
        }
    },
    computed:{
        curDuration(){
            let temp = Math.round(this.processTotalValue*(this.processCurValue/100))
            let curDurationTemp = temp>this.processTotalValue?this.processTotalValue:temp;
            return isNaN(curDurationTemp)?'00:00':formatSeconds(curDurationTemp)
        },
    },
    watch:{
        startPlay(cur){
            if(cur){
                this.pointButton(6)
            }
        }
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
            let dom = document.querySelector(`.player-controls`)
			if(dom){
                dom.style.display = 'block';
                this.hideTimer = setTimeout(()=>{
                    dom.style.display = 'none';
                },3000)
            }
        },
        /**
         * button打点
         */
        async pointButton(type){
            const query = {
                type:type
            }
            const res = await this.$http.post(this.$server.pointButton,query)
        },
        createPlayer(){
            this.player = document.querySelector(`#video`)
            this.player.setAttribute('src',this.source)
            this.player.addEventListener('play',(e)=>{
                this.startPlay = true;
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
                let dom = document.querySelector(`.player-controls`)
                if(dom){
                    dom.style.display = 'none';
                }
                this.videoLoading = false;
            })
            this.player.addEventListener('waiting',(e)=>{
                this.videoLoading = true;
                clearTimeout(this.hideTimer)
                let dom = document.querySelector(`.player-controls`)
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
                let dom = document.querySelector(`.player-controls`)
                if(dom){
                    dom.style.display = 'block';
                }
            })
            this.player.addEventListener('seeked',(e)=>{
                this.videoLoading = true;
                clearTimeout(this.hideTimer)
                this.hideTimer = setTimeout(()=>{
                    let dom = document.querySelector(`.player-controls`)
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
        height: 100%;
        position: relative;
        .player-box{
            width: 100%;
            height:100%;
            .surface{
                width: 100%;
                height:100%;
                position: absolute;
                top:0;
                left:0;
                z-index: 2;
                background: url('../assets/image/surface.jpg')no-repeat 50% 50% / cover;
            }
            video{
                width: 100%;
                height:100%;
            }
        }
        .player-controls{
            z-index:2;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.5);
            /deep/ .van-slider{
                background: #ccc!important;
            }
            /deep/ .van-slider__bar{
                background: #fff!important;
            }
            .video-loading{
                position: absolute;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 0.7rem;
                height: 0.7rem;
                /deep/ .van-loading__spinner{
                    width: 0.7rem;
                    height: 0.7rem;
                }
            }
            .player-btn{
                position: absolute;
                top:50%;
                left:50%;
                z-index: 999;
                transform: translate(-50%,-50%);   
                &.play{
                    i{
                        display: block;
                        width: 0.7rem;
                        height: 0.7rem;
                        background: url('../assets/image/play.png')no-repeat 50% 50% / cover;
                    }
                }
                &.pause{
                    i{
                        display: block;
                        width: 0.7rem;
                        height: 0.7rem;
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
                padding: 0 0.3rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .process-bar{
                    flex: 1;
                    margin:0 0.15rem;
                    height: 2px;
                    position: relative;
                    // &::before{
                    //     content:'';
                    //     position: absolute;
                    //     top:0;
                    //     left: -0.2rem;
                    //     width: 0.25rem;
                    //     height: 2px;
                    //     background: #fff;
                    // }
                    // &::after{
                    //     content:'';
                    //     position: absolute;
                    //     top:0;
                    //     right: -0.2rem;
                    //     width: 0.25rem;
                    //     height: 2px;
                    //     background: #ccc;
                    // }
                    .bar-btn{
                        background: #B4272D;
                        width: 0.12rem;
                        height: 0.12rem;
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
    }
</style>