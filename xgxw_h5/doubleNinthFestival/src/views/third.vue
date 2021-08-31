<template>
    <div class="third-page">
        <img class="poster" :src="poster"/>
        <div class="poster-container" v-if="posterShow" @click="closePoster">
            <div class="poster-comp" @click.stop="posterShow=true">
                <posterComp :showTips.sync="showTips"/>
            </div>
            <p class="tips" v-show="showTips">长按图片保存到相册</p>
        </div>
        <div class="box">
            <div class="share-btn">
                <i @click="shareEvent"></i>
            </div>
            <div class="user-info">
                <div class="avatar"><img :src="avatar" /></div>
                <p class="name">{{name}}</p>
            </div>
            <div class="content">{{content}}</div>
            <div class="poster-swiper">
                <div class="my-swipe">
                    <div class="my-swipe-flex" :class="{'scroll':scrollFlag}">
                        <div class="item" :class="{'active':posterIndex==index}" v-for="(item,index) in swipeData" :key="index" @click="getPoster(index)">
                            <img :src="item"/>
                        </div>
                    </div>
                </div>
                <div class="prev" @click="scrollFlag=false">
                    <van-icon name="arrow-left" />
                </div>
                <div class="next" @click="scrollFlag=true">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="btn-box">
                <div class="btn" @click="goPage"></div>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="dialog" v-if="dialogVisbile1" @click="dialogVisbile1=false">
                <div class="dialog-box" @click.stop="dialogVisbile1=true">
                    <img :src="code" class="code"/>
                    <p class="tip1">长按关注【学国学网】</p>
                    <p class="tip2">再点返回即可保存祝福</p>
                </div>
            </div>
        </transition>
        <transition name="slide-fade">
            <div class="dialog" v-if="dialogVisbile2" @click="dialogVisbile2=false">
                <i class="share-arrow"></i>
                <p class="tip3">请点击上方···发送给朋友</p>
            </div>
        </transition>
    </div>
