<template>
    <div class="login-box" @click.stop="">
        <p class="title">登 录</p>
        <div class="item">
            <div class="item-box phone">
                <label>手机号</label>
                <input type="tel" placeholder="请输入手机号" maxlength="11" v-model="cellphone"/>
            </div>
        </div>
        <div class="item">
            <div class="item-box code">
                <label>验证码</label>
                <input type="tel" placeholder="输入验证码" maxlength="6" v-model="code"/>
            </div>
            <p class="code-btn" :class="{'disabled':codeText!='获取验证码'}"  @click="sendSms">{{codeText}}</p>
        </div>
        <div class="btn-box">
            <div class="login-btn" @click="loginEvent">登录</div>
            <div class="cancel-btn" @click="cancelEvent">取消</div>
        </div>
    </div>
</template>
<script>
import tools from '../utils/tools'
import {store,mutations} from '../store'
export default {
    data(){
        return{
            httpFlag:false,
            cellphone:'',
            code:'',
            codeTimer:null,
            codeText:'获取验证码'
        }
    },
    props:['status','from','channelId'],
    methods:{
        setUserInfo:mutations.setUserInfo,
        /**
         * 发短信
         */
        async sendSms(){
            if(this.codeText!='获取验证码') return false;
            if(this.cellphone.length!=11){
                this.$toast('请输入正确的手机号')
                return;
            }
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                cellphone:this.cellphone,
                smsType:1,
                tokenType:2
            }
            const res = await this.$http.post(this.$server.sendSms,query);
            this.$toast.clear()
            if(res.data.status==200){
                let time = 60;
                this.codeText = time +'s'
                this.codeTimer = setInterval(()=>{
                    time--;
                    this.codeText = time +'s'
                    if(time==0){
                        clearInterval(this.codeTimer);
                        this.codeText = '获取验证码'
                    }
                },1000) 
            }
        },
        /**
         *  登录
         */
        async loginEvent(){
            if(this.cellphone.length!=11){
                this.$toast('请输入正确的手机号')
                return;
            }
            if(this.code.length!=6){
                this.$toast('无效的验证码')
                return;
            }
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            this.httpFlag = true;
            let query = {
                cellphone:this.cellphone,
                tokenType:2,
                code:this.code,
                registerSource:3,
                requestType:1,
                channelId:this.channelId,
                activityName:'cgt',
            }
            let activityShareUserId = tools.getQueryString('activityShareUserId')
            if(activityShareUserId){
                query.activityShareUserId = Number(activityShareUserId);
            }
            const res = await this.$http.post(this.$server.login,query);
            this.$toast.clear()
            this.httpFlag = false;
            if(res.data.status==200){
                let userInfo = {
                    accessToken: res.data.content.accessToken,
                    nickname: res.data.content.nickname,
                    avatar: res.data.content.avatar,
                    userid: res.data.content.id,
                    cellphone:res.data.content.cellphone
                }
                this.setUserInfo(userInfo)
                this.$setCookie("uInfo", JSON.stringify(userInfo));
                this.$emit('update:status',this.from)
            }else{
                this.$toast(res.data.message)
            }
        },
        cancelEvent(){
            if(this.httpFlag) return;
            this.$emit('update:status',-1)
        }
    },
    beforeDestroy(){
        clearInterval(this.codeTimer);
    }
}
</script>
<style lang="scss" scoped>
    .login-box{
        position: absolute;
        top:40%;
        left: 50%;
        width: 5.9rem;
        margin-left: -2.95rem;
        margin-top:-2.3rem;
        min-height: 4.65rem;
        border-radius: 0.2rem;
        background: #fff;
        padding:0.4rem;
        .title{
            font-size: 0.4rem;
            font-weight: bold;
            text-align: center;
            margin-bottom:0.48rem;
        }
        .item{
            margin-bottom:0.2rem;
            font-size: 0;
            position: relative;
            .item-box{
                border:1px solid #dfdfdf;
                border-radius: 0.5rem;
                padding:0.15rem 0.3rem;
                font-size: 0;
                &.code{
                    width: 3.48rem;
                    display: inline-block;
                    vertical-align: middle;
                    input{
                        width: 1.5rem;
                    }
                }
                &.phone{
                    input{
                        width: 3rem;
                    }
                }
                label{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 0.26rem;
                    margin-right: 0.3rem;
                    line-height: 0.4rem;
                    height: 0.4rem;
                }
                input{
                    border:none;
                    outline: none;
                    background: none;
                    line-height: 0.4rem;
                    height: 0.4rem;
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 0.26rem;
                }
            }
            .error{
                font-size: 0.24rem;
                color:#D11008;
                padding:0.1rem 0 0 0.3rem;  
            }
            .code-btn{
                position: absolute;
                font-size: 0.26rem;
                color:#D11008;
                cursor: pointer;
                right: 0;
                top:0.15rem;
                text-decoration: underline;
                width: 1.42rem;
                text-align: center;
                line-height: 0.5rem;
                height: 0.5rem;
                &.disabled{
                    color:#999;
                }
            }
        }
        .btn-box{
            font-size: 0;
            margin-top:0.4rem;
            .login-btn{
                height: 0.82rem;
                line-height: 0.82rem;
                border-radius: 0.4rem;
                background: linear-gradient(-90deg, #C30D23 0%, #F74C60 100%);
                color:#fff;
                font-size: 0.3rem;
                text-align: center;
                width: 2.3rem;
                display: inline-block;
                vertical-align: middle;
                float: left;
            }
            .cancel-btn{
                width: 2.3rem;
                display: inline-block;
                vertical-align: middle;
                color:#666;
                border: 0.02rem solid #666666;
                border-radius: 0.4rem;
                height: 0.82rem;
                line-height: 0.82rem;
                font-size: 0.3rem;
                text-align: center;
                margin-left: 0.4rem;
                float: right;
            }
        }
    }
</style>