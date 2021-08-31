<template>
    <div class="bind-phone-page" @keydown="pressKeyDown($event)">
        <div class="page-h clearfix">
            <div class="l">
                <i class="el-icon-back" @click="$router.go(-1)"></i>
            </div>
            <div class="r">
                <span @click="toPage">{{userData.type?'跳过':'关闭'}}</span>
            </div>
        </div>
        <p class="title">{{tips}}</p>
        <div class="block clearfix">
            <MyBox :className="'cellphone medium'">
                <div slot="content" >
                    <i></i>
                    <input class="my-input medium" type="text" placeholder="请输入您实名认证的手机号" v-model="cellphone" maxlength="11" autocomplete="off"/>
                </div>
            </MyBox>
            <div class="sms-btn" :class="{'disable':!smsBtnState,'not-allowed':countDownText!='发送验证码'}" slot="content" @click="sendSms">{{countDownText}}</div>
        </div>
        <div class="block clearfix">
            <MyBox :className="'code medium'">
                <input class="my-input medium" type="text" placeholder="收到的验证码" slot="content" v-model="code" maxlength="6" autocomplete="off"/>
            </MyBox>
            <div class="bind-btn-box" :class="{'disable':!bindBtnState}">
                <button @click="bindPhone">确认关联</button>
            </div>
        </div>
        <div class="block error-tips-box">
            <div class="error-tips" v-show="errorText.length>0">
                <i></i>
                <p>{{errorText}}</p>
            </div>
        </div>
    </div>    
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import MyBox from '~/components/MyBox.vue'
import {mapState,mapActions} from 'vuex'
@Component({
    components:{MyBox},
    computed:{
        ...mapState(['userData']),
        smsBtnState(){
            return this.cellphone.length>=11
        },
        bindBtnState(){
            return this.cellphone.length>=11&&this.code.length==6
        }
    },
    methods:{
        ...mapActions(['setUserData','setReceiveCouponClick'])
    },
})
export default class Auth extends Vue{
    errorText = ''
    cellphone:string = ''
    code:string = ''
    countDownText:String = '发送验证码'
    timer:any = null
    tips = '---用户“---”你好，请验证你的手机号'
    head(){
        return{
            title:'绑定手机 | 学国学网'
        }
    }
    created(){
        if(this.userData.type){
            if(this.userData.type==1){
                this.tips = `微信用户“${this.userData.nickname}”你好，请验证你的手机号`
            }else if(this.userData.type==2){
                this.tips = `微博用户“${this.userData.nickname}”你好，请验证你的手机号`
            }else if(this.userData.type==3){
                this.tips = `QQ用户“${this.userData.nickname}”你好，请验证你的手机号`
            }
        }else{
            this.tips = `用户你好，请验证你的手机号`
        }
    }
    async sendSms(){
        if(!this.smsBtnState) return false;
        if(!this.$regExp.phone.test(this.cellphone)){
            this.errorText = '请输入正确的手机号码';
            return;
        }
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
        let smsQuery = {
            params:{
                cellphone:this.cellphone,
                tokenType:3,
                smsType:1
            }
        }
        let response =await this.$axios.$get(this.$server.getSmsCode,smsQuery)
        if(response.status!=200){
            return;
        }
    }
     /**
     * 回车事件
     */
    pressKeyDown(e:any){
        if(e.target.nodeName.toLocaleLowerCase()=='input'&&e.keyCode=='13'){
            this.bindPhone()
        }
    }
    toPage(){
        if(this.userData.type){
            this.$router.push('/home')
        }else{
            this.$router.go(-1)
        }
    }
    async bindPhone(){
        if(!this.bindBtnState) return;
        this.errorText = ''
        if(!this.$regExp.phone.test(this.cellphone)){
            this.errorText = '请输入正确的手机号码';
            return;
        }
        if(this.code.length<6){
            this.errorText = '请输入正确的验证码';
            return;
        }
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('login-page')[0],
            background:'rgba(255,255,255,0)'
        });
        let query = {
            cellphone:this.cellphone,
            code:this.code,
            tokenType:'3',
            userId:this.userData.userId
        }
        let res = await this.$axios.$post(this.$server.relatedCellphone,query)
        loadingInstance.close()
        if(res.status==200){
            this.$message({
                message: '手机号关联成功！',
                type: 'success'
            });
            let userData = Object.assign({},res.content,{cellphone:this.cellphone})
            this.setUserData(userData)
            this.$setCookie('xgx_user',JSON.stringify(userData));
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
            this.errorText = res.message;
            return;
        }
    }
}
</script>
<style lang="scss" scoped>
    .bind-phone-page{
        position:absolute;
        top:55%;
        left:50%;
        transform: translate(-50%,-50%);
        text-align: center;
        width:590px;
        height:382px;
        background:rgba(255,255,255,1);
        border-radius:6px;
        padding: 30px 40px;
        .page-h{
            .l{
                float: left;
                i{
                    font-size: 24px;
                }
            }
            .r{
                float: right;
                span{
                    font-size:16px;
                    font-family:MicrosoftYaHei;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    cursor: pointer;
                }
            }
        }
        .title{
            font-size:20px;
            font-family:MicrosoftYaHei;
            letter-spacing: 1px;
            color:rgba(51,51,51,1);
            line-height:48px;
            margin:40px 0 30px 0;
        }
        .block{
            margin:0 auto 20px auto;
            width:385px;
            font-size: 0;
            .cellphone,.code{
                display: inline-block;
                vertical-align: middle;
            }
            .my-input{
                padding: 0 20px;
            }
            .cellphone{
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
            .sms-btn{
                display: inline-block;
                vertical-align: middle;
                width: 110px;
                height: 40px;
                margin-left: 15px;
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
            .bind-btn-box{
                display: inline-block;
                vertical-align: middle;
                margin-left: 15px;
                button{
                    width:110px;
                    height:44px;
                    line-height: 44px;
                    font-size: 14px;
                    color:#fff;
                    background: #C30D23;
                    border-radius: 5px;
                    outline: none;
                    border:none;
                    cursor: pointer;
                    &:hover{
                        background: #d6394c;
                    }
                }
                &.disable{
                    button{
                        background: #999999;
                        cursor: not-allowed;
                        &:hover{
                            background: #999999;
                        }
                    }
                }
            }
            &.error-tips-box{
                width: 388px;
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
                    }
                    i{
                        height: 22px;
                        width: 22px;
                        display: inline-block;
                        vertical-align: middle;
                        background: url('../../../../assets/images/error_icon.png')no-repeat 50% 50% /cover;
                    }
                }
            }
        }
    }
</style>
