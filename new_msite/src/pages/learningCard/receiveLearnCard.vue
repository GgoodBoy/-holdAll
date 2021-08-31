<template>
    <div class="receive-learn-card">
        <p class="no-login-tips">{{learnCardState==0?'您还没有登录，请登录后领取！':''}}</p>
        <p class="error" v-if="error">{{errorText}}</p>
        <div v-if="!finish"></div>
        <div class="learn-card" v-else>
            <div class="card state1" v-if="type==1">
                <p class="title top">学习卡</p>
                <div class="middle clearfix">
                    <p class="des">学习卡可用于账户充值</p>
                    <p class="price"><span>{{price}}</span>币</p>
                </div>
                <p class="bottom date">有效期至: {{receiveValidatily}}</p>
            </div>
            <div class="card state2" v-else>
                <p class="top">定制学习卡</p>
                <div class="middle" ref="box">
                    <van-icon :name="state?'arrow-up':'arrow-down'" class="icon" v-if="icon" @click="switchState"/>
                    <div class="all item" :class="!state?'abs':''" ref="all">
                        <p class="card-t"><span>{{name}}</span>学习卡,包含课程:</p>
                        <p class="card-intro">{{courseTitles}}</p>
                    </div>
                    <div class="part item" :class="state?'hidden':''" ref="part">
                        <p class="card-t"><span>{{name}}</span>学习卡,包含课程:</p>
                        <p class="card-intro">{{courseTitles}}</p>
                    </div>
                </div>
                <p class="bottom">有效期 : {{useValidatily=='0'?'无期限':useValidatily+'天'}}</p>
            </div>
        </div>
        <div class="btn-area">
            <a class="l-btn state0" v-if="learnCardState==0" @click="toLogin">立即登录</a>
            <a class="l-btn state1" v-if="learnCardState==1">已失效</a>
            <a class="l-btn state0" v-if="learnCardState==2" @click="receive">立即领取</a>
            <a class="l-btn state1" v-if="learnCardState==3">已领取</a>
        </div>
    </div>
