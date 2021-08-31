<template>
	<div class="user-index">
		<div class="user-header">
			<div class="login-info info-box" v-if="isLogin">
				<div class="info-t">
					<img class="avatar" :src="userInfo.avatar" alt="">
					<div class="block">
						<p class="user-name textEllipsis" :class="{'bottom':userMedalId==-1}">{{userInfo.nickname}}</p>
						<i class="vip" v-if="isVip" :class="{'is-vip':isVip,'type2':userMedalId==-1}" @click="downloadApp"></i>
						<div class="info-t-b">
							<div class="rank-box" @click="downloadApp" v-if="medalOperationFlag==1&&userMedalId>=0">
								<img :src="medalIconUrl" />
								<p class="rank">{{medalName}}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="info-b">
					<div class="info-b-item" @click="downloadApp">
						<p class="label">积分</p>
						<p class="value">{{points}}</p>
					</div>
					<div class="info-b-item" @click="downloadApp">
						<p class="label">账户</p>
						<p class="value">{{userInfo.coinBalance}}</p>
					</div>
				</div>
			</div>
			<div class="no-login-info clearfix info-box" v-else @click="$router.push('/auth')">
				<div class="info-t clearfix">
					<div class="info-l">
						<img class="avatar" :src="noLoginAvatar" alt="">
						<span class="user-name">点击登录</span>
						<van-icon name="arrow" />
					</div>
				</div>
				<div class="info-b">
					<div class="info-b-item" >
						<p class="label">积分</p>
						<p class="value">-</p>
					</div>
					<div class="info-b-item" >
						<p class="label">账户</p>
						<p class="value">-</p>
					</div>
				</div>	
			</div>
			<i class="user-message-icon" @click="goMessage"></i>
			<div class="home-icon" @click="$router.push('/')">
				<van-icon name="wap-home" class="user-setting-icon" />
			</div>
			<div class="logout-icon" v-if="isLogin" @click="logOutEvent">
				<i></i>
			</div>
			<div class="page-title"><van-icon name="arrow-left" class="return-left" @click="$router.go(-1)"/><p>个人中心</p></div>
		</div>
		<p class="download-tips" @click="goApp">签到打卡、积分换课和会员功能下载学国学网APP</p>
		<div class="module-list" v-if="isLogin">
			<div class="item purchase" @click="goPages('purchase')">
				<i></i>
				<p>已购课程</p>
			</div>
			<div class="item assemble" @click="goPages('assemble')">
				<i></i>
				<p>我的拼团</p>
			</div>
			<div class="item history" @click="goPages('history')">
				<i></i>
				<p>购课记录</p>
			</div>
		</div>
	</div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import { GetCookies } from '@/utils/setCookies';
