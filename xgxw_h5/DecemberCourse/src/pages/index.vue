<template>
    <div class="index-page">
        <div class="loading-wrap" :class="{'hidden':pageShow}">
            <div class="loading" :class="{'active':loadingActive}"></div>
        </div>
        <div class="wrap">
            <div class="section1">
                <img :src="bgd1" class="bgd"/>
                <div class="content">
                    <i class="rule-icon" @click="goRule"></i>
                </div>
            </div>
            <div class="section2">
                <img :src="bgd2" class="bgd"/>
                <div class="content">
                    <div class="video-box" v-if="isAndriod">
                        <div class="temp" v-if="dialogVisible"></div>
                        <Video :source="source" :duration="duration" v-else></Video>
                    </div>
                    <div class="video-box" v-else>
                        <Video :source="source" :duration="duration"></Video>
                    </div>
                </div>
            </div>
            <div class="section3">
                <img :src="bgd3" class="bgd"/>
                <div class="content">
                    <div class="btn1" @click="open"></div>
                    <div class="btn2" @click="goPage"></div>
                    <div class="btn3" @click="zhuan"></div>
                    <div class="btn4" @click="goCourse"></div>
                </div>
            </div>
        </div>
        <div class="dialog" v-if="dialogVisible">
            <transition name="show-in">
                <Login v-if="loginShow" :status.sync="status" :from="from" :channelId="channelId"></Login>
            </transition>
            <transition name="coupon-fade">
                <div class="coupon" v-if="couponShow">
                    <div class="tips">
                        <p>恭喜你尾号为{{userInfo.cellphone.substr(userInfo.cellphone.length-4,userInfo.cellphone.length)}}的账户</p>
                        <p>抢到一张50元专属优惠券</p>
                    </div>
                    <div class="use" @click="useEvent"></div>
                    <van-icon name="close" class="close-btn" @click="dialogVisible = false"/>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import bgd1 from '@/assets/image/index_bgd1.png'
