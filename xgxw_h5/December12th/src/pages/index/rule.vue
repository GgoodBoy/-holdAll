<template>
    <div class="rule-page">
        <div class="header">
            <i @click="returnEvent"></i>
            <p>活动说明</p>
        </div>
        <div class="content">
            <p>测一测：活动期间，【测一测】板块中，每位用户可无限次使用，且每次测试结果都可生成精美的海报，可分享给好友进行测试。</p>
            <p>摇一摇：活动期间，【摇一摇】板块中每位用户每天都有一次免费摇签的机会，在完成第一次摇签动作后，若想再次获得摇签机会，需要将活动分享给好友后即可获得，且每天最多获得5次摇奖机会。板块中每一份福利均为随机。</p>
            <p>逛一逛：活动期间，【逛一逛】板块中所有课程进行8折促销，新老用户均可在折扣后使用账户优惠券和积分进行购买，购买一门课程时只能使用一张优惠券。</p>
            <p>在参与活动过程中，如发现违规行为（违规行为包括但不限于恶意批量注册、无效手机、虚假信息等），学国学网将封停账号，并撤销获得相关赠品。</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            
        }
    },
    methods:{
        returnEvent(){
            this.$emit('update:ruleShow',false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .rule-page{
        background: #fff;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        z-index: 3;
        width: 100%;
        .header{
            height: 1rem;
            position: relative;
            border-bottom:1px solid #dfdfdf;
            i{
                position: absolute;
                left:0.3rem;
                top:0.3rem;
                width: 0.4rem;
                height:0.4rem;
                background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20201218/return_icon.png')no-repeat 50% 50% / cover;
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
                margin:0.1rem 0;
            }
        }
    }
</style>