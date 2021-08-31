<template>
    <div class="join-course-assemble">
        <div v-if="finish&&!isBuy">
            <div class="box fail" v-if="fail">
                <p class="t">参团失败</p>
                <p class="tips">该团已拼团成功，请选择其他拼团</p>
                <button class="tips-btn" @click="$router.replace('/assemble/list')">确认</button>
            </div>  
            <div v-else class="box" >
                <p class="assemble-open-user">参与{{courseAssembleData.createorPhone}}的团</p>
                <p class="assemble-name">你的好友<span>{{nickname}}</span></p>
                <div class="assemble-users-head">
                    <img :src="avatar"/>
                </div>
                <p class="count-down">
                    <span class="need-people">还差{{courseAssembleData.remainderNum}}人</span>
                    <span class="hour">{{hour}}</span>
                    <span class="minute">{{minute}}</span>
                    <span class="second">{{second}}</span>
                    <span class="msec">{{ms}}</span>
                    后结束
                </p>
                <input class="copy-target" id="input" :value="shareLink" readonly/>
                <button class="join-btn" @click="goJoin">我要参团</button>
                <!-- <button class="share-course-btn" @click="share" ref="copyBtn" data-clipboard-action="copy" :data-clipboard-target="`#input`">邀请好友来参团</button> -->
                 <button class="share-course-btn" @click="invite">邀请好友来参团</button>
                <p class="tip">提示：锁定参团后请在10分钟内完成支付</p>
                <p class="tip">逾期订单将失效</p>
            </div> 
        </div>
        <div class="loading" v-if="!finish&&!isBuy">
            <van-loading size="1rem" />
        </div>
        <div class="to-wechat-bgd" v-if="wxBgd" @click="wxBgd=false">
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
import {mapState} from 'vuex'
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
        return {
            nativeShare:'',
            support:false,
            clipboard:'',
            shareLink:'',
            shareOpen:false,
            time:0,
            ms:'00',
            msTimer:'',
            timer:'',
            nickname:'-',
            avatar:'',
            fail:false,
            finish:false,
            isWx:false,
            wxBgd:false,
            isBuy:true,
            img1:img1,
            img2:img2,
            img3:img3,
            img4:img4,
        }
    },
    props:['courseAssembleData','assembleData'],
    watch:{
        courseAssembleData(cur,old){
            this.isBuy = true;
            if(cur.hasOwnProperty('endTimeStr')){
                this.finish = true;
                this.fail = false;
                this.isBuy = false;
                this.countDown();
                let ua = window.navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                    this.wxshare();
                }else if (ua.match(/QQ/i) == "qq" &&  ua.match(/MQQbrowser/i)!='mqqbrowser'){
                    this.wxshare();
                }
                this.$nextTick(()=>{
                    this.clipboard = new Clipboard(this.$refs.copyBtn); 
                })
            }
            else{
                this.finish = false;
                this.isBuy = true;
                let params = {
                    courseId:cur.courseId
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        this.finish = true;
                        this.fail = true;
                        this.isBuy = false;
                    }else{
                        if(res.data.message.includes('是会员')||res.data.message=='已购买该课程'){
                            setTimeout(()=>{
                                this.$router.push(`/course/${this.assembleData.courseId}`)
                            },2000)
                        }else{
                            this.finish = true;
                            this.fail = true;
                            this.isBuy = false;
                        }
                    }
                })
            }
        }
    },
    created(){
        this.nativeShare = new NativeShare();
        this.browserSupport();
        let cookie = this.$getCookie('uInfo');
        let userId = cookie ? JSON.parse(cookie).userid  : '';
        this.shareLink = window.location.origin+'/'+window.location.search;
        if(this.$route.query&&this.$route.query.assembleUser)
            this.getShareUserInfo();
        
    },
    mounted(){
        let ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.isWx = true;
        }else if (ua.match(/QQ/i) == "qq" &&  ua.match(/MQQbrowser/i)!='mqqbrowser'){
            this.isWx = true;
        }
    },
    computed:{
        ...mapState(['isVip']),
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
    methods:{
        /**
         * 倒计时
         */
        countDown(){
            // let test = '2019-04-08 17:35:00';
            // let end = new Date(test.replace(/-/g, '/')).getTime();
            let end = new Date(this.courseAssembleData.endTimeStr.replace(/-/g, '/')).getTime();
            let now = new Date().getTime();
            let time = parseInt((end-now)/1000);
            this.time = time;
            this.timer = setInterval(()=>{
                this.time--;
                let curTime = new Date().getTime();
                let temp = parseInt((end-curTime)/1000);
                if(this.time-temp>=1){
                    this.time = temp;
                }
                if(this.time<=0){
                    clearInterval(this.timer)
                }
            },1000)
            let ms = 99;
            this.msTimer = setInterval(()=>{
                ms--;
                this.ms = ms<10?'0'+ms:ms;
                if(this.time<=0){
                    this.ms = '00'
                    clearInterval(this.msTimer)
                }
                if(ms<=0){
                    ms = 99;
                }
            },10)
        },
        /**
         * 获取开团人的信息
         */
        getShareUserInfo(){
            let query = {
                userId:this.$route.query.assembleUser
            }
            this.$http.post(this.$server.getShareUserInfo,query).then(res=>{
                if(res.data.status == 200){
                    this.nickname = res.data.content.nickname;
                    this.avatar = res.data.content.avatar;
                }
            })
        },
        /**
         * 去参团
         */
        goJoin(){
            let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
            }else{
                if(this.isVip){
                    this.$toast('您是会员，可以免费观看该课');
                    setTimeout(()=>{
                        this.$router.replace(`/course/${this.courseAssembleData.courseId}`)
                    },2000)
                    return false;
                }
                let params = {
                    courseId:this.courseAssembleData.courseId
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        if(res.data.content.isJoin==0){
                            localStorage.setItem('aboutCourse',this.$route.path)
                            let query = {
                                buyType:2,
                                assembleType:2,
                                assembleId:this.$route.params.assembleId,
                                assemblePrice:this.courseAssembleData.assemblePrice,
                                joinAssembleRecordId:this.$route.query.assembleRecordId
                            }
                            this.$router.push({path:`/course/order/${this.courseAssembleData.courseId}`,query:query})
                        }else if(res.data.content.isJoin==1){
                            this.$toast('您已参加过该团购');
                            setTimeout(()=>{
                                this.$router.push('/bought')
                            },2000)
                        }
                    }else{
                        if(res.data.message.includes("已购买该课程")){
                            setTimeout(()=>{
                                this.$router.push('/bought');
                            },2000)
                        }
                    }
                })
            }
        },
        browserSupport(){
			let UA = navigator.appVersion;
			let uc = UA.split('UCBrowser/').length > 1 ? 1 : 0;
			let qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0;
			// let wx = /micromessenger/i.test(UA);
			if(uc||qq){
				this.support = true;
			}else{
				this.support = false;
			}
        },
        invite(){
            if(this.isWx){
                this.wxBgd = true;
            }else{
                this.shareOpen=true
            }
        },
        shareTo(command){
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
        },
        /**
         * 邀请好友来参团(弃用)
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
						courseId:this.courseAssembleData.courseId,
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
        wxshare(){
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    this.$http.post(this.$server.getCourseInfo,{
						courseId:this.courseAssembleData.courseId,
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
								// WXconfig:       {
								// 	swapTitleInWX: true,
								// 	appId:data['appId'],
								// 	timestamp:data['timeStamp'],
								// 	nonceStr:data['nonceStr'],
								// 	signature:data['signature'],
								// }
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
    }    
}
</script>
<style lang="scss" scoped>
    .share-wrap{
        height: 100vh;
        background: rgba(0, 0, 0, .6);
        position: fixed;
        left: 50%;
        bottom: 0;
        width: 100%;
        z-index: 1000;
        max-width: 414px;
        transform: translateX(-50%);
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
    .join-course-assemble{
        position: fixed;
        top:0;
        left: 50%;
        width: 100%;
        height: 100%;
        z-index: 100;
        background: rgba(0,0,0,0.6);
        max-width: 414px;
        transform: translateX(-50%);
        #input{
            opacity: 0;
            position: absolute;
            top:-1rem;
        }
        .loading{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 5.7rem;
            height: 4rem;
            background: #fff;
            position: absolute;
            top:50%;
            left: 50%;
            text-align: center;
            transform: translate(-50%,-50%);
            border-radius: 8px;
        }
        .box{
            border-radius: 8px;
            background: #fff;
            width: 5.7rem;
            padding: 0.3rem 0;
            min-height: 4.4rem;
            position: absolute;
            top:50%;
            left: 50%;
            text-align: center;
            transform: translate(-50%,-50%);
            .assemble-open-user{
                font-size: 0.32rem;
                color:#000000;
                margin-top:0.1rem;
            }
            .assemble-name{
                font-size: 0.28rem;
                margin-top:0.3rem;
                color:#CACACA;
                span{
                    color:#000;
                }
            }
            .assemble-users-head{
                margin:0.3rem 0 0.4rem 0;
                img{
                    display: inline-block;
                    width: 0.85rem;
                    height: 0.85rem;
                    border-radius: 50%;
                }
            }
            .count-down{
                font-size: 0.32rem;
                color:#6A6A6A;
                vertical-align: middle;
                margin-bottom:0.5rem;
                span{
                    display: inline-block;
                }
                .hour,.minute,.second,.msec{
                    display: inline-block;
                    width: 0.6rem;
                    height: 0.6rem;
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
            }
            button{
                display: inline-block;
                width: 3.6rem;
                height: 0.88rem;
                line-height: 0.88rem;
                text-align: center;
                font-size: 0.32rem;
                border:none;
                outline: none;
                border-radius: 25px;
                letter-spacing: 1px;
                border:1px solid #B63B40;
                margin-bottom:0.2rem;
                &.join-btn{
                    background: #B63B40;
                    color:#fff;
                    &:active{
                        background: #b61d23;
                    }
                }
                &.share-course-btn{
                    color: #B63B40;
                    background:#fff;
                    &:active{
                        background:#faf7f7;
                    }
                }
            }
            .tip{
                color:#6A6A6A;
                font-size: 0.24rem;
                margin:0.1rem 0;
            }
            &.fail{
                .t{
                    font-size: 0.32rem;
                    color:#000000;
                    margin:0.2rem 0;
                }
                .tips{
                    color:#6A6A6A;
                    font-size: 0.3rem;
                    margin:0.6rem 0;
                }
                .tips-btn{
                    width: 4rem;
                    background: #B63B40;
                    color:#fff;
                    margin-top:0.2rem;
                    box-shadow:0px 4px 12px 0px rgba(180,39,45,0.3);
                }
            }
        }
    }
</style>
