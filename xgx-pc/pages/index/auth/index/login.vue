<template>
    <div class="login-page" @keydown="pressKeyDown($event)">
        <div class="page-h clearfix">
            <div class="l">
                <span @click="$router.push('/auth/register')">注册新账号</span>
            </div>
            <div class="r">
                <span @click="$router.push('/auth/smsLogin')">短信登录</span>
            </div>
        </div>
        <p class="title">学国学网登录</p>
        <div class="pwd-login-box">
            <div class="block">
                <MyBox :className="'phone'">
                    <div slot="content">
                        <i></i>
                        <input class="my-input" type="text" placeholder="手机号" v-model="userName" maxlength="11" autocomplete="off"/>
                    </div>
                </MyBox>
            </div>
            <div class="block">
                <MyBox :className="'password'">
                    <div slot="content">
                        <i></i>
                         <input class="my-input" :type="pwdShow?'text':'password'" placeholder="密码" v-model="password" ref="pwdInput" autocomplete="off" maxlength="20"/>
                    </div>
                </MyBox>
                <i class="eye-icon" :class="pwdShow?'open':'close'" @click="pwdShow=!pwdShow"></i>
            </div>
            <div class="block other-page clearfix">
                <div class="error-tips" v-show="errorText.length>0">
                    <i></i>
                    <p>{{errorText}}</p>
                </div>
                <nuxt-link to="/auth/forget" class="to-forget">忘记密码？</nuxt-link>
            </div>
            <div class="block login-button clearfix">
                <button class="primary-btn" @click="toLogin">登录</button>
            </div>
            <div class="third-party-login clearfix">
                <div class="third-party-icons">
                    <div class="item wx" @click="toWx">
                        <i></i>
                    </div>
                    <div class="item wb" @click="toWeibo">
                        <i></i>
                    </div>
                    <!-- <div class="item qq">
                        <i></i>
                    </div> -->
                </div>
                <p>第三方账号登录</p>
            </div>
        </div>
    </div>    
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import MyBox from '~/components/MyBox.vue'
import { setTimeout } from 'timers';
import {mapState,mapActions} from 'vuex'
import Base64Obj from 'js-base64'

