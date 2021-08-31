<template>
	<view class="advertising-container">
        <text class="name" v-if="dataInfo.name.length>0">{{dataInfo.name}}</text>
		<view class="advertising-box" :class="{'style1':dataInfo.style==1,'style2':dataInfo.style==2}" v-for="(item,index) in dataInfo.ahprrList" :key="index">
            <!-- <view class="advertising-img" :style="{background:`url(${item.imgUrl}) 50% 50%/cover`}" @tap="goPage(item)"></view> -->
			<image class="advertising-img" :src="item.imgUrl" webp lazy-load @tap="goPage(item)"></image>
        </view>
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
	.advertising-container{
        padding: 0 30rpx;
        margin-top: 50rpx;
        .name{
            display: block;
            font-size: 36rpx;
            line-height: 32rpx;
            height: 36rpx;
            padding: 0 20rpx;
            border-left:6rpx solid #C30D23;
            margin-bottom: 30rpx;
            font-family: 'PingFangSC-Medium';
        }
        .advertising-box{
            border-radius: 12rpx;
            overflow: hidden;
            margin-bottom: 20rpx;
            &:last-child{
                margin-bottom: 0;
            }
            &.style1{
                height: 120rpx;
            }
            &.style2{
                height: 200rpx;
            }
            .advertising-img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
