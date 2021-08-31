<template>
	<view class="completeover-page">
        <view class="box">
            <image class="img" mode="aspectFit" :src="flag=='success'?paySuccess:payFail" lazy-load/>
            <view class="text"><text>{{flag=='success'?'支付成功！':'支付失败！'}}</text></view>
            <view class="return" @tap="returnCourse">{{flag=='success'?'确定':'返回'}}</view>
        </view>
	</view>
</template>  

<script>
    import paySuccess from '../../static/pay_success.png'
    import payFail from '../../static/pay_fail.png'
	import {mapState,mapActions} from 'vuex'
	export default {
		data() {
			return {
                courseId:'',
                flag:'',//成功or失败
                paySuccess:paySuccess,
                payFail:payFail,
                lowerVersion:false
			}
		},
		onLoad(option){
            this.courseId = option.id; 
            this.flag = option.flag         
		},		
		created(){
		},
		mounted(){
		},
		onShow(){
            var self=this;
            this.lowerVersion = app.globalData.lowerVersion;
            if(this.lowerVersion){
                var moneyReturn  = wx.getStorageSync('moneyFirstType');
                if(moneyReturn.type){
                    wx.removeStorageSync('moneyFirstType');
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }else{
                    wx.setStorageSync('moneyFirstType',{type:true,id:self.courseId});
                }
            }
        },
        onHide(){
        },
        onUnload(){
        }, 		
		components:{
		},
		computed:{
			
		},
		methods: {
            returnCourse(){
                wx.redirectTo({
                    url: `/pages/courseDetail/index?id=${this.courseId}`
                })     
            }
		}
	}
</script>

<style lang="scss">
.completeover-page{
    background: #fff;
    position: relative;   
    height: 100vh;
    padding-top:188rpx;
    box-sizing: border-box;
    .box{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        font-size: 0;
        .img{
            width: 219rpx;
            height: 139rpx;
        }
        .text{
            color:#666666;
            margin:46rpx 0 64rpx 0;
            font-size: 46rpx;
            height: 44rpx;
            text{
                line-height: 44rpx;
                padding-left: 20rpx;
                display: block;
            }
        }
        .return{
            width: 270rpx;
            height: 88rpx;
            line-height: 88rpx;
            border-radius: 44rpx;
            text-align: center;
            font-size: 36rpx;
            color:#fff;
            background:linear-gradient(-90deg,rgba(236,52,74,1) 0%,rgba(195,14,35,1) 100%);
        }
    }
}
</style>
