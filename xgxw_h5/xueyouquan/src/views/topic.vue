<template>
    <div class="topic-page" @click="goApp">
        <p class="none" v-if="error">话题不存在或已下线~</p>
        <div class="header" v-if="topicData.id&&!inOtherApp">
            <p class="title textEllipsis">{{topicData.topicName}}</p>
            <!-- <i class="share-icon" @click="shareDialog=true"></i> -->
        </div>
        <div class="topic-warp" v-if="topicData.id">
            <div class="topic-box">
                <div class="clearfix">
                    <p class="topic-name">{{topicData.topicNameNew}}</p>
                    <img class="guanzhu" :src="require('../assets/image/guanzhu.png')"/>
                </div>
                <p class="topic-people">
                    <span>已有{{topicData.presetPartakeNum}}人</span>
                    <span> / </span>
                    <span>{{topicData.presetFollowNum}}人关注</span>
                </p>
                <div class="topic-des" ref="container">
                    <p class="show" ref="content">
                        {{topicData.topicDesc}}
                    </p>
                </div>
            </div>
        </div>
        <div class="classmatesMsg-wrap" v-if="topicData.id">
            <p class="tab">
                <span :class="type==1?'active':''" >最新</span>
                <span :class="type==2?'active':''" >最热</span>
            </p>
            <div class="classmatesMsg-list-wrap">
                <div style="padding:0 0 0.4rem 0;background:#f4f4f4">
                    <div class="item" v-for="(item) in otherList" :key="item.id">
                        <classmatesMsg  :classmatesMsgData="item"/>
                        <div class="shade"></div>
                    </div>
                </div>
                <van-list
                    class="classmatesMsg-list"
                        v-model="loading"
                        :finished="finished"
                        @load="getClassmatesMsgListByTopicId"
                    >
                    <div class="item" v-for="(item) in classmatesMsgList" :key="item.id">
                        <classmatesMsg  :classmatesMsgData="item"/>
                        <div class="shade"></div>
                    </div>
                    <div class="empty" v-show="classmatesMsgList.length==0&&otherList.length==0&&finished">
                        <img :src="require('../assets/image/no_data.png')"/>
                        <p>对不起！没有数据哦！</p>
                    </div>
                    <p class="over" v-if="finished&&classmatesMsgList.length>0">已经全部加载完毕~</p>
                </van-list>
            </div>
        </div>
        <div class="bottom">请下载APP参与话题讨论</div>
        <div class="share-tip-dialog" v-if="shareDialog" @click="shareDialog=false">
            <i class="icon"></i>
            <p>请点击 ··· 分享给好友</p>
        </div>
    </div>
