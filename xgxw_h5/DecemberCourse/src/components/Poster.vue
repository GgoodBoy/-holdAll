<template>
    <div class="poster-page" :class="{'active':active}">
        <div class="section1" v-show="downloadUrl.length>0">
            <van-icon name="cross" class="close-btn" @click="closePage"/>
            <img :src="downloadUrl"/>
        </div>
        <div class="section2" ref="posterBox">
            <img :src="poster" class="bgd"/>
            <div class="bottom">
                <div class="left-box">
                    <img :src="avatar" class="avatar"/>
                    <div class="info">
                        <p class="user-name">{{userInfo.nickname}}</p>
                        <p>正在参加《菜根谭》上新福利活动</p>
                        <p>一起来扫码参与吧~</p>
                    </div>
                </div>
                <div class="code" ref="qrCodeUrl"></div>
            </div>
        </div>
    </div>
</template>
<script>
//截图坑
//1.box不能存在transform,包括主容器
//2.容器的scrollLeft,scrollTop为0

import poster from '@/assets/image/poster.jpg'
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas';
import {store,mutations} from '../store'

export default {
    data(){
        return{
            poster:poster,
            downloadUrl:'',
            createQRCodeFlag:false,
            active:false,
            avatar:''
        }
    },
    computed:{
        userInfo(){
            return store.userInfo;
        },
        posterShow(){
            return store.posterShow;
        },
        scrollTop(){
            return store.scrollTop;
        }
    },
    watch:{
        userInfo(cur){
            if(cur.nickname){
                this.convertUrlToBase64(cur.avatar,'avatar')
                this.createQRCode()
            }
        },
        posterShow(cur){
            if(cur){
                this.setScrollTop(document.documentElement.scrollTop||document.body.scrollTop)
                this.active = true;
                setTimeout(()=>{
                    document.documentElement.scrollTop = document.body.scrollTop = 0;
                },150)
                if(this.downloadUrl.length==0){
                    const toast = this.$toast.loading({
                        duration: 0,
                        forbidClick: true,
                        message: '海报生成中...',
                    });
                    setTimeout(()=>{
                        this.createPoster()
                    },500)
                }
            }
        }
    },
    methods:{
        setPosterShow:mutations.setPosterShow,
        setScrollTop:mutations.setScrollTop,
        closePage(){
            this.active = false;
            document.documentElement.scrollTop = document.body.scrollTop = this.scrollTop
            setTimeout(()=>{
                this.setPosterShow(false)
            },300)
        },
        convertUrlToBase64(url,key){
            let image = new Image()
            image.setAttribute('crossOrigin','Anonymous');
            image.src= url + '?time=' + new Date().valueOf();
            image.onload = ()=>{
                let canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, image.width, image.height);
                let dataURL = canvas.toDataURL("image/png");
                this[key] = dataURL;
            }
        },
        /**
         * 生成二维码
         */
        createQRCode(){
            if(this.createQRCodeFlag) return;
            let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
            let url = window.location.origin+window.location.pathname+`?activityShareUserId=${this.userInfo.userid}`
            setTimeout(()=>{
                let qrcode = new QRCode(this.$refs.qrCodeUrl, {
                    text:url,
                    width:2*fontSize,
                    height:2*fontSize,
                    correctLevel:QRCode.CorrectLevel.L
                })
                this.createQRCodeFlag = true;
            },0)
        },
        /**
         * 创建海报,scroll必须为0,不然截图有空白
         */
        createPoster(){
            // const toast = this.$toast.loading({
            //     duration: 0,
            //     forbidClick: true,
            //     message: '海报生成中...',
            // });
            let dom = this.$refs.posterBox;
            let width = dom.offsetWidth;
            let height = dom.offsetHeight;
            let scale = 2
            let html2canvasFunc = window.html2canvas || html2canvas
            setTimeout(()=>{
                html2canvasFunc(dom,
                {
                    dpi: window.devicePixelRatio*2,
                    scale:scale,
                    allowTaint:false,
                    width:width,
                    heigth:height,
                    useCORS: true,
                    logging: false,
                    scrollY: 0, 
                    scrollX: 0,
                }).then((canvas) => {
                    const context = canvas.getContext('2d');
                    context.mozImageSmoothingEnabled = false;
                    context.webkitImageSmoothingEnabled = false;
                    context.msImageSmoothingEnabled = false;
                    context.imageSmoothingEnabled = false;
                    this.downloadUrl = canvas.toDataURL("image/png");
                    setTimeout(()=>{
                        let h1 = document.querySelector('.poster-page').clientHeight;
                        let h2 = document.querySelector('.poster-page .section1').clientHeight;
                        if(h1>h2){
                            let top = ((h1-h2)/4);
                            document.querySelector('.poster-page .section1').style.top = `${top}px`
                        }else{
                            document.querySelector('.poster-page .section1').style.top = `-4px`
                        }
                        this.$toast.clear()
                    },500)
                }).catch(()=>{
                    this.$toast.clear()
                    setTimeout(()=>{
                        this.$toast('海报生成失败，请重试')
                        this.active = false;
                        this.setPosterShow(false)
                    },1)
                })    
            },300)
        }
    }
}
</script>
<style lang="scss" scoped>
    .poster-page{
        width: 100%;
        height: 100%;
        position: fixed;
        overflow: auto;
        top:100%;
        left:0;
        z-index: 2;
        background: #fbfcfd;
        transition: top 0.3s ease;
        &.active{
            top:0;
        }
        .section1{
            transform:scale(0.85);
            width: 100%;
            z-index: 2;
            position: relative;
            img{
                width: 100%;
            }
            .close-btn{
                font-size: 0.6rem;
                position: absolute;
                right:-0.3rem;
                top:-0.7rem;
            }
        }
        .section2{
            position: absolute;
            width: 100%;
            top:-10000px;
            left: 0;
            .bottom{
                position: absolute;
                bottom:0;
                left:0;
                background: #BA3A4A;
                width: 100%;
                height: 1.6rem;
                padding:0 0.3rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .left-box{
                    font-size: 0;
                    .avatar{
                        display: inline-block;
                        vertical-align: middle;
                        width: 0.88rem;
                        height:0.88rem;
                        border-radius: 50%;
                        margin-right: 0.12rem;
                    }
                    .info{
                        display: inline-block;
                        vertical-align: middle;
                        p{
                            color:#FFFEFE;
                            line-height: 0.28rem;
                            font-size: 0.24rem;
                        }
                        .user-name{
                            color:#fff;
                            line-height: 0.28rem;
                            font-size: 0.28rem;
                            margin-bottom:0.1rem;
                        }
                    }
                }
                .code{
                    width: 2rem;
                    height:2rem;
                    transform: scale(0.6);
                }
            }
        }
    }
</style>