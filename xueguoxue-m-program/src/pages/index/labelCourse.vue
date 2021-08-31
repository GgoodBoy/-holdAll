<template>
    <view class="label-course-box">
        <view class="top" :class="dataInfo.name.length==0?'reverse':''">
            <text class="name" v-if="dataInfo.name.length>0">{{dataInfo.name}}</text>
			<view class="rigthView" @tap="goList">
				<text class="more">更多</text>
				<img class='imgs' :src='allRight'/>
			</view>
        </view>
        <view class="content">
            <block v-for="(item,index) in dataInfo.ahprrList" :key="index">
                <view class="item" @tap="goCourse(item)">
                    <view class="t">
                        <image class="img" :src="item.imgUrl" webp lazy-load></image>
                        <!-- <view class="img" :style="{background:`url(${item.imgUrl}) 50% 50%/cover`}"></view> -->
                        <view class="tag" v-if="item.upType>0" :class="[`type${item.upType}`]">{{item.upType==1?'上新':'更新'}}</view>
                    </view>
                    <view class="b">
                        <view class="title">{{item.title}}</view>
                        <view class="d">
                            <text class="name">{{item.lectureTeacherList[0].name}}</text>
                            <text class="period-num">{{item.planPeriodNum}}讲</text>
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>    
</template>
<script>
import allRight from '../../static/allRight.png'
export default {
    data() {
        return {
            allRight:allRight
        }
    },
    props:['dataInfo'],
    methods:{
        goList(){
            let url = this.dataInfo.name.length>0?`/pages/courseList/index?type=5&name=${this.dataInfo.name}&targetId=${this.dataInfo.targetId}`:`/pages/courseList/index?type=5&targetId=${this.dataInfo.targetId}`;
            uni.navigateTo({
                url: url
            });
        },
        goCourse(obj){
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .label-course-box{
        padding: 0 30rpx;
		margin-top: 50rpx;
        .top{
			display: flex;
			justify-content: space-between;
			align-items: center;
            margin-bottom: 30rpx;
            &.reverse{
				flex-direction: row-reverse;
			}
			.name{
				display: block;
				font-size: 36rpx;
				line-height: 32rpx;
				height: 36rpx;
				padding: 0 20rpx;
				border-left:6rpx solid #C30D23;
                font-family: 'PingFangSC-Medium';
			}
			.rigthView{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.more{
					font-size: 26rpx;
					color:#666;
				}
				.imgs{
					width: 26rpx;
					height: 26rpx;
					display:inline-block;
				}
			}
        }
        .content{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .item{
                width: 216rpx;
                height: 366rpx;
                background: #fff;
                border-radius: 12rpx;
                overflow: hidden;
                margin-right: 20rpx;
                &:last-child{
                    margin-right: 0;
                }
                .t{
                    width: 100%;
                    height: 198rpx;
                    position: relative;
                    .img{
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                    .tag{
                        position: absolute;
                        top:0;
                        left: 0;
                        width: 52rpx;
                        height: 32rpx;
                        text-align: center;
                        line-height: 32rpx;
                        border-radius: 10rpx 0 10rpx 0;
                        color:#fff;
                        font-size: 20rpx;
                        opacity: 0.85;
                        &.type1{
                            background-image: linear-gradient(#E13F4F, #91171E);
                        }
                        &.type2{
                            background-image: linear-gradient(#FFB142, #FC561E);
                        }
                    }
                }
                .b{
                    padding: 20rpx;
                    height: 128rpx;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: space-between;
                    .title{
                        font-size: 28rpx;
                        color:#333333;
                        width: 100%;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        font-family: 'PingFangSC-Medium';
                    }
                    .d{
                        display: flex;
                        justify-content: space-between;
                        align-content: center;
                        color:#999;
                        font-size: 24rpx;
                        width: 100%;
                        .name{
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            width:65%;
                            overflow: hidden;
                        }
                    }
                }
            }
        }
    }
</style>