import noLoginAvatar from '@/assets/image/no-login-avatar.png'
export default {
	data(){
		return {
            noLoginAvatar:noLoginAvatar,
			isLogin:false,
			userInfo:{
				nickname:'',
				avatar:'',
				coinBalance:'0.00'
			},
			couponsNum:'',
			show:false,
			points:0,
			checked:false,
			finish:false,
			userMedalId:'',
			medalName:'初出茅庐',
			medalIconUrl:'',
			medalOperationFlag:'',
			specialBool:false,
			//ljm
			siginObj:{
				integralThree:'',//签到累计3天得到的积分
				integralSeven:'',//签到累计7天得到的积分
				description:'',//个人中心提示语
				resultList:{},//周期列表信息；
			},
			isOnline:1,
			isSignDayNum:0,	
			memberCourseAsName:''
		}
	},
	computed:{
        ...mapState(['isVip']),
    },
	methods:{
		...mapActions(['setAudioData','setpasswardStates','setVideoIsRemove','setActionStateFlag','setActionflagstates','setDownLoadFlag','setChinaMobileDialogShow']),
		openCustomer(){
			window.qimoChatClick();
			this.setExistenceState(false);
		},
		goCalendar(e){
			e.stopPropagation();
			if (!this.$isLogin()) {
	           return;
	       	}else {
	       		this.$router.push('/user/dailyCheckin')
	       	}
		},
		goAccount(){
	   		if (!this.$isLogin()) {
	           return;
	       	}else {
	       		this.$router.push("/user/account");
	       	}
		},
		goPages(flag){
			if(flag=='purchase'){
				this.$router.push('/courseList?type=alreadyBuy&courseType=1')
			}else if(flag=='assemble'){
				this.$router.push('/assemble/myAssembleList')
			}else if(flag=='history'){
				this.$router.push('/user/purchaseHistory')
			}
		},
		goPoints(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
	       		this.$router.push("/user/account");
	       	}	
		},
		goVipListCustomer(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
	       		this.$router.push("/user/myMeVipList");
	       	}			
		},
		goMembershipCard(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
	       		this.$router.push("/user/myMembershipCard");
	       	}
		},
		goDiscountCoupon(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
				this.$router.push("/user/discountCoupon")
            }
		},
		goLearningCard(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
				this.$router.push("/user/learningCard")
            }
		},
		goApp(){
			window.location.href = `${this.$server.downLoad}?type=mine`
		},
		goQuestions(){
			this.$router.push("/user/questions")
		},
		goOpinion(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
				this.$router.push("/user/opinion")
            }
		},
		goMessage(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
				this.$router.push("/user/message")
            }
		},
		goSetting(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
				this.$router.push("/user/setting")
            }
		},
		PurchaseHistory(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
				this.$router.push("/user/purchaseHistory")
            }
		},
		goShare(){
			if (!this.$isLogin()) {
	           return;
	       	}else {
				this.$router.push("/user/share")
            }
		},
		goMyIncome(){
			if(!this.$isLogin()){
				return
			}else {
				this.$router.push('/user/myIncome')
			}
		},
		goMyInviteCode(){
			if(!this.$isLogin()){
				return;
			}else{
				this.$router.push('/user/myInviteCode')
			}
		},
		goMyAssemble(){
			if(!this.$isLogin()){
				return;
			}else{
				this.$router.push('/assemble/myAssembleList')
			}
		},
		// 获取活动状态
		getSignItemGetActivityStatus(){
			this.$http.post(this.$server.integralSignItemGetActivityStatus,{}).then(res =>{
				if(res.data.status == 200){
					this.isOnline = res.data.content.onOff;	
					if(this.isOnline==2){
						this.goMySiginSeven();
					}
				}
			})			
		},
		//获取签到一个周期的信息回填；
		goMySiginSeven(){
			var self = this;
			self.isSignDayNum=0;
			let cookie = GetCookies('uInfo');
			if(cookie){
				let userId = JSON.parse(cookie).userid;
				let query = {userId:userId};
				this.$http.post(this.$server.integralSignItemgetShow,query).then(res =>{
					if(res.data.status == 200){
							var content = res.data.content;
							for (const iterator of content.resultList) {
								if(iterator.isSignDay){
									self.isSignDayNum++;
								}
							}							
							this.siginObj={
								integralThree:content.integralActivityManagement.integralThree,
								integralSeven:content.integralActivityManagement.integralSeven,
								description:content.integralActivityManagement.description,
								resultList:content.resultList
							}
					}
				})				
			}  	
		},		
		/**
		 * 获取用户基本信息
		 */
		getUserInfo(){
			this.$http.post(this.$server.getUserInfoById,{}).then(res =>{
				if(res.data.status == 200){
					this.userInfo = {
						nickname:res.data.content.nickname,
						avatar:res.data.content.avatar,
						coinBalance:res.data.content.coinBalance.toFixed(2),
					}
					this.memberCourseAsName = res.data.content.memberCourseAsName||'会员课程'
					this.checked=res.data.content.signFlag>0?true:false
					this.finish = true;
					this.userMedalId = res.data.content.userMedalId?res.data.content.userMedalId:-1;
					this.medalName = res.data.content.medalName
					this.medalIconUrl = res.data.content.medalIconUrl
					this.medalOperationFlag = res.data.content.medalOperationFlag
				}
			})
		},
		/**
		 * 获取优惠券数量
		 */
		getUserCouponsNum(){
			this.$http.post(this.$server.getUserCouponsNum,{}).then(res=>{
				if(res.data.status == 200){
					this.couponsNum = res.data.content;
				}
			})
		},
		getUnreadMessageNum(){
			this.$http.post(this.$server.getUnreadMessageNum,{}).then(res=>{
				if(res.data.status == 200){
					if(res.data.content>0){
						this.show = true;
					}
				}
			})
		},
		/**
		 * 获取积分
		 */
		getIntegralInfo(){
			let query = {}
			this.$http.post(this.$server.getIntegralInfo,query).then(res=>{
				if(res.data.status == 200){
					let {availableNum,unavailableNum} = res.data.content;
					this.points = availableNum
				}
			})
		},
		/**签到 */
		signIn(){
			if(this.checked){
				return;
			}
			let query = {}
			this.$http.post(this.$server.signIn,query).then(res=>{
				if(res.data.status==200){
					if(res.data.content.integralNum&&res.data.content.integralNum>0){
						this.$rewardPointsToast({
							points:res.data.content.integralNum
						})
						this.getIntegralInfo();
						this.getUserInfo();
					}
					this.checked = true;
				}
			})
		},
		logOutEvent(){
			this.$dialog.confirm({
				message: '是否退出登录',
				confirmButtonColor:"#D40015"
			}).then(() => {
				this.$delCookie("uInfo");
				this.$delCookie("payFrom");
				this.$delCookie("qqAccessToken");
				this.$delCookie("thirdpartyInfo");
				let audioData = Object.assign({},this.audioData,{
					show:false,
					periodId:''
				})
				this.setAudioData(audioData);
				this.setpasswardStates(true);
				this.setVideoIsRemove(true);
				this.setActionStateFlag(false);
				this.setActionflagstates(true);	
				this.setChinaMobileDialogShow(true)		
				localStorage.removeItem('actionFlagIsOk');
				localStorage.removeItem('actionFlagIsOkTime');
				localStorage.removeItem('actionFlagId');
				localStorage.removeItem("specialVipInfo");
				this.$router.push("/");
			}).catch(() => {

			});
		},
		downloadApp(){
			this.setDownLoadFlag(true);
		}
	},
	created() {
        try {
			let uInfo = JSON.parse(this.$getCookie("uInfo"));
			this.isLogin = !!(uInfo && uInfo.accessToken);
			var nums = localStorage.getItem('specialVipInfo');
			if(nums==0){
				this.specialBool = true;
			}
            if (this.isLogin) {
                this.accessToken = uInfo ? uInfo.accessToken : "";
				this.getUserInfo();
				this.getUserCouponsNum()
				this.getUnreadMessageNum();
				this.getIntegralInfo();
			}
			this.getSignItemGetActivityStatus();
        } catch (e) {
            
		}
    },
}

