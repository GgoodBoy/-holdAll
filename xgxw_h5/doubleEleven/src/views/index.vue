<template>
    <div class="wrap" :class="{'auto-height':ruleShow}">
        <transition name="fade">
            <div class="loading-wrap" v-if="pageLoading">
                <div class="loading"></div>
            </div>
        </transition>
        <div class="content">
            <div class="top-box">
                <div class="count-down">
                    <p class="tips">距离活动结束还有</p>
                    <p class="time">
                        <template  v-if="time.day!=''">
                            <span>{{time.day}}</span>天
                        </template>
                        <span>{{time.hours}}</span>时
                        <span>{{time.minutes}}</span>分
                        <!-- <span>{{time.seconds}}</span>秒 -->
                    </p>
                </div>
                <div class="share-btn" @click="shareBtnEvent">
                    <img :src="require('../assets/image/share_icon.png')"/>
                </div>
            </div>
            <div class="middle-box">
                <div class="tips-box">
                    <div class="tips"></div>
                    <div class="rule" @click="ruleEvent"><van-icon name="warning" />规则</div>
                </div>
                <div class="coupon-box">
                    <div class="bgd"></div>
                    <div class="btn" @click="receiveEvent"></div>
                </div>
            </div>
            <div class="bottom-box">
                <div class="discount-box">
                    <div v-for="item in discountArr" :key="item.discount" :class="[item.className,item.active?'active':'']" @click="chooseDiscount(item)"></div>
                </div>
                <!-- <div class="classify-box" v-if="mtype==1">
                    <div class="classify-list">
                        <div class="classify-item" v-for="(item,index) in classifyArr" :key="index" @click="chooseClassify(index)" >
                            <p :class="{'active':item.active}">{{item.name}}</p>
                        </div>
                    </div>
                </div> -->
                <van-list
                    class="course-list"
                    v-model="loading"
                    :finished="finished"
                    @load="searchCourseList"
                >
                    <div class="course-item" v-for="(item,index) in courseList" :key="index" @click="goCourse(item.id)">
                        <div class="course-item-block">
                            <div class="t">
                                <img class="surface" :src="item.surfacePlot"/>
                                <div class="icon-box">
                                    <i class="icon"></i>
                                    <p class="discount">{{discount}}折</p>
                                </div>
                            </div>
                            <div class="b">
                                <p class="title">{{item.title}}</p>
                                <div class="price clearfix">
                                    <p class="original-price">{{item.sellingPrice}}元</p>
                                    <p class="selling-price">{{item.nowPrice}}<span class="unit">元</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="empty" v-if="finished&&courseList.length==0">暂无课程~</p>
                </van-list>
            </div>
            <div class="entry" :class="{'adult':mtype==2,'child':mtype==1}" @click="goIndex"></div>
        </div>
        <div class="dialog" v-if="dialogVisible" @click="closeDialog">
            <transition name="show-in">
                <div class="box" v-if="loginShow" @click.stop="">
                    <p class="title">登录</p>
                    <div class="item">
                        <div class="item-box phone">
                            <label>手机号</label>
                            <input type="tel" placeholder="请输入手机号" maxlength="11" v-model="cellphone"/>
                        </div>
                        <p class="error" v-if="phoneError.length>0">{{phoneError}}</p>
                    </div>
                    <div class="item">
                        <div class="item-box code">
                            <label>验证码</label>
                            <input type="tel" placeholder="输入验证码" maxlength="6" v-model="code"/>
                        </div>
                        <p class="code-btn" :class="{'disabled':codeText!='获取验证码'}"  @click="sendSms">{{codeText}}</p>
                        <p class="error" v-if="codeError.length>0">{{codeError}}</p>
                    </div>
                    <div class="btn" @click="loginEvent">登录</div>
                </div>
            </transition>
            <transition name="coupon-show">
                <div class="coupon" :class="{'success':receiveFlag=='success','fail':receiveFlag=='fail','xiajia':receiveFlag=='xiajia'}" v-if="couponShow">
                    <div class="bgd" @click.stop="">
                        <p class="t">{{couponTime}}s</p>
                    </div>
                    <van-icon name="close" @click="dialogVisible = false" />
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="share-dialog" v-if="dialogVisbile2" @click="dialogVisbile2=false">
                <i class="share-arrow"></i>
                <p class="tip3">请点击上方{{inApp?'按钮':'···'}}发送给朋友</p>
            </div>
        </transition>
        <transition name="fade">
            <div class="share-box-dialog" v-if="dialogVisbile3" @click="dialogVisbile3=false">
                <div class="box" @click.stop="">
                    <div class="icon-area">
                        <div ref="copyBtn1" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="CopyVal(1)">
                            <div class="wexin"></div>
                            <p>微信</p>
                        </div>
                        <div ref="copyBtn2" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="CopyVal(2)">
                            <div class="pyq"></div>
                            <p>朋友圈</p>
                        </div>
                    </div>
                    <div class="cancel" @click.stop="dialogVisbile3=false">取消分享</div>
                </div>
            </div>
        </transition>
        <input id="input" :value="link" readonly/>
        <template v-if="!inApp&&!inOther">
            <Rule :ruleShow.sync="ruleShow"/>
        </template>
    </div>
