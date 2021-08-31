<template>
    <div class="comment-item">
        <img class="head" :src="commentData.avatar"/>
        <div class="body">
            <div class="info">
                <div>
                    <p class="name">{{commentData.nickname}}</p>
                    <img class="btn" :src="require('../assets/image/guanzhu.png')" @click="goApp"/>
                </div>
                <span class="spot" @click="goApp">...</span>
            </div>
            <div class="time">{{commentData.createdAt}}</div>
            <div class="content" :class="contentShow?'content-show':''" ref="container">
                <p class="show" ref="content">
                    {{commentData.commentContent}}
                </p>
                <p class="really">
                    {{commentData.commentContent}}
                </p>
            </div>
            <div class="voice" v-if="commentData.isVoice&&commentData.isVoice==1" @click="audioEvent(commentData)">
                <i class="icon" :class="commentData.playing?'playing':''"></i>
                <span>{{commentData.duration}}'</span>
            </div>
            <div class="handle">
                <p>
                    xxxx
                </p>
                <p @click="goApp">
                    <span class="comment-icon"></span>
                    <span>回复</span>
                </p>
                <p @click="goApp">
                    <span class="zan-icon"></span>
                    <span>{{commentData.likeNum}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           contentShow:false
        }
    },
    props:['commentIndex','index','commentData','playing','voiceUrl','inOtherApp'],
    created(){
        this.$nextTick(()=>{
            let container = this.$refs.container;
            let content = this.$refs.content;
            let str = this.commentData.commentContent;
            if (content.clientHeight > container.clientHeight) {
                for (let i = 0; i <= str.length; i++) {
                    content.innerHTML = str.slice(0,i);
                    if (content.clientHeight > container.clientHeight) {
                        content.innerHTML = str.slice(0,i-5) + '<span class="mores">...全文＞</span>'
                        break;
                    }
                }
            }
            this.$nextTick(()=>{
                let dom = container.querySelector('.mores')
                if(dom){
                    dom.addEventListener('click',(e)=>{
                        this.contentShow = true;
                    })
                }
            })
        })
    },
    methods:{
        audioEvent(obj){
            if(obj.voiceUrl==this.voiceUrl){
                if(this.playing){
                    this.$emit('update:playing',false)
                }else{
                    this.$emit('update:commentIndex',-1)
                    this.$nextTick(()=>{
                        this.$emit('update:commentIndex',this.index)
                    })
                    this.$emit('update:playing',true)
                }
            }else{
                this.$emit('update:voiceUrl',obj.voiceUrl)
                this.$emit('update:playing',true)
                this.$emit('update:commentIndex',this.index)
            }
        },
        goApp(){
            let isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            if(this.inOtherApp){
                window.location.href = `https://xgxm.xueguoxue.com/h5/download/index.html?type=xueyouquan&xueyouquanid=${this.$route.query.id}`
            }else{
                if(isIos){
                    window.location.href=`xueguoxuewang://type=xueyouquan&xueyouquanid=${this.$route.query.id}`
                    setTimeout(()=>{
                        let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
                        if(typeof hidden =="undefined" || hidden ==false){
                            window.location.href = `https://xgxm.xueguoxue.com/h5/download/index.html?type=xueyouquan&xueyouquanid=${this.$route.query.id}`
                        }
                    }, 2000);
                }else{
                    this.$toast.loading()
                    let a = document.createElement('a');
                    a.setAttribute('data-params', `{classmatesMsgId:${this.$route.query.id}}`);
                    a.setAttribute('href', 'https://bm7ilz.jgshare.cn/AA7u');
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
    }    
}
</script>
<style lang="scss" scoped>
    .comment-item{
        padding: 0 0 0 0.3rem;
        &:first-child{
            .body{
                border:none;
            }
        }
        .head{
            width: 0.72rem;
            height: 0.72rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 0.2rem;
            float: left;
            margin-top:0.4rem;
        }
        .body{
            padding: 0.4rem 0.3rem 0.4rem 0;
            border-top:1px solid #eee;
            overflow: hidden;
            .info{
            display: flex;
            justify-content: space-between;
            align-items: center;
            color:#333333;
            font-size: 0;
            .spot{
                font-size: 0.4rem;
                position: relative;
                bottom: 0.4rem;
                height: 0rem;
            }
            p{
                display: inline-block;
                // vertical-align: middle;
            }
            .name{
                font-size:0.32rem;
                line-height:0.44rem;
                margin-right: 0.1rem;
                font-weight: bold;
                height: 0.44rem;
                vertical-align: middle;
            }
            .btn{
                width: 0.94rem;
                max-width: 100%;
                vertical-align: middle;
                // position: relative;
                // top:0.06rem;
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
            .really{
                position: absolute;
                top:0;
                left:0;
                display: none;
            }
            .show{
                position: relative;
            }
            .mores{
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
            }
            .warning{
                font-size: 0;
                margin-top:0.2rem;
                i,span{
                    display: inline-block;
                    vertical-align: middle;
                }
                i{
                    margin-right: 0.1rem;
                    width: 0.48rem;
                    height: 0.42rem;
                    background: url('../assets/image/warning.png')no-repeat 50% 50% / cover;
                }
                span{
                    border-radius: 0.06rem;
                    background:rgba(195,13,35,0.5);
                    padding:0 0.2rem ;
                    line-height: 0.42rem;
                    color:#fff;
                    font-size: 0.24rem;
                    width: calc(100% - 0.58rem);
                }
            }
            .voice{
                height: 0.96rem;
                margin-top:0.1rem;
                background: url('../assets/image/audio.png')no-repeat 50% 50% / contain;
                padding: 0 0.2rem;
                font-size: 0;
                .icon{
                    background: url('../assets/image/icon.png')no-repeat 50% 50% / cover;
                    width: 0.28rem;
                    height: 0.36rem;
                    margin-right: 0.14rem;
                    display:inline-block;
                    vertical-align: middle;
                    &.playing{
                        background: url('../assets/image/playing.gif')no-repeat 50% 50% / cover;
                    }
                }
                span{
                    font-size: 0.26rem;
                    color:#fff;
                    display:inline-block;
                    vertical-align: middle;
                    line-height: 1.1rem;
                }
                
            }
            .topic-name{
            font-size: 0.24rem;
            color:#C30D23;
            width: 100%;
            line-height: 0.4rem;
            }
            .handle{
            display: flex;
            align-items: center;
            justify-content: space-between;
            color:#666666;
            font-size: 0.24rem;
            line-height: 0.32rem;
            margin:0.3rem 0 0 0;
            p{
                &:first-child{
                    opacity: 0;
                }
            }
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