import bgd2 from '@/assets/image/index_bgd2.png'
import bgd3 from '@/assets/image/index_bgd3.png'
import bgd4 from '@/assets/image/receive_bgd.png'
import bgd5 from '@/assets/image/coupon_bgd.png'
import Video from '@/components/Video'
import Login from '@/components/Login'
import env from '../../config/prod.env'
import tools from '../utils/tools'
import {store,mutations} from '../store'
function coverString(subStr,str){
   var reg = eval("/"+subStr+"/ig");
   return reg.test(str);
}
export default {
    data(){
        return {
            courseId:878,
            couponId:'',//仿生：329正式：181
            channelId:'',
            activityName:'cgt',
            loadingActive:false,
            pageShow:false,
            bgd1:bgd1,
            bgd2:bgd2,
            bgd3:bgd3,
            isIos:false,
            inApp:false,
            duration:260,
            source:'https://gr.1818618.cn/1.%E5%8F%91%E5%88%8A%E8%AF%8D%EF%BC%9A%E4%B8%80%E9%83%A8%E5%A5%87%E4%B9%A6%EF%BC%8C%E4%B8%80%E7%94%9F%E7%9A%84%E6%99%BA%E6%85%A7%20%E5%8E%8B%E7%BC%A9%E7%89%88.mp4',
            userInfo:{},
            dialogVisible:false,
            status:0,//-1:取消登录，1:登录成功领优惠券,2:登录成功去领书,3:登录完成去分享
            from:0,//1:抢,2:领,3:赚
            loginShow:false,
            couponShow:false,
            receiveFlag:'',
            isAndriod:false,
        }
    },
    components:{
        Video,
        Login
    },
    watch:{
        dialogVisible(cur){
            if(!cur){
                this.loginShow = this.couponShow = false;
                this.status = 0;
            }
        },
        status(cur){
            switch(true){
                case cur==1:
                    setTimeout(()=>{
                        this.loginShow = false;
                        let uInfo = this.$getCookie('uInfo');
                        if(uInfo){
                            this.userInfo = {
                                userId:JSON.parse(uInfo).userid,
                                token:JSON.parse(uInfo).accessToken,
                                cellphone:JSON.parse(uInfo).cellphone
                            }
                            this.$nextTick(()=>{
                                this.receiveCoupon()
                            })
                        }
                    },0)
                    break;
                case cur==2:
                    this.$router.push('/receive')
                    break;
                case cur==3:
                    setTimeout(()=>{
                        this.dialogVisible = this.loginShow = false;
                        let uInfo = this.$getCookie('uInfo');
                        if(uInfo){
                            this.userInfo = {
                                userId:JSON.parse(uInfo).userid,
                                token:JSON.parse(uInfo).accessToken,
                                cellphone:JSON.parse(uInfo).cellphone
                            }
                        }
                        this.setPosterShow(true)
                    },0)
                    break;
                case cur==-1:
                    this.dialogVisible = false;
                    break;
            }
        }
    },
    computed:{
      posterShow(){
        return store.posterShow;
      },
    },
    created(){
        this.couponId = this.$server.couponId;
        setTimeout(()=>{
            this.loadingActive = true;
        },0)
        document.title = '新课福利';
        this.appjudge();
        const imageArr = [bgd1,bgd2,bgd3,bgd4,bgd5];
        for(const bgd of imageArr){
            this.loadImage(bgd)
        }
        
        this.channelId = env.page.find(item=>window.location.href.includes(item.name)).channelId;
        sessionStorage.setItem('index',true)
    },
    mounted(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    methods:{
        setUserInfo:mutations.setUserInfo,
        setPosterShow:mutations.setPosterShow,
        setInApp:mutations.setInApp,
        andriodBrowser(){
            let isWx = false;
            let ua = window.navigator.userAgent.toLowerCase(),UA = navigator.userAgent;
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                isWx = true;
            }else if (ua.match(/QQ/i) == "qq" &&  ua.match(/MQQbrowser/i)!='mqqbrowser'){
                isWx = true;
            }
            if(!this.isIos&&!isWx){
                this.isAndriod = true;
            }
        },
        /**
         * 加载图片
         */
        loadImage(bgd){
            const image = new Image()
            image.src = bgd;
            image.onload = () => {
                if(bgd.includes('bgd3')){
                    setTimeout(()=>{
                        this.pageShow = true;
                    },1000)
                }
            }
        },
        /**
         * 判断是否在APP内部
         */
        appjudge(){
            this.isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            if(this.isIos){
                try {    
                window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
                    this.inApp = true;
                }
                catch(err) {
                    this.inApp = false;
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        this.inApp = true;
                    }
                }else{
                    this.inApp = false;
                }
            }
            if(this.inApp){
                let cellphone = window.sessionStorage.getItem('cellphone');
                let userId = window.sessionStorage.getItem('userId');
                let token = window.sessionStorage.getItem('token');
                if(cellphone){
                    this.userInfo = {
                        userId:userId,
                        token:token,
                        cellphone:cellphone
                    }
                    this.$nextTick(()=>{
                        this.getUserInfoById()
                    })
                }
            }else{
                let uInfo = this.$getCookie('uInfo');
                if(uInfo){
                    this.userInfo = {
                        userId:JSON.parse(uInfo).userid,
                        token:JSON.parse(uInfo).accessToken,
                        cellphone:JSON.parse(uInfo).cellphone
                    }
                    this.setUserInfo(JSON.parse(uInfo))
                }
            }
            this.setInApp(this.inApp)
            this.andriodBrowser()
        },
        /**
         * button打点
         */
        async pointButton(type,callback){
            const query = {
                type:type
            }
            const res = await this.$http.post(this.$server.pointButton,query)
            if(res.data.status==200){
                if(callback){
                    callback()
                }
            }
        },
        /**
         * “抢”字点击事件
         */
        open(){
            this.pointButton(2)
            if(this.inApp){
                let cellphone = window.sessionStorage.getItem('cellphone');
                let userId = window.sessionStorage.getItem('userId');
                let token = window.sessionStorage.getItem('token');
                if(cellphone){
                    this.userInfo = {
                        userId:userId,
                        token:token,
                        cellphone:cellphone
                    }
                    this.$nextTick(()=>{
                        this.getUserInfoById()
                        this.receiveCoupon()
                    })
                }else{
                    if(userId&&userId>=0){
                        this.bindPhoneEventByApp()
                    }else{
                        this.loginEventByApp()
                    }
                }
            }else{
                if(this.userInfo.userId){
                    this.receiveCoupon()
                }else{
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                        this.from = 1;
                    },1)
                }
            }
        },
        /**
         * APP登录
         */
        loginEventByApp(){
            if(this.isIos){
                try{
                    document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                        describe:'',
                        method:'loginWithAliToken',
                        params:{
                            channelId:this.channelId,
                            activityName:this.activityName
                        }
                    }) 
                }catch(err){
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                        this.from = 1;
                    },1)
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                        var message = JSON.stringify({
                            describe:'',
                            method:'loginWithAliToken',
                            params:{
                                channelId:this.channelId,
                                activityName:this.activityName
                            }
                        })
                        window.android.notify(message);
                    }
                }else{
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                        this.from = 1;
                    },1)
                }
            }
        },
        /**
         * APP绑定手机号
         */
        bindPhoneEventByApp(){
            if(this.isIos){
                try{
                    document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                        describe:'',
                        method:'bindPhone',
                        params:{
                            channelId:this.channelId,
                            activityName:this.activityName
                        }
                    }) 
                }catch(err){
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                        this.from = 1;
                    },1)
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                        var message = JSON.stringify({
                            describe:'',
                            method:'bindPhone',
                            params:{
                                channelId:this.channelId,
                                activityName:this.activityName
                            }
                        })
                        window.android.notify(message);
                    }
                }else{
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                        this.from = 1;
                    },1)
                }
            }
        },
        /**
         * 监听页面进入后台，与APP通信
         */
        visibilitychangeEvent(){
            if(this.receiveFlag!='') return;
            let isHidden = document.hidden;
            if (isHidden) {
                const video = document.querySelector(`#video`);
                video.pause()
            } else {
                const video = document.querySelector(`#video`);
                video.play()
                setTimeout(()=>{
                    let userId = window.sessionStorage.getItem('userId');
                    let cellphone = window.sessionStorage.getItem('cellphone');
                    let token = window.sessionStorage.getItem('token');
                    if(userId){
                        if(cellphone){
                            this.userInfo = {
                                userId:userId,
                                token:token,
                                cellphone:cellphone
                            }
                            this.$nextTick(()=>{
                                this.getUserInfoById()
                                this.receiveCoupon()
                            })
                        }else{
                            this.bindPhoneEventByApp()
                        }
                    }
                },1)
            }
        },
        /**
         * APP登录获取用户详情
         */
        async getUserInfoById(){
            const query = {
                userId:this.userInfo.userId
            }
            const res = await this.$http.post(this.$server.getUserInfoById,query,{userId:this.userInfo.userId,token:this.userInfo.token})
            if(res.data.status==200){
                let data = res.data.content;
                data.userid = res.data.content.id;
                this.setUserInfo(data)
            }
        },
        /**
         * 登录状态下领取优惠券
         */
        async receiveCoupon(){
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                userId:this.userInfo.userId,
                couponId:this.couponId
            }
            const res = await this.$http.post(this.$server.receiveCoupon,query,{userId:this.userInfo.userId,token:this.userInfo.token});
            this.$toast.clear();
            if(res.data.status==200){
                this.dialogVisible = true;
                setTimeout(()=>{
                    this.couponShow = true;
                },1)
                this.receiveFlag = 'success'
            }else{
                this.dialogVisible = false;
                const msg = res.data.message.includes('已领取')?'您已经参加过该活动':res.data.message
                this.$toast(msg)
                this.receiveFlag = 'fail'
            }
        },
        goRule(){
            this.pointButton(5)
            this.$router.push('/rule')
        },
        /**
         * 去领取页面
         */
        goPage(){   
            this.pointButton(3)
            if(this.inApp){
                let cellphone = window.sessionStorage.getItem('cellphone');
                let userId = window.sessionStorage.getItem('userId');
                let token = window.sessionStorage.getItem('token');
                if(cellphone){
                    this.$router.push('/receive')
                }else{
                    if(userId&&userId>=0){
                        this.bindPhoneEventByApp()
                    }else{
                        this.loginEventByApp()
                    }
                }
            }else{
                if(this.userInfo.userId){
                    this.$router.push('/receive')
                }else{
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                        this.from = 2;
                    },0)
                }
            }
        },
        /**
         * “赚”事件
         */
        zhuan(){
            this.pointButton(4)
            if(this.inApp){
                let cellphone = window.sessionStorage.getItem('cellphone');
                let userId = window.sessionStorage.getItem('userId');
                let token = window.sessionStorage.getItem('token');
                if(cellphone){
                    this.setPosterShow(true)
                }else{
                    if(userId&&userId>=0){
                        this.bindPhoneEventByApp()
                    }else{
                        this.loginEventByApp()
                    }
                }
            }else{
                if(this.userInfo.userId){
                    this.setPosterShow(true)
                }else{
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                        this.from = 3;
                    },0)
                }
            }
        },
        /**
         * 去课程详情页面
         */
        goCourse(){
            this.pointButton(7,this.goCourseEvent)
            
        },
        useEvent(){
            this.pointButton(8,this.goCourseEvent)
        },
        goCourseEvent(){
            if(this.isIos){
                try{
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                        describe:'去课程详情页',
                        method:'goCourseDetail',
                        params:{
                            courseId:this.courseId,
                            isCloseWebView:false,
                            channelId:this.channelId,
                            activityName:this.activityName	
                        }
                    }); 
                }catch(err){
                    let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com':'https://scm.youfushuyuan.com'
                    let activityShareUserId = tools.getQueryString('activityShareUserId')
                    if(activityShareUserId){
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}&activityShareUserId=${activityShareUserId}#/course/${this.courseId}`
                    }else{
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}#/course/${this.courseId}`
                    }
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        let message = JSON.stringify({
                            describe:'去课程详情页',
                            method:'openLesson',
                            params:{
                                courseId:this.courseId,
                                isCloseWebView:false,
                                channelId:this.channelId,
                                activityName:this.activityName			
                            }
                        })
                        window.android.notify(message);
                    }
                }else{
                    let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com':'https://scm.youfushuyuan.com'
                    let activityShareUserId = tools.getQueryString('activityShareUserId')
                    if(activityShareUserId){
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}&activityShareUserId=${activityShareUserId}#/course/${this.courseId}`
                    }else{
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}#/course/${this.courseId}`
                    }
                }
            }
        }
    },
    beforeDestroy(){
        document.removeEventListener('visibilitychange',this.visibilitychangeEvent)
    }
}
</script>
<style lang="scss" scoped>
    .index-page{
        min-height:100%;
        .wrap{
            position: relative;
            z-index: 1;
            .section1,.section2,.section3{
                position: relative;
                .bgd{
                    position: relative;
                    z-index: 1;
                }
                .content{
                    position: absolute;
                    top:0;
                    left:0;
                    width: 100%;
                    height:100%;
                    z-index: 2;
                    .rule-icon{
                        width: 0.57rem;
                        height:0.9rem;
                        position: absolute;
                        right:0.27rem;
                        top:0.25rem;
                        display: block;
                        background: url('../assets/image/rule_icon.png')no-repeat 50% 50% / cover;
                    }
                    .video-box{
                        width: 6.32rem;
                        height: 3.56rem;
                        margin:1.76rem auto 0;
                        border-radius: 0.2rem;
                        overflow: hidden;
                        .temp{
                            width: 100%;
                            height:100%;
                            background: url('../assets/image/surface.jpg')no-repeat 50% 50% / cover;
                        }
                    }
                    .btn1,.btn2,.btn3{
                        position: absolute;
                        top:0;
                        width: 90%;
                        left:5%;
                        height:1.3rem;
                        &.btn1{
                            top:0.4rem;
                        }
                        &.btn2{
                            top:2.1rem;
                        }
                        &.btn3{
                            top:3.8rem;
                        }
                    }
                    .btn4{
                        position: absolute;
                        top:5.6rem;
                        left:50%;
                        transform: translate(-50%,0);
                        width: 1.33rem;
                        height: 0.37rem;
                        background: url('../assets/image/buy.png')no-repeat 50% 50% /cover;
                    }
                }
            }
        }
        .dialog{
            position: fixed;
            top:0;
            left:50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 768px;
            height: 100%;
            z-index: 99;
            background: rgba(0,0,0,0.7);
            .coupon{
                width: 6.2rem;
                height:5.04rem;
                background: url('../assets/image/coupon_bgd.png')no-repeat 50% 50% / cover;
                position: absolute;
                top:45%;
                left:50%;
                margin-left: -3.1rem;
                margin-top:-2.52rem;
                .tips{
                    position: absolute;
                    top:2.8rem;
                    width: 100%;
                    left:0;
                }
                p{
                    color:#fff;
                    font-size: 0.25rem;
                    line-height: 0.36rem;
                    text-align: center;
                    width: 100%;
                }
                .use{
                    width: 50%;
                    position: absolute;
                    height:0.8rem;
                    bottom:0.6rem;
                    left: 25%;
                }
                .close-btn{
                    font-size: 0.6rem;
                    color:#fff;
                    position: absolute;
                    bottom:-0.6rem;
                    left: 50%;
                    margin-left: -0.3rem;
                }
            }
        }
        .loading-wrap{
            position: fixed;
            top:0;
            left: 50%;
            transform: translate(-50%,0);
            width: 100%;
            height: 100vh;
            z-index: 3;
            background: #E4ECF0;
            max-width: 768px;
            &.hidden{
                opacity: 0;
                visibility: hidden;
                transition:opacity 0.3s linear,visibility 1ms 0.4s;
            }
            .loading{
                background: #fff;
                position: absolute;
                top:40%;left:50%;
                transform:translate(-50%,-50%);
                width: 10px;
                height: 20px;
                &.active{
                    animation: loader 1s ease-in-out infinite;
                    animation-delay: 0.4s;
                }
                &::before{
                    content: '';
                    display:block;
                    position: absolute;
                    width: inherit;
                    height: inherit;
                    background: #fff;
                    animation: inherit;
                    right: 15px;
                    animation-delay: 0.2s;
                }
                &::after{
                    content: '';
                    display:block;
                    position: absolute;
                    width: inherit;
                    height: inherit;
                    background: #fff;
                    animation: inherit;
                    left: 15px;
                    animation-delay: 0.6s;
                }
            }
        }
        @keyframes loader {
            0%, 100% {
                box-shadow: 0 0 0 #fff, 0 0 0 #fff;
            }
            50% {
                box-shadow: 0 -5px 0 #fff, 0 5px 0 #fff;
            }
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s;
            }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
        .coupon-fade-enter-active, .coupon-fade-leave-active {
            transition: all 0.5s;
        }
        .coupon-fade-enter, .coupon-fade-leave-to {
            transform: translateY(-10px);
            opacity: 0;
        }
        .show-in-enter-active, .show-in-leave-active {
            transition: transform 0.5s;
        }
        .show-in-enter {
            transform:scale(0);
        }
        .show-in-leave-to{
            opacity: 0;
        }
    }
</style>