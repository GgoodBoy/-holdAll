<template>
	<div class="header-nav course-order">
		<div>
			<Header :name="'结算'"/>
			<div class="course-wrap">
				<div class="course-img">
					<img :src="courseData.courseSurfacePlot" alt="">
				</div>
				<div class="course-con">
					<p class="textEllipsis">{{courseData.courseTitle}}</p>
					<div>
						<span v-if="buyType==''">{{courseData.courseSellingPrice}}币</span>
						<span v-else>
							<span v-if="buyType==1">{{spikePrice}}币</span>
							<span v-else>{{assemblePrice}}币</span>
						</span>
					</div>
				</div>
			</div>
			<div class="coupon-wrap-bg" v-if="buyType==''">
				<div class="coupon-wrap-block" ref="tempBox" :class="showCourseCoupon&&courseData.userCouponsNum!=0?'open-switch':''">
					<div class="coupon-wrap">
						<div class="coupon">优惠券</div>
						<div class="coupon-num" @click="choiceCoupon">
							<span v-if="couponId==''" :class="courseData.userCouponsNum==0?'not-use':''">{{courseData.userCouponsNum==0?'无可用':`${courseData.userCouponsNum?'有'+courseData.userCouponsNum+'张可用':''}`}}</span>
							<span v-else class="has-coupon">-{{couponPrice}}</span>
							<van-icon v-if="courseData.userCouponsNum==0" name="arrow-down" class="icon not-use close"/>
							<van-icon name="arrow-down" class="icon" v-else :class="showCourseCoupon?'open':'close'"/>
						</div>
					</div>
					<CourseCoupon :couponId.sync="couponId" :couponPrice.sync="couponPrice" :showCourseCoupon.sync="showCourseCoupon" :courseId="courseId" v-if="courseData.userCouponsNum!=0"></CourseCoupon>
				</div>
				<div class="discount-block" v-if="courseData.reducePrice&&courseData.reducePrice>0">	
					<div class="discount">
						<div class="coupon">减价</div>
						<div class="coupon-num">
							<span>{{courseData.reducePrice}}元</span>
						</div>
					</div>
				</div>
				<!-- <div class="reward-points-block" v-if="courseData.isEnable>0&&rewardPointsShow">
					<div class="reward-points-wrap" :class="swircgChecked&&rewardPointsCur>0?'open-switch':''">
						<div class="reward-points-container" >
							<p class="label">积分</p>
							<p class="des">共有{{courseData.availableNum}}积分，可用{{usablePoints}}积分，抵¥{{usablePoints/courseData.proportion}}</p>
							<div class="handle">
								<van-icon name="fail" class="reward-points-btn" @click="ruleFlag=true"/>
								<van-switch
									v-if="usablePoints>0"
									v-model="swircgChecked"
									active-color="#3CBB39"
									inactive-color="#E0E0E0"
									size="0.48rem"
									class="my-switch"
									/>
							</div>
						</div>
						<div class="reward-points-choose clearfix" v-if="rewardPointsCur>0">
							<p class="label">使用</p>
							<div class="des">
								<div class="reward-points-list">
									<p class="cur item" @click="openList($event)">{{rewardPointsCur}}</p>
									<i class="select_icon"></i>
									<div class="list-box" :class="rewardPointsListFlag?'open':''">
										<div class="list-box-c">
											<p class="item" v-for="(item,index) in rewardPointsList" :key="index" @click="choosePoints(item)">{{item}}</p>
										</div>
									</div>
									<p class="text">积分，<span>抵¥{{rewardPointsCur/courseData.proportion}}.00</span></p>
								</div>
							</div>
						</div>
					</div>	
				</div>	 -->
			</div>
			<div class="pay-way-wrap">
				<div class="pay-way">
					支付方式
				</div>
				<ul class="pay-way-list">
					<van-radio-group v-model="payWay" :max="1">
						<li @click="choicePayWay('balance')">
							<div>
								<img class="pay-way-img balance-icon" :src="img1" alt="">
								<span class="balance">余额</span>
								<span class="fzb-num">{{courseData.coinBalance}}币{{isAmple?'(余额不足)':''}}</span>
							</div>
							<div>
								<!-- <span class="recharge" @click="goRecharge" v-if="isAmple">去充值</span> -->
								<van-radio ref="radio" name="balance" class="radio"/>
							</div>
						</li>
						<li @click="choicePayWay('wechat')">
							<div>
								<img class="pay-way-img" :src="img2" alt="">
								<span class="balance">微信支付</span>
							</div>
							<div>
								<van-radio ref="radio" name="wechat" class="radio"/>
							</div>
						</li>
						<li v-if="supportAli" @click="choicePayWay('ali')">
							<div>
								<img class="pay-way-img" :src="img3" alt="">
								<span class="balance">支付宝支付</span>
							</div>
							<div>
								<van-radio ref="radio" name="ali" class="radio"/>
							</div>
						</li>
					</van-radio-group>
				</ul>
			</div>
			<div class="pay-tip c9a">
				<p>• 您购买的商品为虚拟内容服务，购买后不支持退单、转让、退换等，请斟酌确认。</p>
				<p>• 购买后可在<span class="app-text" @click="goDownload">学国学网APP</span>内“已购”查看和学习。</p>
			</div>
			<div class="sure-pay" @click="pay" >
				<div v-if="buyType!=''">
					<div v-if="buyType==1">
						<span v-if="payWay=='balance'">{{spikePrice>0?(spikePrice<=0.01?0.01:spikePrice):0}}币／确认支付</span>
						<span v-else>￥{{spikePrice>0?(spikePrice<=0.01?0.01:spikePrice):0}}／确认支付</span>
					</div>
					<div v-else>
						<span v-if="payWay=='balance'">{{assemblePrice>0?(assemblePrice<=0.01?0.01:assemblePrice):0}}币／确认支付</span>
						<span v-else>￥{{assemblePrice>0?(assemblePrice<=0.01?0.01:assemblePrice):0}}／确认支付</span>
					</div>
				</div>
				<div v-else>
					<span v-if="payWay=='balance'">{{price>0?(price<=0.01?0.01:price):0}}币／确认支付</span>
					<span v-else>￥{{price>0?(price<=0.01?0.01:price):0}}／确认支付</span>
				</div>
			</div>
		</div>
		<transition name="my-fade">
			<div class="rule-wrap" v-if="ruleFlag">
				<div class="rule-box">
					<p class="t">积分抵押规则</p>
					<div class="block">
						<p>使用条件</p>
						<p>积分数量大于{{courseData.proportion}}</p>
						<p>积分抵扣只能是{{courseData.proportion}}的整数倍</p>
						<p>积分抵扣比例是{{courseData.proportion}}积分抵1元</p>
						<p>积分抵扣最多不超过每笔订单支付金额的50%</p>
						<p>订单使用积分抵扣后，如未支付成功或支付取消，抵扣积分将锁定30分钟，30分钟后退回当前积分账户</p>
						<p class="rule-belong-to">积分抵扣规则最终归解释权归学国学网所有</p>
						<a @click="ruleFlag=false">我知道了</a>
					</div>
				</div>
			</div>
		</transition>
		
	</div>
