<template>
    <view class="skeleton" :style="{paddingTop:lowerVersion?'44px':paddingTop+'px'}">
        <view class="swiper">
            <view class="item"></view>
        </view>
        <view class="classify">
            <view class="item" v-for="(item,index) in 4" :key="index">
                <view class="icon"></view>
                <view class="title"></view>
            </view>
        </view>
        <view class="advertising">
            <view class="item">
                <view class="title"></view>
                <view class="img"></view>
            </view>
        </view>
        <view class="column-course">
            <view class="item">
                <view class="title"></view>
                <view class="img"></view>
            </view>
        </view>
        <view class="common">
            <view class="title"></view>
            <view class="item" v-for="(item,index) in 2" :key="index">
                <view class="top"></view>
                <view class="bottom">
                    <view class="name"></view>
                    <view class="intro">
                        <view class="box1"></view>
                        <view class="box2"></view>
                        <view class="box3"></view>
                    </view>
                    <view class="b">
                        <view class="box1"></view>
                        <view class="box2"></view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
const app = getApp()
export default {
    data(){
        return{
            paddingTop:64,
            lowerVersion:false
        }
    },
    created(){
        this.paddingTop = app.globalData.statusBarHeight+44;
        this.lowerVersion = app.globalData.lowerVersion;
    }
}
</script>
<style lang="scss" scoped>
    .skeleton{
        background: #f4f4f4;
        position: fixed;
        z-index: 999;
        top:0;
        left:0;
        width: 100vw;
        height: 100vh;
        padding-top:64px;
        .swiper{
            background: #fff;
            padding:30rpx;
            .item{
                height: 266rpx;
                border-radius: 12rpx;
                background: #d8d8d8;
            }
        }
        .classify{
            margin:24rpx 0;
            background: #fff;
            display: flex;
            flex-wrap:wrap;
            padding: 0 0 24rpx 0;
            .item{
                text-align: center;
                flex: 0 0 25%;
                margin:24rpx 0 0 0;
                .icon{
                    width: 96rpx;
                    height: 96rpx;
                    display: inline-block;
                    background:#d8d8d8;
                    border-radius:6rpx ;
                }
                .title{
                    display: inline-block;
                    height: 28rpx;
                    margin-top:12rpx;
                    background: #d8d8d8;
                    border-radius:6rpx ;
                    width: 96rpx;
                }
            }
        }
        .advertising{
            padding: 0 30rpx;
            margin:40rpx 0;
            .item{
                .title{
                    width: 162rpx;
                    height: 38rpx;
                    background: #d8d8d8;
                    border-radius: 6rpx;
                    margin-left: 20rpx;
                    position: relative;
                    margin-bottom: 20rpx;
                    &::before{
                        content:'';
                        width: 6rpx;
                        height: 38rpx;
                        position: absolute;
                        display: block;
                        left: -20rpx;
                        top:0;
                        background: #d8d8d8;
                        border-radius: 6rpx;
                    }
                }
                .img{
                    height: 120rpx;
                    border-radius: 12rpx;
                    background: #d8d8d8;
                }
            }
        }
        .column-course{
            padding: 0 30rpx;
            margin:40rpx 0;
            .item{
                .title{
                    width: 162rpx;
                    height: 38rpx;
                    background: #d8d8d8;
                    border-radius: 6rpx;
                    margin-left: 20rpx;
                    position: relative;
                    margin-bottom: 20rpx;
                    &::before{
                        content:'';
                        width: 6rpx;
                        height: 38rpx;
                        position: absolute;
                        display: block;
                        left: -20rpx;
                        top:0;
                        background: #d8d8d8;
                        border-radius: 6rpx;
                    }
                }
                .img{
                    height: 260rpx;
                    border-radius: 12rpx;
                    background: #d8d8d8;
                }
            }
        }
        .common{
            padding: 0 30rpx;
            margin:40rpx 0;
            .title{
                width: 162rpx;
                height: 38rpx;
                background: #d8d8d8;
                border-radius: 6rpx;
                margin-left: 20rpx;
                position: relative;
                margin-bottom: 20rpx;
                &::before{
                    content:'';
                    width: 6rpx;
                    height: 38rpx;
                    position: absolute;
                    display: block;
                    left: -20rpx;
                    top:0;
                    background: #d8d8d8;
                    border-radius: 6rpx;
                }
            }
            .item{
                display: inline-block;
                vertical-align: top;
                width: 332rpx;
                height: 370rpx;
                margin-right: 26rpx;
                &:last-child{
                    margin-right: 0;
                }
                .top{
                    height:186rpx;
                    border-radius: 12rpx 12rpx 0 0;
                    background: #d8d8d8;
                }
                .bottom{
                    height: 170rpx;
                    box-sizing: border-box  ;
                    position: relative;
                    padding: 10rpx 20rpx;
                    background: #fff;
                    .name{
                        height: 40rpx;
                        border-radius: 6rpx;
                        background: #d8d8d8;
                    }
                    .intro{
                        display: flex;
                        justify-content: space-between;
                        margin:20rpx 0;
                        .box1{
                            background: #d8d8d8;
                            border-radius: 6rpx;
                            width: 40rpx;
                            height: 40rpx;
                        }
                        .box2{
                            width: 120rpx;
                            height: 40rpx;
                            background: #d8d8d8;
                            border-radius: 6rpx;
                        }
                        .box3{
                            width: 60rpx;
                            height: 40rpx;
                            background: #d8d8d8;
                            border-radius: 6rpx;
                        }
                    }
                    .b{
                        display: flex;
                        justify-content: space-between;
                        .box1{
                            width: 100rpx;
                            height: 40rpx;
                            background: #d8d8d8;
                            border-radius: 6rpx;
                        }
                        .box2{
                            width: 100rpx;
                            height: 40rpx;
                            background: #d8d8d8;
                            border-radius: 6rpx;
                        }
                    }
                }
            }
        }
    }
</style>