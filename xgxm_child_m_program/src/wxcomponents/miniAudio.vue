<template>
    <view class="mini-audio">
        <view class="player-box" @tap="goCourse">
            <view class="close" @tap.stop="close" v-if="audioData.playFlag?false:true">
                <image :src="closeImg">
            </view>
            <view  class="surface" :style="{left:`${leftUnm1}rpx`}">
                <view class="circle_process">
                    <view class="wrapper right">
                        <view class="circle rightcircle" :style="{transform: 'rotate('+rightNum+'deg)'}"></view>
                    </view>
                    <view class="wrapper left">
                        <view class="circle leftcircle" id="leftcircle"  :style="{transform: 'rotate('+leftNum+'deg)'}"></view>
                    </view>
                    <view class="img" :style="{background:`url(${audioData.surfacePlot}) 50% 50%/cover`}"></view>
                </view>	
            </view>
            <view class="middle"  :style="{left:`${leftUnm2}rpx`}">
                <view class="period-title textEllipsis">{{audioData.title||'你打呀'}}</view>
                <view class="period-time">
                    <text class="cur">{{curTime}}</text>
                    /
                    <text class="total">{{audioData.total}}</text>
                </view>
            </view>
            <view class="player-btn" @tap.stop="playEvent">
                <image :src="audioData.playFlag?pauseImg:player_btn"  webp lazy-load />
            </view>
        </view>
    </view>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import pauseImg from '../static/pause1.png' 
