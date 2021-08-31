<template>
    <view class="course-item" @click="goCourse">
        <view class="top">
            <block v-if="type&&type=='limit'">
                <view class="tag limit" :class="[`limit${courseData.timeLimitedDiscountType+1}`]">
                    <text v-if="courseData.timeLimitedDiscountType==-1">已结束</text>
                    <text v-else-if="courseData.timeLimitedDiscountType==0">限时免费</text>
                    <text v-else-if="courseData.timeLimitedDiscountType==1">限时折扣</text>
                    <text v-else>限时秒杀</text>
                </view>
            </block>
            <block v-else>
                <view class="tag" v-if="courseData.upType>0" :class="[`type${courseData.upType}`]">{{courseData.upType==1?'上新':'更新'}}</view>
            </block>
            <image class="course-surface" :src="courseData.imgUrl" webp lazy-load></image>
            <!-- <view class="course-surface" :style="{background:`url(${courseData.imgUrl}) 50% 50%/cover`}"></view> -->
        </view>
        <view class="bottom">
            <text class="title">{{courseData.title}}</text>
            <view class="data">
                <view class="tag" @click.stop="goClassify">{{courseData.classifyName?courseData.classifyName.substr(0,2):''}}</view>
                <view class="teacher-name textEllipsis">{{courseData.lectureTeacherList[0].name}}</view>
                <view class="study">{{(item.courseBrowsCount>9999?Math.floor((item.courseBrowsCount/10000) * 100) / 100+'W':item.courseBrowsCount)||0}}人学习</view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:['courseData','type'],
    watch:{

    },
    methods:{
        goCourse(){
            let userInfo = wx.getStorageSync('userInfo')
            if(userInfo){
                uni.navigateTo({
                    url: `/pages/courseDetail/index?id=${this.courseData.targetId}`
                });
            }else{
                uni.navigateTo({
                    url: `/pages/auth/index?id=${this.courseData.targetId}`
                });
            }
        },
        goClassify(){
            uni.navigateTo({
                url: `/pages/classify/index?targetId=${this.courseData.classifyId}`
            });
        }
    }
}
</script>
<style lang="scss">
    .course-item{
        border-radius: 12rpx;
        background: #fff;
        overflow: hidden;
        .top{
            width: 332rpx;
            height:186rpx;
            position: relative;
            .course-surface{
                height: 100%;
                width: 100%;
                display: block;
            }
            .tag{
                position: absolute;
                top:0;
                left: 0;
                width: 52rpx;
                height: 32rpx;
                text-align: center;
                line-height: 32rpx;
                border-radius: 10rpx 0 10rpx 0;
                color:#fff;
                font-size: 20rpx;
                opacity: 0.85;
                background-image: linear-gradient(#E13F4F, #91171E);
                &.limit{
                    width: 104rpx;
                }
                &.limit0{
                    background-image: linear-gradient(#939393, #6a6a6a);
                }
                &.limit2{
                    background-image: linear-gradient(#43e9f9, #0495b2);
                }
                &.limit3{
                    background-image: linear-gradient(#fead3c, #fb5a1c);
                }
                &.type1{
                    background-image: linear-gradient(#E13F4F, #91171E);
                }
                &.type2{
                    background-image: linear-gradient(#FFB142, #FC561E);
                }
            }
        }
        .bottom{
            height: 170rpx;
            box-sizing: border-box  ;
            position: relative;
            padding: 10rpx 20rpx;
            display: flex;
            align-content: space-between;
            flex-wrap:wrap;
            .title{
                font-size: 30rpx;
                line-height: 48rpx;
                color:#333;
                font-weight: 500;
                width: 100%;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .data{
                width: 100%;
                line-height: 48rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .study{
                    color:#999;
                    font-size: 24rpx;
                }
                .tag{
                    color:#C30D23;
                    font-size: 20rpx;
                    width: 60rpx;
                    line-height: 26rpx;
                    height: 30rpx;
                    margin-right: 6rpx;
                    text-align: center;
                    border-radius: 20rpx;
                    border:1px solid #C30D23;
                    box-sizing: border-box;
                }
                .teacher-name{
                    color:#666666;
                    font-size: 26rpx;
                    flex: 1;
                }

            }
        }
    }
</style>