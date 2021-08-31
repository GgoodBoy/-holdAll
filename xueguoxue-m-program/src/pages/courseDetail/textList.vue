<template>
    <view class="list-pluge" :class="{'paddingOne':timeHideOrShow,'paddingTwo':!timeHideOrShow}"> 
        <view class="list-css" v-for="(item,index) in datalist" :key="index" @click="goSection(item,index)">
            <view class="list-text">第{{index+1}}节 {{item.title}}</view>
            <view v-if="(item.isTry==1||dataInfo.timeLimitType==0)&&dataInfo.isVip!=1&&dataInfo.isBuy!=1">
                <view v-if="audioOrVideo=='audio'">
                    <view class="list-but2" v-if="audioData.periodId==item.id&&playCourseState&&(item.courseId==audioData.courseId)"></view>
                    <view class="list-but1" v-else>试看</view>
                </view>
                <view v-if="audioOrVideo=='video'">
                    <view class="list-but2" v-if="videoData.statusCourseVidChoose==index&&videoData.playCourseVideState"></view>
                    <view class="list-but1" v-else>试看</view> 
                </view>
            </view>  
            <view v-if="dataInfo.isVip==1||dataInfo.isBuy==1">
                <view v-if="audioOrVideo=='audio'">
                <view class="list-but2" v-if="audioData.periodId==item.id&&playCourseState&&(item.courseId==audioData.courseId)"></view>
                <view class="list-but1" v-else>播放</view>
                </view>
                <view v-if="audioOrVideo=='video'">
                    <view class="list-but2" v-if="videoData.statusCourseVidChoose==index&&videoData.playCourseVideState"></view>
                    <view class="list-but1" v-else>播放</view>
                </view>
            </view>       
            <view v-if="dataInfo.isVip!=1&&item.isTry!=1&&dataInfo.isBuy!=1&&dataInfo.timeLimitType!=0&&dataInfo.isFree!=1">
                <view class="list-but3">
                    <image class="img-css" :src="periodLock"/>      
                </view>
            </view>                         
        </view>
    </view>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import playing from '../../static/courseDetail/playing.gif';
import periodLock from '../../static/courseDetail/period-lock.png';
export default {

    data() {
        return {
            playing:playing,
            periodLock:periodLock
        }
    },
    props:['datalist','dataInfo','timeHideOrShow'],
    onReady: function (res) {
    },
    computed:{
        ...mapState(['statusCourseChoose','playCourseState','audioOrVideo','videoData','audioData','timeArry'])
    },  
    watch:{      
        statusCourseChoose(news,olds){
            if(news!=-1){
                let data = this.datalist[news];
                this.$emit('toVideoEven',{id:data.id,courseId:data.courseId,targetDuration:data.targetDuration,courseId:data.courseId,isTry:data.isTry,lastStudyPoint:data.lastStudyPoint});
            }
        },
        'videoData.statusCourseVidChoose': {
            handler(news,olds) {
                if(news!=olds){
                    let data = this.datalist[Number(news)];
                    if(data){
                        this.$emit('toVideoEven',{id:data.id,courseId:data.courseId,targetDuration:data.targetDuration,courseId:data.courseId,isTry:data.isTry,lastStudyPoint:data.lastStudyPoint});
                    }
                }             
            }
        }        
    },  
    created(){},
    methods: { 
        ...mapActions(['setStatusCourseChoose','setVideoDateEven','setLessonListNums','sethandOperation','sethandOperationIsEnd']),
/*
                    this.sethandOperation(true);
                    this.sethandOperationIsEnd(true);
*/        
        //判断当前设备类型是安卓还是ios;ios不能进行购买        
        goSection(data,index){
            if(this.audioOrVideo=='audio'){
                this.sethandOperationIsEnd(true);
                this.sethandOperation(true);
                this.$store.commit('SETHANDOPERATIONISEND',true)
                this.$store.commit('SETHANDOPERATION',true)                
                if(this.audioData.show){
                    this.setStatusCourseChoose(-1);
                    setTimeout(()=>{
                        this.setLastTimeToStort(this.audioData.periodId,index);
                    },200);
                }else{
                    this.setLastTimeToStort(this.audioData.periodId,index);
                }
            }else{
                this.setVideoTimeToStort(this.videoData.periodId,index);
            }
        },
        setVideoTimeToStort(periodId,indexPrId){
            //取出存储的路径播放数组；
            var self= this;
            //获取数据存储的最后值；
            var videoArry = this.videoData.studyPoint;
            self.sethandOperation(true);
            if(videoArry.length){
                var lastVals = videoArry[videoArry.length-1];
                self.datalist.forEach((element,index)=>{
                    if(element.id==periodId){
                        element.lastStudyPoint = lastVals;
                    }
                });
                this.setLessonListNums(self.datalist);
                let temp = Object.assign({},this.videoData,{statusCourseVidChoose:indexPrId})
                this.setVideoDateEven(temp); 
            }else{
                let temp = Object.assign({},this.videoData,{statusCourseVidChoose:indexPrId})
                this.setVideoDateEven(temp); 
            }     
                   
        },
        //切换存储数组最后的值；
        setLastTimeToStort(periodId,indexPrId){
            //取出存储的路径播放数组；
            var self= this;
            //获取数据存储的最后值；
            var letAimeArry = this.$store.state.timeArry;
            if(letAimeArry.length){
                var lastVals = letAimeArry[letAimeArry.length-1];
                self.datalist.forEach((element,index)=>{
                    if(element.id==periodId){
                        element.lastStudyPoint = lastVals;
                    }
                });
                this.setLessonListNums(self.datalist);
                this.setStatusCourseChoose(indexPrId);
            }else{
                this.setStatusCourseChoose(indexPrId);
            }
        }        
    },
    mounted(){}
        
}
</script>
<style lang="scss">
.paddingOne{
    padding:0 29rpx 110rpx; 
}
.paddingTwo{
    padding:0 29rpx 30rpx; 
}
.list-pluge{
    display: flex;
    flex-direction: column;
    max-height:calc(100% -  680rpx);
    overflow-y: auto;
    .list-css{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 36rpx;
        .list-text{
            overflow:hidden; //超出一行文字自动隐藏
            text-overflow:ellipsis;//文字隐藏后添加省略号
            white-space:nowrap;            
            max-width: 540rpx;
            font-size: 28rpx;
            color: #1A1A1AFF;
        }
        .list-but1{
            text-align: center;
            line-height: 50rpx;
            color: #fff;
            background: #c52d3b;
            font-size: 36rpx;
            width: 80rpx;
            height: 50rpx;
            font-size: 24rpx;
            border-radius: 30rpx;
        }
        .list-but3{
            font-size: 36rpx;
            padding: 0 15rpx;
            .img-css{
                display: block;
                width: 50rpx;
                height: 50rpx;
                margin: auto;
            }
        }        
        .list-but2{
            background: url('../../static/courseDetail/playing.gif') no-repeat;
            // background-size: cover;
            background-size:100%100%;  
            width: 80rpx;
            height: 50rpx;
        }        
    }
}
</style>
<style>
</style>