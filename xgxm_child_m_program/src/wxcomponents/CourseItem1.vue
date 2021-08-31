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
            <!-- <view class="course-surface" :style="{background:`url(${courseData.imgUrl}) 50% 50%/cover`}"></view> -->
        </view>
        <view class="info">
            <view class="title textEllipsis">{{courseData.title}}</view>
            <view class="m">
                <!-- <view class="teacher-icon"></view> -->
                <image class="teacher-icon" :src="teacherIcon"></image>
                <view class="teacher-name textEllipsis">{{courseData.lectureTeacherList[0].name}}</view>
                <view class="more">等</view>
                <view class="period-num">{{courseData.planPeriodNum}}讲</view>
            </view>
            <view class="origin" v-if="courseData.courseLimitedTimeSellingPrice">
                <text class="price">{{courseData.courseSellingPrice?courseData.courseSellingPrice+'币':courseData.sellingPrice?courseData.sellingPrice+'币':'0币'}}</text>
            </view>
            <view class="b">
                <view class="study">{{courseData.courseBrowsCount>10000?(courseData.courseBrowsCount/10000).toFixed(1)+'W':courseData.courseBrowsCount}}人学习</view>
                <view class="price 0" v-if="courseData.isVip&&courseData.isVip==1">VIP</view>
                <view class="price 1" v-else-if="courseData.courseLimitedTimeSellingPrice">{{courseData.courseLimitedTimeSellingPrice||0}}币</view>
                <view class="price 2" v-else-if="courseData.timeLimitedDiscountType==0||courseData.timeLimitType==0">0币</view>
                <view class="price 3" v-else>{{courseData.courseIsFree||courseData.isFree>0?'免费':courseData.courseSellingPrice?courseData.courseSellingPrice+'币':courseData.sellingPrice?courseData.sellingPrice+'币':'0币'}}</view>
            </view>
        </view>
    </view>
</template>
<script>
import teacherIcon from '../static/teacher-icon.png'
export default {
    data(){
        return{
            teacherIcon:teacherIcon
        }
    },
    props:['courseData','type'],
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
           width: 306rpx;
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
            }
            .m{
                font-size: 0;
                margin-top:4rpx;
                .teacher-icon{
                    display: inline-block;
                    vertical-align: middle;
                    width: 30rpx;
                    height: 30rpx;
                }
                .teacher-name{
                    font-size: 26rpx;
                    line-height: 1;
                    display: inline-block;
                    vertical-align: middle;
                    max-width: 55%;
                    margin:0 6rpx 0 20rpx;
                }
                .more{
                    font-size: 26rpx;
                    line-height: 1;
                    display: inline-block;
                    vertical-align: middle;
                }
                .period-num{
                    font-size: 26rpx;
                    line-height: 30rpx;
                    float: right;
                }
            }
            .origin{
                display: flex;
                flex-direction:row-reverse;
                margin-top:10rpx;
                .price{
                    color:#666;
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
                font-size: 26rpx;
                padding: 0 0 0 20rpx;
                width:calc(100% - 20rpx);
                .study{
                    color:#666;
                }
                .price{
                    color:#C30D23;
                    font-weight: bold;
                }
            }
        }
    }
</style>