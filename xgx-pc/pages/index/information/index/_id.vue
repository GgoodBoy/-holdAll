<template>
    <div class="detail-page information-detail-page">
        <div>
        <!-- <el-row>
            <el-col :span="20"> -->
                <breadcrumb :listData='datalist'></breadcrumb>
            <!-- </el-col> -->
            <!-- <el-col :span="4">共搜索出<span>{{detailData.browseCount}}</span>条相关记录</el-col> -->
        <!-- </el-row>  -->
        </div>
        <div v-show="dataContentBools">
            <div class="detailName">{{detailData.name}}</div>
            <div class="detailData">
                <el-row>
                    <el-col :span="4" style="text-align:left;font-size:13px;">作者：{{detailData.author}}</el-col>
                    <el-col :span="4" style="font-size:13px;text-align:left;">来源：{{detailData.source}}</el-col>
                    <el-col :span="4" style="font-size:13px;text-align:left;">发表于：{{detailData.createdAt_PC}}</el-col>
                    <el-col :span="5" :offset="7" style="text-align:right;font-size:13px;">浏览：{{Math.floor(Number(detailData.browseCount)/1e5)>1?Math.floor(Number(detailData.browseCount)/1e5)+'W+':Number(detailData.browseCount)}}</el-col>
                </el-row>
            </div>
            <div class="detail-content" v-html="detailData.content"></div>
            <div style="position: relative;text-align: right;">
                <div style="position: absolute;right: 200px;top: 11px;">分享到:</div>
                <share style="margin:30px;" :config="config"></share>
            </div>
            <div class="comment-box">
                <div class="comment-send-box">
                    <textarea maxlength="100" placeholder="最多输入100个字" v-model="content"></textarea>
                    <p class="word-tips">{{content.length}}/100</p>
                    <button @click="sendComment">{{userData&&userData.userId?'发表评论':'登录发表评论'}}</button>
                </div>
                <div class="comment-list-box">
                    <p class="des" v-show="commentList.length>0">精彩评论</p>
                    <div class="comment-list">
                        <div class="comment-item" v-for="(item,index) in commentList" :key="index">
                            <div class="comment-t clearfix">
                                <div class="l">
                                    <img class="comment-user-avatar" :src="item.avatar"/>
                                    <div class="info">
                                        <p class="comment-user-nickname">{{item.nickname}}</p>
                                        <p class="comment-time">{{item.createdAt}}</p>
                                    </div>
                                </div>
                                <div class="r">
                                    <p class="comment-praise-num" :class="item.isThumbsUp?'praised':''" @click="commentThumbsUp(item,index)"><i></i>{{item.likeNum}}</p>
                                </div>
                            </div>
                            <div class="comment-m">
                                <p class="comment-content">{{item.content}}</p>
                            </div>
                        </div>
                        <div class="loading" v-show="loading"><div class="loading-icon" v-loading="true"></div></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="returnpageDiv" v-show="!dataContentBools">
            <p>文章已不存在!</p>
            <p>返回资讯列表({{CountDown}}s)</p>
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex'
// import {Share} from 'vue-social-share'
import { NuxtContext } from 'nuxt'
import { setTimeout, setInterval,clearInterval} from 'timers';
import breadcrumb from '~/components/breadcrumb.vue'
if(process.client){
    require('~/plugins/share.js');
}
// Vue.use(Share)
@Component({
    components:{breadcrumb},
    computed:{
        ...mapState(['userData'])
    },
    async asyncData({app,params}:NuxtContext):Promise<any>{
        let query = {
                params:{
                    id:params.id
                }
            }
        let [pageBnnerTop] = await Promise.all([
                app.$axios.$get('/informations/informationDetailInfo',query)
            ])
        let titlelist = [
            {
                name:'首页',
                link:'/home'
            },
            {
                name:'资讯',
                link:'/information'
            }
        ]
        titlelist.push({
                name:pageBnnerTop.content.name,
                link:''
            });
            let dataContent =''
            if(pageBnnerTop.content.content){
                 dataContent = pageBnnerTop.content.content.replace(/<[^>]+>/g,"")
            }else{
                 dataContent = '';
            }
        var urls = ``;
        return {
                detailData:pageBnnerTop.content,
                datalist:titlelist,
                dataContentBools:dataContent.length>0?true:false,
                config:{
                        url: urls,
                        source:urls,
                        title: pageBnnerTop.content.name,
                        description:pageBnnerTop.content.name,
                        image: pageBnnerTop.content.pictureUrl,
                        sites: ['qzone', 'qq', 'weibo', 'wechat'],
                        wechatQrcodeHelper:''
                    }
              }
    },
    beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
        // this.toPath = to;
        clearInterval(this.clock);
        // return;
        next();
    }
})
export default class Auth extends Vue{
    detailData:object={};
    datalist:object[] = [];
    dataContentBools:boolean=true;
    maxNumber:number=5;
    CountDown:number=5;
    config:object = {};
    clock = null;
    content = '';
    pageNo = 1;
    pageSize = 10;
    loading = false;
    commentList = []
    head(){
        return {
            title:`${this.detailData.name||''} | 学国学网`
        }
    }
    created(){
        if(process.client){    
            let id = this.$route.params.id;
            let url = window.location.origin == 'https://www.xueguoxue.com'?`http://www.xueguoxue.com/information/${id}`:`https://dev.xueguoxue.com/information/${id}`;
            this.config.url = url
            this.config.source = url
        }
    }
    mounted(){
        window.scrollTop = 0;
        if(!this.dataContentBools){
            this.clock = setInterval(() => {
                    if(this.maxNumber>0){
                        this.maxNumber--;
                        this.CountDown = this.maxNumber;
                    }else{
                        clearInterval(this.clock);
                        this.$router.push({path:'/information'})
                    }
                },1000)
        }
        this.getInformationCommentList()
    }
    /**
     * 获取资讯列表
     */
    async getInformationCommentList(){
        this.loading = true;
        let query = {
            pageNo:this.pageNo,
            pageSize:this.pageSize,
            informationId:this.$route.params.id
        }
        let res = await this.$axios.$post(this.$server.getInformationCommentList,query);
        if(res.status==200){
            this.commentList = [...this.commentList,...res.content.list]
            this.loading = false;
            if(res.content.isLastPage){
                window.removeEventListener("scroll",this.scrollEvent)
            }else{
                this.$nextTick(()=>{
                    window.addEventListener("scroll",this.scrollEvent)
                })
            }
        }
    }
    /**
     * 滚动分页
     */
    scrollEvent(){
        let scrollDistance = document.body.scrollHeight - document.body.scrollTop - document.documentElement.clientHeight
        let sign = 50;
        if (scrollDistance <= sign) {
            window.removeEventListener("scroll",this.scrollEvent)
            this.pageNo++;
            this.getInformationCommentList();
        }
    }
    /**
     * 发表评论
     */
    async sendComment(){
        if(this.userData&&this.userData.userId){
            if(this.userData.cellphone){
                let content = this.content.replace(/(^\s*)|(\s*$)/g, "")
                if(content==''){
                    this.$message.error('请输入内容');
                    return false;
                }
                let query = {
                    informationId:this.$route.params.id,
                    content:this.content
                }
                let res = await this.$axios.$post(this.$server.addInformationComment,query);
                if(res.status==200){
                    this.$message({
                        message:'评论发表成功',
                        type:'success'
                    })
                    this.content = ''
                    this.pageNo = 1;
                    this.commentList = []
                    this.$nextTick(()=>{
                        this.getInformationCommentList();
                    })
                }
            }else{
                let url = this.$route.fullPath
                sessionStorage.setItem('redirectUrl',url)
                this.$router.push({
                    path:'/auth/bindPhone'
                })
            }
        }else{
            let url = this.$route.fullPath
            sessionStorage.setItem('redirectUrl',url)
            this.$router.push({
                path:'/auth/login'
            })
        }
    }
    /**
     * 评论点赞
     */
    async commentThumbsUp(obj,index){
        if(obj.isThumbsUp==1){
            this.$message.info('请勿重复点赞')
            return;
        }
        if(this.userData&&this.userData.userId){
            let query = {
                informationCommentId:obj.id
            }
            let res = await this.$axios.$post(this.$server.addInformationCommentLike,query)
            if(res.status==200){
                obj.isThumbsUp = 1;
                obj.likeNum++;
                this.$set(this.commentList,index,obj)
            }
        }else{
            let url = this.$route.fullPath
            sessionStorage.setItem('redirectUrl',url)
            this.$router.push({
                path:'/auth/login'
            })
        }
    }
}
</script>
<style lang="scss">
    .information-detail-page{
        .detail-content{
            p{
                word-wrap:break-word;
            }
        }
    }
