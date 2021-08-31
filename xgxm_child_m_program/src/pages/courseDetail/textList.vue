<template>
<!-- <view class="list-pluge " :class="{'paddingOne':timeHideOrShow,'paddingTwo':!timeHideOrShow}">  -->
    <view class="list-pluge paddingOne"> 
        <view class="catalogList">
            <view>目录</view>
        </view>
        <view class="transtionCssBox" :style="{height:height}">
            <view class="list-css" v-for="(item,index) in datalist" :key="index" @click="goSection(item,index)">
                <view class="list-text">第{{index+1}}节 {{item.title}}</view>
                <view v-if="(item.isTry==1||dataInfo.timeLimitType==0)&&dataInfo.isVip!=1&&dataInfo.isBuy!=1">
                    <view v-if="audioOrVideo=='audio'">
                        <view class="list-but2" v-if="audioData.periodId==item.id&&playCourseState&&(item.courseId==audioData.courseId)"></view>
                        <!-- <view class="list-but1" v-else>试看</view> -->
                        <view class="list-but1" v-else>
                            <image :src="videosNext"/>
                        </view>
                    </view>
                    <view v-if="audioOrVideo=='video'">
                        <view class="list-but2" v-if="videoData.statusCourseVidChoose==index&&videoData.playCourseVideState"></view>
                        <!-- <view class="list-but1" v-else>试看</view>  -->
                        <view class="list-but1" v-else>
                            <image :src="videosNext"/>
                        </view>
                    </view>
                </view>  
                <view v-if="dataInfo.isVip==1||dataInfo.isBuy==1">
                    <view v-if="audioOrVideo=='audio'">
                        <view class="list-but2" v-if="audioData.periodId==item.id&&playCourseState&&(item.courseId==audioData.courseId)"></view>
                        <!-- <view class="list-but1" v-else>播放</view> -->
                        <view class="list-but1" v-else>
                            <image :src="videosNext"/>
                        </view>
                    </view>
                    <view v-if="audioOrVideo=='video'">
                        <view class="list-but2" v-if="videoData.statusCourseVidChoose==index&&videoData.playCourseVideState"></view>
                        <!-- <view class="list-but1" v-else>播放</view> -->
                        <view class="list-but1" v-else>
                            <image :src="videosNext"/>
                        </view>
                    </view>
                </view>       
                <view v-if="dataInfo.isVip!=1&&item.isTry!=1&&dataInfo.isBuy!=1&&dataInfo.timeLimitType!=0&&dataInfo.isFree!=1">
                    <view class="list-but3">
                        <image :src="periodLock"/>      
                    </view>
                </view>                         
            </view>
        </view>
        <view class="listBut" v-if="datalist&&datalist.length>4">
            <view class="butBox" @click="setheightEven">
                <view v-if="heightType" class="titles">收起全部目录</view>
                <view v-if="!heightType" class="titles">展开全部目录</view>
                <image v-if="heightType" :src="arrowTop"></image>
                <image v-if="!heightType" :src="arrowBottton"></image>
            </view>
        </view>
    </view>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import playing from '../../static/courseDetail/playing.gif';
