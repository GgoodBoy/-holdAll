<template>
    <div class="short-video-share" :class="show?'show':''">
        <div class="share-content" >
            <img class="bgd" :src="bgd"/>
            <!-- <img :src="shareImg" class="poster-bgd" v-if="shareImg.length>0"/> -->
            <div class="content">
                <p class="title">
                    <span class="user-name">{{nickname}}</span>
                    <span>邀您一起学习</span>
                </p>
                <p class="short-name">{{name}}</p>
                <img class="short-surface" :src="backgroundUrl"/>
                <div class="qr-code-box"><div class="qr-code" ref="qrCodeUrl"></div></div>
                <p class="tips">扫码查看精选视频</p>
            </div>
        </div>
        <div class="share-box">
            <p class="tips">选择要分享到的平台</p>
            <div class="share">
                <div v-if="support" @click="shareTo('wechatFriend')">
                    <img src='../img/wechat.png' alt="">
                    <p>微信</p>
                </div>
                <div v-if="support" @click="shareTo('wechatTimeline')">
                    <img src='../img/wechat-circle.png' alt="">
                    <p>朋友圈</p>
                </div>
                <div @click="shareTo('weibo')">
                    <img src='../img/weibo.png' alt="">
                    <p>微博</p>
                </div>
                <div @click="shareTo('qqFriend')">
                    <img src='../img/qq.png' alt="">
                    <p>QQ</p>
                </div>
                <div class="copy-link"  ref="copyBtn" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="copy">
					<img src='../img/copy.png' alt=""/>
					<p>复制链接</p>
				</div>
                <input class="copy-target" id="input" :value="link" readonly/>
            </div>
            <div class="cancel" @click="hideShare">
                <p>取消分享</p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas';
