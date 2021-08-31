<template>
    <div class="dialog_rules" v-show="dialogType">
        <div class="rules">
            <img class="close" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/close.png" @click="closeEven"/>
            <div class="rulesBox">
                <div class="rulesHeader">活动规则</div>
                <div class="rulesDiv">
                    <p>一、活动主题： </p>
                    <p>全民阅读节，万元真补贴</p>
                </div>
                <div class="rulesDiv">
                    <p>二、活动时间： </p>
                    <p>2021年7月20日0:00-2021年8月31日24:00</p>
                </div>
                <div class="rulesDiv">
                    <p>三、参与方式： </p>
                    <p>学国学网App首页banner入口等</p>
                </div>
                <div class="rulesDiv">
                    <p>四、关于您预留的联系方式：参与本次活动，则视为您同意我们向您在学国学网注册的手机号发送本次活动的相关信息、同意学国学网致电您与您沟通本次活动，同意学国学网与您联系，了解您的学习诉求并已完全了解并同意本次活动之活动规则。您的联系方式我们会采取全程保密措施。</p>
                </div>
                <div class="rulesDiv">
                    <p>玩法介绍【天降红包雨】</p>
                    <p>1、参与方式：您可在“全民阅读节”活动主会场参与“天降红包雨”活动，每天10点/13点/16点/20点准时下红包雨，首次访问活动主会场的用户，可当场参与一次。</p>
                </div>
                <div class="rulesDiv">
                    <p>2、抽奖：进入红包雨页面点击红包视为开始游戏，弹窗告知中奖奖品，奖品包含：学国学网免费阅读周卡（215000份）、学国学网免费阅读月卡（21500份）、学国学网免费阅读季卡（2150份）、学国学网10元优惠券（215000份）、学国学网2000积分（21500份）、学国学网5000积分（2150份）。</p>
                </div>
                <div class="rulesDiv">
                    <p>3、授权说明：点击“开心收下”，则视为您同意学国学网回拨电话，为您提供专业的学习咨询。</p>
                </div>
                <div class="rulesDiv">
                    <p>五、活动期间如您违反如下任意一条约定，则学国学网平台有权立即终止本协议，并采取包括但不限于暂停或查封您帐号，作废免费阅读卡等必要措施维护自身合法权益，同时有权采取诉讼手段，追究您的法律责任：</p>
                </div>
                <div class="rulesDiv">
                    <p>1、您在参与活动过程中涉嫌违反国家法律、行政法规、部门规章、地方性法规等规范性文件；</p>
                </div>
                <div class="rulesDiv">
                    <p>2、您以任何方式、以任何语言文字对免费阅读卡、优惠券、积分的资料作全部或局部复制、转载、引用和链接，用以在其他任何与学国学网平台构成竞争关系的第三方竞品网站发布活动奖品信息；</p>
                </div>
                <div class="rulesDiv">
                    <p>3、您以任何方式恶意获取、盗用或未经学国学网平台书面许可向第三方转让活动奖品；</p>
                </div>
                <div class="rulesDiv">
                    <p>4、您其他任何可能危及学国学网平台合法权益的行为。</p>
                </div>
                <div class="rulesDiv">
                    <p>如出现不可抗力或情势变更的情况（包括但不限于重大灾害、政府行为，司法行政机关的命令、学国学网平台遭受恶意攻击、严重系统故障等情况），导致本活动无法进行的，学国学网平台有权终止本协议，并无须向您承担任何责任。</p>
                </div>
                <div class="rulesDiv">
                    <p>本协议履行过程中发生的一切争议、权利主张、争议解决等，均适用中华人民共和国法律。学国学网平台有权在法律允许的范围内对规则进行调整。 </p>
                </div>
                <div class="rulesDiv">
                    <p>如您与学国学网平台就本协议内容或其执行发生任何争议，双方应首先本着诚信原则通过协商加以解决，如协商不成，任何一方可将争议提交至学国学网平台运营商所在地法院提请诉讼解决。</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {onMounted,ref,inject, watch} from 'vue'

export default {
  name: 'youhui',
  components: {},
  props: {},
  setup(props,context){
        const dialogType = inject('rulesDialogType');
        const closeEven = ()=>{
            context.emit('closeEven',{dialogId:7,type:false})
        }
        onMounted(()=>{})
        return{
            closeEven,
            dialogType
        }
  }
}
</script>
<style lang="less">

.dialog_rules{
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    .close{
        width: 0.66rem;
        height: 0.66rem;
        top: 1.7rem;
        right: 0.65rem;
        position: absolute;        
    }
    .rules{
        .close{
            width: 0.66rem;
            height: 0.66rem;
            // top: 1.7rem;
            // right: 0.65rem;
            top: -0.66rem;
            right: 0rem;
            position: absolute;        
        }
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;	
        width:6.21rem;
        height: 9.1rem;
        background:url("https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/hb_box6.png") no-repeat center;
        background-size: cover;
        padding: 0.4rem 0.6rem;
        .rulesBox{
            width:5rem;
            height: 8rem;
            overflow-y: scroll;
            .rulesHeader{
                color:#666666;
                text-align: center;
                margin:0.44rem 0;
                font-size: 0.3rem;
            }
            .rulesDiv{
                margin-bottom: 0.44rem;
                p{
                    text-align: left;
                    font-size: 0.26rem;
                    color:#666666;
                }
            }
        }
    }
}
</style>
