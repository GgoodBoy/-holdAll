<template>
    <div class="index-page">
        <div class="bgd-box">
            <img :src="bgd" class="bgd"/>
            <div class="btn-area" v-if="init">
                <div class="left" v-show="isReceive">
                    <p class="original">原价¥<span>396</span></p>
                    <p class="preferential">国庆特惠¥200</p>
                </div>
                <div class="right" @click="btnClick">
                    <p v-if="isBuy">立即学习</p>
                    <template v-else>
                        <p>{{isReceive?'仅需¥196':'¥396'}}</p>
                        <p>开启国学智慧</p>
                    </template>
                </div>
            </div>
            <div class="people">
                <van-swipe
                    vertical
                    class="people-swipe"
                    :autoplay="3000"
                    :show-indicators="false"
                    :touchable="false"
                >
                    <van-swipe-item v-for="(item,index) in swiperArr" :key="index">{{item}}</van-swipe-item>
                </van-swipe>
            </div>
        </div>
        <div class="dialog" v-if="dialogVisible" @click="dialogEvent">
            <div class="hongbao" v-if="show1">
                <div class="open" @click.stop="openEvent"></div>
            </div>
            <div class="login-box" v-if="show2">
                <p class="tips">新用户将自动创建学国学网App账号</p>
                <div class="form">
                    <div class="user item">
                        <label>手机号</label>
                        <input type="tel" maxlength="11" v-model="cellphone"/>
                    </div>
                    <div class="item code">
                        <label>验证码</label>
                        <input type="tellphone" maxlength="6" v-model="code"/>
                    </div>
                    <div class="code-btn" @click.stop="sendSms" :class="{'disabled':text!='获取验证码'}">
                        {{text}}
                    </div>
                </div>
                <div class="btn" @click.stop="loginEvent"></div>
            </div>
            <div class="success-box" v-if="show3"></div>
        </div>
    </div>    
</template>
<script>
import bgd from '../assets/image/index_bgd.jpg'
import utils from '../utils'
function getQueryString(key){
  var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}
