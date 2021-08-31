<template>
    <div class="rule-page" :class="{'normal-page':inApp,'show':ruleShow}">
        <div class="header" v-if="!inApp">
            <van-icon name="down" @click="returnPage"/>
            <p>活动说明</p>
        </div>
        <div class="content">
            <div class="section" v-for="(item,index) in rules" :key="index">
                <p class="title">{{item.title}}</p>
                <p class="des">{{item.content}}</p>
            </div>
            <p class="tips1">所有优惠券互斥使用，每次购买只能使用一张优惠券。</p>
            <div class="section">
                <p class="title normal">活动说明：</p>
                <p class="des">在参与活动过程中，如发现违规行为（违规行为包括但不限于恶意批量注册、无效手机、虚假信息等）学国学网将封停账号，并撤销获得的相关赠品。本次活动的最终解释权归学国学网所有。</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            rules:[
                {title:'【限时礼】',content:'所有付费课程分别按照原价8折、5折和3折进行促销;'},
                {title:'【见面礼】',content:'活动期间，参加本次活动的所有用户均可领取一张5元优惠券（数量有限，领完即止），且可在课程折扣后叠加使用该优惠券;'},
                {title:'【礼上礼】',content:'活动期间，参加本次活动的所有用户每次成功购买一门课程后均可获得一张5元优惠券，不限次数;'},
                {title:'【众乐礼】',content:'用户可在app端【我的】-【分享得优惠】中每次成功邀请一名未注册的新用户，可获得一张5元优惠券，不限次数。'}
            ],
            inApp:false,//是否在APP内部，包括微博|学国学网|微信等
        }
    },
    props:['ruleShow'],
    created(){
        document.title = '活动说明';
        this.systemJudge()
    },
    methods:{
        returnPage(){
            this.$emit('update:ruleShow',false)
        },
        /**
         * 判断是否在APP内部
         */
        systemJudge(){
            let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            if(isIos){
                try {    
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
                    this.inApp = true;
                }
                catch(err) {
                    let ua = navigator.userAgent.toLowerCase();
                    if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                        this.inApp = true;
                    }else if (ua.includes('weibo')){
                        this.inApp = true;
                    }else{
                        this.inApp = false;
                    }
                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        this.inApp = true;
                    }
                }else{
                    let ua = navigator.userAgent.toLowerCase();
                    if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                        this.inApp = true;
                    }else if (ua.includes('weibo')){
                        this.inApp = true;
                    }else{
                        this.inApp = false;
                    }
                }
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    .rule-page{
        height: 100%;
        background: #fff;
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        transform:translateX(-100%);
        z-index: 10;
        transition: all 0.5s;
        &.normal-page{
            position: relative;
            transform:translate(0);
            transition: none;
            .content{
                height: auto;
            }
        }
        &.show{
            transform:translate(0);
        }
        .header{
            height: 1rem;
            position: relative;
            border-bottom:1px solid #dfdfdf;
            i{
                transform:rotate(90deg);
                position: absolute;
                left:0.3rem;
                top:0.3rem;
                font-size: 0.4rem;
            }
            p{
                font-size:0.36rem;
                font-weight: bold;
                text-align: center;
                line-height: 1rem;
            }
        }
        .content{
            padding:0.6rem 0.3rem;
            overflow: auto;
            height: calc(100% - 1rem);
            .section{
                margin-bottom:0.3rem;
                .title{
                    font-size: 0.32rem;
                    color:#000;
                    font-weight: bold;
                    line-height: 0.46rem;
                    &.normal{
                        padding:0 0 0 0.1rem;
                    }
                }
                .des{
                    font-size: 0.28rem;
                    line-height: 0.4rem;
                    color:#666;
                    padding-left:0.1rem;
                }
            }
            .tips1{
                margin:0.4rem 0 0.6rem;
                font-size: 0.28rem;
                font-weight: bold;
                padding: 0 0 0 0.1rem;
            }
        }
    }
</style>