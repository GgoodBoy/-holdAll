<template>
	<div @keydown="keydownEvent($event)">
		<div class="go-logn" >
			<div class="div1" @click="$router.go(-1)">
				<van-icon name="arrow-left" class="return-left"/>
			</div>
			<div class="div2">
				{{classifyName}}
			</div>
		</div>
		<p class="tips">验证短信已发送到{{phone}} <span class="resend" :class="countTime ? 'can-resend' : ''" @click="resend">重新发送<span v-if="countTime">({{countTime}}s)</span></span></p>
		<div class="code">
			<div class="code-div" v-for="(item,index) in codeArr" :key="index" :class="{'active':item.active}"><input type="tel" maxlength="1" v-model="item.value" @focus="focusEvent(index)" @input="inputEvent(item,index)"/></div>
		</div>
		<div class="login-button" :class="changeColor ? 'red-login-button' : 'gray-login-button'" @click="sureCode">
			提交验证码
		</div>
	</div>
</template>

<script>

export default {
	props:["classifyName","routerTitle","t","phone","code"],
	data(){
		return {
			countTime: 60,
			clickAble:true,
			codeNum:'',
			codeArr:[
				{active:false,value:''},
				{active:false,value:''},
				{active:false,value:''},
				{active:false,value:''},
				{active:false,value:''},
				{active:false,value:''},
			]
		}
	},
	methods:{
		resend(){
			if(this.countTime){
				return false;
			}
			if(this.routerTitle == "register" || this.routerTitle == "bound"){
				//smsType 验证码类型 1：注册，2：忘记密码
				this.sendSMS(1)
			}else if(this.routerTitle == "forget"){
				this.sendSMS(2)
			}

		},
		sendSMS(type){
			this.$http.post("/common/sendSMS",{
                cellphone:this.phone,
                smsType:type,
            }).then( res => {
                if(res.status == 200){
                	this.countTime = 60;
					this.timerInterval();
                }
            })
		},
		sureCode(){
			if(this.changeColor && this.clickAble){
				this.clickAble = false;
				this.$http.post(this.$server.checkVeriCode,{
					cellphone:this.phone,
					code:this.codeNum
				}).then(res =>{
					if(res.data.status == 200){
						if(this.routerTitle == "bound"){
							this.$http.post(this.$server.getCellPhoneState,{
								cellphone:this.phone,
							}).then(res =>{
								let state = res.data.content.state;
								if(state){
									this.$router.push('/')
								}else{
									this.$emit("update:t",3)
								}
							})
						}else {
							this.$emit("update:code",this.codeNum)
							this.$emit("update:t",3)
						}
					}else {
						this.$toast(res.data.message);
						this.clickAble = true;
					}
				})
			}
		},
		keydownEvent(e){
			if(e.keyCode==8){
				let index = this.codeArr.findIndex(item=>item.active==true);
				if(index==0) return;
				if(this.codeArr[index].value==''){
					this.codeArr.forEach(item=>item.active=false);
					this.codeArr[index-1].active = true;
					document.querySelectorAll('.code-div')[index-1].querySelector('input').focus()
				}
			}
		},
		focusEvent(i){
			let index = this.codeArr.findIndex(item=>item.value!='');
			if(index<0){
				this.codeArr[0].active = true;
				document.querySelectorAll('.code-div')[0].querySelector('input').focus();
				return;
			}
			if(this.changeColor){
				this.codeArr.forEach(item=>item.active=false);
				this.codeArr[5].active = true;
				document.querySelectorAll('.code-div')[5].querySelector('input').focus();
				return;
			}
			let _index = this.codeArr.findIndex(item=>item.value=='');
			if(_index<i){
				this.codeArr.forEach(item=>item.active=false);
				this.codeArr[_index].active = true;
				document.querySelectorAll('.code-div')[_index].querySelector('input').focus()
			}
		},
		inputEvent(obj,index){
			if(obj.value!=''){
				if(index==5){
					this.codeNum = this.codeArr.map(item=>{
						return item.value
					}).join('')
					console.log(this.codeNum)
				}else{
					this.codeArr.forEach(item=>item.active=false);
					this.codeArr[index+1].active = true;
					document.querySelectorAll('.code-div')[index+1].querySelector('input').focus()
				}
			}
		},
		timerInterval(){
			let timer;
	        if (timer) clearInterval(timer);
			timer = setInterval(() => {
	            if (this.countTime <= 0) {
	                clearInterval(timer);
	            } else {
	                this.countTime--;
	            }
	        }, 1000);
		},
	},
	mounted(){
		this.timerInterval();
		setTimeout(()=>{
			document.body.scrollTop = 0
		},1)
	},
	computed:{
        changeColor(){
			const index = this.codeArr.findIndex(item=>item.value=='');
			return index<0;
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
.tips{
	margin-top: .5rem;
	color: #CACACA;
	font-size: .28rem;
	text-align: center;
	.resend{
		color: #C52D3B;
		margin-left: .5rem;
	}
	.can-resend{
		color: rgba(60,39,45,0.3);
	}
}
.code{
	padding: .8rem 1.15rem;
	display: flex;
	justify-content: space-between;
	position: relative;
	div{
		width: .6rem;
		height: .6rem;
		line-height: .6rem;
		text-align: center;
		font-size: .4rem;
		border: 1px solid #EFEFEF;
		border-radius: .05rem;
		position: relative;
		overflow: hidden;
		&.active{
			border-color:#C52D3B;
		}
		input{
			width: 1rem;
			height: .6rem;
			position: absolute;
			top:0;
			left: -0.2rem;
			border:none;
			outline:none;
			text-align: center;
			caret-color: rgba(0,0,0,0); 
		}
	}
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