const course = '9,660,631,7'
// const course = '330,331,335,333'
const swiperText = ["用户1381***5763已购买", "用户1356***4894已购买", "用户1310***5860已购买", "用户1307***6851已购买", "用户1321***6731已购买", "用户1325***6984已购买", "用户1320***7776已购买", "用户1328***5713已购买", "用户1303***6529已购买", "用户1306***5037已购买", "用户1308***7781已购买", "用户1310***7316已购买", "用户1306***5227已购买", "用户1327***7513已购买", "用户1309***4798已购买", "用户1325***7826已购买", "用户1319***5288已购买", "用户1322***5750已购买", "用户1303***6044已购买", "用户1310***7862已购买", "用户1321***4948已购买", "用户1308***7869已购买", "用户1318***7061已购买", "用户1327***7854已购买", "用户1314***6457已购买", "用户1312***6916已购买", "用户1315***4163已购买", "用户1724***5542已购买", "用户1712***4129已购买", "用户1724***5785已购买", "用户1715***7864已购买", "用户1714***5211已购买", "用户1709***4124已购买", "用户1704***6910已购买", "用户1700***5916已购买", "用户1722***7908已购买", "用户1720***4317已购买", "用户1704***6855已购买", "用户1714***6596已购买", "用户1721***5927已购买", "用户1725***5085已购买", "用户1729***5259已购买", "用户1720***5609已购买", "用户1718***7732已购买", "用户1801***6091已购买", "用户1826***4742已购买", "用户1827***5233已购买", "用户1816***5217已购买", "用户1809***6249已购买", "用户1805***7853已购买", "用户1821***7408已购买", "用户1819***5463已购买", "用户1809***6012已购买", "用户1807***4114已购买", "用户1800***4764已购买", "用户1801***5166已购买", "用户1824***7173已购买", "用户1821***6485已购买", "用户1827***6531已购买", "用户1801***6516已购买", "用户1819***4256已购买", "用户1803***7130已购买", "用户1829***4672已购买", "用户1818***5325已购买", "用户1813***6827已购买", "用户1811***4317已购买", "用户1828***7964已购买", "用户1817***4027已购买", "用户1815***5796已购买", "用户1815***4238已购买", "用户1800***5383已购买", "用户1804***7875已购买", "用户1823***6131已购买", "用户1827***6165已购买", "用户1824***5456已购买", "用户1804***5026已购买", "用户1825***6545已购买", "用户1827***7216已购买", "用户1828***4166已购买", "用户1815***7152已购买", "用户1800***5449已购买", "用户1826***6350已购买", "用户1805***5435已购买", "用户1821***4045已购买", "用户1802***7751已购买", "用户1807***4446已购买", "用户1812***7676已购买", "用户1806***5511已购买", "用户1821***7700已购买", "用户1811***5887已购买", "用户1825***5167已购买", "用户1818***4076已购买", "用户1803***5283已购买", "用户1809***5610已购买", "用户1827***6898已购买", "用户1828***4952已购买", "用户1824***5305已购买", "用户1822***5053已购买", "用户1808***4155已购买", "用户1803***5801已购买"]
export default {
    data(){
        return{
            bgd:bgd,
            dialogVisible:false,
            init:false,
            isBuy:false,
            isReceive:false,
            show1:true,
            show2:false,
            show3:false,
            cellphone:'',
            code:'',
            text:'获取验证码',
            swiperArr:swiperText,
        }
    },
    beforeRouteLeave(to, from, next){
        sessionStorage.setItem('from','index')
        next()
    },
    created(){
        let ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            let timer = setInterval(()=>{
                let openId = localStorage.getItem('activityOpenId')
                if(openId){
                    this.initEvent()
                    clearInterval(timer)
                }
            },500)
        }else{
            this.initEvent()
        }
        
    },
    mounted(){
        setTimeout(()=>{
            document.body.scrollTop = 0;
        },300)
    },
    methods:{
        initEvent(){
            const uInfo = utils.getUser()
            if(uInfo){
                this.getBuyUser()
            }else{
                this.dialogVisible = true;
                this.init = true;
            }
            localStorage.removeItem("wechatType");
            localStorage.removeItem("orderId");
        },
        openEvent(){
            this.show1 = false;
            this.show2 = true;
        },
        getBuyUser(){
            this.$http.post(this.$server.getBuyUser,{}).then(res=>{
                if(res.data.status==200){
                    this.init = true;
                    this.dialogVisible = false;
                    this.isReceive = true;
                    const uInfo = utils.getUser()
                    let index = res.data.content.findIndex(item=>item==uInfo.id);
                    if(index>=0){
                        this.isBuy = true;
                    }else{
                        this.verifyCourse()
                    }
                }
            })
        },  
        loginEvent(){
            if(this.cellphone.length!=11){
                this.$toast('请输入正确的手机号');
                return;
            }
            if(this.code.length!=6){
                this.$toast('请输入手机验证码');
                return;
            }
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                cellphone:this.cellphone,
                tokenType:2,
                code:this.code,
                registerSource:3,
                requestType:1
            }
            this.$http.post(this.$server.login,query).then(res=>{
                this.$toast.clear()
                if(res.data.status==200){
                    utils.saveUser(res.data.content)
                    this.show2 = false;
                    setTimeout(()=>{
                        this.dialogEvent()
                    },3000)
                    setTimeout(()=>{
                        this.verifyCourse()
                    },0)
                }else{
                    this.$toast(res.data.message)
                }
            })
        },
        dialogEvent(){
            if(this.show3){
                this.show3 = false;
                this.dialogVisible = false;
                this.isReceive = true;
            }
        },
        sendSms(){
            if(this.text!='获取验证码') return false;
            if(this.cellphone.length!=11){
                this.$toast('请输入正确的手机号');
                return;
            }
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            const query = {
                cellphone:this.cellphone,
                smsType:1,
                tokenType:2
            }
            this.$http.post(this.$server.sendSms,query).then(res=>{
                this.$toast.clear()
                if(res.data.status==200){
                    let time = 60;
                    this.text = time +'s'
					let timer = setInterval(()=>{
						time--;
                        this.text = time +'s'
						if(time==0){
							clearInterval(timer);
							this.text = '获取验证码'
						}
					},1000) 
                }
            })
        },
        btnClick(){
            if(!this.isReceive){
                this.$toast('请严格按照流程购买，勿走捷径！');
                return;
            }
            this.verifyCourse(this.goOrder)  
        },
        goOrder(){
            if(this.isBuy){
                this.$router.push('/result?flag=success')
            }else{
                this.$router.push('/order')
            }
        },
        verifyCourse(callback){
            if(callback && typeof callback=='function'){
                const toast = this.$toast.loading({
                    duration: 0,
                    forbidClick: true,
                });
            }
            let query = {
                courseId:course
            }
            this.$http.post(this.$server.verifyCourse,query).then(res=>{
                this.$toast.clear()
                if(res.data.status==200){
                    this.isBuy = res.data.content.length==4;
                    this.show3 = !this.isBuy;
                    if(!this.show3){
                        this.show3 = false;
                        this.dialogVisible = false;
                        this.isReceive = true;
                    }
                    sessionStorage.setItem('courseNames',JSON.stringify(res.data.content))
                    if(callback){
                        callback()
                    }
                }else{
                    this.$toast(res.data.message)
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
    .index-page{
        .bgd-box{
            position: relative;
            padding-bottom:1.36rem;
            .bgd{
                display: block;
            }
            .people{
                position: absolute;
                padding: 0 0.1rem;
                height: 0.36rem;
                border-radius: 0.2rem;
                background: #FFECC7;
                bottom:1.84rem;
                right:0.3rem;
                z-index: 2;
                color:#142D51;
                overflow: hidden;
                .people-swipe{
                    height: 0.36rem;
                    line-height: 0.36rem;
                    /deep/ .van-swipe-item {
                        font-size: 0.18rem;
                        height: 0.36rem;
                        line-height: 0.36rem;
                        text-align: center;
                    }
                }
            }
            .btn-area{
                position: fixed;
                bottom:0;
                left: 0;
                width: 100%;
                height: 1.36rem;
                background: #fff;
                padding: 0.25rem 0.26rem 0.25rem 0.37rem;
                overflow: hidden;
                z-index: 3;
                .left{
                    font-size: 0.3rem;
                    margin-top:0.1rem;
                    float: left;
                    .original{
                        color:#666;
                        line-height: 0.34rem;
                        span{
                            text-decoration:line-through;
                        }
                    }
                    .preferential{
                        line-height: 0.34rem;
                        color:#C30D23;
                        margin-top:0.04rem;
                    }
                }
                .right{
                    float: right;
                    width: 4.1rem;
                    height: 0.86rem;
                    border-radius: 0.48rem;
                    background: linear-gradient(90deg, #FF7585 0%, #C30D23 100%);
                    text-align: center;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 0.12rem 0;
                    &:active{
                        background:#C30D23 ;
                    }
                    p{
                        color:#fff;
                        font-size: 0.28rem;
                        line-height: 0.34rem;
                        width: 100%;
                    }
                }
            }
        }
        .dialog{
            position: fixed;
            top:0;
            left: 0;
            background: rgba(0,0,0,0.7);
            width: 100%;
            height: 100%;
            z-index: 4;
            .hongbao{
                width: 3.7rem;
                height: 5.02rem;
                // top:calc(calc(100% - 5.02rem)/2);
                // left: calc(calc(100% - 3.7rem)/2);
                top:50%;
                left: 50%;
                margin-top:-3.51rem;
                margin-left:-1.85rem;
                position: absolute;
                animation: enlarge 0.3s linear 0.3s both;
                background: url('../assets/image/hongbao1.png') no-repeat 50% 50% /cover;
                .open{
                    width: 1.07rem;
                    height: 1.07rem;
                    position: absolute;
                    bottom:0.47rem;
                    left: 1.32rem;
                    background: url('../assets/image/open.png')no-repeat 50% 50% / cover;
                    animation: open 1.5s linear infinite;
                }
            }
            .login-box{
                top:50%;
                left: 50%;
                position: absolute;
                transform: translate(-50%,-50%);
                margin-top:-1rem;
                width: 5.03rem;
                height: 5.56rem;
                background: #fff;
                z-index: 2;
                border-radius: 0.15rem;
                padding: 0.4rem 0;
                .tips{
                    color:#C30D23;
                    font-size: 0.28rem;
                    line-height: 0.34rem;
                    text-align: center;
                    margin:0.3rem 0 0.5rem 0;
                }
                .form{
                    position: relative;
                    padding: 0 0.3rem;
                    .item{
                        padding: 0.11rem 0.33rem;
                        background: #E5E5E5;
                        border-radius: 0.3rem;
                        border: 1px solid #E5E5E5;
                        color:#666;
                        font-size: 0;
                        margin-bottom: 0.3rem;
                        &.code{
                            width: 3.05rem;
                            margin-bottom: 0;
                            input{
                                width: 1.4rem;
                            }
                        }
                        label{
                            display: inline-block;
                            vertical-align: middle;
                            font-size: 0.24rem;
                            height: 0.4rem;
                            line-height: 0.4rem;
                            padding-right:0.1rem;
                            position: relative;
                            &::after{
                                content:'';
                                position: absolute;
                                height: 0.26rem;
                                width: 1px;
                                background: #666;
                                right: 0;
                                top:0.07rem;
                            }
                        }
                        input{
                            padding-left:0.1rem;
                            display: inline-block;
                            vertical-align: middle;
                            border:0;
                            font-size: 0.24rem;
                            height: 0.4rem;
                            line-height: 0.4rem;
                            outline: none;
                            background: none;
                            width: 2.5rem;
                        }
                    }
                    .code-btn{
                        width: 1.32rem;
                        font-size: 0.2rem;
                        text-align: center;
                        line-height: 0.62rem;
                        border-radius: 0.48rem;
                        background: linear-gradient(90deg, #FF7585 0%, #C30D23 100%);
                        position: absolute;
                        right: 0.3rem;
                        bottom:0;
                        color:#fff;
                        border:1px solid #FF7585;
                        &.disabled{
                            background: #a7a7a7;
                            border-color:#a7a7a7;
                        }
                    }
                }
                .btn{
                    width: 1.6rem;
                    height: 1.6rem;
                    background: url('../assets/image/login.png')no-repeat 50% 50% / cover;
                    margin:0.44rem auto 0;
                    &:active{
                        transform: scale(0.95);
                    }
                }
            }
            .success-box{
                width: 3.7rem;
                height: 5.03rem;
                margin-top:-1rem;
                top:50%;
                left: 50%;
                position: absolute;
                transform: translate(-50%,-50%);
                background: url('../assets/image/hongbao2.png')no-repeat 50% 50% / cover;
            }
        }
    }
    @keyframes enlarge {
        from{
            transform: scale(0);
        }
        to{
            transform: scale(1);
        }
    }
    @keyframes open {
        0%{
            transform: scale(1);
        }
        25%{
            transform: scale(0.95);
        }
        50%{
            transform: scale(1);
        }
        75%{
            transform: scale(0.95);
        }
        100%{
            transform: scale(1);
        }
    }
</style>