</template>

<script>
import img1 from '../../assets/image/balance-pay.png'
import img2 from '../../assets/image/weixin.png'
import img3 from '../../assets/image/zhifubao.png'
import Header from '@/components/Header.vue'
import {mapState,mapActions} from 'vuex'
import CourseCoupon from "./courseCoupon.vue"
// import returnCitySN from 'returnCitySN' 
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
export default {
	data(){
		return {
			img1:img1,
			img2:img2,
			img3:img3,
			payWay:'wechat',
			couponId:'',
			showCourseCoupon:true,
			courseData:{

			},
			isAmple:'',
			supportAli:true,
			courseId:'',
			couponPrice:0,
			price:'',
			wechatType:false,
			next:false,
			styleTop:0,
			swircgChecked:false,
			ruleFlag:false,
			rewardPointsListFlag:false,
			rewardPointsList:[],
			rewardPointsCur:'',
			usablePoints:'',
			rewardPointsShow:true,
			buyType:'',
			assembleType:'',
			assembleId:'',
			assemblePrice:'',
			joinAssembleRecordId:''
		}
	},
	computed:{
		...mapState(['hasOpenApp','audioData','shareUserData']),
	},
	created(){
		if(!localStorage.getItem('aboutCourse')){
			this.next = true;
			this.$router.go(-1)
			setTimeout(()=>{
				this.$router.replace('/')
			},1)
			return false;
		}
		if(this.$route.query&&this.$route.query.buyType){
			this.buyType = this.$route.query.buyType||'';
			this.assembleType = this.$route.query.assembleType||'';
			this.assembleId = this.$route.query.assembleId||'';
			this.assemblePrice = Number(this.$route.query.assemblePrice)||'';
			this.joinAssembleRecordId = this.$route.query.joinAssembleRecordId||'';
			this.spikePrice = Number(this.$route.query.spikePrice)||''

		}
		this.init()
		this.getOrderForCourseInfo()
		this.courseId = this.$route.params.courseId
		let audioData = Object.assign({},this.audioData,{bottom:'1rem'})
		this.setAudioData(audioData)
	},
	watch:{
		showCourseCoupon(cur,old){
			if(cur){
				let audioData = Object.assign({},this.audioData,{bottom:'8px'})
				this.setAudioData(audioData)
			}else{
				let audioData = Object.assign({},this.audioData,{bottom:'1rem'})
				this.setAudioData(audioData)
			}
		},
		swircgChecked(cur,old){
			if(cur){
				this.price = Math.round(this.price*100 - this.rewardPointsCur/this.courseData.proportion*100)/100
			}else{
				this.price = Math.round(this.price*100 + this.rewardPointsCur/this.courseData.proportion*100)/100
			}
		},
		couponPrice(now,old){
			if(now==0){
				if(this.courseData.reducePrice>0){
					this.price = (this.courseData.courseSellingPrice*1000 - this.courseData.reducePrice*1000)/1000;
				}
				else{
					this.price = this.courseData.courseSellingPrice
				}
			}else{
				if(this.courseData.reducePrice>0){
					let temp = this.price = (this.courseData.courseSellingPrice*1000 - this.courseData.reducePrice*1000)/1000;
					this.price = (temp*1000-Number(now)*1000)/1000
				}
				else{
					this.price = (this.courseData.courseSellingPrice*1000-Number(now)*1000)/1000
				}
			}
			this.isAmple = this.courseData.coinBalance<this.price?true:false;
			let pointsTemp = parseInt(this.courseData.availableNum/this.courseData.proportion);
			let priceTemp = Math.floor(this.price/2);
			if(priceTemp<0){
				this.rewardPointsShow = false;
			}else{
				this.rewardPointsShow = true;
				let usablePoints = pointsTemp>=priceTemp?priceTemp*this.courseData.proportion:pointsTemp*this.courseData.proportion;
				this.usablePoints = usablePoints;
				let rewardPointsList = [ ];
				let length = parseInt(usablePoints/this.courseData.proportion);
				for(let i = 1;i<=length;i++){
					rewardPointsList.push(i*this.courseData.proportion)
				}
				this.rewardPointsList = rewardPointsList.reverse();
				let index = rewardPointsList.findIndex(item=>item==this.rewardPointsCur)
				if(index<0){
					this.rewardPointsCur = rewardPointsList[0]||0;
				}
				if(this.swircgChecked)
					this.price = Math.round(this.price*100 - this.rewardPointsCur/this.courseData.proportion*100)/100
			}		
		}
	},
	beforeRouteLeave (to, from, next){
		if(this.next){
			next();
			return;
		}
		let path = this.$route.fullPath;
		this.$dialog.confirm({
			message: '您确定不购买了吗？',
			confirmButtonColor:"#D40015"
		}).then(() => {
			let aboutCourse = localStorage.getItem('aboutCourse')
			if(aboutCourse){
				localStorage.removeItem('aboutCourse')	
				next()
			}
		}).catch(() => {
			window.location.hash = path
		});			
	},
	methods:{
		...mapActions(['setAudioData','setAssembleBoughtData']),
		onClickLeft(){
			if(window.history.length==1){
				this.$router.replace('/')
			}else{
				this.$router.go(-1)
			}
		},
		choicePayWay(way){
			this.payWay = way;
		},
		/**
		 * 去夫子币充值界面充值
		 */
		goRecharge(){
			this.next = true;
			sessionStorage.setItem('buyToAccount',this.$route.fullPath)
			this.$router.push("/user/account");
		},
		/**
		 * 选择优惠券
		 */
		choiceCoupon(){
			if(this.courseData.userCouponsNum==0){
				return false;
			}
			this.showCourseCoupon = !this.showCourseCoupon;
		},
		getOrderForCourseInfo(){
			let courseId = this.$route.params.courseId;
			let query = {
				courseId
			}
			this.$http.post(this.$server.getOrderForCourseInfo,query).then(res=>{
				if(res.data.status == 200){
					this.courseData = res.data.content;
					if(this.courseData.reducePrice>0){
						let temp = (this.courseData.courseSellingPrice*1000 - this.courseData.reducePrice*1000)/1000;
						this.price = Math.round(temp*100)/100;
					}
					else{
						this.price = res.data.content.courseSellingPrice;
					}
					this.isAmple = res.data.content.coinBalance<this.price?true:false
					if(this.$route.query.spikePrice||this.$route.query.assemblePrice){
						let tempPrice = this.$route.query.spikePrice||this.$route.query.assemblePrice;
						this.isAmple = res.data.content.coinBalance<tempPrice?true:false
					}
					if(res.data.content.availableNum>=res.data.content.proportion){
						let pointsTemp = parseInt(res.data.content.availableNum/res.data.content.proportion);
						let priceTemp = Math.floor(this.price/2);
						let usablePoints = pointsTemp>=priceTemp?priceTemp*res.data.content.proportion:pointsTemp*res.data.content.proportion;
						this.usablePoints = usablePoints;
						let rewardPointsList = [ ];
						let length = parseInt(usablePoints/res.data.content.proportion);
						for(let i = 1;i<=length;i++){
							rewardPointsList.push(i*res.data.content.proportion)
						}
						this.rewardPointsList = rewardPointsList.reverse();
						this.rewardPointsCur = rewardPointsList[0];
					}else{
						this.usablePoints = 0;
						this.rewardPointsCur = 0;
					}
				}
			})
		},
		pay(){
			if(this.payWay==''){
				this.$toast('请选择支付方式！');
				return false;
			}
			let query = {
				courseId:this.$route.params.courseId,
			}
			if(this.couponId!=''){
				query.userCouponsId = this.couponId
			}
			if(this.shareUserData.status && this.shareUserData.shareUserId){
				query.shareUserId = this.shareUserData.shareUserId;
			}
			let invitationSharePeriodId = sessionStorage.getItem('invitationSharePeriodId');
			if(invitationSharePeriodId){
				let invitationSharerId = sessionStorage.getItem('invitationSharerId');
				query.invitationSharePeriodId = invitationSharePeriodId;
				query.invitationSharerId = invitationSharerId;
			}
			query.integralNum = this.rewardPointsCur>0&&this.swircgChecked&&this.courseData.isEnable>0&&this.rewardPointsShow?this.rewardPointsCur:0;
			if(this.buyType!=''){
				query.buyType = String(this.buyType);
				if(this.assembleType){
					query.assembleType = String(this.assembleType);
				}
			}
			if(this.joinAssembleRecordId!=''){
				query.joinAssembleRecordId = Number(this.joinAssembleRecordId)
			}
			if(this.payWay == 'balance'){
				if(this.isAmple){
					this.$dialog.alert({
						message:'余额不足，请充值'
					}).then(res=>{
						
					})
					return false;
				}
				let shareType = getQueryString('shareType')
				if(shareType&&shareType=='normal'){
					query.courseShareUserId = getQueryString('shareUserId');
					query.shareCourseId = getQueryString('courseId');
					query.source = getQueryString('source')
				}
				let channelId = getQueryString('channelId')
				if(channelId){
					query.channelId = Number(channelId)
					query.activityName = getQueryString('activityName');
					query.shareUserId = getQueryString('activityShareUserId');
				}
				query.paymentType = 1;
				const toast = this.$toast.loading({
					duration: 2000,
					forbidClick: true
				});
				this.$http.post(this.$server.buyCourse,query).then(res=>{
					this.$toast.clear()
					if(res.data.status == 200){
						this.next = true;
						let aboutCourse = localStorage.getItem('aboutCourse')
						if(aboutCourse){
							localStorage.removeItem('aboutCourse')
						}
						if(this.buyType&&this.buyType==2){
							this.setAssembleBoughtData({
								assembleType:this.assembleType,
								assembleSuccess:1,
								assembleContiTime:res.data.content.assembleContiTime,
								assemblePeopleList:res.data.content.assemblePeopleList||[],
								courseId:this.$route.params.courseId,
								serviceTime:res.data.content.serviceTime||'',
								assembleRecordId:res.data.content.assembleRecordId||'',
							})
							this.$router.replace({path:`/assemble/openAssemble/${this.assembleId}`})
						}else{
							let query = {
								paymentTypeName:'夫子币',
								orderId:res.data.content.orderId,
								realPayPrice:res.data.content.realPayPrice,
								reducedPrice:res.data.content.reducedPrice||'',
								reducePrice:this.courseData.reducePrice||'',
								integralDeductionPrice:res.data.content.integralDeductionPrice||'',
								showSharePoster:res.data.content.showSharePoster||'',
								showSharePosterPrice:res.data.content.showSharePosterPrice||''
							}
							localStorage.setItem('orderSuccess',JSON.stringify(query))
							this.$router.replace({path:`/course/order/Success/${this.courseId}`,query})
						}
					}else{
						if(res.data.message.includes('已购买')){
							this.setAssembleBoughtData({})
							this.next = true;
							setTimeout(()=>{
								this.$router.replace('/bought')
							},2000)
						}
					}
				})
				return false;
			}else if(this.payWay=='wechat'){//外部浏览器发起微信请求
				query.paymentType = 2
				query.returnUrl = encodeURIComponent(window.location.href)
				// query.orderIp = returnCitySN.cip
				if (typeof WeixinJSBridge == "undefined"){
					let shareType = getQueryString('shareType')
					if(shareType&&shareType=='normal'){
						query.courseShareUserId = getQueryString('shareUserId');
						query.shareCourseId = getQueryString('courseId');
						query.source = getQueryString('source')
					}
					let channelId = getQueryString('channelId')
					if(channelId){
						query.channelId = Number(channelId)
						query.activityName = getQueryString('activityName');
						query.shareUserId = getQueryString('activityShareUserId');
					}
					const toast = this.$toast.loading({
						duration: 2000,
						forbidClick: true
					});
					this.$http.post(this.$server.buyCourse,query).then(res=>{
						this.$toast.clear()
						if(res.data.status == 200){
							this.next = true;
							if(this.buyType&&this.buyType==2){
								let data = {
									assembleType:this.assembleType,
									assembleSuccess:0,
									assembleContiTime:res.data.content.assembleContiTime,
									assemblePeopleList:res.data.content.assemblePeopleList||[],
									courseId:this.$route.params.courseId,
									serviceTime:res.data.content.serviceTime||'',
									assembleRecordId:res.data.content.assembleRecordId||'',
									assembleId:this.assembleId
								}
								localStorage.setItem('assembleBoughtData',JSON.stringify(data))
							}else{
								let query = {
									paymentTypeName:'微信',
									orderId:res.data.content.orderId,
									realPayPrice:res.data.content.realPayPrice,
									reducedPrice:res.data.content.reducedPrice||'',
									reducePrice:this.courseData.reducePrice||'',
									integralDeductionPrice:res.data.content.integralDeductionPrice||'',
									showSharePoster:res.data.content.showSharePoster||'',
									showSharePosterPrice:res.data.content.showSharePosterPrice||''
								}
								let realPayPrice = res.data.content.realPayPrice;
								if(realPayPrice<=0){
									let aboutCourse = localStorage.getItem('aboutCourse')
									if(aboutCourse){
										localStorage.removeItem('aboutCourse')
									}
									query.realPayPrice = 0;
									this.$router.replace({path:`/course/order/Success/${this.courseId}`,query})
									return false;
								}
								localStorage.setItem('orderSuccess',JSON.stringify(query))
							}
							localStorage.setItem("courseWechatType","true")
							localStorage.setItem('courseOrderId',res.data.content.wechatInfo.outTradeNo)
							window.location.href = res.data.content.wechatInfo.mweb_url;
						}else{
							if(res.data.message.includes('已购买')){
								this.next = true;
								setTimeout(()=>{
									this.$router.replace('/bought')
								},2000)
							}
						}
					})
				}else{
					var time = null;
					const toast = this.$toast.loading({
						duration: 2000,
						forbidClick: true
					});
					time = setInterval(()=>{
						let openId = localStorage.getItem('openId')
						if(openId&&openId!=''){
							query.openId = openId;
							query.paymentType = 5;
							let shareType = getQueryString('shareType')
							if(shareType&&shareType=='normal'){
								query.courseShareUserId = getQueryString('shareUserId');
								query.shareCourseId = getQueryString('courseId');
								query.source = getQueryString('source')
							}
							let channelId = getQueryString('channelId')
							if(channelId){
								query.channelId = Number(channelId)
								query.activityName = getQueryString('activityName');
								query.shareUserId = getQueryString('activityShareUserId');
							}
							this.$http.post(this.$server.buyCourse,query).then(res=>{
								if(res.data.status == 200){
									this.next = true;
									if(this.buyType&&this.buyType==2){
										let assembleBoughtData = {
											assembleType:this.assembleType,
											assembleSuccess:0,
											assembleContiTime:res.data.content.assembleContiTime,
											assemblePeopleList:res.data.content.assemblePeopleList||[],
											courseId:this.$route.params.courseId,
											serviceTime:res.data.content.serviceTime||'',
											assembleRecordId:res.data.content.assembleRecordId||'',
										}
										this.onBridgeReady(res.data.content.wechatInfo,assembleBoughtData);
									}else{
										let query = {
											paymentTypeName:'微信',
											orderId:res.data.content.orderId,
											realPayPrice:res.data.content.realPayPrice,
											reducedPrice:res.data.content.reducedPrice||'',
											reducePrice:this.courseData.reducePrice||'',
											integralDeductionPrice:res.data.content.integralDeductionPrice||'',
											showSharePoster:res.data.content.showSharePoster||'',
											showSharePosterPrice:res.data.content.showSharePosterPrice||''
										}
										let realPayPrice = res.data.content.realPayPrice;
										if(realPayPrice<=0){
											let aboutCourse = localStorage.getItem('aboutCourse')
											if(aboutCourse){
												localStorage.removeItem('aboutCourse')
											}
											query.realPayPrice = 0
											this.$router.replace({path:`/course/order/Success/${this.courseId}`,query})
											return false;
										}
										this.onBridgeReady(res.data.content.wechatInfo,query);
									}
								}else{
									if(res.data.message.includes('已购买')){
										this.$router.replace('/bought')
									}
								}
							})
							clearInterval(time);
						}
						else{
							this.$toast('当前环境不支持公众号支付，请检查微信配置')
							clearInterval(time);
						}
					},1000)
				}
				return false;
			}else{
				query.paymentType = 3;
				query.returnUrl = window.location.origin+'?type=2&courseId='+this.$route.params.courseId;
				if(this.buyType&&this.buyType==2){
					query.returnUrl = window.location.origin+'?type=2&assembleId='+this.assembleId;
				}
				let shareType = getQueryString('shareType')
				if(shareType&&shareType=='normal'){
					query.courseShareUserId = getQueryString('shareUserId');
					query.shareCourseId = getQueryString('courseId');
					query.source = getQueryString('source')
				}
				let channelId = getQueryString('channelId')
				if(channelId){
					query.channelId = Number(channelId)
					query.activityName = getQueryString('activityName')
					query.shareUserId = getQueryString('activityShareUserId');
				}
				const toast = this.$toast.loading({
					duration: 2000,
					forbidClick: true
				});
				this.$http.post(this.$server.buyCourse,query).then(res=>{
					this.$toast.clear()
					if(res.data.status == 200){
						this.next = true;
						if(this.buyType&&this.buyType==2){
							let data = {
								assembleType:this.assembleType,
								assembleSuccess:0,
								assembleContiTime:res.data.content.assembleContiTime,
								assemblePeopleList:res.data.content.assemblePeopleList||[],
								courseId:this.$route.params.courseId,
								serviceTime:res.data.content.serviceTime||'',
								assembleRecordId:res.data.content.assembleRecordId||''
							}
							localStorage.setItem('assembleBoughtData',JSON.stringify(data))
						}else{
							let query = {
								paymentTypeName:'支付宝',
								orderId:res.data.content.orderId,
								realPayPrice:res.data.content.realPayPrice,
								reducedPrice:res.data.content.reducedPrice||'',
								reducePrice:this.courseData.reducePrice||'',
								integralDeductionPrice:res.data.content.integralDeductionPrice||'',
								showSharePoster:res.data.content.showSharePoster||'',
								showSharePosterPrice:res.data.content.showSharePosterPrice||''
							}
							let realPayPrice = res.data.content.realPayPrice;
							if(realPayPrice<=0){
								let aboutCourse = localStorage.getItem('aboutCourse')
								if(aboutCourse){
									localStorage.removeItem('aboutCourse')
								}
								query.realPayPrice = 0
								this.$router.replace({path:`/course/order/Success/${this.courseId}`,query})
								return false;
							}
							localStorage.setItem('orderSuccess',JSON.stringify(query))
						}
						let url = `https://openapi.alipay.com/gateway.do?${res.data.content.alipayInfo}`
						window.location.replace(url)
					}else{
						if(res.data.message.includes('已购买')){
							this.next = true;
							setTimeout(()=>{
								this.$router.replace('/bought')
							},2000)
						}
					}
				})
			}
		},
		onBridgeReady(data,orderInfo){
			let json = {
				"appId":data['appid'],     //公众号名称，由商户传入
				"timeStamp":data['timestamp'],         //时间戳，自1970年以来的秒数
				"nonceStr":data['nonce_str'], //随机串
				"package":'prepay_id'+'='+data['prepay_id'],
				"signType":data['sign_type'],         //微信签名方式：
				"paySign":data['sign'] //微信签名
			}
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', {
					"appId":data['appid'],     //公众号名称，由商户传入
					"timeStamp":data['timestamp'],         //时间戳，自1970年以来的秒数
					"nonceStr":data['nonce_str'], //随机串
					"package":'prepay_id'+'='+data['prepay_id'],
					"signType":data['sign_type'],         //微信签名方式：
					"paySign":data['sign'] //微信签名
				},
				(res)=>{
					if(res.err_msg == "get_brand_wcpay_request:ok" ) {
						this.next = true;
						let aboutCourse = localStorage.getItem('aboutCourse')
						if(aboutCourse){
							localStorage.removeItem('aboutCourse')
						}
						if(this.buyType&&this.buyType==2){
							let assembleBoughtData = orderInfo;
							assembleBoughtData.assembleSuccess = 1;
							this.setAssembleBoughtData(assembleBoughtData);
							this.$router.replace({path:`/assemble/openAssemble/${this.assembleId}`})
						}else{
							let query = orderInfo;
							this.$router.replace({path:`/course/order/Success/${this.courseId}`,query})	
						}
					}     
				}
			);
		},
		init(){
			var ua = window.navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
				this.supportAli = false;
			}else{
				let wechatType = localStorage.getItem("courseWechatType")
				if(wechatType){
					this.$dialog.confirm({
						title:'提示',
						message: "请确认微信支付是否已完成?",
						confirmButtonColor:"#D40015",
						confirmButtonText:'已完成支付',
						cancelButtonText:'关闭'
					}).then(() => {
						this.checkOrder();
					}).catch(() => {
						this.checkOrder();
					});
				}
			}
		},
		/**
		 * 检查微信支付订单
		 */
		checkOrder(){
			if(!localStorage.getItem('aboutCourse')){
				this.next = true;
				this.$router.replace('/')
				return false;
			}
			let orderId = localStorage.getItem("courseOrderId");
			if(orderId){
				localStorage.removeItem("courseWechatType");
				localStorage.removeItem("courseOrderId");
				this.next = true;
				let query = {
					outTradeNo:orderId,
					paymentType:2
				}
				this.$http.post(this.$server.checkOrder,query).then(res=>{					
					if(res.data.status==200){
						let orderSuccess = localStorage.getItem('orderSuccess');
						let assembleBoughtData = localStorage.getItem('assembleBoughtData');
						let aboutCourse = localStorage.getItem('aboutCourse');
						if(aboutCourse){
							localStorage.removeItem('aboutCourse');
						}
						if(orderSuccess){
							orderSuccess = JSON.parse(orderSuccess);
							localStorage.removeItem('orderSuccess');
							this.$router.replace({path:`/course/order/Success/${this.courseId}`,query:orderSuccess})
						}else if(assembleBoughtData){
							assembleBoughtData = JSON.parse(assembleBoughtData);
							assembleBoughtData.assembleSuccess = 1;
							localStorage.setItem('assembleBoughtData',JSON.stringify(assembleBoughtData))
							sessionStorage.setItem('wechatH5',true)
							this.$router.replace({path:`/assemble/openAssemble/${assembleBoughtData.assembleId}`})	
						}
					}
				})
			}
		},
		openList(e){
			e.stopPropagation()
			this.rewardPointsListFlag = !this.rewardPointsListFlag;
		},
		choosePoints(obj){
			let temp = Math.round(this.price*100 + this.rewardPointsCur/this.courseData.proportion*100)/100;
			this.rewardPointsCur = obj;
			this.price = Math.round(temp*100-obj/this.courseData.proportion*100)/100
			this.rewardPointsListFlag = false
		},
		goDownload(){
			window.location.href = `${this.$server.downLoad}`;
		}
	},
	components:{
		Header,
		CourseCoupon
	}
}

