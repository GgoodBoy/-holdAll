<template>
    <div class="receive-page" v-show="init">
        <img :src="bgd" class="bgd"/>
        <div class="content">
            <div class="section1">
                <p class="title">领取条件:</p>
                <div class="item">
                    <p class="text">成功购买《菜根谭》课程</p>
                    <p class="btn" @click="btn1Event" :class="{'disabled':buyCourse!=0}">{{buyCourse>=0?buyCourse==1?'已完成':'未完成/去购课':''}}</p>
                </div>
                <div class="item">
                    <p class="text">成功邀请一名好友注册</p>
                    <p class="btn" @click="btn2Event" :class="{'disabled':signUp!=0}">{{signUp>=0?signUp==1?'已完成':'未完成/去邀约':''}}</p>
                </div>
            </div>
            <div class="section2" :class="{'normal':buyCourse===1&&signUp===1}">
                <div class="shade" v-if="buyCourse===0||signUp===0"></div>
                <p class="title">收货地址:</p>
                <div class="item">
                    <p class="des">地址<i></i></p>
                    <span>:</span>
                    <p class="text" v-if="receiveBookFlag">{{receptAddress}}</p>
                    <textarea v-else v-model="receptAddress"></textarea>
                </div>
                <template v-if="httpFlag">
                    <template v-if="!receiveBookFlag">
                        <div class="item">
                            <p class="des">收件人<i></i></p>
                            <span>:</span>
                            <input type="text" v-model="receptName"/>
                        </div>
                        <div class="item">
                            <p class="des">电话<i></i></p>
                            <span>:</span>
                            <input type="tel" maxlength="11" v-model="receptCellphone"/>
                        </div>
                        <p class="tips">
                            注意：请添加真实的收货信息，如因地址不详或收件人信息不准确，造成的投递失败，将视为自动放弃。信息提交后不能修改，请核对个人信息。
                        </p>
                    </template>
                </template>
            </div>
            <div class="receive-btn" :class="{'disabled':disabled,'received':receiveBookFlag}" role="button" @click="receiveBook">{{receiveBookFlag?'已领取':'领取'}}</div>
        </div>
    </div>
