<template>
    <div>
        <Header :name="'文章详情'"/>
        <div class="detailContent">
            <div class="empty-box"  v-show="state==0&&httpFinish">
                <p>该文章已不存在了~</p>
            </div>
            <div class="headers" v-show="state==1">
                <p>{{information.name}}</p>
                <div>
                    <span>{{information.source?`来源： ${information.source}`:''}}</span>
                    <span>{{information.createdAtStr}}</span>
                </div>
            </div>
            <div v-html="information.content" v-show="state==1"></div>
            <div class="comment" v-show="state==1">
                <p ref="positionBox" class="comment-t">精彩评论</p>
                <van-list
                    class="commentList"
                    v-model="loading"
                    :finished="finished"
                    @load="getInfoCommentList">

                    <div class="commentList-item" v-for="(item,i) in commentList" :key="i">
                        <div class="commentIMg">
                            <img :src="item.avatar"/>
                        </div>
                        <div class="commentDetail">
                            <div class="nameNums">
                                <div>{{item.nickname}}</div>
                                <div @click="thumbsUp(2,item.isThumbsUp,item)">
                                    <img :src="item.isThumbsUp==1?img1:img2"/>
                                    <div class="like-num">{{item.likeNum}}</div>
                                </div>
                            </div>
                            <p class="p_1">{{item.content}}</p>
                            <p class="p_2">{{item.createdAtStr}}</p>
                        </div>
                    </div>
                   <div class="empty-box"  v-show="commentList.length==0&&finished">
                        <p>暂无评论~</p>
                    </div>
                </van-list>
                <div class="comment-input">
                    <div class="shade" v-show="isFocus" @click="isFocus=false"></div>
                    <div class="comment-input-box">
                        <input type="text" class="input" :class="isFocus?'is-focus':''" v-model="commentContent" maxlength="200" placeholder="说点什么~" ref="commentInput" @focus="isFocusEvent"/>
                        <p @click.stop="send" v-show="isFocus" class="send-btn">发布</p>
                        <div v-show="!isFocus" @click="thumbsUp(1,information.isThumbsUp)" class="b-icon icon1"><img :src="information.isThumbsUp==1?img1:img2"/><i class="like-num" v-show="information.likeNum>0">{{information.likeNum>99?`${information.likeNum}+`:`${information.likeNum}`}}</i></div>
                        <div v-show="!isFocus" @click="showTips" class="b-icon"><img :src="img3"/></div>
                    </div>
                </div>
            </div>
        </div>
        <transition name='fade'>
            <div class="share-box" v-show="shareFlag">
                <div class="share-bottom">
                    <p class="title">资讯分享</p>
                    <div class="share">
                        <input class="copy-target" id="input" :value="link" readonly/>
                        <div v-if="support" @click="shareTo('wechatFriend')">
                            <img :src="img11" alt="">
                            <p>微信</p>
                        </div>
                        <div v-if="support" @click="shareTo('wechatTimeline')">
                            <img :src="img12" alt="">
                            <p>朋友圈</p>
                        </div>
                        <div @click="shareTo('qqFriend')">
                            <img :src="img13" alt="">
                            <p>QQ</p>
                        </div>
                        <div @click="shareTo('weibo')">
                            <img :src="img14" alt="">
                            <p>微博</p>
                        </div>
                        <div class="copy-link"  ref="copyBtn" data-clipboard-action="copy" :data-clipboard-target="`#input`" @click="copy">
                            <img :src="img15" alt=""/>
                            <p>复制链接</p>
                        </div>
                    </div>
                    <div class="cancel" @click="shareFlag=false">
                        <p>取消分享</p>
                    </div>
                </div>
            </div>
        </transition>
        <div class="to-wechat-bgd" v-show="showBgd&&isWx" @click="showBgd=false">
            <i></i>
            <p>请点击右上角···发送给朋友</p>
        </div>
        <div class="no-data-box" v-if="takeOffFlag">
			<div class="bgd"></div>
			<p class="p1">没有找到相关内容~</p>
			<div class="text-tips">
				<p>该资讯已下架~</p>
			</div>
		</div>
    </div>
</template>