</template>
<script>
import classmatesMsg from '@/components/classmatesMsg.vue'
export default {
    data(){
        return{
            inOtherApp:false,
            topicId:'',
            finish:false,
            error:false,
            topicData:{},
            loading:false,
            finished:false,
            type:1,
            pageNo:1,
            pageSize:10,
            classmatesMsgList:[],
            otherList:[],
            shareDialog:false
        }
    },
    components:{classmatesMsg},
    watch:{
        type(cur,old){
            this.classmatesMsgList = [ ];
            this.loading = false;
            this.finished = false;
            this.pageNo = 1;
        }
    },
    created(){
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.inOtherApp = true;
        }else if (ua.includes('weibo')){
            this.inOtherApp = true;
        }else{
            this.inOtherApp = false;
        }
        if(this.$route.query&&this.$route.query.id){
            this.topicId = Number(this.$route.query.id);
            this.$nextTick(()=>{
                this.getTopicDetail()
            })
        }
    },
    methods:{
        goApp(){
            window.location.href = `https://xgxm.xueguoxue.com/h5/download/index.html`
        },
        async getTopicDetail(){
            const toast = this.$toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true,
            });
            const query = {
                topicId:this.topicId
            }
            const res = await this.$http.post('/topic/getTopicDetail',query);
            this.$toast.clear()
            this.finish = true;
            if(res.data.status==200){
                this.topicData = res.data.content;
                this.topicData.topicNameNew = `#${this.topicData.topicName}#`
                document.title = this.topicData.topicName
                this.$nextTick(()=>{
                    this.wxshare()
                    let container = this.$refs.container;
                    let content = this.$refs.content;
                    let str = this.topicData.topicDesc;
                    if (content.clientHeight > container.clientHeight) {
                        for (let i = 0; i <= str.length; i++) {
                            content.innerHTML = str.slice(0,i);
                            if (content.clientHeight > container.clientHeight) {
                                content.innerHTML = str.slice(0,i-5) + '<span class="more" ref="more">...全文＞</span>'
                                break;
                            }
                        }
                    }
                })
                this.findRecommendEssenceList()
            }else{
                this.error = true;
            }
        },
        async findRecommendEssenceList(){
            const query = {
                topicId:this.topicId
            }
            const res = await this.$http.post('/classmatesMsg/findRecommendEssenceList',query)
            if(res.data.status==200){
                this.otherList = [...res.data.content.recommendList,...res.data.content.essenceList,...res.data.content.topList]
            }
        },
        async getClassmatesMsgListByTopicId(){
            const query = {
                topicId:this.topicId,
                type:this.type,
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }
            const res = await this.$http.post('/topic/getClassmatesMsgListByTopicId',query)
            if(res.data.status==200){
                this.classmatesMsgList = [...this.classmatesMsgList,...res.data.content.list];
                this.classmatesMsgList.forEach((item)=>{
                    item.topicNameShow = false;
                })
                this.loading = false;
                this.pageNo++;
                this.finished = res.data.content.isLastPage ?  true : false;
            }
        },
        wxshare(){
            let url = encodeURIComponent(window.location.href.split('#')[0]);
			this.$http.get('/wx/getConfig?url='+url).then(res=>{
                if(res.data.status == 200){
                    let data = res.data.content;
                    let title = `推荐关注:${this.topicData.topicName}`
                    let desc = this.topicData.topicDesc
                    let link = window.location.href
                    let imgUrl = 'https://xgxm.xueguoxue.com/h5/download/image/logo.png'
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
                            title: title,
                            desc: desc,
                            link: link, 
                            imgUrl: imgUrl,
                            type: '', 
                            dataUrl: '', 
                            success:()=>{
                                this.shareDialog = false;
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: title, 
                            link: link, 
                            imgUrl: imgUrl,
                            success:()=>{
                                this.shareDialog = false;
                            },
                        })
                        wx.onMenuShareQQ({
                            title: title, 
                            desc: desc, 
                            link: link, 
                            imgUrl: imgUrl, 
                            success:()=>{
                                this.shareDialog = false;
                            },
                            cancel: function () {
                            
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
    .topic-page{
        min-height: 100vh;
        background: #fff;
        padding-bottom:1.2rem;
        .none{
            font-size:0.32rem;
            color:#999;
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 100%;
            text-align: center;
        }
        .bottom{
            width: 100%;
            max-width: 7.5rem;
            height: 1.2rem;
            position: fixed;
            bottom:0;
            left:50%;
            transform: translateX(-50%);
            color:#fff;
            background: #C30D20;
            text-align: center;
            font-size: 0.36rem;
            line-height: 1.2rem;
        }
        .header{
            text-align: center;
            color: #333;
            font-weight: bold;
            font-size: 0.36rem;
            line-height: 1rem;
            position: relative;
            background: #fff;
            .title{
                width: 80%;
                margin:0 auto;
            }
            .share-icon{
                display: block;
                position: absolute;
                right: 0.3rem;
                bottom:0.26rem;
                width: 0.4rem;
                height: 0.4rem;
                background: url('../assets/image/share-icon.png')no-repeat 50% 50% / cover;
            }
        }
        .topic-warp{
            padding:0.4rem 0.3rem;
            background: #f4f4f4;
            .topic-box{
                background: #fff;
                border-radius: 0.2rem;
                padding:0.4rem 0.3rem 0.4rem 0.4rem;
                font-family:PingFangSC-Regular,PingFang SC;
                .clearfix{
                    font-size: 0;
                }
                .topic-name{
                    font-size:0.36rem;
                    font-weight:500;
                    color:rgba(51,51,51,1);
                    line-height:0.5rem;
                    display: inline-block;
                    width: calc(100% - 1.3rem);
                    vertical-align: top;
                    margin-right: 0.24rem;
                }
                .guanzhu{
                    width: 1.04rem;
                    height: 0.44rem;
                    vertical-align: top;
                    display: inline-block;
                    margin-top:0.03rem;
                }
                .topic-people{
                    margin:0.08rem 0;
                    color:#999999;
                    font-size: 0.26rem;
                    line-height: 0.36rem;
                }
                .topic-des{
                    position: relative;
                    max-height: 0.8rem;
                    p{
                        color:#666;
                        font-size: 0.28rem;
                        line-height: 0.4rem;
                        margin:0.36rem 0;
                    }
                }
            }
        }
        .classmatesMsg-wrap{
            .tab{
                background: #f4f4f4;
                padding: 0 0.3rem 0.3rem;
                font-size: 0;
                span{
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 0.4rem;
                    color:#666666;
                    font-size: 0.36rem;
                    position: relative;
                    line-height: 0.5rem;
                    &.active{
                        color:#333;
                        &::after{
                            content:'';
                            display: block;
                            position: absolute;
                            width: 100%;
                            height: 0.08rem;
                            border-radius: 0.04rem;
                            background: #C30D20;
                            bottom:-0.1rem;
                            left: 0;
                        }
                    }
                }
            }
            .classmatesMsg-list-wrap{
                .item{
                    position: relative;
                    .shade{
                        position: absolute;
                        right: 0;
                        top:0;
                        width: 100%;
                        height: 100%;
                        z-index: 2;
                    }
                }
                .over{
                    padding: 0.5rem;
                    color: #666;
                    font-size: 0.28rem;
                    text-align: center;
                }
                .empty{
                    border-top: 1px solid #eee;
                    padding: 0.5rem;
                    color: #cfcfcf;
                    font-size: 0.28rem;
                    text-align: center;
                    img{
                        display: inline-block;
                        width: 2rem;
                    }
                }
            }
        }
        .share-tip-dialog{
            position: fixed;
            top:0;
            left: 0;
            width:100%;
            height: 100%;
            z-index: 999;
            background: rgba(0,0,0,0.7);
            i{
                display: block;
                position: absolute;
                top:0.5rem;
                right: 0;
                background: url('../assets/image/arrow.png')no-repeat 50% 50% / cover;
                width: 1.3rem;
                height: 1rem;
                transform: rotate(-90deg);
            }
            p{
                color: #fff;
                position: absolute;
                right: 0.2rem;
                top: 2rem;
                font-size: 0.28rem
            }
        }
    }
</style> 