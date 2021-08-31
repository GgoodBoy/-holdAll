<template>
    <div class="assemble-list-wrap select-list-wrap">
        <Header :name="'小知识'"/>
        <p class="listIsNo" v-show="listIsNo">暂时还没有精选视频哦</p>
        <div class="videoBox" @scroll="scrollEvent">
            <palys v-for="(item,index) in urlList" :key="index" :itemObj="{'index':index,'urls':item}" :shareType.sync="shareType" :shortVideoId.sync="shortVideoId" @clickVideToParems="videoShowPage"/>
            <p class="noData" v-show="noData" >没有更多的精选视频了</p>
        </div>
        <div class="divFlogBox" v-if="flogs&&!isHWBrowser" >
            <praiseVideoAnd :itemObj="itemObj" @divFlogBox="divFlogBoxEven" @videoTimeRemove="videoTimeRemove"/>
        </div>  
        <div class="divFlogBox divFlogBoxHW" v-if="flogs&&isHWBrowser" >
            <div class="icon-close-box">
                <i class="van-icon van-icon-cross" @click="flogs=!flogs"></i>
            </div>
            <iframe id="iframeCss" @click='iframeEven()' width="100%" height="100%" src="../../../static/iframePage/viedeo.html"></iframe>
        </div>         
        <NormalShare v-if="shareType==2" :shareType.sync="shareType" :shortVideoId="shortVideoId"></NormalShare>
        <WxShare v-if="shareType==1" :shareType.sync="shareType" :shortVideoId="shortVideoId"></WxShare>
        <DownLoad v-if="downloadFlag"/>              
    </div>
