<template>
	<view class="information-container">
		<text class="name">{{dataInfo.name}}</text>
        <view class="box">
            <swiper class="swiper-container" vertical circular autoplay>
                <block v-for="(item,index) in dataInfo.ahprrList" :key="index">
                    <swiper-item>
                        <text class="title">{{item.title}}</text>
                    </swiper-item>
                </block>
        </swiper>
        </view>
        <text class="more">更多></text>
	</view>
</template>  

<script>
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

		},
		computed:{
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.information-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        .name{
            color:#C30D23;
            font-size: 28rpx;
            line-height: 1;
            min-width: 32rpx;
            height: 36rpx;
            line-height: .2rpx;
            border-right: 6rpx solid #C30D23;
            padding-right: 20rpx;
            font-family: 'PingFangSC-Medium';
        }
        .box{
            flex: 1;
            padding: 0 20rpx;
            height: 40rpx;
            overflow: hidden;
            .swiper-container{
                height: 80rpx;
                line-height: 40rpx;
            }
        }
        .more{
            font-size: 28rpx;
            color:#333;
            margin-left: 10rpx;
        }
    }
</style>
