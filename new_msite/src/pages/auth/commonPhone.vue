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
        <div class="phone-wrap">
            <div class="phone-num">
                <span>+86</span>
                <input type="tel" v-model="phone" maxlength="11" placeholder="输入手机号码">
            </div>
        </div>
        <div class="login-button" :class="changeColor ? 'red-login-button' : 'gray-login-button'" @click="getCode">
            获取验证码
        </div>
        <div class="must-know">
            <p>登录即表示您同意并愿意遵守学国学网</p>
            <p><a :href="registerAgreement">《使用协议》</a>和<a :href="privacyAgreement">《隐私协议》</a></p>
        </div>
    </div>
</template>

<script>

export default {
    props:["classifyName","routerTitle","t",],
    data(){
        return {
            phone:'',
            clickAble:true,
            regExp:'/^\d$/',
            registerAgreement:'',
            privacyAgreement:''
        }
    },
    created(){
        this.privacyAgreement = this.$server.privacyAgreement;
		this.registerAgreement = this.$server.registerAgreement;
    },
    methods:{
        getCode(){
            if(this.changeColor && this.clickAble){
                this.clickAble = false;
                let phone = this.phone;
                if (
                    !/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9]|16[0-9])\d{8}$/.test(
                        phone
                    )
                ) {
                    this.$toast("手机号输入错误");
                    this.clickAble = true;
                    return false;
                }
                if(this.routerTitle == "register" || this.routerTitle == "bound"){
                    //smsType 验证码类型 1：注册，2：忘记密码
                    this.sendSMS(1);
                }else if (this.routerTitle == "forget") {
                    this.sendSMS(2);
                }
                
            }
        },
        sendSMS(type){
            this.$http.post(this.$server.sendSms,{
                cellphone:this.phone,
                smsType:type,
            }).then( res => {
                if(res.data.status == 200){
                    this.$toast('发送成功,请注意查收')
                    this.$emit("update:phone",this.phone);
                    this.$emit("update:t",2);
                }else {
                    this.clickAble = true;
                }
            })
        },
        onClickLeft(){
            this.$router.go(-1)
        }
    },
    computed:{
        changeColor(){
            return this.phone.length != 11 ? false : true
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
    padding: 1.75rem .9rem .9rem;
    .phone-num{
        border-bottom: 1px solid #EFEFEF;
        line-height: .6rem;
        font-size: .4rem;
        span{
            color: #8E8E8E;
            font-size: .36rem;
        }
        .phone-input{
            margin-left: .35rem;
        }
        input{
            border: none;
            outline: none;
        }
        input::-webkit-input-placeholder{
            color: #CACACA;
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
.must-know{
    margin-top:1rem;
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
</style>