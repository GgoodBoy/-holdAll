<template>
    <div class="praise-box-wrap" @click="hideBar">
        <!-- <div class="golist">
            <van-icon name="arrow-left" @click="goPage"/>
        </div> -->
        <Header :name="'小知识'"/>
        <div class="videoPraiseBox" id="prismPlayerParise" @click.stop="test">
            <p class="video-p1">{{titleName}}</p>
            <div class="prism-player" id="J_prismPlayer" @click="layoutBoolEven"></div>
            <div class="video-div1">
                <div class="video-div2"  @click="courseInfoEven()" v-show="(courseName&&courseName.length>0)?true:false">
                    <!-- <img :src="minHand"/> -->
                    <span>{{courseName}}</span>                    
                </div>
                          
                <div class="video-div3">
                    <img class="img1" v-if="iconPraiseState" :src="img1" @click="praiseEven(false)"/>
                    <img class="img1" v-else :src="img2" @click="praiseEven(true)"/>
                    <p>{{Number(praiseNum)>999?'999+':praiseNum}}</p>
                    <img class="img1" :src="img3" @click.stop="goSharePage"/>
                </div>
            </div>
            <transition name="fade-in">
                <div class="layoutDiv" v-show="layoutBool"  @click.stop="test">
                    <div class="van-icon-css" v-show="videoState"  @click.stop="test">
                            <img :src="videoClose">
                    </div>    
                    <div class="van-icon-css" v-show="!videoState"  @click.stop="test">
                            <img :src="videoOpen">
                    </div>          
                </div>
            </transition>   
        </div>
        <div @click="toVideoListPage" class="videoListBox">
            更多精彩视频>>
        </div>
        <NormalShare v-if="shareType==2" :shareType.sync="shareType" :shortVideoId="shortVideoId"></NormalShare>
        <WxShare v-if="shareType==1" :shareType.sync="shareType"  :shortVideoId="shortVideoId"></WxShare>
    </div>
