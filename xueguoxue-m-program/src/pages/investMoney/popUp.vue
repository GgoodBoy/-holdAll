<template>
    <view class="pp-pluge"> 
        <view class="pp-content">
             <view class="closeCss" @click="closeEven">
                 <image :src="closesImg" />
             </view>
            <radio-group @change="radioChange">
                <view class="pp-radio-list" v-for="(item, index) in itemsCouponList" :key="item.value">
                    <view>
                        <radio :value="item.id" :checked="index === selectRadioId" />
                    </view>
                    <view>{{item.couponsTitle}}</view>
                </view>
            </radio-group> 
        </view>
    </view>
</template>

<script>
import closesImg from '../../static/courseDetail/close.png'
export default {
    data() {
        return {
            // current:0,
            closesImg:closesImg
        }
    },
    created(){
    },
    props:['itemsCouponList','selectRadioId'],
    onReady: function (res) {
    },
    watch:{
    },       
    methods: {
        closeEven(){
            this.$emit('closePages');
        },
        radioChange(data){
            var extdata = '';
            if(this.itemsCouponList){
                this.itemsCouponList.forEach(element => {
                    if(data.detail.value==element.id){
                        extdata = {
                            value:element.id,
                            lable:element.couponsTitle,
                            reducedPrice:element.reducedPrice,
                            bul:false
                        };
                    }
                });
            }
            this.$emit('setCouponVals',{data:extdata});
        },
     }
}
</script>
<style lang="scss">
.pp-pluge{
    position:fixed;
    z-index: 99999;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .pp-content{
        position: relative;
        min-height: 80rpx;
        width: 590rpx;
        border-radius: 6px;
        background: #fff;
        display: flex;
        flex-direction: column;
        padding: 20rpx;
        .closeCss{
            position: absolute;
            right: 0rpx;
            top: -55rpx;
            width: 50rpx;
            height: 50rpx;
            image{
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .pp-radio-list{
            display: flex;
            flex-direction: row;
            // justify-content: start;  
            align-items: center;
            height: 60rpx;
            font-size: 36rpx;
            padding: 16rpx 10px;
            color: #333333FF;
            view:nth-child(2){
                margin-left: 30rpx;
            }
        }
    }
}
</style>
<style>
</style>