import periodLock from '../../static/courseDetail/period-lock.png';
import arrowTop from '../../static/arrowTop.png';
import videosNext from '../../static/videosNext.png';
import arrowbottton from '../../static/arrowbottton.png';
export default {
    data() {
        return {
            playing:playing,
            periodLock:periodLock,
            arrowTop:arrowTop,
            videosNext:videosNext,
            arrowBottton:arrowbottton,
            heightType:false,
            height:0,
            listShow:true
        }
    },
    props:['datalist','dataInfo','timeHideOrShow'],
    onReady: function (res) {},
    computed:{
        ...mapState(['statusCourseChoose','playCourseState','audioOrVideo','videoData','audioData','timeArry'])
    },  
    onShow(){},
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
        },
        datalist(news,olds){
            var self = this;
            if(this.datalist.length>4){
                this.height = 400+'rpx';  
            }else{
                this.height = 'auto';
            }
        }       
    },  
    created(){
    },
    methods: { 
        ...mapActions(['setStatusCourseChoose','setVideoDateEven','setLessonListNums','sethandOperation','sethandOperationIsEnd']),
        // moneyDegial(){
        //     this.$emit('priceDialog',{type:true})
        // },
        //判断当前设备类型是安卓还是ios;ios不能进行购买        
        goSection(data,index){
            if(this.dataInfo.isVip!=1&&data.isTry!=1&&this.dataInfo.isBuy!=1&&this.dataInfo.timeLimitType!=0&&this.dataInfo.isFree!=1){                
                    this.$emit('priceDialog',{type:true});                                                            
            }else{
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
            }
        },
        setheightEven(){
            if(this.heightType){
                this.heightType = false;
                this.height = 400+'rpx'; 
            }else{
                this.heightType = true;
                this.height = 'auto';
            }
        },
        setVideoTimeToStort(periodId,indexPrId){
            //取出存储的路径播放数组；
            var self= this;
            //获取数据存储的最后值；
            var videoArry = this.videoData.studyPoint;
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
            self.sethandOperation(true);
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
// .paddingOne{
//     padding:0 29rpx 110rpx; 
// }
// .paddingTwo{
//     padding:0 29rpx 30rpx; 
// }
.paddingOne{
    padding:30rpx; 
    margin-top: 20rpx;
}
.list-pluge{
    display: flex;
    flex-direction: column;
    background: #fff;
    // max-height:calc(100% -  680rpx);
    // overflow-y: auto;
    .catalogList{
        font-size:40rpx;
        font-weight:800;
        position: relative;
        view{
            height: 40rpx;
            line-height: 40rpx;
            padding: 0 30rpx;
            font-size: 36rpx;
            color: #333;
            font-weight: 500;            
        }
    }
    .catalogList:before{
            content:'';
            height: 40rpx;
            width: 8rpx;
            bottom: 0;
            left: 10rpx;                
            display: block;   
            position: absolute;
            background: #C30D23;
    }    
    .transtionCssBox{
        overflow:hidden;
        transition: all 0.3s linear 0;     
        .list-css{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 2;
            // overflow: hidden;            
            align-items: center;
            height: 100rpx;
            // background: #F2F2F2;
            // margin-top: 20rpx;
            padding: 0 10rpx 0 20rpx;
            border-radius: 6rpx;
            .list-text{
                // overflow:hidden; //超出一行文字自动隐藏
                // text-overflow:ellipsis;//文字隐藏后添加省略号
                // white-space:nowrap;     
                // padding-left: 80rpx;
                // text-indent: -80rpx;
                // display: -webkit-box;
                // -webkit-box-orient: vertical;
                // -webkit-line-clamp: 2;
                // overflow: hidden;                        
                // width: 500rpx;
                // font-size: 28rpx;
                // color: #1A1A1AFF;
                    overflow:hidden; //超出一行文字自动隐藏
                    text-overflow:ellipsis;//文字隐藏后添加省略号
                    white-space:nowrap;            
                    max-width: 540rpx;
                    font-size: 28rpx;
                    color: #1A1A1AFF;                
            }
            .list-but1{
                // text-align: center;
                // line-height: 50rpx;
                // color: #fff;
                // background: #c52d3b;
                // font-size: 36rpx;
                width: 80rpx;
                height: 50rpx;
                // font-size: 24rpx;
                // border-radius: 30rpx;
                // width: 80rpx;
                // height: 50rpx;
                image{
                    display: block;
                    width: 50rpx;
                    height: 50rpx;
                    margin: auto;
                }                
                // font-size: 28rpx;
                // border-radius: 12rpx;
            }
            .list-but3{
                font-size: 36rpx;
                width: 80rpx;
                height: 50rpx;
                image{
                    display: block;
                    width: 44rpx;
                    height: 44rpx;
                    margin: auto;
                }
            }        
            .list-but2{
                background: url('../../static/courseDetail/playing.gif') no-repeat;
                // background-size: cover;
                background-size:100% 100%;  
                width: 80rpx;
                height: 50rpx;
            }        
        }
    }
    .listBut{
        width: 100%;
        .butBox{
            width: 240rpx;
            height: 56rpx;
            margin:20rpx auto 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-radius: 56rpx;
            background: #E5E5E5;
            .titles{
                color: #333333;
                font-size: 26rpx;
                line-height: 56rpx;
                margin:0 10rpx;
            }
            image{
                width: 26rpx;
                height: 26rpx;
            }
        }
    }
}
</style>
<style>
</style>