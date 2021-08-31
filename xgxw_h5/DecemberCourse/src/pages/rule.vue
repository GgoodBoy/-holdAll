<template>
    <div class="rule-page">
        <div class="header" v-if="!inApp">
            <van-icon name="down" @click="$router.go(-1)"/>
            <p>活动说明</p>
        </div>
        <div class="content">
            <p class="section">一、活动时间：2020年12月4日——2020年12月13日</p>
            <p>二、活动规则：</p>
            <p>1）【0元抢券】：活动期间，用户可通过活动页面免费领取1张《菜根谭》专属50元优惠券，该券可在购买课程时抵用50元；优惠券限量1000张，每人限领1张，领完即止；优惠券仅在活动期间内可用。</p>
            <p>2）【0元领书】：活动期间，用户可通过活动页面领取1本《菜根谭》精装正版图书，活动结束后统一邮寄给用户；图书限量100本，每人限领1本，领完即止；用户需满足条件才有资格领取图书：①.用户需购买过【学国学网】上线的《菜根谭》视频课程。②.用户需在活动期间内成功邀请一名好友注册【学国学网】，邀请方式为：邀请者需把该活动页面-【领书】-【去分享】生成的海报分享给被邀请者，后者需通过该海报进入活动并注册。</p>
            <p>3）【免费赚佣金】：活动期间，用户A可通过点击【赚】生成并分享活动页面海报给用户B，若用户B通过该海报进入活动并成功购买了《菜根谭》视频课程，（只能通过该海报链接购买课程，方可赚取佣金），用户A则可赚到用户B实际付费30%的佣金，可在【学国学网APP】-【我的】-【我的收益】中查看。</p>
            <p>三、活动说明：在参与活动过程中，如发现违规行为（违规行为包括但不限于恶意批量注册、无效手机、虚假信息等），学国学网将封停账号，并撤销获得相关赠品，最终解释权在学国学网。</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            inApp:false,//是否在APP内部，包括微博|学国学网|微信等
        }
    },
    created(){
        document.title = '活动说明';
        this.systemJudge()
    },
    methods:{
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
        background: #fff;
        min-height: 100%;
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
            padding:0.33rem 0.39rem;
            p{
                line-height: 0.46rem;
                font-size: 0.32rem;
                color:#000;
            }
        }
        
    }
</style>