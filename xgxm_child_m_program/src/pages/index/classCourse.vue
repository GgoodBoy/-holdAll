<template>
    <view class="class-course-box">
        <view class="top" :class="{'reverse':dataInfo.name.length==0,'topBefore':dataInfo.name.length>0}">
            <text class="name" v-if="dataInfo.name.length>0">{{dataInfo.name}}</text>
            <image class="more" :src="rightIcon" @tap="goList"></image>
        </view>
        <view class="content" v-if='dataInfo.style==1'>
            <block v-for="(item,index) in courseList" :key="index">
                <view class="item" @tap="goCourse(item)">
                    <view class="t">
                        <image class="img" :src="item.imgUrl" webp lazy-load></image>
                        <view class="positionImg">
                            <image :src="videos" webp lazy-load></image>
                        </view>
                    </view>
                    <view class="b">
                        <view class="title">{{item.title}}</view>
                    </view>
                </view>
            </block>           
        </view>
        <view class="content1" v-if='dataInfo.style==2'>
            <block v-for="(item,index) in courseList" :key="index">
                <view class="item" @tap="goCourse(item)" :class="{ rightCss: (index+1)%2==0?true:false }">
                    <view class="t">
                        <image class="img" :src="item.imgUrl" webp lazy-load></image>
                        <view class="positionImg">
                            <image :src="videos" webp lazy-load></image>
                        </view>
                    </view>
                    <view class="b">
                        <view class="title">{{item.title}}</view>
                        <view class="d">
                            <image :src="eyes"></image>
                            <text class="period-num">{{item.courseBrowsCount>9999?Math.floor((item.courseBrowsCount/10000) * 100) / 100+'W':item.courseBrowsCount}}</text>
                        </view>
                    </view>
                </view>
            </block>           
        </view>        
    </view>    
</template>
<script>
import videos from '../../static/videos.png';
import eyes from '../../static/eyes.png';
import rightIcon from '../../static/investMoney/icon-1.png';
export default {
    data() {
        return {
            videos:videos,
            eyes:eyes,
            rightIcon:rightIcon,
            courseList:[]
        }
    },
    props:['dataInfo'],
    created(){
        if(this.dataInfo){
            if(this.dataInfo.style==1){
                this.courseList = this.dataInfo.ahprrList.slice(0,3);
            }else{
                this.courseList = this.dataInfo.ahprrList.slice(0,8);
            }
        }
    },
    watch:{},
    methods:{
        goList(obj){
            // let url = this.dataInfo.name.length>0?`/pages/courseList/index?type=4&name=${this.dataInfo.name}&targetId=${this.dataInfo.targetId}`:`/pages/courseList/index?type=4&targetId=${this.dataInfo.targetId}`;
            // uni.navigateTo({
            //     url: url
            // });
            var self = this;
            var name = '';
            if(self.dataInfo.ahprrList){
                name = self.dataInfo.ahprrList[0].classifyName;
            }
            uni.navigateTo({
                url: `/pages/classify/index?targetId=${self.dataInfo.targetId}&titleName=${name}`
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
    .class-course-box{
        padding: 0 30rpx;
		margin:30rpx 0;
        .topBefore:before{
                content:'';
                height: 56rpx;
                width: 56rpx;
                bottom: 6rpx;
                left: 16rpx;         
                border-radius: 50%;       
                display: block;   
                position: absolute;
                background: rgba(199, 13, 35, 0.2);
        }
        .top{
			display: flex;
			justify-content: space-between;
			align-items: center;
            margin-bottom: 32rpx;
            position: relative;
            &.reverse{
				flex-direction: row-reverse;
			}
			.name{
				display: block;
				font-size: 48rpx;
				line-height: 48rpx;
				// height: 48rpx;
				padding: 0 20rpx;
                font-weight: 700;
                color: #333;
                font-family: 'PingFangSC-Medium';
				// border-left:6rpx solid #C30D23;
			}
			.more{
				width: 32rpx;
                height: 32rpx;
        	}
        }
        .content{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .item{
                width: 216rpx;
                height: 314rpx;
                background: #fff;
                border-radius: 12rpx;
                overflow: hidden;
                box-shadow: 0px 0px 5px 3px #f4f4f4;
                margin-right: 22rpx;
                &:last-child{
                    margin-right: 0;
                }
                .t{
                    width: 100%;
                    height: 200rpx;
                    position: relative;
                    .positionImg{
                        position: absolute;
                        bottom: -36rpx;
                        right: 0rpx;                        
                        image{
                            width: 80rpx;
                            height: 80rpx;
                        }
                    }
                    .img{
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                    // .tag{
                    //     position: absolute;
                    //     top:0;
                    //     left: 0;
                    //     width: 52rpx;
                    //     height: 32rpx;
                    //     text-align: center;
                    //     line-height: 32rpx;
                    //     border-radius: 10rpx 0 10rpx 0;
                    //     color:#fff;
                    //     font-size: 20rpx;
                    //     opacity: 0.85;
                    //     &.type1{
                    //         background-image: linear-gradient(#E13F4F, #91171E);
                    //     }
                    //     &.type2{
                    //         background-image: linear-gradient(#FFB142, #FC561E);
                    //     }
                    // }
                }
                .b{
                    padding:14rpx 20rpx 20rpx;
                    // height: 128rpx;
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
                        font-weight: 700;
                        text-align: center;
                    }
                }
            }
        }
        .content1{
            overflow:auto;
            .item{
                width: 332rpx;
                height: 316rpx;
                background: #fff;
                border-radius: 12rpx;
                overflow: hidden;
                margin-bottom: 40rpx;
                position: relative;
                box-shadow: 0px 0px 5px 3px #f4f4f4;
                float: left;
                &:last-child{
                    margin-right: 0;
                }
                .t{
                    width: 100%;
                    height: 187.2rpx;
                    position: relative;
                    .positionImg{
                        position: absolute;
                        bottom: -36rpx;
                        right: 0rpx;                        
                        image{
                            width: 80rpx;
                            height: 80rpx;
                        }
                    }
                    .img{
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
                .b{
                    padding: 20rpx;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: space-between;
                    .title{
                        font-size: 28rpx;
                        color:#333333;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-weight: 700;
                        text-align: left;
                        font-family: 'PingFangSC-Medium';
                    }
                    .d{
                        position: absolute;
                        bottom: 10rpx;
                        display: flex;
                        justify-content:flex-start;
                        align-items: center;
                        flex-direction: row;
                        color:#666666;
                        font-size: 24rpx;
                        width: 90%;
                        .period-num{
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                        image{
                            margin-right: 10rpx;
                            width: 30rpx;
                            height: 30rpx;
                        }
                    }
                }
            }
        }        
    }
</style>
<style>
.rightCss{
    margin-left: 26rpx;
}
</style>