<template>
    <view class="course-item" @tap="goCourse">
        <view class="left">
            <block v-if="type&&type=='limit'">
                <view class="tag limit" :class="[`limit${courseData.timeLimitedDiscountType>=-1?courseData.timeLimitedDiscountType+1:courseData.timeLimitType+1}`]">
                    <text v-if="courseData.timeLimitedDiscountType==-1||courseData.timeLimitType==-1">已结束</text>
                    <text v-else-if="courseData.timeLimitedDiscountType==0||courseData.timeLimitType==0">限时免费</text>
                    <text v-else-if="courseData.timeLimitedDiscountType==1||courseData.timeLimitType==1">限时折扣</text>
                    <text v-else>限时秒杀</text>
                </view>
            </block>
            <block v-else>
                <view class="tag" v-if="courseData.upType>0" :class="[`type${courseData.upType}`]">{{courseData.upType==1?'上新':'更新'}}</view>
            </block>
            <view class="label"></view>
            <image class="course-surface" :src="courseData.imgUrl" webp lazy-load></image>
        </view>
        <view class="info">
            <view class="title textEllipsis2">{{courseData.title}}</view>
            <view class="m">
                <image class="teacher-icon" :src="teacherIcon"></image>
                <view class="teacher-name textEllipsis">{{courseData.lectureTeacherList[0].name}}</view>
                <view class="more">等</view>
                <view class="period-num">/{{courseData.planPeriodNum}}讲</view>
            </view>
            <view class="origin" v-if="courseData.courseLimitedTimeSellingPrice">
                <text class="price">{{courseData.courseSellingPrice?courseData.courseSellingPrice+'币':courseData.sellingPrice?courseData.sellingPrice+'币':''}}</text>
            </view>
            <view class="b">
                <view class="study">{{courseData.courseBrowsCount>10000?(courseData.courseBrowsCount/10000).toFixed(1)+'W':courseData.courseBrowsCount}}人学习</view>
                <view v-if="!typeMoney">
                    <view class="price 0" v-if="courseData.isVip&&courseData.isVip==1">VIP</view>
                    <view class="price 1" v-else-if="courseData.courseLimitedTimeSellingPrice&&courseData.timeLimitedDiscountType!=-1&&courseData.timeLimitType!=-1">{{courseData.courseLimitedTimeSellingPrice+'币'}}</view>
                    <view class="price 2" v-else-if="courseData.timeLimitedDiscountType==0||courseData.timeLimitType==0">0币</view>
                    <view class="price 3" v-else>{{(courseData.courseIsFree||courseData.isFree>0)?'免费':courseData.courseSellingPrice?courseData.courseSellingPrice+'币':courseData.sellingPrice+'币'}}</view>
                </view>
                <view class="price 4" v-else>低至{{moneyDatas}}币</view>
            </view>
        </view>
    </view>
</template>
<script>
import teacherIcon from '../static/teacher-icon.png'
export default {
    data(){
        return{
            teacherIcon:teacherIcon,
            typeMoney:false,
            moneyDatas:0
        }
    },
    props:['courseData','type'],
    watch:{
        courseData:{
            handler(newVal, oldVal){
                //获取可加入拼团列表
                if(newVal.xgxwChannel&&(Number(newVal.sellingPriceSevenDays)>0||Number(newVal.sellingPriceThirtyDays)>0)){
                    this.typeMoney = true;
                    this.moneyDatas = Number(newVal.sellingPriceSevenDays)||Number(newVal.sellingPriceThirtyDays);
                }else{
                    this.typeMoney = false;
                }
                console.log('this.typeMoney', this.typeMoney);
            },        
            immediate:true,    
            deep:true
        }        
    },
    methods:{
        goCourse(){
            let userInfo = wx.getStorageSync('userInfo')
            if(userInfo){
                if(this.courseData.targetId){
                    uni.navigateTo({
                        url: `/pages/courseDetail/index?id=${this.courseData.targetId}`
                    });
                }else{
                    uni.navigateTo({
                        url: `/pages/courseDetail/index?id=${this.courseData.id}`
                    });
                }
            }else{
                if(this.courseData.targetId){
                    uni.navigateTo({
                        url: `/pages/auth/index?id=${this.courseData.targetId}`
                    });
                }else{
                    uni.navigateTo({
                        url: `/pages/auth/index?id=${this.courseData.id}`
                    });
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .course-item{
        display: flex;
        background: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        .left{
           width: 308rpx;
           height: 172rpx;
           border-radius: 12rpx 0 0 12rpx;
           position: relative;
           overflow: hidden;
            .course-surface{
               width: 100%;
               height: 100%;
               display: block;
            }
            .tag{
                position: absolute;
                top:0;
                left: 0;
                width: 106rpx;
                height: 32rpx;
                text-align: center;
                line-height: 32rpx;
                border-radius: 10rpx 0 10rpx 0;
                color:#fff;
                font-size: 20rpx;
                opacity: 0.85;
                &.limit{
                    width: 104rpx;
                }
                &.limit0{
                    background-image: linear-gradient(#939393, #6a6a6a);
                }
                &.limit1{
                    background-image: linear-gradient(#E13F4F, #91171E);
                }
                &.limit2{
                    background-image: linear-gradient(#43e9f9, #0495b2);
                }
                &.limit3{
                    background-image: linear-gradient(#fead3c, #fb5a1c);
                }
                &.type1{
                    width:52rpx;
                    background-image: linear-gradient(#E13F4F, #91171E);
                }
                &.type2{
                    width:52rpx;
                    background-image: linear-gradient(#FFB142, #FC561E);
                }
            }
        } 
        .info{
            flex: 1;
            overflow: hidden;
            padding: 0 0 0 20rpx;
            position: relative;
            background: #fff;
            .title{
                font-size: 30rpx;
                line-height: 48rpx;
                color:#333;
                font-weight: 500;
                font-family: 'PingFangSC-Medium';
            }
            .m{
                font-size: 0;
                margin-top:4rpx;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                .teacher-icon{
                    // display: inline-block;
                    display:block;
                    // vertical-align: middle;
                    width: 30rpx;
                    height: 30rpx;
                }
                .teacher-name{
                    font-size: 24rpx;
                    line-height: 1;
                    display: inline-block;
                    vertical-align: middle;
                    max-width: 55%;
                    margin:0 6rpx 0 20rpx;
                    color: #999;
                }
                .more{
                    font-size: 24rpx;
                    line-height: 1;
                    display: inline-block;
                    vertical-align: middle;
                    color: #999;
                }
                .period-num{
                    font-size: 24rpx;
                    line-height: 30rpx;
                    color: #999;
                    padding: 0 6rpx;
                }
            }
            .origin{
                display: flex;
                flex-direction:row-reverse;
                position: absolute;
                bottom: 24rpx;
                right: 0;
                .price{
                    color:#999;
                    font-size: 24rpx;
                    text-decoration: line-through;
                }
            }
            .b{
                line-height: 48rpx;
                position: absolute;
                left: 0;
                bottom: 0;
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                align-items: flex-end;
                padding: 0 0 0 20rpx;
                width:calc(100% - 20rpx);
                .study{
                    color:#999;
                    font-size: 22rpx;
                    line-height: 22rpx;
                }
                .price{
                    color:#C30D23;
                    font-weight: bold;
                    font-size: 28rpx;
                    line-height: 28rpx;
                }
            }
        }
    }
</style>