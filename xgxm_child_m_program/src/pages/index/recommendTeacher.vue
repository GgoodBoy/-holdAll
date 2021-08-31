<template>
	<view class="recommendTeacher">
        <view class="top" v-if="dataInfo.name.length>0">
            <text class="name" >{{dataInfo.name}}</text>
        </view>          
        <view class="scroll_box"> 
            <scroll-view scroll-x>
                <view class="item_list" v-for="(item,index) in dataInfo.ahprrList" :key="index" @tap="goPage(item)">
                    <image :src="item.imgUrl" webp lazy-load></image>
                    <view class="teacherName">{{item.title}}</view>
                </view>                
            </scroll-view>
        </view>
	</view>
</template>  

<script>
    import shareImg from '../../static/courseDetail/share.png'
	export default {
		data() {
			return {
                shareImg:shareImg,
                teacherList:[]
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
                    url: `/pages/search/index?teacherName=${obj.title}`
                });                
            }
		}
	}
</script>

<style lang="scss">
	.recommendTeacher{
        margin:24rpx 0;
        // background: rgba(0,0,0,0.1);
        display: flex;
        flex-wrap:wrap;
        padding: 0 30rpx;
        .top{
            position: relative;
            .name{
                display: block;
                font-size: 48rpx;
                line-height: 48rpx;
                // height: 48rpx;
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
        .scroll_box{
            width: 680rpx;
            margin: 0 auto;
            overflow: hidden;
            white-space: nowrap;
            padding: 20rpx 0;
            scroll-view{
                height: 100%;
                width: auto;
                overflow:hidden;
                .item_list{
                    text-align: center;
                    display: inline-block;
                    color:#333;
                    background: #fff;
                    border-radius: 6rpx;
                    padding: 18rpx 26rpx;
                    margin: 15rpx 20rpx 15rpx 6rpx;
                    box-shadow: 0px 0px 50rpx #f4f4f4;                    
                    image{
                        height: 120rpx;
                        width: 120rpx;
                        border-radius: 50%;
                    } 
                    .teacherName{
                        width: 112rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-size: 24rpx;
                        text-align: center;
                    }                   
                }                
            }            
        }        
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
            }
        }
    }
</style>
<style>
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
</style>

