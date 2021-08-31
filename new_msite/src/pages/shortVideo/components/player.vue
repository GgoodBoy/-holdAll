<template>
        <div class="videoClassBox" :id="`videoBoxId${itemObj.index}`">
            <p class="video-p1">{{titleName}}</p>
            <div class="video-img-box" @click="toVideoPage">
                <img :src="backCover"/>
                <div class="layoutDiv">
                    <div class="van-icon-css">
                        <img :src="videoClose">
                    </div>
                </div> 
                <div class="timeInfoShow">{{formatSeconds(Number(duration))}}</div>               
            </div>
            <div class="video-div1">
                <div class="video-div2" @click="courseInfoEven()" v-show="(courseName&&courseName.length>0)?true:false">
                    <!-- <img :src="minHand"/> -->
                    <span>{{courseName}}</span>
                </div>
                <div class="video-div3">
                    <img class="img1" v-if="iconPraiseState" src="../img/praise-c.png" @click="praiseEven(false)"/>
                    <img class="img1" v-else src="../img/praise-b.png" @click="praiseEven(true)"/>
                    <p>{{Number(praiseNum)>999?"999+":Number(praiseNum)}}</p>
                    <img class="img1" src="../img/share-b.png" @click.stop="shareEven()"/>
                </div>
            </div>
        </div>
</template>

<script>
import videoOpen from '../img/videoOpen.png';
import videoClose from '../img/videoClose.png';
// import minHand from '@/assets/minHand.png';
import {mapActions,mapState} from 'vuex'
export default {
    props:["itemObj","shareType"],
    data () {
        return {
            videoClose:videoClose,
            videoOpen:videoOpen,
            // minHand:minHand,
            idUrl:'',
            urlInfo:null,
            iconPraiseState:false,
            courseId:'',
            //当前视频绑定字段：
            courseName:'',
            titleName:'',
            praiseNum:0,
            backCover:'',
            duration:0,
        }
    },
    created(){
        this.idUrl = this.itemObj.urls.id;
        this.courseName = this.itemObj.urls.courseName;
        this.titleName = this.itemObj.urls.name;
        this.praiseNum = this.itemObj.urls.pointNum;
        this.backCover = this.itemObj.urls.backgroundUrl;
        this.duration = this.itemObj.urls.duration;
        this.courseId = this.itemObj.urls.relationCourseId;
        this.iconPraiseState = this.itemObj.urls.hasPoint==1?true:false;
        let ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined"){
            this.isWx = true;
        }
    },
    watch: {},
    methods:{
        ...mapActions(['setAudioData']),
         formatSeconds(value){
            let m = parseInt(value % 3600 / 60)
            let s = parseInt(value % 3600 % 60)
            let mStr = m<10?`0${m}`:m;
            let sStr = s<10?`0${s}`:s;
            if(value<3600){
                return `${mStr}:${sStr}`
            }else{
                let h = parseInt(value/3600)
                let hStr = h<10?`0${h}`:h;
                return `${hStr}:${mStr}:${sStr}`
            }
        },         
        toVideoPage(){
            this.setAudioData({})
            this.$emit('clickVideToParems',{id:this.idUrl,index:this.itemObj.index,flogs:true,backCover:this.backCover})
        },
        courseInfoEven(){
            this.$router.push(`/course/${this.courseId}`)
        },        
        shareEven(obj){
            let login = JSON.parse(this.$getCookie('uInfo'));
            if(!login){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
                this.$router.push('/auth')
                return;
            }else{
                this.$emit('update:shortVideoId',this.idUrl)
                if(this.isWx){
                    this.$emit('update:shareType','1')
                    // this.$router.push(`/courseTypeWrap/shortVideoSharePoster/${this.idUrl}`)
                }else{
                    this.$emit('update:shareType','2')
                    // this.$router.push(`/courseTypeWrap/shortVideoNormalShare/${this.idUrl}`)
                }
            }
        },
        praiseEven(bool){
            if(bool){
                let login = JSON.parse(this.$getCookie('uInfo'));
                if(!login){
                    sessionStorage.setItem('rediectUrl',this.$route.fullPath)
                    this.$router.push('/auth')
                    return;
                }
                let parems = {
                    shortVideoId:this.idUrl,
                    userId:login.userid
                }
                this.$http.post(this.$server.setVideoPoint,parems).then(res =>{
                    if(res.data.status==200){
                        this.iconPraiseState=bool;
                        this.praiseNum = Number(this.praiseNum+1);
                        this.$toast("点赞成功");
                    }else{
                        this.$toast(res.data.message);
                    }
                });
            }else{
                this.$toast("不可重复点赞");
            }
        },
        //当前播放器是否开启
        layoutBoolEven(index){},
    },
    mounted(){}
}
</script>
<style lang="scss" scoped>
.videoClassBox{
    margin:0 0.3rem;
    padding: 0;
    color: #fff;
    border-bottom: 0.02rem solid #D8D8D8FF;
    .video-p1{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;     
        text-align: left;
        color: #333;
        font-size: 0.3rem;
        padding: 0.2rem 0;
    }    
    .video-img-box{
        .timeInfoShow{
            bottom: 0.3rem;
            right: 0.3rem;
            color: #fff;
            z-index: 2;
            position: absolute;
        }        
        height: 3.88rem;
        position: relative;
        overflow: hidden;
        .layoutDiv{
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0rem;
            right: 0;
            background: rgba(0,0,0,0.4);
            pointer-events: none;
            .van-icon-css{
                width:0.76rem;
                height: 0.76rem;
                position: absolute;
                z-index: 9;
                top:50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }            
        }
    }
    .video-div1{
        overflow: hidden;
        zoom: 1;
        padding: 0.2rem 0; 
        color: #333;       
        .video-div2{
            float: left;
            line-height: 0.56rem;
            max-width: 4.6rem;
            font-size: 0.3rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden; 
            text-align: center;
            border:0.02rem solid #C30D23;
            padding: 0 0.2rem;
            border-radius: 0.56rem;            
            // img{
            //     width: 0.4rem;
            //     height: 0.32rem;
            // }
      
        }        
        .video-div3{
            float: right;
            .img1{
                width: 0.42rem;
            }
        }
        .video-div3{
            zoom: 1;
            overflow: hidden;
            margin-top: 0.1rem;
            p{
                line-height: 0.42rem;
                font-size: 0.32rem;
                margin: 0 0.5rem 0 0.2rem;
            }
            img,p{
                float: left;
            }
        }
    }    
}
</style>