</script>

<style lang="scss" scoped>
.user-index{
	.user-header{
		background: url('../../assets/image/user-bg.png') no-repeat center center;
		background-size: 100% 100%;
		width: 100%;
		height:3.8rem;
		position: relative;
		.no-login-info{
			.info-t{
				margin-bottom:0.3rem;
				position: relative;
				.info-l{
					float: left;
					.avatar{
						width: 1.4rem;
						height: 1.4rem;
						margin-right: .1rem;
						border-radius: 50%;
						display:inline-block;
						vertical-align: middle;
					}
					.user-name{
						display: inline-block;
						color:#1E1E1E;;
						font-size: 0.32rem;
						vertical-align: middle;
					}
					i{
						font-size: 0.28rem;
						position: absolute;
						right: 0;
						top:50%;
						margin-top:-0.1rem;
					}
				}
				.info-r{
					float: right;
					margin-top:0.48rem;
					img{
						width: 0.5rem;
						max-width: 100%;
						opacity: 0.6;
					}
					
				}
			}
			.info-b{
				position: relative;
				height: 1.05rem;
				font-size: 0;
				.info-b-item{
					display: inline-block;
					vertical-align: middle;
					width:50%;
					height: 100%;
					position: relative;
					text-align: center;
					&:first-child{
						&::after{
							content:'';
							position: absolute;
							right:0;
							height: 100%;
							width: 1px;
							background: #ADADAD;
							opacity: 0.6;
							top:0;
						}
					}
					.label{
						font-size: 0.28rem;
						color:#1E1E1E;
						margin-top:0.15rem;
						opacity:0.6;
					}
					.value{
						font-size: 0.36rem;
						color:#BE954A;
						font-weight: bold;
					}
				}
			}
		}
		.info-box{
			background: #fff;
			position: absolute;
			width: 6.9rem;
			left: 0.3rem;
			height: 3.3rem;
			top:1.2rem;
			border-radius: 7px;
			box-shadow:1px 2px 20px 0px rgba(153,125,124,0.15);
			padding:0.33rem 0.2rem;
		}
		.login-info{
			.info-t{
				margin-bottom:0.3rem;
				.avatar{
					width: 1.4rem;
					height: 1.4rem;
					margin-right: .4rem;
					border-radius: 50%;
					display:inline-block;
					vertical-align: middle;
				}
				.block{
					display: inline-block;
					vertical-align: middle;
					.user-name{
						font-size:.36rem;
						color: #1E1E1E;
						font-weight: bold;
						margin-bottom:0.15rem;
						display: inline-block;
						vertical-align: middle;
						&.bottom{
							margin-bottom:0.5rem;
						}
						&.only{
							margin-bottom:1rem!important;
						}
					}
					.vip{
						display: inline-block;
						vertical-align: middle;
						width: 0.51rem;
						height: 0.3rem;
						vertical-align: sub;
						margin-left: 0.05rem;
						&.is-vip{
							background: url('../../assets/image/vip_icon.png')no-repeat 50% 50%;
							background-size:cover;
						}
						&.type2{
							vertical-align: super;
						}
					}
					.info-t-b{
						margin-left: -0.1rem;
					}
					.rank-box{
						display: inline-block;
						vertical-align: middle;
						height: 0.35rem;
						line-height: 0.35rem;
						background:rgba(255,255,255,0.95);
						border-radius: 15px;
						color:#fff;
						font-size: 0.26rem;
						text-align: right;
						position:relative;
						padding: 0 0.15rem 0 0.45rem;
						color:#838587;
						overflow: hidden;
						img{
							position: absolute;
							height: 0.28rem;
							width: 0.28rem;
							top:0.05rem;
							left: 0.1rem;
							transform: scale(1.5);
						}
					}
					
				}
			}
			.info-b{
				position: relative;
				height: 1.05rem;
				font-size: 0;
				.info-b-item{
					display: inline-block;
					vertical-align: middle;
					width:50%;
					height: 100%;
					position: relative;
					text-align: center;
					&:first-child{
						&::after{
							content:'';
							position: absolute;
							right:0;
							height: 100%;
							width: 1px;
							background: #ADADAD;
							opacity: 0.6;
							top:0;
						}
					}
					.label{
						font-size: 0.28rem;
						color:#1E1E1E;
						margin-top:0.15rem;
						opacity:0.6;
					}
					.value{
						font-size: 0.36rem;
						color:#BE954A;
						font-weight: bold;
					}
				}
			}
		}
	}
	.download-tips{
		font-size: .28rem;
		color:#000;
		margin-top:1rem;
		padding: 0.2rem 0;
		text-align: center;
		text-decoration: underline;
	}
	.module-list{
		padding: 0 0.3rem;
		.item{
			border-bottom:1px solid #D8D8D8;
			padding:0.45rem 0 0.18rem 0;
			i,p{
				display: inline-block;
				vertical-align: middle;
				font-size: 0.28rem;
			}
			i{
				height: 0.3rem;
				width: 0.3rem;
				margin-right: 0.1rem;
			}
			&.assemble i{background: url('../../assets/image/assemble_icon.png')no-repeat 50% 50% / cover}
			&.purchase i{background: url('../../assets/image/purchase_icon.png')no-repeat 50% 50% / cover}
			&.history i{background: url('../../assets/image/history_icon.png')no-repeat 50% 50% / cover}
		}
	}
	.user-list{
		padding:1.4rem 0.3rem 1rem;
		.page-btn-box{
			.state1{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.to-vip,.to-share,.to-calendar{
					width: 3.28rem;
					height: 1.02rem;
					border-radius: 50px;
					text-align: center;
					overflow: hidden;
					padding: 0.12rem 0;
					position: relative;
				}
				div{
					position: relative;
					z-index: 3;
					margin-bottom:0.05rem;
				}
				i{
					display: inline-block;
					vertical-align: middle;
					height: 0.4rem;
					width: 0.4rem;;
				}
				span{
					color:#fff;
					font-size: 0.34rem;
					display: inline-block;
					vertical-align: middle;
					line-height: 0.4rem;
				}
				p{
					position: relative;
					z-index: 3;
					font-size: 0.26rem;
					color:#fff;
					opacity: 0.6;
				}
				.to-vip,.to-calendar{
					background: #CFAB6C;
					&::before{
						content:'';
						background: #D1AE6E;
						width: 50%;
						height: 150%;
						position: absolute;
						right:-10%;
						top:0;
						transform: rotate(-50deg);
						z-index: 1;
					}
					&::after{
						content:'';
						background:#C7A366;
						width: 10%;
						height: 120%;
						position: absolute;
						right:0%;
						top:20%;
						transform: rotate(40deg);
						z-index: 2;
					}
					&:active{
						background: #C7A366;
						&::before{
							background: #C7A366;
						}
					}
				}
			}

			.state2{
				.to-share{
					height: 1.02rem;
					border-radius: 50px;
					text-align: center;
					overflow: hidden;
					position: relative;
					line-height: 1rem;
					i{
						display: inline-block;
						vertical-align: middle;
						height: 0.4rem;
						width: 0.4rem;
						margin-right: 0.1rem;
					}
					p{
						display: inline-block;
						vertical-align: middle;
						color:#fff;
						font-size: 0.32rem;
						position: relative;
						z-index: 3;
					}
					&::before{
						width: 70%!important;
					}
				}
			}
			.to-share{
				background:#D3836F;
				&::before{
					content:'';
					background: #D68973;
					width: 50%;
					height: 150%;
					position: absolute;
					right:-10%;
					top:0;
					transform: rotate(-55deg);
					z-index: 1;
				}
				&::after{
					content:'';
					background:#CC7D6A;
					width: 10%;
					height: 120%;
					position: absolute;
					right:0%;
					top:20%;
					transform: rotate(40deg);
					z-index: 2;
				}
				&:active{
					background: #CC7D6A;
					&::before{
						background: #CC7D6A;
					}
				}
			}
		}
		.list{
			margin:0.4rem 0;
			.item{
				width: 27%;
				float: left;
				text-align: center;
				font-size: 0.28rem;
				color:#1E1E1E;
				height: 1.8rem;
				padding: 0.4rem 0;
				&.long{
					width: 46%;
				}
				i{
					display: inline-block;
					width: 0.48rem;
					height: 0.48rem;
					margin-bottom:0.1rem;
				}
				p{
					font-weight: bold;
				}
			}
		}
		.stepBox{
			overflow: auto;
			height: 1rem;
			padding-top: 0.4rem;
			.stepLi:first-child{
				position: relative;
				.stepLiRadio{
					position: absolute;
					width: 0.2rem;
					height: 0.2rem;
					border-radius: 100%;
					background: red;
					float: left;
					bottom: -0.1rem;
				}
			}
			.stepLi:not(:first-child){
				width: 10%;
				height: 0.02rem;
				background: #1E1E1E;
				position: relative;
				float: left;
				margin: 0 0.1rem;
				.stepLiRadio{
					position: absolute;
					width: 0.2rem;
					height: 0.2rem;
					border-radius: 100%;
					background: red;
					bottom: -0.1rem;
					right: -.2rem;
				}
			}
		}
	}
	.page-title{
		display:inline-block;
		position: absolute;
		top:0.4rem;
		font-size: 0.32rem;
		font-weight: bold;
		color:#fff;
		left:0;
		width: 100%;
		text-align: center;
		i{
			position: absolute;
			left: 0.3rem;
			top:0;
			font-size: 0.4rem;
		}
	}
	.logout-icon{
		position: absolute;
		top:0.4rem;
		right: 0.8rem;
		height: 0.48rem;
		width: 0.48rem;
		z-index: 2;
		i{
			background: url('../../assets/image/logout.png')no-repeat 50% 50% / cover;
			display: block;
			height: 100%;
		}
	}
	.home-icon{
		position: absolute;
		top:0.4rem;
		right: 0.2rem;
		height: 0.48rem;
		width: 0.48rem;
		background: #FFFFFF;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
		.user-setting-icon{
			display: block;
			font-size: 0.36rem;
			color:#323232;
		}
	}
	
	// .user-message-icon{
	// 	position: absolute;
	// 	display: block;
	// 	width: 0.58rem;
	// 	height: 0.58rem;
	// 	top:0.4rem;
	// 	left: 0.2rem;
	// 	background: url('../../assets/user-message-icon.png')no-repeat 50% 50% / cover;
	// }
}

	.dot{
		height: 0.2rem;
		width: 0.2rem;
		background: #f4ba51;
		border-radius: 50%;
		left: 0.35rem;
		margin-left: 0.2rem;
		position: absolute;
		top: 0.45rem;
	}
	.log-out-dialog{
		background: rgba(0,0,0,0.65);
		position: fixed;
		z-index: 999;
		top:0;
		left: 0;
		height: 100%;
		width: 100%;
		.box{
			position: absolute;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 5.9rem;
			height: 2.83rem;
			border-radius: 5px;
			background: #fff;
			overflow: hidden;
			.body{
				text-align: center;
				color:#333;
				font-size: 0.28rem;
				margin:0.8rem;
			}
			.btns{
				position: absolute;
				height: 1rem;
				width: 100%;
				line-height: 1rem;
				border-top:1px solid #f4f4f4;
				bottom:0;
				left: 0;
				z-index: 2;
				display: flex;
				align-items: center;
				justify-items: center;
				p{
					flex:1;
					text-align: center;
					font-size: 0.28rem;
					&.sure{
						border-left: 1px solid #f4f4f4;
						color:#D40015;
					}
					&:active{
						background: #f9f9f9;
					}
				}
			}
		}
	}
</style>