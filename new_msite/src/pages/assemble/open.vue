<template>
    <div class="assemble-open-wrap">
        <Header :name="'开团'"></Header>
        <div class="content">
            <div class="course-info clearfix" @click="goCourses">
                <img class="course-surface" :src="assembleData.courseSurfacePlot"/>
                <div class="course-data">
                    <p class="course-name textEllipsis" >{{assembleData.courseTitle}}</p>
                    <p class="assemble-pirce">拼团价：{{assembleData.assemblePrice!='-'?assembleData.assemblePrice.toFixed(2):''}}币</p>
                    <p class="original-price">原价：{{assembleData.coursePrice!='-'?assembleData.coursePrice.toFixed(2):''}}币</p>
                </div>
            </div>
            <div class="assemble-handle">
                <div class="no-assemble" v-if="assembleStatus==1">
                    <p>开团后{{assembleData.continueTime}}小时结束</p>
                    <p class="people">{{assembleData.peopleNum}}人成团</p>
                    <button @click="goPay">我要开团</button>
                </div>
                <div class="already-assemble" v-if="assembleStatus==2">
                    <p>开团成功</p>
                    <p class="people">{{assembleData.peopleNum}}人成团</p>
                    <p class="count-down" v-if="countDownFlag">
                        <span class="need-people">还差{{assembleData.peopleNum>=1?assembleData.peopleNum-1:'-'}}人</span>
                        <span class="hour">{{hour}}</span>
                        <span class="minute">{{minute}}</span>
                        <span class="second">{{second}}</span>
                        <span class="msec">{{ms}}</span>
                        后结束
                    </p>
                    <!-- <input class="copy-target" id="input" :value="shareLink" readonly/>
                    <button @click="share" ref="copyBtn" data-clipboard-action="copy" :data-clipboard-target="`#input`">邀请好友来参团</button> -->
                    <button @click="shareOpen=true">邀请好友来参团</button>
                </div>
                <div class="assemble-success" v-if="assembleStatus==3">
                    <p>拼团成功</p>
                    <p class="people">{{assembleData.peopleNum}}人成团</p>
                    <button @click="goCourse">查看课程</button>
                </div>
            </div>
            <div class="assemble-history" v-if="assembleStatus==3">
                <p class="t">拼团记录</p>
                <div class="list">
                    <div class="item" v-for="(item,index) in assemblePeopleList" :key="index">
                        <div class="assemble-user-info clearfix">
                            <img :src="item.assembleHeadUrl"/>
                            <p class="phone">{{item.assembleCellphone}}</p>
                        </div>
                        <p class="assemble-handle-status">{{item.assembleType==1?'发起拼团':'加入拼团'}}</p>
                        <p class="assemble-time">{{item.assembleCreateTime}}</p>
                    </div>
                </div>
            </div>
            <div class="rule">
                <p class="t">拼团说明</p>
                <p>1.用户点击学国学网拼团频道参于拼团，开团成为团长，并邀请好友参团，在拼团有效时间内凑齐成团人数，即可拼购成功。</p>
                <p>2.在团有效时间内未凑齐成团人数，即拼团失败，系统自动取消订单并全额退款，支付金额将原路径退回。</p>
                <p>3.拼团有效时间，即拼团允许邀请好友参团的时间，见拼团详情页。</p>
                <p>4.用户在已购中，查看自己的拼团。</p>
                <p>5.在拼团有效期内，已支付订单不允许申请退款。</p>
                <p>6.拼团成功的课程将在拼团结束后加入到用户已购课程。</p>
                <p>7.拼团如有其它问题，请咨询在线客服。</p>
            </div>
        </div>
        <div class="to-wechat-bgd" v-if="isWx" @click="isWx=false">
            <i></i>
            <p>请点击右上角···发送给朋友</p>
        </div>
        <transition name="fade">
            <div class="share-wrap" v-show="shareOpen">
                <p class="tips">选择要分享的平台</p>
                <div class="share">
                    <div v-if="support" @click="shareTo('wechatFriend')">
                        <img :src="img1" alt="">
                        <p>微信</p>
                    </div>
                    <div v-if="support" @click="shareTo('wechatTimeline')">
                        <img :src="img2" alt="">
                        <p>朋友圈</p>
                    </div>
                    <div @click="shareTo('qqFriend')">
                        <img :src="img3" alt="">
                        <p>QQ</p>
                    </div>
                    <div @click="shareTo('weibo')">
                        <img :src="img4" alt="">
                        <p>微博</p>
                    </div>
                </div>
                <div class="cancel" @click="shareOpen=false">
                    取消
                </div>
            </div>
        </transition>    
    </div>
