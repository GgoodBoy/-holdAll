<template>
    <div class="index-page">
        <div class="first-box" @click="playMusic" @touchstart="playMusic">
            <div class="box">
                <p class="p1" ref="p1" :class="{'text-show':show1}"><span>天不生仲尼</span> <span>万古如长夜</span></p>
                <p class="p2" ref="p2" :class="{'text-show':show2}">今天是孔子诞辰<span>2571</span>年</p>
                <p class="p3" ref="p3" :class="{'text-show':show3}">祭礼</p>
                <p class="p4" ref="p4" :class="{'text-show':show4}"><span>是中华民族缅怀先圣</span><span>继承优良传统重要活动</span></p>
                <p class="p5" ref="p5" :class="{'text-show':show5}">是世界祭礼史上的奇迹</p>
                <p class="p6" ref="p6" :class="{'show':show6}"><span>整个祭孔仪式中</span><span>最引人瞩目的环节之一是三献礼</span><span>分初献,亚献和终献</span><span>三个步骤</span></p>
            </div>
            <div class="skip" v-if="show3||show4||show5" @click="skipEvent">跳过</div>
            <div class="gesture" :class="{'show':show6}">
                <i class="cursor"></i>
                <i class="top"></i>
                <p>向上滑动</p>
            </div>
        </div>
        <div class="second-box" :class="{'show':next}">
            <div class="shade" :class="{'none':hidden,'display':displayFlag}"></div>
            <div class="box section1"  :class="{'active':sectionActive1,'action':action1,'hidden':hidden1,'display':displayFlag}">
                <div class="xian-box" :class="{'lower':!isWxAndApp}">
                    <div class="xian-bgd" ref="dom1" >
                        <div class="bgd1"></div>
                        <div class="bgd2"></div>
                    </div>
                    <div class="bgd-temp"></div>
                </div>
                <div class="title">
                    <i class="l-arrow"></i>
                    <div></div>
                    <i class="r-arrow"></i>
                </div>
                <div class="text" :class="btnShow1?'btn-show':''">
                    <div class="t"></div>
                    <div class="btn" @click="clickEvent(1)" ref="btn1" :class="{'continue':continueFlag}">
                        <div></div>
                        <i class="cursor"></i>
                    </div>
                </div>
            </div>   
            <div class="section2 box" :class="{'active':sectionActive2,'action':action2,'hidden':hidden2}">
                <div class="xian-box" :class="{'lower':!isWxAndApp}">
                    <div class="xian-bgd" ref="dom2">
                        <div class="bgd1"></div>
                        <div class="bgd2"></div>
                    </div>
                    <div class="bgd-temp"></div>
                </div>
                <div class="title">
                    <i class="l-arrow"></i>
                    <div></div>
                    <i class="r-arrow"></i>
                </div>
                <div class="text" :class="btnShow2?'btn-show':''">
                    <div class="t"></div>
                    <div class="btn" @click="clickEvent(2)" ref="btn2" :class="{'continue':continueFlag}">
                        <div></div>
                        <i class="cursor"></i>
                    </div>
                </div>
            </div>
            <div class="section3 box" :class="{'active':sectionActive3,'action':action3,'hidden':hidden3}">
                <div class="xian-box" :class="{'lower':!isWxAndApp}">
                    <div class="xian-bgd" ref="dom3">
                        <div class="bgd1"></div>
                        <div class="bgd2"></div>
                    </div>
                    <div class="bgd-temp" ref="temp"></div>
                </div>
                <div class="title">
                    <i class="l-arrow"></i>
                    <div></div>
                    <i class="r-arrow"></i>
                </div>
                <div class="text" :class="btnShow3?'btn-show':''">
                    <div class="t"></div>
                    <div class="btn" @click="clickEvent(3)" :class="{'continue':continueFlag}">
                        <div></div>
                        <i class="cursor"></i>
                    </div>
                </div>
            </div>
            <div class="dialog" v-if="dialogVisble" @click="cancelDialog">
                <!-- <div class="dialog-box" :class="{'show':dialog1}">
                    <div class="yun"></div>
                    <div class="text"></div>
                    <div class="xingxing1"></div>
                    <div class="xingxing2"></div>
                    <div class="xingxing3"></div>
                    <div class="yanhua1"></div>
                    <div class="yanhua2"></div>
                    <div class="btn" @click.stop="know"></div>
                </div> -->
                <div class="data" :class="{'show':dialog2}">
                    <div>
                        <p>您是全国</p>
                        <p>第{{people+1}}位参与者</p>
                        <p>感谢您大力弘扬传统文化</p>
                    </div>
                    <div class="share" @click.stop="shareEvent"></div>
                    <div class="go-course" @click.stop="goCourse"></div>
                    <div class="logo-box">
                        <img :src="require('../assets/image/logo2.png')"/>
                    </div>
                </div>
                <div class="share-wechat-box" :class="{'show':dialog3}">
                    <div class="arrow"></div>
                    <p>请点击右上方按钮分享给好友</p>
                </div>
                <div class="share-box" :class="{'show':dialog4}">
                    <div class="icon-area">
                        <div ref="copyBtn1" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="CopyVal(1)">
                            <div class="wexin"></div>
                            <p>微信</p>
                        </div>
                        <div ref="copyBtn2" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="CopyVal(2)">
                            <div class="pyq"></div>
                            <p>朋友圈</p>
                        </div>
                    </div>
                    <div class="cancel" @click.stop="cancelEvent">取消分享</div>
                </div>
                <div class="code-box" :class="{'show':dialog5}">
                    <img :src="require('../assets/image/code.png')" class="code"/>
                    <p>关注公众号，</p>
                    <p>发送“孔子”即可免费获得</p>
                </div>
            </div>
        </div>
        <input id="input" :value="link" readonly/>
    </div>