</style>
<style lang="scss" scoped>
.detail-page{
    width: 1200px;
    display: inline-block;
    .returnpageDiv{
        margin: 30px 0;
        p:nth-child(1){
            font-size: 24px;
            font-weight: bold;
        }
        p:nth-child(2){
            font-size: 16px;
            margin-top: 15px;
        }
    }
    .detail-content{
        width: 100%;
        padding: 20px 0;
        
    }
    .detailData{
        width: 100%;
        border-bottom: 1px solid #F7F7F7;
        padding: 10px 0;
        font-size: 13px;
        color:#999999;
    }
    .detailName{
        width: 100%;
        font-size: 24px;
        margin: 53px 0px 28px 0px;
        text-align: left;
        font-weight: bold;
    }
    .comment-box{
        padding-top:20px;
        width: 100%;
        border-top:1px solid #dfdfdf;
        .comment-send-box{
            font-size: 0;
            position: relative;
            textarea,button{
                display: inline-block;
                vertical-align: middle;
                font-size: 16px;
            }
            .word-tips{
                position: absolute;
                right: 120px;
                bottom:10px;
                color:#aaa;
                font-size: 12px;
            }
            button{
                width: 110px;
                height: 84px;
                line-height: 84px;
                text-align: center;
                color:#fff;
                background: #C30D23;
                outline: none;
                border:none;
                border-radius: 0 3px 3px 0;
                cursor: pointer;
                &:hover{
                    background: #d8162d;
                }
            }
            textarea{
                width: calc(100% - 110px);
                height: 84px;
                background: #F4F4F4;
                border-radius: 3px 0 0 3px;
                border: 1px solid #cccccc;
                outline: none;
                resize: none;
                padding: 10px;
                line-height: 20px
            }
        }
        .comment-list-box{
            margin-top:40px;
            .des{
                color:#333;
                font-size: 16px;
                font-weight: bold;
                text-align:left;
            }
            .comment-list{
                font-size: 16px;
            }
            .comment-item{
                border-top:1px solid #CCCCCC;
                padding: 30px 30px 30px 0;
                &:first-child{
                    border-top: none;
                }
            }
            .l{
                float: left;
                font-size: 0;
            }
            .r{
                float: right;
                font-size: 0;
            }
            .comment-m{
                margin:10px 0 15px 0;
                padding: 0 10px 0 50px;
                .comment-content{
                    font-size: 14px;
                    color:#333;
                    line-height: 24px;
                    word-wrap:break-word;
                    text-align: left;
                    padding: 0 10px;
                }
            }
            .comment-user-avatar{
                width: 50px;
                height: 50px;
                display: inline-block;
                vertical-align: middle;
                border-radius: 50%;
                margin-right: 11px;
            }
            .info{
                display: inline-block;
                vertical-align: middle;
                text-align: left;
            }
            .comment-user-nickname{
                font-size: 16px;
            }
            .comment-time{
                font-size: 12px;
                color:#aaa;
                line-height: 20px;
            }
            .comment-praise-num{
                display: inline-block;
                vertical-align: middle;
                margin:0 10px 0 20px;
                line-height: 39px;
                height: 39px;
                font-size: 12px;
                cursor: pointer;
                i{
                    margin-right: 4px;
                    display: inline-block;
                    vertical-align: text-top;
                    width: 14px;
                    height: 14px;
                    background: url('../../../../assets/images/zan_icon.png')no-repeat 50% 50%/cover;
                }
                &.praised{
                    i{
                        background: url('../../../../assets/images/praise_active_icon.png')no-repeat 50% 50%/cover;
                    }
                }
            }
            .loading{
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>