function convertBase64UrlToBlob(urlData){
	var bytes=window.atob(urlData.split(',')[1]);
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	return new Blob( [ab] , {type : 'image/png'});
}
export default {
    data(){
        return{
            show:false,
            name:'',
            backgroundUrl:'',
            icon:'',
            nickname:'',
            bgd:'',
            nativeShare:'',
            support:'',
            link:'',
            shareImg:'',
        }
    },
    props:['shortVideoId'],
    computed:{
        ...mapState(['hasOpenApp'])
    },
    watch:{

    },
    created(){
        if(this.shortVideoId){
            this.nativeShare = new NativeShare()
            this.browserSupport()
            this.link = window.location.href.split('#')[0]+`?wxshare=true&type=shortVideoShare&id=${this.shortVideoId}`
            let uInfo = JSON.parse(this.$getCookie('uInfo'));
            this.nickname = uInfo.nickname;
            this.getShortVideoInfo(this.shortVideoId)
            this.getShareModelList()
        }  
    },
    mounted(){
		if(this.$refs.copyBtn){
            this.clipboard = new Clipboard(this.$refs.copyBtn)
        }
        this.createQRCode()
        setTimeout(()=>{
            this.show = true;
        },1)
        // document.querySelector('.menu-wrap').style.visibility = "hidden"
	},
    methods:{
        /**
		 * 浏览器是否支持微信、朋友圈分享
		 */
		browserSupport(){
			let UA = navigator.appVersion;
			let uc = UA.split('UCBrowser/').length > 1 ? 1 : 0;
			let qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0;
			let wx = /micromessenger/i.test(UA);
			if(uc||qq||wx){
				this.support = true;
			}else{
				this.support = false;
			}
        },
        /**
         * 复制
         */
        copy(){
			let clipboard = this.clipboard;
            clipboard.on('success',()=>{
                this.$toast('复制成功,快去分享给好友吧')
            });
            clipboard.on('error',()=>{
                this.$toast('该浏览器不支持自动复制，请手动复制网页链接地址');
            });
        },
        /**
         * 分享
         */
        shareTo(command){
            let shareInfo = {
                title: this.nickname+'邀您一起学习',
                desc: this.name,
                icon: this.icon,
            }
			let shareData = {
                title: shareInfo.title,
                desc: shareInfo.desc,
                link:this.link,
                icon: shareInfo.icon,
                success: function() {
                },
                fail:()=>{
                    this.$toast('当前浏览器不支持这类分享')
                }
            }
            this.nativeShare.setShareData(shareData)
            try {
                this.nativeShare.call(command)
            } catch(err) {

            }
        },
        hideShare(){
            this.show = false;
            setTimeout(()=>{
                this.$emit('update:shareType',0)
            },400)
        },
        /**
         * 创建二维码
         */
        createQRCode(){
            let url = this.link;
            let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
            let qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: url, // 二维码内容
                width:1.2*fontSize,
                height:1.2*fontSize
            })
        },
        /**
         * 获取短视频详情
         */
        getShortVideoInfo(id){
            let query = {
                shortVideoId:id
            }
            this.$http.post(this.$server.getShortVideoInfo,query).then(res=>{
                if(res.data.status==200){
                    this.name = res.data.content.name
                    this.icon = res.data.content.backgroundUrl
                    this.backgroundUrl = res.data.content.backgroundUrl;
                    // this.convertUrlToBase64(res.data.content.backgroundUrl,'backgroundUrl')
                }
            })
        },
        /**
         * 获取模板
         */
        getShareModelList(){
            this.$http.post(this.$server.getShareModelList,{}).then(res=>{
                if(res.data.status==200){
                    if(res.data.content.length>0){
                        window.scrollTo(0,0)
                        this.bgd = res.data.content[0].backgroundUrl
                        // this.convertUrlToBase64(res.data.content[0].backgroundUrl,'bgd',this.createPoster);
                    }
                }
            })
        },
        /**
         * url转base64
         */
        convertUrlToBase64(url,key,callback){
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
                if(callback && typeof callback == 'function'){
                    setTimeout(()=>{
                        callback()
                    },1)
                }
            }
        },
        /**
         * 创建分享海报
         */
        createPoster(){
            this.$toast.loading({
                mask: false,
                duration:10000
            });
            let dom = document.querySelector('.share-content')
            let width = dom.offsetWidth;
            let height = dom.offsetHeight;
            // let canvas  = document.createElement("canvas"); 
            let scale = 2; 
            // canvas.width = width * scale; 
            // canvas.height = height * scale; 
            // let content = canvas.getContext("2d");
            // content.scale(scale,scale);
            // let rect = dom.getBoundingClientRect();//获取元素相对于视察的偏移量
            // content.translate(-rect.left,-rect.top);//设置context位置，值为相对于视窗的偏移量负值，让图片复位
            html2canvas(dom,
            {
                dpi: window.devicePixelRatio*2,
                scale:scale,
                allowTaint:false,
                width:width,
                heigth:height,
                useCORS: true,
                logging: false,
            }).then((canvas) => {
                const context = canvas.getContext('2d');
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
                let url = canvas.toDataURL("image/png");
                let cookie = this.$getCookie('uInfo');
                let userId = cookie ? JSON.parse(cookie).userid  : '';
                let file = convertBase64UrlToBlob(url)
                let formData = new FormData();
                formData.append('file',file)
                formData.append('userId',userId)
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                }; 
                this.$http.post(this.$server.uploadImg,formData,config).then(res=>{
                    if(res.data.status == 200){
                        this.$toast.clear()
                        this.shareImg = res.data.content.resourceAbsoluteUrl;
                    }
                }).catch(()=>{
                    this.$toast.clear()    
                })
            })    
        }
    }
}
</script>
<style lang="scss" scoped>
    .short-video-share{
        position: absolute;
        top: 0px;
        left: 100%;
        background: #fff;
        z-index: 99;
        width: 100%;
        // padding-bottom: 2rem;
        transition: all 0.3s;
        overflow: hidden;
        visibility: hidden;
        height: 100vh;
        &.show{
            left:0;
            visibility:visible;
            .share-box{
                visibility:visible;
                opacity: 1;
                transition: visibility 1ms ease 0.3s,opacity 0.3s;
            }
        }
        .share-content{
            position: relative;
            z-index: 1;
            width: 100%;
            padding: 0.3rem 0.15rem 0;
            text-align: center;
            height: calc(100vh - 4.4rem);
            overflow-y:scroll;
             -webkit-overflow-scrolling: touch;
            .poster-bgd{
                position: absolute;
                top:0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 3;
            }
            .bgd{
                position: absolute;
                top:0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 1;
            }
            .content{
                position: relative;
                z-index: 2;
            }
            .title{
                margin:1.6rem 0 0.28rem 0;
                line-height: 0.24rem;
                font-size: 0.24rem;
                .user-name{
                    color:#C30D23;
                    margin-right: 0.2rem;
                }
            }
            .short-name{
                color:#3C3C3D;
                font-size: 0.36rem;
            }
            .short-surface{
                width: 5.5rem;
                height: 3.1rem;
                margin:0.46rem 0 0.55rem 0;
            }
            .qr-code-box{
                // width: 2rem;
                // height: 2rem;
                margin-bottom:0.2rem;
                display: block;
                .qr-code{
                    display: inline-block;
                    // width: 2rem;
                    // height: 2rem;
                }
            }
            .tips{
                color:#231B14;
                font-size: 0.36rem;
                line-height: 1;
            }
        }
        .share-box{
            position: fixed;
            background: #fff;
            width: 100%;
            height: 4.4rem;
            z-index: 2;
            left: 50%;
            max-width: 414px;
            transform: translateX(-50%);
            bottom:0;
            text-align: center;
            visibility: hidden;
             opacity: 0;
            .tips{
                color:#C30D23;
                font-size: 0.36rem;
                line-height: 1;
                margin-top:0.6rem;
                font-weight:bold;
            }
            .share{
                width: 100%;
                background-color:#fff;
                display: flex;
                justify-content: space-around;
                padding: 0 .3rem;
                align-items: center;
                text-align: center;
                margin:0.5rem 0;
                img{
                    width: .7rem;
                    height: .7rem;
                }
                p{
                    color: #9A9A9A;
                    font-size: .26rem;
                }
            }
            #input{
                position: absolute;
                left: 0;
                top:0;
                opacity: 0;
                z-index: -1;
            }
            .cancel{
                height: 1.1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1.1rem;
                background-color: #fff;
                text-align: center;
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                border-top:1px solid #e9e9e9;
                font-size: 0.32rem;
                letter-spacing: 1px;
                color:#ccc;
                p{
                    background: #B4272D;
                    width:2.4rem;
                    height: 0.7rem;
                    line-height: 0.7rem;
                    border-radius: 25px;
                    color:#fff;
                }
            }
        }   
    }
</style>