</template>
<script>
import Clipboard from 'clipboard'
export default {
    data(){
        return{
            lower:false,
            show1:false,
            show2:false,
            show3:false,
            show4:false,
            show5:false,
            show6:false,
            next:false,
            hidden:false,
            sectionActive1:false,
            action1:false,
            btnShow1:false,
            hidden1:false,
            sectionActive2:false,
            action2:false,
            btnShow2:false,
            hidden2:false,
            sectionActive3:false,
            action3:false,
            btnShow3:false,
            hidden3:false,
            dialogVisble:false,
            dialog1:false,
            dialog2:false,
            dialog3:false,
            dialog4:false,
            dialog5:false,
            people:0,
            isWxAndApp:false,
            isApp:false,
            clickFlag:false,
            link:'',
            audio:'',
            clipboard1:'',
            clipboard2:'',
            displayFlag:false,
            continueFlag:false,
            shareFlag:false
        }
    },
    watch:{
        show6(cur){
            if(cur){
                this.touchEvent();
            }
        },
        dialog4(cur){
            if(cur){
                this.clipboard1 = new Clipboard(this.$refs.copyBtn1)
                this.clipboard2 = new Clipboard(this.$refs.copyBtn2)
            }
        }
    },
    created(){
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.isWxAndApp = true;
        }else if (ua.match(/QQ/i) == "qq" &&  ua.match(/MQQbrowser/i)!='mqqbrowser'){
            this.isWxAndApp = true;
        }
        let u = navigator.userAgent;
        let isIos = !(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1);
        if(isIos){
            try {    
         	    window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
              	this.isWxAndApp = true;
                this.isApp = true;
            }
            catch(err) {
			}
        }else{
            if(window.android){
                if(window.android.notify){
                    this.isWxAndApp = true;
                    this.isApp = true;
                }
            }
        }
        this.lower = document.documentElement.clientHeight<=603?true:false
    },
    mounted(){
        this.link = window.location.href;
        let dom = document.createElement('audio');
        dom.src = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/kongdan/audio.mp3';
        dom.loop = 'loop';
        document.querySelector('.index-page').appendChild(dom);
        dom.play()
        this.audio = dom;
        setTimeout(()=>{
            if (window.WeixinJSBridge) {
                WeixinJSBridge.invoke('getNetworkType', {}, (e)=>{
                    dom.play()
                }, false);
            } else {
                document.addEventListener("WeixinJSBridgeReady", ()=>{
                    WeixinJSBridge.invoke('getNetworkType', {},(e)=>{
                        dom.play()
                    });
                }, false);
            }
        })
        this.$http.post('/kz/point',{type:0}).then(res=>{
            if(res.data.status==200){
                this.people = res.data.content.num;
                let timer = setInterval(()=>{
                    if(window.wx){
                        this.share()
                        clearInterval(timer)
                    }
                },2000)
            }
        })
        setTimeout(()=>{
            this.showEvent()
        },1)
    },
    methods:{
        playMusic(){
            if(this.audio.pause){
                this.audio.play()
            }
        },
        skipEvent(){
            this.show3 = this.show4 = this.show5 = false;
            this.show6 = true;
            this.$http.post('/kz/point',{type:1}).then(res=>{
            })
        },
        showEvent(){
            this.show1 = true;
            this.$refs.p1.addEventListener('animationend',(e)=>{
                this.show1 = false;
                this.show2 = true;
            })
            this.$refs.p2.addEventListener('animationend',(e)=>{
                this.show2 = false;
                this.show3 = true;
            })
            this.$refs.p3.addEventListener('animationend',(e)=>{
                this.show3 = false;
                this.show4 = true;
            })
            this.$refs.p4.addEventListener('animationend',(e)=>{
                this.show4 = false;
                this.show5 = true;
            })
            this.$refs.p5.addEventListener('animationend',(e)=>{
                this.show5 = false;
                this.show6 = true;
            })
        },
        touchEvent(){
            let startY,disY,moveY,distance = 10
            const dom = document.querySelector('.first-box');
            dom.addEventListener('touchstart',(e)=>{
                if(this.next) return;
                startY = e.targetTouches[0].pageY
                disY = startY-moveY;
            })
            dom.addEventListener('touchmove',(e)=>{
                moveY = e.touches[0].pageY - disY;
            })
            dom.addEventListener('touchend',(e)=>{
                let endY = e.changedTouches[0].pageY;
                if(Math.abs(endY - startY)>distance){
                    if((endY - startY)<distance){
                        this.next = true;
                        setTimeout(()=>{
                            this.displayFlag = true;
                            this.sectionActive1 = true;
                            setTimeout(() => {
                                this.action1 = true;
                                this.$refs.dom1.addEventListener('animationend',(e)=>{
                                    this.btnShow1 = true;
                                    this.$refs.btn1.addEventListener('animationend',(e)=>{
                                        setTimeout(()=>{
                                            this.clickFlag = true;
                                        },0)
                                    })
                                })
                            }, 2000);                            
                        },3000)
                    }
                }
            })
        },
        clickEvent(type){
            if(!this.clickFlag) return;
            if(type==1){
                if(this.hidden1){
                    this.sectionActive1 = false;
                    this.hidden = false;
                    this.sectionActive2 = true;
                    this.continueFlag = false
                    setTimeout(()=>{
                        this.action2 = true;
                        this.clickFlag = false;
                        this.$refs.dom2.addEventListener('animationend',(e)=>{
                            this.btnShow2 = true;
                            setTimeout(()=>{
                                this.clickFlag = true;
                            },1000)
                        })
                    },1000)
                }else{
                    this.$http.post('/kz/point',{type:2}).then(res=>{
                        this.people = res.data.content.num;
                    })
                    this.hidden = true;
                    this.hidden1 = true;
                    this.clickFlag = false;
                    this.continueFlag = true;
                    setTimeout(()=>{
                        this.clickFlag = true;
                    },1000)
                } 
            }
            else if(type==2){
                if(this.hidden2){
                    this.sectionActive2 = false;
                    this.hidden = false;
                    this.sectionActive3 = true;
                    this.continueFlag = false;
                    setTimeout(()=>{
                        this.action3 = true;
                        this.clickFlag = false;
                        this.$refs.dom3.addEventListener('animationend',(e)=>{
                            this.btnShow3 = true;
                            setTimeout(()=>{
                                this.clickFlag = true;
                            },1000)
                        })
                    },1000)
                }else{
                    this.clickFlag = false;
                    setTimeout(()=>{
                        this.clickFlag = true;
                    },1000)
                    this.$http.post('/kz/point',{type:3}).then(res=>{
                        this.people = res.data.content.num;
                    })
                    this.hidden = true;
                    this.hidden2 = true;
                    this.continueFlag = true;
                }
            }else{
                if(this.hidden3){
                }else{
                    this.$http.post('/kz/point',{type:4}).then(res=>{
                        this.people = res.data.content.num;
                    })
                    this.hidden = true;
                    this.hidden3 = true;
                    this.$refs.temp.addEventListener('animationend',(e)=>{
                        this.sectionActive3 = false;
                        setTimeout(()=>{
                            this.dialogVisble = true;
                            setTimeout(()=>{
                                this.$http.post('/kz/point',{type:5}).then(res=>{
                                    this.people = res.data.content.num;
                                })
                                this.dialog2 = true;
                            },300)
                        },300)
                    })
                }
            }
        },
        // know(){
        //     this.$http.post('/kz/point',{type:5}).then(res=>{
        //         if(res.data.status==200){
        //             this.people = res.data.content.num;
        //             this.dialog1 = false;
        //             this.dialog2 = true;
        //         }
        //     })
        // },
        shareEvent(){
            this.dialog2 = false;
            if(this.isWxAndApp){
                this.dialog3 = true;
            }else{
                this.dialog4 = true;
            }
            if(this.isApp){
                this.$http.post('/kz/point',{type:6}).then(res=>{
                })
            }
            if(this.shareFlag) return;
            this.share()
            this.shareFlag = true;
        },
        cancelDialog(){
            if(this.dialog3){
                this.dialog2 = true;
                this.dialog3 = false;
            }
            if(this.dialog5){
                this.dialog2 = true;
                this.dialog5 = false;
            }
        },
        goCourse(){
            this.$http.post('/kz/point',{type:7}).then(res=>{
            })
            this.dialog5 = true;
            this.dialog2 = false;
        },
        cancelEvent(){
            this.dialog2 = true;
            this.dialog4 = false;
        },
        CopyVal(type){
            if(type==1){
                let clipboard = this.clipboard1;
                clipboard.on('success',()=>{
                    this.$toast({
                        message:'链接复制成功，快去粘贴给好友吧',
                    });
                });
            }else{
                let clipboard = this.clipboard2;
                clipboard.on('success',()=>{
                    this.$toast({
                        message:'链接复制成功，快去粘贴给好友吧',
                    });
                });
            }
            this.$http.post('/kz/point',{type:6}).then(res=>{
            })
        },
        share(){
            let u = navigator.userAgent;
            let isIos = !(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1); 
            let message = {
                describe:'在APP内部展示页面的分享按钮',
                method:"share",
                params:{
                    title:`我是第${this.people+1}位参与祭孔的人`,
                    desc:'今天是9.28全球祭孔日，请和我一起追思先贤。',
                    link:window.location.href,
                    imgUrl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/kongzi.png'
                }
            }
            if(isIos){
                try{
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage(message)
                }catch(err){

                }
            }else{
                if(window.android){
                    if(window.android.notify){
                        window.android.notify(JSON.stringify(message))
                    }
                }    
            }
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            this.$http.get(`/wx/getConfig?url=${url}`).then(res=>{
                if(res.data.status == 200){
                    let data = res.data.content;
                    let title = `我是第${this.people+1}位参与祭孔的人`;
                    let desc = '今天是9.28全球祭孔日，请和我一起追思先贤。';
                    let link = window.location.href;
                    let imgUrl = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/kongzi.png'
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
                                this.$http.post('/kz/point',{type:6}).then(res=>{
                                })
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: ()=>{
                                this.$http.post('/kz/point',{type:6}).then(res=>{
                                })
                            },
                        })
                        wx.onMenuShareQQ({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接
                            imgUrl: imgUrl, // 分享图标
                            success:()=>{
                                this.$http.post('/kz/point',{type:6}).then(res=>{
                                })
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
    // beforeDestroy(){
    //     let dom = document.querySelector('audio')
    //     document.body.removeChild(dom)
    // }
}
</script>
<style lang="scss" scoped>
    .index-page{
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        .first-box{
            width: 100%;
            height: 100%;
            position: absolute;
            top:0;
            left: 0;
            z-index: 1;
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/kongdan/bgd.png')no-repeat 50% 50% / cover;
            .skip{
                font-size:0.32rem;
                color:#fff;
                position: absolute;
                right: 0.2rem;
                top:0.2rem;
                border:1px solid #fff;
                border-radius: 0.1rem;
                padding:0.05rem 0.1rem;
            }
            .box{
                position: absolute;
                top:0;
                left:0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                .text-show{
                    display: inline-block;
                    animation: show 4s ;
                }
                p{
                    color:#fff;
                    font-size: 1rem;
                    opacity: 0;
                    display: none;
                    &.p1{
                        width: 1rem;
                        line-height: 1;
                        span+span{
                            margin:0.5rem 0 0 0;
                            display: block;
                        }
                    }
                    &.p2{
                        width: 1rem;
                        line-height: 1;
                        span{
                            text-align: center;
                            width: 3rem;
                            display: block;
                            margin:0.3rem 0 0.3rem -1rem;
                        }
                    }
                    &.p3{
                        font-size: 2rem;
                        width: 2rem;
                        line-height: 1;
                        margin-bottom: 1rem;
                    }
                    &.p4{
                        font-size: 0.94rem;
                        margin:0 0 0.2rem 0;
                        span{
                            float: right;
                            display: block;
                            width: 0.8rem;
                            line-height: 1.1;
                            margin:0 0.4rem;
                        }
                    }
                    &.p5{
                        width: 1rem;
                        line-height: 1;
                    }
                    &.p6{
                        width: 7rem;
                        letter-spacing: 0;
                        font-size: 0.44rem;
                        text-align: center;
                        margin-bottom: 4.1rem;
                        span{
                            display: block;
                            margin:0.04rem 0;
                        }
                    }
                }
            }
            .gesture{
                position: fixed;
                bottom:1rem;
                left: 50%;
                width: 2rem;
                margin-left: -1rem;
                text-align: center;
                display: none;
                .cursor{
                    width: 0.7rem;
                    height: 0.84rem;
                    background: url('../assets/image/cursor.png')no-repeat 50% 50% / cover;
                    position: absolute;
                    display: block;
                    right: 0.3rem;
                    top:-0.3rem;
                    animation: move 2s infinite;
                }
                .top{
                    width: 0.48rem;
                    height: 0.26rem;
                    background: url('../assets/image/top.png')no-repeat 50% 50% / cover;
                    display: inline-block;
                    animation: move1 1s infinite;
                }
                p{
                    font-size: 0.28rem;
                    color:#fff;
                }
            }
            .show{
                display: block!important;
                animation: show1 1.5s both;
            }
        }
        .second-box{
            position: absolute;
            top:0;
            left:0;
            transform: translateY(100%);
            z-index: 2;
            width: 100%;
            height: 100%;
            background: url('../assets/image/bgd2.png')no-repeat 50% 50% / cover;
            &.show{
                transform: translateY(0);
                transition: transform 1s;
            }
            .shade{
                position: fixed;
                top:0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 3;
                opacity: 0;
                &.none{
                    display: none;
                }
                &.display{
                    opacity: 1;
                    transition: opacity 1s;
                }
            }
            .box{
                position: absolute;
                z-index: 2;
                text-align: center;
                perspective: 500;
                -webkit-perspective: 500;
                width:5rem;
                height: 10rem;
                left: 50%;
                top:50%;
                margin:-4rem 0 0 -2.5rem;
                .lower{
                    margin-bottom:1.8rem!important;
                }
                .xian-bgd,.title,.text{
                    opacity: 0;
                }
                .cursor{
                    animation: xingxing 1s infinite;
                }
                &.active{
                    z-index: 4!important;
                    opacity: 1!important;
                    .xian-bgd,.title,.text{
                        opacity:1;
                    }
                }
                &.section1{
                    opacity: 0;
                    &.display{
                        opacity: 1;
                        transition: opacity 1s;
                    }
                    &.action{
                        .xian-bgd{
                            animation: turn 4s cubic-bezier(.09,.56,.34,.88) 6s both;
                            .bgd1{
                                opacity: 0;
                                transition: opacity 2s ease 6s;
                            }
                            .bgd2{
                                opacity: 1;
                                transition: opacity 2s ease 6s;
                            }
                        }
                        .bgd-temp{
                            opacity: 1;
                            z-index:3;
                            transition: opacity 1ms ease 12s;
                        }
                        .title{
                            opacity: 1;
                            transition: all 1s;
                            .l-arrow{
                                transition: transform 1s ease 1.5s;
                                transform: translateX(-0.45rem);
                            }
                            .r-arrow{
                                transition: transform 1s ease 1.5s;
                                transform: translateX(0.45rem);
                            }
                        }
                        .text .t{
                            display: block!important;
                            animation: show 4s ease 2.5s both;
                        }
                    }
                    &.hidden{
                        .title{
                            opacity: 0;
                            transition: opacity 0.5s,visibility 1ms ease 0.5s;
                            visibility: hidden;
                        }
                        .xian-bgd{
                            opacity: 0;
                            visibility: hidden;
                            transition: opacity 0.5s,visibility 1ms ease 0.5s;
                        }
                        .bgd-temp{
                            animation: fly 0.7s linear 0.1s both;
                        }
                    }
                    .xian-box{
                        width: 5rem;
                        height: 4.14rem;
                        margin: 0 0 2.6rem 0;
                        display: inline-block;
                        perspective: 500;
                        -webkit-perspective: 500;
                    }
                    .xian-bgd{
                        width: 5rem;
                        height: 4.14rem;
                        position: relative;
                        perspective: 1000;
                        background: url('../assets/image/chu_bgd.png')no-repeat 50% 50% / cover;
                        .bgd1{
                            position: absolute;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            background: url('../assets/image/xian1.png')no-repeat 50% 50% / cover;
                            width: 1.2rem;
                            height: 2.2rem;
                            opacity: 1;
                        }
                        .bgd2{
                            position: absolute;
                            top:1.62rem;
                            left: 0.925rem;
                            background: url('../assets/image/xian1_bgd.png')no-repeat 50% 50% / cover;
                            height: 0.9rem;
                            width: 3.15rem;
                            opacity: 0;
                        }
                    }
                    .bgd-temp{
                        position: absolute;
                        top:1.62rem;
                        left: 0.925rem;
                        background: url('../assets/image/xian1_bgd.png')no-repeat 50% 50% / cover;
                        height: 0.9rem;
                        width: 3.15rem;
                        opacity: 0;
                    }
                    .title{
                        font-size: 0;
                        opacity: 0;
                        .l-arrow{
                            display: inline-block;
                            vertical-align: middle;
                            width: 0.4rem;
                            height: 0.62rem;
                            background:url('../assets/image/l_arrow.png')no-repeat 50% 50% / cover; ;
                        }
                        .r-arrow{
                            display: inline-block;
                            vertical-align: middle;
                            width: 0.4rem;
                            height: 0.62rem;
                            background:url('../assets/image/r_arrow.png')no-repeat 50% 50% / cover; ;
                        }
                        >div{
                            display: inline-block;
                            vertical-align: middle;
                            width: 2.08rem;
                            height: 1.14rem;
                            background:url('../assets/image/chu_text1.png')no-repeat 50% 50% / cover; ;
                        }
                    }
                    .text{
                        height: 1.4rem;
                        margin-top:0.3rem;
                        >div{
                            visibility: hidden;
                            margin:0 auto;
                            &.display1{
                                display: block!important;
                                animation: show1 1s both;
                            }
                        }
                        .t{
                            width: 4rem;
                            height: 1.4rem;
                            background:url('../assets/image/chu_text2.png')no-repeat 50% 50% / cover; ;
                        }
                        .btn{
                            width: 2.4rem;
                            height: 0.8rem;
                            position: relative;
                            display: none;
                            margin-top:0.4rem;
                            &.continue{
                                >div{
                                    background:url('../assets/image/continue.png')no-repeat 50% 50% / cover;
                                }
                            }
                            >div{
                                width: 2.4rem;
                                height: 0.8rem;
                                background:url('../assets/image/btn.png')no-repeat 50% 50% / cover;
                            }
                            >i{
                                display: block;
                                width: 0.54rem;
                                height: 0.64rem;
                                position: absolute;
                                right: 0;
                                top:0.5rem;
                                background:url('../assets/image/cursor.png')no-repeat 50% 50% / cover; ;
                            }
                        }
                        &.btn-show{
                            .t{
                                display: none!important;
                            }
                            .btn{
                                display: block!important;
                                visibility:visible;
                                animation: show1 2s ease both;
                            }
                        }
                    }
                }
                &.section2{
                    &.action{
                        .xian-bgd{
                            animation: turn 4s cubic-bezier(.09,.56,.34,.88) 6s both;
                            .bgd1{
                                opacity: 0;
                                transition: opacity 2s ease 6s;
                            }
                            .bgd2{
                                opacity: 1;
                                transition: opacity 2s ease 6s;
                            }
                        }
                        .bgd-temp{
                            opacity: 1;
                            z-index:3;
                            transition: opacity 1ms ease 12s;
                        }
                        .title{
                            opacity: 1;
                            transition: all 1s;
                            .l-arrow{
                                transition: transform 1s ease 1.5s;
                                transform: translateX(-0.45rem);
                            }
                            .r-arrow{
                                transition: transform 1s ease 1.5s;
                                transform: translateX(0.45rem);
                            }
                        }
                        .text .t{
                            display: block!important;
                            animation: show 4s ease 2.5s both;
                        }
                    }
                    &.hidden{
                        .title{
                            opacity: 0;
                            transition: opacity 0.5s,visibility 1ms ease 0.5s;
                            visibility: hidden;
                        }
                        .xian-bgd{
                            opacity: 0;
                            visibility: hidden;
                            transition: opacity 0.5s,visibility 1ms ease 0.5s;
                        }
                        .bgd-temp{
                            animation: fly1 0.7s linear 0.1s both;
                        }
                    }
                    .xian-box{
                        width: 5rem;
                        height: 4.14rem;
                        margin: 0 0 2.6rem 0;
                        display: inline-block;
                        perspective: 500;
                        -webkit-perspective: 500;
                    }
                    .xian-bgd{
                        width: 5rem;
                        height: 4.14rem;
                        position: relative;
                        perspective: 1000;
                        background: url('../assets/image/chu_bgd.png')no-repeat 50% 50% / cover;
                        .bgd1{
                            position: absolute;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            background: url('../assets/image/xian2.png')no-repeat 50% 50% / cover;
                            width: 1.2rem;
                            height: 2.2rem;
                            opacity: 1;
                        }
                        .bgd2{
                            position: absolute;
                            top:1.2rem;
                            left: 1.4rem;
                            background: url('../assets/image/xian2_bgd.png')no-repeat 50% 50% / cover;
                            height: 2.3rem;
                            width: 2rem;
                            opacity: 0;
                        }
                    }
                    .bgd-temp{
                        position: absolute;
                        top:1.2rem;
                        left: 1.4rem;
                        background: url('../assets/image/xian2_bgd.png')no-repeat 50% 50% / cover;
                        height:2.3rem;
                        width: 2rem;
                        opacity: 0;
                    }
                    .title{
                        font-size: 0;
                        opacity: 0;
                        .l-arrow{
                            display: inline-block;
                            vertical-align: middle;
                            width: 0.4rem;
                            height: 0.62rem;
                            background:url('../assets/image/l_arrow.png')no-repeat 50% 50% / cover; ;
                        }
                        .r-arrow{
                            display: inline-block;
                            vertical-align: middle;
                            width: 0.4rem;
                            height: 0.62rem;
                            background:url('../assets/image/r_arrow.png')no-repeat 50% 50% / cover; ;
                        }
                        >div{
                            display: inline-block;
                            vertical-align: middle;
                            width: 2.08rem;
                            height: 1.14rem;
                            background:url('../assets/image/ya_text1.png')no-repeat 50% 50% / cover; ;
                        }
                    }
                    .text{
                        height: 1.55rem;
                        margin-top:0.3rem;
                        >div{
                            visibility: hidden;
                            margin:0 auto;
                            &.display1{
                                display: block!important;
                                animation: show1 1s both;
                            }
                        }
                        .t{
                            width: 6rem;
                            height: 1.55rem;
                            margin-left: -0.5rem;
                            background:url('../assets/image/ya_text2.png')no-repeat 50% 50% / cover; ;
                        }
                        .btn{
                            width: 2.4rem;
                            height: 0.8rem;
                            position: relative;
                            display: none;
                            margin-top:0.4rem;
                            &.continue{
                                >div{
                                    background:url('../assets/image/continue.png')no-repeat 50% 50% / cover;
                                }
                            }
                            >div{
                                width: 2.4rem;
                                height: 0.8rem;
                                background:url('../assets/image/btn.png')no-repeat 50% 50% / cover; ;
                            }
                            >i{
                                display: block;
                                width: 0.54rem;
                                height: 0.64rem;
                                position: absolute;
                                right: 0;
                                top:0.5rem;
                                background:url('../assets/image/cursor.png')no-repeat 50% 50% / cover; ;
                            }
                        }
                        &.btn-show{
                            .t{
                                display: none!important;
                            }
                            .btn{
                                display: block!important;
                                visibility:visible;
                                animation: show1 2s ease both;
                            }
                        }
                    }
                }
                &.section3{
                    &.action{
                        .xian-bgd{
                            animation: turn 4s cubic-bezier(.09,.56,.34,.88) 6.5s both;
                            .bgd1{
                                opacity: 0;
                                transition: opacity 2s ease 6s;
                            }
                            .bgd2{
                                opacity: 1;
                                transition: opacity 2s ease 6s;
                            }
                        }
                        .bgd-temp{
                            opacity: 1;
                            z-index:3;
                            transition: opacity 1ms ease 12s;
                        }
                        .title{
                            opacity: 1;
                            transition: all 1s;
                            .l-arrow{
                                transition: transform 1s ease 1.5s;
                                transform: translateX(-0.45rem);
                            }
                            .r-arrow{
                                transition: transform 1s ease 1.5s;
                                transform: translateX(0.45rem);
                            }
                        }
                        .text .t{
                            display: block!important;
                            animation: show 5.5s ease 2.5s both;
                        }
                    }
                    &.hidden{
                        .title{
                            opacity: 0;
                            transition: opacity 0.5s,visibility 1ms ease 0.5s;
                            visibility: hidden;
                        }
                        .xian-bgd{
                            opacity: 0;
                            visibility: hidden;
                            transition: opacity 0.5s,visibility 1ms ease 0.5s;
                        }
                        .bgd-temp{
                            animation: fly2 0.7s linear 0.1s both;
                        }
                        .text{
                            opacity:0!important;
                        }
                    }
                    .xian-box{
                        width: 5rem;
                        height: 4.14rem;
                        margin: 0 0 2.6rem 0;
                        display: inline-block;
                        perspective: 500;
                        -webkit-perspective: 500;
                    }
                    .xian-bgd{
                        width: 5rem;
                        height: 4.14rem;
                        position: relative;
                        perspective: 1000;
                        background: url('../assets/image/chu_bgd.png')no-repeat 50% 50% / cover;
                        .bgd1{
                            position: absolute;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            background: url('../assets/image/xian3.png')no-repeat 50% 50% / cover;
                            width: 1.2rem;
                            height: 2.2rem;
                            opacity: 1;
                        }
                        .bgd2{
                            position: absolute;
                            top:50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                            background: url('../assets/image/xian3_bgd.png')no-repeat 50% 50% / cover;
                            height:2.8rem;
                            width:0.32rem;
                            opacity: 0;
                        }
                    }
                    .bgd-temp{
                        position: absolute;
                        top:50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        background: url('../assets/image/xian3_bgd.png')no-repeat 50% 50% / cover;
                        height:2.8rem;
                        width:0.32rem;
                        opacity: 0;
                    }
                    .title{
                        font-size: 0;
                        opacity: 0;
                        .l-arrow{
                            display: inline-block;
                            vertical-align: middle;
                            width: 0.4rem;
                            height: 0.62rem;
                            background:url('../assets/image/l_arrow.png')no-repeat 50% 50% / cover; ;
                        }
                        .r-arrow{
                            display: inline-block;
                            vertical-align: middle;
                            width: 0.4rem;
                            height: 0.62rem;
                            background:url('../assets/image/r_arrow.png')no-repeat 50% 50% / cover; ;
                        }
                        >div{
                            display: inline-block;
                            vertical-align: middle;
                            width: 2.08rem;
                            height: 1.14rem;
                            background:url('../assets/image/san_text1.png')no-repeat 50% 50% / cover; ;
                        }
                    }
                    .text{
                        height: 1.4rem;
                        margin-top:0.3rem;
                        >div{
                            visibility: hidden;
                            margin:0 auto;
                            &.display1{
                                display: block!important;
                                animation: show1 1s both;
                            }
                        }
                        .t{
                            width: 6rem;
                            height: 1.4rem;
                            margin-left: -0.5rem;
                            background:url('../assets/image/san_text2.png')no-repeat 50% 50% / cover; ;
                        }
                        .btn{
                            width: 2.4rem;
                            height: 0.8rem;
                            position: relative;
                            display: none;
                            margin-top:0.4rem;
                            >div{
                                width: 2.4rem;
                                height: 0.8rem;
                                background:url('../assets/image/btn.png')no-repeat 50% 50% / cover; ;
                            }
                            >i{
                                display: block;
                                width: 0.54rem;
                                height: 0.64rem;
                                position: absolute;
                                right: 0;
                                top:0.5rem;
                                background:url('../assets/image/cursor.png')no-repeat 50% 50% / cover; ;
                            }
                        }
                        &.btn-show{
                            .t{
                                display: none!important;
                            }
                            .btn{
                                display: block!important;
                                visibility:visible;
                                animation: show1 2s ease both;
                            }
                        }
                    }
                }
            }
            .dialog{
                position: fixed;
                top:0;
                left: 0;
                z-index: 5;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                .dialog-box{
                    position: absolute;
                    width: 4.76rem;
                    height: 5rem;
                    left: 50%;
                    top:43%;
                    transform: translate(-50%,-50%) scale(0);
                    background: url('../assets/image/dialog_bgd.png')no-repeat 50% 50% / cover;
                    visibility: hidden;
                    &.show{
                        visibility: visible;
                        transform: translate(-50%,-50%) scale(1);
                        transition: transform 0.5s ease 1ms,visibility 1ms;
                    }
                    .text{
                        position: absolute;
                        top:3.1rem;
                        left: 0.6rem;
                        width: 3.6rem;
                        height: 0.86rem;
                        background: url('../assets/image/dialog_text.png')no-repeat 50% 50% / cover;
                    }
                    .yun{
                        position: absolute;
                        top:1.7rem;
                        left: 0.4rem;
                        width: 4.04rem;
                        height: 1.1rem;
                        background: url('../assets/image/yun.png')no-repeat 50% 50% / cover;
                        animation: yun 3s linear infinite;
                    }
                    .xingxing1{
                        position: absolute;
                        top:2.5rem;
                        left: -0.5rem;
                        width: 0.52rem;
                        height: 0.52rem;
                        background: url('../assets/image/xingxing.png')no-repeat 50% 50% / cover;
                        animation: xingxing 1.5s linear infinite;
                    }
                    .xingxing2{
                        position: absolute;
                        top:0.7rem;
                        left: 3.8rem;
                        width: 0.34rem;
                        height: 0.34rem;
                        background: url('../assets/image/xingxing.png')no-repeat 50% 50% / cover;
                        animation: xingxing 1.5s linear 0.5s infinite;
                    }
                    .xingxing3{
                        position: absolute;
                        top:4.7rem;
                        left: 4.7rem;
                        width: 0.25rem;
                        height: 0.25rem;
                        background: url('../assets/image/xingxing.png')no-repeat 50% 50% / cover;
                        animation: xingxing 1.5s linear 0.2s infinite;
                    }
                    .yanhua1{
                        position: absolute;
                        top:1.3rem;
                        left: 4.2rem;
                        width: 0.65rem;
                        height: 0.65rem;
                        background: url('../assets/image/yanhua1.png')no-repeat 50% 50% / cover;
                        animation: yanhua 2s linear infinite;
                    }
                    .yanhua2{
                        position: absolute;
                        top:0.5rem;
                        left: 0.2rem;
                        width: 0.96rem;
                        height: 0.96rem;
                        background: url('../assets/image/yanhua2.png')no-repeat 50% 50% / cover;
                        animation: yanhua 2s linear  infinite;
                    }
                    .btn{
                        position: absolute;
                        bottom:0;
                        left: 0;
                        height: 1rem;
                        width: 100%;
                    }
                }
                .data{
                    position: absolute;
                    width:7rem;
                    text-align: center;
                    top:45%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    opacity: 0;
                    visibility: hidden;
                    &.show{
                        visibility: visible;
                        opacity: 1;
                        transition: opacity 0.3s ease 1ms,visibility 1ms;
                    }
                    p{
                        color:#fff;
                        font-size: 0.48rem;
                        line-height: 1.5;
                    }
                    .share{
                        width: 4.78rem;
                        height: 0.8rem;
                        margin:0.6rem auto 0.4rem auto;
                        background: url('../assets/image/btn1.png')no-repeat 50% 50% / cover;
                    }
                    .go-course{
                        width: 4.78rem;
                        height: 0.8rem;
                        margin:0 auto;
                        background: url('../assets/image/btn2.png')no-repeat 50% 50% / cover;
                    }
                    .logo-box{
                        margin-top:0.4rem;
                        text-align: center;
                        img{
                            display: inline-block;
                            width: 2.64rem;
                        }
                    }
                }
                .share-wechat-box{
                    position: absolute;
                    right: 0;
                    top:0;
                    width: 100%;
                    visibility: hidden;
                    &.show{
                        visibility: visible;
                    }
                    .arrow{
                        width: 1.6rem;
                        height: 1.2rem;
                        background: url('../assets/image/arrow.png')no-repeat 50% 50% / cover;
                        position: absolute;
                        right: 0;
                        transform: rotate(-90deg);
                        top:0.4rem;
                    }
                    p{
                        color:#fff;
                        font-size: 0.32rem;
                        font-family: PingFangSC-Regular;
                        position: absolute;
                        right: 0.2rem;
                        top:2rem;
                    }
                }
                .share-box{
                    visibility: hidden;
                    height: 3.33rem;
                    background: #f2f2f2;
                    position: absolute;
                    bottom:0;
                    left:0;
                    width: 100%;
                    border-radius: 0.2rem 0.2rem 0 0;
                    visibility: hidden;
                    transform: translateY(100%);
                    &.show{
                        visibility: visible;
                        transform: translateY(0);
                        transition: transform 0.3s ease 1ms,visibility 1ms;
                    }
                    .icon-area{
                        height: 2.36rem;
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        >div{
                            text-align: center;
                            font-size: 0;
                            margin-left: 1.5rem;
                        }
                        >div+div{
                            margin-right: 1.5rem;
                            margin-left: 0;
                        }
                        .wexin{
                            width: 1rem;
                            height: 1rem;
                            background: url('../assets/image/wechat.png')no-repeat 50% 50% / cover;
                        }
                        .pyq{
                            width: 1rem;
                            height: 1rem;
                            background: url('../assets/image/pyq.png')no-repeat 50% 50% / cover;
                        }
                        p{
                            font-size: 0.26rem;
                            color:#666;
                            margin-top:0.2rem;
                        }
                    }
                    .cancel{
                        text-align: center;
                        border-top:1px solid #dfdfdf;
                        color:#333;
                        font-size: 0.32rem;
                        height:0.94rem;
                        line-height: 0.94rem;
                        font-family: PingFangSC-Regular;
                    }
                }
                .code-box{
                    position: absolute;
                    width:7rem;
                    text-align: center;
                    top:45%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    opacity: 0;
                    visibility: hidden;
                    &.show{
                        visibility: visible;
                        opacity: 1;
                        transition: opacity 0.3s ease 1ms,visibility 1ms;
                    }
                    img{
                        width: 2.4rem;
                        height: 2.4rem;
                        margin-bottom:0.3rem;
                        display: inline-block;
                        border: none;
                        outline: none;
                    }
                    p{
                        color:#fff;
                        font-size: 0.3rem;
                        text-align: center;
                        line-height: 1.5;
                        font-family: PingFangSC-Regular;
                    }
                }
            }
        }
        #input{
            opacity: 0;
            position: absolute;
        }
    }
    @keyframes show {
        0%{
            visibility: visible;
            opacity: 0;
        }
        50%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
    @keyframes show1 {
        from{
            opacity: 0;
        }
        to{
            opacity: 1;
        }
    }
    @keyframes move {
        0%{
            transform: translateY(0.8rem);
            opacity: 0;
        }
        20%{
            opacity: 1;
        }
        100%{
            transform: translateY(0);
        }
    }
    @keyframes move1{
        0%{
            transform: translateY(4px);
        }
        25%{
            transform: translateY(2px);
        }
        50%{
            transform: translateY(0px);
        }
        75%{
            transform: translateY(2px);
        }
        100%{
            transform: translateY(4px);
        }
    }
    @keyframes turn{
        from{
            transform: rotateY(0);
        }
        to{
            transform: rotateY(720deg); 
        }
    }
    @keyframes fly {
        0%{
            transform: translate3d(0,0,0);
        }
        50%{
            transform: translate3d(-1rem,-1rem,0) scale(0.8);
        }
        100%{
            transform: translate3d(-1.9rem,3.8rem,0) scale(0.5) rotate(-2deg)
        }
    }
    @keyframes fly1 {
        0%{
            transform: translate3d(0,0,0);
        }
        50%{
            transform: translate3d(1rem,-1rem,0) scale(0.8);
        }
        100%{
            transform: translate3d(1.8rem,3.3rem,0) scale(0.6);
        }
    }
    @keyframes fly2 {
        from{
            transform: translate3d(-50%,-50%,0) scale(1);
        }
        to{
            transform: translate3d(-50%,55%,0) scale(0.6);
        }
    }
    @keyframes yun{
        0%{
            transform: translateY(0);
        }
        25%{
            transform: translateY(-2px)
        }
        50%{
            transform: translateY(0);
        }
        75%{
            transform: translateY(2px)
        }
        100%{
            transform: translateY(0);
        }
    }
    @keyframes xingxing{
        0%{
            transform: scale(1);
        }
        50%{
            transform: scale(1.3);
        }
        100%{
            transform: scale(1);
        }
    }
    @keyframes yanhua{
        0%{
            transform: scale(0);
        }
        50%{
            transform: scale(1);
        }
        100%{
            transform: scale(1);
        }
    }
</style>