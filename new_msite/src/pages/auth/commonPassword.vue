<template>
	<div>
		<div class="go-logn">
			<div class="div1" @click="$router.go(-1)">
				<van-icon name="arrow-left" class="return-left"/>
			</div>
			<div class="div2">
				{{classifyName}}
			</div>
		</div>
		<div class="password-wrap">
			<div class="input-wrap">
				<input type="password" v-model="passwords" maxlength="20" placeholder="输入密码">
			</div>
			<div class="input-wrap">
				<input type="password" v-model="surePasswords" maxlength="20" placeholder="确认密码" >
			</div>
			<p class="tips">
				密码长度7-20位，须包含数字、字母（大小写）至少2种或以上元素
			</p>
			<div class="login-button" :class="changeColor ? 'red-login-button' : 'gray-login-button'" @click="sure">
	            确认提交
	        </div>
		</div>
		
	</div>
</template>

<script>
import {mapActions} from 'vuex'
import axios from 'axios'
// const regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,20}$/;
const regExp = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
export default {
	props:["routerTitle","classifyName","t","phone","code"],
	data(){
		return {
			passwords:'',
			surePasswords:'',
			clickAble:true,
		}
	},
	created(){
		
	},
	methods:{
		...mapActions(['setInterestFlag','setGiftFlag','setMembershipCardDialog','setChinaMobileDialog']),
		sure(){
			if(this.changeColor && this.clickAble){
				this.clickAble = false;
				let flag = 0;
				let password = this.passwords;
	            if (!regExp.test(password)) {
	                this.$toast("密码格式错误");
					this.clickAble = true;
	            }else {
					if(this.routerTitle == "register"){
						let query = {
							cellphone:this.phone,
							password:this.$md5(this.passwords),
							againPassword:this.$md5(this.surePasswords),
							code:this.code,
							origin:1
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
						this.$http.post(this.$server.regis,query).then(res=>{
							this.$toast.clear()
							if(res.data.status == 200){
								let userInfo = {
									accessToken: res.data.content.accessToken,
									nickname: res.data.content.nickname,
									avatar: res.data.content.avatar,
									userid: res.data.content.id,
									cellphone:res.data.content.cellphone
								}
								userInfo.isVip = res.data.content.isVip==1;
								this.$setCookie("uInfo", JSON.stringify(userInfo));
								let rediectUrl = sessionStorage.getItem('rediectUrl')
								this.dialogShowNextEvent(res);
								if(rediectUrl){
									sessionStorage.removeItem('rediectUrl')
									this.$router.push(rediectUrl)
								}else
									this.$router.push("/")
							}else {
								this.clickAble = true;
							}
						})
					}
					else if(this.routerTitle == 'forget'){
						let query = {
							cellphone:this.phone,
							password:this.$md5(this.passwords),
							againPassword:this.$md5(this.surePasswords),
							code:this.code
						}
						this.$http.post(this.$server.modifyPassword,query).then(res =>{
							if(res.data.status == 200){
								//显示公共弹窗
								this.$toast("密码修改成功");
								let timer =  setTimeout(()=>{
									this.$router.push("/login")
								}, 500);
								return;
							}else {
								this.clickAble = true;
							}
						})	
					}
					else if(this.routerTitle == 'bound'){
						let query = {
							cellphone:this.phone,
							password:this.$md5(this.passwords),
							againPassword:this.$md5(this.surePasswords),
						}
						this.$http.post(this.$server.bindCellphone,query).then(res=>{
							if(res.data.status == 200){
								let userInfo = {
									accessToken: res.data.content.accessToken,
									nickname: res.data.content.nickname,
									avatar: res.data.content.avatar,
									userid: res.data.content.id
								}
								this.$setCookie("uInfo", JSON.stringify(userInfo));
								this.$router.push("/")
							}
						})
					}
				}
			}
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
            return (this.passwords.length>=7 && this.passwords.length<=20 && this.surePasswords.length>=7 && this.surePasswords.length<=20 && this.surePasswords == this.passwords) ? true : false
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
header{
	.classify-name{
		padding: .4rem 0;
		text-align: center;
		color: #1D1D1D;
		font-size: .4rem;
	}
}
.password-wrap{
	padding: 1.3rem .9rem 0;
	.input-wrap{
		border-bottom: 1px solid #EFEFEF;
        line-height: .6rem;
        font-size: .4rem;
        margin-bottom: .6rem;
        input{
        	width: 5.6rem;
            border: none;
            outline: none;
        }
        input::-webkit-input-placeholder{
            color: #CACACA;
        }
	}
}
.tips{
	font-size: .24rem;
	line-height: .48rem;
	color: #CACACA;
	margin-bottom: .5rem;
}
.login-button{
    width: 5.6rem;
	height: 0.88rem;
    line-height: 0.88rem;
    text-align: center;
    color:#fff;
    border-radius: 25px;
    font-size: 0.32rem;
    letter-spacing: 1px;
    margin:0.6rem auto 0.2rem;
}
.red-login-button{
    background-color: #C52D3B;
}
.gray-login-button{
    background-color: #E6E6E6;
}
</style>