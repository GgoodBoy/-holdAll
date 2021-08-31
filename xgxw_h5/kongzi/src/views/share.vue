<template>
    <div class="share-page">
        <div class="video-container">
            <Video :id="'player-con1'" :className="'player-controls1'" :duration="'615.28'" :source="'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/9.28%E7%A5%AD%E5%AD%94%E6%97%A5%EF%BC%88%E4%B8%8A%EF%BC%89%E5%AE%9A%E7%89%88.mp4'"></Video>
        </div>
        <div class="video-container">
            <Video :id="'player-con2'" :className="'player-controls2'" :duration="'769.64'" :source="'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/9.28%E7%A5%AD%E5%AD%94%E6%97%A5%EF%BC%88%E4%B8%8B%EF%BC%89%E5%AE%9A%E7%89%88.mp4'"></Video>
        </div>
        <img :src="require('../assets/image/code.png')" class="code"/>
        <p>长按二维码识别关注<span @click="download">学国学网</span></p>
        <p>回复“孔子”领取专属国学好礼</p>
        <div class="logo"></div>
    </div>
</template>
<script>
import Video from '../components/playVideo.vue'
// import code from '../assets/image/code.png'
export default {
    data(){
        return{
            // code:code
        }
    },
    components:{
        Video
    },
    mounted(){
        this.$http.post('/kz/point',{type:7}).then(res=>{
        })
    },
    methods:{
        download(){
            window.location.href="https://xgxm.xueguoxue.com/h5/download/index.html"
        }
    }
}
</script>
<style lang="scss">
    #app{
        position: relative!important;
    }
    .share-page{
        min-height: 100%;
        width: 100%;
        position: relative;
        background: url('../assets/image/share_page.png')no-repeat 50% 50%;
        background-size:100% 100%;
        padding:0.4rem 0;
        .video-container{
            width: 6.2rem;
            height: 3.64rem;
            background: #fff;
            box-shadow: 3px 4px 21px 6px rgba(41, 41, 41, 0.19);
            border-radius: 0.1rem;
            padding: 0.2rem;
            margin:0 auto;
            &:first-child{
                margin-bottom:0.4rem;
            }
        }
        .code{
            width: 2.4rem;
            height: 2.4rem;
            margin:0.3rem auto 0.15rem;
            display: block;
            border: none;
            outline: none;
        }
        p{
            color:#333;
            font-size: 0.3rem;
            text-align: center;
            line-height: 1.5;
            font-family: PingFangSC-Regular;
            span{
                color:#9e0e00;
                text-decoration: underline;
                font-family: PingFangSC-Regular;
            }
        }
        .logo{
            margin: 0.1rem auto 0;
            background: url('../assets/image/logo.png')no-repeat 50% 50% / cover;
            width:2.56rem;
            height: 0.8rem;
        }
    }
</style>