</template>
<script>
import Clipboard from 'clipboard'
import {mapState,mapActions} from 'vuex'
import Header from '@/components/Header.vue'
import img1 from '@/assets/image/wechat.png'
import img2 from '@/assets/image/wechat-circle.png'
import img3 from '@/assets/image/qq.png'
import img4 from '@/assets/image/weibo.png'
const countDownFormat = (time,flag)=>{
    let h = parseInt(time / 3600);
    let m = parseInt(time % 3600 / 60);
    let s = parseInt(time % 3600 % 60);
    let hStr = h<10?`0${h}`:h;
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    if(flag=='h')return hStr;
    if(flag=='m')return mStr;
    if(flag=='s')return sStr;
}
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
export default {
    data(){
        return{
            nativeShare:'',
            support:false,
            clipboard:'',
            assembleRecordId:'',
            shareLink:'',
            shareOpen:false,
            assembleStatus:1,
            assembleData:{
                "continueTime": '-', // 拼团持续时间
                "courseTitle": "-", // 课程标题
                "assemblePrice": '-', // 拼团价格
                "courseSurfacePlot": '', // 课程图片
                "coursePrice": '-', // 课程价格
                "id": '-', // 拼团id
                "courseId": '-', // 课程id
                "peopleNum": '-' // 拼团人数    
            },
            assemblePeopleList:[],
            serviceTime:'',
            time:'',
            ms:'00',
            msTimer:'',
            timer:'',
            assembleContiTime:0,
            isWx:false,
            countDownFlag:false,
            wechatH5:false,
            assembleBoughtDataCourseId:'',
            img1:img1,
            img2:img2,
            img3:img3,
            img4:img4
        }
    },
    components:{
        Header
    },
    computed:{
        ...mapState(['hasOpenApp','assembleBoughtData']),
        hour(){
            return countDownFormat(this.time,'h');
        },
        minute(){
            return countDownFormat(this.time,'m');
        },
        second(){
            return countDownFormat(this.time,'s')
        }
    },
    beforeRouteLeave (to, from, next){
		if(to.name=='CourseOrder'){
			if(this.assembleData.channelAvaliDay!=0){
				this.$dialog.confirm({
                    message: `为了您更好的学习该课程内容，课程购买后，学习有效期至${this.assembleData.channelAvaliDay},请于有效期内学习完该课程`,
                    confirmButtonColor:"#D40015"
				}).then(() => {
					next()
				}).catch(() => {
				});			
			}else{
				next()
			}
		}else{
			next()
		}
	},
    created(){
        let ua = window.navigator.userAgent.toLowerCase();
        let isWx;
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            isWx = true;
        }
        if(sessionStorage.getItem('wechatH5')){
            this.wechatH5 = true;
            sessionStorage.removeItem('wechatH5')
        }
        let cookie = this.$getCookie('uInfo');
        let userId = cookie ? JSON.parse(cookie).userid  : '';
        this.browserSupport();
        this.nativeShare = new NativeShare();
        let assembleBoughtData = localStorage.getItem('assembleBoughtData')?JSON.parse(localStorage.getItem('assembleBoughtData')):null;
        if(assembleBoughtData&&assembleBoughtData.assembleSuccess==1){
            localStorage.removeItem('assembleBoughtData');
            this.assembleBoughtDataCourseId = assembleBoughtData.courseId;
            this.assembleRecordId = assembleBoughtData.assembleRecordId;
            this.assemblePeopleList = assembleBoughtData.assemblePeopleList;
            this.shareLink = window.location.origin+'/?wxshare=true&type=assemble&assembleId='+this.$route.params.assembleId+'&assembleRecordId='+assembleBoughtData.assembleRecordId+'&assembleUser='+userId
            this.assembleStatus = assembleBoughtData.assembleType==1?2:3;
            this.getOpenAssembleCourseInfo();
            this.assembleContiTime = assembleBoughtData.assembleContiTime;
            this.serviceTime = assembleBoughtData.serviceTime;
            this.countDownFlag = true;
            this.countDown();
            if(isWx)
                this.wxshare(assembleBoughtData.courseId);
            this.$nextTick(()=>{
                this.setAssembleBoughtData({})
            })   
        }else{
            if(this.assembleBoughtData&&this.assembleBoughtData.assembleSuccess==1){
                this.assembleRecordId = this.assembleBoughtData.assembleRecordId;
                this.assembleBoughtDataCourseId = this.assembleBoughtData.courseId;
                this.shareLink = window.location.origin+'/?wxshare=true&type=assemble&assembleId='+this.$route.params.assembleId+'&assembleRecordId='+this.assembleBoughtData.assembleRecordId+'&assembleUser='+userId
                this.assembleStatus = this.assembleBoughtData.assembleType==1?2:3;
                this.assemblePeopleList = this.assembleBoughtData.assemblePeopleList;
                this.getOpenAssembleCourseInfo();
                this.assembleContiTime = this.assembleBoughtData.assembleContiTime;
                this.serviceTime = this.assembleBoughtData.serviceTime;
                this.countDownFlag = true;
                this.countDown();
                if(isWx)
                    this.wxshare(this.assembleBoughtData.courseId);
                this.$nextTick(()=>{
                    this.setAssembleBoughtData({})
                })
            }else{
                this.getOpenAssembleCourseInfo()
            }
        }
    },
    mounted(){
        // if(this.assembleStatus>1)
        //     this.clipboard = new Clipboard(this.$refs.copyBtn)
         
    },
    methods:{
        ...mapActions(['setAssembleBoughtData']),
        returnHome(){
            this.$router.push('/')
        },
        /**
		 * 浏览器是否支持关于微信等一些分享
		 */
		browserSupport(){
			let UA = navigator.appVersion;
			let uc = UA.split('UCBrowser/').length > 1 ? 1 : 0;
			let qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0;
			let wx = /micromessenger/i.test(UA);
			if(uc||qq||wx){
				this.support = true;
			}else{
				this.support = false;
			}
        },
        onClickLeft(){
            if(this.wechatH5){
                this.$router.replace('/')
            }else{
                this.$router.go(-1)
            }
            
        },
        /**
         * 查询开团页面详情
         */
        getOpenAssembleCourseInfo(){
            if(this.$route.params&&this.$route.params.assembleId){
                let query = {
                    assembleCourseId:this.$route.params.assembleId
                }
                this.$http.post(this.$server.getOpenAssembleCourseInfo,query).then(res=>{
                    if(res.data.status==200){
                        this.assembleData = res.data.content;
                    }
                })
            }else{
                // this.$router.go(-1)
            }
        },
        shareTo(command){
            let ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.isWx = true;
            }else{
                this.$toast.loading({
                    mask: false,
                });
                this.$http.post(this.$server.getCourseInfo,{
                    courseId:this.assembleData.courseId,
                }).then(res=>{
                    if(res.data.status==200){
                        let _desc = res.data.content.intro||'';
                        let teacherName = res.data.content.lectureTeacherList[0]?res.data.content.lectureTeacherList[0].name:'';
                        let shareData = {
                            title:teacherName+':'+this.assembleData.courseTitle,
                            desc:_desc,
                            link:this.shareLink||'',
                            icon:this.assembleData.courseSurfacePlot,
                            success:()=>{
                                
                            },
                            fail:()=>{
                                this.$toast('当前浏览器不支持分享！')
                            }
                        }
                        this.nativeShare.setShareData(shareData)
                        try {
                            this.nativeShare.call(command)
                        } catch(err) {
                        }
                    }
                })
            }
        },
        /**
         * 邀请好友来参团（弃用）
         */
        share(){
            let ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.isWx = true;
            }else{
                if(this.support){
                    this.$toast.loading({
                        mask: false,
                    });
                    this.$http.post(this.$server.getCourseInfo,{
						courseId:this.assembleData.courseId,
					}).then(res=>{
                        if(res.data.status==200){
                            let _desc = res.data.content.intro||'';
                            let teacherName = res.data.content.lectureTeacherList[0]?res.data.content.lectureTeacherList[0].name:'';
                            let shareData = {
                                title:teacherName+':'+this.assembleData.courseTitle,
                                desc:_desc,
                                link:this.shareLink,
                                icon:this.assembleData.courseSurfacePlot,
                                success:()=>{
                                    
                                },
                                fail:()=>{
                                    this.$toast('当前浏览器不支持分享！')
                                }
                            }
                            this.nativeShare.setShareData(shareData)
                            try {
                                this.nativeShare.call('wechatFriend')
                            } catch(err) {
                            }
                        }
                    })
                }else{
                    let clipboard = this.clipboard
                    clipboard.on('success',()=>{
                        this.$toast({
                            message:'链接复制成功，可将该链接复制给好友，邀请他(她)来参团',
                            className:'text-align'
                        });
                    });
                    clipboard.on('error',()=>{
                        this.$toast('该浏览器不支持自动复制，请选择“拷贝”手动进行复制');
                    });
                }
            }
        },
        /**
         * 开团，去支付
         */
        goPay(){
            let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
            }else{
                let params = {
                    courseId:this.assembleData.courseId
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        if(res.data.content.isJoin==0){
                            localStorage.setItem('aboutCourse',this.$route.path)
                            let query = {
                                buyType:2,
                                assembleType:1,
                                assembleId:this.$route.params.assembleId,
                                assemblePrice:this.assembleData.assemblePrice
                            }
                            this.$router.push({path:`/course/order/${this.assembleData.courseId}`,query:query})
                        }else if(res.data.content.isJoin==1){
                            this.$toast('您已参加过该团购')
                        }
                    }else{
                        if(res.data.message.includes('是会员')){
                            setTimeout(()=>{
                                this.$router.push(`/course/${this.assembleData.courseId}`)
                            },2000)
                        }
                    }
                })
            }
        },  
        /**
         * 倒计时
         */
        countDown(){
            // let end = new Date(this.endTime.replace(/-/g, '/')).getTime();
            // let now = new Date().getTime();
            // let time = parseInt((end-now)/1000);
            // let end = new Date().setHours
            let now = this.serviceTime!=''?new Date(this.serviceTime):new Date();
            let end = new Date(new Date().setTime(now.getTime()+this.assembleContiTime*60*60*1000))
            this.time = this.assembleContiTime*3600-1;
            this.timer = setInterval(()=>{
                this.time--;
                let curTime = new Date().getTime();
                let temp = parseInt((end-curTime)/1000);
                if(this.time-temp>=1){
                    console.log('从后台进入');
                    this.time = temp;
                }
                if(this.time<=0){
                    this.countDownFlag = false;
                    clearInterval(this.timer)
                }
            },1000)
            let ms = 99;
            this.msTimer = setInterval(()=>{
                ms--;
                this.ms = ms<10?'0'+ms:ms;
                if(this.time<=0){
                    this.ms = '00';
                    this.countDownFlag = false;
                    clearInterval(this.msTimer)
                }
                if(ms<=0){
                    ms = 99;
                }
            },10)
        },
        goCourse(){
            if(this.assembleBoughtData.courseId){
                sessionStorage.setItem('fromSuccess',true);
                this.$router.replace(`/course/${this.assembleBoughtData.courseId}`)
            }
            if(this.assembleBoughtDataCourseId){
                sessionStorage.setItem('fromSuccess',true);
                this.$router.replace(`/course/${this.assembleBoughtDataCourseId}`)
            }
        },
        goCourses(){
            this.$router.push(`/course/${this.assembleData.courseId}`)
            if(this.assembleBoughtDataCourseId){
                this.$router.replace(`/course/${this.assembleBoughtDataCourseId}`)
            }
        },
        wxshare(courseId){
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    this.$http.post(this.$server.getCourseInfo,{
						courseId:courseId,
					}).then(response=>{
						if(response.data.status == 200){
                            let title = response.data.content.title||'';
							let surfacePlot = response.data.content.surfacePlot||'';
							let teacherName = response.data.content.lectureTeacherList[0]?response.data.content.lectureTeacherList[0].name:'';
                            let introduce = response.data.content.intro||'';
                            let _title = teacherName+':'+title
							let _desc = introduce;
							let _link = this.shareLink;
                            let _imgUrl = surfacePlot;
                            setShareInfo({
								title:_title,
								summary:_desc,
								pic:_imgUrl,
								url:_link,
							});
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
									title: _title, // 分享标题
									desc: _desc, // 分享描述
									link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
									imgUrl: _imgUrl, // 分享图标
									type: '', // 分享类型,music、video或link，不填默认为link
									dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
									success:()=>{
									// 用户点击了分享后执行的回调函数
									
									}
								});
								wx.onMenuShareTimeline({
									title: _title, // 分享标题
									link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
									imgUrl: _imgUrl, // 分享图标
									success:()=>{
									// 用户点击了分享后执行的回调函数
										
									},
								})
								wx.onMenuShareQQ({
									title: _title, // 分享标题
									desc: _desc, // 分享描述
									link: _link, // 分享链接
									imgUrl: _imgUrl, // 分享图标
									success:()=>{
									// 用户确认分享后执行的回调函数
										
									},
									cancel: function () {
									// 用户取消分享后执行的回调函数
									}
								});
							})
                        }
                    })    
                }
            })
        }
    },
    destroyed(){
        clearInterval(this.timer);
        clearInterval(this.msTimer);
        this.setAssembleBoughtData({})
    }       
}
</script>
<style lang="scss" scoped>
    .to-wechat-bgd{
		position: fixed;
		top:0;
		left: 50%;
		z-index: 9999;
		background: rgba(0,0,0,0.7);
		width: 100%;
		height: 100%;
        max-width: 414px;
        transform: translateX(-50%);
		i{
			position: absolute;
			right: 0.1rem;
			top:0;
			width: 1rem;
			height: 1.5rem;
			transform: rotate(-90deg);
			background: url('../../assets/image/arrow.png')no-repeat 50% 50%;
			background-size: contain;
		}
		p{
			position: absolute;
			right: 0.1rem;
			top:1.5rem;
			color:#fff;
			font-size: 0.32rem;
		}
	}
    .share-wrap{
        height: 100vh;
        background: rgba(0, 0, 0, .6);
        position: fixed;
        left: 50%;
        bottom: 0;
        width: 100%;
        max-width: 414px;
        transform: translateX(-50%);
        z-index: 1000;
        .tips{
            position: absolute;
            bottom:3.3rem;
            left:0;
            text-align: center;
            color:#9A9A9A;
            font-size: 0.28rem;
            z-index: 2;
            width: 100%;
        }
        .commission{
            position: absolute;
            bottom:1rem;
            padding: 0 .5rem;
            left:0;
            text-align: center;
            color:#D43B3E;
            font-size: 0.28rem;
            z-index: 2;
            width: 100%;
        }
        .share{
            width: 100%;
            height: 3.1rem;
            background-color: rgba(255, 255, 255, .9);
            position: absolute;
            left: 0;
            bottom: .95rem;
            display: flex;
            justify-content: space-around;
            padding: 0 .6rem;
            align-items: center;
            text-align: center;
            img{
                width: .7rem;
                height: .7rem;
            }
            p{
                margin-top: .15rem;
                color: #9A9A9A;
                font-size: .26rem;
            }
        }
        .cancel{
            line-height: .95rem;
            color: #CACACA;
            background-color: #fff;
            text-align: center;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
        }
    }
    .assemble-open-wrap{
        padding-bottom:0.3rem;
        .content{
            #input{
                opacity: 0;
                position: absolute;
                top:-1rem;
            }
            .course-info{
                padding: 0.2rem;
                .course-surface{
                    width:2.63rem;
                    height: 1.6rem;
                    border-radius: 3px;
                    float: left;
                }
                .course-data{
                    float: left;
                    width: calc(100% - 2.63rem);
                    height: 100%;
                    float: left;
                    font-size: 0.32rem;
                    padding-left: 0.2rem;
                    .course-name{
                        color:#1A1A1A;
                        font-weight: bold;
                        line-height: 0.6rem;
                    }
                    .assemble-pirce{
                        color:#A63433;
                        line-height: 0.48rem;
                    }
                    .original-price{
                        color:#9A9A9A;
                        font-size: 0.24rem;
                        line-height: 0.6rem;
                        text-decoration: line-through;
                    }
                }
            }
            .assemble-handle{
                text-align: center;
                padding:0.8rem 0 0.6rem 0;
                .none{
                    display: none;
                }
                .already-assemble{
                    .count-down{
                        font-size: 0.32rem;
                        color:#6A6A6A;
                        vertical-align: middle;
                        margin-bottom:0.7rem;
                        span{
                            display: inline-block;
                        }
                        .hour,.minute,.second,.msec{
                            display: inline-block;
                            height: 0.6rem;
                            width: 0.6rem;
                            line-height: 0.6rem;
                            text-align: center;
                            color:#fff;
                            background: #B63B40;  
                            position: relative; 
                            margin:0 0.04rem;
                        }
                        .hour,.minute,.second{
                            &::after{
                                content:':';
                                color:#6A6A6A;
                                position: absolute;
                                right: -0.14rem;
                                top:0;
                                height: 0.6rem;
                                line-height: 0.6rem;
                            }
                        }
                        .msec{
                            
                        }
                        
                    }
                }
                p{
                    color:#1A1A1A;
                    font-size: 0.4rem;
                    &:first-child{
                        font-weight: bold;
                    }
                }
                .people{
                    font-size: 0.32rem;
                    color:#B63B40;
                    margin:0.3rem 0 0.6rem 0;
                }
                button{
                    display: inline-block;
                    width: 3.6rem;
                    height: 0.88rem;
                    line-height: 0.88rem;
                    text-align: center;
                    font-size: 0.32rem;
                    background: #B63B40;
                    color:#fff;
                    border:none;
                    outline: none;
                    border-radius: 25px;
                    letter-spacing: 1px;
                    &:active{
                        background:#b1262b
                    }
                }
                .assemble-success{
                    p{
                       &:first-child{
                        font-size: 0.44rem;
                        color:#B4272D;
                       }
                    } 
                    .people{
                        font-size: 0.32rem;
                        color:#6A6A6A;
                    }
                }
            }
            .assemble-history{
                padding: 0.2rem;
                .t{
                    color:#3A3A3A;
                    font-size: 0.3rem;
                    padding: 0.2rem 0.1rem;
                    border-bottom:1px solid #F1F1F1;
                }
                .list{
                    .item{
                        height: 1.1rem;
                        border-bottom:1px solid #F1F1F1;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .assemble-user-info{
                            font-size: 0;
                            img{
                                display:inline-block;
                                vertical-align: middle;
                                height: 0.6rem;
                                width: 0.6rem;
                                border-radius: 50%;
                                margin-right: 0.2rem;
                            }
                            .phone{
                                display:inline-block;
                                vertical-align: middle;    
                                color:#6A6A6A;
                                font-size: 0.28rem;
                            }
                        }
                        .assemble-handle-status{
                            color:#6A6A6A;
                            font-size: 0.28rem;
                        }
                        .assemble-time{
                            color:#CCCCCC;
                            font-size: 0.24rem;
                        }
                    }
                }
            }
            .rule{
                padding: 0 0.3rem;
                .t{
                    font-size: 0.3rem;
                    color:#3A3A3A;
                    padding: 0.3rem 0;
                    margin-bottom:0.2rem;
                }
                p{
                    color:#9A9A9A;
                    font-size: 0.24rem;
                    margin:0.1rem 0;
                    line-height: 0.36rem;
                }
            }
        }
    }
</style>
