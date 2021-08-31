<template>
    <div class="result-page">
        <div class="success-box" v-if="flag=='success'">
            <div class="top">
                <p class="tips">您已经加入本期“闭关”</p>
            </div>
            <div class="bottom">
                <p class="tips">
                    <span>下载学国学网APP</span>
                    <span>在【已购】学习</span>
                </p>
                <div class="btns">
                    <div class="go-download" @click="goDownload">去下载</div>
                    <div class="go-poster" @click="shareFlag=true">秀一下</div>
                </div>
                <div class="img-code">
                    <img :src="code"/>
                    <p>识别二维码添加您的专属助教</p>
                </div>
            </div>
        </div>
        <div class="fail-box" v-if="flag=='fail'">
            <div class="top">
                <p class="tips">
                    <span>对不起,</span>
                    <span>支付交易失败!</span>
                </p>
            </div>
            <div class="bottom">
                <div class="return" @click="$router.replace('/')">返回</div>
            </div>
        </div>
        <transition name="fade">
            <div class="dialog" v-if="shareFlag" @click="shareFlag=false">
                <div class="box" @click.stop="()=>{}">
                    <p>非凡决心·非凡成长</p>
                    <div class="btn" @click="goPoster">分享朋友</div>
                </div>
            </div>
        </transition>    
    </div>
</template>
<script>
import code from '../assets/image/code.png'
export default {
    data(){
        return {
            flag:'',
            code:code,
            shareFlag:false
        }
    },
    beforeRouteLeave(to, from, next){
        sessionStorage.setItem('from','result')
        next()
    },
    created(){
        let from = sessionStorage.getItem('from');
        if(from){
            if(this.$route.query.flag){
                this.flag = this.$route.query.flag
            }else{
                this.$router.replace('/')
            }
        }else{
            this.$router.replace('/')
        }
    },
    methods:{
        goDownload(){
            window.location.href = 'https://xgxm.xueguoxue.com/h5/download/'
        },
        goPoster(){
            this.$router.push('/poster')
        }
    }
}
</script>
<style lang="scss" scoped>
    .result-page{
        background: #fff;
        .success-box{
            .top{
                height: 5.82rem;
                width: 100%;
                background: url('../assets/image/result_bgd1.png')no-repeat 50% 50% / cover;
                position: relative;
                .tips{
                    font-size: 0.44rem;
                    color:#fff;
                    text-align: center;
                    position: absolute;
                    bottom:1.46rem;
                    left:0;
                    width: 100%;
                    letter-spacing: 1px;
                }
            }
            .bottom{
                padding:0.76rem 0;
                background: #fff;
                .tips{
                    font-size: 0.36rem;
                    line-height: 0.54rem;
                    color:#333;
                    width: 100%;
                    text-align: center;
                    margin:0 0 0.66rem 0;
                    span{
                        display: block;
                    }
                }
                .btns{
                    margin:0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 5.58rem;
                    .go-download{
                        width: 2.5rem;
                        height: 0.97rem;
                        text-align: center;
                        line-height: 0.97rem;
                        background: linear-gradient(90deg, #FF7585 0%, #C30D23 100%);
                        border:1px solid #FF7585;
                        border-radius: 0.48rem;
                        color:#fff;
                        font-size: 0.36rem;
                        &:active{
                            background:#C30D23 ;
                        }
                    }
                    .go-poster{
                        width: 2.5rem;
                        height: 0.97rem;
                        text-align: center;
                        line-height: 0.97rem;
                        background: #fff;
                        border:1px solid #999;
                        border-radius: 0.48rem;
                        color:#666;
                        font-size: 0.36rem;
                        &:active{
                           background: #f9f9f9; 
                        }
                    }
                }
                .img-code{
                    margin-top:0.74rem;
                    text-align: center;
                    img{
                        display: inline-block;
                        width: 2.52rem;
                    }
                    p{
                        font-size: 0.26rem;
                        line-height: 0.34rem;
                        color:#333;
                        margin-top:0.15rem;
                    }
                }
            }
        }
        .fail-box{
            .top{
                height: 5.82rem;
                width: 100%;
                background: url('../assets/image/result_bgd2.png')no-repeat 50% 50% / cover;
                position: relative;
                .tips{
                    font-size: 0.44rem;
                    line-height: 0.62rem;
                    color:#fff;
                    text-align: center;
                    position: absolute;
                    bottom:0.86rem;
                    left:0;
                    width: 100%;
                    letter-spacing: 1px;
                    span{
                        display: block;
                    }
                }
            }   
            .bottom{
                background: #fff;
                height: calc(100vh - 5.82rem);
                position: relative;
                .return{
                    position: absolute;
                    top:50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    width: 2.52rem;
                    height: 1rem;
                    line-height: 1rem;
                    background: linear-gradient(90deg, #FF7585 0%, #C30D23 100%);
                    border-radius: 0.48rem;
                    color:#fff;
                    font-size: 0.32rem;
                    text-align: center;
                    letter-spacing: 1px;
                    &:active{
                        background:#C30D23 ;
                    }
                }
            }
        }
        .dialog{
            position: fixed;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 3;
            background: rgba(0,0,0,0.7);
            .box{
                width: 5.03rem;
                height: 3.56rem;
                background: #fff;
                border-radius: 0.16rem;
                position: absolute;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
                padding-top:0.9rem;
                text-align: center;
                p{
                    font-size: 0.38rem;
                    color:#333;
                    line-height: 0.48rem;
                    font-weight: bold;
                }
                div{
                    margin:0.7rem auto 0;
                    width: 2.52rem;
                    height: 0.77rem;
                    background: linear-gradient(90deg, #FF7585 0%, #C30D23 100%);
                    border-radius: 0.48rem;
                    color:#fff;
                    line-height: 0.77rem;
                    font-size: 0.28rem;
                    letter-spacing: 1px;
                    &:active{
                        background:#C30D23 ;
                    }
                }
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>