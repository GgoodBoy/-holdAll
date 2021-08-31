<template>
	<view class="custom-model-container" :class="{'style1':dataInfo.style==1,'style2':dataInfo.style==2}">
		<view class="name" v-if="dataInfo.name.length>0">{{dataInfo.name}}</view>
        <view v-if="dataInfo.style==1" class="more-box">
            <block v-for="(option,i) in dataInfo.ahprrList" :key="i">
                <view class="box1">
                    <view class="option">
                        <CourseItem2 :courseData="option"/>
                    </view>
                </view>
            </block>
        </view>
        <block v-if="dataInfo.style==2">
            <view class="box2" v-for="(item,index) in dataInfo.ahprrList" :key="index" @tap="goPage(item)">
                <view class="item">
                <view class="left">
                    <view v-if="index==0" class="icon icon1"></view>
                    <view v-if="index==1" class="icon icon2"></view>
                    <view v-if="index==2" class="icon icon3"></view>
                    <view class="tag" v-if="index>2" v-show="item.upType>0" :class="[`type${item.upType}`]">{{item.upType==1?'上新':'更新'}}</view>
                    <image :src="item.imgUrl" class="img" webp lazy-load></image>
                    <!-- <text class="type-text">{{item.courseType==1?'视频':'音频'}}</text> -->
                </view>
                <view class="right">
                    <text class="title textEllipsis">{{item.title}}</text>
                    <text class="intro textEllipsis">{{item.courseIntro}}</text>
                    <view class="teacher-info">
                        <!-- <view class="teacher-icon"></view> -->
                        <image class="teacher-icon" :src="teacherIcon"></image>
                        <text class="teacher-name textEllipsis">{{item.lectureTeacherList[0].name}}</text>
                        <text class="period-num">{{item.planPeriodNum}}讲</text>
                    </view>
                    <text class="study">{{item.courseBrowsCount}}人学习</text>
                </view>
                </view>
            </view>
        </block>
	</view>
</template>  

<script>
    import CourseItem2 from '../../wxcomponents/CourseItem2.vue'
    import teacherIcon from '../../static/teacher-icon.png'
	export default {
		data() {
			return {
                teacherIcon:teacherIcon,
			}
		},
		props:['dataInfo'],
		created(){

		},
		mounted(){

		},
		components:{
            CourseItem2
		},
		computed:{
			
		},
		methods: {
			goPage(obj){
                let userInfo = wx.getStorageSync('userInfo')
                if(userInfo){
                    uni.navigateTo({
                        url: `/pages/courseDetail/index?id=${obj.targetId}`
                    });
                }else{
                    uni.navigateTo({
                        url: `/pages/auth/index?id=${obj.targetId}`
                    });
                }
            }
		}
	}
</script>

<style lang="scss">
	.custom-model-container{
        padding: 0 30rpx;
		margin-top: 50rpx;
        &.style1{
            .name{
                margin-bottom:30rpx;
            }
        }
        &.style2{
            padding:0;
            .name{
                margin: 0 30rpx 20rpx;
            }
        }
        .name{
            display: block;
            font-size: 36rpx;
            line-height: 32rpx;
            height: 36rpx;
            padding: 0 20rpx;
            border-left:6rpx solid #C30D23;
            font-family: 'PingFangSC-Medium';
        }
        .more-box{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .box1{
            position: relative;
            border-radius: 10rpx;
            overflow: hidden;
            width: 332rpx;
            background: #fff;
            margin-top:26rpx;
            &:first-child,&:nth-child(2){
                margin-top: 0;
            }
            .option{
                width: 332rpx;
            }
        }
        .box2{
            position: relative;
            border-radius: 10rpx;
            overflow: hidden;
            display: flex;
            background: #fff;
            padding: 0 30rpx;
            .item{
                border-bottom:1px solid #f2f2f2; 
                display: flex;
                width: 100%;
                padding: 30rpx 0;
            }
            &:last-child{
                .item{
                    border-bottom:none;
                }
            }
            .left{
                width: 206rpx;
                height: 190rpx;
                position: relative;
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
                    &.type1{
                        background-image: linear-gradient(#E13F4F, #91171E);
                    }
                    &.type2{
                        background-image: linear-gradient(#FFB142, #FC561E);
                    }
                }
                .img{
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                .icon{
                    width: 56rpx;
                    height: 32rpx;
                    position: absolute;
                    top:-10rpx;
                    left: -20rpx;
                    z-index: 2;
                    &.icon1{
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/hat_1.png')no-repeat 50% 50% / cover;
                    }
                    &.icon2{
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/hat_2.png')no-repeat 50% 50% / cover;
                    }
                    &.icon3{
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/hat_3.png')no-repeat 50% 50% / cover;
                    }
                }
                .type-text{
                    font-size: 22rpx;
                    position: absolute;
                    bottom:10rpx;
                    right: 6rpx;
                    background: rgba(0,0,0,0.75);
                    color:#fff;
                    padding: 0 4rpx;
                    border-radius: 6rpx;
                }
            }
            .right{
                width: calc(100% - 236rpx);
                padding-left:20rpx;
                .title{
                    font-size: 30rpx;
                    line-height: 42rpx;
                    color:#333;
                    width: 100%;
                }
                .intro{
                    line-height: 36rpx;
                    font-size: 26rpx;
                    margin-bottom:16rpx;
                    width: 100%;
                    color:#333;
                }
                .teacher-info{
                    line-height: 20rpx;
                    margin:26rpx 0;
                }
                .teacher-icon{
                    display: inline-block;
                    vertical-align: middle;
                    width: 30rpx;
                    height: 30rpx;
                    margin-right: 20rpx;
                }
                .teacher-name{
                    font-size: 24rpx;
                    line-height: 1;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100rpx;
                    color:#999;
                }
                .period-num{
                    font-size: 24rpx;
                    line-height: 30rpx;
                    color:#999;
                }
                .study{
                    display: block;
                    color:#999;
                    font-size: 24rpx;
                    line-height: 28rpx;
                }
            }
        }
    }
</style>
