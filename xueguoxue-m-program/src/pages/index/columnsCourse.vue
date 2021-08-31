<template>
	<view class="columns-course-container">
		<view class="name" :class="[`style${dataInfo.style}`]" v-if="dataInfo.name.length>0">{{dataInfo.name}}</view>
        <block v-if="dataInfo.style==1">
            <block v-for="(item,index) in dataInfo.ahprrList" :key="index">
                <view class="box style1" @tap="goPage(item)">
                    <image class="img" :src="item.imgUrl" webp lazy-load></image>
                    <!-- <view class="img" :style="{background:`url(${item.imgUrl}) 50% 50%/cover`}"></view> -->
                    <view class="bottom">
                        <text class="study-num">{{item.courseBrowsCount}}人学习</text>
                        <text class="period-num">{{item.planPeriodNum}}讲</text>
                    </view>
                </view>
            </block> 
        </block>
        <view v-if="dataInfo.style==2" class="more-box">
            <block v-for="(item,index) in dataInfo.ahprrList" :key="index">
                <view class="box style2">
                    <view class="option">
                        <CourseItem2 :courseData="item"/>
                    </view>
                </view>
            </block> 
        </view>
	</view>
</template>  

<script>
    import CourseItem2 from '../../wxcomponents/CourseItem2.vue'
	export default {
		data() {
			return {
				
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
	.columns-course-container{
        padding: 0 30rpx;
		margin-top: 50rpx;
        .name{
            display: block;
            font-size: 36rpx;
            line-height: 32rpx;
            padding: 0 20rpx;
            border-left:6rpx solid #C30D23;
            margin-bottom: 30rpx;
            font-family: 'PingFangSC-Medium';
            height: 36rpx;
            // &.style1{
            //     margin-bottom: 20rpx;
            // }
        }
        .more-box{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .box{
            position: relative;
            border-radius: 10rpx;
            overflow: hidden;
            margin-bottom: 26rpx;
            &.style1{
                &:last-child{
                    margin:0;
                }
                .img{
                    width: 100%;
                    height: 280rpx;
                    display: block;
                }
                .bottom{
                    position: absolute;
                    bottom:0;
                    left: 0;
                    width: calc(100% - 60rpx);
                    // width: 100%;
                    height: 44rpx;
                    line-height: 44rpx;
                    font-size: 24rpx;
                    padding: 0 30rpx;
                    background: rgba(107,108,110,0.7);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color:#fff;
                }
            }
            &.style2{
                width: 332rpx;
                background: #fff;
                margin-bottom: 0;
                margin-top:20rpx;
                &:first-child,&:nth-child(2){
                    margin-top: 0;
                }
                .option{
                    width: 332rpx;
                }
            }
        }
    }
</style>