</script>

<style lang="scss">
	.van-radio .van-icon-checked{
		color:#04be02;
	}
	::-webkit-scrollbar {/*隐藏滚轮*/
			display: none;
	}
	::-webkit-scrollbar{width:0;height:1px}
	.header-nav {
		.van-hairline--bottom::after{
			width: 0;
		}
		.van-nav-bar__title{
			font: normal .32rem/.88rem "";
		}
	}
	.course-order .van-radio__input{
		font-size: 0.4rem;
	}
</style>

<style lang="scss" scoped>
.go-back{
	width: .5rem;
	height: .5rem;
	vertical-align: middle;
}
.course-wrap{
	padding: .2rem;
	display: flex;
	.course-img{
		width: 2.63rem;
		height: 1.6rem;
		border-radius:5px;
		overflow: hidden;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.course-con{
		margin-left: .2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: calc(100% - 2.63rem);
		p{
			font-size: .28rem;
			color: #1A1A1A;
		}
		div{
			font-size: .24rem;
			span{
				color: #B4272D;
				font-size: .24rem;
			}
		}
	}
}
.coupon-wrap-bg{
	background: #F9F9FB;
	padding-bottom: .1rem;
	.icon{
		position: relative;
		top:0.08rem;
		right: 0;
		transition: all 0.3s;
		&.close{
			transform-origin: center;
			transform:rotate(-90deg);
		}
	}
}
.discount{	
	.coupon-num{
		span{
			margin-right:0.1rem;
			color:#C52D3B;
		}
	}
}
.coupon-wrap-block,.discount-block,.reward-points-block{
	padding:0 0.2rem;
	background: #fff;
	position: relative;
}
.reward-points-wrap{
	padding: 0 .1rem;
	border-top:1px solid #f2f2f2;
	// overflow: hidden;
	background:#fff;
	height: 1rem;
	transition:all 0.3s;
	position: relative;
	&.open-switch{
		height: 2rem;
		.reward-points-choose{
			height: 1rem;
			visibility: visible;
			opacity: 1;
			transition:all 0.3s;
		}
	}
	.reward-points-container{
		position: absolute;
		left: 50%;
		top:0.6rem;
		transform:translate(-50%,-50%);
		padding:0 0.1rem;
		width: 100%;
		z-index: 2;
		background:#fff;
		display:flex;
		align-items:baseline;
		justify-content:space-between;
		transition:none!important;
		.label{
			color: #333333;
			width: 0.96rem;
			height: 0.38rem;
			text-align: justify;
			text-align-last: justify;
			font-size:0.28rem;
			margin-right:0.1rem;
			&::after{
				content:"";
				display:inline-block;
				width:100%;
				height: 0;
				visibility: hidden;
			}
		}
		.des{
			color:#CCCCCC;
			font-size:0.25rem;
			width: 4.2rem;
		}
		.handle{
			font-size:0px;
			position: relative;
			top:-0.1rem;
			.reward-points-btn{
				font-size: 0.32rem;
				background: #C3C3C3;
				border-radius: 50%;
				color: #fff;
				padding: 1px;
				vertical-align:middle;
				margin-right:0.05rem;
			}
			.my-switch{
				vertical-align:middle;
				margin-left:0.05rem;
			}
		}
	}
	.reward-points-choose{
		background:#F1F1F1;
		position: absolute;
		z-index: 1;
		width: calc(100% + 0.6rem);
		left: -0.3rem;
		top:1rem;
		padding:0 0.4rem;
		height: 0;
		opacity: 0;
		transition:opacity 1ms ease,height 0.3s linear;
		visibility: hidden;
		.label{
			line-height: 1rem;
			height: 1rem;
			color: #333333;
			width: 0.96rem;
			text-align: justify;
			text-align-last: justify;
			float: left;
			font-size:0.28rem;
			margin-right:0.2rem;
			&::after{
				content:"";
				display:inline-block;
				width:100%;
				height: 0;
				visibility: hidden;
			}
		}
		.des{
			float: left;
			color:#CCCCCC;
			line-height: 1rem;
			font-size:0.28rem;
			.reward-points-list{
				position: relative;
				.select_icon{
					position:absolute;
					left:1.7rem;
					top:0.4rem;
					width: 0.16rem;
					height: 0.24rem;
					// background:url('../../assets/select_icon.png')no-repeat 50% 50%;
					background-size:cover;
					z-index: 4;
				}
				p{
					&.text{
						display: inline-block;
						vertical-align:middle;
					}
					span{
						color:#FC0025;
					}
				}
				.list-box{
					position: absolute;
					top:0.9rem;
					left: 0;
					width: 2rem;
					border-radius:4px;
					z-index: 1;
					box-shadow: 0 0 0.1rem #dfdfdf;
					background:#fff;
					overflow: hidden;
					transition:all 0.3s;
					transform-origin:top;
					transform:scaleY(0);
					visibility: hidden;
					&.open{
						transform:scaleY(1);
						visibility: visible;
					}
					.list-box-c{
						height: 100%;
						overflow: auto;
						max-height: 3.4rem;
						width: calc(100% + 10px);
						-webkit-overflow-scrolling: touch;
					}
				}
				.item{
					width: 2rem;
					height: 0.68rem;
					line-height:0.68rem;
					font-size:0.28rem;
					color:#ccc;
					text-align:center;
					background:#fff;
					border-radius:4px;
					&.cur{
						// border:1px solid #F2F2F2;
						position: relative;
						z-index: 3;
						display: inline-block;
						vertical-align:middle;
						
					}
				}
			}
		}
	}	
}
.coupon-wrap-block{
	height: 1rem;
	transition: all 0.3s;
	&.open-switch{
		height: 2.5rem;
		.coupon-wrap{
			border-bottom:1px solid #f2f2f2;
		}
	}
}
.coupon-wrap,.discount{
	padding: 0 .1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 1rem;
	border-top:1px solid #f2f2f2;
	position: relative;
	z-index: 2;
	.coupon{
		font-size: .28rem;
		color: #333333;
		width: 0.96rem;
		text-align: justify;
		text-align-last: justify;
		height: 0.38rem;
		&::after{
			content:"";
			display:inline-block;
			width:100%;
			height: 0;
			visibility: hidden;
		}
	}
	.coupon-num{
		color:#C30D23;
		font-size: .28rem;
		.not-use{
			color:rgb(195, 195, 195);
		}
		span{
			display: inline-block;
			vertical-align: middle;
		}
		img{
			display: inline-block;
			vertical-align: middle;
			width: .35rem;
			height: .35rem;
			margin-top:0.05rem;
		}
	}
}
.pay-way-wrap{
	padding: 0 .2rem;
	.pay-way{
		padding-left: .1rem;
		line-height: 1rem;
		font-size: .3rem;
		color: #333;
		border-bottom: 1px solid #F9F9FB;
	}
	.pay-way-list{
		li{
			padding: 0 .1rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #F9F9FB;
			.pay-way-img{
				width: .48rem;
				height: .48rem;
				vertical-align: middle;
				margin-right: 0.12rem;
				&.balance-icon{
					width: .6rem;
					height: .6rem;
					margin-right:0;
				}
			}
			.balance{
				color: #333333;
				font-size: .28rem;
				margin-right: .15rem;
				vertical-align: middle;
				display: inline-block;
				line-height: 1rem;
			}
			.fzb-num{
				display: inline-block;
				vertical-align: middle;
				color: #B4272D;
				font-size: .28rem;
				line-height: 1rem;
			}
			.recharge{
				width: 1rem;
				height: .6rem;
				vertical-align: middle;
				display: inline-block;
				color: #B4272D;
				line-height: .6rem;
				margin-right: .1rem;
				text-align: center;
				font-size: .28rem;
			}
			.radio{
				display: inline-block;
				vertical-align: middle;
				width: .4rem;
				height: .4rem;
				background: url('../../assets/image/no_selected.png') no-repeat 50% 50% / cover;
				/deep/ .van-radio__icon--checked{
					background: url('../../assets/image/selected.png') no-repeat 50% 50% / cover;
					width: .4rem;
					height: .4rem;
					i{
						display: none;
					}
				}
			}

		}
	}
}
.pay-tip{
	padding:0.3rem 0.4rem 1.3rem;
	p{
		font: .24rem/.48rem "";
	}
	.app-text{
		text-decoration: underline;
	}
}
.sure-pay{
	position: fixed;
	left: 50%;
	bottom: 0;
	width: 100%;
	max-width: 414px;
	transform: translateX(-50%);
	height: .88rem;
	color: #fff;
	line-height: .88rem;
	text-align: center;
	font-size: .32rem;
	background: #C52D3B;
}
.rule-wrap{
	position:fixed;
	top:0;
	left: 50%;
	max-width: 414px;
	transform: translateX(-50%);
	width: 100%;
	height: 100%;
	z-index: 100;
	background:rgba(0,0,0,0.7);
	.rule-box{
		position: absolute;
		width: 5.7rem;
		background:#fff;
		border-radius:5px;
		transform:translate(-50%,-50%);
		top:50%;
		left: 50%;
		padding:0.58rem 0.36rem;
		.t{
			font-size:0.32rem;
			color:#000000;
			text-align:center;
			font-weight:bold;
			margin-bottom:0.2rem;
		}
		.block{
			p{
				color:#3A3A3A;
				font-size:0.28rem;
				line-height:0.48rem;
				&.rule-belong-to{
					font-size:0.24rem;
					color:#DBA1A3;
					text-align:center;
					margin:0.15rem 0 0.35rem 0;
				}
			}
			a{
				display: block;
				margin:0 auto;
				width:4rem;
				text-align:center;
				height: 0.8rem;
				line-height:0.8rem;
				font-size:0.32rem;
				color:#fff;
				background:#B4272D;
				border-radius:25px;
			}
		}
	}
}
.my-fade-enter-active, .my-fade-leave-active {
    transition: opacity .5s;
  }
  .my-fade-enter, .my-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>