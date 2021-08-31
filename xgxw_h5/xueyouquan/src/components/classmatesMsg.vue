<template>
    <div class="classmatesMsg-box">
        <img class="head" :src="classmatesMsgData.avatar"/>
        <div class="body">
            <div class="info">
                <div class="box">
                <p class="name">{{classmatesMsgData.nickname}}</p>
                <img class="btn" :src="require('../assets/image/guanzhu.png')" @click="goApp"/>
                </div>
                <span class="spot">...</span>
            </div>
            <div class="time">{{classmatesMsgData.createdAt}}</div>
            <div class="content" :class="contentShow?'content-show':''" ref="container">
                <span class="tag tag1" v-if="classmatesMsgData.recommendStatus==1">推荐</span>
                <span class="tag tag2" v-if="classmatesMsgData.essenceStatus==1">精华</span>
                <p class="show" ref="content" :class="classmatesMsgData.recommendStatus==1||classmatesMsgData.essenceStatus==1?'pad':''">
                    {{classmatesMsgData.msgContent}}
                </p>
                <p class="really" :class="classmatesMsgData.recommendStatus==1||classmatesMsgData.essenceStatus==1?'pad':''">
                    {{classmatesMsgData.msgContent}}
                </p>
            </div>
            <p class="topic-name" v-if="classmatesMsgData.topicNameShow">来自话题:{{classmatesMsgData.topicName}}</p>
            <div class="annex course" v-if="classmatesMsgData.annexType==1" @click="toCourse">
                <img class="surface" :src="classmatesMsgData.courses.surfacePlot"/>
                <div class="course-info">
                <p class="title">{{classmatesMsgData.courses.title}}</p>
                <p class="author">作者:{{classmatesMsgData.courses.lectureTeacherList[0].name}}<span v-if="classmatesMsgData.courses.lectureTeacherList.length>1">等</span></p>
                </div>
            </div>
            <div class="annex image" :class="classmatesMsgData.pictureUrlArr.length==1?'one':''" v-if="classmatesMsgData.annexType==2">
                <div class="box" v-for="(item,index) in classmatesMsgData.pictureUrlArr" :key="index" :style="{'background':`url(${item})no-repeat 50% 50% / cover`}" @click="previewImage(index)">
                </div>
            </div>
            <div class="annex short-video" v-if="classmatesMsgData.annexType==3">
                <p class="title">{{classmatesMsgData.shortVideo.name}}</p>
                <div class="box" :style="{'background':`url(${classmatesMsgData.shortVideo.backgroundUrl})no-repeat 50% 50% / cover`}">
                <div class="mask" v-if="!startPlay">
                    <div class="player-btn" @click="startPlay=true"></div>
                </div>
                <Video v-else :shortVideoId="classmatesMsgData.shortVideo.id" :playings.sync="playings" :duration="classmatesMsgData.shortVideo.duration"></Video>
                </div>
            </div>
            <div class="handle">
                <p @click="goApp">
                <span class="share-icon"></span>
                </p>
                <p @click="goApp">
                <span class="comment-icon"></span>
                <span>{{classmatesMsgData.commentNum}}</span>
                </p>
                <p @click="goApp">
                <span class="zan-icon"></span>
                <span>{{classmatesMsgData.likeNum}}</span>
                </p>
            </div>
        </div>
        <van-image-preview v-model="show" :start-position="startIndex" :images="classmatesMsgData.pictureUrlArr"></van-image-preview>
    </div>
