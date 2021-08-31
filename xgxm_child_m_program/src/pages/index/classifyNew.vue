<template>
	<view class="classify-container">
		<!-- <block v-for="(item,index) in dataInfo.ahprrList" :key="index">
            <view class="classify-item" @tap="goPage(item)">
                <image class="icon" :src="item.imgUrl" webp lazy-load></image>
                <view class="name">{{item.title}}</view>
            </view>
        </block> -->
        <view class="scroll_box"> 
            <scroll-view scroll-x>
                <view class="item_list" v-for="(item,index) in dataInfo.ahprrList" :key="index" @tap="goPage(item)">
                    <view class="bagColor0" v-if="((index+1)%5)==1">{{item.title}}</view>
                    <view class="bagColor1" v-if="((index+1)%5)==2">{{item.title}}</view>
                    <view class="bagColor2" v-if="((index+1)%5)==3">{{item.title}}</view>
                    <view class="bagColor3" v-if="((index+1)%5)==4">{{item.title}}</view>
                    <view class="bagColor4" v-if="((index+1)%5)==0">{{item.title}}</view>
                </view>
            </scroll-view>
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
                uni.navigateTo({
                    url: `/pages/classify/index?targetId=${obj.targetId}&titleName=${obj.title}`
                });
            }
		}
	}
</script>

<style lang="scss">
	.classify-container{
        // background: #fff;
        display: flex;
        flex-wrap:wrap;
        padding: 40rpx 0 24rpx;
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
                line-height: 40rpx;
                margin-top:12rpx;
                font-family: 'PingFangSC-Medium';
            }
        }
    }
</style>
<style>
.scroll_box{
    width: 100%;
    margin: 0 auto;
    height: 70rpx;
    overflow: hidden;
    /* background: #fff; */
    white-space: nowrap;
    /* background: rgba(0,0,0,0.1); */
}
.scroll_box scroll-view{
    height: 100%;
    width: auto;
    overflow:hidden;
}
.item_list{
    /* width: 20%; */
    /* padding: 0 20rpx; */
    height: 100%;
    text-align: center;
    line-height: 70rpx;
    margin-left: 30rpx;
    display: inline-block;
    color:#fff;
    border-radius: 70rpx;
    overflow: hidden;
    font-size: 28rpx;
}
.item_list view{
    padding: 0 20rpx;
}
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
.bagColor0{
    background-image: linear-gradient(to right, #E054C5,#F376AE);
}
.bagColor1{
    background-image: linear-gradient(to right,#A961F4,#CE80FE);
}
.bagColor2{
    background-image: linear-gradient(to right,#6971EB,#7FA5FF);
}
.bagColor3{
    background-image: linear-gradient(to right,#33CECF,#23E2C7);
}
.bagColor4{
    background-image: linear-gradient(to right,#42CE88,#57F4AD);
}
</style>

