<template>
	<div>
		<div class="go-logn">
			<div class="div1" @click="$router.go(-1)">
				<van-icon name="arrow-left" class="return-left"/>
			</div>
			<div class="div2">
				学国学网登录
			</div>
		</div>	
		<div class="phone-wrap phone-wrap-top1">
            <div class="phone-num">
                <span>+86</span>
                <input type="tel" v-model="phone" maxlength="11" placeholder="输入手机号码"/>
				<div class="getCodeNum1" @click="sendSMS" :class="[{'bgd-none':codeText!='获取验证码'},{'gray-login-button':phone.length<11}]">{{codeText}}</div>
            </div>
			<div class="code">
				<input type="tel" v-model="codeNum" maxlength="6" placeholder="输入验证码"/>
			</div>
			<div class="phone-login" :class="changeColor ? 'red-login-button' : 'gray-login-button'" @click="smsLogin">确定</div>
			<div class="bottom clearfix">
				<p class="pwd-login" @click="goLogin" v-show="!siginQueryId&&passwordActionState">密码登录</p>
			</div>
			<div class="must-know">
				<p>登录即表示您同意并愿意遵守学国学网</p>
				<p><a :href="registerAgreement">《使用协议》</a>和<a :href="privacyAgreement">《隐私协议》</a></p>
			</div>
        </div>
		<div class="auth-dialog-wrap" :class="errorTips?'show':'hidden'" @click="closeDialog($event)">
			<div class="dialog-box">
				<van-icon name="clear"/>
				<p class="error-tip">手机格式错误，请重新输入！</p>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import {mapState,mapActions} from 'vuex'