</template>
<script>
import videoClose from '@/assets/image/videoClose.png';
import videoOpen from '@/assets/image/videoOpen.png';
import minHand from '@/assets/image/minHand.png';
import NormalShare from '@/pages/shortVideo/components/shortVideoNormalShare.vue'
import WxShare from '@/pages/shortVideo/components/shortVideoSharePoster.vue'
import img1 from '@/assets/image/praise.png'
import img2 from '@/assets/image/praise.png'
import img3 from '@/assets/image/collection_a.png'
import Header from '@/components/Header.vue'
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
            img1:img1,
            img2:img2,
            img3:img3,
            videoClose:videoClose,
            videoOpen:videoOpen,
            minHand:minHand,
            urlList:[],
            actionState:-1,//要进行播放的视频
            playerObj:null,
            urlInfo:null,
            layoutBool:true,
            videoState:true,
            titleName:'',
            courseName:'',
            praiseNum:'',
            iconPraiseState:false,
            idUrl:'',
            backgroundUrl:'',
            isWx:false,
            shareType:0,
            shortVideoId:'',
            renderFlag:false,
            isOver:false,
            courseId:''
        }
    },
    components: {Header,NormalShare,WxShare},
    computed:{},   
    created(){
        if(this.$route.params&&this.$route.params.id){
            this.shortVideoId = this.$route.params.id;
            let ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.isWx = true;
            }
        }else{
            this.$router.replace('/')
        }    
    },
    watch:{
        shareType(cur,old){
            if(cur==0){
                document.querySelector('.menu-wrap').style.visibility = "visible"
            }
        }
    },
    beforeRouteLeave (to, from, next){
        if(this.shareType>0){
            this.shareType = 0;
            next(false)
            return;
        }else{
            next()
        }
    },
    methods:{
        ...mapActions(['setDownLoadFlag']),
        test(){
            let dom = document.querySelector('.prism-controlbar')
            if(dom){
                dom.style.display = 'block'
            }
        },
        hideBar(){
            let dom = document.querySelector('.prism-controlbar')
            if(dom){
                dom.style.display = 'none'
            }
        },
        courseInfoEven(){
            this.$router.push(`/course/${this.courseId}`)
        },         
        praiseEven(bool){
            this.setDownLoadFlag(true);
            return;
            if(bool){
                let login = JSON.parse(this.$getCookie('uInfo'));
                if(!login){
                    sessionStorage.setItem('rediectUrl',this.$route.fullPath)
                    this.$router.push('/auth')
                    return;
                }
                let parems = {
                    shortVideoId:this.idUrl,
                    userId:login.userid
                }
                this.$http.post(this.$server.setVideoPoint,parems).then(res =>{
                    if(res.data.status==200){
                        this.iconPraiseState=bool;
                        this.praiseNum = Number(this.praiseNum+1);
                        this.$toast("点赞成功");
                    }else{
                        this.$toast(res.data.message);
                    }
                });
            }else{
                this.$toast("不可重复点赞");
            }          
        },
        // //退回上一级
        // goPage(){
        //     this.$router.go(-1);
        // },
        getVideroInfo(){
			let parems = {
                shortVideoId:this.shortVideoId
            }
            this.$http.post(this.$server.getshortVideoInfo,parems).then(res =>{
                if(res.data.status==200){
                    var datas = res.data.content;
                    this.backgroundUrl=datas.backgroundUrl;
                    this.titleName=datas.name;
                    this.titleName=datas.name;
                    this.courseId = datas.relationCourseId;
                    this.courseName=datas.courseName;
                    this.praiseNum=datas.pointNum;
                    this.idUrl = datas.id;                   
                    this.playerRender();
                }else{
                    this.$toast(res.data.message);
                }
            });
        },        
        //返回视频列表;
        toVideoListPage(){
            window.location.href = `${this.$server.downLoad}?type=shortVideo`
            // this.$router.push({path: '/selected'});
        },
        layoutBoolEven(){
                //正在播放无遮罩
                if(!this.videoState&&!this.layoutBool){
                    this.layoutBool=true;
                    this.videoState = false;
                    //暂停有遮罩
                }else if(this.videoState&&this.layoutBool){
                    if(!this.urlInfo){
                        setTimeout(()=>{
                            this.getVideroList();
                        },100);
                    }else{
                        if (window.WeixinJSBridge) {
                            WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
                                this.playerObj.play();
                            }, false);
                        } else {
                            document.addEventListener("WeixinJSBridgeReady", ()=>{
                                WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
                                    this.playerObj.play();
                                });
                            }, false);
                        }                        
                        this.playerObj.play();
                    }
                    this.layoutBool = false;
                    //正在播放有遮罩
                }else if(!this.videoState&&this.layoutBool){
                    this.$emit('clickBoolEven', {clickBool:false});
                    setTimeout(()=>{
                        this.playerObj.pause();
                    },100)
                }
        },
        getVideroList(){
            var self=this;
            var parems={
                shortVideoId:this.idUrl
            }
            this.$http.post(self.$server.getVideourl,parems).then(res =>{
                if(res.data.status==200){
                    self.urlInfo = res.data.content.address;
                    self.playerRender();
                    let timer = setInterval(()=>{
                        if(this.renderFlag){
                            this.renderFlag = false;
                            if (window.WeixinJSBridge) {
                                WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
                                    this.playerObj.play()
                                }, false);
                            } else {
                                document.addEventListener("WeixinJSBridgeReady", ()=>{
                                    WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
                                        this.playerObj.play()
                                    });
                                }, false);
                            }
                            this.playerObj.play()
                            clearInterval(timer);
                            return;
                        }
                    },300)
                }else{
                    self.$toast(res.data.message);
                }
            });            
        },
        //自动播放完毕触发事件调用的函数；
        endedHandle(){
            this.isOver = true;
        },         
        //播放器调用；
        playerRender(){
            var self = this;
            if(self.playerObj){
                self.playerObj.dispose();//销毁以前的播放器
                self.playerObj=null;
            }
            var props = {
                id: 'J_prismPlayer',
                width: '100%',
                height: "3.88rem",
                preload:false,
                autoplay: false,
                source :self.urlInfo||null,
                cover:self.backgroundUrl||null, //默认设置视频的背景图;
                isLive: false,
                controlBarVisibility:'always',
                extraInfo:{
                    "x5-playsinline":""
                },
                x5_type:"",
                skinLayout: [
                    {
                    name: "controlBar", align: "blabs", x: 0, y: 0,
                    children: [
                        {name: "progress", align: "blabs", x: 0, y: 44},
                        {name: "timeDisplay", align: "tl", x: 10, y: 7}
                    ]
                    }                    
                ]                                               
            };
            var player = new Aliplayer(props,(player)=>{
                    if(self.urlInfo&&self.urlInfo.length>0){
                        self.renderFlag = true;
                    }                    
                    player.play();                               
                });
            player.on("ended", this.endedHandle);//播放完毕事件
            player.on('pause', (e)=>{ //暂停事件
                self.layoutBool = true;
                self.videoState = true;
            }); 
            // player.on('completeSeek',(e)=>{ //拖拽结束
            //     player.seek(e.paramData);
            // });
            player.on("play",(e)=>{ //开始播放事件
                player.setCover('');
                if(self.isOver){
                    player.seek(0);
                    self.isOver=false;
                }
                self.videoState = false;
            }); 
            self.playerObj=player;          
        },
        goSharePage(){
            let login = JSON.parse(this.$getCookie('uInfo'));
            if(!login){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
                this.$router.push('/auth')
                return;
            }else{
                if(this.isWx){
                    this.shareType = 1;
                }else{
                    this.shareType = 2;
                }
            }
            
        }        
    },
    mounted(){
        this.getVideroInfo();
    }  
}
</script>
<style lang="scss" scoped>
.praise-box-wrap{
    height: calc(100vh - 1rem);
    background-color: #fff;
    position: relative;
    .videoListBox{
        color:#333;
        text-align: center;
        font-size: 0.32rem;
    }
    // .golist{
    //     color: #fff;
    //     font-size: 0.4rem;
    //     padding: 0.2rem 0.3rem;
    // }
    .videoPraiseBox{
        border-top:1px solid #D8D8D8;
        .video-div1{
            .video-div3{
                .img1{
                    width: 0.42rem;
                }
            }
            .video-div3{
                zoom: 1;
                overflow: hidden;
                margin-top:0.08rem;
                p{
                    line-height: 0.42rem;
                    font-size: 0.32rem;
                    margin: 0 0.5rem 0 0.1rem;
                }
                img,p{
                    float: left;
                }
            }
            .video-div2{
                float: left;
                line-height: 0.56rem;
                max-width: 4.6rem;
                font-size: 0.32rem;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden; 
                text-align: center;
                border:0.02rem solid #C30D23;
                padding: 0 0.2rem;
                border-radius: 0.56rem;    
                color:#333;         
            }            
        }
        // .video-div2{
        //     line-height: 0.42rem;
        //     max-width: 4rem;
        //     font-size: 0.32rem;
        //     text-overflow: ellipsis;
        //     white-space: nowrap;
        //     overflow: hidden; 
        //     img{
        //         width: 0.4rem;
        //         height: 0.32rem;
        //     }            
        // }
    }
}

