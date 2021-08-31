<template>
    <div class="short-video-poster" :class="{'show':show,'abnormal':hasOpenApp}">
        <div class="content-box">
            <i class="share-icon" @click="bgdFlag = true"></i>
            <i class="return-icon" @click="returnPage"></i>
            <div class="content">
            <div class="poster-bgd" v-if="posterBgd.length>0"><img :src="posterBgd" /></div>
            <div class="info">
                <div class="avatar">
                    <img :src="avatar"/>
                </div>
                <p class="title">
                    <span class="user-name">{{nickname}}</span>
                    <span>邀您一起学习</span>
                </p>
                <p class="short-name">{{name}}</p>
                <div class="short-surface"><img :src="backgroundUrl"/></div>
                <div class="qr-code-box">
                    <div class="qr-code" ref="qrCodeUrl">
                    </div>
                </div>
                <p class="tips">扫码查看精选视频</p>
            </div>
        </div>
        </div>
        
        <img :src="downloadUrl" class="download-img"/>
        <div class="poster-footer">
            <!-- <p class="poster-tips">长按上面图片保存，分享给朋友</p> -->
            <div class="model-box">
                <div class="model-list-box">
                    <div class="model-list">
                        <div class="model-item" v-for="(item,index) in modelList" :key="index" @click="changeBgd(item)">
                            <img :src="item.iconUrl" />
                            <i :class="iconId==item.id?'selected':''"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="to-wechat-bgd" :class="hasOpenApp?'abnormal':''" v-if="bgdFlag" @click="bgdFlag=false">
            <i></i>
            <p>请点击右上角···发送给朋友</p>
        </div>
    </div>    
