<template>
	<view class="swiper">
		<swiper indicator-dots autoplay indicator-color="#fff" indicator-active-color="#c30d23" circular class="swiper-container" :class="{'style1':dataInfo.style==1,'style2':dataInfo.style==2}">
			<block v-for="(item,index) in dataInfo.ahprrList" :key="index">
				<swiper-item>
					<view class="banner-item" @tap="goPage(item)">
						<image webp lazy-load class="banner-img" :src="item.imgUrl"></image>
						<!-- <view class="banner-img" :style="{background:`url(${item.imgUrl}) 50% 50%/cover`}"></view> -->
					</view>
				</swiper-item>
			</block>
      </swiper>
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
			imageError(e,obj){
				console.log(e)
				console.log(obj)
				console.log('图片加载失败')
			},
			imageLoad(){
				console.log('加载完了')
			},
			goPage(obj){
				switch(true){
					case obj.type==1:
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
						break;
					case obj.type==2:
						break;	
					case obj.type==3:
						uni.navigateTo({
							url: `/pages/webView/index?url=${obj.targetId}`
						});
						break;
					case obj.type==4:
						break;		
				}
			}
		}
	}
</script>

<style lang="scss">
	.swiper{
		padding: 20rpx 0;
		background: #fff;
	}
	.swiper-container{
		&.style1{
			height: 266rpx;
			.banner-img{
				height: 266rpx;
			}
		}
		&.style2{
			height: 326rpx;
			.banner-img{
				height: 326rpx;
			}
		}
		.banner-item{
			width: 100%;
		}
		.banner-img{
			width: 690rpx;
			margin:0 30rpx;
			border-radius: 12rpx;
			overflow: hidden;
		}
	}
</style>
