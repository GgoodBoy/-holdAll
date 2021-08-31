<template>
    <div class="rule-page">
        <div class="header">
            <i @click="returnEvent"></i>
            <p>活动说明</p>
        </div>
        <div class="content">
            <p class="marginTopCss">一、名词解释</p>
            <p>礼金</p>
            <p>用于参加新年福包活动兑换福包加速符。</p>
            <p class="marginTopCss">福包加速符</p>
            <p>平安符：100礼金兑换，增加福包的中奖机率到10%</p>
            <p>吉祥符：200礼金兑换，增加福包的中奖机率到30%</p>
            <p>好运符：300礼金兑换，增加福包的中奖机率到50%</p>
            <p class="marginTopCss">赚礼金</p>
            <p>用户可通过每日签到（每次200礼金，每日可领取1次）、分享课程（每次200礼金，每日可领取1次）、购买指定课程礼金（每次3000礼金，仅可领取1次）。</p>
            <p class="marginTopCss">二、开奖规则</p>
            <p>福包每天0时开奖，开奖后在24小时内领取奖品，逾期奖品将失效。</p>
            <p class="marginTopCss">三、活动流程</p>
            <p>1.用户进入活动主界面直接点击包福包，选择想要的课程。</p>
            <p>2.兑换成功后，点击“提交福包”，等待开奖。</p>
            <p>3.如果需要增加福包的中奖率则兑换“福包加速符”。</p>
            <p>4.福包每天0时开奖，中奖后在24小时内领取奖品，逾期奖品作废。</p>
            <p>5.奖品设置：100-299随机礼金、福包许愿课程3-10天的免费观看权。如果已经拥有该课程的观看权则顺延，无有效期的课程观看权保持不变。</p>
            <p>6.福包有一定的爆炸机率，爆炸后福包及当前福包的加速符将一并消失。</p>
            <p class="marginTopCss" style="text-align:center;">*本活动的最终解释权归学国学网所有*</p>
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
        overflow: auto;
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
            .marginTopCss{
                margin-top: 0.5rem;
            }
        }
    }
</style>