</template>
<script>
import bgd from '@/assets/image/receive_bgd.png'
import env from '../../config/prod.env'
import tools from '../utils/tools'
import {store,mutations} from '../store'
export default {    
    data(){
        return{
            init:false,
            courseId:878,
            channelId:'',
            activityName:'cgt',
            bgd:bgd,
            buyCourse:-1,
            signUp:-1,
            receiveBookFlag:false,
            userInfo:{},
            receptAddress:'',
            receptName:'',
            receptCellphone:'',
            httpFlag:false
        }
    },
    computed:{
        disabled(){
            return this.receptAddress==''||this.receptName==''||this.receptCellphone==''
        },
        inApp(){
            return store.inApp;
        }
    },
    created(){
        let flag = sessionStorage.getItem('index')
        if(!flag){
            this.$router.replace('/');
            return;
        }
        this.init = true;
        if(this.inApp){
            let userId = window.sessionStorage.getItem('userId');
            let token = window.sessionStorage.getItem('token');
            this.userInfo = {
                userId:userId,
                token:token
            }
        }else{
            let uInfo = this.$getCookie('uInfo');
            this.userInfo = {
                userId:JSON.parse(uInfo).userid,
                token:JSON.parse(uInfo).accessToken
            }
        }
        this.$nextTick(()=>{
            this.verifyIsComplete()
            this.receiveInfo()
        })
        this.channelId = env.page.find(item=>window.location.href.includes(item.name)).channelId;
    },
    methods:{
        setPosterShow:mutations.setPosterShow,
        /**
         * 获取领取详情
         */
        async receiveInfo(){
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                userId:this.userInfo.userId
            }
            const res = await this.$http.post(this.$server.receiveInfo,query,{userId:this.userInfo.userId,token:this.userInfo.token})
            this.$toast.clear();
            this.httpFlag = true;
            if(res.data.status==200){
                if(res.data.content){
                    this.receptAddress = res.data.content.receptAddress;
                    this.receiveBookFlag = true;
                }
            }
        },
        /**
         * 验证活动是否完成
         */
        async verifyIsComplete(){
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                userId:this.userInfo.userId
            }
            const res = await this.$http.post(this.$server.verifyIsComplete,query,{userId:this.userInfo.userId,token:this.userInfo.token})
            this.$toast.clear()
            if(res.data.status==200){
                this.buyCourse = res.data.content.buyCourse;
                this.signUp = res.data.content.signUp;
            }   
        },
        /**
         * 领书
         */
        async receiveBook(){
            if(this.disabled) return;
            if(this.receptCellphone.length!=11){
                this.$toast('请输入正确的手机号')
                return;
            }
            this.pointButton(11)
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                userId:this.userInfo.userId,
                receptCellphone:this.receptCellphone,
                receptName:this.receptName,
                receptAddress:this.receptAddress
            }
            const res = await this.$http.post(this.$server.receiveBook,query,{userId:this.userInfo.userId,token:this.userInfo.token});
            this.$toast.clear()
            if(res.data.status==200){
                this.receiveBookFlag = true;
                this.$toast('领取成功，所获礼品将在活动结束后统一邮寄')
            }else{
                this.$toast(res.data.message)
            }
        },
        /**
         * 去购课
         */
        btn1Event(){
            if(this.buyCourse===0){
                this.pointButton(9,this.goCourse)
            }
        },
        goCourse(){
            const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            if(isIos){
                try{
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage({
                        describe:'去课程详情页',
                        method:'goCourseDetail',
                        params:{
                            courseId:this.courseId,
                            isCloseWebView:false,
                            channelId:this.channelId,
                            activityName:this.activityName	
                        }
                    }); 
                }catch(err){
                    let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com':'https://scm.youfushuyuan.com'
                    let activityShareUserId = tools.getQueryString('activityShareUserId')
                    if(activityShareUserId){
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}&activityShareUserId=${activityShareUserId}#/course/${this.courseId}`
                    }else{
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}#/course/${this.courseId}`
                    }
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        let message = JSON.stringify({
                            describe:'去课程详情页',
                            method:'openLesson',
                            params:{
                                courseId:this.courseId,
                                isCloseWebView:false,
                                channelId:this.channelId,
                                activityName:this.activityName			
                            }
                        })
                        window.android.notify(message);
                    }
                }else{
                    let link = this.$server.env == 'prod'?'https://xgxm.xueguoxue.com':'https://scm.youfushuyuan.com'
                    let activityShareUserId = tools.getQueryString('activityShareUserId')
                    if(activityShareUserId){
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}&activityShareUserId=${activityShareUserId}#/course/${this.courseId}`
                    }else{
                        window.location.href = `${link}/?channelId=${this.channelId}&activityName=${this.activityName}#/course/${this.courseId}`
                    }
                }
            }
        },
        btn2Event(){
            if(this.signUp===0){
                this.pointButton(10)
                this.setPosterShow(true)
            }
        },
        /**
         * button打点
         */
        async pointButton(type,callback){
            const query = {
                type:type
            }
            const res = await this.$http.post(this.$server.pointButton,query)
            if(res.data.status==200){
                if(callback){
                    callback()
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .receive-page{
        position: relative;
        min-height: 100%;
        background: #f9f9f9;
        .bgd{
            position:relative;
            z-index:1;
        }
        .content{
            position: absolute;
            z-index: 2;
            top:0;
            left:0;
            width: 100%;
            height:100%;
            padding-top:2.83rem;
            .section1{
                width: 6.5rem;
                height:2.8rem;
                margin:0 auto;
                border-radius: 0.34rem;
                background: rgba(234, 241, 247, 0.8);
                padding:0.36rem 0.3rem;
                .title{
                    font-family: 'my-font';
                    font-size: 0.4rem;
                    color:rgba(0, 56, 113, 1);
                }
                .item{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin:0.3rem 0;
                    .text{
                        font-size: 0.3rem;
                        color:#333;
                    }
                    .btn{
                        width: 1.96rem;
                        height:.54rem;
                        text-align: center;
                        line-height: 0.54rem;
                        color:#fff;
                        font-size: 0.24rem;
                        border-radius: 0.5rem;
                        background: linear-gradient(-90deg, #C30D23 0%, #F74C60 100%);
                        &.disabled{
                            background: #ccc;
                        }
                    }
                }
            }
            .section2{
                width: 6.5rem;
                margin:0.4rem auto;
                border-radius: 0.34rem;
                background: rgba(234, 241, 247, 0.8);
                padding:0.46rem 0.3rem;
                position: relative;
                &.normal{
                    input,textarea{
                        background: #fff!important;
                    }
                }
                .shade{
                    position: absolute;
                    top:0;
                    left: 0;
                    width: 100%;
                    height:100%;
                    z-index: 2;
                }
                .title{
                    font-family: 'my-font';
                    font-size: 0.4rem;
                    color:rgba(0, 56, 113, 1);
                    margin-bottom:0.1rem;
                }
                .item{
                    font-size: 0;
                    color:#333;
                    margin:0.25rem 0;
                    .des{
                        font-size: 0.3rem;
                        width: 0.94rem;
                        text-align:justify;
                        line-height: 0.52rem;
                        display: inline-block;
                        vertical-align: top;
                        overflow:hidden;
                        height:.52rem;
                        i{
                            display:inline-block;
                            width:100%;
                            height:0;
                        }
                    }
                    span{
                        width: 0.1rem;
                        display: inline-block;
                        vertical-align: middle;
                        line-height: 0.52rem;
                        font-size: 0.3rem;
                        margin: 0 0.1rem;
                    }
                    input,textarea{
                        display: inline-block;
                        vertical-align: top;
                        border:none;
                        outline: none;
                        resize: none;
                        width: 4.5rem;
                        background: #e2e2e2;
                        font-size: 0.3rem;
                        line-height: 0.42rem;
                        padding:0.05rem 0.2rem;
                        border-radius: 0.06rem;
                    }
                    .text{
                        display: inline-block;
                        vertical-align: top;
                        font-size: 0.3rem;
                        line-height: 0.48rem;
                        padding:0.04rem 0;
                        width: calc(100% - 1.3rem);
                    }
                    textarea{
                        height: 1.2rem;
                        line-height: 0.48rem;
                    }
                }
                .tips{
                    margin-top:0.12rem;
                    font-size:0.24rem ;
                    color:#666;
                    line-height: 0.32rem;
                }
            }
            .receive-btn{
                width: 5.1rem;
                height:0.8rem;
                border-radius: 0.5rem;
                line-height:0.8rem;
                text-align: center;
                cursor: pointer;
                margin:0 auto;
                font-size: 0.3rem;
                color:#fff;
                background: linear-gradient(-90deg, #C30D23 0%, #F74C60 100%);
                &.disabled{
                    background: #ccc;
                    cursor: not-allowed;
                }
                &.received{
                    margin-top:3rem;
                }
            }
        }
    }
</style>