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
		<div class="phone-wrap">
			<div class="phone-num">
				<span>+86</span>
				<input class="phone-input" type="tel" v-model="phone" maxlength="11" placeholder="输入手机号码">
			</div>
			<div class="phone-num password">
				<input placeholder="登录密码" type="password" v-model="passwords" maxlength="20" @keydown.13="toLogin">
			</div>
            <div class="login-button" @click="toLogin" :class="changeColor ? 'red-login-button' : 'gray-login-button'">
                登录
            </div>
		</div>
		
		<div class="other-enter">
			<div class="go-register" @click="goRegister">快速注册</div>
			<div @click="goForget">忘记密码</div>
		</div>
	</div>
</template>

<script>
import {mapActions} from 'vuex'
import axios from 'axios'
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
export default {
	data(){
		return {
			phone:'',
			passwords:'',
			clickAble:true,
		}
	},
	created(){
		
	},
	methods:{
		...mapActions(['setInterestFlag','setMembershipCardDialog','setGiftFlag','setChinaMobileDialog']),
		goRegister(){
			this.$router.push('/register')
		},
		goForget(){
			this.$router.push('/forget')
		},
		toLogin(){
			if(!this.changeColor){
				// this.$toast('手机号或密码输入错误！');
				return false;
			}
			this.clickAble = false;
			let query = {
				cellphone:this.phone,
				password:this.$md5(this.passwords)
			}
			if(getQueryString('origin_type')){
				query['origin'] = getQueryString('origin_type');
			}
			let shareType = getQueryString('shareType')
			if(shareType&&shareType=='normal'){
				query.courseShareUserId = getQueryString('shareUserId');
				query.shareCourseId = getQueryString('courseId');
				query.source = getQueryString('source')
			}
			let activityShareUserId = getQueryString('activityShareUserId')
            if(activityShareUserId){
                query.activityShareUserId = Number(activityShareUserId);
            }
			this.$toast.loading()
			this.$http.post(this.$server.login,query).then(res =>{
				this.$toast.clear()
				if(res.data.status == 200){
					let userInfo = {
						accessToken: res.data.content.accessToken,
						nickname: res.data.content.nickname,
						avatar: res.data.content.avatar,
						userid: res.data.content.id,
						cellphone:res.data.content.cellphone
					}
					let rediectUrl = sessionStorage.getItem('rediectUrl')
					userInfo.isVip = res.data.content.isVip==1;
					this.$setCookie("uInfo", JSON.stringify(userInfo));
					this.dialogShowNextEvent(res)
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
									if(state==1){
										sessionStorage.removeItem('learnCardId');
										this.$router.push('/courseList?type=alreadyBuy&courseType=1');
										sessionStorage.setItem('receiveLearnCard','fail')
									}else if(state==2){
										this.$http.post(this.$server.receivLearningCard,params).then(res=>{
											if(res.data.status==200){
												sessionStorage.removeItem('learnCardId');
												this.$router.push('/courseList?type=alreadyBuy&courseType=1');
												sessionStorage.setItem('receiveLearnCard','success')
											}else{
												this.$toast({
													mask: false,
													message: res.data.message
												})
											}
										})
									}else if(state==3){
										sessionStorage.removeItem('learnCardId');
										this.$router.push('/courseList?type=alreadyBuy&courseType=1')
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
		},
		dialogShowNextEvent(res){
			let rediectUrl = sessionStorage.getItem('rediectUrl')
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
		},
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
	},
	computed:{
        changeColor(){
            return (this.phone.length == 11 && this.passwords.length>=7 && this.passwords.length<=20) ? true : false
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
.phone-wrap{
	padding: 1.2rem .9rem .9rem;
	.phone-num{
		border-bottom: 1px solid #EFEFEF;
		line-height: .6rem;
		font-size: .4rem;
		span{
			color: #8E8E8E;
			font-size: .36rem;
			float: left;
			width: 0.8rem;
		}
		.phone-input{
			padding-left: .35rem;
			width: calc(100% - 0.8rem);
			overflow: hidden;
		}
		input{
			border: none;
			outline: none;
		}
		input::-webkit-input-placeholder{
			color: #CACACA;
		}
	}
	.password{
		margin-top: .43rem;
        input{
            width: 100%;
        }
	}

}
.login-button{
	width: 100%;
    height: 0.88rem;
    line-height: 0.88rem;
    text-align: center;
    color:#fff;
    border-radius: 25px;
    font-size: 0.32rem;
    letter-spacing: 1px;
    margin:0.6rem 0 0.2rem;
}
.red-login-button{
	background-color: #C52D3B;
}
.gray-login-button{
	background-color: #E6E6E6;
}
.other-enter{
	margin-top: .6rem;
	font-size: .3rem;
	padding: 0 .9rem 0;
	display: flex;
	justify-content: space-between;
	color: #929292;
	.go-register{
		color: #C52D3B;
	}
}
</style>