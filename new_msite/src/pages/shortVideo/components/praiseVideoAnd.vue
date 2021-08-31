<template>
    <div class="praise-box-wrap">
        <div class="golist">
            <van-icon name="cross" @click="goPage"/>
        </div>        
        <div class="videoPraiseBox" id="prismPlayerParise" @click="layoutBoolEven">
            <div class="prism-player" :id="`J_prismPlayer${itemObj.index}`"></div>
            <transition name="fade-in">
                <div class="layoutDiv" v-show="layoutBool">
                    <div class="van-icon-css" v-show="videoState">
                            <img :src="videoClose">
                    </div>    
                    <div class="van-icon-css" v-show="!videoState">
                            <img :src="videoOpen">
                    </div>          
                </div>
            </transition>   
        </div>
    </div>
</template>
<script>
import videoOpen from '../img/videoOpen.png';
import videoClose from '../img/videoClose.png';
export default {
    data(){
        return{
            videoClose:videoClose,
            videoOpen:videoOpen,
            actionState:-1,//要进行播放的视频
            playerObj:null,
            urlInfo:null,
            layoutBool:true,
            videoState:true,
            iconPraiseState:false,
            idUrl:'',
            backgroundUrl:'',
            shortVideoId:'',
            renderFlag:false,
            isOver:false,
            currentTime:0,
            timesBool:true
        }
    },
    props:["itemObj"],
    components: {},
    computed:{},   
    created(){
        this.idUrl=this.itemObj.id;
    },
    watch:{
    },
    methods:{
       goPage(){
           if(this.currentTime==0){
               this.currentTime = this.playerObj.getCurrentTime()||0;
           }
          this.$emit('divFlogBox',{bool:false,time:this.currentTime,index:this.itemObj.index})
        },        
        getVideroInfo(){
			let parems = {
                shortVideoId:this.shortVideoId
            }
            this.$http.post(this.$server.getshortVideoInfo,parems).then(res =>{
                if(res.data.status==200){
                    var datas = res.data.content;
                    this.idUrl = datas.id;                   
                    this.playerRender();
                }else{
                    this.$toast(res.data.message);
                }
            });
        },  
        layoutBoolEven(){
                //正在播放无遮罩
                if(!this.videoState&&!this.layoutBool){
                    this.layoutBool=true;
                    this.videoState = false;
                    //暂停有遮罩
                }else if(this.videoState&&this.layoutBool){
                    this.layoutBool=false;
                    if(!this.urlInfo){
                        setTimeout(()=>{
                            this.getVideroList();
                        },100);
                    }else{
                        if (window.WeixinJSBridge) {
                            WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
                                if(self.isOver){
                                    this.playerObj.seek(0);
                                    self.isOver=false;
                                }else{
                                    if(self.itemObj.time>0&&self.timesBool){
                                        this.timesBool=false;
                                        this.playerObj.seek(Math.round(self.itemObj.time));
                                        this.$emit('videoTimeRemove', {index:this.itemObj.index});
                                    }
                                }                                
                                this.playerObj.play();
                            }, false);
                        } else {
                            document.addEventListener("WeixinJSBridgeReady", ()=>{
                                WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
                                    if(self.isOver){
                                        this.playerObj.seek(0);
                                        self.isOver=false;
                                    }else{
                                        if(self.itemObj.time>0&&self.timesBool){
                                            this.timesBool=false;
                                            this.playerObj.seek(Math.round(self.itemObj.time));
                                            this.$emit('videoTimeRemove', {index:this.itemObj.index});
                                        }
                                    }                                    
                                    this.playerObj.play();
                                });
                            }, false);
                        }                        
                        this.playerObj.play();
                    }
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
                    },100)
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
                id: 'J_prismPlayer'+self.itemObj.index,
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
            player.on("play",(e)=>{ //开始播放事件
                player.setCover('');
                self.videoState = false;
            }); 
            self.playerObj=player;          
        },      
    },
    mounted(){
        this.getVideroList();
    }  
}
</script>
<style lang="scss" scoped>
.praise-box-wrap{
    height: calc(100vh - 0rem);
    background-color: rgba(55, 55, 55, 0.9);
    .videoListBox{
        color:#fff;
        text-align: center;
        font-size: 0.32rem;
    }
}

</style>
<style scoped>
.praise-box-wrap .golist{
    color: #fff;
    font-size: 0.4rem;
    padding: 0.3rem 0.3rem;
}

.videoPraiseBox .prism-player video{
    z-index: 1 !important;
}
.videoPraiseBox{
    overflow: hidden;
    position: relative;
    padding: 0 0.3rem;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
}
.video-div1{
    overflow: hidden;
    zoom: 1;
    padding: 0.3rem 0;
}
.layoutDiv{
    position: absolute;
    top: 0;
    left: 0.3rem;
    width: calc(100% - 0.6rem);
    height: 100%;
    background: rgba(0,0,0,0.4);
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