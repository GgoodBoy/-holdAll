<template>
    <view class="mini-audio">
        <view class="player-box" @tap="goCourse">
            <view class="close" @tap.stop="close">
                <image class="img-css" :src="closeImg">
            </view>
            <view class="surface">
                <view class="img" :style="{background:`url(${audioData.surfacePlot}) 50% 50%/cover`}"></view>
            </view>
            <view class="middle">
                <view class="period-title textEllipsis">{{audioData.title}}</view>
                <view class="period-time">
                    <text class="cur">{{curTime}}</text>
                    /
                    <text class="total">{{audioData.total}}</text>
                </view>
            </view>
            <view class="player-btn" @tap.stop="playEvent">
                <image class='img-css' :src="audioData.playFlag?pauseImg:player_btn" />
            </view>
        </view>
    </view>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import pauseImg from '../static/pause.png' 
import player_btn from '../static/player.png'
import closeImg from '../static/close.png'
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
            closeImg:closeImg
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

    },
    methods:{
        ...mapActions(['setAudioData','setStatusCourseChoose','setCourseaudioListInfoData','setTimeArryData','setLessonListNums','setPlayCourseState','setLocalaudioListInfoData','sethandOperation','sethandOperationIsEnd']),
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
        height: 116rpx;
        .player-box{
            width: 690rpx;
            height: 100%;
            margin:0 auto;
            border-radius: 60rpx;
            background: rgba(95,95,95,0.95);
            display: flex;
            align-items: center;
            padding: 0 30rpx 0 0rpx; 
            box-sizing: border-box;
            .close{
                padding: 30rpx;
                .img-css{
                    width: 30rpx;
                    height: 30rpx;
                    display: block;
                }
            }
            .surface{
                height: 88rpx;
                width: 88rpx;
                padding: 4rpx;
                background: #fff;
                border-radius: 50%;
                overflow: hidden;
                margin: 0 20rpx 0 10rpx;
                box-sizing: border-box;
                .img{
                    border-radius: 50%;
                    height: 100%;
                    width: 100%;
                }
            }
            .period-title{
                font-size: 28rpx;
                color:#fff;
                line-height: 1;
                width:340rpx;
                margin-bottom: 2rpx;
            }
            .period-time{
                font-size: 24rpx;
                color:#fff;
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
            .player-btn{
                padding: 40rpx 20rpx;
                margin-left: 20rpx;
                .img-css{
                    width: 40rpx;
                    height: 40rpx;            
                    display: block;        
                }
            }
        }
    }
</style>