</template>
<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas';
import {mapState} from 'vuex'
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
            posterBgd:'',
            avatar:'',
            nickname:'',
            name:'',
            backgroundUrl:'',
            iconId:'',
            bgdFlag:false,
            downloadUrl:'',
            modelList:[],
            shareImg:'',
            icon:''
        }
    },
    props:['shortVideoId'],
    computed:{
        ...mapState(['hasOpenApp'])
    },
    created(){
        if(this.shortVideoId){
            let uInfo = JSON.parse(this.$getCookie('uInfo'));
            this.convertUrlToBase64(uInfo.avatar,'avatar')
            this.nickname = uInfo.nickname;
            this.getShortVideoInfo(this.shortVideoId)
            this.getShareModelList()
        }
    },
    mounted(){
        this.createQRCode()
        setTimeout(()=>{
            this.show = true
        },1)
        // document.querySelector('.menu-wrap').style.visibility = "hidden"
    },
    methods:{
        returnPage(){
            this.show = false;
            setTimeout(()=>{
                this.$emit('update:shareType',0)
            },400)
        },
        /**
         * 创建二维码
         */
        createQRCode(){
            let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
            let url = window.location.href.split('#')[0]+`?wxshare=true&type=shortVideoShare&id=${this.shortVideoId}`
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
                    this.name = res.data.content.name;
                    this.convertUrlToBase64(res.data.content.backgroundUrl,'backgroundUrl')
                    this.icon = res.data.content.backgroundUrl
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
                        this.modelList = res.data.content;
                        window.scrollTo(0,0)
                        this.convertUrlToBase64(res.data.content[0].backgroundUrl,'posterBgd');
                        this.iconId = res.data.content[0].id
                    }
                }
            })
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
                if(key=='posterBgd'){
                    setTimeout(()=>{
                        // this.createPoster();
                        this.wxshare()
                    },1)
                }
            }
        },
        changeBgd(obj){
            if(this.iconId==obj.id) return false;
            window.scrollTo(0,0)
            this.convertUrlToBase64(obj.backgroundUrl,'posterBgd');
            this.iconId = obj.id;
        },
        /**
         * 创建分享海报
         */
        createPoster(){
            this.$toast.loading({
                mask: true,
                duration:0
            });
            let dom = document.querySelector('.content')
            let width = dom.offsetWidth;
            let height = dom.offsetHeight;
            let scale = 2; 
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
                this.downloadUrl = url
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
                        this.shareImg = res.data.content.resourceAbsoluteUrl;
                        this.wxshare()
                    }
                }).catch(()=>{
                    this.$toast.clear()    
                })
            })    
        },
        wxshare(){
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
                this.$toast.clear()
				if(res.data.status == 200){
                    let data = res.data.content;
                    let _title = this.nickname+'邀您一起学习'
                    let _desc = this.name;
                    let _imgUrl = this.icon;
                    let _link = window.location.href.split('#')[0]+`?wxshare=true&type=shortVideoShare&id=${this.shortVideoId}`
                    setShareInfo({
                        title:_title,
                        summary:_desc,
                        pic:_imgUrl,
                        url:_link,
                    });
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
                            title: _title, // 分享标题
                            desc: _desc, // 分享描述
                            link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: _imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success:()=>{
                            // 用户点击了分享后执行的回调函数
                            
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: _title, // 分享标题
                            link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: _imgUrl, // 分享图标
                            success:()=>{
                            // 用户点击了分享后执行的回调函数
                                
                            },
                        })
                        wx.onMenuShareQQ({
                            title: _title, // 分享标题
                            desc: _desc, // 分享描述
                            link: _link, // 分享链接
                            imgUrl: _imgUrl, // 分享图标
                            success:()=>{
                            // 用户确认分享后执行的回调函数
                                
                            },
                            cancel: function () {
                            // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .short-video-poster{
        position: absolute;
        top: 0px;
        left: 100%;
        background: #fff;
        z-index: 99;
        width: 100%;
        transition: all 0.3s;
        overflow: hidden;
        visibility: hidden;
        height: 110vh;
        // &.abnormal{
        //     padding-top:1rem;
        //     .share-icon,.return-icon{
        //         top:1.5rem;
        //     }
        // }
         &.show{
            left:0;
            visibility:visible;
        }
        .share-icon{
            position: absolute;
            z-index: 13;
            right: 0.3rem;
            top:0.5rem;
            background: url('../img/short-video-share.png') no-repeat 50% 50% / cover;
            display: block;
            width: 0.48rem;
            height: 0.48rem;
        }
        .return-icon{
            position: absolute;
            z-index: 13;
            left: 0.3rem;
            top:0.5rem;
            background: url('../img/short-video-return.png') no-repeat 50% 50% / cover;
            display: block;
            width: 0.48rem;
            height: 0.48rem;
        }
        .download-img{
            position: absolute;
            top:0;
            left: 0;
            width:100vw;
            height: 100vh;
            z-index: 10;
            opacity: 0;
            display: none;
        }
        .content-box{
            position: relative;
            z-index: 1;
            width: 100%;
            padding: 0.3rem 0.15rem 0;
            text-align: center;
             height: calc(100vh - 2rem);
            overflow-y:scroll;
             -webkit-overflow-scrolling: touch;
            .poster-bgd{
                position: absolute;
                top:0;
                left: 0;
                width: 100vw;
                height: 100vh;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .info{
                position: relative;
                z-index: 2;
                background: #fff;
                width: 5.6rem;
                margin:2rem auto;
                border-radius: 5px;
                padding: 0.86rem 0.5rem 0.6rem 0.5rem ;
            }
            .avatar{
                position: absolute;
                width: 1.3rem;
                height: 1.3rem;
                margin-left:-0.65rem;
                left: 50%;
                top:-0.65rem;
                border-radius: 50%;
                padding: 0.1rem;
                background: #fff;
                img{
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                }
            }
            .bgd{
                position: absolute;
                top:0;
                left: 0;
                height: 100%;
                width: 100%;
                z-index: 1;
            }
            .title{
                margin:0 0 0.28rem 0;
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
                width:100%;
                height: 2.6rem;
                margin:0.46rem 0;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .qr-code-box{
                // width: 1.2rem;
                // height: 1.2rem;
                margin-bottom:0.2rem;
                display: block;
                .qr-code{
                    display: inline-block;
                }
            }
            .tips{
                color:#231B14;
                font-size: 0.28rem;
                line-height: 1;
            }
        }
        .poster-footer{
            position: fixed;
            bottom:0;
            left: 50%;
            width: 100%;
            height: 2rem;
            z-index: 12;
            max-width: 414px;
            transform: translateX(-50%);
            .poster-tips{
                height: 0.66rem;
                line-height: 0.66rem;
                text-align: center;
                background:rgba(197,45,59,0.4);
                color:#fff;
                font-size: 0.28rem;
            }
            .model-box{
                height: 1.34rem;
                background: #fff;
                overflow: hidden;
                font-size: 0;
                .model-list-box,.button-box{
                    display: inline-block;
                    vertical-align: middle;
                    height: 1.44rem;
                    background: #fff;
                }
                .model-list-box{
                    overflow-y:hidden;
                    overflow-x: auto;
                    width:100%;
                    -webkit-overflow-scrolling: touch;
                    padding:0.33rem 0.45rem;
                }
                .model-list-box::-webkit-scrollbar{
                    display: none;
                    width: 0px;
                }
                .model-list{
                    height: 100%;
                    .model-item{
                        display:inline-block;
                        position: relative;
                        img{
                            width: 0.7rem;
                            height: 0.7rem;
                            margin:0 0.2rem;
                        }
                        .selected{
                            height: 0.25rem;
                            width: 0.25rem;
                            display: block;
                            background: url('../img/selected.png')no-repeat 50% 50%;
                            background-size: cover;
                            position: absolute;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                    }
                    
                }
                .button-box{
                    width: 2.6rem;
                    padding: 0.33rem 0.45rem 0.33rem 0.25rem;
                    button{
                        width: 100%;
                        height: 0.6rem;
                        line-height: 0.6rem;
                        text-align: center;
                        color:#fff;
                        font-size: 0.28rem;
                        background: #B5292F;
                        border:none;
                        outline: none;
                        border-radius: 15px;
                        letter-spacing: 1px;
                        margin:0.05rem 0;
                        &:active{
                            background: #8B1B1F;
                        }
                    }
                }
            }
        }
        .to-wechat-bgd{
            position: fixed;
            top:0;
            left: 50%;
            z-index: 9999;
            background: rgba(0,0,0,0.7);
            width: 100%;
            height: 100%;
            max-width: 414px;
            transform: translateX(-50%);
            &.abnormal{
                top:1rem;
            }
            i{
                position: absolute;
                right: 0.1rem;
                top:0;
                width: 1rem;
                height: 1.5rem;
                transform: rotate(-90deg);
                background: url('../img/arrow.png')no-repeat 50% 50%;
                background-size: contain;
            }
            p{
                position: absolute;
                right: 0.1rem;
                top:1.5rem;
                color:#fff;
                font-size: 0.32rem;
            }
        }
    }
</style>