<template>
    <div class="receive-period-wrap" @click="hiddenWrap">
        <div class="receive-period-body" v-if="showBoxIndex==1" @click="stopPro($event)" :class="isLogin?'low':''">
            <p class="friend">你的好友<span>{{nickname}}</span></p>
            <img :src="avatar" class="friend-head"/>
            <p class="des">分享给你的课程《{{courseName}}》第{{sort}}节</p>
            <div class="input-item" v-if="!isLogin" @click="hiddenError('phoneError')">
                <input type="tel" placeholder="请输入您的手机号码" v-model="cellphone" maxlength="11"/>
                <p class="error" v-show="phoneError.length>0">{{phoneError}}</p>
            </div>
            <div class="input-item sms-code" v-if="!isLogin" @click="hiddenError('smsCodeError')">
                <input type="tel" placeholder="请输入手机验证码" v-model="veriCode"/>
                <p class="error" v-show="smsCodeError.length>0">{{smsCodeError}}</p>
                <p @click="sendSms" class="time">{{smsCodeText}}</p>
            </div>
            <a class="submit" @click="submit" :class="could?'can':''">立即领取</a>
            <div class="loading-box" v-if="loading">
                <van-loading />
            </div>
            <div class="close-btn" @click="returnPage"><van-icon name="close"/></div>
        </div>
        <div class="receive-period-body tips1" v-if="showBoxIndex==2">
            <p class="title">{{tip}}</p>
            <p class="friend">你的好友<span>{{nickname}}</span></p>
            <img :src="avatar" class="friend-head"/>
            <p class="des">分享给你的课程《{{courseName}}》第{{sort}}节</p>
            <p class="des">{{des1}}</p>
            <p class="des">{{des2}}</p>
            <a class="submit can" @click="goNext">{{des3}}</a>
        </div>
        <div class="receive-period-body tips2" v-if="showBoxIndex==3">
            <p class="title">领取失败</p>
            <p class="des">{{des4}}</p>
            <a class="submit can" @click="goNextHandle">{{des5}}</a>
        </div>
    </div>