</template>
<script>
import Video from '@/components/video.vue'
export default {
    data(){
        return{
            contentShow:false,//说说内容全文显示
            show: false,//图片预览组件
            startIndex:1,//图片预览第几张
            startPlay:false,//是否开始播放短视频
            playings:false,
        }
    },
    props:['classmatesMsgData','inOtherApp','playing'],
    watch:{
        playings(cur,old){
            this.$emit('update:playing',cur)
        },
        playing(cur,old){
            this.playings = cur;
        }
    },
    components:{Video},
    created(){
        this.playings = this.playing
    },
    mounted(){
        if(this.classmatesMsgData.topicName){
          this.classmatesMsgData.topicName = `#${this.classmatesMsgData.topicName}#`
        }
        if(this.classmatesMsgData.annexType==2){
          this.classmatesMsgData.pictureUrlArr = this.classmatesMsgData.pictureUrl.split(',');
        }
        this.$nextTick(()=>{
            let container = this.$refs.container;
            let content = this.$refs.content;
            let str = this.classmatesMsgData.msgContent;
            if (content.clientHeight > container.clientHeight) {
                for (let i = 0; i <= str.length; i++) {
                    content.innerHTML = str.slice(0,i);
                    if (content.clientHeight > container.clientHeight) {
                        content.innerHTML = str.slice(0,i-5) + '<span class="more" ref="more">...全文＞</span>'
                        break;
                    }
                }
            }
            this.$nextTick(()=>{
                let dom = document.querySelector(".more");
                if(dom){
                    dom.addEventListener('click',(e)=>{
                        this.contentShow = true;
                    })
                }
            })
        })
    },
    methods:{
        /**
         * 查看图片
         */
        previewImage(index){
            this.startIndex = index;
            this.show = true;
        },
        /**
         * 去课程
         */
        toCourse(){
            let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            let baseUrl = window.location.href.includes('xgxm.xueguoxue.com')?'https://xgxm.xueguoxue.com/#/course/':'https://scm.youfushuyuan.com/#/course/';
            if(this.inOtherApp){
                window.location.href = baseUrl+this.classmatesMsgData.courseId
            }else{
                if(isIos){
                window.location.href=`xueguoxuewang://type=course&courseId=${this.classmatesMsgData.courseId}`
                setTimeout(()=>{
                    let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
                    if(typeof hidden =="undefined" || hidden ==false){
                    window.location.href = baseUrl+this.classmatesMsgData.courseId
                    }
                }, 2000);
                }else{
                this.$toast.loading()
                let a = document.createElement('a');
                a.setAttribute('data-params', `{courseId:${this.classmatesMsgData.courseId}}`);
                a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
                a.setAttribute('data-jmlink', 'true');
                a.setAttribute('data-auto', 'false');
                document.body.appendChild(a);
                setTimeout(() => {
                    this.$toast.clear()
                    a.click();
                }, 2000);
                }
            }  
        },
        goApp(){
            this.$emit('goApp',true)
        }
    }
}
</script>
<style lang="scss" scoped>
    .classmatesMsg-box{
        padding:0.4rem 0 0 0.3rem;
        background: #fff;
        .head{
            width: 0.72rem;
            height: 0.72rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 0.2rem;
            float: left;
        }
        .body{
            overflow: hidden;
            padding-right: 0.3rem;
            border-bottom:1px solid #eee;
            .info{
            display: flex;
            justify-content: space-between;
            align-items: center;
            color:#333333;
            font-size: 0;
            p{
                display: inline-block;
                // vertical-align: middle;
            }
            .box{
            
            }
            .name{
                font-size:0.32rem;
                line-height:0.44rem;
                margin-right: 0.1rem;
                font-weight: bold;
            }
            .btn{
                width: 0.94rem;
                max-width: 100%;
                position: relative;
                top:0.06rem;
            }
            .spot{
                font-size: 0.4rem;
                position: relative;
                bottom: 0.4rem;
                height: 0rem;
            }
            }
            .time{
            color:#999999;
            line-height: 0.32rem;
            font-size: 0.22rem;
            margin-bottom:0.1rem;
            }
            .content{
            position: relative;
            font-size: 0.32rem;
            line-height: 0.44rem;
            max-height: 2.64rem;
            overflow-wrap: break-word;
            &.content-show{
                max-height: none;
                .show{
                display: none;
                }
                .really{
                display: block;
                position: relative;
                }
            }
            .pad{
                text-indent: 0.8rem;
            }
            .show{
                position: relative;
                // &::after{
                //   content:'';
                //   display: block;
                //   position: absolute;
                //   right: 0;
                //   bottom:0;
                //   width: 7px;
                //   height: 7px;
                //   border-top: 1px solid #666;
                //   border-right: 1px solid #666;
                //   transform: rotate(45deg);
                // }
            }
            .really{
                position: absolute;
                top:0;
                left:0;
                display: none;
            }
            .more{
                color:#666;
                // position: absolute;
                // right: 0;
                // bottom:0;
                z-index:1;
                // background: #fff;
                text-indent: 0px;
                i{
                position: relative;
                top:0.06rem;
                }
            }
            .tag{
                width: 0.78rem;
                // height: 0.36rem;
                line-height: 1;
                padding:0.06rem 0 0.04rem;
                display: inline-block;
                color:#fff;
                font-size: 0.28rem;
                border-radius: 0.2rem 0 0.2rem 0;
                text-align: center;
                position: absolute;
                top:0.02rem;
                &.tag1{
                background-image: linear-gradient(135deg,#CE172D, #E12A40);
                }
                &.tag2{
                background-image: linear-gradient(135deg,#FF6122, #F69632);
                }
            }
            }
            .topic-name{
            font-size: 0.24rem;
            color:#C30D23;
            width: 100%;
            line-height: 0.4rem;
            word-break: break-all;
            }
            .annex{
            margin:0.1rem 0;
            
            &.course{
                border-radius: 0.12rem;
                overflow: hidden;
                .surface{
                width: 2.29rem;
                height: 1.3rem;
                float: left;
                }
                .course-info{
                background:rgba(244,244,244,1);
                overflow: hidden;
                display: flex;
                align-content: space-between;
                padding: 0.06rem 0.2rem;
                height: 1.3rem;
                flex-wrap: wrap;
                .title{
                    line-height: 0.36rem;
                    color:#333;
                    font-size: 0.28rem;
                }
                .author{
                    font-size:0.24rem ;
                    color:#666;
                }
                }
            }
            &.short-video{
                border-radius: 0.12rem;
                padding: 0.2rem;
                background:rgba(244,244,244,1);
                .title{
                line-height: 0.42rem;
                color:#333;
                font-size: 0.3rem;
                margin-bottom: 0.08rem;
                }
                .box{
                height: 3.18rem;
                position: relative;
                .mask{
                    background: rgba(0,0,0,0.5);
                    position: absolute;
                    top:0;
                    left:0;
                    width: 100%;
                    height: 100%;
                    .player-btn{
                    width: 0.6rem;
                    height: 0.6rem;
                    background: url('../assets/image/play.png')no-repeat 50% 50% / cover;
                    position: absolute;
                    top:50%;
                    left:50%;
                    transform: translate(-50%,-50%);    
                    }
                }
                }
            }
            &.image{
                display: flex;
                flex-wrap: wrap;
                &.one{
                    .box{
                        width:3.9rem!important;
                        height: 3.9rem!important;
                    }
                }
                .box{
                width:calc(calc(100% - 0.4rem) / 3);
                margin:0.2rem 0.2rem 0 0;
                height:1.84rem;
                box-sizing: border-box;
                border-radius: 0.12rem;
                position: relative;
                overflow: hidden;
                &:nth-child(3n){
                    margin-right: 0;
                }
                &:nth-child(-n+3){
                    margin-top: 0; 
                }
                }
                img{
                position: absolute;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
                }
            }
            }
            audio{
            position: absolute;
            opacity: 0;
            }
            .handle{
            display: flex;
            align-items: center;
            justify-content: space-between;
            color:#666666;
            font-size: 0.24rem;
            line-height: 0.32rem;
            margin:0.3rem 0 0.4rem 0;
            span{
                display: inline-block;
                vertical-align: middle;
            }
            .share-icon{
                display: inline-block;
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.08rem;
                background: url('../assets/image/share.png')no-repeat 50% 50% / cover;
            }
            .comment-icon{
                display: inline-block;
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.08rem;
                background: url('../assets/image/comment.png')no-repeat 50% 50% / cover;
            }
            .zan-icon{
                display: inline-block;
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.08rem;
                background: url('../assets/image/zan.png')no-repeat 50% 50% / cover;
            }
            }
        }
    }
</style>