import player_btn from '../static/player1.png'
import closeImg from '../static/close1.png'
const formatSeconds = value =>{
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
};
export default {
    data(){
        return{
            pauseImg:pauseImg,//播放icon
            player_btn:player_btn,//暂停icon
            closeImg:closeImg,
            leftUnm1:30,
            leftUnm2:130,
            rightNum:-135,
            leftNum:-135,
            musicAllTime:0,
            rotateNum:0
        }
    },
    props:['cur','curList','courseIds'],
    computed:{
        ...mapState(['audioData','timeArry','courseaudioListInfo','audioOrVideo','localaudioListInfo']),
        curTime(){
            return this.$formatSeconds(this.cur)
        }
    },
    created(){
			var self = this;
            this.getMusicTime(self.audioData.total);
            if(this.audioData.playFlag){
                this.leftUnm1 = 30;
                this.leftUnm2 = 130;
            }else{
                this.leftUnm1 = 130;
                this.leftUnm2 = 236;
            }
    },
    watch:{
        cur(cur,old){
            if(cur){
               this.getTime();
            }
        }, 
        'audioData.playFlag': {
            handler(news,olds) {
                if(news){
                    this.leftUnm1=30;
                    this.leftUnm2 = 130;
                }else{
                    this.leftUnm1=130;
                    this.leftUnm2 = 236;
                }             
            }
        },
        'audioData.total': {
            handler(news,olds) {
                if(news){
                    this.getMusicTime(news);                   
                }            
            }
        }
        
    },
    methods:{
        ...mapActions(['setAudioData','setStatusCourseChoose','setCourseaudioListInfoData','setTimeArryData','setLessonListNums','setPlayCourseState','setLocalaudioListInfoData','setPlayCourseState','setLocalaudioListInfoData','sethandOperation','sethandOperationIsEnd']),
        playEvent(){
            const backgroundAudioManager = wx.getBackgroundAudioManager();
            let temp;
            if(this.audioData.playFlag){
                this.sethandOperationIsEnd(true);
                this.$store.commit('SETHANDOPERATIONISEND',true)                   
                backgroundAudioManager.pause();
                temp = Object.assign({},this.audioData,{playFlag:false});
                this.setPlaseRadioEven(this.audioData);
            }else{
                this.sethandOperation(true);
                this.$store.commit('SETHANDOPERATION',true)                 
                backgroundAudioManager.play();
                temp = Object.assign({},this.audioData,{playFlag:true})
            }
            this.setAudioData(temp)
        },
        getMusicTime(data){
            var muiscOne = data.split(":");
            this.musicAllTime = Number(muiscOne[0])*60+Number(muiscOne[1]);
            this.rotateNum = 180/(this.musicAllTime/2);
        },
        close(){
            this.sethandOperationIsEnd(true);
            this.$store.commit('SETHANDOPERATIONISEND',true)              
            const backgroundAudioManager = wx.getBackgroundAudioManager();
            backgroundAudioManager.stop();
            this.getListValToTimeEven(this.audioData);
        },
        goCourse(){
            uni.navigateTo({
                url: `/pages/courseDetail/index?id=${this.audioData.courseId}`
            });
        },
        //在小型音频播放器的操作；
        setPlaseRadioEven(data){
			//暂停，切换页面调用接口；
                var self = this;
                var realLearnRatelong = 0;
                realLearnRatelong = self.timeArry.length;               
                let query = {
                    periodId:data.periodId,//课时id 
					courseId:data.courseId,
					learnRate:self.cur,
					realLearnRate:realLearnRatelong,
					studyPoint:self.timeArry,
					lastStudyPoint:self.cur
                };
                this.$http.post(this.$server.savePeriodStudyRecordsUser,query).then(res=>{
                    if(res.data.status==200){
                        console.log("小的音频暂停了");
                    }
                }); 
        },
        getListValToTimeEven(data){
			//暂停，切换页面调用接口；
                var self = this;
                var realLearnRatelong = 0;
                realLearnRatelong = self.timeArry.length;              
                let query = {
                    periodId:data.periodId,//课时id 
					courseId:data.courseId,
					learnRate:self.cur,
					realLearnRate:realLearnRatelong,
					studyPoint:self.timeArry,
					lastStudyPoint:self.cur
                };
                this.$http.post(this.$server.savePeriodStudyRecordsUser,query).then(res=>{
                    if(res.data.status==200){
                        if(this.audioOrVideo=='audio'&&this.audioData.courseIds==this.courseIds){
                            this.setStatusCourseChoose(-1);
                            this.setPlayCourseState(false);
                            this.setLocalaudioListInfoData([]);
                            // this.setCourseaudioListInfoData([]);
                        }      
                        if(this.audioOrVideo=='audio'&&this.audioData.courseIds!=this.courseIds){
                            this.setStatusCourseChoose(-1);
                            this.setPlayCourseState(false);
                            this.setCourseaudioListInfoData([]);
                        }  
                        if(this.audioOrVideo=='video'||this.audioOrVideo=='other'){
                            this.setStatusCourseChoose(-1);
                            this.setPlayCourseState(false);
                            this.setCourseaudioListInfoData([]);
                            this.setCourseaudioListInfoData([]);
                            this.setLessonListNums(0);
                        }                                                                  
                        this.setAudioData({
                            title:'',//标题
                            cur:'00:00',//当前播放时间
                            total:'20:00',//总时间
                            surfacePlot:'',//课程封面
                            courseId: '',//课程ID
                            show:false,//音频播放条是否存在
                            playFlag: false,//是否在播放中
                            periodId: '',//课时id;
                            playerCreat:false
                        });
                        this.setTimeArryData([]);
                    }
                });          
        },
        getTime(){
            var self = this;	          
            var numCur = Number(self.cur);
            if(numCur<=self.musicAllTime/2){
                this.rightNum = -135+self.rotateNum*numCur;
                this.leftNum = -135;
            }else{
                this.rightNum = 45;
                this.leftNum = -135+self.rotateNum*(numCur-self.musicAllTime/2);
            }	
        }                 
    }
}
</script>
<style lang="scss" scoped>
    .mini-audio{
        position: fixed;
        z-index: 999;
        bottom:20rpx;
        left:0;
        width: 100vw;
        height: 60px;
        .player-box{
            width: 690rpx;
            height: 100%;
            margin:0 auto;
            border-radius: 30px;
            background: #fff;
            // display: flex;
            // align-items: center;
            // padding: 0 30rpx 0 0rpx; 
            box-sizing: border-box;
            box-shadow: 0px 0px 5px 1px #ccc;  
            position: relative;
            .close{
                position: absolute;
                padding: 18px 0 18px 0px;
                left: 30rpx;
                image{
                    width: 24px;
                    height: 24px;
                    display: block;
                }
            }
            .surface{
                position: absolute;
                height: 36px;
                width: 36px;
                // padding: 4rpx;
                // background: #fff;
                // border-radius: 50%;
                // overflow: hidden;
                // margin: 0 20rpx 0 10rpx;
                // box-sizing: border-box;
                top:11px;
                .circle_process {
                    position: relative;
                    width:36px;
                    height:36px;                    
                    .wrapper{
                        width: 18px;
                        height: 36px;
                        position: absolute;
                        top:0;
                        overflow: hidden;
                    }
                    .right{
                        right:0;
                    }   
                    .left{
                        left:0;
                    } 
                    .circle{
                        width: 32px;
                        height: 32px;
                        border:2px solid transparent;
                        border-radius: 50%;
                        position: absolute;
                        top:0;
                        transform : rotate(-135deg);
                    }   
                    .rightcircle{
                        border-top:2px solid #C30D20;
                        border-right:2px solid #C30D20;
                        border-bottom:2px solid #f4f4f4;
                        border-left:2px solid #f4f4f4;                        
                        right:0;
                    }
                    .leftcircle{
                        border-bottom:2px solid #C30D20;
                        border-left:2px solid #C30D20;
                        border-top:2px solid #f4f4f4;
                        border-right:2px solid #f4f4f4;                        
                        left:0;
                    } 
                    .img{
                        border-radius: 50%;
                        position: absolute;
                        width: 32px;
                        height: 32px;
                        display: block;
                        top:2px;
                        left:2px;
                        border-radius: 50%;                    
                    }                                                                                                                
                }
            }
            .middle{
                position: absolute;
                .period-title{
                    font-size: 32rpx;
                    color:#333;
                    width:340rpx;
                    margin:20rpx 0 10rpx 0;

                }
                .period-time{
                    font-size: 26rpx;
                    color:#999;
                    .cur{
                        width: 70rpx;
                        text-align: left;
                        display: inline-block;
                    }
                    .total{
                        display: inline-block;
                        padding-left: 8rpx;
                    }
                }                
            }
            .player-btn{
                position: absolute;
                padding: 16px 0;
                margin-left: 20rpx;
                right: 30rpx;
                image{
                    width: 28px;
                    height: 28px;            
                    display: block;        
                }
            }
        }
    }
</style>
<style>