const regExp = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9]|16[0-9])\d{8}$/
function getQueryString(key){
    let reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    let result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
export default {
	data(){
		return {
			phone:'',
			errorTips:false,
			privacyAgreement:'',
			registerAgreement:'',
			siginQueryId:'',
			showKeyboard: false,
			codeNum: '',//验证码
			codeText: '获取验证码',
			codeNumShow:false, //重新发送展示情况
			clickAble:true,//
		}
	},
	created(){
		this.siginQueryId = this.$route.query.shareId?this.$route.query.shareId:'';
		this.privacyAgreement = this.$server.privacyAgreement;
		this.registerAgreement = this.$server.registerAgreement;
		if(this.$route.query.from){
			this.setActionflagstates(true)
		}else{
			this.setActionflagstates(false)
		}
	},
    computed:{
        changeColor(){
            return ((this.codeNum.length !== 6)||(!regExp.test(this.phone))) ? false : true
		},		
        ...mapState(['actionFlagState','hasOpenApp','passwordActionState']),
    },	
	methods:{
		...mapActions([
			'setInterestFlag',
			'setActionStateFlag',
			'setActionflagstates',
			'setGiftFlag',
			'setMembershipCardDialog',
			'setChinaMobileDialog',
			'setpasswardStates']),		
		onInput(value){
			if(this.codeNum.length<6){
				if(this.codeNum.length==5){
					this.showKeyboard = false;
				}
				this.codeNum+=value;
			}else {
				return false;
			}
		},
		onDelete(){
			this.codeNum = this.codeNum.substring(0,this.codeNum.length-1)
		},	
		smsLogin(){
			if(this.changeColor && this.clickAble){
				this.clickAble = false;
				const params =this.siginQueryId?{
					cellphone:this.phone,
					code:this.codeNum,
					origin:1,
					shareUserId:this.siginQueryId,
					type:1,
				}:{
					cellphone:this.phone,
					code:this.codeNum,
					origin:1,
				};
				if(getQueryString('origin_type')){
					params['origin'] = getQueryString('origin_type');
				}
				let shareType = getQueryString('shareType')
				if(shareType&&shareType=='normal'){
					params.courseShareUserId = getQueryString('shareUserId');
					params.shareCourseId = getQueryString('courseId');
					params.source = getQueryString('source')
				}
				let activityShareUserId = getQueryString('activityShareUserId')
				if(activityShareUserId){
					params.activityShareUserId = Number(activityShareUserId);
				}
				this.$toast.loading()
				this.$http.post(this.$server.loginBySMS,params).then(res =>{
					this.$toast.clear()
					if(res.data.status == 200){
						let userInfo = {
							accessToken: res.data.content.accessToken,
							nickname: res.data.content.nickname,
							avatar: res.data.content.avatar,
							userid: res.data.content.id,
							cellphone:res.data.content.cellphone
						}
						this.$setCookie("uInfo", JSON.stringify(userInfo));
						sessionStorage.removeItem('setInterestFlagBool');
						let rediectUrl = sessionStorage.getItem('rediectUrl');
						//如果用户是从首页国学大礼包弹窗领取按钮进入登录界面，则弹窗顺序为
						//国学大礼包成功弹窗->移动H5弹窗->兴趣弹窗->大客户礼包弹窗->定制会员卡弹窗
						//反之则为移动H5弹窗->兴趣弹窗->大客户礼包弹窗->定制会员卡弹窗
						//目前总共5种弹窗
						this.dialogShowEvent(res)
						if(res.data.content.isVip==1){
							userInfo.isVip = true;
						}
						if(rediectUrl){
							sessionStorage.removeItem('rediectUrl')
							this.$router.push(rediectUrl)
						}else{
							let learnCardId = sessionStorage.getItem('learnCardId');
							if(learnCardId){
								let params = {
									cardId:learnCardId
								}
								this.$http.post(this.$server.getLearningCardInfo,params).then(response=>{
									if(response.data.status == 200){
										let state = response.data.content.state;
										let type = response.data.content.type;
										if(state==1){
											sessionStorage.removeItem('learnCardId');
											sessionStorage.setItem('receiveLearnCard','fail')
											if(type==1){
												this.$router.push('/user/learningCard');
											}else{
												this.$router.push('/courseList?type=alreadyBuy&courseType=1');
											}
										}else if(state==2){
											this.$http.post(this.$server.receivLearningCard,params).then(res=>{
												if(res.data.status==200){
													sessionStorage.removeItem('learnCardId');
													sessionStorage.setItem('receiveLearnCard','success')
													if(type==1){
														this.$router.push('/user/learningCard');
													}else{
														this.$router.push('/courseList?type=alreadyBuy&courseType=1');
													}
												}else{
													this.$toast({
														mask: false,
														message: res.data.message
													})
												}
											})
										}else if(state==3){
											sessionStorage.removeItem('learnCardId');
											if(type==1){
												this.$router.push('/user/learningCard');
											}else{
												this.$router.push('/courseList?type=alreadyBuy&courseType=1')
											}
										}
									}
								})
							}else{
								this.$router.push('/')
							}
						}
					}else {
						this.clickAble = true;
					}
				})
			}
		},			
		sendSMS(){
			if(this.codeText!='获取验证码') return false;
			if(this.phone.length<11) return;
			this.$http.post(this.$server.getCodeForLoginBySMS,{
                cellphone:this.phone,
                smsType:1,
            }).then( res => {
                if(res.data.status == 200){
                    this.$toast('短信发送成功，请注意查收')
					let countTime = 60;
					this.codeNumShow = true;
					this.codeText = countTime+'s'
					let timer;
					if (timer) clearInterval(timer);
					timer = setInterval(() => {
						if (countTime <= 1) {
							this.codeText = '获取验证码'
							clearInterval(timer);
						} else {
							countTime--;
							this.codeText = countTime+'s'
						}
					}, 1000);
                }
            })
		},			
		goLogin(){
			this.$router.push("/login")
		},
		goRegister(){
			this.$router.push("/register")
		},
		closeDialog(e){
			e.stopPropagation();
		},
		/**
		 * 判断弹窗是否弹起，先判断国学大礼包，判断顺序为国学大礼包弹窗->移动客户弹窗->兴趣弹窗->大客户礼包弹窗->定制会员卡弹窗
		 * @param res 为登录接口返回的数据 
		 */
		dialogShowEvent(res){
			if(this.actionFlagState&&!this.siginQueryId){
				let id =Number(localStorage.getItem('actionFlagId'));
				if(id){ 
					this.setActionflagstates(false); 
					this.$http.post(this.$server.getGiftBagReceive,{giftId:id,userId:res.data.content.id}).then(res1=>{
						if(res1.data.status==200){
							localStorage.setItem('actionFlagIsOk','ok')
							localStorage.setItem('actionFlagIsOkTime',res1.data.content.tryEndAt)
							localStorage.setItem('userSmsLoginInfo',JSON.stringify(res1))
							this.setActionStateFlag(true);//弹国学大礼包成功界面
							this.dialogShowNextEvent(res,'false');
						}else{
							this.$toast({
								mask: false,
								message: res1.data.message=='领取失败'?'您已经领取过大礼包':res1.data.message
							})
							setTimeout(()=>{
								this.dialogShowNextEvent(res,'true');
							},2000)
						}
					});
				}else{
					this.dialogShowNextEvent(res,'true');
				}	
			}else{
				this.dialogShowNextEvent(res,'true');
			}
		},
		/**
		 * 判断弹窗是否弹起后续操作，判断顺序为移动客户弹窗->兴趣弹窗->大客户礼包弹窗->定制会员卡弹窗
		 * @param res 为登录接口返回的数据
		 * @param flag 为true标识可能弹起一种弹窗（先判断移动客户弹窗，如果需要弹，则先记录后续所有弹窗状态到sessionStorage，然后再在首页弹移动弹窗，如果移动不用弹，则立即弹起其他弹窗）,
		 * false代表把后续弹窗操作先记录到sessionStorage中
		 */
		dialogShowNextEvent(res,flag){
			let rediectUrl = sessionStorage.getItem('rediectUrl')
			if(flag=='true'){
				this.$http.post(this.$server.getUserInfoById,{}).then(response =>{
					if(response.data.status==200){
						if(response.data.content.isMobilePopup&&response.data.content.isMobilePopup==2){
							// this.setChinaMobileDialog(true);
							sessionStorage.setItem('ChinaMobile','true')
							if(res.data.content.integralNum>0){
								sessionStorage.setItem('setInterestFlagBool','ok');
								if(rediectUrl&&(rediectUrl.includes('assembleRecordId')||rediectUrl.includes('receiveLearnCard'))){
									sessionStorage.removeItem('setInterestFlagBool');
								}
							}
							if(res.data.content.welcomeSpeech.length>0){
								sessionStorage.setItem('welcomeSpeech',res.data.content.welcomeSpeech)
							}
							if(res.data.content.welcomeSpeechForMemberMake&&res.data.content.welcomeSpeechForMemberMake.length>0){
								sessionStorage.setItem('welcomeSpeechForMemberMake',res.data.content.welcomeSpeechForMemberMake)
							}
						}else{
							if(res.data.content.integralNum>0){
								if(rediectUrl&&(rediectUrl.includes('assembleRecordId')||rediectUrl.includes('receiveLearnCard'))){
									this.setInterestFlag(false);
									this.dialogShowNNextEvent(res)
								}else{
									this.setInterestFlag(true);
									if(res.data.content.welcomeSpeech.length>0){
										sessionStorage.setItem('welcomeSpeech',res.data.content.welcomeSpeech)
									}
									if(res.data.content.welcomeSpeechForMemberMake&&res.data.content.welcomeSpeechForMemberMake.length>0){
										sessionStorage.setItem('welcomeSpeechForMemberMake',res.data.content.welcomeSpeechForMemberMake)
									}
								}										
							}else{
								this.dialogShowNNextEvent(res)
							}
						}
					}
				})
			}else{
				this.$http.post(this.$server.getUserInfoById,{}).then(response =>{
					if(response.data.status==200){
						if(response.data.content.isMobilePopup&&response.data.content.isMobilePopup==2){
							sessionStorage.setItem('ChinaMobile','true')
						}
					}
				})
				if(res.data.content.integralNum>0){
					sessionStorage.setItem('setInterestFlagBool','ok');
					if(rediectUrl&&(rediectUrl.includes('assembleRecordId')||rediectUrl.includes('receiveLearnCard'))){
						sessionStorage.removeItem('setInterestFlagBool');
					}
				}
				if(res.data.content.welcomeSpeech.length>0){
					sessionStorage.setItem('welcomeSpeech',res.data.content.welcomeSpeech)
				}
				if(res.data.content.welcomeSpeechForMemberMake&&res.data.content.welcomeSpeechForMemberMake.length>0){
					sessionStorage.setItem('welcomeSpeechForMemberMake',res.data.content.welcomeSpeechForMemberMake)
				}
			}
		},
		/**
		 * 判断弹窗是否弹起后续操作，判断顺序为大客户礼包弹窗->定制会员卡弹窗
		 * @param res 为登录接口返回的数据
		 * 
		 */
		dialogShowNNextEvent(res){
			if(res.data.content.welcomeSpeech.length>0){
				this.setGiftFlag(res.data.content.welcomeSpeech)
				if(res.data.content.welcomeSpeechForMemberMake&&res.data.content.welcomeSpeechForMemberMake.length>0){
					sessionStorage.setItem('welcomeSpeechForMemberMake',res.data.content.welcomeSpeechForMemberMake)
				}
			}else{
				if(res.data.content.welcomeSpeechForMemberMake&&res.data.content.welcomeSpeechForMemberMake.length>0){
					this.setMembershipCardDialog(res.data.content.welcomeSpeechForMemberMake)
				}
			}
		}
	}
}

</script>

<style lang="scss" scoped>
.go-logn{
	display: flex;
    height: 1rem;
    justify-content: center;
    align-items: center;
    position: relative;
	.div1{
		position: absolute;
        top:50%;
        left: 0.2rem;
        margin-top:-0.2rem;
        font-size: 0.4rem;
	}
	.div2{
        height: .5rem;
        font-size: 0.4rem;		
	}	
}
.divBox{
		flex: 5;
		height: .5rem;
		margin-top: .19rem;
		font-size: 0.4rem;
		width: 100%;
		text-align: center;		
}
.go-index{
	padding:.5rem .3rem;
	font: .24rem/.25rem "";
	color: #C52D3B;
	text-align: right;
    position: absolute;
    right: 0;	
	a{
		color: #C52D3B;
	}
}
.phone-wrap-top1{
	padding: 1.2rem .9rem .9rem;
}
.phone-wrap{
    .phone-num{
        border-bottom: 1px solid #EFEFEF;
        padding: 0.14rem 0;
        font-size:0;
		position: relative;
		.getCodeNum1{
			width: 1.6rem;
			height: 0.48rem;
			background-image: linear-gradient(#E62F45, #D51F35, #C71227);
			color: #fff;
			top: 0.12rem;
			right: 0;
			text-align: center;
			line-height: 0.48rem;
			font-size: 0.24rem;
			position: absolute;
			border-radius:25px;
			cursor: pointer;
			&.bgd-none{
				background: #ee7382;
			}
		}
		
        span{
            color: #999;
            font-size: .36rem;
			line-height: 0.48rem;
			display: inline-block;
			vertical-align: middle;
        }
        .phone-input{
            margin-left: .35rem;
        }
        input{
            border: none;
            outline: none;
			padding-left: 0.35rem;
			width: calc(100% - 1rem);
			line-height: 0.48rem;
			height: 0.48rem;
			font-size: 0.36rem;
			vertical-align: middle;
			display: inline-block;
        }
        input::-webkit-input-placeholder{
            color: #CACACA;
        }
    }
	.code{
		border-bottom:1px solid #efefef;
		font-size:0.36rem;
		padding: 0.3rem 0.3rem 0.1rem 1.05rem;
		line-height: 0.34rem;
		input{
			border:none;
			outline: none;
			font-size: 0.36rem;
			height: 0.48rem;
		}
	}
	.phone-login{
		width: 100%;
		height: 0.88rem;
		line-height: 0.88rem;
		text-align: center;
		color:#fff;
		border-radius: 25px;
		font-size: 0.32rem;
		letter-spacing: 1px;
		margin:0.6rem 0 0.2rem;
		cursor: default;
	}
	.pwd-login{
		color:#929292;
		font-size: 0.3rem;
		text-align: right;
		padding: 0.1rem 0;
	}
	.must-know{
		margin-top:0.2rem;
		p{
			color:#aaaaaa;
			font-size: 0.24rem;
			text-align: center;
			margin:0.1rem 0;
			line-height: 0.28rem;
			a{
				margin:0 0.02rem;
				color:#C52D3B;
				display:inline-block;
				vertical-align: text-top;
			}
		}
	}
    .bottom{
        margin:1rem auto;
        width: 5.6rem;
        font-size: 0.3rem;
        color:#929292;
        .second{
            color:#C52D3B
        }
        .resend{
            float: left;
            color:#C52D3B;
            &.can-resend{
                color:#929292;
            }
        }
        .pwd-login{
            float: right;
        }
    }	
}
.title{
	width: 100%;
	text-align: center;
	padding: .25rem 0.5rem 0 0.5rem;
	.des{
		font-size: 0.4rem;
		color:#323232;
		font-weight: bold;
		letter-spacing: 2px;
		opacity: 0.8;
		margin-bottom:0.1rem;
	}
	.coupon-data{
		color:#C52D3B;
		font-size: 0.48rem;
		font-weight: bold;
	}
	>img{
		display: block;
		width: 5.1rem;
		height: 1.45rem;
	}
}
.gift{
	width: 4.9rem;
	height: 3.2rem;
	margin: 0.6rem auto 0;
	opacity: 0;
	transition: opacity 0.3s;
	&.state1{
		margin:0.4rem auto 0.2rem;
		height: 3.4rem;
	}
	&.show{
		opacity: 1;
	}
}
.buttons{
	margin-top: 1.75rem;
	>div{
		width: 6.4rem;
		height: .88rem;
		line-height: .88rem;
		text-align: center;
		border-radius: .1rem;
		background-color: #C52D3B;
		color: #fff;
		font-size: .32rem;
		margin: 0 auto .2rem;
		border: 1px solid #C52D3B;
	}
	.go-login{
		background-color: #fff;
		color: #C52D3B;

	}
}
.third-party{
	display: flex;
	padding: 0 1.57rem;
	margin-top: .8rem;
	padding-bottom: .5rem;
	justify-content: space-between;
	text-align: center;
	display: none;
	li{
		font-size: .26rem;
		img{
			width: .7rem;
			height: .7rem;
		}
		
	}
}
.auth-dialog-wrap{
	position: fixed;
	top:0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.7);
	z-index: 10;
	&.show{
		visibility: visible;
		opacity: 1;
		transition: visibility 1ms ease,opacity 0.3s ease-in 1ms;
	}
	&.hidden{
		opacity: 0;
		visibility: hidden;
		transition: visibility 1ms ease 0.3s,opacity 0.3s ease-in;
	}
	.dialog-box{
		width: 4.3rem;
		height: 2.5rem;
		border-radius: 5px;
		background: #fff;
		position: absolute;
		transform: translate(-50%,-50%);
		top:50%;
		left: 50%;
		text-align: center;
		i{
			display: inline-block;
			width: 0.62rem;
			height: 0.62rem;
			margin:0.52rem 0 0.3rem 0;
		}
		p{
			font-size: 0.28rem;
			color:#3A3A3A;
		}
	}	
}
</style>
<style lang="scss">	
.red-login-button{
	background-image: linear-gradient(#E62F45, #D51F35, #C71227);
}
.gray-login-button{
	background: #E6E6E6!important;
}
.phone-wrap .numberkeyboard{
	border-bottom: 1px solid #EFEFEF;
}
.phone-wrap .numberkeyboard .van-cell{
	font-size:0.36rem;
	padding: 0.3rem 0.3rem 0.1rem 1.05rem;
	line-height: 0.34rem;
}
#qqLoginBtn, #wb_connect_btn{
	a{
		position: absolute !important;
		width: 100% !important;
		height: 100% !important;
		left: 0;
		top: 0;
		img{
			opacity: 0;
		}
	}
	span{
		/* opacity: 0; */
		/* display: none; */
	}
}

.phone-wrap-top1 ::-webkit-input-placeholder { /* WebKit browsers */
    color:    #ccc !important;
}
.phone-wrap-top1 :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:    #ccc !important;
}
.phone-wrap-top1 ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:    #ccc !important;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
    color:    #ccc !important;
}
</style>