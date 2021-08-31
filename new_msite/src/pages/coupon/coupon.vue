<template>
    <div class="coupon-wrapper" :class="!btnShow?'inApp':''">
        <OpenApp v-if="btnShow"/>
        <div class="top">
            <div class="coupon-data-wrapper">
                <div class="coupon-data-content">
                    <div class="coupon-price">
                        <span class="symbol">￥</span>
                        <span class="denomination">{{couponData.reducedPrice}}</span>
                        <span>
                            <span class="unit">元</span>
                            <span class="des">优惠券</span>
                        </span>
                    </div> 
                    <div class="full-reduction" v-show="couponData.couponType==2">
                        <p>满{{couponData.minAmount}}减{{couponData.reducedPrice}}元</p>
                    </div>
                    <div class="date" v-show="couponData.beginAt">
                        <p>领取有效期:{{couponData.beginAt}}至{{couponData.endAt}}</p>
                    </div>
                    <span class="detail" @click="dialogFlag=true">?</span>
                </div>
            </div>
            <div class="input-area">
                <div v-if="couponData.expiredSign==0">
                    <div class="input-item clearfix">
                        <input type="tel" class="phone" placeholder="输入手机号领取" maxlength="11" v-model="phone"/>
                        <p class="btn code-btn" :class="codeText=='获取验证码'?'state1':'state2'" @click="sendSms">{{codeText}}<van-loading v-show="codeText.length==0"/></p>
                    </div>
                    <div class="input-item">
                        <div class="clearfix" v-if="!success">
                            <input type="tel" class="code" placeholder="输入验证码" maxlength="6" v-model="code"/>
                            <p class="btn receive-btn" :class="codeText=='获取验证码'||this.codeText==''?'state2':'state1'" @click="receive">领取</p>
                        </div>
                        <div v-else> 
                            <a v-if="couponData.couponType==3" @click="goCouponCourse">立即使用</a>
                            <div v-else>
                                <a v-if="wx" :href="isIos?iosDown:androidDown">立即查看</a>
                                <div v-else>
                                    <a v-if="inApp" @click="closeWebView">立即查看</a>
                                    <a v-else :href="isIos?'xueguoxuewang://':'xgx://into/index'" @click="openAppHandle">立即查看</a>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
                <p class="expire" v-else>已失效</p>
            </div>
        </div>
        <div class="bottom">
            <p class="module-title">{{couponData.couponType==3?'指定可用课程':'好课推荐'}}</p>
            <div class="list">
                <div class="nullImg" v-if="finish&&list.length==0">
                    <img :src="emptyImg"/>
                </div>
                <div v-else>
                    <!-- <courseItem v-for="(item,index) in list" :data="item" :key="index" :type="2"></courseItem> -->
                    <div class="one-course-item" v-for="(item,index) in list" :key="index">
                        <ul>
                            <li @click="goCourse(item.id)">
                                <div class="img-wrap" v-lazy:background-image="lazyBgImg">
                                    <img class="course-img" :src="item.surfacePlot" alt="">
                                    <img class="course-free" v-show="item.timeLimitType==0" :src="img1" alt="">
                                    <img class="course-free" v-show="item.timeLimitType==1" :src="img2" alt="">
                                    <img class="course-free" v-show="item.timeLimitType==2" :src="img3" alt="">
                                    <img class="course-type" v-if="item.courseType == 1" :src="looks" alt="">
                                    <img class="course-type" v-if="item.courseType == 2" :src="hears" alt="">
                                </div>
                                <div class="course-content">
                                    <p class="course-title textEllipsis">{{item.title}}</p>
                                    <p class="course-intro c9a textEllipsis">{{item.intro}}</p>
                                    <p class="course-people c9a"><span>{{item.courseBrowsCount>10000?(item.courseBrowsCount/10000).toFixed(1)+'w+':item.courseBrowsCount}}人看过</span><span>{{item.courseUserLikeCount}}赞</span></p>
                                    <p class="course-rate" v-if="item.isVip==1">VIP</p>
                                    <p class="course-rate" v-else>{{item.sellingPrice==0?'免费':`${item.sellingPrice}币`}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="loading-more" ref="more" v-show="loadFlag">
                <van-loading type="spinner" />
            </div>
        </div>
        <div class="dialog-wrapper" :class="dialogFlag?'show':''">
            <div class="detail-box">
                <p class="t">可使用课程</p>
                <div class="des-box"><p class="des">{{courseTitles}}</p></div>
                <a class="button" @click="dialogFlag=false">知道了</a>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import emptyImg from '@/assets/image/no_buy.png'
import OpenApp from '@/components/openApp.vue'
const regExp = /^1[3|5|7|8|][0-9]{9}$/;
let timer;
const iosSchema = 'xueguoxuewang://flag=couponList'
const androidSchema = "coupon://first/enter"
const iosDown = 'https://itunes.apple.com/cn/app/id1447039784?ls=1&mt=8'
const androidDown = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.xueguoxue.xgxw2018'
import looks from '@/assets/image/looks.png'
import hears from '@/assets/image/hears.png'
import img1 from '@/assets/image/xsmf.png'
import img2 from '@/assets/image/xszk.png'
import img3 from '@/assets/image/sec_kill.png'
import img4 from '@/assets/image/lazy-bg-2.png'
export default {
    data(){
        return {
            emptyImg:emptyImg,
            iosDown:iosDown,
            androidDown:androidDown,
            iosSchema:iosSchema,
            androidSchema:androidSchema,
            couponId:'',
            phone:'',
            code:'',
            codeText:'获取验证码',
            success:false,
            couponData:{
                minAmount:'',
                reducedPrice:'0',
                beginAt:'',
                endAt:'',
                couponType:'',
                expiredSign:''
            },
            pagation:{
                currentPage:1,
                pageSize:10
            },
            list:[],
            loadFlag:true,
            finish:false,
            wx:false,
            isIos:false,
            inApp:false,
            btnShow:true,
            dialogFlag:false,
            courseTitles:'',
            img1:img1,
			img2:img2,
            img3:img3,
            looks:looks,
            hears:hears,   			
			lazyBgImg:img4,
        }
    },
    components:{OpenApp},
    computed:{
        ...mapState(['isVip']),
    },
    created(){
        try {
            let data = window.location.hash.split('#/receiveCouponH5?')[1].split("=");
            let couponId = data[0]=='coupon'?data[1]:'';
            this.couponId = couponId.includes("&appinstall")?couponId.split('&appinstall')[0]:couponId;
            this.getCouponsInfo()
            var ua = window.navigator.userAgent.toLowerCase();
            this.wx = ua.match(/MicroMessenger/i) == 'micromessenger'?true:false;
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
            var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            this.isIos = isIos?true:false;
        } 
        catch(err){
            this.$router.push('/error')
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.isApp();
            this.getShareDesc();
        })
    },
    methods:{
        /**
         * 判断是否在APP里面
         */
        isApp(){
            if(this.isIos){
                try {    
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
                    this.inApp = true;
                    this.btnShow = false;
                }
                catch(err) {}
            }else{
                if(window.android){
                    if(window.android.notify){
                        this.inApp = true;
                        this.btnShow = false;
                    }
                }
            }
        },
        /**
         * 在APP里关闭webview
         */
        closeWebView(){
            if(this.isIos){
                try{
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                       describe:'在APP内部直接关闭webview',
                       method:'closeWebView'
                    }); 
                }catch(err){

                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        let message = JSON.stringify({
                            describe:'在APP内部直接关闭webview',
                            method:'closeWebView',
                            params:{}
                        })
                        window.android.notify(message);
                    }
                }
            }
        },
        goCourse(courseId){
            if(this.isIos){
                try{
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                        describe:'去课程详情页',
                        method:'goCourseDetail',
                        params:{
                            courseId:courseId,
                            isCloseWebView:true	
                        }
                    }); 
                }catch(err){
                    if(window.location.href.includes('xgxm.xueguoxue.com')){
                        window.location.href = 'https://xgxm.xueguoxue.com/#/course/'+courseId
                    }
                    else{
                        window.location.href = 'https://scm.youfushuyuan.com/#/course/'+courseId
                    }
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        var message = JSON.stringify({
                            describe:'去课程详情页',
                            method:'openLesson',
                            params:{
                                courseId:courseId,
                                isCloseWebView:true		
                            }
                        })
                        window.android.notify(message);
                    }
                }else{
                    if(window.location.href.includes('xgxm.xueguoxue.com')){
                        window.location.href = 'https://xgxm.xueguoxue.com/#/course/'+courseId
                    }
                    else{
                        window.location.href = 'https://scm.youfushuyuan.com/#/course/'+courseId
                    }
                }
            }
        },
        /**
         * 在APP里面打开，获取分享信息并把控制权交给APP
         */
        getShareDesc(){
            let query = {
                targetId:this.couponId,
                type:1
            }
            this.$http.post(this.$server.getShareDesc,query).then(res=>{
                if(res.data.status==200){
                    let message = {
                        describe:'在APP内部展示页面的分享按钮',
                        method:"share",
                        params:{
                            title:res.data.content.title||'',
                            desc:res.data.content.describe||'',
                            link:window.location.href,
                            imgUrl:res.data.content.iconUrl||'http://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/logo.png'
                        }
                    }
                    if(this.isIos){
                        try{
                            window.webkit.messageHandlers.iOSAppMethodName.postMessage(message)
                        }catch(err){

                        }
                    }else{
                        if(window.android){
                            if(window.android.notify){
                                window.android.notify(JSON.stringify(message))
                            }
                        }    
                    }
                    if(this.wx){
                        this.wxshare(res.data.content)
                    }
                }
            })
        },
        goCouponCourse(){
            this.$router.push({
                path:'/couponCourse',
                query:{couponId:this.couponId}
            })
        },
        systemJudge(){
            if(window.android){
				if(window.android.openByApp){
					this.btnShow = false;
				}
            }
            try {
            //在这里运行代码
            window.webkit.messageHandlers.openByApp.postMessage("messageBody")
            this.btnShow = false;
            } catch(err) {
           
            }
        },
        sendSms(){
            if(this.success) return false;
            if(this.codeText!='获取验证码') return false;
            if(!regExp.test(this.phone)){
                this.$toast('输入手机号有误，请重新输入');
                return false;
            }
            this.codeText = '';
            let params = {
                cellphone:this.phone,
                smsType:5,
                loading:'false'
            }
            this.$http.post(this.$server.sendSms,params).then(res=>{
                if(res.data.status == 200){
                    let time = 60;
                    this.codeText = `重新获取(${time}s)`
                    timer = setInterval(()=>{
                        time--;
                        this.codeText = `重新获取(${time}s)`
                        if(time==0){
                            this.codeText='获取验证码';
                            clearInterval(timer)
                        }
                    },1000)
                }
            })  
        },
        receive(){
            if(this.codeText=='获取验证码'||this.codeText=='') return false;
            let code = this.code;
            let phone = this.phone;
            if(code.length==0||!regExp.test(phone)){
                this.$toast('输入有误，请重新输入');
                return false;
            }
            let params = {
                cellphone:phone,
                veriCode:code,
                couponIds:this.couponId
            }
            this.$http.post(this.$server.receiveCouponByCellphone,params).then(res=>{
                if(res.data.status == 200){
                    this.success = true;
                    clearInterval(timer)
                    this.codeText='您已获取';
                }
            })
        },
        getCouponsInfo(){
            let params = {
                couponId:this.couponId
            }
            this.$http.post(this.$server.getCouponsInfoById,params).then(res=>{
                if(res.data.status == 200){
                    this.list = res.data.content.courseList;
                    this.loadFlag = false;
                    this.finish = true;
                    let couponData = {
                        minAmount:res.data.content.minAmount,
                        reducedPrice:res.data.content.reducedPrice,
                        beginAt:res.data.content.beginAt,
                        endAt:res.data.content.endAt,
                        couponType:res.data.content.couponType,
                        expiredSign:res.data.content.expiredSign
                    }
                    this.couponData = couponData;
                    if(res.data.content.couponType==3){
                        this.courseTitles = res.data.content.courseList.map((item)=>item.title).join('、');
                    }else if(res.data.content.couponType<3){
                        this.courseTitles = '所有课程均可用'
                    }
                }else if(res.data.status ==  500){
                    if(this.inApp){
                        this.$toast({
                            message:res.data.message,
                            forbidClick:true
                        })
                        setTimeout(()=>{
                            this.closeWebView()
                        },2000)
                    }else{
                        this.$router.push('/error')
                    }
                }
            })
        },
        wxshare(obj){
            let url = encodeURIComponent(window.location.href.split('#')[0])
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    let title = obj.title||"免费领取【学国学网】优惠券，学习中华优秀传统文化"
                    let desc = obj.describe||"学国学网专注优秀传统文化教育"
                    let link = window.location.href
                    let imgUrl = obj.iconUrl||"http://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/logo.png"
                    wx.config({
                        debug:false,
                        appId:data['appId'],
                        timestamp:data['timeStamp'],
                        nonceStr:data['nonceStr'],
                        signature:data['signature'],
                        jsApiList: [
                            'checkJsApi',
                            'updateAppMessageShareData',
                            'updateTimelineShareData',
                            'onMenuShareAppMessage',
                            'onMenuShareTimeline',
                            'onMenuShareQQ'
                        ]
                    }); 
                    wx.ready(function() {
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            },
                        })
                        wx.onMenuShareQQ({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                            // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            })
		},
        openAppHandle(){       
            let d = new Date();
            let t0 = d.getTime();
            this.$toast.loading();
            var delay = setInterval(function(){
                var d = new Date();
                var t1 = d.getTime();
                if( t1-t0<5000 && t1-t0>4000){
                    window.location.href = this.isIos?iosDown:androidDown;
                }
                if(t1-t0>=5000){
                    clearInterval(delay);
                }
            },1000);
        },
        // pullDownRefresh(){
        //     if(this.finish) return false;
        //     if(this.loadFlag) return false;
        //     let dom = document.body;
        //     let h = this.$refs.more.clientHeight+10;
        //     var wScrollY = dom.scrollTop;
        //     var wInnerH = dom.clientHeight;
        //     var bScrollH = dom.scrollHeight;
        //     if (wScrollY + wInnerH >= bScrollH-h) {
        //         this.loadFlag = true;
        //         this.pagation.currentPage++;
        //         this.$nextTick(()=>{
        //             this.getCourse();
        //         })
        //     }
        // },
        
    }
}
</script>
<style lang="scss" scoped>
    .coupon-wrapper{
        padding: 1.28rem 0 0.5rem;
        height: 100%;
        overflow: scroll;
        &.inApp{
            padding: 0.3rem 0 0.5rem;
        }
        .top{
            .coupon-data-wrapper{
                padding: 0 0.48rem;
                .coupon-data-content{
                    background: url('../../assets/image/coupon_bgd.png')no-repeat 50% 50%;
                    background-size: cover;
                    height: 3.2rem;
                    text-align: center;
                    position: relative;
                    .coupon-price{
                        display: inline-block;
                        font-size: 0;
                        margin-top:0.5rem;
                        span{
                            color:#FFF479;
                            display: inline-block;
                            vertical-align: middle;
                            &.symbol{
                                font-size: 0.58rem;
                                vertical-align: bottom!important;
                                position: relative;
                                bottom:0.15rem;
                                left: 0.15rem;
                            }
                            &.denomination{
                                font-size: 1.06rem;
                                font-weight: 700;
                                margin:0 0.04rem;
                            }
                            &.unit,&.des{
                                display: block!important;
                                font-size: 0.4rem;
                                line-height: 0.4rem;
                                margin-left: 0.02rem;
                                text-align: left
                            }
                        }
                    }
                    .full-reduction{
                        p{
                            display: inline-block;
                            font-size: 0.28rem;
                            line-height: 0.28rem;
                            letter-spacing: 0.05rem;
                            color:#fff;
                            position: relative;
                            &::before{
                                content: '';
                                display: block;
                                width: 1rem;
                                height: 1px;
                                background: #fff;
                                position: absolute;
                                top: 50%;
                                left: -1.2rem;
                            }
                            &::after{
                                content: '';
                                display: block;
                                width: 1rem;
                                height: 1px;
                                background: #fff;
                                position: absolute;
                                top: 50%;
                                right: -1.2rem;
                            }
                        }
                    }
                    .date{
                        position: absolute;
                        left: 0;
                        bottom:0.5rem;
                        width: 100%;
                        p{
                            color:#fff;
                            opacity: 0.6;
                            display: inline-block;
                            font-size: 0.28rem;
                            line-height: 0.28rem;
                        }
                    }
                    .detail{
                        position: absolute;
                        top:0.3rem;
                        right:0.3rem;
                        width: 0.4rem;
                        height: 0.4rem;
                        border-radius: 50%;
                        border:1px solid #fff;
                        color:#fff;
                        font-size: 0.24rem;
                        line-height: 0.4rem;
                        text-align: center;
                    }
                }
            }
            .input-area{
                padding: 0.5rem 0.3rem;
                .expire{
                    background: #A9A9A9;
                    width: 100%;
                    line-height: 0.28rem;
                    padding: 0.3rem 0;
                    text-align: center;
                    color:#fff;
                    font-size: 0.28rem;
                    letter-spacing:1px;
                }
                .input-item{
                    font-size: 0.28rem;
                    margin-bottom: 0.25rem;
                    &:last-child{
                        margin:0;
                    }
                    input{
                        line-height: 0.56rem;
                        height: 0.28rem;
                        box-sizing: content-box;
                        padding: 0.3rem 0;
                        text-align: center;
                        width: 4.7rem;
                        border:none;
                        outline: none;
                        background: #E8E8E8;
                        float: left;
                        border-radius: 0px;
                    }
                    .code-btn,.receive-btn{
                        float:right;
                        width: 1.9rem;
                        line-height: 0.28rem;
                        height: 0.28rem;
                        padding: 0.3rem 0;
                        text-align: center;
                        color:#fff;
                        position: relative;
                        box-sizing: content-box;
                        
                        &.state1{
                            background: #C30725;
                            &:active{
                                background: #a4041e;
                            }
                        }
                        &.state2{
                            background: #A9A9A9;
                             &:active{
                                background: #9a9a9a;
                            }
                        }
                        .van-loading{
                            position: absolute;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                    }
                    a{
                        display: block;
                        background: #C30725;
                        width: 100%;
                        line-height: 0.28rem;
                        padding: 0.3rem 0;
                        text-align: center;
                        color:#fff;
                    }
                }
            }
        }
        .bottom{
            .module-title{
                font-size: 0.36rem;
                color:#000;
                padding: 0 0.25rem;
                margin-bottom:0.5rem;
            }
            .list{
                padding: 0 0.1rem;
            }
            .loading-more{
                padding: 0.25rem 0;
                text-align: center;
                .van-loading{
                    display: inline-block;
                }
            }
            .nullImg{
                text-align: center;
                img{
                    width: 4rem;
                    display: inline-block;
                }
            }
        }
        .dialog-wrapper{
            position: fixed;
            width: 100%;
            height: 100%;
            left:0;
            top:0;
            background: rgba(0,0,0,0.7);
            z-index: 10;
            visibility:hidden;
            &.show{
                visibility: visible;
                .detail-box{
                    opacity: 1;
                    transform: translateY(0)
                }
            }
            .detail-box{
                position: absolute;
                top:50%;
                left: 50%;
                margin-left:-2.85rem;
                margin-top:-1.85rem;
                transform: translateY(-1rem);
                opacity: 0;
                width: 5.7rem;
                height: 3.9rem;
                background: #fff;
                border-radius: 5px;
                padding: 0.4rem;
                text-align: center;
                transition: all 0.3s;
                .t{
                    color:#3A3A3A;
                    font-size: 0.32rem;
                    display: inline-block;
                    margin-bottom:0.2rem;
                }
                .des-box{
                    color:#3A3A3A;
                    font-size: 0.28rem;
                    height: 1.6rem;
                    overflow-y:auto;
                    margin-bottom:0.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.1rem;
                }
                .button{
                    display: inline-block;
                    width: 1.8rem;
                    height: 0.8rem;
                    font-size: 0.32rem;
                    color:#fff;
                    text-align: center;
                    line-height: 0.8rem;
                    border-radius: 25px;
                    background: #C52D3C;
                    box-shadow: 0 0 5px #C52D3C;
                }
            }
        }
    }
    .one-course-item{
	&.hasBorder{
		.img-wrap{
			border-radius: 0.1rem 0 0 0.1rem;
			border-top:1px solid #E3E3E5;
			border-left:1px solid #E3E3E5;
			border-bottom:1px solid #E3E3E5;
		}
		.course-content{
			border-top:1px solid #E3E3E5;
			border-right:1px solid #E3E3E5;
			border-bottom:1px solid #E3E3E5;
			border-radius: 0 0.1rem 0.1rem 0;
		}
	}
}

ul{
	li{
		padding: .1rem;
		display: flex;
		.img-wrap{
			position: relative;
			width: 3.45rem;
			height: 2rem;
			border-radius: .1rem;
			overflow: hidden;
			background-size: 100% 100%;
			.course-img{
				width: 100%;
				height: 100%;
			}
			.course-type{
				width: 0.52rem;
				height: 0.3rem;
				position: absolute;
				left: .1rem;
				bottom: .1rem;
			}
			.course-free{
				width: 1.2rem;
				height: .5rem;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
		.course-content{
			padding-left: .2rem;
			width: calc(100% - 3.45rem);
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.course-title{
				font-size: .3rem;
				color: #1A1A1A;
				width: 3rem;
			}
			.course-people{
				font-size: .24rem;
				line-height: .4rem;
				/* margin: .18rem 0; */
				img{
					height: .4rem;
					width: .4rem;
					margin-left: .3rem;
					vertical-align: middle;
				}
				span{
					display: inline-block;
					vertical-align: middle;
					width: 50%;
				}
				span:first-child{
					min-width: 50%;
				}
			}
			.course-rate{
				font-size: .28rem;
				color: #C30725;
			}
		}
	}
}

</style>