</template>
<script>
import {store,mutations} from '../store'
import Rule from './rule.vue'
import Clipboard from 'clipboard'
import bgd from '../assets/image/top_bgd.png'
import receive1 from '../assets/image/receive1.png'
import receive2 from '../assets/image/receive2.png'
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}

export default {
    data(){
        return{
            userInfo:{},//用户信息
            isIos:false,//系统
            inApp:false,//是否在学国学网
            inOther:false,//是否在微信、微博内
            couponId:'',//优惠券id
            classifyArr:[],
            discountArr:[
                {className:'discount3',active:false,discount:3},
                {className:'discount5',active:false,discount:5},
                {className:'discount8',active:false,discount:8}
            ],
            mtype:1,
            classId:'',
            discount:'',
            pageNo:1,
            pageSize:20,
            courseList:[],
            pageLoading:true,//页面page
            httpFlag:false,//http请求flag
            timer:null,//活动倒计时
            time:{
                day:'00',
                hours:'00',
                minutes:'00',
                // seconds:'00'
            },
            dialogVisible:false,
            loginShow:false,
            cellphone:'',
            code:'',
            codeText:'获取验证码',
            codeTimer:null,
            phoneError:'',
            codeError:'',
            couponShow:false,
            couponTimer:null,
            couponTime:5,
            receiveFlag:'',
            ruleShow:false,
            dialogVisbile2:false,
            dialogVisbile3:false,
            clipboard1:'',
            clipboard2:'',
            link:'',
            loading:false,
            finished:false,
            parent:''
        }
    },
    components:{
        Rule
    },
    watch:{
        dialogVisible(cur){
            if(!cur){
                this.loginShow = false;
                this.couponShow = false;
                this.cellphone = this.code = this.phoneError = this.codeError = '';
                this.codeText = '获取验证码';
                clearInterval(this.codeTimer)
            }
        },
        dialogVisbile3(cur){
            if(cur){
                setTimeout(()=>{
                    this.clipboard1 = new Clipboard(this.$refs.copyBtn1)
                    this.clipboard2 = new Clipboard(this.$refs.copyBtn2)
                },300)
            }
        },
        couponShow(cur){
            if(cur){
                this.couponTimer = setInterval(()=>{
                    if(this.couponTime<=1){
                        clearInterval(this.couponTimer)
                        this.dialogVisible = false;
                    }
                    this.couponTime--;
                },1000)
            }else{
                clearInterval(this.couponTimer)
                this.couponTime = 5
            }
        }
    },
    created(){
        document.title = '双11国学盛典'
        this.mtype = this.$route.query.mtype
        // if(this.mtype==1){
        //     this.getclassifyId()
        // }else if(this.mtype==2){
        //     this.classId = '0';
        //     this.discountArr[0].active = true;
        //     this.discount = this.discountArr[0].discount;
        // }else{
            
        // }
        this.classId = '0';
        this.discountArr[0].active = true;
        this.discount = this.discountArr[0].discount;
        this.appjudge()
        this.getCouponInfo()
        this.startCountDown()
        let uInfo = this.$getCookie('uInfo');
        if(uInfo){
            this.userInfo = {
                userId:JSON.parse(uInfo).userid,
                token:JSON.parse(uInfo).accessToken
            }
        }
        this.loadImage(bgd)
        this.loadImage(receive1)
        this.loadImage(receive2)
    },
    mounted(){
        document.title = '双11国学盛典'
        this.link = window.location.href;
        this.share();
        window.addEventListener('message', (e) => {
            if(e.data.from=='pc'){
                let data = e.data.data;
                this.parent = 'pc'
                if(data==''){
                    this.$delCookie('uInfo')
                    this.userInfo = {} 
                }else{
                    let temp = JSON.parse(data)
                    let userInfo = {
                        accessToken:temp.token,
                        userid:temp.userId,
                    }
                    this.userInfo = {
                        userId:temp.userId,
                        token:temp.token
                    }
                    this.$setCookie("uInfo", JSON.stringify(userInfo));
                }
            }
        });
    },
    methods:{
        loadImage(url){
            let image = new Image();
            image.src = url
            image.onload = ()=>{
                
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
            let ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.inOther = true;
            }else if (ua.includes('weibo')){
                this.inOther = true;
            }else{
                this.inOther = false;
            }
        },
        getCouponInfo(){
            this.$http.post(this.$server.getCouponInfo,{}).then(res=>{
                if(res.data.status==200){
                    this.couponId = res.data.content.id||'';
                    setTimeout(()=>{
                        this.pageLoading = false;
                    },1200)
                }
            })
        },
        getclassifyId(){
            this.$http.post(this.$server.getclassifyId,{}).then(res=>{
                if(res.data.status==200){
                    this.classifyArr = [...res.data.content]
                    this.classifyArr.push({
                        name:'其他',
                        id:'-1'
                    })
                    this.classifyArr.forEach(item=>item.active=false)
                    this.classifyArr[0].active = true;
                    this.classId = this.classifyArr[0].id;
                    this.discountArr[0].active = true;
                    this.discount = this.discountArr[0].discount;
                    this.$nextTick(()=>{
                        this.searchCourseList()
                    })
                }
            })
        },
        searchCourseList(){
            if(this.classId=='') return;
            let query = {
                mtype:Number(this.mtype),
                classId:Number(this.classId),
                discount:this.discount,
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }
            this.$http.post(this.$server.searchCourseList,query).then(res=>{
                if(res.data.status==200){
                    this.courseList = [...this.courseList,...res.data.content.list]
                    this.courseList.forEach(item=>{
                        let temp = (item.sellingPrice*100*item.timeLimitDiscount)/1000
                        item.nowPrice = Math.round(temp*100)/100;
                        
                    })
                    this.pageNo++;
                    this.loading = false;
                    this.finished = res.data.content.isLastPage;
                }
            })
        },
        /**
         * 倒计时
         */
        startCountDown(){
            let begin = new Date().getTime();
            let end = new Date('2020/11/14 00:00:00').getTime();
            let time = parseInt((end-begin)/1000)
			let date;
			if(time>=0){
				// let h = parseInt(time / 3600)<10?'0'+parseInt(time/ 3600):parseInt(time/ 3600);
				let m = parseInt(time % 3600 / 60)<10?'0'+parseInt(time % 3600 / 60):parseInt(time % 3600 / 60);
				let s = parseInt(time % 3600 % 60)<10?'0'+parseInt(time % 3600 % 60):parseInt(time % 3600 % 60)
                let day = parseInt(time/ 86400)>0?parseInt(time/ 86400) :''
                let h = parseInt((time-parseInt(time/ 86400)*86400 )/3600)<10?'0'+parseInt((time-parseInt(time/ 86400)*86400 )/3600):parseInt((time-parseInt(time/ 86400)*86400 )/3600);
                this.time = {
                    day:day,hours:h,minutes:m,seconds:s
                }
                this.timer = setInterval(()=>{
                    time--;
                    let curTime = new Date().getTime();
                    let temp = parseInt((end-curTime)/1000);
                    if(time>=0){
                        // let h = parseInt(time/3600)<10?'0'+parseInt(time/3600):parseInt(time/3600);
                        let m = parseInt(time % 3600 / 60)<10?'0'+parseInt(time % 3600 / 60):parseInt(time % 3600 / 60);
                        let s = parseInt(time % 3600 % 60)<10?'0'+parseInt(time % 3600 % 60):parseInt(time % 3600 % 60);
                        let day = parseInt(time/ 86400)>0?parseInt(time/ 86400):''
                        let h = parseInt((time-parseInt(time/ 86400)*86400 )/3600)<10?'0'+parseInt((time-parseInt(time/ 86400)*86400 )/3600):parseInt((time-parseInt(time/ 86400)*86400 )/3600);
                        this.time = {
                            day:day,hours:h,minutes:m,seconds:s
                        }
                        if(time-temp>=3){
                            time = temp;
                            this.time = {
                                day:day,hours:h,minutes:m,seconds:s
                            }
                        }
                    }
                },1000)
			}
        },
        /**
         * 监听页面进入后台，与APP通信
         */
        visibilitychangeEvent(){
            if(this.receiveFlag!='') return;
            let isHidden = document.hidden;
            if (isHidden) {
            } else {
                setTimeout(()=>{
                    let userId = window.sessionStorage.getItem('userId');
                    let cellphone = window.sessionStorage.getItem('cellphone');
                    let token = window.sessionStorage.getItem('token');
                    if(userId){
                        if(cellphone){
                            this.userInfo = {
                                userId:userId,
                                token:token
                            }
                            this.$nextTick(()=>{
                                this.receiveCoupon()
                            })
                        }else{
                            // this.bindPhoneEventByApp()
                        }
                    }
                },1)
            }
        },
        /**
         * 领取优惠券点击事件
         */
        receiveEvent(){
            if(this.inApp){
                let cellphone = window.sessionStorage.getItem('cellphone');
                let userId = window.sessionStorage.getItem('userId');
                let token = window.sessionStorage.getItem('token');
                if(cellphone){
                    this.userInfo = {
                        userId:userId,
                        token:token
                    }
                    this.$nextTick(()=>{
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
                        params:{}
                    }) 
                }catch(err){
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                    },1)
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                        var message = JSON.stringify({
                            describe:'',
                            method:'loginWithAliToken',
                            params:{}
                        })
                        window.android.notify(message);
                    }
                }else{
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
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
                        params:{}
                    }) 
                }catch(err){
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                    },1)
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        document.addEventListener('visibilitychange',this.visibilitychangeEvent);
                        var message = JSON.stringify({
                            describe:'',
                            method:'bindPhone',
                            params:{}
                        })
                        window.android.notify(message);
                    }
                }else{
                    this.dialogVisible = true;
                    setTimeout(()=>{
                        this.loginShow = true;
                    },1)
                }
            }
        },
        /**
         * 发短信
         */
        sendSms(){
            if(this.codeText!='获取验证码') return false;
            if(this.cellphone.length!=11){
                this.phoneError = '请输入正确的手机号';
                return;
            }
            this.phoneError = ''
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                cellphone:this.cellphone,
                smsType:1,
                tokenType:2
            }
            this.$http.post(this.$server.sendSms,query).then(res=>{
                this.$toast.clear()
                if(res.data.status==200){
                    let time = 60;
                    this.codeText = time +'s'
					this.codeTimer = setInterval(()=>{
						time--;
                        this.codeText = time +'s'
						if(time==0){
							clearInterval(this.codeTimer);
							this.codeText = '获取验证码'
						}
					},1000) 
                }
            })
        },
        /**
         *  登录
         */
        loginEvent(){
            if(this.cellphone.length!=11){
                this.phoneError = '请输入正确的手机号';
                return;
            }
            if(this.code.length!=6){
                this.codeError = '无效的验证码';
                return;
            }
            this.phoneError = this.codeError = '';
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            this.httpFlag = true;
            let query = {
                cellphone:this.cellphone,
                tokenType:2,
                code:this.code,
                registerSource:3,
                requestType:1
            }
            this.$http.post(this.$server.login,query).then(res=>{
                this.$toast.clear()
                this.httpFlag = false;
                if(res.data.status==200){
                    let userInfo = {
                        accessToken: res.data.content.accessToken,
                        nickname: res.data.content.nickname,
                        avatar: res.data.content.avatar,
                        userid: res.data.content.id,
                        cellphone:res.data.content.cellphone
                    }
                    this.$setCookie("uInfo", JSON.stringify(userInfo));
                    this.userInfo = {
                        userId:res.data.content.id,
                        token:res.data.content.accessToken
                    }
                    this.loginShow = false;
                    this.receiveCoupon();
                    if(this.parent=='pc'){
                        let query1 = {
                            from:'h5Login',
                            data:JSON.stringify(this.userInfo)
                        }
                        let url = this.$server.env == 'prod'?'https://www.xueguoxue.com/home':'https://dev.xueguoxue.com/home'
                        window.parent.postMessage(query1,url)
                    }
                }else{
                    this.codeError = res.data.message;
                }
            })
        },
        /**
         * 领取优惠券
         */
        receiveCoupon(){
            this.dialogVisible = true;
            this.httpFlag = true;
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                userId:this.userInfo.userId,
                couponId:this.couponId
            }
            this.$http.post(this.$server.receiveCoupon,query,{userId:this.userInfo.userId,token:this.userInfo.token}).then(res=>{
                this.$toast.clear();
                this.httpFlag = false;
                this.couponShow = true;
                if(res.data.status==200){
                    this.receiveFlag = 'success'
                }else{
                    if(this.couponId==''){
                        this.receiveFlag = 'xiajia'
                    }else{
                        this.receiveFlag = 'fail'
                    }
                }
            })
        },
        /**
         * 关闭dialog
         */
        closeDialog(){
            if(this.httpFlag) return;
            if(this.couponShow) return;
            this.dialogVisible = false
        },
        /**
         * 规则跳转
         */
        ruleEvent(){
            if(this.inApp||this.inOther){
                this.$router.push('/rule')
            }else{
                this.ruleShow = true;
            }
        },
        /**
         * 分享
         */
        shareBtnEvent(){
            if(this.inApp||this.inOther){
                this.dialogVisbile2 = true;
            }else{
                this.dialogVisbile3 = true;
            }
        },
        /**
         * 去到课程详情
         */
        goCourse(courseId){
            if(this.isIos){
                try{
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                        describe:'去课程详情页',
                        method:'goCourseDetail',
                        params:{
                          courseId:courseId,
                          isCloseWebView:false	
                        }
                    }); 
                }catch(err){
                    if(this.parent=='pc'){
                        let query = {
                            from:'h5Course',
                            data:courseId
                        }
                        let url = this.$server.env == 'prod'?'https://www.xueguoxue.com/home':'https://dev.xueguoxue.com/home'
                        window.parent.postMessage(query,url)
                    }else{
                        let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com/#/course/':'https://scm.youfushuyuan.com/#/course/'
                        window.location.href = link+courseId
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
                              isCloseWebView:false		
                            }
                        })
                        window.android.notify(message);
                    }
                }else{
                    if(this.parent=='pc'){
                        let query = {
                            from:'h5Course',
                            data:courseId
                        }
                        let url = this.$server.env == 'prod'?'https://www.xueguoxue.com/home':'https://dev.xueguoxue.com/home'
                        console.log(url)
                        window.parent.postMessage(query,url)
                    }else{
                        let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com/#/course/':'https://scm.youfushuyuan.com/#/course/'
                        window.location.href = link+courseId
                    }
                }
            }
            console.log('parent'+this.parent)
        },
        /**
         * 分享
         */
        share(){
            let message = {
                describe:'导航栏显示分享按钮',
                method:"share",
                params:{
                    title:'国学盛典囤课倒计时...',
                    desc:'国学知识狂欢节，热门好课低至3折>>',
                    link:window.location.href,
                    imgUrl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/kongdan/%E5%88%86%E4%BA%AB%E5%9B%BE%E6%A0%87.png'
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
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            this.$http.get(`/wx/getConfig?url=${url}`).then(res=>{
                if(res.data.status == 200){
                    let data = res.data.content;
                    let title = `国学盛典囤课倒计时...`;
                    let desc = `国学知识狂欢节，热门好课低至3折>>`;
                    let link = window.location.href;
                    let imgUrl = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/kongdan/%E5%88%86%E4%BA%AB%E5%9B%BE%E6%A0%87.png'
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
                    wx.ready(()=>{
                    wx.onMenuShareAppMessage({
                        title: title, 
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl,
                        type: '', 
                        dataUrl: '',
                        success:()=>{
                        }
                    });
                    wx.onMenuShareTimeline({
                        title: title,
                        link: link,
                        imgUrl: imgUrl,
                        success: ()=>{
                        },
                    })
                    wx.onMenuShareQQ({
                        title: title,
                        desc: desc,
                        link: link,
                        imgUrl: imgUrl,
                        success:()=>{
                        },
                        cancel: function () {
                        
                        }
                    });
                })
                }
            })
        },
        /**
         * 选择折扣
         */
        chooseDiscount(obj){
            this.discountArr.forEach(item=>{
                item.active = false;
            })
            obj.active = true;
            this.courseList = []
            this.discount = obj.discount;
            this.pageNo = 1;
            this.finished = false;
        },
        /**
         * 选择分类
         */
        chooseClassify(index){
            let obj = this.classifyArr[index]
            this.classifyArr.forEach(item=>item.active=false)
            obj.active=true;
            this.$set(this.classifyArr,index,obj)
            this.classId = obj.id
            this.courseList = []
            this.pageNo = 1;
            this.finished = false;
        },
        /**
         * 浏览器分享复制链接
         */
        CopyVal(type){
            if(type==1){
                let clipboard = this.clipboard1;
                clipboard.on('success',()=>{
                    this.$toast({
                        message:'链接复制成功，快去粘贴给好友吧',
                    });
                });
                clipboard.on('error',(e)=>{
                    this.$toast({
                        message:'请手动复制页面地址，粘贴给微信好友',
                    });
                })
            }else{
                let clipboard = this.clipboard2;
                clipboard.on('success',()=>{
                    this.$toast({
                        message:'链接复制成功，快去粘贴给好友吧',
                    });
                });
                clipboard.on('error',(e)=>{
                    this.$toast({
                        message:'请手动复制页面地址，粘贴给微信好友',
                    });
                })
            }
        },
        /**
         * 切换成人版少儿版
         */
        goIndex(){
            if(this.mtype==1){
                this.$router.replace('/index?mtype=2')
            }else{
                this.$router.replace('/index?mtype=1')
            }
        }
    },
    beforeDestroy(){
        document.removeEventListener('visibilitychange',this.visibilitychangeEvent)
    }
}
</script>
<style lang="scss" scoped>
    .wrap{
        background:#B90013;
        min-height: 100%;
        position: relative;
        overflow-x:hidden;
        &.auto-height{
            height:100%;
            overflow: hidden;
        }
        .loading{background: #fff;position: absolute;top:40%;left:50%;transform:translate(-50%,-50%);-webkit-animation: loader 1s ease-in-out infinite;animation: loader 1s ease-in-out infinite;-webkit-animation-delay: 0.4s;animation-delay: 0.4s;width: 10px;height: 20px;}
        .loading:after,.loading:before {content: '';display:block;position: absolute;width: inherit;height: inherit;background: #fff;-webkit-animation: inherit;animation: inherit;}
        .loading:before {right: 15px;-webkit-animation-delay: 0.2s;animation-delay: 0.2s;}
        .loading:after {left: 15px;-webkit-animation-delay: 0.6s; animation-delay: 0.6s;}
        .loading-wrap{position: fixed;top:0;left: 50%;transform:translateX(-50%);max-width:414px;width: 100%;height: 100vh;z-index: 9;background: #B90013;}
        .loading-wrap.hidden{opacity: 0;visibility: hidden;transition:opacity 0.3s linear,visibility 1ms 0.4s}
        @-webkit-keyframes loader {
            0%, 100% {
                box-shadow: 0 0 0 #fff, 0 0 0 #fff;
            }
            50% {
                box-shadow: 0 -5px 0 #fff, 0 5px 0 #fff;
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
        @keyframes loading {
            0%{-webkit-transform:rotate(0deg);}
            25%{-webkit-transform:rotate(90deg);}
            50%{-webkit-transform:rotate(180deg);}
            75%{-webkit-transform:rotate(270deg);}
            100%{-webkit-transform:rotate(360deg);}
        }
        .content{
            .entry{
                position: fixed;
                top:3.8rem;
                left: 50%;
                transform: translateX(-50%);
                width: 1.66rem;
                height: 1.4rem;
                animation: move 7s linear infinite both;
                opacity: 0.95;
                margin-left:2rem;
                &.adult{
                    background: url('../assets/image/adult_entry_icon.png')no-repeat 50% 50% / cover;
                }
                &.child{
                    background: url('../assets/image/child_entry_icon.png')no-repeat 50% 50% / cover;
                }
            }
            .top-box{
                height: 6.68rem;
                background: url('../assets/image/top_bgd.png')no-repeat 50% 50% / cover;
                position: relative;
                overflow: hidden;
                .count-down{
                    top:4.22rem;
                    text-align: center;
                    position: absolute;
                    width: 100%;
                    .tips{
                        color:#323072;
                        font-size: 0.22rem;
                        margin-bottom:0.08rem;
                    }
                    .time{
                        height: 0.36rem;
                        line-height: 0.36rem;
                        color:#323072;
                        font-size: 0.2rem;
                        span{
                            height: 0.36rem;
                            line-height: 0.4rem;
                            background: #fff;
                            color:#D40001;
                            font-size: 0.28rem;
                            padding:0 0.04rem;
                            border-radius: 2px;
                            margin-right: 0.04rem;
                            min-width: 0.48rem;
                            display: inline-block;
                        }
                    }
                }
                .share-btn{
                    position: absolute;
                    right: -0.5rem;
                    top:0.5rem;
                    img{
                        width:2rem;
                    }
                }
            }
            .middle-box{
                padding:0 0.3rem 0.3rem 0.3rem;
                .tips-box{
                    text-align: center;
                    position: relative;
                    font-size: 0;
                    .tips{
                        width: 3.55rem;
                        height: 0.33rem;
                        background: url('../assets/image/date_bgd.png')no-repeat 50% 50% / cover;
                        display: inline-block;
                    }
                    .rule{
                        color:#ccc;
                        font-size:0.26rem;
                        position: absolute;
                        right: 0;
                        top:0;
                        i{
                            font-size:0.3rem;
                            display: inline-block;
                            vertical-align: text-top;
                            margin-right: 0.04rem;
                        }
                    }
                }
                .coupon-box{
                    margin-top:0.3rem;
                    position: relative;
                    .bgd{
                        width: 100%;
                        height: 1.78rem;
                        background: url('../assets/image/coupon_bgd.png')no-repeat 50% 50% / cover;
                    }
                    .btn{
                        position: absolute;
                        width: 1.2rem;
                        height: 1.2rem;
                        background: url('../assets/image/receive_icon.png')no-repeat 50% 50% / cover;
                        right: 0.3rem;
                        top:0.3rem;
                        &:active,&:focus{
                            transform: scale(1.08);
                        }
                    }
                }
            }
            .bottom-box{
                .discount-box{
                    padding:0 0.3rem;
                    height: 1.24rem;
                    background:#00479C;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .discount3{
                        width: 2.12rem;
                        height: 1.02rem;
                        background: url('../assets/image/discount3.png')no-repeat 50% 50% / cover ;
                        &.active{
                            background: url('../assets/image/discount3_active.png')no-repeat 50% 50% / cover ;
                        }
                    }
                    .discount5{
                        width: 2.12rem;
                        height: 1.02rem;
                        background: url('../assets/image/discount5.png')no-repeat 50% 50% / cover;
                        &.active{
                            background: url('../assets/image/discount5_active.png')no-repeat 50% 50% / cover ;
                        }
                    }
                    .discount8{
                        width: 2.12rem;
                        height: 1.02rem;
                        background: url('../assets/image/discount8.png')no-repeat 50% 50% / cover;
                        &.active{
                            background: url('../assets/image/discount8_active.png')no-repeat 50% 50% / cover ;
                        }
                    }
                }
                .classify-box{
                    padding:0 0.49rem;
                    .classify-list{
                        position: relative;
                        height: 0.54rem;
                        line-height: 0.54rem;
                        font-size: 0;
                        .classify-item{
                            width: 1.62rem;
                            height: 0.54rem;
                            display: inline-block;
                            vertical-align: middle;
                            cursor: pointer;
                            p{
                                height: 0.54rem;
                                line-height: 0.54rem;
                                text-align: center;
                                font-size: 0.3rem;
                                color:#666666;
                                background: linear-gradient(0deg, #FAE5D0 0%, #E5B68D 100%);
                                border-radius: 0px 0px 0.1rem 0.1rem;
                                transition: transform 0.3s;
                                position: relative;
                                &.active{
                                    color:#700113;
                                    transform:scale(1.05);
                                    transform-origin: top;
                                    background: linear-gradient(0deg, #FFDDAA 0%, #D98052 100%);
                                    // background: url('../assets/image/classify_bgd_active.png')no-repeat 50% 50%;
                                    z-index: 2;
                                    box-shadow: 0 2px 10px #999;
                                }
                            }
                        }
                    }
                }
                .course-list{
                    padding: 0.3rem 0.3rem 0;
                    display: flex;
                    justify-content:space-between;
                    flex-wrap: wrap;
                    .empty{
                        text-align: center;
                        color:#fff;
                        font-size: 0.28rem;
                        width: 100%;
                    }
                    .course-item:last-child{
                        margin-left: auto;
                    }
                    .course-item{
                        width: 3.36rem;
                        height: 3.06rem;
                        border-radius: 0.2rem;
                        padding:0.06rem;
                        background: #323072;
                        margin:0 0 0.3rem 0;
                        overflow: hidden;
                        .course-item-block{
                            border-radius: 0.2rem;
                            height: 100%;
                            overflow: hidden;
                        }
                        .t{
                            background: #fff;
                            height: 1.7rem;
                            position: relative;
                            border-radius: 0.2rem 0.2rem 0 0;
                            .surface{
                                width: 100%;
                                height: 100%;
                                border-radius: 0.2rem 0.2rem 0 0;
                            }
                            .icon-box{
                                position: absolute;
                                top:0;
                                left: 0;
                                .icon{
                                    width: 0.63rem;
                                    height: 0.85rem;
                                    background: url('../assets/image/discount_icon.png')no-repeat 50% 50% / cover;
                                    display: block;
                                }
                                .discount{
                                    position: absolute;
                                    z-index: 2;
                                    top:0.18rem;
                                    left: 0.04rem;
                                    font-size:0.2rem;
                                    color:#fff;
                                    transform:rotate(-53deg);
                                }
                            }
                        }
                        .b{
                            background: #fff;
                            padding:0.16rem 0.12rem;
                            height: calc(100% - 1.7rem);
                            position: relative;
                            .title{
                               color:#333;
                               line-height: 0.32rem;
                               font-size: 0.24rem;
                            }
                            .price{
                                position: absolute;
                                bottom:0.12rem;
                                right:0.12rem;
                                font-size: 0;
                                .selling-price{
                                    margin-left: 0.08rem;
                                    font-size: 0.32rem;
                                    font-weight: bold;
                                    color:#D11008;
                                    display: inline-block;
                                    vertical-align: bottom;
                                    font-family: Futura;
                                    line-height: 0.32rem;
                                    .unit{
                                        font-size: 0.22rem;
                                        line-height: 0.32rem;
                                        display:inline-block;
                                        vertical-align: bottom;
                                    }
                                }
                                .original-price{
                                    display: inline-block;
                                    vertical-align: bottom;  
                                    line-height: 0.32rem;                          
                                    font-size: 0.22rem;
                                    font-weight: 500;
                                    text-decoration: line-through;
                                    color: #999999;
                                }
                            }
                        }
                    }
                }
            }
        }
        @keyframes move {
            0%{transform:translateX(0) rotate(0deg);}
            2%{transform:translateX(-2px) rotate(-5deg);}
            4%{transform:translateX(-4px) rotate(0deg);}
            6%{transform:translateX(-5px) rotate(-5deg);}
            8%{transform:translateX(-4px) rotate(0deg);}
            10%{transform:translateX(-2px) rotate(-5deg);}
            12%{transform:translateX(0px) rotate(0deg);}
            14%{transform:translateX(-2px) rotate(-5deg);}
            16%{transform:translateX(-5px) rotate(5deg);}
            18%{transform:translateX(-2px) rotate(-5deg);}
            20%{transform:translateX(0px) rotate(0deg);}
            100%{
                transform:translateX(0px) rotate(0deg);
            }
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s;
            }
        .fade-enter, .fade-leave-to {
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
        .coupon-show-enter-active, .coupon-show-leave-active {
            transition: transform 0.5s;
        }
        .coupon-show-enter, .coupon-show-leave-to {
            transform:translateY(-10px);
            opacity: 0;
        }
        .dialog{
            position: fixed;
            top:0;
            left:50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 414px;
            height: 100%;
            z-index: 10;
            background: rgba(0,0,0,0.7);
            .coupon{
                text-align: center;
                width: 5.5rem;
                position: absolute;
                top:40%;
                left: 50%;
                margin-left: -2.75rem;
                margin-top:-3.1rem;
                &.success{
                    .bgd{
                        background: url('../assets/image/receive1.png')no-repeat 50% 50% / cover;
                    }
                }
                &.fail{
                    .bgd{
                        background: url('../assets/image/receive2.png')no-repeat 50% 50% / cover;
                    }   
                }
                &.xiajia{
                    .bgd{
                        background: url('../assets/image/receive3.png')no-repeat 50% 50% / cover;
                    } 
                }
                .bgd{
                    width: 5.5rem;
                    height: 5.24rem;
                }
                .t{
                    font-size: 0.28rem;
                    color:#fff;
                    position: absolute;
                    bottom:1.93rem;
                    left:1.3rem
                }
                i{
                    color:#fff;
                    font-size: 0.56rem;
                }
            }
            .box{
                position: absolute;
                top:40%;
                left: 50%;
                width: 5.9rem;
                margin-left: -2.95rem;
                margin-top:-2.3rem;
                min-height: 4.65rem;
                border-radius: 0.2rem;
                background: #fff;
                padding:0.36rem;
                .title{
                    font-size: 0.4rem;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom:0.48rem;
                }
                .item{
                    margin-bottom:0.2rem;
                    font-size: 0;
                    position: relative;
                    .item-box{
                        border:1px solid #dfdfdf;
                        border-radius: 0.5rem;
                        padding:0.15rem 0.3rem;
                        font-size: 0;
                        &.code{
                            width: 3.48rem;
                            display: inline-block;
                            vertical-align: middle;
                            input{
                                width: 1.5rem;
                            }
                        }
                        &.phone{
                            input{
                                width: 3rem;
                            }
                        }
                        label{
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 0.26rem;
                            margin-right: 0.3rem;
                            line-height: 0.5rem;
                            height: 0.5rem;
                        }
                        input{
                            border:none;
                            outline: none;
                            background: none;
                            line-height: 0.5rem;
                            height: 0.5rem;
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 0.26rem;
                        }
                    }
                    .error{
                        font-size: 0.24rem;
                        color:#D11008;
                        padding:0.1rem 0 0 0.3rem;  
                    }
                    .code-btn{
                        position: absolute;
                        font-size: 0.26rem;
                        color:#D11008;
                        cursor: pointer;
                        right: 0;
                        top:0.15rem;
                        text-decoration: underline;
                        width: 1.42rem;
                        text-align: center;
                        line-height: 0.5rem;
                        height: 0.5rem;
                        &.disabled{
                            color:#999;
                        }
                    }
                }
                .btn{
                    height: 0.82rem;
                    line-height: 0.82rem;
                    border-radius: 0.5rem;
                    background: linear-gradient(180deg,#fb5e6c,#CF1F2F);
                    color:#fff;
                    font-size: 0.3rem;
                    text-align: center;
                    margin-top:0.2rem;
                }
            }
        }
        .share-dialog{
            position: fixed;
            top:0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 414px;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 6;
            .share-arrow{
                position: absolute;
                width: 1.2rem;
                height: 1.2rem;
                right: 0.1rem;
                top:0.3rem;
                background: url('../assets/image/arrow.png')no-repeat 50% 50% /cover;
                transform: rotate(-90deg);
            }
            .tip3{
                position: absolute;
                right: 0.1rem;
                top:1.6rem;
                font-size: 0.32rem;
                color:#fff;
            }         
        }
        #input{
            opacity: 0;
            position: fixed;
            top:-1000px;
        }
        .share-box-dialog{
            position: fixed;
            z-index: 10;
            top:0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 414px;
            height: 100%;
            background: rgba(0,0,0,0.7);
            .box{
                height: 3.33rem;
                background: #f2f2f2;
                position: absolute;
                bottom:0;
                left:0;
                width: 100%;
                border-radius: 0.2rem 0.2rem 0 0;
            }
            .icon-area{
                height: 2.36rem;
                display: flex;
                align-items: center;
                justify-content: space-around;
                >div{
                    text-align: center;
                    font-size: 0;
                    margin-left: 1.5rem;
                }
                >div+div{
                    margin-right: 1.5rem;
                    margin-left: 0;
                }
                .wexin{
                    width: 1rem;
                    height: 1rem;
                    background: url('../assets/image/wechat.png')no-repeat 50% 50% / cover;
                }
                .pyq{
                    width: 1rem;
                    height: 1rem;
                    background: url('../assets/image/pyq.png')no-repeat 50% 50% / cover;
                }
                p{
                    font-size: 0.26rem;
                    color:#666;
                    margin-top:0.2rem;
                }
            }
            .cancel{
                text-align: center;
                border-top:1px solid #dfdfdf;
                color:#333;
                font-size: 0.32rem;
                height:0.94rem;
                line-height: 0.94rem;
                font-family: PingFangSC-Regular;
            }
        }
    }
</style>