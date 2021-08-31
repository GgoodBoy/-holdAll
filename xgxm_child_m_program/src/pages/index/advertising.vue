<template>
	<view class="advertising-container">
        <view class="top" v-if="dataInfo.name.length>0">
            <text class="name" >{{dataInfo.name}}</text>
        </view> 		
		<view class="advertising-box" v-for="(item,index) in dataInfo.ahprrList" :key="index">
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
        margin:40rpx 0;
        .top{
            position: relative;
			margin: 0 0 32rpx 0;
            .name{
                display: block;
                font-size: 48rpx;
                line-height: 48rpx;
                padding: 0 20rpx;
                margin-top: 20rpx;
				font-weight: 700;
				color: #333;
				font-family: 'PingFangSC-Medium';
            }
        }
        .top:before{
                content:'';
                height: 56rpx;
                width: 56rpx;
                bottom: 6rpx;
                left: 16rpx;         
                border-radius: 50%;       
                display: block;   
                position: absolute;
                background: rgba(199, 14, 35, 0.2);
        } 
        .advertising-box{
            border-radius: 120rpx;
            overflow: hidden;
            margin-bottom: 20rpx;
            height: 120rpx;
            &:last-child{
                margin-bottom: 0;
            }
            .advertising-img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