</style>
<style>
.videoPraiseBox{
    overflow: hidden;
}
.videoPraiseBox .prism-player video{
    z-index: 1 !important;
}
.videoPraiseBox{
    position: relative;
    padding: 0 0.3rem;
}
.videoPraiseBox .video-p1{
    /* max-width: 4rem; */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;    
    text-align: left;
    color: #333;
    font-size: 0.3rem;
    padding: 0.2rem 0;
}
.video-div1{
    overflow: hidden;
    zoom: 1;
    padding: 0.3rem 0;
}
.videoPraiseBox .video-div1 .video-div2{
    color: #333;
    float: left;
}
.videoPraiseBox .video-div1 .video-div3{
    float: right;
    color: #333;
}
.layoutDiv{
    position: absolute;
    top: 0.8rem;
    left: 0;
    width: 6.9rem;
    height: 3.88rem;
    left: 0.3rem;
    background: rgba(0,0,0,0.5);
    pointer-events: none;
}
.layoutDiv .van-icon-css{
    width:0.76rem;
    height: 0.76rem;
    position: absolute;
    z-index: 11;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.layoutDiv .van-icon-css img{
    width: 100%;
    height:100%;
}
.videoPraiseBox .prism-player .prism-controlbar .prism-progress{
    height: 2px !important;
    width: 60% !important;
    left:20% !important;
    bottom: 12px !important;
    z-index: 15;    
}
.videoPraiseBox .prism-player .prism-controlbar .prism-progress .prism-progress-played{
    background-color:#C30D23;
}
.videoPraiseBox .prism-player .prism-controlbar{
    height: 0.52rem !important;
    bottom:0.1rem !important;
}
.videoPraiseBox .prism-player .prism-controlbar .prism-time-display{
    height: 0 !important;
    line-height: 0 !important;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;    
    float: none !important; 
    margin-left: 0 !important; 
    margin-top: 0 !important;    
}
.videoPraiseBox .prism-player .prism-controlbar .prism-time-display .time-bound{
    display: none !important;
}
.videoPraiseBox .prism-player .prism-controlbar .prism-time-display .current-time{
    position: absolute;
    line-height: 0.52rem;
    left:  0.2rem;
}
.videoPraiseBox .prism-player .prism-controlbar .prism-controlbar-bg{
    background:none !important;
}
.videoPraiseBox .prism-player .prism-controlbar .prism-time-display .duration{
    position: absolute;
    line-height:0.52rem;
    right: 0.2rem;    
    color: #fff !important; 
}
.videoPraiseBox .prism-player .prism-controlbar .prism-progress .prism-progress-cursor{
    display: block !important;
    width: 0.5rem;
    height: 0.1rem;
    border-radius: 0.3rem;
    background: #C30D23;
    top: -0.03rem !important;
}
.videoPraiseBox .prism-player .prism-controlbar .prism-progress .prism-progress-cursor img{
    display: none;
}
.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity 1s; 
}
.fade-in-enter, .fade-in-leave-to /* .fade-leave-active below version 2.1.8 */ { 
   opacity: 0;
}
p{
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
/* .prism-player .prism-progress-hover{
    height: 2px !important;
} */
</style>