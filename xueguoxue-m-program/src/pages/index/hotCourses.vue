<template>
	<view class="hot-courses-container" :class="{'style1':dataInfo.style==1}">
        <view class="top" :class="dataInfo.name.length==0?'reverse':''">
            <text class="name" v-if="dataInfo.name.length>0">{{dataInfo.name}}</text>
			<view class="rigthView" @tap="goPage">
				<text class="more">更多</text>
				<img class='imgs' :src='allRight'/>
			</view>
        </view>
		<block v-if="dataInfo.style==1">
			<view class="box1">
				<block v-for="(item,index) in dataInfo.ahprrList" :key="index">
					<view class="item">
						<CourseItem1 :courseData="item"/>
					</view>
				</block>
			</view>
		</block>
		<view v-if="dataInfo.style==2" class="more-box">
            <block v-for="(option,i) in dataInfo.ahprrList" :key="i">
                <view class="box2">
                    <view class="option">
                        <CourseItem2 :courseData="option"/>
                    </view>
                </view>
            </block>
        </view>
		<block v-if="dataInfo.style==3">
			<view class="box3">
				<block v-for="(item,index) in dataInfo.ahprrList" :key="index">
					<view class="item" @tap="goCourse(item)">
						<image class="avatar" :src="item.lectureTeacherList[0].avatar" webp lazy-load></image>
						<!-- <view class="avatar" :style="{background:`url(${item.lectureTeacherList[0].avatar}) 50% 50%/cover`}"></view> -->
						<view class="title">{{item.title}}</view>
					</view>
				</block>
			</view>
		</block>
	</view>
</template>  

<script>
	import CourseItem1 from '../../wxcomponents/CourseItem1.vue'
	import CourseItem2 from '../../wxcomponents/CourseItem2.vue'
	import allRight from '../../static/allRight.png'
	export default {
		data() {
			return {
				allRight:allRight
			}
		},
		props:['dataInfo'],
		created(){

		},
		mounted(){

		},
		components:{
			CourseItem1,CourseItem2
		},
		computed:{
			
		},
		methods: {
			goPage(){
				let url = this.dataInfo.name.length>0?`/pages/courseList/index?type=3&name=${this.dataInfo.name}`:`/pages/courseList/index?type=3`;
				uni.navigateTo({
                    url:url
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

<style lang="scss">
	.hot-courses-container{
		padding: 0 30rpx;
		margin-top: 50rpx;
		&.style1{
			padding: 0;
			.top{
				margin-bottom: 30rpx;
				padding: 0 30rpx;
			}
			.box1{
				padding: 0 30rpx;
				background: #fff;
				.item{
					border-bottom:1px solid #f2f2f2;
					padding: 30rpx 0;
					&:last-child{
						border-bottom:none;
					}
				}
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
        .box1{
			.item{
				background: #fff;
				border-bottom:1px solid #f2f2f2;
				&:last-child{
					border-bottom:none;
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
				margin-top:26rpx;
				.option{
					width: 332rpx;
				}
			}
        }
		.box3{
			background: #fff;
			border-radius: 12rpx;
			padding: 0 30rpx;
			margin-top:20rpx;
			.item{
				display: flex;
				align-items: center;
				height: 156rpx;
				border-bottom: 1px solid #F2F2F2;
				&:last-child{
					border-bottom: none;
				}
				.avatar{
					height: 96rpx;
					width: 96rpx;
					border-radius: 50%;
					margin-right: 24rpx;
				}
				.title{
					color:#333333;
					font-size: 30rpx;
					font-family: 'PingFangSC-Medium';
				}
			}
		}
    }
</style>
