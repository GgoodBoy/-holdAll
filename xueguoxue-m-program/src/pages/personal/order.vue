<template>
    <view class="order-page">
        <List :loading="loading" :text="'没有更多数据了~'" :finished="finished" :height="height" :className="'list'" @load="getList">
            <view class="item" v-for="(item,index) in list" :key="index" @tap="goCourse(item)">
                <view class="option">
                    <view class="title">{{item.commodityTitle}}</view>
                    <view class="price">{{Number(item.assembleType)>0?'拼团':''}}{{item.commodityPrice?item.commodityPrice.toFixed(2):''}}币</view>
                </view>
                <view class="option">
                    <view class="date">{{item.createdAt}}</view>
                    <view>
                        <view class="coupon" v-if="item.couponsPrice!='0.00'">优惠券{{item.couponsPrice}}</view>
                        <view class="jifen" v-if="item.integralDeDuctionPrice>0">积分抵扣：{{item.integralDeDuctionPrice}}.00</view>
                        <view class="limit" v-if="Number(item.reducePrice)>0">减价：{{item.reducePrice}}元</view>
                        <view class="limit" v-if="Number(item.timeLimitDiscount)>0">折扣：{{item.timeLimitDiscount}}折</view>
                    </view>
                </view>
                <view class="option">
                    <view class="order">订单号：{{item.orderId}}</view>
                    <view class="bi">
                        <span v-if="item.paymentType==1">夫子币</span>
                        <span v-else-if="item.paymentType==2">微信</span>
                        <span v-else-if="item.paymentType==3">支付宝</span>
                        <span v-else-if="item.paymentType==4">App Store</span>
                        <span v-else-if="item.paymentType==5">微信内</span>
                        <span v-else-if="item.paymentType==6">华为</span>
                        <span v-else-if="item.paymentType==7">OPPO</span>
                        <span v-else-if="item.paymentType==8">VIVO</span>
                        <span v-else-if="item.paymentType==9">小米</span>
                        :{{item.payPrice&&item.payPrice>0?item.payPrice.toFixed(2):0}}</view>
                </view>
            </view>
        </List>
    </view>    
</template>
<script>
import List from '../../wxcomponents/MyList'
export default {
    data(){
        return {
            list:[],
            height:'auto',
            loading:false,
            finished:false,
            currentPage:1,
            pageSize:10,
            userId:1389
        }
    },
    created(){
        this.getList()
    },
    mounted(){
        const query = wx.createSelectorQuery()
        query.select('.component').boundingClientRect(res=>{
            if(res){
                this.height = res.height - 10;
            }
        }).exec()
    },
    components:{List},
    methods:{
        getList(){
            // this.currentPage = 1;
            // this.list = [ ]
            // this.finished = false;
            if(this.loading) return;
            this.loading = true;
            let query = {
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                userId:this.userId
            }
            this.$http.post(this.$server.getWechatCourseOrderList,query).then(res=>{
                this.loading = false;
                if(res.data.status==200){
                    this.list = [...this.list,...res.data.content.list];
                    this.currentPage++;
                    this.finished = res.data.content.isLastPage;
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        goCourse(obj){
            uni.navigateTo({
                url: `/pages/courseDetail/index?id=${obj.commodityId}`
            });
        }
    }
}
</script>
<style lang="scss">
    .order-page{
        padding:20rpx 30rpx;
        background: #f4f4f4;
        .item{
            background: #fff;
            padding: 20rpx 30rpx;
            border-radius: 12rpx;
            margin-bottom:40rpx;
            .option{
                min-height: 34rpx;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-bottom:10rpx;
                .title{
                    font-size: 30rpx;
                    color:#333333;
                    font-weight: 500;
                    width:70%;
                }
                .price{
                    font-size: 28rpx;
                    color:#C30D23;
                    text-align: right;
                }
                .coupon,.jifen{
                    font-size: 22rpx;
                    color:#999;
                    text-align: right;
                }
                .date{
                    font-size: 24rpx;
                    color:#999;
                }
                .limit{
                    font-size: 22rpx;
                    color:#999;
                    text-align: right;
                }
                .order{
                    font-size: 22rpx;
                    color:#666;
                }
                .bi{
                    font-size: 22rpx;
                    color:#999;
                    text-align: right;
                }
            }
        }
    }
</style>