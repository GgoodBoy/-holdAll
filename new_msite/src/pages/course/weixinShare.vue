<template>
    <div class="wx-share-wrap">
        <div class="header">
            <div class="left-icon" @click="returnTo">
                <van-icon name="arrow-left" class="return-left"/>
            </div>
        </div>
        <div class="poster-body">
            <div class="poster-container">
                <div class="poster-img-box" :style="{'background':posterBgd.length==0?'#fff':'none'}">
                    <img :src="posterBgd" class="poster-bgd" v-if="posterBgd.length>0"/>
                    <div class="share-message">
                        <div class="user-header"><img :src="avatar" /></div>
                        <p class="user"><span class="user-name">{{nickname}}</span>邀请您一起学习</p>
                        <p class="course-title">{{title}}</p>
                        <img class="course-img" :src="surfacePlot"  />
                        <div class="qr-code">
                            <div class="qrcode" ref="qrCodeUrl">
                                <img :src="logo"/>
                            </div>
                            <p>扫码查看课程</p>
                        </div>
                    </div>
                </div>
            </div>
            <img :src="downloadUrl" class="download-img"/>
        </div>
        <div class="poster-footer">
            <p class="poster-tips">长按上面图片保存，分享给朋友</p>
            <div class="model-box">
                <div class="model-list-box">
                    <div class="model-list" :style="boxStyle">
                        <div class="model-item" v-for="(item,index) in modelList" :key="index" @click="changeBgd(item)">
                            <img :src="item.iconUrl" />
                            <i :class="iconId==item.id?'selected':''"></i>
                        </div>
                    </div>
                </div>
                <div class="button-box">
                    <button @click="bgdFlag=true">其他方式</button>
                </div>
            </div>
        </div>
        <div class="to-wechat-bgd" v-if="bgdFlag" @click="bgdFlag=false">
            <i></i>
            <p>请点击右上角···发送给朋友</p>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas';
