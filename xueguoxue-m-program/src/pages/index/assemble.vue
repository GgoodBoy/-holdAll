<template>
    <view class="assemble-zone-container style1">
        <view class="top" :class="dataInfo.name.length==0?'reverse':''">
            <text class="name" v-if="dataInfo.name.length>0">{{dataInfo.name}}</text>
			<view class="rigthView" @tap="goPage">
				<text class="more">更多</text>
				<img class="imgs" :src='allRight'/>
			</view>
        </view>           
		<block v-if="dataInfo.style==1">
			<view class="box1">
				<block v-for="(item,index) in dataInfo.ahprrList" :key="index">
					<view class="item" @tap="goCourse(item)">
                        <image class="course-surface" :src="item.imgUrl" webp lazy-load></image>
                        <view class="info">
                            <view class="info_title">{{item.title}}</view>
                            <view class="info_moneys">
                                <view class="moneys_1">拼团价:{{item.assemblePrice||0}}币</view>
                                <view class="moneys_2">拼团</view>
                            </view>
                        </view>
					</view>
				</block>
			</view>
		</block>
	</view>
</template>  

<script>
	import CourseItem1 from '../../wxcomponents/CourseItem1.vue'
    import CourseItem2 from '../../wxcomponents/CourseItem2.vue'
    import rightIcon from '../../static/investMoney/icon-1.png';
	import allRight from '../../static/allRight.png'
	export default {
		data() {
			return {
				rightIcon:rightIcon,
				allRight:allRight,
				name:'拼团专区'
			}
		},
		props:['dataInfo'],
		created(){},
		mounted(){},
		components:{
			CourseItem1,CourseItem2
		},
		computed:{},
		methods: {
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
			},
			goPage(){
				let url = this.dataInfo.name.length>0?`/pages/assembleList/index?type=1&name=${this.dataInfo.name}&tgId=${this.dataInfo.targetId}`:`/pages/assembleList/index?type=1&tgId=${this.dataInfo.targetId}`;
				uni.navigateTo({
                    url: url
                });
			}
		}
	}
</script>

<style lang="scss">
	.assemble-zone-container{
		padding: 0 30rpx;
		margin-top: 50rpx;
		&.style1{
			padding:0;
			.top{
				margin-bottom: 30rpx;
				padding: 0 30rpx;
			}
		}
        .top{
			display: flex;
			justify-content: space-between;
			align-items: center;
			&.reverse{
				flex-direction: row-reverse;
			}
			.name{
				display: block;
				font-size: 36rpx;
				line-height: 32rpx;
				padding: 0 20rpx;
				border-left:6rpx solid #C30D23;
                font-family: 'PingFangSC-Medium';
				height: 36rpx;
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
        .box1{
			background: #fff;
			padding: 0 30rpx;
			.item{
				padding:30rpx 0;
				background: #fff;
				border-bottom:1px solid #f2f2f2;
                display: flex;
				&:last-child{
					border-bottom:none;
				}
                .course-surface{
                    width: 306rpx;
                    height: 172rpx;
                    border-radius: 12rpx 0 0 12rpx;                  
                }
                .info{
                    flex: 1;
                    overflow: hidden;
                    margin-left: 20rpx;
                    position: relative;
                    background: #fff;
                    .info_title{
                        font-size: 30rpx;
                        font-weight: 500;
                        display: -webkit-box;
                        -webkit-line-clamp:2;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;                        
                    };
                    .info_moneys{
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;   
                        position: absolute;
                        width: 100%;
                        bottom: 0;
                        .moneys_1{
                            font-size: 24rpx;
                            color: #999;
                        }   
                        .moneys_2{
                            width: 78rpx;
                            height: 40rpx;
                            text-align: center;
                            background: #C30D20;
                            border-radius: 40rpx;
                            color: #fff;
                            line-height: 40rpx;
                            font-size: 22rpx;
                        }                     
                    }
                }
			}
		}
		.more-box{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
			.box2{
				position: relative;
				border-radius: 10rpx;
				overflow: hidden;
				width: 332rpx;
				background: #fff;
				margin-top:20rpx;
				.option{
					width: 332rpx;
				}
			}
        }
    }
</style>
