<template>
    <div class="forget-pwd-page" @keydown="pressKeyDown($event)">
        <div class="page-h clearfix">
            <i class="el-icon-back" @click="$router.go(-1)"></i>
        </div>
        <p class="title">忘记密码</p>
        <div class="steps-box">
            <span class="step-item" :class="{'light':step>=1}">1</span>
            <span class="step-bar" :class="{'light':step>=2}"></span>
            <span class="step-item" :class="{'light':step>=2}">2</span>
            <span class="step-bar" :class="{'light':step>=3}"></span>
            <span class="step-item" :class="{'light':step>=3}">3</span>
            <span class="step-bar" :class="{'light':step>=4}"></span>
            <span class="step-item" :class="{'light':step>=4}">4</span>
        </div>
        <div class="content-box">
            <div class="step1" v-if="step==1">
                <div class="block">
                    <MyBox :className="'phone'">
                        <div slot="content">
                            <i></i>
                            <input class="my-input" type="text" placeholder="请输入手机号码"  v-model="cellphone"  maxlength="11" autocomplete="off"/>
                        </div>
                    </MyBox>
                </div>
                <div class="block clearfix">
                    <MyBox :className="'img-code medium'">
                        <input class="my-input medium" type="text" placeholder="请输入右侧图形验证码" slot="content" v-model="imgCode" maxlength="6" autocomplete="off" />
                    </MyBox>
                     <img :src="`https://${imgCodeUrl}`" alt="图形验证码" class="img-code-box" slot="content" @click="getImgCode"/>
                </div>
            </div>
            <div class="step2" v-if="step==2">
                <p class="step-tips">要找回密码的手机号</p>
                <div class="block">
                    <MyBox :className="'phone'">
                        <div slot="content">
                            <i></i>
                            <input class="my-input disable" type="text" placeholder="要找回密码的手机号" slot="content" :value="cellphone" readonly/>
                        </div>
                    </MyBox>
                </div>
                <div class="block clearfix">
                    <MyBox :className="'sms-code medium'" >
                        <input class="my-input medium" type="text" placeholder="收到的验证码" slot="content" v-model="code" maxlength="6" autocomplete="off"/>
                    </MyBox>
                   <div class="sms-btn" :class="{'disable':!smsBtnState,'not-allowed':countDownText!='发送验证码'}" slot="content" @click="sendSms">{{countDownText}}</div>
                </div>
            </div>
            <div class="step3" v-if="step==3">
                <p class="step-tips">要找回密码的手机号</p>
                <div class="block">
                    <MyBox :className="'phone'">
                        <div slot="content">
                            <i></i>
                            <input class="my-input disable" type="text" placeholder="要找回密码的手机号" :value="cellphone" readonly/>
                        </div>
                    </MyBox>
                </div>
                <div class="block clearfix">
                    <MyBox :className="'new-pwd'" >
                        <div slot="content">
                            <i></i>
                            <input class="my-input" :type="pwdShow?'text':'password'" placeholder="新的密码"  v-model="password" maxlength="20" autocomplete="off" />
                        </div>
                    </MyBox>
                    <i class="eye-icon" :class="pwdShow?'open':'close'" @click="pwdShow=!pwdShow"></i>
                </div>
            </div>
            <div class="step4" v-if="step==4">
                <div class="block reset-success">
                   <p>重置成功</p>
                </div>
            </div>
            <div class="block next-btn-box" :class="step==4?'t':''">
                <button class="primary-btn" @click="goNext">{{step==4?'返回登录':'下一步'}}</button>
            </div>
            <div class="block error-tips-box">
                <div class="error-tips" v-show="errorText.length>0">
                    <i></i>
                    <p>{{errorText}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import MyBox from '~/components/MyBox.vue'
import { NuxtContext } from 'nuxt'
import server from '~/api/index'
import Base64Obj from 'js-base64'
@Component({
    components:{MyBox},
    async asyncData({app,query}:NuxtContext):Promise<any>{
        let res = await app.$axios.$get(server.getImgCode,{})
        return {
            imgCodeUrl:res.content.codeUrl
        }
    },
    computed:{
        smsBtnState(){
            return this.cellphone.length>=11
        }
    },
})
export default class Forget extends Vue{
    step:number = 1
    imgCodeUrl:string = ''
    errorText = ''
    cellphone:string = ''
    imgCode:string = ''
    code:string = ''
    password:string = ''
    countDownText:String = '发送验证码'
    timer:any = null
    pwdShow:boolean = false
    head(){
        return{
            title:'忘记密码 | 学国学网'
        }
    }
    /**
     * 获取图形验证码
     */
    async getImgCode(){
        let res = await this.$axios.$get(this.$server.getImgCode,{})
        if(res.status==200){
            this.imgCodeUrl = res.content.codeUrl;
            return res.content.codeUrl;
        }
    }
    /**
     * 回车事件
     */
    pressKeyDown(e:any){
        if(e.target.nodeName.toLocaleLowerCase()=='input'&&e.keyCode=='13'){
            this.goNext()
        }
    }
    // getVal(e){
    //     this.password = this.password.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g,'')
    // }
    /**
     * 发送验证码
     */
    async sendSms(){
        if(!this.smsBtnState) return false;
        if(this.countDownText != '发送验证码') return false;
        let time = 60;
        this.countDownText = `${time}s重新发送`;
        this.timer = setInterval(()=>{
            if(time<=1){
                this.countDownText = '发送验证码';
                clearInterval(this.timer);
            }else{
                time--;
                this.countDownText = `${time}s重新发送`;
            }
        },1000)
        let query = {
            params:{
                cellphone:this.cellphone,
                tokenType:3,
                smsType:1
            }
        }
        let res =await this.$axios.$get(this.$server.getSmsCode,query)
    }
    /**
     * 下一步
     */
    async goNext(){
        this.errorText = ''
        if(this.step==1){
            if(this.cellphone==''){
                this.errorText = '请输入登录手机号';
                return;
            }
            if(!this.$regExp.phone.test(this.cellphone)){
                this.errorText = '请输入正确的手机号码';
                return;
            }
            if(this.imgCode==''){
                this.errorText = '请输入图形验证码';
                return;
            }
            let loadingInstance = this.$loading.service({
                target:document.getElementsByClassName('content-box')[0],
                background:'rgba(255,255,255,0)'
            });
            let data = {
                code:this.imgCode,
                codeUrl:this.imgCodeUrl
            }
            let result = await this.$axios.$post(this.$server.verifyImgCode,data)
            loadingInstance.close()
            if(result.status==500){
                this.errorText = result.message;
                this.imgCode = '';
                this.getImgCode();
                return;
            }
            this.step++;
            return;
        }else if(this.step==2){
            if(this.code.length<6){
                this.errorText = '请输入正确的验证码';
                return;
            }
            let loadingInstance = this.$loading.service({
                target:document.getElementsByClassName('content-box')[0],
                background:'rgba(255,255,255,0)'
            });
            let query = {
                cellphone:this.cellphone,
                code:this.code,
                tokenType:'3'
            }
            let res = await this.$axios.$post(this.$server.verifySmsCode,query)
            loadingInstance.close()
            if(res.status == 200){
                this.step++;
                return;
            }else{
                this.errorText = res.message;
                return;
            }
        }else if(this.step==3){
            if(this.password==''){
                this.errorText = '密码不能为空';
                return;
            }
            if(!this.$regExp.pwd.test(this.password)||this.password.length<7){
                this.errorText = '密码长度7-20位，须包含数字、字母(大小写)至少2种或以上元素';
                return;
            }
            let reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g
            if(reg.test(this.password)){
                this.errorText = '密码长度7-20位，须包含数字、字母(大小写)至少2种或以上元素';
                return;
            }
            let loadingInstance = this.$loading.service({
                target:document.getElementsByClassName('content-box')[0],
                background:'rgba(255,255,255,0)'
            });
            let Base64 = Base64Obj.Base64;
            let query = {
                cellphone:this.cellphone,
                tokenType:'3',
                code:this.code,
                password:Base64.encode(this.password)
            }
            let res = await this.$axios.$post(this.$server.changePassword,query)
            loadingInstance.close()
            if(res.status==200){
                this.step++;
                return;
            }
        }else if(this.step==4){
            this.$router.push('/auth/login')
        }
    }
}
</script>
<style lang="scss" scoped>
    .none{
        display: none;
    }
    .forget-pwd-page{
        position:absolute;
        top:56%;
        left:50%;
        transform: translate(-50%,-50%);
        text-align: center;
        width:590px;
        height:564px;
        background:rgba(255,255,255,1);
        border-radius:6px;
        padding: 30px 40px;
        .page-h{
            text-align: left;
            i{
                font-size: 24px;
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
        .steps-box{
            margin:38px 0 52px 0;
            font-size: 0;
            span{
                vertical-align: middle;
                display: inline-block;
                &.step-item{
                    height: 30px;
                    width:30px;
                    line-height: 30px;
                    background:#999999;
                    color:#fff;
                    font-size: 18px;
                    border-radius: 50%;
                    &.light{
                        transition: all 0.3s;
                        background: #C30D23;
                    }
                }
                &.step-bar{
                    width: 80px;
                    height: 1px;
                    background: #999;
                    position: relative;
                    &::after{
                        content:'';
                        width: 0;
                        height: 1px;
                        position: absolute;
                        z-index: 2;
                        top:0;
                        left: 0;
                        background: #C30D23;
                    }
                    &.light{
                        &::after{
                            width: 80px;
                            transition: width 0.3s;
                        }
                    }
                }
            }
        }
        .content-box{
            position: relative;
            .step-tips{
                position: absolute;
                top:-30px;
                left: 60px;
                color:#333333;
                font-size: 14px;
            }
            .block{
                margin:0 auto 20px auto;
                width:385px;
                position: relative;
                .my-input{
                    padding: 0 20px;
                }
                .phone{
                    .my-input{
                        padding: 0 20px 0 40px;
                    }
                    i{
                        display: block;
                        width: 11px;
                        height: 15px;
                        position: absolute;
                        top:50%;
                        margin-top:-7px;
                        left:22px;
                        z-index: 2;
                        background: url('../../../../assets/images/phone_icon.png')no-repeat 50% 50% /cover;
                    }
                }
                .new-pwd{
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
                        background: url('../../../../assets/images/password_icon.png')no-repeat 50% 50% /cover;
                    }
                }
                .img-code,.sms-code{
                    float: left;
                    margin-right: 20px;
                    .my-input,.error{
                        width: 260px;
                    }
                }
                .new-pwd{
                    .my-input{
                        padding: 0 40px 0 30px;
                    }
                }
                .img-code-box,.sms-code-box{
                    float: left;
                    width: 105px;
                    height: 40px;
                    line-height: 36px;
                    color:#fff;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .sms-btn{
                    display: inline-block;
                    vertical-align: middle;
                    width: 105px;
                    height: 40px;
                    cursor: pointer;
                    text-decoration:underline;
                    line-height: 40px;
                    font-size: 14px;
                    &.disable{
                        color:#333333;
                        cursor: not-allowed;
                    }
                    &.not-allowed{
                        cursor: not-allowed;
                        color:#999;
                    }
                }
                &.next-btn-box{
                    margin:30px auto 20px auto;
                    width: 385px;
                    &.t{
                        margin-top:10px;
                    }
                }
                &.error-tips-box{
                    width: 385px;
                    margin:0 auto;
                    .error-tips{
                        float: left;
                        color:#AD0015;
                        font-size: 0;
                        p{
                            display: inline-block;
                            vertical-align: top;
                            font-size: 14px;
                            line-height: 22px;
                            margin-left: 10px;
                            width: 350px;
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
                }
                &.reset-success{
                    margin:80px auto;
                }
                .eye-icon{
                    position: absolute;
                    width: 15px;
                    height: 11px;
                    top:15px;
                    right:18px;
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
        }
    }
</style>
