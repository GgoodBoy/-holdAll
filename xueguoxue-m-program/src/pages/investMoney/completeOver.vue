<template>
	<view class="completeover-page">
            <view class="courseInfo">
                <view class="clou_list">
                   订单号：{{orderId}}
                </view>
                <view class="clou_list" v-if="Number(spellIstrue)==2">
                    减价：{{courseDataReducedPrice||0}}￥
                </view>
                <view class="clou_list" v-if="Number(spellIstrue)==2">
                    优惠券抵扣：{{reducedPrice||0}}￥
                </view>
            </view>
            <view class="routerDox">
                <view class="l_imgs">
                </view>
                <view  class="l_txt">您已成功购买课程，马上去学习吧~</view>
                <view class="l_btn">
                    <view class="but_one stys" @click="courseEven(1)">继续购课</view>
                    <view class="but_two stys" @click="courseEven(2)">查看课程</view>
                </view>
            </view>
	</view>
</template>  

<script>
	import {mapState,mapActions} from 'vuex'
	export default {
		data() {
			return {
				courseId:'',
				userinfos:'',
                orderId:'',
                reducedPrice:'',
                courseDataReducedPrice:'',
                spellIstrue:false
			}
		},
		onLoad(option){
			this.courseId = option.id;
            this.userinfos = JSON.parse(wx.getStorageSync('userInfo'));
            this.orderId=option.orderId;
            this.reducedPrice=option.reducedPrice;    
            this.courseDataReducedPrice = option.courseDataReducedPrice;  
            this.spellIstrue = option.spellIstrue;
		},		
		created(){
		},
		mounted(){
		},
		onShow(){
        },
        onHide(){
        },
        onUnload(){
        }, 		
		components:{
		},
		computed:{
			...mapState(['audioData','timeArry'])
		},
		methods: {
				courseEven(type){
                    switch (type) {
                        case 1:
                            wx.navigateTo({
                                url: '../index/index',
                            })                            
                            break;
                        case 2:
                            wx.navigateTo({
                                url: `/pages/courseDetail/index?id=${this.courseId}`
                            })                            
                            break;                    
                        default:
                            break;
                    }
                }
		}
	}
</script>

<style lang="scss">
.completeover-page{
    background: #f8f8f8;
    .courseInfo{
        height: 255rpx;
        padding: 0 30rpx;
        width: 100%;
        margin: auto;
        background: #fff;
        margin: 0 auto 20rpx auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .clou_list{
            color: #3A3A3A;
            font-size: 26rpx;  
            text-align: left;  
            align-items: left; 
            line-height: 70rpx;     
        }
    }
    .routerDox{
        height: calc(100vh - 275rpx);   
        width: 100%;
        margin: auto;      
        padding:115rpx 30rpx 0;
        background: #fff;    
        .l_imgs{
            width: 280rpx;
            height: 280rpx;
            margin: 0rpx auto 180rpx;
            background: url('../../static/courseDetail/icon_1.png') no-repeat;
            background-size: cover;
        }
        .l_txt{
            width: 460rpx;
            text-align: center;
            color: #E5E5E5;
            height: 30rpx;
            line-height: 30rpx;
            margin: 0 auto 130rpx;
            font-size: 28rpx;
        }
        .l_btn{
            width: 560rpx;
            display: flex;
            flex-direction: row;
            justify-content:space-between;
            margin: 0 auto;
            .stys{
                width: 240rpx;
                height: 88rpx;
                line-height: 88rpx;
                text-align: center;
                font-size: 32rpx;
                border-radius: 12rpx;
                font-weight: 600;
            }
            .but_one{
                border:1px solid #FF3366;
                background: #fff;
                color:#C52D3B;
            }
            .but_two{
                background: #C52D3B;
                color:#fff;
            }
        }
    }
}
</style>
