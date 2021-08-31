<template>
	<view class="classify-container">
		<block v-for="(item,index) in dataInfo.ahprrList" :key="index">
            <view class="classify-item" @tap="goPage(item)">
                <image class="icon" :src="item.imgUrl" webp lazy-load></image>
                <!-- <view class="icon" :style="{background:`url(${item.imgUrl}) 50% 50%/cover`}"></view> -->
                <view class="name">{{item.title}}</view>
            </view>
        </block>
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
			goPage(obj){
                uni.navigateTo({
                    url: `/pages/classify/index?targetId=${obj.targetId}`
                });
            }
		}
	}
</script>

<style lang="scss">
	.classify-container{
        margin:24rpx 0;
        background: #fff;
        display: flex;
        flex-wrap:wrap;
        padding: 0 0 24rpx 0;
        .classify-item{
            text-align: center;
            flex: 0 0 25%;
            margin:24rpx 0 0 0;
            .icon{
                width: 96rpx;
                height: 96rpx;
                display: inline-block;
            }
            .name{
                font-size: 28rpx;
                color:#333;
                line-height: 32rpx;
                height: 36rpx;
                margin-top:12rpx;
                font-family: 'PingFangSC-Medium';
            }
        }
    }
</style>