</template>
<script>
import {mapActions,mapState} from 'vuex'
export default {
    data(){
        return{
            nickname:'',
            avatar:'',
            sort:'-',
            isLogin:false,
            cellphone:'',
            veriCode:'',
            phoneError:'',
            smsCodeError:'',
            smsCodeText:'点击获取',
            timer:'',
            loading:false,
            showBoxIndex:1,
            tip:'',
            text:''
        }
    },
    inject:['reload'],
    props:['receivePeriodByInvite','courseName'],
    computed:{
        ...mapState(['receivefriendShareData',]),	
        could(){
            if(this.isLogin){
                return true;
            }else{
                return this.cellphone.length>0&&this.veriCode.length>0
            }
        }
    },
    created(){
        let uInfo = JSON.parse(this.$getCookie('uInfo'));
        if (uInfo && uInfo.accessToken) {
            this.isLogin = true;
        }else {
            this.isLogin = false;
        }
        this.getShareUserInfo();
        this.getSharePeriodList();
        
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            let openId = localStorage.getItem('openId')
            if(!openId){
                sessionStorage.setItem('secondJump','true')
            }
        }
    },
    mounted(){
        
    },
    methods:{
        ...mapActions(['setIsVip',]),
        hiddenWrap(e){
            // this.$emit('update:receivePeriodByInvite',false)
        },
        stopPro(e){
            e.stopPropagation();
        },
        returnPage(){
            let secondJump = sessionStorage.getItem('secondJump')
            if(secondJump&&secondJump=='true'){
                let link = this.$server.inviteFriendDoorwayPage+window.location.search;
                sessionStorage.removeItem('secondJump');
                window.location.href = link 
            }else{
                 this.$emit('update:receivePeriodByInvite',false)
                // this.$router.go(-1);
            }
        },
        /**
         * 隐藏错误提示
         */
        hiddenError(key){
            if(key=='phoneError'){
                this.phoneError = false;
            }else if(key=='smsCodeError'){
                this.smsCodeError = false
            }
        },
        getShareUserInfo(){
            let query = {
                userId:this.receivefriendShareData.friendId
            }
            this.$http.post(this.$server.getShareUserInfo,query).then(res=>{
                if(res.data.status == 200){
                    this.nickname = res.data.content.nickname;
                    this.avatar = res.data.content.avatar;
                }
            })
        },
        /**
         * 判断当前获取的分享的课时是第几节
         */
        getSharePeriodList(){
            let query = {
                courseId:this.receivefriendShareData.friendShareCourseId
            }
            this.$http.post(this.$server.getSharePeriodList,query).then(res=>{
                if(res.data.status==200){
                    let obj = res.data.content.find(item=>item.id==this.receivefriendShareData.friendSharePeriodId)
                    if(obj){
                        this.sort = obj.sort
                    }
                }
            })
        },
        /**
         * 发送验证码
         */
        sendSms(){
            if(this.smsCodeText!='点击获取') return false;
            if(!this.$regExp.phone.test(this.cellphone)){
                this.phoneError = '手机号错误';
                return false;
            }
            let query = {
                cellphone:this.cellphone,
                smsType:7
            }
            this.$http.post(this.$server.getCodeForLoginBySMS,query).then(res=>{
                
            })
            let time = 60;
            this.smsCodeText = time+'s';
            this.timer = setInterval(()=>{
                time--;
                this.smsCodeText = time+'s';
                if(time==0){
                    clearInterval(this.timer);
                    this.smsCodeText = '点击获取'
                }
            },1000)
        },
        /**
         * 提交邀请码
         */
        submit(){
            if(!this.isLogin){
                if(!this.$regExp.phone.test(this.cellphone)){
                    this.phoneError = '手机号错误';
                    return false;
                }
                if(this.veriCode==''){
                    this.smsCodeError = '验证码错误';
                    return false;
                }
            }
            this.loading = true;
            let query = {
                courseId:this.receivefriendShareData.friendShareCourseId,
                periodId:this.receivefriendShareData.friendSharePeriodId,
                sharerId:this.receivefriendShareData.friendId
            }
            if(!this.isLogin){
                query.cellphone = this.cellphone;
                query.veriCode = this.veriCode;
            }
            this.$http.post(this.$server.receiveInvitationSharePeriod,query).then(res=>{
                this.loading = false
                if(res.data.status==200){
                    if(!this.isLogin){
                        let userInfo = {
                            accessToken: res.data.content.accessToken,
                            nickname: res.data.content.nickname,
                            avatar: res.data.content.avatar,
                            userid: res.data.content.id,
                            cellphone:res.data.content.cellphone,
                            isVip:res.data.content.isVip==1?true:false
                        }
                        this.$setCookie("uInfo", JSON.stringify(userInfo));
                        if(res.data.content.isVip==1){
                            this.setIsVip(true);
                        }
                    }
                    this.showBoxIndex=2;
                    this.tip = '领取成功';
                    this.des1 = '已领取成功';
                    this.des2 = '现在你可以观看了';
                    this.des3 = '立即观看'
                }else{
                    if(res.data.message=='领取已达上限'){
                        this.showBoxIndex=2;
                        this.tip = '领取失败';
                        this.des1 = '领取已达上限';
                        this.des2 = '让他分享其他课程给你吧';
                        this.des3 = '去看看其他课程'
                    }else{
                       this.showBoxIndex=3; 
                       this.des4 = res.data.message;
                       if(res.data.message=='已购买该课程'||res.data.message.includes('已领取过')){
                        //    sessionStorage.setItem('friendShareHasBuy','true')
                           this.des5 = '立刻观看'
                       }else{
                           this.des5 = '去看看其他课程'
                       }
                    }
                }
                if(res.data.message.includes('已购买该课程')||res.data.message.includes('已领取过')){
                    let userInfo = {
                        accessToken: res.data.content.accessToken,
                        nickname: res.data.content.nickname,
                        avatar: res.data.content.avatar,
                        userid: res.data.content.id,
                        cellphone:res.data.content.cellphone,
                        isVip:res.data.content.isVip==1?true:false
                    }
                    this.$setCookie("uInfo", JSON.stringify(userInfo));
                    if(res.data.content.isVip==1){
                        this.setIsVip(true);
                    }
                }
            })
        },
        goNext(){
            if(this.des3=='立即观看'){
                this.reload()
            }else{
                window.location.href = window.location.origin
            }
        },
        goNextHandle(){
            if(this.des5=='去看看其他课程'){
                window.location.href = window.location.origin
            }else{
                this.reload()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    input::-webkit-input-placeholder{
        color:#CACACA;
    }
    .receive-period-wrap{
        position: fixed;
        top:0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 100;
        background: rgba(0,0,0,0.7);
        .hidden{
            display: none;
        }
        &.show{
            .receive-period-body{
                transform: translateY(0);
                visibility:visible;
                opacity: 1;
            }
        }
        .receive-period-body{
            position: absolute;
            top:40%;
            left: 50%;
            margin:-2.85rem 0 0 -2.85rem;
            border-radius: 0.2rem;
            background: #fff;
            width: 5.7rem;
            transition: all 0.3s;
            padding:0.4rem;
            // overflow: hidden;
            &.tips1{
                text-align: center;
                .des{
                    margin:0;
                    line-height: 0.48rem;
                }
                .submit{
                    margin:0.2rem auto 0 auto;
                }
            }
            &.tips2{
                // height: 4.2rem;
                padding: 0.6rem;
                .des{
                    margin:0.5rem 0 0.8rem 0;
                }
            }
            &.low{
                // height: 5rem;
                padding: 0.6rem;
            }
            .title{
                text-align: center;
                font-size: 0.32rem;
                color:#000000;
                font-weight: bold;
                margin-bottom:0.3rem;
            }
            .friend{
                font-size: 0.28rem;
                text-align: center;
                color:#CACACA;
                span{
                    color: #000;
                }
            }
            .friend-head{
                width: 0.85rem;
                height: 0.85rem;
                border-radius: 50%;
                display: block;
                margin:0.4rem auto;
            }
            .des{
                font-size: 0.26rem;
                color:#6A6A6A;
                margin-bottom:0.3rem;
                text-align: center;
            }
            .input-item{
                border-bottom:1px solid #EFEFEF;
                padding: 0.2rem 0;
                position: relative;
                font-size: 0.28rem;
                .error{
                    color:#B4272D;
                    position: absolute;
                    width: 100%;
                    z-index: 2;
                    padding:0.3rem 0.15rem;
                    top:0;
                    left: 0;
                    background: #fff;
                }
                &.only{
                    margin:1.2rem 0;
                }
                input{
                    font-size: 0.28rem;
                    width: 100%;
                    border:none;
                    outline: none;
                    padding:0.1rem 0.15rem;
                }
                &.sms-code{
                    input{
                        display: inline-block;
                        width: calc(100% - 1.5rem);
                        vertical-align: middle;
                    }
                    .time{
                        display: inline-block;
                        width: 1.4rem;
                        vertical-align: middle;
                        color:#A12500;
                        font-size: 0.28rem;
                        padding: 0.1rem 0;
                        text-align: center;
                    }
                    .error{
                        width:70%;
                    }
                }
            }
            .submit{
                display: block;
                width: 4rem;
                height: 0.8rem;
                line-height: 0.8rem;
                margin: 0.6rem auto 0 auto;
                text-align: center;
                color:#fff;
                background: #B4272D;
                font-size: 0.32rem;
                letter-spacing: 1px;
                border-radius: 25px;
                background:rgba(202,202,202,1);
                box-shadow:0px 4px 12px 0px rgba(166,166,166,0.3);
                &.can{
                    background: #B4272D;
                    box-shadow: 0px 4px 12px 0px rgba(180,39,45,0.3);
                }
            }
            .close-btn{
                position: absolute;
                top: -0.8rem;
                right: -0.2rem;
                padding: 0.2rem;
                i{
                    font-size: 0.48rem;
                    color:#fff;
                }
            }
        }
        .loading-box{
            height: 100%;
            width: 100%;
            top:0;
            left: 0;
            position: absolute;
            background: rgba(255,255,255,0.7);
            .van-loading{
                position: absolute;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 1rem;
                height: 1rem;
            }
        }
    }
</style>