</template>
<script>
import praiseVideoAnd from "./components/praiseVideoAnd.vue";
import NormalShare from './components/shortVideoNormalShare.vue'
import WxShare from './components/shortVideoSharePoster.vue'
import DownLoad from '@/components/download.vue'
import Header from "@/components/Header.vue";
import palys from "./components/player.vue";
import {GetCookies} from '../../utils/setCookies.js'
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
            urlList:[],
            actionState:-1,//要进行播放的视频
            offsetTopNum:0,//指定元素距离顶部的距离；
            startTopNum:0, //触摸一开始距离可视频顶部的距离
            standardNum:0,//触摸一开始距离顶部的距离减去指定元素距离顶部距离之后值；
            //分页加载
            pageNo:1,
            pageSize:10,
            finished:false,
            shareType:0,
            shortVideoId:'',
            // ShowDark: true,
            //播放器遮罩是否显示;
            flogs:false,
            isHWBrowser:false,
            listIsNo:false,
            noData:false,
            itemObj:{
                index:0,
                id:''
            },
            editionType:1
        }
    },
    components: {
        palys,
        praiseVideoAnd,
        Header,
        NormalShare,
        WxShare,
        DownLoad
    },
    computed:{
        ...mapState(['shortVideoIdFromHome','downloadFlag']),
    },
    created(){
        this.getVideroList(1);
    },
    watch: {
        shareType(cur,old){
            if(cur==0){
                // document.querySelector('.menu-wrap').style.visibility = "visible"
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
        ...mapActions([
            'setShortVideoId',
            'setDownLoadFlag'            
            ]),           
        videoTimeRemove(data){
            this.urlList[data.index].ProgressTime=0;
        },

        iframeEven(){
            this.flogs = false;
        },

        // 视频点击播放
        divFlogBoxEven(data){
            this.flogs = data.bool;
            this.urlList[data.index].ProgressTime=data.time;
        },
        //判断手机类型
        judgeBrand(sUserAgent) {
            var isIphone = sUserAgent.match(/iphone/i) == "iphone";
            var isHuawei = sUserAgent.match(/huawei/i) == "huawei";
            var isHonor = sUserAgent.match(/honor/i) == "honor";
            var isOppo = sUserAgent.match(/oppo/i) == "oppo";
            var isOppoR15 = sUserAgent.match(/pacm00/i) == "pacm00";
            var isVivo = sUserAgent.match(/vivo/i) == "vivo";
            var isXiaomi = sUserAgent.match(/mi\s/i) == "mi ";
            var isXiaomi2s = sUserAgent.match(/mix\s/i) == "mix ";
            var isRedmi = sUserAgent.match(/redmi/i) == "redmi";
            var isSamsung = sUserAgent.match(/sm-/i) == "sm-";

            if (isIphone) {
                return 'iphone';
            } else if (isHuawei || isHonor) {
                return 'huawei';
            } else if (isOppo || isOppoR15) {
                return 'oppo';
            } else if (isVivo) {
                return 'vivo';
            } else if (isXiaomi || isRedmi || isXiaomi2s) {
                return 'xiaomi';
            } else if (isSamsung) {
                return 'samsung';
            } else {
                return 'default';
            }
        },
        //点击视频列表播放；
        videoShowPage(data){
            var self = this;
            let uaNext = navigator.userAgent.toLowerCase();
            function isWeixinBrowser() {
                return (/micromessenger/.test(uaNext)) ? true : false;
            }
            // this.compatibleBrowserEven(data);
            if (this.osNavigator().isAndroid || this.osNavigator().isPhone) {
                //"手机"
                //判断手机类型，判断当前手机打开的浏览器类型；
                var brand = this.judgeBrand(uaNext); 
                if(brand=='huawei'){
                    if (isWeixinBrowser()) {
                        // this.$toast('我是微信');
                        this.itemObj = {
                            index:data.index,
                            id:data.id,
                            time:this.urlList[data.index].ProgressTime>0?this.urlList[data.index].ProgressTime:0
                        }
                        this.flogs = true; 
                        this.isHWBrowser = false;
                    } else {
                        this.compatibleBrowserEven(data);
                    }
                }else{
                    this.itemObj = {
                        index:data.index,
                        id:data.id,
                        time:this.urlList[data.index].ProgressTime>0?this.urlList[data.index].ProgressTime:0
                    }
                    this.flogs = true;  
                    this.isHWBrowser = false;
                }                
            } else if (this.osNavigator().isTablet) {
                //"平板"
                this.itemObj = {
                    index:data.index,
                    id:data.id,
                    time:this.urlList[data.index].ProgressTime>0?this.urlList[data.index].ProgressTime:0
                }
                this.flogs = true; 
                this.isHWBrowser = false;
            } else if(this.osNavigator().isPc) {
                //"电脑"
                this.itemObj = {
                    index:data.index,
                    id:data.id,
                    time:this.urlList[data.index].ProgressTime>0?this.urlList[data.index].ProgressTime:0
                }
                this.flogs = true;  
                this.isHWBrowser = false;              
            }
        },
        //普通浏览器的播放兼容；
        compatibleBrowserEven(data){
            var self = this;
            self.flogs = true;   
            self.isHWBrowser = true;
            this.$nextTick(()=>{
                let iframe = document.getElementById('iframeCss'); 
                let itemObj = {
                    index:data.index,
                    id:data.id,
                    time:this.urlList[data.index].ProgressTime>0?this.urlList[data.index].ProgressTime:0,
                    backCover:data.backCover
                }                        
                var userId= JSON.parse(self.$getCookie('uInfo'))?JSON.parse(self.$getCookie('uInfo')).userid:'';
                if(userId){
                    itemObj.userId = userId;
                }
                let cookie = GetCookies('uInfo');
                let token = cookie ? JSON.parse(cookie).accessToken : '';    
                if(token){
                    itemObj.token = token
                }        
                itemObj.argv = process.env.argv;          
                console.log("itemObj",itemObj);
                iframe.contentWindow.userNameId=JSON.stringify(itemObj);
            });            
        },
        osNavigator(){
            var ua = navigator.userAgent,
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isChrome = /(?:Chrome|CriOS)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isPc = !isPhone && !isAndroid && !isSymbian;
            return {
                isTablet: isTablet,
                isPhone: isPhone,
                isAndroid: isAndroid,
                isPc: isPc
            };
        },       
        scrollEvent(e){
            var domInfo = document.querySelector(".videoBox")
                // domInfo.scrollHeight:内容区域的高度
                // domInfo.scrollTop：滚动条的高度
                // domInfo.clientHeight ：内容区的可见高度
            if(domInfo.scrollHeight - Math.ceil(domInfo.scrollTop) === domInfo.clientHeight){
                if(!this.finished){
                    this.pageNo=this.pageNo+1;
                    this.getVideroList(this.pageNo);
                }
            }            
        },
        //获取视频地址
        /*
            pageNo	1
            pageSize	10
            type	类型(1成人版，2少儿版)
            userId	用户id,登录用户必传
         */
        getVideroList(num){
            var self =this;
            let login = JSON.parse(self.$getCookie('uInfo'));
			let parems = {
                type:self.editionType,
                pageNo:num,
                pageSize:self.pageSize
            }
            if(self.shortVideoIdFromHome!=''){
                parems.shortVideoId = self.shortVideoIdFromHome
            }
            if(login&&login.userId){
                parems.userId = login.userid;
            }
            if(self.editionType==1){
                self.$http.post(self.$server.getShortVideo,parems).then(res =>{
                    if(res.data.status==200){
                        if(res.data.content.list.length>=self.pageSize){
                            self.urlList = [...self.urlList,...res.data.content.list];
                            self.finished = res.data.content.isLastPage ?  true : false;
                        }else{
                            self.urlList = [...self.urlList,...res.data.content.list];
                            self.finished = res.data.content.isLastPage ?  true : false;
                            self.editionType = 2;
                            self.pageNo = 1;
                            self.pageSize = Number(self.pageSize)-Number(res.data.content.list.length);
                            let qparems = {
                                type:self.editionType,
                                pageNo:self.pageNo,
                                pageSize:self.pageSize
                            }
                            self.$http.post(self.$server.getShortVideo,qparems).then(res =>{
                                if(res.data.status==200){
                                    if(res.data.content.list.length==self.pageSize){
                                        self.urlList = [...self.urlList,...res.data.content.list];
                                        self.finished = res.data.content.isLastPage ?  true : false;
                                    }else{
                                        self.urlList = [...self.urlList,...res.data.content.list];
                                        self.finished = res.data.content.isLastPage ?  true : false;                                    
                                    }
                                    if(self.urlList.length>0){
                                        self.listIsNo = false;
                                        self.noData = true; 
                                    }else{
                                        self.listIsNo = true;
                                    }
                                    setTimeout(()=>{
                                        if(self.shortVideoIdFromHome!=''){
                                            document.querySelector('.videoListBox .prism-player').click()
                                        }
                                    },1);
                                }else{
                                    self.$toast(res.data.message);
                                }
                            });
                        }
                    }else{
                        self.$toast(res.data.message);
                    }
                });
            }else{
                //后期使用，保留；
                // self.pageSize = 10;
                let qparems = {
                    type:self.editionType,
                    pageNo:self.pageNo,
                    pageSize:self.pageSize
                }
                self.$http.post(self.$server.getShortVideo,qparems).then(res =>{
                    if(res.data.status==200){
                        if(res.data.content.list.length==self.pageSize){
                            self.urlList = [...self.urlList,...res.data.content.list];
                            self.finished = res.data.content.isLastPage ?  true : false;
                        }else{
                            self.urlList = [...self.urlList,...res.data.content.list];
                            self.finished = res.data.content.isLastPage ?  true : false;
                        }
                        setTimeout(()=>{
                            if(self.shortVideoIdFromHome!=''){
                                document.querySelector('.videoListBox .prism-player').click()
                            }
                        },1)
                    }else{
                        self.$toast(res.data.message);
                    }
                });
            }
        }
    },
    mounted(){},
    beforeDestroy(){
        this.setShortVideoId('')
    }
}
</script>
<style lang="scss" scoped>
.videoBox{
    overflow: auto;
    position: relative;
    height: calc(100vh - 1rem);
    -webkit-overflow-scrolling: touch;
}

</style>
<style>
.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity 1s;
}
.fade-in-enter, .fade-in-leave-to /* .fade-leave-active below version 2.1.8 */ {
   opacity: 0;
}
.select-list-wrap{
    /* overflow: hidden; */
    position: relative;
}
.select-list-wrap .listIsNo{
    font-size: 0.32rem;
    text-align: center;
    padding: 0.4rem;
    background: #000;
    color:#7e7e7e;
}
.select-list-wrap .videoBox .noData{
    font-size: 0.32rem;
    text-align: center;
    padding: 0.4rem;
    /* background: #000; */
    color:#000;
}
.select-list-wrap .divFlogBox{
    position:fixed;
    top: 0;
    left: 50%;
    right: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    max-width: 414px;
    transform: translateX(-50%);
    
}
.select-list-wrap .divFlogBoxHW{
    padding-top: calc((100vh - 4.3rem)/3);
    background-color: rgba(55,55,55,.9);
}
.select-list-wrap .divFlogBoxHW .icon-close-box i{
    color: #fff;
    font-size: .4rem;
    padding: .2rem;
    position: absolute;
    top: 0;    
}
#iframeCss{
    height: 4.3rem;
    border-width:0 !important;
}

</style>