</template>
<script>
const secret_key = 'xueguoxue.com';
function decrypt(str, pwd) {
    if (str == null || str.length < 8) {
      alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
      return;
    }
    if (pwd == null || pwd.length <= 0) {
      alert("Please enter a password with which to decrypt the message.");
      return;
    }
    let prand = "";
    for (let i = 0; i < pwd.length; i++) {
      prand += pwd.charCodeAt(i).toString();
    }
    let sPos = Math.floor(prand.length / 5);
    let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    let incr = Math.round(pwd.length / 2);
    let modu = Math.pow(2, 31) - 1;
    let salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
      prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    let enc_chr = "";
    let enc_str = "";
    for (let i = 0; i < str.length; i += 2) {
      enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
      enc_str += String.fromCharCode(enc_chr);
      prand = (mult * prand + incr) % modu;
    }
    return enc_str;
}
export default {
    data(){
        return {
            cardId:'',
            state:false,
            icon:false,
            finish:false,
            error:false,
            errorText:'',
            learnCardState:'5',
            type:'',
            price:'',
            receiveValidatily:'',
            courseTitles:'',
            useValidatily:'',
            name:'',
            isIos:false,
            inApp:false,
        }
    },
    created(){
        let u = navigator.userAgent;
        this.isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        let data = window.location.hash.split('#/user/receiveLearnCard?')[1].split("=");
        let temp = data[0]=='cardId'?data[1]:''
        temp = temp.includes("&appinstall")?temp.split("&appinstall")[0]:temp;
        let cardId = decrypt(temp,secret_key);
        this.cardId = cardId;
        this.getDetails();
    },
    mounted(){
        setTimeout(()=>{
            this.isApp();
            this.getShareDesc();
        },1)
    },
    methods:{
        /**
         * 判断是否在APP里面
         */
        isApp(){
            if(this.isIos){
                try {    
                    window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
                    
                }
                catch(err) {}
            }else{
                if(window.android){
                    if(window.android.notify){
                    }
                }
            }
        },
        getShareDesc(){
            let query = {
                targetId:this.cardId,
                type:2
            }
            this.$http.post(this.$server.getShareDesc,query).then(res=>{
                if(res.data.status==200){
                    let message = {
                        describe:'在APP内部展示页面的分享按钮',
                        method:"share",
                        params:{
                            title:res.data.content.title||'',
                            desc:res.data.content.describe||'',
                            link:window.location.href,
                            imgUrl:res.data.content.iconUrl||'http://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/logo.png'
                        }
                    }
                    if(this.isIos){
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
                    let ua = window.navigator.userAgent.toLowerCase();
                    let isWx = ua.match(/MicroMessenger/i) == 'micromessenger'?true:false;
                    if(isWx){
                        this.wxshare(res.data.content);
                    }
                }
            })
        },
        wxshare(obj){
            let url = encodeURIComponent(window.location.href.split('#')[0])
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    let title = obj.title||"免费领取【学国学网】优惠券，学习中华优秀传统文化"
                    let desc = obj.describe||"学国学网专注优秀传统文化教育"
                    let link = window.location.href
                    let imgUrl = obj.iconUrl||"http://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/logo.png"
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
                    wx.ready(function() {
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: title, // 分享标题
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户点击了分享后执行的回调函数
                            },
                        })
                        wx.onMenuShareQQ({
                            title: title, // 分享标题
                            desc: desc, // 分享描述
                            link: link, // 分享链接
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                            // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                            // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            })
		},
        getDetails(){
            if(this.cardId){
                const Toast = this.$toast.loading({
                    mask: true,
                    message: '加载中...'
                })
                let params = {
                    cardId:this.cardId,
                }
                this.$http.post(this.$server.getLearningCardInfo,params).then(res=>{
                    Toast.clear()
                    if(res.data.status==200){
                        this.finish = true;
                        this.learnCardState = res.data.content.state;
                        this.type = res.data.content.type;
                        this.price = res.data.content.price;
                        this.receiveValidatily = res.data.content.receiveValidatily;
                        this.courseTitles = res.data.content.courseTitles;
                        this.useValidatily = res.data.content.useValidatily;
                        this.name = res.data.content.name;
                        this.$nextTick(()=>{
                            this.isIconShow()
                        })
                    }else{
                        if(res.data.status == 401){
                            this.$toast({
                                mask: false,
                                message: '您的账号在其他设备登录，请重新登录'
                            })
                            setTimeout(()=>{
                                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
                                this.$router.push('/auth')
                            },1)
                        }else{
                            this.$toast({
                                mask: false,
                                message: res.data.message
                            })
                            setTimeout(()=>{
                                this.$router.push('/')
                            },3000)
                        }
                       
                        this.error = true;
                        // this.errorText = res.data.message
                    }
                }).catch(error=>{
                    this.error = true;
                    this.errorText = '请求错误，请检查网络刷新页面！或联系工作人员'
                })
            }else{
                //    this.$router.push('/error')
            }
        },
        isIconShow(){
            if(this.$refs.all){
                this.icon = this.$refs.all.clientHeight>this.$refs.part.clientHeight?true:false;
            }
        },
        switchState(){
            if(!this.state){
                this.$refs.box.style.height = this.$refs.all.clientHeight+'px';
                this.state = !this.state;
                return;
            }else{
                this.$refs.box.style.height = this.$refs.part.clientHeight+'px';
                this.state = !this.state;
                return; 
            }
            // this.state = !this.state;
        },
        toLogin(){
            // sessionStorage.setItem('rediectUrl',this.$route.fullPath)
            sessionStorage.setItem('learnCardId',this.cardId)
            this.$router.push('/auth');
        },
        receive(){
             const Toast = this.$toast.loading({
                message: ''
            })
            let params = {
                cardId:this.cardId
            }
            this.$http.post(this.$server.receivLearningCard,params).then(res=>{
                Toast.clear()
                if(res.data.status==200){
                    this.learnCardState = 3;
                }else{
                    this.$toast({
                        mask: false,
                        message: res.data.message
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .receive-learn-card{
        height: 100vh;
        padding-top:2rem;
        background: url('../../assets/image/learn_card_bottom.png')no-repeat 50% 100%;
        background-size: contain;
        .no-login-tips{
            color:#000;
            font-size: 0.32rem;
            margin-bottom:2rem;
            text-align: center;
        }
        .learn-card{
            .state1{
                position: relative;
                width:6.9rem;
                height:3rem;
                margin:0 auto;
                background: url('../../assets/image/learn_card_bgd.png')no-repeat 50% 50%;
                background-size: cover;
                padding: 0.32rem;
                color:#fff;
                &.title{
                    font-size: 0.4rem;
                }
                .middle{
                    margin:0.5rem 0;
                    height: 0.5rem;
                    line-height: 0.5rem;
                    .des{
                        font-size: 0.26rem;
                        float: left;
                    }
                    .price{
                        float: right;
                        font-size: 0.32rem;
                        span{
                            margin-right: 0.05rem;
                            font-size: 0.6rem;
                            display: inline-block;
                            vertical-align: bottom;
                        }
                    }
                }
                .bottom{
                    position: absolute;
                    bottom:0;
                    height: 0.7rem;
                    line-height: 0.7rem;
                    left: 0.32rem;
                    font-size: 0.26rem;
                }
            }
            .state2{
                width:6.9rem;
                margin:0 auto;
                color:#fff;
                .top{
                    padding: 0 0.32rem;
                    height: 0.8rem;
                    line-height: 0.8rem;
                    font-size: 0.38rem;
                    background: url('../../assets/image/learn_card_bgd_top.png')no-repeat 50% 50%;
                    background-size: cover;
                    border-radius: 3px 3px 0 0;
                }
                .middle{
                    position: relative;
                    color:#fff;
                    font-size: 0.26rem;
                    min-height: 1.8rem;
                    overflow: hidden;
                    transition: all 0.5s;
                    .item{
                        padding: 0.2rem 0.32rem;
                        width: 100%;
                        background:-webkit-linear-gradient(left, #e34957 , #c40826);
                        .card-t{
                            margin-bottom:0.1rem;
                        }
                        .card-intro{
                            line-height: 0.52rem;
                        }
                        &.all{
                            min-height: 1.8rem;
                            top:0;
                            left: 0;
                            z-index: 1;
                        }
                        &.part{
                            height: 1.8rem;
                            position: absolute;
                            top:0;
                            left: 0;
                            z-index: 2;
                            .card-intro{
                                display: -webkit-box;    
                                -webkit-box-orient: vertical;    
                                -webkit-line-clamp: 2;    
                                overflow: hidden;
                            }
                        }
                        &.abs{
                            position: absolute;
                        }
                        &.hidden{
                            display: none;
                        }
                    }
                    .icon{
                        position: absolute;
                        right:0;
                        top:0;
                        padding: 0.2rem;
                        font-size: 0.36rem;
                        font-weight: 100;
                        z-index: 3;
                    }
                }
                .bottom{
                    height: 0.7rem;
                    line-height: 0.7rem;
                    padding: 0 0.32rem;
                    font-size: 0.26rem;
                    background: url('../../assets/image/learn_card_bgd_bottom.png')no-repeat 50% 50%;
                    background-size: cover;
                    border-radius: 0 0 3px 3px;
                }
            }
        }
        .btn-area{

        }
        .l-btn{
            display: block;
            margin:1.2rem auto;
            border-radius: 0.5rem;
            width: 5.6rem;
            height: 0.88rem;
            text-align: center;
            line-height: 0.88rem;
            font-size: 0.32rem;
            color:#fff;
            &.state0{
                background: #C52D3B;
            }
            &.state1{
                background: #BBBBBB;
            }
        }
        .error{
            text-align: center;
            font-size: 0.32rem;
            padding: 0 0.5rem;
            color:#bbb;
        }
    }
</style>
