<template>
    <view class="header" v-if="!lowerVersion">
        <view class="status-bar" :style="{height:statusBarHeight+'px'}"></view>
        <view class="title">
            <view class="return-icon" @tap="returnPage">
                <view class="img"></view>
            </view>
            <text>{{title}}</text>
        </view>
    </view>
</template>
<script>
const app = getApp()
export default {
    data(){
        return{
            statusBarHeight:20,
            lowerVersion:false
        }
    },
    props:['title'],
    created(){
        this.statusBarHeight = app.globalData.statusBarHeight;
        this.lowerVersion = app.globalData.lowerVersion;
    },
    methods:{
        returnPage(){
            wx.navigateBack({
                delta: 1
            })
        }
    }
}
</script>
<style lang="scss">
    .header{
        width: 100%;
        background: #fff;
        position: fixed;
        top:0;
        left: 0;
        z-index: 999;
        .title{
            height: 44px;
            line-height: 44px;
            text-align: center;
            font-size: 36rpx;
            color:#333;
            font-weight:500;
            position: relative;
        }
        .return-icon{
            position: absolute;
            left: 0;
            top: 50%;
            padding: 20rpx;
            transform: translateY(-50%);
            .img{
                height: 36rpx;
                width: 36rpx;
                display: block;
                // background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/mp/return.png')no-repeat 50% 50% /cover;
                 background: url('../static/return.png')no-repeat 50% 50% /cover;
            }
        }
    }
</style>