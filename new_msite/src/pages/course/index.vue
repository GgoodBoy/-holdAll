<template>
    <div class="course-wrapper" v-if="finish" @click="hideVideoControl" :class="audioData.show&&audioData.periodId&&courseData.courseType==2&&audioData.courseId==courseData.id?'pd':''">
        <Header :shareFlag.sync="shareFlag" :startPlay="startPlay" :mqqbrowser="mqqbrowser"></Header>
        <div class="video-course-init" v-if="courseData.courseType==1">
            <img class="course-img" :src="courseData.surfacePlot" alt="" @click.stop="test">
			<div v-if="(canPlay&&startPlay&&!audioData.show)||knowledgeIdInCourse!=''" class="player-area" :class="mqqbrowser?'is-qq':''" :style="{top:hasOpenApp?'0.98rem':'0px'}">
				<iframe v-if="huawei" class="huawei-player" :src="huaweiUrl"></iframe>
				<VideoComp v-else :sourceData="sourceData" :surface="sourceData.targetImg" :startPlay.sync="startPlay" :playVideoFlag.sync="playVideoFlag" :mqqbrowser="mqqbrowser" :haveCourse="haveCourse" :periodListTemp="periodList" :currentPeriodId.sync="currentPeriodId" />
			</div>
			<div class="player-btn" v-if="finish" v-show="!startPlay||(!sourceData.periodId&&knowledgeIdInCourse=='')" :class="{'play':canPlay,'lock':!canPlay}" @click.stop="startPlayEvent" ref="playBtn">
				<i></i>
			</div>
        </div>
		<div class="course-audio-main" v-if="finish&&courseData.courseType==2" v-show="!startPlay||(audioData.show&&audioData.periodId&&audioData.courseId!=courseData.id)" @click.stop="startPlayEvent">
			<img class="course-img" :src="courseData.surfacePlot" alt="">
			<div class="audio-player-btns">
				<div class="audio-play-btn" @click.stop="startPlayEvent" ref="playBtn" >
					<i class="player-btn" :class="canPlay?'play':'lock'"></i>
				</div>
				<div class="audio-controls" v-if="canPlay">
					<div class="t">
						<div class="process"></div>
						<div class="control-item prve"><i class="prve-btn can"></i></div>
						<div class="control-item next"><i class="next-btn can"></i></div>
					</div>
					<div class="b">
						<p class="duration"> 00:00/ {{totalDuration==0?'00:00':totalDuration}}</p>
						<div class="control-btns">
							<div class="control-item speed-area">
								<p class="cur-speed" @click.stop="switchSpeedList">{{curSpeed.speed==1?'正常':curSpeed.speed+'x'}}</p>
								<div class="list" :class="{'open':speedFlag,'close':!speedFlag,'show':speedList.length>0}">
									<div class="speed-item" v-for="(item,index) in speedList" :class="{'normal':item.speed==1,'active':item.active}" :key="index" @click.stop="chooseSpeed(item)">
										<p>{{item.speed==1?'正常':item.speed+'x'}}</p>
									</div>
								</div>
							</div>
							<div class="details" @click.stop="showDetails">
								<i></i>
							</div>
							<div class="loop-btn" :class="loopFlag?'loop':''" @click.stop="loopResource">
								<i></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<Timelimit :courseData="courseData"></Timelimit>
        <CourseInfo :courseData="courseData" :copyDialogVisible.sync="copyDialogVisible" :copyDialogstate.sync="copyDialogstate" :copyText.sync="copyText"/>
		<PeriodListComp :courseData="courseData" :periodList="periodList" :currentPeriodId.sync="currentPeriodId" :startPlay.sync="startPlay" :playVideoFlag="playVideoFlag" :channelAvaliDayPrice.sync="channelAvaliDayPrice" :channelAvaliDayVisible.sync="channelAvaliDayVisible" :buyType.sync="buyType" :isExistRelevance.sync="isExistRelevance"/>
        <momentsComp v-if="courseData.isExistCircle==1" :courseData="courseData" :copyDialogstate.sync="copyDialogstate" :copyDialogVisible.sync="copyDialogVisible" :copyText.sync="copyText"></momentsComp>
		<CourseTeacher :courseData="courseData"/>
        <Knowledge :courseData="courseData" v-if="courseData.id" :currentPeriodId.sync="currentPeriodId"/>
        <CourseIntro :courseData="courseData"/>
        <relevanceCourse :courseData="courseData" v-if="courseData.id" :isExistRelevance.sync="isExistRelevance"/>
	    <Comment v-if="courseData.id" :courseData="courseData"  @commentPropData="getCommentPropData"></Comment>
	    <transition name="enter-in">
			<commonDetail :dataItem="dataItem" :courseData="courseData" @commentEmit="commenPageEven" v-if="commonDetailState"></commonDetail>
		</transition>
		<CourseBottom :courseData="courseData" :channelAvaliDayPrice.sync="channelAvaliDayPrice" :buyType.sync="buyType" :assembleQuery.sync="assembleQuery" />
        <NormalShare v-if="shareFlag&&!isWx" :shareFlag.sync="shareFlag"/>
        <wxShare v-if="shareFlag&&isWx" :shareFlag.sync="shareFlag"/>
		<transition name="fade">
			<ReceivePeriodByInvite v-if="receivePeriodByInvite" :receivePeriodByInvite.sync="receivePeriodByInvite" :courseName="courseData.title"></ReceivePeriodByInvite>
		</transition>
		<transition name="fade">
			<div class="course-time-tip" v-if="channelAvaliDayVisible&&channelAvaliDayPrice!=''">
				<div class="box">
					<van-icon name="close" class="close" @click="closeChannelAvaliDayVisible"/>
					<p class="validity" v-if="courseData.channelAvaliDay!=0">课程有效期至 {{courseData.channelAvaliDay}} 请于有效期内学习</p>
					<div class="btn" @click="goOrderEvent">立即购买 :  {{channelAvaliDayPrice}}币</div>
				</div>
			</div>
		</transition>
		<div class="no-data-box" v-if="takeOffFlag">
			<div class="bgd"></div>
			<p class="p1">没有找到相关内容~</p>
			<div class="text-tips">
				<p>该课程已下架~</p>
			</div>
		</div>
		<div class="copy-dialog" v-if="copyDialogVisible">
			<div class="box">
				<van-icon name="close" class="close-btn" @click="copyDialogVisible=false"/>
				<input class="copy-target" id="input" :value="copyText" readonly/>
				<p class="text">复制下面微信号</p>
				<p class="wx-number">{{copyText}}</p>
				<div v-if="copyDialogstate==1" class="copy-btn" ref="copyBtn" data-clipboard-action="copy" :data-clipboard-target="`#input`" :class="{'disabled':copyDisabled}" @click="copy">一键复制</div>
				<p class="tips" v-if="copyDialogstate==1">若一键复制失效请手动复制</p>
				<a href="weixin://" class="btn" v-if="!isWx">打开微信添加</a>
			</div>
		</div>
    </div>