declare var document: Document;
@Component({
    components:{MyBox},
    methods:{
        ...mapActions(['setUserData','setReceiveCouponClick'])
    },
})
export default class Auth extends Vue{
    userName:string = ''
    password:string = ''
    errorText = ''
    pwdShow = false
    head(){
        return{
            title:'密码登录 | 学国学网'
        }
    }
    mounted(){

    }
    /**
     * 回车事件
     */
    pressKeyDown(e){
        if(e.target.nodeName.toLocaleLowerCase()=='input'&&e.keyCode=='13'){
            this.toLogin()
        }
    }
    /**
     * 去登录
     */
    async toLogin(){
        this.errorText = '';
        if(this.userName==''){
            this.errorText = '请输入登录手机号';
            return;
        }
        if(!this.$regExp.phone.test(this.userName)){
            this.errorText = '请输入正确的手机号码';
            return;
        }
        if(this.password==''){
            this.errorText = '密码不能为空';
            return;
        }
        if(!this.$regExp.pwd.test(this.password)||this.password.length<7){
            this.errorText = '密码长度7-20位，须包含数字、字母(大小写)至少2种或以上元素';
            return;
        }
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('login-page')[0],
            background:'rgba(255,255,255,0)'
        });
        let Base64 = Base64Obj.Base64;
        let query = {
            userName:this.userName,
            password:Base64.encode(this.password)
        }
        let res = await this.$axios.$post(this.$server.loginByPwd,query)
        loadingInstance.close();
        if(res.status==200){
            this.setUserData(res.content)
            this.$setCookie('xgx_user',JSON.stringify(res.content))
            let redirectUrl = sessionStorage.getItem('redirectUrl');
            if(redirectUrl){
                if(redirectUrl.includes('doubleEleven')){
                    this.setReceiveCouponClick(true)
                }
                sessionStorage.removeItem('redirectUrl');
                this.$router.push(redirectUrl)
            }else{
                this.$router.push('/home')
            }
        }else{
            if(res.message=='密码错误'){
                this.errorText = '请输入正确的密码';
            }else if(res.message=='用户不存在'){
                this.errorText = res.message;
                setTimeout(()=>{
                    this.$router.push({
                        path:'/auth/register',
                        query:{
                            cellphone:this.userName
                        }
                    })
                },1500)
            }else{
                this.$message.error(res.message)
            }
        }
    }
    /**
     * 微信三方登录
     */
    toWx(){
        let appid = window.location.origin == 'https://dev.xueguoxue.com'?'wx70fe48f3464fbf01':'wx125a8e7e58365c87';
        let redirect_uri = encodeURIComponent(window.location.origin+'/auth/wx')
        let url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`
        window.location.href = url;
    }
    /**
     * 微博三方登录
     */
    toWeibo(){
        let client_id = window.location.origin == 'https://dev.xueguoxue.com'?'1769601738':'2121860155'
        let redirect_uri = window.location.origin+'/auth/weibo'
        let url = `https://api.weibo.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}`
        window.location.href = url;
    }
}
</script>
<style lang="scss" scoped>
    .login-page{
        position:absolute;
        top:58%;
        left:50%;
        transform: translate(-50%,-50%);
        text-align: center;
        width:590px;
        height:500px;
        background:rgba(255,255,255,1);
        border-radius:6px;
        padding: 30px 40px;
        .page-h{
            .l{
                float: left;
            }
            .r{
                float: right;
            }
            span{
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(51,51,51,1);
                cursor: pointer;
            }
        }
        .title{
            font-size:30px;
            font-family:MicrosoftYaHei;
            letter-spacing: 1px;
            color:rgba(51,51,51,1);
            line-height:48px;
            margin:40px 0 30px 0;
        }
        .block{
            position: relative;
            font-size: 0;
            &.other-page{
                width: 390px;
                margin:0 auto;
                .error-tips{
                    float: left;
                    color:#AD0015;
                    font-size: 0;
                    p{
                        display: inline-block;
                        vertical-align: middle;
                        font-size: 14px;
                        line-height: 22px;
                        margin-left: 10px;
                        width: 280px;
                        text-align: left;
                    }
                    i{
                        height: 22px;
                        width: 22px;
                        display: inline-block;
                        vertical-align: top;
                        background: url('../../../../assets/images/error_icon.png')no-repeat 50% 50% /cover;
                    }
                }
                a{
                    float: right;
                    font-size:14px;
                    line-height: 22px;
                    height: 22px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                }
            }
            .phone,.password{
                margin-bottom:20px;
                position: relative;
                .my-input{
                    padding: 0 40px!important;
                }
                i{
                    display: block;
                    width: 11px;
                    height: 14px;
                    position: absolute;
                    top:50%;
                    margin-top:-7px;
                    left:22px;
                    z-index: 2;
                }
            }
            .phone i{
                height: 15px;
                // top:13.5px;
                background: url('../../../../assets/images/phone_icon.png')no-repeat 50% 50% /cover;
            }
            .password i{
                background: url('../../../../assets/images/password_icon.png')no-repeat 50% 50% /cover;
            }
        }
        .login-button{
            width: 388px;
            margin:20px auto 0 auto;
            button{
                 letter-spacing: 10px;
            }
        }
        .third-party-login{
            width: 388px;
            margin:29px auto 0 auto;
            .third-party-icons{
                float: left;
                font-size: 0;
            }
            .item{
                text-align: center;
                display: inline-block;
                vertical-align: middle;
                margin-right: 18px;
                &.wx i{
                    background: url('../../../../assets/images/auth_wx_icon.png')no-repeat 50% 50% / cover;
                }
                &.wb i{
                    background: url('../../../../assets/images/auth_weibo_icon.png')no-repeat 50% 50% / cover;
                }
                &.qq i{
                    background: url('../../../../assets/images/auth_qq_icon.png')no-repeat 50% 50% / cover;
                }
                i{
                    width: 43px;
                    height: 43px;
                    display: block;
                }
                &:hover{
                    i{
                        &::after{
                            content:'';
                            display: block;
                            background: rgba(0,0,0,.1);
                            height: 43px;
                            width: 43px;
                            border-radius: 50%;
                        }
                    }
                }
            }
            p{
                float: right;
                color:#333333;
                line-height: 43px;
                height: 43px;
            }
        }
        .eye-icon{
            position: absolute;
            width: 15px;
            height: 11px;
            top:15px;
            right:78px;
            display: block;
            z-index: 2;
            &.open{
                background: url('../../../../assets/images/eye_open_icon.png')no-repeat 50% 50% / cover;
            }
            &.close{
                background: url('../../../../assets/images/eye_close_icon.png')no-repeat 50% 50% / cover;
            }
        }
    }
</style>