</template>
<script>
import {store,mutations} from '../store'
import code from '../assets/image/code.png'
import poster1 from '../assets/image/poster1.png'
import poster2 from '../assets/image/poster2.png'
import poster3 from '../assets/image/poster3.png'
import poster4 from '../assets/image/poster4.png'
import swiper1 from '../assets/image/swiper1.png'
import swiper2 from '../assets/image/swiper2.png'
import swiper3 from '../assets/image/swiper3.png'
import swiper4 from '../assets/image/swiper4.png'
import posterComp from './fourth.vue'
export default {
    data(){
        return {
            poster:poster1,
            avatar:'',
            name:'',
            code:code,
            swipeData:[
                swiper1,swiper2,swiper3,swiper4
            ],
            posterArr:[poster1,poster2,poster3,poster4],
            scrollFlag:false,
            dialogVisbile1:false,
            dialogVisbile2:false,
            posterIndex:0,
            posterShow:false,
            showTips:false
        }
    },
    components:{
        posterComp
    },
    computed:{
        content(){
            return store.content
        },
        userInfo(){
            return store.userInfo
        },
        people(){
            return store.people
        },
        step(){
            return store.step
        }
    },
    created(){
        if(this.step!=3){
            this.$router.replace('/')
        }
        if(this.userInfo.nickname){
            this.avatar = this.userInfo.headimgurl;
            this.name = this.userInfo.nickname;
        }
        this.codeAlert()
        document.addEventListener('visibilitychange',()=>{
            if(document.hidden){
                this.dialogVisbile1 = false;
            } 
        })
    },
    methods:{
        setPosterIndex:mutations.setPosterIndex,
        setPeople:mutations.setPeople,
        closePoster(){
            this.posterShow=false;
            this.showTips = false;
        },
        getPoster(index){
            this.poster = this.posterArr[index]
            this.posterIndex = index;
        },
        goPage(){
            this.setPosterIndex(this.posterIndex);
            let query = {
                type:4
            }
            this.$http.post(this.$server.point,query).then(res=>{
                if(res.data.status==200){
                    this.setPeople(res.data.content.num)
                }
            })
            this.posterShow = true;
        },
        /**
         * 判断当前用户48小时内是否弹出过公众号二维码，
         * 如果弹出，48小时内不再弹
         */
        codeAlert(){
            let compare = 24*60*60*1000*2;
            // compare = 60*1*1000;
            let time = localStorage.getItem('codeTime');
            if(time){
                let value = new Date().getTime() - time;
                if(value>compare){
                    this.setTime()
                }else{
                    this.dialogVisbile1 = false;
                } 
            }else{
                this.setTime()
            }
        },
        setTime(){
            let time = new Date();
            let y = time.getFullYear();
            let mm = time.getMonth() + 1;
            let d = time.getDate();
            let h = time.getHours();
            let m = time.getMinutes();
            let date = `${y}/${mm}/${d} ${h}:${m}`
            localStorage.setItem('codeTime',new Date(date).getTime());
            this.dialogVisbile1 = true;
        },
        shareEvent(){
            this.dialogVisbile2 = true;
            let query = {
                type:5
            }
            this.$http.post(this.$server.point,query).then(res=>{
                if(res.data.status==200){
                    this.setPeople(res.data.content.num);
                    this.share()
                }
            })
        },
        share(){
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            this.$http.get(`/wx/getConfig?url=${url}`).then(res=>{
                if(res.data.status == 200){
                    let data = res.data.content;
                    let title = `我是${this.userInfo.nickname}，我在重阳节为家人祈福`;
                    let desc = `已有${this.people}人为家人送出祝福`;
                    let link = window.location.origin+window.location.pathname;
                    let imgUrl = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/kongdan/cyj.png'
                    wx.config({
                        debug:false,
                        appId:data['appId'],
                        timestamp:data['timeStamp'],
                        nonceStr:data['nonceStr'],
                        signature:data['signature'],
                        jsApiList: [
                            'checkJsApi',
                            'updateAppMessageShareData',
                            'updateTimelineShareData',
                            'onMenuShareAppMessage',
                            'onMenuShareTimeline',
                            'onMenuShareQQ'
                        ]
                    }); 
                    wx.ready(()=>{
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success:()=>{
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: ()=>{
                            },
                        })
                        wx.onMenuShareQQ({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接
                            imgUrl: imgUrl, // 分享图标
                            success:()=>{
                            },
                            cancel: function () {
                            // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
    .slide-fade-enter,.slide-fade-leave-to{
        opacity: 0;
    }
    .slide-fade-enter-to,.slide-fade-leave{
        opacity:1;
    }
    .slide-fade-enter-active,.slide-fade-leave-active{
        transition: all 0.3s;
    }
    .third-page{
        height: 100%;
        position: relative;
        overflow: hidden;
        .poster-container{
            z-index: 5;
            position: absolute;
            top:0;
            left: 0;
            width:100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            .poster-comp{
                position: absolute;
                top:5%;
                left:17%;
                width: 66%;
                min-height: 70%;
                // height: 90%;
                overflow: hidden;
            }
            .tips{
                width:100%;
                font-size: 0.28rem;
                position: absolute;
                text-align: center;
                color:#fff;
                left: 0;
                top:95%;
            }
        }
        .poster,.box{
            width: 100%;
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 1;
        }
        .box{
            z-index: 2;
            padding: 0 0.3rem;
            .share-btn{
                width: 100%;
                height: 0.62rem;
                margin-bottom: 0.3rem;
                position: absolute;
                right: 0;
                top:0;
                i{
                    position: absolute;
                    right: 0;
                    top:0;
                    width: 1.38rem;
                    height: 0.62rem;
                    background: url('../assets/image/share_btn.png')no-repeat 50% 50%;
                    background-size: 100%;
                    display: block;
                }
            }
            .user-info{
                font-size: 0;
                padding: 0 0.15rem;
                height: 1.28rem;
                .avatar{
                    width:1.28rem;
                    height: 1.28rem;
                    border-radius: 50%;
                    position: relative;
                    display: inline-block;
                    vertical-align: middle;
                    background: #fff;
                    border-radius: 50%;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 1.2rem;
                        height: 1.2rem;
                        border-radius: 50%;
                        top:50%;
                        left: 50%;
                        position: absolute;
                        transform: translate(-50%,-50%);
                    }
                }
                .name{
                    font-size:0.36rem;
                    margin-left: 0.15rem;
                    display: inline-block;
                    vertical-align: middle;
                }
            }
            .content{
                width: 100%;
                padding: 0 0.2rem;
                font-size:0.4rem;
                line-height:0.52rem ;
                margin-top:0.5rem
            }
            .poster-swiper{
                height: 3.14rem;
                border-radius: 0.2rem;
                background: rgba(235,145,87,0.7);
                margin-top:3rem;
                position: relative;
                -moz-user-select: none; 
                -webkit-user-select: none; 
                -ms-user-select: none; 
                -khtml-user-select: none; 
                user-select: none;
                .next,.prev{
                    position: absolute;
                    top:50%;
                    padding: 0.1rem;
                    margin-top:-0.2rem;
                    font-size: 0;
                    z-index: 2;
                    i{
                        font-size: 0.36rem;
                        color:#fff;
                    }
                    &.prev{
                        left:0.1rem
                    }
                    &.next{
                        right: 0.1rem;
                    }
                }
                .my-swipe{
                    width:70%;
                    margin:0 auto;
                    height:100%;
                    padding: 0.38rem 0;
                    overflow: hidden;
                    position: relative;
                    .my-swipe-flex{
                        position: absolute;
                        display: flex;
                        top:0.38rem;
                        left:0;
                        transform: translateX(0);
                        transition: transform 0.3s ease;
                        padding: 0 0 0 1px;
                        &.scroll{
                            transform: translateX(-1.72rem);
                            padding: 0 1px 0 0;
                        }
                        .item{
                            width: 1.34rem;
                            height: 2.36rem;
                            margin-right: 0.4rem;
                            flex-shrink: 0;
                            position: relative;
                            &.active{
                                border:1px solid #C30D23;
                            }
                            &:last-child{
                                margin-right: 0.32rem;
                            }
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
            .btn-box{
                margin-top:0.5rem;
                width: 100%;
                text-align: center;
                .btn{
                    display: inline-block;
                    width: 3.4rem;
                    height: 1.2rem;
                    background: url('../assets/image/third_btn.png')no-repeat 50% 50% / cover;
                    -moz-user-select: none; 
                    -webkit-user-select: none; 
                    -ms-user-select: none; 
                    -khtml-user-select: none; 
                    user-select: none;
                    animation: scaleBtn 3s linear both infinite;
                }
            }
        }
        .dialog{
            position: fixed;
            top:0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 6;
            .share-arrow{
                position: absolute;
                width: 1.2rem;
                height: 1.2rem;
                right: 0.1rem;
                top:0.3rem;
                background: url('../assets/image/arrow.png')no-repeat 50% 50% /cover;
                transform: rotate(-90deg);
            }
            .tip3{
                position: absolute;
                right: 0.1rem;
                top:1.6rem;
                font-size: 0.32rem;
                color:#fff;
            }
            .dialog-box{
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
                text-align: center;
                width: 80%;
                .code{
                    width: 2.9rem;
                    height: 2.9rem;
                    margin-bottom:0.4rem;
                    display: inline-block;
                }   
                p{
                    color:#fff;
                    font-size: 0.36rem;
                    height: 0.56rem;
                    text-align: center;
                    &.tip1{
                        text-indent: 0.3rem;
                    }
                }
            }
        }
    }
</style>