import Logo from '@/assets/image/msite-logo.png'
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
            logo:Logo,
            posterBgd:'',
            surfacePlot:'',
            title:'',
            nickname:'',
            avatar:'',
            downloadUrl:'',
            modelList:[],
            boxStyle:{},
            iconId:'',
            bgdFlag:false
        }
    },
    created(){
        if(this.$route.params&&this.$route.params.courseId){
            document.title="长按保存图片";
            this.getCourseInfo();
            let uInfo = JSON.parse(this.$getCookie('uInfo'));
            this.convertUrlToBase64(uInfo.avatar,'avatar');
            this.nickname = uInfo.nickname;
        }else{
            this.$router.push('/')
        }
    },
    props:['shareFlag'],
    mounted(){
        this.createQRCode();
        let audioData = Object.assign({},this.audioData,{isout:true})
        this.setAudioData(audioData)
    },
    computed:{
        ...mapState(['audioData'])
    },
    methods:{
        ...mapActions(['setAudioData']),
        returnTo(){
            this.$emit('update:shareFlag',false)
        },
        /**
         * 获取课程信息
         */
        getCourseInfo(){
            const toast = this.$toast.loading({
                duration: 0, 
                forbidClick: true,
            });
            let query = {
               courseId:Number(this.$route.params.courseId)
            }
            this.$http.post(this.$server.getCourseInfo,query).then(res=>{
                this.$toast.clear()
                if(res.data.status==200){
                    let {surfacePlot,title} = res.data.content;
                    this.convertUrlToBase64(surfacePlot,'surfacePlot');
                    this.title = title;
                    let teacherName = res.data.content.lectureTeacherList[0]?res.data.content.lectureTeacherList[0].name:'';
                    let introduce = res.data.content.intro||'';
                    let obj = {title,surfacePlot,teacherName,introduce}
                    this.wxshare(obj);
                    this.getShareModelList();
                }
            })
        },
        /**
         * 生成二维码
         */
        createQRCode(){
            let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
            let url = window.location.origin+'/?wxshare=true&type=course&courseId='+this.$route.params.courseId
            let qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: url, // 二维码内容
                width:1.8*fontSize,
                height:1.8*fontSize
            })
        },
        /**
         * 查询课程分享模板列表
         */
        getShareModelList(){
            this.$http.post(this.$server.getShareModelList,{}).then(res=>{
                if(res.data.status==200){
                    this.$toast.clear();
                    this.modelList = res.data.content;
                    if(res.data.content.length>0){
                        this.convertUrlToBase64(res.data.content[0].backgroundUrl,'posterBgd',true);
                        // this.posterBgd = res.data.content[0].backgroundUrl;
                        this.iconId = res.data.content[0].id
                    }
                    this.$nextTick(()=>{
                        this.initModelWidth();
                    })
                   
                }
            })
        },
        /**
         * 初始化模板图片的宽度
         */
        initModelWidth(){
            let length = this.modelList.length;
            if(length<=4){
                this.boxStyle = {'width':'100%'};
            }else{
                let w = document.querySelector(".model-item").clientWidth;
                let boxWidth = w*length+10;
                this.boxStyle = {'width':`${boxWidth}px`};
                this.$nextTick(()=>{
                    document.querySelector(".model-list-box").scrollLeft = 20;
                })
            }
        },
        /**
         * 将url转base64
         */
        convertUrlToBase64(url,key,flag){
            if(flag){
                const toast = this.$toast.loading({
                    duration: 0, 
                    forbidClick: true,
                });
                
            }
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
                if(flag){
                    setTimeout(()=>{
                        this.createPoster();
                    },1)
                }
            }
        },
        /**
         * 创建分享海报
         */
        createPoster(){
            let dom = document.querySelector('.poster-img-box')
            let width = dom.offsetWidth;
            let height = dom.offsetHeight;
            let scale = 2
            let html2canvasFunc = window.html2canvas || html2canvas
            html2canvasFunc(dom,
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
                    this.downloadUrl = canvas.toDataURL("image/png");
                    this.$toast.clear();
                })    
        },
        /**
         * 改变海报背景
         */
        changeBgd(obj){
            if(this.iconId==obj.id) return false;
            this.convertUrlToBase64(obj.backgroundUrl,'posterBgd',true);
            this.iconId = obj.id;
        },
        wxshare(obj){
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    let {title,surfacePlot,teacherName,introduce} = obj;
                    let _title = teacherName+':'+title
                    let _desc = introduce;
                    let _link = window.location.origin+'/?wxshare=true&type=course&courseId='+this.$route.params.courseId;
                    let _imgUrl = surfacePlot;
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
    },
    beforeDestroy(){
        document.title = '学国学网 | 专注优秀传统文化教育'
    }
}
</script>
<style lang="scss" scoped>
    .wx-share-wrap{
        width: 100vw;
        height: 100vh;
        position: fixed;
        top:0;
        left: 0;
        z-index: 2000;
        background: #fff;
        .header{
            display: flex;
            height: 1rem;
            justify-content: space-between;
            align-items: center;
            position: relative;
            padding:  0 0.3rem;
            background: rgba(0,0,0,0.7);
            i{
                font-size: 0.32rem;
                color:#fff;
            }
        }
        .poster-body{
            padding: 0.45rem;
            background: rgba(0,0,0,0.7);
            min-height: 100%;
            position: relative;
            z-index: 1;
            .poster-container{
                border-radius: 6px;
                overflow: hidden;
            }
            .poster-img-box{
                padding: 1rem 0.5rem;
                position: relative;
                height: 10.3rem;
                .poster-bgd{
                    position: absolute;
                    top:0;
                    left: 0;
                    width: 100%;
                    height: 10.3rem;
                }
                .share-message{
                    background: #fff;
                    border-radius:8px;
                    box-shadow:0px 3px 10px 0px rgba(222,206,215,1);
                    position: relative;
                    text-align: center;
                    padding-top:0.95rem;
                    padding-bottom:0.5rem;
                    border:1px solid #dfdfdf;
                    .user-header{
                        position: absolute;
                        width: 1.2rem;
                        height: 1.2rem;
                        border-radius: 50%;
                        top:-0.6rem;
                        left: 50%;
                        margin-left: -0.6rem;
                        background: #fff;
                        padding: 0.1rem;
                        img{
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .user{
                        font-size: 0.24rem;
                        span{
                            color:#D33630;
                            margin-right: 0.2rem;
                        }
                    }
                    .course-title{
                        color:#3C3C3D;
                        font-size: 0.36rem;
                        margin:0.1rem 0 0.28rem 0;
                        font-weight: 700;
                    }
                    .course-img{
                        width: 4.6rem;
                        height: 2.6rem;
                    }
                    .qr-code{
                        overflow: hidden;
                    }
                    .qrcode{
                        width: 1.8rem;
                        height: 1.8rem;
                        margin:0.38rem auto 0.3rem;
                        border:1px solid #dfdfdf;
                        // overflow: hidden;
                        position: relative;
                        img{
                            position: absolute;
                            width: 0.3rem;
                            height: 0.3rem;
                            transform: translate(-50%,-50%);
                            top:50%;
                            left: 50%;
                            display: none;
                        }
                    }
                    .qr-code p{
                        font-size: 0.28rem;
                    }
                }
            }
            .download-img{
                position: absolute;
                top:0;
                left: 0;
                width: 7.5rem;
                padding: 0.45rem;
                // height: 13.34rem;
                z-index: 10;
                opacity: 0 ;
            }
        }
        .poster-footer{
            position: fixed;
            bottom:0;
            left: 0;
            width: 100%;
            height: 2rem;
            z-index: 2;
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
                    width: calc(100% - 2.6rem);
                    overflow-y:hidden;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    padding: 0.33rem 0 0.33rem 0.45rem;
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
                            background: url('../../assets/image/selected.png')no-repeat 50% 50%;
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
            left: 0;
            z-index: 9999;
            background: rgba(0,0,0,0.7);
            width: 100%;
            height: 100%;
            i{
                position: absolute;
                right: 0.1rem;
                top:0;
                width: 1rem;
                height: 1.5rem;
                transform: rotate(-90deg);
                background: url('../../assets/image/arrow.png')no-repeat 50% 50%;
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