</template>
<script>
import Clipboard from 'clipboard'
import {mapState,mapActions} from 'vuex'
import Header from './header.vue'
import NormalShare from './normalShare.vue'
import wxShare from './weixinShare.vue'
import Timelimit from './timelimit.vue'
import CourseInfo from './courseInfo.vue'
import CourseTeacher from './courseTeacher.vue'
import Knowledge from './knowledge.vue'
import relevanceCourse from './relevanceCourse.vue'
import CourseIntro from './courseIntro.vue'
import PeriodListComp from './periodList.vue'
import momentsComp from './moments.vue'//圈子
import VideoComp from './video.vue'
import CourseBottom from './courseBottom.vue'
import Comment from './comment.vue'
import CommonDetail from './commonDetail.vue'
import ReceivePeriodByInvite from './receivePeriodByInvite.vue'

function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
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

function coverString(subStr,str){
   var reg = eval("/"+subStr+"/ig");
   return reg.test(str);
}
export default {
    data(){
        return{
			userId:'',
			isLogin:false,
            shareFlag:false,//分享
            periodList:[],//目录
			courseData:{},//课程数据
			finish:false,//接口是否请求完毕
            isStart:false,//限时购是否开始
            sourceData:{},//资源,
			currentPeriodId:0,//当前课时ID
			receivePeriodByInvite:false,//是否弹出领取课时弹窗，(通过邀好友看进入当前页面)
			isFriendShareAndBuy:false,//当前页通过邀好友看进入，判断当前登录的用户是否已经购买了领取的课程
			isFriendShareAndReceive:false,//当前页通过邀好友看进入，判断当前登录的用户是否已经领取了需领取的课时
			canPlay:false,//是否可以播放
			startPlay:false,//开始播放
			isTrysee:false,//没有拥有该课，仅有试看，在课时列表展示锁的icon
			tempAudioPeriodId:-1,//临时课时id，当音频播放器存在,且是音频课,且进入的课程id！=音频播放器课程id
			tempVideoPeriodId:-1,//临时课时id，当音频播放器存在,且是视频课,且进入的课程id！=音频播放器课程id
			totalDuration:0,
			curSpeed:{speed:1,className:'speed'},
            speedList:[
                {speed:0.5,className:'',active:false},
                {speed:0.75,className:'',active:false},
                {speed:1,className:'',active:true},
                {speed:1.25,className:'',active:false},
                {speed:1.5,className:'',active:false},
			],
			speedFlag:false,
			loopFlag:false,
			clickSpeed:false,
			clickLoop:false,
			tempTime:'',
			playVideoFlag:false,//针对华为
			takeOffFlag:false,//是否下架
			commonDetailState:false,
			dataItem:'',//评论详情数据
			channelAvaliDayVisible:false,
			channelAvaliDayPrice:'',
			goOrder:false,
			buyType:'0',//0正常，1秒杀，2开团（拼团）
			assembleQuery:'',
			mqqbrowser:false,
			huawei:false,
			huaweiUrl:'',
			copyDialogVisible:false,
			clipboard:'',
			copyDialogstate:1,//1广告点击，2.圈子点击
			copyText:'',//复制的内容
			copyDisabled:false,
			isExistRelevance:false//是否存在推荐课程
        }
    },
    components:{
        Header,NormalShare,wxShare,Timelimit,CourseInfo,CourseTeacher,Knowledge,relevanceCourse,CourseIntro,PeriodListComp,VideoComp,CourseBottom,Comment,CommonDetail,ReceivePeriodByInvite,momentsComp
    },
    computed:{
		...mapState(['isWx','isIos',
			'hasOpenApp',
			'shareUserData',
			'isSetCommission',
			'isVip',
			'isInvitationSee',
			'isSetInvitationCode',
			'audioData',
			'receivefriendShareData',
			'InvitationSeeData',
			'friendShareData',
			'cooperativePlatformsData',
			'heightVideoStore',
			'browserTypeStort',
			'knowledgeRouteState',
			'knowledgeIdInCourse',
			'lastStudyPoint'
		]),
		haveCourse(){
			return this.canPlay&&!this.isTrysee
		}
    },
    watch:{
        audioData:{
            handler(newValue, oldValue) {
				if(!newValue.show&&!newValue.periodId)return false;
				if(newValue.click) return;
				if(this.clickSpeed) return;
				if(this.clickLoop) return;
    　　　　　　 if(newValue.periodId!=this.currentPeriodId){
                    this.currentPeriodId = newValue.periodId;
                }
    　　　　 },
    　　　　 deep: true
		},
		knowledgeIdInCourse(cur,old){
			if(cur!=''){
				this.$refs.playBtn.click();
				if(this.huawei){
					let data = {
						courseId:this.sourceData.courseId,
						shortVideoId:this.knowledgeIdInCourse,
					}
					let uInfo = JSON.parse(this.$getCookie('uInfo'));
					if (uInfo && uInfo.accessToken) {
						data.token = uInfo.accessToken
						data.userId = this.userId;
					}
					this.huaweiUrl = encodeURI(`static/iframePage/huaweiPlayer.html?data=${JSON.stringify(data)}`)
				}
			}
		},
		currentPeriodId(cur,old){
			if(cur==-3){//短视频
				return;
			}
			if(old==-1||old==-2) return;
			if(cur==-1||cur==-2){
				//针对音频视频第一节可以播放的课时，没有播放，点击catalog中的课时进行播放
				this.currentPeriodId = old;
				if(this.huawei){
					const data = {
						courseId:this.sourceData.courseId,
						periodId:this.sourceData.periodId,
						targetImg:this.sourceData.targetImg
					}
					let uInfo = JSON.parse(this.$getCookie('uInfo'));
					if (uInfo && uInfo.accessToken) {
						data.token = uInfo.accessToken
						data.userId = this.userId;
					}
					this.huaweiUrl = encodeURI(`static/iframePage/huaweiPlayer.html?data=${JSON.stringify(data)}`)
				}
				this.$refs.playBtn.click();
			}
			if(this.courseData.courseType){			
				this.getPeriodInfo()
			}
			else{
				this.tempTime = setInterval(()=>{
					this.getPeriodInfo()
				},1000)
			}
			//如果音频播放存在
			if(this.audioData.show&&this.audioData.periodId){
				//音频data的课时id等于当前currentPeriod,且自动播放属性，就直接开始播放
				if(this.audioData.periodId==cur&&this.audioData.autoplay){
					this.startPlay = true;
					return false;
				}
			}
			let obj = this.periodList.find(item=>item.id==cur);
			if(!obj)return;
			if(this.courseData.courseType==1){
				if(this.startPlay){
					this.periodList.forEach(item=>item.active=false);
					obj.active = true;
				}
				let audioData = Object.assign({},this.audioData,{
					show:false
				})
				this.setAudioData(audioData)
				let sourceData = {
					periodId:obj.id,
					courseId:this.courseData.id,
					targetImg:this.courseData.surfacePlot,
					cur:obj,
					autoplay:true
				}
				if(this.isFriendShareAndReceive&&cur==this.receivefriendShareData.friendSharePeriodId){
					sourceData.shareUserId = this.receivefriendShareData.friendId;
					this.canPlay = true;
				}
				if(!this.startPlay){
					sourceData.autoplay = false;
				}
				this.playVideoFlag = false;
				this.sourceData = sourceData;
				// this.startPlay = false;
				// this.$nextTick(()=>{
				// 	this.startPlay = true;
				// })
				if(this.huawei){
					const data = {
						courseId:this.sourceData.courseId,
						periodId:this.sourceData.periodId,
						targetImg:this.sourceData.targetImg
					}
					let uInfo = JSON.parse(this.$getCookie('uInfo'));
					if (uInfo && uInfo.accessToken) {
						data.token = uInfo.accessToken
						data.userId = this.userId;
					}
					this.huaweiUrl = encodeURI(`static/iframePage/huaweiPlayer.html?data=${JSON.stringify(data)}`)
				}
			}else{
				//catalog组件内，点击音频课时,重新获取资源
				if(this.audioData.click){
					this.startPlay = true;
					if(this.isFriendShareAndReceive&&cur==this.receivefriendShareData.friendSharePeriodId){
						this.getResoursePlayUrl(obj,'click',1)
					}else{
						if(this.cooperativePlatformsData.xxtId&&this.cooperativePlatformsData.xxtId.length>0){
							this.getResPlayUrlForXXT(obj,'click')
						}else{
							this.getResoursePlayUrl(obj,'click',0)
						}
					}
				}else{
					if(this.isFriendShareAndReceive&&cur==this.receivefriendShareData.friendSharePeriodId){
						this.getResoursePlayUrl(obj,'',1)
					}
				}
			}
		},
		isFriendShareAndBuy(cur,old){
			if(cur){
				this.currentPeriodId = this.receivefriendShareData.friendSharePeriodId;
				if(this.isIos){
					if(this.courseData.courseType==1){
						setTimeout(()=>{
							this.startPlay = true;
						},300)
					}else{
						let audioData = Object.assign({},this.audioData,{
							click:true,
						})
						this.setAudioData(audioData)
					}
				}
			}
		},
		/**
		 * 接收了邀好友看课时
		 */
		isFriendShareAndReceive(cur,old){
			if(cur){
				this.currentPeriodId = this.receivefriendShareData.friendSharePeriodId;
				let obj = this.periodList.find(item=>item.id==this.receivefriendShareData.friendSharePeriodId)
				obj.isFriendShare = true;
				let index = this.periodList.findIndex(item=>item.id==this.receivefriendShareData.friendSharePeriodId)
				this.$set(this.periodList,index,obj)
				if(this.isIos){
					if(this.courseData.courseType==1){
						setTimeout(()=>{
							this.startPlay = true;
						},300)
					}else{
						let audioData = Object.assign({},this.audioData,{
							click:true,
						})
						this.setAudioData(audioData)
					}
				}
			}
		},
		copyDialogVisible(cur){
			if(cur){
				this.clipboard = ''
				setTimeout(()=>{
					this.clipboard = new Clipboard(this.$refs.copyBtn);
				},1)
			}else{
				this.copyDisabled = false;
			}
		}
	},
	beforeRouteLeave (to, from, next){
		if(this.commonDetailState){
			this.commonDetailState = false;
			next(false);
			return;
		}
		if(to.name=='courseOrder'){
			let aboutCourse = localStorage.getItem('aboutCourse')
			if(!aboutCourse){
				next(this.$route.path)
				return;
			}
			if(this.courseData.channelAvaliDay!=0){
				if(this.goOrder){
					this.channelAvaliDayVisible = false;
					next()
				}else{
					this.channelAvaliDayVisible = true;
					next(false)
				}
			}else{
				next()
			}
		}else{
			next()
		}
	},
    created(){
		this.getCourseInfo();
		let uInfo = JSON.parse(this.$getCookie('uInfo'));
        if (uInfo && uInfo.accessToken) {
			this.userId = uInfo.userid;
			this.isLogin = true;
        }else{
			this.isLogin = false;
		}
		let ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
			this.wxshare();
		}else if (ua.match(/QQ/i) == "qq" && ua.match(/MQQbrowser/i)!='mqqbrowser') {
			this.wxshare();
		}
		this.mqqbrowser = ua.includes('mqqbrowser')&&!ua.includes('micromessenger');	
    },
    methods:{
		...mapActions([
			'setCourseShareData',
			'setShareType',
			'setShareUserData',
			'setInvitationCode',
			'setCommission',
			'setInvitationSee',
			'setAudioData',
			'setInvitationSeeData',
			'setFriendShareData',
			'setVideoSourceData',
			'setVideorCourse',
			'setPlayVideoFlag',
			'setVideoStartPlay',
			'setVideoHideBar',
			'setVideShowHideStoreData',
			'setheightVideoStore',
			'setCoursePlayIdVal',
			'setVideoIsRemove',
			'setStopMinVideoEven',
			'setTopLeftVal',
			'setBrowserTypeStort',
			'setKnowledgeRouteState',
			'setKnowledgeIdInCourse',
			'setDownLoadFlag',
			'setCommissionToStart',
			'setLastStudyPoint']),
		test(){

		},
        hideVideoControl(){
			if(this.audioData.show) return;
            let dom = document.querySelector('.prism-controlbar')
            if(dom){
                dom.style.display = 'none';
			}
			let dom1 = document.querySelector('.player-controls')
			if(dom1){
				dom1.style.display = 'none';
			}
			let dom2 = document.querySelector('.course-header')
			if(dom2&&this.startPlay){
				dom2.style.visibility = 'hidden';
			}
        },
        /**
		 * 获取课程详情
		 */
		getCourseInfo(){
			this.$toast.loading();
			this.$http.post(this.$server.getCourseInfo,{
				courseId:Number(this.$route.params.courseId),
			}).then(res =>{
				this.$toast.clear();
				if(res.data.status == 200){
					this.courseData = res.data.content;
					if(this.courseData.courseType==1){
						let isChrome = navigator.userAgent.includes('Chrome');
						let isQQ = navigator.userAgent.includes('QQ'||'qq');
						if(coverString('HONOR',navigator.userAgent)||coverString('Honor',navigator.userAgent)||coverString('HUAWEI',navigator.userAgent)||coverString('huawei',navigator.userAgent)){
							if(this.isWx||isChrome||isQQ){

							}else{
								this.huawei = true;
							}
						}
					}
					this.$nextTick(()=>{
						this.getPeriodList()
					})
					let title = res.data.content.title||'';
					let surfacePlot = res.data.content.surfacePlot||'';
					let teacherName = res.data.content.lectureTeacherList[0]?res.data.content.lectureTeacherList[0].name:'';
					let introduce = res.data.content.intro||'';
					let id = res.data.content.id
					let shareData = {
						courseId:id,
						title:title,
						surfacePlot:surfacePlot,
						teacherName:teacherName,
						introduce:introduce,
						link:window.location.origin+'/?wxshare=true&type=course&courseId='+id,
					}
					this.setCourseShareData(shareData)
				}else if(res.data.status == 500){
					if(res.data.message.includes('下架')){
						this.takeOffFlag = true;
						this.finish = true;
						setTimeout(()=>{
							this.$router.push('/')
						},3000)
					}
				}
			}).catch(()=>{
                this.$toast.clear();
            })
        },
        /**
		 * 获取课时目录
		 */
        getPeriodList(){
            let query = {
				courseId:Number(this.$route.params.courseId)
            }
            this.$http.post(this.$server.getPeriodsListByCourseId,query).then(res =>{
				if(res.data.status == 200){
                    this.periodList = res.data.content;
					this.finish = true;
					this.isCanPlay()
					if(this.receivefriendShareData.friendId&&this.receivefriendShareData.friendShareCourseId==this.$route.params.courseId){
						this.verifyReceiveInvitationSee();
					}
				}
			})
		},
		/**
		 * 如果当前页面是通过邀好友看进入的，先验证当前课时是否已经领取了
		 */
		verifyReceiveInvitationSee(){
			if(this.isLogin){
				let receiveFriendShare = localStorage.getItem('receiveFriendShare')?JSON.parse(localStorage.getItem('receiveFriendShare')):null;
				let query = {
					courseId:this.receivefriendShareData.friendShareCourseId,
					periodId:this.receivefriendShareData.friendSharePeriodId,
				}
				this.$http.post(this.$server.verifyReceiveInvitationSee,query).then(res=>{
					if(res.data.status==200){
						if(res.data.content.hasReceive==1||res.data.content.hasBuy==1){
							this.receivePeriodByInvite = false;
							if(res.data.content.hasBuy==1){
								this.isFriendShareAndBuy = true;
							}else{
								this.isFriendShareAndBuy =false;
								if(res.data.content.hasReceive==1){
									this.isFriendShareAndReceive = true;
									if(receiveFriendShare){
										let obj = receiveFriendShare.find(item=>item.courseId==this.courseId&&item.periodId==this.periodId&&item.userId==this.userId);
										if(obj){
											obj.hasReceive = 1;
										}else{
											let tempj = {courseId:this.courseId,periodId:this.periodId,userId:this.userId,hasReceive:1};
											receiveFriendShare.push(tempj)
										}
										localStorage.setItem('receiveFriendShare',JSON.stringify(receiveFriendShare));
									}else{
										let arr = []
										let tempj = {courseId:this.courseId,periodId:this.periodId,userId:this.userId,hasReceive:1};
										arr.push(tempj);
										localStorage.setItem('receiveFriendShare',JSON.stringify(arr));
									}
								}
							}
						}else{
							this.receivePeriodByInvite = true;
							if(res.data.content.hasReceive==0){
								if(receiveFriendShare){
									let obj = receiveFriendShare.find(item=>item.courseId==this.courseId&&item.periodId==this.periodId&&item.userId==this.userId);
									if(obj && obj.hasReceive==1){
										this.receivePeriodByInvite = false;
										this.receiveInvitationSharePeriod()
									}else{
										this.isFriendShareAndReceive = false;
									}
								}else{
									this.isFriendShareAndReceive = false;
								}
							}

						}
					}
				})
			}else{
				this.receivePeriodByInvite = true;
			}
		},
		/**
		 * 领取邀好友看课时
		 */
		receiveInvitationSharePeriod(){
			let query = {
                courseId:this.receivefriendShareData.friendShareCourseId,
				periodId:this.receivefriendShareData.friendSharePeriodId,
                sharerId:this.receivefriendShareData.friendId
			}
			this.$http.post(this.$server.receiveInvitationSharePeriod,query).then(res=>{
				this.isFriendShareAndReceive = true;
			})
		},
        /**
		 * 获取课时信息
		 */
		getPeriodInfo(id){
			clearInterval(this.tempTime)
            if(this.courseData.courseType!=2) return;
			let query = {
				periodId:this.currentPeriodId,
				courseType:this.courseData.courseType
			}
			if(id){
				query.periodId = id;
			}
			this.$http.post(this.$server.getPeriodsInfo,query).then(res =>{
				if(res.data.status == 200){
					if(res.data.content.audios){
						this.totalDuration = formatSeconds(res.data.content.audios.duration)
					}
				}
			})
		},
        /**
		 * 是否可以播放
		 */
		isCanPlay(){
			if(this.courseData.timeLimitType>=0&&this.courseData.timeLimitBeginAt&&this.courseData.nowServerTime){
				let begin = new Date(this.courseData.timeLimitBeginAt.replace(/-/g, '/')).getTime();
				let now = new Date(this.courseData.nowServerTime.replace(/-/g, '/')).getTime();
				this.isStart = now>=begin;
			}
			if(this.courseData.isVip==1||this.courseData.isBuy>0||this.courseData.isFree>0||(this.courseData.timeLimitType==0&&this.isStart)){
				this.canPlay = true;
				if(this.courseData.courseType==1){
					//视频
					if(this.audioData.show&&this.audioData.periodId){
						this.tempVideoPeriodId = this.periodList[0].id;
						return false;
					}
					this.currentPeriodId = this.periodList[0].id;
				}else{
					//音频
					if(this.audioData.show&&this.audioData.periodId){
						if(this.audioData.courseId==this.courseData.id){
							//音频存在，且再次进入的是同一课程
							this.currentPeriodId = this.audioData.periodId;
						}else{
							this.tempAudioPeriodId = this.periodList[0].id;
							this.getPeriodInfo(this.periodList[0].id)
							this.startPlay = false;
							console.log('音频存在，但不是同一课程')
						}
						return false;
					}else{
						this.currentPeriodId = this.periodList[0].id;
						this.getResoursePlayUrl(this.periodList[0])
					}
				}
			}else{
				if(this.courseData.isTrySee>0){
					this.canPlay = true;
					this.isTrysee = true;
					let obj = this.periodList.find(item=>item.isTry>0)
					if(this.courseData.courseType==1){
						//视频课
						if(this.audioData.show&&this.audioData.periodId){
							this.tempVideoPeriodId = obj.id;
							return false;
						}
						this.currentPeriodId = obj.id;
					}else{
						//音频课
						if(this.audioData.show&&this.audioData.periodId){
							if(this.audioData.courseId==this.courseData.id){
								//音频存在，且再次进入的是同一课程
								this.currentPeriodId = this.audioData.periodId;
							}else{
								this.tempAudioPeriodId = obj.id;
								this.getPeriodInfo(obj.id);
								this.startPlay = false;
								console.log('音频存在，但不是同一课程')
							}
							return false;
						}else{
							this.currentPeriodId = obj.id;
							this.getResoursePlayUrl(obj)
						}
					}
				}else{
					this.canPlay = false;
					this.isTrysee = false;
				}
			}
        },
        /**
		 * 点击顶部课时目录播放(针对视频)
		 */
		playPeriod(obj){
			if(obj.active) return;
			if(!this.canPlay){
				this.codeShow = true;
				return;
			}
			if(this.isTrysee){
				if(obj.isTry>0){
					this.periodList.forEach(item=>item.active=false)
					obj.active = true;
					if(obj.id==this.sourceData.periodId){
						this.startPlay = false;
						this.$nextTick(()=>{
							this.startPlay = true;
						})
					}else{
						this.startPlay = false;
						this.$nextTick(()=>{
							this.startPlay = true;
						})
						this.currentPeriodId = obj.id;
					}
					this.setKnowledgeIdInCourse('')
				}else{
					this.codeShow = true;
					return;
				}
			}else{
				this.periodList.forEach(item=>item.active=false)
				obj.active = true;
				if(obj.id==this.sourceData.periodId){
					this.startPlay = false;
					this.$nextTick(()=>{
						this.startPlay = true;
					})
				}else{
					this.startPlay = false;
					this.$nextTick(()=>{
						this.startPlay = true;
					})
					this.currentPeriodId = obj.id;
				}
				this.setKnowledgeIdInCourse('')
			}
		},
		downLoadApp(){
			const link = this.isIos?`xueguoxuewang://type=course&courseId=${this.$route.params.courseId}`:`xgx://lessons/open?courseId=${this.$route.params.courseId}`;
			window.location.href = link;
			setTimeout(()=>{
				var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden
				if(typeof hidden =="undefined" || hidden ==false){
					window.location.href = `${this.$server.downLoad}?type=course&courseId=${this.$route.params.courseId}`;
				}
			}, 2500);
		},
        /**
		 * 播放按钮播放
		 */
		startPlayEvent(){
			if(!this.canPlay){
				let uInfo = this.$getCookie('uInfo');
				if(!uInfo){
					sessionStorage.setItem('rediectUrl',this.$route.fullPath)
					this.$router.push('/auth')
					return;
					// this.$dialog.confirm({
					// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
					// 	confirmButtonColor:"#D40015",
					// 	confirmButtonText:'继续',
					// 	cancelButtonText:'APP内购买'
					// }).then(() => {
					// 	sessionStorage.setItem('rediectUrl',this.$route.fullPath)
					// 	this.$router.push('/auth')
					// }).catch(() => {
					// 	this.downLoadApp()
					// });
				}else{
					document.querySelectorAll(".catalog-item")[0].querySelector('.play-status').click()
				}
			}
			if(this.courseData.courseType==1){
				// let isChrome = navigator.userAgent.includes('Chrome');
				// let isQQ = navigator.userAgent.includes('QQ'||'qq');
                // if(coverString('HONOR',navigator.userAgent)||coverString('Honor',navigator.userAgent)||coverString('HUAWEI',navigator.userAgent)||coverString('huawei',navigator.userAgent)){
				// 	if(this.isWx||isChrome||isQQ){

				// 	}else{
				// 		if(!this.$route.query.periodId){
				// 			window.location.hash = `${this.$route.path}?periodId=${this.currentPeriodId}`
				// 			window.location.search = ''
				// 			return;
				// 		}
				// 	}
                // }
				this.startPlay = true;
				this.periodList.forEach(item=>item.active=false)
				if(this.audioData.show&&this.audioData.periodId){
					let audioData = Object.assign({},this.audioData,{
						show:false
					})
					this.setAudioData(audioData)//有音频，播放视频时候，干掉音频
					let obj = this.periodList.find(item=>item.id==this.tempVideoPeriodId);
					obj.active = true;
					setTimeout(()=>{
						this.currentPeriodId = this.tempVideoPeriodId;
					},1)
					if(obj.lastStudyPoint){
						this.setLastStudyPoint(obj.lastStudyPoint)
						obj.getLastStudyPoint = true;
					}
				}else{
					if(this.sourceData.cur){
						this.sourceData.cur.active = true;
						if(this.sourceData.cur.lastStudyPoint){
							this.setLastStudyPoint(this.sourceData.cur.lastStudyPoint)
							this.sourceData.cur.getLastStudyPoint = true;
						}
					}else{
						this.currentPeriodId = this.tempVideoPeriodId
						let obj = this.periodList.find(item=>item.id==this.tempVideoPeriodId);
						if(obj&&obj.lastStudyPoint){
							this.setLastStudyPoint(obj.lastStudyPoint)
							obj.getLastStudyPoint = true;
						}
					}
				}
			}else{
				if(this.isIos){
					let userAgent= navigator.userAgent.toLowerCase();
					let version=userAgent.match(/cpu iphone os (.*?) like mac os/);
					let temp = version[1].split('_')[0]
					if(temp<=9){
						this.$dialog.confirm({
							message: '当前ios版本<10.0.0，暂不支持浏览器端收听课程。是否立即前往APP？'
						}).then(() => {
							this.downLoadApp()
						}).catch(() => {

						});
						return false;
					}
				} //ios10下播放视频会全屏
				let ua = window.navigator.userAgent.toLowerCase()
				let uc = navigator.appVersion.split('UCBrowser/').length > 1;//uc浏览器
				let mqqbrowser = ua.includes('mqqbrowser')&&!ua.includes('micromessenger');//QQ浏览器
				let oppo = navigator.userAgent.includes('OppoBrowser');//oppo自带浏览器
				if(uc||mqqbrowser||oppo){
					this.$dialog.confirm({
						message: `当前浏览器暂不支持收听，请更换浏览器，或者前往APP。是否立即前往APP？`
					}).then(() => {
						this.downLoadApp()
					}).catch(() => {

					});
					return false;
				}
				let isChrome = navigator.userAgent.includes('Chrome');
				let isQQ = navigator.userAgent.includes('QQ'||'qq');
				if(coverString('HONOR',navigator.userAgent)||coverString('Honor',navigator.userAgent)||coverString('HUAWEI',navigator.userAgent)||coverString('huawei',navigator.userAgent)){
					if(this.isWx||isChrome||isQQ){
						
					}else{
						this.$dialog.confirm({
							confirmButtonColor:"#D40015",
							message: '当前浏览器暂不支持收听，请更换浏览器，或者前往APP。是否立即前往APP？'
						}).then(() => {
							this.downLoadApp()
						}).catch(() => {
							
						});
						return false;
					}
				}
				if(this.tempAudioPeriodId==-1){
					this.startPlay = true;
					let obj = this.periodList.find(item=>item.id==this.audioData.periodId);
					if(obj.lastStudyPoint){
						this.setLastStudyPoint(obj.lastStudyPoint)
						obj.getLastStudyPoint = true;
					}
					let audioData = Object.assign({},this.audioData,{
						startPlay:true,
						autoplay:true,
						show:true
					})
					if(document.querySelector('.newVideoBox')){
						document.querySelector('.closeminicon').click();
						setTimeout(()=>{
							this.setAudioData(audioData)
						},1)
					}else{
						this.setAudioData(audioData)
					}
				}else{
					let obj = this.periodList.find(item=>item.id==this.tempAudioPeriodId)
					if(this.cooperativePlatformsData.xxtId&&this.cooperativePlatformsData.xxtId.length>0){
						this.getResPlayUrlForXXT(obj,'new')
					}else{
						this.getResoursePlayUrl(obj,'new')
					}
					if(obj.lastStudyPoint){
						this.setLastStudyPoint(obj.lastStudyPoint)
						obj.getLastStudyPoint = true;
					}
				}
			}
			this.clickSpeed = false;
			this.clickLoop = false;
		},
        /**
		 * 获取资源地址（音频）
		 */
		getResoursePlayUrl(obj,flag,type){
			let query = {
				definitionType:1,
				periodId:obj.id,
				courseId:this.courseData.id
			}
			if(type==1){
				query.shareUserId = this.receivefriendShareData.friendId
			}
			this.$http.post(this.$server.getResoursePlayUrl,query).then(res=>{
				if(res.status==200){
					let temp  = this.periodList.find(item=>item.id==obj.id)
					let audioData = Object.assign({},this.audioData,{
						show:this.audioData.click?true:false,
						periodTitle:obj.title,
						periodSort:this.periodList.find(item=>item.id==obj.id).sort,
						surfacePlot:this.courseData.surfacePlot,
						periodUserLikeCount:this.courseData.courseUserLikeCount,
						thumbsUpPeriodFlag:this.courseData.thumbsUpCourseFlag,
						duration:obj.targetDuration,
						resourceUrl:res.data.content,
						periodId:obj.id,
						courseId:this.courseData.id,
						isBuy:this.courseData.isBuy,
						isFree:this.courseData.isFree,
						timeLimitType:this.courseData.timeLimitType||'',
						timeLimitBeginAt:this.courseData.timeLimitBeginAt||'',
						nowServerTime:this.courseData.nowServerTime||''
					})
					if(flag){
						if(flag=='click'){
							audioData.autoplay = true
							audioData.startPlay = true;
						}else if(flag=='new'){
							audioData.startPlay = true;
							audioData.autoplay = true;
							this.startPlay = true;
							this.currentPeriodId = obj.id;
						}
					}
					this.setAudioData(audioData)
				}
			})
		},
		showDetails(){
			let periodId = this.tempAudioPeriodId!=-1?this.tempAudioPeriodId:this.currentPeriodId
			let obj = this.periodList.find(item=>item.id==periodId)
			obj.surfacePlot = this.courseData.surfacePlot;
            this.$router.push({
                path:'/periodIntro',
                query:{
                    period:obj
                }
            })
		},
        /**
         * 倍速显示/隐藏
         */
        switchSpeedList(){
            this.speedFlag = !this.speedFlag
		},
		/**
         * 选择倍速
         */
        chooseSpeed(obj){
            this.curSpeed = {
                speed:obj.speed,
                className:obj.className
            }
            switch (true){
                case obj.speed==0.5:
                    this.timeDuration = 1000/0.5;
                    break;
                case obj.speed==0.75:
                    this.timeDuration = 1000/0.75;
                    break;
                case obj.speed==1:
                    this.timeDuration = 1000;
                    break;
                case obj.speed==1.25:
                    this.timeDuration = 1000/1.25;
                    break;
                case obj.speed==1.5:
                    this.timeDuration = 1000/1.5;
                    break;
            }
            this.speedFlag = false;
            this.speedList.forEach(item=>item.active = false)
            let temp = this.speedList.find(item=>item.speed==obj.speed)
			temp.active = true;
			this.clickSpeed = true;
			let audioData = Object.assign({},this.audioData,{
				speed:obj.speed
			})
			this.setAudioData(audioData)
		},
		loopResource(){
			this.clickLoop = true;
			if(this.loopFlag){
				this.loopFlag = false;
				let audioData = Object.assign({},this.audioData,{
					loopFlag:false
				})
				this.setAudioData(audioData)
			}else{
				this.loopFlag = true;
				let audioData = Object.assign({},this.audioData,{
					loopFlag:true
				})
				this.setAudioData(audioData)
			}
		},
		closeChannelAvaliDayVisible(){
			this.channelAvaliDayVisible = false;
			localStorage.removeItem('aboutCourse')
		},
		goOrderEvent(){
			this.channelAvaliDayVisible = false;
			this.goOrder = true;
			if(this.buyType=='0'){
				this.$router.push(`/course/order/${this.courseData.id}`)
			}else if(this.buyType=='1'){
				this.$router.push({path:`/course/order/${this.courseData.id}`,query:{buyType:1,spikePrice:this.channelAvaliDayPrice}})
			}else if(this.buyType=='2'){
				this.$router.push({path:`/course/order/${this.$route.params.courseId}`,query:JSON.parse(this.assembleQuery)})
			}
			return;
			// this.$dialog.confirm({
			// 	message: '<p>使用APP支付购买课程</p><p>可享有更多积分和优惠券</p>',
			// 	confirmButtonColor:"#D40015",
			// 	confirmButtonText:'继续',
			// 	cancelButtonText:'APP内购买'
			// }).then(() => {
			// 	this.goOrder = true;
			// 	if(this.buyType=='0'){
			// 		this.$router.push(`/course/order/${this.courseData.id}`)
			// 	}else if(this.buyType=='1'){
			// 		this.$router.push({path:`/course/order/${this.courseData.id}`,query:{buyType:1,spikePrice:this.channelAvaliDayPrice}})
			// 	}else if(this.buyType=='2'){
			// 		this.$router.push({path:`/course/order/${this.$route.params.courseId}`,query:JSON.parse(this.assembleQuery)})
			// 	}
			// }).catch(() => {
			// 	this.downLoadApp()
			// });
		},
		/*
		getCommentPropData
		详情页面
		 */
		getCommentPropData(datas){
			this.commonDetailState = true;
			this.dataItem = datas;
		},
		commenPageEven(datas){
			this.commonDetailState = false;
		},
		copy(){
			if(this.copyDisabled) return;
			let clipboard = this.clipboard;
            clipboard.on('success',()=>{
				const msg = this.isWx?'微信号复制成功,快去添加好友':'微信号复制成功,快去打开微信添加好友'
				this.$toast(msg)
				this.copyDisabled = true;
            });
            clipboard.on('error',()=>{
				this.$toast('该浏览器不支持自动复制，请手动复制微信号');
            });
        },
		wxshare(){
			let url = encodeURIComponent(window.location.href.split('#')[0]);
			let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
					let data = res.data.content;
					let id = Number(this.$route.params.courseId);
					if(!id) return false;
					this.$http.post(this.$server.getCourseInfo,{
						courseId:id,
					}).then(response=>{
						if(response.data.status == 200){
							let title = response.data.content.title||'';
							let surfacePlot = response.data.content.surfacePlot||'';
							let teacherName = response.data.content.lectureTeacherList[0]?response.data.content.lectureTeacherList[0].name:'';
							let introduce = response.data.content.intro||'';
							let shareUserId = this.shareUserData.shareUserId;
							let courseId = id;
							var flag = document.querySelector('.to-wechat-bgd')
							if(flag&&this.isSetCommission.click){
								let cookie = this.$getCookie('uInfo');
								let userId = cookie ? JSON.parse(cookie).userid  : '';
								shareUserId = userId;
							}
							let _link = shareUserId?window.location.origin+'/?wxshare=true&type=course&courseId='+courseId+'&shareUserId='+shareUserId:window.location.origin+'/?wxshare=true&type=course&courseId='+courseId;
							let _title = teacherName+':'+title
							let _desc = introduce;
							// let _link = window.location.href;
							var isFriendShareFlag = false;
							if(this.isInvitationSee.click&&flag){
								_link = this.friendShareData.link
								isFriendShareFlag = true;
							}
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
									title: _title,
									desc: _desc,
									link: _link,
									imgUrl: _imgUrl,
									type: '',
									dataUrl: '', 
									success:()=>{
										let query = {type:5}
										this.$http.post(this.$server.addIntegral,query).then(res=>{

										})
										if(isFriendShareFlag){
											this.friendShare()
										}
									}
								});
								wx.onMenuShareTimeline({
									title: _title, 
									link: _link, 
									imgUrl: _imgUrl,
									success:()=>{
										let query = {type:5}
										this.$http.post(this.$server.addIntegral,query).then(res=>{

										})
										if(isFriendShareFlag){
											this.friendShare()
										}
									},
								})
								wx.onMenuShareQQ({
									title: _title,
									desc: _desc,
									link: _link, 
									imgUrl: _imgUrl,
									success:()=>{
										let query = {type:5}
										this.$http.post(this.$server.addIntegral,query).then(res=>{

										})
										if(isFriendShareFlag){
											this.friendShare()
										}
									},
									cancel: function () {
									}
								});
							})
						}
					})
				}
			})
		}
	},
	beforeDestroy(){
		this.setKnowledgeIdInCourse('')
	}
}
</script>
<style lang="scss" scoped>
    .course-wrapper{
        position: relative;
        background: #F9F9FB;
		&.pd{
			padding-top:4.2rem;
		}
        .video-course-init{
            height: 4.2rem;
            width: 100%;
            position: relative;
            top: 0;
            left: 0;
            z-index: 3;
            background-size: 100% 100%;
            .course-img{
                width: 100%;
                height: 100%!important;
            }
            .player-area{
                width: 100%;
                height: 4.2rem;
                position: fixed;
                left: 50%;
				transform: translateX(-50%);
                top: 0;
                z-index: 3;
				max-width: 414px;
				&.is-qq{
					position: absolute!important;
					top:0!important;
				}
            }
            .player-btn{
                width: 100%;
                height: 100%;
                position: absolute;
                background-color: rgba(0, 0, 0, .45);
                left: 0;
                top: 0;
                z-index: 3;
                i{
                    display: block;
                    height: 0.72rem;
                    width: 0.72rem;
                    position: absolute;
                    top:50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
                &.play{
                    i{
                        background:  url('../../assets/image/player_btn.png')no-repeat 50% 50%/cover;
                    }
                }
                &.lock{
                    i{
                        background:  url('../../assets/image/player_lock.png')no-repeat 50% 50%/cover;
                    }
                }
            }
        }
		.course-audio-main{
			position: relative;
			width: 100%;
			height: 4.2rem;
			.course-img{
				width: 100%;
				height: 100%;
			}
			.audio-player-btns{
				position: absolute;
				top:0;
				left: 0;
				background: rgba(0,0,0,0.45);
				z-index: 2;
				width: 100%;
				height: 100%;
			}
			.audio-play-btn{
				position: absolute;
				top:40%!important;
				left:50%;
				height:1.04rem;
				width: 1.04rem;
				margin:-0.52rem 0 0 -0.52rem;
				.player-btn{
					display: block;
					width: 100%;
					height: 100%;
					&.play{
						background: url('../../assets/image/player_btn.png')no-repeat 50% 50%;
						background-size: cover;
					}
					&.pause{
						background: url('../../assets/image/pause.png')no-repeat 50% 50%;
						background-size: cover;
					}
				}
			}
			.audio-controls{
				position: absolute;
				width: 100%;
				height: 1rem;
				bottom:0;
				left: 0;
				.t{
					padding: 0.22rem 0;
					position: absolute;
					bottom:0.75rem;
					left: 0;
					width: 100%;
				}
				.process{
					width: 5.26rem;
					height: 2px;
					margin:0 auto;
					padding: 0 0.25rem;
					position: relative;
					background: #fff;
					&::before{
						position: absolute;
						content:'';
						width: 0.5rem;
						height: 2px;
						top:0;
						left: -0.25rem;
						display: block;
						background: #f4f4f4;
						z-index: 0;
					}
					&::after{
						position: absolute;
						content:'';
						width: 0.5rem;
						height: 2px;
						top:0;
						right: -0.25rem;
						display: block;
						background: #F4F4F4;
						z-index: 0;
					}
					.bar-btn{
						background: #B4272D;
						color:#fff;
						border-radius: 25px;
						position: relative;
						padding:0 4px;
						&.big{
							position: absolute;
							bottom:0.4rem;
							left: 0;
							padding:0.2rem;
							z-index: 3;
						}
					}
				}
				.prve{
					width: 0.48rem;
					height: 0.48rem;
					padding:0.12rem;
					position: absolute;
					top:0;
					left: 0.24rem;
					i{
						display: block;
						height: 100%;
						width: 100%;
						background: url('../../assets/image/prev.png')no-repeat 50% 50% / cover;
					}
				}
				.next{
					width: 0.48rem;
					height: 0.48rem;
					padding:0.12rem;
					position: absolute;
					top:0;
					right: 0.24rem;
					i{
						display: block;
						height: 100%;
						width: 100%;
						background: url('../../assets/image/next.png')no-repeat 50% 50% / cover;
					}
				}
				.b{
					position: absolute;
					bottom:0;
					left: 0;
					width: 100%;
					.duration{
						position: absolute;
						font-size: 0.24rem;
						color:#FFFFFF;
						left: 0.3rem;
						bottom:0.2rem;
					}
					.control-btns{
						position: absolute;
						right: 0.27rem;
						bottom:0.15rem;
						font-size: 0;
						.speed-area{
							height: 0.4rem;
							min-width: 0.44rem;
							display: inline-block;
							vertical-align: middle;
							position: relative;
							.cur-speed{
								color:#fff;
								font-size: 0.24rem;
								padding: 0 0.1rem;
								background: url('../../assets/image/cur-speed.png')no-repeat 50% 50%;
								background-size: 95% 110%;
								text-align: center;
								position: relative;
								height: 0.4rem;
								line-height: 0.4rem;
							}
							.list{
								position: absolute;
								right: 0.8rem;
								top:0;
								display: flex;
								transform-origin:right;
								transition: all 0.3s;
								.speed-item{
									&.normal{
										p{
											width: 0.7rem;
											text-align: center;
										}
									}
									&.active{
										p{
											color:#C30D23;
										}
									}
									p{
										padding: 0 0.05rem;
										font-size: 0.24rem;
										background:#2d2d2d;
										color:#fff;
										border-right: 1px solid #888888;
										line-height: 0.4rem;
									}
									&:last-child{
										p{
											border:none;
										}
									}
								}
								&.open{
									transform: scaleX(1);
								}
								&.close{
									transform: scaleX(0);
								}
							}
						}
						.details{
							margin-left: 0.1rem;
							display: inline-block;
							vertical-align: middle;
							display: none;
							i{
								width: 0.48rem;
								height: 0.48rem;
								display: block;
								// background: url('./assets/content.png')no-repeat 50% 50%/cover;
							}
						}
						.loop-btn{
							margin-left: 0.1rem;
							display: inline-block;
							vertical-align: middle;
							i{
								width: 0.48rem;
								height: 0.48rem;
								display: block;
								background: url('../../assets/image/no-loop.png')no-repeat 50% 50%/cover;
							}
							&.loop{
								i{
									background: url('../../assets/image/loop.png')no-repeat 50% 50%/cover;
								}
							}
						}
					}
				}
			}
		}
    }
	.course-time-tip{
		position: fixed;
		top:0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1111;
		background:rgba(0,0,0,0.7);
		.box{
			background: #fff;
			border-radius: 10px;
			width: 5.9rem;
			height: 3.1rem;
			padding:0.75rem 0;
			position: absolute;
			top:50%;
			left: 50%;
			text-align: center;
			transform: translate(-50%,-50%);
			p{
				color:#333333;
				font-size: 0.28rem;
				width: 3.4rem;
				display: inline-block;
			}
			.btn{
				background-image: linear-gradient(#E62F45, #D51F35, #C71227);
				width: 4rem;
				height: 0.8rem;
				line-height: 0.8rem;
				display: inline-block;
				border-radius: 25px;
				line-height: 0.8rem;
				color:#fff;
				font-size: 0.3rem;
				margin-top:0.5rem;
			}
			.close{
				color:#fff;
				position: absolute;
				right: 0;
				top:-0.6rem;
				font-size: 0.48rem;
			}
		}
	}
	.no-data-box{
		position: fixed;
		top:0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1111;
		background: #fff;
		padding: 1rem 0;
		text-align: center;
		.bgd{
			height: 1.8rem;
			width: 2.5rem;
			background: url('../../assets/image/xiajia.png')no-repeat 50% 50%/cover;
			display: inline-block;
		}
		.p1{
			font-size: 0.28rem;
			color:#bbb;
			margin-top:0.4rem;
		}
		.text-tips{
			padding-top:4.5rem;
			color:#fff;
			font-size: 0.36rem;
			text-align: center;
			background: rgba(0,0,0,0.3);
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.enter-in-enter-active, .enter-in-leave-active {
		margin-top:0;
		transition: all .3s;
	}
	.enter-in-enter, .enter-in-leave-to /* .fade-leave-active below version 2.1.8 */ {
		margin-top:100%;
		transition: all .3s;
	}
	.huawei-player{
		width: 100%;
		height: 4.2rem;
		border:none;
	}
	.copy-dialog{
		position: fixed;
		z-index: 101;
		top:0;
		left:0;
		width: 100%;
		height:100%;
		background: rgba(0,0,0,0.7);
		.box{
			position: absolute;
			width: 5.5rem;
			background: #fff;
			border-radius: 0.2rem;
			text-align: center;
			top:50%;
			left:50%;
			transform: translate(-50%,-50%);
			padding:0.5rem 0 0.3rem;
			.close-btn{
				position: absolute;
				top:-0.6rem;
				right:0;
				font-size: 0.48rem;
				color:#fff;
			}
			.text{
				color:#333333;
				font-size: 0.32rem;
			}
			.wx-number{
				color:#333333;
				font-size: 0.32rem;
				margin:0.1rem auto;
				width: 90%;
				word-break: break-all;
			}
			.tips{
				color:#999999;
				font-size: 0.24rem;
			}
			.btn{
				margin:0.18rem auto 0;
				display: block;
				width: 2.35rem;
				height: 0.66rem;
				border-radius: 0.4rem;
				background: #47C152;
				color:#fff;
				line-height: 0.66rem;
				font-size: 0.24rem;
			}
			.copy-btn{
				width: 1.3rem;
				height:0.48rem;
				line-height:calc(0.48rem - 2px);
				border-radius: 0.4rem;
				font-size: 0.22rem;
				border:1px solid #C30D23;
				color:#C30D23;
				margin:0.1rem auto;
				&.disabled{
					background: #dfdfdf;
					color:#fff;
					border-color:#dfdfdf;
				}
			}
			#input{
				position: absolute;
				top:-100rem;
				opacity: 0;
			}
		}
	}
</style>