<script>
import Clipboard from 'clipboard'
import Header from '@/components/Header.vue'
import img1 from '@/assets/image/information_zan1.png'
import img2 from '@/assets/image/information_zan2.png'
import img3 from '@/assets/image/collection_a.png'
import img11 from '@/assets/image/wechat.png'
import img12 from '@/assets/image/wechat-circle.png'
import img13 from '@/assets/image/qq.png'
import img14 from '@/assets/image/weibo.png'
import img15 from '@/assets/image/copy.png'
import {mapActions} from 'vuex'
export default {
    props:[],
    data(){
        return {
            img1:img1,
            img2:img2,
            img3:img3,
            img11:img11,
            img12:img12,
            img13:img13,
            img14:img14,
            img15:img15,
            state:0,
            httpFinish:false,
            informationId:33,
            information:{},
            pageNo:1,
            pageSize:10,
            loading:false,
            finished:false,
            commentList:[],
            commentContent:'',
            thumbsUpFlag:false,//是否点击过点赞图标
            isSendFlag:false,//是否点击过发送按钮
            isFocus:false,
            shareFlag:false,
            support:false,
            showBgd:false,
            isWx:false,
            nativeShare:'',
            link:'',
            clipboard:'',
            takeOffFlag:false
        }
    },
    components:{Header},
    created(){
        if(this.$route.params&&this.$route.params.informationId){
            this.informationId = this.$route.params.informationId
            this.browserSupport()
            this.nativeShare = new NativeShare()
            this.link = window.location.origin+'/?wxshare=true&type=information&informationId='+this.$route.params.informationId;
        }else{

        }
    },
    mounted(){
        this.getInformationInfo()
        if(document.body.scrollHeight<=document.body.clientHeight){
            this.loading = true;
            this.getInfoCommentList()
        }
        if(this.$refs.copyBtn){
            this.clipboard = new Clipboard(this.$refs.copyBtn)
        }
    },
    methods:{
        ...mapActions(['setDownLoadFlag']),
        test(){

        },
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
            let ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
                this.isWx = true;
            }else if (ua.match(/QQ/i) == "qq" && ua.match(/MQQbrowser/i)!='mqqbrowser') {
                this.isWx = true;
            }
        },
        showTips(){
            if(this.isWx){
                this.showBgd = true;
            }else{
                this.shareFlag = true
            }
        },
        /**
         * 呼出输入框
         */
        focusInput(){
            this.isFocus = true;
            this.$nextTick(()=>{
                this.$refs.commentInput.focus();
            })
        },
        isFocusEvent(){
            this.setDownLoadFlag(true);
        },
        /**
         * 发送评论
         */
        send(){
            if(this.isSendFlag) return;
            let login = this.$getCookie('uInfo');
			if(!login){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
				return;
			}
            if(this.commentContent.length==0){
				this.$toast('请输入评论内容')
				return false;
            }
            this.isSendFlag = true//点击过点赞;
            let query = {
                informationId:this.informationId,
                content:this.commentContent
            }
            this.$http.post(this.$server.sendInformationComment,query).then(res=>{
                if(res.data.status == 200){
                    this.$toast("评论成功")
                    this.commentList.splice(0,this.commentList.length)
                    this.commentContent = ''
                    this.pageNo = 1
                    this.loading = false
                    this.finished = false
                    this.isSendFlag = false//点击过点赞e
                    this.isFocus = false;
                    document.body.scrollTop = this.$refs.positionBox.offsetTop-96
                }
            })
        },
        onClickLeft(){
            this.$router.go(-1)
            // this.$router.push('/infromation/infromList')
        },
        /**
         * 获取咨询详情
         */
        getInformationInfo(){
            const toast = this.$toast.loading({
                duration: 0,
                forbidClick: true,
            });
            let query = {
                informationId:this.informationId
            }
            this.$http.post(this.$server.getInformationInfo,query).then(res=>{
                if(res.data.status==200){
                    let {state,information} = res.data.content
                    this.state = state
                    this.httpFinish = true;
                    if(state==1){
                        this.information = information;
                        let str = information.content.replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'')
                        this.shareData = {
                            title:information.name,
                            desc:str,
                            link:window.location.origin+'/?wxshare=true&type=information&informationId='+information.id,
                            icon:information.pictureUrl,
                        }
                    }else{
                        console.log('已下架')
                    }
                    if(this.isWx){
                        this.wxshare();
                    }
                }else{
                    if(res.data.message.includes('不存在')){
						this.takeOffFlag = true;
						setTimeout(()=>{
							this.$router.replace('/')
						},2500)
					}
                }
                this.$toast.clear()
            })
        },
        /**
         * 获取咨询评论列表
         */
        getInfoCommentList(){
            let query = {
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                informationId:this.informationId
            }
            this.$http.post(this.$server.getInfoCommentList,query).then(res=>{
                if(res.data.status == 200){
                    this.pageNo++;
                    this.loading = false;
                    this.finished = res.data.content.isLastPage ?  true : false;
                    this.commentList = [...this.commentList,...res.data.content.list];
                }
            })
        },
        /**
         * 点赞
         */
        thumbsUp(type,state,obj){
            this.setDownLoadFlag(true)
            return;
            if(this.thumbsUpFlag) return;
            let login = this.$getCookie('uInfo');
			if(!login){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
				return;
			}
            if(state==1){
                this.$toast("您已点赞，不能重复点赞");
                return false;
            }
            this.thumbsUpFlag = true;
            let query = {
                thumbsUpType:type,
                targetId:type==1?this.informationId:obj.id
            }
            this.$http.post(this.$server.informationThumbsUp,query).then(res=>{
                if(res.data.status==200){
                    if(type==1){
                        this.information.isThumbsUp = true;
                        this.information.likeNum++;
                    }else{
                        obj.isThumbsUp = true;
                        obj.likeNum++
                    }
                    this.thumbsUpFlag = false;
                }
            })
        },
        shareTo(command){
            var shareData = {
                title: this.shareData.title,
                desc: this.shareData.desc,
                link:this.shareData.link,
                icon: this.shareData.icon,
                success: function() {
                    console.log('success')
                },
                fail:()=>{
                    this.$toast('当前浏览器不支持这类分享')
                }
            }
            this.nativeShare.setShareData(shareData)
            try {
                this.nativeShare.call(command);
            } catch (err) {
                // this.$toast('当前浏览器不支持这类分享')
            }
        },
        copy(){
            let clipboard = this.clipboard;
            console.log(clipboard)
            clipboard.on('success',()=>{
                this.$toast('复制成功,快去分享给好友吧')
            });
            clipboard.on('error',()=>{
                this.$toast('该浏览器不支持自动复制，请选择“拷贝”手动进行复制');
            });
		},
        wxshare(){
            let url = encodeURIComponent(window.location.href.split('#')[0]);
            let cookie = this.$getCookie('uInfo');
			let userId = cookie ? JSON.parse(cookie).userid  : '';
			this.$http.get(`${this.$server.getWxConfig}?url=${url}&userId=${userId}`).then(res=>{
				if(res.data.status == 200){
                    let data = res.data.content;
                    let _title = this.shareData.title;
                    let _desc = this.shareData.desc;
                    let _link = this.shareData.link;
                    let _imgUrl = this.shareData.icon;
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
                                this.showBgd = false;
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: _title, // 分享标题
                            link: _link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: _imgUrl, // 分享图标
                            success:()=>{
                            // 用户点击了分享后执行的回调函数
                                this.showBgd = false;
                            },
                        })
                        wx.onMenuShareQQ({
                            title: _title, // 分享标题
                            desc: _desc, // 分享描述
                            link: _link, // 分享链接
                            imgUrl: _imgUrl, // 分享图标
                            success:()=>{
                            // 用户确认分享后执行的回调函数
                                this.showBgd = false;
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
};
</script>
<style lang="scss" scoped>
.detailContent{
    padding: 0.3rem 0.3rem 1.6rem 0.3rem;
    .headers{
        width: 100%;
        p{
            color: #333333;
            font-size: 0.38rem;
            font-weight: bold;
        }
        >div{
            width: 100%;
            overflow: auto;
            margin: 0.1rem 0 0.4rem 0;
            font-size: 0.26rem;
            color: #999999;
            span:nth-child(1){
                float: left;
            }
            span:nth-child(2){
                float: left;
                margin-left: 0.4rem;
            }
        }
    }
    .comment{
        width: 100%;
        margin-top: 1rem;
        >p{
            width: 100%;
            color: #333333;
            font-size: 0.38rem;
            font-weight: bold;
            margin-bottom: 0.4rem;
        }
        .commentList-item:not(:first-child){
            margin-top: 0.3rem;
        }
        .commentList-item{
            overflow: auto;
            // height: 2.16rem;
            .commentIMg{
                float: left;
                width: 0.72rem;
                height: 1.8rem;
                img{
                    width: 100%;
                    height: 0.72rem;
                    border-radius: 100%;
                }
            }
            .commentDetail{
                float: right;
                width: 5.88rem;
                padding: 0 0 0.3rem 0;
                border-bottom: 1px solid #F2F2F2;
                &:last-child{
                    border:none;
                }
                .p_1{
                    color: #333333;
                    font-size: 0.32rem;
                    height:0.88rem;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin-bottom: 0.2rem;
                }
                .p_2{
                    margin-top: 0.1rem;
                    color: #999999;
                    font-size: 0.22rem;
                }
                .nameNums{
                    overflow: auto;
                    margin-bottom: 0.1rem;
                    >div:nth-child(1){
                        float: left;
                        color: #666;
                    }
                    >div:nth-child(2){
                        float: right;
                        display: -webkit-inline-box;
                        color: #666;
                        img{
                            width: 0.32rem;
                            height: 0.32rem;
                        }
                    }
                    .like-num{
                        margin-left: 0.08rem;
                        line-height: 0.34rem;
                    }
                }
            }
        }
        .comment-input{
            position: fixed;
            bottom:0;
            left: 0;
            width: 100%;
            border-top:1px solid #dfdfdf;
            z-index: 1001;
            .comment-input-box{
                position: relative;
                z-index: 2;
                padding: 0.28rem 0.3rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #fff;
                .input{
                    width: 4.5rem;
                    height: .72rem;
                    border-radius:0.72rem;
                    background:rgba(242,242,242,1);
                    font-size:0.28rem;
                    line-height: 0.42rem;
                    padding: 0.15rem 0.3rem;
                    border: none;
                    &::placeholder{
                        color:#333;
                    }
                    &.is-focus{
                        width:5.4rem;
                        font-size: 0.3rem;
                        &::placeholder{
                            color:#999;
                        }
                    }
                }
                .send-btn{
                    display: inline-block;
                    vertical-align: middle;
                    height: 0.68rem;
                    line-height: .68rem;
                    width: 1.2rem;
                    border-radius: 25px;
                    background: #C30D23;
                    color:#fff;
                    font-size: 0.32rem;
                    letter-spacing: 2px;
                    text-align: center;
                    &:active{
                        background: #8B1B1F;
                    }
                }
                .b-icon{
                    width: 0.6rem;
                    height: 0.6rem;
                    position: relative;
                    &.icon1{
                        margin-left: 0.2rem;
                    }
                    img{
                        width: 100%;
                        height: 100%;
                    }
                    .like-num{
                        background: #C30D23;
                        color:#fff;
                        font-size: 0.2rem;
                        border-radius: 25px;
                        display: block;
                        position: absolute;
                        left: 0.5rem;
                        top:-0.15rem;
                        height: 0.3rem;
                        padding: 0 0.1rem;
                        min-width: 0.3rem;
                        text-align: center;
                        line-height: 0.3rem;
                    }
                }
            }
            .shade{
                background: #333333;
                opacity: 0.7;
                height: 100vh;
                width: 100vw;
                z-index: 1;
                position: absolute;
                bottom:0;
                left:0;
            }
        }
    }
    .empty-box{
        text-align: center;
    }
}
.share-box{
    height: 100vh;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1001;
    .share-bottom{
        height: 4.66rem;
        background: #fff;
        position: absolute;
        bottom:0;
        left: 0;
        width: 100%;
    }
    .title{
        text-align: center;
        z-index: 2;
        width: 100%;
        font-size: 0.48rem;
        color:#C30D23;
        // text-decoration: underline;
        margin:0.7rem 0 0 0;
    }
    .share{
        width: 100%;
        background-color:#fff;
        display: flex;
        height:1.6rem;
        justify-content: space-around;
        padding: 0 .6rem;
        align-items: center;
        text-align: center;
        #input{
            position: absolute;
            left: 0;
            top:0;
            opacity: 0;
            z-index: -1;
        }
        img{
            width: .7rem;
            height: .7rem;
        }
        p{
            margin-top: .15rem;
            color: #9A9A9A;
            font-size: .26rem;
        }
    }
    .cancel{
        height: 1.66rem;
        border-top:1px solid #CCCCCC;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        text-align: center;
        width: 100%;
        p{
            background: #B4272D;
            width:4rem;
            height: 0.8rem;
            line-height: 0.8rem;
            border-radius: 25px;
            color:#fff;
            font-size: 0.32rem;
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
.no-data-box{
    position: fixed;
    top:0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1111;
    background: #fff;
    padding: 1rem 0;
    text-align: center;
    .bgd{
        height: 1.8rem;
        width: 2.5rem;
        background: url('../../assets/image/xiajia.png')no-repeat 50% 50%/cover;
        display: inline-block;
    }
    .p1{
        font-size: 0.28rem;
        color:#bbb;
        margin-top:0.4rem;
    }
    .text-tips{
        padding-top:4.5rem;
        color:#fff;
        font-size: 0.36rem;
        text-align: center;
        background: rgba(0,0,0,0.3);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
